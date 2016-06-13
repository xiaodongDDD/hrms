/**
 * @ngdoc interceptor
 * @name httpRequestHeader
 * @module utilModule
 * @description
 * This is the http interceptor
 * @author
 * gusenlin
 */
angular.module('utilModule').factory('httpRequestHeader', function () {
  var interceptor = {
    'request': function (config) {
      if (window.localStorage.token && window.localStorage.empno) {
        var timestamp = new Date().getTime();
        var token = CryptoJS.MD5(window.localStorage.token + timestamp);
        config.headers.timestamp = timestamp;
        config.headers.token     = token;
        config.headers.loginName = window.localStorage.empno;
      }
      return config;
    }
  };

  return interceptor;
});
