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
        })
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
    function ($scope,
              $state,
              baseConfig,
              $ionicModal,
              $ionicScrollDelegate,
              $ionicPopup,
              $timeout,
              TsApproveListService,
              hmsPopup) {
      /**
       * initial var section
       */
      {
        $scope.showProjectName = true; //默认显示项目名称
        $scope.showRocket = false; //默认不显示小火箭image
        $scope.showConnectBlock = false; //默认不显示连接块
        $scope.showDetailArrow = true; //默认显示向右的箭头--go list detail
        var clickSelectAll = false; //默认没有点击全选
        $scope.actionName = "操作";
        $scope.selectArray = [];
        $scope.isClickedProject = []; //控制电机选择条目的样式(modal-filter)
        $scope.listInfoArray = {};
        var position = ""; //记录滚动条的位置
        var selectItem = []; //初始化点击全部条目为false
        var tsLsUrl = baseConfig.businessPath + "/wfl_timesheet_view/get_timesheet_list";
        var tsListParams = {
          "params": {
            "p_employee_number": window.localStorage.empno, //参考angularjs的localStorange--
            "p_start_date": "20160406",
            "p_end_date": "",
            "p_project_name": "",
            "p_project_id": "",
            "p_project_person_number": "",
            "p_page": "1",
            "p_line_number": "7"
          }
        };
        var currentDay = new Date().getDate();
        if (currentDay < 10) {
          tsListParams.params.p_end_date = getLastMonthDate(new Date());
        } else if (currentDay > 10 && currentDay < 20) {
          tsListParams.params.p_end_date = getCurrentDate(new Date());
        } else if (currentDay > 20) {
          tsListParams.params.p_end_date = getCurrentMonthLastDate(new Date());
        }
      }

      /**
       * 立即执行 拉取数据的代码
       */
      (function () {
        hmsPopup.showLoading('加载中...');
        $scope.listInfoArray = new TsApproveListService($scope, tsLsUrl, tsListParams);
      })();

      $scope.$on('$ionicView.enter', function (e) {
      });

      $scope.$on('$destroy', function (e) {
        log('tsApproveListCtrl.$destroy');
      });

      function __initSelectArray(selectParam) { //初始化选择按钮
        //先初始化数据操作--
        $scope.selectArray = [];
        selectItem = [];
        angular.forEach($scope.listInfoArray, function (data, index) {
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
          angular.element('.ts-approve-list-item').css("paddingLeft", "10%");
        } else if ($scope.actionName == "取消") {
          $scope.actionName = "操作";
          $scope.showDetailArrow = true;
          angular.element('.ts-approve-list-item').css("paddingLeft", "10px");
          __initSelectArray('undoSelectAll');
        }
      };

      $scope.onDrag = function () { //拖拽
        $scope.showConnectBlock = false;
      };

      $scope.onDragUp = function () { //向上拖拽
        $scope.showConnectBlock = true; //显示连接块
      };

      $scope.watchScroll = function () { //滚动内容时执行的method
        position = $ionicScrollDelegate.getScrollPosition().top;
        $scope.$apply(function () {
          if (position < 0) {
            $scope.showConnectBlock = false;
          } else if (position >= 0 && position < 400) { //在顶部时显示连接块
            $scope.showRocket = false;
            $scope.showConnectBlock = true;
          } else if (position >= 400) {
            $scope.showRocket = true;
          } else {
          }
        });
      };

      $scope.tsListRefresh = function () { //下拉刷新
        $timeout(function () {
          $scope.$broadcast("scroll.refreshComplete");
        }, 1000);
      };

      $scope.getAttentionInfo = function (e, newWarnList) {
        e.stopPropagation(); //阻止事件冒泡
        warn(newWarnList);
        $ionicPopup.show({
          template: '<div class="warn-attention-icon">' + newWarnList[0].description + '</div>',
          scope: $scope,
          buttons: [
            {
              text: '<div class="warn-cancel-icon"></div>',
              type: 'button-clear',
              onTap: function (e) {
              }
            }
          ]
        });
      };

      $scope.goTsLsTop = function () { //返回列表顶部
        angular.element('#rocket').addClass('ng-hide');
        $ionicScrollDelegate.scrollTop(true);
      };

      $ionicModal.fromTemplateUrl('build/pages/application/timesheet-approve/modal/ts-filter-modal.html', { //筛选modal
        scope: $scope
      }).then(function (modal) {
        $scope.tsFilterModal = modal;
      });

      $scope.filterTsInfo = function () { //响应筛选按钮的方法
        $scope.tsFilterModal.show();
      };

      $scope.goApproveDetail = function (index, newEmployeeNumber, newProjectId, newStartDate, newEndDate) {
        if ($scope.showDetailArrow) {
          warn(newStartDate, newEndDate);
          $state.go('tab.tsApproveDetail', {
              'employeeNumber': newEmployeeNumber,
              'projectId': newProjectId,
              'startDate': newStartDate,
              'endDate': newEndDate
            }
          );
        } else {
          selectItem[index] = !selectItem[index];
          if (selectItem[index]) {
            $scope.selectArray[index] = true;
          } else {
            $scope.selectArray[index] = false;
          }
        }
      };

      $scope.selectAllList = function () { //全选
        clickSelectAll = !clickSelectAll;
        if (clickSelectAll) {
          __initSelectArray('selectedAll');
        } else {
          __initSelectArray('undoSelectAll');
        }
      };

      $scope.passThroughListItem = function () { //通过
        warn("passThroughDetailItem");
      };

      $scope.refuseListItem = function () { //拒绝
        warn("refuseDetailItem");
      };

      /**
       *  筛选modal方法区--
       */
      $scope.selectScreening = function (selectParam) {
        if (selectParam == 'projectName') {
          $scope.showProjectName = true;
          angular.element('#project-name').addClass('active-select');
          angular.element('#project-name').removeClass('active-off');
          angular.element('#person-select').removeClass('active-select');
        } else if (selectParam == 'personSelect') {
          $scope.showProjectName = false;
          angular.element('#person-select').addClass('active-select');
          angular.element('#project-name').addClass('active-off');
        }
      };

      $scope.selectFilterItem = function (newName, index) { //点击modal单个条目时的响应方法
        if (newName === 'projectName') {
          $scope.isClickedProject = [];
          $scope.isClickedProject[index] = true;
        } else if (newName === 'personSelect') {
          $scope.isClickedPerson = [];
          $scope.isClickedPerson[index] = true;
        }
      };

      function __initModal() { //初始化modal的样式
        $scope.tsFilterModal.hide();
        $scope.showProjectName = true;
        $scope.isClickedProject = [];
        $scope.isClickedPerson = [];
        angular.element('#project-name').addClass('active-select');
        angular.element('#project-name').removeClass('active-off');
        angular.element('#person-select').removeClass('active-select');
      };

      $scope.cancelFilter = function () { //取消按钮
        __initModal();
      };

      $scope.confirmFilter = function () { //确定按钮
        __initModal();
      };

      $scope.clearFilterParams = function () { //响应清空筛选的点击
        $scope.isClickedProject = [];
        $scope.isClickedPerson = [];
      };
    }])
/**
 * @params:
 *  1:scope  //controller的作用域
 *  2:url //请求地址
 *  3:params //请求的参数
 *  4: refurbishParam //控制下拉刷线的参数
 *  5:busy //用于控制下拉刷新的flag
 *  6:totalNumber //获取的数据总数
 *  7:projectList //项目列表
 *  8:employeeList //人员列表
 *  9:listArray //数据列表
 */
  .service('TsApproveListService', ['hmsHttp', 'baseConfig', 'hmsPopup',
    function (hmsHttp, baseConfig, hmsPopup) {
      var TsApproveListService = function (scope, requestUrl, requestSearchParams, refurbishParam) {
        var _self = this;
        _self.scope = scope;
        _self.url = requestUrl;
        _self.params = {};
        _self.params = requestSearchParams;
        _self.refurbishParam = refurbishParam;
        _self.busy = false;
        _self.totalNumber = 0;
        _self.listArray = [];
        _self.projectList = [];
        _self.employeeList = [];
        if (_self.refurbishParam === 'clickRefreshEvent') {
          _self.scope.$broadcast('scroll.infiniteScrollComplete');
        }

        hmsHttp.post(_self.url, _self.params).success(function (response) {
          try {
            if (hmsHttp.isSuccessfull(response.status)) {
              var tsResult = response.timesheet_approve_response;
              if (baseConfig.debug) {
                warn('hi,create a new factory!!' + '\n' + jsonFormat());
              }
              _self.totalNumber = response.count;
              try {
                _self.listArray = _self.listArray.concat(tsResult.result_list);
                _self.projectList = _self.projectList.concat(tsResult.project_list);
                _self.employeeList = _self.employeeList.concat(tsResult.project_person_list);
              } catch (e) {
                _self.listArray = [];
                _self.projectList = [];
                _self.employeeList = [];
              }
              if (response.count == 0) {
                _self.busy = false;
                _self.listArray = [];
              } else if (response.count <= 5) {
                _self.busy = false;
              } else {
                _self.busy = true;
              }
              _self.scope.$broadcast('scroll.refreshComplete');
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              if (response.status === 'E' || response.status == 'e') {
                hmsPopup.showPopup("提示", "<div style='text-align: center'>没有相关数据!</div>");
              } else {
                hmsPopup.showPopup("提示", "<div style='text-align: center'>网络异常,请稍后重试!</div>");
              }
              _self.scope.$broadcast('scroll.refreshComplete');
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
            }
            hmsPopup.hideLoading();
          } catch (e) {
          }

        }.bind(_self)).error(function (error) {
          _self.params.p_line_number = 1;
          _self.busy = false;
          hmsPopup.hideLoading();
          _self.scope.$broadcast('scroll.refreshComplete');
          _self.scope.$broadcast('scroll.infiniteScrollComplete');
          hmsPopup.showPopup("提示", "<div style='text-align: center'>服务请求异常,请检查网络连接和输入参数后重新操作!</div>");
        }.bind(_self));
      };
      TsApproveListService.prototype.nextPage = function () {
        var _self = this;
        if (baseConfig.debug) {
          console.log('enter next page!');
        }
        if (!_self.busy) {
          return;
        }
        if (_self.busy) {
          if (_self.refurbishParam === 'clickRefreshEvent') {
            _self.refurbishParam = '';
            _self.scope.$broadcast('scroll.infiniteScrollComplete');
            return;
          }
        }
        _self.busy = true;
        _self.params.p_line_number++;
        hmsHttp.post(_self.url, _self.params).success(function (response) {
          try {
            if (hmsHttp.isSuccessfull(response.status)) {
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
            }
          } catch (e) {
          }

        }.bind(_self)).error(function (error) {
          _self.params.p_line_number = 1;
          _self.scope.$broadcast('scroll.infiniteScrollComplete');
          _self.busy = false;
          hmsPopup.hideLoading();
          hmsPopup.showPopup("提示", "<div style='text-align: center'>网络异常,请稍后重试!</div>");
        }.bind(_self));
      };
      return TsApproveListService;
    }]);
