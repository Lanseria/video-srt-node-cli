// import chalk from 'chalk';
import { Command } from 'commander';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class ConfigCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('config <schematic> [dist-name]')
      .description('设置你的配置文件夹名称')
      .alias('c')
      .action(async (schematic: string, distName: string) => {
        const options: Input[] = [];
        // options.push({ name: 'dry-run', value: !!command.dryRun });
        // options.push({ name: 'flat', value: command.flat });

        const inputs: Input[] = [];
        inputs.push({ name: 'schematic', value: schematic });
        inputs.push({ name: 'dist-name', value: distName ?? 'config' });

        await this.action.handle(inputs, options);
      });
  }
}
