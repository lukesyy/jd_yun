![Docker Pulls](https://img.shields.io/docker/pulls/lxk0301/jd_scripts?style=for-the-badge)
### Usage
```diff
+ 2021-01-03更新 增加 CUSTOM_SHELL_FILE 参数配置执行自定义shell脚本
+ 例1:配置远程shell脚本, 我自己写了一个shell脚本https://raw.githubusercontent.com/iouAkira/someDockerfile/master/jd_scripts/shell_script_mod.sh 内容很简单下载惊喜农场并添加定时任务
+ CUSTOM_SHELL_FILE=https://raw.githubusercontent.com/iouAkira/someDockerfile/master/jd_scripts/shell_script_mod.sh
+
+ 例2:配置docker挂载本地自定义shell脚本,/scripts/docker/shell_script_mod.sh 为你在docker-compose.yml里面挂载到容器里面绝对路径
+ CUSTOM_SHELL_FILE=/scripts/docker/shell_script_mod.sh
+
+ tip：如果使用远程自定义，请保证网络畅通或者选择合适的国内仓库，例如有部分人的容器里面就下载不到github的raw文件，那就可以把自己的自定义shell写在gitee上，或者换本地挂载
+      如果是 docker 挂载本地，请保重文件挂载进去了，并且配置的是绝对路径。
+      自定义 shell 脚本里面如果要加 crontab 任务请使用 echo 追加到 /scripts/docker/merged_list_file.sh 里面否者不生效
+ 注⚠️ 建议无shell能力的不要轻易使用，当然你可以找别人写好适配了这个docker镜像的脚本直接远程配置
+     上面写了这么多如果还看不懂，不建议使用该变量功能。
_____
! ⚠️⚠️⚠️2020-12-11更新镜像启动方式，虽然兼容旧版的运行启动方式，但是强烈建议更新镜像和配置后使用
! 更新后`command:`指令配置不再需要
! 更新后可以使用自定义任务文件追加在默任务文件之后，比以前的完全覆盖多一个选择
! - 新的自定两个环境变量为 `CUSTOM_LIST_MERGE_TYPE`:自定文件的生效方式可选值为`append`，`overwrite`默认为`append` ; `CUSTOM_LIST_FILE`: 自定义文件的名字
! 更新镜像增减镜像更新通知，以后镜像如果更新之后，会通知用户更新
```
> 推荐使用`docker-compose`所以这里只介绍`docker-compose`使用方式

- `docker-compose` 安装（群晖nas docker自带安装了docker-compose）
```
sudo curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```
`Ubuntu`用户快速安装`docker-compose`
```
sudo apt-get update && sudo apt-get install -y python3-pip curl vim git moreutils
pip3 install --upgrade pip
pip install docker-compose
```

通过`docker-compose version`查看`docker-compose`版本，确认是否安装成功。

- `Docker`安装 
国内一键安装 `sudo curl -sSL https://get.daocloud.io/docker | sh`
国外一键安装 `sudo curl -sSL get.docker.com | sh`

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
- `jd_scripts/docker-compose.yml` 参考内容如下(自己动手能力不行搞不定请使用默认配置)：
- - [使用默认配置用这个](./example/default.yml)
- - [使用自定义任务追加到默认任务之后用这个](./example/custom-append.yml)
- - [使用自定义任务覆盖默认任务用这个](./example/custom-overwrite.yml)
- - [一次启动多容器并发用这个](./example/multi.yml)
- - [使用群晖默认配置用这个](./example/jd_scripts.syno.json)
- - [使用群晖自定义任务追加到默认任务之后用这个](./example/jd_scripts.custom-append.syno.json)
- - [使用群晖自定义任务覆盖默认任务用这个](./example/jd_scripts.custom-overwrite.syno.json)
- `jd_scripts/docker-compose.yml`里面的环境变量(`environment:`)配置[参考这里](https://github.com/LXK9301/jd_scripts/blob/master/githubAction.md#%E4%B8%8B%E6%96%B9%E6%8F%90%E4%BE%9B%E4%BD%BF%E7%94%A8%E5%88%B0%E7%9A%84-secrets%E5%85%A8%E9%9B%86%E5%90%88)


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
- 目录文件配置好之后在 `jd_scripts`目录执行。  
 `docker-compose up -d` 启动（修改docker-compose.yml后需要使用此命令使更改生效）；  
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

