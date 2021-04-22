const $ = new Env('直播间抽奖（全局）');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [
], cookie = '', message='';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {
  };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
let lotteryArr = []
!(async () => {
  cookie = cookiesArr[0]
  $.beans = cookiesArr.map(() => 0)
  $.attend = cookiesArr.map(() => 0)
  $.acts = 0
  await main()
  $.name = '直播间抽奖（全局）'
  await showMsg()
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function main() {
  for (let tab of [1, 76, 80, 77, 88, 78, 82, 89, 118, 113, 131, 132, 79, 96, 142, 155, 222, 243, 276]) {
    $.page = 1
    $.currentCount = 0
    console.log(`当前tab：${tab}`)
    while ($.page) {
      console.log(`当前页：${$.page}`)
      await discoveryLiveList(tab, $.page, $.currentCount)
      //await $.wait(2*1000)
    }
  }
}

function showMsg() {
  return new Promise(resolve => {
    for (let i = 0; i < $.beans.length; ++i) {
      message += `账号${i + 1}获得:${$.beans[i]}京豆（中奖概率${($.attend[i] / $.acts * 100).toFixed(2)}%）\n`
    }
    $.msg($.name, '', `${message}`);
    resolve()
  })
}

async function discoveryLiveList(tabId, page, currentCount) {
  let config = taskGetUrl("liveListWithTabToM", {
    "tabId": tabId, "page": page, "currentCount": currentCount, "timestamp": +new Date(), "appId": "mini-live"
  })
  return new Promise(async resolve => {
    $.get(config, async (err, resp, data) => {
      data = JSON.parse(data)
      if (data.data && data.data.list && data.data.list.length) {
        $.page++
        $.currentCount = data.data.currentCount
      } else {
        $.page = 0
      }
      for (let live of data.data.list) {
        if (live.data && live.data.userName) {
          $.name = live.data.userName
          $.id = live.data.id
          await getLiveActivity(live.data.id)
          //await $.wait(2*1000)
        }
      }
      resolve()
    })
  })
}


async function getLiveActivity(liveId = null) {
  let config = taskGetUrl("liveDetailToM", {"liveId": liveId, "sku": ""})
  config['headers']['Cookie'] = '1'
  return new Promise(async resolve => {
    $.get(config, async (err, resp, data) => {
      data = JSON.parse(data)
      if (data.data) {
        if(data.data.activityRemind) {
          $.acts++
          let lottery = data.data.activityRemind
          if (lottery.length) {
            lottery = lottery[0]
            console.log(`【${$.name}】找到抽奖活动！${lottery.data.lotteryId}`)
            if (!lotteryArr.includes(Number(lottery.data.lotteryId))) {
              let timeout = 0
              if (lottery['countdown']) {
                timeout = lottery['startTime'] - +new Date() + 500
                console.log(`需要等待 ${timeout} ms`)
                // await $.wait(timeout)
              } else
                await drawLiveActivity(lottery.data.lotteryId, liveId)
              lotteryArr.push(Number(lottery.data.lotteryId))
            } else {
              console.log(`抽奖活动已抽过`)
            }
          } else {
            console.log(`【${$.name}】未找到抽奖活动`)
          }
        }
      }else{
        console.log(`被检测到，等待60秒`)
        await $.wait(60*1000)
        await getLiveActivity(liveId)
      }
      resolve()
    })
  })
}

async function drawLiveActivity(lotteryId, liveId) {
  let config = taskGetUrl("liveNomalLotteryToM", {"lotteryId": lotteryId, "liveId": liveId})
  return new Promise(async resolve => {
    $.post(config, async (err, resp, data) => {
      data = JSON.parse(data)
      if (data && data.data && data.data.lotteryResult !== undefined) {
        $.bean = null
        switch (data.data.lotteryResult) {
          default:
          case 0:
          case 2:
            console.log(`账户1：未抽中`)
            break
          case 1:
            console.log(`账户1：优惠券`)
            break
          case 3:
            console.log('账户1：' + data.data.couponQuota)
            if (data.data.couponQuota && data.data.couponQuota.match(/(\d+)京豆/)) {
              $.beans[0] += Number(data.data.couponQuota.match(/(\d+)京豆/)[1])
              $.bean = Number(data.data.couponQuota.match(/(\d+)京豆/)[1])
            }
            $.attend[0]++
            break
        }
        for (let i = 1; i < cookiesArr.length; ++i) {
          config['headers']['Cookie'] = cookiesArr[i]
          $.index = i + 1
          await drawLiveActivity2(config)
        }
      }
      resolve()
    })
  })
}


async function drawLiveActivity2(config) {
  return new Promise(resolve => {
    $.get(config, (err, resp, data) => {
      data = JSON.parse(data)
      if (data && data.data && data.data.lotteryResult !== undefined) {
        switch (data.data.lotteryResult) {
          default:
          case 0:
            console.log(`账户${$.index}：未抽中`)
            break
          case 2:
            console.log(`账户${$.index}：优惠券`)
            break
          case 3:
            console.log(`账户${$.index}：` + data.data.couponQuota)
            if (data.data.couponQuota && data.data.couponQuota.match(/(\d+)京豆/)) {
              $.beans[$.index - 1] += Number(data.data.couponQuota.match(/(\d+)京豆/)[1])
              $.bean = Number(data.data.couponQuota.match(/(\d+)京豆/)[1])
            }
            $.attend[$.index - 1]++
            break
        }
      }
      resolve()
    })
  })
}


function taskGetUrl(function_id, body) {
  return {
    url: `https://api.m.jd.com/api?appid=mini-live&functionId=${function_id}&t=${+new Date()}&body=${escape(JSON.stringify(body))}`,
    headers: {
      'host': 'api.m.jd.com',
      'accept': 'application/json, text/plain, */*',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.1(0x1800012a) NetType/WIFI Language/zh_CN',
      'Referer': 'https://servicewechat.com/wx4830b51270836408/13/page-frame.html',
      'Cookie': cookie
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
    console.log(`服务器访问数据为空，请检查自身设备网络情况`);
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