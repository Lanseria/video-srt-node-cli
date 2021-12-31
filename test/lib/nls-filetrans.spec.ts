import * as path from 'path';
import {
  NlsFiletrans,
  NlsFiletransResponseVO,
  SentencesVOE,
  WordsVO,
} from '../../lib/nls-filetrans/index';

import { OssClient } from '../../lib/oss/index';

describe('nls-filetrans', () => {
  let ossClient: OssClient;
  let nlsFiletrans: NlsFiletrans;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const demoData: NlsFiletransResponseVO = require(path.join(
    process.cwd(),
    'config',
    'demo.json',
  ));
  const onePgData: SentencesVOE[] = require(path.join(
    process.cwd(),
    'config',
    'paragraphListE-0.json',
  ));
  const oneWdData: WordsVO[] = require(path.join(
    process.cwd(),
    'config',
    'wordList-0.json',
  ));
  beforeAll(() => {
    nlsFiletrans = new NlsFiletrans({
      ...require(path.join(process.cwd(), 'config', 'oss.json')),
      ...require(path.join(process.cwd(), 'config', 'engine.json')),
    });
    ossClient = new OssClient(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require(path.join(process.cwd(), 'config', 'oss.json')),
    );
    // 设置轨道数量
    nlsFiletrans.channelCount = 2;
  });
  it.skip('build right word', async () => {
    nlsFiletrans.buildWord(demoData.Result.Words);
  });
  it.skip('build right paragraph', async () => {
    nlsFiletrans.buildParagraph(demoData.Result.Sentences);
  });
  it.skip('use block find last word', async () => {
    nlsFiletrans.useBlockFindLastWord(onePgData[0], oneWdData);
  });
  it('slice srt', async () => {
    await nlsFiletrans.jsonBuild(demoData);
  });

  it.skip('nls get data', async () => {
    console.log('srt 字幕生成: ');
    console.log('上传 Audio 文件...');
    const fileRes = await ossClient.uploadAudioToCloud(
      path.join(process.cwd(), 'demo-1640841782.mp3'),
    );
    console.log(`上传文件成功(${fileRes.url}), 识别中 ...`);
    await nlsFiletrans.fileTransData(fileRes.name);
  });
});
