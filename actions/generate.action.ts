// import chalk from 'chalk';
// import { Answers } from 'inquirer';
import { Input } from '../commands';
import { OssClient } from '../lib/oss';

// import { MESSAGES } from '../lib/ui';
import { AbstractAction } from './abstract.action';
import * as path from 'path';
import { NlsFiletrans } from '../lib/nls-filetrans';
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

  const ossClient = new OssClient(
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require(path.join(process.cwd(), 'config', 'oss.json')),
  );
  const nlsFiletrans = new NlsFiletrans({
    ...require(path.join(process.cwd(), 'config', 'oss.json')),
    ...require(path.join(process.cwd(), 'config', 'engine.json')),
  });
  if (schematic === 'srt') {
    console.log('srt 字幕生成: ');
    console.log('上传 Audio 文件...');

    const fileRes = await ossClient.uploadAudioToCloud(
      path.join(process.cwd(), audioName),
    );

    console.log(`上传文件成功(${fileRes.url}), 识别中 ...`);

    nlsFiletrans.fileTrans(fileRes.url);
  }
};
