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
    'hmsHttp',
    'hmsPopup',
    'baseConfig',
    function (hmsHttp,
              hmsPopup,
              baseConfig) {
      //为application/x-www-form-urlencoded格式的请求--post方式
      var baseUrl = baseConfig.imPath;
      function init2Cloud(getImTokenUrl) {
        var getImTokenParams = {
          appCode: 'RONGCLOUD',
          empNo: window.localStorage.empno
        };
        hmsHttp.post(getImTokenUrl, getImTokenParams).success(function (result) {
          try {
            var imParams = {
              token: result.rows[0].token,
              userId: window.localStorage.empno
            };
            window.localStorage.access_token = result.rows[0].token;
          } catch (e) {
            imParams = {token: '', userId: ''};
          }
          HandIMPlugin.getChatList(function success(msg) {
            //hmsPopup.showShortCenterToast(msg);
          }, function error(error) {
            //hmsPopup.showShortCenterToast(error);
          }, imParams);
        }).error(function () {
          //hmsPopup.showShortCenterToast('error 2');
        });
      };

      return {
        initImData: function () {
            var getImTokenUrl = baseUrl + '/v2/api/thirdparty/getToken';
            init2Cloud(getImTokenUrl);
        },
        getImChatList: function () {
          var newImParams = {
            "userId": window.localStorage.empno,
            "token": window.localStorage.access_token
          };
          HandIMPlugin.getChatList(function success(msg) {
            //hmsPopup.showShortCenterToast(msg);
            return msg;
          }, function error(error) {
            //hmsPopup.showShortCenterToast(error);
          }, newImParams);
        },
        toNativeChatPage: function (newEmpNum) { //传入工号
          HandIMPlugin.toChatAct(function success() {
          }, function error() {
          }, newEmpNum);
        }
      }
    }]);
