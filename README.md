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

### 2. 分离视频中的音频

```bash
# vsnc slice <audioformat> <yourfilename.mp4|mov> [yourfilename.mp3]
vsnc slice mp3 demo.mp4 demo.mp3
```

会生成 `demo.mp3` 音频文件

### 3. 生成 Srt 字幕文件

```bash
# vsnc generate srt <yourfilename.mp3> [yourfilename.srt]
vsnc generate srt demo.mp3 demo.srt
```

此步骤会去执行阿里云的 oss 与 nls 服务 API(修改数据不需要重新去执行)
会生成 `demo.json` 字幕 `JSON` 数据文件(方便修改)
修改校对完 JSON 文件进行生成字幕目标文件
