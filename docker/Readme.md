### Usage
> 推荐使用`docker-compose`所以这里只介绍`docker-compose`使用方式

- `docker-compose` 安装（群晖nas docker自带安装了docker-compose）
```
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```
### 如果需要使用 docker 多个账户独立并发执行定时任务，[参考这里](https://github.com/iouAkira/scripts/blob/patch-1/docker/docker%E5%A4%9A%E8%B4%A6%E6%88%B7%E4%BD%BF%E7%94%A8%E7%8B%AC%E7%AB%8B%E5%AE%B9%E5%99%A8%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E.md#%E4%BD%BF%E7%94%A8%E6%AD%A4%E6%96%B9%E5%BC%8F%E8%AF%B7%E5%85%88%E7%90%86%E8%A7%A3%E5%AD%A6%E4%BC%9A%E4%BD%BF%E7%94%A8docker%E5%8A%9E%E6%B3%95%E4%B8%80%E7%9A%84%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F)   
> 注⚠️：前提先理解学会使用这下面的教程
### 创建一个目录`jd_scripts`用于存放备份配置等数据，迁移重装的时候只需要备份整个jd_scripts目录即可
需要新建的目录文件结构参考如下:
```
jd_scripts
├── logs
│   ├── XXXX.log
│   └── XXXX.log
├── my_crontab_list.sh
└── docker-compose.yml
```
- `jd_scripts/logs`建一个空文件夹就行
- `jd_scripts/docker-compose.yml` 参考内容如下：
- `jd_scripts/docker-compose.yml`里面的环境变量(`environment:`)配置[参考这里](https://github.com/lxk0301/jd_scripts/blob/master/githubAction.md#%E4%B8%8B%E6%96%B9%E6%8F%90%E4%BE%9B%E4%BD%BF%E7%94%A8%E5%88%B0%E7%9A%84-secrets%E5%85%A8%E9%9B%86%E5%90%88)
```yaml
jd_scripts:
jd_scripts:
  image: akyakya/jd_scripts
  container_name: jd_scripts
  restart: always
  #如果需要自定定义定时任务的需要自己写好`my_crontab_list.sh`文件 ，取消下面的挂载注释 ，通过 `volumes`挂载进去。
  volumes:
  #  - ./my_crontab_list.sh:/scripts/docker/my_crontab_list.sh
    - ./logs:/scripts/logs
  tty: true
  environment:
    # 注意环境变量填写值的时候一律不需要引号（""或者''）下面这些只是事例，根据自己的需求增加删除
    #jd cookies
    # 例: JD_COOKIE=pt_key=XXX;pt_pin=XXX
    - JD_COOKIE=
    #微信server酱通
    - PUSH_KEY=
    #Bark App通知
    - BARK_PUSH=
    #telegram机器人通知
    - TG_BOT_TOKEN=
    - TG_USER_ID=
    #钉钉机器人通知
    - DD_BOT_TOKEN=
    - DD_BOT_SECRET=
    #京东种豆得豆
    - PLANT_BEAN_SHARECODES=
    #京东农场
    # 例: FRUITSHARECODES=京东农场的互助码
    - FRUITSHARECODES=
    #京东萌宠
    # 例: PETSHARECODES=东东萌宠的互助码
    - PETSHARECODES=
    # 宠汪汪的喂食数量
    - JOY_FEED_COUNT=
    #京小超
    # - SUPERMARKET_SHARECODES=
    #兑换多少数量的京豆（20，或者1000京豆,或者其他奖品的文字）
    # 例: MARKET_COIN_TO_BEANS=1000
    - MARKET_COIN_TO_BEANS=
    #是否开启debug模式打印日志
    # 例: JD_DEBUG=false
    - JD_DEBUG=
    #如果使用自定义定时任务,取消下面一行的注释
    #- CRONTAB_LIST_FILE=my_crontab_list.sh
  command:
    - /bin/sh
    - -c
    - |
      #crontab /scripts/docker/my_crontab_list.sh  #如果挂载了自定义任务文件,取消此条注释即可
      crond
      git -C /scripts/ pull
      node
```
- `jd_scripts/my_crontab_list.sh` 参考内容如下,自己根据需要调整增加删除，不熟悉用户推荐使用默认配置：

```shell
0 */1 * * * git -C /scripts/ pull |ts >> /scripts/logs/pull.log 2>&1
2 0 * * * cd /scripts && node jd_bean_sign.js >> /scripts/logs/jd_bean_sign.log 2>&1
2 0 * * * node /scripts/jd_blueCoin.js >> /scripts/logs/jd_blueCoin.log 2>&1
2 0 * * * node /scripts/jd_club_lottery.js >> /scripts/logs/jd_club_lottery.log 2>&1
20 6-18/6 * * * node /scripts/jd_fruit.js >> /scripts/logs/jd_fruit.log 2>&1
*/20 */1 * * * node /scripts/jd_joy_feedPets.js >> /scripts/logs/jd_joy_feedPets.log 2>&1
0 0,4,8,16 * * * node /scripts/jd_joy_reward.js >> /scripts/logs/jd_joy_reward.log 2>&1
0 1,6 * * * node /scripts/jd_joy_steal.js >> /scripts/logs/jd_joy_steal.log 2>&1
0 0,1,4,10,15,16 * * * node /scripts/jd_joy.js >> /scripts/logs/jd_joy.log 2>&1
40 */3 * * * node /scripts/jd_moneyTree.js >> /scripts/logs/jd_moneyTree.log 2>&1
35 23,4,10 * * * node /scripts/jd_pet.js >> /scripts/logs/jd_pet.log 2>&1
0 23,0-13/1 * * * node /scripts/jd_plantBean.js >> /scripts/logs/jd_plantBean.log 2>&1
2 0 * * * node /scripts/jd_redPacket.js >> /scripts/logs/jd_redPacket.log 2>&1
3 0 * * * node /scripts/jd_shop.js >> /scripts/logs/jd_shop.log 2>&1
15 * * * * node /scripts/jd_superMarket.js >> /scripts/logs/jd_superMarket.log 2>&1
55 23 * * * node /scripts/jd_unsubscribe.js >> /scripts/logs/jd_unsubscribe.log 2>&1
```
> 定时任务命之后，也就是 `>>` 符号之前加上 `|ts` 可在日志每一行前面显示时间，如下图:
> ![image](https://user-images.githubusercontent.com/6993269/99031839-09e04b00-25b3-11eb-8e47-0b6515a282bb.png)
- 目录文件配置好之后在 `jd_scripts`目录执行  
 `docker-compose up -d` 启动；  
 `docker-compose logs` 打印日志；  
 `docker-compose pull` 更新镜像；  
 `docker-compose stop` 停止容器；  
 `docker-compose restart` 重启容器；  
 `docker-compose down` 停止并删除容器；  
 
- 如果是群晖用户，在docker注册表搜jd_scripts，双击下载映像。
不需要docker-compose.yml，只需建个logs/目录，调整`jd_scripts.syno.json`里面对应的配置值，然后导入json配置新建容器。
若要自定义my_crontab_list.sh，再建个my_crontab_list.sh文件，配置参考`jd_scripts.my_crontab_list.syno.json`。
![image](https://user-images.githubusercontent.com/6993269/99024743-32ac1480-25a2-11eb-8c0f-3cb3be90d54c.png)

![image](https://user-images.githubusercontent.com/6993269/99024803-4ce5f280-25a2-11eb-9693-60e8910c182c.png)

![image](https://user-images.githubusercontent.com/6993269/99024832-6424e000-25a2-11eb-8e31-287771f42ad2.png)

