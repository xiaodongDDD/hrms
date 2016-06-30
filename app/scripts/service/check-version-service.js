/**
 * Created by wolf on 2016/6/30. (_wen.dai_)
 */
angular.module('HmsModule')
  .factory('checkVersionService', [
    '$http',
    'hmsPopup',
    'baseConfig',
    '$ionicPopup',
    function ($http,
              hmsPopup,
              baseConfig,
              $ionicPopup) {
      var url = baseConfig.businessPath + '/common_info/app_upgrade_info',
        checkVersionParams = {
          'params': {
            'p_platform': ionic.Platform.isAndroid() ? 'Android' : 'iPhone',
            'p_user_name': window.localStorage.empno,
            'p_app_id': 'com.hand.china.hrms2.research'
          }
        };
      var serveVersionParams = {
        minVersion: '',
        bigVersion: '',
        minUpdateUrl: '',
        bigUpdateUrl: '',
        updateContent: ''
      };

      /**
       * confirm 对话框的回调函数
       */
      function selectAction(buttonIndex) {
        if (buttonIndex == 1) { //确认按钮
          updateResources();
        } else { //取消按钮
          return;
        }
      };
      /**
       * 检查app的版本更新
       * -- 分大版本和小版本的update
       */
      return {
        checkAppVersion: function () {
          var promise = $http.post(url, checkVersionParams).success(function (response) {
            try {
              serveVersionParams.bigVersion = response.returnData.versionNumber;
              serveVersionParams.bigUpdateUrl = response.returnData.downloadUrl;
              serveVersionParams.minVersion = response.returnData.subVersiorNumber;
              serveVersionParams.minUpdateUrl = response.returnData.subDownloadUrl;
            } catch (e) {
            }
            try {
              //serveVersionParams.updateContent = response.returnData.upgradeInfo.replace(/\\n/g, '\\n\\r');
              serveVersionParams.updateContent = response.returnData.upgradeInfo.replace(/[\n]/g, "\\n").replace(/[\r]/g, "\\r");
            } catch (e) {
              serveVersionParams.updateContent = '';
            }
            warn(jsonFormat(serveVersionParams));
            if (serveVersionParams.bigVersion > baseConfig.version.currentVersion) {
              function updateResources() { // update from pgy
                window.open(serveVersionParams.bigUpdateUrl, '_system', 'location=yes');
              };
              if (ionic.Platform.isWebView()) {
                hmsPopup.confirm(serveVersionParams.updateContent, "大版本更新", selectAction);
              } else {
                alert(serveVersionParams.updateContent);
              }
            } else {
              if (serveVersionParams.minVersion > baseConfig.version.currentSubVersion) {
                function updateResources() { // update from hotpatch
                  hotpatch.updateNewVersion(serveVersionParams.minUpdateUrl);
                };
                if (ionic.Platform.isWebView()) {
                  hmsPopup.confirm(serveVersionParams.updateContent, "小版本更新", selectAction);
                } else {
                  alert(serveVersionParams.updateContent);
                }
              }
            }
          }).error(function () {
          });
        }
      }
    }]);
