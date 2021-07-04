import ejs from 'ejs';
import _ from 'lodash';
import componentsState from '../../state/components'
import { getHash } from '../../utils/index'

// 基类
export default class PlugBase {
  public mdcof = {};          // md配置
  public cwd = "";            // 用户执行命令
  public codePath = "";       // 代码存放目录路径
  public codeTree = {};       // 代码目录结构
  public componentsIdPrefix = "" // 组件id前缀
    
  // 获取属性
  getAttr(text:string, attr: string){
    const reg =new RegExp(attr+"=[\\'\\\"]?([^\\'\\\"]*)[\\'\\\"]?","i");
    const src = text.toLowerCase().match(reg);
    if(src){
      return src[1] || null;
    }
    return null;
  }

  // 渲染html
  renderHtml(data: { [key: string]: any }){
    const hash = getHash(8);
    // 把当前组件添加至变量合集
    componentsState.set(hash, data);
    // const template = `<div class="${data.class}" data="<%= data %>"></div>`;
    const template = `<div id="${this.componentsIdPrefix}${hash}" key="${data.docType}">
      <div class="component-loading"></div>
    </div>`;
    return ejs.render(template, {});
  }
}