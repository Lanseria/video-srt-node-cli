// import * as chalk from 'chalk';
import { Input } from '../commands';
import * as fs from 'fs';
import * as path from 'path';
import { engine as ENGINE } from '../lib/config/engine';
import { filter as FILTER } from '../lib/config/filter';
import { oss as OSS } from '../lib/config/oss';
import { tencent as TENCENT } from '../lib/config/tencent';
import { AbstractAction } from './abstract.action';

export class ConfigAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]) {
    await configFiles(inputs.concat(options));
  }
}

const writeConfigFiles = (data: object, filePath: string, dirPath: string) => {
  fs.writeFile(
    path.join(dirPath, filePath),
    JSON.stringify(data, null, 2),
    (err) => {
      if (err) {
        throw err;
      }
      console.log(`${filePath} success!`);
    },
  );
};

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
        });
      }
      writeConfigFiles(ENGINE, 'engine.json', dirPath);
      writeConfigFiles(FILTER, 'filter.json', dirPath);
      writeConfigFiles(OSS, 'oss.json', dirPath);
      writeConfigFiles(TENCENT, 'tencent.json', dirPath);
    }
  }
  // console.log(inputs);
};
