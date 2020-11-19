
# 云函数快速部署京东脚本
>
> - 本地安装依赖使用serverless部署，[点这里](tencentscf.md#1-安装-nodejs-环境)
> - Github Action 部署[点这里](tencentscf.md#github-action-部署)

## 1. 安装 Node.js 环境

Node.js 环境 [下载地址](https://nodejs.org/zh-tw/download/) ，根据自己的操作系统下载和安装。

## 2. 下载代码

点击红框处下载压缩包
![下载代码](https://imgbed-bucket-1251971143.cos.ap-guangzhou.myqcloud.com/1605497672397-zip.png)

## 3. 安装依赖，配置 cookie

### 3.1 安装依赖

压缩包解压后进入项目文件夹

- Windows 用户按住  **shift** 点击右键，点击 **在此处打开命令窗口**
- Mac 用户通过终端，自行进入该文件夹

在命令行内输入 `npm i `，等待运行完成。

此时，项目文件夹内会多出一个 `node_modules`文件夹

### 3.2 配置 cookie

打开项目文件内的 `jdCookie.js`

在最上面的 `CookieJDs`里写入 cookie ，多个账号以逗号分隔

例如

```javascript
let CookieJDs = [
  'pt_key=xxx;pt_pin=xxx;', 
  'pt_key=zzz;pt_pin=zzz;',
  'pt_key=aaa;pt_pin=xxxaaa'
]
```

> 注：获取京东 cookie 教程参考 [浏览器获取京东cookie教程](https://github.com/lxk0301/jd_scripts/blob/master/backUp/GetJdCookie.md) , [插件获取京东cookie教程](https://github.com/lxk0301/jd_scripts/blob/master/backUp/GetJdCookie2.md)


## 4. 部署到云函数

### 4.1 开通服务

依次登录 [SCF 云函数控制台](https://console.cloud.tencent.com/scf) 和 [SLS 控制台](https://console.cloud.tencent.com/sls) 开通相关服务，确保账户下已开通服务并创建相应[服务角色](https://console.cloud.tencent.com/cam/role) **SCF_QcsRole、SLS_QcsRole**

> 注意！为了确保权限足够，获取这两个参数时不要使用子账户！此外，腾讯云账户需要[实名认证](https://console.cloud.tencent.com/developer/auth)。

### 4.2 工具部署

下载 Serverless 工具，快速部署函数
```
npm install -g serverless
```

执行部署命令
```
serverless deploy
```

如果已经配置了永久秘钥，则可以直接部署，如果没有，可以直接**微信扫码**登录腾讯云，并且授权部署。

过几秒后，查看输出，可以看到函数和定时触发器都已经配置完成。
```
serverless ⚡framework
Action: "deploy" - Stage: "dev" - App: "jdscript" - Instance: "jdscript"

functionName: scf-jdscript
description:  This is a function in jdscript application.
namespace:    default
runtime:      Nodejs12.16
handler:      index.main_handler
memorySize:   64
lastVersion:  $LATEST
traffic:      1
triggers: 
  timer: 
    - timer-jdscript-dev

36s › jdscript › Success
```

## 5. 查看和测试

登录后，在 [腾讯云函数地址](https://console.cloud.tencent.com/scf/index) 点击管理控制台，查看最新部署的函数。

在左侧栏的日志查询中，可以查看到触发的日志，包括是否打卡成功等。

![测试函数](https://user-images.githubusercontent.com/6993269/99628053-5a9eea80-2a70-11eb-906f-f1d5ea2bfa3a.png)

> 如果需要配置永久秘钥，则可以在[访问秘钥页面](https://console.cloud.tencent.com/cam/capi)获取账号的 TENCENT_SECRET_ID，TENCENT_SECRET_KEY，并配置在代码根目录 .env 文件中。


# Github Action 部署
## 1. 开通服务

依次登录 [SCF 云函数控制台](https://console.cloud.tencent.com/scf) 和 [SLS 控制台](https://console.cloud.tencent.com/sls) 开通相关服务，确保账户下已开通服务并创建相应[服务角色](https://console.cloud.tencent.com/cam/role) **SCF_QcsRole、SLS_QcsRole**

> 注意！为了确保权限足够，获取这两个参数时不要使用子账户！此外，腾讯云账户需要[实名认证](https://console.cloud.tencent.com/developer/auth)。

## 2. 在这里新建一个访问密钥[新建密钥](https://console.cloud.tencent.com/cam/capi)
> 将SecretId和SecretKey分别配置在仓库的secrets变量里面， TENCENT_SECRET_ID对应你的SecretId的值，TENCENT_SECRET_KEY对应你的SecretKey的值

## 3. 配置自己需要secrets变量[参考这里](githubAction.md#下方提供使用到的-secrets全集合)

## 4.执行action workflow进行部署，workflow未报错即部署成功
![image](https://user-images.githubusercontent.com/6993269/99513289-6a152980-29c5-11eb-9266-3f56ba13d3b2.png)
## 5. 查看和测试
登录后，在 [腾讯云函数地址](https://console.cloud.tencent.com/scf/index) 点击管理控制台，查看最新部署的函数。

在左侧栏的日志查询中，可以查看到触发的日志，包括是否打卡成功等。

![测试函数](https://imgbed-bucket-1251971143.cos.ap-guangzhou.myqcloud.com/./1605263963294-test.png)
## 6. 设置触发器[看这里](iCloud.md#5设置触发器)
