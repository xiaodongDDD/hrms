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
    '$ionicModal',
    '$ionicScrollDelegate',
    '$ionicPopup',
    function ($scope,
              $state,
              baseConfig,
              $ionicModal,
              $ionicScrollDelegate,
              $ionicPopup) {
      /**
       * initial var section
       */
      {
        $scope.showRocket = false; //默认不显示小火箭
        $scope.showConnectBlock = true; //默认显示连接块
        $scope.showDetailArrow = true; //默认显示向右的箭头--go list detail
        $scope.actionName = "操作";
        var position = ""; //记录滚动条的位置
      }

      $scope.$on('$ionicView.enter', function (e) {
        console.log('tsApproveListCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('tsApproveListCtrl.$destroy');
      });

      $scope.doSelectAction = function () { //header 右上角显示操作按钮
        $scope.actionName = "取消";
        angular.element('.tsApproveListItem').css("paddingLeft","8%");
        $scope.showDetailArrow = false;
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
          if (position >= 400) {
            $scope.showRocket = true;
          } else if (position === 0) { //在顶部时显示连接块
            $scope.showConnectBlock = true;
          } else {
            $scope.showRocket = false;
          }
        });
      };

      $scope.getAttentionInfo = function (e) {
        e.stopPropagation(); //阻止事件冒泡
        $ionicPopup.show({
          template: '<div class="warn-attention-icon">BASE地与项目一致</div>',
          scope: $scope,
          buttons: [
            {
              text: '<div class="warn-cancel-icon"></div>',
              type: 'button-clear',
              onTap: function (e) {
              }
            },
          ]
        });
      };

      $scope.goTsLsTop = function () { //返回列表顶部
        $scope.showRocket = false; //不显示小火箭
        $ionicScrollDelegate.scrollTop();
      };

      $ionicModal.fromTemplateUrl('build/pages/application/timeSheet-approve/modal/ts-filter-modal.html', { //筛选modal
        scope: $scope
      }).then(function (modal) {
        $scope.tsFilterModal = modal;
      });

      $scope.filterTsInfo = function () { //响应筛选按钮的方法
        $scope.tsFilterModal.show();
      };

      $scope.goApproveDetail = function () {
        $state.go('tab.tsApproveDetail');
      };
    }]);
