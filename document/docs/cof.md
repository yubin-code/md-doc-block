---
@title:配置说明
@sort:9
---

## 用户配置文件夹的配置
配置文件名 <code>md.json</code>

```json
{
  "title": "文档手册-{name}", // 网站标题 name 会被替换为当前的文档名字
  "view": "",               // 用户自定义了模板
  "docsPath": "docs",       // 文档目录
  "codePath": "code",       // 用户存放代码目录
  "assets": "assets",       // 用户资源文件
  "output": "dist",         // 打包以后输出路径
  "multiple": false,        // 是否为多文档模式
  "createDir": false,       //  是否创建大纲
  "scripts": [],            // 用户自定义js
  "styles": [],             // 用户自定义样式
  "linkPrefix": "/",        // 链接前缀
  // md 配置此项配置对所有的md中内容生效
  // 但标签的优先级高于此处的配置
  "mdcof": {
    "win": {
      "height": 150
    },
    "code": {
      "copy": { "copySuffix": "谢谢复制" }
    },
    "mobile": {
      "scale": 80,
      "iswechat": true
    }
  }
}
```


## 文档配置
在`.md`文件中也可以设置配置以`---`分割中间内容以`@`作为字段

之前只有两个字段 `title` 设置当前文件名字 `sort` 排序
<br/>

```javaScropt
---
@title:配置说明
@sort:9
---
```