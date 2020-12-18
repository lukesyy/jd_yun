sed -i "/\(jd_bean_sign.js\|jd_blueCoin.js\|jd_club_lottery.js\)/!s/node/sleep \$((RANDOM % $RANDOM_DELAY_MAX)); node/g" $1
