/**
 * Created by ym on 2016/9/6.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('gesture-lock', {
          url: '/gesture-lock',
          templateUrl: 'build/pages/lock/gesture-lock.html',
          controller: 'GestureLockCtrl',
          params:{
            'stateCurrent':'',
            "detail": '',
            "processedFlag": {},
            "type": "",
            'readMessage':{},
            'messageId':''
          }
        })
    }]);
angular.module('myInfoModule')
  .controller('GestureLockCtrl', [
    '$scope',
    'baseConfig',
    '$state',
    '$timeout',
    '$stateParams',
    'hmsJpushService',
    '$ionicHistory',
    'hmsPopup',
    function ($scope,
              baseConfig,
              $state,
              $timeout,
              $stateParams,
              hmsJpushService,
              $ionicHistory,
              hmsPopup) {

      $scope.$on('$ionicView.enter', function () {
        $scope.operation = 2;
        $scope.errorLock = Boolean( window.localStorage.errorLock );
        $scope.unlockTimeString = '';
        $scope.localStorage = window.localStorage;
        if( window.localStorage.unlockTime ){
          $scope.unlockTimeString = ( new Date(parseInt(window.localStorage.unlockTime)) ).toLocaleString();
        }
        var delay = ionic.Platform.isIOS() ? 0 : 500;
        $timeout(function () {
          var w = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
          if( w == 0 ){
            if(baseConfig.debug){
              console.log('Gesture lock init error!');
            }
            alert('Gesture lock init error!');
            $state.go('tab.message');
          }
          var config = {
            height:  w * 8 /10,
            width:  w * 8 /10,
            operation: $scope.operation,
            descID: 'description',
            canvasID: 'container',
            haveDelta: true,
            successUnlockCallback: function(){
              var desc = document.getElementById('description');
              desc.className = '';
              if( hmsJpushService.localStorage.stateCurrent ){
                var storage = hmsJpushService.localStorage;
                $state.go( storage.stateCurrent, {
                  "detail": storage.detail,
                  "processedFlag": storage.processedFlag,
                  "type": storage.type,
                  'fromLock':false
                });

                if(ionic.Platform.isIOS()) {
                  storage.readMessage(storage.messageId);
                }
                $timeout(function(){
                  hmsJpushService.localStorage = {};
                }, 1000);
              } else {
                $state.go('tab.message');
              }
              window.localStorage.errorCount = 0;
            },
            errorCallback: function () {
              var desc = document.getElementById('description');
              desc.className = '';
              $timeout(function(){
                desc.className = 'error-description';
              },20);
              if( !parseInt(window.localStorage.errorCount) ){
                window.localStorage.errorCount = 1;
              } else {
                window.localStorage.errorCount = parseInt(window.localStorage.errorCount) + 1;
              }
              $scope.$apply();
            }
          };
          $scope.lock = new H5lock(config);
          $scope.lock.init();
        }, delay);

        $scope.$watch('localStorage.errorCount',function () {
          if( parseInt($scope.localStorage.errorCount) && parseInt($scope.localStorage.errorCount) > 4  && !$scope.errorLock){
            hmsPopup.showShortCenterToast('输入错误次数达到五次，手机将暂时锁定!');
            var current = new Date();
            var unlockTime = new Date(current.getTime() + 300000);
            $scope.unlockTimeString = unlockTime.toLocaleString();
            window.localStorage.unlockTime = unlockTime.getTime();
            window.localStorage.errorLock = 'true';
            $scope.errorLock = true;
            $timeout(function () {
              $scope.errorLock = false;
              window.localStorage.unlockTime = 0;
              $scope.unlockTimeString = '';
              window.localStorage.errorCount = 0;
              window.localStorage.errorLock = '';
            }, 300000);
          } else if ( $scope.errorLock ) {
            current = new Date();
            if ( current.getTime() == parseInt(window.localStorage.unlockTime)){
              $scope.errorLock = false;
              window.localStorage.unlockTime = 0;
              $scope.unlockTimeString = '';
              window.localStorage.errorCount = 0;
              window.localStorage.errorLock = '';
            } else {
              $timeout(function () {
                $scope.errorLock = false;
                window.localStorage.unlockTime = 0;
                $scope.unlockTimeString = '';
                window.localStorage.errorCount = 0;
                window.localStorage.errorLock = '';
              }, (window.localStorage.unlockTime - current.getTime()));
            }
          }
        });

        $ionicHistory.nextViewOptions({
          disableBack: true
        });
      });
    }]);
