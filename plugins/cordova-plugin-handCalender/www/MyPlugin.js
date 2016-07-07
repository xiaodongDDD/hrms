
var exec = require('cordova/exec');
var hmsCalendar = function(){};

// arg1：成功回调
// arg2：失败回调
// arg3：将要调用类配置的标识
// arg4：调用的原生方法名
// arg5：参数，必传 “1”(代表区间) or “0”(代表截止日期)

hmsCalendar.prototype.openCalender=function(successCallBack,errorCallBack) {
    exec(successCallBack,errorCallBack, "MyPlugin", "openCalender", []);
};

module.exports = new hmsCalendar();
//调用方法 showt
