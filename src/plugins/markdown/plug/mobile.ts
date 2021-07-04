import PlugBase from '../plugBase';
// 生成预览器
export default class Mobile extends PlugBase{
  // 设置类型
  protected type = "html";
  public mdcof:any = {};

  
  getData(word:string){
    const mobile = this.mdcof.mobile || {};
    const src = this.getAttr(word, "src");                              // src 地址
    const type = this.getAttr(word, "type") || mobile.type;             // type 类型 空或者 ipx
    const isWechat = this.getAttr(word, "iswechat") || mobile.iswechat; // 是否开启微信小程序上面操作
    const scale = this.getAttr(word, "scale") || mobile.scale;          // 缩放
    const title = this.getAttr(word, "title") || '无标题';               // 标题


    return {
      src,
      type,
      title,
      isWechat,
      scale,
      docType: "mobile",
    }
  }
  // 渲染器
  renderer(text: string, level: string) {
    // 单标签匹配
    return text.replace(/<mobile.*?\/>/g, (word) => {
      const data = this.getData(word);
      return this.renderHtml(data);
    });
  }
}