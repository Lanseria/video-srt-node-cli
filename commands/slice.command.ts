// import chalk from 'chalk';
import { Command } from 'commander';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class SliceCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('slice <schematic> [video-name] [audio-name]')
      .description('分离音视频')
      .alias('s')
      .action(
        async (schematic: string, videoName: string, audioName: string) => {
          const options: Input[] = [];
          const inputs: Input[] = [];
          inputs.push({ name: 'schematic', value: schematic });
          inputs.push({ name: 'video-name', value: videoName });
          inputs.push({ name: 'audio-name', value: audioName });

          await this.action.handle(inputs, options);
        },
      );
  }
}
