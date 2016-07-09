
var exec = require('cordova/exec');
var weixinLogin = function(){};

// arg1：成功回调
// arg2：失败回调
// arg3：将要调用类配置的标识
// arg4：调用的原生方法名
// arg5：参数，

weixinLogin.prototype.openWeChatLoad=function(successCallBack, errorCallBack, type) {
    alert("可以调用微信插件!");
    exec(successCallBack,errorCallBack, "CDVWeChat", "openWeChatLoad", [type]);
};
module.exports = new weixinLogin();

//调用方法 weixinLogin
