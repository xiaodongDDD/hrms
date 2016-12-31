/**
 * Created by gusenlin on 16/5/16.
 */
angular.module('loginModule')

  .controller('guideCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    'checkVersionService',
    'guideService',
    function ($scope,
              $state,
              baseConfig,
              checkVersionService,
              guideService) {

      console.log('loginCtrl.enter');
      console.log("guide");
      window.localStorage.needGuid = "false";
      if (ionic.Platform.isAndroid()) {
      $scope.actualHeight = {
        "height": screen.height-18+"px"
      };
      }else{
        $scope.actualHeight = {
          "height": screen.height+"px"
        };
      }
      $scope.clientHeight = 'height: ' + document.body.clientHeight + 'px';
      $scope.skipGuide = function () {
        if (baseConfig.debug) {
          console.log("跳过导航页到登陆页");
        }
        goToMain();
      };

      $scope.toLogin = function () {
        if (baseConfig.debug) {
          console.log("跳过导航页到登陆页");
        }
        goToMain();
      };

      var goToMain = function () {
        //$state.go("login");
        if (window.localStorage.token && window.localStorage.token != "" && window.localStorage.isHrms2108) {
          //checkVersionService.checkAppVersion();
          $state.go("tab.message");
        } else {
          window.localStorage.isHrms2108 = "true";
          $state.go("login");
        }
      };

      $scope.$on('$ionicView.enter', function () {
        if (baseConfig.debug) {
          console.log('guideCtrl.$ionicView.enter');
        }
      });

      $scope.$on('$destroy', function () {
        if (baseConfig.debug) {
          console.log('guideCtrl.$destroy');
        }
      });
    }]);
