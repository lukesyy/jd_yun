## 环境变量说明

##### 京东(必须)

| Name                    |   归属   | 属性   | 说明                                                         |
| :---------------------: | :----------: | --------- | ------------------------------------------------------------ |
| `JD_COOKIE`             |   京东   | 必须   | 京东cookie,多个账号的cookie使用`&`隔开或者换行。具体获取参考[浏览器获取京东cookie教程](https://github.com/lxk0301/jd_scripts/blob/master/backUp/GetJdCookie.md) 或者 [插件获取京东cookie教程](https://github.com/lxk0301/jd_scripts/blob/master/backUp/GetJdCookie2.md) |

##### 京东隐私安全 环境变量

| Name                    |   归属   | 属性   | 说明                                                         |
| :---------------------: | :----------: | --------- | ------------------------------------------------------------ |
| `JD_DEBUG`              |   脚本打印log   | 非必须   | 运行脚本时，是否显示log,默认显示。改成false表示不显示，注重隐私的人可以在设置secret -> `Name:JD_DEBUG,Value:false` |
| `JD_USER_AGENT`         |   京东   | 非必须   | 自定义此库里京东系列脚本的UserAgent，不懂不知不会UserAgent的请不要随意填写内容。具体获取参考此[issue](https://github.com/lxk0301/jd_scripts/issues/127) |

##### 推送通知环境变量(目前提供`微信server酱`、`pushplus(推送加)`、`iOS Bark APP`、`telegram机器人`、`钉钉机器人`、`企业微信机器人`、`iGot`、`QQ酷推`等通知方式)

| Name                    |   归属   | 属性   | 说明                                                         |
| :---------------------: | :----------: | --------- | ------------------------------------------------------------ |
| `PUSH_KEY`              |   微信server酱推送   | 非必须 | server酱的微信通知[官方文档](http://sc.ftqq.com/3.version) |
| `BARK_PUSH`             |   [BARK推送](https://apps.apple.com/us/app/bark-customed-notifications/id1403753865)   | 非必须 | IOS用户下载BARK这个APP,填写内容是app提供的`设备码`，例如：https://api.day.app/123 ，那么此处的设备码就是`123`，再不懂看 [这个图](icon/bark.jpg)（注：支持自建填完整链接即可） |
| `BARK_SOUND`            |   [BARK推送](https://apps.apple.com/us/app/bark-customed-notifications/id1403753865)   | 非必须 | bark推送声音设置，例如`choo`,具体值请在`bark`-`推送铃声`-`查看所有铃声` |
| `TG_BOT_TOKEN`          |   telegram推送   | 非必须 | tg推送(需设备可连接外网),`TG_BOT_TOKEN`和`TG_USER_ID`两者必需,填写自己申请[@BotFather](https://t.me/BotFather)的Token,如`10xxx4:AAFcqxxxxgER5uw` , [具体教程](./backUp/TG_PUSH.md) |
| `TG_USER_ID`            |   telegram推送   | 非必须 | tg推送(需设备可连接外网),`TG_BOT_TOKEN`和`TG_USER_ID`两者必需,填写[@getuseridbot](https://t.me/getuseridbot)中获取到的纯数字ID, [具体教程](./backUp/TG_PUSH.md) |
| `DD_BOT_TOKEN`          |   钉钉推送   | 非必须 | 钉钉推送(`DD_BOT_TOKEN`和`DD_BOT_SECRET`两者必需)[官方文档](https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq) ,只需`https://oapi.dingtalk.com/robot/send?access_token=XXX` 等于`=`符号后面的XXX即可 |
| `DD_BOT_SECRET`         |   钉钉推送   | 非必须 | (`DD_BOT_TOKEN`和`DD_BOT_SECRET`两者必需) ,密钥，机器人安全设置页面，加签一栏下面显示的SEC开头的`SECXXXXXXXXXX`等字符 , 注:钉钉机器人安全设置只需勾选`加签`即可，其他选项不要勾选,再不懂看 [这个图](icon/DD_bot.png) |
| `QYWX_KEY`              |   企业微信推送   | 非必须 | 密钥，企业微信推送 webhook 后面的 key [详见官方说明文档](https://work.weixin.qq.com/api/doc/90000/90136/91770) |
| `IGOT_PUSH_KEY`         |   iGot推送   | 非必须 | iGot聚合推送，支持多方式推送，确保消息可达。 [参考文档](https://wahao.github.io/Bark-MP-helper ) |
| `QQ_SKEY`               |   酷推(Cool Push)推送   | 非必须 | 推送所需的Skey,登录后获取Skey [参考文档](https://cp.xuthus.cc/) |
| `QQ_MODE`               |   酷推(Cool Push)推送   | 非必须 | 推送方式(send或group或者wx，默认send) [参考文档](https://cp.xuthus.cc/) |
| `PUSH_PLUS_TOKEN`       |   pushplus推送  | 非必须 | 微信扫码登录后一对一推送或一对多推送下面的token(您的Token) [官方网站](http://pushplus.hxtrip.com/)                     |
| `PUSH_PLUS_USER`        |   pushplus推送  | 非必须 | 一对多推送的“群组编码”（一对多推送下面->您的群组(如无则新建)->群组编码）注:(1、需订阅者扫描二维码 2、如果您是创建群组所属人，也需点击“查看二维码”扫描绑定，否则不能接受群组消息推送)，只填`PUSH_PLUS_TOKEN`默认为一对一推送                    |
| `TG_PROXY_HOST`         |  Telegram 代理的 IP  | 非必须 | 代理类型为 http。例子：http代理 http://127.0.0.1:1080 则填写 127.0.0.1 |
| `TG_PROXY_PORT`         |  Telegram 代理的端口  | 非必须 | 例子：http代理 http://127.0.0.1:1080 则填写 1080 |

##### 互助码类环境变量

| Name                        | 归属             | 属性 | 说明                                                                                                                                                                |
| --------------------------- | ------------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FRUITSHARECODES`           | 东东农场互助码 | 非必须 | 填写规则请看[jdFruitShareCodes.js](https://github.com/lxk0301/jd_scripts/blob/master/jdFruitShareCodes.js)或见下方[互助码的填写规则](#互助码的填写规则) |
| `PETSHARECODES`             | 东东萌宠互助码 | 非必须 | 填写规则请看[jdPetShareCodes.js](https://github.com/lxk0301/jd_scripts/blob/master/jdPetShareCodes.js)或见下方[互助码的填写规则](#互助码的填写规则) |
| `PLANT_BEAN_SHARECODES`     | 种豆得豆互助码 | 非必须 | 填写规则请看[jdPlantBeanShareCodes.js](https://github.com/lxk0301/jd_scripts/blob/master/jdPlantBeanShareCodes.js)或见下方[互助码的填写规则](#互助码的填写规则) |
| `SUPERMARKET_SHARECODES`    | 东东超市商圈互助码 | 非必须 | 填写规则请看[jdSuperMarketShareCodes.js](https://github.com/lxk0301/jd_scripts/blob/master/jdSuperMarketShareCodes.js)或见下方[互助码的填写规则](#互助码的填写规则) |
| `DDFACTORY_SHARECODES`      | 东东工厂互助码 | 非必须 | 填写规则请看[jdFactoryShareCodes.js](https://github.com/lxk0301/jd_scripts/blob/master/jdFactoryShareCodes.js)或见下方[互助码的填写规则](#互助码的填写规则) |
| `DREAM_FACTORY_SHARE_CODES` | 京喜工厂互助码 | 非必须 | 填写规则请看[jdDreamFactoryShareCodes.js](https://github.com/lxk0301/jd_scripts/blob/master/jdDreamFactoryShareCodes.js)或见下方[互助码的填写规则](#互助码的填写规则) |
| `JDZZ_SHARECODES`           | 京东赚赚互助码 | 非必须 | 填写规则和上面类似，或见下方[互助码的填写规则](#互助码的填写规则)                                                                       |
| `JDJOY_SHARECODES`          | 疯狂的JOY互助码 | 非必须 | 填写规则和上面类似，或见下方[互助码的填写规则](#互助码的填写规则)                                                                       |
| `BOOKSHOP_SHARECODES`       | 京东书店互助码 | 非必须 | 填写规则和上面类似，或见下方[互助码的填写规则](#互助码的填写规则)                                                                       |
| `JD_CASH_SHARECODES`        | 签到领现金互助码 | 非必须 | 填写规则和上面类似，或见下方[互助码的填写规则](#互助码的填写规则)                                                                       |
| `JXNC_SHARECODES`           | 京喜农场互助码 | 非必须 | 填写规则和上面类似，或见下方[互助码的填写规则](#互助码的填写规则)                                                                       |

##### 控制脚本功能环境变量

| Name                         | 归属                      | 属性 | 说明                                                                                                                                                                                                                                                   |
| ---------------------------- | --------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `JD_BEAN_STOP`               | 京东                      | 非必须 | `jd_bean_sign.js`自定义延迟签到,单位毫秒.默认分批并发无延迟.延迟作用于每个签到接口,如填入延迟则切换顺序签到(耗时较长),如需填写建议输入数字`1`，详见[此处说明](https://github.com/NobyDa/Script/blob/master/JD-DailyBonus/JD_DailyBonus.js#L93) |
| `JD_BEAN_SIGN_STOP_NOTIFY`   | 京东                      | 非必须 | `jd_bean_sign.js`脚本运行后不推送签到结果通知，默认推送，填`true`表示不发送通知                                                                                                                                              |
| `JD_BEAN_SIGN_NOTIFY_SIMPLE` | 京东                      | 非必须 | `jd_bean_sign.js`脚本运行后推送签到结果简洁版通知，默认推送全部签到结果，填`true`表示推送简洁通知，[效果图](./icon/bean_sign_simple.jpg)                                                                        |
| `PET_NOTIFY_CONTROL`         | 东东萌宠推送开关           | 非必须 | 控制京东萌宠是否静默运行,`false`为否(发送推送通知消息),`true`为是(即：不发送推送通知消息)                                                                                                                             |
| `FRUIT_NOTIFY_CONTROL`       | 东东农场推送开关           | 非必须 | 控制京东农场是否静默运行,`false`为否(发送推送通知消息),`true`为是(即：不发送推送通知消息)                                                                                                                             |
| `JD_JOY_REWARD_NOTIFY`       | 宠汪汪兑换京豆推送开关      | 非必须 | 控制`jd_joy_reward.js`脚本是否静默运行,`false`为否(发送推送通知消息),`true`为是(即：不发送推送通知消息)                                                                                                                 |
| `JD_818_SHAREID_NOTIFY`      | 京东818互助码通知开关      | 非必须 | 控制`jd_818.js`脚本是否在获取互助码后通知,`true`为是(发送推送通知消息),`false`为否(即：不发送推送通知消息)                                                                                                         |
| `JOY_FEED_COUNT`             | 宠汪汪喂食数量             | 非必须 | 控制`jd_joy_feedPets.js`脚本喂食数量,可以填的数字10,20,40,80,其他数字不可.                                                                                                                                                           |
| `JOY_HELP_FEED`              | 宠汪汪帮好友喂食           | 非必须 | 控制`jd_joy_steal.js`脚本是否给好友喂食,`false`为否,`true`为是(给好友喂食)                                                                                                                                                           |
| `JOY_RUN_FLAG`               | 宠汪汪是否赛跑             | 非必须 | 控制`jd_joy.js`脚本是否参加赛跑(默认参加双人赛跑),`false`为否,`true`为是，脚本默认是`true`                                                                                                                                   |
| `JOY_TEAM_LEVEL`             | 宠汪汪参加什么级别的赛跑    | 非必须 | 控制`jd_joy.js`脚本参加几人的赛跑,可选数字为`2`,`10`,`50`，其中2代表参加双人PK赛，10代表参加10人突围赛，50代表参加50人挑战赛(注：此项功能在`JOY_RUN_FLAG`为true的时候才生效)，如若想设置不同账号参加不同类别的比赛则用&区分即可(如下三个账号：`2&10&50`) |
| `JD_JOY_REWARD_NAME`         | 宠汪汪积分兑换多少京豆      | 非必须 | 目前可填值为`20`或者`500`,脚本默认`20`,`0`表示不兑换京豆                                                                                                                                                                              |
| `MARKET_COIN_TO_BEANS`       | 京小超兑换京豆数量          | 非必须 | 控制`jd_blueCoin.js`兑换京豆数量,可输入值为`20`或者`1000`的数字或者其他商品的名称,例如`碧浪洗衣凝珠`                                                                                                                  |
| `MARKET_REWARD_NOTIFY`       | 京小超兑换奖品推送开关      | 非必须 | 控制`jd_blueCoin.js`兑换奖品成功后是否静默运行,`false`为否(发送推送通知消息),`true`为是(即：不发送推送通知消息)                                                                                                    |
| `SUPERMARKET_UPGRADE`        | 京小超自动升级             | 非必须 | 自动升级,顺序:解锁升级商品、升级货架,`true`表示自动升级,`false`表示关闭自动升级                                                                                                                                           |
| `BUSINESS_CIRCLE_JUMP`       | 京小超自动更换商圈         | 非必须 | 小于对方300热力值自动更换商圈队伍,`true`表示运行,`false`表示禁止                                                                                                                                                                  |
| `SUPERMARKET_LOTTERY`        | 京小超抽奖                 | 非必须 | 每天运行脚本是否使用金币去抽奖,`true`表示抽奖,`false`表示不抽奖                                                                                                                                                                  |
| `FRUIT_BEAN_CARD`            | 农场使用水滴换豆卡           | 非必须 | 农场使用水滴换豆卡(如果出现限时活动时100g水换20豆,此时比浇水划算,推荐换豆),`true`表示换豆(不浇水),`false`表示不换豆(继续浇水),脚本默认是浇水                                                      |
| `UN_SUBSCRIBES`              | jd_unsubscribe.js           | 非必须 | 共四个参数,换行隔开.四个参数分别表示`取关商品数量`,`取关店铺数量`,`遇到此商品不再进行取关`,`遇到此店铺不再进行取关`，[具体使用往下看](#取关店铺secret的说明)                           |
| `UN_BIND_CARD_NUM`           | jd_unbind.js                | 非必须 | 注销京东已开的店铺会员，不是注销京东plus会员，个别店铺无法注销。此参数控制每次运行脚本时注销多少个店铺会员，默认200。                                                                             |
| `UN_BIND_STOP_CARD`          | jd_unbind.js                | 非必须 | 注销京东已开的店铺会员，不是注销京东plus会员，个别店铺无法注销。遇到此参数设定的会员卡则跳过不注销，多个会员卡之间以`&`分隔，默认值"京东PLUS会员"。                                   |
| `JDJOY_HELPSELF`             | 疯狂的JOY                   | 非必须 | 疯狂的JOY循环助力，`true`表示循环助力,`false`表示不循环助力，默认不开启循环助力。                                                                                                                                        |
| `JDJOY_APPLYJDBEAN`          | 疯狂的JOY                   | 非必须 | 疯狂的JOY京豆兑换，目前最小值为2000京豆(详情请查看活动页面-提现京豆)，默认数字`0`不开启京豆兑换。                                                                                                                                                             |
| `BUY_JOY_LEVEL`              | 疯狂的JOY                   | 非必须 | 疯狂的JOY自动购买什么等级的JOY                                                                                                                                                                                                               |
| `MONEY_TREE_SELL_FRUIT`      | 摇钱树是否卖出金果           | 非必须 | 控制摇钱树脚本是否自动卖出金果兑换成金币，`true`卖出，`false`不卖出，默认`false`                                                                                                                                           |
| `FACTORAY_WANTPRODUCT_NAME`  | 东东工厂心仪商品             | 非必须 | 提供心仪商品名称(请尽量填写完整和别的商品有区分度)，达到条件后兑换，如不提供则会兑换当前所选商品                                                                                                          |
| `JXNCTOKENS`                 | 京喜农场TOKEN               | 非必须 | 每个账号 token 是一个 json，示例：{"farm_jstoken":"749a90f871adsfads8ffda7bf3b1576760","timestamp":"1610165423873","phoneid":"42c7e3dadfadsfdsaac-18f0e4f4a0cf"}，多账单间使用`&`或换行分开。                                    |

##### 互助码的填写规则

  > 互助码如何获取：运行相应脚本后，在日志里面可以找到。(如何查看日志上面有写，详见 如何查看action运行情况)

同一个京东账号的好友互助码用@隔开,不同京东账号互助码用&或者换行隔开,下面给一个文字示例和具体互助码示例说明

两个账号各两个互助码的文字示例：

  ```
京东账号1的shareCode1@京东账号1的shareCode2&京东账号2的shareCode1@京东账号2的shareCode2
  ```

 两个账号各两个互助码的真实示例：
  ``` 
0a74407df5df4fa99672a037eec61f7e@dbb21614667246fabcfd9685b6f448f3&6fbd26cc27ac44d6a7fed34092453f77@61ff5c624949454aa88561f2cd721bf6&6fbd26cc27ac44d6a7fed34092453f77@61ff5c624949454aa88561f2cd721bf6
  ```



#### 取关店铺secret的说明

 > secret依次是`取关商品数`,`取关店铺数`,`遇到此商品不再进行取关`,`遇到此店铺不再进行取关`

例如我要取关 `100`个商品，`100`个店铺，商品遇到商品关键字 `iPhone12` 停止取关，店铺遇到 `Apple京东自营旗舰店` 不再取关
则使用`换行`或者`&`隔开即可,
下面给出换行隔开示例:

 ```
100
100
iPhone12
Apple京东自营旗舰店
 ```

下面给出`&`符号隔开示例:
 ```
100&100&iPhone12&Apple京东自营旗舰店
 ```

#### 关于脚本推送通知频率

  > 如果你填写了推送通知方式中的某一种通知所需环境变量，那么脚本通知情况如下：

  > 目前默认只有jd_fruit.js,jd_pet.js,jd_bean_sign.js,jd_818.js四个脚本每次运行后都通知

  ```
jd_plantBean.js是每周一收集京豆后通知一次，
jd_joy_reward.js是每次兑换到了京豆通知一次，
jd_blueCoin.js是每次兑换到了奖品通知一次，
jd_818.js是每次获取新的互助码会通知一次，以帮助您快速上车，
其余的脚本平常运行都是不通知，只有在京东cookie失效后，才会推送通知    
  ```

