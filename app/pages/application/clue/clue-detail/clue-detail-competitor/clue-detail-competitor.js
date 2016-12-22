/**
 * Created by zaranengap on 2016/12/12.
 */
'use strict';
angular.module('clueModule')
  .controller('ClueDetailCompetitorCtrl', [
    '$scope',
    '$state',
    'hmsPopup',
    'clueDetailDataService',
    'clueDetailService',
    function ($scope,
              $state,
              hmsPopup,
              clueDetailDataService,
              clueDetailService){

      $scope.Global="HCRM_GLOBAL";

      $scope.competitors = clueDetailDataService.getClue().competitors;

      var getClueCompetitorSuccess = function(response){
        $scope.$broadcast('scroll.refreshComplete');
        clueDetailDataService.setClueItem('competitors', response.competitor_list);
        $scope.competitors = clueDetailDataService.getClue().competitors;
      };

      $scope.doRefresh=function(){
        clueDetailService.getCompetitorList(getClueCompetitorSuccess, window.localStorage.clueId);
      };

      $scope.goCompetitorDetail = function (item) {
        $state.go("tab.competitor-detail", {param: item});
      };


    }]);
