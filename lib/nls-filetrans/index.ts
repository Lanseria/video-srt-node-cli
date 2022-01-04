'use strict';
import { writeFileSync } from 'fs';
import { Dictionary, groupBy } from 'lodash';
import path = require('path');
import {
  compleSpace,
  findSliceIntCount,
  getRealLength,
  getTextBlock,
  getTextBlocks,
  isChineseWords,
  makeSubtitleText,
  replaceStrs,
} from '../utils/str';
import { writeJson } from '../utils/write';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tunnel = require('tunnel-agent');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Client = require('@alicloud/nls-filetrans-2018-08-17');
interface NlsFiletransOptVO {
  accessKeyId: string;
  accessKeySecret: string;
  appkey: string;
}
interface ResultVO {
  Text: string;
  ChannelId: number;
  BeginTime: number;
  EndTime: number;
  SilenceDuration: number;
  SpeechRate: number;
  EmotionValue: number;
}
interface SentencesVO {
  EndTime: number;
  'SilenceDuration': number;
  'BeginTime': number;
  'Text': string;
  'ChannelId': number;
  'SpeechRate': number;
  'EmotionValue': number;
}
export interface SentencesVOE extends SentencesVO {
  Blocks: number[];
  TextBlocks: string[];
  BlockEmptyTag: boolean;
  BlockEmptyHandle: boolean;
}

class SentencesE implements SentencesVOE {
  constructor(obj: any) {
    if (obj) {
      Object.assign(this, obj);
    }
  }
  Blocks: number[] = [];
  TextBlocks: string[] = [];
  BlockEmptyTag = false;
  BlockEmptyHandle = false;
  'EndTime': number;
  'SilenceDuration': number;
  'BeginTime': number;
  'Text': string;
  'ChannelId': number;
  'SpeechRate': number;
  'EmotionValue': number;
}

export interface WordsVO {
  Word: string;
  ChannelId: number;
  BeginTime: number;
  EndTime: number;
}
interface NlsFiletransResultVO {
  Sentences: SentencesVO[];
  Words: WordsVO[];
}
export interface NlsFiletransResponseVO {
  'TaskId': string;
  'RequestId': string;
  'StatusText': string;
  'BizDuration': number;
  'SolveTime': number;
  'StatusCode': number;
  Result: NlsFiletransResultVO;
}

export class NlsFiletrans {
  private client;
  private appkey;
  public channelCount;
  private paragraphDict: Dictionary<SentencesVOE[]> = {};
  private wordDict: Dictionary<WordsVO[]> = {};
  private vResultListMap;
  constructor(opt: NlsFiletransOptVO) {
    this.client = new Client({
      accessKeyId: opt.accessKeyId,
      accessKeySecret: opt.accessKeySecret,
      endpoint: `http://filetrans.cn-shanghai.aliyuncs.com`,
      apiVersion: '2018-08-17',
    });
    this.appkey = opt.appkey;
    this.channelCount = 2;
    this.vResultListMap = new Map<number, ResultVO[]>();
  }
  /**
   * 填充最终结果
   * @param obj
   * @returns
   */
  fillResult(obj: any) {
    const vResult: ResultVO = {
      Text: obj.Text,
      ChannelId: obj.ChannelId,
      BeginTime: obj.BeginTime,
      EndTime: obj.EndTime,
      SilenceDuration: obj.SilenceDuration,
      SpeechRate: obj.SpeechRate,
      EmotionValue: obj.EmotionValue,
    };
    if (this.vResultListMap.has(obj.ChannelId)) {
      const vResultList = this.vResultListMap.get(obj.ChannelId as number)!;
      vResultList.push(vResult);
      this.vResultListMap.set(obj.ChannelId as number, vResultList);
    } else {
      this.vResultListMap.set(obj.ChannelId as number, [vResult]);
    }
  }
  /**
   * 分析句子中每个Block
   * @param Blocks
   * @param Text
   * @param thisBlockWords
   */
  useBlockFindLastWord(pg: SentencesVOE, thisBlockWords: WordsVO[]) {
    for (let i = 0; i < pg.Blocks.length; i++) {
      let w = undefined;
      let blockBeginTime = pg.BeginTime;
      let first = true;
      const text = pg.TextBlocks[i];
      while ((w = thisBlockWords.shift())) {
        if (first) {
          first = false;
          blockBeginTime = w.BeginTime;
        }
        if (text.endsWith(w.Word.trim())) {
          this.fillResult({
            Text: text,
            ChannelId: w.ChannelId,
            BeginTime: blockBeginTime,
            EndTime: w.EndTime,
            SilenceDuration: pg.SilenceDuration,
            SpeechRate: pg.SpeechRate,
            EmotionValue: pg.EmotionValue,
          });
          first = true;
          break;
        }
      }
    }
  }
  /**
   * 分析每个段落
   * @param pg
   * @param wordList
   * @returns
   */
  anylsisPg(pg: SentencesVOE, wordList: WordsVO[]) {
    if (pg.BlockEmptyTag) {
      return this.fillResult(pg);
    } else {
      const { EndTime, BeginTime } = pg;
      const thisBlockWords = wordList.filter((word) => {
        return word.BeginTime >= BeginTime && word.EndTime <= EndTime;
      });

      this.useBlockFindLastWord(pg, thisBlockWords);
    }
  }
  /**
   * 分离每个段落
   * @param paragraphList
   * @param wordList
   */
  sliceParagraph(paragraphList: SentencesVOE[], wordList: WordsVO[]) {
    paragraphList.forEach((pg) => {
      this.anylsisPg(pg, wordList);
    });
  }

  /**
   *  处理长句子
   * @param Sentences 长句子
   * @returns
   */
  async buildParagraph(Sentences: SentencesVO[]) {
    const SentencesEDict: Dictionary<SentencesVOE[]> = {};
    const SentencesDict: Dictionary<SentencesVO[]> = groupBy(
      Sentences,
      'ChannelId',
    );
    // 处理长句子
    for (const key in SentencesDict) {
      if (Object.prototype.hasOwnProperty.call(SentencesDict, key)) {
        const paragraphListE = SentencesDict[key].map((item) => {
          const Blocks = getTextBlock(item.Text);
          return new SentencesE({
            ...item,
            Blocks,
            TextBlocks: getTextBlocks(item.Text),
            Text: replaceStrs(item.Text),
            BlockEmptyTag: [0, 1].includes(Blocks.length),
          });
        });
        await writeJson(paragraphListE, `paragraphListE-${key}`);
        SentencesEDict[key] = paragraphListE;
      }
    }
    this.paragraphDict = SentencesEDict;
  }
  /**
   * 处理短语
   * @param Words 短语
   * @returns
   */
  async buildWord(Words: WordsVO[]) {
    // 获取词语数据集
    const wordDict: Dictionary<WordsVO[]> = groupBy(Words, 'ChannelId');
    for (const key in wordDict) {
      if (Object.prototype.hasOwnProperty.call(wordDict, key)) {
        const wordList = wordDict[key];
        await writeJson(wordList, `wordList-${key}`);
      }
    }
    this.wordDict = wordDict;
  }
  /**
   * 生成SRT文件
   * @param vResult 最终结果
   */
  async buildSrt(vResult: ResultVO[]) {
    // 生成 Srt 文件
    let index = 0;
    let srtText = '';
    vResult.forEach((m) => {
      const lineStr = makeSubtitleText(index, m.BeginTime, m.EndTime, m.Text);
      srtText += lineStr;
      index++;
    });

    writeFileSync(path.join(process.cwd(), 'config', `srt.srt`), srtText);
  }

  async jsonBuild(obj: NlsFiletransResponseVO) {
    const { Sentences, Words } = obj.Result;
    // 获取录音识别数据集
    await this.buildParagraph(Sentences);
    await this.buildWord(Words);
    for (let i = 0; i < this.channelCount; i++) {
      const oneChannelPge = this.paragraphDict[i];
      const oneChannelWd = this.wordDict[i];
      this.sliceParagraph(oneChannelPge, oneChannelWd);
    }
    writeJson(this.vResultListMap.get(0), 'vResultList');
    this.buildSrt(this.vResultListMap.get(0)!);
  }
  /**
   * 传输文件并识别
   * @param fileLink 文件OSS名称
   * @returns
   */
  fileTransData(fileLink: string): Promise<NlsFiletransResponseVO> {
    return new Promise((resolve, reject) => {
      /**
       * 提交录音文件识别请求，请求参数组合成JSON格式的字符串作为task的值。
       * 请求参数appkey：项目appkey。
       * 请求参数file_link：需要识别的录音文件。
       */
      const task = {
        appkey: this.appkey,
        file_link: fileLink,
        enable_words: true, // 设置是否输出词信息，默认值为false，开启时需要设置version为4.0。
        enable_inverse_text_normalization: true,
        enable_timestamp_alignment: true,
        enable_sample_rate_adaptive: true,
        version: '4.0', // 新接入请使用4.0版本，已接入（默认2.0）如需维持现状，请注释掉该参数设置。
      };
      const taskParams = {
        Task: JSON.stringify(task),
      };
      const options = {
        method: 'POST',
      };
      // 提交录音文件识别请求，处理服务端返回的响应。
      this.client
        .submitTask(taskParams, options)
        .then((response: any) => {
          // 服务端响应信息的状态描述StatusText。
          const statusText = response.StatusText;
          if (statusText != 'SUCCESS') {
            console.log('录音文件识别请求响应失败!');
            return;
          }
          console.log('录音文件识别请求响应成功!等待服务器结果...');
          // 获取录音文件识别请求任务的TaskId，以供识别结果查询使用。
          const taskId = response.TaskId;
          /**
           * 以TaskId为查询参数，提交识别结果查询请求。
           * 以轮询的方式进行识别结果的查询，直到服务端返回的状态描述为"SUCCESS"、SUCCESS_WITH_NO_VALID_FRAGMENT，
           * 或者为错误描述，则结束轮询。
           */
          const taskIdParams = {
            TaskId: taskId,
          };
          const timer = setInterval(() => {
            this.client
              .getTaskResult(taskIdParams)
              .then((response: NlsFiletransResponseVO) => {
                const statusText = response.StatusText;
                console.log(`识别结果查询响应：${statusText}`);
                if (statusText == 'RUNNING' || statusText == 'QUEUEING') {
                  // 继续轮询，注意间隔周期。
                } else {
                  if (
                    statusText == 'SUCCESS' ||
                    statusText == 'SUCCESS_WITH_NO_VALID_FRAGMENT'
                  ) {
                    console.log('录音文件识别成功：');
                    writeJson(response, 'response');
                    resolve(response);
                  } else {
                    reject('录音文件识别失败!');
                  }
                  // 退出轮询
                  clearInterval(timer);
                }
              })
              .catch((error: any) => {
                // 异常情况，退出轮询。
                clearInterval(timer);
                reject(error);
              });
          }, 10000);
        })
        .catch((error: any) => {
          reject(error);
        });
    });
  }
}
