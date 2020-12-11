const notify = require('../sendNotify');

function image_update_notify() {
    if (process.env.NOTIFY_CONTENT) {
        notify.sendNotify("⚠️Docker镜像版本更新通知⚠️", process.env.NOTIFY_CONTENT)
    }
}

image_update_notify();