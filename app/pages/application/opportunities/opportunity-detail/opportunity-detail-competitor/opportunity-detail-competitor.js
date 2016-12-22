/**
 * Created by wkh on 2016/11/18.
 */
'use strict';
angular.module('opportunityModule')
  .controller('OpportunityDetailCompetitorCtrl', [
    '$scope',
    '$state',
    'hmsPopup',
    'hmsHttp',
    '$ionicActionSheet',
    'contactLocal',
    '$cordovaActionSheet',
    'baseConfig',
    '$ionicModal',
    'OpportunityDetailCompetitorService',
    'opportunityDetailDataService',
    function ($scope,
              $state,
              hmsPopup,
              hmsHttp,
              $ionicActionSheet,
              contactLocal,
              $cordovaActionSheet,
              baseConfig,
              $ionicModal,
              OpportunityDetailCompetitorService,
              opportunityDetailDataService){

      $scope.Global="HCRM_GLOBAL";

      $scope.competitors=opportunityDetailDataService.getOpportunity().competitors;

      $scope.doRefresh=function(){
        $scope.competitors=opportunityDetailDataService.getOpportunity().competitors;
        $scope.$broadcast('scroll.refreshComplete');
      };

      $scope.goCompetitorDetail = function (item) {
        $state.go("tab.competitor-detail", {param: item});
      };


    }])


  .service('OpportunityDetailCompetitorService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function (hmsHttp,
              hmsPopup,
              baseConfig) {
      var baseUrl = baseConfig.basePath;
      //查询竞争对手列表
      this.getCompetitorList = function(success,params) {
        hmsHttp.post(baseUrl + 'opportunity_competitor', params).success(function(result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };
    }]);
