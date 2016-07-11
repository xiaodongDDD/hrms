
var exec = require('cordova/exec');
var hrmsCalendar = function(){};

// arg1：成功回调
// arg2：失败回调
// arg3：将要调用类配置的标识
// arg4：调用的原生方法名
// arg5：参数，

hrmsCalendar.prototype.openCalender=function(successCallBack, errorCallBack, type) {
    exec(successCallBack,errorCallBack, "CDVCalendar", "openCalendar", [type]);
};

module.exports = new hrmsCalendar();

//调用方法 hrmsCalendar