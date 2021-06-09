/*
618动物联萌
author:star
解密参考自：https://github.com/yangtingxiao/QuantumultX/blob/master/scripts/jd/jd_zoo.js
活动入口：京东APP-》搜索 玩一玩-》瓜分20亿
邀请好友助力：内部账号自行互助(排名靠前账号得到的机会多)
PK互助：内部账号自行互助(排名靠前账号得到的机会多),多余的助力次数会默认助力作者内置助力码
小程序任务：已完成
地图任务：已添加，下午2点到5点执行,抽奖已添加(基本都是优惠券)
金融APP任务：已完成
活动时间：2021-05-24至2021-06-20
脚本更新时间：2021-06-05 18:30
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
===================quantumultx================
[task_local]
#618动物联萌
33 0,6-23/2 * * * https://gitee.com/lxk0301/jd_scripts/raw/master/jd_zoo.js, tag=618动物联萌, img-url=https://raw.githubusercontent.com/Orz-3/mini/master/Color/jd.png, enabled=true

=====================Loon================
[Script]
cron "33 0,6-23/2 * * *" script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_zoo.js, tag=618动物联萌

====================Surge================
618动物联萌 = type=cron,cronexp="33 0,6-23/2 * * *",wake-system=1,timeout=3600,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_zoo.js

============小火箭=========
618动物联萌 = type=cron,script-path=https://gitee.com/lxk0301/jd_scripts/raw/master/jd_zoo.js, cronexpr="33 0,6-23/2 * * *", timeout=3600, enable=true
 */
const $ = new Env('618动物联萌');
const notify = $.isNode() ? require('./sendNotify') : '';
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const pKHelpFlag = true;//是否PK助力  true 助力，false 不助力
const pKHelpAuthorFlag = true;//是否助力作者PK  true 助力，false 不助力
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [];
$.cookie = '';
$.inviteList = [];
$.pkInviteList = [];
$.secretpInfo = {};
$.innerPkInviteList = [
  "sSKNX-MpqKOJsNu9y8nYAqXFF5NKOpRPsMffiCRwqC9Qb8MWZnWWJhg7JHU144Ar",
  "sSKNX-MpqKOJsNu-zJuKUHj2-v3Nwqvdkyk9Jsxn6oqHcInoKRfdLKKVzeW1cJSG",
  "sSKNX-MpqKOJsNu_mpLQVscEUFEwqZlwdIW6w-kWLlQuLST3RQYUu_nMUcjkUvTc"
];
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr = [
    $.getdata("CookieJD"),
    $.getdata("CookieJD2"),
    ...$.toObj($.getdata("CookiesJD") || "[]").map((item) => item.cookie)].filter((item) => !!item);
}
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
    return;
  }
  console.log('活动入口：京东APP-》搜索 玩一玩-》瓜分20亿\n' +
      '邀请好友助力：内部账号自行互助(排名靠前账号得到的机会多)\n' +
      'PK互助：内部账号自行互助(排名靠前账号得到的机会多),多余的助力次数会默认助力作者内置助力码\n' +
      '小程序任务：已完成\n' +
      '地图任务：已添加，下午2点到5点执行,抽奖已添加\n' +
      '金融APP任务：已完成\n' +
      '活动时间：2021-05-24至2021-06-20\n' +
      '脚本更新时间：2021-06-05 18:30\n'
      );
  for (let i = 0; i < cookiesArr.length; i++) {
    if (cookiesArr[i]) {
      $.cookie = cookiesArr[i];
      $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
      $.index = i + 1;
      $.isLogin = true;
      $.nickName = $.UserName;
      $.hotFlag = false; //是否火爆
      await TotalBean();
      console.log(`\n*****开始【京东账号${$.index}】${$.nickName || $.UserName}*****\n`);
      console.log(`\n如有未完成的任务，请多执行几次\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {"open-url": "https://bean.m.jd.com/bean/signIndex.action"});
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        }
        continue
      }
      await zoo();
      if($.hotFlag)$.secretpInfo[$.UserName] = false;//火爆账号不执行助力
    }
  }
  let res = [], res2 = [], res3 = [];
  res = await getAuthorShareCode() || [];
  res2 = await getAuthorShareCode('https://ghproxy.com/https://raw.githubusercontent.com/zero205/updateTeam/main/shareCodes/jd_zoo.json') || [];
  res3 = await getAuthorShareCode('https://raw.githubusercontent.com/zero205/updateTeam/main/shareCodes/jd_zoo.json');
  if (!res3) await getAuthorShareCode('https://cdn.jsdelivr.net/gh/zero205/updateTeam@main/shareCodes/jd_zoo.json')
  if (pKHelpAuthorFlag) {
    $.innerPkInviteList = getRandomArrayElements([...$.innerPkInviteList, ...res, ...res2, ...res3], [...$.innerPkInviteList, ...res, ...res2, ...res3].length);
    $.pkInviteList.push(...$.innerPkInviteList);
  }
  for (let i = 0; i < cookiesArr.length; i++) {
    $.cookie = cookiesArr[i];
    $.canHelp = true;
    $.UserName = decodeURIComponent($.cookie.match(/pt_pin=([^; ]+)(?=;?)/) && $.cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
    if (!$.secretpInfo[$.UserName]) {
      continue;
    }
    $.secretp = $.secretpInfo[$.UserName];
    $.index = i + 1;
    //console.log($.inviteList);
    //pk助力
    if (new Date().getHours() >= 9) {
      console.log(`\n******开始内部京东账号【怪兽大作战pk】助力*********\n`);
      for (let i = 0; i < $.pkInviteList.length && pKHelpFlag && $.canHelp; i++) {
        console.log(`${$.UserName} 去助力PK码 ${$.pkInviteList[i]}`);
        $.pkInviteId = $.pkInviteList[i];
        await takePostRequest('pkHelp');
        await $.wait(2000);
      }
      $.canHelp = true;
    }
    if ($.inviteList && $.inviteList.length) console.log(`\n******开始内部京东账号【邀请好友助力】*********\n`);
    for (let j = 0; j < $.inviteList.length && $.canHelp; j++) {
      $.oneInviteInfo = $.inviteList[j];
      if ($.oneInviteInfo.ues === $.UserName || $.oneInviteInfo.max) {
        continue;
      }
      //console.log($.oneInviteInfo);
      $.inviteId = $.oneInviteInfo.inviteId;
      console.log(`${$.UserName}去助力${$.oneInviteInfo.ues},助力码${$.inviteId}`);
      //await takePostRequest('helpHomeData');
      await takePostRequest('help');
      await $.wait(2000);
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function zoo() {
  try {
    $.signSingle = {};
    $.homeData = {};
    $.secretp = ``;
    $.taskList = [];
    $.shopSign = ``;
    await takePostRequest('zoo_signSingle');
    if (JSON.stringify($.signSingle) === `{}` || $.signSingle.bizCode !== 0) {
      console.log($.signSingle.bizMsg);
      return;
    } else {
      console.log(`\n获取活动信息`);
    }
    await $.wait(1000);
    await takePostRequest('zoo_getHomeData');
    $.userInfo =$.homeData.result.homeMainInfo
    console.log(`\n\n当前分红：${$.userInfo.raiseInfo.redNum}份，当前等级:${$.userInfo.raiseInfo.scoreLevel}\n当前金币${$.userInfo.raiseInfo.remainScore}，下一关需要${$.userInfo.raiseInfo.nextLevelScore - $.userInfo.raiseInfo.curLevelStartScore}\n\n`);
    await $.wait(1000);
    await takePostRequest('zoo_getSignHomeData');
    await $.wait(1000);
    if($.signHomeData.todayStatus === 0){
      console.log(`去签到`);
      await takePostRequest('zoo_sign');
      await $.wait(1000);
    }else{
      console.log(`已签到`);
    }
    let raiseInfo = $.homeData.result.homeMainInfo.raiseInfo;
    if (Number(raiseInfo.totalScore) > Number(raiseInfo.nextLevelScore) && raiseInfo.buttonStatus === 1) {
      console.log(`满足升级条件，去升级`);
      await $.wait(3000);
      await takePostRequest('zoo_raise');
    }
    //收金币
    await $.wait(1000);
    await takePostRequest('zoo_collectProduceScore');
    await $.wait(1000);
    await takePostRequest('zoo_getTaskDetail');
    await $.wait(1000);
    //做任务
      for (let i = 0; i < $.taskList.length && $.secretp && !$.hotFlag; i++) {
        $.oneTask = $.taskList[i];
        if ([1, 3, 5, 7, 9, 26].includes($.oneTask.taskType) && $.oneTask.status === 1) {
          $.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.brandMemberVos || $.oneTask.followShopVo || $.oneTask.browseShopVo;
          for (let j = 0; j < $.activityInfoList.length; j++) {
            $.oneActivityInfo = $.activityInfoList[j];
            if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
              continue;
            }
            $.callbackInfo = {};
            console.log(`做任务：${$.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`);
            await takePostRequest('zoo_collectScore');
            if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $.callbackInfo.data.result.taskToken) {
              await $.wait(8000);
              let sendInfo = encodeURIComponent(`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
              await callbackResult(sendInfo)
            } else if ($.oneTask.taskType === 5 || $.oneTask.taskType === 3 || $.oneTask.taskType === 26) {
              await $.wait(2000);
              console.log(`任务完成`);
            } else {
              console.log($.callbackInfo);
              console.log(`任务失败`);
              await $.wait(3000);
            }
          }
        } else if ($.oneTask.taskType === 2 && $.oneTask.status === 1 && $.oneTask.scoreRuleVos[0].scoreRuleType === 2) {
          console.log(`做任务：${$.oneTask.taskName};等待完成 (实际不会添加到购物车)`);
          $.taskId = $.oneTask.taskId;
          $.feedDetailInfo = {};
          await takePostRequest('zoo_getFeedDetail');
          let productList = $.feedDetailInfo.productInfoVos;
          let needTime = Number($.feedDetailInfo.maxTimes) - Number($.feedDetailInfo.times);
          for (let j = 0; j < productList.length && needTime > 0; j++) {
            if (productList[j].status !== 1) {
              continue;
            }
            $.taskToken = productList[j].taskToken;
            console.log(`加购：${productList[j].skuName}`);
            await takePostRequest('add_car');
            await $.wait(1500);
            needTime--;
          }
        } else if ($.oneTask.taskType === 2 && $.oneTask.status === 1 && $.oneTask.scoreRuleVos[0].scoreRuleType === 0) {
          $.activityInfoList = $.oneTask.productInfoVos;
          for (let j = 0; j < $.activityInfoList.length; j++) {
            $.oneActivityInfo = $.activityInfoList[j];
            if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
              continue;
            }
            $.callbackInfo = {};
            console.log(`做任务：浏览${$.oneActivityInfo.skuName};等待完成`);
            await takePostRequest('zoo_collectScore');
            if ($.oneTask.taskType === 2) {
              await $.wait(2000);
              console.log(`任务完成`);
            } else {
              console.log($.callbackInfo);
              console.log(`任务失败`);
              await $.wait(3000);
            }
          }
        }
      }
    await $.wait(1000);
    await takePostRequest('zoo_getHomeData');
    raiseInfo = $.homeData.result.homeMainInfo.raiseInfo;
    if (Number(raiseInfo.totalScore) > Number(raiseInfo.nextLevelScore) && raiseInfo.buttonStatus === 1) {
      console.log(`满足升级条件，去升级`);
      await $.wait(1000);
      await takePostRequest('zoo_raise');
    }
    //===================================图鉴里的店铺====================================================================
    if (new Date().getHours()>= 17 && new Date().getHours()<= 18 && !$.hotFlag) {//分享
      $.myMapList = [];
      await takePostRequest('zoo_myMap');
      for (let i = 0; i < $.myMapList.length; i++) {
        await $.wait(3000);
        $.currentScence = i + 1;
        if ($.myMapList[i].isFirstShare === 1) {
          console.log(`去分享${$.myMapList[i].partyName}`);
          await takePostRequest('zoo_getWelfareScore');
        }
      }
    }
    if (new Date().getHours() >= 14 && new Date().getHours() <= 17 && !$.hotFlag){//30个店铺，为了避免代码执行太久，下午2点到5点才做店铺任务
      console.log(`去做店铺任务`);
      $.shopInfoList = [];
      await takePostRequest('qryCompositeMaterials');
      for (let i = 0; i < $.shopInfoList.length; i++) {
        $.shopSign = $.shopInfoList[i].extension.shopId;
        console.log(`执行第${i+1}个店铺任务：${$.shopInfoList[i].name} ID:${$.shopSign}`);
        $.shopResult = {};
        await takePostRequest('zoo_shopLotteryInfo');
        await $.wait(1000);
        if(JSON.stringify($.shopResult) === `{}`) continue;
        $.shopTask = $.shopResult.taskVos;
        for (let i = 0; i < $.shopTask.length; i++) {
          $.oneTask = $.shopTask[i];
          //console.log($.oneTask);
          if($.oneTask.taskType === 21 || $.oneTask.taskType === 14 || $.oneTask.status !== 1){continue;} //不做入会//不做邀请
          $.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.simpleRecordInfoVo;
          if($.oneTask.taskType === 12){//签到
            if($.shopResult.dayFirst === 0){
              $.oneActivityInfo =  $.activityInfoList;
              console.log(`店铺签到`);
              await takePostRequest('zoo_bdCollectScore');
            }
            continue;
          }
          for (let j = 0; j < $.activityInfoList.length; j++) {
            $.oneActivityInfo = $.activityInfoList[j];
            if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
              continue;
            }
            $.callbackInfo = {};
            console.log(`做任务：${$.oneActivityInfo.subtitle || $.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`);
            await takePostRequest('zoo_collectScore');
            if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $.callbackInfo.data.result.taskToken) {
              await $.wait(8000);
              let sendInfo = encodeURIComponent(`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
              await callbackResult(sendInfo)
            } else  {
              await $.wait(2000);
              console.log(`任务完成`);
            }
          }
        }
        await $.wait(1000);
        let boxLotteryNum = $.shopResult.boxLotteryNum;
        for (let j = 0; j < boxLotteryNum; j++) {
          console.log(`开始第${j+1}次拆盒`)
          //抽奖
          await takePostRequest('zoo_boxShopLottery');
          await $.wait(3000);
        }
        // let wishLotteryNum = $.shopResult.wishLotteryNum;
        // for (let j = 0; j < wishLotteryNum; j++) {
        //   console.log(`开始第${j+1}次能量抽奖`)
        //   //抽奖
        //   await takePostRequest('zoo_wishShopLottery');
        //   await $.wait(3000);
        // }
        await $.wait(3000);
      }
    }
    //==================================微信任务========================================================================
      $.wxTaskList = [];
      if (!$.hotFlag) await takePostRequest('wxTaskDetail');
      for (let i = 0; i < $.wxTaskList.length; i++) {
        $.oneTask = $.wxTaskList[i];
        if ($.oneTask.taskType === 2 || $.oneTask.status !== 1) { continue; } //不做加购
        $.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.brandMemberVos || $.oneTask.followShopVo || $.oneTask.browseShopVo;
        for (let j = 0; j < $.activityInfoList.length; j++) {
          $.oneActivityInfo = $.activityInfoList[j];
          if ($.oneActivityInfo.status !== 1 || !$.oneActivityInfo.taskToken) {
            continue;
          }
          $.callbackInfo = {};
          console.log(`做任务：${$.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`);
          await takePostRequest('zoo_collectScore');
          if ($.callbackInfo.code === 0 && $.callbackInfo.data && $.callbackInfo.data.result && $.callbackInfo.data.result.taskToken) {
            await $.wait(8000);
            let sendInfo = encodeURIComponent(`{"dataSource":"newshortAward","method":"getTaskAward","reqParams":"{\\"taskToken\\":\\"${$.callbackInfo.data.result.taskToken}\\"}","sdkVersion":"1.0.0","clientLanguage":"zh"}`)
            await callbackResult(sendInfo)
          } else {
            await $.wait(2000);
            console.log(`任务完成`);
          }
        }
      }
    //=======================================================京东金融=================================================================================
      $.jdjrTaskList = [];
      if (!$.hotFlag) await takePostRequest('jdjrTaskDetail');
      await $.wait(1000);
      for (let i = 0; i < $.jdjrTaskList.length; i++) {
        $.taskId = $.jdjrTaskList[i].id;
        if ($.taskId === '3980' || $.taskId === '3981' || $.taskId === '3982') continue;
        if ($.jdjrTaskList[i].status === '1' || $.jdjrTaskList[i].status === '3') {
          console.log(`去做任务：${$.jdjrTaskList[i].name}`);
          await takePostRequest('jdjrAcceptTask');
          await $.wait(8000);
          await takeGetRequest();
        } else if ($.jdjrTaskList[i].status === '2') {
          console.log(`任务：${$.jdjrTaskList[i].name},已完成`);
        }
      }
    //======================================================怪兽大作战=================================================================================
    $.pkHomeData = {};
    await takePostRequest('zoo_pk_getHomeData');
    if (JSON.stringify($.pkHomeData) === '{}') {
      console.log(`获取PK信息异常`);
      return;
    }
    await $.wait(1000);
    $.pkTaskList = [];
    if(!$.hotFlag) await takePostRequest('zoo_pk_getTaskDetail');
    await $.wait(1000);
    for (let i = 0; i < $.pkTaskList.length; i++) {
      $.oneTask = $.pkTaskList[i];
      if ($.oneTask.status === 1) {
        $.activityInfoList = $.oneTask.shoppingActivityVos || $.oneTask.brandMemberVos || $.oneTask.followShopVo || $.oneTask.browseShopVo
        for (let j = 0; j < $.activityInfoList.length; j++) {
          $.oneActivityInfo = $.activityInfoList[j];
          if ($.oneActivityInfo.status !== 1) {
            continue;
          }
          console.log(`做任务：${$.oneActivityInfo.title || $.oneActivityInfo.taskName || $.oneActivityInfo.shopName};等待完成`);
          await takePostRequest('zoo_pk_collectScore');
          await $.wait(2000);
          console.log(`任务完成`);
        }
      }
    }
    await $.wait(1000);
    if (new Date().getHours() >= 18) {
      console.log(`\n******开始【怪兽大作战守护红包】******\n`);
      //await takePostRequest('zoo_pk_getTaskDetail');
      let skillList = $.pkHomeData.result.groupInfo.skillList || [];
      //activityStatus === 1未开始，2 已开始
      $.doSkillFlag = true;
      for (let i = 0; i < skillList.length && $.pkHomeData.result.activityStatus === 2 && $.doSkillFlag; i++) {
        if (Number(skillList[i].num) > 0) {
          $.skillCode = skillList[i].code;
          for (let j = 0; j < Number(skillList[i].num) && $.doSkillFlag; j++) {
            console.log(`使用技能`);
            await takePostRequest('zoo_pk_doPkSkill');
            await $.wait(2000);
          }
        }
      }
    }
  } catch (e) {
    $.logErr(e)
  }
}

async function takePostRequest(type) {
  let body = ``;
  let myRequest = ``;
  switch (type) {
    case 'zoo_signSingle':
      body = `functionId=zoo_signSingle&body={}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_signSingle`, body);
      break;
    case 'zoo_getHomeData':
      body = `functionId=zoo_getHomeData&body={}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_getHomeData`, body);
      break;
    case 'helpHomeData':
      body = `functionId=zoo_getHomeData&body={"inviteId":"${$.inviteId}"}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_getHomeData`, body);
      break;
    case 'zoo_collectProduceScore':
      body = getPostBody(type);
      myRequest = await getPostRequest(`zoo_collectProduceScore`, body);
      break;
    case 'zoo_getFeedDetail':
      body = `functionId=zoo_getFeedDetail&body={"taskId":"${$.taskId}"}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_getFeedDetail`, body);
      break;
    case 'zoo_getTaskDetail':
      body = `functionId=zoo_getTaskDetail&body={}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_getTaskDetail`, body);
      break;
    case 'zoo_collectScore':
      body = getPostBody(type);
      //console.log(body);
      myRequest = await getPostRequest(`zoo_collectScore`, body);
      break;
    case 'zoo_raise':
      body = `functionId=zoo_raise&body={}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_raise`, body);
      break;
    case 'help':
      body = getPostBody(type);
      //console.log(body);
      myRequest = await getPostRequest(`zoo_collectScore`, body);
      break;
    case 'zoo_pk_getHomeData':
      body = `functionId=zoo_pk_getHomeData&body={}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_pk_getHomeData`, body);
      break;
    case 'zoo_pk_getTaskDetail':
      body = `functionId=zoo_pk_getTaskDetail&body={}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_pk_getTaskDetail`, body);
      break;
    case 'zoo_pk_collectScore':
      body = getPostBody(type);
      //console.log(body);
      myRequest = await getPostRequest(`zoo_pk_collectScore`, body);
      break;
    case 'zoo_pk_doPkSkill':
      body = `functionId=zoo_pk_doPkSkill&body={"skillType":"${$.skillCode}"}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_pk_doPkSkill`, body);
      break;
    case 'pkHelp':
      body = getPostBody(type);
      myRequest = await getPostRequest(`zoo_pk_assistGroup`, body);
      break;
    case 'zoo_getSignHomeData':
      body = `functionId=zoo_getSignHomeData&body={"notCount":"1"}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_getSignHomeData`,body);
      break;
    case 'zoo_sign':
      body = `functionId=zoo_sign&body={}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_sign`,body);
      break;
    case 'wxTaskDetail':
      body = `functionId=zoo_getTaskDetail&body={"appSign":"2","channel":1,"shopSign":""}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_getTaskDetail`,body);
      break;
    case 'zoo_shopLotteryInfo':
      body = `functionId=zoo_shopLotteryInfo&body={"shopSign":"${$.shopSign}"}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_shopLotteryInfo`,body);
      break;
    case 'zoo_bdCollectScore':
      body = getPostBody(type);
      myRequest = await getPostRequest(`zoo_bdCollectScore`,body);
      break;
    case 'qryCompositeMaterials':
      body = `functionId=qryCompositeMaterials&body={"qryParam":"[{\\"type\\":\\"advertGroup\\",\\"mapTo\\":\\"resultData\\",\\"id\\":\\"05371960\\"}]","activityId":"2s7hhSTbhMgxpGoa9JDnbDzJTaBB","pageId":"","reqSrc":"","applyKey":"jd_star"}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`qryCompositeMaterials`,body);
      break;
    case 'zoo_boxShopLottery':
      body = `functionId=zoo_boxShopLottery&body={"shopSign":"${$.shopSign}"}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_boxShopLottery`,body);
      break;
    case `zoo_wishShopLottery`:
      body = `functionId=zoo_wishShopLottery&body={"shopSign":"${$.shopSign}"}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_boxShopLottery`,body);
      break;
    case `zoo_myMap`:
      body = `functionId=zoo_myMap&body={}&client=wh5&clientVersion=1.0.0`;
      myRequest = await getPostRequest(`zoo_myMap`,body);
      break;
    case 'zoo_getWelfareScore':
      body = getPostBody(type);
      myRequest = await getPostRequest(`zoo_getWelfareScore`,body);
      break;
    case 'jdjrTaskDetail':
      body = `reqData={"eid":"","sdkToken":"jdd014JYKVE2S6UEEIWPKA4B5ZKBS4N6Y6X5GX2NXL4IYUMHKF3EEVK52RQHBYXRZ67XWQF5N7XB6Y2YKYRTGQW4GV5OFGPDPFP3MZINWG2A01234567"}`;
      myRequest = await getPostRequest(`listTask`,body);
      break;
    case 'jdjrAcceptTask':
      body = `reqData={"eid":"","sdkToken":"jdd014JYKVE2S6UEEIWPKA4B5ZKBS4N6Y6X5GX2NXL4IYUMHKF3EEVK52RQHBYXRZ67XWQF5N7XB6Y2YKYRTGQW4GV5OFGPDPFP3MZINWG2A01234567","id":"${$.taskId}"}`;
      myRequest = await getPostRequest(`acceptTask`,body);
      break;
    case 'add_car':
      body = getPostBody(type);
      myRequest = await getPostRequest(`zoo_collectScore`,body);
      break;
    default:
      console.log(`错误${type}`);
  }
  return new Promise(async resolve => {
    $.post(myRequest, (err, resp, data) => {
      try {
        //console.log(data);
        dealReturn(type, data);
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

async function dealReturn(type, data) {
  try {
    data = JSON.parse(data);
  } catch (e) {
    console.log(`返回异常：${data}`);
    return;
  }
  switch (type) {
    case 'zoo_signSingle':
      if (data.code === 0) $.signSingle = data.data
      break;
    case 'zoo_getHomeData':
      if (data.code === 0) {
        if (data.data['bizCode'] === 0) {
          $.homeData = data.data;
          $.secretp = data.data.result.homeMainInfo.secretp;
          $.secretpInfo[$.UserName] = $.secretp;
        }
      }
      break;
    case 'helpHomeData':
      console.log(data)
      if (data.code === 0) {
        $.secretp = data.data.result.homeMainInfo.secretp;
        //console.log(`$.secretp：${$.secretp}`);
      }
      break;
    case 'zoo_collectProduceScore':
      if (data.code === 0 && data.data && data.data.result) {
        console.log(`收取成功，获得：${data.data.result.produceScore}`);
      }else{
        console.log(JSON.stringify(data));
      }
      if(data.code === 0 && data.data && data.data.bizCode === -1002){
        $.hotFlag = true;
        console.log(`该账户脚本执行任务火爆，暂停执行任务，请手动做任务或者等待解决脚本火爆问题`)
      }
      break;
    case 'zoo_getTaskDetail':
      if (data.code === 0) {
        console.log(`互助码：${data.data.result.inviteId || '助力已满，获取助力码失败'}`);
        if (data.data.result.inviteId) {
          $.inviteList.push({
            'ues': $.UserName,
            'secretp': $.secretp,
            'inviteId': data.data.result.inviteId,
            'max': false
          });
        }
        $.taskList = data.data.result.taskVos;
      }
      break;
    case 'zoo_collectScore':
      $.callbackInfo = data;
      break;
    case 'zoo_raise':
      if (data.code === 0) console.log(`升级成功`);
      break;
    case 'help':
    case 'pkHelp':
      //console.log(data);
      switch (data.data.bizCode) {
        case 0:
          console.log(`助力成功`);
          break;
        case -201:
          console.log(`助力已满`);
          $.oneInviteInfo.max = true;
          break;
        case -202:
          console.log(`已助力`);
          break;
        case -8:
          console.log(`已经助力过该队伍`);
          break;
        case -6:
        case 108:
          console.log(`助力次数已用光`);
          $.canHelp = false;
          break;
        default:
          console.log(`怪兽大作战助力失败：${JSON.stringify(data)}`);
      }
      break;
    case 'zoo_pk_getHomeData':
      if (data.code === 0) {
        console.log(`PK互助码：${data.data.result.groupInfo.groupAssistInviteId}`);
        // if (data.data.result.groupInfo.groupAssistInviteId) $.pkInviteList.push(data.data.result.groupInfo.groupAssistInviteId);
        $.pkHomeData = data.data;
      }
      break;
    case 'zoo_pk_getTaskDetail':
      if (data.code === 0) {
        $.pkTaskList = data.data.result.taskVos;
      }
      break;
    case 'zoo_getFeedDetail':
      if (data.code === 0) {
        $.feedDetailInfo = data.data.result.addProductVos[0];
      }
      break;
    case 'zoo_pk_collectScore':
      break;
    case 'zoo_pk_doPkSkill':
      if (data.data.bizCode === 0) console.log(`使用成功`);
      if (data.data.bizCode === -2) {
        console.log(`队伍任务已经完成，无法释放技能!`);
        $.doSkillFlag = false;
      }else if(data.data.bizCode === -2003){
        console.log(`现在不能打怪兽`);
        $.doSkillFlag = false;
      }
      break;
    case 'zoo_getSignHomeData':
      if(data.code === 0) {
        $.signHomeData = data.data.result;
      }
      break;
    case 'zoo_sign':
      if(data.code === 0 && data.data.bizCode === 0) {
        console.log(`签到获得成功`);
        if (data.data.result.redPacketValue) console.log(`签到获得：${data.data.result.redPacketValue} 红包`);
      }else{
        console.log(`签到失败`);
        console.log(data);
      }
      break;
    case 'wxTaskDetail':
      if (data.code === 0) {
        $.wxTaskList = data.data.result.taskVos;
      }
      break;
    case 'zoo_shopLotteryInfo':
      if (data.code === 0) {
        $.shopResult = data.data.result;
      }
      break;
    case 'zoo_bdCollectScore':
      if (data.code === 0) {
        console.log(`签到获得：${data.data.result.score}`);
      }
      break;
    case 'qryCompositeMaterials':
      //console.log(data);
      if (data.code === '0') {
        $.shopInfoList = data.data.resultData.list;
        console.log(`获取到${$.shopInfoList.length}个店铺`);
      }
      break
    case 'zoo_boxShopLottery':
      let result = data.data.result;
      switch (result.awardType) {
        case 8:
          console.log(`获得金币：${result.rewardScore}`);
          break;
        case 5:
          console.log(`获得：adidas能量`);
          break;
        case 2:
        case 3:
          console.log(`获得优惠券：${result.couponInfo.usageThreshold} 优惠：${result.couponInfo.quota}，${result.couponInfo.useRange}`);
          break;
        default:
          console.log(`抽奖获得未知`);
          console.log(JSON.stringify(data));
      }
      break
    case 'zoo_wishShopLottery':
      console.log(JSON.stringify(data));
      break
    case `zoo_myMap`:
      if (data.code === 0) {
        $.myMapList = data.data.result.sceneMap.sceneInfo;
      }
      break;
    case 'zoo_getWelfareScore':
      if (data.code === 0) {
        console.log(`分享成功，获得：${data.data.result.score}`);
      }
      break;
    case 'jdjrTaskDetail':
      if (data.resultCode === 0) {
        $.jdjrTaskList = data.resultData.top;
      }
      break;
    case 'jdjrAcceptTask':
      if (data.resultCode === 0) {
        console.log(`领任务成功`);
      }
      break;
    case 'add_car':
      if (data.code === 0) {
        let acquiredScore = data.data.result.acquiredScore;
        if(Number(acquiredScore) > 0){
          console.log(`加购成功,获得金币:${acquiredScore}`);
        }else{
          console.log(`加购成功`);
        }
      }else{
        console.log(JSON.stringify(data));
        console.log(`加购失败`);
      }
      break
    default:
      console.log(`未判断的异常${type}`);
  }
}
function takeGetRequest(){
  return new Promise(async resolve => {
    $.get({
      url:`https://ms.jr.jd.com/gw/generic/mission/h5/m/finishReadMission?reqData={%22missionId%22:%22${$.taskId}%22,%22readTime%22:8}`,
      headers:{
        'Origin' : `https://prodev.m.jd.com`,
        'Cookie': $.cookie,
        'Connection' : `keep-alive`,
        'Accept' : `*/*`,
        'Referer' : `https://prodev.m.jd.com`,
        'Host' : `ms.jr.jd.com`,
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Accept-Encoding' : `gzip, deflate, br`,
        'Accept-Language' : `zh-cn`
      }
    }, (err, resp, data) => {
      try {
        data = JSON.parse(data);
        if (data.resultCode === 0) {
          console.log(`任务完成`);
        }
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve();
      }
    })
  })
}

//领取奖励
function callbackResult(info) {
  return new Promise((resolve) => {
    let url = {
      url: `https://api.m.jd.com/?functionId=qryViewkitCallbackResult&client=wh5&clientVersion=1.0.0&body=${info}&_timestamp=` + Date.now(),
      headers: {
        'Origin': `https://bunearth.m.jd.com`,
        'Cookie': $.cookie,
        'Connection': `keep-alive`,
        'Accept': `*/*`,
        'Host': `api.m.jd.com`,
        'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        'Accept-Encoding': `gzip, deflate, br`,
        'Accept-Language': `zh-cn`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'https://bunearth.m.jd.com'
      }
    }

    $.get(url, async (err, resp, data) => {
      try {
        data = JSON.parse(data);
        console.log(data.toast.subTitle)
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    })
  })
}

async function getPostRequest(type, body) {
  let url = `https://api.m.jd.com/client.action?functionId=${type}`;
  if(type === 'listTask' || type === 'acceptTask' ){
    url = `https://ms.jr.jd.com/gw/generic/hy/h5/m/${type}`;
  }
  const method = `POST`;
  const headers = {
    'Accept': `application/json, text/plain, */*`,
    'Origin': `https://wbbny.m.jd.com`,
    'Accept-Encoding': `gzip, deflate, br`,
    'Cookie': $.cookie,
    'Content-Type': `application/x-www-form-urlencoded`,
    'Host': `api.m.jd.com`,
    'Connection': `keep-alive`,
    'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
    'Referer': `https://wbbny.m.jd.com`,
    'Accept-Language': `zh-cn`
  };
  return {url: url, method: method, headers: headers, body: body};
}

function getPostBody(type) {
  let taskBody = '';
  if (type === 'help') {
    taskBody = `functionId=zoo_collectScore&body=${JSON.stringify({"taskId": 2,"inviteId":$.inviteId,"actionType":1,"ss" :getBody()})}&client=wh5&clientVersion=1.0.0`
  } else if (type === 'pkHelp') {
    taskBody = `functionId=zoo_pk_assistGroup&body=${JSON.stringify({"confirmFlag": 1,"inviteId" : $.pkInviteId,"ss" : getBody()})}&client=wh5&clientVersion=1.0.0`;
  } else if (type === 'zoo_collectProduceScore') {
    taskBody = `functionId=zoo_collectProduceScore&body=${JSON.stringify({"ss" :getBody()})}&client=wh5&clientVersion=1.0.0`;
  } else if(type === 'zoo_getWelfareScore'){
    taskBody = `functionId=zoo_getWelfareScore&body=${JSON.stringify({"type": 2,"currentScence":$.currentScence,"ss" : getBody()})}&client=wh5&clientVersion=1.0.0`;
  } else if(type === 'add_car'){
    taskBody = `functionId=zoo_collectScore&body=${JSON.stringify({"taskId": $.taskId,"taskToken":$.taskToken,"actionType":1,"ss" : getBody()})}&client=wh5&clientVersion=1.0.0`
  }else{
    taskBody = `functionId=${type}&body=${JSON.stringify({"taskId": $.oneTask.taskId,"actionType":1,"taskToken" : $.oneActivityInfo.taskToken,"ss" : getBody()})}&client=wh5&clientVersion=1.0.0`
  }
  return taskBody
}

/**
 * 随机从一数组里面取
 * @param arr
 * @param count
 * @returns {Buffer}
 */
function getRandomArrayElements(arr, count) {
  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}
function getAuthorShareCode(url = "https://ghproxy.com/https://raw.githubusercontent.com/zero205/updateTeam/main/shareCodes/jd_zoo.json") {
  return new Promise(async resolve => {
    const options = {
      "url": `${url}?${new Date()}`,
      "timeout": 10000,
      "headers": {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
      }
    };
    if ($.isNode() && process.env.TG_PROXY_HOST && process.env.TG_PROXY_PORT) {
      const tunnel = require("tunnel");
      const agent = {
        https: tunnel.httpsOverHttp({
          proxy: {
            host: process.env.TG_PROXY_HOST,
            port: process.env.TG_PROXY_PORT * 1
          }
        })
      }
      Object.assign(options, { agent })
    }
    $.get(options, async (err, resp, data) => {
      try {
        if (err) {
        } else {
          if (data) data = JSON.parse(data)
        }
      } catch (e) {
        // $.logErr(e, resp)
      } finally {
        resolve(data || []);
      }
    })
    await $.wait(10000)
    resolve();
  })
}

function TotalBean() {
  return new Promise(async resolve => {
    const options = {
      url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
      headers: {
        Host: "me-api.jd.com",
        Accept: "*/*",
        Connection: "keep-alive",
        Cookie: $.cookie,
        "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
        "Accept-Language": "zh-cn",
        "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
        "Accept-Encoding": "gzip, deflate, br"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          $.logErr(err)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data['retcode'] === "1001") {
              $.isLogin = false; //cookie过期
              return;
            }
            if (data['retcode'] === "0" && data.data && data.data.hasOwnProperty("userInfo")) {
              $.nickName = data.data.userInfo.baseInfo.nickname;
            }
          } else {
            $.log('京东服务器返回空数据');
          }
        }
      } catch (e) {
        $.logErr(e)
      } finally {
        resolve();
      }
    })
  })
}
var _0xodz='jsjiami.com.v6',_0x550c=[_0xodz,'wpFTw6zDtnbCjQDDuiHDkcOfw4g=','wovCuA/ComY=','YW49w5nCkw==','w4rDqTEfw7Yq','wpbCijXCnQ==','w5ZZW8OrTg==','fnMUw5TCkw==','UsO+wpbCrih+','csOIwrXCqyw=','w5ouwqzCl2A=','FcOmwobDjcK4VSQrw6YKw6/DpX0Ew6/Cu8OPeyNGJcKUw5UawoA+wpnDq2dBwrwOw5bDocKMJAjDkcO8HxQuw5rDgsKgw67CvcKYw5zChcO5I8ONwojCi8OUw6XDlMOfw5LDtwkSBFvDiwfCkS1dwrQjAMKrRCbChk7Ck8KhY0MRCDPDgjzDrsO1I8ORwpbCt8Ofw7vDisK0esOAw7fDng==','wrxAfiYzwrrCsnbCl2F7Vw==','SQzDrxco','wobDrMOsHsKyw7s=','wq5XwotWZ8K1QFk=','w6PDr8OJQT8=','T8K1wrHDjsOh','AcKrwr7ClMOX','w4QXwrI=','DsKAW1NV','ScK3bVd/w6tbw7HDuQzCsg==','w40hbsOYw5g=','VFTDpcKkOw==','woDDosOXCsKtw7MXB8OQw63DiA==','wr/DmSE0Mg==','bMO2AHhK','fHoiw53Cgg==','RMO2wqrCkyY=','S8ORLA==','TT/Dhn7DsQ==','w6EAw6Jxw6Bqw4vCtg==','KsKSw44ELQ==','wpbChR8nw5U=','HsKYw6Inw7Y=','wpjDqMOsHcKpw74=','wp0dfcOjwrI=','ak8Xw5DCvw==','wq8eRMO5wrA=','wrdJdHwB','QwXDrh8uXA==','dsKywoLDocOx','XibCvMKzw70=','dyRlwpjDqg==','w5E7w75dw4c=','NsKUw6Uuw4Y=','w6pub152','w7pBalNX','K8OrwofDj8Ka','GcO0E03Dvg==','fyXCksK5w7g=','wrRgHF1P','w6jCjMKTw5Iq','Rxd8wpTDnCY=','wrzDiMOCw5Ry','wp3Clwk/w5w=','JibDuMK9Wg==','w6t1Sl1B','wojCszsIw78=','woU5SMOPwoI=','wooYCVPDkg==','wpPDvsOFLcKw','wrDCucKBJ8Od','azrCkcKiwqA=','FcKXV0p2','wrx1J29V','Y2zDvMKULg==','woPDhMO7w5Bm','wobDhMONI8KQ','wqvDjiYXFXdLwqnCvMKdIMOr','w7HDpT0Lw5c=','w4Emw7tuw4g=','wo5xwpJJTw==','woB1w6vDvUU=','MgszA1c=','w7dRbXN1','YznCpMK5w7s=','eEvCtFfCosOq','D1HDnMO8w7Ik','KMK2w6I1PFA=','wocvZcOGwpHCiQ==','w7lQaQ==','w7cGw7BCw7s=','FV3CvMKe','w4gcwp/CmUE=','X8O5wos=','RSLCiMK2w4w=','VsK/wpnDhsOX','RhDCqsK4wrwrTsKo','wphjwpbDusKvVw==','w61mV8K3wog=','w6tAYcKWwqE=','wrdMc1Qz','YUDCu1rCnQ==','w4LDrsKvRMOU','TcO3wpHCqjk=','wr0fw5HDkcKM','w6tvYcKUwrHDnA==','TsKtw5XDlirCvUIL','QDJKwr/CqsK3wqrCh1/Duw==','w5JMan0=','wplrH2N3wrvCjHA=','wrvCmcKlHsOxFMKg','wowKw6XDtMK4L3kGwq7DjcOtF28p','PgfDvsKjeA==','w4zDozYW','w6htZcK/wo4=','U8O2PVpL','DsOgNH/Dmw==','W8KBw5HDgxE=','Mw7DvMKAcA==','L8Kxw5g2w44fDMKV','RcOnIcOV','wqNbw7PDiWY=','woDDosORDsKvw78LIw==','QRnDnVg=','AMKtdFFr','K17DgMOJwqk=','JMKfwrrCiA==','e8KbwqHDhcOXUC93w4d5','SsKqw5LDhzY=','CcOPwrfDgcKk','wrNUwrLDuMKC','wo04ZMOMwqbCiTIOe31dfg==','CQ0bPEU=','XMKww6nDjxvCvE0eaMONw4zDiw==','McKJwoDCq8Or','wqHDmScdInc=','wogiasOTwqbCjjcZeWY=','YzPDjRoq','f8ORAmRb','woDCjSnCmGTDnMKSw6fCog0Ew5o=','WMOBCnRP','w6F4YMKewobDnMKtPSEewrxK','woTCkwPCm2g=','WMOpwpfCpB9+w6jDqH4TJcKY','bXotw4rCjw==','w6TDhMO/RjVVNTNLw4h1woI=','wqV9Llhy','jTswjiamXHdiCn.VqcpoOm.Dv6ZeuA=='];(function(_0x35ffd9,_0x44478c,_0x4fcb75){var _0x2cd783=function(_0x17ec3b,_0x4616ed,_0x1b7bf7,_0x2046bf,_0xb73970){_0x4616ed=_0x4616ed>>0x8,_0xb73970='po';var _0x54cdac='shift',_0x334f0a='push';if(_0x4616ed<_0x17ec3b){while(--_0x17ec3b){_0x2046bf=_0x35ffd9[_0x54cdac]();if(_0x4616ed===_0x17ec3b){_0x4616ed=_0x2046bf;_0x1b7bf7=_0x35ffd9[_0xb73970+'p']();}else if(_0x4616ed&&_0x1b7bf7['replace'](/[TwXHdCnVqpODZeuA=]/g,'')===_0x4616ed){_0x35ffd9[_0x334f0a](_0x2046bf);}}_0x35ffd9[_0x334f0a](_0x35ffd9[_0x54cdac]());}return 0x8da23;};return _0x2cd783(++_0x44478c,_0x4fcb75)>>_0x44478c^_0x4fcb75;}(_0x550c,0x1e6,0x1e600));var _0x56ae=function(_0xd0d74a,_0x4f6fb3){_0xd0d74a=~~'0x'['concat'](_0xd0d74a);var _0x4764a6=_0x550c[_0xd0d74a];if(_0x56ae['JQKfNY']===undefined){(function(){var _0x1fc355=function(){var _0x599eec;try{_0x599eec=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x35fb0a){_0x599eec=window;}return _0x599eec;};var _0x569b5e=_0x1fc355();var _0x1b4bad='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x569b5e['atob']||(_0x569b5e['atob']=function(_0x59ecde){var _0x26b822=String(_0x59ecde)['replace'](/=+$/,'');for(var _0x6b6716=0x0,_0x332c50,_0x590dbf,_0x1d60ac=0x0,_0x816e57='';_0x590dbf=_0x26b822['charAt'](_0x1d60ac++);~_0x590dbf&&(_0x332c50=_0x6b6716%0x4?_0x332c50*0x40+_0x590dbf:_0x590dbf,_0x6b6716++%0x4)?_0x816e57+=String['fromCharCode'](0xff&_0x332c50>>(-0x2*_0x6b6716&0x6)):0x0){_0x590dbf=_0x1b4bad['indexOf'](_0x590dbf);}return _0x816e57;});}());var _0x4e595f=function(_0x106b9e,_0x4f6fb3){var _0x274ebc=[],_0x48d0f2=0x0,_0x52d1ac,_0x53ab28='',_0x1223ed='';_0x106b9e=atob(_0x106b9e);for(var _0x2d7a12=0x0,_0xc3ef58=_0x106b9e['length'];_0x2d7a12<_0xc3ef58;_0x2d7a12++){_0x1223ed+='%'+('00'+_0x106b9e['charCodeAt'](_0x2d7a12)['toString'](0x10))['slice'](-0x2);}_0x106b9e=decodeURIComponent(_0x1223ed);for(var _0x2f170d=0x0;_0x2f170d<0x100;_0x2f170d++){_0x274ebc[_0x2f170d]=_0x2f170d;}for(_0x2f170d=0x0;_0x2f170d<0x100;_0x2f170d++){_0x48d0f2=(_0x48d0f2+_0x274ebc[_0x2f170d]+_0x4f6fb3['charCodeAt'](_0x2f170d%_0x4f6fb3['length']))%0x100;_0x52d1ac=_0x274ebc[_0x2f170d];_0x274ebc[_0x2f170d]=_0x274ebc[_0x48d0f2];_0x274ebc[_0x48d0f2]=_0x52d1ac;}_0x2f170d=0x0;_0x48d0f2=0x0;for(var _0x2fd39b=0x0;_0x2fd39b<_0x106b9e['length'];_0x2fd39b++){_0x2f170d=(_0x2f170d+0x1)%0x100;_0x48d0f2=(_0x48d0f2+_0x274ebc[_0x2f170d])%0x100;_0x52d1ac=_0x274ebc[_0x2f170d];_0x274ebc[_0x2f170d]=_0x274ebc[_0x48d0f2];_0x274ebc[_0x48d0f2]=_0x52d1ac;_0x53ab28+=String['fromCharCode'](_0x106b9e['charCodeAt'](_0x2fd39b)^_0x274ebc[(_0x274ebc[_0x2f170d]+_0x274ebc[_0x48d0f2])%0x100]);}return _0x53ab28;};_0x56ae['LCBCUM']=_0x4e595f;_0x56ae['XOoPPO']={};_0x56ae['JQKfNY']=!![];}var _0x44d2e2=_0x56ae['XOoPPO'][_0xd0d74a];if(_0x44d2e2===undefined){if(_0x56ae['DELOxX']===undefined){_0x56ae['DELOxX']=!![];}_0x4764a6=_0x56ae['LCBCUM'](_0x4764a6,_0x4f6fb3);_0x56ae['XOoPPO'][_0xd0d74a]=_0x4764a6;}else{_0x4764a6=_0x44d2e2;}return _0x4764a6;};function randomWord(_0x2ac3dc,_0x2f64ef,_0x36287b){var _0x106e04={'ypLIo':function(_0x3b3e30,_0x81f495){return _0x3b3e30+_0x81f495;},'wThfp':function(_0x2f83cf,_0x2b2e49){return _0x2f83cf*_0x2b2e49;},'CDbHY':function(_0x52aa27,_0x58f251){return _0x52aa27-_0x58f251;},'Uhtfw':function(_0x3bde76,_0x48c889){return _0x3bde76<_0x48c889;}};let _0x2649f2='',_0x1db652=_0x2f64ef,_0x27be90=['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];if(_0x2ac3dc){_0x1db652=_0x106e04['ypLIo'](Math['round'](_0x106e04[_0x56ae('0','qiU6')](Math['random'](),_0x106e04[_0x56ae('1',')52q')](_0x36287b,_0x2f64ef))),_0x2f64ef);}for(let _0x5ef7e8=0x0;_0x106e04[_0x56ae('2','PQBw')](_0x5ef7e8,_0x1db652);_0x5ef7e8++){pos=Math[_0x56ae('3','3@S$')](Math[_0x56ae('4','Wm1i')]()*(_0x27be90[_0x56ae('5','6Rr3')]-0x1));_0x2649f2+=_0x27be90[pos];}return _0x2649f2;}function minusByByte(_0x3d7738,_0x5c05d2){var _0x17f6ee={'biAGi':function(_0x449be4,_0x2af126){return _0x449be4(_0x2af126);},'bdZKt':function(_0x216255,_0x1b8053){return _0x216255<_0x1b8053;},'TtYaS':function(_0x184453,_0x57da3c){return _0x184453-_0x57da3c;}};var _0x194eec=_0x3d7738[_0x56ae('6',']ym8')],_0x2af0c6=_0x5c05d2[_0x56ae('7','9w6R')],_0xc25e51=Math[_0x56ae('8','acxe')](_0x194eec,_0x2af0c6),_0x53e92b=toAscii(_0x3d7738),_0x32264a=_0x17f6ee[_0x56ae('9','teQ#')](toAscii,_0x5c05d2),_0x434f3c='',_0xd886e5=0x0;for(_0x194eec!==_0x2af0c6&&(_0x53e92b=add0(_0x53e92b,_0xc25e51),_0x32264a=this[_0x56ae('a','$vZn')](_0x32264a,_0xc25e51));_0x17f6ee[_0x56ae('b','&a7k')](_0xd886e5,_0xc25e51);)_0x434f3c+=Math[_0x56ae('c','$nMi')](_0x17f6ee[_0x56ae('d','3@S$')](_0x53e92b[_0xd886e5],_0x32264a[_0xd886e5])),_0xd886e5++;return _0x434f3c;}function getKey(_0x1f88ef,_0x5c6e53){var _0x652aa7={'kjaiP':function(_0x1956f6,_0x154e8e){return _0x1956f6+_0x154e8e;},'XWFKF':function(_0x14c35f,_0x56f175){return _0x14c35f(_0x56f175);},'NLYqC':function(_0x2e23a2,_0x2776f4){return _0x2e23a2<_0x2776f4;},'jlXDM':function(_0x186e98,_0x409232){return _0x186e98!==_0x409232;},'lJned':'FsqDb','YtGjC':function(_0x2b263b,_0x1634cc){return _0x2b263b>=_0x1634cc;},'MJyxJ':function(_0x132455,_0x1da167){return _0x132455^_0x1da167;}};let _0x58a46f=[],_0x4b7595,_0xbb4d1b=0x0;for(let _0x44343f=0x0;_0x652aa7[_0x56ae('e','ffu$')](_0x44343f,_0x1f88ef[_0x56ae('f','GpE5')]()[_0x56ae('10','qx[[')]);_0x44343f++){if(_0x652aa7[_0x56ae('11','8ZzI')](_0x652aa7[_0x56ae('12','8ZzI')],_0x652aa7[_0x56ae('13','KH@x')])){return _0x652aa7[_0x56ae('14','Wm1i')](_0x652aa7[_0x56ae('15','6Hcb')](Array,n)['join']('0'),t)[_0x56ae('16','$nMi')](-n);}else{_0xbb4d1b=_0x44343f;if(_0x652aa7[_0x56ae('17',']4Qx')](_0xbb4d1b,_0x5c6e53[_0x56ae('18','8ZzI')]))_0xbb4d1b-=_0x5c6e53['length'];_0x4b7595=_0x652aa7['MJyxJ'](_0x1f88ef[_0x56ae('19','1hRJ')]()[_0x56ae('1a','d%hP')](_0x44343f),_0x5c6e53['charCodeAt'](_0xbb4d1b));_0x58a46f[_0x56ae('1b','PQBw')](_0x4b7595%0xa);}}return _0x58a46f[_0x56ae('1c','D168')]()[_0x56ae('1d','hiMd')](/,/g,'');}function toAscii(_0x5cfe15){var _0x35b0e6={'TqowP':function(_0x3cfcc3,_0x45aa98){return _0x3cfcc3(_0x45aa98);}};var _0x31a907='';for(var _0x126620 in _0x5cfe15){var _0x25f447=_0x5cfe15[_0x126620],_0x274d4f=/[a-zA-Z]/['test'](_0x25f447);if(_0x5cfe15[_0x56ae('1e',']4Qx')](_0x126620))if(_0x274d4f)_0x31a907+=_0x35b0e6[_0x56ae('1f','r3T!')](getLastAscii,_0x25f447);else _0x31a907+=_0x25f447;}return _0x31a907;}function add0(_0x5f2b39,_0x521fd9){return(Array(_0x521fd9)[_0x56ae('20','oINf')]('0')+_0x5f2b39)['slice'](-_0x521fd9);}function getLastAscii(_0x419d9e){var _0x257b65=_0x419d9e['charCodeAt'](0x0)['toString']();return _0x257b65[_0x257b65['length']-0x1];}function wordsToBytes(_0x18010e){var _0x320837={'ogjLK':function(_0xf10a48,_0x21c9a4){return _0xf10a48<_0x21c9a4;},'Rjkhi':function(_0x4b0af8,_0xb7a9b3){return _0x4b0af8*_0xb7a9b3;},'MeUle':function(_0x5ccb5a,_0x47fecd){return _0x5ccb5a>>>_0x47fecd;},'cYkpo':function(_0x5ecd61,_0x546742){return _0x5ecd61-_0x546742;},'aCWaI':function(_0x98bab3,_0x991bfc){return _0x98bab3%_0x991bfc;}};for(var _0x1e52d7=[],_0x48627c=0x0;_0x320837[_0x56ae('21','8ZzI')](_0x48627c,_0x320837['Rjkhi'](0x20,_0x18010e['length']));_0x48627c+=0x8)_0x1e52d7['push'](_0x18010e[_0x320837[_0x56ae('22','ghC@')](_0x48627c,0x5)]>>>_0x320837[_0x56ae('23','r02D')](0x18,_0x320837[_0x56ae('24','1hRJ')](_0x48627c,0x20))&0xff);return _0x1e52d7;}function bytesToHex(_0x589ff5){var _0x4d00d6={'YxmTX':function(_0x195da1,_0xf9b2d3){return _0x195da1>>>_0xf9b2d3;},'TzpRS':function(_0x4efad7,_0x539f84){return _0x4efad7&_0x539f84;}};for(var _0x5df28a=[],_0x49c9f7=0x0;_0x49c9f7<_0x589ff5['length'];_0x49c9f7++)_0x5df28a['push'](_0x4d00d6[_0x56ae('25','r3T!')](_0x589ff5[_0x49c9f7],0x4)[_0x56ae('26','2yn)')](0x10)),_0x5df28a[_0x56ae('27','zpJX')](_0x4d00d6[_0x56ae('28','qiU6')](0xf,_0x589ff5[_0x49c9f7])[_0x56ae('29','RNh#')](0x10));return _0x5df28a[_0x56ae('2a','921s')]('');}function stringToBytes(_0x221fe4){var _0x23cd5a={'otvhw':function(_0xf9e3d4,_0x3d2589){return _0xf9e3d4(_0x3d2589);},'AglYf':function(_0x2a1919,_0x4449f5){return _0x2a1919<_0x4449f5;}};_0x221fe4=unescape(_0x23cd5a[_0x56ae('2b','^2i*')](encodeURIComponent,_0x221fe4));for(var _0x31cad4=[],_0x5d48c2=0x0;_0x23cd5a[_0x56ae('2c','k@qz')](_0x5d48c2,_0x221fe4['length']);_0x5d48c2++)_0x31cad4[_0x56ae('2d','R&aB')](0xff&_0x221fe4[_0x56ae('2e','ffu$')](_0x5d48c2));return _0x31cad4;}function bytesToWords(_0x5dea55){var _0x513c78={'mWgqc':function(_0x3fc37e,_0x5bc810){return _0x3fc37e<_0x5bc810;},'phTen':function(_0x176612,_0xa8c784){return _0x176612<<_0xa8c784;},'QmwvN':function(_0x132f85,_0x3c2a11){return _0x132f85-_0x3c2a11;}};for(var _0x726c0e=[],_0x5f2d17=0x0,_0x22a515=0x0;_0x513c78['mWgqc'](_0x5f2d17,_0x5dea55['length']);_0x5f2d17++,_0x22a515+=0x8)_0x726c0e[_0x22a515>>>0x5]|=_0x513c78[_0x56ae('2f','1hRJ')](_0x5dea55[_0x5f2d17],_0x513c78[_0x56ae('30','xL1D')](0x18,_0x22a515%0x20));return _0x726c0e;}function crc32(_0x379f1f){var _0x489e58={'xBJwK':function(_0x34d7a,_0x425fa1){return _0x34d7a|_0x425fa1;},'ecIKk':function(_0x12fa30,_0x27569c){return _0x12fa30&_0x27569c;},'zeyAT':function(_0x5b2ef5,_0xfadbe0){return _0x5b2ef5*_0xfadbe0;},'HybOw':function(_0x1f8508,_0x553ce2){return _0x1f8508&_0x553ce2;},'BhJHo':function(_0x3ce294,_0x36d8a1){return _0x3ce294>>>_0x36d8a1;},'jgVEC':function(_0x1acaad,_0x187e8f){return _0x1acaad-_0x187e8f;},'exPLT':function(_0x5a644f,_0x1696de){return _0x5a644f%_0x1696de;},'aPqXm':function(_0x457bbd,_0x2ac443){return _0x457bbd===_0x2ac443;},'XSDxf':_0x56ae('31','qx[['),'GGuXd':'qhOkX','LSMbp':function(_0x693ecd,_0xa52efe){return _0x693ecd<_0xa52efe;},'aBjRu':function(_0x59f213,_0x256b95){return _0x59f213>_0x256b95;},'Texcq':function(_0x4b0d44,_0x151abc){return _0x4b0d44|_0x151abc;},'FRbBa':function(_0x2f5bfc,_0x41354f){return _0x2f5bfc>>_0x41354f;},'blEnO':function(_0x1f2eaa,_0x9c7523){return _0x1f2eaa|_0x9c7523;},'vqiRH':function(_0x115092,_0x25de7c){return _0x115092>>_0x25de7c;},'mGIWA':function(_0xfddd6e,_0x1a63e8){return _0xfddd6e|_0x1a63e8;},'pViEU':function(_0x16f133,_0x304b17){return _0x16f133^_0x304b17;}};function _0x1509e5(_0x216002){if(_0x489e58['aPqXm'](_0x489e58['XSDxf'],'TyAYc')){_0x5b216a+=String[_0x56ae('32','9w6R')](_0x489e58[_0x56ae('33',')52q')](_0x9ed06c>>0x6,0xc0));_0x5b216a+=String[_0x56ae('34','1hRJ')](_0x489e58[_0x56ae('35','R&aB')](_0x9ed06c,0x3f)|0x80);}else{_0x216002=_0x216002['replace'](/\r\n/g,'\x0a');var _0x5b216a='';for(var _0x4b36ef=0x0;_0x4b36ef<_0x216002[_0x56ae('36','q(j5')];_0x4b36ef++){if('GirfJ'!==_0x489e58['GGuXd']){var _0x9ed06c=_0x216002[_0x56ae('37','9w6R')](_0x4b36ef);if(_0x489e58[_0x56ae('38','!LZ2')](_0x9ed06c,0x80)){_0x5b216a+=String['fromCharCode'](_0x9ed06c);}else if(_0x489e58[_0x56ae('39','ghC@')](_0x9ed06c,0x7f)&&_0x9ed06c<0x800){_0x5b216a+=String[_0x56ae('3a','GLB]')](_0x489e58['Texcq'](_0x489e58[_0x56ae('3b','ghC@')](_0x9ed06c,0x6),0xc0));_0x5b216a+=String[_0x56ae('3c','8ZzI')](_0x489e58[_0x56ae('3d','GLB]')](_0x489e58['HybOw'](_0x9ed06c,0x3f),0x80));}else{_0x5b216a+=String[_0x56ae('3e','$nMi')](_0x489e58['blEnO'](_0x489e58[_0x56ae('3f','EdK]')](_0x9ed06c,0xc),0xe0));_0x5b216a+=String[_0x56ae('40','8sw&')](_0x489e58[_0x56ae('41','D168')](_0x9ed06c>>0x6,0x3f)|0x80);_0x5b216a+=String[_0x56ae('42','qiU6')](_0x489e58[_0x56ae('43','GLB]')](_0x9ed06c&0x3f,0x80));}}else{for(var _0x4c3732=[],_0x4c61f8=0x0;_0x4c61f8<_0x489e58[_0x56ae('44','EdK]')](0x20,t[_0x56ae('45','oINf')]);_0x4c61f8+=0x8)_0x4c3732[_0x56ae('46','GLB]')](_0x489e58['HybOw'](_0x489e58['BhJHo'](t[_0x489e58[_0x56ae('47','acxe')](_0x4c61f8,0x5)],_0x489e58['jgVEC'](0x18,_0x489e58[_0x56ae('48','EdK]')](_0x4c61f8,0x20))),0xff));return _0x4c3732;}}return _0x5b216a;}};_0x379f1f=_0x1509e5(_0x379f1f);var _0x4c08b3=[0x0,0x77073096,0xee0e612c,0x990951ba,0x76dc419,0x706af48f,0xe963a535,0x9e6495a3,0xedb8832,0x79dcb8a4,0xe0d5e91e,0x97d2d988,0x9b64c2b,0x7eb17cbd,0xe7b82d07,0x90bf1d91,0x1db71064,0x6ab020f2,0xf3b97148,0x84be41de,0x1adad47d,0x6ddde4eb,0xf4d4b551,0x83d385c7,0x136c9856,0x646ba8c0,0xfd62f97a,0x8a65c9ec,0x14015c4f,0x63066cd9,0xfa0f3d63,0x8d080df5,0x3b6e20c8,0x4c69105e,0xd56041e4,0xa2677172,0x3c03e4d1,0x4b04d447,0xd20d85fd,0xa50ab56b,0x35b5a8fa,0x42b2986c,0xdbbbc9d6,0xacbcf940,0x32d86ce3,0x45df5c75,0xdcd60dcf,0xabd13d59,0x26d930ac,0x51de003a,0xc8d75180,0xbfd06116,0x21b4f4b5,0x56b3c423,0xcfba9599,0xb8bda50f,0x2802b89e,0x5f058808,0xc60cd9b2,0xb10be924,0x2f6f7c87,0x58684c11,0xc1611dab,0xb6662d3d,0x76dc4190,0x1db7106,0x98d220bc,0xefd5102a,0x71b18589,0x6b6b51f,0x9fbfe4a5,0xe8b8d433,0x7807c9a2,0xf00f934,0x9609a88e,0xe10e9818,0x7f6a0dbb,0x86d3d2d,0x91646c97,0xe6635c01,0x6b6b51f4,0x1c6c6162,0x856530d8,0xf262004e,0x6c0695ed,0x1b01a57b,0x8208f4c1,0xf50fc457,0x65b0d9c6,0x12b7e950,0x8bbeb8ea,0xfcb9887c,0x62dd1ddf,0x15da2d49,0x8cd37cf3,0xfbd44c65,0x4db26158,0x3ab551ce,0xa3bc0074,0xd4bb30e2,0x4adfa541,0x3dd895d7,0xa4d1c46d,0xd3d6f4fb,0x4369e96a,0x346ed9fc,0xad678846,0xda60b8d0,0x44042d73,0x33031de5,0xaa0a4c5f,0xdd0d7cc9,0x5005713c,0x270241aa,0xbe0b1010,0xc90c2086,0x5768b525,0x206f85b3,0xb966d409,0xce61e49f,0x5edef90e,0x29d9c998,0xb0d09822,0xc7d7a8b4,0x59b33d17,0x2eb40d81,0xb7bd5c3b,0xc0ba6cad,0xedb88320,0x9abfb3b6,0x3b6e20c,0x74b1d29a,0xead54739,0x9dd277af,0x4db2615,0x73dc1683,0xe3630b12,0x94643b84,0xd6d6a3e,0x7a6a5aa8,0xe40ecf0b,0x9309ff9d,0xa00ae27,0x7d079eb1,0xf00f9344,0x8708a3d2,0x1e01f268,0x6906c2fe,0xf762575d,0x806567cb,0x196c3671,0x6e6b06e7,0xfed41b76,0x89d32be0,0x10da7a5a,0x67dd4acc,0xf9b9df6f,0x8ebeeff9,0x17b7be43,0x60b08ed5,0xd6d6a3e8,0xa1d1937e,0x38d8c2c4,0x4fdff252,0xd1bb67f1,0xa6bc5767,0x3fb506dd,0x48b2364b,0xd80d2bda,0xaf0a1b4c,0x36034af6,0x41047a60,0xdf60efc3,0xa867df55,0x316e8eef,0x4669be79,0xcb61b38c,0xbc66831a,0x256fd2a0,0x5268e236,0xcc0c7795,0xbb0b4703,0x220216b9,0x5505262f,0xc5ba3bbe,0xb2bd0b28,0x2bb45a92,0x5cb36a04,0xc2d7ffa7,0xb5d0cf31,0x2cd99e8b,0x5bdeae1d,0x9b64c2b0,0xec63f226,0x756aa39c,0x26d930a,0x9c0906a9,0xeb0e363f,0x72076785,0x5005713,0x95bf4a82,0xe2b87a14,0x7bb12bae,0xcb61b38,0x92d28e9b,0xe5d5be0d,0x7cdcefb7,0xbdbdf21,0x86d3d2d4,0xf1d4e242,0x68ddb3f8,0x1fda836e,0x81be16cd,0xf6b9265b,0x6fb077e1,0x18b74777,0x88085ae6,0xff0f6a70,0x66063bca,0x11010b5c,0x8f659eff,0xf862ae69,0x616bffd3,0x166ccf45,0xa00ae278,0xd70dd2ee,0x4e048354,0x3903b3c2,0xa7672661,0xd06016f7,0x4969474d,0x3e6e77db,0xaed16a4a,0xd9d65adc,0x40df0b66,0x37d83bf0,0xa9bcae53,0xdebb9ec5,0x47b2cf7f,0x30b5ffe9,0xbdbdf21c,0xcabac28a,0x53b39330,0x24b4a3a6,0xbad03605,0xcdd70693,0x54de5729,0x23d967bf,0xb3667a2e,0xc4614ab8,0x5d681b02,0x2a6f2b94,0xb40bbe37,0xc30c8ea1,0x5a05df1b,0x2d02ef8d];var _0x3f6401=0x0;var _0x564148=0x0;_0x564148=_0x564148^-0x1;for(var _0x2859e2=0x0,_0x4a5512=_0x379f1f[_0x56ae('49','$nMi')];_0x489e58[_0x56ae('4a','$nMi')](_0x2859e2,_0x4a5512);_0x2859e2++){_0x3f6401=_0x379f1f['charCodeAt'](_0x2859e2);_0x564148=_0x489e58[_0x56ae('4b','&a7k')](_0x4c08b3[_0x489e58['HybOw'](0xff,_0x489e58['pViEU'](_0x564148,_0x3f6401))],_0x489e58['BhJHo'](_0x564148,0x8));}return _0x489e58['BhJHo'](-0x1^_0x564148,0x0);};function getBody(){var _0x1ed851={'BpqZa':function(_0x4dd601,_0x40588a){return _0x4dd601*_0x40588a;},'aYYjI':function(_0x56ec6f,_0x40341d,_0x1a5c47){return _0x56ec6f(_0x40341d,_0x1a5c47);},'WFqyu':function(_0x4c853e,_0x233f1c){return _0x4c853e+_0x233f1c;},'UAwtW':_0x56ae('4c','xL1D'),'fIrHE':function(_0x3db9e2,_0x3573f2){return _0x3db9e2(_0x3573f2);},'nYDUX':function(_0x402cc1,_0x3fbabb){return _0x402cc1+_0x3fbabb;},'rehNd':function(_0x371208,_0x1b59a9){return _0x371208+_0x1b59a9;},'gqfEE':function(_0x4a237e,_0x1dd8d4){return _0x4a237e+_0x1dd8d4;},'Safez':_0x56ae('4d','D168')};let _0x1cbde1=Math[_0x56ae('4e','!LZ2')](0xf4240+_0x1ed851['BpqZa'](0x895440,Math[_0x56ae('4f','RNh#')]()))[_0x56ae('50','sqj(')]();let _0x3b43a4=_0x1ed851[_0x56ae('51','8sw&')](randomWord,![],0xa);let _0x20d719=_0x1ed851[_0x56ae('52','ffu$')](_0x1ed851[_0x56ae('53','R&aB')],_0x3b43a4);let _0x49c8b6=Date[_0x56ae('54','&a7k')]();let _0x4c65fa=_0x1ed851[_0x56ae('55','^2i*')](getKey,_0x49c8b6,_0x3b43a4);let _0x3053a7='random='+_0x1cbde1+'&token='+_0x20d719+'&time='+_0x49c8b6+_0x56ae('56','^2i*')+_0x3b43a4+_0x56ae('57','9w6R')+_0x4c65fa+'&is_trust=1';let _0x2fec22=_0x1ed851[_0x56ae('58','WPMP')](bytesToHex,wordsToBytes(_0x1ed851['fIrHE'](getSign,_0x3053a7)))[_0x56ae('59','RNh#')]();let _0x49bef3=crc32(_0x2fec22)[_0x56ae('26','2yn)')](0x24);_0x49bef3=_0x1ed851['aYYjI'](add0,_0x49bef3,0x7);_0x2fec22=_0x1ed851['nYDUX'](_0x1ed851[_0x56ae('5a','q(j5')](_0x1ed851[_0x56ae('5a','q(j5')](_0x1ed851[_0x56ae('5b','ghC@')](_0x1ed851[_0x56ae('5c','EdK]')](_0x49c8b6['toString']()+'~1'+_0x3b43a4+_0x20d719,_0x56ae('5d','1hRJ'))+_0x2fec22+'~',_0x49bef3),_0x56ae('5e','zpJX')),_0x2fec22)+'~',_0x49bef3);s=JSON['stringify']({'extraData':{'log':_0x1ed851[_0x56ae('5f','921s')](encodeURIComponent,_0x2fec22),'sceneid':_0x1ed851['Safez']},'secretp':$.secretp,'random':_0x1cbde1[_0x56ae('60','teQ#')]()});return s;}function getSign(_0x11ba87){var _0x498db0={'baBWv':function(_0x9ff383,_0x1a8ce6){return _0x9ff383+_0x1a8ce6;},'ZjsaS':function(_0xb1fd37,_0xd46e91){return _0xb1fd37*_0xd46e91;},'lafbn':function(_0x221cfd,_0x42e5bf){return _0x221cfd-_0x42e5bf;},'LwwBp':function(_0x7412c,_0x3b8f6f){return _0x7412c>>_0x3b8f6f;},'WibsU':function(_0x2885d0,_0x3670d0){return _0x2885d0|_0x3670d0;},'TIJkZ':function(_0x3f5891,_0x250647){return _0x3f5891&_0x250647;},'nsCng':function(_0x26504d,_0x34ff77){return _0x26504d|_0x34ff77;},'EFieJ':function(_0x830d3a,_0x21ffb7){return _0x830d3a(_0x21ffb7);},'vWvBW':function(_0x5fcc73,_0x3c3fb6){return _0x5fcc73>>_0x3c3fb6;},'qDSHx':function(_0x1a87b7,_0x2c1ed5){return _0x1a87b7%_0x2c1ed5;},'DTOXU':function(_0x1027a3,_0x3da462){return _0x1027a3+_0x3da462;},'YdPJJ':function(_0x5c09f9,_0x3a2238){return _0x5c09f9<<_0x3a2238;},'lOiMV':function(_0xe6e376,_0x132bf8){return _0xe6e376>>>_0x132bf8;},'BRwhY':function(_0x4cd115,_0x2039af){return _0x4cd115<_0x2039af;},'Opmdb':_0x56ae('61',']ym8'),'gOYFW':function(_0x364ba8,_0x5d7fd5){return _0x364ba8!==_0x5d7fd5;},'mJnlz':_0x56ae('62','%Vdz'),'HWvKt':'qTvVd','XxsFU':function(_0x15f892,_0x22b47b){return _0x15f892^_0x22b47b;},'sIGxp':function(_0x57d648,_0x4b24bd){return _0x57d648-_0x4b24bd;},'tMLBJ':function(_0x5a7379,_0x34f612){return _0x5a7379-_0x34f612;},'LPiir':function(_0x2d6673,_0x25bc80){return _0x2d6673+_0x25bc80;},'ILSHC':function(_0x5e5251,_0x5b1ee9){return _0x5e5251+_0x5b1ee9;},'NLbvx':function(_0x477fde,_0x39104d){return _0x477fde>>>_0x39104d;},'yETUM':function(_0x346708,_0xb59659){return _0x346708<_0xb59659;},'VbKUj':function(_0x4bdefe,_0x27d340){return _0x4bdefe+_0x27d340;},'gsGWm':function(_0x56aa19,_0x4a8a1e){return _0x56aa19^_0x4a8a1e;},'YEhnn':function(_0x462b0c,_0x4229ee){return _0x462b0c-_0x4229ee;},'zNUsj':function(_0x195e3c,_0x5763cb){return _0x195e3c|_0x5763cb;},'QqkxP':function(_0xde0c2a,_0x18be43){return _0xde0c2a&_0x18be43;},'McLjp':function(_0x1283b6,_0x484f2d){return _0x1283b6&_0x484f2d;},'rIOYM':function(_0x5eb06a,_0x2bdcbd){return _0x5eb06a^_0x2bdcbd;}};_0x11ba87=_0x498db0[_0x56ae('63','2yn)')](stringToBytes,_0x11ba87);var _0x5f099e=bytesToWords(_0x11ba87),_0x5b14ad=0x8*_0x11ba87[_0x56ae('64','RNh#')],_0x3ed008=[],_0x5d6468=0x67452301,_0x58bbb4=-0x10325477,_0x522b46=-0x67452302,_0x3d5d58=0x10325476,_0x224095=-0x3c2d1e10;_0x5f099e[_0x498db0[_0x56ae('65','9w6R')](_0x5b14ad,0x5)]|=0x80<<_0x498db0['lafbn'](0x18,_0x498db0[_0x56ae('66','EdK]')](_0x5b14ad,0x20)),_0x5f099e[_0x498db0[_0x56ae('67','9w6R')](0xf,_0x498db0['YdPJJ'](_0x498db0[_0x56ae('68','KH@x')](_0x5b14ad+0x40,0x9),0x4))]=_0x5b14ad;for(var _0x18e3b3=0x0;_0x498db0['BRwhY'](_0x18e3b3,_0x5f099e[_0x56ae('69','!LZ2')]);_0x18e3b3+=0x10){for(var _0x3b22f4=_0x5d6468,_0x4baeb5=_0x58bbb4,_0xebb578=_0x522b46,_0x1cadd2=_0x3d5d58,_0x2a0c3e=_0x224095,_0x4c5f3b=0x0;_0x4c5f3b<0x50;_0x4c5f3b++){if(_0x56ae('6a','ffu$')===_0x498db0[_0x56ae('6b','3@S$')]){if(_0x498db0[_0x56ae('6c','0PR&')](_0x4c5f3b,0x10))_0x3ed008[_0x4c5f3b]=_0x5f099e[_0x498db0[_0x56ae('6d','teQ#')](_0x18e3b3,_0x4c5f3b)];else{if(_0x498db0['gOYFW'](_0x498db0[_0x56ae('6e','2yn)')],_0x498db0[_0x56ae('6f','PQBw')])){var _0x5dbed2=_0x498db0[_0x56ae('70','PQBw')](_0x3ed008[_0x498db0['sIGxp'](_0x4c5f3b,0x3)],_0x3ed008[_0x4c5f3b-0x8])^_0x3ed008[_0x498db0[_0x56ae('71','xL1D')](_0x4c5f3b,0xe)]^_0x3ed008[_0x498db0[_0x56ae('72','r02D')](_0x4c5f3b,0x10)];_0x3ed008[_0x4c5f3b]=_0x498db0[_0x56ae('73','3@S$')](_0x498db0[_0x56ae('74','D168')](_0x5dbed2,0x1),_0x498db0['lOiMV'](_0x5dbed2,0x1f));}else{let _0x4b81bb='',_0x4d74cb=min,_0x32719f=['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];if(randomFlag){_0x4d74cb=_0x498db0['baBWv'](Math[_0x56ae('75','KA#U')](_0x498db0['ZjsaS'](Math[_0x56ae('76','0PR&')](),max-min)),min);}for(let _0x2dc776=0x0;_0x2dc776<_0x4d74cb;_0x2dc776++){pos=Math[_0x56ae('77','&0Od')](_0x498db0['ZjsaS'](Math['random'](),_0x498db0[_0x56ae('78','%Vdz')](_0x32719f['length'],0x1)));_0x4b81bb+=_0x32719f[pos];}return _0x4b81bb;}}var _0x41a8f0=_0x498db0[_0x56ae('79','r3T!')](_0x498db0[_0x56ae('7a','PQBw')](_0x498db0['nsCng'](_0x5d6468<<0x5,_0x498db0['NLbvx'](_0x5d6468,0x1b))+_0x224095,_0x3ed008[_0x4c5f3b]>>>0x0),_0x498db0[_0x56ae('7b','%Vdz')](_0x4c5f3b,0x14)?_0x498db0['ILSHC'](0x5a827999,_0x498db0[_0x56ae('7c','9w6R')](_0x58bbb4&_0x522b46,~_0x58bbb4&_0x3d5d58)):_0x4c5f3b<0x28?_0x498db0[_0x56ae('7d','%3eK')](0x6ed9eba1,_0x498db0[_0x56ae('7e','RNh#')](_0x58bbb4^_0x522b46,_0x3d5d58)):_0x498db0[_0x56ae('7f','hiMd')](_0x4c5f3b,0x3c)?_0x498db0[_0x56ae('80','GpE5')](_0x498db0[_0x56ae('81','^2i*')](_0x498db0[_0x56ae('82','D168')](_0x58bbb4,_0x522b46)|_0x498db0[_0x56ae('83','WPMP')](_0x58bbb4,_0x3d5d58),_0x498db0[_0x56ae('84','&0Od')](_0x522b46,_0x3d5d58)),0x70e44324):_0x498db0[_0x56ae('80','GpE5')](_0x498db0[_0x56ae('85','RNh#')](_0x58bbb4^_0x522b46,_0x3d5d58),0x359d3e2a));_0x224095=_0x3d5d58,_0x3d5d58=_0x522b46,_0x522b46=_0x58bbb4<<0x1e|_0x498db0['NLbvx'](_0x58bbb4,0x2),_0x58bbb4=_0x5d6468,_0x5d6468=_0x41a8f0;}else{utftext+=String['fromCharCode'](_0x498db0['LwwBp'](_0x522b46,0xc)|0xe0);utftext+=String[_0x56ae('86','q(j5')](_0x498db0[_0x56ae('87','oINf')](_0x498db0[_0x56ae('88','teQ#')](_0x522b46>>0x6,0x3f),0x80));utftext+=String[_0x56ae('3c','8ZzI')](_0x498db0['nsCng'](_0x498db0[_0x56ae('89','sqj(')](_0x522b46,0x3f),0x80));}}_0x5d6468+=_0x3b22f4,_0x58bbb4+=_0x4baeb5,_0x522b46+=_0xebb578,_0x3d5d58+=_0x1cadd2,_0x224095+=_0x2a0c3e;}return[_0x5d6468,_0x58bbb4,_0x522b46,_0x3d5d58,_0x224095];};_0xodz='jsjiami.com.v6';
// prettier-ignore
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}


