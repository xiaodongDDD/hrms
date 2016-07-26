'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.carpooling-list-detail', {
          url: '/carpooling-list-detail',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/carpooling/carpooling-list-detail/carpooling-list-detail.html',
              controller: 'ListDetailCtrl'
            }
          },
          params:{
            carpoolingListDetailInfo:''
          }
        })
    }]);
angular.module('applicationModule')
  .controller('ListDetailCtrl', [
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
      $scope.listInfo = $stateParams.carpoolingListDetailInfo;
    }]
);

