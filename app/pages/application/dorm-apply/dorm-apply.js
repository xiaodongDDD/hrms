/**
 * Created by LeonChan on 2016/5/27.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.dorm-apply', {
          url: '/dorm-apply',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/dorm-apply/dorm-apply.html',
              controller: 'DormApplyCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('DormApplyCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$ionicScrollDelegate',
    '$timeout',
    function ($scope,
              $rootScope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $ionicScrollDelegate,
              $timeout) {
      $scope.descriptionAppearance = "";
      $scope.items=[];//历史列表中的数据
      $scope.noData = true;//默认是有数据的，无数据时显示无数据提示
      searchHistoryApplyListAutomatically();//自动获取历史申请数据
      function searchHistoryApplyListAutomatically() {
        $scope.items=[];
        var url = baseConfig.businessPath + "/api_apply_room/query_room_history_list";
        var param = {
          "params": {
            p_employee_number: window.localStorage.empno
          }
        };
        //hmsPopup.showLoading('请稍候');
        hmsHttp.post(url, param).success(function (result) {
          //hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
          $scope.items = result.result;
          if ($scope.items.length == 0) {
             $scope.noData=false;
          } else if ($scope.items.length > 0) {
          angular.forEach($scope.items, function (data, index, array) {
            if (array[index].apply_status == '已入住') {
              array[index].modeCheckIn = true;
              array[index].modeCheckOut = false;
              array[index].modeApproving = false;
              array[index].modeRejected = false;
              array[index].modeCheckingIn = false;
            } else if (array[index].apply_status == '已退房') {
              array[index].modeCheckIn = false;
              array[index].modeCheckOut = true;
              array[index].modeApproving = false;
              array[index].modeRejected = false;
              array[index].modeCheckingIn = false;
            } else if (array[index].apply_status == '审批中') {
              array[index].modeCheckIn = false;
              array[index].modeCheckOut = false;
              array[index].modeApproving = true;
              array[index].modeRejected = false;
              array[index].modeCheckingIn = false;
            } else if (array[index].apply_status == '已拒绝') {
              array[index].modeCheckIn = false;
              array[index].modeCheckOut = false;
              array[index].modeApproving = false;
              array[index].modeRejected = true;
              array[index].modeCheckingIn = false;
            } else if (array[index].apply_status == '未入住') {
              array[index].modeCheckIn = false;
              array[index].modeCheckOut = false;
              array[index].modeApproving = false;
              array[index].modeRejected = false;
              array[index].modeCheckingIn = true;
            }
          });
        }
        }).error(function (error, status) {
          //hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(error));
          }
        });
      }
      $scope.goBack = function () {//返回按钮
        $ionicHistory.goBack();
      };

      $scope.createNewDormApply = function () {//跳转到新建申请界面
        $state.go("tab.new-dorm-apply");
      };

      $scope.viewApplyDetail = function (num) {//跳转到申请详情界面
        var info=$scope.items[num];
        var param={
          status:info.apply_status,//申请状态
          checkinDate:info.checkin_date,//入住日期
          checkoutDate:info.checkout_date,//退房日期
          applyType:info.apply_type,//申请类型
          floorNumber:info.floor_number,//楼层
          roomNumber:info.room_number,//房间号
          roomType:info.room_type,//房间类型
          bedNumber:info.bed_number,//床位
          applyId:info.apply_id,//申请id
          projectId:info.project_id,//项目id
          checkinDays:info.checkin_days,//入住天数
          leftDays:info.left_days//剩余天数
        };
        if (param.status == '已入住' || param.status == '已退房') {
          $state.go("tab.dorm-apply-detail-b",{
            'dormApplyDetailInfo':param
          });
        } else if (param.status == '审批中' || param.status == '已拒绝' || param.status == '未入住') {
          $state.go("tab.dorm-apply-detail-a",{
            'dormApplyDetailInfo':param
          });
        }
      };

      $scope.judgeApplyType = function (param) {//通过判断申请类型是否显示剩余天数字段
        var internalParam = param.apply_status;
        if (internalParam == '已入住' || internalParam == '已退房' || internalParam == '未入住') {
          return true;
        } else if (internalParam == '审批中' || internalParam == '已拒绝') {
          return false;
        }
      };
      $scope.showDescription = function () {//显示住宿说明
        $scope.descriptionAppearance = true;
      };
      $scope.hideDescription = function () {//隐藏住宿说明
        $scope.descriptionAppearance = false;
      };
      $rootScope.$on("APPLY_SUCCESS",function(){//空房间申请成功时，返回查询界面自动刷新历史申请数据
        $timeout(function() {
          $ionicScrollDelegate.$getByHandle('dormScroll').scrollTop(false);
        },200);
        searchHistoryApplyListAutomatically();//自动刷新数据
      });
      $rootScope.$on("APPLY_CANCELLED",function(){//审批中状态的申请被删除后，返回了这个界面，自动触发刷新数据
        $timeout(function() {
          $ionicScrollDelegate.$getByHandle('dormScroll').scrollTop(false);
        },200);
        searchHistoryApplyListAutomatically();//自动刷新数据
      });
    }]);
