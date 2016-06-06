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
          }
        })
    }]);
tsApproveModule.controller('tsApproveDetailCtrl', [
  '$scope',
  '$state',
  'baseConfig',
  '$ionicHistory',
  function ($scope,
            $state,
            baseConfig,
            $ionicHistory) {

    /**
     * init var section
     */
    {
      var warn = console.warn.bind(console);
      var selectItem = []; //初始化点击全部条目为false
      var clickSelectAll = false; //默认没有点击全选
      $scope.detailActionName = "操作";
      $scope.showActionBar = false; //默认不显示勾选按钮和底部的bar
      $scope.detailInfoArray = ['1', '2', '3']; //用于接收列表对应数据的数组
      $scope.selectArray = [];
    }

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
        angular.element('#tsApproveItem').css('paddingLeft','6%');
      } else if ($scope.detailActionName == "取消") {
        $scope.detailActionName = "操作";
        $scope.showActionBar = false;
        __initSelectArray('undoSelectAll');
        angular.element('#tsApproveItem').css('paddingLeft','0');
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
      if(clickSelectAll) {
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

