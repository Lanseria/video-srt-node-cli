// import chalk from 'chalk';
// import { Answers } from 'inquirer';
import { Input } from '../commands';
import { OssClient } from '../lib/oss';

// import { MESSAGES } from '../lib/ui';
import { AbstractAction } from './abstract.action';
import * as path from 'path';
import { NlsFiletrans } from '../lib/nls-filetrans';
import { CosClient } from '../lib/cos';
import { utilCwdPath } from '../lib/utils/path';
import { RecClient } from '../lib/rec';
import { writeJson, writeSrt } from '../lib/utils/write';
import { Subtitles } from '../lib/subtitles';
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
  if (schematic === 'ali') {
    console.log('srt 字幕生成: ');
    console.log('上传 Audio 文件...');
    const fileRes = await ossClient.uploadAudioToCloud(utilCwdPath(audioName));
    console.log(`上传文件成功(${fileRes.url}), 识别中 ...`);
    const response = await nlsFiletrans.fileTransData(fileRes.url);
    TODO: nlsFiletrans.jsonBuild(response);
  }
  if (schematic === 'ten') {
    const cosClient = new CosClient();
    const recClient = new RecClient();
    const filePath = utilCwdPath(audioName);
    const uploadRes = await cosClient.uploadFile(filePath);
    if (!uploadRes.statusCode) {
      console.log('上传 COS 对象成功');
    }
    const getRes = await cosClient.getObjectUrl(audioName);
    const deleteRes = await cosClient.deleteObject(audioName);
    if (!deleteRes.statusCode) {
      console.log('删除 COS 对象成功');
    }
    const taskStatusResult = await recClient.getDescResultData(getRes.Url);
    await writeJson(taskStatusResult, 'descResult');
    const subtitles = new Subtitles('config/descResult.json');
    const sliceData = subtitles.buildSliceData();
    await writeJson(sliceData, 'sliceData');
    const buildFile = subtitles.buildFile();
    await writeSrt(buildFile, 'buildFile');
  }
};
