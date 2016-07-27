angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.bus-information', {
          url: '/bus-information',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/bus-information/bus-information.html',
              controller: 'BusInformationCtrl'
            }
          }
        })
    }]);

angular.module('applicationModule')
  .controller('BusInformationCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory) {

      $scope.goBack = function () {
        $ionicHistory.goBack();
      };
    }]);


