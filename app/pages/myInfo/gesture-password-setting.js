/**
 * Created by ym on 2016/9/5.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.gesture-password-setting', {
          url: '/gesture-password-setting',
          views: {
            'tab-myInfo': {
              templateUrl: 'build/pages/myInfo/gesture-password-setting.html',
              controller: 'GesturePasswordSettingCtrl'
            }
          },
          params: {
            'Operation':''
          }
        })
    }]);
angular.module('myInfoModule')
  .controller('GesturePasswordSettingCtrl', [
    '$scope',
    'baseConfig',
    '$ionicHistory',
    '$stateParams',
    '$timeout',
    '$rootScope',
    'storageSettingLock',
    function ($scope,
              baseConfig,
              $ionicHistory,
              $stateParams,
              $timeout,
              $rootScope,
              storageSettingLock) {



      $scope.$on('$ionicView.enter', function () {
        $scope.operation = $stateParams.Operation;
        if( !storageSettingLock.getLock() ){
          var w = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
          var config = {
            height: w,
            width: w,
            miniHeight: w / 10 * 3,
            miniWidth: w / 10 * 3,
            operation: $scope.operation,
            canvasID: 'setting-container',
            descID: 'setting-description',
            resetID: 'setting-reset',
            miniCanvasID: 'mini-container',
            successInitCallback: function(){
              var desc = document.getElementById('setting-description');
              desc.className = '';
              $rootScope.$broadcast('INIT_GESTURE_PASSWORD');
              $timeout(function(){
                $ionicHistory.goBack();
              }, 500)
            },
            successChangeCallback: function(){
              var desc = document.getElementById('setting-description');
              desc.className = '';
              $timeout(function(){
                $ionicHistory.goBack();
              }, 500)
            },
            successRmLockCallback: function(){
              var desc = document.getElementById('setting-description');
              desc.className = '';
              $rootScope.$broadcast('REMOVE_GESTURE_PASSWORD');
              $timeout(function(){
                $ionicHistory.goBack();
              }, 500)
            },
            errorCallback: function () {
              var desc = document.getElementById('setting-description');
              desc.className = '';
              $timeout(function(){
                desc.className = 'error-description';
              },20);
            }
          };
          storageSettingLock.initLock(config);
        } else {
          $scope.lock = storageSettingLock.getLock();
          $scope.lock.operation = $scope.operation;
          $scope.lock.init();
        }
      });

      $scope.goBack = function(){//返回按钮
        $ionicHistory.goBack();
      }
    }])
  .factory('storageSettingLock', function () {
    var lock;
    return {
      initLock : function(config){
        lock = new H5lock(config);
        lock.init();
      },
      getLock : function(){
        return lock;
      }
    }
  });
