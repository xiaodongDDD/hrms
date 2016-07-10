/**
 * Created by wolf on 2016/6/30. (wen.da)
 */
angular.module('HmsModule')
  .factory('checkVersionService', [
    'hmsHttp',
    'hmsPopup',
    'baseConfig',
    '$ionicPopup',
    function (hmsHttp,
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
       * 检查app的版本更新
       * -- 分大版本和小版本的update
       */
      return {
        checkAppVersion: function (newName) {
          var promise = hmsHttp.post(url, checkVersionParams).success(function (response) {
            try {
              serveVersionParams.bigVersion = response.returnData.versionNumber;
              serveVersionParams.bigUpdateUrl = response.returnData.downloadUrl;
              serveVersionParams.minVersion = response.returnData.subVersiorNumber;
              serveVersionParams.minUpdateUrl = response.returnData.subDownloadUrl;
            } catch (e) {
            }
            try {
              serveVersionParams.updateContent = response.returnData.upgradeInfo.replace(/\\n/g, '\r\n');
            } catch (e) {
              serveVersionParams.updateContent = '';
            }
            var serveVersion = serveVersionParams.bigVersion.split('.');
            var localVersion = baseConfig.version.currentVersion.split('.');

            if (serveVersion[0] > localVersion[0] || serveVersion[1] > localVersion[1] || serveVersion[2] > localVersion[2]) {
              if (ionic.Platform.isWebView()) {
                function selectAction(buttonIndex) { // update from pgy
                  if (buttonIndex == 1) { //确认按钮
                    window.open(serveVersionParams.bigUpdateUrl, '_system', 'location=yes');
                  } else { //取消按钮
                    return;
                  }
                };
                hmsPopup.confirm(serveVersionParams.updateContent, "大版本更新", selectAction);
              } else {
                alert(serveVersionParams.updateContent);
              }
            } else {
              if (serveVersionParams.minVersion > baseConfig.version.currentSubVersion) {
                if (ionic.Platform.isWebView()) {
                  function selectAction_min(buttonIndex) { // update from pgy
                    if (buttonIndex == 1) { //确认按钮
                      hotpatch.updateNewVersion(serveVersionParams.minUpdateUrl);
                    } else { //取消按钮
                      return;
                    }
                  };
                  hmsPopup.confirm(serveVersionParams.updateContent, "小版本更新", selectAction_min);
                } else {
                  alert(serveVersionParams.updateContent);
                }
              } else {
                if(newName === 'MY_INFO')
                hmsPopup.showShortCenterToast("当前为最新版本");
              }
            }
          });
        }
      }
    }]);
