import webpack from 'webpack';
import cheerio from 'cheerio';
import ejs from 'ejs';
import Markdown from '../../markdown';
import { readFile, loadFile } from '../../../utils/file';
import { getHash, pathTurn } from '../../../utils/index';
import menuState from '../../../state/menu';
import globalState from '../../../state/global';
import privateState from '../../../state/private';
import componentsState from '../../../state/components';
import { attrReg, isUrl, getDocDir } from '../../../utils/reg';
import syscof from '../../../config/config';

import _ from 'lodash';

// 文档数据类型
export interface DocType {
  name: string,
  context: string,
  hash: string,
  pageDataName: string;   // 页面数据的名字
}

const mdCache = new Map();
// 插件编写
class WebpackMarkdown {
  options: any;
  package: any;
  // 内容模板
  contentView: string;
  markdown: Markdown;

  static pluginName = "markdown-plug";
  // 设置数据
  static setData(content:any){
    let mdContent = mdCache.get("mdContent");

    if(!_.isArray(mdContent)){
      mdContent = [];
    }
    mdContent.push(content);
    mdCache.set("mdContent", mdContent);
  }

  // 任何选项都应该在插件的构造函数中传递，
  constructor(options:any = {}) {
    this.options = options;
    this.markdown = new Markdown(options);
    this.contentView = readFile(options.contentView);
    this.package = loadFile(`${options.root}package.json`);

    // 是否多文档模式
    globalState.set(this.options.docMultiple, this.options.multiple);
    // 文档链接前缀
    globalState.set(this.options.docLinkPrefix, this.userLinkPrefix());
  }

  // 解析md文件
  md(md: string){
    return this.markdown.content(md);
  }

  // 获取网站的title
  getTitle(title: string){
    return (this.options.title || syscof.title)
      .replace("{name}", title);
  }
  
  /**
   * 用户链接前缀
   * @returns 
   */
  userLinkPrefix(){
    // 如果是开发环境不添加路径前缀
    if(this.options.isDev){
      return "/"
    }
    if(this.options.LinkPrefix == "/"){
      return "/"
    }
    return this.options.LinkPrefix + "/";
  }

  /**
   * 获取link链接
   * @param url   url地址
   * @param hash  是否添加hash值
   * @returns 
   */
  getLink(url:string, hash: string){
    let hashValue = '';
    if(hash){
      hashValue = `?hash=${getHash(6)}`;
    }
    // 如果用户设置的是url直接返回url
    if(isUrl(url)){
      return url;
    }
    
    const prefix = this.userLinkPrefix();
    return `${prefix}${pathTurn(url)}${hashValue}`;
  }

  /**
   * 添加内联表 包括css与js icon等等
   * @param html        页面html
   * @param menuInfo    菜单详细信息
   * @param other       其他数据
   * @returns 
   */
  addInline(html:string, menuInfo:any, other){
    const styles = this.options.styles;
    const scripts = [...this.options.scripts, ...other.scripts];
    const $ = cheerio.load(html);
    const favicon = this.options.favicon;
    // 添加页面的icon
    $('head').append(`<link rel="shortcut icon" type="image/x-icon" href="${favicon}" />`);
    
    // 添加网站的 meta keywords
    if(!_.isEmpty(menuInfo.keywords)){
      $('head').append(`<meta name="keywords" content="${menuInfo.keywords}" />`);
    }

    // 添加网站的 meta description
    if(!_.isEmpty(menuInfo.description)){
      $('head').append(`<meta name="description" content="${menuInfo.description}" />`);
    }

    // 样式表
    styles.filter(item => !_.isEmpty(item.url)).forEach(item => {
      const label = item.pos === 'bottom' ? 'body' : 'head'
      $(label).append(`<link rel="stylesheet" href="${this.getLink(item.url, item.hash)}"/>`);
    });

    // 代码表
    scripts.filter(item => !_.isEmpty(item.url)).forEach(item => {
      const label = item.pos === 'bottom' ? 'body' : 'head'
      $(label).append(`<script src="${this.getLink(item.url, item.hash)}"/>`);
    });
    
    return $.html();
  }
  /**
   * 其他数据
   * @param doc 
   * @returns 
   */
  getOther(doc:DocType){
    const scripts = [];
    scripts.push({ url: doc.pageDataName });
    return {
      scripts
    }
  }
  // 获取页面内容
  getContent(doc: DocType){
    // 获取文档自定义属性
    // 获取当前文档小面的详情
    const menuInfo = menuState.getInfo(doc.name, doc.context);
    const html = ejs.render(this.contentView, {
      content: this.md(doc.context.replace(attrReg, "")),
      title: this.getTitle(menuInfo.title || ''),
      // 获取版本号
      version: this.package.version,
    });
    
    // 判断是否生成文档大纲
    if(this.options.createDir){
      privateState.set("doc_dir", getDocDir(doc.context));
    }
    // 生成菜单供前端使用
    globalState.set(this.options.docMenu, menuState.get());
    privateState.set(this.options.docComponents, componentsState.getHtml());
    return this.addInline(html, menuInfo, this.getOther(doc));
  }
  // 启动插件
  apply(compiler: webpack.Compiler) {
    const pluginName = Markdown.name;

    // 直接从编译器中访问webpack模块实例
    const { webpack } = compiler;

    // 获取webpack内置常量
    const { Compilation } = webpack;

    // 原始资源
    const { RawSource } = webpack.sources;
    
    // compilation 对象创建完成时候调用
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      // 在生产资产的时候调用
      compilation.hooks.processAssets.tap(
      {
        name: pluginName,
        // 所有资产都已经被其他插件添加到编译中
        stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
      },
      () => {
        // 删除默认的资源main
        if(compilation.getAsset("main.js")){
          compilation.deleteAsset("main.js");
        }

        // 将新资产添加到编译中
        // 由输出目录中的网页包生成
        const mdContent = mdCache.get('mdContent');
        for(let i in mdContent){
          const item = mdContent[i];
          if(!compilation.getAsset(item.name)){
            item.pageDataName = `${this.options.pageDataNamePrefix}_${item.hash}.js`;
            // 添加当前页面到资源中去
            compilation.emitAsset(item.name, new RawSource(this.getContent(item)));
            // 添加当前页面的js数据到资源中去
            compilation.emitAsset(item.pageDataName, new RawSource(privateState.getHtml()));
          }
        }
        
        mdCache.set("mdContent", []);
        // 如果用户设置模板那么就需要生成data数据
        // 以及在资源列表中dataScript不存在的情况
        if(!compilation.getAsset(syscof.dataScript)){
          compilation.emitAsset(syscof.dataScript, new RawSource(globalState.getHtml()));
        }
      });
    });
  }
}

export default WebpackMarkdown
module.exports = WebpackMarkdown;