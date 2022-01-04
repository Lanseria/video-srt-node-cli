// import chalk from 'chalk';
// import { Answers } from 'inquirer';
import { Input } from '../commands';
// import { exec } from 'child_process';
// import * as fs from 'fs';
// import * as path from 'path';
// import { MESSAGES } from '../lib/ui';
import { AbstractAction } from './abstract.action';
import { Ffmpeg } from '../lib/ffmpeg';

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
    .value as string | undefined;
  if (schematic === 'aac') {
    const ffmpeg = new Ffmpeg();
    ffmpeg.extractVideoAudio(videoName, audioName);
  }
};
