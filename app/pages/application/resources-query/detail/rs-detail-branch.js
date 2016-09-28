/**
 * Created by Empire on 2016/8/30.(Sun Bohao)
 */
'use strict';
//--资源查询结果 部门模块路由-
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.rsDetailBranch', {
          url: 'application/resources/detail/branch',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/resources-query/detail/rs-detail-branch.html',
              controller: 'rsDetailBranchCtl'
            }
          },
          params: {
            dateFrom:"",
            dateTo: "",
            employeeName: "",
            employeeCode: "",
            branchName: "",
            branchId: "",
            unitId: "",
            subjectName: "",
            subjectId: "",
            dimission: false
          }
        });
    }]);

angular.module('applicationModule')
  .controller('rsDetailBranchCtl', [

    '$scope',
    '$state',
    '$ionicHistory',
    '$ionicModal',
    '$timeout',
    'hmsPopup',
    'hmsHttp',
    'baseConfig',
    'workFLowListService',
    '$stateParams',
    '$ionicScrollDelegate',
    '$ionicSlideBoxDelegate',




    function ($scope,
              $state,
              $ionicHistory,
              $ionicModal,
              $timeout,
              hmsPopup,
              hmsHttp,
              baseConfig,
              workFLowListService,
              $stateParams,
              $ionicScrollDelegate,
              $ionicSlideBoxDelegate
    ) {

      $scope.goBack = function () {
        $ionicHistory.goBack();
      };

      var dateFrom = $stateParams.dateFrom;
      var dateTo = $stateParams.dateTo;
      var employeeName = $stateParams.employeeName;
      var employeeCode = $stateParams.employeeCode;
      var branchName = $stateParams.branchName;
      var branchId = $stateParams.branchId;
      var unitId = $stateParams.unitId;
      var subjectName = $stateParams.subjectName;
      var subjectId = $stateParams.subjectId;
      var dimission = $stateParams.dimission;
      var pageNumber = 1;

      $scope.branchName = branchName;


      $scope.showInfinite = false; //默认隐藏无限滚动的标签
      $scope.contactLoading = false; //默认不显示loading加载






      var postUrl = baseConfig.businessPath + "/api_resources_query/get_personal_resource"; //个人查询结果接口地址
      var postData = '{"params":{"p_employee_number":"' + employeeCode + '","p_date_from":"' + dateFrom + '","p_date_to":"' + dateTo + '","p_branch_id":"' + unitId + '","p_project_id":"' + subjectId +  '","p_page_number":"' + pageNumber + '","p_dismission":"' + dimission +  '"}}';


      var getBranchData = function () {
        $scope.contactLoading = true;
        hmsHttp.post(postUrl, postData).success(function (result) {
          $scope.contactLoading = false;
          console.log(dateFrom);
          console.log(dateTo);
          console.log(employeeName);
          console.log(branchName);
          console.log(subjectName);
          console.log(dimission);

          console.log(result.returnMsg);
          console.log(postData);
          console.log(result);

          $scope.branchResourceList = result.branch_resource_list.sort(function (a, b) {
            return (a.record_date.substring(0,4)+a.record_date.substring(5,7)) - (b.record_date.substring(0,4)+b.record_date.substring(5,7));
          });
          $ionicSlideBoxDelegate.$getByHandle('branch-handle').update();

        }).error(function () {
          console.log('个人查询结果异常');
        })
      };
      getBranchData();


      // $scope.loadMore = function () { //加载下一页
      //   $scope.newPage += 1;
      //   employeeParams.key = $scope.contactKey.getValue;
      //   employeeParams.page = $scope.newPage;
      //   $scope.getEmployeeData('loadMore');
      // };


      //月份英文简写
      var EnglishMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      var date = new Date();

      var year = date.getFullYear();
      var month = date.getMonth();
      $scope.currentYear = year;
      $scope.currentMonth = month + 1;
      $scope.currentEnglishMonth = EnglishMonth[$scope.currentMonth - 1];


      $scope.lastMonth = function () {
        $scope.currentMonth--;
        if ($scope.currentMonth == 0) {
          $scope.currentMonth = 12;
          $scope.currentYear--;
        }
        $scope.currentEnglishMonth = EnglishMonth[$scope.currentMonth - 1];
        initCalendar($scope.currentYear, $scope.currentMonth);
      };
      $scope.nextMonth = function () {
        $scope.currentMonth++;
        if ($scope.currentMonth == 13) {
          $scope.currentMonth = 1;
          $scope.currentYear++;
        }
        $scope.currentEnglishMonth = EnglishMonth[$scope.currentMonth - 1];
        initCalendar($scope.currentYear, $scope.currentMonth);
      };

      //周列表
      $scope.weekTitleList = [
        '日', '一', '二', '三', '四', '五', '六'
      ];

      var initCalendarArray = [];

      //初始化日历数组
      var initCalendar = function (year, month) {
        var date = new Date();
        try {
          if (year && month) {
            date = new Date(year, parseInt(month) - 1, 1);
          }
          else {
            date = new Date();
          }
        } catch (e) {
          date = new Date();
        }
        date.setDate(1);

        var firstDay = date.getDay();

        date.setMonth(date.getMonth() + 1);
        var lastDate = new Date(date - 3600000 * 24);

        var monthTotalDay = lastDate.getDate();

        initCalendarArray = [];

        var calendarLine = Math.ceil((firstDay + monthTotalDay) / 7);

        for (var i = 0; i < (firstDay + monthTotalDay); i++) {
          if (i < firstDay) {
            initCalendarArray.push('');
          } else {
            initCalendarArray.push(i - firstDay + 1);
          }
        }

        $scope.calendar = [];
        var seq = 0;
        for (i = 0; i < calendarLine; i++) {
          var style_outline = 'each-day';
          var style_color = 'day-item';
          var money = '';
          var project = '';
          var week = {
            week: i,
            list: []
          };
          for (var j = 0; j < 7; j++) {

            var item;

            if (initCalendarArray[seq]) {

              item = {
                day: initCalendarArray[seq],
                style_outline: style_outline,
                style_color: style_color,
                money: money,
                project: project
              };
            }
            else {
              item = {
                day: '',
                style_outline: style_outline,
                style_color: style_color,
                money: money,
                project: project
              };
            }

            week.list.push(item);

            seq = seq + 1;
          }
          $scope.calendar.push(week);
        }
      };

      initCalendar($scope.currentYear, $scope.currentMonth);












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
        if (result.status == 'S') {
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
        }
        else {
          hmsPopup.showShortCenterToast('获取审批列表失败,请退出页面重试获取或联系管理员!');
        }
      };

      var processDoneList = function (result) {
        if (result.status == 'S') {
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
        } else {
          hmsPopup.showShortCenterToast('获取审批列表失败,请退出页面重试获取或联系管理员!');
        }
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
          if (!result.unprocessedWorkflowList || result.unprocessedWorkflowList.length == pageNumLimit) {
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
          if (!result.processedWorkflowList || result.processedWorkflowList.length == pageNumLimit) {
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
              getTodoList(false);
              if (!refreshFlag) {
                dataFilterUtil().query();
              }
            }
          }
        }, 100);
      };

      $scope.fetchDoneList = function (refreshFlag) {
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
              getDoneList(false);
              if (!refreshFlag) {
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
      };

      $scope.enterWorkflowDetail = function (detail) {
        var processedFlag = {value: false};
        if ($scope.listStatus.done.selected) {
          processedFlag.value = true;
        }
        $state.go('tab.workflow-detail', {
          "detail": detail,
          "processedFlag": processedFlag,
          "type": "WORKFLOWDETAIL"
        })
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
                  "name": "部门成员",
                  "selected": true
                },
                {
                  "code": "PERSON",
                  "name": "部门名称",
                  "selected": false
                },
                {
                  "code": "WORKFLOWNODE",
                  "name": "项目名称",
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

      $timeout(function () {
        getTodoList(false);
        dataFilterUtil().query();
      }, 400);

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
