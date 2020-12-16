#必须要的默认定时任务请勿删除
52 */1 * * * sh /scripts/docker/default_task.sh | ts >> /scripts/logs/default_task.log 2>&1
# 每3天的23:50分清理一次日志
50 23 */3 * * rm -rf /scripts/logs/*.log

##############短期活动##############
# 秒杀红包雨(2020.12.31活动过期)
40 8 1-31 12 * node /scripts/jd_ms_redrain.js | ts >> /scripts/logs/jd_ms_redrain.log 2>&1
# 健康抽奖机(2020.12.31活动过期)
10 0 1-31 12 * node /scripts/jd_health.js | ts >> /scripts/logs/jd_health.log 2>&1
# 直播红包雨(2020.12.31活动过期)
1 0,20,9-23/2 15-31 12 * node /scripts/jd_live_redrain.js | ts >> /scripts/logs/jd_live_redrain.log 2>&1
# 京东金融打卡领年终奖(2020.12.31活动过期)
10 6 1-31 12 * node /scripts/jr_sign.js | ts >> /scripts/logs/jr_sign.log 2>&1
# 京东健康APP集汪汪卡瓜分百万红包(2021.1.6活动过期)
10 8 * * * node /scripts/jd_jdh.js | ts >> /scripts/logs/jd_jdh.log 2>&1

##############长期活动##############
# 签到
0 0,12,18 * * * cd /scripts && node jd_bean_sign.js | ts >> /scripts/logs/jd_bean_sign.log 2>&1
# 京小超兑换奖品
0 0 * * * node /scripts/jd_blueCoin.js | ts >> /scripts/logs/jd_blueCoin.log 2>&1
# 摇京豆
0 0 * * * node /scripts/jd_club_lottery.js | ts >> /scripts/logs/jd_club_lottery.log 2>&1
# 东东农场
5 6-18/6 * * * node /scripts/jd_fruit.js | ts >> /scripts/logs/jd_fruit.log 2>&1
# 宠汪汪
15 */2 * * * node /scripts/jd_joy.js | ts >> /scripts/logs/jd_joy.log 2>&1
# 宠汪汪喂食
15 */1 * * * node /scripts/jd_joy_feedPets.js | ts >> /scripts/logs/jd_joy_feedPets.log 2>&1
# 宠汪汪积分兑换奖品
0 0-16/8 * * * node /scripts/jd_joy_reward.js | ts >> /scripts/logs/jd_joy_reward.log 2>&1
# 宠汪汪偷好友积分与狗粮
0 0,6 * * * node /scripts/jd_joy_steal.js | ts >> /scripts/logs/jd_joy_steal.log 2>&1
# 摇钱树
0 */2 * * * node /scripts/jd_moneyTree.js | ts >> /scripts/logs/jd_moneyTree.log 2>&1
# 东东萌宠
5 6-18/6 * * * node /scripts/jd_pet.js | ts >> /scripts/logs/jd_pet.log 2>&1
# 京东种豆得豆
0 7-22/1 * * * node /scripts/jd_plantBean.js | ts >> /scripts/logs/jd_plantBean.log 2>&1
# 京东全民开红包
1 1 * * * node /scripts/jd_redPacket.js | ts >> /scripts/logs/jd_redPacket.log 2>&1
# 进店领豆
10 0 * * * node /scripts/jd_shop.js | ts >> /scripts/logs/jd_shop.log 2>&1
# 京东天天加速
8 */3 * * * node /scripts/jd_speed.js | ts >> /scripts/logs/jd_speed.log 2>&1
# 东东超市
11 1-23/5 * * * node /scripts/jd_superMarket.js | ts >> /scripts/logs/jd_superMarket.log 2>&1
# 取关京东店铺商品
55 23 * * * node /scripts/jd_unsubscribe.js | ts >> /scripts/logs/jd_unsubscribe.log 2>&1
# 京豆变动通知
0 10 * * * node /scripts/jd_bean_change.js | ts >> /scripts/logs/jd_bean_change.log 2>&1
# 京东抽奖机
11 1 * * * node /scripts/jd_lotteryMachine.js | ts >> /scripts/logs/jd_lotteryMachine.log 2>&1
# 京东排行榜
11 9 * * * node /scripts/jd_rankingList.js | ts >> /scripts/logs/jd_rankingList.log 2>&1
# 天天提鹅
18 * * * * node /scripts/jd_daily_egg.js | ts >> /scripts/logs/jd_daily_egg.log 2>&1
# 金融养猪
12 * * * * node /scripts/jd_pigPet.js | ts >> /scripts/logs/jd_pigPet.log 2>&1
# 点点券
20 0,20 * * * node /scripts/jd_necklace.js | ts >> /scripts/logs/jd_necklace.log 2>&1
# 京喜工厂
20 * * * * node /scripts/jd_dreamFactory.js | ts >> /scripts/logs/jd_dreamFactory.log 2>&1
# 东东小窝
16 6 * * * node /scripts/jd_small_home.js | ts >> /scripts/logs/jd_small_home.log 2>&1
# 东东工厂
36 * * * * node /scripts/jd_jdfactory.js | ts >> /scripts/logs/jd_jdfactory.log 2>&1
# 十元街
36 8,18 * * * node /scripts/jd_syj.js | ts >> /scripts/logs/jd_syj.log 2>&1
# 京东代属(注:限校园用户可使用)
36 9 * * * node /scripts/jd_ds.js | ts >> /scripts/logs/jd_ds.log 2>&1
# 京东快递签到
23 1 * * * node /scripts/jd_kd.js | ts >> /scripts/logs/jd_kd.log 2>&1
# 京东汽车(签到满500赛点可兑换500京豆)
33 2 * * * node /scripts/jd_car.js | ts >> /scripts/logs/jd_car.log 2>&1
# 领京豆额外奖励(每日可获得3京豆)
33 4 * * * node /scripts/jd_bean_home.js | ts >> /scripts/logs/jd_bean_home.log 2>&1
# 京东直播(每日18豆)
10-20/5 11 * * * node /scripts/jd_live.js | ts >> /scripts/logs/jd_live.log 2>&1
#微信小程序京东赚赚
10 11 * * * node /scripts/jd_jdzz.js | ts >> /scripts/logs/jd_jdzz.log 2>&1
#宠汪汪邀请助力
10 10,11 * * * node /scripts/jd_joy_run.js >> /scripts/logs/jd_joy_run.log 2>&1
