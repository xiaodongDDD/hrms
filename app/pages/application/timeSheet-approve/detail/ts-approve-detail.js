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
  function ($scope,
            $state,
            baseConfig,
            $ionicHistory,
            $stateParams,
            hmsHttp,
            hmsPopup) {

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
          "p_start_date": $stateParams.startDate.toString().replace(/-/g, ""),
          "p_end_date": $stateParams.endDate.toString().replace(/-/g, ""),
          "p_project_id": $stateParams.projectId
        }
      };
    }
    hmsPopup.showLoading('记载中...');
    hmsHttp.post(tsApproveDetailUrl, tsApproveDetailParams).success(function (response) {
      hmsPopup.hideLoading();
      if (hmsHttp.isSuccessfull(response.status)) {
        $scope.detailInfoArray = response.timesheet_approve_detail_response;
      } else {
        if (response.status === 'E' || response.status == 'e') {
          hmsPopup.showPopup("提示", "<div style='text-align: center'>没有相关数据!</div>");
        } else {
          hmsPopup.showPopup("提示", "<div style='text-align: center'>网络异常,请稍后重试!</div>");
        }
      }
    }).error(function (response, status) {
      hmsPopup.hideLoading();
      hmsPopup.showPopup("提示", "<div style='text-align: center'>服务请求异常,请检查网络连接和输入参数后重新操作!</div>");
    });

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
        warn(angular.toJson($scope.selectArray, true));
      }
    };

    $scope.selectItem = function (index) { //单击选中条目的响应method
      selectItem[index] = !selectItem[index];
      if (selectItem[index]) {
        $scope.selectArray[index] = true;
      } else {
        $scope.selectArray[index] = false;
      }
    };

    $scope.selectAllDetail = function () { //全选
      clickSelectAll = !clickSelectAll;
      if (clickSelectAll) {
        __initSelectArray('selectedAll');
      } else {
        __initSelectArray('undoSelectAll');
      }
    };

    $scope.passThroughDetailItem = function () { //通过
      warn("passThroughDetailItem");
    };

    $scope.refuseDetailItem = function () { //拒绝
      warn("refuseDetailItem");
    };
  }]);

