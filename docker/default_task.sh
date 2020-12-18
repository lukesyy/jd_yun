#!/bin/sh
set -e

echo "定时任务更新代码，git 拉取最新代码，并安装更新依赖..."
git -C /scripts pull
npm install --prefix /scripts

######################################获取docker构建文件里面的自定义信息方法-start#####################################################
function getDockerImageLabel() {
    repo=akyakya/jd_scripts
    imageTag=latest
    token=$(curl -s "https://auth.docker.io/token?service=registry.docker.io&scope=repository:${repo}:pull" | jq -r '.token')
    digest=$(curl -s -H "Accept: application/vnd.docker.distribution.manifest.v2+json" -H "Authorization: Bearer $token" "https://registry-1.docker.io/v2/${repo}/manifests/${imageTag}" | jq .config.digest -r)
    labels=$(curl -s -L -H "Accept: application/vnd.docker.distribution.manifest.v2+json" -H "Authorization: Bearer $token" "https://registry-1.docker.io/v2/${repo}/blobs/$digest" | jq .config.Labels)
    echo $labels
}
######################################获取docker构建文件里面的自定义信息方法-end#####################################################

######################################对比版本版本号大小方法-start###################################################################
function version_gt() {
    test "$(printf '%s\n' "$@" | sort -V | head -n 1)" != "$1"
}
######################################对比版本版本号大小方法-end###################################################################

#######################################通知用户更新镜像-start#####################################################################
echo "检查docker镜像更新更新..."
if type jq >/dev/null 2>&1; then
    echo "获取dockerhub仓库镜像labels信息..."
    labels=$(getDockerImageLabel)
    export NOTIFY_CONTENT=$(echo $labels | jq -r .UPDATE_CONTENT)
    version=$(echo $labels | jq -r .VERSION)
else
    # 第一版通知逻辑无法包含在上面判断里面，镜像构建好直接开启通知
    echo "当前容版版本过旧，发送镜像更新通知"
    export NOTIFY_CONTENT="更新内容较多，重新阅读仓库Readme(https://github.com/lxk0301/jd_scripts/tree/master/docker)，更新镜像并更新配置后使用。"
    cd /scripts/docker
    node notify_docker_user.js
fi

#通知通知用户更新镜像
if [ ! $BUILD_VERSION ]; then
    if [ $version ]; then
        echo "当前容器版本为空，dockerhub仓库版本为$version，发送通知"
        cd /scripts/docker
        node notify_docker_user.js
    fi
else
    if version_gt $version $BUILD_VERSION; then
        echo "当前容器版本为$BUILD_VERSION，dockerhub仓库版本为$version，发送通知"
        cd /scripts/docker
        node notify_docker_user.js
    fi
fi
#######################################通知用户更新镜像-end#####################################################################

##兼容旧镜像的环境变量
if [ !$DEFAULT_LIST_FILE ]; then
    defaultListFile="/scripts/docker/crontab_list.sh"
else
    defaultListFile="/scripts/docker/$DEFAULT_LIST_FILE"
fi

customListFile="/scripts/docker/$CUSTOM_LIST_FILE"
mergedListFile="/scripts/docker/merged_list_file.sh"

if type ts >/dev/null 2>&1; then
    echo '系统已安装moreutils工具包，默认定时任务增加｜ts 输出'
    ##复制一个新文件来追加|ts，防止git pull的时候冲突
    cp $defaultListFile /scripts/docker/default_list.sh
    defaultListFile="/scripts/docker/default_list.sh"

    sed -i 's/>>/|ts >>/g' $defaultListFile
fi

echo "定时任务合并加载最新定时任务列表..."
#判断 自定义文件是否存在 是否存在
if [ $CUSTOM_LIST_FILE ]; then
    echo "您配置了自定义任务文件：$CUSTOM_LIST_FILE，自定义任务类型为：$CUSTOM_LIST_MERGE_TYPE..."
    if [ -f "$customListFile" ]; then
        if [ $CUSTOM_LIST_MERGE_TYPE == "append" ]; then
            echo "合并默认定时任务文件：$DEFAULT_LIST_FILE 和 自定义定时任务文件：$CUSTOM_LIST_FILE"
            cat $defaultListFile >$mergedListFile
            echo -e "" >>$mergedListFile
            cat $customListFile >>$mergedListFile
        elif [ $CUSTOM_LIST_MERGE_TYPE == "overwrite" ]; then
            cat $customListFile >$mergedListFile
            echo "$CUSTOM_LIST_FILE but file ..."
            echo "配置了自定义任务文件：$CUSTOM_LIST_FILE，自定义任务类型为：$CUSTOM_LIST_MERGE_TYPE..."
            touch "$customListFile"
        else
            echo "配置配置了错误的自定义定时任务类型：$CUSTOM_LIST_MERGE_TYPE，自定义任务类型为只能为append或者overwrite..."
            cat $defaultListFile >$mergedListFile
        fi
    else
        echo "配置的自定义任务文件：$CUSTOM_LIST_FILE未找到，使用默认配置$DEFAULT_LIST_FILE..."
        cat $defaultListFile >$mergedListFile
    fi
else
    echo "当前使用的为默认定时任务文件 $DEFAULT_LIST_FILE ..."
    cat $defaultListFile >$mergedListFile
fi

# 判断最后要加载的定时任务是否包含默认定时任务，不包含的话就加进去
if [ $(grep -c "default_task.sh" $mergedListFile) -eq '0' ]; then
    echo "合并后的定时任务文件，未包含必须的默认定时任务，增加默认定时任务..."
    echo -e >>$mergedListFile
    echo "52 */1 * * * sh /scripts/docker/default_task.sh |ts >> /scripts/logs/default_task.log 2>&1" >>$mergedListFile
fi

if [ $RANDOM_DELAY_MAX -ge 1 ]; then
    echo "已设置随机延迟为 $RANDOM_DELAY_MAX , 设置延迟任务中... "
    source replaceNode_withRandomSleep.sh $mergedListFile
fi

echo "加载最新的定时任务文件..."
crontab $mergedListFile
