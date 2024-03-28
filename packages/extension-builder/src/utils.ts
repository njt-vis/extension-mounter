import { existsSync, readFileSync, writeFileSync } from 'fs';
import path, { resolve } from 'path';
import YAML from 'yaml';

// const SystemJSPublicPathWebpackPlugin = require('systemjs-webpack-interop/SystemJSPublicPathWebpackPlugin');
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {
  BUNDLE_DIR,
  BUNDLE_MANIFEST_NAME,
  ENTRY_FILE_NAME,
  MANIFEST_FILE_NAME,
  OUTPUT_FILE_NAME,
} from './constants';

const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { merge } = require('webpack-merge');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

interface ManifestModel {
  schema_version: string;
  libs?: Record<string, string>;
  locales: Record<string, Record<string, string>>;
  debug: {
    port: number;
  };
}

interface ManifestBundleModel {
  name: string;
  version: string;
  libs?: Record<string, string>;
  locales: Record<string, Record<string, string>>;
}

interface ConfigModel {
  analyze?: boolean;
}

export const getPkg = () => {
  return JSON.parse(
    readFileSync(resolve('package.json'), { encoding: 'utf8' })
  );
};

const formatManifest = (): ManifestModel => {
  const content = readFileSync(resolve(MANIFEST_FILE_NAME), {
    encoding: 'utf8',
  });
  const manifest = YAML.parse(content);

  return manifest;
};

const getBundleManifest = (manifest: ManifestModel): ManifestBundleModel => {
  const pkg = getPkg();

  return {
    name: pkg.name,
    version: pkg.version,
    libs: manifest.libs,
    locales: manifest.locales,
  };
};

const extractExternals = (
  { libs }: ManifestModel,
  analyze?: boolean
): Record<string, string> => {
  const externals: Record<string, string> = {};
  if (libs) {
    Object.entries(libs).forEach(([name, version]) => {
      Object.assign(externals, {
        [name]: analyze ? name : `${name}@${version}`,
      });
    });
  }
  return externals;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const formatWebpackConfig = (config: ConfigModel) => {
  const isProd = process.env.NODE_ENV === 'production';
  const manifest = formatManifest();

  const plugins = [
    new SimpleProgressWebpackPlugin(),
    new CompressionPlugin({
      threshold: 12800, // 对大于 128kb 的文件进行压缩
    }),
  ];
  if (config.analyze) {
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      })
    );
  }
  return {
    mode: process.env.NODE_ENV,
    entry: resolve('src', ENTRY_FILE_NAME),
    output: {
      publicPath: undefined,
      filename: OUTPUT_FILE_NAME,
      path: resolve(BUNDLE_DIR),
      libraryTarget: config.analyze ? undefined : 'system',
      clean: true,
    },
    optimization: {
      minimize: isProd,
    },
    devServer: {
      compress: false,
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers':
          'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild',
      },
      // static: {
      //   directory: path.resolve('public'),
      // },
    },
    devtool: !isProd ? 'inline-source-map' : undefined,
    plugins,
    performance: {
      maxEntrypointSize: 2000000,
      maxAssetSize: 2000000,
    },
    resolve: {
      extensions: ['.ts'],
    },
    externals: extractExternals(manifest, config.analyze),
    module: {
      rules: [
        {
          test: /\.(js|mjs)$/,
          loader: require.resolve('babel-loader'),
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            compact: false,
            sourceMap: !isProd,
          },
        },
        {
          test: /\.ts?$/,
          use: [require.resolve('babel-loader'), require.resolve('ts-loader')],
          parser: {
            system: false,
          },
          // options: {
          //   sourceMap: !isProd(config.mode),
          // },
        },
      ],
    },
  };
};

export const getCustomWebpackConfig = (): any => {
  const customConfigPath = resolve('webpack.config.merge.js');
  const config = {};
  if (existsSync(customConfigPath)) {
    const webpackConfigCustom = require(customConfigPath);
    Object.assign(config, webpackConfigCustom);
  }
  return config;
};

export function build(config: ConfigModel): Promise<string> {
  return new Promise((resolve, reject) => {
    const webpackConfig = merge(
      formatWebpackConfig(config),
      getCustomWebpackConfig()
    );

    const compiler = webpack(webpackConfig);

    compiler.run((error: any, stats: any) => {
      if (error) {
        // let errMessage = error.message;
        reject(error);
        return;
      }
      if (stats?.hasErrors()) {
        reject(stats?.toString({ all: false, warnings: false, errors: true }));
        return;
      }
      const manifest = getBundleManifest(formatManifest());
      // 导出 extension.manifest 文件
      writeFileSync(
        path.resolve(BUNDLE_DIR, BUNDLE_MANIFEST_NAME),
        JSON.stringify(manifest, null, 2),
        { encoding: 'utf8' }
      );
      resolve('complete');
    });
  });
}

export function serve(config: ConfigModel) {
  return new Promise((resolve, reject) => {
    const manifest = formatManifest();
    const webpackConfig = merge(
      formatWebpackConfig(config),
      getCustomWebpackConfig()
    );
    const compiler = webpack(webpackConfig);
    const port = manifest.debug.port;
    const server = new WebpackDevServer(
      { ...webpackConfig.devServer, port },
      compiler
    );

    try {
      // console.log('[DEMO ENGINE]', 'Starting server...');
      server.start();
      resolve('Start demo success');
    } catch (error) {
      reject(error);
    }
  });
}
