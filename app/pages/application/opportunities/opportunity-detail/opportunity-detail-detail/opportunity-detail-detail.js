/**
 * Created by wangkaihua on 2016/11/29.
 */
'use strict';
angular.module('opportunityModule')
  .controller('opportunityDetailDetailCtrl', [
    '$scope',
    '$state',
    'opportunityDetailService',
    'hmsPopup',
    'OpportunityDetailCompetitorService',
    'addCompetitorsService',
    'opportunityDetailDataService',
    '$ionicScrollDelegate',
    function ($scope,
              $state,
              opportunityDetailService,
              hmsPopup,
              OpportunityDetailCompetitorService,
              addCompetitorsService,
              opportunityDetailDataService,
              $ionicScrollDelegate) {

      $scope.hideAreaFlag = [];

      $scope.hideArea = function(num){
        $scope.hideAreaFlag[num] = !$scope.hideAreaFlag[num];
        $ionicScrollDelegate.$getByHandle("detailScroll").resize();
      };

      $scope.$on('REFRESH_DETAIL',function(){
        $scope.opportunity = opportunityDetailDataService.getOpportunity();
        $scope.estimates = opportunityDetailDataService.getOpportunity().presells;
        $scope.competitors = opportunityDetailDataService.getOpportunity().competitors;
      });

      $scope.opportunity = opportunityDetailDataService.getOpportunity();
      $scope.estimates = opportunityDetailDataService.getOpportunity().presells;
      $scope.competitors = opportunityDetailDataService.getOpportunity().competitors;


    }]);
