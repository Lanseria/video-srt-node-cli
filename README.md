# VSNC

Video Srt Nodejs Cli

## 功能

- 配置你的阿里云
- 分离视频中的音频
- 生成字幕

## 命令

### 配置你的阿里云

1. 生成 `config/*.json` 文件与目录

```bash
node bin/vsnc.js config -g
```

2. 填写你的信息

### 分离视频中的音频(可省略)

```bash
node bin/vsnc.js slice <demo.mp4>
```

会生成 `demo.mp3` 音频文件

### 生成字幕

```bash
node bin/vsnc.js generate <demo.mp4>
```

会生成 `demo.srt` 字幕文件
