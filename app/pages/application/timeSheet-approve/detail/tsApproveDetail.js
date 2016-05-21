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

    $scope.$on('$ionicView.enter', function (e) {
      console.log('tsApproveListCtrl.$ionicView.enter');
    });

    $scope.$on('$destroy', function (e) {
      console.log('tsApproveListCtrl.$destroy');
    });
  }]);

