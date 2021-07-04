import PlugBase from '../plugBase';

// 示例代码
export default class Example extends PlugBase{
  protected type = "html";    // 类型
  
  // 渲染器
  renderer(text: string, level: string) {
    return text.replace(/<example.*?(?:>|\/>)/g, (v,i) => {
      return "example"
    });
  }
}