// index.ts
import { Command } from 'commander';
import { CommandLoader } from '../commands/';
import {
  loadLocalBinCommandLoader,
  localBinExists,
} from '../lib/utils/local-binaries';

const bootstrap = () => {
  const program = new Command();

  program
    .version(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../package.json').version,
      '-v, --version',
      'Output the current version.',
    )
    .usage('<command> [options]')
    .helpOption('-h, --help', 'Output usage information.');

  // program
  //   .option('-s, --src <src-path>', 'video source')
  //   .option('-o, --out <output-path>', 'video output');

  // program.parse(process.argv);

  // const options = program.opts();
  // if (options.src) console.log(`source from ${options.src}`);
  // if (options.out) {
  //   console.log(`output to ${options.out}`);
  // } else {
  // }

  if (localBinExists()) {
    console.log('bin script!');
    const localCommandLoader = loadLocalBinCommandLoader();
    localCommandLoader.load(program);
  } else {
    console.log('no bin script!');
    CommandLoader.load(program);
  }
  program.parse(process.argv);

  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
};

bootstrap();
