import marked from 'marked';
import _ from 'lodash';
import { getMethodPath, pluginLoader } from '../../service/pluginLoader';
import { oneUpperCase, getFileName } from '../../utils/index';
import { readDirTree } from '../../utils/file';

class Markdown{
  // 类型
  protected types = ['Html', 'Code'];
  // 插件目录
  protected plugPath = "Plugins/Markdown";
  md: string;
  // 用户运行目录
  cwd: string;
  // 存放代码的路径
  userCodePath: string|null;
  // 存放用户传过来的参数
  opts: any;
  // 保存插件
  plugClass: any;

  // 代码库目录结构
  codeTree: any;
  constructor(opts:any){
    this.md = '';
    this.cwd = opts.cwd;
    this.opts = opts;

    this.codeTree = [];
    this.plugClass = {};
    
    this.userCodePath = opts.codePath;

    this.loadCodePath();    // 加载代码目录
    this.loadPlug();        // 加载插件
  }
  
  // 加载所有示例代码路径
  loadCodePath(){
    if(!this.userCodePath){
      return
    }
    this.codeTree = readDirTree(this.userCodePath);
  }
  
  // 加载插件
  loadPlug(){
    let plugPath = getMethodPath(`${this.plugPath}/plug`);
    plugPath = plugPath.filter((item: string | string[]) => item.indexOf('index.js') == -1);
    // 通过路径获取插件class
    this.plugClass = plugPath.map((item: any) => {
      const cla = pluginLoader(item);

      // 如果不是类就不执行了
      if(typeof cla !== 'function'){
        return {}
      }
      const example = new cla();
      // 过滤没有写类型的class 
      if(!example.type){
        return {}
      }
      const upperCase = oneUpperCase(example.type);
      const fileName = getFileName(item);
      // 不支持的类型
      if(this.types.indexOf(upperCase) == -1){
        return {};
      }
      
      // 拿到mdconf 配置
      example.mdcof = this.opts.mdcof
      // 保存代码目录
      example.codeTree = this.codeTree;
      // 组件id前缀
      example.componentsIdPrefix = this.opts.componentsIdPrefix;
      // 给插件用户执行程序的路径
      example.cwd = this.cwd;
      // 代码存放路径
      if(this.userCodePath){
        example.codePath = this.userCodePath;
      }
      
      // 提供默认调用函数
      if(_.isFunction(example.apply)){
        example.apply();
      }

      return {
        type: upperCase,
        name: fileName,
        class: example
      };
    }).filter(item => item.name);

    marked.use({ renderer: this.renderer() });
  }

  /**
   * 执行插件
   * @param type      执行的类型
   * @param text      内容
   * @param level     是什么元素
   * @param renderer  渲染模式
   * @returns 
   */
  exePlug(type: string, text: string, level?:string, rendererType:string="renderer"){
    const plugClass = this.plugClass;
    plugClass.map((item:any) => {
      if(item.type == type){
        // class 没有renderer方法就直接返回原来数据
        const renderer = item.class[rendererType]?.bind(item.class);
        if(!_.isFunction(renderer)){
          return;
        }
        
        text = renderer(text, level) || text;
      }
    });
    
    return text
  }

  // 载入每一个插件
  renderer(){
    return {
      code: (text:string, level:string) => {
        return this.exePlug('Code', text, level);
      },
      html: (text:string) => {
        return this.exePlug('Html', text);
      },
      listitem: (body, task, checked) => {
        let className = '';
        if(task){
          className = 'task-item'
        }
        return `<li class="${className}">${body}</li>\n`;
      }
    }
  }

  
  // 返回内容
  content(md: string){
    /**
     * md渲染之前先用自定义的完整渲染器渲染一遍
     * 因为 marked 换行会导致内容渲染分隔导致内容不完整
     */
    return marked(this.exePlug("Html", md, "html", "fullRenderer"));
  }
}

export default Markdown;