angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.flyback', {
          url: '/flyback-main',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/flyback/main/main.html',
              controller: 'FlyBackMainCtrl'
            }
          }
        });
    }])

angular.module("applicationModule")
  .controller('FlyBackMainCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$timeout',
    'hmsHttp',
    'flaybackService',
    function ($scope, $rootScope, $state, baseConfig, $ionicHistory,
      $timeout, hmsHttp, fbService){

        $scope.createFlightBook = function(){
          var param = {"canEdit": true, "dataSource": "create"};
          fbService.setPageStatusCreate(param);
          $state.go("tab.flybackApply");
        };
        $scope.queryFlightBook = function(){
          $state.go("tab.flybackQuery");
        };
        $scope.checkNewEdition=function(){
          $state.go("tab.flight-ticket-search");
        };

    }]);
