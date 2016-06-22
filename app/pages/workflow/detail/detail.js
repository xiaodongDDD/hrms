angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.workflow-detail', {
          url: '/workflow-detail',
          params: {"detail": {}, "processedFlag": {}},
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
    '$ionicScrollDelegate',
    'baseConfig',
    'TimeSheetService',
    'hmsPopup',
    'WorkFLowListService',
    function ($scope,
              $state,
              $stateParams,
              $ionicModal,
              $timeout,
              $ionicScrollDelegate,
              baseConfig,
              TimeSheetService,
              hmsPopup,
              WorkFLowListService) {
      var detail = $stateParams.detail;
      if (baseConfig.debug) {
        console.log('WorkFLowDetailCtrl.detail ' + angular.toJson(detail));
      }

      $scope.historyList = [];
      $scope.singalArrayList = [];

      var multipleArrayList = [];
      $scope.multipleLine = [];

      $scope.workflowActionShowFlag = !$stateParams.processedFlag.value;

      var processLine = function (line) {
        var oneLine = {
          title: line.line_big_title,
          arrayList: line.line,
          currentPage: 1,
          currentArray: []
        };
        if (line.line.length > 0) {
          var currentList = [];
          var lineTitle = line.line_title;
          var list = line.line[0].line_values;
          for (var i = 0; i < list.length; i++) {
            var array = {
              "name": lineTitle[i].line_title,
              "value": list[i].line_value
            };
            currentList.push(array);
          }
          oneLine.currentArray = currentList;
        }
        return oneLine;
      };

      $scope.showContent = function (array) {
        if(array.showFlag){
          array.showFlag = false;
        }else{
          array.showFlag = true;
        }
        $ionicScrollDelegate.resize();
      }

      $scope.toBack = function (array) {
        if (array.currentPage <= 1) {
          return;
        } else {
          var currentPage = array.currentPage - 1;
          array.currentPage = currentPage;
          for (var i = 0; i < array.currentArray.length; i++) {
            array.currentArray[i].value = array.arrayList[currentPage - 1].line_values[i].line_value;
          }
        }
      };
      $scope.goForward = function (array) {
        if (array.currentPage >= array.arrayList.length) {
          return;
        } else {
          var currentPage = array.currentPage + 1;
          array.currentPage = currentPage;
          for (var i = 0; i < array.currentArray.length; i++) {
            array.currentArray[i].value = array.arrayList[currentPage - 1].line_values[i].line_value;
          }
        }
      }
      //var
      var success = function (result) {
        if (baseConfig.debug) {
          console.log('getWorkflowDetail.result ' + angular.toJson(result));
        }
        if (result.status == 'S') {
          $scope.historyList = result.history;
          if (result.workflow_data) {
            $scope.singalArrayList = result.workflow_data.details;
            multipleArrayList = result.workflow_data.lines;
            angular.forEach(multipleArrayList, function (data) {
              $scope.multipleLine.push(processLine(data));
            });
            if (baseConfig.debug) {
              console.log('$scope.multipleLine ' + angular.toJson($scope.multipleLine));
            }
          }
        }
      }
      WorkFLowListService.getWorkflowDetail(success, detail.workflowId, detail.instanceId, 'Y');
    }]);
