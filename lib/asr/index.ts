// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
import * as tencentcloud from 'tencentcloud-sdk-nodejs';
import { ClientConfig } from 'tencentcloud-sdk-nodejs/tencentcloud/common/interface';
import { TencentOpt } from '../tencent';
import { utilCwdPath } from '../utils/path';

const AsrClient = tencentcloud.asr.v20190614.Client;

export class Asr {
  public asr;
  public asrConfig: ClientConfig;
  public tencentOpt: TencentOpt;
  constructor(endpoint = 'asr.tencentcloudapi.com') {
    this.tencentOpt = require(utilCwdPath('config/tencent.json'));
    this.asrConfig = {
      credential: {
        secretId: this.tencentOpt.SecretId,
        secretKey: this.tencentOpt.SecretKey,
      },
      region: '',
      profile: {
        httpProfile: {
          endpoint,
        },
      },
    };
    this.asr = new AsrClient(this.asrConfig);
  }
}
