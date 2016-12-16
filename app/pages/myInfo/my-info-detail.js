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
      $scope.myPortrait="";
      if($scope.personalInfo.avatar!=""){
        $scope.myPortrait=$scope.personalInfo.avatar;
      }else if($scope.personalInfo.avatar==""){
         if($scope.personalInfo.gender=="男"){
           $scope.myPortrait="build/img/myInfo/man-portrait.png";
         }else if($scope.personalInfo.gender=="女") {
           $scope.myPortrait = "build/img/myInfo/woman-portrait.png";
         }
      }
      
      $scope.goBack = function(){//返回按钮
        $ionicHistory.goBack();
      };
    }]);
