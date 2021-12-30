'use strict';
import { writeFile, writeFileSync } from 'fs';
import { Dictionary, groupBy } from 'lodash';
import path = require('path');
import {
  compleSpace,
  findSliceIntCount,
  getRealLength,
  getTextBlock,
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

interface SentencesVO {
  'EndTime': number;
  'SilenceDuration': number;
  'BeginTime': number;
  'Text': string;
  'ChannelId': number;
  'SpeechRate': number;
  'EmotionValue': number;
  Blocks: number[];
}
interface WordsVO {
  Word: string;
  ChannelId: number;
  BeginTime: number;
  EndTime: number;
}
interface NlsFiletransResultVO {
  Sentences: SentencesVO[];
  Words: WordsVO[];
}
interface NlsFiletransResponseVO {
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
  constructor(opt: NlsFiletransOptVO) {
    this.client = new Client({
      accessKeyId: opt.accessKeyId,
      accessKeySecret: opt.accessKeySecret,
      endpoint: `http://filetrans.cn-shanghai.aliyuncs.com`,
      apiVersion: '2018-08-17',
    });
    this.appkey = opt.appkey;
  }

  jsonBeauty(obj: NlsFiletransResponseVO) {
    const { Sentences, Words } = obj.Result;
    // 获取录音识别数据集
    const audioResult: Dictionary<SentencesVO[]> = groupBy(
      Sentences,
      'ChannelId',
    );
    // console.log(audioResult);
    writeJson(audioResult, 'audioResult');
    // 获取词语数据集
    const wordResult = groupBy(Words, 'ChannelId');
    // console.log(wordResult);
    writeJson(wordResult, 'wordResult');
    // 数据集处理
    for (const key in audioResult) {
      if (Object.prototype.hasOwnProperty.call(audioResult, key)) {
        let paragraphList = audioResult[key];
        paragraphList = paragraphList.map((item) => {
          return {
            ...item,
            Blocks: getTextBlock(item.Text),
            Text: replaceStrs(item.Text, ''),
          };
        });
        audioResult[key] = paragraphList;
      }
    }
    // console.log(audioResult);
    writeJson(audioResult, 'audioResult');

    // 遍历输出
    const vResultList = [];
    for (const key in wordResult) {
      if (Object.prototype.hasOwnProperty.call(wordResult, key)) {
        const wordList = wordResult[key];
        let blockStr = '';
        let blockRuneLen = 0;
        let lastBlock = 0;

        let beginTime = 0;
        let blockBool = false;
        // 有一个中文就true
        // 校验中文
        const ischinese = isChineseWords(wordList);
        let chineseNumberWordIndexs: number[] = [];
        let chineseNumberDiffLength = 0;
        for (let i = 0; i < wordList.length; i++) {
          const wordItem = wordList[i];
          if (blockBool || i === 0) {
            beginTime = wordItem.BeginTime;
            blockBool = false;
          }
          if (ischinese && blockStr === '') {
            chineseNumberWordIndexs = [];
            chineseNumberDiffLength = 0;
          }
          if (ischinese) {
            blockStr += wordItem.Word;
          } else {
            blockStr += compleSpace(wordItem.Word);
          }
          // 获取字符串实际长度
          blockRuneLen = getRealLength(blockStr);
          // 与段落比较
          for (const channelId in audioResult) {
            if (wordItem.ChannelId === +channelId) {
              if (
                Object.prototype.hasOwnProperty.call(audioResult, channelId)
              ) {
                const paragraphList = audioResult[channelId];
                for (let pidx = 0; pidx < paragraphList.length; pidx++) {
                  const pVal = paragraphList[pidx];
                  if (
                    wordItem.BeginTime >= pVal.BeginTime &&
                    wordItem.EndTime <= pVal.EndTime
                  ) {
                    let flag = false;
                    let early = false;

                    for (let j = 0; j < pVal.Blocks.length; j++) {
                      const bVal = pVal.Blocks[j];
                      if (blockRuneLen >= bVal && bVal !== -1) {
                        flag = true;
                        let thisText = '';
                        // 容错机制
                        if (j === pVal.Blocks.length - 1) {
                          thisText = pVal.Text.substring(lastBlock, 10000);
                        } else {
                          // 下个词提前结束
                          if (
                            i < wordList.length - 1 &&
                            wordList[i + 1].BeginTime >= pVal.EndTime
                          ) {
                            thisText = pVal.Text.substring(lastBlock, 10000);
                            early = true;
                          } else {
                            thisText = pVal.Text.substring(
                              lastBlock,
                              bVal - lastBlock,
                            );
                          }
                        }

                        lastBlock = bVal;

                        if (early) {
                          // 全部设置为 -1
                          for (let k = 0; k < pVal.Blocks.length; k++) {
                            const vb = pVal.Blocks[k];
                            if (vb !== -1) {
                              pVal.Blocks[k] = -1;
                            }
                          }
                        } else {
                          pVal.Blocks[j] = -1;
                        }

                        const vResult = {
                          Text: thisText,
                          ChannelId: channelId,
                          BeginTime: beginTime,
                          EndTime: wordItem.EndTime,
                          SilenceDuration: pVal.SilenceDuration,
                          SpeechRate: pVal.SpeechRate,
                          EmotionValue: pVal.EmotionValue,
                        };
                        // 回调传参
                        vResultList.push(vResult);

                        blockBool = true;
                        break;
                      }
                    }

                    if (
                      findSliceIntCount(pVal.Blocks, -1) === pVal.Blocks.length
                    ) {
                      //全部截取完成
                      blockStr = '';
                      lastBlock = 0;
                    }

                    if (
                      findSliceIntCount(pVal.Blocks, -1) ===
                        pVal.Blocks.length - 1 &&
                      flag === false
                    ) {
                      const thisText = pVal.Text.substring(lastBlock, 10000);
                      pVal.Blocks[pVal.Blocks.length - 1] = -1;
                      const vResult = {
                        Text: thisText,
                        ChannelId: channelId,
                        BeginTime: beginTime,
                        EndTime: wordItem.EndTime,
                        SilenceDuration: pVal.SilenceDuration,
                        SpeechRate: pVal.SpeechRate,
                        EmotionValue: pVal.EmotionValue,
                      };
                      // 回调传参
                      vResultList.push(vResult);

                      // 覆盖下一段落的时间戳
                      if (pidx < paragraphList.length - 1) {
                        beginTime = paragraphList[pidx + 1].BeginTime;
                      } else {
                        beginTime = pVal.EndTime;
                      }

                      // 清除参数
                      blockStr = '';
                      lastBlock = 0;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    // console.log(vResultList);
    let index = 0;
    writeJson(vResultList, 'vResultList');
    vResultList.forEach((m) => {
      const lineStr = makeSubtitleText(index, m.BeginTime, m.EndTime, m.Text);
      writeFileSync(path.join(process.cwd(), 'config', '1.srt'), lineStr, {
        flag: 'a',
      });
      index++;
    });
    return [];
  }

  fileTrans(fileLink: string): Promise<NlsFiletransResponseVO> {
    return new Promise((resolve, reject) => {
      /**
       * 提交录音文件识别请求，请求参数组合成JSON格式的字符串作为task的值。
       * 请求参数appkey：项目appkey。
       * 请求参数file_link：需要识别的录音文件。
       */
      const task = {
        appkey: this.appkey,
        file_link: fileLink,
        enable_words: true,
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
              .getTaskResult(
                taskIdParams,
                // {
                //   agent: tunnel.httpOverHttp({
                //     proxy: {
                //       host: '127.0.0.1',
                //       port: 8888,
                //     },
                //   }),
                // }
              )
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
