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
      $scope.showDetailArrow = true;
      $scope.listStatus = {
        todo: {
          selected: true
        },
        done: {
          selected: false
        }
      };

      var workflowIcon = 'build/img/application/profile@3x.png';
      var workflowType = '工作流类型';
      var workflowNode = '当前节点';
      var workflowPerson = '提交人';

      $scope.fetchTodoList = function () {
        if ($scope.listStatus.todo.selected) {

        } else {
          if (!$scope.fetchDataFlag && !$scope.pullRefreshDataFlag) {
            $scope.listStatus.todo.selected = true;
            $scope.listStatus.done.selected = false;
            getTodoList(false);
          }
        }
      };

      $scope.fetchDoneList = function () {
        if ($scope.listStatus.done.selected) {

        } else {
          if (!$scope.fetchDataFlag && !$scope.pullRefreshDataFlag) {
            $scope.listStatus.done.selected = true;
            $scope.listStatus.todo.selected = false;
            getDoneList(false);
          }

        }
      };

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
              submitPerson: data.employee_name,
              workflowId:data.workflow_id,
              instanceId:data.instance_id
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
        $timeout(function () {
          WorkFLowListService.getTodoList('N', success, error);
        }, 1000);
      };

      var getDoneList = function (pullRefresh) {
        $scope.list = [];
        if (pullRefresh) {
          $scope.fetchDataFlag = false;
          $scope.pullRefreshDataFlag = true;
        } else {
          $scope.fetchDataFlag = true;
        }
        var success = function (result) {
          var list = result.已审批列表;
          angular.forEach(list, function (data) {
            var item = {
              title1: data.workflow_desc,
              icon: workflowIcon,
              type: workflowType,
              typeValue: data.workflow_desc,
              node: workflowNode,
              nodeValue: data.status_name,
              submit: workflowPerson,
              submitPerson: data.created_by_name,
              workflowId:data.workflow_id,
              instanceId:data.instance_id
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
        $timeout(function () {
          WorkFLowListService.getTodoList('Y', success, error);
        }, 1000);
      };

      getTodoList(false);

      $scope.enterWorkflowDetail = function (detail) {
        $state.go('tab.workflow-detail', {"detail": detail})
      }

      $ionicModal.fromTemplateUrl('build/pages/application/timesheet-approve/modal/ts-filter-modal.html', { //筛选modal
        scope: $scope
      }).then(function (modal) {
        $scope.tsFilterModal = modal;
      });

      $scope.filterTsInfo = function () { //响应筛选按钮的方法
        $scope.tsFilterModal.show();
      };

      $scope.refresh = function () {
        if (!$scope.fetchDataFlag) {

          $scope.list = [];
          $scope.$apply();
          $timeout(function () {
            if ($scope.listStatus.todo.selected) {
              getTodoList(true);
            } else {
              getDoneList(true);
            }
          }, 300);
        } else {
          $scope.$broadcast('scroll.refreshComplete');
        }
      }
    }])

  .service('WorkFLowListService', ['hmsHttp',
    'baseConfig',
    'hmsPopup',
    function (hmsHttp,
              baseConfig,
              hmsPopup) {

      this.getTodoList = function (flag, success, error) {
        var url = baseConfig.businessPath + "/wfl_wx_workflow_appr/get_instance_list";
        var params = {'params': {'p_employee_code': window.localStorage.empno, 'p_flag': flag + ''}};
        hmsHttp.post(url, params).success(function (result) {
          success(result)
        }).error(function (response, status) {
          hmsPopup.showPopup('获取代办事项出错,可能是网络问题!');
          error(response);
        });
      };

      this.getWorkflowDetail = function (success,workflowId, recordId, submitFlag) {
        var url = baseConfig.businessPath + "/wfl_wx_workflow_appr/get_workflow_detail";
        var params = {
          "params": {
            "p_workflow_id": workflowId,
            "p_instance_id": recordId,
            "p_employee_code": window.localStorage.empno,
            "p_submit_flag": submitFlag
          }
        };
        hmsHttp.post(url, params).success(function (data) {
          success(data);
        }).error(function (data) {
        });
      };
    }]);
