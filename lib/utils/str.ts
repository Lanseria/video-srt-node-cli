const symbolZhcn = [' ', '？', '。', '，', '！', '；', '?', '.', ',', '!'];
export const getTextBlock = (text: string): number[] => {
  const blocks: number[] = [];
  const textArr = text.split('');
  for (let i = 0; i < textArr.length; i++) {
    const char = textArr[i];
    if (symbolZhcn.includes(char)) {
      blocks.push(i - blocks.length);
    }
  }
  return blocks;
};

export const getTextBlocks = (text: string): string[] => {
  const blocks: string[] = [];
  const textArr = text.split('');
  let startAt = 0;
  for (let i = 0; i < textArr.length; i++) {
    const char = textArr[i];
    if (symbolZhcn.includes(char)) {
      if (startAt) {
        startAt++;
      }
      const str = text.substring(startAt, i);
      blocks.push(str);
      startAt = i;
    }
  }
  return blocks;
};

export const replaceStrs = (text: string, char = ''): string => {
  for (let i = 0; i < symbolZhcn.length; i++) {
    const oldChar = symbolZhcn[i];
    text = text.replaceAll(oldChar, char);
  }
  return text;
};

export const getRealLength = (val: string) => {
  return [...val].length;
};

export const isChineseChars = (val: string) => {
  const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
  return reg.test(val);
};

export const isChineseWords = (wordObjs: any[]) => {
  return wordObjs.some((m) => isChineseChars(m.Word));
};

export const compleSpace = (str: string) => {
  str = str.trim();
  return str + ' ';
};

export const repeatStr = (
  str: string,
  s: string,
  length: number,
  before = true,
): string => {
  const ln = str.length;

  if (ln >= length) {
    return str;
  }

  if (before) {
    return s.repeat(length - ln) + str;
  } else {
    return str + s.repeat(length - ln);
  }
};

//字幕时间戳转换
export const subtitleTimeMillisecond = (time: number): string => {
  let miao = 0;
  let min = 0;
  let hours = 0;
  let millisecond = 0;

  millisecond = time % 1000;
  miao = time / 1000;

  if (miao > 59) {
    min = time / 1000 / 60;
    miao = miao % 60;
  }
  if (min > 59) {
    hours = time / 1000 / 3600;
    min = min % 60;
  }

  //00:00:06,770
  const miaoText = repeatStr(miao.toFixed(0), '0', 2);
  const minText = repeatStr(min.toFixed(0), '0', 2);
  const hoursText = repeatStr(hours.toFixed(0), '0', 2);
  const millisecondText = repeatStr(millisecond.toFixed(0), '0', 3);

  return hoursText + ':' + minText + ':' + miaoText + ',' + millisecondText;
};

export const makeSubtitleText = (
  index: number,
  startTime: number,
  endTime: number,
  text: string,
) => {
  const lineStr = `
${index}
${subtitleTimeMillisecond(startTime)} --> ${subtitleTimeMillisecond(endTime)}

${text}


`;
  return lineStr;
};

export const findSliceIntCount = (slice: number[], target: number) => {
  let c = 0;
  for (let i = 0; i < slice.length; i++) {
    const v = slice[i];
    if (target === v) {
      c++;
    }
  }
  return c;
};
