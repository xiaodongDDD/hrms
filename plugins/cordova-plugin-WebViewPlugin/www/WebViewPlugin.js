var exec = require('cordova/exec');

var WebViewPlugin = {

	loadWebView: function (successCallback, errorCallback, options) {
		//alert("load");
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
	  exec(successCallback, errorCallback, "WebViewPlugin", "loadWebView", [options]);

	},
	//dismissWebView

	dismissWebView: function (successCallback, errorCallback, options) {

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
	  exec(successCallback, errorCallback, "WebViewPlugin", "dismissWebView", [options]);

	}




};

if (typeof module !== 'undefined' && module.exports) {
module.exports = WebViewPlugin;
}

