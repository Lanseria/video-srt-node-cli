import { writeFile } from 'fs';
import path = require('path');

export const writeJson = (data: any, key = 'data', dirName = 'config') => {
  writeFile(
    path.join(process.cwd(), dirName, `${key}.json`),
    JSON.stringify(data, null, 2),
    {},
    (err) => {
      if (err) {
        console.log(err);
      }
    },
  );
};
