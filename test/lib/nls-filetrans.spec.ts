import * as path from 'path';
import {
  NlsFiletrans,
  NlsFiletransResponseVO,
} from '../../lib/nls-filetrans/index';

describe('nls-filetrans', () => {
  let nlsFiletrans: NlsFiletrans;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const demoData: NlsFiletransResponseVO = require(path.join(
    process.cwd(),
    'config',
    'demo.json',
  ));
  beforeAll(() => {
    nlsFiletrans = new NlsFiletrans({
      ...require(path.join(process.cwd(), 'config', 'oss.json')),
      ...require(path.join(process.cwd(), 'config', 'engine.json')),
    });
  });
  it.skip('build right word', async () => {
    nlsFiletrans.buildWord(demoData.Result.Words);
  });
  it.skip('build right paragraph', async () => {
    nlsFiletrans.buildParagraph(demoData.Result.Sentences);
  });
  it.skip('use block find last word', async () => {
    const Blocks = [
      15, 20, 24, 29, 48, 51, 63, 74, 83, 97, 114, 127, 131, 142, 157, 173, 176,
      184, 207,
    ];
    const Text =
      '去年小米十一系列的slogan是相信美好轻装上阵整整一年后小米十二系列的宣传语变成了简单的三个字快更稳也许是在过去的一年里面啊由于火龙八八八的毒奶啊在快这件事情上面啊小米十一系列并没有发挥到极致那么这次全新的十二系列表现怎么样呢我们来一起看一看国际惯例啊先看外观这次十二系列有三款机型分别是我们手里面拿的十二pro更小尺寸的十二以及更青春一些的啊十二x十二跟十二pro的主要差距就是尺寸大小、屏幕参数、摄像头和快充';
    const thisWords = [
      {
        'Word': '小米',
        'EndTime': 19888,
        'BeginTime': 19514,
        'ChannelId': 0,
      },
      {
        'Word': '十',
        'EndTime': 20075,
        'BeginTime': 19888,
        'ChannelId': 0,
      },
      {
        'Word': '一系列',
        'EndTime': 20636,
        'BeginTime': 20075,
        'ChannelId': 0,
      },
      {
        'Word': '的',
        'EndTime': 20823,
        'BeginTime': 20636,
        'ChannelId': 0,
      },
      {
        'Word': 'slogan ',
        'EndTime': 21198,
        'BeginTime': 20823,
        'ChannelId': 0,
      },
      {
        'Word': '是',
        'EndTime': 21385,
        'BeginTime': 21198,
        'ChannelId': 0,
      },
      {
        'Word': '相信',
        'EndTime': 21759,
        'BeginTime': 21385,
        'ChannelId': 0,
      },
      {
        'Word': '美好',
        'EndTime': 22133,
        'BeginTime': 21759,
        'ChannelId': 0,
      },
      {
        'Word': '轻装上阵',
        'EndTime': 22882,
        'BeginTime': 22133,
        'ChannelId': 0,
      },
      {
        'Word': '整整',
        'EndTime': 23256,
        'BeginTime': 22882,
        'ChannelId': 0,
      },
      {
        'Word': '一年',
        'EndTime': 23630,
        'BeginTime': 23256,
        'ChannelId': 0,
      },
      {
        'Word': '后',
        'EndTime': 23817,
        'BeginTime': 23630,
        'ChannelId': 0,
      },
      {
        'Word': '小米',
        'EndTime': 24191,
        'BeginTime': 23817,
        'ChannelId': 0,
      },
      {
        'Word': '十二',
        'EndTime': 24566,
        'BeginTime': 24191,
        'ChannelId': 0,
      },
      {
        'Word': '系列',
        'EndTime': 24940,
        'BeginTime': 24566,
        'ChannelId': 0,
      },
      {
        'Word': '的',
        'EndTime': 25127,
        'BeginTime': 24940,
        'ChannelId': 0,
      },
      {
        'Word': '宣传语',
        'EndTime': 25688,
        'BeginTime': 25127,
        'ChannelId': 0,
      },
      {
        'Word': '变成',
        'EndTime': 26062,
        'BeginTime': 25688,
        'ChannelId': 0,
      },
      {
        'Word': '了',
        'EndTime': 26250,
        'BeginTime': 26062,
        'ChannelId': 0,
      },
      {
        'Word': '简单',
        'EndTime': 26624,
        'BeginTime': 26250,
        'ChannelId': 0,
      },
      {
        'Word': '的',
        'EndTime': 26811,
        'BeginTime': 26624,
        'ChannelId': 0,
      },
      {
        'Word': '三个',
        'EndTime': 27185,
        'BeginTime': 26811,
        'ChannelId': 0,
      },
      {
        'Word': '字',
        'EndTime': 27372,
        'BeginTime': 27185,
        'ChannelId': 0,
      },
      {
        'Word': '快',
        'EndTime': 27559,
        'BeginTime': 27372,
        'ChannelId': 0,
      },
      {
        'Word': '更',
        'EndTime': 27746,
        'BeginTime': 27559,
        'ChannelId': 0,
      },
      {
        'Word': '稳',
        'EndTime': 27934,
        'BeginTime': 27746,
        'ChannelId': 0,
      },
      {
        'Word': '也许',
        'EndTime': 28308,
        'BeginTime': 27934,
        'ChannelId': 0,
      },
      {
        'Word': '是',
        'EndTime': 28495,
        'BeginTime': 28308,
        'ChannelId': 0,
      },
      {
        'Word': '在',
        'EndTime': 28682,
        'BeginTime': 28495,
        'ChannelId': 0,
      },
      {
        'Word': '过去',
        'EndTime': 29056,
        'BeginTime': 28682,
        'ChannelId': 0,
      },
      {
        'Word': '的',
        'EndTime': 29243,
        'BeginTime': 29056,
        'ChannelId': 0,
      },
      {
        'Word': '一年',
        'EndTime': 29617,
        'BeginTime': 29243,
        'ChannelId': 0,
      },
      {
        'Word': '里面',
        'EndTime': 29992,
        'BeginTime': 29617,
        'ChannelId': 0,
      },
      {
        'Word': '啊',
        'EndTime': 30179,
        'BeginTime': 29992,
        'ChannelId': 0,
      },
      {
        'Word': '由于',
        'EndTime': 30553,
        'BeginTime': 30179,
        'ChannelId': 0,
      },
      {
        'Word': '火龙',
        'EndTime': 30927,
        'BeginTime': 30553,
        'ChannelId': 0,
      },
      {
        'Word': '八',
        'EndTime': 31114,
        'BeginTime': 30927,
        'ChannelId': 0,
      },
      {
        'Word': '八八',
        'EndTime': 31489,
        'BeginTime': 31114,
        'ChannelId': 0,
      },
      {
        'Word': '的',
        'EndTime': 31676,
        'BeginTime': 31489,
        'ChannelId': 0,
      },
      {
        'Word': '毒',
        'EndTime': 31863,
        'BeginTime': 31676,
        'ChannelId': 0,
      },
      {
        'Word': '奶',
        'EndTime': 32050,
        'BeginTime': 31863,
        'ChannelId': 0,
      },
      {
        'Word': '啊',
        'EndTime': 32237,
        'BeginTime': 32050,
        'ChannelId': 0,
      },
      {
        'Word': '在',
        'EndTime': 32424,
        'BeginTime': 32237,
        'ChannelId': 0,
      },
      {
        'Word': '快',
        'EndTime': 32611,
        'BeginTime': 32424,
        'ChannelId': 0,
      },
      {
        'Word': '这件',
        'EndTime': 32985,
        'BeginTime': 32611,
        'ChannelId': 0,
      },
      {
        'Word': '事情',
        'EndTime': 33360,
        'BeginTime': 32985,
        'ChannelId': 0,
      },
      {
        'Word': '上面',
        'EndTime': 33734,
        'BeginTime': 33360,
        'ChannelId': 0,
      },
      {
        'Word': '啊',
        'EndTime': 33921,
        'BeginTime': 33734,
        'ChannelId': 0,
      },
      {
        'Word': '小米',
        'EndTime': 34295,
        'BeginTime': 33921,
        'ChannelId': 0,
      },
      {
        'Word': '十一',
        'EndTime': 34669,
        'BeginTime': 34295,
        'ChannelId': 0,
      },
      {
        'Word': '系列',
        'EndTime': 35044,
        'BeginTime': 34669,
        'ChannelId': 0,
      },
      {
        'Word': '并',
        'EndTime': 35231,
        'BeginTime': 35044,
        'ChannelId': 0,
      },
      {
        'Word': '没有',
        'EndTime': 35605,
        'BeginTime': 35231,
        'ChannelId': 0,
      },
      {
        'Word': '发挥',
        'EndTime': 35979,
        'BeginTime': 35605,
        'ChannelId': 0,
      },
      {
        'Word': '到',
        'EndTime': 36166,
        'BeginTime': 35979,
        'ChannelId': 0,
      },
      {
        'Word': '极致',
        'EndTime': 36540,
        'BeginTime': 36166,
        'ChannelId': 0,
      },
      {
        'Word': '那么',
        'EndTime': 36915,
        'BeginTime': 36540,
        'ChannelId': 0,
      },
      {
        'Word': '这次',
        'EndTime': 37289,
        'BeginTime': 36915,
        'ChannelId': 0,
      },
      {
        'Word': '全新',
        'EndTime': 37663,
        'BeginTime': 37289,
        'ChannelId': 0,
      },
      {
        'Word': '的',
        'EndTime': 37850,
        'BeginTime': 37663,
        'ChannelId': 0,
      },
      {
        'Word': '十二',
        'EndTime': 38224,
        'BeginTime': 37850,
        'ChannelId': 0,
      },
      {
        'Word': '系列',
        'EndTime': 38599,
        'BeginTime': 38224,
        'ChannelId': 0,
      },
      {
        'Word': '表现',
        'EndTime': 38973,
        'BeginTime': 38599,
        'ChannelId': 0,
      },
      {
        'Word': '怎么样',
        'EndTime': 39534,
        'BeginTime': 38973,
        'ChannelId': 0,
      },
      {
        'Word': '呢',
        'EndTime': 39721,
        'BeginTime': 39534,
        'ChannelId': 0,
      },
      {
        'Word': '我们',
        'EndTime': 40095,
        'BeginTime': 39721,
        'ChannelId': 0,
      },
      {
        'Word': '来',
        'EndTime': 40283,
        'BeginTime': 40095,
        'ChannelId': 0,
      },
      {
        'Word': '一起',
        'EndTime': 40657,
        'BeginTime': 40283,
        'ChannelId': 0,
      },
      {
        'Word': '看一看',
        'EndTime': 41218,
        'BeginTime': 40657,
        'ChannelId': 0,
      },
      {
        'Word': '国际惯例',
        'EndTime': 41967,
        'BeginTime': 41218,
        'ChannelId': 0,
      },
      {
        'Word': '啊',
        'EndTime': 42154,
        'BeginTime': 41967,
        'ChannelId': 0,
      },
      {
        'Word': '先',
        'EndTime': 42341,
        'BeginTime': 42154,
        'ChannelId': 0,
      },
      {
        'Word': '看',
        'EndTime': 42528,
        'BeginTime': 42341,
        'ChannelId': 0,
      },
      {
        'Word': '外观',
        'EndTime': 42902,
        'BeginTime': 42528,
        'ChannelId': 0,
      },
      {
        'Word': '这次',
        'EndTime': 43276,
        'BeginTime': 42902,
        'ChannelId': 0,
      },
      {
        'Word': '十二',
        'EndTime': 43650,
        'BeginTime': 43276,
        'ChannelId': 0,
      },
      {
        'Word': '系列',
        'EndTime': 44025,
        'BeginTime': 43650,
        'ChannelId': 0,
      },
      {
        'Word': '有',
        'EndTime': 44212,
        'BeginTime': 44025,
        'ChannelId': 0,
      },
      {
        'Word': '三',
        'EndTime': 44399,
        'BeginTime': 44212,
        'ChannelId': 0,
      },
      {
        'Word': '款',
        'EndTime': 44586,
        'BeginTime': 44399,
        'ChannelId': 0,
      },
      {
        'Word': '机型',
        'EndTime': 44960,
        'BeginTime': 44586,
        'ChannelId': 0,
      },
      {
        'Word': '分别',
        'EndTime': 45334,
        'BeginTime': 44960,
        'ChannelId': 0,
      },
      {
        'Word': '是',
        'EndTime': 45522,
        'BeginTime': 45334,
        'ChannelId': 0,
      },
      {
        'Word': '我们',
        'EndTime': 45896,
        'BeginTime': 45522,
        'ChannelId': 0,
      },
      {
        'Word': '手',
        'EndTime': 46083,
        'BeginTime': 45896,
        'ChannelId': 0,
      },
      {
        'Word': '里面',
        'EndTime': 46457,
        'BeginTime': 46083,
        'ChannelId': 0,
      },
      {
        'Word': '拿',
        'EndTime': 46644,
        'BeginTime': 46457,
        'ChannelId': 0,
      },
      {
        'Word': '的',
        'EndTime': 46831,
        'BeginTime': 46644,
        'ChannelId': 0,
      },
      {
        'Word': '十二',
        'EndTime': 47205,
        'BeginTime': 46831,
        'ChannelId': 0,
      },
      {
        'Word': 'pro ',
        'EndTime': 47393,
        'BeginTime': 47205,
        'ChannelId': 0,
      },
      {
        'Word': '更',
        'EndTime': 47580,
        'BeginTime': 47393,
        'ChannelId': 0,
      },
      {
        'Word': '小',
        'EndTime': 47767,
        'BeginTime': 47580,
        'ChannelId': 0,
      },
      {
        'Word': '尺寸',
        'EndTime': 48141,
        'BeginTime': 47767,
        'ChannelId': 0,
      },
      {
        'Word': '的',
        'EndTime': 48328,
        'BeginTime': 48141,
        'ChannelId': 0,
      },
      {
        'Word': '十二',
        'EndTime': 48702,
        'BeginTime': 48328,
        'ChannelId': 0,
      },
      {
        'Word': '以及',
        'EndTime': 49077,
        'BeginTime': 48702,
        'ChannelId': 0,
      },
      {
        'Word': '更',
        'EndTime': 49264,
        'BeginTime': 49077,
        'ChannelId': 0,
      },
      {
        'Word': '青春',
        'EndTime': 49638,
        'BeginTime': 49264,
        'ChannelId': 0,
      },
      {
        'Word': '一些',
        'EndTime': 50012,
        'BeginTime': 49638,
        'ChannelId': 0,
      },
      {
        'Word': '的',
        'EndTime': 50199,
        'BeginTime': 50012,
        'ChannelId': 0,
      },
      {
        'Word': '啊',
        'EndTime': 50386,
        'BeginTime': 50199,
        'ChannelId': 0,
      },
      {
        'Word': '十二',
        'EndTime': 50761,
        'BeginTime': 50386,
        'ChannelId': 0,
      },
      {
        'Word': 'x ',
        'EndTime': 50948,
        'BeginTime': 50761,
        'ChannelId': 0,
      },
      {
        'Word': '十二',
        'EndTime': 51322,
        'BeginTime': 50948,
        'ChannelId': 0,
      },
      {
        'Word': '跟',
        'EndTime': 51509,
        'BeginTime': 51322,
        'ChannelId': 0,
      },
      {
        'Word': '十二',
        'EndTime': 51883,
        'BeginTime': 51509,
        'ChannelId': 0,
      },
      {
        'Word': 'pro ',
        'EndTime': 52070,
        'BeginTime': 51883,
        'ChannelId': 0,
      },
      {
        'Word': '的',
        'EndTime': 52257,
        'BeginTime': 52070,
        'ChannelId': 0,
      },
      {
        'Word': '主要',
        'EndTime': 52632,
        'BeginTime': 52257,
        'ChannelId': 0,
      },
      {
        'Word': '差距',
        'EndTime': 53006,
        'BeginTime': 52632,
        'ChannelId': 0,
      },
      {
        'Word': '就是',
        'EndTime': 53380,
        'BeginTime': 53006,
        'ChannelId': 0,
      },
      {
        'Word': '尺寸',
        'EndTime': 53754,
        'BeginTime': 53380,
        'ChannelId': 0,
      },
      {
        'Word': '大小',
        'EndTime': 54128,
        'BeginTime': 53754,
        'ChannelId': 0,
      },
      {
        'Word': '屏幕',
        'EndTime': 54503,
        'BeginTime': 54128,
        'ChannelId': 0,
      },
      {
        'Word': '参数',
        'EndTime': 54877,
        'BeginTime': 54503,
        'ChannelId': 0,
      },
      {
        'Word': '摄像头',
        'EndTime': 55438,
        'BeginTime': 54877,
        'ChannelId': 0,
      },
      {
        'Word': '和',
        'EndTime': 55625,
        'BeginTime': 55438,
        'ChannelId': 0,
      },
      {
        'Word': '快',
        'EndTime': 55812,
        'BeginTime': 55625,
        'ChannelId': 0,
      },
      {
        'Word': '充',
        'EndTime': 56000,
        'BeginTime': 55812,
        'ChannelId': 0,
      },
    ];
    nlsFiletrans.useBlockFindLastWord(Blocks, Text, thisWords);
  });
  it('slice srt', async () => {
    await nlsFiletrans.jsonBeauty(demoData);
  });
});
