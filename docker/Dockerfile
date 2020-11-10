FROM alpine
MAINTAINER Akira <e.akimoto.akira@gmail.com>

RUN set -ex \
        && apk update && apk upgrade\
        && apk add --no-cache tzdata git nodejs npm\
        && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
        && echo "Asia/Shanghai" > /etc/timezone

RUN git clone https://github.com/lxk0301/scripts /scripts \
        && cd /scripts \
        && mkdir logs \
        && npm install \
        && cd ~ \
        && npm install request

ENV CDN_JD_DAILYBONUS true

RUN crontab /scripts/docker/crontab_list.sh

WORKDIR /scripts

CMD ["node"]
