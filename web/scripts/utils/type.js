export default {
  isString(str){
    return Object.prototype.toString.call(str)=="[object String]"
  },
  /**
   * 判断是否是空值
   * @param {*} value 
   * @returns 
   */
  isEmpty(value){
    if(value == null || value == "" || value == "undefined" || value == undefined || value == "null"){
        return true;
    }else{
      if(this.isString(value)){
        value = value.replace(/\s/g,"");
        if(value == ""){
            return true;
        }
      }
      if(this.isObj(value)){
        value = JSON.stringify(value);
        if(value == "[]" || value == "{}"){
          return true;
        }
      }
      return false;
    }
  },
  // /**
  //  * 判断是否是Dom元素
  //  * @param {*} item 
  //  * @returns 
  //  */
  // isDom(item) {
  //   // 首先判断是否支持HTMLELement，如果支持，使用HTMLElement，如果不支持，通过判断DOM的特征，如果拥有这些特征说明就是ODM节点，特征使用的越多越准确
  //   return (typeof HTMLElement === 'function') ? (item instanceof HTMLElement) : (item && (typeof item === 'object') && (item.nodeType === 1) && (typeof item.nodeName === 'string'));
  // },
  /**
   * 判断是否是函数
   * @param {*} fn 
   * @returns 
   */
  isFunction (fn){
    return typeof fn == "function";
  },
  // /**
  //  * 判断是否是数组
  //  * @param {*} arg 
  //  * @returns 
  //  */
  // isArray(arg){
  //   return Array.isArray(arg)
  // },
  /**
   * 判断是否是对象
   * @param {*} obj 
   */
  isObj(obj){
    return Object.prototype.toString.call(obj) == '[object Object]'
  },
  // /**
  //  * 判断是否是数字
  //  * @param {*} value 
  //  */
  // isNumber(value){
  //   return typeof value === 'number' && !isNaN(value);
  // }
}