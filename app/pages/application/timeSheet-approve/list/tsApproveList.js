/**
 * Created by wolf on 2016/5/19.
 * @author: wen.dai@hand-china.com
 *
 */
'use strict';
//应用-timeSheet审批模块-列表
angular.module('tsApproveModule')
  .controller('tsApproveListCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$ionicScrollDelegate',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              $ionicScrollDelegate) {
      /**
       * initial var section
       */
      {
        $scope.showRocket = false; //默认不显示小火箭
        $scope.showConnectBlock = true; //默认显示连接块
        var position = ""; //记录滚动条的位置
      }

      $scope.onDrag = function () { //拖拽
        $scope.showConnectBlock = false;
      };

      $scope.onDragUp = function () { //向上拖拽
        $scope.showConnectBlock = true; //显示连接块
      };

      $scope.watchScroll = function () { //滚动内容时执行的method
        position = $ionicScrollDelegate.getScrollPosition().top;
        $scope.$apply(function () {
          if (position >= 400) {
            $scope.showRocket = true;
          } else if(position == 0){ //在顶部时显示连接块
            $scope.showConnectBlock = true;
          }else {
            $scope.showRocket = false;
          }
        });
      };

      $scope.goApproveDetail = function () {
        $state.go('tab.tsApproveDetail');
      };

      $scope.goTsLsTop = function () { //返回列表顶部
        $ionicScrollDelegate.scrollTop();
      };

      $scope.$on('$ionicView.enter', function (e) {
        console.log('tsApproveListCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('tsApproveListCtrl.$destroy');
      });
    }]);
