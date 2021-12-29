import * as chalk from 'chalk';
import { Command } from 'commander';
import { ConfigAction, SliceAction, GenerateAction } from '../actions';
import { ERROR_PREFIX } from '../lib/ui';
import { ConfigCommand } from './config.command';
import { SliceCommand } from './slice.command';
import { GenerateCommand } from './generate.command';
export class CommandLoader {
  public static load(program: Command): void {
    new ConfigCommand(new ConfigAction()).load(program);
    new SliceCommand(new SliceAction()).load(program);
    new GenerateCommand(new GenerateAction()).load(program);

    this.handleInvalidCommand(program);
  }

  private static handleInvalidCommand(program: Command) {
    program.on('command:*', () => {
      console.error(
        `\n${ERROR_PREFIX} Invalid command: ${chalk.red('%s')}`,
        program.args.join(' '),
      );
      console.log(
        `See ${chalk.red('--help')} for a list of available commands.\n`,
      );
      process.exit(1);
    });
  }
}
