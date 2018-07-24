//外掛模組區，請確認執行前都已經用NPM安裝完成
var dirname = "/你的安裝目錄/webui";
var express = require(dirname+"/node_modules/express");
var auth = require(dirname+"/node_modules/http-auth");
var moment = require(dirname+"/node_modules/moment");
var hbs = require(dirname+'/node_modules/hbs');
var bodyParser = require(dirname+'/node_modules/body-parser')
var bcrypt = require(dirname+'/node_modules/bcrypt');
var Promise = require(dirname+'/node_modules/bluebird');

//內建模組區
var fs = require('fs');
var exec = require('child_process').exec;
var os = require("os");

const saltRounds = 10;
var basic = auth.basic({
	realm: "WebUI Area.",
	file: dirname + "/webui.htpasswd"
});

const logcheck = () => {
    var timestamp = moment();
    exec('wc -l '+dirname+"/webuilog", (err,res) => {
        if(parseInt(res) > 100) {
            fs.truncate(dirname+"/webuilog", 0, function(err) {
                if (err) {
                    console.log("記錄檔歸零（寫入失敗）",req.user,ip);
                }
                fs.appendFileSync(dirname+"/webuilog", timestamp.unix()+"\t"+"系統訊息"+"\t"+"系統訊息"+"\t"+"使用者記錄檔超過100筆，已歸零"+"\n");
            });
        }
    });
}

const consoleDebugger = async(msg,user,ip) => {
    var timestamp = moment();
    var logmsg = "[RPiWeb] ("+timestamp.format("YYYY/MM/DD HH:mm:ss")+") "+msg;
    await Promise.resolve(logcheck()).then(() => {
        fs.appendFileSync(dirname+"/webuilog", timestamp.unix()+"\t"+user+"\t"+ip+"\t"+logmsg+"\n");
        console.log(logmsg);
    });
}

hbs.registerPartials(dirname + '/views/partials');
var app = express();
app.use(auth.connect(basic));
app.use(bodyParser.json());
app.set('trust proxy', 1) // trust first proxy
app.set('views', dirname + '/views');
app.set('view engine', 'hbs');
app.listen(8086, async () => {
    fs.readFile(dirname+'/apikeys.json', async (err, data) => {
		api = JSON.parse(data);
		await consoleDebugger("Raspberry Pi 監視器已啟動","系統訊息","系統訊息");
	});
});

app.get('/', async(req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    await consoleDebugger("用戶登入",req.user,ip);
    res.render("console", {
        title: "未命名",
        typekit: api.typekit,
        username: req.user,
        sysname: os.userInfo().username
    });
});
app.get("/userlog",function(req,res) {
    res.download('/你的安裝目錄/webuilog');
});
app.get("/systemstatus",function(req,res) {
    res.download('/你的安裝目錄/sysload');
});
app.get("/shutdown",async(req,res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    await consoleDebugger("執行關機指令",req.user,ip);
    res.send(moment().unix().toString());
    exec('sudo shutdown now');
});
app.get("/reboot",async(req,res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    await consoleDebugger("執行重開機指令",req.user,ip);
    res.send(moment().unix().toString());
    exec('sudo reboot now');
});
app.get("/resetdata",async(req,res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    fs.truncate(dirname+'/sysload', 0, async (err) => {
        if (err) {
            await consoleDebugger("記錄檔歸零（寫入失敗）",req.user,ip);
            res.status(500).send("記錄檔歸零（寫入失敗）");
        } else {
            await consoleDebugger("記錄檔歸零",req.user,ip);
            res.send(moment().unix().toString());
        }
    });
});
app.post("/password",async(req,res) => {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        fs.writeFile(dirname+'/webui.htpasswd', req.user+":"+hash.replace("$2b$","$2y$"),{flag: "w"}, async (err) => {
            if (err) {
                await consoleDebugger("修改密碼失敗（寫入失敗）",req.user,ip);
                res.status(500).send("修改密碼失敗（寫入失敗）");
            } else {
                await consoleDebugger("密碼修改完成",req.user,ip);
                res.send(moment().unix().toString());
            }
        });
    });
});