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
    '$timeout',
    function ($scope,
              $state,
              baseConfig,
              $ionicModal,
              $ionicScrollDelegate,
              $ionicPopup,
              $timeout) {
      /**
       * initial var section
       */
      {
        var warn = console.warn.bind(console);
        $scope.showRocket = false; //默认不显示小火箭
        $scope.showConnectBlock = true; //默认显示连接块
        $scope.showDetailArrow = true; //默认显示向右的箭头--go list detail
        var clickSelectAll = false; //默认没有点击全选
        $scope.actionName = "操作";
        $scope.selectArray = [];
        $scope.listInfoArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        var position = ""; //记录滚动条的位置
        var selectItem = []; //初始化点击全部条目为false
        //var connectBlock = document.getElementById('#connect-block');
      }

      $scope.$on('$ionicView.enter', function (e) {
        console.log('tsApproveListCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('tsApproveListCtrl.$destroy');
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
          if (position >= -5 && position < 0) {
            //connectBlock.style.width = '25px';
            //angular.element('#connect-block').addClass('connect-block-1');
          } else if (position >= -12 && position < -5) {
            //angular.element('#connect-block').addClass('connect-block-2');
          } else if (position >= -19 && position < -12) {
            //angular.element('#connect-block').addClass('connect-block-3');
            //angular.element('#connect-block').addClass('ng-hide');
          } else if (position >= 0 && position < 400) { //在顶部时显示连接块
            //angular.element('#connect-block').addClass('connect-block');
            $scope.showRocket = false;
            $scope.showConnectBlock = true;
          } else if (position >= 400) {
            $scope.showRocket = true;
          } else {
          }
        });
        warn(position);
      };

      $scope.tsListrefresh = function () { //下拉刷新
        $timeout(function () {
          //$scope.showConnectBlock = true;
          //angular.element('#connect-block').removeClass("connect-block connect-block-3 ng-hide connect-block-1");
          $scope.$broadcast("scroll.refreshComplete");
        }, 1000);
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
            }
          ]
        });
      };

      $scope.goTsLsTop = function () { //返回列表顶部
        angular.element('#rocket').addClass('ng-hide');
        $ionicScrollDelegate.scrollTop();
      };

      $ionicModal.fromTemplateUrl('build/pages/application/timesheet-approve/modal/ts-filter-modal.html', { //筛选modal
        scope: $scope
      }).then(function (modal) {
        $scope.tsFilterModal = modal;
      });

      $scope.filterTsInfo = function () { //响应筛选按钮的方法
        $scope.tsFilterModal.show();
      };

      $scope.goApproveDetail = function (index) {
        if ($scope.showDetailArrow) {
          $state.go('tab.tsApproveDetail');
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
          angular.element('#project-name').addClass('active-select');
          angular.element('#project-name').removeClass('active-off');
          angular.element('#person-select').removeClass('active-select');
        } else if (selectParam == 'personSelect') {
          angular.element('#person-select').addClass('active-select');
          angular.element('#project-name').addClass('active-off');
        }
      };

      $scope.selectFilterItem = function () { //点击单个条目时的响应方法

      };
    }]);
