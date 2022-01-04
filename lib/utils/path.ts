import * as path from 'path';

export const utilCwdPath = (cwdPath: string) => {
  return path.join(process.cwd(), cwdPath);
};
