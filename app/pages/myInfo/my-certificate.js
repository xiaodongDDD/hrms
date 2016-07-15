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
    '$rootScope',
    '$timeout',
    '$ionicScrollDelegate',
    function ($scope,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $state,
              $rootScope,
              $timeout,
              $ionicScrollDelegate) {
      $scope.certificateList=[];
      $scope.showLoading=true;
      $scope.showData=true;
      $scope.showNoData=false;
      searchDataAutomatically();
      function searchDataAutomatically(){
        var url = baseConfig.queryPath+"/staffCertificateList";
        var param={
          employee_number:""
        };
        hmsHttp.post(url,param).success(function (result) {
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
          $scope.showLoading=false;
          $scope.certificateList=result.returnData;
          if($scope.certificateList.length==0){
            $scope.showData=false;
            $scope.showNoData=true;
          }else if($scope.certificateList.length>0){
            $scope.showData=true;
            $scope.showNoData=false;
          }
        }).error(function(error,status){
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(error));
          }
          $scope.showLoading=false;
        });
      }

      $scope.goBack=function(){//返回按钮
        $ionicHistory.goBack();
      };

      $scope.checkMyCertificate=function(num){//查看证书详情
        var param={
          id:$scope.certificateList[num].id
        };
        $state.go('tab.my-certificate-detail',{
         'CertificateDetail':param
        });
      };

      $scope.createNewCertificate=function(){//创建新的证书
        $state.go('tab.new-certificate');
      };

      $rootScope.$on("CERTIFICATE_REFRESH",function(){
        $timeout(function() {
          $ionicScrollDelegate.$getByHandle('certificateScroll').scrollTop(false);
        },200);
        searchDataAutomatically();
      });
    }]);
