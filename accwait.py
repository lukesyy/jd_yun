import time
import datetime
import logging
import sys 
import random

padding = 1 # 提前时间
interval = 1 # 区间
minute = 59

if len(sys.argv) >= 2:
    padding = float(sys.argv[1])
if len(sys.argv) >= 3:
    interval = float(sys.argv[2])
if len(sys.argv) >= 4:
    minute = int(sys.argv[3])

if padding == 0 or interval == 0:
    second_setting = 0
    ms_setting = 0
else:
    start_time = 60 - padding - 0.5*interval
    second_setting = int(start_time)
    ms_setting = int((start_time - second_setting)*10**6)

target_time = datetime.datetime.now()

if target_time.minute > minute:
    target_time = target_time.replace(hour=target_time.hour+1,minute=minute, second=second_setting, microsecond=ms_setting)
else:
    target_time = target_time.replace(minute=minute, second=second_setting, microsecond=ms_setting)

i=0
while datetime.datetime.now() < target_time:
    i += 1
    if i % 300 == 0:
        logging.warn(f'{datetime.datetime.now()}未到{target_time}点')
    time.sleep(0.01)

time.sleep(random.random()*interval)
