import resolve from 'resolve'
import path from 'path'
import pkgUp from 'pkg-up';
import { compatESModuleRequire, getFileName, oneUpperCase } from '../utils/index'
import { readDir } from '../utils/file'


// 指令，插件等等类型
export interface MethodType {
  cwd: string;
  commands?: string[];
  userCommands?: string[];
  plugins?: string[];
  userPlugins?: string[];
}

/**
 * 读取所有的预设和插件
 * @param type 类型
 * @param opts 对象
 */
function getPlugins(type: string, opts: MethodType): string[] {
  return [
    ...opts[type],
    ...opts[`user${(oneUpperCase(type))}`]
  ].map((item) => {
    return resolve.sync(item, {
      basedir: opts.cwd,
      extensions: ['.js', '.ts'],
    });
  })
}

/**
 * 获取目录下面所有文件
 * @param dir 目录
 * @returns 
 */
export function  getMethodPath (dir: string) {
  // src 目录
  const src = path.join(__dirname, "../");
  // 获取文件路径
  const dirPath = path.join(src, dir);

  // 过滤d.ts文件并检查文件是否存在
  return readDir(dirPath)
  .filter(item => item.indexOf("d.ts") <= 0 && getFileName(item) != '')
  .map(item => require.resolve(path.join(dirPath, item)));
}

/**
 * 加载文件
 * @param path 文件路径
 * @returns 
 */
export function pluginLoader (path:string){
  const ret = require(path);
  return compatESModuleRequire(ret);
}

/**
 * 路径转对象
 * @param param 
 */
export function pathToObj({
  type,
  path,
  cwd,
}: {
  type: string;
  path: string;
  cwd: string;
}){
  let pkg = null;
  // 获取最近的pachage.json文件
  const pkgJSONPath = pkgUp.sync({ cwd: path });
  // 获取拿到了pachage.json就引入
  if (pkgJSONPath) {
    pkg = require(pkgJSONPath);
  }
  
  return {
    id: pkg.name,
    key: getFileName(path),
    path,
    cwd: cwd,
    apply() {
      try {
        return pluginLoader(path);
      } catch (e) {
        throw new Error(`Register ${type} ${path} failed, since ${e.message}`);
      }
    }
  }
}

// 解析路径
export function resolvePath(type:string, opts: MethodType) {
  const presets = [...getPlugins(type, opts)];
  return presets.map((path: string) => {
    return pathToObj({
      type,
      path,
      cwd: opts.cwd,
    });
  });
}