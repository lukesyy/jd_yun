/*
LXK9301修改自用，单独开宝箱
******************************************************************************
本人github地址     https://github.com/ziye12/JavaScript
转载请备注个名字，谢谢

1.5 调整宝箱策略，20分钟运行一次就行
*/
const $ = Env(`企鹅读书开宝箱`)
const notify = $.isNode() ? require("../sendNotify") : "";
const logs = 1;   //0为关闭日志，1为开启

let task, tz = '', kz, config = '', CASH = '', COOKIES_SPLIT = '' ;
let dk,ljyd,sp,ydrw,wktime;

let qqreadbodyVal = ``;
let qqreadtimeurlVal = ``;
let qqreadtimeheaderVal = ``;
let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);
//云函数使用在下面填写
let QQ_READ_COOKIES = [
  {
    "qqreadbodyVal": ``,
    "qqreadtimeurlVal": ``,
    "qqreadtimeheaderVal": ``
  }
]

!(async () => {
  await getNodeCookie();
  await open_box();
})()
.catch((e) => {
  $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
})
.finally(() => {
  $.done();
})

async function open_box() {
  for (let i = 0; i < QQ_READ_COOKIES.length; i++) {
    $.log(`\n*************开始QQ账号${i + 1}**************\n`);
    // tz = '';
    $.isLogin = true;
    if (!QQ_READ_COOKIES[i]["qqreadbodyVal"] || !QQ_READ_COOKIES[i]['qqreadtimeurlVal'] || !QQ_READ_COOKIES[i]['qqreadtimeheaderVal']) {
      $.log(`账号${i + 1}暂未提供脚本执行所需的cookie`);
      continue
    }
    qqreadbodyVal = QQ_READ_COOKIES[i]['qqreadbodyVal'];
    qqreadtimeurlVal = QQ_READ_COOKIES[i]['qqreadtimeurlVal'];
    qqreadtimeheaderVal = QQ_READ_COOKIES[i]['qqreadtimeheaderVal'];
    await qqreadinfo();//用户名
    if (!$.isLogin) {
      $.log(`企鹅阅读账号${i + 1} cookie过期`);
      if (nowTimes.getHours() % 12 === 0 && (nowTimes.getMinutes() > 0 && nowTimes.getMinutes() <= 15)) {
        await notify.sendNotify(`企鹅阅读账号${i + 1} cookie过期`, '请及时更新 QQ_READ_TIME_HEADER_VAL')
      }
      continue
    }
    //单独开宝箱
    if (nowTimes.getHours() === 0 && (nowTimes.getMinutes() >= 0 && nowTimes.getMinutes() <= 59)) {
      await qqreadtrack();//更新
    }
    await qqreadtask();//任务列表
    if (task.data && ljyd.doneFlag == 0) {
      await qqreaddayread();//阅读任务
    }
    if (task.data && task.data.treasureBox.timeInterval <= 10000) {
      await $.wait(task.data.treasureBox.timeInterval)
      await qqreadbox();//宝箱
    }
    if (task.data && task.data.treasureBox.timeInterval - 600000 <= 10000) {
      await $.wait(task.data.treasureBox.timeInterval - 600000)
      await qqreadbox2();//宝箱翻倍
    }
  }
  await showmsg();//通知
}


function showmsg() {
  return new Promise(async resolve => {
    if (nowTimes.getHours() === 23 && (nowTimes.getMinutes() > 0 && nowTimes.getMinutes() <= 15)) {
      await notify.sendNotify($.name, tz);
    }
    $.msg($.name, "", tz);
    resolve()
  })
}


// 更新
function qqreadtrack() {
  return new Promise((resolve, reject) => {
    const body = qqreadbodyVal.replace(new RegExp(/"dis":[0-9]{13}/), `"dis":${new Date().getTime()}`)
    const toqqreadtrackurl = {
      url: "https://mqqapi.reader.qq.com/log/v4/mqq/track",
      headers: JSON.parse(qqreadtimeheaderVal),
      body: body,
      timeout: 60000,
    };
    $.post(toqqreadtrackurl, (error, response, data) => {
      if (logs) $.log(`更新: ${data}`);
      let track = JSON.parse(data);
      const date = new Date(JSON.parse(qqreadbodyVal).dataList[0].dis)
      let Y = date.getFullYear() + '-';
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      let D = date.getDate() + ' ';
      let h = date.getHours() + ':';
      let m = date.getMinutes() + ':';
      let s = date.getSeconds();
      let time = Y + M + D + h + m + s;
      tz += `【数据更新】:更新${track.msg},\n【cookie获取时间】${time}\n`;
      kz += `【数据更新】:更新${track.msg},\n【cookie获取时间】${time}\n`;
      resolve();
    });
  });
}
// 用户名
function qqreadinfo() {
  return new Promise((resolve, reject) => {
    const toqqreadinfourl = {
      url: "https://mqqapi.reader.qq.com/mqq/user/init",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadinfourl, (error, response, data) => {
      if (logs) $.log(`用户名: ${data}`);
      const info = JSON.parse(data);
      if (info.code === 0) {
        $.isLogin = info.data['isLogin'];
        if (!$.isLogin) {
          resolve();
          return
        }
      }
      kz += `\n========== 【${info.data.user.nickName}】 ==========\n`;
      tz += `\n========== 【${info.data.user.nickName}】 ==========\n`;

      resolve();
    });
  });
}
// 任务列表
function qqreadtask() {
  return new Promise((resolve, reject) => {
    const toqqreadtaskurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/page?fromGuid=",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadtaskurl, (error, response, data) => {
      if (logs) $.log(`任务列表: ${data}`);
      task = JSON.parse(data);
      dk = task.data.taskList.find(item => item.type === 200);
      ljyd = task.data.taskList.find(item => item.type === 210);
      ydrw = task.data.taskList.find(item => item.type === 220);
      sp = task.data.taskList.find(item => item.type === 230);

      if (task.data.invite.nextInviteConfig) {
        tz +=
            `【现金余额】:${(task.data.user.amount / 10000).toFixed(2)}元\n` +
            `【第${task.data.invite.issue}期】:时间${task.data.invite.dayRange}\n` +
            ` 已邀请${task.data.invite.inviteCount}人，再邀请${task.data.invite.nextInviteConfig.count}人获得${task.data.invite.nextInviteConfig.amount}金币\n` +
            `【${dk.title}】:${dk.amount}金币,${dk.actionText}\n` +
            `【${ljyd.title}】:${ljyd.amount}金币,${ljyd.actionText}\n` +
            `【${ydrw.title}】:${ydrw.amount}金币,${ydrw.actionText}\n` +
            `【${sp.title}】:${sp.amount}金币,${sp.actionText}\n` +
            `【宝箱任务${task.data.treasureBox.count + 1}】:${task.data.treasureBox.timeInterval / 1000
            }秒后领取\n` +
            `【${task.data.fans.title}】:${task.data.fans.fansCount}个好友,${task.data.fans.todayAmount}金币\n`;
      }

      kz +=
          `【现金余额】:${(task.data.user.amount / 10000).toFixed(2)}元\n` +
          `【宝箱任务${task.data.treasureBox.count + 1}】:${task.data.treasureBox.timeInterval / 1000
          }秒后领取\n` +
          `【已开宝箱】:${task.data.treasureBox.count}个\n`;

      resolve();
    });
  });
}
// 每日阅读
function qqreaddayread() {
  return new Promise((resolve, reject) => {
    const toqqreaddayreadurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/read_book",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreaddayreadurl, (error, response, data) => {
      if (logs) $.log(`每日阅读: ${data}`);
      let dayread = JSON.parse(data);
      if (dayread.code == 0) {
        tz += `【每日阅读】:获得${dayread.data.amount}金币\n`;
        kz += `【每日阅读】:获得${dayread.data.amount}金币\n`;
      }
      resolve();
    });
  });
}
// 宝箱奖励
function qqreadbox() {
  return new Promise((resolve, reject) => {
    const toqqreadboxurl = {
      url: "https://mqqapi.reader.qq.com/mqq/red_packet/user/treasure_box",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadboxurl, (error, response, data) => {
      if (logs) $.log(`宝箱奖励: ${data}`);
      let box = JSON.parse(data);
      if (box.code == 0 && box.data.amount) {
        tz += `【宝箱奖励${box.data.count}】:获得${box.data.amount}金币\n`;
        kz += `【宝箱奖励${box.data.count}】:获得${box.data.amount}金币\n`;
      }

      resolve();
    });
  });
}
// 宝箱奖励翻倍
function qqreadbox2() {
  return new Promise((resolve, reject) => {
    const toqqreadbox2url = {
      url:
          "https://mqqapi.reader.qq.com/mqq/red_packet/user/treasure_box_video",
      headers: JSON.parse(qqreadtimeheaderVal),
      timeout: 60000,
    };
    $.get(toqqreadbox2url, (error, response, data) => {
      if (logs) $.log(`宝箱奖励翻倍: ${data}`);
      let box2 = JSON.parse(data);
      if (box2.code == 0 && box2.data.amount) {
        tz += `【宝箱翻倍】:获得${box2.data.amount}金币\n`;
        kz += `【宝箱翻倍】:获得${box2.data.amount}金币\n`;
      }
      resolve();
    });
  });
}
function getNodeCookie() {
  if ($.isNode()) {
    let QQ_READ_BODY_VAL = [], QQ_READ_TIME_URL_VAL = [], QQ_READ_TIME_HEADER_VAL = [];
    if (process.env.QQ_READ_HEADER_VAL) {
      if (process.env.QQ_READ_HEADER_VAL.indexOf('@') > -1) {
        console.log(`您的QQ_READ_HEADER_VAL选择的是用@隔开\n`)
        QQ_READ_BODY_VAL = process.env.QQ_READ_HEADER_VAL.split('@');
      } else if (process.env.QQ_READ_HEADER_VAL.indexOf('\n') > -1) {
        console.log(`您的QQ_READ_HEADER_VAL选择的是用换行隔开\n`)
        QQ_READ_BODY_VAL = process.env.QQ_READ_HEADER_VAL.split('\n');
      } else {
        QQ_READ_BODY_VAL = [process.env.QQ_READ_HEADER_VAL];
      }
    }
    if (process.env.QQ_READ_TIME_URL_VAL) {
      if (process.env.QQ_READ_TIME_URL_VAL.indexOf('@') > -1) {
        console.log(`您的QQ_READ_TIME_URL_VAL选择的是用@隔开\n`)
        QQ_READ_TIME_URL_VAL = process.env.QQ_READ_TIME_URL_VAL.split('@');
      } else if (process.env.QQ_READ_HEADER_VAL.indexOf('\n') > -1) {
        console.log(`您的QQ_READ_TIME_URL_VAL选择的是用换行隔开\n`)
        QQ_READ_TIME_URL_VAL = process.env.QQ_READ_TIME_URL_VAL.split('\n');
      } else {
        QQ_READ_TIME_URL_VAL = [process.env.QQ_READ_TIME_URL_VAL];
      }
      // QQ_READ_TIME_URL_VAL = [...new Set(QQ_READ_TIME_URL_VAL)]
    }
    if (process.env.QQ_READ_TIME_HEADER_VAL) {
      if (process.env.QQ_READ_TIME_HEADER_VAL.indexOf('@') > -1) {
        console.log(`您的QQ_READ_TIME_HEADER_VAL选择的是用@隔开\n`)
        QQ_READ_TIME_HEADER_VAL = process.env.QQ_READ_TIME_HEADER_VAL.split('@');
      } else if (process.env.QQ_READ_TIME_HEADER_VAL.indexOf('\n') > -1) {
        console.log(`您的QQ_READ_TIME_HEADER_VAL选择的是用换行隔开\n`)
        QQ_READ_TIME_HEADER_VAL = process.env.QQ_READ_TIME_HEADER_VAL.split('\n');
      } else {
        QQ_READ_TIME_HEADER_VAL = [process.env.QQ_READ_TIME_HEADER_VAL];
      }
      // QQ_READ_TIME_HEADER_VAL = [...new Set(QQ_READ_TIME_HEADER_VAL)]
    }
    if (QQ_READ_BODY_VAL && QQ_READ_BODY_VAL.length > 0) QQ_READ_COOKIES = [];
    for (let i = 0; i < QQ_READ_BODY_VAL.length; i ++) {
      QQ_READ_COOKIES.push({
        "qqreadbodyVal": QQ_READ_BODY_VAL[i] || "",
        "qqreadtimeurlVal": QQ_READ_TIME_URL_VAL[i] || "",
        "qqreadtimeheaderVal": QQ_READ_TIME_HEADER_VAL[i] || ""
      })
    }
    // console.log(`${JSON.stringify(QQ_READ_COOKIES)}`)
  }
}
// prettier-ignore
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), a = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(a, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t) { let e = { "M+": (new Date).getMonth() + 1, "d+": (new Date).getDate(), "H+": (new Date).getHours(), "m+": (new Date).getMinutes(), "s+": (new Date).getSeconds(), "q+": Math.floor(((new Date).getMonth() + 3) / 3), S: (new Date).getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length))); for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))); let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="]; h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h) } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }