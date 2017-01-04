/**
 * Created by wangkaihua on 2016/10/10.
 */
'use strict';
angular.module('contactModule')
  .controller('colleagueLinkmanCtrl', [
    '$scope',
    '$ionicScrollDelegate',
    '$ionicModal',
    'baseConfig',
    'hmsPopup',
    '$state',
    'getInitStructureInfo',
    '$rootScope',
    function ($scope,
              $ionicScrollDelegate,
              $ionicModal,
              baseConfig,
              hmsPopup,
              $state,
              getInitStructureInfo,
              $rootScope) {
      $scope.$on('$ionicView.enter', function (e) {
        console.log('同事.$ionicView.enter');
      });
      {
        $scope.customContactsInfo = [];
        $scope.showTopInput = false; // 默认不显示bar上的搜索框
        $scope.structureName = ''; //当前员工所属层级的名字
        $scope.currentStructure = {};
        var CONTACT_TAG = 'contact:\n';
        var position = ''; //记录滚动条的位置--
        var LINK_MAN = 'common_linkman2';
      }

     function getCurrentDepartInfo(result) {
        try {
          if (Object.keys(result).length !== 0) { //枚举
            $scope.currentStructure = result;
            for (var i = 1; i < result.deptInfo.length; i++) {
              if (i === (result.deptInfo.length - 1)) {
                $scope.structureName += result.deptInfo[i].name;
              } else {
                $scope.structureName += result.deptInfo[i].name + '-';
              }
            }
          }
        } catch (e) {
        }
      }

      getInitStructureInfo.getCurrentStructure(getCurrentDepartInfo);

      function getCommonLinkMan() { //获取常用联系人
        $scope.customContactsInfo = unique_better(storedb(LINK_MAN).find(), 'employeeNumber');
        console.log($scope.customContactsInfo);
        if ($scope.customContactsInfo.length > 15) {
          $scope.customContactsInfo = $scope.customContactsInfo.slice(0, 15);
        }
      }


      $scope.$on('$ionicView.beforeEnter', function (e) {
        console.log("获取常用联系人");
        getCommonLinkMan();
      });


    /*  $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('ContactCtrl.$destroy');
        }
      });*/

      $scope.watchScroll = function () { //滚动内容时执行的method
        position = $ionicScrollDelegate.getScrollPosition().top;
        $scope.$apply(function () {
          if (position < 33) {
            $scope.showTopInput = false;
          } else if (position >= 33) {
            $scope.showTopInput = true;
          }
        });
      };
      $scope.telNumber = function (event, baseInfo) { //拨打电话按钮的响应事件
        event.stopPropagation(); //阻止事件冒泡
        //常用联系人拨打电话
        window.location.href = "tel:" + baseInfo.replace(/\s+/g, "");
      };

      $scope.goInputSearch = function () { //去搜索界面
        $state.go('tab.contactCrmSearch');
      };

      $scope.goStructure = function (flag) {
        // hmsPopup.showShortCenterToast('下一版本上线!');
        // return;
        if (angular.equals(flag, 'current')) {
          $state.go('tab.contactStructure', {
            routeId: "currentDepartment",
            structureId: "1",
            currentDepartInfo: $scope.currentStructure
          });
        } else {
          $state.go('tab.contactStructure');
        }
      };

      $scope.goDetailInfo = function (newEmployeeNumber) {
        $state.go('tab.employeeDetail', {employeeNumber: newEmployeeNumber});
      };
    }]);
