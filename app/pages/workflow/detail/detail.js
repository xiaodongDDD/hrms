angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.workflow-detail', {
          url: '/workflow-detail',
          params: {detail: {}},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/workflow/detail/detail.html',
              controller: 'WorkFLowDetailCtrl'
            }
          }
        });
    }]);

/**
 * @ngdoc controller
 * @name TimeSheetWriteCtrl
 * @module applicationModule
 * @description
 *
 * @author
 * gusenlin
 */
angular.module('applicationModule')
  .controller('WorkFLowDetailCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$ionicModal',
    '$timeout',
    'baseConfig',
    'TimeSheetService',
    'hmsPopup',
    'WorkFLowListService',
    function ($scope,
              $state,
              $stateParams,
              $ionicModal,
              $timeout,
              baseConfig,
              TimeSheetService,
              hmsPopup,
              WorkFLowListService) {
      var detail = $stateParams.detail;
      if(baseConfig.debug){
        console.log('WorkFLowDetailCtrl.detail ' + angular.toJson(detail));
      }

      $scope.historyList = [];
      $scope.singalArrayList = [];
      $scope.multipleArrayList = [];

      //var
      var success = function (result) {
        if(baseConfig.debug){
          console.log('getWorkflowDetail.result ' + angular.toJson(result));
        }
        if(result.status == 'S'){
          $scope.historyList = result.history;
          $scope.singalArrayList = result.workflow_data.details;
          $scope.multipleArrayList = result.workflow_data.lines;
        }
      }
      WorkFLowListService.getWorkflowDetail(success,detail.workflowId,detail.instanceId,'Y');
    }]);
