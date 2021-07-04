import Menu from './pubilc/menu'
import docDir from './pubilc/docDir'
import Components from './components'
window.onload = () => {
  new Menu({
    dom: document.getElementById('navigation'),
    search: document.getElementById('menu-search'),
    retract: document.getElementById('menu-retract'),
    book: document.getElementById('doc-book'),
    menu: docMenu,
    multiple: docMultiple,
  });
  // 渲染组件
  Components();

  try{
    // 文档目录
    docDir({
      dom: document.getElementById('docDir')
    });
  }catch(e){}
}

// window.onerror = function (message, url, lineNo, columnNo, error){

// }

