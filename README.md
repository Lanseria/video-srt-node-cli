# VSNC

Video Srt Nodejs Cli

## 功能

> 首先你得配置好 FFPMEG 环境

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

### 1. 配置你的阿里云

1. 生成 `config/*.json` 文件与目录

   ```bash
   # vsnc config generate [your_config_dirname]
   vsnc config generate
   # or
   vsnc config generate config
   ```

2. 会生成如下文件

   ```
   └─ config
       └─ engine.json
       └─ filter.json
       └─ oss.json
   ```

3. 填写你的信息

### 2. 分离视频中的音频(可省略)

```bash
# vsnc slice generate <yourfilename.mp4|mov> [yourfilename.mp3]
vsnc slice generate demo.mp4 demo.mp3
```

会生成 `demo.mp3` 音频文件

### 3. 生成 Json 轨道字幕

```bash
# vsnc generate srt <yourfilename.mp3> [yourfilename.json]
vsnc generate json demo.mp3 demo.json
```

会生成 `demo.json` 字幕文件

### 3. 选择轨道并生成 Srt 轨道字幕

```bash
# vsnc generate srt <yourfilename.json> [yourfilename.json]
vsnc generate json demo.json demo.srt
```
