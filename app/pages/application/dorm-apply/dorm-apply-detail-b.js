/**
 * Created by LeonChan on 2016/6/4.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.dorm-apply-detail-b', {
          url: '/dorm-apply-detail-b',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/dorm-apply/dorm-apply-detail-b.html',
              controller: 'DormApplyDetailSecondCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('DormApplyDetailSecondCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'dormApplyTypeService',
    'hmsHttp',
    'hmsPopup',
    '$rootScope',
    '$timeout',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              dormApplyTypeService,
              hmsHttp,
              hmsPopup,
              $rootScope,
              $timeout) {
      $scope.applyInfo = dormApplyTypeService.getInfo();
      $scope.checkIn = false;//审批中状态标志位
      $scope.checkOut = false;//已拒绝状态标识位
      $scope.buttonText = ""//按钮上显示的文字
      if ($scope.applyInfo.status == "已入住") {//已入住
        $scope.checkIn = true;
        $scope.checkOut = false;
        $scope.buttonText = "续住";
      } else if ($scope.applyInfo.status == "已退房") {//已退房
        $scope.checkIn = false;
        $scope.checkOut = true;
        $scope.buttonText = "再次预定";
      }
      $scope.goBack = function () {//返回上一界面
        $ionicHistory.goBack();
      };

      $scope.renewContract=function(){//续住
        var url=baseConfig.businessPath+"/wfl_apply_room/overstay_apply_room";
        var param={
          "params": {
            p_employee_number:window.localStorage.empno,
            p_checkin_date:"20160815",
            p_checkout_date:"20160920",
            p_room_number:$scope.applyInfo.roomNumber,
            p_bed_number:$scope.applyInfo.bedNumber,
            p_apply_type:$scope.applyInfo.applyType,
            p_reason:""
          }
        };
        hmsPopup.showLoading('请稍候');
        hmsHttp.post(url,param).success(function(result){
          hmsPopup.hideLoading();
          var message=result.message;
          hmsPopup.showShortCenterToast(message);
          if(result.status=="S"){
              $rootScope.$broadcast("APPLY_SUCCESS");//触发上一界面重新刷新数据
              $ionicHistory.goBack();//删除申请成功后返回上一界面
          }
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
        }).error(function(error,status){
          hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(error));
          }
        });
      };

    }]);
