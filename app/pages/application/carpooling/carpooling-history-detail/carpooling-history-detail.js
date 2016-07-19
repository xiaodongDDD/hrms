'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.carpooling-history-detail', {
          url: '/carpooling-history-detail',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/carpooling/carpooling-history-detail/carpooling-history-detail.html',
              controller: 'HistoryDetailCtrl'
            }
          },
          params:{
            carpoolingHistoryDetailInfo:''
          }
        })
    }]);
angular.module('applicationModule')
  .controller('HistoryDetailCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'hmsPopup',
    '$stateParams',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsPopup,
              $stateParams) {
          $scope.historyInfo = $stateParams.carpoolingHistoryDetailInfo;
    }]
);

