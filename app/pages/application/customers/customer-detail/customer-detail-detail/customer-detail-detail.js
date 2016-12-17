/**
 * Created by ZaraNengap on 2016/10/9.
 */
'use strict';
angular.module('customerModule')
  .controller('CustomerDetailDetailCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'history',
    'hmsPopup',
    '$timeout',
    'hmsHttp',
    'T',
    'CloneData',
    'baseConfig',
    '$ionicScrollDelegate',
    'customerDetailService',
    function ($scope,
              $rootScope,
              $state,
              history,
              hmsPopup,
              $timeout,
              hmsHttp,
              T,
              CloneData,
              baseConfig,
              $ionicScrollDelegate,
              customerDetailService) {


      var baseUrl = baseConfig.basePath;
      $scope.showFlag=[false,false,false,false,false,false,false];
      //$scope.customer = {};
      //$scope.informationStatus = [];
      $scope.showLoading = true;
      $scope.location = '';
      //多语言字段
      $scope.bilingual=CloneData.getCustomer_information();
      $scope.statusBilingual=CloneData.getApplicaion_add();

      var getCustomerDetailSuccess= function (response) {
        $scope.showLoading = false;
        if (response.returnCode == "S") {
          $scope.customer = response.customer_detail;
          $scope.location =  $scope.customer.countryName;
          if($scope.customer.provinceName!==''&&$scope.customer.countryName==='中国'){
            $scope.location = $scope.location+'-'+$scope.customer.provinceName;
          }
          if($scope.customer.cityName!==''&&$scope.customer.countryName==='中国'){
            $scope.location = $scope.location+'-'+$scope.customer.cityName;
          }
          if($scope.customer.zoneName!==''&&$scope.customer.countryName==='中国'){
            $scope.location = $scope.location+'-'+$scope.customer.zoneName;
          }
          if(response.situtions.length!==0){
            $scope.informationStatus = response.situtions;
          }else{
            $scope.informationStatus =[];
          }
          console.log($scope.customer);
        }
      }
      customerDetailService.getCustomerDetail(getCustomerDetailSuccess, $scope.customerId);

      $rootScope.$on('$ionicView.beforeEnter', function (e) {
        console.log('详情页面的enter')
        $ionicScrollDelegate.$getByHandle("detailScroll").scrollTop(true);
        $scope.customerId = window.localStorage.customerId;
        customerDetailService.getCustomerDetail(getCustomerDetailSuccess, $scope.customerId);
        $scope.$apply();
      })


      $scope.show = function (val) {
        $scope.showFlag[val] = !$scope.showFlag[val];
        $ionicScrollDelegate.$getByHandle("detailScroll").resize();
      }

    }]);
