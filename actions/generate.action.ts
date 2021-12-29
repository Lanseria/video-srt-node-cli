// import chalk from 'chalk';
import { Answers } from 'inquirer';
import { Input } from '../commands';

import { MESSAGES } from '../lib/ui';
import { AbstractAction } from './abstract.action';

export class GenerateAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]) {
    await generateFiles(inputs.concat(options));
  }
}

const generateFiles = async (inputs: Input[]) => {
  const schematic = inputs.find((option) => option.name === 'schematic')!
    .value as string;
  const audioName = inputs.find((option) => option.name === 'audio-name')!
    .value as string;
  if (schematic === 'srt') {
    console.log('srt 字幕生成中');
  }
};
