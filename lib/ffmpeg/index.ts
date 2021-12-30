import * as path from 'path';
import { exec } from 'child_process';

export class Ffmpeg {
  extractVideoAudio(videoName: string, audioName?: string) {
    const videoPath = path.join(process.cwd(), videoName);
    const filename = path.basename(videoPath);
    if (!filename) {
      throw new Error('错误的文件路径');
    }
    const ext = path.extname(filename);
    const fileN = filename.split(ext)[0];
    const timestamp = (new Date().getTime() / 1000).toFixed(0);
    const tempAudioName = audioName ?? `${fileN}-${timestamp}.mp3`;
    exec(
      `ffmpeg -i ${videoPath} -ar 16000 ${tempAudioName}`,
      (error, stdout, stderr) => {
        if (error) {
          throw error;
        }
        console.log('[shell log]: ', stdout, stderr);
        console.log(`音频分离成功 ${tempAudioName}`);
      },
    );
  }
}
