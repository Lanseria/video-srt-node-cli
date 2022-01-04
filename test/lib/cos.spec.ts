import { CosClient } from '../../lib/cos/index';
import { utilCwdPath } from '../../lib/utils/path';

describe('腾讯 CosClient 模块测试', () => {
  let cosClient: CosClient;
  beforeAll(() => {
    cosClient = new CosClient();
  });

  it('getService', async () => {
    const res = await cosClient.getService();
    const cosBucketList = res.Buckets.filter(
      (m: any) => m.BucketType === 'cos',
    );
    const cosBucketNameList = cosBucketList.map((m) => m.Name);
    // 是否存在对应 bucket name
    expect(cosBucketNameList.includes(cosClient.tencentOpt.Bucket)).toBe(true);
  });

  it('uploadFile', async () => {
    const theKey = 'README.md';
    const filePath = utilCwdPath(theKey);
    const uploadRes = await cosClient.uploadFile(filePath);
    expect(uploadRes.statusCode).toBeLessThan(300);
    // console.log(uploadRes);
    // {
    //   statusCode: 200,
    //   headers: {
    //     'content-length': '0',
    //     connection: 'keep-alive',
    //     date: 'Tue, 04 Jan 2022 05:52:17 GMT',
    //     etag: '"85c4f06299eae9afd3eaf1a9e2e860f6"',
    //     server: 'tencent-cos',
    //     'x-cos-hash-crc64ecma': '18258601901389887831',
    //     'x-cos-request-id': 'NjFkM2UwOTBfNmJiYTAzMDlfZDAxX2VjNGE4NTU=',
    //     'x-cos-storage-class': 'STANDARD'
    //   },
    //   Location: 'video-audio-1251742961.cos.ap-shanghai.myqcloud.com/demo.aac',
    //   ETag: '"85c4f06299eae9afd3eaf1a9e2e860f6"',
    //   RequestId: 'NjFkM2UwOTBfNmJiYTAzMDlfZDAxX2VjNGE4NTU='
    // }
    const deleteRes = await cosClient.deleteObject(theKey);
    expect(deleteRes.statusCode).toBeLessThan(300);
    // console.log(deleteRes);
    // {
    //   statusCode: 204,
    //   headers: {
    //     'content-length': '0',
    //     connection: 'keep-alive',
    //     date: 'Tue, 04 Jan 2022 06:10:45 GMT',
    //     server: 'tencent-cos',
    //     'x-cos-request-id': 'NjFkM2U0ZTVfYTE5ZjA4MDlfODlhY19kZWY0YTI2'
    //   },
    //   RequestId: 'NjFkM2U0ZTVfYTE5ZjA4MDlfODlhY19kZWY0YTI2'
    // }
  });

  it('getObjectUrl', async () => {
    const theKey = 'package.json';
    const filePath = utilCwdPath(theKey);
    const uploadRes = await cosClient.uploadFile(filePath);
    expect(uploadRes.statusCode).toBeLessThan(300);
    const getRes = await cosClient.getObjectUrl(theKey);
    expect(typeof getRes.Url).toBe('string');
    // console.log(getRes);
    // {
    //   Url: 'https://video-audio-1251742961.cos.ap-shanghai.myqcloud.com/package.json?q-sign-algorithm=sha1&q-ak=AKIDYwPdcgA9WdV6RVuqFMGuHOEo8D0ia7rL&q-sign-time=1641276644;1641276704&q-key-time=1641276644;1641276704&q-header-list=host&q-url-param-list=&q-signature=435f2e428fc74025111562a230777f17fb6cff8f';
    // }
    const deleteRes = await cosClient.deleteObject(theKey);
    expect(deleteRes.statusCode).toBeLessThan(300);
  });
});
