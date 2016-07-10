/**
 * Created by gusenlin on 16/7/9.
 */
angular.module('loginModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.tab-message-pushDetail', {
          url: 'tab-message-pushDetail',
          cache: false,
          params: {"content": {}},
          views: {
            'tab-message': {
              templateUrl: 'build/pages/push/push-detail.html',
              controller: 'pushDetailCtrl'
            }
          }
        })
        .state('tab.tab-application-pushDetail', {
          url: 'tab-application-pushDetail',
          cache: false,
          params: {"content": {}},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/push/push-detail.html',
              controller: 'pushDetailCtrl'
            }
          }
        })
        .state('tab.tab-contact-pushDetail', {
          url: 'tab-contact-pushDetail',
          cache: false,
          params: {"content": {}},
          views: {
            'tab-contact': {
              templateUrl: 'build/pages/push/push-detail.html',
              controller: 'pushDetailCtrl'
            }
          }
        })
        .state('tab.tab-myInfo-pushDetail', {
          url: 'tab-myInfo-pushDetail',
          cache: false,
          params: {"content": {}},
          views: {
            'tab-myInfo': {
              templateUrl: 'build/pages/push/push-detail.html',
              controller: 'pushDetailCtrl'
            }
          }
        })
      ;
    }]);
angular.module('loginModule')

  .controller('pushDetailCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$stateParams',
    '$ionicHistory',
    function ($scope,
              $state,
              baseConfig,
              $stateParams,
              $ionicHistory) {

      $scope.content = angular.toJson($stateParams.content);
      $scope.title = $stateParams.title;

      $scope.goBack = function () {
        $ionicHistory.goBack();
      };

      $scope.$on('$ionicView.enter', function (e) {
        if (baseConfig.debug) {
          console.log('pushDetailCtrl.$ionicView.enter');
        }
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('pushDetailCtrl.$destroy');
        }
      });
    }]);
