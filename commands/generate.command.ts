// import chalk from 'chalk';
import { Command } from 'commander';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class GenerateCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .option('--no-sauce', 'Remove sauce')
      .option('--cheese <flavour>', 'cheese flavour', 'mozzarella')
      .option('--no-cheese', 'plain with no cheese')
      .parse();
  }
}
