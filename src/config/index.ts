import path from 'path';
import _ from "lodash";
import { loadFile } from '../utils/file';
import message from '../utils/message';
import syscof from './config';
import { isDir } from '../utils/file';

// 不允许用户拥有的属性
const filterField = [
  "root",        // 用户存放代码目录
  "isDev",       // 文档目录
  "cwd",        // 是否为多文档模式
];
 

// 过滤用户配置中的一些选项
const getUserConfig = (opts:any) => {
  // 读取用户配置文件
  const userCof = loadFile(path.resolve(opts.cwd, syscof.userConfigName));
  // 过滤一些用户的属性
  Object.keys(userCof).forEach(item => {
    if(filterField.indexOf(item) >= 0){
      delete userCof[item];
    }
  });
  return userCof
}

/**
 * 获取基础配置
 * @param opts 
 */
const getbaseConfig = (opts:any, usercof:any) => {
  const baseCof:any = { ...syscof.varName };
  /**
   * 用户基础文件路径配置
   */
  //  用户配置文件所在路径
  baseCof.userCofPath = path.resolve(opts.cwd, syscof.userConfigName);
  //  获取用户文档目录名字
  baseCof.docsName = usercof.docsPath || syscof._docsPath;
  // 用于用户自定义化使用的数据，里面存放菜单，列表等数据
  // baseCof.dataScript = syscof.dataScript;
  //  获取用户文档目录路径
  baseCof.docsPath = path.resolve(opts.cwd, baseCof.docsName);
  // 获取缓存目录
  baseCof.cacheFile = path.resolve(opts.cwd, syscof.userCacheFile);
  // 需要被检测新增修改的目录
  baseCof.detectionFile = [baseCof.userCofPath, baseCof.docsPath];
  // 用户缓存入口文件
  baseCof.userEntryFile = path.resolve(baseCof.cacheFile, syscof.userEntryFile);
  // 其他缓存文件目录
  baseCof.cacheCatalogue = path.resolve(baseCof.cacheFile, syscof.cacheCatalogue);
  // 菜单缓存目录
  baseCof.cacheMenu = path.resolve(baseCof.cacheFile, syscof.cacheMenu);

  // 打包输出路径
  baseCof.output = path.resolve(opts.cwd, usercof.output || 'dist');
  // 请求链接等等前缀
  baseCof.LinkPrefix = usercof.linkPrefix || "/";
  // 获取mdcof配置
  baseCof.mdcof = _.isObject(usercof.mdcof) && usercof.mdcof || {};
  // 系统资源路径
  baseCof._assets = syscof._assets;
  /**
   * 系统基础文件配置
   */
  //  设置资源入口
  const contentBase = [ syscof._assets ];
  // 用户代码库是否设置
  if(usercof.codePath){
    baseCof.codePath = path.resolve(opts.cwd, usercof.codePath);

    // 先判断是否是目录文件
    // 如果不是直接退出程序
    if(!isDir(baseCof.codePath)){
      message.error({
        message: `代码目录${usercof.codePath}不存在请先创建`
      });
      process.send?.("KILL");
      return
    }
    
    contentBase.push(baseCof.codePath);
  }
  // 用户是否设置资源入口
  if(usercof.assets){
    // 用户资源路径
    baseCof.assets = path.resolve(opts.cwd, usercof.assets);
    contentBase.push(baseCof.assets);
  }
  // 资源入口集合
  baseCof.contentBase = contentBase;
  
  // 系统内容模板
  baseCof.contentView = path.resolve(syscof.root, syscof._view, syscof.contentView);
  // 判断用户是否设置了内容模板
  if(usercof.view){
    baseCof.contentView = path.resolve(opts.cwd, usercof.view, syscof.contentView);
  }

  // 页面icon
  baseCof.favicon = usercof.favicon || syscof._favicon;
  const userStyles = _.isArray(usercof.styles) ? usercof.styles : syscof.styles;
  const userScripts = _.isArray(usercof.scripts) ? usercof.scripts : syscof.scripts;
  // 样式表
  baseCof.styles = [...syscof._styles, ...userStyles]
  // 代码表
  baseCof.scripts = [ ...syscof._scripts, ...userScripts ]

  return baseCof;
}


/**
 * 获取配置文件
 * @param opts 
 * @param usercof 
 */
export function getConfig(opts:any){
  const userConfig = getUserConfig(opts);
  const baseConfig = getbaseConfig(opts, userConfig);
  return {...userConfig, ...baseConfig}
}