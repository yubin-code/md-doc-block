"use strict";
import _ from 'lodash';
import os from 'os';
import path from 'path';
import config from '../config/config';
import { isFileExis } from './file';


// 判断是否是window系统
export const isWindow = os.type() === "Windows_NT";
/**
 * 根据系统判断来区分文件的分割符号
 * window路径是window路径是 \\ 而mac是/
 * 所以这里需要做下判断
 */
export const fileSplitSymbol = isWindow ? '\\' : '/';

/**
 * 导出的文件
 * @param m 
 * @returns 
 */
export function compatESModuleRequire (m: any) {
  return m.default || m;
}
// 获取路径名称
export function getPathName (pathFile: string) {
  const pos = pathFile.lastIndexOf(fileSplitSymbol);
  return pathFile.substring(pos + 1);
}
// 获取文件名
export function getFileName (name:string) {
  const filename = getPathName(name);
  return filename.substring(0, filename.lastIndexOf("."));
};

/**
 * 获取文件后缀
 * 例如: index.html 获取 html
 * @param name 
 * @returns 
 */
export function getFileSuffix (name:string) {
  return name.substring(name.lastIndexOf('.') + 1);
};

/**
 * 首字母转大写
 * @param text 文本
 * @returns 
 */
export function oneUpperCase(text:string){
  return text.charAt(0).toUpperCase()+text.slice(1)
}
/**
 * 路径转化
 * 主要是把用户 /admin 路径和 ./admin路径
 * 转成 admin
 * @param url 
 */
export function pathTurn(url:string){
  // 防止用户第一个输入的是 /
  if(url[0] === '/'){
    return url.slice(1)
  }
  // 防止用户第一个输入的是 ./
  if(url[0] === "." && url[1] === "/"){
    return url.slice(2)
  }
  return url;
}

/**
 * 修改文件后缀
 * @param prefix    前缀
 * @param filePath  文件路径
 * @param before    之前的后缀
 * @param after     修改之后的后缀
 */
 export function editSuffix(prefix:string, filePath:string, before: string="", after: string=""){
  return filePath.replace(prefix, "")   // 去除前缀
    .replace(before, after)             // 替换后缀
    .slice(1);                          // 删除第一个字符串一般是 /
}


/**
 * 根据配置文件所在位置获取用户的项目目录
 * @returns 
 */
export function getUserCwd(){
  const cwd = process.cwd();
  const pathSplit = cwd.split(fileSplitSymbol);
  let filePathList:string[] = [];

  // 循环分割路径
  pathSplit.forEach((_, index:number) => {
    const filePath = pathSplit.slice(0, index+1);
    filePathList.unshift(filePath.join(fileSplitSymbol));
  });
  
  // 过滤空路径
  filePathList = filePathList.filter(item => item !== "");
  
  for(let i in filePathList){
    const item = filePathList[i];
    const configPath = path.resolve(item, config.userConfigName);
    if(isFileExis(configPath)){
      return item
    }
  }
  return cwd;
}



/**
 * 多文档模式获取当前文件所在文档
 * 例如：/aa/bb/cc/index.html 
 * 能获取 aa 这个目录
 * @param docPath  文档目录
 */
export function getWhereDocs(docPath:string){
  const files = docPath.split(fileSplitSymbol);
  const getWhereDocs = files.filter(item => item !== '').filter(item => item.indexOf('.md') < 0);
  return getWhereDocs[0];
}

/**
 * 生成hash随机数
 * @param len 随机数长度
 * @returns 
 */
export function getHash (len) {
	if (!_.isNumber(len)) return '';
	const ar = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
	const hs = [];
	const hl = Number(len);
	const al = ar.length;
	for (let i = 0; i < hl; i ++) {
		hs.push(ar[Math.floor(Math.random() * al)]);
	}
	return hs.join('');
}