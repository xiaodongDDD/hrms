'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.carpooling-create', {
          url: '/carpooling-create',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/carpooling/carpooling-create/carpooling-create.html',
              controller: 'CarpoolingCreateCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('CarpoolingCreateCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory) {

    }]
);

