/**
 * Created by wolf on 2016/7/6. (-wen.dai-)
 * @description: use RONGCLOUD 云服务
 *  1：initImData 初始化登录获取登录融云的token
 *  2：getImChatList app初始化获取会话列表的消息
 *  3：toNativeChatPage 点击联系人发起聊天--go native page
 * @access_token: 访问令牌，用于api调用时作为参数
 * @token: 用于访问融云的token
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
      //为application/x-www-form-urlencoded格式的请求--post方式
      var baseUrl = 'http://172.20.0.165:8080/hrms';
      var getLoginTokenUrl = baseUrl + '/oauth/token?client_id=client&client_secret=secret&grant_type=password&username=' + window.localStorage.empno + '&password=123456';
      var access_token = '';
      var getImTokenUrl = baseUrl + '/api/thirdparty/getToken?access_token=';
      var getImTokenParams = {
        appCode: 'RONGCLOUD',
        empNo: window.localStorage.empno
      };
      return {
        initImData: function () {
          var promise = $http.post(getLoginTokenUrl).success(function (response) {
            getImTokenUrl = getImTokenUrl + response.access_token;
            $http.post(getImTokenUrl, getImTokenParams).success(function (result) {
              try {
                var imParams = {
                  token: result.rows[0].token,
                  userId: window.localStorage.empno
                };
                window.localStorage.access_token = result.rows[0].token;
              } catch (e) {
                imParams = {token: '', userId: ''};
              }
              dojs.getChatList(function success(msg) {
                hmsPopup.showShortCenterToast(msg);
              }, function success(error) {
                hmsPopup.showShortCenterToast(error);
              }, imParams);
            });
          });
        },
        getImChatList: function () {
          var newImParams = {
            "userId": window.localStorage.empno,
            "token": window.localStorage.access_token
          };
          dojs.getChatList(function success(msg) {
            hmsPopup.showShortCenterToast(msg);
            return msg;
          }, function success(error) {
            hmsPopup.showShortCenterToast(error);
          }, newImParams);
        },
        toNativeChatPage: function (newEmpNum) { //传入工号
          dojs.toChatAct(function success() {
          }, function success() {
          }, newEmpNum);
        }
      }
    }]);
