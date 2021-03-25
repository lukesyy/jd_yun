/*
只能用一天。需每天寻找直播抓包
1 8-23 * * * lxk0301_live_redrain.js
*/
const $ = new Env('整点京豆雨');
let allMessage = '';
let bodyList = {
	'20': {
		url: 'https://api.m.jd.com/client.action?functionId=liveActivityV842&uuid=8888888&client=apple&clientVersion=9.4.4&st=1616204859304&sign=a52a5ba5b42a43ce8d81e0014ba04859&sv=121',
		body: 'body=%7B%22liveId%22%3A%223689733%22%7D'
	}
}
let ids = {
	'8': 'RRA2v2Lh5mtxYnC4j6VHrjoaDz7crQK',
	'9': 'RRA2v2Lh5mtxYnC4j6VHrjoaDz7crQK',
	'10': 'RRA2v2Lh5mtxYnC4j6VHrjoaDz7crQK',
	'11': 'RRA2v2Lh5mtxYnC4j6VHrjoaDz7crQK',
	'12': 'RRA2v2Lh5mtxYnC4j6VHrjoaDz7crQK',
	'13': 'RRA2v2Lh5mtxYnC4j6VHrjoaDz7crQK',
	'14': 'RRA2v2Lh5mtxYnC4j6VHrjoaDz7crQK',
	'15': 'RRA2v2Lh5mtxYnC4j6VHrjoaDz7crQK',
	'16': 'RRA2v2Lh5mtxYnC4j6VHrjoaDz7crQK',
	'17': 'RRA2v2Lh5mtxYnC4j6VHrjoaDz7crQK',
	'18': 'RRA2v2Lh5mtxYnC4j6VHrjoaDz7crQK',
	'19': 'RRA2v2Lh5mtxYnC4j6VHrjoaDz7crQK',
	'20': 'RRA2v2Lh5mtxYnC4j6VHrjoaDz7crQK',
	'21': 'RRA2v2Lh5mtxYnC4j6VHrjoaDz7crQK',
	'22': 'RRA2v2Lh5mtxYnC4j6VHrjoaDz7crQK',
	'23': 'RRA2v2Lh5mtxYnC4j6VHrjoaDz7crQK'
}
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],
cookie = '',
message;
if ($.isNode()) {
	Object.keys(jdCookieNode).forEach((item) = >{
		cookiesArr.push(jdCookieNode[item])
	}) if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () = >{};
} else {
	cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item = >item.cookie)].filter(item = >!!item);
}
const JD_API_HOST = 'https://api.m.jd.com/api'; ! (async() = >{
	if (!cookiesArr[0]) {
		$.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
			"open-url": "https://bean.m.jd.com/"
		});
		return;
	}
	await getRedRain();

	let nowTs = new Date().getTime()
	// if (!($.st <= nowTs && nowTs < $.ed)) {
	$.log(`远程红包雨配置获取错误，从本地读取配置`) let hour = (new Date().getUTCHours() + 8) % 24
	if (ids[hour]) {
		$.activityId = ids[hour] $.log(`本地红包雨配置获取成功`)
	} else {
		$.log(`无法从本地读取配置，请检查运行时间`) return
	}
	// } else{
	//   $.log(`远程红包雨配置获取成功`)
	// }
	for (let i = 0; i < cookiesArr.length; i++) {
		if (cookiesArr[i]) {
			cookie = cookiesArr[i];
			$.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]) $.index = i + 1;
			$.isLogin = true;
			$.nickName = '';
			message = '';
			await TotalBean();
			console.log(`\n * *****开始【京东账号$ {
				$.index
			}】$ {
				$.nickName || $.UserName
			} * ********\n`);
			if (!$.isLogin) {
				$.msg($.name, `【提示】cookie已失效`, `京东账号$ {
					$.index
				}
				$ {
					$.nickName || $.UserName
				}\n请重新登录获取\nhttps: //bean.m.jd.com/`, {"open-url": "https://bean.m.jd.com/"});
				if ($.isNode()) {
					await notify.sendNotify(`$ {
						$.name
					}
					cookie已失效 - $ {
						$.UserName
					}`, `京东账号$ {
						$.index
					}
					$ {
						$.UserName
					}\n请重新登录获取cookie`);
				}
				continue
			}
			let nowTs = new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000 console.log(nowTs, $.startTime, $.endTime, cookie) await receiveRedRain();
			// await showMsg();
		}
	}
	if (allMessage) {
		if ($.isNode()) await notify.sendNotify(`$ {
			$.name
		}`, `$ {
			allMessage
		}`);
		$.msg($.name, '', allMessage);
	}
})().
catch((e) = >{
	$.log('', `❌$ {
		$.name
	},
	失败 ! 原因: $ {
		e
	} ! `, '')
}).
finally(() = >{
	$.done();
})

function showMsg() {
	return new Promise(resolve = >{
		$.msg($.name, '', `【京东账号$ {
			$.index
		}】$ {
			$.nickName
		}\n$ {
			message
		}`);
		resolve()
	})
}

function getRedRain() {
	let body
	if (bodyList.hasOwnProperty(new Date().getDate())) {
		body = bodyList[new Date().getDate()]
	} else {
		return
	}
	return new Promise(resolve = >{
		$.post(taskGetUrl(body.url, body.body), (err, resp, data) = >{
			try {
				if (err) {
					console.log(`$ {
						JSON.stringify(err)
					}`) console.log(`$ {
						$.name
					}
					API请求失败，请检查网路重试`)
				} else {
					if (safeGet(data)) {
						data = JSON.parse(data);
						if (data.data && data.data.iconArea) {
							console.log(data.data.iconArea.filter(vo = >vo['type'] === 'anchor_darw_lottery').length && data.data.iconArea.filter(vo = >vo['type'] === 'anchor_darw_lottery')[0].data.lotteryId) let act = data.data.iconArea.filter(vo = >vo['type'] === "platform_red_packege_rain")[0]
							if (act) {
								let url = act.data.activityUrl $.activityId = url.substr(url.indexOf("id=") + 3) $.st = act.startTime $.ed = act.endTime console.log($.activityId)

								console.log(`下一场红包雨开始时间：$ {
									new Date($.st)
								}`) console.log(`下一场红包雨结束时间：$ {
									new Date($.ed)
								}`)
							} else {
								console.log(`暂无红包雨`)
							}
						} else {
							console.log(`暂无红包雨`)
						}
					}
				}
			} catch(e) {
				$.logErr(e, resp)
			} finally {
				resolve();
			}
		})
	})
}

function receiveRedRain() {
	return new Promise(resolve = >{
		const body = {
			"actId": $.activityId
		};
		$.get(taskUrl('noahRedRainLottery', body), (err, resp, data) = >{
			try {
				if (err) {
					console.log(`$ {
						JSON.stringify(err)
					}`) console.log(`$ {
						$.name
					}
					API请求失败，请检查网路重试`)
				} else {
					if (safeGet(data)) {
						data = JSON.parse(data);
						if (data.subCode === '0') {
							console.log(`领取成功，获得$ {
								JSON.stringify(data.lotteryResult)
							}`)
							// message+= `领取成功，获得${JSON.stringify(data.lotteryResult)}\n`
							message += `领取成功，获得$ { (data.lotteryResult.jPeasList[0].quantity)
							}京豆`allMessage += `京东账号$ {
								$.index
							}
							$ {
								$.nickName || $.UserName
							}\n领取成功，获得$ { (data.lotteryResult.jPeasList[0].quantity)
							}京豆$ {
								$.index !== cookiesArr.length ? '\n\n': ''
							}`;
						} else if (data.subCode === '8') {
							console.log(`今日次数已满`) message += `领取失败，本场已领过`;
						} else {
							console.log(`异常：$ {
								JSON.stringify(data)
							}`)
						}
					}
				}
			} catch(e) {
				$.logErr(e, resp)
			} finally {
				resolve();
			}
		})
	})
}

function taskGetUrl(url, body) {
	return {
		url: url,
		body: body,
		headers: {
			"Accept": "*/*",
			"Accept-Encoding": "gzip, deflate, br",
			"Accept-Language": "zh-cn",
			"Connection": "keep-alive",
			"Content-Type": "application/x-www-form-urlencoded",
			"Host": "api.m.jd.com",
			"Referer": `https: //h5.m.jd.com/active/redrain/index.html?id=${$.activityId}&lng=0.000000&lat=0.000000&sid=&un_area=`,
			"Cookie": cookie,
			"User-Agent": "JD4iPhone/9.3.5 CFNetwork/1209 Darwin/20.2.0"
		}
	}
}

function taskPostUrl(function_id, body = body) {
	return {
		url: `https: //api.m.jd.com/client.action?functionId=${function_id}`,
		body: body,
		headers: {
			'Host': 'api.m.jd.com',
			'content-type': 'application/x-www-form-urlencoded',
			'accept': '*/*',
			'user-agent': 'JD4iPhone/167408 (iPhone; iOS 14.2; Scale/3.00)',
			'accept-language': 'zh-Hans-JP;q=1, en-JP;q=0.9, zh-Hant-TW;q=0.8, ja-JP;q=0.7, en-US;q=0.6',
			//"Cookie": cookie,
		}
	}
}

function taskUrl(function_id, body = {}) {
	return {
		url: `$ {
			JD_API_HOST
		} ? functionId = $ {
			function_id
		} & body = $ {
			escape(JSON.stringify(body))
		} & client = wh5 & clientVersion = 1.0.0 & _ = $ {
			new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000
		}`,
		headers: {
			"Accept": "*/*",
			"Accept-Encoding": "gzip, deflate, br",
			"Accept-Language": "zh-cn",
			"Connection": "keep-alive",
			"Content-Type": "application/x-www-form-urlencoded",
			"Host": "api.m.jd.com",
			"Referer": `https: //h5.m.jd.com/active/redrain/index.html?id=${$.activityId}&lng=0.000000&lat=0.000000&sid=&un_area=`,
			"Cookie": cookie,
			"User-Agent": "JD4iPhone/9.3.5 CFNetwork/1209 Darwin/20.2.0"
		}
	}
}

function TotalBean() {
	return new Promise(async resolve = >{
		const options = {
			"url": `https: //wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
			"headers": {
				"Accept": "application/json,text/plain, */*",
				"Content-Type": "application/x-www-form-urlencoded",
				"Accept-Encoding": "gzip, deflate, br",
				"Accept-Language": "zh-cn",
				"Connection": "keep-alive",
				"Cookie": cookie,
				"Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
				"User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT: "JD4iPhone/9.3.5 CFNetwork/1209 Darwin/20.2.0") : ($.getdata('JDUA') ? $.getdata('JDUA') : "JD4iPhone/9.3.5 CFNetwork/1209 Darwin/20.2.0")
			}
		}
		$.post(options, (err, resp, data) = >{
			try {
				if (err) {
					console.log(`$ {
						JSON.stringify(err)
					}`) console.log(`$ {
						$.name
					}
					API请求失败，请检查网路重试`)
				} else {
					if (data) {
						data = JSON.parse(data);
						if (data['retcode'] === 13) {
							$.isLogin = false; //cookie过期
							return
						}
						if (data['retcode'] === 0) {
							$.nickName = (data['base'] && data['base'].nickname) || $.UserName;
						} else {
							$.nickName = $.UserName
						}
					} else {
						console.log(`京东服务器返回空数据`)
					}
				}
			} catch(e) {
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
	} catch(e) {
		console.log(e);
		console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
		return false;
	}
}

function jsonParse(str) {
	if (typeof str == "string") {
		try {
			return JSON.parse(str);
		} catch(e) {
			console.log(e);
			$.msg($.name, '', '不要在BoxJS手动复制粘贴修改cookie') return [];
		}
	}
}
// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name},开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http:
