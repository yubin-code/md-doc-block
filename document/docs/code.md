---
@title:代码显示
@sort:6
---
## 代码显示

### 第一种方式
使用 <code>```</code>

<br/>

```javaScript
var name = "张三";
```

### 第二种方式
使用 <code>editor</code> 标签
支持打开多个文件使用 <code>```</code>分割文件

#### 例如：

<code>```index.js</code>

中间可以写内容

<code>```</code>

<br/>

<editor copy="true">
```index.js
var name = "张三";
```
```index.html
<div class="box">标签</div>
```
</editor>


### 第三种方式
直接使用 <code>editor</code> 标签指向一个文件夹他能自动识别里面的所有文件

<code>editor</code>  标签有一个<code>src</code>属性

##### 例如

<editor src="/admin" defaultOpenFile="index.html" height="300" github="https://github.com/yubin-code"/>

### 属性说明

<code>editor</code> 标签属性

|  属性   | 说明  |
|  ----  | ----  |
| src  | 直接读取一个文件夹，src优先级为最高 目前只支持一级目录二级以上无法识别 |
| defaultOpenFile  | 默认打开的文件 |
| height  | 设置高度 |
| maxHeight  | 最大高度 |
| minHeight  | 最小高度 |
| github  | 设置git跳转地址 |
| copy  | 是否允许copy |
| copySuffix  | 拷贝附加的文字 |
| hideLine  | 是否显示行 |
| closeFile  | 是否不允许关闭文件 |
| closeRetract  | 是否不允许收起菜单 |
| narrowOff  | 关闭窗口关闭功能 （窗口的组件所有以下这些属性） |
| closeOff  | 关闭窗口缩小功能 |
| screenOff  | 关闭窗口全屏功能 |




