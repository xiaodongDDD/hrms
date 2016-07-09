/**
 * Created by LeonChan on 2016/7/7.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.my-certificate', {
          url: '/my-certificate',
          views: {
            'tab-myInfo': {
              templateUrl: 'build/pages/myInfo/my-certificate.html',
              controller: 'MyCertificateCtrl'
            }
          }
        })
    }]);
angular.module('myInfoModule')
  .controller('MyCertificateCtrl', [
    '$scope',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$state',
    function ($scope,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $state) {
      $scope.goBack=function(){//返回按钮
        $ionicHistory.goBack();
      };
      $scope.checkMyCertificate=function(){//查看证书详情
        $state.go('tab.my-certificate-detail');
      };
      $scope.createNewCertificate=function(){//创建新的证书
        $state.go('tab.new-certificate');
      };
    }]);
