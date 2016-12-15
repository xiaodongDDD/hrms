var exec = require('cordova/exec');
//人脸检测
exports.faceDetect = function(arg0, success, error) {
    exec(success, error, "FacePlugin", "faceDetect", [arg0]);
};
//获取本地图片base64位字符串
exports.getLocalImage = function(arg0, success, error) {
    exec(success, error, "FacePlugin", "getLocalImage", [arg0]);
};
//人脸登录
exports.faceLogin = function(arg0, success, error) {
    exec(success, error, "FacePlugin", "faceLogin", [arg0]);
};
//人脸比较
exports.faceCompare = function(arg0, success, error) {
    exec(success, error, "FacePlugin", "faceCompare", [arg0]);
};
//人脸搜索
exports.faceSelect = function(arg0, success, error) {
    exec(success, error, "FacePlugin", "faceSelect", [arg0]);
};

