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

      window.localStorage.needGuid = "false";

      var getHeight = function () {

        //alert('document.body.scrollHeight ' + document.body.scrollHeight);

        var height = document.body.scrollHeight + "";
        if (height == "0") {
        }
        else {
          return height + 'px';
        }

        //alert('document.body.scrollHeight ' + document.body.clientHeight);

        height = document.body.clientHeight + "";
        if (height == "0") {
        }
        else {
          return height + 'px';
        }

        return '100%';
      };

      $scope.actualHeight = {
        "height": getHeight()
      };

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
        if (window.localStorage.token && window.localStorage.token != "" && window.localStorage.hrmsv220 == "true") {
          //checkVersionService.checkAppVersion();
          window.localStorage.hrmsv220 = "true";
          $state.go("tab.message");
        } else {
          window.localStorage.hrmsv220 = "true";
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
