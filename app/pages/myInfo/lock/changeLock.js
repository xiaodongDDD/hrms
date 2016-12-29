/**
 * Created by wkh on 2016/10/25.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.changeLock', {
          url: '/changeLock',
          params:{
            config:{}
          },
          views: {
            'tab-myInfo': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/myInfo/lock/changeLock.html',
              controller: 'changeLockCtrl'
            }
          }
        })
    }]);
angular.module('myInfoModule')
  .controller('changeLockCtrl', [
    '$scope',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$rootScope',
    '$stateParams',
    function ($scope,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $rootScope,
              $stateParams) {
      $scope.goBack=function(){
        $ionicHistory.goBack();
      };
      //operation可以根据不同的情形进行设置可更改
      $scope.data=$stateParams.config;
      console.log($scope.data);
      $scope.errorcallback=function(){
        alert("失败")
      };
      $scope.successInit=function(){
        alert("初始化成功");
      };
      $scope.successchange=function(){
        alert("修改成功");
      };
      $scope.successrmlock=function(){
        alert("取消成功");
      };
      $scope.successunlock=function(){
        alert("解锁成功");
      };
      $rootScope.$on('REMOVE_GESTURE_PASSWORD', function () {         //接收完成取消密码操作之后发送的广播
        window.localStorage.gestureLock = "false";
      });
      $rootScope.$on('INIT_GESTURE_PASSWORD', function () {         //接收完成初始化密码操作之后发送的广播
        window.localStorage.gestureLock = "true";
      });

    }]);
