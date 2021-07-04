import fs from 'fs';
import { getFileSuffix } from './index'
import { editSuffix } from '../utils/index';

// 生成目录结构的数据结构
export interface DirType {
  type?: string;            // 类型 dir目录 file是文件
  isDir?: boolean;          // 是否为目录
  path?: string;            // 文件所在目录
  url?: string;             // 跳转地址
  name?: string;            // 文件名字
  key?: number;             // key值
  suffix?: string|null;     // 文件后缀
  children?: DirType[]      // 子文件
}
/**
 * 判断一个文件是否存在
 * @param path 路径
 */
 export function isFileExis(path: string){
  try{
    fs.statSync(path);
    return true;
  }catch(e){
    return false;
  }
}

/**
 * 判断是否是目录
 * @param path 路径
 */
 export function isDir(path: string){
  try{
    const stat = fs.statSync(path);
    return stat.isDirectory();
  }catch(e){
    return false;
  }
}

/**
 * 是否为空目录
 * @param path 路径
 */
export function isEmptyDir(path: string){
  const dir = readDir(path);
  return dir.length <= 0;
}


/**
 * 创建文件夹
 * @param path 路径
 */
export function mkDir(path: string){
  try{
    return fs.mkdirSync(path);
  }catch(e){
    return false;
  }
}

/**
 * 写入文件
 * @param file 文件名字
 * @param content 写入的数据
 * @returns 
 */
export function writeFile(file: string, content: string){
  try{
    return fs.writeFileSync(file, content);
  }catch(e){
    return false;
  }
}

/**
 * 读取一个文件
 * @param file 文件的地址
 */
export function readFile(file: string){
  // 文件不存在不读取
  if(!isFileExis(file)){
    return null;
  }
  return fs.readFileSync(file,'utf-8');
}

/**
 * 加载一个文件与readFile一样
 * 不过loadFile使用的是require方式
 * readFile使用的是readFileSync
 * @param filePath 文件名
 */
 export function loadFile(filePath: string){
  // 没有配置文件
  if(!isFileExis(filePath)){
    return {};
  }
  return require(filePath);
}

/**
 * 读取目录下所有的文件
 * @param file 
 * @returns 
 */
export function readDir(file: string){
  // 文件不存在不读取
  if(!isDir(file)){
    return [];
  }
  return fs.readdirSync(file);
}
/**
 * 读取当前目录下所有的文件 同时生成tree与平行数据
 * @param root        根路径
 * @param parentPath  父路径
 * @returns 
 */
export function readDirAll(root: string, parentPath: string=""){
  let dirArray:any = []
  const treeArray:DirType[] = [];
	const dir = fs.readdirSync(root);
	dir.forEach((path:string,index:number) => {
    const dirPath = `${root}/${path}`;
    // 把目录与文件直接push到dir中
    dirArray.push(dirPath);
    // 对目录处理
		if(isDir(dirPath)){
      const dir = readDirAll(dirPath, `${parentPath}/${path}`);
      treeArray.push({
        type: 'dir',                    // 类型
        isDir: true,                    // 是否为目录
        path: `${parentPath}/${path}`,  //文件所在路径
        url: `${parentPath}/${path}`,   //文件所在路径
        name: path,                     // 文件名字
        key: index,                     // key值
        suffix: null,                   // 文件后缀
        children: dir.treeArray,        // 子目录
      });

      dirArray = [...dirArray,...dir.dirArray];
      return
		}

    // 对文件处理
    treeArray.push({
      type: 'file',
      suffix: getFileSuffix(path),
      path: `${parentPath}/${path}`,
      url: editSuffix('', `${parentPath}/${path}`, "md", "html"),  //文件所在路径
      name: path,
      key: index,
    });

  });

  // 对文件排序把文件夹排序到前面去
  treeArray.sort((a:any, b:any) => a.type.charCodeAt(0) - b.type.charCodeAt(0));
  return {
    dirArray,
    treeArray
  };
}   

/**
 * 递归读取文件目录结构 读取目录tree数据
 * @param root        根路径
 * @returns 
 */
export function readDirTree(root: string){
  return readDirAll(root).treeArray;
}

/**
 * 读取目录结构为数组
 * @param root 
 */
export function readDirArray(root: string){
  return readDirAll(root).dirArray;
}
