import { Ffmpeg } from '../../lib/ffmpeg/index';
describe('FFMPEG模块测试', () => {
  let ffmpeg: Ffmpeg;
  beforeAll(() => {
    ffmpeg = new Ffmpeg();
  });

  it('在视频文件中分割出音频', async () => {
    const audioName = 'test.mp3';
    const aN = await ffmpeg.extractVideoAudio('test.mov', audioName);
    expect(aN).toBe(audioName);
  });
});
