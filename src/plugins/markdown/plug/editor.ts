import path from 'path';
import Win from '../public/win';
import { getFileSuffix, pathTurn, getHash } from '../../../utils/index'
import { isFileExis, readFile } from '../../../utils/file'
import _ from 'lodash';
// 编辑器解析器
export default class Editor extends Win{
  // 设置类型
  protected type = "html";
  public codeTree = {};               // 代码目录

  // 获取当前目录的名字   
  codeTreeChildren(tree:any, name: string){
    for(let i in tree){
      const item = tree[i];
      if(item.name == name){
        return item;
      }
    }
    return null;
  }

  // 获取代码库目录
  getCodeFile(url: string){
    const codePath = url.replace(".", "").split("/");
    const filePath = codePath.filter(item => item !== '');
    let catalogue = this.codeTree;
    let fileName = '';
    
    for(let i in filePath){
      const item = filePath[i];
      const tree = this.codeTreeChildren(catalogue, item);
      
      // 说明没有目录
      if(tree == null){
        return {};
      }

      fileName = tree.name;
      catalogue = tree.children;
    }

    return {
      // 目录结构
      catalogue,
      // 项目名字
      projectName: fileName
    };
  }

  /**
   * 获取默认打开的文件
   * 只获取一目录
   * @param word md的自定义标签
   * @param file 文件目录结构
   * @returns 
   */
  getDefaultOpenFile(word:string, src: string){
    const defaultOpenFile = this.getAttr(word, "defaultOpenFile");
    if(!defaultOpenFile){
      return [];
    }
    const filelist = defaultOpenFile.split(",");
    return filelist.map((item, index) => {
      const name = item.trim();
      const codePath = path.resolve(this.codePath, pathTurn(src), name);
      return {
        key: "/" + path.join(pathTurn(src), name),   // 文件请求路径
        suffix: getFileSuffix(name),  // 文件后缀
        name: name,     // 文件名字
        // 判断文件是否存在
        isExist: isFileExis(codePath),
        code: readFile(codePath),
      }
    });
  }
  /**
   * 获取参数
   * @param word 
   */
  getParam(word){
    const projectName = this.getAttr(word, "projectName");  // 项目名字
    const zip = this.getAttr(word, "zip");                  // 判断是否设置压缩包
    const github = this.getAttr(word, "github");            // 是否关闭菜单收起功能

    return {
      projectName,
      zip,
      github
    }
  }

  /**
   * 给的是完整的md字符串
   * 因为在marked中换行会导致模版被切割所以这块需要单独做一次渲染
   * @param text 
   * @returns 
   */
  fullRenderer(text){
    // 双标签匹配
    const reg = /<editor[\s\w\"\'=\u4e00-\u9fa5]*?>([\s\S]*?)<\/editor>/g;
    return text.replace(reg, (word,value) => {
      // 获取配置
      const cof = this.getCof(word);
      // console.log(this.getAttr(word, "copy"));
      // 获取语言
      const defaultOpenFile = [];
      // 匹配子元素的代码
      value.replace(/```([\s\S]*?)```/g, (w,v) => {
        let name = w.match(/```([\w\.]*?)\s/) || [];
        name = (name[1] || '');
        const code = w.match(new RegExp("```"+name+"([\\s\\S]*?)```"));
        if(_.isEmpty(code)) return;

        // 生成需要打开的文件
        defaultOpenFile.push({
          key: getHash(8),
          suffix: getFileSuffix(name),
          name: name || '',
          // 把第一个换行符号替换成""
          code: code[1].replace(/\n/, "") || '',
        });
      });

      return this.renderHtml({ ...this.getParam(word), cof, openfile: defaultOpenFile, docType: "code", });
    });
  }
  // 渲染器
  renderer(text: string, level: string) {
    return text.replace(/<editor.*?(?:>|\/>)/g, (word) => {
      const src = this.getAttr(word, "src");      // 获取目录链接
      if(src){
        const fileTree = this.getCodeFile(src);


        
        // 获取配置
        const cof = this.getCof(word);
        /**
         * 默认打开的文件
         * 没有设置默认打开index.html
         */
        const defaultOpenFile = this.getDefaultOpenFile(word, src);

        // 获取文件后缀
        const data = {
          ...fileTree,
          ...this.getParam(word),
          cof,
          // 默认打开文件
          openfile: defaultOpenFile,
          docType: "code",
        };

        return this.renderHtml(data);
      }
      return text
    });
  }
}