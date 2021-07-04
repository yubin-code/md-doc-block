import Win from '../public/win';
// 生成JSON
export default class Code extends Win{
  // 过滤掉的因为这些属性因为需要重新定义
  private level = ['bash', 'api', 'json'];

  // 设置类型
  protected type = "code";
  
  // 渲染器
  renderer(text: string, level: string) {
    if(this.level.indexOf(level) != -1){
      return text;
    }
    const cof = this.getCof();
    return this.renderHtml({
      openfile: [{
        suffix: level,
        key: "key",
        name: "code",
        code: text
      }],
      cof,
      docType: "code"
    });
  }

}

