import * as OSS from 'ali-oss';
import * as path from 'path';
interface OssClientVO {
  bucketName: string;
  bucketDomain: string;
  endpoint: string;
  accessKeyId: string;
  accessKeySecret: string;
}

interface OssPutResultVO {
  name: string;
  url: string;
  res: any;
}

export class OssClient {
  private client;
  private bucketName;
  private bucketDomain;
  constructor(opt: OssClientVO) {
    this.client = new OSS({
      endpoint: opt.endpoint,
      // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
      accessKeyId: opt.accessKeyId,
      accessKeySecret: opt.accessKeySecret,
    });
    this.bucketName = opt.bucketName;
    this.bucketDomain = opt.bucketDomain;
  }

  getListBuckets() {
    this.client.listBuckets(null);
    throw new Error('');
  }

  async uploadFile(name: string, filePath: string): Promise<OssPutResultVO> {
    this.client.useBucket(this.bucketName);
    const result = await this.client.put(name, filePath);
    return result;
  }

  getObjectFileUrl(objectFile: string) {
    return this.bucketDomain + '/' + objectFile;
  }

  async uploadAudioToCloud(filePath: string) {
    const filename = path.basename(filePath);
    if (!filename) {
      throw new Error('错误的文件路径');
    }
    const result = await this.uploadFile(filename, filePath);
    return result;
  }
}
