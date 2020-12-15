/*
京东直播，每日18豆
活动结束时间未知
活动地址：https://h5.m.jd.com/babelDiy/Zeus/2zwQnu4WHRNfqMSdv69UPgpZMnE2/index.html/
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#京东直播
10-20/5 12 * * * https://raw.githubusercontent.com/lxk0301/jd_scripts/master/jd_live.js, tag=京东直播, enabled=true

================Loon==============
[Script]
cron "10-20/5 12 * * *" script-path=https://raw.githubusercontent.com/lxk0301/jd_scripts/master/jd_live.js,tag=京东直播

===============Surge=================
京东直播 = type=cron,cronexp="10-20/5 12 * * *",wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/lxk0301/jd_scripts/master/jd_live.js

============小火箭=========
京东直播 = type=cron,script-path=https://raw.githubusercontent.com/lxk0301/jd_scripts/master/jd_live.js, cronexpr="10-20/5 12 * * *", timeout=200, enable=true
 */
const $ = new Env('京东直播');

const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message;
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
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      cookie = cookiesArr[i];
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = '';
      message = '';
      await TotalBean();
      console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {"open-url": "https://bean.m.jd.com/"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        } else {
          $.setdata('', `CookieJD${i ? i + 1 : "" }`);//cookie失效，故清空cookie。$.setdata('', `CookieJD${i ? i + 1 : "" }`);//cookie失效，故清空cookie。
        }
        continue
      }
      await jdHealth()
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function jdHealth() {
  $.bean = 0
  await getTaskList()
  message += `领奖完成，共计获得 ${$.bean} 京豆\n`
  await showMsg();
}

function getTs() {
  return new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000
}
function showMsg() {
  return new Promise(resolve => {
    if (!jdNotify) {
      $.msg($.name, '', `${message}`);
    } else {
      $.log(`京东账号${$.index}${$.nickName}\n${message}`);
    }
    resolve()
  })
}

// 开始看
function getTaskList() {
  let body = {"timestamp": new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000 }
  return new Promise(resolve => {
    $.get(taskUrl("liveChannelTaskListToM", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            await superTask()
            await awardTask("starViewTask")
            console.log(`去做分享直播间任务`)
            await shareTask()
            await awardTask()
            console.log(`去做浏览直播间任务`)
            await viewTask()
            await awardTask("commonViewTask")
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function superTask() {
  let body = 'body=%7B%22liveId%22%3A%223019486%22%2C%22type%22%3A%22viewTask%22%2C%22authorId%22%3A%22681523%22%2C%22extra%22%3A%7B%22time%22%3A200%7D%7D&build=167454&client=apple&clientVersion=9.3.0&d_brand=apple&d_model=iPhone10%2C2&eid=eidIF3CF0112RTIyQTVGQTEtRDVCQy00Qg%3D%3D6HAJa9%2B/4Vedgo62xKQRoAb47%2Bpyu1EQs/6971aUvk0BQAsZLyQAYeid%2BPgbJ9BQoY1RFtkLCLP5OMqU&isBackground=N&joycious=194&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2&osVersion=14.2&partner=apple&rfs=0000&scope=01&screen=1242%2A2208&sign=68c0d87a5de62711bab9e6e796c08170&st=1607778652966&sv=100&uts=0f31TVRjBSsySvX9aqk89gHBMqz5E28EYCqc3cRu/4%2Bv0EzRuStHwMI1R5P9RqeizLow/pAquaX1v5IJQGVxUzSfExCFmfO0L7BEMvXnkeCZhKEsmSkbQm54W7ig8aRsmHiXp7YT/SOV7sEKxXauv59O/SAAFkr1egGgKev7Uj81nJRFDnNRSomlrOj2jQzH6iddCTSpydcSYRnDyDcodA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D'
  return new Promise(resolve => {
    $.post(taskPostUrl("liveChannelReportDataV912", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function viewTask() {
  let body = 'body=%7B%22liveId%22%3A%223008300%22%2C%22type%22%3A%22viewTask%22%2C%22authorId%22%3A%22644894%22%2C%22extra%22%3A%7B%22time%22%3A120%7D%7D&build=167408&client=apple&clientVersion=9.2.0&eid=eidIF3CF0112RTIyQTVGQTEtRDVCQy00Qg%3D%3D6HAJa9%2B/4Vedgo62xKQRoAb47%2Bpyu1EQs/6971aUvk0BQAsZLyQAYeid%2BPgbJ9BQoY1RFtkLCLP5OMqU&isBackground=N&joycious=194&openudid=53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2&osVersion=14.2&partner=TF&rfs=0000&scope=01&sign=90e14adc21c4bf31232a1ded5f4ba40e&st=1607561111999&sv=111&uts=0f31TVRjBSsxGLJHVBkddxFxBqY/8qFkrfEYLL0gkhB/JVGyEYIoD8r5rLvootZziQYAUyvIPogdJpesEuOMmvlisDx6AR2SEsfp381xPoggwvq8XaMYlOnHUV66TZiSfC%2BSgcLpB2v9cy/0Z41tT%2BuLheoEwBwDDYzANkZjncUI9PDCWpCg5/i0A14XfnsUTfQHbMqa3vwsY6QtsbNsgA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D'
  return new Promise(resolve => {
    $.post(taskPostUrl("liveChannelReportDataV912", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function shareTask() {
  let body = 'body=%7B%22liveId%22%3A%222995233%22%2C%22type%22%3A%22shareTask%22%2C%22authorId%22%3A%22682780%22%2C%22extra%22%3A%7B%22num%22%3A1%7D%7D&build=167408&client=apple&clientVersion=9.2.0&eid=eidIF3CF0112RTIyQTVGQTEtRDVCQy00Qg%3D%3D6HAJa9%2B/4Vedgo62xKQRoAb47%2Bpyu1EQs/6971aUvk0BQAsZLyQAYeid%2BPgbJ9BQoY1RFtkLCLP5OMqU&isBackground=Y&joycious=194&lang=zh_CN&networkType=wifi&networklibtype=JDNetworkBaseAF&openudid=53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2&osVersion=14.2&partner=TF&rfs=0000&scope=01&screen=1242%2A2208&sign=457d557a0902f43cbdf9fb735d2bcd64&st=1607559819969&sv=110&uts=0f31TVRjBSsxGLJHVBkddxFxBqY/8qFkrfEYLL0gkhB/JVGyEYIoD8r5rLvootZziQYAUyvIPogdJpesEuOMmvlisDx6AR2SEsfp381xPoggwvq8XaMYlOnHUV66TZiSfC%2BSgcLpB2v9cy/0Z41tT%2BuLheoEwBwDDYzANkZjncUI9PDCWpCg5/i0A14XfnsUTfQHbMqa3vwsY6QtsbNsgA%3D%3D&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D'
  return new Promise(resolve => {
    $.post(taskPostUrl("liveChannelReportDataV912", body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}

function awardTask(type="shareTask") {
  let body = `functionId=getChannelTaskRewardToM&appid=h5-live&body=%7B%22type%22%3A%22${type}%22%2C%22liveId%22%3A%222942545%22%7D&v=${getTs()}`
  return new Promise(resolve => {
    $.post(taskPostUrl(null, body,"https://api.m.jd.com/api"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.subCode === "0") {
              $.bean += data.sum
              console.log(`任务领奖成功，获得 ${data.sum} 京豆`);
              message += `任务领奖成功，获得 ${data.sum} 京豆\n`
            } else {
              console.log(`任务领奖失败，${data.msg}`)
            }
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
  })
}
function taskPostUrl(function_id, body = {}, url=null) {
  if(!url) url = `${JD_API_HOST}?functionId=${function_id}`
  return {
    url: url,
    body: body,
    headers: {
      "Cookie": cookie,
      "origin": "https://h5.m.jd.com",
      "referer": "https://h5.m.jd.com/",
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
    }
  }
}
function taskUrl(function_id, body = {}) {
  return {
    url: `${JD_API_HOST}?functionId=${function_id}&appid=h5-live&body=${escape(JSON.stringify(body))}&v=${new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000}`,
    headers: {
      "Cookie": cookie,
      "origin": "https://h5.m.jd.com",
      "referer": "https://h5.m.jd.com/",
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
    }
  }
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
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
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
            $.nickName = data['base'].nickname;
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
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
