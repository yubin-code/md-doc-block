import { getAnnotation } from './reg';

// 匹配文档中附加信息的正则
export const menuField = ['type', 'isDir', 'key', 'path', 'url', 'children'];

export default {
  /**
   * 获取文档自定义的属性
   * @param content 文档的内容
   * @returns 
   */
  getAttr(content: string){
    const annotation = getAnnotation(content);
    // 过滤不允许用户设置的字段
    menuField.map(key => {
      delete annotation[key];
    });
    
    return annotation;
  }

}