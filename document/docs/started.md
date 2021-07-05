---
@title:快速入手
@sort:2
---


## 安装方式
> node 版本需大于v10.13.0

### 执行安装命令
```bash
> npm i md-doc-block -g
```

### 初始化第一个mddoc的项目
```bash
> doc init
? 请输入文档系统title： 文档系统 {name}
? 请输入文档目录： docs
? 请输入代码目录： code
? 请输入资源文件目录： assets
? 是否为多文档模式？ No
✓ init success
  启动项目  doc dev
```

### 启动项目
```bash
> doc dev

  服务运行成功:
  - 地址:   http://0.0.0.0:8000
  - 内网地址: http://192.168.0.103:8000
```


### 打包项目
```bash
> doc build

=============
 🐤打包成功
=============
```

### 帮助
```bash
> doc -h
Usage: webpc <command>

Commands:

  init     初始化项目
  build    打包应用程序
  dev      启动服务器进行开发
  -h       显示帮助
  -v       显示版本

详细内容 https://github.com/yubin-code
```
