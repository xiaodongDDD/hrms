/**
 * Created by LeonChan on 2016/5/31.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.dorm-apply-detail-a', {
          url: '/dorm-apply-detail-a',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/dorm-apply/dorm-apply-detail-a.html',
              controller: 'DormApplyDetailFirstCtrl'
            }
          },
          params:{
            dormApplyDetailInfo:''
          }
        })
    }]);
angular.module('applicationModule')
  .controller('DormApplyDetailFirstCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$rootScope',
    '$timeout',
    '$stateParams',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $rootScope,
              $timeout,
              $stateParams) {
      $scope.applyInfo=$stateParams.dormApplyDetailInfo;
      $scope.approving=false;//审批中状态标志位
      $scope.rejected=false;//已拒绝状态标识位
      $scope.checkingin=false;//未入住状态标识位
      $scope.approvedResult="";
      if($scope.applyInfo.status == '审批中'){
        $scope.approving=true;
        $scope.rejected=false;
        $scope.checkingin=false;
        $scope.approvedResult="";
      }else if($scope.applyInfo.status == '已拒绝'){
        $scope.approving=false;
        $scope.rejected=true;
        $scope.checkingin=false;
        $scope.approvedResult='已拒绝';
      }else if($scope.applyInfo.status == '未入住'){
        $scope.approving=false;
        $scope.rejected=false;
        $scope.checkingin=true;
        $scope.approvedResult="已通过";
      }
      $scope.goBack=function(){//返回上一界面
        $ionicHistory.goBack();
      };
      $scope.cancelApply=function(){//取消申请
        var url=baseConfig.businessPath+"/wfl_apply_room/cancel_application";
        var param={
          "params": {
            p_apply_id:$scope.applyInfo.applyId,//用申请id取消申请
            p_employee_number:window.localStorage.empno//工号
          }
        };
        hmsPopup.showLoading('请稍候');
        hmsHttp.post(url,param).success(function(result){
          hmsPopup.hideLoading();
          var message=result.message;
          hmsPopup.showShortCenterToast(message);//展示接口返回的message
          if(result.status=="S"){
              $rootScope.$broadcast("APPLY_CANCELLED");//触发上一界面重新刷新数据
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
