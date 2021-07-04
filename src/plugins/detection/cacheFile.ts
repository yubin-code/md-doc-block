import chalk from 'chalk';
import Database from './index';
import config from '../../config/config';
import { isDir, mkDir, readDirAll, writeFile } from '../../utils/file';
import menuState from '../../state/menu';

/**
 * 缓存文件类
 */
export default class CacheFile extends Database {
  cwd: string;
  cof: any;
  constructor(opts:any){
    super(opts);
    this.cwd = opts.cwd;
    this.cof = opts.cof;
  }

  /**
   * 生成入口文件
   * @param dir 目录数组
   * @returns 
   */
   generateEntryFile(dir:string[]){
      let entryFileContent = "";
      // 生成入口关联文件
      dir.filter(item => item.indexOf(".md") >= 0)
      .map(item => {
          entryFileContent += `"${item}":require("${item}"),`
          return item
      });
      
      writeFile(this.cof.userEntryFile, `export default { ${entryFileContent} }`);
  }

  // 更新入口文件
  upCache(){
    try{
      // 获取缓存目录
      const cacheFile = this.cof.cacheFile

      // 如果文件夹不存在那么就创建
      if(!isDir(cacheFile)){
        mkDir(cacheFile);
      }
      
      // 获取用户文档目录
      const docsPath = this.cof.docsPath;
      if(!isDir(docsPath)){
        return
      }
      const readDir = readDirAll(docsPath);

      // 生成入口文件
      this.generateEntryFile(readDir.dirArray);

      // 生成目录结构文件
      menuState.create(readDir.treeArray);
    }catch(e){
      throw new Error(e);
    }
  }

  // 监控变化
  watch(){
    let timer:any = null;
    this.upCache();
    // 添加文件的时候
    this.on("all", (event, path) => {
      // 判断配置文件是否被修改
      if(event === "change" && path === config.userConfigName){
        // 延迟一秒执行防止重复启动webpack
        clearTimeout(timer);
        timer = setTimeout(() => {
            console.log([
              "",
              chalk.green('配置文件被修改服务正在重启中...')
            ].join('\n'));
          process.send?.("RESTART")
        }, 1000);
      }

      // 判断是否是.md文件被修改了
      const isMd = path.search(/\.md$/i) !== -1
      // 文件被添加时候
      if(event === "add" && isMd){
        this.upCache();
      }
      
      // 文件被删除的时候
      if(event === "unlink" && isMd){
        this.upCache();
      }
    });
  }
}