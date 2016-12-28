/**
 * @ngdoc interceptor
 * @name httpRequestHeader
 * @module utilModule
 * @description
 * This is the http interceptor
 * @author
 * gusenlin
 */
angular.module('utilModule').factory('httpRequestHeader', function (baseConfig) {
  var interceptor = {
    'request': function (config) {
      if (window.localStorage.token && window.localStorage.empno) {
        var timestamp = new Date().getTime();
        var token = CryptoJS.MD5(window.localStorage.token + timestamp);
        config.headers.timestamp = timestamp;
        config.headers.token = token;
        config.headers.loginName = window.localStorage.empno;
        config.headers.appVersion = baseConfig.version.currentVersion + '.' + baseConfig.version.currentSubVersion;
        config.headers["Content-Type"] = 'application/json;charset=UTF-8';
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        config.headers['X-hmapfront-client'] = 'APP';
        config.headers['X-hmapfront-version'] = baseConfig.version.currentVersion + '.' + baseConfig.version.currentSubVersion;
      }
      return config;
    }
  };

  return interceptor;
});
