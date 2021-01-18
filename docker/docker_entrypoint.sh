#!/bin/sh
set -e

#获取配置的自定义参数
if [ $1 ]; then
    run_cmd=$1
fi

echo "设定远程仓库地址..."
cd /scripts
git remote set-url origin $REPO_URL
git reset --hard
echo "git pull拉取最新代码..."
git -C /scripts pull --rebase
echo "npm install 安装最新依赖"
npm install --prefix /scripts

echo "------------------------------------------------执行定时任务任务shell脚本------------------------------------------------"
sh -x /scripts/docker/default_task.sh
echo "--------------------------------------------------默认定时任务执行完成---------------------------------------------------"

if [ $run_cmd ]; then
    echo "Start crontab task main process..."
    echo "启动crondtab定时任务主进程..."
    crond -f
else
    echo "默认定时任务执行结束。"
fi
