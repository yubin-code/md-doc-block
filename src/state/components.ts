import cof from "../config/config"

const variable = new Map();

// 组件数据变量
export default {
  set(key: string, value: any){
    variable.set(key, value);
  },
  add(){},
  del(){},
  update(){},
  // 清空数据
  getHtml(){
    const varName = cof.varName
    const arr = [];
    variable.forEach((data, key) => {
      arr.push({
        key: varName.componentsIdPrefix + key,
        type: data.docType,
        data
      });
    });
    // 获取完数据就清空数据
    variable.clear();
    return arr;
  },
 }
