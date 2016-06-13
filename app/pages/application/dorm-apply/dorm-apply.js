/**
 * Created by LeonChan on 2016/5/27.
 */
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
    'dormApplyTypeService',
    'hmsHttp',
    'hmsPopup',
    '$ionicScrollDelegate',
    '$timeout',
    function ($scope,
              $rootScope,
              $state,
              baseConfig,
              $ionicHistory,
              dormApplyTypeService,
              hmsHttp,
              hmsPopup,
              $ionicScrollDelegate,
              $timeout) {
      $scope.descriptionAppearance = false;
      $scope.items=[];//历史列表中的数据
      searchHistoryApplyListAutomatically();//自动获取历史申请数据
      function searchHistoryApplyListAutomatically() {
        $scope.items=[];
        var url = baseConfig.businessPath + "/wfl_apply_room/query_room_history_list";
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
          var i = 0;
          for (i; i < $scope.items.length; i++) {//处理显示某种小戳图片
            if ($scope.items[i].apply_status == "已入住") {
              $scope.items[i].modeCheckIn = true;
              $scope.items[i].modeCheckOut = false;
              $scope.items[i].modeApproving = false;
              $scope.items[i].modeRejected = false;
            } else if ($scope.items[i].apply_status == "已退房") {
              $scope.items[i].modeCheckIn = false;
              $scope.items[i].modeCheckOut = true;
              $scope.items[i].modeApproving = false;
              $scope.items[i].modeRejected = false;
            } else if ($scope.items[i].apply_status == "审批中") {
              $scope.items[i].modeCheckIn = false;
              $scope.items[i].modeCheckOut = false;
              $scope.items[i].modeApproving = true;
              $scope.items[i].modeRejected = false;
            } else if ($scope.items[i].apply_status == "已拒绝") {
              $scope.items[i].modeCheckIn = false;
              $scope.items[i].modeCheckOut = false;
              $scope.items[i].modeApproving = false;
              $scope.items[i].modeRejected = true;
            }
          }
        }).error(function (error, status) {
          hmsPopup.hideLoading();
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
          applyId:info.apply_id//申请id
        };
        dormApplyTypeService.putInfo(param);//将申请状态存储在service中
        if (param.status == "已入住" || param.status == "已退房") {
          $state.go("tab.dorm-apply-detail-b");
        } else if (param.status == "审批中" || param.status == "已拒绝") {
          $state.go("tab.dorm-apply-detail-a");
        }
      };

      $scope.judgeApplyType = function (param) {//通过判断申请类型是否显示剩余天数字段
        var internalParam = param.apply_status;
        if (internalParam == "已入住" || internalParam == "已退房") {
          return true;
        } else if (internalParam == "审批中" || internalParam == "已拒绝") {
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
