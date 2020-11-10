/*
此文件为Node.js专用。其他用户请忽略
 */
//此处填写京东账号cookie。
//注：github action用户cookie填写到Settings-Secrets里面，新增JD_COOKIE，多个账号的cookie使用`&`隔开或者换行
let CookieJDs = [
  'pt_pin=%E8%A2%AB%E6%8A%98%E5%8F%A0%E7%9A%84%E8%AE%B0%E5%BF%8633;pt_key=AAJfiEZzAEDRcGffuD7SjMtkggHav_tLEGQKrHATc0-csk8i8YmsFG61dBic6NcF_nzF1KafS8Qk6ifcsjZlccpY4Rol4A6M;',//账号一ck,例:pt_key=XXX;pt_pin=XXX;
  'pt_key=AAJfqJhcADACx6FPR_HewSd5qCm4U6lFrP3ReM_8DVmk2eM7I9F56fchBgR8-c4OUksXLJvmCJI;pt_pin=jd_6cd93e613b0e5;',//账号二ck,例:pt_key=XXX;pt_pin=XXX;如有更多,依次类推
  'pt_key=AAJfjkvZADB1lVyfAmTB_If3sJx1mg-Me8lkuh5abTAdKyf49gjluPmpk4SHM-XPr8uHK9YfLgk;pt_pin=jd_45a6b5953b15b;',//账号二ck,例:pt_key=XXX;pt_pin=XXX;如有更多,依次类推
  'pt_key=AAJfgq5SADBPKbwp5VJnCH-W6EmlrD--P602-NGWVGqQXxw4dYeu42B9VYq6XanrCHOsa7_HSuU;pt_pin=jd_704a2e5e28a66;',//账号二ck,例:pt_key=XXX;pt_pin=XXX;如有更多,依次类推
  'pt_key=AAJfjE-CADDTKbmisaX-EPer8Ybbasq1GuhYteIiL59Hka9tLLm-RilSF9Viprwqmj9x2jWcMG0;pt_pin=zooooo58;',//账号二ck,例:pt_key=XXX;pt_pin=XXX;如有更多,依次类推
  'pt_key=AAJfkAlBADBm3nXsIQiNrFmv2gqs0EBTiKBcqglVoA6B22Shhbdx7Pf6275G7ouuZNk7dhgcXfc;pt_pin=jd_5851f32d4a083;',//账号二ck,例:pt_key=XXX;pt_pin=XXX;如有更多,依次类推

  'pt_key=AAJfn9QgADC_R9SmgqVGq1RY2612YbvEOx5hk7_3yRLnfULIyQ-VXVo5DXa4ff6BpqnvN7Y4dVA;pt_pin=jd_479264ad454f0;',//账号二ck,例:pt_key=XXX;pt_pin=XXX;如有更多,依次类推
]
// 判断github action里面是否有京东ck
if (process.env.JD_COOKIE) {
  if (process.env.JD_COOKIE.indexOf('&') > -1) {
    console.log(`您的cookie选择的是用&隔开\n`)
    CookieJDs = process.env.JD_COOKIE.split('&');
  } else if (process.env.JD_COOKIE.indexOf('\n') > -1) {
    console.log(`您的cookie选择的是用换行隔开\n`)
    CookieJDs = process.env.JD_COOKIE.split('\n');
  } else {
    CookieJDs = process.env.JD_COOKIE.split();
  }
  console.log(`\n====================共有${CookieJDs.length}个京东账号Cookie=========\n`);
  console.log(`==================脚本执行- 北京时间(UTC+8)：${new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString()}=====================\n`)
  // console.log(`\n==================脚本执行来自 github action=====================\n`)
}
for (let i = 0; i < CookieJDs.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['CookieJD' + index] = CookieJDs[i];
}
