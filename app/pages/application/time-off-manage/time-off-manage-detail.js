/** Author      : joshua.shi
 *
 *  History:
 *      1.00    2016-7-05   joshua.shi   Creation
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.time-off-manage-detail', {
          url: '/time-off-manage',
          params: {timeOffData: {}},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/time-off-manage/time-off-manage-detail.html',
              controller: 'TimeOffManageDetailCtrl',
            }
          }
        })
    }]);

angular.module('applicationModule')

  .controller('TimeOffManageDetailCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    '$ionicModal',
    '$ionicHistory',
    function ($scope,
              $state,
              $stateParams,
              baseConfig,
              hmsHttp,
              hmsPopup,
              $ionicModal,
              $ionicHistory) {

      $scope.isIOSPlatform        = ionic.Platform.isIOS();//判断平台,留出iOS的statusBar
      $scope.descriptionFlag      = '';
      $scope.readOnly             = ''; // 界面是否可以编辑
      $scope.buttonModeClass      = 'submit-mode';//submit-mode,revoke-mode,transparent-mode
      $scope.operationTypeMeaning = '';
      $scope.operation  = {
        createMode : true,
        revokeMode : false,
        queryMode  : false
      };

      //设置界面模式
      var setOperationMode = function(modeType) {
        if (modeType =='create') {
          $scope.operation.createMode = true;
          $scope.operation.revokeMode = false;
          $scope.operation.queryMode  = false;
          $scope.operationTypeMeaning = '提交';
          $scope.readOnly = false;
        } else if (modeType =='revoke') {
          $scope.operation.createMode = false;
          $scope.operation.revokeMode = true;
          $scope.operation.queryMode  = false;
          $scope.operationTypeMeaning = '撤回';
          $scope.readOnly = true;
        } else if (modeType =='query') {
          $scope.operation.createMode = false;
          $scope.operation.revokeMode = false;
          $scope.operation.queryMode  = true;
          $scope.readOnly = true;
        }
      };

      //定义创建休假申请数据结构
      $scope.timeOffData = {
        operationType        : '',
        timeOffTypeMeaning   : '',
        datetimeFrom         : '',
        datetimeTo           : '',
        unusedPaidHoliday    : '',
        unusedPaidSickLeave  : '',
        unusedExtPaidHoliday : '',
        unusedHoliday        : '',
        timeLeave            : '',
        applyReason          : ''
      };

      //初始化假期类型数组
      $scope.timeOffTypeRecord=["带薪年假","额外福利年假","事假","带薪病假","病假","婚嫁","产假","丧假","陪产假"];

      //记录传入日志
      if (baseConfig.debug) {
        console.log('$stateParams.timeOffData ' + angular.toJson($stateParams.timeOffData));
      }


      //init data
      {
        $scope.timeOffData = $stateParams.timeOffData;

        //create,revoke,update,query
        //当前还不支持草稿类型,所以不存在update操作
        setOperationMode($scope.timeOffData.operationType);

      }

      //初始化假期类型弹窗
      $ionicModal.fromTemplateUrl('build/pages/application/time-off-manage/modal/new-time-off-type.html', {
        scope: $scope
      }).then(function (modal1) {
        $scope.timeOffTypePopup = modal1;
      });


      //显示假期类型
      $scope.selectTimeOffType = function(){

        if ($scope.readOnly) {
          return;
        }

        $scope.timeOffTypePopup.show();
      };
      //假期类型结束事件
      $scope.timeOffTypeSelected = function(param){
        $scope.timeOffData.timeOffTypeMeaning = param;

        //将当前剩余假期设置为所选假期,此处如果PC和app并发存在脏数据可能
        //需要在服务器生成休假记录时进行二次校验
        if ($scope.timeOffData.timeOffTypeMeaning == '带薪年假') {
          $scope.timeOffData.unusedHoliday = $scope.timeOffData.paidHoliday;
        } else if ($scope.timeOffData.timeOffTypeMeaning == '带薪病假') {
          $scope.timeOffData.unusedHoliday = $scope.timeOffData.paidSickLeave;
        } else if ($scope.timeOffData.timeOffTypeMeaning == '额外福利年假') {
          $scope.timeOffData.unusedHoliday =  $scope.timeOffData.extPaidHoliday;
        } else {
          $scope.timeOffData.unusedHoliday = '0';
        }
        $scope.timeOffTypePopup.hide();
      };

      //假期说明信息
      $scope.showDescription = function () {
        $scope.descriptionFlag = true;
      };
      $scope.hideDescription = function () {
        $scope.descriptionFlag = false;
      };

      $scope.chooseStartDate = function(){//选择开始日期

        if ($scope.readOnly) {
          return;
        }

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
          if(month < 10){
            month="0"+month;
          }
          if(day < 10){
            day="0"+day;
          }
          $scope.startDate.year=date.getFullYear();
          $scope.startDate.month=month;
          $scope.startDate.day=day;
          $scope.$apply();
        });
      };

      $scope.chooseEndDate = function() {//选择结束

        if ($scope.readOnly) {
          return;
        }

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
        };
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

      //创建休假申请
      $scope.submitTimeOff = function () {

        var requestUrl    = '';
        var requestParams = {};

        if ($scope.timeOffData.timeOffTypeMeaning == '' ||
            $scope.timeOffData.datetimeFrom == '' ||
            $scope.timeOffData.datetimeTo == ''
        ) {
          hmsPopup.showPopup('请填写必要的申请信息!');
          return;
        }

        if ($scope.timeOffData.timeOffTypeMeaning == '带薪病假' && $scope.timeOffData.timeLeave > 1) {
          hmsPopup.showPopup('超过1天的病假需要上传三甲医院证明,请从PC端进行提交');
          return;
        }

        if ($scope.operation.createMode) {

          requestUrl = baseConfig.businessPath + "/api_holiday/submit_holiday_apply";
          requestParams = {
            "params": {
              "p_employeecode"     : window.localStorage.empno,
              "timeOffTypeMeaning" : $scope.timeOffData.timeOffTypeMeaning,
              "p_datetimefrom"     : $scope.timeOffData.datetimeFrom,
              "p_datetimeto"       : $scope.timeOffData.datetimeTo,
              "p_timeleave"        : $scope.timeOffData.timeLeave,
              "p_applyreason"      : $scope.timeOffData.applyReason
            }
          };

        } else if ($scope.operation.revokeMode) {

          requestUrl = baseConfig.businessPath + "/api_holiday/get_holiday_apply_back";
          requestParams = {
              "params": {
                "p_employee_code": window.localStorage.empno,
                "p_timeoffid"    : $scope.timeOffData.timeOffId
                }
          }
        }

        hmsHttp.post(requestUrl, requestParams).success(function (response) {
          hmsPopup.hideLoading();
          if (hmsHttp.isSuccessfull(response.status)) {

          } else {
            if (response.status === 'E' || response.status == 'e') {
              hmsPopup.showShortCenterToast("没有相关数据!");
            } else {
              hmsPopup.showShortCenterToast("网络异常,请稍后重试!");
            }
          }
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast("服务请求异常,请检查网络连接和输入参数后重新操作!");
        });
      }

    }]);
