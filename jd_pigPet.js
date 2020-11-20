/*
 * @Author: lxk0301 https://github.com/lxk0301 
 * @Date: 2020-11-10 14:07:07 
 * @Last Modified by: lxk0301
 * @Last Modified time: 2020-11-20 14:10:19
 */
/*
京东金融养猪猪
一键开完所有的宝箱功能。耗时70秒
大转盘抽奖
喂食
每日签到
完成分享任务得猪粮
12 * * * *
 */

const $ = new Env('金融养猪');
let cookiesArr = [], cookie = '';
const JD_API_HOST = 'https://ms.jr.jd.com/gw/generic/uc/h5/m';
const MISSION_BASE_API = `https://ms.jr.jd.com/gw/generic/mission/h5/m`;
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
  cookiesArr.push(...[$.getdata('CookieJD'), $.getdata('CookieJD2')])
}
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
      await TotalBean();
      console.log(`\n开始【京东账号${$.index}】${$.nickName || $.UserName}\n`);
      if (!$.isLogin) {
        $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/`, {"open-url": "https://bean.m.jd.com/"});
        if ($.isNode()) {
          await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
        } else {
          $.setdata('', `CookieJD${i ? i + 1 : "" }`);//cookie失效，故清空cookie。$.setdata('', `CookieJD${i ? i + 1 : "" }`);//cookie失效，故清空cookie。
        }
        continue
      }
      await jdPigPet();
    }
  }
})()
    .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
      $.done();
    })
async function jdPigPet() {
  await pigPetLogin();
  if (!$.hasPig) return
  await pigPetSignIndex();
  await pigPetSign();
  await pigPetOpenBox();
  await pigPetLotteryIndex();
  await pigPetLottery();
  await pigPetMissionList();
  await missions();
  await pigPetUserBag();
}
async function pigPetLottery() {
  if ($.currentCount > 0) {
    for (let i = 0; i < $.currentCount; i ++) {
      await pigPetLotteryPlay();
    }
  }
}
async function pigPetSign() {
  if (!$.sign) {
    await pigPetSignOne();
  } else {
    console.log(`第${$.no}天已签到\n`)
  }
}
function pigPetSignOne() {
  return new Promise(async resolve => {
    const body = {
      "source":2,
      "channelLV":"juheye",
      "riskDeviceParam": "{}",
      "no": $.no
    }
    $.post(taskUrl('pigPetSignOne', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log('签到结果',data)
            // data = JSON.parse(data);
            // if (data.resultCode === 0) {
            //   if (data.resultData.resultCode === 0) {
            //     if (data.resultData.resultData) {
            //       console.log(`当前大转盘剩余免费抽奖次数：：${data.resultData.resultData.currentCount}`);
            //       $.sign = data.resultData.resultData.sign;
            //       $.no = data.resultData.resultData.today;
            //     }
            //   } else {
            //     console.log(`查询签到情况异常：${JSON.stringify(data)}`)
            //   }
            // }
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
//查询背包食物
function pigPetUserBag() {
  return new Promise(async resolve => {
    const body = {"source":0,"channelLV":"yqs","riskDeviceParam":"{}","t":Date.now(),"skuId":"1001003004","category":"1001"};
    $.post(taskUrl('pigPetUserBag', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData && data.resultData.resultData.goods) {
                  console.log(`\n食物名称     数量`);
                  for (let item of data.resultData.resultData.goods) {
                    console.log(`${item.goodsName}      ${item.count}g`);
                  }
                  for (let item of data.resultData.resultData.goods) {
                    if (item.count >= 20) {
                      console.log(`10秒后开始喂食${item.goodsName}，当前数量为${item.count}g`)
                      await $.wait(10000);
                      await pigPetAddFood(item.sku);
                    }
                  }
                } else {
                  console.log(`暂无食物`)
                }
              } else {
                console.log(`开宝箱其他情况：${JSON.stringify(data)}`)
              }
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
//喂食
function pigPetAddFood(skuId) {
  return new Promise(async resolve => {
    console.log(`skuId::::${skuId}`)
    const body = {
      "source": 0,
      "channelLV":"yqs",
      "riskDeviceParam":"{}",
      "skuId": skuId.toString(),
      "category":"1001",
    }
    // const body = {
    //   "source": 2,
    //   "channelLV":"juheye",
    //   "riskDeviceParam":"{}",
    //   "skuId": skuId.toString(),
    // }
    $.post(taskUrl('pigPetAddFood', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log(`喂食结果：${data}`)
            data = JSON.parse(data);
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
function pigPetLogin() {
  return new Promise(async resolve => {
    const body = {
      "source":2,
      "channelLV":"juheye",
      "riskDeviceParam":"{}",
    }
    $.post(taskUrl('pigPetLogin', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                $.hasPig = data.resultData.resultData.hasPig;
                if (!$.hasPig) {
                  console.log(`\n京东账号${$.index} ${$.nickName} 未开启养猪活动,请手动去京东金融APP开启此活动\n`)
                }
              } else {
                console.log(`Login其他情况：${JSON.stringify(data)}`)
              }
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
//开宝箱
function pigPetOpenBox() {
  return new Promise(async resolve => {
    const body = {"source":0,"channelLV":"yqs","riskDeviceParam":"{}","no":5,"category":"1001","t": Date.now()}
    $.post(taskUrl('pigPetOpenBox', body), async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // console.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData && data.resultData.resultData.award) {
                  console.log(`开宝箱获得${data.resultData.resultData.award.content}，数量：${data.resultData.resultData.award.count}`);

                } else {
                  console.log(`开宝箱暂无奖励`)
                }
                await $.wait(2000);
                await pigPetOpenBox();
              } else if (data.resultData.resultCode === 420) {
                console.log(`开宝箱失败:${data.resultData.resultMsg}`)
              } else {
                console.log(`开宝箱其他情况：${JSON.stringify(data)}`)
              }
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
//查询大转盘的次数
function pigPetLotteryIndex() {
  $.currentCount = 0;
  return new Promise(async resolve => {
    const body = {
      "source":0,
      "channelLV":"juheye",
      "riskDeviceParam": "{}"
    }
    $.post(taskUrl('pigPetLotteryIndex', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // console.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData) {
                  console.log(`当前大转盘剩余免费抽奖次数：：${data.resultData.resultData.currentCount}`);
                  $.currentCount = data.resultData.resultData.currentCount;
                }
              } else {
                console.log(`查询大转盘的次数：${JSON.stringify(data)}`)
              }
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
//查询签到情况
function pigPetSignIndex() {
  $.sign = true;
  return new Promise(async resolve => {
    const body = {
      "source":2,
      "channelLV":"juheye",
      "riskDeviceParam": "{}"
    }
    $.post(taskUrl('pigPetSignIndex', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // console.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData) {
                  $.sign = data.resultData.resultData.sign;
                  $.no = data.resultData.resultData.today;
                }
              } else {
                console.log(`查询签到情况异常：${JSON.stringify(data)}`)
              }
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
//抽奖
function pigPetLotteryPlay() {
  return new Promise(async resolve => {
    const body = {
      "source":0,
      "channelLV":"juheye",
      "riskDeviceParam":"{}",
      "t":Date.now(),
      "type":0,
    }
    $.post(taskUrl('pigPetLotteryPlay', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // console.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData) {
                  // console.log(`当前大转盘剩余免费抽奖次数：：${data.resultData.resultData.currentCount}`);
                  $.currentCount = data.resultData.resultData.currentCount;//抽奖后剩余的抽奖次数
                }
              } else {
                console.log(`其他情况：${JSON.stringify(data)}`)
              }
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
async function missions() {
  for (let item of $.missions) {
    if (item.status === 4) {
      console.log(`\n${item.missionName}任务已做完,开始领取奖励`)
      await pigPetDoMission(item.mid);
    } else if (item.status === 5){
      console.log(`\n${item.missionName}已领取`)
    } else if (item.status === 3){
      console.log(`\n${item.missionName}未完成`)
      if (item.mid === 'CPD01') {
        await pigPetDoMission(item.mid);
      } else {
        //TODO
        // await pigPetDoMission(item.mid);
        // await queryMissionReceiveAfterStatus(item.mid);
        // await finishReadMission(item.mid);
      }
    }
  }
}
//领取做完任务的奖品
function pigPetDoMission(mid) {
  return new Promise(async resolve => {
    const body = {
      "source":0,
      "channelLV":"",
      "riskDeviceParam":"{}",
      mid
    }
    $.post(taskUrl('pigPetDoMission', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log('pigPetDoMission',data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData) {
                  if (data.resultData.resultData.award) {
                    console.log(`奖励${data.resultData.resultData.award.name},数量:${data.resultData.resultData.award.count}`)
                  }
                }
              } else {
                console.log(`其他情况：${JSON.stringify(data)}`)
              }
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
//查询任务列表
function pigPetMissionList() {
  return new Promise(async resolve => {
    const body = {
      "source":0,
      "channelLV":"",
      "riskDeviceParam":"{}",
    }
    $.post(taskUrl('pigPetMissionList', body), (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            // console.log(data)
            data = JSON.parse(data);
            if (data.resultCode === 0) {
              if (data.resultData.resultCode === 0) {
                if (data.resultData.resultData) {
                  $.missions = data.resultData.resultData.missions;//抽奖后剩余的抽奖次数
                }
              } else {
                console.log(`其他情况：${JSON.stringify(data)}`)
              }
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
function queryMissionReceiveAfterStatus(missionId) {
  return new Promise(resolve => {
    const body = {"missionId": missionId.toString()};
    const options = {
      "url": `${MISSION_BASE_API}/queryMissionReceiveAfterStatus?reqData=%7B%2522missionId%2522:%2522${Number(missionId)}%2522%7D`,
      "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Connection": "keep-alive",
        "Host": "ms.jr.jd.com",
        "Cookie": cookie,
        "Origin": "https://jdjoy.jd.com",
        "Referer": "https://jdjoy.jd.com/",
        "User-Agent": "jdapp;android;8.5.12;9;network/wifi;model/GM1910;addressid/1302541636;aid/ac31e03386ddbec6;oaid/;osVer/28;appBuild/73078;adk/;ads/;pap/JA2015_311210|8.5.12|ANDROID 9;osv/9;pv/117.24;jdv/0|kong|t_1000217905_|jingfen|644e9b005c8542c1ac273da7763971d8|1589905791552|1589905794;ref/com.jingdong.app.mall.WebActivity;partner/oppo;apprpd/Home_Main;Mozilla/5.0 (Linux; Android 9; GM1910 Build/PKQ1.190110.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 Edg/86.0.4240.111"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log('queryMissionReceiveAfterStatus',data)
            // data = JSON.parse(data);
            // if (data.resultCode === 0) {
            //   if (data.resultData.resultCode === 0) {
            //     if (data.resultData.resultData) {
            //       // console.log(`当前大转盘剩余免费抽奖次数：：${data.resultData.resultData.currentCount}`);
            //       $.currentCount = data.resultData.resultData.currentCount;//抽奖后剩余的抽奖次数
            //     }
            //   } else {
            //     console.log(`其他情况：${JSON.stringify(data)}`)
            //   }
            // }
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
//做完浏览任务发送信息API
function finishReadMission(missionId) {
  return new Promise(async resolve => {
    const body = {"missionId": missionId.toString(),"readTime":10};
    const options = {
      "url": `${MISSION_BASE_API}/finishReadMission?reqData=%7B%2522missionId%2522:%2522${Number(missionId)}%2522,%2522readTime%2522:10%7D`,
      "headers": {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Connection": "keep-alive",
        "Host": "ms.jr.jd.com",
        "Cookie": cookie,
        "Origin": "https://jdjoy.jd.com",
        "Referer": "https://jdjoy.jd.com/",
        "User-Agent": "jdapp;android;8.5.12;9;network/wifi;model/GM1910;addressid/1302541636;aid/ac31e03386ddbec6;oaid/;osVer/28;appBuild/73078;adk/;ads/;pap/JA2015_311210|8.5.12|ANDROID 9;osv/9;pv/117.24;jdv/0|kong|t_1000217905_|jingfen|644e9b005c8542c1ac273da7763971d8|1589905791552|1589905794;ref/com.jingdong.app.mall.WebActivity;partner/oppo;apprpd/Home_Main;Mozilla/5.0 (Linux; Android 9; GM1910 Build/PKQ1.190110.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 Edg/86.0.4240.111"
      }
    }
    $.get(options, (err, resp, data) => {
      try {
        if (err) {
          console.log(`${JSON.stringify(err)}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (data) {
            console.log('finishReadMission',data)
            // data = JSON.parse(data);
            // if (data.resultCode === 0) {
            //   if (data.resultData.resultCode === 0) {
            //     if (data.resultData.resultData) {
            //       // console.log(`当前大转盘剩余免费抽奖次数：：${data.resultData.resultData.currentCount}`);
            //       $.currentCount = data.resultData.resultData.currentCount;//抽奖后剩余的抽奖次数
            //     }
            //   } else {
            //     console.log(`其他情况：${JSON.stringify(data)}`)
            //   }
            // }
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
function taskUrl(function_id, body) {
  return {
    url: `${JD_API_HOST}/${function_id}?_=${Date.now()}`,
    body: `reqData=${encodeURIComponent(JSON.stringify(body))}`,
    headers: {
      'Accept' : `*/*`,
      'Origin' : `https://u.jr.jd.com`,
      'Accept-Encoding' : `gzip, deflate, br`,
      'Cookie' : cookie,
      'Content-Type' : `application/x-www-form-urlencoded;charset=UTF-8`,
      'Host' : `ms.jr.jd.com`,
      'Connection' : `keep-alive`,
      // 'User-Agent' : `jdapp;iPhone;9.0.0;13.4.1;e35caf0a69be42084e3c97eef56c3af7b0262d01;network/4g;ADID/F75E8AED-CB48-4EAC-A213-E8CE4018F214;supportApplePay/3;hasUPPay/0;pushNoticeIsOpen/1;model/iPhone11,8;addressid/2005183373;hasOCPay/0;appBuild/167237;supportBestPay/0;jdSupportDarkMode/0;pv/1287.19;apprpd/MyJD_GameMain;ref/https%3A%2F%2Fuua.jr.jd.com%2Fuc-fe-wxgrowing%2Fmoneytree%2Findex%2F%3Fchannel%3Dyxhd%26lng%3D113.325843%26lat%3D23.204628%26sid%3D2d98e88cf7d182f60d533476c2ce777w%26un_area%3D19_1601_50258_51885;psq/1;ads/;psn/e35caf0a69be42084e3c97eef56c3af7b0262d01|3485;jdv/0|kong|t_1000170135|tuiguang|notset|1593059927172|1593059927;adk/;app_device/IOS;pap/JA2015_311210|9.0.0|IOS 13.4.1;Mozilla/5.0 (iPhone; CPU iPhone OS 13_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
      'User-Agent' : `jdapp;android;8.5.12;9;network/wifi;model/GM1910;addressid/1302541636;aid/ac31e03386ddbec6;oaid/;osVer/28;appBuild/73078;adk/;ads/;pap/JA2015_311210|8.5.12|ANDROID 9;osv/9;pv/117.24;jdv/0|kong|t_1000217905_|jingfen|644e9b005c8542c1ac273da7763971d8|1589905791552|1589905794;ref/com.jingdong.app.mall.WebActivity;partner/oppo;apprpd/Home_Main;Mozilla/5.0 (Linux; Android 9; GM1910 Build/PKQ1.190110.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/66.0.3359.126 MQQBrowser/6.2 TBS/044942 Mobile Safari/537.36 Edg/86.0.4240.111`,
      'Referer' : `https://u.jr.jd.com/`,
      'Accept-Language' : `zh-cn`
    }
  }
}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,o)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=e&&e.timeout?e.timeout:o;const[r,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":r,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),o=JSON.stringify(this.data);s?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(e,o):this.fs.writeFileSync(t,o)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return s;return o}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),o=s?this.getval(s):"";if(o)try{const t=JSON.parse(o);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(e),r=this.getval(i),h=i?"null"===r?null:r||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,o,t),s=this.setval(JSON.stringify(e),i)}catch(e){const r={};this.lodash_set(r,o,t),s=this.setval(JSON.stringify(r),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t)))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:o,body:r}=t;e(null,{status:s,statusCode:i,headers:o,body:r},r)},t=>e(t))}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",o){const r=t=>{if(!t||!this.isLoon()&&this.isSurge())return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,r(o)):this.isQuanX()&&$notify(e,s,i,r(o)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}