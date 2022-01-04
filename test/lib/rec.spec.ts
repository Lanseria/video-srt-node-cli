import { CosClient } from '../../lib/cos';
import { RecClient } from '../../lib/rec';
import { writeJson } from '../../lib/utils/write';

describe('腾讯 RecClient 模块测试', () => {
  let cosClient: CosClient;
  let recClient: RecClient;
  const key = 'demo.aac';

  beforeAll(() => {
    cosClient = new CosClient();
    recClient = new RecClient();
  });

  it('create and fetch rec result', async () => {
    const urlResult = await cosClient.getObjectUrl(key);
    const taskStatusResult = await recClient.getDescResultData(urlResult.Url);
    await writeJson(taskStatusResult, 'taskStatusResult');
  });
});
