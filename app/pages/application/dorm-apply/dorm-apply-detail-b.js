/**
 * Created by LeonChan on 2016/6/4.
 */
'use strict';
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
          },
          params:{
            dormApplyDetailInfo:''
          }
        })
    }]);
angular.module('applicationModule')
  .controller('DormApplyDetailSecondCtrl', [
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
      $scope.applyInfo = $stateParams.dormApplyDetailInfo;
      $scope.checkIn = false;//审批中状态标志位
      $scope.checkOut = false;//已拒绝状态标识位
      $scope.buttonText = '';//按钮上显示的文字
      $scope.leftDays=$scope.applyInfo.leftDays;//剩余天数
      $scope.totalDays=parseInt($scope.applyInfo.checkinDays);
////////////
//      var childDays=parseInt($scope.leftDays);//计算圆旋转角度的剩余天数
//      var motherDays=parseInt($scope.applyInfo.checkinDays);//计算圆旋转角度的入住天数
//      var calculation=childDays/motherDays;//分子除以分母
//      //console.log(calculation);
//      //JS圆环动画
//      var leftball=document.getElementById('left_ball');//拿到左半圆DOM
//      var rightball=document.getElementById('right_ball');//拿到右半圆DOM
//      if(calculation<=0.5){//剩余天数大于总天数的一半
//        leftball.style.transition="all 0.3s linear";
//        leftball.style.webkitTransition="all 0.3s linear";
//        rightball.style.transition="all 0.3s ease-out";//右半圆过渡动画0.3s，渐快，无延迟
//        rightball.style.webkitTransition="all 0.3s ease-out";
//      }else if(calculation>0.5){//剩余天数不到入住天数的一半
//        leftball.style.transition="all 0.3s ease-out 0.3s";//左半圆过渡动画0.3s，渐缓，0.3s延迟
//        leftball.style.webkitTransition="all 0.3s ease-out 0.3s";
//        rightball.style.transition="all 0.3s ease-in";//右半圆过渡动画0.3s，渐快，无延迟
//        rightball.style.webkitTransition="all 0.3s ease-in";
//      }
//      leftball.style.webkitTransform = "rotate(-135deg)";
//      leftball.style.transform = "rotate(-135deg)";
//      rightball.style.webkitTransform = "rotate(-135deg)";
//      rightball.style.transform = "rotate(-135deg)";
      //定时器中决定两个圆的终止角度
      //$timeout(function(){
      //  var angle=0;
      //  if(calculation<=0.5){
      //    angle=360*calculation;
      //    angle=angle-135;
      //    //console.log("角度："+angle);
      //    leftball.style.webkitTransform = "rotate(-135deg)";
      //    leftball.style.transform = "rotate(-135deg)";
      //    rightball.style.webkitTransform = "rotate("+angle+"deg)";
      //    rightball.style.transform = "rotate("+angle+"deg)";
      //  }else if(calculation>0.5){
      //    calculation=calculation-0.5;
      //    angle=360*calculation;
      //    angle=angle-135;
      //    //console.log("角度："+angle);
      //    leftball.style.webkitTransform = "rotate("+angle+"deg)";
      //    leftball.style.transform = "rotate("+angle+"deg)";
      //    rightball.style.webkitTransform = "rotate(45deg)";
      //    rightball.style.transform = "rotate(45deg)";
      //  }
      //},500);

      if ($scope.applyInfo.status == '已入住') {//已入住
        $scope.checkIn = true;
        $scope.checkOut = false;
        $scope.buttonText = '续住';
      } else if ($scope.applyInfo.status == '已退房') {//已退房
        $scope.checkIn = false;
        $scope.checkOut = true;
        $scope.buttonText = '再次预定';
      }

      $scope.goBack = function () {//返回上一界面
        $ionicHistory.goBack();
      };

      $scope.renewContract=function(){//续住
        var url=baseConfig.businessPath+"/api_apply_room/overstay_apply_room";
        var param={
          "params": {
            p_employee_number:window.localStorage.empno,
            p_pro_id:"",
            p_checkin_date:"2016-08-15",
            p_checkout_date:"2016-09-20",
            p_room_number:$scope.applyInfo.roomNumber,
            p_bed_number:$scope.applyInfo.bedNumber,
            p_apply_type:$scope.applyInfo.applyType,
            p_reason:""
          }
        };
        if($scope.applyInfo.applyType=='项目申请'){
          param.params.p_pro_id=$scope.applyInfo.projectId;
        }
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
