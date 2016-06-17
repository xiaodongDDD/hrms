/**
 * Created by wolf on 2016/5/21. (_wen.dai_)
 */
'use strict';
//应用-timeSheet审批模块-详情
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.tsApproveDetail', {
          url: 'application/tsApproveDetail',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/timesheet-approve/detail/ts-approve-detail.html',
              controller: 'tsApproveDetailCtrl'
            }
          },
          params: {
            'employeeNumber': "",
            'projectId': "",
            'startDate': "",
            'endDate': ""
          }
        })
    }]);
tsApproveModule.controller('tsApproveDetailCtrl', [
  '$scope',
  '$state',
  'baseConfig',
  '$ionicHistory',
  '$stateParams',
  'hmsHttp',
  'hmsPopup',
  '$timeout',
  function ($scope,
            $state,
            baseConfig,
            $ionicHistory,
            $stateParams,
            hmsHttp,
            hmsPopup,
            $timeout) {

    /**
     * init var section
     */
    {
      var selectItem = []; //初始化点击全部条目为false
      var clickSelectAll = false; //默认没有点击全选
      $scope.detailActionName = "操作";
      $scope.showActionBar = false; //默认不显示勾选按钮和底部的bar
      $scope.detailInfoArray = {}; //用于接收列表对应数据object
      $scope.selectArray = [];
      var tsApproveDetailUrl = baseConfig.businessPath + "/wfl_timesheet_view/query_timesheet_approve_list";
      var tsApproveDetailParams = {
        "params": {
          "p_employee_number": $stateParams.employeeNumber,
          "p_start_date": $stateParams.startDate.toString(),
          "p_end_date": $stateParams.endDate.toString(),
          "p_project_id": $stateParams.projectId
        }
      };
      var tsActionUrl = baseConfig.businessPath + "/wfl_timesheet_view/timesheet_approve";
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
    }
    hmsPopup.showLoading('加载中...');
    function getData() {
      hmsHttp.post(tsApproveDetailUrl, tsApproveDetailParams).success(function (response) {
        hmsPopup.hideLoading();
        if (hmsHttp.isSuccessfull(response.status)) {
          $scope.detailInfoArray = response.timesheet_approve_detail_response;
        } else {
          if (response.status === 'E' || response.status == 'e') {
            hmsPopup.showShortCenterToast("没有相关数据!");
          } else {
            hmsPopup.showShortCenterToast("网络异常,请稍后重试!");
          }
        }
      }).error(function (response, status) {
        hmsPopup.hideLoading();
        hmsPopup.showShortCenterToast("服务请求异常,请检查网络连接和输入参数后重新操作!");
      });
    };
    getData();

    $scope.$on('$ionicView.enter', function (e) {
      warn('tsApproveListCtrl.$ionicView.enter');
    });

    $scope.$on('$destroy', function (e) {
      warn('tsApproveListCtrl.$destroy');
    });


    function __initSelectArray(selectParam) { //初始化选择按钮
      //先初始化数据操作--
      $scope.selectArray = [];
      selectItem = [];
      angular.forEach($scope.detailInfoArray, function (data, index) {
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

    $scope.dealDetailInfo = function () {
      if ($scope.detailActionName == "操作") {
        $scope.detailActionName = "取消";
        $scope.showActionBar = true;
        angular.element('#tsApproveItem').css('paddingLeft', '6%');
      } else if ($scope.detailActionName == "取消") {
        $scope.detailActionName = "操作";
        $scope.showActionBar = false;
        __initSelectArray('undoSelectAll');
        angular.element('#tsApproveItem').css('paddingLeft', '0');
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
      }
    };

    $scope.selectItem = function (index, newLineNumber) { //单击选中条目的响应method
      selectItem[index] = !selectItem[index];
      var approve = {
        "p_project_id": $scope.detailInfoArray.project_id,
        "p_project_person_number": $scope.detailInfoArray.employee_number,
        "p_start_date": "",
        "p_end_date": "",
        "p_record_id": ""
      };
      if (selectItem[index]) {
        $scope.selectArray[index] = true;
        approve.p_record_id = newLineNumber;
        approveList.approve_list[index] = approve;
      } else {
        $scope.selectArray[index] = false;
        approveList.approve_list.splice(index, 1, 'delete');
      }
    };

    $scope.selectAllDetail = function () { //全选
      clickSelectAll = !clickSelectAll;
      if (clickSelectAll) {
        __initSelectArray('selectedAll');
        for (var i = 0; i < $scope.detailInfoArray.subsidy_list.length; i++) {
          var approve = {
            "p_project_id": $scope.detailInfoArray.project_id,
            "p_project_person_number": $scope.detailInfoArray.employee_number,
            "p_start_date": "",
            "p_end_date": "",
            "p_record_id": ""
          };
          approve.p_record_id = $scope.listInfoArray.subsidy_list[i].line_number;
          approveList.approve_list.push(approve);
        }
      } else {
        __initSelectArray('undoSelectAll');
        approveList.approve_list = [];
      }
    };

    function deleteSuperfluous() {
      for (var i = 0; i < approveList.approve_list.length; i++) {
        if (approveList.approve_list[i] === 'delete') {
          approveList.approve_list.splice(i, 1);
          i--;
        }
      }
    };

    $scope.passThroughDetailItem = function () { //通过
      if(approveList.approve_list.length === 0) {
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
        $scope.dealDetailInfo();
        $timeout(function () {
          hmsPopup.showLoading('加载中...');
          getData();
        },1500);
      }).error(function (e) {
        hmsPopup.hideLoading();
        hmsPopup.showShortCenterToast('审批失败！请检查网络稍后重试');
        $scope.dealDetailInfo();
        $timeout(function () {
          hmsPopup.showLoading('加载中...');
          getData();
        },1500);
      });
    };

    $scope.refuseDetailItem = function () { //拒绝
      if(approveList.approve_list.length === 0) {
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
          hmsPopup.showShortCenterToast('操作成功！');
        } else {
          hmsPopup.showShortCenterToast('拒绝失败！');
        }
        $scope.dealDetailInfo();
        $timeout(function () {
          hmsPopup.showLoading('加载中...');
          getData();
        },1500);
      }).error(function (e) {
        hmsPopup.hideLoading();
        hmsPopup.showShortCenterToast('拒绝失败！请检查网络稍后重试');
        $scope.dealDetailInfo();
        $timeout(function () {
          hmsPopup.showLoading('加载中...');
          getData();
        },1500);
      });
    };
  }]);

