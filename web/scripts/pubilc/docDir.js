import { Dom } from 'md-doc-plug';
/**
 *  添加文档目录操作
 */
export default () => {
  // 不存在不操作
  if(!doc_dir){
    return
  }
  const retract = Dom.create("div", { class: "retract" }, [
    Dom.create("i", { class: "iconfont icon-back" })
  ]);
  const docDir = Dom.create("ul", { class: "doc-dir doc-dir-hide" });
  
  let str = ""
  // 循环菜单
  for(let i in doc_dir){
    const item = doc_dir[i];
    str += `<li class="level-${item.level}"><a href="#${item.title}">${item.title}</a></li>`;
  }

  Dom.inner(docDir, str);
  Dom.append(docDir, retract);

  Dom.addEvent(retract, "click", (e) => {
    const className = ["doc-dir"]
    if(docDir.className.indexOf("doc-dir-hide") == -1){
      className.push("doc-dir-hide");
    }
    docDir.className = className.join(" ");
  });

  Dom.append(document.body, docDir);
}