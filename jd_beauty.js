/*
美丽研究院
活动入口：京东app首页-美妆馆-底部中间按钮
只支持Node.js支持N个京东账号
脚本兼容: Node.js
cron 1 7,12,19 * * * jd_beauty.js
 */
const $ = new Env('美丽研究院');

const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//const WebSocket = $.isNode() ? require('websocket').w3cwebsocket: SockJS;
let jdNotify = true;//是否关闭通知，false打开通知推送，true关闭通知推送
const randomCount = $.isNode() ? 0 : 5;
const bean = 500
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '', message, helpInfo, ADD_CART = false;

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
!(async () => {
  if (!cookiesArr[0]) {
    $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {"open-url": "https://bean.m.jd.com/"});
    return;
  }
  helpInfo = []
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
        }
        continue
      }
      await jdBeauty()
      helpInfo = $.helpInfo
    }
  }
})()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

async function jdBeauty() {
  $.hasDone = false
  await getIsvToken()
  await getIsvToken2()
  await getToken()
  await mr()
  while (!$.hasDone) {
    await $.wait(1000)
  }
  await showMsg();
}

async function mr() {
  $.coins = 0
  $.init = false
  let positionList = ['b1', 'h1', 's1', 'b2', 'h2', 's2']
  $.tokens = []
  $.pos = []
  $.helpInfo = []
  const WebSocket = require('ws')
  let client = new WebSocket(`wss://xinruimz-isv.isvjcloud.com/wss/?token=${$.token}`)
  client.onopen = async () => {
    console.log(`美容研究院服务器连接成功`);
    client.send('{"msg":{"type":"action","args":{"source":1},"action":"_init_"}}');
    client.send(`{"msg":{"type":"action","args":{"source":"meizhuangguandibudaohang"},"action":"stats"}}`)
    while (!$.init) {
      client.send(`ping`)
      await $.wait(1000)
    }
    for (let help of helpInfo) {
      client.send(help)
    }
    await $.wait(1000)
    client.send(`{"msg":{"type":"action","args":{},"action":"shop_products"}}`)
    // 获得可生产的原料列表
    client.send(`{"msg":{"type":"action","args":{},"action":"get_produce_material"}}`)
    await $.wait(1000)
    // 获得原料生产列表
    console.log(`========原料生产信息========`)
    for (let pos of positionList) {
      client.send(`{"msg":{"type":"action","args":{"position":"${pos}"},"action":"produce_position_info"}}`)
      // await $.wait(500)
    }
    // 获得正在生产的商品信息
    client.send('{"msg":{"type":"action","args":{},"action":"product_producing"}}')
    await $.wait(1000)
    // 获得库存
    client.send(`{"msg":{"type":"action","args":{},"action":"get_package"}}`)
    // 获得可生成的商品列表
    client.send(`{"msg":{"type":"action","args":{"page":1,"num":10},"action":"product_lists"}}`)
    await $.wait(1000)
    // 获得任务
    client.send(`{"msg":{"type":"action","args":{},"action":"get_task"}}`)
    // 获取个人信息
    client.send(`{"msg":{"type":"action","args":{"source":1},"action":"get_user"}}`)
    await $.wait(1000)
    // 获得福利中心
    client.send(`{"msg":{"type":"action","args":{},"action":"get_benefit"}}`)
  };

  client.onclose = () => {
    console.log(`本次运行获得美妆币${$.coins}`)
    // console.log('服务器连接关闭');
    $.hasDone = true
    for (let i = 0; i < $.pos.length && i < $.tokens.length; ++i) {
      $.helpInfo.push(`{"msg":{"type":"action","args":{"inviter_id":"${$.userInfo.id}","position":"${$.pos[i]}","token":"${$.tokens[i]}"},"action":"employee"}}`)
    }
    console.log($.helpInfo)
  };
  client.onmessage = async function (e) {
    if (e.data !== 'pong' && safeGet(e.data)) {
      let vo = jsonParse(e.data)
      switch (vo.action) {
        case "get_ad":
          console.log(`当期活动：${vo.data.screen.name}`)
          if (vo.data.check_sign_in === 1) {
            // 去签到
            console.log(`去做签到任务`)
            client.send(`{"msg":{"type":"action","args":{},"action":"sign_in"}}`)
            client.send(`{"msg":{"action":"write","type":"action","args":{"action_type":1,"channel":2,"source_app":2}}}`)
          }
          break
        case "get_user":
          $.userInfo = vo.data
          $.total = vo.data.coins
          if ($.userInfo.newcomer === 0) {
            console.log(`去做新手任务`)
            for (let i = $.userInfo.step; i < 15; ++i) {
              client.send(`{"msg":{"type":"action","args":{},"action":"newcomer_update"}}`)
              await $.wait(500)
            }
          } else
            $.init = true
          console.log(`当前美妆币${$.total}`)
          break
        case "shop_products":
          let count = $.taskState.shop_view.length
          if (count < 5) console.log(`去做关注店铺任务`)
          for (let i = 0; i < vo.data.shops.length && count < 5; ++i) {
            const shop = vo.data.shops[i]
            if (!$.taskState.shop_view.includes(shop.id)) {
              count++
              console.log(`去做关注店铺【${shop.name}】`)
              client.send(`{"msg":{"type":"action","args":{"shop_id":${shop.id}},"action":"shop_view"}}`)
              client.send(`{"msg":{"action":"write","type":"action","args":{"action_type":6,"channel":2,"source_app":2,"vender":"${shop.vender_id}"}}}`)
            }
            await $.wait(1000)
          }
          count = $.taskState.product_adds.length
          if (count < 5 && ADD_CART) console.log(`去做浏览并加购任务`)
          for (let i = 0; i < vo.data.products.length && count < 5 && ADD_CART; ++i) {
            const product = vo.data.products[i]
            if (!$.taskState.product_adds.includes(product.id)) {
              count++
              console.log(`去加购商品【${product.name}】`)
              client.send(`{"msg":{"type":"action","args":{"add_product_id":${product.id}},"action":"add_product_view"}}`)
              client.send(`{"msg":{"action":"write","type":"action","args":{"action_type":9,"channel":2,"source_app":2,"vender":"${product.id}"}}}`)
              client.send(`{"msg":{"action":"write","type":"action","args":{"action_type":5,"channel":2,"source_app":2,"vender":"${product.id}"}}}`)
            }
            await $.wait(1000)
          }
          for (let i = $.taskState.meetingplace_view; i < $.taskState.mettingplace_count; ++i) {
            console.log(`去做第${i + 1}次浏览会场任务`)
            client.send(`{"msg":{"type":"action","args":{"source":1},"action":"meetingplace_view"}}`)
            await $.wait(2000)
          }
          if ($.taskState.today_answered === 0) {
            console.log(`去做每日问答任务`)
            client.send(`{"msg":{"type":"action","args":{"source":1},"action":"get_question"}}`)
          }
          break
        case "check_up":
          $.taskState = vo.data
          // 6-9点签到
          for (let check_up of vo.data.check_up) {
            if (check_up['receive_status'] !== 1) {
              console.log(`去领取第${check_up.times}次签到奖励`)
              client.send(`{"msg":{"type":"action","args":{"check_up_id":${check_up.id}},"action":"check_up_receive"}}`)
            } else {
              console.log(`第${check_up.times}次签到奖励已领取`)
            }
          }
          break
        case 'newcomer_update':
          if (vo.code === '200' || vo.code === 200) {
            console.log(`第${vo.data.step}步新手任务完成成功，获得${vo.data.coins}美妆币`)
            if (vo.data.step === 15) $.init = true
            $.coins += vo.data.coins
          } else {
            console.log(`新手任务完成失败，错误信息：${JSON.stringify(vo)}`)
          }
          break
        case 'get_question':
          const questions = vo.data
          let commit = {}
          for (let i = 0; i < questions.length; ++i) {
            const ques = questions[i]
            commit[`${ques.id}`] = parseInt(ques.answers)
          }
          await $.wait(5000)
          client.send(`{"msg":{"type":"action","args":{"commit":${JSON.stringify(commit)},"correct":${questions.length}},"action":"submit_answer"}}`)
          break
        case 'complete_task':
        case 'action':
        case 'submit_answer':
        case "check_up_receive":
        case "shop_view":
        case "add_product_view":
        case "meetingplace_view":
          if (vo.code === '200' || vo.code === 200) {
            console.log(`任务完成成功，获得${vo.data.coins}美妆币`)
            $.coins += vo.data.coins
            $.total = vo.data.user_coins
          } else {
            console.log(`任务完成失败，错误信息${vo.msg}`)
          }
          break
        case "produce_position_info":
          if (vo.data.material_name !== '') {
            console.log(`【${vo.data.position}】上正在生产【${vo.data.material_name}】，可收取 ${vo.data.produce_num} 份`)
            if (vo.data.produce_num > 0) {
              console.log(`剩余份数大于0份，去收取`)
              client.send(`{"msg":{"type":"action","args":{"position":"${vo.data.position}","replace_material":false},"action":"material_fetch"}}`)
              client.send(`{"msg":{"type":"action","args":{},"action":"to_employee"}}`)
              $.pos.push(vo.data.position)
            }
          } else {
            console.log(`【${vo.data.position}】上尚未开始生产`)
            if (vo.data.valid_electric > 0) {
              let ma = $.material.base[0]['items'][positionList.indexOf(vo.data.position)]
              if (ma) {
                console.log(`去生产${ma.name}`)
                client.send(`{"msg":{"type":"action","args":{"position":"${vo.data.position}","material_id":${ma.id}},"action":"material_produce"}}`)
              } else {
                ma = $.material.base[1]['items'][positionList.indexOf(vo.data.position)]
                if (ma) {
                  console.log(`去生产${ma.name}`)
                  client.send(`{"msg":{"type":"action","args":{"position":"${vo.data.position}","material_id":${ma.id}},"action":"material_produce"}}`)
                }
              }
            }
          }
          break
        case "material_produce":
          console.log(`【${vo.data.position}】上开始生产${vo.data.material_name}`)
          client.send(`{"msg":{"type":"action","args":{},"action":"to_employee"}}`)
          $.pos.push(vo.data.position)
          break
        case "material_fetch":
          if (vo.code === '200' || vo.code === 200) {
            console.log(`【${vo.data.position}】收取成功，获得${vo.data.procedure.produce_num}份${vo.data.material_name}`)
            $.coins += vo.data.coins
          } else {
            console.log(`任务完成失败，错误信息${vo.msg}`)
          }
          break
        case "get_package":
          if (vo.code === '200' || vo.code === 200) {
            // $.products = vo.data.product
            $.materials = vo.data.material
            let msg = `仓库信息:`
            for (let material of $.materials) {
              msg += `【${material.material.name}】${material.num}份 `
            }
            console.log(msg)
          } else {
            console.log(`仓库信息获取失败，错误信息${vo.msg}`)
          }
          break
        case "product_lists":
          if (vo.code === '200' || vo.code === 200) {
            $.products = vo.data
            console.log(`========可生产商品信息========`)
            for (let product of $.products) {
              let num = Infinity
              let msg = ''
              msg += `生产【${product.name}】需要原料`
              for (let material of product.product_materials) {
                msg += `【${material.material.name}】${material.num} 份 `
                const ma = $.materials.filter(vo => vo.item_id === material.material_id)[0]
                if (ma) {
                  msg += `（库存 ${ma.num} 份）`
                  num = Math.min(num, Math.trunc(ma.num / material.num))
                } else {
                  msg += `(没有库存)`
                  num = -1000
                }
              }
              if (num !== Infinity && num > 0) {
                msg += `，可生产 ${num}份`
                console.log(msg)
                console.log(`【${product.name}】可生产份数大于0，去生产`)
                client.send(`{"msg":{"type":"action","args":{"product_id":${product.id},"amount":${num}},"action":"product_produce"}}`)
                await $.wait(500)
              } else {
                console.log(`【${product.name}】原料不足，无法生产`)
              }
            }
            console.log(`=======================`)
          } else {
            console.log(`生产信息获取失败，错误信息${vo.msg}`)
          }
          break
        case "product_produce":
          if (vo.code === '200' || vo.code === 200) {
            console.log(`生产成功`)
          } else {
            console.log(`生产信息获取失败，错误信息${vo.msg}`)
          }
          break
        case "product_producing":
          if (vo.code === '200' || vo.code === 200) {
            for (let product of vo.data) {
              if (product.num === product.produce_num) {
                client.send(`{"msg":{"type":"action","args":{"log_id":${product.id}},"action":"product_fetch"}}`)
              } else {
                console.log(`产品【${product.product.id}】未生产完成，无法收取`)
              }
            }
          } else {
            console.log(`生产商品信息获取失败，错误信息${vo.msg}`)
          }
          break
        case "product_fetch":
          if (vo.code === '200' || vo.code === 200) {
            console.log(`收取产品【${vo.data.product.name}】${vo.data.num}份`)
          } else {
            console.log(`收取产品失败，错误信息${vo.msg}`)
          }
          break
        case "get_task":
          console.log(`当前任务【${vo.data.describe}】，需要【${vo.data.product.name}】${vo.data.package_stock}/${vo.data.num}份`)
          if (vo.data.package_stock >= vo.data.num) {
            console.log(`满足任务要求，去完成任务`)
            client.send(`{"msg":{"type":"action","args":{"task_id":${vo.data.id}},"action":"complete_task"}}`)
          }
          break
        case 'get_benefit':
          for (let benefit of vo.data) {
            if (benefit.type === 1) {
              console.log(benefit)
              console.log(`物品【${benefit.description}】需要${benefit.coins}美妆币，库存${benefit.stock}份`)
              if (parseInt(benefit.setting.beans_count) === bean &&
                $.total > benefit.coins &&
                parseInt(benefit.day_exchange_count) < benefit.day_limit) {
                console.log(`满足条件，去兑换`)
                client.send(`{"msg":{"type":"action","args":{"benefit_id":${benefit.id}},"action":"to_exchange"}}`)
                await $.wait(1000)
              }
            }
          }
          break
        case "to_exchange":
          console.log(`兑换成功`)
          break
        case "get_produce_material":
          $.material = vo.data
          break
        case "to_employee":
          console.log(`雇佣助力码【${vo.data.token}】`)
          $.tokens.push(vo.data.token)
          break
        case "employee":
          console.log(`${vo.msg}`)
          break
      }
    }
  };
}

function getIsvToken() {
  let config = {
    url: 'https://api.m.jd.com/client.action?functionId=genToken',
    body: 'body=%7B%22to%22%3A%22https%3A%5C/%5C/xinruimz-isv.isvjcloud.com%5C/?channel%3Dmeizhuangguandibudaohang%26collectionId%3D96%26tttparams%3DYEyYQjMIeyJnTG5nIjoiMTE4Ljc2MjQyMSIsImdMYXQiOiIzMi4yNDE4ODIifQ8%253D%253D%26un_area%3D12_904_908_57903%26lng%3D118.7159742308471%26lat%3D32.2010317443041%22%2C%22action%22%3A%22to%22%7D&build=167490&client=apple&clientVersion=9.3.2&openudid=53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2&osVersion=14.2&partner=apple&rfs=0000&scope=01&sign=b0aac3dd04b1c6d68cee3d425e27f480&st=1610161913667&sv=111',
    headers: {
      'Host': 'api.m.jd.com',
      'accept': '*/*',
      'user-agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
      'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  }
  return new Promise(resolve => {
    $.post(config, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${err},${jsonParse(resp.body)['message']}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.isvToken = data['tokenKey']
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

function getIsvToken2() {
  let config = {
    url: 'https://api.m.jd.com/client.action?functionId=isvObfuscator',
    body: 'body=%7B%22url%22%3A%22https%3A%5C/%5C/xinruimz-isv.isvjcloud.com%22%2C%22id%22%3A%22%22%7D&build=167490&client=apple&clientVersion=9.3.2&openudid=53f4d9c70c1c81f1c8769d2fe2fef0190a3f60d2&osVersion=14.2&partner=apple&rfs=0000&scope=01&sign=6eb3237cff376c07a11c1e185761d073&st=1610161927336&sv=102&uuid=hjudwgohxzVu96krv/T6Hg%3D%3D',
    headers: {
      'Host': 'api.m.jd.com',
      'accept': '*/*',
      'user-agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
      'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': cookie
    }
  }
  return new Promise(resolve => {
    $.post(config, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${err},${jsonParse(resp.body)['message']}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.token2 = data['token']
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

function getToken() {
  let config = {
    url: 'https://xinruimz-isv.isvjcloud.com/api/auth',
    body: `{"token":"${$.token2}","source":"01"}`,
    headers: {
      'Host': 'xinruimz-isv.isvjcloud.com',
      'Accept': 'application/x.jd-school-island.v1+json',
      'Source': '02',
      'Accept-Language': 'zh-cn',
      'Content-Type': 'application/json;charset=utf-8',
      'Origin': 'https://xinruimz-isv.isvjcloud.com',
      'User-Agent': 'JD4iPhone/167490 (iPhone; iOS 14.2; Scale/3.00)',
      'Referer': 'https://xinruimz-isv.isvjcloud.com/logined_jd/',
      'Cookie': `${cookie} isvToken=${$.isvToken};`
    }
  }
  return new Promise(resolve => {
    $.post(config, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`${err},${jsonParse(resp.body)['message']}`)
          console.log(`${$.name} API请求失败，请检查网路重试`)
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            $.token = data.access_token
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

function showMsg() {
  return new Promise(resolve => {
    message += `本次运行获得美妆币${$.coins}枚`;
    $.msg($.name, '', `京东账号${$.index}${$.nickName}\n${message}`);
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
      $.msg($.name, '', '不要在BoxJS手动复制粘贴修改cookie')
      return [];
    }
  }
}

// prettier-ignore
function Env(t, e) {
  class s {
    constructor(t) {
      this.env = t
    }

    send(t, e = "GET") {
      t = "string" == typeof t ? {url: t} : t;
      let s = this.get;
      return "POST" === e && (s = this.post), new Promise((e, i) => {
        s.call(this, t, (t, s, r) => {
          t ? i(t) : e(s)
        })
      })
    }

    get(t) {
      return this.send.call(this.env, t)
    }

    post(t) {
      return this.send.call(this.env, t, "POST")
    }
  }

  return new class {
    constructor(t, e) {
      this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`)
    }

    isNode() {
      return "undefined" != typeof module && !!module.exports
    }

    isQuanX() {
      return "undefined" != typeof $task
    }

    isSurge() {
      return "undefined" != typeof $httpClient && "undefined" == typeof $loon
    }

    isLoon() {
      return "undefined" != typeof $loon
    }

    toObj(t, e = null) {
      try {
        return JSON.parse(t)
      } catch {
        return e
      }
    }

    toStr(t, e = null) {
      try {
        return JSON.stringify(t)
      } catch {
        return e
      }
    }

    getjson(t, e) {
      let s = e;
      const i = this.getdata(t);
      if (i) try {
        s = JSON.parse(this.getdata(t))
      } catch {
      }
      return s
    }

    setjson(t, e) {
      try {
        return this.setdata(JSON.stringify(t), e)
      } catch {
        return !1
      }
    }

    getScript(t) {
      return new Promise(e => {
        this.get({url: t}, (t, s, i) => e(i))
      })
    }

    runScript(t, e) {
      return new Promise(s => {
        let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
        i = i ? i.replace(/\n/g, "").trim() : i;
        let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
        r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
        const [o, h] = i.split("@"), a = {
          url: `http://${h}/v1/scripting/evaluate`,
          body: {script_text: t, mock_type: "cron", timeout: r},
          headers: {"X-Key": o, Accept: "*/*"}
        };
        this.post(a, (t, e, i) => s(i))
      }).catch(t => this.logErr(t))
    }

    loaddata() {
      if (!this.isNode()) return {};
      {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e);
        if (!s && !i) return {};
        {
          const i = s ? t : e;
          try {
            return JSON.parse(this.fs.readFileSync(i))
          } catch (t) {
            return {}
          }
        }
      }
    }

    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
        const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile),
          s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data);
        s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
      }
    }

    lodash_get(t, e, s) {
      const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
      let r = t;
      for (const t of i) if (r = Object(r)[t], void 0 === r) return s;
      return r
    }

    lodash_set(t, e, s) {
      return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
    }

    getdata(t) {
      let e = this.getval(t);
      if (/^@/.test(t)) {
        const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
        if (r) try {
          const t = JSON.parse(r);
          e = t ? this.lodash_get(t, i, "") : e
        } catch (t) {
          e = ""
        }
      }
      return e
    }

    setdata(t, e) {
      let s = !1;
      if (/^@/.test(e)) {
        const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}";
        try {
          const e = JSON.parse(h);
          this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
        } catch (e) {
          const o = {};
          this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
        }
      } else s = this.setval(t, e);
      return s
    }

    getval(t) {
      return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
    }

    setval(t, e) {
      return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
    }

    initGotEnv(t) {
      this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
    }

    get(t, e = (() => {
    })) {
      t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {"X-Surge-Skip-Scripting": !1})), $httpClient.get(t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
      })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {hints: !1})), $task.fetch(t).then(t => {
        const {statusCode: s, statusCode: i, headers: r, body: o} = t;
        e(null, {status: s, statusCode: i, headers: r, body: o}, o)
      }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
        try {
          if (t.headers["set-cookie"]) {
            const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
            this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
          }
        } catch (t) {
          this.logErr(t)
        }
      }).then(t => {
        const {statusCode: s, statusCode: i, headers: r, body: o} = t;
        e(null, {status: s, statusCode: i, headers: r, body: o}, o)
      }, t => {
        const {message: s, response: i} = t;
        e(s, i, i && i.body)
      }))
    }

    post(t, e = (() => {
    })) {
      if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {"X-Surge-Skip-Scripting": !1})), $httpClient.post(t, (t, s, i) => {
        !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
      }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {hints: !1})), $task.fetch(t).then(t => {
        const {statusCode: s, statusCode: i, headers: r, body: o} = t;
        e(null, {status: s, statusCode: i, headers: r, body: o}, o)
      }, t => e(t)); else if (this.isNode()) {
        this.initGotEnv(t);
        const {url: s, ...i} = t;
        this.got.post(s, i).then(t => {
          const {statusCode: s, statusCode: i, headers: r, body: o} = t;
          e(null, {status: s, statusCode: i, headers: r, body: o}, o)
        }, t => {
          const {message: s, response: i} = t;
          e(s, i, i && i.body)
        })
      }
    }

    time(t) {
      let e = {
        "M+": (new Date).getMonth() + 1,
        "d+": (new Date).getDate(),
        "H+": (new Date).getHours(),
        "m+": (new Date).getMinutes(),
        "s+": (new Date).getSeconds(),
        "q+": Math.floor(((new Date).getMonth() + 3) / 3),
        S: (new Date).getMilliseconds()
      };
      /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length)));
      for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length)));
      return t
    }

    msg(e = t, s = "", i = "", r) {
      const o = t => {
        if (!t) return t;
        if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {"open-url": t} : this.isSurge() ? {url: t} : void 0;
        if ("object" == typeof t) {
          if (this.isLoon()) {
            let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"];
            return {openUrl: e, mediaUrl: s}
          }
          if (this.isQuanX()) {
            let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl;
            return {"open-url": e, "media-url": s}
          }
          if (this.isSurge()) {
            let e = t.url || t.openUrl || t["open-url"];
            return {url: e}
          }
        }
      };
      this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r)));
      let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];
      h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h)
    }

    log(...t) {
      t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
    }

    logErr(t, e) {
      const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
      s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t)
    }

    wait(t) {
      return new Promise(e => setTimeout(e, t))
    }

    done(t = {}) {
      const e = (new Date).getTime(), s = (e - this.startTime) / 1e3;
      this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
    }
  }(t, e)
}
