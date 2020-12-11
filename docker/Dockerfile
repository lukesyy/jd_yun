FROM alpine
LABEL AUTHOR="Akira <e.akimoto.akira@gmail.com>" \
        VERSION=0.1.2 \
        UPDATE_CONTENT="更新内容较多，重新阅读仓库[Readme](https://github.com/lxk0301/jd_scripts/tree/master/docker)，更新镜像并更新配置后使用。"

RUN set -ex \
        && apk update && apk upgrade\
        && apk add --no-cache tzdata moreutils git nodejs npm curl jq\
        && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
        && echo "Asia/Shanghai" > /etc/timezone

RUN git clone https://github.com/lxk0301/jd_scripts /scripts \
        && cd /scripts \
        && git checkout master \
        && mkdir logs \
        && npm install \
        && cd /tmp \
        && npm install request

ENV BUILD_VERSION=0.1.2 \
    DEFAULT_LIST_FILE=crontab_list.sh \
    CUSTOM_LIST_MERGE_TYPE=append

# github action 构建    
COPY ./docker/docker_entrypoint.sh /usr/local/bin
# 本地构建
# COPY ./docker_entrypoint.sh /usr/local/bin
RUN chmod +x /usr/local/bin/docker_entrypoint.sh

WORKDIR /scripts

ENTRYPOINT ["docker_entrypoint.sh"]
