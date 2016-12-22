/**
 * Created by zaranengap on 2016/12/12.
 */
angular.module('clueModule')
  .controller('clueDetailStateCtrl', [
    '$scope',
    'hmsPopup',
    'clueStateService',
    '$rootScope',
    function ($scope,
              hmsPopup,
              clueStateService,
              $rootScope) {

      $scope.states = [];
      $scope.moreDataCanBeLoaded = false;

      $scope.page = 1;
      $scope.pageSize = 10;
      $scope.clueId = window.localStorage.clueId;

      var getOpportunityStateSuccess = function(response){
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.showLoading = false;
        console.log(response);
        if(response.returnCode == 'S'){
          $scope.moreDataCanBeLoaded = response.opportunity_dynamics.length % $scope.pageSize == $scope.pageSize;
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
      clueStateService.getOpportunityState(getOpportunityStateSuccess, $scope.page, $scope.pageSize, $scope.clueId, getStateFailure);

      $scope.loadMore = function() {
        if(!$scope.moreDataCanBeLoaded)
          return ;
        $scope.page++;
        clueStateService.getOpportunityState(getOpportunityStateSuccess, $scope.page, $scope.pageSize, $scope.clueId, getStateFailure);
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
        $scope.clueId = window.localStorage.clueId;
        clueStateService.getOpportunityState(getOpportunityStateSuccess, $scope.page, $scope.pageSize, $scope.clueId, getStateFailure);
      };


    }]);

angular.module('clueModule')
  .service('clueStateService', ['hmsHttp',
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
