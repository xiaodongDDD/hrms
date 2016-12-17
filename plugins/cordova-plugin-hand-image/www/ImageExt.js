    var exec = require('cordova/exec');

    exports.cropdrawable = function (success, error, arg0, width, hight) {
        exec(success, error, "ImageExt", "cropdrawable", [arg0, width, hight]);
    };
    exports.rotatedrawable = function (success, error, arg0) {
        exec(success, error, "ImageExt", "rotatedrawable", [arg0]);
    };

    exports.cropCircleDrawable = function (success, error, url, radius) {
        exec(success, error, "ImageExt", "cropCircleDrawable", [url, radius]);
    };

    exports.cropimage = function(success, error,path) {
    exec(success, error, "ImageExt", "cropimage", [path]);
    };