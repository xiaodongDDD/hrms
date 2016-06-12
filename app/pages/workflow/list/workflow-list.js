angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.workflow-list', {
          url: '/workflow-list',
          params: {day: {}},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/workflow/list/workflow-list.html',
              controller: 'WorkFLowListCtrl'
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
  .controller('WorkFLowListCtrl', [
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

      $scope.list = [];
      $scope.fetchDataFlag = true;
      $scope.pullRefreshDataFlag = false;

      var workflowIcon = 'build/img/application/profile@3x.png';
      var workflowType = '工作流类型';
      var workflowNode = '当前节点';
      var workflowPerson = '提交人';

      var getTodoList = function (pullRefresh) {
        $scope.list = [];
        if (pullRefresh) {
          $scope.fetchDataFlag = false;
          $scope.pullRefreshDataFlag = true;
        } else {
          $scope.fetchDataFlag = true;
        }
        var success = function (result) {
          var list = result.待审批列表;
          angular.forEach(list, function (data) {
            var item = {
              title1: data.workflow_name,
              icon: workflowIcon,
              type: workflowType,
              typeValue: data.workflow_name,
              node: workflowNode,
              nodeValue: data.current_node,
              submit: workflowPerson,
              submitPerson: data.employee_name
            };
            $scope.list.push(item);
          });
          $scope.fetchDataFlag = false;
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }

        };
        var error = function (result) {
          $scope.fetchDataFlag = false;
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }
        }
        WorkFLowListService.getTodoList(success, error);
      };

      getTodoList(false);

      $ionicModal.fromTemplateUrl('build/pages/application/timesheet-approve/modal/ts-filter-modal.html', { //筛选modal
        scope: $scope
      }).then(function (modal) {
        $scope.tsFilterModal = modal;
      });

      $scope.filterTsInfo = function () { //响应筛选按钮的方法
        $scope.tsFilterModal.show();
      };

      $scope.refresh = function () {
        $scope.list = [];
        $scope.$apply();
        $timeout(function () {
          getTodoList(true);
        },300);
      }
    }])

  .service('WorkFLowListService', ['hmsHttp',
    'baseConfig',
    'hmsPopup',
    function (hmsHttp,
              baseConfig,
              hmsPopup) {

      this.getTodoList = function (success, error) {
        var url = baseConfig.businessPath + "/wfl_wx_workflow_appr/get_instance_list";
        var params = {'params': {'p_employee_code': window.localStorage.empno, 'p_flag': 'N'}};
        hmsHttp.post(url, params).success(function (result) {
          success(result)
        }).error(function (response, status) {
          hmsPopup.showPopup('获取代办事项出错,可能是网络问题!');
          error(response);
        });
      }
    }]);
