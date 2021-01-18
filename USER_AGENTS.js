const USER_AGENTS = [
  "JD4iPhone/167490 (iPhone; iOS 14.3; Scale/2.00)",
  "JD4iPhone/9.3.5 CFNetwork/1209 Darwin/20.2.0",
  "JD4iPhone/167515 (iPhone; iOS 14.3; Scale/3.00)",
  "jdapp;iPhone;9.2.2;14.2;%E4%BA%AC%E4%B8%9C/9.2.2 CFNetwork/1206 Darwin/20.1.0",
  "jdapp;android;9.3.5;10;2346663656561603-4353564623932316;network/wifi;model/ONEPLUS A5010;addressid/138709979;aid/2dfceea045ed292a;oaid/;osVer/29;appBuild/86390;partner/jingdong;eufv/1;Mozilla/5.0 (Linux; Android 10; ONEPLUS A5010 Build/QKQ1.191014.012; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/77.0.3865.120 MQQBrowser/6.2 TBS/045230 Mobile Safari/537.36",
  "jdapp;iPhone;9.3.4;14.3;88732f840b77821b345bf07fd71f609e6ff12f43;network/4g;ADID/1C141FDD-C62F-425B-8033-9AAB7E4AE6A3;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone11,8;addressid/2005183373;supportBestPay/0;appBuild/167502;jdSupportDarkMode/0;pv/414.19;apprpd/Babel_Native;ref/TTTChannelViewContoller;psq/5;ads/;psn/88732f840b77821b345bf07fd71f609e6ff12f43|1701;jdv/0|iosapp|t_335139774|appshare|CopyURL|1610885480412|1610885486;adk/;app_device/IOS;pap/JA2015_311210|9.3.4|IOS 14.3;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
  "jdapp;iPhone;9.3.5;14.2.1;5675c7df49de13aeca1e98def1d789a3cf4c84a6;network/4g;ADID/D859DCC0-BC84-43ED-BD00-8062B9EE7EA6;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone13,3;addressid/10567892;supportBestPay/0;appBuild/167515;jdSupportDarkMode/0;pv/2783.6;apprpd/CollectCash_Main;ref/JDCashRewardHomeViewController;psq/0;ads/;psn/5675c7df49de13aeca1e98def1d789a3cf4c84a6|5166;jdv/0|iosapp|t_335139774|appshare|Wxfriends|1610942682431|1610942686;adk/;app_device/IOS;pap/JA2015_311210|9.3.5|IOS 14.2.1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/",
]
/**
 * 生成随机数字
 * @param {number} min 最小值（包含）
 * @param {number} max 最大值（不包含）
 */
function randomNumber(min = 0, max = 100) {
  return Math.min(Math.floor(min + Math.random() * (max - min)), max);
}
const USER_AGENT = USER_AGENTS[randomNumber(0, USER_AGENTS.length)];

module.exports = {
  USER_AGENT
}
