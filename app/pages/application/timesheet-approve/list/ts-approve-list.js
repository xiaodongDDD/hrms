/**
 * Created by wolf on 2016/5/19.
 * @author: wen.dai@hand-china.com
 *
 */
'use strict';
//应用-timeSheet审批模块-列表
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.tsApproveList', {
          url: 'application/tsApproveList',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/timesheet-approve/list/ts-approve-list.html',
              controller: 'tsApproveListCtrl'
            }
          }
        });
    }]);
angular.module('tsApproveModule')
  .controller('tsApproveListCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicModal',
    '$ionicScrollDelegate',
    '$ionicPopup',
    '$timeout',
    'TsApproveListService',
    'hmsPopup',
    'hmsHttp',
    'ApproveDetailService',
    '$ionicPopover',
    '$cordovaDatePicker',
    function ($scope,
              $state,
              baseConfig,
              $ionicModal,
              $ionicScrollDelegate,
              $ionicPopup,
              $timeout,
              TsApproveListService,
              hmsPopup,
              hmsHttp,
              ApproveDetailService,
              $ionicPopover,
              $cordovaDatePicker) {
      /**
       * initial var section
       */
      {
        if (ionic.Platform.isIOS()) {
          angular.element('.custom-head').css('paddingTop', '20px');
          angular.element('.ts-list-bg').css('paddingTop', '120px');
        }
        $scope.showProjectName = true; //默认显示项目名称
        $scope.showRocket = false; //默认不显示小火箭image
        $scope.showConnectBlock = false; //默认不显示连接块
        $scope.showDetailArrow = true; //默认显示向右的箭头--go list detail
        $scope.showLsLoading = true; //loading默认显示
        $scope.pullDownFlag = true; //下拉刷新显示标识
        var clickSelectAll = false; //默认没有点击全选
        $scope.endApproveDate = "";
        $scope.actionName = "操作";
        $scope.selectArray = [];
        $scope.isClickedProject = []; //控制点击选择筛选条目的样式(modal-filter)
        $scope.listInfoArray = {};
        $scope.personList = [];
        $scope.projectList = [];
        $scope.endDateList = [{//记录常用的三个截止日期
          dateValue: getMonthDay(getLastMonthDate(new Date())).replace(/\b(0+)/, ""),
          dateCode: getLastMonthDate(new Date())
        }, {
          dateValue: getMonthDay(getCurrentDate(new Date())).replace(/\b(0+)/, ""),
          dateCode: getCurrentDate(new Date())
        }, {
          dateValue: getMonthDay(getCurrentMonthLastDate(new Date())).replace(/\b(0+)/, ""),
          dateCode: getCurrentMonthLastDate(new Date())
        }];
        var position = ""; //记录滚动条的位置
        var selectItem = []; //初始化点击全部条目为false
        var tsLsUrl = baseConfig.businessPath + "/api_timesheet/get_timesheet_list";
        var tsProjectPersonListUrl = baseConfig.businessPath + "/api_timesheet/get_project_person_list";
        var tsActionUrl = baseConfig.businessPath + "/api_timesheet/timesheet_approve";
        var tsListParams = { //获取列表的参数
          "params": {
            "p_employee_number": window.localStorage.empno, //参考angularjs的localStorange--
            "p_start_date": "",
            "p_end_date": "",
            "p_project_name": "",
            "p_project_id": "",
            "p_project_person_number": "",
            "p_page": 1,
            "p_page_size": 6
          }
        };
        var tsActionParams = { //审批拒绝/通过的参数
          "params": {
            "p_approve_flag": "AGREE",
            "p_employee_number": window.localStorage.empno,
            "p_param_json": ''
          }
        };
        var approveList = { //审批拒绝/通过的子对象
          "approve_list": []
        };
        var currentDay = new Date().getDate();
        if (currentDay <= 10) {
          tsListParams.params.p_end_date = getLastMonthDate(new Date());
          $scope.endApproveDate = getMonthDay(getLastMonthDate(new Date())).replace(/\b(0+)/, '');
          $scope.selectEndItem = [true, false, false]; //控制点击选择截止日期条目的样式(modal-date)
        } else if (currentDay > 10 && currentDay <= 20) {
          tsListParams.params.p_end_date = getCurrentDate(new Date());
          $scope.endApproveDate = getMonthDay(getCurrentDate(new Date())).replace(/\b(0+)/, '');
          $scope.selectEndItem = [false, true, false];
        } else if (currentDay > 20) {
          tsListParams.params.p_end_date = getCurrentMonthLastDate(new Date());
          $scope.endApproveDate = getMonthDay(getCurrentMonthLastDate(new Date())).replace(/\b(0+)/, '');
          $scope.selectEndItem = [false, false, true];
        }
      }

      /**
       * 立即执行 拉取数据的代码
       */
      function initData() {
        $scope.showLsLoading = true;
        hmsHttp.post(tsProjectPersonListUrl, tsListParams).success(function (response) {
          if (hmsHttp.isSuccessfull(response.status)) {
            $scope.personList = unique_better(response.project_person_list, 'employee_number');
            $scope.projectList = unique_better(response.project_list, 'project_id');
          }
        }).error(function (e) {
        });
        $scope.listInfoArray = new TsApproveListService($scope, tsLsUrl, tsListParams, $scope.showLsLoading);
      };
      initData();

      $scope.$on('$ionicView.beforeEnter', function (e) {
        if (ApproveDetailService.getRefreshFlag() === 'refresh-approve-list') {
          $scope.tsListRefresh();
        }
      });

      $scope.$on('$destroy', function (e) {
        log('tsApproveListCtrl.$destroy');
      });

      function __initSelectArray(selectParam) { //初始化选择按钮
        //先初始化数据操作--
        $scope.selectArray = [];
        selectItem = [];
        angular.forEach($scope.listInfoArray.listArray, function (data, index) {
          if ('undoSelectAll' == selectParam) {
            $scope.selectArray.push(false);
            selectItem.push(false);
          } else if ('selectedAll' == selectParam) {
            $scope.selectArray.push(true);
            selectItem.push(true);
          }
        });
      };
      __initSelectArray('undoSelectAll');

      $scope.doSelectAction = function () { //header 右上角显示操作按钮
        if ($scope.actionName == "操作") {
          $scope.actionName = "取消";
          $scope.showDetailArrow = false;
          $scope.pullDownFlag = false;
          $scope.listInfoArray.busy = false;
          angular.element('.ts-approve-list-item').css("paddingLeft", "10%");
        } else if ($scope.actionName == "取消") {
          $scope.actionName = "操作";
          $scope.showDetailArrow = true;
          $scope.pullDownFlag = true;
          $scope.listInfoArray.busy = true;
          angular.element('.ts-approve-list-item').css("paddingLeft", "10px");
          tsActionParams = { //审批拒绝/通过的参数
            "params": {
              "p_approve_flag": "AGREE",
              "p_employee_number": window.localStorage.empno,
              "p_param_json": ''
            }
          };
          approveList = {
            "approve_list": []
          };
          __initSelectArray('undoSelectAll');
        }
      };

      $scope.openCalender = function () { //跳到原生日历界面--获取截止日期
        var success = function (response) {
          try{
            var result = response;
            var startDate = result[0].splice(/-/, '');
            var endDate = result[result.length - 1].splice(/-/, '');
            tsListParams.params.p_page = 1;
            tsListParams.params.p_start_date = startDate;
            tsListParams.params.p_end_date = endDate;
            $scope.showLsLoading = true;
            $scope.listInfoArray = new TsApproveListService($scope, tsLsUrl, tsListParams, $scope.showLsLoading);
          } catch(e) {
            hmsPopup.showShortCenterToast('取值失败'+ response);
          }
        };
        var error = function (response) {
        };

        if(ionic.Platform.isIOS()) {
          HmsCalendar.openCalendar(success,error,'1');
        }
      };

      $ionicModal.fromTemplateUrl('build/pages/application/timesheet-approve/modal/ts-date-modal.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.dateModal = modal;
      });

      $ionicPopover.fromTemplateUrl("endDate.html", {
        scope: $scope
      }).then(function (popover) {
        $scope.endDatePopover = popover;
      });

      $scope.selectEndDate = function ($event) { //显示截止日期列表界面
        //tsListParams.params.p_end_date = $scope.endApproveDate;
        if (ionic.Platform.isIOS()) {
          $scope.endDatePopover.show($event);
          angular.element('#popover-date2').css('borderBottom', '0px');
        } else {
          $scope.dateModal.show();
        }
      };

      $scope.selectEndDateItem = function (newEndDateCode, newEndDateValue, newIndex) { //选择不同的截止日期
        $scope.selectEndItem = [];
        $scope.selectEndItem[newIndex] = true;
        $scope.endApproveDate = newEndDateValue;
        tsListParams.params.p_page = 1;
        tsListParams.params.p_end_date = newEndDateCode;
        $scope.listInfoArray = new TsApproveListService($scope, tsLsUrl, tsListParams, $scope.showLsLoading);
        if (ionic.Platform.isIOS()) {
          $scope.endDatePopover.hide();
        } else {
          $scope.dateModal.hide();
        }
      };

      $scope.cancelDateModal = function () { //取消date modal
        //tsListParams.params.p_end_date = $scope.endApproveDate;//这个地方有小bug
        $scope.dateModal.hide()
      };

      $scope.onDrag = function () { //拖拽
        $scope.showConnectBlock = false;
      };

      $scope.onDragUp = function () { //向上拖拽
        $scope.showConnectBlock = false; //显示连接块
      };

      $scope.watchScroll = function () { //滚动内容时执行的method
        position = $ionicScrollDelegate.getScrollPosition().top;
        $scope.$apply(function () {
          if (position < 0) {
            $scope.showConnectBlock = false;
          } else if (position >= 0 && position < 350) { //在顶部时显示连接块
            $scope.showRocket = false;
            $scope.showConnectBlock = true;
          } else if (position >= 350) {
            $scope.showConnectBlock = true;
            $scope.showRocket = true;
          } else {
          }
        });
      };

      $scope.tsListRefresh = function (pullFlag) { //下拉刷新
        if ($scope.actionName === '取消') {
          $scope.goTsLsTop();
          return;
        }
        tsListParams.params.p_page = 1;
        if (pullFlag === 'pull_down') {
          $scope.showLsLoading = false;
        } else {
          $scope.showLsLoading = true;
        }
        $scope.listInfoArray = new TsApproveListService($scope, tsLsUrl, tsListParams, $scope.showLsLoading);
      };

      $scope.getAttentionInfo = function (e, newWarnList) {
        if (!$scope.showDetailArrow) {
          return;
        }
        var warnInfo = ""; // 存储提示信息
        if (newWarnList.length === 1) {
          warnInfo = newWarnList[0].description;
        } else {
          angular.forEach(newWarnList, function (data, index) {
            warnInfo += newWarnList[index].description + '<br>';
          });
        }
        e.stopPropagation(); //阻止事件冒泡
        hmsPopup.showShortCenterToast(warnInfo);
      };

      $scope.goTsLsTop = function () { //返回列表顶部
        angular.element('#rocket').addClass('ng-hide');
        //$ionicScrollDelegate.scrollTop(true);
        $ionicScrollDelegate.$getByHandle('approveListHandle').scrollTop(true);
      };

      $ionicModal.fromTemplateUrl('build/pages/application/timesheet-approve/modal/ts-filter-modal.html', { //筛选modal
        scope: $scope
      }).then(function (modal) {
        $scope.tsFilterModal = modal;
      });

      $scope.filterTsInfo = function () { //响应筛选按钮的方法
        tsListParams.params.p_project_id = "";
        tsListParams.params.p_project_person_number = "";
        $scope.tsFilterModal.show();
      };

      $scope.goApproveDetail = function (index, newEmployeeNumber, newProjectId, newStartDate, newEndDate) {
        if ($scope.showDetailArrow) {
          $state.go('tab.tsApproveDetail', {
              'employeeNumber': newEmployeeNumber,
              'projectId': newProjectId,
              'startDate': newStartDate,
              'endDate': newEndDate
            }
          );
        } else {
          selectItem[index] = !selectItem[index];
          var approve = {
            "p_project_id": "",
            "p_project_person_number": "",
            "p_start_date": "",
            "p_end_date": "",
            "p_record_id": ""
          };
          if (selectItem[index]) {
            $scope.selectArray[index] = true;
            approve.p_project_id = newProjectId;
            approve.p_project_person_number = newEmployeeNumber;
            approve.p_start_date = newStartDate;
            approve.p_end_date = newEndDate;
            approveList.approve_list[index] = approve;
          } else {
            approveList.approve_list.splice(index, 1, 'delete');
            $scope.selectArray[index] = false;
          }
        }
      };

      $scope.selectAllList = function () { //全选
        clickSelectAll = !clickSelectAll;
        if (clickSelectAll) {
          for (var i = 0; i < $scope.listInfoArray.listArray.length; i++) {
            var approve = {
              "p_project_id": "",
              "p_project_person_number": "",
              "p_start_date": "",
              "p_end_date": "",
              "p_record_id": ""
            };
            approve.p_project_id = $scope.listInfoArray.listArray[i].project_id;
            approve.p_project_person_number = $scope.listInfoArray.listArray[i].employee_number;
            approve.p_start_date = $scope.listInfoArray.listArray[i].start_date;
            approve.p_end_date = $scope.listInfoArray.listArray[i].end_date;
            approveList.approve_list.push(approve);
          }
          __initSelectArray('selectedAll');
        } else {
          approveList.approve_list = [];
          __initSelectArray('undoSelectAll');
        }
      };

      function deleteSuperfluous() {
        for (var i = 0; i < approveList.approve_list.length; i++) {
          if (approveList.approve_list[i] === 'delete') {
            approveList.approve_list.splice(i, 1);
            i--;
          } else if (!approveList.approve_list[i] || approveList.approve_list[i] == "" || typeof(approveList.approve_list[i]) == "undefined") {
            approveList.approve_list.splice(i, 1);
            i--;
          }
        }
      };
      $scope.passThroughListItem = function () { //通过
        if (approveList.approve_list.length === 0) {
          hmsPopup.showShortCenterToast('请先选择操作项！');
          return;
        }
        deleteSuperfluous();
        tsActionParams.params.p_approve_flag = "AGREE";
        tsActionParams.params.p_param_json = JSON.stringify(approveList);
        hmsPopup.showLoading("审批中...");
        hmsHttp.post(tsActionUrl, tsActionParams).success(function (response) {
          hmsPopup.hideLoading();
          if (hmsHttp.isSuccessfull(response.status)) {
            hmsPopup.showShortCenterToast('审批成功！');
          } else {
            hmsPopup.showShortCenterToast('审批失败！');
          }
          $scope.doSelectAction();
          $timeout(function () {
            $scope.tsListRefresh();
          }, 1000);
        }).error(function (e) {
          hmsPopup.hideLoading();
          $scope.doSelectAction();
          $timeout(function () {
            $scope.tsListRefresh();
          }, 1000);
        });
      };

      $scope.refuseListItem = function () { //拒绝
        if (approveList.approve_list.length === 0) {
          hmsPopup.showShortCenterToast('请先选择操作项！');
          return;
        }
        deleteSuperfluous();
        tsActionParams.params.p_approve_flag = "REFUSE";
        tsActionParams.params.p_param_json = JSON.stringify(approveList);
        hmsPopup.showLoading("审批中...");
        hmsHttp.post(tsActionUrl, tsActionParams).success(function (response) {
          hmsPopup.hideLoading();
          if (hmsHttp.isSuccessfull(response.status)) {
            hmsPopup.showShortCenterToast('拒绝成功！');
          } else {
            hmsPopup.showShortCenterToast('拒绝失败！');
          }
          $scope.doSelectAction();
          $timeout(function () {
            $scope.tsListRefresh();
          }, 1000);
        }).error(function (e) {
          hmsPopup.hideLoading();
          $scope.doSelectAction();
          $timeout(function () {
            $scope.tsListRefresh();
          }, 1000);
        });
      };

      /**
       *  筛选modal方法区--
       */
      $scope.selectScreening = function (selectParam) {
        if (selectParam == 'projectName') {
          $scope.showProjectName = true;
          angular.element('#project-name').css({'backgroundColor': 'white', 'color': '#4A4A4A'});
          angular.element('#person-select').css({'backgroundColor': '#fafafa', 'color': '#9b9b9b'});
        } else if (selectParam == 'personSelect') {
          $scope.showProjectName = false;
          angular.element('#person-select').css({'backgroundColor': 'white', 'color': '#4A4A4A'});
          angular.element('#project-name').css({'backgroundColor': '#fafafa', 'color': '#9b9b9b'});
        }
      };

      $scope.selectFilterItem = function (newName, index, newId) { //点击modal单个条目时的响应方法
        if (newName === 'projectName') {
          $scope.isClickedProject = [];
          $scope.isClickedProject[index] = true;
          tsListParams.params.p_project_id = newId;
        } else if (newName === 'personSelect') {
          $scope.isClickedPerson = [];
          $scope.isClickedPerson[index] = true;
          tsListParams.params.p_project_person_number = newId;
        }
      };

      function __initModal() { //初始化modal的样式
        $scope.tsFilterModal.hide();
        $scope.showProjectName = true;
        $scope.isClickedProject = [];
        $scope.isClickedPerson = [];
        angular.element('#project-name').css({'backgroundColor': 'white', 'color': '#4A4A4A'});
        angular.element('#person-select').css({'backgroundColor': '#fafafa', 'color': '#9b9b9b'});
      };

      $scope.cancelFilter = function () { //取消按钮
        tsListParams.params.p_project_id = "";
        tsListParams.params.p_project_person_number = "";
        __initModal();
      };

      $scope.confirmFilter = function () { //确定按钮
        __initModal();
        tsListParams.params.p_page = 1;
        $scope.showLsLoading = true;
        $scope.listInfoArray = new TsApproveListService($scope, tsLsUrl, tsListParams, $scope.showLsLoading);
      };

      $scope.clearFilterParams = function () { //响应清空筛选的点击
        $scope.isClickedProject = [];
        $scope.isClickedPerson = [];
        tsListParams.params.p_project_id = "";
        tsListParams.params.p_project_person_number = "";
      };
    }])
/**
 * @params:
 *  1:scope  //controller的作用域
 *  2:url //请求地址
 *  3:params //请求的参数
 *  4: refurbishParam //控制操作按钮的参数
 *  5:busy //用于控制下拉刷新的flag
 *  6:totalNumber //获取的数据总数
 *  7:listArray //数据列表
 *  8:loading //数据加载标记
 *  9:actionFlag //控制--响应操作按钮的flag
 */
  .service('TsApproveListService', ['hmsHttp', 'baseConfig', 'hmsPopup', '$ionicScrollDelegate',
    function (hmsHttp, baseConfig, hmsPopup, $ionicScrollDelegate) {
      var TsApproveListService = function (scope, requestUrl, requestSearchParams, loadingFlag, actionFlag, refurbishParam) {
        var _self = this;
        _self.scope = scope;
        _self.url = requestUrl;
        _self.params = {};
        _self.params = requestSearchParams;
        _self.refurbishParam = refurbishParam;
        _self.busy = false;
        _self.totalNumber = 0;
        _self.listArray = [];
        _self.loading = loadingFlag;
        _self.actionFlag = actionFlag;
        if (_self.actionFlag === 'action') { //响应action按钮的操作

        }
        if (_self.refurbishParam === 'clickRefreshEvent') {
          _self.scope.$broadcast('scroll.infiniteScrollComplete');
        }

        hmsHttp.post(_self.url, _self.params).success(function (response) {
          _self.loading = false;
          try {
            if (hmsHttp.isSuccessfull(response.status)) {
              var tsResult = response.timesheet_approve_response;
              if (baseConfig.debug) {
                warn('hi,create a new factory!!' + '\n' + jsonFormat());
              }
              _self.totalNumber = response.count;
              try {
                _self.listArray = _self.listArray.concat(tsResult.result_list);
              } catch (e) {
                _self.listArray = [];
              }
              if (response.count == 0) {
                _self.busy = false;
                _self.listArray = [];
                _self.scope.$broadcast('scroll.refreshComplete');
                //hmsPopup.showShortCenterToast("没有相关数据!");
              } else if (response.count <= 6) {
                _self.busy = false;
              } else {
                _self.busy = true;
              }
              _self.scope.$broadcast('scroll.refreshComplete');
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              _self.busy = false;
              _self.scope.$broadcast('scroll.refreshComplete');
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
            }
          } catch (e) {
          }

        }.bind(_self)).error(function (error) {
          _self.loading = false;
          _self.params.params.p_page = 1;
          _self.busy = false;
          _self.scope.$broadcast('scroll.refreshComplete');
          _self.scope.$broadcast('scroll.infiniteScrollComplete');
          hmsPopup.showShortCenterToast("服务请求异常,请检查网络连接和输入参数后重新操作!");
        }.bind(_self));
      };
      TsApproveListService.prototype.nextPage = function () {
        var _self = this;
        if (baseConfig.debug) {
          warn('enter next page!');
        }
        if (!_self.busy) {
          return;
        }
        if (_self.busy) {
          if (_self.refurbishParam === 'action') {
            _self.refurbishParam = '';
            _self.scope.$broadcast('scroll.infiniteScrollComplete');
            return;
          }
        }
        _self.busy = true;
        _self.params.params.p_page++;
        hmsHttp.post(_self.url, _self.params).success(function (response) {
          try {
            if (hmsHttp.isSuccessfull(response.status)) {
              if (angular.isUndefined(response.timesheet_approve_response.result_list)) {
                _self.busy = false;
                $ionicScrollDelegate.$getByHandle('approveListHandle').scrollBy(300);
              } else {
                var tsResult = response.timesheet_approve_response;
                _self.listArray = _self.listArray.concat(tsResult.result_list);
              }
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              if (response.status === 'E') {
                _self.params.params.p_page--;
              }
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
            }
          } catch (e) {
            _self.params.params.p_page--;
            _self.scope.$broadcast('scroll.infiniteScrollComplete');
          }
        }.bind(_self)).error(function (error) {
          _self.params.params.p_page--;
          _self.scope.$broadcast('scroll.infiniteScrollComplete');
        }.bind(_self));
      };
      return TsApproveListService;
    }]);
