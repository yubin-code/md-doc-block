import _ from 'lodash';
import PlugBase from '../plugBase';
// 窗口类
export default class Win extends PlugBase{
  // md 配置
  public mdcof:any = {};
  // 获取系统配置与本地配置
  getCof(word=""){
    // win部分
    const closeOff = this.getAttr(word, "closeOff");        // 关闭窗口关闭功能
    const narrowOff = this.getAttr(word, "narrowOff");      // 关闭窗口缩小功能
    const screenOff = this.getAttr(word, "screenOff");      // 关闭窗口全屏功能
    const height = this.getAttr(word, "height");            // 设置窗口高度
    const minHeight = this.getAttr(word, "minHeight");      // 设置窗口最小高度
    const maxHeight = this.getAttr(word, "maxHeight");      // 设置窗口最大高度

    // code部分
    const closeRetract = this.getAttr(word, "closeRetract");// 是否关闭菜单收起功能
    const closeFile = this.getAttr(word, "closeFile");      // 是否禁止关闭文件
    const hideLine = this.getAttr(word, "hideLine");        // 是否隐藏代码行
    const copySuffix = this.getAttr(word, "copySuffix");    // 设置复制后缀
    const copy = this.getAttr(word, "copy");                // 判断是否开启复制
    
    // 浏览器部分
    const blank = this.getAttr(word, "blank");              // 是否在新页面打开
    
    const win = this.mdcof.win || {};
    const code = this.mdcof.code || {};
    const browser = this.mdcof.browser || {};

    const conf:any = {
      closeOff: closeOff || win.closeOff,
      narrowOff: narrowOff || win.narrowOff,
      screenOff: screenOff || win.screenOff,
      height: height || win.height,
      minHeight: minHeight || win.minHeight,
      maxHeight: maxHeight || win.maxHeight,
      closeRetract: closeRetract || win.closeRetract,
      closeFile: closeFile || win.closeFile,
      hideLine: hideLine || win.hideLine,
      blank:  blank || browser.blank,
      copy: code.copy,
    }

    // 设置复制后缀
    if(!_.isEmpty(copySuffix)){
      conf.copy = { copySuffix }
    }

    // 判断是否开启复制
    if(copy == "false"){
      conf.copy = undefined;
    }
    
    return conf
  }
  // apply(){
  // }
}

