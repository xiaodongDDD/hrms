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
    'hmsPopup',
    'baseConfig',
    'workFLowListService',
    '$ionicScrollDelegate',
    function ($scope,
              $state,
              $stateParams,
              $ionicModal,
              $timeout,
              hmsPopup,
              baseConfig,
              workFLowListService,
              $ionicScrollDelegate) {
      $scope.isWeixinWebview = baseConfig.isWeixinWebview;

      //缓存工作流列表
      var cashList = [];

      //每个页面分页的数据
      var pageNumLimit = 10;

      //当前所处的页面
      var pageNum = 1;

      //是否全选
      $scope.selectAll = {flag: false};

      //双向绑定工作流列表
      $scope.list = [];

      $scope.fetchDataFlag = true;

      $scope.pullRefreshDataFlag = false;

      $scope.showDetailArrow = true;

      //加载更多数据的标志
      $scope.loadMoreDataFlag = false;

      //批量审批功能按钮
      $scope.batchProcessFlag = false;

      //待办-已办-我的三个列表的切换
      $scope.listStatus = {
        todo: {
          selected: true
        },
        done: {
          selected: false
        },
        mine: {
          selected: false
        }
      };

      var filterOption = {
        "currentSelectType": "ALL",
        "currentSubmitterFilter": "",
        "currentWorkflowFilter": "",
        "submitterFilter": [],
        "workflowNameFilter": []
      };

      if (ionic.Platform.isIOS() && $scope.isWeixinWebview){
        if(document.setTitle){
          document.setTitle('待审批项');
        }
      }

      var refreshTodoList = function () {
        pageNum = 1;
        $ionicScrollDelegate.$getByHandle('workflowListHandle').scrollTop();
        $scope.fetchDataFlag = true;
        $scope.pullRefreshDataFlag = false;
        $scope.listStatus.todo.selected = true;
        $scope.listStatus.done.selected = false;
        $scope.listStatus.mine.selected = false;
        $timeout(function () {
          workFLowListService.getTodoListQuery($scope, pageNum, cashList, false, dataFilterUtil());
        }, 300);
      };

      $scope.changeBatchProcess = function () {
        if(!$scope.listStatus.todo.selected){
          return;
        }

        if ($scope.batchProcessFlag) {
          $scope.batchProcessFlag = false;
        } else {
          $scope.batchProcessFlag = true;
        }

        angular.forEach($scope.list, function (data) {
          data.selectedFlag = false;
          data.showCheckedFlag = $scope.batchProcessFlag;
        });
      };

      $scope.fetchTodoList = function (refreshFlag) {
        if($scope.batchProcessFlag){
          return;
        }

        if (baseConfig.debug) {
          console.log('$scope.fetchTodoList ');
        }
        if (!refreshFlag) {
          dataFilterUtil().clearFilterCondition();
        }
        $ionicScrollDelegate.$getByHandle('workflowListHandle').scrollTop();
        $timeout(function () {

          if ($scope.listStatus.todo.selected && !refreshFlag) {

          } else {
            if (!$scope.fetchDataFlag && !$scope.pullRefreshDataFlag) {
              $scope.listStatus.todo.selected = true;
              $scope.listStatus.done.selected = false;
              $scope.listStatus.mine.selected = false;
              workFLowListService.getTodoListQuery($scope, pageNum, cashList, false, dataFilterUtil());
              if (!refreshFlag) {
                dataFilterUtil().query();
              }
            }
          }
        }, 100);
      };

      $scope.fetchDoneList = function (refreshFlag) {

        if($scope.batchProcessFlag){
          return;
        }

        if (!refreshFlag) {
          dataFilterUtil().clearFilterCondition();
        }
        $ionicScrollDelegate.$getByHandle('workflowListHandle').scrollTop();
        $timeout(function () {
          if ($scope.listStatus.done.selected && !refreshFlag) {
          } else {
            if (!$scope.fetchDataFlag && !$scope.pullRefreshDataFlag) {
              $scope.listStatus.done.selected = true;
              $scope.listStatus.todo.selected = false;
              $scope.listStatus.mine.selected = false;
              workFLowListService.getDoneListQuery($scope, pageNum, cashList, false, dataFilterUtil());
              if (!refreshFlag) {
                dataFilterUtil().query();
              }
            }
          }
        }, 100);
      };

      $scope.fetchMineList = function (refreshFlag) {

        if($scope.batchProcessFlag){
          return;
        }

        if (!refreshFlag) {
          dataFilterUtil().clearFilterCondition();
        }
        $ionicScrollDelegate.$getByHandle('workflowListHandle').scrollTop();
        $timeout(function () {
          if ($scope.listStatus.mine.selected && !refreshFlag) {
          } else {
            if (!$scope.fetchDataFlag && !$scope.pullRefreshDataFlag) {
              $scope.listStatus.mine.selected = true;
              $scope.listStatus.done.selected = false;
              $scope.listStatus.todo.selected = false;
              workFLowListService.getMineListQuery($scope, pageNum, cashList, false, dataFilterUtil());
              if (!refreshFlag) {
                dataFilterUtil().query();
              }
            }
          }
        }, 100);
      };

      $scope.loadMoreData = function () {
        pageNum = pageNum + 1;
        if ($scope.listStatus.done.selected) {
          workFLowListService.loadMoreFetchDoneList($scope, dataFilterUtil(), pageNum);
        } else if ($scope.listStatus.todo.selected) {
          workFLowListService.loadMoreFetchTodoList($scope, dataFilterUtil(), pageNum);
        } else {
          workFLowListService.loadMoreFetchMineList($scope, dataFilterUtil(), pageNum);
        }
      };

      $scope.enterWorkflowDetail = function (detail) {
        if ($scope.batchProcessFlag) {
          //批量审批
          if (detail.selectedFlag) {
            detail.selectedFlag = false;
          } else {
            detail.selectedFlag = true;
          }
        } else {
          var processedFlag = {value: false};
          var myPrsonalApplicationFlag = false;
          if ($scope.listStatus.done.selected || $scope.listStatus.mine.selected) {
            processedFlag.value = true;
          }
          if ($scope.listStatus.mine.selected) {
            myPrsonalApplicationFlag = true;
          }
          if(!$scope.isWeixinWebview){
            $state.go('tab.workflow-detail', {
              "detail": detail,
              "processedFlag": processedFlag,
              "myPrsonalApplicationFlag": myPrsonalApplicationFlag,
              "type": "WORKFLOWDETAIL"
            });
          } else {
            workFLowListService.saveParamData({
              "detail": detail,
              "processedFlag": processedFlag,
              "myPrsonalApplicationFlag": myPrsonalApplicationFlag,
              "type": "WORKFLOWDETAIL"
            });

            $state.go('tab.workflow-detail', workFLowListService.getParamData());
          }
        }
      }

      $ionicModal.fromTemplateUrl('build/pages/public/modal/hms-filter-modal.html', { //筛选modal
        scope: $scope
      }).then(function (modal) {
        $scope.workflowFilterModal = modal;
      });

      $scope.filterWorkFlowInfo = function () { //响应筛选按钮的方法
        if($scope.listStatus.mine.selected == true){
          return;
        }
        $scope.workflowFilterModal.show();
      };

      $scope.refresh = function () {
        if (!$scope.batchProcessFlag && !$scope.fetchDataFlag) {
          dataFilterUtil().clearFilterCondition();
          $scope.list = [];
          $scope.$apply();
          $timeout(function () {
            if ($scope.listStatus.todo.selected) {
              workFLowListService.getTodoListQuery($scope, pageNum, cashList, true, dataFilterUtil());
            } else if ($scope.listStatus.done.selected) {
              workFLowListService.getDoneListQuery($scope, pageNum, cashList, true, dataFilterUtil());
            } else {
              workFLowListService.getMineListQuery($scope, pageNum, cashList, true, dataFilterUtil());
            }
          }, 0);
        } else {
          $scope.$broadcast('scroll.refreshComplete');
        }
      };

      //全选工作流
      $scope.selectAll = function () {
        if ($scope.selectAll.flag) {
          $scope.selectAll.flag = false;
        }
        else {
          $scope.selectAll.flag = true;
        }
        angular.forEach($scope.list, function (data) {
          data.selectedFlag = $scope.selectAll.flag;
        });
      };


      //全部处理
      $scope.processBatchWorkflow = function (action) {
        var approveList = [];
        angular.forEach($scope.list,function (data) {
          if(data.selectedFlag){
            var approveItem = {
              "p_record_id": data.recordId + ""
            }
            approveList.push(approveItem);
          }
        });

        if(approveList.length == 0){
          hmsPopup.showPopup('请至少选择一条要审批的工作流!');
          return;
        }

        if(baseConfig.debug){
          console.log('processBatchWorkflow.approveList ' + angular.toJson(approveList))
        }

        var approveListJson = {"approve_list": approveList};
        var comment = '移动HRMS批量拒绝';
        if(action == 0){
          comment = '移动HRMS批量审批';
        }
        var params =
        {
          "params": {
            "p_approve_flag": action + "",
            "p_comment": comment,
            "p_employee_number": window.localStorage.empno,
            "p_param_json": JSON.stringify(approveListJson)
          }
        }

        var success = function (result) {
          if(result.status == 'S'){
            hmsPopup.showPopup('批量处理工作流成功!');
            $scope.batchProcessFlag = false;
            $scope.fetchTodoList(true);
          }else{
            hmsPopup.showPopup('批量处理工作流失败!');
          }
        };

        var error = function(){
        };

        var submit = function (buttonIndex) {
          if (baseConfig.debug) {
            console.log('You selected button ' + buttonIndex);
          }
          if (buttonIndex == 1) {
            hmsPopup.showLoading('批量处理工作流中');
            workFLowListService.batchProcessWorkflow(success,error,params);
          } else {
          }
        }
        hmsPopup.confirm("是否确认批量处理工作流?", "", submit);
      };

      var submitAction = function (actionType, item) {
        var params = {
          "params": {
            p_action_type: actionType + "",
            p_attr1: "",
            p_attr2: "",
            p_attr3: "",
            p_attr4: "",
            p_attr5: "",
            p_comment: "",
            p_desc: "",
            p_employee_code: window.localStorage.empno,
            p_record_id: item.recordId + ""
          }
        };
        var success = function (result) {
          if (result.status == 'S') {
            var index = $scope.list.indexOf(item);
            console.log('submitAction.success.index ' + index)
            $scope.list.splice(index, 1);
            hmsPopup.showPopup('处理工作流成功!');
          }
          else {
            hmsPopup.showPopup('处理工作流失败,请进入详细界面填写完整信息!');
          }
        };
        var error = function (response) {
        };

        var submit = function (buttonIndex) {
          if (baseConfig.debug) {
            console.log('You selected button ' + buttonIndex);
          }
          if (buttonIndex == 1) {
            hmsPopup.showLoading('处理工作流中');
            workFLowListService.submitAction(success, error, params);
          } else {
          }
        }
        hmsPopup.confirm("是否确认提交工作流?", "", submit);
      }

      $scope.workflowActionHandle = {
        approveWorkflow: function (item) {
          submitAction('0', item);
        },
        rejectWorkflow: function (item) {
          submitAction('-1', item);
        },
        cancelWorkflow: function (item) {
          workFLowListService.cancelMyWorkflow(item.instanceId,item);
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
            //console.log('dataFilterUtil().filterOption.submitterFilter ' +
            //angular.toJson(filterOption.submitterFilter));
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
          if (baseConfig.debug) {
            console.log('filterItem ' + angular.toJson(filterItem));
          }
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
          if (baseConfig.debug) {
            console.log('filterOption.currentSubmitterFilter ' + filterOption.currentSubmitterFilter);
            console.log('filterOption.currentWorkflowFilter ' + filterOption.currentWorkflowFilter);
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

      if(!$scope.isWeixinWebview){
        $timeout(function () {
          workFLowListService.getTodoListQuery($scope, pageNum, cashList, false, dataFilterUtil());
          dataFilterUtil().query();
        }, 300);
      } else {
        //WeiXin. add by luyufei
        var argsWx = {};
        var queryWx = location.search.substring(1);//获取查询串
        var pairsWx = queryWx.split("&");//在逗号处断开
        for (var i = 0; i < pairsWx.length; i++) {
          var pos = pairsWx[i].indexOf('=');//查找name=value
          if (pos == -1) {
            continue;
          }    //如果没有找到就跳过
          var argName = pairsWx[i].substring(0, pos);//提取name
          argsWx[argName] = pairsWx[i].substring(pos + 1);//存为属性
        }

        var codeWx = argsWx.code;
        var stateWx = argsWx.state;
        window.localStorage.token = '';

        if(codeWx){
          workFLowListService.wxLogin(codeWx, dataFilterUtil, workFLowListService.getTodoListQuery, $scope, pageNum, cashList);
        } else {
          hmsPopup.showShortCenterToast('微信授权失败,请联系管理员!');
        }
      }

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
