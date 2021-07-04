import PlugBase from '../plugBase';
// 生成树形目录
export default class Tree extends PlugBase{
  // 设置类型
  protected type = "code";
  protected templateName = 'tree';
  // 渲染器
  renderer(text: string, level: string) {
    if(level != "dir"){
      return text;
    }
    return 'tree';
  }
}