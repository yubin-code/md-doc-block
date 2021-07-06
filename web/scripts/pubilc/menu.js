import { Tree, Dom } from 'md-doc-plug';
import { setLocal, getLocal } from '../utils/local'
import _ from '../utils/type'
/**
 * 创建菜单
 */
export default class Menu{
  constructor(obj){
    this.dom = obj.dom;
    this.multiple = obj.multiple;
    this.menu = obj.menu;
    this.searchDom = obj.search;
    this.retract = obj.retract;
    this.book = obj.book;
    // 前缀
    this.linkPrefix = docLinkPrefix == "/" ? "/" : docLinkPrefix;

    this.create();
    Dom.addEvent(this.retract, "click", this.retractClick.bind(this));
    if(Dom.getDocWidth() < 700){
      Dom.addClass(this.book, "hide-menu");
    }
  }

  /**
   * 菜单中间间隙
   * @param {*} count 
   * @returns 
   */
  getUnit(count){
    let str = ""
    for(let i=0;i<count;i++){
      str += "<span class='menu-unit'></span>";
    }
    return str;
  }
  /**
   * 菜单模板
   * @param {*} item 
   * @returns 
   */
  template(item){
    const key = getLocal('menu-key');
    return `
      <div
        class="item${
          item.children ? ' menu-dir' : ' menu-file'
        }${
          item.highlight ? ' highlight':''
        }
        ${
          item.key == key ? ' avtive': ''
        }">
        <a ${item.children ? '' : "href='"+this.linkPrefix+item.url+"'"}>
          ${this.getUnit(item.count)}
          <span class="title">${item.title || item.name}</span>
        </a>
      </div>`
  }

  /**
   * 菜单被点击的时候
   * @param {*} child 
   * @returns
   */
  menuClick(child){
    // 如果是有子级的元素被点击就不触发事件
    if(child.isExischild == 'true'){
      return
    }
    setLocal('menu-key', child.key);
  }

  /**
   * 创建菜单
   * @returns 
   */
  create(){
    const tree = new Tree({
      clickClass: 'item',  // 被点击的class
      childClass: 'child',  // 子元素的class
      keyHighlight: 'highlight', // 被搜索的时候高亮
      disableOpen: true,        // 是否禁用菜单打开关闭功能
      template: this.template.bind(this),  // 菜单模板
    });
    // let height = Dom.getDocHeight();
    tree.click = this.menuClick.bind(this);    // 菜单被点击的时候
    const search = getLocal('search');
    
    // 搜索功能初始化
    this.searchInit(tree);
    // 非多文档模式
    if(!this.multiple){
      tree.setSource(this.menu);
      // 判断是否有默认搜索
      if(!_.isEmpty(search)){
        tree.search(search, 'title');
      }
      Dom.append(this.dom, tree.getElement());
      return;
    }
    
    // 多文档模式处理
    let pathname = window.location.pathname;
    pathname = pathname.split("/").filter(item => item !== '');
    const docs = pathname[0];
    for(let i=0;i<this.menu.length;i++){
      const item = this.menu[i];
      if(item.name == docs){
        tree.setSource(item.children);
        if(!_.isEmpty(search)){
          tree.search(search, 'title');
        }
        Dom.append(this.dom, tree.getElement());
        return;
      }
    }
  }
  
  /**
   * 搜索功能
   */
  searchInit(treeController){
    this.searchDom.addEventListener('keydown', (event) => {
      // 回车事件
      if(event.keyCode === 13){
        const value = event.target.value;
        setLocal('search', value);
        treeController.search(value, 'title');
      }
    }, true)
  }
  /**
   * 显示隐藏菜单
   * @returns 
   */
  retractClick(){
    if(Dom.hasClass(this.book, "hide-menu")){
      Dom.delClass(this.book, "hide-menu");
      return;
    }
    Dom.addClass(this.book, "hide-menu");
  }
}