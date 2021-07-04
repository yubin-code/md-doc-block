import _ from "lodash";

// 正则工具

// 匹配文档中附加信息的正则
export const attrReg = /---([\s\S]*?)---/;
// 匹配文档中的标题
export const titleReg = /(#+)[\s+][^#][^\n]*?(?:\n)/g;

/**
 * 获取注解内容
 * @param item 
 * @param content 
 */
export const getAnnotation = (content: string) => {
  const obj = {};
  content.replace(attrReg, (word, args) => {
    // 按行分割
    const attrArray = args.split("@");
    // 循环数据
    attrArray.map((item: string) => {
        // 把换行符号与空格全部清空
        item = item.replace(/\n/g, "").replace(/\s+/g, "");
        const kv = item.split(":");
        /**
         * 获取key value
         * 获取条件三个
         * 1.key不能为空
         * 2.value不允许为空
         * 3.必须有@说明他是key 
         */
        if(!_.isEmpty(kv[0]) && !_.isEmpty(kv[1])){
          obj[kv[0]] = kv[1];
        }
      });

    return ""
  });


  return obj;
}


/**
 * 判断是否是url地址
 * @param url
 * @returns 
 */
 export function isUrl(url) {
  const reg = new RegExp('^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$', 'i');
  return reg.test(url);
}

/**
 * 生成文档大纲
 * @param text 
 */
 export function getDocDir(text) {
  const match = text.match(titleReg);
  let arr = [];
  for(let i in match){
    const item = match[i];                      // 获取当前的标题
    const level = item.split('#').length -1;    // 根据#来判断标题的级别
    const title = item.replace(/^#+/, '').replace(/[\s\n]/g, '');
    arr.push({
      level,
      title
    });
  }
  return arr;
}