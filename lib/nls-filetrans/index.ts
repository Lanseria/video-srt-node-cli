'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Client = require('@alicloud/nls-filetrans-2018-08-17');

interface NlsFiletransOptVO {
  accessKeyId: string;
  accessKeySecret: string;
  endpoint: string;
  appkey: string;
}

export class NlsFiletrans {
  private client;
  private appkey;
  constructor(opt: NlsFiletransOptVO) {
    console.log(opt);
    this.client = new Client({
      accessKeyId: opt.accessKeyId,
      accessKeySecret: opt.accessKeySecret,
      endpoint: `http://${opt.endpoint}`,
      apiVersion: '2018-08-17',
    });
    this.appkey = opt.appkey;
  }

  fileTrans(fileLink: string) {
    /**
     * 提交录音文件识别请求，请求参数组合成JSON格式的字符串作为task的值。
     * 请求参数appkey：项目appkey。
     * 请求参数file_link：需要识别的录音文件。
     */
    const task = {
      appkey: this.appkey,
      file_link: fileLink,
      version: '4.0', // 新接入请使用4.0版本，已接入（默认2.0）如需维持现状，请注释掉该参数设置。
    };
    const taskParams = {
      Task: JSON.stringify(task),
    };
    const options = {
      method: 'POST',
    };
    console.warn(taskParams);
    // 提交录音文件识别请求，处理服务端返回的响应。
    this.client
      .submitTask(taskParams, options)
      .then((response: any) => {
        console.log('first request');
        // console.warn(response);
        // 服务端响应信息的状态描述StatusText。
        const statusText = response.StatusText;
        if (statusText != 'SUCCESS') {
          console.warn('录音文件识别请求响应失败!');
          return;
        }
        console.warn('录音文件识别请求响应成功!');
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
            .then((response: any) => {
              console.log('识别结果查询响应：');
              console.log(response);
              const statusText = response.StatusText;
              if (statusText == 'RUNNING' || statusText == 'QUEUEING') {
                // 继续轮询，注意间隔周期。
              } else {
                if (
                  statusText == 'SUCCESS' ||
                  statusText == 'SUCCESS_WITH_NO_VALID_FRAGMENT'
                ) {
                  console.log('录音文件识别成功：');
                  const sentences = response.Result;
                  console.log(sentences);
                } else {
                  throw new Error('录音文件识别失败!');
                }
                // 退出轮询
                clearInterval(timer);
              }
            })
            .catch((error: any) => {
              // 异常情况，退出轮询。
              clearInterval(timer);
              throw new Error(error);
            });
        }, 10000);
      })
      .catch((error: any) => {
        throw new Error(error);
      });
  }
}
