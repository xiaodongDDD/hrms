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
    '$cordovaDatePicker',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $rootScope,
              $timeout,
              $stateParams,
              $cordovaDatePicker) {
      /**
       * 续住和再次预定功能部分由于需要选择开始和结束时间
       * 所以目前设计成点击按钮后，提示用户选择开始于结束日期
       * 当再次点击续住的时候，会判断日期选择是否合法
       * 如果合法的话，就调用接口
       **/
      $scope.applyInfo = $stateParams.dormApplyDetailInfo;
      $scope.checkIn = false;//审批中状态标志位
      $scope.checkOut = false;//已拒绝状态标识位
      $scope.buttonText = '';//按钮上显示的文字
      $scope.leftDays=$scope.applyInfo.leftDays;//剩余天数
      $scope.allowApply=false;//由于续住和再次预定需要选择开始日期和结束日期，默认未选择日期
      $scope.totalDays=parseInt($scope.applyInfo.checkinDays);
      var todayDate = new Date();//用今天日期和明天日期初始化入住日期和结束日期
      var todayMonth = todayDate.getMonth()+1;
      var todayDay =todayDate.getDate();
      $scope.startDate={//入住日期
        year:todayDate.getFullYear(),
        month:"",
        day:""
      };
      $scope.endDate={//结束日期
        year:"",
        month:"",
        day:""
      };
      if(todayMonth<10){
        todayMonth="0"+todayMonth;
      }
      if(todayDay<10){
        todayDay="0"+todayDay;
      }
      $scope.startDate.month=todayMonth;
      $scope.startDate.day=todayDay;
      refreshEndDate(1);//初始化结束日期为明天

      if ($scope.applyInfo.status == '已入住') {//已入住
        $scope.checkIn = true;
        $scope.checkOut = false;
        $scope.buttonText = '续住';
      } else if ($scope.applyInfo.status == '已退房') {//已退房
        $scope.checkIn = false;
        $scope.checkOut = true;
        $scope.buttonText = '再次预定';
      }

      function refreshEndDate(num){//今天之后的num天
        var myDate=$scope.startDate;
        var todayDate=new Date(myDate.year,myDate.month-1,myDate.day);
        var tomorrowDate=new Date(myDate.year,myDate.month-1,myDate.day);
        var tomorrowYear="";
        var tomorrowDay="";
        var tomorrowMonth="";
        num=parseInt(num);
        tomorrowDate.setDate(todayDate.getDate()+num);
        tomorrowYear=tomorrowDate.getFullYear();
        tomorrowDay=tomorrowDate.getDate();
        tomorrowMonth=tomorrowDate.getMonth()+1;
        if(tomorrowMonth<10){
          tomorrowMonth="0"+tomorrowMonth;
        }
        if(tomorrowDay<10){
          tomorrowDay="0"+tomorrowDay;
        }
        $scope.endDate.year=tomorrowYear;
        $scope.endDate.month=tomorrowMonth;
        $scope.endDate.day=tomorrowDay;
      };

      $scope.goBack = function () {//返回上一界面
        $ionicHistory.goBack();
      };

      $scope.formatStartDate=function(){//格式化开始日期成接口和展示形式
        var date = $scope.startDate;
        var year = date.year;
        var month = date.month;
        var day = date.day;
        var result = year+"-"+month+"-"+day;
        return result;
      };

      $scope.formatEndDate=function(){//格式化结束日期成接口和展示形式
        var date = $scope.endDate;
        var year = date.year;
        var month = date.month;
        var day = date.day;
        var result = year+"-"+month+"-"+day;
        return result;
      };

      $scope.chooseStartDate=function(){//选择入住日期
        var myDate=$scope.startDate;
        var previousDate=new Date(myDate.year,myDate.month-1,myDate.day);
        var options={
          date: previousDate,
          mode: 'date',
          titleText:'请选择入住日期',
          okText:'确定',
          cancelText:'取消',
          doneButtonLabel:'确认',
          cancelButtonLabel:'取消',
          androidTheme : window.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
          locale:"zh_cn"
        };
        $cordovaDatePicker.show(options).then(function(date){
          var month=date.getMonth()+1;
          var day=date.getDate();
          if(month<10){
            month="0"+month;
          }
          if(day<10){
            day="0"+day;
          }
          $scope.startDate.year=date.getFullYear();
          $scope.startDate.month=month;
          $scope.startDate.day=day;
          $scope.$apply();
        });
      };

      $scope.chooseEndDate=function(){//选择结束日期
        var myDate=$scope.endDate;
        var previousDate=new Date(myDate.year,myDate.month-1,myDate.day);
        var options={
          date: previousDate,
          mode: 'date',
          titleText:'请选择入住日期',
          okText:'确定',
          cancelText:'取消',
          doneButtonLabel:'确认',
          cancelButtonLabel:'取消',
          androidTheme : window.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK,
          locale:"zh_cn"
        };
        $cordovaDatePicker.show(options).then(function(date){
          var month=date.getMonth()+1;
          var day=date.getDate();
          if(month<10){
            month="0"+month;
          }
          if(day<10){
            day="0"+day;
          }
          $scope.endDate.year=date.getFullYear();
          $scope.endDate.month=month;
          $scope.endDate.day=day;
          $scope.$apply();
        });
      };

      $scope.renewContract=function(){//续住
        var startYear=$scope.startDate.year;//开始日期年份
        var startMonth=$scope.startDate.month;//开始日期月份
        var startDay=$scope.startDate.day;//开始日期
        var endYear=$scope.endDate.year;//结束日期年份
        var endMonth=$scope.endDate.month;//结束日期月份
        var endDay=$scope.endDate.day;//结束日期
        startMonth=parseInt(startMonth);
        startDay=parseInt(startDay);
        endMonth=parseInt(endMonth);
        endDay=parseInt(endDay);
        if($scope.allowApply == false) {
          $scope.allowApply=true;
          $scope.buttonText='确认';
          hmsPopup.showShortCenterToast('请选择入住日期和结束日期');
        }else if( $scope.allowApply == true ) {
          if((startYear>endYear) ||((startYear==endYear)&&(startMonth>endMonth)) || ((startYear==endYear)&&(startMonth==endMonth)&&(startDay>endDay))){
            hmsPopup.showShortCenterToast('入住日期不能晚于结束日期');
          }else{
            var url = baseConfig.businessPath + "/api_apply_room/overstay_apply_room";
            var param = {
              "params": {
                p_employee_number: window.localStorage.empno,
                p_pro_id: "",
                p_checkin_date: $scope.startDate.year+"-"+$scope.startDate.month+"-"+$scope.startDate.day,
                p_checkout_date: $scope.endDate.year+"-"+$scope.endDate.month+"-"+$scope.endDate.day,
                p_room_number: $scope.applyInfo.roomNumber,
                p_bed_number: $scope.applyInfo.bedNumber,
                p_apply_type: $scope.applyInfo.applyType,
                p_reason: ""
              }
            };
            if ($scope.applyInfo.applyType == '项目申请') {
              param.params.p_pro_id = $scope.applyInfo.projectId;
            }
            hmsPopup.showLoading('请稍候');
            hmsHttp.post(url, param).success(function (result) {
              hmsPopup.hideLoading();
              var message = result.message;
              hmsPopup.showShortCenterToast(message);
              if (result.status == "S") {
                $rootScope.$broadcast("APPLY_SUCCESS");//触发上一界面重新刷新数据
                $ionicHistory.goBack();//删除申请成功后返回上一界面
              }
              if (baseConfig.debug) {
                console.log("result success " + angular.toJson(result));
              }
            }).error(function (error, status) {
              hmsPopup.hideLoading();
              hmsPopup.showShortCenterToast("网络连接出错");
              if (baseConfig.debug) {
                console.log("response error " + angular.toJson(error));
              }
            });
          }
        }
      };

    }]);
