var exec = require('cordova/exec');
var HmsCalendar = function () {
};
// arg1：成功回调
// arg2：失败回调
// arg3：将要调用类配置的标识
// arg4：调用的原生方法名
// arg5：参数，必传 “1”(代表区间) or “0”(代表截止日期)
HmsCalendar.prototype.openCalendar = function (successCallBack, errorCallBack, searchType) {
  exec(successCallBack, errorCallBack, "HmsCalendar", "openCalendar", [searchType]);
};
module.exports = new HmsCalendar();
