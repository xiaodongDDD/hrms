/**
 * Created by wangkaihua on 2016/10/9.
 */
'use strict';
angular.module('opportunityModule')
  .controller('opportunityDetailStateCtrl', [
    '$scope',
    'hmsPopup',
    'opportunityStateService',
    '$rootScope',
    function ($scope,
              hmsPopup,
              opportunityStateService,
              $rootScope) {

      $scope.states = [];
      $scope.moreDataCanBeLoaded = false;

      $scope.page = 1;
      $scope.pageSize = 10;
      $scope.opportunityId = window.localStorage.opportunityId;

      var getOpportunityStateSuccess = function(response){
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.showLoading = false;
        console.log(response);
        if(response.returnCode == 'S'){
          $scope.moreDataCanBeLoaded = response.opportunity_dynamics.length == $scope.pageSize;
          $scope.states = $scope.states.concat(response.opportunity_dynamics);
        } else {
          $scope.moreDataCanBeLoaded = false;
        }
      };

      var getStateFailure = function(){
        $scope.moreDataCanBeLoaded = false;
        $scope.showLoading = false;
      };

      $scope.showLoading = true;
      opportunityStateService.getOpportunityState(getOpportunityStateSuccess, $scope.page, $scope.pageSize, $scope.opportunityId, getStateFailure);

      $scope.loadMore = function() {
        if(!$scope.moreDataCanBeLoaded)
            return ;
        $scope.page++;
        opportunityStateService.getOpportunityState(getOpportunityStateSuccess, $scope.page, $scope.pageSize, $scope.opportunityId, getStateFailure);
      };

      $rootScope.$on('FRESH_STATE',function(){
        $scope.showLoading = true;
        $scope.doRefresh();
      });

      $scope.doRefresh = function(){
        $scope.states = [];
        $scope.moreDataCanBeLoaded = false;
        $scope.page = 1;
        $scope.pageSize = 10;
        $scope.opportunityId = window.localStorage.opportunityId;
        opportunityStateService.getOpportunityState(getOpportunityStateSuccess, $scope.page, $scope.pageSize, $scope.opportunityId, getStateFailure);
      };


    }]);

angular.module('opportunityModule')
  .service('opportunityStateService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function(hmsHttp,
             hmsPopup,
             baseConfig) {

      var baseUrl = baseConfig.basePath;

      this.getOpportunityState = function(success, page, pageSize, opportunityId, failure) {
        var params = {
          page: page,
          pageSize: pageSize,
          opportunityId: opportunityId
        };
        hmsHttp.post(baseUrl + 'sale_dynamics', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
          failure();
        });

      };

    }
  ]);

