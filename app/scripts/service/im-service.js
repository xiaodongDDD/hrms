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
        if (baseConfig.debug) {
          alert('init2Cloud.getImTokenParams ' + angular.toJson(getImTokenParams));
        }
        hmsHttp.post(getImTokenUrl, getImTokenParams).success(function (result) {
          if (baseConfig.debug) {
            alert('init2Cloud.success ' + angular.toJson(result));
          }
          try {
            var imParams = {
              token: result.rows[0].token,
              userId: window.localStorage.empno
            };
            window.localStorage.access_token = result.rows[0].token;
          } catch (e) {
            imParams = {token: '', userId: ''};
          }
          getImChatList();
        }).error(function () {
          //hmsPopup.showShortCenterToast('error 2');
        });
      };

      var getImChatList = function () {
        var newImParams = {
          "userId": window.localStorage.empno,
          "access_token": window.localStorage.token,
          "RCToken": window.localStorage.access_token
        };
        if (baseConfig.debug) {
          alert('newImParams ' + angular.toJson(newImParams));
        }
        if (HandIMPlugin) {
          HandIMPlugin.getChatList(function success(msg) {
            //hmsPopup.showShortCenterToast(msg);
            if (baseConfig.debug) {
              console.log('HandIMPlugin.getChatList success!');
            }
            return msg;
          }, function error(error) {
            //hmsPopup.showShortCenterToast(error);
            if (baseConfig.debug) {
              console.log('HandIMPlugin.getChatList error!');
            }
          }, newImParams);
        }
      };

      return {
        initImData: function () {
          var getImTokenUrl = baseUrl + '/v2/api/thirdparty/getToken';
          init2Cloud(getImTokenUrl);
        },
        getImChatList: function () {
          return getImChatList;
        },
        toNativeChatPage: function (newEmpNum) { //传入工号
          if (HandIMPlugin) {
            HandIMPlugin.toChatAct(function success() {
            }, function error() {
            }, newEmpNum);
          }
        }
      }
    }]);
