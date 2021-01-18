/*
京东炸年兽🧨
活动时间:2021-1-18至2021-2-11
暂不加入品牌会员
活动入口:https://wbbny.m.jd.com/babelDiy/Zeus/2cKMj86srRdhgWcKonfExzK4ZMBy/index.html
活动地址：京东app左侧浮动窗口
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#京东炸年兽🧨
0 8 * * * https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_nian.js, tag=京东炸年兽🧨, enabled=true

================Loon==============
[Script]
cron "0 8 * * *" script-path=https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_nian.js,tag=京东炸年兽🧨

===============Surge=================
京东炸年兽🧨 = type=cron,cronexp="0 8 * * *",wake-system=1,timeout=200,script-path=https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_nian.js

============小火箭=========
京东炸年兽🧨 = type=cron,script-path=https://raw.githubusercontent.com/LXK9301/jd_scripts/master/jd_nian.js, cronexpr="0 8 * * *", timeout=200, enable=true
 */
const $ = new Env('京东炸年兽🧨');

const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
const randomCount = $.isNode() ? 20 : 5;
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
  cookiesArr = cookiesArr.filter(item => item !== "" && item !== null && item !== undefined);
}
const JD_API_HOST = 'https://api.m.jd.com/client.action';
const inviteCodes = [
  `cgxZaDXWZPCmiUa2akPVmFMI27K6antJzucULQPYNim_BPEW1Dwd@cgxZdTXtIrPYuAqfDgSpusxr97nagU6hwFa3TXxnqM95u3ib-xt4nWqZdz8@cgxZdTXtIO-O6QmYDVf67KCEJ19JcybuMB2_hYu8NSNQg0oS2Z_FpMce45g@cgxZdTXtILiLvg7OAASp61meehou4OeZvqbjghsZlc3rI5SBk7b3InUqSQ0@cgxZ9_MZ8gByP7FZ368dN8oTZBwGieaH5HvtnvXuK1Epn_KK8yol8OYGw7h3M2j_PxSZvYA`,
  `cgxZaDXWZPCmiUa2akPVmFMI27K6antJzucULQPYNim_BPEW1Dwd@cgxZdTXtIrPYuAqfDgSpusxr97nagU6hwFa3TXxnqM95u3ib-xt4nWqZdz8@cgxZdTXtIO-O6QmYDVf67KCEJ19JcybuMB2_hYu8NSNQg0oS2Z_FpMce45g@cgxZdTXtILiLvg7OAASp61meehou4OeZvqbjghsZlc3rI5SBk7b3InUqSQ0@cgxZdTXtIumO4w2cDgSqvYcqHwjaAzLxu0S371Dh_fctFJtN0tXYzdR7JaY`
];
!(async () => {
  await requireConfig();
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
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
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await shareCodesFormat();
      await jdNian()
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function jdNian() {
  await getHomeData()
  if(!$.secretp) return
  await map()
  await queryMaterials()
  await getTaskList()
  await $.wait(1000)
  await doTask()
  await helpFriends()
  await getHomeData(true)
  await showMsg()
}
function encode(data, aa, extraData) {
  const temp = {
    "extraData": JSON.stringify(extraData),
    "businessData": JSON.stringify(data),
    "secretp": aa,
  }
  return { "ss": (JSON.stringify(temp)) };
}
function getRnd() {
  return Math.floor(1e6 * Math.random()).toString();
}
function showMsg() {
  return new Promise(resolve => {
    console.log('任务已做完！\n如有未完成的任务，请多执行几次。注：目前入会任务不会做')
    if (!jdNotify) {
      $.msg($.name, '', `${message}`);
    } else {
      $.log(`京东账号${$.index}${$.nickName}\n${message}`);
    }
    if (new Date().getHours() === 23) {
      $.msg($.name, '', `京东账号${$.index}${$.nickName}\n${message}`);
    }
    resolve()
  })
}
async function helpFriends() {
  for (let code of $.newShareCodes) {
    if (!code) continue
    await getFriendData(code)
    await $.wait(1000)
  }
}
async function doTask() {
  for (let item of $.taskVos) {
    if (item.taskType === 14) {
      //好友助力任务
      //console.log(`您的好友助力码为${item.assistTaskDetailVo.taskToken}`)
    }
    if(item.taskType===2){
      if (item.status === 1) {
        console.log(`准备做此任务：${item.taskName}`)
        await getFeedDetail({"taskId":item.taskId},item.taskId)
      } else if(item.status===2){
        console.log(`${item.taskName}已做完`)
      }
    }
    else if (item.taskType === 3 || item.taskType === 26) {
      if(item.shoppingActivityVos) {
        if (item.status === 1) {
          console.log(`准备做此任务：${item.taskName}`)
          for (let task of item.shoppingActivityVos) {
            if (task.status === 1) {
              await collectScore(item.taskId, task.itemId);
            }
          }
        } else if (item.status === 2) {
          console.log(`${item.taskName}已做完`)
        }
      }
    }
    else if (item.taskType === 9) {
      if (item.status === 1) {
        console.log(`准备做此任务：${item.taskName}`)
        for (let task of item.shoppingActivityVos) {
          if (task.status === 1) {
            await collectScore(item.taskId, task.itemId, 1);
          }
        }
      } else if(item.status===2){
        console.log(`${item.taskName}已做完`)
      }
    }
    else if (item.taskType === 7) {
      if (item.status === 1) {
        console.log(`准备做此任务：${item.taskName}`)
        for (let task of item.browseShopVo) {
          if (task.status === 1) {
            await collectScore(item.taskId, task.itemId, 1);
          }
        }
      } else if(item.status===2){
        console.log(`${item.taskName}已做完`)
      }
    }
  }
}

function getFeedDetail(body={}) {
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_getFeedDetail", body, "nian_getFeedDetail"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              if(data.data.result.addProductVos){
                for(let vo of data.data.result.addProductVos){
                  if(vo['status']===1){
                    for(let i=0;i<vo.productInfoVos.length&&i+vo['times']<vo['maxTimes'];++i)
                    {
                      let bo = vo.productInfoVos[i]
                      await collectScore(vo['taskId'],bo['itemId'])
                      await $.wait(2000)
                    }
                  }
                }
              }
              if(data.data.result.taskVos){
                for(let vo of data.data.result.taskVos){
                  if(vo['status']===1){
                    for(let i=0;i<vo.productInfoVos.length&&i+vo['times']<vo['maxTimes'];++i)
                    {
                      let bo = vo.productInfoVos[i]
                      await collectScore(vo['taskId'],bo['itemId'])
                      await $.wait(2000)
                    }
                  }
                }
              }
              // $.userInfo = data.data.result.userInfo;
            }
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
function getHomeData(info=false) {
  return new Promise((resolve) => {
    $.post(taskPostUrl('nian_getHomeData'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data.data['bizCode'] === 0) {
            $.userInfo = data.data.result.homeMainInfo
            $.secretp = $.userInfo.secretp;
            if(!$.secretp){
              console.log(`账号被风控`)
              message += `账号被风控，无法参与活动\n`
              $.secretp = null
              return
            }
            console.log(`当前爆竹${$.userInfo.raiseInfo.remainScore}🧨，下一关需要${$.userInfo.raiseInfo.nextLevelScore}🧨`)

            if(info) {
              message += `当前爆竹${$.userInfo.raiseInfo.remainScore}🧨\n`
              return
            }
            if($.userInfo.raiseInfo.produceScore > 0){
              console.log(`可收取的爆竹大于0，去收取爆竹`)
              await collectProduceScore()
            }
            if(parseInt($.userInfo.raiseInfo.remainScore) >= parseInt($.userInfo.raiseInfo.curLevelStartScore)){
              console.log(`去升级`)
              await $.wait(2000)
              await raise()
            }
          }
          else{
            $.secretp = null
            console.log(`账号被风控，无法参与活动`)
            message += `账号被风控，无法参与活动\n`
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function collectProduceScore(taskId= "collectProducedCoin") {
  let temp = {
    "taskId": taskId,
    "rnd": getRnd(),
    "inviteId": "-1",
    "stealId": "-1"
  }
  const extraData = {
    "jj": 6,
    "buttonid": "jmdd-react-smash_0",
    "sceneid": "homePageh5",
    "appid": '50073'
  }
  const body = encode(temp, $.secretp, extraData);
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_collectProduceScore", body, "nian_collectProduceScore"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
             console.log(`收取成功，获得${data.data.result.produceScore}爆竹🧨`)
              // $.userInfo = data.data.result.userInfo;
            }
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
function collectScore(taskId,itemId,actionType=null,inviteId=null,shopSign=null) {
  let temp = {
    "taskId": taskId,
    "rnd": getRnd(),
    "inviteId": "-1",
    "stealId": "-1"
  }
  if(itemId) temp['itemId'] = itemId
  if(actionType) temp['actionType'] = actionType
  if(inviteId) temp['inviteId'] = inviteId
  if(shopSign) temp['shopSign'] = shopSign
  const extraData = {
    "jj": 6,
    "buttonid": "jmdd-react-smash_0",
    "sceneid": "homePageh5",
    "appid": '50073'
  }
  let body = {
    ...encode(temp, $.secretp, extraData),
    taskId:taskId,
    itemId:itemId
  }
  if(actionType) body['actionType'] = actionType
  if(inviteId) body['inviteId'] = inviteId
  if(shopSign) body['shopSign'] = shopSign
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_collectScore", body, "nian_collectScore"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              if(data.data.result.score)
                console.log(`任务完成，获得${data.data.result.score}爆竹🧨`)
              else if(data.data.result.maxAssistTimes) {
                console.log(`助力好友成功`)
              } else{
                console.log(`任务上报成功`)
                await $.wait(10*1000)
                if(data.data.result.taskToken){
                  await doTask2(data.data.result.taskToken)
                }
              }
              // $.userInfo = data.data.result.userInfo;
            }
            else{
              console.log(data.data.bizMsg)
            }
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
function doTask2(taskToken) {
  let body = {
    "dataSource":"newshortAward",
    "method":"getTaskAward",
    "reqParams":`{\"taskToken\":\"${taskToken}\"}`
  }
  return new Promise(resolve => {
    $.post(taskPostUrl("qryViewkitCallbackResult", body, ), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            // console.log(data)
            if (data.code === "0") {
              console.log(data.toast.subTitle + '🧨')
            }
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
function raise(taskId= "nian_raise") {
  let temp = {
    "taskId": taskId,
    "rnd": getRnd(),
    "inviteId": "-1",
    "stealId": "-1"
  }
  const extraData = {
    "jj": 6,
    "buttonid": "jmdd-react-smash_0",
    "sceneid": "homePageh5",
    "appid": '50073'
  }
  const body = encode(temp, $.secretp, extraData);
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_raise", body, "nian_raise"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              console.log(`升级成功`)
              // $.userInfo = data.data.result.userInfo;
            }
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
function getTaskList(body={}) {
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_getTaskDetail", body, "nian_getTaskDetail"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              if(JSON.stringify(body)==="{}") {
                $.taskVos = data.data.result.taskVos;//任务列表
                console.log(`您的好友助力码为${data.data.result.inviteId}`)
               }
              // $.userInfo = data.data.result.userInfo;
            }
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
function getFriendData(inviteId) {
  return new Promise((resolve) => {
    $.post(taskPostUrl('nian_getHomeData',{"inviteId":inviteId}), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          data = JSON.parse(data);
          if (data && data.data['bizCode'] === 0) {
            $.itemId = data.data.result.homeMainInfo.guestInfo.itemId
            await collectScore('2',$.itemId,null,inviteId)
          }
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function map() {
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_myMap", {}, "nian_myMap"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              let msg = '当前已开启的地图：'
              for(let vo of data.data.result.monsterInfoList){
                if(vo.curLevel) msg+= vo.name +' '
              }
              console.log(msg)
              // $.userInfo = data.data.result.userInfo;
            }
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
function queryMaterials() {
  let body = {"qryParam":"[{\"type\":\"advertGroup\",\"mapTo\":\"viewLogo\",\"id\":\"05149412\"},{\"type\":\"advertGroup\",\"mapTo\":\"bottomLogo\",\"id\":\"05149413\"}]","activityId":"2cKMj86srRdhgWcKonfExzK4ZMBy","pageId":"","reqSrc":"","applyKey":"21beast"}
  return new Promise(resolve => {
    $.post(taskPostUrl("qryCompositeMaterials", body, "qryCompositeMaterials"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if(data.code==='0') {
              for(let vo of data.data.viewLogo.list){
                console.log(`去做${vo.name}店铺任务`)
                await shopLotteryInfo(vo.desc)
                await $.wait(2000)
              }
            }
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
function shopLotteryInfo(shopSign) {
  let body = {"shopSign":shopSign}
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_shopLotteryInfo", body, "nian_shopLotteryInfo"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if(data.code===0) {
              for(let vo of data.data.result.taskVos){
                if(vo.status===1){
                  if(vo.taskType===12){
                    console.log(`去做${vo.taskName}任务`)
                    await $.wait(2000)
                    await collectScore(vo.taskId,vo.simpleRecordInfoVo.itemId,null,null,shopSign)
                  }
                  else if (vo.taskType === 3 || vo.taskType === 26) {
                    if(vo.shoppingActivityVos) {
                      if (vo.status === 1) {
                        console.log(`准备做此任务：${vo.taskName}`)
                        for (let task of vo.shoppingActivityVos) {
                          if (task.status === 1) {
                            await $.wait(2000)
                            await collectScore(vo.taskId, task.advId,null,null,shopSign);
                          }
                        }
                      } else if (vo.status === 2) {
                        console.log(`${vo.taskName}已做完`)
                      }
                    }
                  }
                }
              }
              for(let i=0;i<data.data.result.lotteryNum;++i){
                console.log(`去抽奖：${i+1}/${data.data.result.lotteryNum}`)
                await $.wait(2000)
                await doShopLottery(shopSign)
              }
            }
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
function doShopLottery(shopSign) {
  let body = {"shopSign":shopSign}
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_doShopLottery", body, "nian_doShopLottery"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if(data.code===0 && data.data && data.data.result) {
              let result = data.data.result
              if(result.awardType===4)
                console.log(`抽奖成功，获得${result.score}爆竹🧨`)
              else if(result.awardType===2 || result.awardType===3)
                console.log(`抽奖成功，获得优惠卷`)
              else
                console.log(`抽奖成功，获得${JSON.stringify(result)}`)
            }else{
              console.log(`抽奖失败`)
            }
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
function signInRead(shopSign) {
  let body = {"shopSign":shopSign}
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_shopSignInRead", body, "nian_shopSignInRead"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if(data.code===0 && data.data && data.data.result && data.data.result.signInTag) {
              await signInWrite(shopSign)
            } else{
              console.log(`店铺已签到过`)
            }
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
function signInWrite(shopSign) {
  let temp = {
    "shopSign": shopSign,
  }
  const extraData = {
    "jj": 6,
    "buttonid": "jmdd-react-smash_0",
    "sceneid": "homePageh5",
    "appid": '50073'
  }
  let body = {
    ...encode(temp, $.secretp, extraData),
    shopSign:shopSign
  }
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_shopSignInWrite", body, "nian_shopSignInWrite"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.data.bizCode === 0) {
              if(data.data.result.score)
                console.log(`签到成功，获得${data.data.result.score}爆竹🧨`)
            }
            else{
              console.log(data.data.bizMsg)
            }
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

function pkInfo() {
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_pk_getHomeData", {}, "nian_pk_getHomeData"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            console.log(data)
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
function pkCollectScore() {
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_pk_collectScore", {}, "nian_pk_collectScore"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            console.log(data)
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
function pkTaskDetail() {
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_pk_getTaskDetail", {}, "nian_pk_getTaskDetail"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            console.log(data)
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
function pkAssignGroup(inviteId) {
  let temp = {
    "confirmFlag": 1,
    "inviteId": inviteId,
  }
  const extraData = {
    "jj": 6,
    "buttonid": "jmdd-react-smash_0",
    "sceneid": "homePageh5",
    "appid": '50073'
  }
  let body = {
    ...encode(temp, $.secretp, extraData),
    inviteId:inviteId
  }
  return new Promise(resolve => {
    $.post(taskPostUrl("nian_pk_assistGroup", body, "nian_pk_assistGroup"), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            console.log(data)
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
function readShareCode() {
  console.log(`开始`)
  return new Promise(async resolve => {
    $.get({url: `https://code.chiang.fun/api/v1/jd/jdnian/read/${randomCount}/`, 'timeout': 10000}, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log(`随机取${randomCount}个码放到您固定的互助码后面(不影响已有固定互助)`)
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(2000);
    resolve()
  })
}
//格式化助力码
function shareCodesFormat() {
  return new Promise(async resolve => {
    // console.log(`第${$.index}个京东账号的助力码:::${$.shareCodesArr[$.index - 1]}`)
    $.newShareCodes = [];
    if ($.shareCodesArr[$.index - 1]) {
      $.newShareCodes = $.shareCodesArr[$.index - 1].split('@');
    } else {
      console.log(`由于您第${$.index}个京东账号未提供shareCode,将采纳本脚本自带的助力码\n`)
      const tempIndex = $.index > inviteCodes.length ? (inviteCodes.length - 1) : ($.index - 1);
      $.newShareCodes = inviteCodes[tempIndex].split('@');
    }
    const readShareCodeRes = await readShareCode();
    if (readShareCodeRes && readShareCodeRes.code === 200) {
      $.newShareCodes = [...new Set([...$.newShareCodes, ...(readShareCodeRes.data || [])])];
    }
    console.log(`第${$.index}个京东账号将要助力的好友${JSON.stringify($.newShareCodes)}`)
    resolve();
  })
}
function requireConfig() {
  return new Promise(resolve => {
    console.log(`开始获取${$.name}配置文件\n`);
    //Node.js用户请在jdCookie.js处填写京东ck;
    let shareCodes = []
    console.log(`共${cookiesArr.length}个京东账号\n`);
    if ($.isNode() && process.env.JDNIAN_SHARECODES) {
      if (process.env.JDNIAN_SHARECODES.indexOf('\n') > -1) {
        shareCodes = process.env.JDNIAN_SHARECODES.split('\n');
      } else {
        shareCodes = process.env.JDNIAN_SHARECODES.split('&');
      }
    }
    $.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(shareCodes).forEach((item) => {
        if (shareCodes[item]) {
          $.shareCodesArr.push(shareCodes[item])
        }
      })
    }
    console.log(`您提供了${$.shareCodesArr.length}个账号的${$.name}助力码\n`);
    resolve()
  })
}

function taskPostUrl(function_id, body = {}, function_id2) {
  let url = `${JD_API_HOST}`;
  if (function_id2) {
    url += `?functionId=${function_id2}`;
  }
  return {
    url,
    body: `functionId=${function_id}&body=${escape(JSON.stringify(body))}&client=wh5&clientVersion=1.0.0`,
    headers: {
      "Cookie": cookie,
      "origin": "https://h5.m.jd.com",
      "referer": "https://h5.m.jd.com/",
      'Content-Type': 'application/x-www-form-urlencoded',
      "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0")
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
