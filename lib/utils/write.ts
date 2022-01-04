import { promises as fs } from 'fs';
import path = require('path');

export const writeJson = async (
  data: any,
  key = 'data',
  dirName = 'config',
) => {
  await fs.writeFile(
    path.join(process.cwd(), dirName, `${key}.json`),
    JSON.stringify(data, null, 2),
    {},
  );
};

export const writeSrt = async (
  data: string,
  key = 'data',
  dirName = 'config',
) => {
  await fs.writeFile(path.join(process.cwd(), dirName, `${key}.srt`), data, {});
};
