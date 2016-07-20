cordova.define("com.handmobile.cordovaplugin.hotpatch.hotpatch", function(require, exports, module) {
var  utils = require('cordova/utils'),
    exec = require('cordova/exec')

//------------------------------------------------------------------------------
// object that we're exporting
//------------------------------------------------------------------------------
var hotpatch = module.exports;



hotpatch.updateNewVersion = function (updateUrl) {

        cordova.exec(null,null,'hotpatch','updateNewVersion',[updateUrl]);

}


});
