/**
 * Created by zaranengap on 2016/12/15.
 */
angular.module('customerModule')
  .controller('CustomerDetailClueCtrl', [
    '$scope',
    '$state',
    'hmsPopup',
    '$timeout',
    'customerOpportunityService',
    'customerDetailService',
    '$ionicHistory',
    function ($scope,
              $state,
              hmsPopup,
              $timeout,
              customerOpportunityService,
              customerDetailService,
              $ionicHistory) {

      $scope.page = 1;
      $scope.pageSize = 10;
      $scope.customerId = customerDetailService.getCustomerId();

      $scope.showLoading = true;

      var initClueSuccess = function(response){
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
       /* $state.go("tab.clue-detail",{data:para});*/
        if($ionicHistory.viewHistory().backView.stateName=="tab.contactDetail"){
          $state.go('tab.clue-detail2', {data: para});
        }else{
          $state.go('tab.clue-detail', {data: para});
        }
      };

      customerOpportunityService.getOpportunities(initClueSuccess,{page:$scope.page,pageSize:$scope.pageSize,customerId: $scope.customerId,opportunityType:"HCRM_CLUE"});

      $scope.doRefresh = function(){
        $scope.page = 1;
        $scope.pageSize = 10;
        $scope.showLoading = true;
        customerOpportunityService.getOpportunities(initClueSuccess,{page:$scope.page,pageSize:$scope.pageSize,customerId: $scope.customerId,opportunityType:"HCRM_CLUE"});
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
        customerOpportunityService.getOpportunities(getMoreOpportunitySuccess,{page:$scope.page,pageSize:$scope.pageSize,customerId: $scope.customerId,opportunityType:"HCRM_CLUE"});
      };

      $scope.$on('REFRESH_CLUE',function() {
        $scope.doRefresh();
      });


    }]);
