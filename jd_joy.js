/*
jd宠汪汪 搬的https://github.com/uniqueque/QuantumultX/blob/4c1572d93d4d4f883f483f907120a75d925a693e/Script/jd_joy.js
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
IOS用户支持京东双账号,NodeJs用户支持N个京东账号
更新时间：2020-12-24
建议先凌晨0点运行jd_joy.js脚本获取狗粮后，再运行此脚本(jd_joy_steal.js)可偷好友积分，6点运行可偷好友狗粮
feedCount:自定义 每次喂养数量; 等级只和喂养次数有关，与数量无关
推荐每次投喂10个，积累狗粮，然后去玩聚宝盆赌
Combine from Zero-S1/JD_tools(https://github.com/Zero-S1/JD_tools)
*/
// quantumultx
// [task_local]
// #京东宠汪汪
// 15 */2 * * * https://raw.githubusercontent.com/lxk0301/jd_scripts/master/jd_joy.js, tag=京东宠汪汪, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdcww.png, enabled=true
// Loon
// [Script]
// cron "15 */2 * * *" script-path=https://raw.githubusercontent.com/lxk0301/jd_scripts/master/jd_joy.js,tag=京东宠汪汪
// Surge
// 京东宠汪汪 = type=cron,cronexp="15 */2 * * *",wake-system=1,timeout=20,script-path=https://raw.githubusercontent.com/lxk0301/jd_scripts/master/jd_joy.js
const $ = new Env('宠汪汪');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';

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
let message = '', subTitle = '';
let FEED_NUM = ($.getdata('joyFeedCount') * 1) || 10;   //每次喂养数量 [10,20,40,80]
let teamLevel = `2`;//参加多少人的赛跑比赛，默认是双人赛跑，可选2，10,50。其他不可选，其中2代表参加双人PK赛，10代表参加10人突围赛，50代表参加50人挑战赛，如若想设置不同账号参加不同类别的比赛则用&区分即可(如：`2&10&50`)
//是否参加宠汪汪双人赛跑（据目前观察，参加双人赛跑不消耗狗粮,如需参加其他多人赛跑，请关闭）
// 默认 'true' 参加双人赛跑，如需关闭 ，请改成 'false';
let joyRunFlag = true;
let jdNotify = true;//是否开启静默运行，默认true开启
const JD_API_HOST = 'https://jdjoy.jd.com/pet'
const weAppUrl = 'https://draw.jdfcloud.com//pet';
!(async () => {
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
      await TotalBean();
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});

        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      message = '';
      subTitle = '';
      await jdJoy();
      await showMsg();
      // await joinTwoPeopleRun();
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function jdJoy() {
  await getPetTaskConfig();
  if ($.getPetTaskConfigRes.success) {
    if ($.isNode()) {
      if (process.env.JOY_FEED_COUNT) {
        if ([10, 20, 40, 80].indexOf(process.env.JOY_FEED_COUNT * 1) > -1) {
          FEED_NUM = process.env.JOY_FEED_COUNT ? process.env.JOY_FEED_COUNT * 1 : FEED_NUM;
        } else {
          console.log(`您输入的 JOY_FEED_COUNT 为非法数字，请重新输入`);
        }
      }
    }
    await feedPets(FEED_NUM);//喂食
    await Promise.all([
      petTask(),
      appPetTask()
    ])
    await deskGoodsTask();//限时货柜
    await enterRoom();
    await joinTwoPeopleRun()//参加双人赛跑
  } else {
    message += `${$.getPetTaskConfigRes.errorMessage}`;
  }
}
//逛商品得100积分奖励任务
async function deskGoodsTask() {
 const deskGoodsRes = await getDeskGoodDetails();
 if (deskGoodsRes && deskGoodsRes.success) {
   if (deskGoodsRes.data && deskGoodsRes.data.deskGoods) {
     const { deskGoods, taskChance, followCount = 0 } = deskGoodsRes.data;
     console.log(`浏览货柜商品 ${followCount ? followCount : 0}/${taskChance}`);
     if (taskChance === followCount) return
     for (let item of deskGoods) {
       if (!item['status'] && item['sku']) {
         await followScan(item['sku'])
       }
     }
   } else {
     console.log(`限时商品货架已下架`);
   }
 }
}
//参加双人赛跑
async function joinTwoPeopleRun() {
  joyRunFlag = $.getdata('joyRunFlag') ? $.getdata('joyRunFlag') : joyRunFlag;
  if ($.isNode() && process.env.JOY_RUN_FLAG) {
    joyRunFlag = process.env.JOY_RUN_FLAG;
  }
  if (`${joyRunFlag}` === 'true') {
    let teamLevelTemp = [];
    teamLevelTemp = $.isNode() ? (process.env.JOY_TEAM_LEVEL ? process.env.JOY_TEAM_LEVEL.split('&') : teamLevel.split('&')) : ($.getdata('JOY_TEAM_LEVEL') ? $.getdata('JOY_TEAM_LEVEL').split('&') : teamLevel.split('&'));
    teamLevelTemp = teamLevelTemp[$.index - 1] ? teamLevelTemp[$.index - 1] : 2;
    await getPetRace();
    console.log(`\n===以下是京东账号${$.index} ${$.nickName} ${$.petRaceResult.data.teamLimitCount || teamLevelTemp}人赛跑信息===\n`)
    if ($.petRaceResult) {
      let petRaceResult = $.petRaceResult.data.petRaceResult;
      // let raceUsers = $.petRaceResult.data.raceUsers;
      console.log(`赛跑状态：${petRaceResult}\n`);
      if (petRaceResult === 'not_participate') {
        console.log(`暂未参赛，现在为您参加${teamLevelTemp}人赛跑`);
        await runMatch(teamLevelTemp * 1);
        if ($.runMatchResult.success) {
          await getWinCoin();
          console.log(`${$.getWinCoinRes.data.teamLimitCount || teamLevelTemp}人赛跑参加成功\n`);
          message += `${$.getWinCoinRes.data.teamLimitCount || teamLevelTemp}人赛跑：成功参加\n`;
          // if ($.getWinCoinRes.data['supplyOrder']) await energySupplyStation($.getWinCoinRes.data['supplyOrder']);
          await energySupplyStation('2');
          // petRaceResult = $.petRaceResult.data.petRaceResult;
          // await getRankList();
          console.log(`双人赛跑助力请自己手动去邀请好友，脚本不带赛跑助力功能\n`);
        }
      }
      if (petRaceResult === 'unbegin') {
        console.log('比赛还未开始，请九点再来');
      }
      if (petRaceResult === 'time_over') {
        console.log('今日参赛的比赛已经结束，请明天九点再来');
      }
      if (petRaceResult === 'unreceive') {
        console.log('今日参赛的比赛已经结束，现在领取奖励');
        await getWinCoin();
        let winCoin = 0;
        if ($.getWinCoinRes && $.getWinCoinRes.success) {
          winCoin = $.getWinCoinRes.data.winCoin;
        }
        await receiveJoyRunAward();
        console.log(`领取赛跑奖励结果：${JSON.stringify($.receiveJoyRunAwardRes)}`)
        if ($.receiveJoyRunAwardRes.success) {
          $.msg($.name, '', `【京东账号${$.index}】${$.nickName}\n太棒了，${$.name}赛跑取得获胜\n恭喜您已获得${winCoin}积分奖励`);
          if ($.isNode()) await notify.sendNotify(`${$.name} - 京东账号${$.index} - ${$.nickName}`, `京东账号${$.index}${$.nickName}\n太棒了，${$.name}赛跑取得获胜\n恭喜您已获得${winCoin}积分奖励`)
        }
      }
      if (petRaceResult === 'participate') {
        // if ($.getWinCoinRes.data['supplyOrder']) await energySupplyStation($.getWinCoinRes.data['supplyOrder']);
        await energySupplyStation('2');
        await getRankList();
        if($.raceUsers && $.raceUsers.length > 0) {
          for (let index = 0; index < $.raceUsers.length; index++) {
            if (index === 0) {
              console.log(`您当前里程：${$.raceUsers[index].distance}KM\n当前排名:第${$.raceUsers[index].rank}名\n将获得积分:${$.raceUsers[index].coin}\n`);
              // message += `您当前里程：${$.raceUsers[index].distance}km\n`;
            } else {
              console.log(`对手 ${$.raceUsers[index].nickName} 当前里程：${$.raceUsers[index].distance}KM`);
              // message += `对手当前里程：${$.raceUsers[index].distance}km\n`;
            }
          }
        }
        console.log('\n今日已参赛，下面显示应援团信息');
        await getBackupInfo();
        if ($.getBackupInfoResult.success) {
          const { currentNickName, totalMembers, totalDistance, backupList } = $.getBackupInfoResult.data;
          console.log(`${currentNickName}的应援团信息如下\n团员：${totalMembers}个\n团员助力的里程数：${totalDistance}\n`);
          if (backupList && backupList.length > 0) {
            for (let item of backupList) {
              console.log(`${item.nickName}为您助力${item.distance}km`);
            }
          } else {
            console.log(`暂无好友为您助力赛跑，如需助力，请手动去邀请好友助力\n`);
          }
        }
      }
    }
  } else {
    console.log(`您设置的是不参加双人赛跑`)
  }
}
//日常任务
async function petTask() {
  for (let item of $.getPetTaskConfigRes.datas) {
    const joinedCount = item.joinedCount || 0;
    if (item['receiveStatus'] === 'chance_full') {
      console.log(`${item.taskName} 任务已完成`)
      continue
    }
    //每日签到
    if (item['taskType'] === 'SignEveryDay') {
      if (item['receiveStatus'] === 'chance_left') {
        console.log('未完成,需要自己手动去微信小程序【来客有礼】签到，可获得京豆奖励')
      } else if (item['receiveStatus'] === 'unreceive') {
        //已签到，领取签到后的狗粮
        const res = await getFood('SignEveryDay');
        console.log(`领取每日签到狗粮结果：${res.data}`);
      }
    }
    //邀请用户助力,领狗粮.(需手动去做任务)
    if (item['taskType'] === 'InviteUser') {
      if (item['receiveStatus'] === 'chance_left') {
        console.log('未完成,需要自己手动去邀请好友给你助力,可以获得狗粮')
      } else if (item['receiveStatus'] === 'unreceive') {
        const InviteUser = await getFood('InviteUser');
        console.log(`领取助力后的狗粮结果::${JSON.stringify(InviteUser)}`);
      }
    }
    //每日三餐
    if (item['taskType'] === 'ThreeMeals') {
      console.log('-----每日三餐-----');
      if (item['receiveStatus'] === 'unreceive') {
        const ThreeMealsRes = await getFood('ThreeMeals');
        if (ThreeMealsRes.success) {
          if (ThreeMealsRes.errorCode === 'received') {
            console.log(`三餐结果领取成功`)
            message += `【三餐】领取成功，获得${ThreeMealsRes.data}g狗粮\n`;
          }
        }
      }
    }
    //关注店铺
    if (item['taskType'] === 'FollowShop') {
      console.log('-----关注店铺-----');
      const followShops = item.followShops;
      for (let shop of followShops) {
        if (!shop.status) {
          const followShopRes = await followShop(shop.shopId);
          console.log(`关注店铺${shop.name}结果::${JSON.stringify(followShopRes)}`)
        }
      }
    }
    //逛会场
    if (item['taskType'] === 'ScanMarket') {
      console.log('----逛会场----');
      const scanMarketList = item.scanMarketList;
      for (let scanMarketItem of scanMarketList) {
        if (!scanMarketItem.status) {
          const body = {
            "marketLink": scanMarketItem.marketLink,
            "taskType": "ScanMarket",
            "reqSource": "weapp"
          };
          const scanMarketRes = await scanMarket('scan', body);
          console.log(`逛会场-${scanMarketItem.marketName}结果::${JSON.stringify(scanMarketRes)}`)
        }
      }
    }
    //浏览频道
    if (item['taskType'] === 'FollowChannel') {
      console.log('----浏览频道----');
      const followChannelList = item.followChannelList;
      for (let followChannelItem of followChannelList) {
        if (!followChannelItem.status) {
          const body = {
            "channelId": followChannelItem.channelId,
            "taskType": "FollowChannel",
            "reqSource": "weapp"
          };
          const scanMarketRes = await scanMarket('scan', body);
          console.log(`浏览频道-${followChannelItem.channelName}结果::${JSON.stringify(scanMarketRes)}`)
        }
      }
    }
    //关注商品
    if (item['taskType'] === 'FollowGood') {
      console.log('----关注商品----');
      const followGoodList = item.followGoodList;
      for (let followGoodItem of followGoodList) {
        if (!followGoodItem.status) {
          const body = `sku=${followGoodItem.sku}&reqSource=h5`;
          const scanMarketRes = await scanMarket('followGood', body, 'application/x-www-form-urlencoded');
          // const scanMarketRes = await appScanMarket('followGood', `sku=${followGoodItem.sku}&reqSource=h5`, 'application/x-www-form-urlencoded');
          console.log(`关注商品-${followGoodItem.skuName}结果::${JSON.stringify(scanMarketRes)}`)
        }
      }
    }
    //看激励视频
    if (item['taskType'] === 'ViewVideo') {
      console.log('----浏览频道----');
      if (item.taskChance === joinedCount) {
        console.log('今日激励视频已看完')
      } else {
        for (let i = 0; i < new Array(item.taskChance - joinedCount).fill('').length; i++) {
          console.log(`开始第${i+1}次看激励视频`);
          const body = {"taskType":"ViewVideo","reqSource":"weapp"}
          let sanVideoRes = await scanMarket('scan', body);
          console.log(`看视频激励结果--${JSON.stringify(sanVideoRes)}`);
        }
      }
    }
  }
}
async function appPetTask() {
  await appGetPetTaskConfig();
  // console.log('$.appGetPetTaskConfigRes', $.appGetPetTaskConfigRes.success)
  if ($.appGetPetTaskConfigRes.success) {
    for (let item of $.appGetPetTaskConfigRes.datas) {
      if (item['taskType'] === 'ScanMarket' && item['receiveStatus'] === 'chance_left') {
        const scanMarketList = item.scanMarketList;
        for (let scan of scanMarketList) {
          if (!scan.status && scan.showDest === 'h5') {
            const body = { marketLink: scan.marketLinkH5, taskType: 'ScanMarket', reqSource: 'h5' }
            await appScanMarket('scan', body);
          }
        }
      }
    }
  }
}
function getDeskGoodDetails() {
  return new Promise(resolve => {
    const url = `${JD_API_HOST}/getDeskGoodDetails`;
    const host = `jdjoy.jd.com`;
    const reqSource = 'h5';
    $.get(taskUrl(url, host, reqSource), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function followScan(sku) {
  return new Promise(resolve => {
    const url = `${JD_API_HOST}/scan`;
    const host = `jdjoy.jd.com`;
    const reqSource = 'h5';
    const body = {
      "taskType": "ScanDeskGood",
      "reqSource": "h5",
      sku
    }
    $.post(taskPostUrl(url, JSON.stringify(body), reqSource, host, 'application/json'), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//小程序逛会场，浏览频道，关注商品API
function scanMarket(type, body, cType = 'application/json') {
  return new Promise(resolve => {
    const url = `${weAppUrl}/${type}`;
    const host = `draw.jdfcloud.com`;
    const reqSource = 'weapp';
    if (cType === 'application/json') {
      body = JSON.stringify(body)
    }
    $.post(taskPostUrl(url, body, reqSource, host, cType), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//app逛会场
function appScanMarket(type, body) {
  return new Promise(resolve => {
    const url = `${JD_API_HOST}/${type}`;
    const host = `jdjoy.jd.com`;
    const reqSource = 'h5';
    $.post(taskPostUrl(url, JSON.stringify(body), reqSource, host, 'application/json'), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          // data = JSON.parse(data);
          console.log(`京东app逛会场结果::${data}`)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}

//领取狗粮API
function getFood(type) {
  return new Promise(resolve => {
    const url = `${weAppUrl}/getFood?reqSource=weapp&taskType=${type}`;
    const host = `draw.jdfcloud.com`;
    const reqSource = 'weapp';
    $.get(taskUrl(url, host, reqSource), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
//关注店铺api
function followShop(shopId) {
  return new Promise(resolve => {
    const url = `${weAppUrl}/followShop`;
    const body = `shopId=${shopId}`;
    const reqSource = 'weapp';
    const host = 'draw.jdfcloud.com';
    $.post(taskPostUrl(url, body, reqSource, host,'application/x-www-form-urlencoded'), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          data = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve(data);
      }
    })
  })
}
function enterRoom() {
  return new Promise(resolve => {
    const url = `${weAppUrl}/enterRoom/h5?reqSource=weapp&invitePin=&openId=`;
    const host = `draw.jdfcloud.com`;
    const reqSource = 'weapp';
    $.post({...taskUrl(url, host, reqSource),body:'{}'}, (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          // console.log('JSON.parse(data)', JSON.parse(data))

          $.roomData = JSON.parse(data);

          console.log(`现有狗粮: ${$.roomData.data.petFood}\n`)

          subTitle = `【用户名】${$.roomData.data.pin}`
          message = `现有积分: ${$.roomData.data.petCoin}\n现有狗粮: ${$.roomData.data.petFood}\n喂养次数: ${$.roomData.data.feedCount}\n宠物等级: ${$.roomData.data.petLevel}\n`
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
function appGetPetTaskConfig() {
  return new Promise(resolve => {
    const url = `${JD_API_HOST}/getPetTaskConfig?reqSource=h5`;
    const host = `jdjoy.jd.com`;
    const reqSource = 'h5';
    $.get(taskUrl(url, host, reqSource), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          // console.log('----', JSON.parse(data))
          $.appGetPetTaskConfigRes = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
//喂食
function feedPets(feedNum) {
  return new Promise(resolve => {
    console.log(`您设置的喂食数量:${FEED_NUM}g\n`);
    console.log(`实际的喂食数量:${feedNum}g\n`);
    const url = `${weAppUrl}/feed?feedCount=${feedNum}&reqSource=weapp`;
    const host = `draw.jdfcloud.com`;
    const reqSource = 'weapp';
    $.get(taskUrl(url, host, reqSource), async (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          data = JSON.parse(data);
          if (data.success) {
            if (data.errorCode === 'feed_ok') {
              console.log('喂食成功')
              message += `【喂食成功】消耗${feedNum}g狗粮\n`;
            } else if (data.errorCode === 'time_error') {
              console.log('喂食失败：您的汪汪正在食用中,请稍后再喂食')
              message += `【喂食失败】您的汪汪正在食用中,请稍后再喂食\n`;
            } else if (data.errorCode === 'food_insufficient') {
              console.log(`当前喂食${feedNum}g狗粮不够, 现为您降低一档次喂食\n`)
              if ((feedNum) === 80) {
                feedNum = 40;
              } else if ((feedNum) === 40) {
                feedNum = 20;
              } else if ((feedNum) === 20) {
                feedNum = 10;
              } else if ((feedNum) === 10) {
                feedNum = 0;
              }
              // 如果喂食设置的数量失败, 就降低一个档次喂食.
              if ((feedNum) !== 0) {
                await feedPets(feedNum);
              } else {
                console.log('您的狗粮已不足10g')
                message += `【喂食失败】您的狗粮已不足10g\n`;
              }
            } else {
              console.log(`其他状态${data.errorCode}`)
            }
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
function getPetTaskConfig() {
  return new Promise(resolve => {
    const url = `${weAppUrl}/getPetTaskConfig?reqSource=weapp`;
    const host = `draw.jdfcloud.com`;
    const reqSource = 'weapp';
    $.get(taskUrl(url, host, reqSource), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          // console.log('JSON.parse(data)', JSON.parse(data))
          $.getPetTaskConfigRes = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
//查询赛跑信息API
function getPetRace() {
  return new Promise(resolve => {
    const url = `${JD_API_HOST}/combat/detail/v2?help=false`;
    const host = `jdjoy.jd.com`;
    const reqSource = 'h5';
    $.get(taskUrl(url, host, reqSource), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          // console.log('查询赛跑信息API',(data))
          // $.appGetPetTaskConfigRes = JSON.parse(data);
          $.petRaceResult = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
//查询赛跑排行榜
function getRankList() {
  return new Promise(resolve => {
    const url = `${JD_API_HOST}/combat/getRankList`;
    $.raceUsers = [];
    $.get(taskUrl(url, `jdjoy.jd.com`, 'h5'), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          // console.log('查询赛跑信息API',(data))
          data = JSON.parse(data);
          if (data.success) {
            $.raceUsers = data.datas;
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
//参加赛跑API
function runMatch(teamLevel, timeout = 5000) {
  if (teamLevel === 10 || teamLevel === 50) timeout = 60000;
  console.log(`正在参赛中，请稍等${timeout / 1000}秒，以防多个账号匹配到统一赛场\n`)
  return new Promise(async resolve => {
    await $.wait(timeout);
    const url = `${JD_API_HOST}/combat/match?teamLevel=${teamLevel}`;
    const host = `jdjoy.jd.com`;
    const reqSource = 'h5';
    $.get(taskUrl(url, host, reqSource), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          // console.log('参加赛跑API', JSON.parse(data))
          // $.appGetPetTaskConfigRes = JSON.parse(data);
          $.runMatchResult = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
//查询应援团信息API
function getBackupInfo() {
  return new Promise(resolve => {
    const url = `${JD_API_HOST}/combat/getBackupInfo`;
    const host = `jdjoy.jd.com`;
    const reqSource = 'h5';
    $.get(taskUrl(url, host, reqSource), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          // console.log('查询应援团信息API',(data))
          // $.appGetPetTaskConfigRes = JSON.parse(data);
          $.getBackupInfoResult = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
//查询赛跑获得多少积分
function getWinCoin() {
  return new Promise(resolve => {
    const url = `${weAppUrl}/combat/detail/v2?help=false&reqSource=weapp`;
    $.get(taskUrl(url, 'draw.jdfcloud.com', `weapp`), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          // console.log('查询应援团信息API',(data))
          // $.appGetPetTaskConfigRes = JSON.parse(data);
          if (data) {
            $.getWinCoinRes = JSON.parse(data);
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
//领取赛跑奖励API
function receiveJoyRunAward() {
  return new Promise(resolve => {
    const url = `${JD_API_HOST}/combat/receive`;
    const host = `jdjoy.jd.com`;
    const reqSource = 'h5';
    $.get(taskUrl(url, host, reqSource), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          // console.log('查询应援团信息API',(data))
          // $.appGetPetTaskConfigRes = JSON.parse(data);
          $.receiveJoyRunAwardRes = JSON.parse(data);
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve();
      }
    })
  })
}
//能力补给站
async function energySupplyStation(showOrder) {
  let status;
  await getSupplyInfo(showOrder);
  if ($.getSupplyInfoRes && $.getSupplyInfoRes.success) {
    if ($.getSupplyInfoRes.data) {
      const { marketList } = $.getSupplyInfoRes.data;
      for (let list of marketList) {
        if (!list['status']) {
          await scanMarket('combat/supply', { showOrder, 'supplyType': 'scan_market', 'taskInfo': list.marketLink || list['marketLinkH5'], 'reqSource': 'weapp' });
          await getSupplyInfo(showOrder);
        } else {
          $.log(`能力补给站 ${$.getSupplyInfoRes.data.addDistance}km里程 已领取\n`);
          status = list['status'];
        }
      }
      if (!status) {
        await energySupplyStation(showOrder);
      }
    }
  }
}
function getSupplyInfo(showOrder) {
  return new Promise(resolve => {
    const url = `${weAppUrl}/combat/getSupplyInfo?showOrder=${showOrder}`;
    $.get(taskUrl(url, 'draw.jdfcloud.com', `weapp`), (err, resp, data) => {
      try {
        if (err) {
          console.log('\n京东宠汪汪: API查询请求失败 ‼️‼️')
        } else {
          // console.log('查询应援团信息API',(data))
          // $.appGetPetTaskConfigRes = JSON.parse(data);
          if (data) {
            $.getSupplyInfoRes = JSON.parse(data);
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
function showMsg() {
  jdNotify = $.getdata('jdJoyNotify') ? $.getdata('jdJoyNotify') : jdNotify;
  if (!jdNotify || jdNotify === 'false') {
    $.msg($.name, subTitle, message);
  } else {
    $.log(`\n${message}\n`);
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
function taskUrl(url, Host, reqSource) {
  return {
    url: url,
    headers: {
      'Cookie': cookie,
      'reqSource': reqSource,
      'Host': Host,
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Referer': 'https://jdjoy.jd.com/pet/index',
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
    }
  }
}
function taskPostUrl(url, body, reqSource, Host, ContentType) {
  return {
    url: url,
    body: body,
    headers: {
      'Cookie': cookie,
      'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0"),
      'reqSource': reqSource,
      'Content-Type': ContentType,
      'Host': Host,
      'Referer': 'https://jdjoy.jd.com/pet/index',
      'Accept-Language': 'zh-cn',
      'Accept-Encoding': 'gzip, deflate, br',
    }
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
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,o)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),h=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t)))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t))}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",o){const r=t=>{if(!t||!this.isLoon()&&this.isSurge())return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,r(o)):this.isQuanX()&&$notify(e,s,i,r(o)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
