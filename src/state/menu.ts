import _ from "lodash";
import doc from '../utils/document';

/**
 * 菜单方法用于生成修改添加等等操作
 */

const MenuMap = new Map();
// 菜单平行数据
const MenuFlat = {};

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

    // 让他不存在引用关系
    const itemFlat = JSON.parse(JSON.stringify(menuTree[i]));
    delete itemFlat.children;
    // 保存平行数据
    MenuFlat[item.path] = itemFlat;
  }

  // 对数据排序
  menuTree = menuTree.sort((a, b) => a.sort - b.sort);
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

/**
 * 合并菜单
 * 用于用户新建文件的时候使用
 * @param menuTree 
 */
const mergeMenu = (menuTree:any) => {
  for(let i in menuTree){
    const item = menuTree[i];
    // 判断是否是目录
    if(item.isDir){
      const replace:any = mergeMenu(item.children);
      item.children = replace;
    }

    if(MenuFlat[item.path]){
      menuTree[i] = Object.assign(item, MenuFlat[item.path]);
    }
  }

  return menuTree;
}

export default {
  /**
   * 创建菜单
   * @param menuPath 菜单存放地址
   * @param menuTree 菜单结构
   */
  create(menuTree:any){
    MenuMap.set('menu', mergeMenu(menuTree));
  },

  /**
   * 更新菜单
   * @param docsPath  文档路径
   * @param newItem   菜单新的item 
   */
  update(docsPath:string, newItem: any){
    const menuTree = MenuMap.get('menu');
    const newMenu = replaceMenu(docsPath, newItem, menuTree);
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
    const newItem = doc.getAttr(content);
    this.update(key, newItem);
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