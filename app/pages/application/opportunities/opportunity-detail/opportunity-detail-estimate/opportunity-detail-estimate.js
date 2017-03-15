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
    function ($scope,
              $state,
              hmsPopup,
              opportunityStateService,
              $rootScope) {
      $scope.goEstimateDetail=function(){
        $state.go("tab.estimateDetail");
      }

    }]);
