import Win from '../public/win';
// 生成终端
export default class Termin extends Win{
  // 设置类型
  protected type = "code";

  // 渲染器
  renderer(text: string, level: string) {
    if(level != "bash"){
      return text;
    }
    
    return this.renderHtml({ command: text, docType: "termin" });
  }
}