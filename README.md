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
1. ![執行畫面](https://github.com/kelunyang/RPIWebUI/blob/master/screenshot.png)

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
1. 請修改server.js，把所有的「你的安裝目錄」都改成你真正的安裝目錄
    1. 如果你想幫妳的機器取名字，請修改第63行的未命名改成你的名字
    1. 預設port是8086，如果你不喜歡，請修改第52行
1. 都設定完了，請在安裝資料夾"的上一層"中輸入 `node server.js` 看看有沒有錯誤
    1. 沒有錯誤的話，請用PM2自動啟動本程式，指令如下
    1. `pm2 startup` （初始化，全部都用預設值enter到底）
    1. `pm2 start server.js --name "monitor"`
    1. `pm2 save`
    1. `sudo env PATH=$PATH:/usr/bin pm2 startup 你的帳號名稱 -u 你的帳號名稱 --hp /你的安裝目錄的上一層`
    1. 啟動pm2 service，如果你想要知道執行紀錄，可以輸入 `pm2 status`
1. 特別提醒，預設帳號為admin，如果你要修改，請修改webui.htpasswd，把admin改成你喜歡的帳號

備註
----
1. 為了節省資源，沒有設計用資料庫儲存每日機身狀態，只以純文字檔形式儲存，每日清空
1. 省事，所以沒有開發https版本，如果你需要https（建議），可以自己簽ssl憑證之後改server.js，加入https的設定

開發者&授權
----------
Kelunyang (kelunyang@outlook.com) @ 2018 CC-BY