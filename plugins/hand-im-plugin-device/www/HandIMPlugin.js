var exec = require('cordova/exec');

var HandIMPlugin = {
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
    exec(successCallback, errorCallback, "HandIMPlugin", "getChatList", [options]);

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
    exec(successCallback, errorCallback, "HandIMPlugin", "toChatAct", [options]);
  },
  
  returnConversationList: function (successCallback, errorCallback) {
    exec(successCallback, errorCallback, "HandIMPlugin", "returnConversationList", []);
  },

  deleteConversationList: function (successCallback, errorCallback, friendId) {
    exec(successCallback, errorCallback, "HandIMPlugin", "deleteConversationList", [friendId]);
  }
};


if (typeof module !== 'undefined' && module.exports) {
  module.exports = HandIMPlugin;
}
