/**
 * Created by LeonChan on 2016/5/30.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.new-dorm-apply', {
          url: '/new-dorm-apply',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/dorm-apply/new-dorm-apply.html',
              controller: 'NewDormApplyCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('NewDormApplyCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$ionicModal',
    'hmsHttp',
    'hmsPopup',
    '$cordovaDatePicker',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              $ionicModal,
              hmsHttp,
              hmsPopup,
              $cordovaDatePicker) {
      $ionicModal.fromTemplateUrl('build/pages/application/dorm-apply/modal/new-dorm-apply-choose-apply-type.html', {//定义modal
        scope: $scope
      }).then(function (modal1) {
        $scope.chooseTypePopup = modal1;
      });//初始化选择申请类型的modal
      $ionicModal.fromTemplateUrl('build/pages/application/dorm-apply/modal/new-dorm-apply-choose-room-type.html', {//定义modal
        scope: $scope
      }).then(function (modal2) {
        $scope.chooseRoomPopup = modal2;
      });//初始化选择房间类型的modal
      $ionicModal.fromTemplateUrl('build/pages/application/dorm-apply/modal/new-dorm-apply-choose-project-name.html', {//定义modal
        scope: $scope
      }).then(function (modal3) {
        $scope.chooseProjectPopup = modal3;
      });//初始化选择房间类型的modal
      $scope.defaultApplyType='常驻申请';//默认申请类型
      $scope.defaultRoomType='单人间';//默认房间类型
      $scope.defaultProjectInfo={
        projectName:'',//项目名称
        projectId:''//项目ID
      };//默认项目名称
      $scope.showProjectItem=false;//显示选择项目的入口
      $scope.applytype=["常驻申请","加班申请","临时申请","项目申请"];//项目申请选项
      $scope.roomtype=["单人间","四人间"];//房间申请
      $scope.projectlist=[];//项目列表
      $scope.showNumButton=true;//显示数字按钮，隐藏图片按钮
      $scope.inputinfo={
        floornum:"",//输入楼层号
        roomnum:""//输入房间号
      };
      var todayDate = new Date();//今天日期
      var weekday=todayDate.getDay();
      var month=todayDate.getMonth()+1;
      var day=todayDate.getDate();
      $scope.startDate={//开始日期
        year:todayDate.getFullYear(),
        month:"",
        day:"",
        weekday:""
      };
      $scope.endDate={//结束日期
        year:"",
        month:"",
        day:"",
        weekday:""
      };
      if(weekday==0){
        $scope.startDate.weekday="周日";
      }else if(weekday==1){
        $scope.startDate.weekday="周一";
      }else if(weekday==2){
        $scope.startDate.weekday="周二";
      }else if(weekday==3){
        $scope.startDate.weekday="周三";
      }else if(weekday==4){
        $scope.startDate.weekday="周四";
      }else if(weekday==5){
        $scope.startDate.weekday="周五";
      }else if(weekday==6){
        $scope.startDate.weekday="周六";
      }
      if(month<10){
        month="0"+month;
      }
      if(day<10){
        day="0"+day;
      }
      $scope.startDate.month=month;
      $scope.startDate.day=day;
      refreshEndDate(1);//结束日期默认比开始晚1天
      var url=baseConfig.businessPath+"/api_apply_room/query_project_list";
      var param={
        "params": {
          p_employee_number:window.localStorage.empno//工号
        }
      };
      hmsPopup.showLoading('请稍候');
      hmsHttp.post(url,param).success(function(result){//自动获取项目列表信息
        hmsPopup.hideLoading();
        if(result.status=="S"){
          $scope.projectlist=result.result;
          $scope.projectlist=$scope.projectlist.splice(1,$scope.projectlist.length-1);
          if($scope.projectlist.length>0){//如果查出结果的项目列表长度大于1的话则抓取第一个
            $scope.defaultProjectInfo.projectName=$scope.projectlist[0].project_name;
            $scope.defaultProjectInfo.projectId=$scope.projectlist[0].project_id;
            console.log(angular.toJson($scope.defaultProjectInfo));
          }else if($scope.projectlist.length==0){//如果查出项目列表的长度为0的话，则自动把默认变为无
            $scope.defaultProjectInfo.projectName='无';
            $scope.defaultProjectInfo.projectId='';
          }
        }
        if (baseConfig.debug) {
          console.log("result success " + angular.toJson(result));
        }
      }).error(function(error){
        hmsPopup.hideLoading();
        if (baseConfig.debug) {
          console.log("response error " + angular.toJson(error));
        }
      });

      function refreshEndDate(num){//选择30,60,90后刷新结束日期
        var myDate=$scope.startDate;
        var todayDate=new Date(myDate.year,myDate.month-1,myDate.day);
        var tomorrowDate=new Date(myDate.year,myDate.month-1,myDate.day);
        var tomorrowYear="";
        var tomorrowDay="";
        var tomorrowMonth="";
        var tomorrowWeekDay="";
        num=parseInt(num);
        tomorrowDate.setDate(todayDate.getDate()+num);
        tomorrowYear=tomorrowDate.getFullYear();
        tomorrowDay=tomorrowDate.getDate();
        tomorrowMonth=tomorrowDate.getMonth()+1;
        tomorrowWeekDay=tomorrowDate.getDay();
        if(tomorrowWeekDay==0){
          $scope.endDate.weekday="周日";
        }else if(tomorrowWeekDay==1){
          $scope.endDate.weekday="周一";
        }else if(tomorrowWeekDay==2){
          $scope.endDate.weekday="周二";
        }else if(tomorrowWeekDay==3){
          $scope.endDate.weekday="周三";
        }else if(tomorrowWeekDay==4){
          $scope.endDate.weekday="周四";
        }else if(tomorrowWeekDay==5){
          $scope.endDate.weekday="周五";
        }else if(tomorrowWeekDay==6){
          $scope.endDate.weekday="周六";
        }
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

      $scope.goBack=function(){//返回按钮
        $ionicHistory.goBack();
      };

      $scope.chooseStartDate=function(){//选择开始日期
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
        }
        $cordovaDatePicker.show(options).then(function(date){
          var month=date.getMonth()+1;
          var day=date.getDate();
          var weekday=date.getDay();
          if(weekday==0){
            $scope.startDate.weekday="周日";
          }else if(weekday==1){
            $scope.startDate.weekday="周一";
          }else if(weekday==2){
            $scope.startDate.weekday="周二";
          }else if(weekday==3){
            $scope.startDate.weekday="周三";
          }else if(weekday==4){
            $scope.startDate.weekday="周四";
          }else if(weekday==5){
            $scope.startDate.weekday="周五";
          }else if(weekday==6){
            $scope.startDate.weekday="周六";
          }
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

      $scope.chooseEndDate=function() {//选择结束
        var myDate=$scope.endDate;
        var previousDate=new Date(myDate.year,myDate.month-1,myDate.day);
        var options={
          date: previousDate,
          mode: 'date',
          titleText:'请选择结束日期',
          okText:'确定',
          cancelText:'取消',
          doneButtonLabel:'确认',
          cancelButtonLabel:'取消',
          androidTheme : window.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK,
          locale:"zh_cn"
        }
        $cordovaDatePicker.show(options).then(function(date){
          var month=date.getMonth()+1;
          var day=date.getDate();
          var weekday=date.getDay();
          if(weekday==0){
            $scope.endDate.weekday="周日";
          }else if(weekday==1){
            $scope.endDate.weekday="周一";
          }else if(weekday==2){
            $scope.endDate.weekday="周二";
          }else if(weekday==3){
            $scope.endDate.weekday="周三";
          }else if(weekday==4){
            $scope.endDate.weekday="周四";
          }else if(weekday==5){
            $scope.endDate.weekday="周五";
          }else if(weekday==6){
            $scope.endDate.weekday="周六";
          }
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

      $scope.chooseLongDays=function(num){//选择30,60,90天的点击事件
        refreshEndDate(num);
        $scope.showNumButton=true;
      };

      $scope.chooseApplyType=function(){//显示申请类型modal
        $scope.chooseTypePopup.show();
      };

      $scope.chooseRoomType=function(){//显示房间类型modal
        $scope.chooseRoomPopup.show();
      };

      $scope.chooseProjectName=function(){//显示项目名称列表modal
        if($scope.projectlist.length==0){
          hmsPopup.showShortCenterToast('项目列表为空，请更改申请类型');//项目列表为空时
        }else if($scope.projectlist.length>0){
          $scope.chooseProjectPopup.show();
        }
      };

      $scope.finishChoosingApplyType=function(param){//选择完成申请类型
        $scope.defaultApplyType=param;
        if($scope.defaultApplyType=='项目申请'){
          $scope.showProjectItem=true;
        }else if($scope.defaultApplyType!='项目申请'){
          $scope.showProjectItem=false;
        }
        $scope.chooseTypePopup.hide();
      };

      $scope.finishChoosingRoomType=function(param){//选择完成房间类型
        $scope.defaultRoomType=param;
        $scope.chooseRoomPopup.hide();
      };

      $scope.finishChoosingProjectName=function(num){
        $scope.defaultProjectInfo.projectName=$scope.projectlist[num].project_name;
        $scope.defaultProjectInfo.projectId=$scope.projectlist[num].project_id;
        $scope.chooseProjectPopup.hide();
      };

      $scope.chooseDays=function(){//选择入住天数以及取消入住天数
        if($scope.defaultApplyType=='常驻申请'){
          $scope.showNumButton=!$scope.showNumButton;
        }
      };

      $scope.searchVacantRoom=function(){//查询空闲房间
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
        if($scope.defaultProjectInfo.projectName=='无' && $scope.defaultApplyType=='项目申请'){//项目申请类型，当项目列表为空时，不能查询房间
          hmsPopup.showShortCenterToast('项目列表为空，请更改申请类型');
        }else if( (startYear>endYear) ||((startYear==endYear)&&(startMonth>endMonth)) || ((startYear==endYear)&&(startMonth==endMonth)&&(startDay>endDay))){
          hmsPopup.showShortCenterToast('入住日期不能晚于结束日期');
        }else{
          var url = baseConfig.businessPath + "/api_apply_room/query_free_room_list";
          var param = {
            "params": {
              p_employee_number: window.localStorage.empno,
              p_check_in_date: $scope.startDate.year+"-"+$scope.startDate.month+"-"+$scope.startDate.day,
              p_check_out_date: $scope.endDate.year+"-"+$scope.endDate.month+"-"+$scope.endDate.day,
              p_apply_type: $scope.defaultApplyType,
              p_room_type: $scope.defaultRoomType,
              p_room_number: $scope.inputinfo.roomnum,
              p_floor_number: $scope.inputinfo.floornum,
              p_pro_id:""
            }
          };
          if($scope.defaultApplyType=='项目申请'){
           param.params.p_pro_id=$scope.defaultProjectInfo.projectId;
          }
          hmsPopup.showLoading('请稍候');
          hmsHttp.post(url, param).success(function (result) {
            var message = result.message;
            hmsPopup.hideLoading();
            if (result.status == "S" && result.result.length > 0) {
              var resultlist = result.result;//查询结果列表
              var info = {//要放入到service中的信息
                applyType: param.params.p_apply_type,
                checkinDate: param.params.p_check_in_date,
                checkoutDate: param.params.p_check_out_date,
                result: resultlist
              };
              $state.go("tab.dorm-apply-vacant-room",{
                'dormApplySearchResult':info,
                'projectId':$scope.defaultProjectInfo.projectId,
                'applyType':$scope.defaultApplyType
              });
            } else if (result.status == "E") {
              hmsPopup.showShortCenterToast(message);
            }
            if (baseConfig.debug) {
              console.log("result success " + angular.toJson(result));
            }
          }).error(function (error, status) {
            hmsPopup.hideLoading();
            if (baseConfig.debug) {
              console.log("response error " + angular.toJson(error));
            }
          });
        }
      };
    }]);
