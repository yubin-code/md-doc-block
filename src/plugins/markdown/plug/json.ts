import Win from '../public/win';
// 生成JSON
export default class Json extends Win{
  // 设置类型
  protected type = "code";

  // 渲染器
  renderer(text: string, level: string) {
    if(level != "json"){
      return text;
    }
    const cof = this.getCof();
    return this.renderHtml({
      openfile: [{
        suffix: level,
        key: "key",
        name: "json",
        code: text
      }],
      cof,
      docType: "code"
    });
  }
}