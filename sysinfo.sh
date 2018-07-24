#!/bin/bash
WC=$(/sbin/wc -l /你放置本程式的目錄/sysload | /sbin/awk '{printf $1}')
if [ "$WC" -gt 5760 ]; then
> /你放置本程式的目錄/sysload
fi
/sbin/date +"%s" | /sbin/awk '{printf "%d\t", $0}' >> /你放置本程式的目錄/sysload
/sbin/free -m | /sbin/awk 'NR==2{printf "%s\t%s\t", $3,$2}' >> /你放置本程式的目錄/sysload
/sbin/df -h | /sbin/awk '$NF=="/"{printf "%d\t%d\t", $3,$2}' >> /你放置本程式的目錄/sysload
/sbin/vnstat --oneline | /sbin/awk -F ";" '{printf "%s\t", $11}' >> /你放置本程式的目錄/sysload
/opt/vc/bin/vcgencmd measure_temp | /sbin/awk -F "=" '{printf "%s\t",$2}' >> /你放置本程式的目錄/sysload
/sbin/top -bn1 | /sbin/grep load | /sbin/awk '{printf "%.2f\n", $(NF-2)}' >> /你放置本程式的目錄/sysload
