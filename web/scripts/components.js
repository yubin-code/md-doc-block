/**
 * 组件的js
 */
import { Code, Browser, Mobile, Termin, ApiDoc, Dom  } from 'md-doc-plug';
import http from './utils/http';
import _ from './utils/type';

/**
 * 代码预览功能
 * @param {*} id 
 * @param {*} data 数据
 */
export function codePreview(id, data) {
  const docDom = document.getElementById(id);
  const cof = data.cof || {};
  const tool = {}
  
  if(cof.copy){
    tool.copy = cof.copy;
  }

  if(data.zip){
    tool.zip = data.zip;
  }

  if(data.github){
    tool.github = data.github
  }
  
  const code = new  Code(Object.assign({
    tool,
    projectName: data.projectName,
  },cof));

  // 设置目录
  code.setDir(data.catalogue);
  // 点击目录的时候
  code.dirClick = (param, dom) => {
    if(param.isExischild)
      return;
    code.setLoad(true, "文件打开中...");
    // 点击打开文件发起请求
    http.GetText(param.path, (res) => {
      const file = {
        key: param.path,      // key 唯一值
        name: param.name,     // 文件名字
        code: res.response,   // 代码
        suffix: param.suffix  // 后缀
      };
      if(_.isObj(file.code)){
        file.code = JSON.stringify(res.response, null, 2);
      }
      code.setLoad(false);
      // 打开文件
      code.openFile(file);
    });
  }
  // 设置默认打开的文件
  code.defaultOpenFile(data.openfile);
  
  // 最后渲染
  Dom.replace(docDom, code.getElement());
}


/**
 * 手机预览
 * @param {*} id 
 * @param {*} data 
 */
export function mobilePreview(id, data) {
  const docDom = document.getElementById(id);
  const mobile = new Mobile(data);
  if(data.src){
    mobile.open(data.src);
  }
  if(data.title){
    mobile.setTitle(data.title);
  }
  Dom.replace(docDom, mobile.getElement());
}


/**
 * 网页预览
 * @param {*} id 
 * @param {*} data 
 */
export function browserPreview(id, data) {
  const docDom = document.getElementById(id);
  const cof = data.cof || {};
  const tool = {};
  if(cof.blank){
    tool.blank = cof.blank
  }
  
  const browser = new Browser(Object.assign({ tool },cof));
  // 设置打开地址
  if(data.src){
    browser.open(data.src);
  }
  
  // 设置title
  if(data.title){
    browser.setTitle(data.title);
  }
  
  Dom.replace(docDom, browser.getElement());
}

/**
 * 终端预览
 * @param {*} id 
 * @param {*} data 
 */
export function terminPreview(id, data) {
  const docDom = document.getElementById(id);
  const termin = new Termin({
    command: data.command
  });
  termin.setTitle("zsh");
  Dom.replace(docDom, termin.getElement());
}

/**
 * api 预览
 * @param {*} id 
 * @param {*} data 
 */
export function apiDocPreview(id, data) {
  const docDom = document.getElementById(id);
  const apiDoc = new ApiDoc({});
  // 设置文档
  if(data.doc){
    apiDoc.setDoc(data.doc);
  }
  apiDoc.setTitle("api文档");
  Dom.replace(docDom, apiDoc.getElement());
}


// 运行组件
export default function components() {
  for(let i in docComponents){
    const item = docComponents[i];
    if(item.type == "code"){
      codePreview(item.key, item.data);
    }
    if(item.type == "api"){
      apiDocPreview(item.key, item.data);
    }
    if(item.type == "browser"){
      browserPreview(item.key, item.data);
    }
    if(item.type == "mobile"){
      mobilePreview(item.key, item.data);
    }
    if(item.type == "termin"){
      terminPreview(item.key, item.data);
    }
  }
}