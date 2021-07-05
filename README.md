[文档地址](https://yubin-code.github.io/md-doc-block/)

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

## 其他

由于别的事情着急发版功能并不完善有问题可以github上直接提问