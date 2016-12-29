/**
 * Created by LeonChan on 2016/6/15.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.setup', {
          url: '/setup',
          views: {
            'tab-myInfo': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/myInfo/setup.html',
              controller: 'SetupCtrl'
            }
          }
        })
    }]);
angular.module('myInfoModule')
  .controller('SetupCtrl', [
    '$scope',
    'baseConfig',
    '$ionicHistory',
    '$state',
    '$rootScope',
    '$timeout',
    function ($scope,
              baseConfig,
              $ionicHistory,
              $state,
              $rootScope,
              $timeout) {

      $scope.gesture = {};

      if(baseConfig){
        console.log('SetupCtrl.window.localStorage.neeGuide ' + window.localStorage.neeGuide);
        console.log('SetupCtrl.window.localStorage.guideHelpAuto ' + window.localStorage.guideHelpAuto);
      }

      if (!window.localStorage.timesheetAuto) {
        $scope.timesheetAuto = false;
        window.localStorage.timesheetAuto = "false";
        if (baseConfig.debug) {
          console.log('timesheet自动填写功能默认关闭');
        }
      }

      if (!window.localStorage.messagePush) {
        $scope.messagePush = false;
        window.localStorage.messagePush = "false";
        if (baseConfig.debug) {
          console.log('消息推送功能默认关闭');
        }
      }

      if (!window.localStorage.gestureLock) {
        $scope.gesture.lock = false;
        window.localStorage.gestureLock = "false";
        if (baseConfig.debug) {
          console.log('手势密码功能默认关闭');
        }
      }

      if (window.localStorage.timesheetAuto == "true") {
        $scope.timesheetAuto = true;
        if (baseConfig.debug) {
          console.log('打开timesheet自动填写功能');
        }
      } else {
        $scope.timesheetAuto = false;
        if (baseConfig.debug) {
          console.log('关闭timesheet自动填写功能');
        }
      }
      if (window.localStorage.messagePush == "true") {
        $scope.messagePush = true;
        if (baseConfig.debug) {
          console.log('打开消息推送功能');
        }
      } else {
        $scope.messagePush = false;
        if (baseConfig.debug) {
          console.log('关闭消息推送功能');
        }
      }
      if (window.localStorage.gestureLock == "true") {
        $scope.gesture.lock = true;
        if (baseConfig.debug) {
          console.log('打开手势密码功能');
        }
      } else {
        $scope.gesture.lock = false;
        if (baseConfig.debug) {
          console.log('关闭手势密码功能');
        }
      }

      $scope.clickTimesheetAuto = function () {
        $scope.timesheetAuto = !$scope.timesheetAuto;
        if ($scope.timesheetAuto == true) {
          window.localStorage.timesheetAuto = "true";
          if (baseConfig.debug) {
            console.log('打开timesheet自动填写功能');
          }
        } else if ($scope.timesheetAuto == false) {
          window.localStorage.timesheetAuto = "false";
          if (baseConfig.debug) {
            console.log('关闭timesheet自动填写功能');
          }
        }
      };

      $scope.clickMessagePush = function () {
        $scope.messagePush = !$scope.messagePush;
        if ($scope.messagePush == true) {
          window.localStorage.messagePush = "true";
          if (baseConfig.debug) {
            console.log('打开消息推送功能');
          }
        } else if ($scope.messagePush == false) {
          $timeout(function () {
            $scope.messagePush = false;
            $scope.$apply();
          }, 500);
          window.localStorage.messagePush = "false";
          if (baseConfig.debug) {
            console.log('关闭消息推送功能');
          }
        }
      };

      $scope.clickGuideHelpAuto = function () {
        $scope.guideHelpAuto= !$scope.guideHelpAuto;
        if ($scope.guideHelpAuto == true) {
          window.localStorage.guideHelpAuto = "true";
        }else if ($scope.guideHelpAuto == false) {
          window.localStorage.guideHelpAuto = "false";
        }
      }

      $scope.clickGestureLock = function () {
/*        if ($scope.gesture.lock) {
          $scope.gesture.lock = false;
          $state.go('tab.gesture-password-setting', {
            'Operation': 0
          });
        } else {
          $scope.gesture.lock = true;
          $state.go('tab.gesture-password-setting', {
            'Operation': 3
          });
        }*/
        console.log( $scope.gesture.lock);
        if( $scope.gesture.lock){
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

      var initSetting = function () {
        if (!window.localStorage.slippingEnableFlag) {
          window.localStorage.slippingEnableFlag = "true";
          $scope.slippingEnableFlag = true;
        } else {
          if (window.localStorage.slippingEnableFlag == "true") {
            $scope.slippingEnableFlag = true;
          } else {
            $scope.slippingEnableFlag = false;
          }
        }

        if (!window.localStorage.guideHelpAuto) {
          window.localStorage.guideHelpAuto = "false";
          $scope.guideHelpAuto = false;
        }else{
          if (window.localStorage.guideHelpAuto == "true") {
            $scope.guideHelpAuto = true;
          } else {
            $scope.guideHelpAuto = false;
          }
        }

      };

      //console.log('navigator.userAgent  ' + navigator.userAgent)
      $scope.changeSlippingSetting = function () {
        if ($scope.slippingEnableFlag == true) {
          $scope.slippingEnableFlag = false;
          window.localStorage.slippingEnableFlag = "false";
        } else {
          $scope.slippingEnableFlag = true;
          window.localStorage.slippingEnableFlag = "true";
        }
      };

      $scope.$on('$ionicView.beforeEnter', function (e) {
        if (baseConfig.debug) {
          console.log('setUpCtrl.$ionicView.beforeEnter');
        }
        initSetting();
      });


      $rootScope.$on('REMOVE_GESTURE_PASSWORD', function () {
        $scope.gesture.lock = false;
        window.localStorage.gestureLock = "false";
        if (baseConfig.debug) {
          console.log('关闭手势密码功能');
        }
      });
      $rootScope.$on('INIT_GESTURE_PASSWORD', function () {
        $scope.gesture.lock = true;
        window.localStorage.gestureLock = "true";
        if (baseConfig.debug) {
          console.log('打开手势密码功能');
        }
      });

      $scope.clickChangePassword = function () {
  /*      $state.go('tab.gesture-password-setting', {
          'Operation': 1
        });
        if (baseConfig.debug) {
          console.log('修改手势密码');
        }*/
        $state.go('tab.lockSetting', {
          'Operation': 1
        });
        if (baseConfig.debug) {
          console.log('修改手势密码');
        }
      };

      $scope.goBack = function () {//返回按钮
        $ionicHistory.goBack();
      }

    }]);
