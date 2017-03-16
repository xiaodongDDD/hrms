/**
 * Created by wkh on 2017/3/14.
 */
'use strict';
angular.module('opportunityModule')
  .controller('opportunityDetailEstimateCtrl', [
    '$scope',
    '$state',
    'hmsPopup',
    'opportunityStateService',
    '$rootScope',
    'opportunityEstimateDetailService',
    function ($scope,
              $state,
              hmsPopup,
              opportunityStateService,
              $rootScope,
              opportunityEstimateDetailService) {
      $scope.goEstimateDetail=function(item){
        $state.go("tab.estimateDetail",{data:item});
      }

      $scope.estimates = [];
      $scope.value = {
        'opportunityId':window.localStorage.opportunityId,
        'page':1,
        'pageSize':100
      }

      var getEstimatesSuccess = function (response) {
        if(response){
          if(response.returnCode=='S'){
            $scope.estimates = response.oppProd_list;

            for(var i = 0;i<response.oppProd_list.length;i++){
              $scope.estimates[i].showName =  response.oppProd_list[i].productTypeName+' - '
                +response.oppProd_list[i].productName+' - '+response.oppProd_list[i].evel2ProductName;
            }
            console.log('获取到值：==='+angular.toJson($scope.estimates));
          }else{
            hmsPopup.showShortCenterToast('获取数据失败！');
          }
        }
      }
      opportunityEstimateDetailService.getEstimates(getEstimatesSuccess,$scope.value.opportunityId,1,100);

      $scope.doRefresh = function () {
        opportunityEstimateDetailService.getEstimates(getEstimatesSuccess,$scope.value.opportunityId,1,100);
        $scope.$broadcast('scroll.refreshComplete');
      }

    }]);
