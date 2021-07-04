import _ from './type'
import { textToJson } from './index';
/**
 * @param {*} url 请求地址
 * @param {*} method 请求方式 get post
 */
const Request = (url, method, param, callback, header={}) => {
  /**
   * code for IE7+, Firefox, Chrome, Opera, Safari
   * 不写 new ActiveXObject("Microsoft.XMLHTTP"); 不对ie5，6 做兼容
   * 用ie5，6的人别用我写的程序
   */
  const xhr = new XMLHttpRequest();
  const linkPrefix = docLinkPrefix == "/" ? '' : docLinkPrefix;
  xhr.open(method, linkPrefix + url, true);

  // const param = 'username='+username+'&password='+password;
  
  // 添加header信息
  if(_.isObj(header)){
    for(let i in header){
      xhr.setRequestHeader(i, header[i]);
    }
  }
  
  // 空数据
  if(_.isEmpty(param)){
    param = {}
  }
  
  xhr.send(param);
  /**
   * ""|text|document|json|blob|arrayBuffer
   * @returns 
   */
  // xhr.responseType = 'json';
  // 请求成功回调用
  xhr.onreadystatechange= () => {
    /**
     * 0 - (未初始化)还没有调用send()方法
     * 1 - (载入)已调用send()方法，正在发送请求
     * 2 - (载入完成)send()方法执行完成，
     * 3 - (交互)正在解析响应内容
     * 4 - (完成)响应内容解析完成，可以在客户端调用了
     */
    if (xhr.readyState==4){
      return _.isFunction(callback) && callback({
        status: xhr.status,
        response: textToJson(xhr.response),
        responseURL: xhr.responseURL,
      });
    }
  }
}

/**
 * get请求
 * @param {*} url 
 * @param {*} param 
 * @param {*} header 
 * @returns 
 */
const Get = (url, param, callback, header) => {
  return Request(url, 'get', param, callback, header)
}

/**
 * post 请求
 * @param {*} url 
 * @param {*} param 
 * @param {*} header 
 * @returns 
 */
const Post = (url, param, callback, header) => {
  return Request(url, 'post', param, callback, header)
}

/**
 * 请求文档
 * @param {*} url 
 * @param {*} callback 
 * @returns 
 */
const GetText = (url, callback) => {
  return Request(url, 'get', {}, callback)
}

// 导出
export default {
  Request, Get, Post, GetText
}
