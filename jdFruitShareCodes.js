/*
东东农场互助码
此文件为Node.js专用。其他用户请忽略
支持京东N个账号
 */
//云服务器腾讯云函数等NOde.js用户在此处填写京东东农场的好友码。
// 同一个京东账号的好友互助码用@符号隔开,不同京东账号之间用&符号或者换行隔开,下面给一个示例
// 如: 京东账号1的shareCode1@京东账号1的shareCode2&京东账号2的shareCode1@京东账号2的shareCode2
let FruitShareCodes = [
   //账号一的好友shareCode,不同好友的shareCode中间用@符号隔开
  '5d419f12f9ae473083c76e1f3a34c3e1@567fd3bbeeb6456591bd691f8da17e18@8c7859f6aa5b4460979b0783e7352df5@001d7fff22ab412abfa13cbb31a85783@e55d5fbd66f942d9adeafd632f6d0d3b@a8e17c0aa6b54144adb2e5ea6ec8fbbe@995aa81002144b1a8a26148f32547b0c@6eea3748f6534d47862e78706c87e6dc@a8e17c0aa6b54144adb2e5ea6ec8fbbe@fdcfaa2e1f824eb68581095132038ee8@8ad506fff12a455982fcc9c6d319e5dd',
  //账号二的好友shareCode,不同好友的shareCode中间用@符号隔开
  '5d419f12f9ae473083c76e1f3a34c3e1@567fd3bbeeb6456591bd691f8da17e18@8c7859f6aa5b4460979b0783e7352df5@001d7fff22ab412abfa13cbb31a85783@e55d5fbd66f942d9adeafd632f6d0d3b@a8e17c0aa6b54144adb2e5ea6ec8fbbe@995aa81002144b1a8a26148f32547b0c@6eea3748f6534d47862e78706c87e6dc@a8e17c0aa6b54144adb2e5ea6ec8fbbe@fdcfaa2e1f824eb68581095132038ee8@8ad506fff12a455982fcc9c6d319e5dd',
 ]
// 判断github action里面是否有水果互助码
if (process.env.FRUITSHARECODES) {
  if (process.env.FRUITSHARECODES.indexOf('&') > -1) {
    console.log(`您的东东农场互助码选择的是用&隔开\n`)
    FruitShareCodes = process.env.FRUITSHARECODES.split('&');
  } else if (process.env.FRUITSHARECODES.indexOf('\n') > -1) {
    console.log(`您的东东农场互助码选择的是用换行隔开\n`)
    FruitShareCodes = process.env.FRUITSHARECODES.split('\n');
  } else {
    FruitShareCodes = process.env.FRUITSHARECODES.split();
  }
} else if (process.env.JD_COOKIE) {
  console.log(`由于您secret里面未提供助力码，故此处运行将会给脚本内置的码进行助力，请知晓！`)
}
for (let i = 0; i < FruitShareCodes.length; i++) {
  const index = (i + 1 === 1) ? '' : (i + 1);
  exports['FruitShareCode' + index] = FruitShareCodes[i];
}
