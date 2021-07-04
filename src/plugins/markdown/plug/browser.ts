import Win from '../public/win';
// 生成预览器
export default class Browser extends Win{
  // 设置类型
  protected type = "html";
  // 渲染器
  renderer(text: string, level: string) {
    
    // // 双标签匹配
    // const label = text.replace(/<browser>([\s\S]*?)<\/browser>/, (_,value:string) => {
    //   return this.renderHtml({ src: '', content: value });
    // });
    
    // 单标签匹配
    return text.replace(/<browser.*?\/>/g, (word) => {
      const cof = this.getCof(word);
      const src = this.getAttr(word, "src");
      const title = this.getAttr(word, "title");
      return this.renderHtml({ cof, src, title, docType: "browser" });
    });
  }
}
