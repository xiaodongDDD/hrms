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
    'workFLowListService',
    '$ionicScrollDelegate',
    function ($scope,
              $state,
              $stateParams,
              $ionicModal,
              $timeout,
              baseConfig,
              workFLowListService,
              $ionicScrollDelegate) {

      $scope.list = [];
      var cashList = [];
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

      var pageNumLimit = 10;

      $scope.loadMoreDataFlag = false;

      var pageNum = 1;

      var filterOption = {
        "currentSelectType": "ALL",
        "currentSubmitterFilter": "",
        "currentWorkflowFilter": "",
        "submitterFilter": [],
        "workflowNameFilter": []
      };

      var workflowDefaultIcon = 'build/img/application/profile@3x.png';
      var workflowType = '申请名称';
      var workflowNode = '当前节点';
      var workflowPerson = '提交人';

      var refreshTodoList = function () {
        $ionicScrollDelegate.$getByHandle('workflowListHandle').scrollTop();
        $scope.fetchDataFlag = true;
        $scope.pullRefreshDataFlag = false;
        $scope.listStatus.todo.selected = true;
        $scope.listStatus.done.selected = false;
        $timeout(function () {
          getTodoList(false);
        }, 500);
      };

      var showList = function () {
        $timeout(
          function () {
            $scope.fetchDataFlag = false;
          }, 100
        );
      };

      var processTodoList = function (result) {
        var list = result.unprocessedWorkflowList;
        angular.forEach(list, function (data) {
          var employeeImg = data.employee_img;
          if (!employeeImg || employeeImg == "") {
            employeeImg = workflowDefaultIcon;
          }
          var item = {
            title1: data.workflow_name,
            icon: employeeImg,
            type: workflowType,
            typeValue: data.instance_desc,
            node: workflowNode,
            nodeValue: data.current_node,
            submit: workflowPerson,
            submitPerson: data.employee_name,
            workflowId: data.workflow_id,
            instanceId: data.instance_id,
            recordId: data.record_id,
            nodeId: data.node_id,
            canApprove: data.approve,
            canBackTo: data.backTo,
            canGoBack: data.goBack,
            canRefuse: data.refuse,
            canTransmit: data.toOther,
            employeeCode: data.employee_code
          };
          $scope.list.push(item);
        });
      };

      var processDoneList = function (result) {
        var list = result.processedWorkflowList;
        angular.forEach(list, function (data) {
          var employeeImg = data.employee_img;
          if (!employeeImg || employeeImg == "") {
            employeeImg = workflowDefaultIcon;
          }
          var item = {
            title1: data.workflow_name,
            icon: employeeImg,
            type: workflowType,
            typeValue: data.instance_desc,
            node: workflowNode,
            nodeValue: data.status_name,
            submit: workflowPerson,
            submitPerson: data.created_by_name,
            workflowId: data.workflow_id,
            instanceId: data.instance_id,
            employeeCode: data.employee_code
          };
          $scope.list.push(item);
        });
      };

      var getTodoList = function (pullRefresh) {
        $scope.loadMoreDataFlag = false;
        pageNum = 1;
        $scope.list = [];
        if (pullRefresh) {
          $scope.fetchDataFlag = false;
          $scope.pullRefreshDataFlag = true;
        } else {
          $scope.fetchDataFlag = true;
        }
        var success = function (result) {
          processTodoList(result);
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }
          if (result.unprocessedWorkflowList.length == pageNumLimit) {
            $scope.loadMoreDataFlag = true;
          }
          showList();
        };
        var error = function (result) {
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }
          showList();
        };
        $timeout(function () {
          var filterCondition = dataFilterUtil().fetchFilterCondition();
          workFLowListService.getTodoList('N', filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
        }, 0);
      };

      var getDoneList = function (pullRefresh) {
        $scope.loadMoreDataFlag = false;
        pageNum = 1;
        $scope.list = [];
        cashList = [];
        if (pullRefresh) {
          $scope.fetchDataFlag = false;
          $scope.pullRefreshDataFlag = true;
        } else {
          $scope.fetchDataFlag = true;
        }
        var success = function (result) {
          processDoneList(result);
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }
          if (result.processedWorkflowList.length == pageNumLimit) {
            $scope.loadMoreDataFlag = true;
          }
          showList();
        };
        var error = function (result) {
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }
          showList();
        }
        $timeout(function () {
          var filterCondition = dataFilterUtil().fetchFilterCondition();
          workFLowListService.getTodoList('Y', filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
        }, 0);
      };

      $scope.fetchTodoList = function (refreshFlag) {
        if (baseConfig.debug) {
          console.log('$scope.fetchTodoList ');
        }
        dataFilterUtil().clearFilterCondition();
        $ionicScrollDelegate.$getByHandle('workflowListHandle').scrollTop();
        $timeout(function () {

          if ($scope.listStatus.todo.selected && !refreshFlag) {
          } else {
            if (!$scope.fetchDataFlag && !$scope.pullRefreshDataFlag) {
              $scope.listStatus.todo.selected = true;
              $scope.listStatus.done.selected = false;
              getTodoList(false);
              if(!refreshFlag){
                dataFilterUtil().query();
              }
            }
          }
        }, 100);
      };

      $scope.fetchDoneList = function (refreshFlag) {
        dataFilterUtil().clearFilterCondition();
        $ionicScrollDelegate.$getByHandle('workflowListHandle').scrollTop();
        $timeout(function () {
          if ($scope.listStatus.done.selected && !refreshFlag) {
          } else {
            if (!$scope.fetchDataFlag && !$scope.pullRefreshDataFlag) {
              $scope.listStatus.done.selected = true;
              $scope.listStatus.todo.selected = false;
              getDoneList(false);
              if(!refreshFlag) {
                dataFilterUtil().query();
              }
            }
          }
        }, 100);
      };

      var loadMoreFetchTodoList = function () {
        var success = function (result) {
          processTodoList(result);
          if (result.unprocessedWorkflowList.length < pageNumLimit) {
            $scope.loadMoreDataFlag = false;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        var error = function (result) {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        var filterCondition = dataFilterUtil().fetchFilterCondition();
        workFLowListService.getTodoList('N', filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
      };

      var loadMoreFetchDoneList = function () {
        var success = function (result) {
          processDoneList(result);
          if (result.processedWorkflowList.length < pageNumLimit) {
            $scope.loadMoreDataFlag = false;
          }
          $scope.$broadcast('scroll.infiniteScrollComplete');

        };
        var error = function (result) {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        var filterCondition = dataFilterUtil().fetchFilterCondition();
        workFLowListService.getTodoList('Y', filterCondition.workflowId, filterCondition.submitterId, pageNum, success, error);
      };

      $scope.loadMoreData = function () {
        pageNum = pageNum + 1;
        if ($scope.listStatus.done.selected) {
          loadMoreFetchDoneList();
        } else {
          loadMoreFetchTodoList();
        }
      }

      $scope.enterWorkflowDetail = function (detail) {
        var processedFlag = {value: false};
        if ($scope.listStatus.done.selected) {
          processedFlag.value = true;
        }
        $state.go('tab.workflow-detail', {"detail": detail, "processedFlag": processedFlag, "type": "WORKFLOWDETAIL"})
      }

      $ionicModal.fromTemplateUrl('build/pages/public/modal/hms-filter-modal.html', { //筛选modal
        scope: $scope
      }).then(function (modal) {
        $scope.workflowFilterModal = modal;
      });

      $scope.filterWorkFlowInfo = function () { //响应筛选按钮的方法
        $scope.workflowFilterModal.show();
      };

      $scope.refresh = function () {
        if (!$scope.fetchDataFlag) {
          dataFilterUtil().clearFilterCondition();
          $scope.list = [];
          $scope.$apply();
          $timeout(function () {
            if ($scope.listStatus.todo.selected) {
              getTodoList(true);
            } else {
              getDoneList(true);
            }
          }, 0);
        } else {
          $scope.$broadcast('scroll.refreshComplete');
        }
      };

      $scope.dataFilterHandle = {
        cancelDataFilter: function () {
          $scope.workflowFilterModal.hide();
        },
        clearDataFilterParams: function () {
          $scope.workflowFilterModal.hide();
        },
        confirmDataFilter: function () {
          if (baseConfig.debug) {
            console.log('dataFilterUtil.filterOption ' + angular.toJson(filterOption));
          }
          $scope.workflowFilterModal.hide();

          if (baseConfig.debug) {
            console.log('$scope.listStatus.todo.selected ' + $scope.listStatus.todo.selected)
          }

          if ($scope.listStatus.todo.selected) {
            $scope.fetchTodoList(true);
          } else {
            $scope.fetchDoneList(true);
          }

        },
        selectFilterType: function (type) {
          if (baseConfig.debug) {
            console.log('type ' + angular.toJson(type));
            console.log('dataFilterUtil().filterOption.workflowNameFilter ' +
              angular.toJson(filterOption.workflowNameFilter));
            console.log('dataFilterUtil().filterOption.submitterFilter ' +
              angular.toJson(filterOption.submitterFilter));
          }
          angular.forEach($scope.selectFilterTypeList, function (data) {
            data.selected = false;
          });
          type.selected = true;
          $scope.filterItemList = [];

          $ionicScrollDelegate.$getByHandle('hmsFilterCondition').scrollTop();

          if (type.code == 'ALL') {
            filterOption.currentSelectType = 'ALL';
            $scope.filterItemList = filterOption.noConditionFilter;

          } else if (type.code == 'PERSON') {
            filterOption.currentSelectType = 'PERSON';
            $scope.filterItemList = filterOption.submitterFilter;
          } else if (type.code == 'WORKFLOWNODE') {
            filterOption.currentSelectType = 'WORKFLOWNODE';
            $scope.filterItemList = filterOption.workflowNameFilter;
          }
        },
        selectFilterItem: function (filterItem) {
          angular.forEach($scope.filterItemList, function (data) {
            data.selected = false;
          });
          filterItem.selected = true;
          if (filterOption.currentSelectType == 'PERSON') {
            filterOption.currentSubmitterFilter = filterItem.itemCode;
          }
          if (filterOption.currentSelectType == 'WORKFLOWNODE') {
            filterOption.currentWorkflowFilter = filterItem.itemCode;
          }
        }
      };

      var dataFilterUtil = function () {
        var self = {};

        self.clearFilterCondition = function () {
          filterOption.currentSelectType = 'ALL'
          filterOption.currentWorkflowFilter = '';
          filterOption.currentSubmitterFilter = '';
        };

        self.fetchFilterCondition = function () {
          var condition = {
            "workflowId": "",
            "submitterId": ""
          };
          if (filterOption.currentSelectType == 'ALL') {
            return condition;
          } else {
            condition.workflowId = filterOption.currentWorkflowFilter;
            condition.submitterId = filterOption.currentSubmitterFilter;
            return condition;
          }
        };

        self.query = function () {
          var success = function (result) {
            if (result.returnStatus == 'S') {
              if (baseConfig.debug) {
                console.log('result ' + angular.toJson(result));
              }
              $scope.selectFilterTypeList = [
                {
                  "code": "ALL",
                  "name": "全部",
                  "selected": true
                },
                {
                  "code": "PERSON",
                  "name": "提交人",
                  "selected": false
                },
                {
                  "code": "WORKFLOWNODE",
                  "name": "工作流类型",
                  "selected": false
                }
              ];
              if (baseConfig.debug) {
                console.log('dataFilterUtil.cashList ' + angular.toJson(cashList));
              }
              filterOption.submitterFilter = [];
              filterOption.workflowNameFilter = [];
              filterOption.noConditionFilter = [];
              $scope.filterItemList = [];
              filterOption.currentSubmitterFilter = '';
              filterOption.currentWorkflowFilter = '';
              var noCondition = {
                "itemCode": '',
                "itemDesc": '全部',
                "selected": true
              };
              filterOption.noConditionFilter.push(noCondition);
              var workflowF = {
                "itemCode": '',
                "itemDesc": '全部',
                "selected": true
              };
              filterOption.workflowNameFilter.push(workflowF);
              angular.forEach(result.returnData.workflowList, function (data) {
                var workflowNode = {
                  "itemCode": data.workflowId,
                  "itemDesc": data.workflowName,
                  "selected": false
                };
                filterOption.workflowNameFilter.push(workflowNode);
              });
              var submitterF = {
                "itemCode": '',
                "itemDesc": '全部',
                "selected": true
              };
              filterOption.submitterFilter.push(submitterF);
              angular.forEach(result.returnData.personList, function (data) {
                var person = {
                  "itemCode": data.submitterId,
                  "itemDesc": data.submitterName,
                  "selected": false
                };
                filterOption.submitterFilter.push(person);
              });
              $scope.filterItemList = filterOption.noConditionFilter;

              if (baseConfig.debug) {
                console.log('self.filterOption.workflowNameFilter ' + angular.toJson(filterOption.workflowNameFilter));
                console.log('self.filterOption.submitterFilter ' + angular.toJson(filterOption.submitterFilter));
              }

              //$scope.$apply();
            }
          };
          var error = function (response) {
          };
          var processedFlag = 'N';
          if ($scope.listStatus.done.selected) {
            processedFlag = 'Y';
          }
          workFLowListService.get_workflow_filter(success, error, processedFlag);

        };
        return self;
      };

      getTodoList(false);
      dataFilterUtil().query();

      $scope.$on('$ionicView.enter', function (e) {
        if (baseConfig.debug) {
          console.log('WorkFLowListCtrl.$ionicView.enter');
        }
      });

      $scope.$on('$ionicView.beforeEnter', function () {
        if (baseConfig.debug) {
          console.log('WorkFLowListCtrl.$ionicView.beforeEnter');
        }
        if (workFLowListService.getRefreshWorkflowList().flag == true) {
          workFLowListService.setRefreshWorkflowList(false);
          if (baseConfig.debug) {
            console.log('refresh workflow list');
          }
          refreshTodoList();
        }
      });

      $scope.$on('$ionicView.beforeLeave', function () {
        if (baseConfig.debug) {
          console.log('WorkFLowListCtrl.$ionicView.beforeLeave');
        }
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('WorkFLowListCtrl.$destroy');
        }
      });
    }]);
