/*
京豆签到,自用,可N个京东账号,IOS软件用户请使用 https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js
Node.JS专用
更新时间：2020-11-09
从 github @ruicky改写而来
version v0.0.1
create by ruicky
detail url: https://github.com/ruicky/jd_sign_bot
 */
const $ = new Env('京豆签到');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const exec = require('child_process').execSync
const fs = require('fs')
const download = require('download');
const path = "./result.txt";
const JD_DailyBonusPath = "./JD_DailyBonus.js";
let cookiesArr = [], cookie = '';

if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
}
!(async() => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  // 下载最新代码
  await downFile();
  const content = await fs.readFileSync('./JD_DailyBonus.js', 'utf8')
  for (let i =0; i < cookiesArr.length; i++) {
    cookie = cookiesArr[i];
    if (cookie) {
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      $.index = i + 1;
      $.nickName = '';
      await TotalBean();
      console.log(`*****************开始京东账号${$.index} ${$.nickName || $.UserName}京豆签到*******************\n`);
      console.log(`⚠⚠⚠⚠⚠⚠⚠⚠  如遇到Bark APP推送通知消息失败的,请换用其他通知方式,Bark对推送内容长度有限制  ⚠⚠⚠⚠⚠⚠⚠⚠⚠\n`)
      await changeFile(content);
      await  execSign();
    }
  }
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
async function execSign() {
  console.log(`\n开始执行脚本签到，请稍等`)
  try {
    if (notify.SCKEY || notify.BARK_PUSH || notify.DD_BOT_TOKEN || (notify.TG_BOT_TOKEN && notify.TG_USER_ID) || notify.IGOT_PUSH_KEY) {
      await exec("node JD_DailyBonus.js >> result.txt");
    } else {
      // 如果没有提供通知推送，则打印日志
      console.log('没有提供通知推送，则打印脚本执行日志')
      await exec(`node JD_DailyBonus.js`, { stdio: "inherit" });
    }
    // await exec("node JD_DailyBonus.js", { stdio: "inherit" });
    // console.log('执行完毕', new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toLocaleDateString())
    //发送通知
    if ($.isNode()) {
      let notifyContent = "";
      let BarkContent = '';
      if (fs.existsSync(path)) {
        notifyContent = await fs.readFileSync(path, "utf8");
        const barkContentStart = notifyContent.indexOf('【签到概览】')
        const barkContentEnd = notifyContent.length;
        if (process.env.JD_BEAN_SIGN_STOP_NOTIFY === 'true') return
        if (process.env.JD_BEAN_SIGN_NOTIFY_SIMPLE === 'true') {
          if (barkContentStart > -1 && barkContentEnd > -1) {
            BarkContent = notifyContent.substring(barkContentStart, barkContentEnd);
          }
          BarkContent = BarkContent.split('\n\n')[0];
        } else {
          if (barkContentStart > -1 && barkContentEnd > -1) {
            BarkContent = notifyContent.substring(barkContentStart, barkContentEnd);
          }
        }
      }
      //不管哪个时区,这里得到的都是北京时间的时间戳;
      const UTC8 = new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000;
      $.beanSignTime = timeFormat(UTC8);
      console.log(`脚本执行完毕时间：${$.beanSignTime}`)
      if (BarkContent) {
        await notify.sendNotify(`京豆签到 - 账号${$.index} - ${$.nickName || $.UserName}`, `【签到号 ${$.index}】: ${$.nickName || $.UserName}\n【签到时间】:  ${$.beanSignTime}\n${BarkContent}`);
      }
    }
    //运行完成后，删除下载的文件
    console.log('运行完成后，删除下载的文件\n')
    await deleteFile(path);//删除result.txt
    await deleteFile(JD_DailyBonusPath);//删除JD_DailyBonus.js
    console.log(`*****************京东账号${$.index} ${$.nickName || $.UserName}京豆签到完成*******************\n`);
  } catch (e) {
    console.log("京东签到脚本执行异常:" + e);
  }
}
async function downFile () {
  let url = '';
  // if (process.env.CDN_JD_DAILYBONUS) {
  //   url = 'https://cdn.jsdelivr.net/gh/NobyDa/Script@master/JD-DailyBonus/JD_DailyBonus.js';
  // } else if (process.env.JD_COOKIE) {
  //   url = 'https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js';
  // } else {
  //   url = 'https://cdn.jsdelivr.net/gh/NobyDa/Script@master/JD-DailyBonus/JD_DailyBonus.js';
  // }
  await downloadUrl();
  if ($.body) {
    url = 'https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js';
  } else {
    url = 'https://cdn.jsdelivr.net/gh/NobyDa/Script@master/JD-DailyBonus/JD_DailyBonus.js';
  }
  await download(url, './')
}

async function changeFile (content) {
  console.log(`开始替换变量`)
  let newContent = content.replace(/var Key = ''/, `var Key = '${cookie}'`);
  if (process.env.JD_BEAN_STOP && process.env.JD_BEAN_STOP !== '0') {
    newContent = newContent.replace(/var stop = 0/, `var stop = ${process.env.JD_BEAN_STOP * 1}`);
  }
  const zone = new Date().getTimezoneOffset();
  if (zone === 0) {
    //此处针对UTC-0时区用户做的
    newContent = newContent.replace(/tm\s=.*/, `tm = new Date(new Date().toLocaleDateString()).getTime() - 28800000;`);
  }
  try {
    await fs.writeFileSync(JD_DailyBonusPath, newContent, 'utf8');
    console.log('替换变量完毕');
  } catch (e) {
    console.log("京东签到写入文件异常:" + e);
  }
}
async function deleteFile(path) {
  // 查看文件result.txt是否存在,如果存在,先删除
  const fileExists = await fs.existsSync(path);
  // console.log('fileExists', fileExists);
  if (fileExists) {
    const unlinkRes = await fs.unlinkSync(path);
    // console.log('unlinkRes', unlinkRes)
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
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
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
function downloadUrl(url = 'https://raw.githubusercontent.com/NobyDa/Script/master/JD-DailyBonus/JD_DailyBonus.js') {
  return new Promise(resolve => {
    $.get({url}, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`检测到您不能访问外网,将使用CDN下载JD_DailyBonus.js文件`)
        } else {
          $.body = data;
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

function timeFormat(time) {
  let date;
  if (time) {
    date = new Date(time)
  } else {
    date = new Date();
  }
  return date.getFullYear() + '-' + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate());
}
function Env(t,s){return new class{constructor(t,s){this.name=t,this.data=null,this.dataFile="box.dat",this.logs=[],this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}getScript(t){return new Promise(s=>{$.get({url:t},(t,e,i)=>s(i))})}runScript(t,s){return new Promise(e=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=s&&s.timeout?s.timeout:o;const[h,a]=i.split("@"),r={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":h,Accept:"*/*"}};$.post(r,(t,s,i)=>e(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s),o=JSON.stringify(this.data);e?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(s,o):this.fs.writeFileSync(t,o)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return e;return o}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),o=e?this.getval(e):"";if(o)try{const t=JSON.parse(o);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(s),h=this.getval(i),a=i?"null"===h?null:h||"{}":"{}";try{const s=JSON.parse(a);this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i)}catch(s){const h={};this.lodash_set(h,o,t),e=this.setval(JSON.stringify(h),i)}}else e=$.setval(t,s);return e}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isLoon()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(e,null),s.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)))}post(t,s=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t));else if(this.isNode()){this.initGotEnv(t);const{url:e,...i}=t;this.got.post(e,i).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t))}}time(t){let s={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in s)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?s[e]:("00"+s[e]).substr((""+s[e]).length)));return t}msg(s=t,e="",i="",o){const h=t=>!t||!this.isLoon()&&this.isSurge()?t:"string"==typeof t?this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0:"object"==typeof t&&(t["open-url"]||t["media-url"])?this.isLoon()?t["open-url"]:this.isQuanX()?t:void 0:void 0;this.isSurge()||this.isLoon()?$notification.post(s,e,i,h(o)):this.isQuanX()&&$notify(s,e,i,h(o)),this.logs.push("","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="),this.logs.push(s),e&&this.logs.push(e),i&&this.logs.push(i)}log(...t){t.length>0?this.logs=[...this.logs,...t]:console.log(this.logs.join(this.logSeparator))}logErr(t,s){const e=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();e?$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,s)}
