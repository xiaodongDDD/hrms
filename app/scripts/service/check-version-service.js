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
            'p_app_id': baseConfig.appUpId
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

            try {
              serveVersionParams.subDownloadDesc = response.returnData.subDownloadDesc.replace(/\\n/g, '\r\n');
            } catch (e) {
              serveVersionParams.subDownloadDesc = '';
            }

            var serveVersion = serveVersionParams.bigVersion.split('.');
            var localVersion = baseConfig.version.currentVersion.split('.');

            function dealVersion() {
              if (parseInt(localVersion[0]) < parseInt(serveVersion[0])) {
                return true;
              } else if (parseInt(localVersion[0]) == parseInt(serveVersion[0])) {
                if (parseInt(localVersion[1]) < parseInt(serveVersion[1])) {
                  return true;
                } else if (parseInt(localVersion[1]) == parseInt(serveVersion[1])) {
                  if (parseInt(localVersion[2]) < parseInt(serveVersion[2])) {
                    return true;
                  } else {
                    return false;
                  }
                }
              }
              return false;
            }

            if (dealVersion()) {
              if (ionic.Platform.isWebView()) {
                function selectAction(buttonIndex) { // update from pgy
                  if (buttonIndex == 1) { //确认按钮
                    window.open(serveVersionParams.bigUpdateUrl, '_system', 'location=yes');
                  } else { //取消按钮
                    return;
                  }
                };
                if (!baseConfig.appStoreFlag) {
                  hmsPopup.confirm(serveVersionParams.updateContent, "大版本更新", selectAction);
                } else {
                  //go appleStore--
                  hmsPopup.showPopup('AppStore有新版APP！快去更新吧！');
                }
              } else {
                alert(serveVersionParams.updateContent);
              }
            } else {
              if (serveVersionParams.bigVersion === baseConfig.version.currentVersion && serveVersionParams.minVersion > baseConfig.version.currentSubVersion) {
                if (ionic.Platform.isWebView()) {
                  function selectAction_min(buttonIndex) { // update from pgy
                    if (buttonIndex == 1) { //确认按钮
                      hotpatch.updateNewVersion(serveVersionParams.minUpdateUrl);
                    } else { //取消按钮
                      return;
                    }
                  };
                  hmsPopup.confirm(serveVersionParams.subDownloadDesc, "小版本更新", selectAction_min);
                } else {
                  alert(serveVersionParams.subDownloadDesc);
                }
              } else {
                if (newName === 'MY_INFO')
                  hmsPopup.showShortCenterToast("当前为最新版本");
              }
            }
          });
        }
      }
    }]);
