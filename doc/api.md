# API文档

## 注：

```
File的Permission

permissions = (
    (1, '可查看'), (2, '可评论'), (3, '可修改'), (4, '可分享'), (5, 'all')
)
team_permissions = (
	(1, '成员可查看'), (2, '成员可评论'), (3, '成员可修改'), (4, '成员可分享')
)

File的type
types = (
	('team', '团队文档'), ('private', '私人文档')
)
```

## 不需要Token的API

### 1. 发送注册邮件接口

##### 描述
发送验证码到指定邮箱

##### 请求URL
` http://175.24.121.113:8000/myapp/email `

##### 请求方式
POST
##### 参数

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|email |是  |string |邮箱   |

##### 返回示例

``` 
{
    "info": "发送成功",
    "code": 200
}
```
##### 返回状态码

200——成功

### 2. 发送找回密码邮件接口

##### 描述
发送验证码到指定邮箱

##### 请求URL
` http://175.24.121.113:8000/myapp/email2/ `

##### 请求方式
POST
##### 参数

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|email |是  |string |邮箱   |

##### 返回示例

``` 
{
    "info": true,
    "code": 200
}
```

##### 返回状态码

200——成功

### 3.找回密码接口

##### 描述
类似于用邮箱重置密码

##### 请求URL
` http://175.24.121.113:8000/myapp/findpassword/ `
##### 请求方式
POST
##### 参数

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|username |是  |string |用户名   |
|email |是  |string |邮箱   |
|password_new |是  |string |新密码   |
|code |是  |string |邮件里的验证码  |


##### 返回示例

``` 
{
    "info":  "找回成功",
    "code": 200,
},
{
    "info":  "验证码错误",
    "code": 403,
},
```

##### 返回状态码

200——成功

400——参数不完整 

403——验证码错误

### 4.用户注册接口

##### 描述

用于用户注册

注：注册之前需要先POST`http://175.24.121.113:8000/myapp/testemail`，并带上email参数，然后再post该api

##### 请求URL
- ` http://175.24.121.113:8000/myapp/register `
  
##### 请求方式
- POST 

##### 参数

|参数名|必选|类型|说明|
|:----    |:---|:----- |-----   |
|username |是  |string |用户名   |
|password |是  |string | 密码    |
|password2 |是  |string | 重复密码 |
|email     |是  |string | 邮箱    |
|phone_num     |是  |string | 手机号    |
|code |是 |string | 验证码 |

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": {
        "id": 13,
        "username": "刘六",
        "email": "12@12.12",
        "phone_num": "12345678911"
    }
}
```

##### 返回参数说明 

|参数名|类型|说明|
|:-----  |:-----|-----                           |
|info |string   |信息，可能成功或者失败原因  |
|code |int   |返回状态码，200 400  |
|data |dic   |注册的用户完整信息  |

##### 返回状态码

200——成功

400——参数不完整

403——验证码错误

****

### 5.用户登录接口

##### 描述

用于用户登录

##### 请求URL

- ` http://175.24.121.113:8000/myapp/login`

##### 请求方式

- POST 

##### 参数

| 参数名    | 必选 | 类型   | 说明     |
| :-------- | :--- | :----- | -------- |
| username  | 是   | string | 用户名   |
| password  | 是   | string | 密码     |

##### 返回示例 

``` 
{
    "info": "success",
    "token": "876c25860f8ce6606eb25f7dd8e1bf83",
    "code": 200,
    "data": {
        "id": 10,
        "username": "lisi",
        "email": "15@13.13",
        "phone_num": "12345678999"
    }
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明                       |
| :----- | :----- | -------------------------- |
| info   | string | 信息，可能成功或者失败原因 |
| token  | string | token信息                  |
| code   | int    | 返回状态码                 |
| data   | dic    | 登录的用户完整信息         |

##### 返回状态码

200——成功

400——参数不完整

403——用户名错误、密码错误

## 需要Token的API

### 1. 用户个人信息接口

##### 描述

用于请求用户信息或者修改用户信息

##### 请求URL
- ` http://175.24.121.113:8000/myapp/user/info `
  
##### 请求方式
- GET——用于请求用户详情信息
- POST——用于修改用户信息
**注：在POST此页面之前请先POST`http://175.24.121.113:8000/myapp/user/modify`页面输入旧密码后再POST此页面**

##### 参数
GET方式

| 参数名 | 必选 | 类型 | 说明 |
| :----- | :--- | :--- | ---- |
| 无     | 无   | 无   | 无   |
POST方式

| 参数名       | 必选 | 类型   | 说明       |
| :----------- | :--- | :----- | ---------- |
| new_password | 是   | string | 新密码     |
| email        | 是   | string | 新邮箱     |
| phone_num    | 是   | string | 新电话号码 |

##### 返回示例 
POST请求和GET请求都返回详细信息，只是POST请求返回的是修改完成后用户的信息

``` 
{
    "info": "success",
    "code": 200,
    "data": {
        "id": 10,
        "username": "lisi",
        "email": "15@13.13",
        "phone_num": "12345678999"
    }
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明         |
| :----- | :----- | ------------ |
| info   | string | 返回信息     |
| code   | int    | 返回状态码   |
| data   | dic    | 返回用户信息 |

##### 返回状态码

200——成功

403——token有问题、新旧密码相同

****

### 2. 用户个人信息修改验证接口

##### 描述

用于在用户修改信息前验证其是否具有修改信息的资格

前端可在拿到数据后对相应修改信息的表单进行复现

##### 请求URL

- ` http://175.24.121.113:8000/myapp/user/modify`

##### 请求方式

- POST

##### 参数

POST方式

| 参数名       | 必选 | 类型   | 说明   |
| :----------- | :--- | :----- | ------ |
| old_password | 是   | string | 旧密码 |

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": {
        "id": 10,
        "username": "lisi",
        "email": "15@13.13",
        "phone_num": "12345678999"
    }
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明         |
| :----- | :----- | ------------ |
| info   | string | 返回信息     |
| code   | int    | 返回状态码   |
| data   | dic    | 返回用户信息 |

##### 返回状态码

200——成功

400——参数不完整

403——token问题

****

### 3. 用户收藏文档接口

##### 描述

用户点击收藏时使用

##### 请求URL

- ` http://175.24.121.113:8000/myapp/file/favorite`

##### 请求方式

- GET

##### 参数

| 参数名  | 必选 | 类型 | 说明                                           |
| :------ | :--- | :--- | ---------------------------------------------- |
| file_id | 是   | int  | 所收藏文档的id，可根据前端所传参数进行相应调整 |

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": {
        "id": 10,
        "kept_time": "2020-08-11T16:48:35.248745",
        "file": 10,
        "person": 10
    }
}
```

```
{
    "info": "文件不存在",
    "code": 403
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明                             |
| :----- | :----- | -------------------------------- |
| info   | string | 返回信息                         |
| code   | int    | 返回状态码                       |
| data   | dic    | 返回用户收藏文档时间以及相关信息 |

##### 返回状态码

200——成功

403——token问题、已经收藏过了、文件不存在

****

### 4. 用户取消收藏文档接口

##### 描述

用户点击取消收藏时使用

##### 请求URL

- ` http://175.24.121.113:8000/myapp/file/cancelfavor`

##### 请求方式

- GET

##### 参数

| 参数名  | 必选 | 类型 | 说明                                             |
| :------ | :--- | :--- | ------------------------------------------------ |
| file_id | 是   | int  | 取消收藏文档的id，可根据前端所传参数进行相应调整 |

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": {
        "id": 10,
        "kept_time": "2020-08-11T16:48:35.248745",
        "file": 10,
        "person": 10
    }
}
```

```
{
    "info": "文件不存在",
    "code": 403
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明                 |
| :----- | :----- | -------------------- |
| info   | string | 返回信息             |
| code   | int    | 返回状态码           |
| data   | dic    | 返回取消收藏的文档id |

##### 返回状态码

200——成功

403——token问题、已经收藏过了、文件不存在

****

### 5. 用户创建私人文档接口

##### 描述

用户自己在工作台创建的文档

##### 请求URL

- ` http://175.24.121.113:8000/myapp/file/create/pri`

##### 请求方式

- GET

##### 参数

无

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": {
        "id": 18,
        "file_title": "无标题",
        "file_content": "",
        "create_time": "2020-08-11T16:47:19.604996",
        "last_modified": "2020-08-11T16:47:19.604996",
        "is_delete": false,
        "modified_times": 0,
        "type": "private",
        "permission": "5",
        "team_permission": null,
        "share": null,
        "creator": 10,
        "team_belong": null,
        "modified_user": [],
        "comments": []
    }
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明         |
| :----- | :----- | ------------ |
| info   | string | 返回信息     |
| code   | int    | 返回状态码   |
| data   | dic    | 文档相关信息 |

默认创建的文档标题为无标题，且type为私人创建的文档，team相关属性都为null

##### 返回状态码

200——成功

403——token问题

****

### 6. 用户创建团队文档接口

##### 描述

用户自己在团队空间创建的文档

##### 请求URL

- ` http://175.24.121.113:8000/myapp/file/create/team`

##### 请求方式

- GET

##### 参数

| 参数名  | 必选 | 类型 | 说明                             |
| :------ | :--- | :--- | -------------------------------- |
| team_id | 是   | int  | 当前团队空间的id，可根据情况调整 |

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": {
        "id": 19,
        "file_title": "无标题",
        "file_content": "",
        "create_time": "2020-08-11T16:47:47.181876",
        "last_modified": "2020-08-11T16:47:47.181876",
        "is_delete": false,
        "modified_times": 0,
        "type": "team",
        "permission": "5",
        "team_permission": "5",
        "share": null,
        "creator": 10,
        "team_belong": 3,
        "modified_user": [],
        "comments": []
    }
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明         |
| :----- | :----- | ------------ |
| info   | string | 返回信息     |
| code   | int    | 返回状态码   |
| data   | dic    | 文档相关信息 |

默认创建的文档标题为无标题，且type为团队创建的文档，team相关属性都对应

##### 返回状态码

200——成功

403——token问题

****

### 7. 用户创建团队空间接口

##### 描述

用户创建团队空间

##### 请求URL

- ` http://175.24.121.113:8000/myapp/team/create/`

##### 请求方式

- POST

##### 参数

| 参数名    | 必选 | 类型   | 说明             |
| :-------- | :--- | :----- | ---------------- |
| team_name | 是   | string | 创建的团队空间名 |

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": {
        "id": 4,
        "name": "wo are team team ",
        "create_time": "2020-08-11T16:46:43.842592",
        "creator": 10,
        "members": []
    }
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明         |
| :----- | :----- | ------------ |
| info   | string | 返回信息     |
| code   | int    | 返回状态码   |
| data   | dic    | 团队相关信息 |

##### 返回状态码

200——成功

403——token问题

****

### 8. 用户加入团队空间接口

##### 描述

用户加入团队空间

##### 请求URL

- ` http://175.24.121.113:8000/myapp/team/join/`

##### 请求方式

- GET

##### 参数

| 参数名  | 必选 | 类型 | 说明             |
| :------ | :--- | :--- | ---------------- |
| team_id | 是   | int  | 想要加入的团队id |

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": {
        "id": 2,
        "join_time": "2020-08-11T16:42:20.758774",
        "permission": 5,
        "team": 3,
        "member": 10
    }
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明             |
| :----- | :----- | ---------------- |
| info   | string | 返回信息         |
| code   | int    | 返回状态码       |
| data   | dic    | 加入团队相关信息 |

##### 返回状态码

200——成功

400——参数不完整

403——token问题

****

### 9. 用户退出团队空间接口

##### 描述

用户退出团队空间

##### 请求URL

- ` http://175.24.121.113:8000/myapp/team/exit/`

##### 请求方式

- GET

##### 参数

| 参数名  | 必选 | 类型 | 说明             |
| :------ | :--- | :--- | ---------------- |
| team_id | 是   | int  | 想要加入的团队id |

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": {
        "id": 2,
        "join_time": "2020-08-11T16:42:20.758774",
        "permission": 5,
        "team": 3,
        "member": 10
    }
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明             |
| :----- | :----- | ---------------- |
| info   | string | 返回信息         |
| code   | int    | 返回状态码       |
| data   | dic    | 退出团队相关信息 |

##### 返回状态码

200——成功

400——参数不完整

403——token问题，未加入团队就退出

****

### 10. 用户评论文档

##### 描述

用户评论文档

##### 请求URL

- ` http://175.24.121.113:8000/myapp/file/comment/`

##### 请求方式

- POST

##### 参数

| 参数名  | 必选 | 类型   | 说明                         |
| :------ | :--- | :----- | ---------------------------- |
| comment | 是   | string | 评论内容                     |
| file_id | 是   | int    | 评论文档的id，可根据要求调整 |

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": {
        "id": 17,
        "username": "lisi",
        "content": "this is a comment2",
        "create_time": "2020-08-11T15:55:23.905675",
        "person": 10,
        "file": 2
    }
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明                   |
| :----- | :----- | ---------------------- |
| info   | string | 返回信息               |
| code   | int    | 返回状态码             |
| data   | dic    | 评论相关信息以及评论人 |

##### 返回状态码

200——成功

400——参数不完整

403——token问题

****

### 11. 用户浏览文档接口

##### 描述

用户点击文档进行浏览时调用

##### 请求URL

- ` http://175.24.121.113:8000/myapp/file/browse/`

##### 请求方式

- GET

##### 参数

| 参数名  | 必选 | 类型 | 说明                                           |
| :------ | :--- | :--- | ---------------------------------------------- |
| file_id | 是   | int  | 所浏览文档的id，可根据前端所传参数进行相应调整 |

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": {
        "id": 6,
        "last_modified": "2020-08-12T10:09:39.770432",
        "file": 8,
        "person": 10
    }
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明                                 |
| :----- | :----- | ------------------------------------ |
| info   | string | 返回信息                             |
| code   | int    | 返回状态码                           |
| data   | dic    | 返回用户最近浏览文档时间以及相关信息 |

##### 返回状态码

200——成功

403——token问题

****

### 12. 获取用户浏览的近10日文档接口

##### 描述

获取用户近10日浏览的文档

##### 请求URL

- ` http://175.24.121.113:8000/myapp/file/browse/get`

##### 请求方式

- GET

##### 参数

无

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": [
        {
            "id": 7,
            "file_name": "无标题",
            "person_name": "lisi",
            "file_isdelete": "True",
            "last_modified": "2020-08-12T10:16:02.383497",
            "file": 6,
            "person": 10
        },
        {
            "id": 6,
            "file_name": "无标题",
            "person_name": "lisi",
            "file_isdelete": "True",
            "last_modified": "2020-08-12T10:09:39.770432",
            "file": 8,
            "person": 10
        },
        {
            "id": 1,
            "file_name": "tt",
            "person_name": "lisi",
            "file_isdelete": "True",
            "last_modified": "2020-08-11T08:28:00.898769",
            "file": 2,
            "person": 10
        }
    ]
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明                               |
| :----- | :----- | ---------------------------------- |
| info   | string | 返回信息                           |
| code   | int    | 返回状态码                         |
| data   | dic    | 返回用户最近浏览的文档内容以及时间 |

##### 返回状态码

200——成功

403——token问题

****

### 13. 获取用户收藏文档接口

##### 描述

获取用户收藏的文档

##### 请求URL

- ` http://175.24.121.113:8000/myapp/file/favorite/get`

##### 请求方式

- GET

##### 参数

无

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": [
        {
            "id": 11,
            "file_name": "无标题",
            "person_name": "lisi",
            "file_isdelete": "True",
            "kept_time": "2020-08-12T10:50:38.861698",
            "file": 5,
            "person": 10
        },
        {
            "id": 8,
            "file_name": "无标题",
            "person_name": "lisi",
            "file_isdelete": "True",
            "kept_time": "2020-08-11T16:37:34.893179",
            "file": 3,
            "person": 10
        }
    ]
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明                           |
| :----- | :----- | ------------------------------ |
| info   | string | 返回信息                       |
| code   | int    | 返回状态码                     |
| data   | dic    | 返回用户收藏的文档以及收藏时间 |

##### 返回状态码

200——成功

403——token问题

### 15. 把文件添加到回收站 or 从回收站恢复

##### 描述

是否在回收站

##### 请求URL

- ` http://175.24.121.113:8000/myapp/file/isdelete`

##### 请求方式

- Get
##### 参数

| 参数名  | 必选 | 类型 | 说明             |
| :------ | :--- | :--- | ---------------- |
| file_id | 是   | int  | 文件id |
| is_delete | 是   | Boolean  | True为回收，False为恢复  |

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明             |
| :----- | :----- | ---------------- |
| info   | string | 返回信息         |
| code   | int    | 返回状态码       |

##### 返回状态码

200——成功
403——token问题或者文件不存在


### 16. 从回收站中彻底删除文件

##### 描述

这次文件真的没了

##### 请求URL

- ` http://175.24.121.113:8000/myapp/file/realdelete`

##### 请求方式

- GET

##### 参数

| 参数名  | 必选 | 类型 | 说明             |
| :------ | :--- | :--- | ---------------- |
| file_id | 是   | int  | 想要删除的文件id |

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明             |
| :----- | :----- | ---------------- |
| info   | string | 返回信息         |
| code   | int    | 返回状态码       |

##### 返回状态码

200——成功
403——token问题或者文件不存在

****

### 17. 获取用户创建的所有文档接口

##### 描述

获取用户创建的所有文档

##### 请求URL

- ` http://175.24.121.113:8000/myapp/file/create/all/get/`

##### 请求方式

- GET

##### 参数

无

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": [
        {
            "id": 35,
            "file_title": "无标题",
            "file_content": "",
            "create_time": "2020-08-12T15:28:23.336737",
            "last_modified": "2020-08-12T15:28:23.336766",
            "is_delete": false,
            "modified_times": 0,
            "type": "private",
            "permission": 5,
            "team_permission": null,
            "share": null,
            "creator": 10,
            "team_belong": null,
            "modified_user": [],
            "comments": []
        },
        {
            "id": 34,
            "file_title": "无标题",
            "file_content": "",
            "create_time": "2020-08-12T15:27:25.199551",
            "last_modified": "2020-08-12T15:27:25.199578",
            "is_delete": false,
            "modified_times": 0,
            "type": "private",
            "permission": 5,
            "team_permission": null,
            "share": null,
            "creator": 10,
            "team_belong": null,
            "modified_user": [],
            "comments": []
        },
        {
            "id": 33,
            "file_title": "无标题",
            "file_content": "",
            "create_time": "2020-08-12T15:27:03.942496",
            "last_modified": "2020-08-12T15:27:03.942523",
            "is_delete": false,
            "modified_times": 0,
            "type": "private",
            "permission": 5,
            "team_permission": null,
            "share": null,
            "creator": 10,
            "team_belong": null,
            "modified_user": [],
            "comments": []
        }
    ]
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明                   |
| :----- | :----- | ---------------------- |
| info   | string | 返回信息               |
| code   | int    | 返回状态码             |
| data   | dic    | 返回用户创建的所有文档 |

##### 返回状态码

200——成功

403——token问题

****

### 18. 获取用户创建或参与的所有团队接口

##### 描述

获取用户创建或参与的所有团队

##### 请求URL

- ` http://175.24.121.113:8000/myapp/team/all/get/`

##### 请求方式

- GET

##### 参数

无

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": [
        {
            "id": 1,
            "name": "we are a tem",
            "create_time": "2020-08-11T11:40:08.495727",
            "creator": 10,
            "members": []
        },
        {
            "id": 2,
            "name": "wo are a team",
            "create_time": "2020-08-11T11:40:41.492048",
            "creator": 10,
            "members": [
                26
            ]
        },
        {
            "id": 3,
            "name": "wo are a team",
            "create_time": "2020-08-11T11:57:50.785125",
            "creator": 10,
            "members": []
        },
        {
            "id": 4,
            "name": "wo are team team ",
            "create_time": "2020-08-11T16:46:43.842592",
            "creator": 10,
            "members": []
        },
        {
            "id": 5,
            "name": "112ff",
            "create_time": "2020-08-12T16:09:53.860319",
            "creator": 10,
            "members": []
        },
        {
            "id": 6,
            "name": "1112",
            "create_time": "2020-08-12T16:12:38.183152",
            "creator": 10,
            "members": []
        },
        {
            "id": 7,
            "name": "我们是冠军！",
            "create_time": "2020-08-12T19:45:56.814308",
            "creator": 26,
            "members": [
                10
            ]
        }
    ]
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明                                                |
| :----- | :----- | --------------------------------------------------- |
| info   | string | 返回信息                                            |
| code   | int    | 返回状态码                                          |
| data   | dic    | 返回用户创建或参与的所有团队 member中放的是成员的id |

##### 返回状态码

200——成功

403——token问题

****

### 19. 获取用户移到回收站的文档接口

##### 描述

获取用户移到回收站的文档

**注：有一个删除时间，可以在前端显示**

##### 请求URL

- ` http://175.24.121.113:8000/myapp/file/delete/get/`

##### 请求方式

- GET

##### 参数

无

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": [
        {
            "id": 12,
            "file_title": "文档10",
            "file_content": "56",
            "create_time": "2020-08-11T16:19:13.510809",
            "last_modified": "2020-08-13T09:15:50.741585",
            "is_delete": true,
            "delete_time": "2020-08-13T09:15:50.741474",
            "modified_times": 0,
            "type": "private",
            "permission": 4,
            "team_permission": 4,
            "share": null,
            "creator": 10,
            "team_belong": null,
            "modified_user": [],
            "comments": [
                26
            ]
        },
        {
            "id": 11,
            "file_title": "文档9",
            "file_content": " ",
            "create_time": "2020-08-11T16:18:58.620517",
            "last_modified": "2020-08-13T09:15:58.964329",
            "is_delete": true,
            "delete_time": "2020-08-13T09:15:58.964214",
            "modified_times": 0,
            "type": "private",
            "permission": 4,
            "team_permission": 4,
            "share": null,
            "creator": 10,
            "team_belong": null,
            "modified_user": [],
            "comments": []
        },
        {
            "id": 10,
            "file_title": "文档8",
            "file_content": "",
            "create_time": "2020-08-11T16:17:20.131157",
            "last_modified": "2020-08-13T09:47:18.364390",
            "is_delete": true,
            "delete_time": "2020-08-13T09:47:18.364293",
            "modified_times": 0,
            "type": "private",
            "permission": 4,
            "team_permission": 4,
            "share": null,
            "creator": 10,
            "team_belong": null,
            "modified_user": [],
            "comments": []
        },
        {
            "id": 2,
            "file_title": "tt",
            "file_content": "ttttttttttttttttttttttt",
            "create_time": "2020-08-10T17:01:01.209864",
            "last_modified": "2020-08-13T08:47:04.462798",
            "is_delete": true,
            "delete_time": "2020-08-13T08:47:04.462798",
            "modified_times": 0,
            "type": "private",
            "permission": 4,
            "team_permission": 4,
            "share": "wu",
            "creator": 10,
            "team_belong": null,
            "modified_user": [],
            "comments": [
                10,
                10,
                10,
                10,
                10,
                10,
                10,
                10,
                10,
                10,
                10,
                10,
                10,
                10,
                10,
                10,
                10
            ]
        }
    ]
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明                                                |
| :----- | :----- | --------------------------------------------------- |
| info   | string | 返回信息                                            |
| code   | int    | 返回状态码                                          |
| data   | dic    | 返回用户创建或参与的所有团队 member中放的是成员的id |

##### 返回状态码

200——成功

403——token问题

****

### 20. 设置私人文档权限接口

##### 描述

设置私人文档的权限

##### 请求URL

- ` http://175.24.121.113:8000/myapp/file/privi/pri/`

##### 请求方式

- POST

##### 参数

| 参数名    | 必选 | 类型 | 说明                   |
| :-------- | :--- | :--- | ---------------------- |
| file_id   | 是   | int  | 想要修改权限的file的id |
| privilege | 是   | int  | 权限类型(1-4)          |

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": {
        "id": 2,
        "file_title": "tt",
        "file_content": "ttttttttttttttttttttttt",
        "create_time": "2020-08-10T17:01:01.209864",
        "last_modified": "2020-08-13T11:27:21.648218",
        "is_delete": true,
        "delete_time": "2020-08-13T08:47:04.462798",
        "modified_times": 0,
        "type": "private",
        "permission": 1,
        "team_permission": 4,
        "share": "wu",
        "creator": 10,
        "team_belong": null,
        "modified_user": [],
        "comments": [
            10,
            10,
            10,
            10,
            10,
            10,
            10,
            10,
            10,
            10,
            10,
            10,
            10,
            10,
            10,
            10,
            10
        ]
    }
}
```

##### 返回参数说明 

| 参数名 | 类型   | 说明               |
| :----- | :----- | ------------------ |
| info   | string | 返回信息           |
| code   | int    | 返回状态码         |
| data   | dic    | 返回修改的文件信息 |

##### 返回状态码

200——成功

403——token问题、权限有误

****

### 21. 获取当前团队内的所有文档接口

##### 描述

获取当前团队内的所有文档

##### 请求URL

- ` http://175.24.121.113:8000/myapp/file/team/get/`

##### 请求方式

- GET

##### 参数

| 参数名  | 必选 | 类型 | 说明   |
| :------ | :--- | :--- | ------ |
| team_id | 是   | int  | 团队id |

##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": [
        {
            "id": 6,
            "file_title": "文档4",
            "file_content": "",
            "create_time": "2020-08-11T11:57:34.335391",
            "last_modified": "2020-08-13T15:58:18.350344",
            "is_delete": false,
            "delete_time": "2020-08-13T15:32:15.311917",
            "modified_times": 0,
            "type": "team",
            "permission": 4,
            "team_permission": 4,
            "share": null,
            "creator": 10,
            "team_belong": 2,
            "modified_user": [],
            "comments": []
        }
    ]
}    
```

##### 返回参数说明 

| 参数名 | 类型   | 说明                           |
| :----- | :----- | ------------------------------ |
| info   | string | 返回信息                       |
| code   | int    | 返回状态码                     |
| data   | dic    | 返回当前团队相关的所有文档信息 |

##### 返回状态码

200——成功

403——token问题

### 22. 修改文档内容

##### 描述

修改文档

##### 请求URL

- ` http://175.24.121.113:8000/myapp/mdSave`

##### 请求方式

- post

##### 参数

| 参数名  | 必选 | 类型 | 说明   |
| :------ | :--- | :--- | ------ |
| file_id | 是   | int  | 文件id |
| title | 是   | Stirng  | 标题 |
| content | 是   | Stirng  | 内容 |


##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": [
        {
            
        }
    ]
}    
```

##### 返回参数说明 

| 参数名 | 类型   | 说明                           |
| :----- | :----- | ------------------------------ |
| info   | string | 返回信息                       |
| code   | int    | 返回状态码                     |
| data   | dic    | 返回相关的文档信息 |

##### 返回状态码

200——成功

403——token问题

****

### 23. 返回文档接口

##### 描述

返回文档

##### 请求URL

- ` http://175.24.121.113:8000/myapp/file/get/`

##### 请求方式

- GET

##### 参数

| 参数名  | 必选 | 类型 | 说明   |
| :------ | :--- | :--- | ------ |
| file_id | 是   | int  | 文件id |


##### 返回示例 

``` 
{
    "info": "success",
    "code": 200,
    "data": {
        "id": 5,
        "creator_name": "lisi",
        "file_title": "文档3",
        "file_content": "",
        "create_time": "2020-08-11T11:57:21.217534",
        "last_modified": "2020-08-13T16:02:06.170953",
        "is_delete": true,
        "delete_time": "2020-08-13T16:02:06.170858",
        "modified_times": 0,
        "type": "private",
        "permission": 4,
        "team_permission": 4,
        "share": null,
        "creator": 10,
        "team_belong": null,
        "modified_user": [],
        "comments": []
    }
} 
```

##### 返回参数说明 

| 参数名 | 类型   | 说明               |
| :----- | :----- | ------------------ |
| info   | string | 返回信息           |
| code   | int    | 返回状态码         |
| data   | dic    | 返回相关的文档信息 |

##### 返回状态码

200——成功

403——token问题