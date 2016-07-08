var a = require('cordova/exec');

var dojs = {
//跳转到会话列表
  getChatList: function (successCallback, errorCallback, options) {
    if (errorCallback == null) {
      errorCallback = function () {
      }
    }
    if (typeof errorCallback != "function") {

      return
    }
    if (typeof successCallback != "function") {

      return
    }
    a(successCallback, errorCallback, "HandIMPlugin", "getChatList", options);

  },
//跳转到会话界面
  toChatAct: function (successCallback, errorCallback, options) {
    if (errorCallback == null) {
      errorCallback = function () {
      }
    }
    if (typeof errorCallback != "function") {

      return
    }
    if (typeof successCallback != "function") {

      return
    }
    a(successCallback, errorCallback, "HandIMPlugin", "toChatAct", options);
  }
};

//跳转到会话列表
/*dojs.prototype.getChatList = function(successCallback, errorCallback, options) {
 if (errorCallback == null) { errorCallback = function() {}}
 if (typeof errorCallback != "function")  {

 return
 }
 if (typeof successCallback != "function") {

 return
 }
 cordova.exec(successCallback, errorCallback, "HandIMPlugin", "getChatList", options);

 };
 //跳转到会话界面
 dojs.prototype.toChatAct = function(successCallback, errorCallback, options) {
 if (errorCallback == null) { errorCallback = function() {}}
 if (typeof errorCallback != "function")  {

 return
 }
 if (typeof successCallback != "function") {

 return
 }
 cordova.exec(successCallback, errorCallback, "HandIMPlugin", "toChatAct", options);
 };



 //-------------------------------------------------------------------
 if(!window.plugins) {
 window.plugins = {};
 }
 if (!window.plugins.do) {
 window.plugins.dojs = new dojs();
 }*/

if (typeof module !== 'undefined' && module.exports) {
  console.log('init ???');
  module.exports = dojs;
}
