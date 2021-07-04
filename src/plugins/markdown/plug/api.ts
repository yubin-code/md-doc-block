import Win from '../public/win';
// 生成API
export default class Api extends Win{
  // 设置类型
  protected type = "code";

  // 渲染器
  renderer(text: string, level: string) {
    if(level != "api"){
      return text;
    }
    return this.renderHtml({ doc: text, docType: "api" });
  }
}