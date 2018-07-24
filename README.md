Node.js based Raspberry pi監控器
=====================

設計目的&使用場景
---------------
1. 想看到Raspberry pi的機身溫度、記憶體占用狀況

運行環境
-------
1. 客戶端：一般瀏覽器
1. Server端：node.js （在node.js 10上開發）
1. 由於美觀和一時無聊，設定了adobe typekit字體，請記得去typekit設定一組api key，然後新增apikeys.json檔案，填入typekit api key之後，把以下內容貼上去
`{
    "typekit": "API key放這裡"
}`

功能
----
1. 可查看以下資訊（每日清空）
    1. CPU使用率
    1. 記憶體使用率
    1. 機身溫度
    1. 網路使用量
    1. 磁碟使用率

安裝步驟
----
1. 本系統在archlinux arm上設計，不過步驟都能互通
1. 請先安裝以下套件
    1. node.js
    1. pm2
    1. vnstat
    1. awk
    1. cronie
    1. npm
1. 設定sysinfo.sh
    1. 請修改sysinfo.sh，把「你放置本程式的目錄」改成真正的目錄（不知道的用pwd去查）
    1. 賦予sysinfo.sh可執行權力 `chmod +x sysinfo.sh`
    1. 建立sysload記錄檔    `touch sysload`
    1. 設定誰都可以讀取，誰都可以寫入sysload    `chmod 777 sysload`
    1. 確認一下是否設定正確，直接執行sysinfo.sh，看看sysload是否有紀錄  `./sysinfo.sh`
1. 啟動cronie service，編輯crontab，新增如下設定（以下設定為每分鐘更新一次系統資訊）
    `* * * * *       /你放置本程式的目錄/sysinfo.sh`
1. 在程式安裝資料夾中，安裝node.js的套件（npm install）
    1. express
    1. http-auth
    1. moment
    1. hbs
    1. body-parser
    1. bcrypt
    1. bluebird
1. 特別提醒，預設帳號為admin，如果你要修改，請修改webui.htpasswd，把admin改成你喜歡的帳號

備註
----
1. 為了節省資源，沒有設計用資料庫儲存每日機身狀態，只以純文字檔形式儲存，每日清空

開發者&授權
----------
Kelunyang (kelunyang@outlook.com) @ 2018 CC-BY