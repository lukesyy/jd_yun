/*
 * @Date: 2021-08-25 14:02:18
 * @LastEditors: LiJinGang
 * @LastEditTime: 2021-09-22 14:36:25
 */
/*
此文件为Node.js专用。其他用户请忽略
 */
//此处填写京东账号cookie。
let CookieJDs = [
	'pt_key=AAJhMDH-ADBWRZMokfIKtTgVeryPAKsqFlA44Om_9SXX6Qi7dPU3gEhPLcbWtZ1pz0t6VBckYvA; pt_pin=jd_5a112c253d705;', //账号一ck,例:pt_key=XXX;pt_pin=XXX;
	'pt_key=AAJhQxV4ADBmXglkubFgkTutaByYQaqDmouEhL4k206_kuiQ2NcshJ8OWu_BwuiM5uzZmsQmsqA; pt_pin=wdTVKFZncYmMso; pt_token=5pwqsy49;',
	'pt_key=AAJhQJAsADB_EcYCmY8pg0lo9ja5oaLaBibcEGa27fXDcrcckcTcYRGwqDQi2S0p1Zu1BTkZCsg; pt_pin=jd_gdOsYHgRihZV',
	'pt_key=AAJhQJBrADA5NR-P3cHK6sOJ_4N5es_YtLo_ZBoUqzBxBYuAa62u_tevcHujS6Ovhs3loAs7-Rw;pt_pin=jd_nCgMCnrnOdnu;',
	'pt_key=AAJhQJCvADDd3WL3s7zpmtChnKaImsGdzldFNBFNxGU8t_JOupQRr_tQ_RwNpxdPNinwymXGgYU;pt_pin=jd_kZhFaoDTrAle;' //账号二ck,例:pt_key=XXX;pt_pin=XXX;如有更多,依次类推
]
// 判断环境变量里面是否有京东ck
if (process.env.JD_COOKIE) {
	if (process.env.JD_COOKIE.indexOf('&') > -1) {
		console.log(`您的cookie选择的是用&隔开\n`)
		CookieJDs = process.env.JD_COOKIE.split('&')
	} else if (process.env.JD_COOKIE.indexOf('\n') > -1) {
		console.log(`您的cookie选择的是用换行隔开\n`)
		CookieJDs = process.env.JD_COOKIE.split('\n')
	} else {
		CookieJDs = [process.env.JD_COOKIE]
	}
}
/*
if (JSON.stringify(process.env).indexOf('GITHUB')>-1) {
  console.log(`请勿使用github action运行此脚本,无论你是从你自己的私库还是其他哪里拉取的源代码，都会导致我被封号\n`);
  !(async () => {
   // await require('./sendNotify').sendNotify('提醒', `请勿使用github action、滥用github资源会封我仓库以及账号`)
   // await process.exit(0);
  })()
}
*/
CookieJDs = [...new Set(CookieJDs.filter(item => !!item))]
console.log(`\n====================共有${CookieJDs.length}个京东账号Cookie=========\n`)
console.log(
	`==================脚本执行- 北京时间(UTC+8)：${new Date(
		new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000 + 8 * 60 * 60 * 1000
	).toLocaleString()}=====================\n`
)
if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {}
for (let i = 0; i < CookieJDs.length; i++) {
	const index = i + 1 === 1 ? '' : i + 1
	exports['CookieJD' + index] = CookieJDs[i].trim()
}
