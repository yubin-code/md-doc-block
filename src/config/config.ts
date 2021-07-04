import path from "path";
const root = path.join(__dirname, "../../");
// 默认系统配置
export default {
  root,
  /**
   * 用户模块配置
   */
  userConfigName: "md.json",        // 用户配置文件名字
  userCacheFile: ".md",             // 用户缓存目录
  userEntryFile: "index.js",        // 用户入口文件名
  cacheCatalogue: "catalogue",      // 缓存目录文件名字
  cacheMenu: "menu",                // 菜单缓存目录
  dataScript: "dataScript.js",      // 存放生成的菜单数据以及别的数据种类
  // 系统样式表
  _styles:[],
  // 系统script表
  _scripts:[{ url: 'dataScript.js', hash: true }],
  // 页面的icon
  _favicon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABXFBMVEUAAABnMApmLgpmLgpoMAhuORZlMAtmLwtmLwpmMApmMApnMAxqMw97TS9mLwqOaU9lLgqxlYJmLgpmLgtgMBCCUgh3RAnQv7TbzsV/UTNnMAtlMAvItKVmLwr/////aUv/4gCqj3zl5eX/e2CMYkeyl4T/18//4wz/+c2MXUDZWzvc3d2CVTf18vDiXj+DWj6MWTuMPRr/8QDt7u7/7enPvrLFsaO8pJP/l4HGUzNwNRH/+93i2NH/x7v/tKX/9J//n4yyTCp5SCigRyR5Phupgwb/4Nr/zsX17MH/wLP/r5//p5Wrk4P/8ID/jnehhnT/iXH/7mj/gWiffGX/60/1ZUfQVzezTCuWQR7/5RqphAbizALs5eDw1tH/+cjZy8L/+L//9J3/85Wwm46pinX/7WD/dVn/blHsYkP/6DipVTWMUzS8UjJ8TzH/5iaMQyGDOhZ5NhJ5RwmfdwYdINzAAAAAHXRSTlMAP8B/IP4w4NCAUPLm08+3sKygjxD++8/Lq5BgWDCjc4EAAAH3SURBVEjH3ZVnc5tAEIaRUbHlXtLzHucIUrAgSLa6ZMmS3B3XuKf3Xv//TO4EYwd054gPmcnk+bI7yz47B3eA8h8zNTI4FUoYASJh+gfwI5QQx6VTXA8h9OE0eznRe38UP7PZRURDrGiRC3GlZ/pxcoL+UDfNiCshQDoNJQzQ9b8hRCNnuEuKeEie7yT8jI+fpZOi/hvQjd8pWFbeS3UkBcIEVu5KWMGE8PxQKegTCnekSAQiRSKkpEgETYpQGIvdlhIbE+3zFSLlavdeqwlcSEINfiWaepB7Ho7jfHTaGPAJQ02yPL+2vt4oFoub27upN2+1AO2hwHGu8ep+pqS5LLS8xMzYnZhBQNjttOG72/YOMN3sCC2h4PCiXQYWNE4L+LbPkxKAA5FQPjTNT2Xk0zgy7YOv2DPQLtnmB8RyMRyadqkcEDjsIrF0cF4RUgAnXSXVJjh+YXAvZxh5wqmyd+cRT6yCYTwlnJwx/fKzX7hpsXq9QjosLbnxyTM3ztXI7Mx9v3CNTX9PaZ0wipq2yuNzSnd4XNa07S4BOqlQSh/yeeyRpAjjC6XHPDZY4bFAIMeUPiCMTU2b53HHHUBW2YBZkVB5XXeXvMb6OS+Yz6k15rqE4Y1bFzOzMXzenVTV0ek/sLU1qqpJT0igN87/GJEeUf5NfgERko5Ei+IYcQAAAABJRU5ErkJggg==",

  /**
   * 以下配置用户配置则失效 
   */
  _docsPath: "docs",               // 用户文档路径
  title: "文档系统 - {name}",       // title
  /**
   * 植入css与js
   * @param url 资源文件地址
   * @param pos 文件添加的位置 top 与 bottom 默认为 top top在head 中加入 bottom在body中加入
   * @param hash 是否在文件后缀添加hash值如/styles/index.min.css?hash=123
   */
  // 样式表
  styles:[
    { url: '/sys_css/index.css', pos: 'top', hash: true }
  ],
  // js植入
  scripts:[
    { url: 'https://cdn.bootcdn.net/ajax/libs/highlight.js/11.0.1/highlight.min.js', pos: 'bottom' },
    { url: '/sys_scripts/index.js', pos: 'bottom', hash: true },
  ],
  /**
   * 系统项目配置
   */ 
  port: 8000,                                         // 运行端口
  host: 'localhost',                                  // 运行地址
  _view: path.resolve(root, "view"),                  // 系统文件模板目录
  _assets: path.resolve(root, "assets"),              // 系统资源文件
  view404: path.resolve(root, "view", "404.ejs"),      // 404页面
  contentView: "content.ejs",                         // 内容模板文件
  listView: "list.ejs",                               // 多文档模式列表模板

  /**
   * 数据脚本变量
   * 这些变量会生成一个js文件
   * 然后供前端使用
   */
  varName: {
    docMenu: "docMenu",           // 菜单变量名字
    docMultiple: "docMultiple",   // 文档模式变量名字
    docLinkPrefix: "docLinkPrefix",// 文档链接前缀
    docComponents: "docComponents",// 罪案变量名字
    componentsIdPrefix: "doc_",   // 组件id前缀
    pageDataNamePrefix: "page_data_", // 页面数据js名字前缀
  }
}
