FROM alpine
MAINTAINER Akira <e.akimoto.akira@gmail.com>

RUN set -ex \
        && apk update && apk upgrade\
        && apk add --no-cache tzdata moreutils git nodejs npm\
        && ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
        && echo "Asia/Shanghai" > /etc/timezone

RUN git clone https://github.com/lxk0301/jd_scripts /scripts \
        && cd /scripts \
        && mkdir logs \
        && npm install \
        && cd ~ \
        && npm install request

ENV CRONTAB_LIST_FILE crontab_list_ts.sh

RUN crontab /scripts/docker/crontab_list_ts.sh

WORKDIR /scripts

CMD ["node"]