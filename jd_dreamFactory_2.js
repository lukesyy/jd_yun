/*
京东京喜工厂
更新时间：2021-1-27
活动入口 :京东APP->游戏与互动->查看更多->京喜工厂
或者: 京东APP首页搜索 "玩一玩" ,造物工厂即可
脚本内置了一个给作者任务助力的网络请求，默认开启，如介意请自行关闭。
参数 helpAuthor = false
脚本作者：lxk0301

 */
const $ = new Env('京喜工厂');
const JD_API_HOST = 'https://m.jingxi.com';
const helpAuthor = true;
const notify = $.isNode() ? require('./sendNotify') : '';
let jdNotify = false;//是否关闭通知，false打开通知推送，true关闭通知推送
const randomCount = $.isNode() ? 0 : 5;
let tuanActiveId = `0_pzMedR7KhclCkMIgkTkg==`;
const jxOpenUrl = `openjd://virtual?params=%7B%20%22category%22:%20%22jump%22,%20%22des%22:%20%22m%22,%20%22url%22:%20%22https://wqsd.jd.com/pingou/dream_factory/index.html%22%20%7D`;
let cookiesArr = [], cookie = '', message = '', allMessage = '';
const inviteCodes = ['6lw84c1ARwpoRyOtfnF77g==@J1t777njetfQcyEg57lzQA==@W9u_eBl3YKbSjXu0QP3HGQ=@VV55A_oKz5u5CYrL3jxPdg=='
];
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
$.tuanIds = [''];
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
  if (process.env.DREAMFACTORY_FORBID_ACCOUNT) process.env.DREAMFACTORY_FORBID_ACCOUNT.split('&').map((item, index) => Number(item) === 0 ? cookiesArr = [] : cookiesArr.splice(Number(item) - 1 - index, 1))
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
!(async () => {
  $.CryptoJS = $.isNode() ? require('crypto-js') : CryptoJS;
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
      $.ele = 0;
      $.pickEle = 0;
      $.pickFriendEle = 0;
      $.friendList = [];
      $.canHelpFlag = true;//能否助力朋友
      await TotalBean();
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await jdDreamFactory()
    }
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {

      cookie = cookiesArr[i];
      $.isLogin = true;
      await TotalBean();
      if (!$.isLogin) {
        continue
      }
      console.log(`\n参加作者的团\n`);
      await joinLeaderTuan();//参团
      $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
      console.log(`\n账号内部相互进团\n`);
      for (let item of $.tuanIds) {
        console.log(`${$.UserName} 去参加团 ${item}\n`);
        await JoinTuan(item);
      }
    }
  }
  if ($.isNode() && allMessage) {
    await notify.sendNotify(`${$.name}`, `${allMessage}`, { url: jxOpenUrl })
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })

async function jdDreamFactory() {
  try {
    if(helpAuthor){
      await joinLeaderTuan()
    }
    await userInfo();
    await QueryFriendList();//查询今日招工情况以及剩余助力次数
    // await joinLeaderTuan();//参团
    await helpFriends();
    if (!$.unActive) return
    await getUserElectricity();
    await taskList();
    await investElectric();
    await QueryHireReward();//收取招工电力
    await PickUp();//收取自家的地下零件
    await stealFriend();
    await tuanActivity();
    await QueryAllTuan();
    await exchangeProNotify();
    await showMsg();
  } catch (e) {
    $.logErr(e)
  }
}

/*
// 收取发电机的电力
function collectElectricity(facId = $.factoryId, help = false, master) {
  return new Promise(async resolve => {
    // let url = `/dreamfactory/generator/CollectCurrentElectricity?zone=dream_factory&apptoken=&pgtimestamp=&phoneID=&factoryid=${facId}&doubleflag=1&sceneval=2&g_login_type=1`;
    // if (help && master) {
    //   url = `/dreamfactory/generator/CollectCurrentElectricity?zone=dream_factory&factoryid=${facId}&master=${master}&sceneval=2&g_login_type=1`;
    // }
    let body = `factoryid=${facId}&apptoken=&pgtimestamp=&phoneID=&doubleflag=1&_stk=_time,apptoken,doubleflag,factoryid,pgtimestamp,phoneID,zone&h5st=20210303175934018;4053152679023161;10001;tk01w99261c60a8nK3pmNkhWWC84pGME0hBXDBW0nQ60pffBUcvRVZXdjdDGQXi5lMXh8yLT/EKfpyovcQsyW1q+0pxx;ad8093ee2d38a61537df0e1138d48b763e257804f78adffdddabf8609ee6a747`;
    if (help && master) {
      body += `factoryid=${facId}&master=${master}`;
    }
    $.get(taskurl(`generator/CollectCurrentElectricity`, body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              if (help) {
                $.ele += Number(data.data['loginPinCollectElectricity'])
                console.log(`帮助好友收取 ${data.data['CollectElectricity']} 电力，获得 ${data.data['loginPinCollectElectricity']} 电力`);
                message += `【帮助好友】帮助成功，获得 ${data.data['loginPinCollectElectricity']} 电力\n`
              } else {
                $.ele += Number(data.data['CollectElectricity'])
                console.log(`收取电力成功: 共${data.data['CollectElectricity']} `);
                message += `【收取发电站】收取成功，获得 ${data.data['CollectElectricity']} 电力\n`
              }
            } else {
              if (help) {
                console.log(`收取好友电力失败:${data.msg}\n`);
              } else {
                console.log(`收取电力失败:${data.msg}\n`);
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

// 投入电力
function investElectric() {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/userinfo/InvestElectric?zone=dream_factory&productionId=${$.productionId}&sceneval=2&g_login_type=1`;
    $.get(taskurl('userinfo/InvestElectric', `productionId=${$.productionId}`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data.ret === 0) {
              console.log(`成功投入电力${data.data.investElectric}电力`);
              message += `【投入电力】投入成功，共计 ${data.data.investElectric} 电力\n`;
            } else {
              console.log(`投入失败，${data.msg}`);
              message += `【投入电力】投入失败，${data.msg}\n`;
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

// 初始化任务
function taskList() {
  return new Promise(async resolve => {
    // const url = `/newtasksys/newtasksys_front/GetUserTaskStatusList?source=dreamfactory&bizCode=dream_factory&sceneval=2&g_login_type=1`;
    $.get(newtasksysUrl('GetUserTaskStatusList'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            let userTaskStatusList = data['data']['userTaskStatusList'];
            for (let i = 0; i < userTaskStatusList.length; i++) {
              const vo = userTaskStatusList[i];
              if (vo['awardStatus'] !== 1) {
                if (vo.completedTimes >= vo.targetTimes) {
                  console.log(`任务：${vo.description}可完成`)
                  await completeTask(vo.taskId, vo.taskName)
                  await $.wait(1000);//延迟等待一秒
                } else {
                  switch (vo.taskType) {
                    case 2: // 逛一逛任务
                    case 6: // 浏览商品任务
                    case 9: // 开宝箱
                      for (let i = vo.completedTimes; i <= vo.configTargetTimes; ++i) {
                        console.log(`去做任务：${vo.taskName}`)
                        await doTask(vo.taskId)
                        await completeTask(vo.taskId, vo.taskName)
                        await $.wait(1000);//延迟等待一秒
                      }
                      break
                    case 4: // 招工
                      break
                    case 5:
                      // 收集类
                      break
                    case 1: // 登陆领奖
                    default:
                      break
                  }
                }
              }
            }
            console.log(`完成任务：共领取${$.ele}电力`)
            message += `【每日任务】领奖成功，共计 ${$.ele} 电力\n`;
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

// 获得用户电力情况
function getUserElectricity() {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/generator/QueryCurrentElectricityQuantity?zone=dream_factory&factoryid=${$.factoryId}&sceneval=2&g_login_type=1`
    $.get(taskurl(`generator/QueryCurrentElectricityQuantity`, `factoryid=${$.factoryId}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              console.log(`\nnextCollectDoubleFlag::${data.data.nextCollectDoubleFlag}`);
              console.log(`nextCollectDoubleType::${data.data.nextCollectDoubleType}\n`);
              $.log(`下次集满收取${data.data.nextCollectDoubleFlag === 1 ? '可' : '不可'}双倍电力`)
              console.log(`发电机：当前 ${data.data.currentElectricityQuantity} 电力，最大值 ${data.data.maxElectricityQuantity} 电力`)
              if (data.data.nextCollectDoubleFlag === 1) {
                if (data.data.currentElectricityQuantity === data.data.maxElectricityQuantity && data.data.doubleElectricityFlag) {
                  console.log(`发电机：电力可翻倍并收获`)
                  // await shareReport();
                  await collectElectricity()
                } else {
                  message += `【发电机电力】当前 ${data.data.currentElectricityQuantity} 电力，未达到收获标准\n`
                }
              } else {
                //再收取双倍电力达到上限时，直接收取，不再等到满级
                await collectElectricity()
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

//查询有多少的招工电力可收取
function QueryHireReward() {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/friend/HireAward?zone=dream_factory&date=${new Date().Format("yyyyMMdd")}&type=0&sceneval=2&g_login_type=1`
    $.get(taskurl('friend/QueryHireReward'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              for (let item of data['data']['hireReward']) {
                if (item.date !== new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).Format("yyyyMMdd")) {
                  await hireAward(item.date, item.type);
                }
              }
            } else {
              console.log(`异常：${JSON.stringify(data)}`)
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
// 收取招工/劳模电力
function hireAward(date, type = 0) {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/friend/HireAward?zone=dream_factory&date=${new Date().Format("yyyyMMdd")}&type=0&sceneval=2&g_login_type=1`
    $.get(taskurl('friend/HireAward', `date=${date}&type=${type}`, '_time,date,type,zone'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              console.log(`打工电力：收取成功`)
              message += `【打工电力】：收取成功\n`
            } else {
              console.log(`打工电力：收取失败，${data.msg}`)
              message += `【打工电力】收取失败，${data.msg}\n`
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
async function helpFriends() {
  let Hours = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).getHours();
  if ($.canHelpFlag && Hours >= 6) {
    await shareCodesFormat();
    for (let code of $.newShareCodes) {
      if (code) {
        if ($.encryptPin === code) {
          console.log(`不能为自己助力,跳过`);
          continue;
        }
        const assistFriendRes = await assistFriend(code);
        if (assistFriendRes && assistFriendRes['ret'] === 0) {
          console.log(`助力朋友：${code}成功，因一次只能助力一个，故跳出助力`)
          break
        } else if (assistFriendRes && assistFriendRes['ret'] === 11009) {
          console.log(`助力朋友[${code}]失败：${assistFriendRes.msg}，跳出助力`);
          break
        } else {
          console.log(`助力朋友[${code}]失败：${assistFriendRes.msg}`)
        }
      }
    }
  } else {
    $.log(`今日助力好友机会已耗尽\n`);
  }
}
// 帮助用户
function assistFriend(sharepin) {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/friend/AssistFriend?zone=dream_factory&sharepin=${escape(sharepin)}&sceneval=2&g_login_type=1`
    const options = {
      'url': `https://m.jingxi.com/dreamfactory/friend/AssistFriend?zone=dream_factory&sharepin=${escape(sharepin)}&sceneval=2&g_login_type=1`,
      'headers': {
        "Accept": "",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Host": "m.jingxi.com",
        "Referer": "https://st.jingxi.com/pingou/dream_factory/index.html",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            // if (data['ret'] === 0) {
            //   console.log(`助力朋友：${sharepin}成功`)
            // } else {
            //   console.log(`助力朋友[${sharepin}]失败：${data.msg}`)
            // }
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
//查询助力招工情况
function QueryFriendList() {
  return new Promise(async resolve => {
    $.get(taskurl('friend/QueryFriendList'), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              const { assistListToday = [], assistNumMax, hireListToday = [], hireNumMax } = data;
              if (assistListToday.length === assistNumMax) {
                $.canHelpFlag = false;
              }
              $.log(`【今日招工进度】${hireListToday.length}/${hireNumMax}`);
              message += `【招工进度】${hireListToday.length}/${hireNumMax}\n`;
            } else {
              console.log(`QueryFriendList异常：${JSON.stringify(data)}`)
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
// 任务领奖
function completeTask(taskId, taskName) {
  return new Promise(async resolve => {
    // const url = `/newtasksys/newtasksys_front/Award?source=dreamfactory&bizCode=dream_factory&taskId=${taskId}&sceneval=2&g_login_type=1`;
    $.get(newtasksysUrl('Award', taskId), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            switch (data['data']['awardStatus']) {
              case 1:
                $.ele += Number(data['data']['prizeInfo'].replace('\\n', ''))
                console.log(`领取${taskName}任务奖励成功，收获：${Number(data['data']['prizeInfo'].replace('\\n', ''))}电力`);
                break
              case 1013:
              case 0:
                console.log(`领取${taskName}任务奖励失败，任务已领奖`);
                break
              default:
                console.log(`领取${taskName}任务奖励失败，${data['msg']}`)
                break
            }
            // if (data['ret'] === 0) {
            //   console.log("做任务完成！")
            // } else {
            //   console.log(`异常：${JSON.stringify(data)}`)
            // }
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
// 完成任务
function doTask(taskId) {
  return new Promise(async resolve => {
    // const url = `/newtasksys/newtasksys_front/DoTask?source=dreamfactory&bizCode=dream_factory&taskId=${taskId}&sceneval=2&g_login_type=1`;
    $.get(newtasksysUrl('DoTask', taskId, '_time,bizCode,configExtra,source,taskId'), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              console.log("做任务完成！")
            } else {
              console.log(`DoTask异常：${JSON.stringify(data)}`)
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
*/
// 初始化个人信息
function userInfo() {
  return new Promise(async resolve => {
    $.get(taskurl('userinfo/GetUserInfo', `pin=&sharePin=&shareType=&materialTuanPin=&materialTuanId=`, '_time,materialTuanId,materialTuanPin,pin,sharePin,shareType,source,zone'), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              $.unActive = true;//标记是否开启了京喜活动或者选购了商品进行生产
              $.encryptPin = '';
              $.shelvesList = [];
              if (data.factoryList && data.productionList) {
                const production = data.productionList[0];
                const factory = data.factoryList[0];
                const productionStage = data.productionStage;
                $.factoryId = factory.factoryId;//工厂ID
                $.productionId = production.productionId;//商品ID
                $.commodityDimId = production.commodityDimId;
                $.encryptPin = data.user.encryptPin;
                // subTitle = data.user.pin;
                await GetCommodityDetails();//获取已选购的商品信息
                if (productionStage['productionStageAwardStatus'] === 1) {
                  $.log(`可以开红包了\n`);
                  await DrawProductionStagePrize();//领取红包
                } else {
                  $.log(`再加${productionStage['productionStageProgress']}电力可开红包\n`)
                }
                console.log(`当前电力：${data.user.electric}`)
                console.log(`当前等级：${data.user.currentLevel}`)
                console.log(`\n【京东账号${$.index}（${$.nickName || $.UserName}）的${$.name}好友互助码】${data.user.encryptPin}`);
                console.log(`已投入电力：${production.investedElectric}`);
                console.log(`所需电力：${production.needElectric}`);
                console.log(`生产进度：${((production.investedElectric / production.needElectric) * 100).toFixed(2)}%`);
                message += `【京东账号${$.index}】${$.nickName}\n`
                message += `【生产商品】${$.productName}\n`;
                message += `【当前等级】${data.user.userIdentity} ${data.user.currentLevel}\n`;
                message += `【生产进度】${((production.investedElectric / production.needElectric) * 100).toFixed(2)}%\n`;
                if (production.investedElectric >= production.needElectric) {
                  $.log(`可以对方商品了`)
                  // await exchangeProNotify()
                }
              } else {
                $.unActive = false;//标记是否开启了京喜活动或者选购了商品进行生产
                if (!data.factoryList) {
                  console.log(`【提示】京东账号${$.index}[${$.nickName}]京喜工厂活动未开始\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 开启活动\n`);
                  // $.msg($.name, '【提示】', `京东账号${$.index}[${$.nickName}]京喜工厂活动未开始\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 开启活动`);
                } else if (data.factoryList && !data.productionList) {
                  console.log(`【提示】京东账号${$.index}[${$.nickName}]京喜工厂未选购商品\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 选购\n`)
                  let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);
                  if (nowTimes.getHours()  === 12) {
                    //如按每小时运行一次，则此处将一天推送2次提醒
                    $.msg($.name, '提醒⏰', `京东账号${$.index}[${$.nickName}]京喜工厂未选择商品\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 选择商品`);
                    // if ($.isNode()) await notify.sendNotify(`${$.name} - 京东账号${$.index} - ${$.nickName}`, `京东账号${$.index}[${$.nickName}]京喜工厂未选择商品\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 选择商品`)
                    if ($.isNode()) allMessage += `京东账号${$.index}[${$.nickName}]京喜工厂未选择商品\n请手动去京东APP->游戏与互动->查看更多->京喜工厂 选择商品${$.index !== cookiesArr.length ? '\n\n' : ''}`
                  }
                }
              }
            } else {
              console.log(`GetUserInfo异常：${JSON.stringify(data)}`)
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
//查询当前生产的商品名称
function GetCommodityDetails() {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/diminfo/GetCommodityDetails?zone=dream_factory&sceneval=2&g_login_type=1&commodityId=${$.commodityDimId}`;
    $.get(taskurl('diminfo/GetCommodityDetails', `commodityId=${$.commodityDimId}`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              $.productName = data['commodityList'][0].name;
            } else {
              console.log(`GetCommodityDetails异常：${JSON.stringify(data)}`)
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
// 查询已完成商品
function GetShelvesList(pageNo = 1) {
  return new Promise(async resolve => {
    $.get(taskurl('userinfo/GetShelvesList', `pageNo=${pageNo}&pageSize=12`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              const { shelvesList } = data;
              if (shelvesList) {
                $.shelvesList = [...$.shelvesList, ...shelvesList];
                pageNo ++
                GetShelvesList(pageNo);
              }
            } else {
              console.log(`GetShelvesList异常：${JSON.stringify(data)}`)
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
/*
//领取红包
function DrawProductionStagePrize() {
  return new Promise(async resolve => {
    // const url = `/dreamfactory/userinfo/DrawProductionStagePrize?zone=dream_factory&sceneval=2&g_login_type=1&productionId=${$.productionId}`;
    $.get(taskurl('userinfo/DrawProductionStagePrize', `productionId=${$.productionId}`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          console.log(`领取红包功能(测试中)：${data}`);
          // if (safeGet(data)) {
          //   data = JSON.parse(data);
          //   if (data['ret'] === 0) {
          //
          //   } else {
          //     console.log(`异常：${JSON.stringify(data)}`)
          //   }
          // }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
async function PickUp(encryptPin = $.encryptPin, help = false) {
  $.pickUpMyselfComponent = true;
  const GetUserComponentRes = await GetUserComponent(encryptPin, 500);
  if (GetUserComponentRes && GetUserComponentRes['ret'] === 0) {
    const { componentList } = GetUserComponentRes['data'];
    if (componentList && componentList.length <= 0) {
      if (help) {
        $.log(`好友【${encryptPin}】地下暂无零件可收`)
      } else {
        $.log(`自家地下暂无零件可收`)
      }
      $.pickUpMyselfComponent = false;
    }
    for (let item of componentList) {
      await $.wait(1000);
      const PickUpComponentRes = await PickUpComponent(item['placeId'], encryptPin);
      if (PickUpComponentRes) {
        if (PickUpComponentRes['ret'] === 0) {
          const data = PickUpComponentRes['data'];
          if (help) {
            console.log(`收取好友[${encryptPin}]零件成功:获得${data['increaseElectric']}电力\n`);
            $.pickFriendEle += data['increaseElectric'];
          } else {
            console.log(`收取自家零件成功:获得${data['increaseElectric']}电力\n`);
            $.pickEle += data['increaseElectric'];
          }
        } else {
          if (help) {
            console.log(`收好友[${encryptPin}]零件失败：${PickUpComponentRes.msg},直接跳出`)
          } else {
            console.log(`收自己地下零件失败：${PickUpComponentRes.msg},直接跳出`);
            $.pickUpMyselfComponent = false;
          }
          break
        }
      }
    }
  }
}
function GetUserComponent(pin = $.encryptPin, timeout = 0) {
  return new Promise(resolve => {
    setTimeout(() => {
      $.get(taskurl('usermaterial/GetUserComponent', `pin=${pin}`), (err, resp, data) => {
        try {
          if (err) {
            console.log(`${JSON.stringify(err)}`)
            console.log(`${$.name} API请求失败，请检查网路重试`)
          } else {
            if (safeGet(data)) {
              data = JSON.parse(data);
              if (data['ret'] === 0) {

              } else {
                console.log(`GetUserComponent失败：${JSON.stringify(data)}`)
              }
            }
          }
        } catch (e) {
          $.logErr(e, resp)
        } finally {
          resolve(data);
        }
      })
    }, timeout)
  })
}
//收取地下随机零件电力API

function PickUpComponent(index, encryptPin) {
  return new Promise(resolve => {
    $.get(taskurl('usermaterial/PickUpComponent', `placeId=${index}&pin=${encryptPin}&_stk=_time,pin,placeId,zone`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            // if (data['ret'] === 0) {
            //   data = data['data'];
            //   if (help) {
            //     console.log(`收取好友[${encryptPin}]零件成功:获得${data['increaseElectric']}电力\n`);
            //     $.pickFriendEle += data['increaseElectric'];
            //   } else {
            //     console.log(`收取自家零件成功:获得${data['increaseElectric']}电力\n`);
            //     $.pickEle += data['increaseElectric'];
            //   }
            // } else {
            //   if (help) {
            //     console.log(`收好友[${encryptPin}]零件失败：${JSON.stringify(data)}`)
            //   } else {
            //     console.log(`收零件失败：${JSON.stringify(data)}`)
            //   }
            // }
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
//偷好友的电力
async function stealFriend() {
  if (!$.pickUpMyselfComponent) {
    $.log(`今日收取零件已达上限，偷好友零件也达到上限，故跳出`)
    return
  }
  await getFriendList();
  $.friendList = [...new Set($.friendList)];
  for (let i = 0; i < $.friendList.length; i++) {
    let pin = $.friendList[i];//好友的encryptPin
    if (pin === 'V5LkjP4WRyjeCKR9VRwcRX0bBuTz7MEK0-E99EJ7u0k=' || pin === 'Bo-jnVs_m9uBvbRzraXcSA==') {
      continue
    }
    await PickUp(pin, true);
    // await getFactoryIdByPin(pin);//获取好友工厂ID
    // if ($.stealFactoryId) await collectElectricity($.stealFactoryId,true, pin);
  }
}
function getFriendList(sort = 0) {
  return new Promise(async resolve => {
    $.get(taskurl('friend/QueryFactoryManagerList', `sort=${sort}`), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              data = data['data'];
              if (data.list && data.list.length <= 0) {
                console.log(`查询好友列表完成，共${$.friendList.length}好友，下面开始拾取好友地下的零件\n`);
                return
              }
              let friendsEncryptPins = [];
              for (let item of data.list) {
                friendsEncryptPins.push(item.encryptPin);
              }
              $.friendList = [...$.friendList, ...friendsEncryptPins];
              if (!$.isNode()) return
              await getFriendList(data.sort);
            } else {
              console.log(`QueryFactoryManagerList异常：${JSON.stringify(data)}`)
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
function getFactoryIdByPin(pin) {
  return new Promise((resolve, reject) => {
    // const url = `/dreamfactory/userinfo/GetUserInfoByPin?zone=dream_factory&pin=${pin}&sceneval=2`;
    $.get(taskurl('userinfo/GetUserInfoByPin', `pin=${pin}`), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              if (data.data.factoryList) {
                //做此判断,有时候返回factoryList为null
                // resolve(data['data']['factoryList'][0]['factoryId'])
                $.stealFactoryId = data['data']['factoryList'][0]['factoryId'];
              }
            } else {
              console.log(`异常：${JSON.stringify(data)}`)
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
*/
async function tuanActivity() {
  const tuanConfig = await QueryActiveConfig();
  if (tuanConfig && tuanConfig.ret === 0) {
    const { activeId, surplusOpenTuanNum, tuanId } = tuanConfig['data']['userTuanInfo'];
    console.log(`今日剩余开团次数：${surplusOpenTuanNum}次`);
    $.surplusOpenTuanNum = surplusOpenTuanNum;
    if (!tuanId && surplusOpenTuanNum > 0) {
      //开团
      $.log(`准备开团`)
      await CreateTuan();
    } else if (tuanId) {
      //查询词团信息
      const QueryTuanRes = await QueryTuan(activeId, tuanId);
      if (QueryTuanRes && QueryTuanRes.ret === 0) {
        const { tuanInfo } = QueryTuanRes.data;
        if ((tuanInfo && tuanInfo[0]['endTime']) <= QueryTuanRes['nowTime'] && surplusOpenTuanNum > 0) {
          $.log(`之前的团已过期，准备重新开团\n`)
          await CreateTuan();
        }
        for (let item of tuanInfo) {
          const { realTuanNum, tuanNum, userInfo } = item;
          $.log(`\n开团情况:${realTuanNum}/${tuanNum}\n`);
          if (realTuanNum === tuanNum) {
            for (let user of userInfo) {
              if (user.encryptPin === $.encryptPin) {
                if (user.receiveElectric && user.receiveElectric > 0) {
                  console.log(`您在${new Date(user.joinTime * 1000).toLocaleString()}开团奖励已经领取成功\n`)
                  if ($.surplusOpenTuanNum > 0) await CreateTuan();
                } else {
                  $.log(`开始领取开团奖励`);
                  await tuanAward(item.tuanActiveId, item.tuanId);//isTuanLeader
                }
              }
            }
          } else {
            $.tuanIds.push(tuanId);
            $.log(`\n此团未达领取团奖励人数：${tuanNum}人\n`)
          }
        }
      }
    }
  }
}
//可获取开团后的团ID，如果团ID为空并且surplusOpenTuanNum>0，则可继续开团
//如果团ID不为空，则查询QueryTuan()
function QueryActiveConfig() {
  return new Promise((resolve) => {
    const options = {
      'url': `https://m.jingxi.com/dreamfactory/tuan/QueryActiveConfig?activeId=${escape(tuanActiveId)}&_time=${Date.now()}&_=${Date.now()}&sceneval=2&g_login_type=1&_ste=1&h5st=${decrypt(Date.now())}`,
      "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Host": "m.jingxi.com",
        "Referer": "https://st.jingxi.com/pingou/dream_factory/divide.html",
        "User-Agent": "jdpingou;iPhone;3.15.2;13.5.1;90bab9217f465a83a99c0b554a946b0b0d5c2f7a;network/wifi;model/iPhone12,1;appBuild/100365;ADID/696F8BD2-0820-405C-AFC0-3C6D028040E5;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/14;pap/JA2015_311210;brand/apple;supportJDSHWK/1;"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              const { userTuanInfo } = data['data'];
              console.log(`\n团活动ID  ${userTuanInfo.activeId}`);
              console.log(`团ID  ${userTuanInfo.tuanId}\n`);
            } else {
              console.log(`QueryActiveConfig异常：${JSON.stringify(data)}`);
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
function QueryTuan(activeId, tuanId) {
  return new Promise((resolve) => {
    const options = {
      'url': `https://m.jingxi.com/dreamfactory/tuan/QueryTuan?activeId=${escape(activeId)}&tuanId=${escape(tuanId)}&_time=${Date.now()}&_=${Date.now()}&sceneval=2&g_login_type=1&_ste=1&h5st=${decrypt(Date.now(), '_time,activeId,tuanId')}&_stk=_time,activeId,tuanId`,
      "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Host": "m.jingxi.com",
        "Referer": "https://st.jingxi.com/pingou/dream_factory/divide.html",
        "User-Agent": "jdpingou;iPhone;3.15.2;13.5.1;90bab9217f465a83a99c0b554a946b0b0d5c2f7a;network/wifi;model/iPhone12,1;appBuild/100365;ADID/696F8BD2-0820-405C-AFC0-3C6D028040E5;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/14;pap/JA2015_311210;brand/apple;supportJDSHWK/1;"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              // $.log(`\n开团情况:${data.data.tuanInfo.realTuanNum}/${data.data.tuanInfo.tuanNum}\n`)
            } else {
              console.log(`异常：${JSON.stringify(data)}`);
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
//开团API
function CreateTuan() {
  return new Promise((resolve) => {
    const options = {
      'url': `https://m.jingxi.com/dreamfactory/tuan/CreateTuan?activeId=${escape(tuanActiveId)}&isOpenApp=1&_time=${Date.now()}&_=${Date.now()}&sceneval=2&g_login_type=1&_stk=_time,activeId,isOpenApp&_ste=1&h5st=${decrypt(Date.now(), '_time,activeId,isOpenApp')}`,
      "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Host": "m.jingxi.com",
        "Referer": "https://st.jingxi.com/pingou/dream_factory/divide.html",
        "User-Agent": "jdpingou;iPhone;3.15.2;13.5.1;90bab9217f465a83a99c0b554a946b0b0d5c2f7a;network/wifi;model/iPhone12,1;appBuild/100365;ADID/696F8BD2-0820-405C-AFC0-3C6D028040E5;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/14;pap/JA2015_311210;brand/apple;supportJDSHWK/1;"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              console.log(`开团成功tuanId为\n${data.data['tuanId']}`);
              $.tuanIds.push(data.data['tuanId']);
            } else {
              console.log(`异常：${JSON.stringify(data)}`);
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
async function joinLeaderTuan() {
  $.tuanIdS = null;
  if (!$.tuanIdS) await updateTuanIdsCDN('https://ghproxy.com/https://raw.githubusercontent.com/zero205/updateTeam/master/shareCodes/jd_updateFactoryTuanId.json');
  if ($.tuanIdS && $.tuanIdS.tuanIds) {
    for (let tuanId of $.tuanIdS.tuanIds) {
      if (!tuanId) continue
      await JoinTuan(tuanId);
    }
  }
  $.tuanIdS = null;
  if (!$.tuanIdS) await updateTuanIdsCDN('https://ghproxy.com/https://raw.githubusercontent.com/zero205/updateTeam/master/shareCodes/jd_updateFactoryTuanId.json');
  if ($.tuanIdS && $.tuanIdS.tuanIds) {
    for (let tuanId of $.tuanIdS.tuanIds) {
      if (!tuanId) continue
      await JoinTuan(tuanId);
    }
  }
}
function JoinTuan(tuanId) {
  return new Promise((resolve) => {
    const options = {
      'url': `https://m.jingxi.com/dreamfactory/tuan/JoinTuan?activeId=${escape(tuanActiveId)}&tuanId=${escape(tuanId)}&_time=${Date.now()}&_stk=_time,activeId,tuanId&h5st=20210303071536851;0386098809875160;10001;tk01w64d91a47a8na1RialFZV1MxNgHFXD25O99/df6c113+v+vdL7mhZgJvA5EVGKI5pNOFsJxjz1F3E23ZgM/3q0kx;686703a0bcc9d7cb0a1f68c6c83c994e4ae6ac545052ddcfbdf8e074d6408122&_=${Date.now()}&sceneval=2&g_login_type=1`,
      "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Host": "m.jingxi.com",
        "Referer": "https://st.jingxi.com/pingou/dream_factory/divide.html",
        "User-Agent": "jdpingou"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              console.log(`参团成功\n${JSON.stringify(data)}\n`);
            } else {
              console.log(`参团失败：${JSON.stringify(data)}`);
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
//查询所有的团情况(自己开团以及参加别人的团)
function QueryAllTuan() {
  return new Promise((resolve) => {
    const options = {
      'url': `https://m.jingxi.com/dreamfactory/tuan/QueryAllTuan?activeId=${escape(tuanActiveId)}&pageNo=1&pageSize=10&_time=${Date.now()}&_=${Date.now()}&sceneval=2&g_login_type=1&_ste=1&h5st=${decrypt(Date.now())}`,
      "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Host": "m.jingxi.com",
        "Referer": "https://st.jingxi.com/pingou/dream_factory/divide.html",
        "User-Agent": "jdpingou;iPhone;3.15.2;13.5.1;90bab9217f465a83a99c0b554a946b0b0d5c2f7a;network/wifi;model/iPhone12,1;appBuild/100365;ADID/696F8BD2-0820-405C-AFC0-3C6D028040E5;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/14;pap/JA2015_311210;brand/apple;supportJDSHWK/1;"
      }
    }
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              const { tuanInfo } = data;
              for (let item of tuanInfo) {
                if (item.tuanNum === item.realTuanNum) {
                  // console.log(`参加团主【${item.tuanLeader}】已成功`)
                  const { userInfo } = item;
                  for (let item2 of userInfo) {
                    if (item2.encryptPin === $.encryptPin) {
                      if (item2.receiveElectric && item2.receiveElectric > 0) {
                        console.log(`${new Date(item2.joinTime * 1000).toLocaleString()}参加团主【${item2.nickName}】的奖励已经领取成功`)
                      } else {
                        console.log(`开始领取${new Date(item2.joinTime * 1000).toLocaleString()}参加团主【${item2.nickName}】的奖励`)
                        await tuanAward(item.tuanActiveId, item.tuanId, item.tuanLeader === $.encryptPin);//isTuanLeader
                      }
                    }
                  }
                } else {
                  console.log(`${new Date(item.beginTime * 1000).toLocaleString()}参加团主【${item.tuanLeader}】失败`)
                }
              }
            } else {
              console.log(`QueryAllTuan异常：${JSON.stringify(data)}`);
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
//开团人的领取奖励API
function tuanAward(activeId, tuanId, isTuanLeader = true) {
  return new Promise((resolve) => {
    const options = {
      'url': `https://m.jingxi.com/dreamfactory/tuan/Award?activeId=${escape(activeId)}&tuanId=${escape(tuanId)}&_time=${Date.now()}&_=${Date.now()}&sceneval=2&g_login_type=1&_ste=1&h5st=${decrypt(Date.now())}`,
      "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Cookie": cookie,
        "Host": "m.jingxi.com",
        "Referer": "https://st.jingxi.com/pingou/dream_factory/divide.html",
        "User-Agent": "jdpingou;iPhone;3.15.2;13.5.1;90bab9217f465a83a99c0b554a946b0b0d5c2f7a;network/wifi;model/iPhone12,1;appBuild/100365;ADID/696F8BD2-0820-405C-AFC0-3C6D028040E5;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/14;pap/JA2015_311210;brand/apple;supportJDSHWK/1;"
      }
    }
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            if (data['ret'] === 0) {
              if (isTuanLeader) {
                console.log(`开团奖励(团长)${data.data['electric']}领取成功`);
                message += `【开团(团长)奖励】${data.data['electric']}领取成功\n`;
                if ($.surplusOpenTuanNum > 0) {
                  $.log(`开团奖励(团长)已领取，准备开团`);
                  await CreateTuan();
                }
              } else {
                console.log(`参团奖励${data.data['electric']}领取成功`);
                message += `【参团奖励】${data.data['electric']}领取成功\n`;
              }
            } else if (data['ret'] === 10212) {
              console.log(`${JSON.stringify(data)}`);

              if (isTuanLeader && $.surplusOpenTuanNum > 0) {
                $.log(`团奖励已领取，准备开团`);
                await CreateTuan();
              }
            } else {
              console.log(`异常：${JSON.stringify(data)}`);
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
function updateTuanIds(url = '') {
  return new Promise(resolve => {
    $.get({url}, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        } else {
          $.tuanIdS = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}
function updateTuanIdsCDN(url) {
  return new Promise(async resolve => {
    $.get({url,
      headers:{
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }}, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
        } else {
          if (safeGet(data)) {
            $.tuanIdS = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
    await $.wait(3000)
    resolve();
  })
}
function checkExchange() {

}
//商品可兑换时的通知
async function exchangeProNotify() {
  await GetShelvesList();
  let exchangeEndTime, exchangeEndHours, nowHours;
  //脚本运行的UTC+8时区的时间戳
  let nowTimes = new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000);
  if ($.shelvesList && $.shelvesList.length > 0) console.log(`\n  商品名     兑换状态`)
  for (let shel of $.shelvesList) {
    console.log(`${shel['name']}    ${shel['exchangeStatus'] === 1 ? '未兑换' : shel['exchangeStatus'] === 2 ? '已兑换' : '兑换超时'}`)
    if (shel['exchangeStatus'] === 1) {
      exchangeEndTime = shel['exchangeEndTime'] * 1000;
      $.picture = shel['picture'];
      // 兑换截止时间点
      exchangeEndHours = new Date(exchangeEndTime + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).getHours();
      //兑换截止时间(年月日 时分秒)
      $.exchangeEndTime = new Date(exchangeEndTime + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString('zh', {hour12: false});
      //脚本运行此时的时间点
      nowHours = nowTimes.getHours();
    }
  }
  if (exchangeEndTime) {
    //比如兑换(超时)截止时间是2020/12/8 09:20:04,现在时间是2020/12/6
    if (nowTimes < exchangeEndTime) {
      //还可以兑换
      // 一:在兑换超时这一天(2020/12/8 09:20:04)的前2小时内通知
      if ((exchangeEndTime - nowTimes) <= 3600000 * 2) {
        $.msg($.name, ``, `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}${(exchangeEndTime - nowTimes) / 60*60*1000}分钟后兑换超时\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换`, {'open-url': jxOpenUrl, 'media-url': $.picture})
        // if ($.isNode()) await notify.sendNotify(`${$.name} - 京东账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}${(exchangeEndTime - nowTimes) / 60*60*1000}分钟后兑换超时\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换`, { url: jxOpenUrl })
        if ($.isNode()) allMessage += `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}${(exchangeEndTime - nowTimes) / 60*60*1000}分钟后兑换超时\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换${$.index !== cookiesArr.length ? '\n\n' : ''}`
      }
      //二:在兑换超时日期前的时间一天通知三次(2020/12/6 9,10,11点,以及在2020/12/7 9,10,11点各通知一次)
      if (nowHours === exchangeEndHours || nowHours === (exchangeEndHours + 1) || nowHours === (exchangeEndHours + 2)) {
        $.msg($.name, ``, `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}已可兑换\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换`, {'open-url': jxOpenUrl, 'media-url': $.picture})
        // if ($.isNode()) await notify.sendNotify(`${$.name} - 京东账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}已可兑换\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换`, { url: jxOpenUrl })
        if ($.isNode()) allMessage += `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}已可兑换\n【兑换截止时间】${$.exchangeEndTime}\n请速去京喜APP->首页->好物0元造进行兑换${$.index !== cookiesArr.length ? '\n\n' : ''}`
      }
    } else {
      //兑换已超时
      $.msg($.name, ``, `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}兑换已超时，请重新选择商品生产\n【兑换截止时间】${$.exchangeEndTime}`, {'open-url': jxOpenUrl})
      // if ($.isNode()) await notify.sendNotify(`${$.name} - 京东账号${$.index} - ${$.nickName}`, `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}兑换已超时，请重新选择商品生产\n【兑换截止时间】${$.exchangeEndTime}`, { url: jxOpenUrl })
      if ($.isNode()) allMessage += `【京东账号${$.index}】${$.nickName}\n【生产商品】${$.productName}兑换已超时，请重新选择商品生产\n【兑换截止时间】${$.exchangeEndTime}${$.index !== cookiesArr.length ? '\n\n' : ''}`
    }
  }
}
async function showMsg() {
  return new Promise(async resolve => {
    message += `【收取自己零件】${$.pickUpMyselfComponent ? `获得${$.pickEle}电力` : `今日已达上限`}\n`;
    message += `【收取好友零件】${$.pickUpMyselfComponent ? `获得${$.pickFriendEle}电力` : `今日已达上限`}\n`;
    if ($.isNode() && process.env.DREAMFACTORY_NOTIFY_CONTROL) {
      $.ctrTemp = `${process.env.DREAMFACTORY_NOTIFY_CONTROL}` === 'false';
    } else if ($.getdata('jdDreamFactory')) {
      $.ctrTemp = $.getdata('jdDreamFactory') === 'false';
    } else {
      $.ctrTemp = `${jdNotify}` === 'false';
    }
    if (new Date().getHours() === 22) {
      $.msg($.name, '', `${message}`)
      $.log(`\n${message}`);
    } else {
      $.log(`\n${message}`);
    }
    resolve()
  })
}
function readShareCode() {
  console.log(`开始`)
  return new Promise(async resolve => {
    $.get({url: "https://raw.githubusercontent.com/hajiuhajiu/jdsign1112/master/backUp/total/jxfactory.json",headers:{
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }}, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log(`随机取助力码放到您固定的互助码后面(不影响已有固定互助)`)
            data = JSON.parse(data);
          }
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve(data);
      }
    })
    await $.wait(10000);
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
  return new Promise(async resolve => {
    await updateTuanIdsCDN('https://ghproxy.com/https://raw.githubusercontent.com/zero205/updateTeam/master/shareCodes/jd_updateFactoryTuanId.json');
    if ($.tuanIdS && $.tuanIdS.tuanActiveId) {
      tuanActiveId = $.tuanIdS.tuanActiveId;
    }
    console.log(`开始获取${$.name}配置文件\n`);
    console.log(`tuanActiveId: ${tuanActiveId}`)
    //Node.js用户请在jdCookie.js处填写京东ck;
    const shareCodes = $.isNode() ? require('./jdDreamFactoryShareCodes.js') : '';
    console.log(`共${cookiesArr.length}个京东账号\n`);
    $.shareCodesArr = [];
    if ($.isNode()) {
      Object.keys(shareCodes).forEach((item) => {
        if (shareCodes[item]) {
          $.shareCodesArr.push(shareCodes[item])
        }
      })
    } else {
      if ($.getdata('jd_jxFactory')) $.shareCodesArr = $.getdata('jd_jxFactory').split('\n').filter(item => item !== "" && item !== null && item !== undefined);
      console.log(`\nBoxJs设置的京喜工厂邀请码:${$.getdata('jd_jxFactory')}\n`);
    }
    // console.log(`\n种豆得豆助力码::${JSON.stringify($.shareCodesArr)}`);
    console.log(`您提供了${$.shareCodesArr.length}个账号的${$.name}助力码\n`);
    resolve()
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
            if (data['retcode'] === 0) {
              $.nickName = data['base'].nickname;
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

function taskurl(functionId, body = '', stk) {
  let url = `${JD_API_HOST}/dreamfactory/${functionId}?zone=dream_factory&${body}&sceneval=2&g_login_type=1&_time=${Date.now()}&_=${Date.now()}&_ste=1&h5st=${decrypt(Date.now(), stk)}`
  if (stk) {
    url += `&_stk=${stk}`;
  }
  return {
    url,
    headers: {
      'Cookie': cookie,
      'Host': 'm.jingxi.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': 'jdpingou;iPhone;3.14.4;14.0;ae75259f6ca8378672006fc41079cd8c90c53be8;network/wifi;model/iPhone10,2;appBuild/100351;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/62;pap/JA2015_311210;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
      'Accept-Language': 'zh-cn',
      'Referer': 'https://wqsd.jd.com/pingou/dream_factory/index.html',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}
function newtasksysUrl(functionId, taskId, stk) {
  let url = `${JD_API_HOST}/newtasksys/newtasksys_front/${functionId}?source=dreamfactory&bizCode=dream_factory&sceneval=2&g_login_type=1&_time=${Date.now()}&_=${Date.now()}&_ste=1&h5st=${decrypt(Date.now(), stk)}`;
  if (taskId) {
    url += `&taskId=${taskId}`;
  }
  if (stk) {
    url += `&_stk=${stk}`;
  }
  return {
    url,
    "headers": {
      'Cookie': cookie,
      'Host': 'm.jingxi.com',
      'Accept': '*/*',
      'Connection': 'keep-alive',
      'User-Agent': "jdpingou;iPhone;3.15.2;13.5.1;90bab9217f465a83a99c0b554a946b0b0d5c2f7a;network/wifi;model/iPhone12,1;appBuild/100365;ADID/696F8BD2-0820-405C-AFC0-3C6D028040E5;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/14;pap/JA2015_311210;brand/apple;supportJDSHWK/1;",
      'Accept-Language': 'zh-cn',
      'Referer': 'https://wqsd.jd.com/pingou/dream_factory/index.html',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
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
function decrypt(time, stk, type) {
  if (stk) {
    const random = 'pmUmA8IyRcDp';
    const token = ``;
    const fingerprint = 8410347712257161;
    const timestamp = new Date(time).Format("yyyyMMddhhmmssS");
    const appId = 10001;
    const str = `${token}${fingerprint}${timestamp}${appId}${random}`;
    const hash1 = $.CryptoJS.HmacSHA512(str, token).toString($.CryptoJS.enc.Hex);
    let st = '';
    stk.split(',').map((item, index) => {
      st += `${item}:${item === '_time' ? time : item === 'zone' ? 'dream_factory' : item === 'type' ? type || '1' : ''}${index === stk.split(',').length -1 ? '' : '&'}`;
    })
    const hash2 = $.CryptoJS.HmacSHA256(st, hash1).toString($.CryptoJS.enc.Hex);
    console.log(`st:${st}\n`)
    // console.log(`hash2:${hash2}\n`)
    // console.log(`h5st:${h5st}\n`)
    return ["".concat(timestamp.toString()), "".concat(fingerprint.toString()), "".concat(appId.toString()), "".concat(token), "".concat(hash2)].join(";")
  } else {
    return '20210121201915905;8410347712257161;10001;tk01wa5bd1b5fa8nK2drQ3o3azhyhItRUb1DBNK57SQnGlXj9kmaV/iQlhKdXuz1RME5H/+NboJj8FAS9N+FcoAbf6cB;3c567a551a8e1c905a8d676d69e873c0bc7adbd8277957f90e95ab231e1800f2'
  }
}
var _0xodu='jsjiami.com.v6',_0x3a12=[_0xodu,'PsKIY8K1','wq/Dv8Oowpfor5zmsqHlpa/otIrvvobora/moJDmn4znv4notKDphpror6M=','RSQMDE4=','w5vDlX9iw5Y+','PsKmTTt7','GhVWbmE=','WxUYPMK7','HsOgO8KrJMOB','wp3DhsOGwoDCkw==','KsKjTMKbw4c=','w4BTw4bDo8KR','bQEvFMKY','RRvDm8K/ZQ==','YA4pOWA=','wr/DiBXCucKh','eMOWwqnDhCA=','wp/DvcO4wovCgQ==','w6TCr8Kuw4gGecKEWFk/KBjCqsKxwo1Rw487BcKCwpFXwrjCrTDDtcO8w5w3fCbCt8Kjw5kxC8KDw5QMwq7Ds1/DtsKTLcOnwqvCisKFwqjDi8KMK8OOVMONwpzDlsOtwrbCq1QpQ8Okw73CmsOBK13DjMKVw7pLw6LDl8ORw4k=','woXCiMKrwofCiVJAwo1IwoMsw5LCsAJww67Cn8Ovw64pwrXCucK7OUpsw7ZEw5HDqyPDtQ/Ds8O1w50Hw6dmGgF4w6YNw4LDrMKgLlA+wo3DkC8ow73CvWQjKsOWwpXChWtCw78uTsKxfMKzJsKJBHPDmcOGw6/DjMOdwr7CmR9AwrUaw5fCmsOlw6DDr13Dsz0Rw5HCqXRhDDLDjm/CtFvDrcK8w7gtwrEhGHwuVsK+w4lcw7wXwogsM8O+wojDu8O/PT4eN0M2B8OQJCwJeMOzMsKaaVkYJcKtY8KvdloKw67CgWPCs8Oo','w6jDm8OM','wr3CqGTCvx4=','dQfCulzCnw==','ecOmYcKHwog=','wqjCvXHCisOt','RCc9FsK4','EMO/Qw==','PsK6w7Y2','wqxhwqbCieitv+axs+Wlr+i0q+++s+itjeahseafkue8i+i1qOmEouiukQ==','w4hHGMOjCw==','w6LDvMORwq5l','EcOSTcOwwo8=','w6dLw6Q=','w41GRU4=','woEIUWXorLjmsoHlpoDotI/vvYHorpHmoo3mn7Dnv6jotJ/phY3orY0=','OcODY8O9wrNz','IcKIesKaVg==','w5rDtsKPw4NE','w4hUw6XDkcKb','XyzDng==','d8K+w7YH','w6jCpsKBwqforJLmsbzlpJDotofvvbHorZrmo5zmnJfnv4notoTph63orZM=','w6nDp8Kbw4lD','w5PDm2xGw6Mpwo8=','KRV1XHc=','wrZjHMOALw==','Kjs/WBc3wp4=','HcKVYRh+FQ==','UsKEMgrCrA==','w4Vww6vCq8O3','w5h2wq7DlMK0','Cg11WsO9','HMKld8Kgw5XDhMKe','OAlQMiNpfsKBKMKWw4sj','AsKhw6vCrMKsw7I=','wpfCv3HCkTEVRw==','UAQjZ8KpTMOrwodYMwsa','w45Owr4U','XQgNJ1o=','BQzDgQ==','K2jDmno=','bhsbcOiup+awkOWnm+i3hu++meisn+agkeacp+e8r+i2k+mGnuiupA==','wqvDojbCpcKaag==','RxYMFcK+','w43Dv2BSw5U=','UMK3w7Q7wqA=','Mj9Fekc=','UiUnLcK4','Xws1F30=','woYTDHZm','PH9een0=','w4pEFsOuHw==','w4csfXvCisKFKTLDoMKEw7Vu','fzfDlcOueyLDqQ7DscKKM8KFw5rDsSIyCgrDsn3DiELDqsKNbl/CtsOzwr/Du8KIC2A=','wpYNwrPDhcK2wpo4K0BLw5l6wqHCm8Kiw7/CrGtN','fsKlw7ISw4lQwq3DiUIuw6g8w5TDtMKcY1o=','wrBJI8ORakYLwpMDfA==','FEhhbG7DjcOXwpHCvMODC8Oqwoo1PVAidcOQPMKzN8K1w6fCshrDuWdIw7zClg3Dgw==','f0hYAA5bTMKtFMKgw6QDFsKrYU8=','w6saVG0=','IQDCrlbConjDvTJCZMOswrAJRsOTR8KMPmPDgSzCkz/DhhHDmQlZw6pTQcOsHBo6VsOBw4QCfsKaw7kfGXHCn8KrdAPDlMOtw4TCkRHDrcKzw4UdNMKle0rDn8K2wrdBwqvCq8OQWhJaGMKuw6YowoFmE08qw6zCvXDDrMOsP1V3L0DDr3TCtUFCR8KFwpDClDl/SERBEMOWXTpiAMOlGgpfw5BSw4pSw6lJw5YyWnI4ehTCumo2FVHCk2/DhUnCqlYhF8KTHcOrJ2/DsHJ7HUojLMOU','D1A8Y2k=','C8K8YMKCw6M=','w5hMwqMJP3XDkcKgw7lJ','EgNdcsOZWw==','HUxlcHTClMKZw4rCtMOcDMOrwo1oOFogNsOLNMOkIMO2w77CuxXDpCcFwr/DiEvChko=','IzBIBik=','w7RDwpzCosOa','NF7DsFbCnA==','w4IMc27Cuw==','w7xQwqjDhsKP','eAYWK1E=','ABDDqBtTOw==','w7zDqMKf','wqQuPG53TyJHSwRSPsOx','wpF/GcO0FGI1wqU0XsKhw7zCpg==','woJZIcOEEQ==','CMKTXMK5Vg==','w5lzwrPCksOXcBlLw7HDrg==','UiAKG0rDkMKs','OwJrZ8Of','N8KMesK0bR/CoA==','w5ZJwq/CpcOH','w7RTw7fCjMO6','DgFbwoTCjcOzwr8rwqoowrDCiALDo8OOYMOJwqtbSys3E1XDiMOyXsOtOjLCiB7Dl2Jtw6LCrTbDscOIRFPDpsOXcR7Cjn3CrcOKQMKMennCsgBJOWYAw59tw5TCgXLCoHbCqsKOY8KxOk/Cq0YnAcKpwp9sRCRAHMKjTsOhPMOeEktBwqbDksKPwpZGLEXDn8KAEsKaVcO4wqtE','w5HDuMOpwrbDpsOdNcOUw7lGw6I4w44gASfCmMOKwpLCinVrw5vDpjVkEMK5KEs=','wrbDq8KOPXs=','HsKxbcKiw6bDiMKFO8KGw5UMw5XDl1V8woBKw7LDmcKTwp8bw6MlwpNpwqdqaksYM8Kdf8KxwpfCvD/DuRHClMOAYMONdFo=','WsOoIcK0w6HDhMKYG8Kuw5xUwpTCmAMOw54Bw7fDk8K9woohw6cTwokgwrUnNAMJasOMdsK9wpPCnC3Csl8=','wrXCpMKcw4lDeMOqfiTDkX7DgcKfw4rCjMOcwq1Na8KLw7HDrsKBwqZAY3nDtk/Ck2QNwqVcw7XCg8OFWQ5yw4nDgcKRwotV','ZsOcWcKi','esOZRMKUwoc=','w5XDiMK+w5dN','LTMEaBE=','fcKmBBnCuQ==','woISBA==','rjqsjiamKni.BcAofUnhmF.pUCv6=='];(function(_0x28f62d,_0x52a41b,_0x443254){var _0x387c91=function(_0x594926,_0x3b0a77,_0x2fac40,_0x307150,_0x221833){_0x3b0a77=_0x3b0a77>>0x8,_0x221833='po';var _0xec546c='shift',_0x57bfd2='push';if(_0x3b0a77<_0x594926){while(--_0x594926){_0x307150=_0x28f62d[_0xec546c]();if(_0x3b0a77===_0x594926){_0x3b0a77=_0x307150;_0x2fac40=_0x28f62d[_0x221833+'p']();}else if(_0x3b0a77&&_0x2fac40['replace'](/[rqKnBAfUnhFpUC=]/g,'')===_0x3b0a77){_0x28f62d[_0x57bfd2](_0x307150);}}_0x28f62d[_0x57bfd2](_0x28f62d[_0xec546c]());}return 0x779a9;};var _0x45ab96=function(){var _0x28059c={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x137910,_0x4bced6,_0x51f436,_0x3cd475){_0x3cd475=_0x3cd475||{};var _0x278d10=_0x4bced6+'='+_0x51f436;var _0xa3de30=0x0;for(var _0xa3de30=0x0,_0x3eff06=_0x137910['length'];_0xa3de30<_0x3eff06;_0xa3de30++){var _0xd5d37a=_0x137910[_0xa3de30];_0x278d10+=';\x20'+_0xd5d37a;var _0x27707b=_0x137910[_0xd5d37a];_0x137910['push'](_0x27707b);_0x3eff06=_0x137910['length'];if(_0x27707b!==!![]){_0x278d10+='='+_0x27707b;}}_0x3cd475['cookie']=_0x278d10;},'removeCookie':function(){return'dev';},'getCookie':function(_0x51450f,_0x569232){_0x51450f=_0x51450f||function(_0x3d8c9b){return _0x3d8c9b;};var _0x1acf5c=_0x51450f(new RegExp('(?:^|;\x20)'+_0x569232['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x270d7b=typeof _0xodu=='undefined'?'undefined':_0xodu,_0x2f49a7=_0x270d7b['split'](''),_0x474c39=_0x2f49a7['length'],_0x553a83=_0x474c39-0xe,_0x7611d9;while(_0x7611d9=_0x2f49a7['pop']()){_0x474c39&&(_0x553a83+=_0x7611d9['charCodeAt']());}var _0x3bc97c=function(_0x44ce08,_0x1fc405,_0x250cd6){_0x44ce08(++_0x1fc405,_0x250cd6);};_0x553a83^-_0x474c39===-0x524&&(_0x7611d9=_0x553a83)&&_0x3bc97c(_0x387c91,_0x52a41b,_0x443254);return _0x7611d9>>0x2===0x14b&&_0x1acf5c?decodeURIComponent(_0x1acf5c[0x1]):undefined;}};var _0x5e1ae6=function(){var _0x591f20=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x591f20['test'](_0x28059c['removeCookie']['toString']());};_0x28059c['updateCookie']=_0x5e1ae6;var _0x19efff='';var _0x2d28c2=_0x28059c['updateCookie']();if(!_0x2d28c2){_0x28059c['setCookie'](['*'],'counter',0x1);}else if(_0x2d28c2){_0x19efff=_0x28059c['getCookie'](null,'counter');}else{_0x28059c['removeCookie']();}};_0x45ab96();}(_0x3a12,0xb6,0xb600));var _0x2fff=function(_0x4e9292,_0x1cc6b4){_0x4e9292=~~'0x'['concat'](_0x4e9292);var _0x315c6d=_0x3a12[_0x4e9292];if(_0x2fff['LFZXhL']===undefined){(function(){var _0x17501d=function(){var _0x570563;try{_0x570563=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x439f11){_0x570563=window;}return _0x570563;};var _0x4d348f=_0x17501d();var _0x4a05c1='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x4d348f['atob']||(_0x4d348f['atob']=function(_0x3e3953){var _0x5b5c3a=String(_0x3e3953)['replace'](/=+$/,'');for(var _0x1ca9c5=0x0,_0x52cbc4,_0x283acd,_0x3f84e2=0x0,_0x20980a='';_0x283acd=_0x5b5c3a['charAt'](_0x3f84e2++);~_0x283acd&&(_0x52cbc4=_0x1ca9c5%0x4?_0x52cbc4*0x40+_0x283acd:_0x283acd,_0x1ca9c5++%0x4)?_0x20980a+=String['fromCharCode'](0xff&_0x52cbc4>>(-0x2*_0x1ca9c5&0x6)):0x0){_0x283acd=_0x4a05c1['indexOf'](_0x283acd);}return _0x20980a;});}());var _0x2a983a=function(_0x3eae57,_0x1cc6b4){var _0x3024f3=[],_0x4e286e=0x0,_0x3d162d,_0x5d86a7='',_0x3e6c8d='';_0x3eae57=atob(_0x3eae57);for(var _0x443b4f=0x0,_0xae9fc2=_0x3eae57['length'];_0x443b4f<_0xae9fc2;_0x443b4f++){_0x3e6c8d+='%'+('00'+_0x3eae57['charCodeAt'](_0x443b4f)['toString'](0x10))['slice'](-0x2);}_0x3eae57=decodeURIComponent(_0x3e6c8d);for(var _0x5b9261=0x0;_0x5b9261<0x100;_0x5b9261++){_0x3024f3[_0x5b9261]=_0x5b9261;}for(_0x5b9261=0x0;_0x5b9261<0x100;_0x5b9261++){_0x4e286e=(_0x4e286e+_0x3024f3[_0x5b9261]+_0x1cc6b4['charCodeAt'](_0x5b9261%_0x1cc6b4['length']))%0x100;_0x3d162d=_0x3024f3[_0x5b9261];_0x3024f3[_0x5b9261]=_0x3024f3[_0x4e286e];_0x3024f3[_0x4e286e]=_0x3d162d;}_0x5b9261=0x0;_0x4e286e=0x0;for(var _0xa0da4f=0x0;_0xa0da4f<_0x3eae57['length'];_0xa0da4f++){_0x5b9261=(_0x5b9261+0x1)%0x100;_0x4e286e=(_0x4e286e+_0x3024f3[_0x5b9261])%0x100;_0x3d162d=_0x3024f3[_0x5b9261];_0x3024f3[_0x5b9261]=_0x3024f3[_0x4e286e];_0x3024f3[_0x4e286e]=_0x3d162d;_0x5d86a7+=String['fromCharCode'](_0x3eae57['charCodeAt'](_0xa0da4f)^_0x3024f3[(_0x3024f3[_0x5b9261]+_0x3024f3[_0x4e286e])%0x100]);}return _0x5d86a7;};_0x2fff['aNXAYY']=_0x2a983a;_0x2fff['bXQyxc']={};_0x2fff['LFZXhL']=!![];}var _0xed2b97=_0x2fff['bXQyxc'][_0x4e9292];if(_0xed2b97===undefined){if(_0x2fff['Dmkimk']===undefined){var _0x445b63=function(_0x5e07d5){this['KnvnNc']=_0x5e07d5;this['izkUXj']=[0x1,0x0,0x0];this['bchpIR']=function(){return'newState';};this['pJfPux']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['zRDSDz']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x445b63['prototype']['kVIzPh']=function(){var _0x3003c5=new RegExp(this['pJfPux']+this['zRDSDz']);var _0x3c9cb8=_0x3003c5['test'](this['bchpIR']['toString']())?--this['izkUXj'][0x1]:--this['izkUXj'][0x0];return this['Leobkg'](_0x3c9cb8);};_0x445b63['prototype']['Leobkg']=function(_0x1cd8fd){if(!Boolean(~_0x1cd8fd)){return _0x1cd8fd;}return this['DofUqk'](this['KnvnNc']);};_0x445b63['prototype']['DofUqk']=function(_0x4583b2){for(var _0x38bc1d=0x0,_0x2a6eb1=this['izkUXj']['length'];_0x38bc1d<_0x2a6eb1;_0x38bc1d++){this['izkUXj']['push'](Math['round'](Math['random']()));_0x2a6eb1=this['izkUXj']['length'];}return _0x4583b2(this['izkUXj'][0x0]);};new _0x445b63(_0x2fff)['kVIzPh']();_0x2fff['Dmkimk']=!![];}_0x315c6d=_0x2fff['aNXAYY'](_0x315c6d,_0x1cc6b4);_0x2fff['bXQyxc'][_0x4e9292]=_0x315c6d;}else{_0x315c6d=_0xed2b97;}return _0x315c6d;};var _0x33715f=function(){var _0x469450=!![];return function(_0x4ddbe8,_0x4c5a16){var _0x21eea3=_0x469450?function(){if(_0x4c5a16){var _0x267be8=_0x4c5a16['apply'](_0x4ddbe8,arguments);_0x4c5a16=null;return _0x267be8;}}:function(){};_0x469450=![];return _0x21eea3;};}();var _0x7484cc=_0x33715f(this,function(){var _0x247289=function(){return'\x64\x65\x76';},_0x5107be=function(){return'\x77\x69\x6e\x64\x6f\x77';};var _0x6592fb=function(){var _0x461671=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x461671['\x74\x65\x73\x74'](_0x247289['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x399b9a=function(){var _0x1c3e2f=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0x1c3e2f['\x74\x65\x73\x74'](_0x5107be['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x1ba85c=function(_0x46c968){var _0x18a227=~-0x1>>0x1+0xff%0x0;if(_0x46c968['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0x18a227)){_0xb1e223(_0x46c968);}};var _0xb1e223=function(_0x2615cd){var _0x4c9278=~-0x4>>0x1+0xff%0x0;if(_0x2615cd['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0x4c9278){_0x1ba85c(_0x2615cd);}};if(!_0x6592fb()){if(!_0x399b9a()){_0x1ba85c('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0x1ba85c('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0x1ba85c('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0x7484cc();function wuzhi01(_0x559b3e){var _0x59ddb6={'ljnBe':function(_0x5c1a60,_0x116b8b){return _0x5c1a60===_0x116b8b;},'LNWmk':_0x2fff('0','6xIz'),'ciOQA':_0x2fff('1','az%1'),'OVBDq':function(_0x894f5e,_0x5917e2){return _0x894f5e===_0x5917e2;},'CaQAs':_0x2fff('2','*7^u'),'yQMbf':_0x2fff('3','O635'),'jINOH':function(_0x1fb8c3){return _0x1fb8c3();},'sxcCq':function(_0x408d91){return _0x408d91();},'rWZUx':_0x2fff('4','M!EL'),'xcjbR':_0x2fff('5','16uR'),'qWGIU':_0x2fff('6','@IC7'),'cErBt':_0x2fff('7','3Mwv'),'qBHXA':_0x2fff('8','V3jQ'),'MChTz':_0x2fff('9','*7^u'),'YugeV':function(_0x20afe1,_0xa32f43){return _0x20afe1(_0xa32f43);},'XzRiZ':_0x2fff('a','s%]a'),'ZiYeO':_0x2fff('b','i0j$'),'zeEII':_0x2fff('c','H9qC'),'tXYmB':_0x2fff('d','*7^u')};return new Promise(_0x3677d4=>{var _0x2b3e86={'JpoXv':function(_0x48a521){return _0x59ddb6[_0x2fff('e','lz$H')](_0x48a521);}};let _0x2d0d9b=_0x559b3e[_0x2fff('f','JV!c')];let _0x37e2e6=_0x559b3e[_0x2fff('10','%hZS')];let _0x5f5d8b={'url':_0x2fff('11','*7^u'),'headers':{'Host':_0x59ddb6[_0x2fff('12','s%]a')],'Content-Type':_0x59ddb6[_0x2fff('13','JdhA')],'Origin':_0x59ddb6[_0x2fff('14','BKKN')],'Accept-Encoding':_0x59ddb6[_0x2fff('15','i0j$')],'Cookie':cookie,'Connection':_0x59ddb6[_0x2fff('16','ehQh')],'Accept':_0x59ddb6[_0x2fff('17','6xIz')],'user-agent':$[_0x2fff('18','optT')]()?process[_0x2fff('19','KbB[')][_0x2fff('1a','az%1')]?process[_0x2fff('19','KbB[')][_0x2fff('1b','V3jQ')]:_0x59ddb6[_0x2fff('1c','V3jQ')](require,_0x59ddb6[_0x2fff('1d','N!1#')])[_0x2fff('1e','JdhA')]:$[_0x2fff('1f','6xIz')](_0x59ddb6[_0x2fff('20','%hZS')])?$[_0x2fff('21','N!1#')](_0x59ddb6[_0x2fff('22','JdhA')]):_0x59ddb6[_0x2fff('23','CQrE')],'Referer':_0x2fff('24','(76A')+_0x2d0d9b+_0x2fff('25','d!]C'),'Accept-Language':_0x59ddb6[_0x2fff('26','SOc!')]},'body':_0x2fff('27','lz$H')+_0x2d0d9b+_0x2fff('28','lz$H')+_0x37e2e6+_0x2fff('29','KbB[')};$[_0x2fff('2a','DopJ')](_0x5f5d8b,(_0x437055,_0x1c3abd,_0x5ce8d3)=>{if(_0x59ddb6[_0x2fff('2b','DopJ')](_0x59ddb6[_0x2fff('2c','KbB[')],_0x59ddb6[_0x2fff('2d','pmnZ')])){_0x2b3e86[_0x2fff('2e','CoVr')](_0x3677d4);}else{try{if(_0x437055){console[_0x2fff('2f','az%1')]($[_0x2fff('30','N!1#')]+_0x2fff('31','t]az'));}else{_0x5ce8d3=JSON[_0x2fff('32','6xIz')](_0x5ce8d3);}}catch(_0x2c705a){$[_0x2fff('33','j0#x')](_0x2c705a,resp);}finally{if(_0x59ddb6[_0x2fff('34','SC@u')](_0x59ddb6[_0x2fff('35','hzb(')],_0x59ddb6[_0x2fff('36','BVqL')])){$[_0x2fff('37','nE[6')](e,resp);}else{_0x59ddb6[_0x2fff('38','d!]C')](_0x3677d4);}}}});});}function shuye72(){var _0x217dc6={'oUKQj':function(_0x2cdc2b,_0x2c6871){return _0x2cdc2b===_0x2c6871;},'WiEaa':_0x2fff('39','lz$H'),'fchHe':_0x2fff('3a','IXJs'),'fWCiy':function(_0x42cf85,_0x30c4d6){return _0x42cf85===_0x30c4d6;},'mBipN':_0x2fff('3b','BVqL'),'qatJZ':function(_0x2487f8,_0x4dbd3b){return _0x2487f8!==_0x4dbd3b;},'Cpfyb':_0x2fff('3c','G5fo'),'mOZah':function(_0x4b2fc7,_0x1e70a4){return _0x4b2fc7!==_0x1e70a4;},'eRYKc':function(_0x34c1fb,_0x323542){return _0x34c1fb!==_0x323542;},'KFYnD':_0x2fff('3d','6xIz'),'UdNJz':_0x2fff('3e','Lfsu'),'kfGXm':function(_0x2ca10a,_0x387b34){return _0x2ca10a<_0x387b34;},'hMsXq':function(_0x3170c8,_0x14688b){return _0x3170c8(_0x14688b);},'zExuq':_0x2fff('3f','^iWi'),'IhoYE':_0x2fff('40','d!]C'),'kKBUU':function(_0x273365){return _0x273365();},'NvaOh':_0x2fff('41','&5hR'),'smpfI':_0x2fff('42','cPwk')};return new Promise(_0x2151b4=>{$[_0x2fff('43','t]az')]({'url':_0x217dc6[_0x2fff('44','[txi')],'headers':{'User-Agent':_0x217dc6[_0x2fff('45','H9qC')]}},async(_0x420221,_0x3ebeca,_0x1973ae)=>{try{if(_0x217dc6[_0x2fff('46','DopJ')](_0x217dc6[_0x2fff('47','5jL6')],_0x217dc6[_0x2fff('48','BVqL')])){console[_0x2fff('49','Fmm$')]($[_0x2fff('4a','moI5')]+_0x2fff('4b','JdhA'));}else{if(_0x420221){if(_0x217dc6[_0x2fff('4c','O635')](_0x217dc6[_0x2fff('4d','t]az')],_0x217dc6[_0x2fff('4e','Fmm$')])){console[_0x2fff('4f','IXJs')]($[_0x2fff('50','u*lN')]+_0x2fff('51','i0j$'));}else{$[_0x2fff('52','gp#v')](e,_0x3ebeca);}}else{if(_0x217dc6[_0x2fff('53','N!1#')](_0x217dc6[_0x2fff('54','KbB[')],_0x217dc6[_0x2fff('55','IXJs')])){if(_0x420221){console[_0x2fff('56','G5fo')]($[_0x2fff('57','3Mwv')]+_0x2fff('58','cPwk'));}else{_0x1973ae=JSON[_0x2fff('59','KbB[')](_0x1973ae);}}else{$[_0x2fff('5a','j0#x')]=JSON[_0x2fff('5b','hzb(')](_0x1973ae);if(_0x217dc6[_0x2fff('5c','V3jQ')]($[_0x2fff('5d','pmnZ')][_0x2fff('5e','SC@u')],0x0)){if(_0x217dc6[_0x2fff('5f','CoVr')](_0x217dc6[_0x2fff('60','CQrE')],_0x217dc6[_0x2fff('61','ehQh')])){for(let _0x381fcf=0x0;_0x217dc6[_0x2fff('62','%hZS')](_0x381fcf,$[_0x2fff('63','lz$H')][_0x2fff('64','s%]a')][_0x2fff('65','u%9Z')]);_0x381fcf++){let _0x5136a3=$[_0x2fff('66','[txi')][_0x2fff('67','tSer')][_0x381fcf];await $[_0x2fff('68','JV!c')](0x2bc);_0x217dc6[_0x2fff('69','6xIz')](wuzhi01,_0x5136a3);}}else{console[_0x2fff('6a','optT')]($[_0x2fff('6b','BKKN')]+_0x2fff('6c','pmnZ'));}}}}}}catch(_0x39c9e2){$[_0x2fff('6d','Lfsu')](_0x39c9e2,_0x3ebeca);}finally{if(_0x217dc6[_0x2fff('6e','BVqL')](_0x217dc6[_0x2fff('6f','j0#x')],_0x217dc6[_0x2fff('70','3Mwv')])){_0x217dc6[_0x2fff('71','hzb(')](_0x2151b4);}else{_0x1973ae=JSON[_0x2fff('72','BVqL')](_0x1973ae);}}});});};_0xodu='jsjiami.com.v6';
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
