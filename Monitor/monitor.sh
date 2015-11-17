#!/bin/bash
sysname = $(hostname)
while :
do
    cpuOutput=$(python /Monitoring/Monitor/cpuMonitor.py)
    if [ $cpuOutput -gt 0 ]; then
        echo The CPU usage is high. $cpuOutput%  | mail -s "High CPU usage for $sysname" mittal.apoorv91@gmail.com
    fi
    memOutput=$(python /Monitoring/Monitor/memoryMonitor.py)
    if [ $memOutput -gt 0 ]; then
        echo The Memory usage is high. $memOutput% | mail -s "High memory usage for $sysname" mittal.apoorv91@gmail.com
    fi
    sleep 30s
done


