#!/bin/bash
sysname=$(hostname)
while :
do
    # node redisAlert.js "no"
    cpuOutput=$(python /Monitoring/Monitor/cpuMonitor.py)
    if [ $cpuOutput -gt 60 ]; then
        echo The CPU usage is high. $cpuOutput%  | mail -s "High CPU usage for $sysname" mittal.apoorv91@gmail.com
        # node redisAlert.js "yes"
    fi
    memOutput=$(python /Monitoring/Monitor/memoryMonitor.py)
    if [ $memOutput -gt 30 ]; then
        echo The Memory usage is high. $memOutput% | mail -s "High memory usage for $sysname" mittal.apoorv91@gmail.com
        # node redisAlert.js "yes"
    fi
    sleep 2m
done


