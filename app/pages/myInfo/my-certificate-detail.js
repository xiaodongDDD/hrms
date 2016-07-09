/**
 * Created by LeonChan on 2016/7/8.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.my-certificate-detail', {
          url: '/my-certificate-detail',
          views: {
            'tab-myInfo': {
              templateUrl: 'build/pages/myInfo/my-certificate-detail.html',
              controller: 'MyCertificateDetailCtrl'
            }
          }
        })
    }]);
angular.module('myInfoModule')
  .controller('MyCertificateDetailCtrl', [
    '$scope',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    function ($scope,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup) {
      $scope.goBack=function(){//返回按钮
        $ionicHistory.goBack();
      }
    }]);
