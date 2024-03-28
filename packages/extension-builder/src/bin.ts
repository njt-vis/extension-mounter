import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import { build, serve } from './utils';

const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), { encoding: 'utf8' })
);

program.name('Extension Builder').description(pkg.name).version(pkg.version);

program
  .command('build')
  .description('Build extension package for production.')
  .action(() => {
    process.env.NODE_ENV = 'production';
    build({});
  });

program
  .command('serve')
  .description('Start an extension server for develop.')
  .option('--preview', 'Load extension with production resources.')
  .action(() => {
    process.env.NODE_ENV = 'development';
    serve({});
  });

program
  .command('analyze')
  .description('Analyze extension composition.')
  .action(() => {
    process.env.NODE_ENV = 'production';
    build({
      analyze: true,
    });
  });

program
  .command('publish')
  .description('Publish extension to store.')
  .action(() => {});

program.parse();
