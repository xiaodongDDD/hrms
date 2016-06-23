/**
 * Created by LeonChan on 2016/6/20.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.my-info-detail', {
          url: '/my-info-detail',
          views: {
            'tab-myInfo': {
              templateUrl: 'build/pages/myInfo/my-info-detail.html',
              controller: 'MyInfoDetailCtrl'
            }
          },
          params:{
            myDetailInfo:''
          }
        })
    }]);
angular.module('myInfoModule')
  .controller('MyInfoDetailCtrl', [
    '$scope',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$stateParams',
    function ($scope,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $stateParams) {

      $scope.personalInfo=$stateParams.myDetailInfo;

      $scope.goBack=function(){//返回按钮
        $ionicHistory.goBack();
      }



    }])
