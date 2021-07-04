## 这是一个代码块文档管理工具
主要用于整理代码代码块

试想下前端布局方式很多都是相同的

如果每次在都重写很费劲

但是如果你把这些代码块收集起来用一个文档工具去管理是不是会很方便
## 安装方式
## node 版本需大于v10.13.0

#### 执行命令
```bash
npm i md-doc-block -g
```

#### 初始化
```bash
doc init
? 请输入文档系统title： 文档系统 {name}
? 请输入文档目录： docs
? 请输入代码目录： code
? 请输入资源文件目录： assets
? 是否为多文档模式？ No
✓ init success
  启动项目  doc dev
```
#### 启动项目
```bash
doc dev

  服务运行成功:
  - 地址:   http://0.0.0.0:8000
  - 内网地址: http://192.168.0.103:8000
```

### 打包项目
```bash
 doc build

 =============
 🐤打包成功
=============
```

### 帮助
```bash
doc -h
Usage: webpc <command>

Commands:

  init     初始化项目
  build    打包应用程序
  dev      启动服务器进行开发
  -h       显示帮助
  -v       显示版本

详细内容 https://github.com/yubin-code
```

## 效果图片
![img](./img/api.jpg)
![img](./img/bash.jpg)
![img](./img/code.jpg)
![img](./img/liu.jpg)
![img](./img/mobile.jpg)


## 注意事项
1.所有的功能性标签符号上方都不能是直接纯文本必须添加一个空格
例如：example 代码块上班都需要添加空格不如直接原样解析出来


## 浏览器
添加src链接会自动打开对应链接
<browser src="./index/"/>

## 手机浏览器
src 代码目录路径
type 设置ipx就是苹果x样式
iswechat 是否设置小程序特有属性

<mobile src="/index/" type="ipx" iswechat="true"/>

## 自动读取路径中所有都文件并生成目录结构的编辑器
默认打开的文件 defaultOpenFile
defaultOpenFile 路径是相对于src下面的路径

<editor src="/admin" defaultOpenFile="index.html, index.css"/>

## 配置git地址不允许复制同时打开两个文件一个js一个html
<editor  copy="false" github="xxx">
```js
console.log("xxxxx");
```
```html
console.log("ccccc");
```
</editor>


## 代码功能
```javascript
var name = "ccc";
console.log(name);
```


## 显示目录结构
```dir
- demo # demo目录
  - code # 核心数据
    - index.js
    - index.html
  - docs
    - demo.md
  - index.js
  - index.css
```

## 终端功能
```bash
> git commit -m '添加增加功能'
[master 7c3fbe1] add 添加增加功能
1 file changed, 33 inseterons(+)
```

## json 功能
```json
{
  "name": "demo",
  "version": "1.0.0",
  "description": "",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "authors": {
    "name": "yubin",
    "email": "18462232@qq.com"
  },
  "license": "MIT",
}
```

## api 文档功能虚假请求
```api
@api {GET} /product/{id}  查询一个产品
@description 指定产品id , 删除产品的全部信息，包括关联的schema
@apiParam {String} firstname  用户名（非必填）.
@apiParam {String} lastname   用户姓（必填）.
@apiParamExample 参数请求的事例
@apiVersion 版本
@apiErrorExample API错误示例
@apiSuccessExample API正常示例
```


## 用户配置文件夹的配置
```json
{
  "title": "文档手册-{name}", // 网站标题 name 会被替换为当前的文档名字
  "view": "",                // 用户自定义了模板
  "docsPath": "docs",       // 文档目录
  "codePath": "code",       // 用户存放代码目录
  "assets": "assets",       // 用户资源文件
  "multiple": false,        // 是否为多文档模式
  "createDir": false,
  "scripts": [],        // 用户自定义js
  "styles": [],          // 用户自定义样式
  "linkPrefix": "/",
  // md 配置
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


## 其他

由于别的事情着急发版功能并不完善有问题可以github上直接提问