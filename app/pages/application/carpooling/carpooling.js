'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.carpooling', {
          url: '/carpooling',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/carpooling/carpooling.html',
              controller: 'CarpoolingCtrl'
            }
          }
        })
    }]);

'use strict';
angular.module('applicationModule')
  .controller('CarpoolingCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$ionicHistory',
    'commonContactService',
    function ($scope, $rootScope, $state,$ionicHistory,commonContactService) {
      $rootScope.goBack = function () {
        $ionicHistory.goBack();
      };
      $scope.tabs = [{
        name: '列表',
        isActive: true,
        onClass: 'list-on',
        offClass: 'list-off',
        onUrl:'./../img/application/carpooling/carpooling-B@3x.png',
        offUrl:'./../img/application/carpooling/carpooling-G@3x.png'

      }, {
        name: '创建拼车',
        isActive: false,
        onClass: 'create-on',
        offClass: 'create-off'
      }, {
        name: '拼车记录',
        isActive: false,
        onClass: 'history-on',
        offClass: 'history-off'
      }];

      $scope.clickTab = function (tab) {
        for (var i = 0; i < $scope.tabs.length; i++) {
          $scope.tabs[i].isActive = false;
        }
        tab.isActive = true;
      }
    }]);
