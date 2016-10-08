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
    '$cordovaDatePicker',
    '$timeout',
    'timeOffManageService',
    'HmsDateFormat',
    function ($scope,
              $state,
              $stateParams,
              baseConfig,
              hmsHttp,
              hmsPopup,
              $ionicModal,
              $ionicHistory,
              $cordovaDatePicker,
              $timeout,
              timeOffManageService,
              HmsDateFormat) {

      $scope.isIOSPlatform = ionic.Platform.isIOS();//判断平台,留出iOS的statusBar
      $scope.descriptionFlag = '';
      $scope.timeLeaveFlag = false;
      $scope.pageTitle = '创建休假';
      $scope.readOnly = ''; // 界面是否可以编辑
      $scope.buttonModeClass = 'submit-mode';//submit-mode,revoke-mode,transparent-mode
      $scope.operationTypeMeaning = '';
      $scope.operation = {
        createMode: true,
        revokeMode: false,
        queryMode: false
      };

      //设置界面模式
      var setOperationMode = function (modeType) {
        if (modeType == 'create') {
          $scope.operation.createMode = true;
          $scope.operation.revokeMode = false;
          $scope.operation.queryMode = false;
          $scope.operationTypeMeaning = '提交';
          $scope.readOnly = false;
          $scope.timeOffData.timeOffTypeMeaning = '带薪年假'; //add by senlin 20161008
          $scope.timeOffData.unusedHoliday = $scope.timeOffData.paidHoliday; //add by senlin 20161008
          $scope.pageTitle = '创建休假';
        } else if (modeType == 'revoke') {
          $scope.operation.createMode = false;
          $scope.operation.revokeMode = true;
          $scope.operation.queryMode = false;
          $scope.operationTypeMeaning = '撤回';
          $scope.readOnly = true;
          $scope.pageTitle = '撤回休假';
        } else if (modeType == 'query') {
          $scope.operation.createMode = false;
          $scope.operation.revokeMode = false;
          $scope.operation.queryMode = true;
          $scope.readOnly = true;
          $scope.pageTitle = '休假详情';
        }
      };

      //定义创建休假申请数据结构
      $scope.timeOffData = {
        operationType: '',
        timeOffTypeMeaning: '',
        dateFromMeaning: '',
        dateToMeaning: '',
        unusedPaidHoliday: '',
        unusedPaidSickLeave: '',
        unusedExtPaidHoliday: '',
        unusedHoliday: '',
        timeLeave: '',
        applyReason: ''
      };

      //初始化假期类型数组
      $scope.timeOffTypeRecord = ["带薪年假", "额外福利年假", "事假", "带薪病假", "病假", "婚嫁", "产假", "丧假", "陪产假"];

      $scope.timeOffType = {
        "带薪年假": "100000",
        "额外福利年假": "100060",
        "事假": "100001",
        "带薪病假": "100002",
        "病假": "100020",
        "婚嫁": "100003",
        "产假": "100004",
        "丧假": "100040",
        "陪产假": "100041"
      };

      //记录传入日志
      if (baseConfig.debug) {
        console.log('$stateParams.timeOffData ' + angular.toJson($stateParams.timeOffData));
      }

      //modify by gusenlin 2016-10-08
      var getOffTime = function (startDate, endDate) {
        var mmSec = (endDate.realDate.getTime() - startDate.realDate.getTime());
        return mmSec;
      };

      var getLeaveDays = function () {

        if(baseConfig.debug) {
          console.log('in getLeaveDays $scope.timeOffData.timeOffTypeMeaning ' + $scope.timeOffData.timeOffTypeMeaning);
        }

        if (getOffTime($scope.datetimeFrom, $scope.datetimeTo) > 0) {
          if ($scope.timeOffData.timeOffTypeMeaning && $scope.timeOffData.timeOffTypeMeaning != '') {
            var policyitemId = $scope.timeOffType[$scope.timeOffData.timeOffTypeMeaning];
            var start = HmsDateFormat.getDateTimeString($scope.datetimeFrom.realDate);
            var end = HmsDateFormat.getDateTimeString($scope.datetimeTo.realDate);

            if(baseConfig.debug){
              console.log('in getLeaveDays policyitemId ' + policyitemId);
              console.log('in getLeaveDays start ' + start);
              console.log('in getLeaveDays end ' + end);
            }
            timeOffManageService.getLeaveDays($scope, policyitemId, start, end);
          }
        } else {
          $scope.timeOffData.timeLeave = 0;
        }
      };

      //init data
      {
        $scope.timeOffData = $stateParams.timeOffData;
        //create,revoke,update,query
        //当前还不支持草稿类型,所以不存在update操作
        setOperationMode($scope.timeOffData.operationType);

        //设置初始化时间
        var todayDate = new Date();//今天日期
        var month = todayDate.getMonth() + 1;
        var day = todayDate.getDate();
        $scope.datetimeFrom = {//开始日期
          realDate: new Date(),
          year: todayDate.getFullYear(),
          month: "",
          day: ""
        };
        $scope.datetimeTo = {//结束日期
          realDate: new Date(),
          year: "",
          month: "",
          day: ""
        };

        if (month < 10) {
          month = "0" + month;
        }
        if (day < 10) {
          day = "0" + day;
        }
        $scope.datetimeFrom.month = month;
        $scope.datetimeFrom.day = day;

        var myDate = $scope.datetimeFrom;
        $scope.datetimeFrom.realDate = new Date(myDate.year, myDate.month - 1, myDate.day, '08', '30', '00');

        //初始化结束时间
        refreshEndDate(1);

        if($scope.timeOffData.operationType == 'create'){
          getLeaveDays();
        }
      }


      $scope.getdateFromMeaning = function () {
        if ($scope.readOnly) { // add by ciwei 只读模式下,直接读取列表信息
          return $scope.timeOffData.datetimeFrom;
        } else {
          return HmsDateFormat.getDateTimeString($scope.datetimeFrom.realDate);
          //$scope.datetimeFrom.year + '-' + $scope.datetimeFrom.month + '-' + $scope.datetimeFrom.day + ' 08:30:00';
        }

      };

      $scope.getdateToMeaning = function () {
        if ($scope.readOnly) { // add by ciwei 只读模式下,直接读取列表信息
          return $scope.timeOffData.datetimeTo;
        } else {
          return HmsDateFormat.getDateTimeString($scope.datetimeTo.realDate);
          //return $scope.datetimeTo.year + '-' + $scope.datetimeTo.month + '-' + $scope.datetimeTo.day + ' 18:00:00';
        }
      };

      //初始化假期类型弹窗
      $ionicModal.fromTemplateUrl('build/pages/application/time-off-manage/modal/new-time-off-type.html', {
        scope: $scope
      }).then(function (modal1) {
        $scope.timeOffTypePopup = modal1;
      });


      //显示假期类型
      $scope.selectTimeOffType = function () {

        if ($scope.readOnly) {
          return;
        }

        $scope.timeOffTypePopup.show();
      };
      //假期类型结束事件
      $scope.timeOffTypeSelected = function (param) {
        $scope.timeOffData.timeOffTypeMeaning = param;

        //将当前剩余假期设置为所选假期,此处如果PC和app并发存在脏数据可能
        //需要在服务器生成休假记录时进行二次校验
        if ($scope.timeOffData.timeOffTypeMeaning == '带薪年假') {
          $scope.timeOffData.unusedHoliday = $scope.timeOffData.paidHoliday;
        } else if ($scope.timeOffData.timeOffTypeMeaning == '带薪病假') {
          $scope.timeOffData.unusedHoliday = $scope.timeOffData.paidSickLeave;
        } else if ($scope.timeOffData.timeOffTypeMeaning == '额外福利年假') {
          $scope.timeOffData.unusedHoliday = $scope.timeOffData.extPaidHoliday;
        } else {
          $scope.timeOffData.unusedHoliday = '0';
        }
        $scope.timeOffTypePopup.hide();
        $timeout(function () {
          getLeaveDays();
        },200);
      };

      //假期说明信息
      $scope.showDescription = function () {
        $scope.descriptionFlag = true;
      };
      $scope.hideDescription = function () {
        $scope.descriptionFlag = false;
      };


      $scope.chooseStartDate = function () {//选择开始日期

        if ($scope.readOnly) {
          return;
        }

        var myDate = $scope.datetimeFrom.realDate;

        //var previousDate = new Date(myDate.year, myDate.month - 1, myDate.day);
        var options = {
          date: myDate,
          mode: 'datetime',
          titleText: '请选择开始日期',
          okText: '确定',
          cancelText: '取消',
          doneButtonLabel: '确认',
          cancelButtonLabel: '取消',
          androidTheme: window.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK,
          locale: "zh_cn"
        };
        $cordovaDatePicker.show(options).then(function (date) {
          var month = date.getMonth() + 1;
          var day = date.getDate();

          if (month < 10) {
            month = "0" + month;
          }
          if (day < 10) {
            day = "0" + day;
          }
          $scope.datetimeFrom.year = date.getFullYear();
          $scope.datetimeFrom.month = month;
          $scope.datetimeFrom.day = day;
          $scope.datetimeFrom.realDate = date;

          //$scope.$apply();
          getLeaveDays();

          /*var offDays = getOffDays($scope.datetimeFrom, $scope.datetimeTo) + 1;
           if (offDays > 0) {
           $scope.timeOffData.timeLeave = offDays;
           } else {
           $scope.timeOffData.timeLeave = '';
           }*/
        });
      };

      $scope.chooseEndDate = function () {//选择结束

        if ($scope.readOnly) {
          return;
        }

        var myDate = $scope.datetimeTo.realDate;
        //var previousDate = new Date(myDate.year, myDate.month - 1, myDate.day);
        var options = {
          date: myDate,
          mode: 'datetime',
          titleText: '请选择结束日期',
          okText: '确定',
          cancelText: '取消',
          doneButtonLabel: '确认',
          cancelButtonLabel: '取消',
          androidTheme: window.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK,
          locale: "zh_cn"
        };
        $cordovaDatePicker.show(options).then(function (date) {
          var month = date.getMonth() + 1;
          var day = date.getDate();

          if (month < 10) {
            month = "0" + month;
          }
          if (day < 10) {
            day = "0" + day;
          }
          $scope.datetimeTo.year = date.getFullYear();
          $scope.datetimeTo.month = month;
          $scope.datetimeTo.day = day;
          $scope.datetimeTo.realDate = date;

          //$scope.$apply();
          getLeaveDays();
          /*var offDays = getOffDays($scope.datetimeFrom, $scope.datetimeTo) + 1;

           if (offDays > 0) {
           $scope.timeOffData.timeLeave = offDays;
           } else {
           $scope.timeOffData.timeLeave = '';
           }*/


        });
      };

      function refreshEndDate(num) {
        var myDate = $scope.datetimeFrom;
        var todayDate = new Date(myDate.year, myDate.month - 1, myDate.day);
        var tomorrowDate = new Date(myDate.year, myDate.month - 1, myDate.day);

        num = parseInt(num);
        tomorrowDate.setDate(todayDate.getDate() + num);
        tomorrowYear = tomorrowDate.getFullYear();
        tomorrowDay = tomorrowDate.getDate();
        tomorrowMonth = tomorrowDate.getMonth() + 1;

        if (tomorrowMonth < 10) {
          tomorrowMonth = "0" + tomorrowMonth;
        }
        if (tomorrowDay < 10) {
          tomorrowDay = "0" + tomorrowDay;
        }
        $scope.datetimeTo.year = tomorrowYear;
        $scope.datetimeTo.month = tomorrowMonth;
        $scope.datetimeTo.day = tomorrowDay;

        var myDate = $scope.datetimeTo;
        $scope.datetimeTo.realDate = new Date(myDate.year, myDate.month - 1, myDate.day, '18', '00', '00');

      };
      //创建休假申请
      $scope.submitTimeOff = function () {

        var requestUrl = '';
        var requestParams = {};

        if ($scope.timeOffData.timeOffTypeMeaning == '' ||
          $scope.getdateFromMeaning() == '' ||
          $scope.getdateToMeaning() == ''
        ) {
          hmsPopup.showPopup('请填写必要的申请信息!');
          return;
        }

        //if ($scope.timeOffData.timeLeave == '' || parseInt($scope.timeOffData.timeLeave <=0)) {
        //  hmsPopup.showPopup('请输出正确的休假区间!!');
        //  return;
        //}

        //--add by senlin 20161008
        var offDays = getOffTime($scope.datetimeFrom, $scope.datetimeTo);
        if (offDays < 0) {
          hmsPopup.showPopup('起始时间不能小于结束时间');
          return;
        }

        /*if ($scope.timeOffData.unusedHoliday &&
         $scope.timeOffData.timeOffTypeMeaning == '带薪年假' &&
         offDays > $scope.timeOffData.unusedHoliday) {
         hmsPopup.showPopup('申请带薪年假不能超过本年度可用年假');
         return;
         }*/
        //--add by senlin 20161008

        if ($scope.timeOffData.timeOffTypeMeaning == '带薪病假' && $scope.timeOffData.timeLeave > 1) {
          hmsPopup.showPopup('超过1天的病假需要上传三甲医院证明,请从PC端进行提交');
          return;
        }

        if ($scope.operation.createMode) {

          requestUrl = baseConfig.businessPath + "/api_holiday/submit_holiday_apply";
          requestParams = {
            "params": {
              "p_employeecode": window.localStorage.empno,
              "p_timeofftypemeaning": $scope.timeOffData.timeOffTypeMeaning,
              "p_datetimefrom": $scope.getdateFromMeaning(),
              "p_datetimeto": $scope.getdateToMeaning(),
              "p_timeleave": '',//$scope.timeOffData.timeLeave
              "p_applyreason": $scope.timeOffData.applyReason
            }
          };

        } else if ($scope.operation.revokeMode) {

          requestUrl = baseConfig.businessPath + "/api_holiday/get_holiday_apply_back";
          requestParams = {
            "params": {
              "p_employee_code": window.localStorage.empno,
              "p_timeoffid": $scope.timeOffData.timeOffId
            }
          }
        }

        //记录调用日志参数
        if (baseConfig.debug) {
          console.log('requestParams ' + angular.toJson(requestParams));
        }
        hmsPopup.showLoading("处理休假申请中");
        hmsHttp.post(requestUrl, requestParams).success(function (response) {
          hmsPopup.hideLoading();
          if (hmsHttp.isSuccessfull(response.status)) {

            //跳转回列表界面
            timeOffManageService.setRefreshTimeOffList(true);
            $ionicHistory.goBack();

          } else {
            if (response.status === 'E' || response.status == 'e') {
              hmsPopup.showShortCenterToast("处理休假申请出错!请检查相关数据！" /*+ response.errorMsg*/);
            } else {
              hmsPopup.showShortCenterToast("网络异常,请稍后重试!");
            }
          }
        }).error(function (response, status) {
          hmsPopup.hideLoading();
        });
      }

    }]);
