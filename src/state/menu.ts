import _ from "lodash";
import { getAnnotation } from '../utils/reg';

/**
 * 菜单方法用于生成修改添加等等操作
 */

const MenuMap = new Map();

// 匹配文档中附加信息的正则
export const menuField = ['type', 'isDir', 'key', 'path', 'url'];

// 添加菜单附加信息
const getMenuAttr = (item: any, content: string) => {
  const annotation = getAnnotation(content);
  // 过滤不允许用户设置的字段
  menuField.map(key => {
    delete annotation[key];
  });
  
  return {
    ...item,
    ...annotation,
  }
}

/**
 * 替换菜单中内容
 * @param menuTree 菜单树
 * @param attr     被替换的内容
 */
const replaceMenu = (menuPath:string, attr: any, menuTree:any) => {
  let isUpdate = false;
  for(let i in menuTree){
    const item = menuTree[i];
    // 判断是否是目录
    if(item.isDir){
      const replace:any = replaceMenu(menuPath, attr, item.children );
      item.children = replace.menuTree;
      isUpdate = replace.isUpdate;
    }
    
    // 找到一直的值
    if(item.path === menuPath){
      const newItem = {...item, ...attr}
      // 判断属性是否发生改变
      if(!_.isEqual(item, newItem)){
        menuTree[i] = newItem;
        isUpdate = true;
      }
    }
  }

  return {
    menuTree,
    isUpdate
  };
}

/**
 * 搜索菜单
 * @param menuTree 菜单树
 * @param MenuPath 菜单路径
 */
const searchMenu = (MenuPath: string, menuTree: any) => {
  let menuItem = {};
  for(let i in menuTree){
    const item = menuTree[i];
    if(item.path === MenuPath){
      return item;
    }

    // 搜索子类
    if(item.children){
      const children:any = searchMenu(MenuPath, item.children);
      if(!_.isEmpty(children)){
        return children
      }
    }
  }

  return menuItem;
}

export default {
  /**
   * 创建菜单
   * @param menuPath 菜单存放地址
   * @param menuTree 菜单结构
   */
  create(menuTree:any){
    MenuMap.set('menu', menuTree);
  },
  /**
   * 更新菜单
   * @param docsPath  文档根目录
   * @param docItem   当前文档路径
   */
  update(docsPath:string, content: string){
    const menuTree = MenuMap.get('menu');
    const attr = getMenuAttr({}, content);
    const newMenu = replaceMenu(docsPath, attr, menuTree);

    // 判断是否更新数组
    if(newMenu.isUpdate){
      MenuMap.set('menu', newMenu.menuTree);
    }
  },
  /**
   * 获取菜单详细信息
   * @param docsPath 菜单路径
   * @param content  当前菜单的内容
   * @returns 
   */
  getInfo(docsPath: string, content: string){
    const key = `/${docsPath.replace("html", "md")}`;
    this.update(key, content);
    return searchMenu(key, MenuMap.get('menu'))
  },
  /**
   * 获取菜单
   * @returns 
   */
  get(){
    // 不是多文档模式直接返回menu
    return MenuMap.get('menu');
  }
}