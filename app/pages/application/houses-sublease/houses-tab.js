angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.houses-tab', {
          url: '/houses-tab',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/houses-sublease/houses-tab.html',
              controller: 'HousesTabCtrl'
            }
          }
        })
    }]);

'use strict';
angular.module('applicationModule')
  .controller('HousesTabCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$ionicHistory',
    function ($scope, $rootScope, $state, $ionicHistory) {
      $rootScope.goBack = function () {
        $ionicHistory.goBack();
      };


      $scope.tabs = [{
        name: '转租',
        isActive: true,
        onClass: 'list-on',
        offClass: 'list-off',
        //onUrl: 'build/img/application/carpooling/carpooling-B@3x.png',
        //offUrl: 'build/img/application/carpooling/carpooling-G@3x.png'

      }, {
        name: '发布记录',
        isActive: false,
        onClass: 'history-on',
        offClass: 'history-off',
        //onUrl: 'build/img/application/carpooling/carpooling-B@3x.png',
        //offUrl: 'build/img/application/carpooling/carpooling-G@3x.png'
      }];

      $scope.clickTab = function (tab) {
        for (var i = 0; i < $scope.tabs.length; i++) {
          $scope.tabs[i].isActive = false;
        }
        tab.isActive = true;
      }
    }]);
