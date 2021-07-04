/**
 * 植入页面的 js
 */
const variable = new Map();

// 私有的变量
export default {
  set(key: string, value: any){
    variable.set(key, value);
  },
  del(){},
  update(){},
  getHtml(){
    let str = "";
    variable.forEach((value, key) => {
      str += `var ${key} = ${JSON.stringify(value)};\n`;
    });
    return str;
  },
}