# coding: utf-8
# author: zero205
# desc: 随机延时，避免同时运行造成任务堵塞
# license: https://github.com/zero205/JD

print (u"执行随机延时，请耐心等待")
import string
import random
import time
time.sleep(random.randint(1,60))
print (u"执行完毕，开始运行脚本")
