/**
 * Created by wolf on 2016/7/6. (-wen.dai-)
 * @description: use RONGCLOUD 云服务
 */
'use strict';
angular.module('HmsModule')
  .factory('imService', [
    '$http',
    'hmsPopup',
    'baseConfig',
    function ($http,
              hmsPopup,
              baseConfig) {
      var getLoginTokenUrl = 'http://172.20.0.165:8080/hrms/oauth/token';
      var getLoginTokenParams = {
        client_id: 'client',
        client_secret: 'secret',
        grant_type: 'password',
        username: window.localStorage.empno,
        password: window.localStorage.password
      };
      var access_token = '';
      var getImTokenUrl = 'http://172.20.0.165:8080/hrms/api/thirdparty/getToken?access_token=' + access_token;
      var getImTokenParams = {
        app_code: 'RONGCLOUD',
        emp_no: window.localStorage.empno
      };
      return {
        initImData: function () {
          var promise = $http.post(getLoginTokenUrl, getLoginTokenParams).success(function (response) {

          }).error(function () {
          });
        },
        getChatList: function () {

        },
        toChat: function () {

        }

      }
    }]);
