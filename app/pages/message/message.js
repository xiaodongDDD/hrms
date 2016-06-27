/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('messageModule')

  .controller('messageCtrl', [
    '$scope',
    '$state',
    '$timeout',
    '$ionicPlatform',
    function ($scope,
              $state,
              $timeout,
              $ionicPlatform) {
      $scope.messageList = [];

      //将页面的导航bar设置成白色
      $ionicPlatform.ready(function () {
        if (window.StatusBar) {
          StatusBar.styleLightContent();
        }
        /*var onOpenNotification = function (event) {
          try {
            var alertContent;
            if (device.platform == "Android") {
              alertContent = window.plugins.jPushPlugin.openNotification.alert;
            } else {
              alertContent = event.aps.alert;
            }
            //alert("open Notification:" + alertContent);
            $state.go('tab.workflow-message');
          } catch (exception) {
            console.log("JPushPlugin:onOpenNotification" + exception);
          }
        };
        document.addEventListener("jpush.openNotification", onOpenNotification, false);*/
      });

      $scope.talk = function (message) {
        console.log('$scope.talk');
        $state.go("tab.messageDetail", {message: message});
      };

      $scope.refresh = function () {
        $timeout(function () {
          $scope.$broadcast("scroll.refreshComplete");
        }, 2000);
      };

      console.log('messageCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('messageCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('messageCtrl.$destroy');
      });
    }]);
