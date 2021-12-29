// import * as chalk from 'chalk';
import { Answers } from 'inquirer';
import { Input } from '../commands';
import * as fs from 'fs';
import * as path from 'path';
import { engine as ENGINE } from '../config/engine';
import { MESSAGES } from '../lib/ui';
import { AbstractAction } from './abstract.action';

export class ConfigAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]) {
    await configFiles(inputs.concat(options));
  }
}

const configFiles = async (inputs: Input[]) => {
  const schematic = inputs.find((option) => option.name === 'schematic')!
    .value as string;
  const distName = inputs.find((option) => option.name === 'dist-name')!
    .value as string;
  if (schematic === 'generate') {
    if (distName) {
      const dirPath = path.join(process.cwd(), distName);
      if (!fs.existsSync(dirPath)) {
        fs.mkdir(dirPath, (err) => {
          if (err) {
            throw err;
          }
          fs.writeFile(
            path.join(dirPath, 'engine.json'),
            JSON.stringify(ENGINE, null, 2),
            (err) => {
              if (err) {
                throw err;
              }
              console.log('suc!');
            },
          );
        });
      }
    }
  }
  // console.log(inputs);
};
