const notify = require('../sendNotify');

function image_update_notify() {
    notify.sendNotify("⚠️Docker镜像版本更新通知⚠️", process.env.NOTIFY_CONTEXT)
}

image_update_notify();