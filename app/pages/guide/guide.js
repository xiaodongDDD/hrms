/**
 * Created by gusenlin on 16/5/16.
 */
angular.module('loginModule')

  .controller('guideCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    'checkVersionService',
    function ($scope,
              $state,
              baseConfig,
              checkVersionService) {

      console.log('loginCtrl.enter');

      window.localStorage.needGuid = "false";

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
        $state.go("login");
        /*if (window.localStorage.token && window.localStorage.token != "") {
          checkVersionService.checkAppVersion();
          $state.go("tab.message");
        } else {
          $state.go("login");
        }*/
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
