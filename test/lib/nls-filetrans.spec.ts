import * as path from 'path';
import {
  NlsFiletrans,
  NlsFiletransResponseVO,
  SentencesVOE,
  WordsVO,
} from '../../lib/nls-filetrans/index';

import { OssClient } from '../../lib/oss/index';

describe('nls-filetrans 模块测试', () => {
  let ossClient: OssClient;
  let nlsFiletrans: NlsFiletrans;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const demoData: NlsFiletransResponseVO = require(path.join(
    process.cwd(),
    // TODO: 你可以配置为 config 设置为自己的 demo 数据
    'test',
    'demo.json',
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

  it.skip('通过阿里NLS识别上传录音并识别返回数据', async () => {
    console.log('srt 字幕生成: ');
    console.log('上传 Audio 文件...');
    const fileRes = await ossClient.uploadAudioToCloud(
      path.join(process.cwd(), 'test.mp3'),
    );
    console.log(`上传文件成功 ${fileRes.name} (${fileRes.url}), 识别中 ...`);
    await nlsFiletrans.fileTransData(fileRes.name);
  });

  it.skip('构建正确的词语', async () => {
    nlsFiletrans.buildWord(demoData.Result.Words);
  });
  it.skip('构建正确的短句', async () => {
    nlsFiletrans.buildParagraph(demoData.Result.Sentences);
  });
  it.skip('使用分块找到最后的单词', async () => {
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
    nlsFiletrans.useBlockFindLastWord(onePgData[0], oneWdData);
  });
  it('分割长句并生成 SRT 文件', async () => {
    await nlsFiletrans.jsonBuild(demoData);
  });
});
