'use strict';
exports.main_handler = async (event, context, callback) => {
  require('./jd_xtg.js') //这里写你想要的脚本
  require('./jd_fruit.js') //这里写你想要的脚本
}
