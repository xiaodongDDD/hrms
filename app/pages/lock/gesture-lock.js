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
          var w = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
          var config = {
            height: w,
            width: w,
            operation: $scope.operation,
            descID: 'description',
            canvasID: 'container',
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
