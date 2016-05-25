/**
 * Created by wolf on 2016/5/21. (_wen.dai_)
 */
'use strict';
//应用-timeSheet审批模块-详情
tsApproveModule.controller('tsApproveDetailCtrl', [
  '$scope',
  '$state',
  'baseConfig',
  '$ionicHistory',
  function ($scope,
            $state,
            baseConfig,
            $ionicHistory) {

    var log = console.warn.bind(console);
    $scope.$on('$ionicView.enter', function (e) {
      console.log('tsApproveListCtrl.$ionicView.enter');
    });

    $scope.$on('$destroy', function (e) {
      console.log('tsApproveListCtrl.$destroy');
    });

    $scope.selectAllDetail = function () { //全选
      log("selectAllDetail");
    };
    $scope.passThroughDetailItem = function () { //通过
      log("passThroughDetailItem");
    };
    $scope.refuseDetailItem = function () { //拒绝
      log("refuseDetailItem");
    };
  }]);

