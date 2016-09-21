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
          controller: 'GestureLockCtrl'
        })
    }]);
angular.module('myInfoModule')
  .controller('GestureLockCtrl', [
    '$scope',
    'baseConfig',
    '$state',
    'storageLock',
    '$timeout',
    function ($scope,
              baseConfig,
              $state,
              storageLock,
              $timeout) {

      $scope.$on('$ionicView.enter', function () {
        $scope.operation = 2;
        if( !storageLock.getLock() ){
          var delay = ionic.Platform.isIOS() ? 0 : 400;
          $timeout(function () {
            var w = window.innerWidth
              || document.documentElement.clientWidth
              || document.body.clientWidth;
            if( w == 0 ){
              console.log('Gesture lock init error!');
              $state.go(tab.message);
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
                $state.go('tab.message');
              },
              errorCallback: function () {
                var desc = document.getElementById('description');
                desc.className = '';
                $timeout(function(){
                  desc.className = 'error-description';
                },20);
              }
            };
            storageLock.initLock(config);
          }, delay);
        } else {
          $scope.lock = storageLock.getLock();
          $scope.lock.init();
        }
      });
    }])
  .factory('storageLock', function () {
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
