/*
宠汪汪积分兑换奖品脚本, 目前脚本只兑换京豆，兑换京豆成功，才会发出通知提示，其他情况不通知。
更新时间：2021-1-20
活动入口：京东APP我的-更多工具-宠汪汪
兑换规则：一个账号一天只能兑换一次京豆。
兑换奖品成功后才会有系统弹窗通知
每日京豆库存会在0:00、8:00、16:00更新，经测试发现中午12:00也会有补发京豆。
支持京东双账号
脚本兼容: Quantumult X, Surge, Loon, JSBox, Node.js
==============Quantumult X==============
[task_local]
#宠汪汪积分兑换奖品
0 0-16/8 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_joy_reward.js, tag=宠汪汪积分兑换奖品, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdcww.png, enabled=true

==============Loon==============
[Script]
cron "0 0-16/8 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_joy_reward.js,tag=宠汪汪积分兑换奖品

================Surge===============
宠汪汪积分兑换奖品 = type=cron,cronexp="0 0-16/8 * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_joy_reward.js

===============小火箭==========
宠汪汪积分兑换奖品 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_joy_reward.js, cronexpr="0 0-16/8 * * *", timeout=3600, enable=true
 */
const $ = new Env('宠汪汪积分兑换奖品');
let joyRewardName = 20;//是否兑换京豆，默认开启兑换功能，其中20为兑换20京豆,500为兑换500京豆，0为不兑换京豆.数量有限先到先得
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
let jdNotify = false;//是否开启静默运行，默认false关闭(即:奖品兑换成功后会发出通知提示)
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  let cookiesData = $.getdata('CookiesJD') || "[]";
  cookiesData = jsonParse(cookiesData);
  cookiesArr = cookiesData.map(item => item.cookie);
  cookiesArr.reverse();
  cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
  cookiesArr.reverse();
  cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
}
const JD_API_HOST = 'https://jdjoy.jd.com';
!(async () => {
  if (!cookiesArr[0]) {
    $.msg('【京东账号一】宠汪汪积分兑换奖品失败', '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      await TotalBean();
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      console.log(`本地时间与京东服务器时间差(毫秒)：${await get_diff_time()}`);
      await joyReward();
      // $.msg($.name, '兑换脚本暂不能使用', `请停止使用，等待后期更新\n如果新版本兑换您有兑换机会，请抓包兑换\n再把抓包数据发送telegram用户@LXK9301`);
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

async function joyReward() {
  await getExchangeRewards();
  if ($.getExchangeRewardsRes && $.getExchangeRewardsRes.success) {
    // console.log('success', $.getExchangeRewardsRes);
    const data = $.getExchangeRewardsRes.data;
    const levelSaleInfos = data.levelSaleInfos;
    const giftSaleInfos = levelSaleInfos.giftSaleInfos;
    console.log(`当前积分 ${data.coin}\n`);
    console.log(`宠物等级 ${data.level}\n`);
    console.log(`京东昵称 ${$.nickName}\n`);
    let saleInfoId = '', giftValue = '', extInfo = '', leftStock = 0, salePrice = 0;
    let rewardNum = 0;
    if ($.isNode() && process.env.JD_JOY_REWARD_NAME) {
      rewardNum = process.env.JD_JOY_REWARD_NAME * 1;
    } else if ($.getdata('joyRewardName')) {
      if ($.getdata('joyRewardName') * 1 === 1) {
        //兼容之前的BoxJs设置
        rewardNum = 20;
      } else {
        rewardNum = $.getdata('joyRewardName') * 1;
      }
    } else {
      rewardNum = joyRewardName;
    }
    for (let item of giftSaleInfos) {
      if (item.giftType === 'jd_bean' && item['giftValue'] === rewardNum) {
        saleInfoId = item.id;
        leftStock = item.leftStock;
        salePrice = item.salePrice;
        giftValue = item.giftValue;
      }
    }
    console.log(`当前京豆库存:${leftStock}`)
    console.log(`saleInfoId:${saleInfoId}`)
    // 兼容之前BoxJs兑换设置的数据
    if (rewardNum && (rewardNum === 1 || rewardNum === 20 || rewardNum === 50 || rewardNum === 100 || rewardNum === 500 || rewardNum === 1000)) {
      //开始兑换
      if (data.coin >= salePrice) {
        if (leftStock) {
          if (!saleInfoId) return
          console.log(`当前账户积分:${data.coin}\n当前京豆库存:${leftStock}\n满足兑换条件,开始为您兑换京豆\n`);
          await exchange(saleInfoId, 'pet');
          if ($.exchangeRes && $.exchangeRes.success) {
            if ($.exchangeRes.errorCode === 'buy_success') {
              console.log(`兑换${giftValue}成功,【宠物等级】${data.level}\n【消耗积分】${salePrice}个\n【剩余积分】${data.coin - salePrice}个\n`)
              let ctrTemp;
              if ($.isNode() && process.env.JD_JOY_REWARD_NOTIFY) {
                ctrTemp = `${process.env.JD_JOY_REWARD_NOTIFY}` === 'false';
              } else if ($.getdata('jdJoyRewardNotify')) {
                ctrTemp = $.getdata('jdJoyRewardNotify') === 'false';
              } else {
                ctrTemp = `${jdNotify}` === 'false';
              }
              if (ctrTemp) {
                $.msg($.name, ``, `【京东账号${$.index}】${$.nickName}\n【${giftValue}京豆】兑换成功\n【宠物等级】${data.level}\n【积分详情】消耗积分 ${salePrice}, 剩余积分 ${data.coin - salePrice}`);
                if ($.isNode()) {
                  await notify.sendNotify(`${$.name} - 账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】 ${$.nickName}\n【${giftValue}京豆】兑换成功\n【宠物等级】${data.level}\n【积分详情】消耗积分 ${salePrice}, 剩余积分 ${data.coin - salePrice}`);
                }
              }
              // if ($.isNode()) {
              //   await notify.BarkNotify(`${$.name}`, `【京东账号${$.index}】 ${$.nickName}\n【兑换${giftName}】成功\n【宠物等级】${data.level}\n【消耗积分】${salePrice}分\n【当前剩余】${data.coin - salePrice}积分`);
              // }
            } else if ($.exchangeRes && $.exchangeRes.errorCode === 'buy_limit') {
              console.log(`兑换${rewardNum}京豆失败，原因：兑换京豆已达上限，请把机会留给更多的小伙伴~\n`)
              //$.msg($.name, `兑换${giftName}失败`, `【京东账号${$.index}】${$.nickName}\n兑换京豆已达上限\n请把机会留给更多的小伙伴~\n`)
            } else if ($.exchangeRes && $.exchangeRes.errorCode === 'stock_empty'){
              console.log(`兑换${rewardNum}京豆失败，原因：当前京豆库存为空\n`)
            } else {
              console.log(`兑奖异常:${JSON.stringify($.exchangeRes)}`)
            }
          } else {
            console.log(`兑换京豆异常:${JSON.stringify($.exchangeRes)}`)
          }
        } else {
          console.log(`兑换${rewardNum}京豆失败，原因：京豆库存不足，已抢完，请下一场再兑换`)
        }
      } else {
        console.log(`兑换${rewardNum}京豆失败，原因：您目前只有${data.coin}积分，已不足兑换${giftValue}京豆所需的${salePrice}积分\n`)
        //$.msg($.name, `兑换${giftName}失败`, `【京东账号${$.index}】${$.nickName}\n目前只有${data.coin}积分\n已不足兑换${giftName}所需的${salePrice}积分\n`)
      }
    } else {
      console.log('您设置了不兑换京豆,如需兑换京豆，请去BoxJs重新设置或修改第20行代码')
    }
  } else {
    console.log(`${$.name}getExchangeRewards异常,${JSON.stringify($.getExchangeRewardsRes)}`)
  }
}
function getExchangeRewards() {
  return new Promise((resolve) => {
    const option = {
      url: `${JD_API_HOST}/gift/getHomeInfo`,
      headers: {
        "Host": "jdjoy.jd.com",
        "Content-Type": "application/json",
        "Cookie": cookie,
        "reqSource": "h5",
        "Connection": "keep-alive",
        "Accept": "*/*",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
        "Referer": "https://jdjoy.jd.com/pet/index",
        "Accept-Language": "zh-cn",
        "Accept-Encoding": "gzip, deflate, br"
      },
    }
    $.get(option, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          $.getExchangeRewardsRes = {};
          if (safeGet(data)) {
            $.getExchangeRewardsRes = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  })
}
function exchange(saleInfoId, orderSource) {
  return new Promise((resolve) => {
    const body = {
      "buyParam": { saleInfoId, orderSource },
      "deviceInfo": {
        "eid": "",
        "fp": "",
        "deviceType": "",
        "macAddress": "",
        "imei": "",
        "os": "",
        "osVersion": "",
        "ip": "",
        "appId": "",
        "openUUID": "",
        "idfa": "",
        "uuid": "",
        "clientVersion": "",
        "networkType": "",
        "appType": "",
        "sdkToken": ""
      }
    }
    const option = {
      url: `${JD_API_HOST}/gift/new/exchange?reqSource=h5`,
      body: `${JSON.stringify(body)}`,
      headers: {
        "Host": "jdjoy.jd.com",
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Content-Type": "application/json",
        "Origin": "https://jdjoy.jd.com",
        "reqSource": "h5",
        "Connection": "keep-alive",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
        "Referer": "https://jdjoy.jd.com/pet/index",
        "Content-Length": "10",
        "Cookie": cookie
      },
    }
    $.post(option, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          console.log(`兑换结果:${data}`);
          $.exchangeRes = {};
          if (safeGet(data)) {
            $.exchangeRes = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    });
  })
}
function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
      "headers": {
        "Accept": "application/json,text/plain, */*",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
      }
    }
    $.post(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === 13) {
              $.isLogin = false; //cookie过期
              return
            }
            if (data['retcode'] === 0) {
              $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
            } else {
              $.nickName = $.UserName
            }
          } else {
            console.log(`京东服务器返回空数据`)
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function getJDServerTime() {
  return new Promise(resolve => {
    // console.log(Date.now())
    $.get({url: "https://a.jd.com//ajax/queryServerData.html",headers:{
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }}, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} 获取京东服务器时间失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          $.jdTime = data['serverTime'];
          // console.log(data['serverTime']);
          // console.log(data['serverTime'] - Date.now())
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve($.jdTime);
      }
    })
  })
}
async function get_diff_time() {
  // console.log(`本机时间戳 ${Date.now()}`)
  // console.log(`京东服务器时间戳 ${await getJDServerTime()}`)
  return Date.now() - await getJDServerTime();
}
function jsonParse(str) {
  if (typeof str == "string") {
    try {
      return JSON.parse(str);
    } catch (e) {
      console.log(e);
      $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
      return [];
    }
  }
}
function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}