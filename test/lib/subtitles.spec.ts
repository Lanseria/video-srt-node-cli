import { Subtitles } from '../../lib/subtitles';
import { writeJson, writeSrt } from '../../lib/utils/write';

describe('我的 Subtitle 模块测试', () => {
  let subtitles: Subtitles;

  beforeAll(() => {
    subtitles = new Subtitles();
  });

  it('slice data', async () => {
    const sliceData = subtitles.buildSliceData();
    await writeJson(sliceData, 'sliceData');
  });

  it('build file', async () => {
    subtitles.buildSliceData();
    const buildFile = subtitles.buildFile();
    await writeSrt(buildFile, 'buildFile');
  });
});
