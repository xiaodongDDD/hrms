var exec = require('cordova/exec');
var youtuiShare = function() {
};


youtuiShare.prototype.share = function(successCallback, errorCallback, options) {
    if (errorCallback == null) { errorCallback = function() {}}
    if (typeof errorCallback != "function")  {

        return
    }
    if (typeof successCallback != "function") {
        
        return
    }
    exec(successCallback, errorCallback, "YouTui", "share", options);
};

if(!window.plugins) {
    window.plugins = {};
}

if (!window.plugins.youtuiShare) {
    window.plugins.youtuiShare = new youtuiShare();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = youtuiShare;
}

//module.exports = {
//    share: function (successCallback, errorCallback, options) {
//        exec(successCallback, errorCallback, 'YouTui', 'share', options);
//    }
//};