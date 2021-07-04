import _ from './type'
/**
 * 打开新页面并把内容注入到新到页面中去
 * @param {*} content 
 */
export function openBlankWindow(content) {
  const win = window.open("", "winEx2","");
  win.document.open("text/html", "replace"); 
  win.document.write(content);
  win.document.close(); 
}

  /**
   * 时间切换一般用来做点击以后过几秒自动回退等操作
   * @param {*} start 
   * @param {*} end 
   * @param {*} time 
   */
export function timeToggle(start, end, time=2000){
  _.isFunction(start) && start();
  setTimeout(() => {
    _.isFunction(end) && end();
  }, time);
}

/**
 * 把text转为json 如何不能转则直接返回text
 * @param {*} text 
 */
export function textToJson(text){
  try{
    return JSON.parse(text);
  }catch(e){
    return text;
  }
}

// 获取路径名称
export function getPathName (pathFile) {
  const pos = pathFile.lastIndexOf('/');
  return pathFile.substring(pos + 1);
}

/**
 * 下载文件
 * @param {}} content 
 */
// export function openWindow(content) {
//   const win=window.open('','','top=10000,left=10000');
//   win.document.write(content)
//   win.document.execCommand('SaveAs','','byhu.htm')
//   win.close();
// }
