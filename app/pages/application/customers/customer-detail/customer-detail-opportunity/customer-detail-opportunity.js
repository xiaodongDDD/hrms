/**
 * Created by ZaraNengap on 2016/11/16.
 */
'use strict';
angular.module('customerModule')
  .controller('CustomerDetailOpportunityCtrl', [
    '$scope',
    '$state',
    'hmsPopup',
    '$timeout',
    'customerOpportunityService',
    function ($scope,
              $state,
              hmsPopup,
              $timeout,
              customerOpportunityService) {

      $scope.page = 1;
      $scope.pageSize = 10;
      $scope.customerId = window.localStorage.customerId;

      $scope.showLoading = true;

      var initOpportunitySuccess = function(response){
        $scope.showLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
        $scope.opportunities = [];
        if(response.returnCode == "S"){
          $scope.opportunities = response.customer_opportunity;
          var length = response.customer_opportunity.length;
          $scope.moreOpportunityCanBeLoaded = length == $scope.pageSize
        } else {
          if(response.returnMsg){
            hmsPopup.showShortCenterToast(response.returnMsg)
          }else{
            hmsPopup.showShortCenterToast('服务器系统出现异常，请联系管理员！')
          }
        }
      };

      $scope.goDetail=function(para) {
        $state.go("tab.opportunity-detail",{data:para});
      };

      customerOpportunityService.getOpportunities(initOpportunitySuccess,{page:$scope.page,pageSize:$scope.pageSize,customerId: $scope.customerId,opportunityType:"HCRM_OPPORTUNITY"});

      $scope.doRefresh = function(){
        $scope.page = 1;
        $scope.pageSize = 10;
        $scope.showLoading = true;
        customerOpportunityService.getOpportunities(initOpportunitySuccess,{page:$scope.page,pageSize:$scope.pageSize,customerId: $scope.customerId,opportunityType:"HCRM_OPPORTUNITY"});
      };

      $scope.moreOpportunityCanBeLoaded = false;

      var getMoreOpportunitySuccess = function(response){
        $scope.$broadcast('scroll.infiniteScrollComplete');
        if(response.returnCode == "S"){
          $scope.opportunities = $scope.opportunities.concat(response.customer_opportunity);
          var length = response.customer_opportunity.length;
          $scope.moreOpportunityCanBeLoaded = length == $scope.pageSize;
        } else {
          if(response.returnMsg){
            hmsPopup.showShortCenterToast(response.returnMsg)
          }else{
            hmsPopup.showShortCenterToast('服务器系统出现异常，请联系管理员！')
          }
        }
      };

      $scope.loadMoreOpportunity = function(){
        $scope.page++;
        customerOpportunityService.getOpportunities(getMoreOpportunitySuccess,{page:$scope.page,pageSize:$scope.pageSize,customerId: $scope.customerId,opportunityType:"HCRM_OPPORTUNITY"});
      };

      $scope.$on('REFRESH_OPPORTUNITY',function() {
        $scope.doRefresh();
      });


    }]);

angular.module('customerModule')
  .service('customerOpportunityService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    '$http',
    function(hmsHttp,
             hmsPopup,
             baseConfig,
             $http) {

      var baseUrl = baseConfig.basePath;

      this.getOpportunities = function (success, key) {
        hmsHttp.post(baseUrl + 'customer_opportunity', key).success(function (result) {
          success(result);
        }).error(function (response, status) {
          //hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });

      };

    }
  ]);
