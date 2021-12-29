# VSNC

Video Srt Nodejs Cli

## 功能

- 配置你的阿里云
- 分离视频中的音频
- 生成字幕

## 命令

### 初始化

```bash
npm i
npm run build
npm link
```

### 配置你的阿里云

1. 生成 `config/*.json` 文件与目录

```bash
# node bin/vsnc.js config -g
vsnc config generate
# or
vsnc config generate [config dir name]
```

2. 填写你的信息

### 分离视频中的音频(可省略)

```bash
# node bin/vsnc.js slice <demo.mp4>
vsnc slice generate <demo.mp4|mov> [demo.mp3]
```

会生成 `demo.mp3` 音频文件

### 生成字幕

```bash
# node bin/vsnc.js generate <demo.mp4>
vsnc generate srt <demo.mp3> [demo.srt]
```

会生成 `demo.srt` 字幕文件
