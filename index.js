'use strict';
exports.main_handler = async (event, context, callback) => {
    for (const v of event["Message"].split("\r\n")) {
        console.log(v);
        var request = require('request');
        request('https://gitee.com/lxk0301/jd_scripts/raw/master/'+v+'.js', function (error, response, body) {
            eval(response.body)
        })
    }
}
