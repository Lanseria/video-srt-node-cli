// import chalk from 'chalk';
import { Answers } from 'inquirer';
import { Input } from '../commands';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { MESSAGES } from '../lib/ui';
import { AbstractAction } from './abstract.action';

export class SliceAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]) {
    await sliceFiles(inputs.concat(options));
  }
}

const sliceFiles = async (inputs: Input[]) => {
  const schematic = inputs.find((option) => option.name === 'schematic')!
    .value as string;
  const videoName = inputs.find((option) => option.name === 'video-name')!
    .value as string;
  const audioName = inputs.find((option) => option.name === 'audio-name')!
    .value as string;
  if (schematic === 'generate') {
    if (videoName) {
      const videoPath = path.join(process.cwd(), videoName);
      const filename = path.basename(videoPath);
      const ext = path.extname(filename);
      const fileN = filename.split(ext)[0];
      console.log(fileN);
      const tempAudioName = `${fileN}-${new Date().getTime() / 1000}.mp3`;
      exec(`ffmpeg -i ${videoPath} -ar 16000 ${audioName ?? tempAudioName}`);
    }
  }
};
