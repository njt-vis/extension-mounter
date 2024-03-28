const { resolve } = require('path');

module.exports = {
  entry: resolve('src/main.tsx'),
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript',
              ['@babel/preset-react', { runtime: 'automatic' }],
            ],
            plugins: [
              '@babel/plugin-transform-class-properties',
              '@babel/plugin-transform-object-rest-spread',
              '@babel/plugin-transform-private-methods',
              '@babel/plugin-transform-private-property-in-object',
              '@babel/plugin-syntax-dynamic-import',
            ],
          },
        },
      },
    ],
  },
};
