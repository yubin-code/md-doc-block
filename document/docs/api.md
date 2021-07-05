---
@title:API文档功能
@sort:8
---

## API文档
使用 <code>```api</code>

<br/>

## api
```api
@version 1.0.0
@api {GET} /product/{id}  获取产品列表
@description 指定产品id , 删除产品的全部信息，包括关联的schema

@param {String} *firstname  用户名
@param {String} lastname   用户姓

@returnParam {String} firstname 用户参数
@returnParam {String} firstname 用户参数

@errorExample
{
  error: 'eoor'
}
@successExample
{
  "error_code": 0,
  "data": {
    "uid": "1",
    "username": "12154545",
    "name": "吴系挂",
    "groupid": 2 ,
    "reg_time": "1436864169",
    "last_login_time": "0",
  }
}

@remark
这个是一个备注信息
```

## 注意
因为本人偷懒api文档必须严格按这个要求写不然可能报错