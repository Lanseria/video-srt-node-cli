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
