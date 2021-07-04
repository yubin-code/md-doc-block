import path from 'path';
import { getUserCwd } from './index';
import { isFileExis, isEmptyDir } from './file';

import syscof from '../config/config';
import message from './message';
/**
 * 判断是否已经初始化
 */
export const isInit = () => {
  const cwd = getUserCwd();
  if(isFileExis(path.join(cwd, syscof.userConfigName))){
    return true;
  }
  
  // 设置配置
  message.error({
    message: "请先运行 doc init 进行初始化",
    title: "项目未初始化"
  });
  process.send("KILL");
  return false
}

/**
 * 判断是否允许初始化
 */
export const isAllowInit = (cwd) => {
  if(isEmptyDir(cwd)){
    return true;
  }
  
  message.noInit();
  process.exit(1);
}


