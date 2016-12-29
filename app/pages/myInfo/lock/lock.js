/**
 * Created by wkh on 2016/10/25.
 */
'use strict';
angular.module('myInfoModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.lock', {
          url: '/lock',
          views: {
            'tab-myInfo': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/myInfo/lock/lock.html',
              controller: 'lockCtrl'
            }
          }
        })
    }]);
angular.module('myInfoModule')
  .controller('lockCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$rootScope',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $rootScope) {
      $scope.goBack=function(){
        $ionicHistory.goBack();
      };
      $scope.passwd="";
      window.localStorage.changeCheck="false";
      $scope.changeCheckFN= window.localStorage.changeCheck;
      $scope.gesture = {};
      console.log(!window.localStorage.gestureLock);
      if(!window.localStorage.gestureLock){
        $scope.gesture.lock = false;
        window.localStorage.gestureLock= "false";
        if (baseConfig.debug) {
          console.log('手势密码功能默认关闭');
        }
      }
      console.log(window.localStorage.gestureLock == "true");
      if (window.localStorage.gestureLock == "true") {
        console.log('打开手势密码功能');
        $scope.gesture.lock = true;
        if (baseConfig.debug) {
          console.log('打开手势密码功能');
        }
      }else{
        $scope.gesture.lock = false;
        console.log('关闭手势密码功能');
        if (baseConfig.debug) {
          console.log('关闭手势密码功能');
        }
      }
      $scope.clickGestureLock=function(){
        console.log( $scope.gesture.lock);
        if( $scope.gesture.lock==false ){
          console.log("初始化");
          $scope.gesture.lock = false;
          $state.go('tab.lockSetting', {
            'Operation': 0
          });
        } else {
          $scope.gesture.lock = true;
          $state.go('tab.lockSetting', {
            'Operation': 3
          });
        }

      };
      $rootScope.$on('REMOVE_GESTURE_PASSWORD', function(){
        $scope.gesture.lock = false;
        window.localStorage.gestureLock="false";
        if (baseConfig.debug) {
          console.log('关闭手势密码功能');
        }
      });
      $rootScope.$on('INIT_GESTURE_PASSWORD', function(){
        $scope.gesture.lock = true;
        window.localStorage.gestureLock="true";
        if (baseConfig.debug) {
          console.log('打开手势密码功能');
        }
      });

      $scope.clickChangePassword = function(){
        $state.go('tab.lockSetting', {
          'Operation': 1
        });
        if (baseConfig.debug) {
          console.log('修改手势密码');
        }
      };
      $scope.goChangePs=function(){
        /*  window.localStorage.removeItem('gesturePassword');*/
        $state.go('tab.lockReset', {
          'Operation': 0
        });


      }
    }]);
