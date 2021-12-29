// import chalk from 'chalk';
import { Command } from 'commander';
import { AbstractCommand } from './abstract.command';
import { Input } from './command.input';

export class GenerateCommand extends AbstractCommand {
  public load(program: Command) {
    program
      .command('generate <srt> [audio-name] [zm-name]')
      .description('上传音频至OSS并生成字幕')
      .alias('g')
      .action(async (schematic: string, audioName: string, zmName: string) => {
        const options: Input[] = [];
        const inputs: Input[] = [];
        inputs.push({ name: 'schematic', value: schematic });
        inputs.push({ name: 'audio-name', value: audioName });
        inputs.push({ name: 'zm-name', value: zmName });

        await this.action.handle(inputs, options);
      });
  }
}
