sed -i "/\(jd_bean_sign.js\|jd_blueCoin.js\|jd_joy_reawrd.js\|jd_joy_steal.js\|jd_joy_feedPets.js\)/!s/node/sleep \$((RANDOM % \$RANDOM_DELAY_MAX)); node/g" $1
