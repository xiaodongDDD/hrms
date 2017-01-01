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

      customerDetailService.setIsEdit(false)
      customerDetailService.setTabNumber(1)
      $scope.customerId =  customerDetailService.getCustomerId();
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
        else {
          if(response.returnMsg){
            hmsPopup.showShortCenterToast(response.returnMsg)
          }else{
            hmsPopup.showShortCenterToast('服务器系统出现异常，请联系管理员！')
          }
        }
      }
      customerDetailService.getCustomerDetail(getCustomerDetailSuccess, $scope.customerId);

      $rootScope.$on('$ionicView.beforeEnter', function (e) {
        $scope.customerId =  customerDetailService.getCustomerId();
        console.log('详情页面的详情'+$scope.customerId);
        $ionicScrollDelegate.$getByHandle("detailScroll").scrollTop(false);
        if(customerDetailService.getIsCustomerAdd()){
          customerDetailService.getCustomerDetail(getCustomerDetailSuccess, $scope.customerId);
          $scope.$apply();
        }

      })


      $scope.show = function (val) {
        $scope.showFlag[val] = !$scope.showFlag[val];
        $ionicScrollDelegate.$getByHandle("detailScroll").resize();
      }

    }]);
