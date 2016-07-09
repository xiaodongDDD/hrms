/**
 * Created by gusenlin on 16/5/22.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.timesheet', {
          url: '/timesheet',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/timesheet/query/query.html',
              controller: 'TimeSheetQueryCtrl'
            }
          }
        });
      $stateProvider
        .state('tab.workflow-message', {
          url: '/workflow-message',
          views: {
            'tab-message': {
              templateUrl: 'build/pages/application/timesheet/query/query.html',
              controller: 'TimeSheetQueryCtrl'
            }
          }
        });
    }]);

angular.module('applicationModule')
  .controller('TimeSheetQueryCtrl', [
    '$scope',
    '$rootScope',
    '$ionicPopover',
    '$ionicGesture',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$timeout',
    '$ionicScrollDelegate',
    'TimeSheetService',
    'hmsHttp',
    'hmsPopup',
    function ($scope,
              $rootScope,
              $ionicPopover,
              $ionicGesture,
              $state,
              baseConfig,
              $ionicHistory,
              $timeout,
              $ionicScrollDelegate,
              TimeSheetService,
              hmsHttp,
              hmsPopup) {

      var currentTimeSheetPosition = true;
      var isScrollFreeze;
      $scope.calendar = [];
      $scope.loadingDataFlag = true;
      $scope.loadingAllowanceFlag = true;
      $scope.exitQuery = false;

      $scope.allowanceList = [];
      $scope.selectYearList = [];


      var offset = -5;
      var yearCount = 10;

      var startTouchX = 0;
      var startTouchY = 0;


      var timesheetTitle = 'Timesheet';
      var unfreezeTitle = 'Timesheet解冻';
      var batchWriteMode = 'batchWriteMode';
      var unfreezeMode = 'unfreezeMode';
      var slippingMode = 'batchWriteMode';

      $scope.timesheetProcessModeList = [
        {
          "selected": true,
          "value": timesheetTitle
        },
        {
          "selected": false,
          "value": unfreezeTitle
        }
      ];
      $scope.timesheetProcessMode = timesheetTitle;
      $scope.slippingFlag = false;
      $scope.slippingEnableFlag = true;
      $scope.startSlippingFlag = false;

      var clientWidth = document.body.clientWidth;

      var calendarTopBar;

      if (ionic.Platform.isIOS()) {
        calendarTopBar = 135;//+ 20;
      }
      else {
        calendarTopBar = 135;
      }

      var scrollPosition = 0;
      var startTime;
      var toTime;
      var cacheCalendar = [];
      var copyFromDay = {};

      //年表
      $scope.currentYear = '';
      //当前月份
      $scope.currentMonth = '';
      //月份初始化列表
      $scope.monthList = [
        {"selected": false, value: "1"}, {"selected": false, value: "2"}, {"selected": false, value: "3"},
        {"selected": false, value: "4"}, {"selected": false, value: "5"}, {"selected": false, value: "6"},
        {"selected": false, value: "7"}, {"selected": false, value: "8"}, {"selected": false, value: "9"},
        {"selected": false, value: "10"}, {"selected": false, value: "11"}, {"selected": false, value: "12"}
      ];
      //周列表
      $scope.weekTitleList = [
        '日', '一', '二', '三', '四', '五', '六'
      ];

      if (baseConfig.debug) {
        console.log('TimeSheetQueryCtrl.clientWidth ' + clientWidth);
      }


      var timesheetMonthFunc = {
        scrollToFixPosition: function (month, screenWidth) {
          var monthScroll = $ionicScrollDelegate.$getByHandle('timeSheetMonthHandle').getScrollPosition();
          var xOffset;
          try {
            if (60 * (parseInt(month) - 0.5) > (parseInt(screenWidth) / 2)) {
              xOffset = 60 * (parseInt(month) - 0.5) - (parseInt(screenWidth) / 2);
            } else {
              xOffset = 0;
            }
            if (baseConfig.debug) {
              console.log(monthScroll);
              console.log('month ' + month);
              console.log('clientWidth ' + clientWidth);
              console.log('xOffset ' + xOffset);
            }
            var monthScroll1 = $ionicScrollDelegate.$getByHandle('timeSheetMonthHandle').scrollTo(xOffset, 0, true);
            if (baseConfig.debug) {
              console.log(monthScroll1);
            }
          } catch (e) {

          }
        },
        more: function () {
        }
      };

      //单格数字用0填充
      var formatMonth = function (month) {
        if (parseInt(month) < 10) {
          return '0' + month;
        } else {
          return '' + month;
        }
      };

      //初始化日历
      var initDate = function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        $scope.currentYear = year;
        $scope.currentMonth = month;
        angular.forEach($scope.monthList, function (data) {
          if (data.value === month + '') {
            data.selected = true;
            return;
          }
        });

        timesheetMonthFunc.scrollToFixPosition(month, clientWidth);

        for (var i = 0; i < yearCount; i++) {
          var value = (parseInt(year) + offset + i) + '';
          var item = {};
          if (year == value) {
            item = {
              "value": value,
              "selected": true
            }
          } else {
            item = {
              "value": value,
              "selected": false
            }
          }
          $scope.selectYearList.push(item);
        }

        if (baseConfig.debug) {
          console.log('initDate.year ' + year);
          console.log('initDate.month ' + month)
        }
        var monthParams = year + '' + formatMonth(month);
        fetchCalendar(monthParams);
        generateAllowance(monthParams);
      }

      //初始化日历数组
      var initCalendar = function () {
        $scope.calendar = [];
        for (i = 0; i < 5; i++) {
          var style_outline = 'each-day';
          var style_color = 'day-item';
          var money = '';
          var project = '';
          var week = {
            week: i,
            list: []
          };
          for (j = 0; j < 7; j++) {
            var item = {
              day: "",
              style_outline: style_outline,
              style_color: style_color,
              money: money,
              project: project
            };
            week.list.push(item);
          }
          $scope.calendar.push(week);
        }
      };

      $ionicPopover.fromTemplateUrl('build/pages/application/timesheet/popover/timesheet-mode.html', {
        scope: $scope,
      }).then(function (popover) {
        $scope.timesheetPopover = popover;
      });

      $scope.selectMode = function (mode) {
        $scope.timesheetProcessModeList[0].selected = false;
        $scope.timesheetProcessModeList[1].selected = false;
        if (mode.selected) {
          mode.selected = false;
        } else {
          mode.selected = true;
        }
        if ($scope.timesheetProcessModeList[1].selected) {
          slippingMode = unfreezeMode;
        } else {
          slippingMode = batchWriteMode;
        }
        $scope.timesheetProcessMode = mode.value;
        $scope.timesheetPopover.hide();
      }

      $scope.openTimesheetMode = function ($event) {
        $scope.timesheetPopover.show($event);
      };


      $ionicPopover.fromTemplateUrl('build/pages/application/timesheet/popover/years.html', {
        scope: $scope,
        animation: 'animated fadeIn'
      }).then(function (popover) {
        $scope.popover = popover;
      });

      $scope.openPopover = function ($event) {
        $scope.popover.show($event);
      };

      $scope.selectYear = function (year) {
        $scope.currentYear = year.value;
        $scope.popover.hide();
        var monthParams = $scope.currentYear + '' + formatMonth($scope.currentMonth);

        angular.forEach($scope.selectYearList, function (data) {
          if (data.value == year.value) {
            data.selected = true;
          } else {
            data.selected = false;
          }
        });
        initCalendar();
        fetchCalendar(monthParams);
        generateAllowance(monthParams);
      }

      $scope.writeTimesheet = function (day) {
        if (day.day && day.day !== "") {
          $state.go('tab.timesheet-write', {day: day});
        }
      };

      $scope.processAllowance = function () {
        var title = "确定是否生成津贴?";
        if ($scope.allowanceList.length > 0) {
          if ($scope.allowanceList[0].status == '已经审核') {
            hmsPopup.showPopup('你的津贴已经审核,不能再生成津贴!');
            return;
          }
          title = "你已经生成津贴,要否重新生成津贴?";
        }
        var create = function (buttonIndex) {
          if (baseConfig.debug) {
            console.log('You selected button ' + buttonIndex);
          }
          if (buttonIndex == 1) {
            createAllowance($scope.currentYear, $scope.currentMonth);
          } else {
            clearCalendarCache();
          }
        }
        hmsPopup.confirm(title, "生成津贴", create);
      };

      var fetchData = function (result) {
        var timesheetArray = result.timesheet;
        var seq = 0;
        $scope.calendar = [];
        for (i = 0; i < 5; i++) {
          var week = {
            week: i,
            list: []
          };
          for (j = 0; j < 7; j++) {
            var item;
            var style_outline = 'each-day';
            var style_color = 'day-item';
            var money = '';
            var project = '';
            var lockFlag = false;

            if (timesheetArray[seq]) {
              if (timesheetArray[seq].lockflag == '0') {
                lockFlag = false;
              } else {
                lockFlag = true;
              }
              if (timesheetArray[seq].status == 'Empty') {
                style_outline = 'each-day';
                style_color = 'day-item';
              } else if (timesheetArray[seq].status == 'Draft') {
                style_outline = 'each-day attendance';
                style_color = 'day-item attendance';
              } else if (timesheetArray[seq].status == 'Approved') {
                style_outline = 'each-day approve';
                style_color = 'day-item approve';
              } else if (timesheetArray[seq].status == 'Rejected') {
                style_outline = 'each-day reject';
                style_color = 'day-item reject';
              }
              var dayEach = timesheetArray[seq].day;
              if (parseInt(dayEach) < 10) {
                dayEach = dayEach.replace('0', '');
              }
              item = {
                day: dayEach,
                style_outline: style_outline,
                style_color: style_color,
                money: timesheetArray[seq].allowance,
                project: timesheetArray[seq].proj,
                each_day: timesheetArray[seq].each_day,
                lockFlag: lockFlag,
                choosed: false
              };
            } else {
              item = {
                day: '',
                style_outline: style_outline,
                style_color: style_color,
                money: money,
                project: project,
                each_day: '',
                lockFlag: lockFlag,
                choosed: false
              };
            }

            week.list.push(item);

            seq = seq + 1;
          }
          $scope.calendar.push(week);
        }
      };

      var fetchCalendar = function (monthParams) {
        $scope.loadingDataFlag = true;

        var url = baseConfig.businessPath + "/timesheet_process/fetch_calendar";
        var params = {
          "params": {
            "p_employee": window.localStorage.empno,
            "p_month": monthParams + "",
            "p_offset": 0
          }
        };

        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          if (result.status == 'S') {
            fetchData(result);
            $scope.loadingDataFlag = false;
          }
        }).error(function (response, status) {
          $scope.loadingDataFlag = false;
        });
      };

      var element = angular.element(document.querySelector('#timesheetCalandar'));

      var startSlipping = function () {
        $scope.slippingFlag = true;
        $ionicScrollDelegate.$getByHandle('timeSheetHandle').freezeScroll(true);
        scrollPosition = $ionicScrollDelegate.$getByHandle('timeSheetHandle').getScrollPosition().top;
      };
      var stopSlipping = function () {
        $scope.slippingFlag = false;
        $scope.startSlippingFlag = false;
        $ionicScrollDelegate.$getByHandle('timeSheetHandle').freezeScroll(false);
      };

      var clearCalendarCache = function () {
        angular.forEach($scope.calendar, function (data) {
          angular.forEach(data.list, function (list) {
            list.choosed = false;
          });
        });
        if (baseConfig.nativeScreenFlag) {
          $scope.$apply();
        }
      };

      var slippingWriteTimesheet = function () {
        //var batchList = [];
        var dateArray = '';
        angular.forEach($scope.calendar, function (data) {
          angular.forEach(data.list, function (list) {
            if (list.choosed) {
              //batchList.push({"day": list.each_day});
              if (dateArray == '') {
                dateArray = dateArray + list.each_day;
              } else {
                dateArray = dateArray + '#' + list.each_day;
              }
            }
          });
        });
        if (baseConfig.debug) {
          console.log('copyFromDay ' + angular.toJson(copyFromDay));
          console.log('dateArray ' + angular.toJson(dateArray));
        }

        var success = function (result) {
          hmsPopup.hideLoading();
          if (result.status == 'S') {
            hmsPopup.showPopup('批量填写成功!');
            var timesheetArray = result.refresh_timesheet;
            fetchData(timesheetArray);
          } else {
            hmsPopup.showPopup('批量填写失败!' + result.message);
          }
        };
        var error = function (response) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('批量填写失败,可能是网络问题!');
          clearCalendarCache();
        };
        hmsPopup.showLoading('批量填写中');
        TimeSheetService.slippingBatch(success, error, copyFromDay.day, dateArray);
      };

      var getUnfreezeDateRange = function () {
        var dateFrom = '';
        var dateTo = '';
        var dateArray = '';
        var minDate = 0;
        var maxDate = 10000000000000;

        angular.forEach($scope.calendar, function (data) {
          angular.forEach(data.list, function (list) {
            if (list.choosed) {
              //batchList.push({"day": list.each_day});
              if (dateArray == '') {
                dateArray = dateArray + list.each_day;
              } else {
                dateArray = dateArray + '#' + list.each_day;
              }
              if (minDate == 0 || parseInt(list.each_day) < minDate) {
                minDate = parseInt(list.each_day);
              }
              if (maxDate == 10000000000000 || parseInt(list.each_day) > maxDate) {
                maxDate = parseInt(list.each_day);
              }
            }
          });
        });
        var changeDateFormat = function (dateString) {
          var year;
          var month;
          var day;
          if (baseConfig.debug) {
            console.log('dateString.length ' + dateString.length);
          }
          if (dateString.length == 8) {

            year = dateString.substring(0, 4);
            month = dateString.substring(4, 6);
            day = dateString.substring(6, 8);
          } else {
            return '';
          }
          return day = year + '-' + month + '-' + day;
        };

        dateFrom = changeDateFormat(minDate + '');
        dateTo = changeDateFormat(maxDate + '');

        return {
          "dateFrom": dateFrom,
          "dateTo": dateTo
        }
      }

      //批量解冻Timesheet
      var slippingUnfreezeTimesheet = function (dateRange) {

        if (baseConfig.debug) {
          console.log('dateFrom ' + dateRange.dateFrom);
          console.log('dateTo ' + dateRange.dateTo);
        }

        var success = function (result) {
          hmsPopup.hideLoading();
          if (result.returnCode == 'S') {
            hmsPopup.showPopup('解冻Timesheet申请成功,请查看个人申请!');
          } else {
            hmsPopup.showPopup('解冻Timesheet失败!' + result.returnMsg);
          }
        };

        var error = function (response) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('解冻Timesheet失败,可能是网络问题!');
          clearCalendarCache();
        };
        hmsPopup.showLoading('解冻Timesheet中');
        TimeSheetService.unfreezeTimesheet(success, error, dateRange.dateFrom, dateRange.dateTo);
      };

      //捕获触摸的
      var markSelectCalendar = function (clentW, touchX, touchY) {
        var selectX = -1;
        var selectY = -1;
        var averageX = (clentW - 20) / 7;
        var averageY = 60;
        var lengthY = calendarTopBar - scrollPosition;
        var offsetY = 0;
        var offsetX = 10;
        for (var i = 0; i < 7; i++) {
          var left = averageX * ( i ) + offsetX;
          var right = averageX * ( i + 1 ) + offsetX;
          if (touchX > left && touchX < right) {
            selectX = i;
            if ((touchY >= (lengthY + 0 + offsetY)) && (touchY <= lengthY + 1 * averageY - offsetY)) {
              selectY = 0;
            }
            else if ((touchY >= lengthY + 1 * averageY + offsetY) && (touchY <= lengthY + 2 * averageY - offsetY)) {
              selectY = 1;
            }
            else if ((touchY >= lengthY + 2 * averageY + offsetY) && (touchY <= lengthY + 3 * averageY - offsetY)) {
              selectY = 2;
            }
            else if ((touchY >= lengthY + 3 * averageY + offsetY) && (touchY <= lengthY + 4 * averageY - offsetY)) {
              selectY = 3;
            }
            else if ((touchY >= lengthY + 4 * averageY + offsetY) && (touchY <= lengthY + 5 * averageY - offsetY)) {
              selectY = 4;
            }
            else if ((touchY >= lengthY + 5 * averageY + offsetY) && (touchY <= lengthY + 6 * averageY - offsetY)) {
              selectY = 5;
            }
          }
        }
        return {
          "selectX": selectX,
          "selectY": selectY
        };
      };

      //拖拽标记TimeSheet具体天
      $ionicGesture.on("drag", function (e) {
        //console.log('drag.startTouchX ' + e.gesture.touches[0].pageX);
        //console.log('drag.startTouchY ' + e.gesture.touches[0].pageY);
        if ($scope.startSlippingFlag && !$scope.slippingFlag && $scope.slippingEnableFlag && !$scope.exitQuery) {
          if (Math.abs(startTouchX - e.gesture.touches[0].pageX) > 3 || Math.abs(startTouchY - e.gesture.touches[0].pageY) > 3) {
            toTime = new Date().getTime();
            if (baseConfig.debug) {
              console.log('startTime ' + startTime);
              console.log('toTime ' + toTime);
            }
            startSlipping();
            /*if ((toTime - startTime) > 250) {
             startSlipping();
             }*/
          }
        }
        if ($scope.startSlippingFlag && $scope.slippingFlag && $scope.slippingEnableFlag && !$scope.exitQuery) {
          var selectDay = markSelectCalendar(clientWidth,
            e.gesture.touches[0].pageX,
            e.gesture.touches[0].pageY);
          if (baseConfig.debug) {
            //console.log('drag.selectDay ' + angular.toJson(selectDay));
          }
          if (selectDay.selectX >= 0 && selectDay.selectX <= 6 && selectDay.selectY >= 0 && selectDay.selectY <= 5) {
            var dayItem = $scope.calendar[selectDay.selectY].list[selectDay.selectX];
            if (copyFromDay.day) {

            } else {
              copyFromDay.day = dayItem.each_day;
            }
            if (dayItem && dayItem.day != '') {
              dayItem.choosed = true;
            } else {
              dayItem.choosed = false;
            }
          }
          $scope.$apply();
        }
      }, element);

      $ionicGesture.on("touch", function (e) {
        copyFromDay = {};
        $ionicScrollDelegate.$getByHandle('timeSheetHandle').freezeScroll(true);
        $scope.startSlippingFlag = true;
        if ($scope.slippingFlag && $scope.slippingEnableFlag && !$scope.exitQuery) {
          var position = $ionicScrollDelegate.$getByHandle('timeSheetHandle').getScrollPosition();
          if (baseConfig.debug) {
            console.log('touch.startTouchX ' + e.gesture.touches[0].pageX);
            console.log('touch.startTouchY ' + e.gesture.touches[0].pageY);
            console.log('position ' + angular.toJson(position));
          }
          startTouchX = e.gesture.touches[0].pageX;
          startTouchY = e.gesture.touches[0].pageY;
          startTime = new Date().getTime();
        }
      }, element);

      $ionicGesture.on("release", function (e) {
        $ionicScrollDelegate.$getByHandle('timeSheetHandle').freezeScroll(false);
        if ($scope.startSlippingFlag && $scope.slippingFlag && $scope.slippingEnableFlag && !$scope.exitQuery) {
          //console.log('release.startTouchX ' + e.gesture.touches[0].pageX);
          //console.log('release.startTouchY ' + e.gesture.touches[0].pageY);
          if (slippingMode == unfreezeMode) {
            stopSlipping();
            doUnfreezeTimesheet();
          } else {
            stopSlipping();
            doBatchWrite();
          }
        }
      }, element);


      var doBatchWrite = function () {
        var summitOrder = function (buttonIndex) {
          if (baseConfig.debug) {
            console.log('You selected button ' + buttonIndex);
          }
          if (buttonIndex == 1) {
            slippingWriteTimesheet();
          } else {
            clearCalendarCache();
          }
        }
        hmsPopup.confirm("确定要否进行批量填写?", "", summitOrder);
      };

      var doUnfreezeTimesheet = function () {
        var dateRange = getUnfreezeDateRange();

        if (dateRange.dateFrom == '' || dateRange.dateTo == '') {
          hmsPopup.showPopup('解冻Timesheet时候,字符串解析失败 ' + minDate);
          return;
        }

        var unfreeze = function (buttonIndex) {
          if (baseConfig.debug) {
            console.log('You selected button ' + buttonIndex);
          }
          if (buttonIndex == 1) {
            slippingUnfreezeTimesheet(dateRange);
            clearCalendarCache();
          } else {
            clearCalendarCache();
          }
        }
        hmsPopup.confirm('确定要否解冻Timesheet 期间范围为(' +
          dateRange.dateFrom + '~' + dateRange.dateTo + ') ?', '', unfreeze);
      };

      //切换月份
      $scope.getTimeSheet = function (year, month) {
        timesheetMonthFunc.scrollToFixPosition(month.value, clientWidth);
        angular.forEach($scope.monthList, function (data) {
          data.selected = false;
        });
        month.selected = true;
        $scope.currentMonth = month.value;
        var monthParams = year + '' + formatMonth(month.value);
        initCalendar();
        fetchCalendar(monthParams);
        generateAllowance(monthParams);
      };

      $scope.startslipping = function () {
        startSlipping();
      };

      var processAllowance = function (allowance) {
        angular.forEach(allowance, function (data) {
          var allowance = {
            "allow": data.allow,
            "amount": data.amt,
            "creationDate": data.crea,
            "days": data.days,
            "status": data.is_audited,
            "project": data.proj,
            "period": data.range,
            "type": data.type
          }
          $scope.allowanceList.push(allowance);
        });
      };

      //获取津贴信息
      var generateAllowance = function (monthParams) {
        $scope.loadingAllowanceFlag = true;
        $scope.allowanceList = [];
        var success = function (result) {
          if (result.status == 'S') {
            processAllowance(result.allowance);
            $scope.loadingAllowanceFlag = false;
          } else {
            $scope.loadingAllowanceFlag = false;
          }
        };
        var error = function () {
          $scope.loadingAllowanceFlag = false;
        };
        TimeSheetService.generateAllowance(success, error, 'N', monthParams);
      }

      //生成津贴信息
      var createAllowance = function (currentYear, currentMonth) {

        var monthParams = currentYear + '' + formatMonth(currentMonth);
        hmsPopup.showLoading("生成津贴中");
        $scope.allowanceList = [];
        var success = function (result) {
          hmsPopup.hideLoading();
          if (result.status == 'S') {
            processAllowance(result.allowance);
          } else {
            if (result.status == 'E') {
              hmsPopup.showPopup('生成津贴失败 ' + result.message);
            }
          }
        };
        var error = function () {
          hmsPopup.hideLoading();
        };
        TimeSheetService.generateAllowance(success, error, 'Y', monthParams);
      }

      initCalendar();
      //从服务器获取请求
      $timeout(
        function () {
          initDate();
        }, 600
      );

      $scope.goBack = function () {
        $ionicHistory.$ionicGoBack();
      };

      $rootScope.$on('refreshTimesheet', function (event, data) {
        if (baseConfig.debug) {
          console.log('refreshTimesheet', data);
        }
        $timeout(
          function () {
            var monthParams = $scope.currentYear + '' + formatMonth($scope.currentMonth);
            fetchCalendar(monthParams);
          }, 600
        );
      });

      if (baseConfig.debug) {
        console.log('TimeSheetQueryCtrl.enter');
      }

      $scope.$on('$ionicView.loaded', function (e) {
        if (baseConfig.debug) {
          console.log('TimeSheetQueryCtrl.$ionicView.loaded');
        }
      });

      $scope.$on('$ionicView.beforeEnter', function (e) {
        if (baseConfig.debug) {
          console.log('TimeSheetQueryCtrl.$ionicView.beforeEnter');
        }
      });

      $scope.$on('$ionicView.enter', function (e) {
        if (baseConfig.debug) {
          console.log('TimeSheetQueryCtrl.$ionicView.enter');
        }
      });

      $scope.$on('$ionicView.afterEnter', function (e) {
        if (baseConfig.debug) {
          console.log('TimeSheetQueryCtrl.$ionicView.afterEnter');
        }
      });

      $scope.$on('$ionicView.leave', function (e) {
        if (baseConfig.debug) {
          console.log('TimeSheetQueryCtrl.$ionicView.leave');
        }
        $scope.exitQuery = true;
        stopSlipping();
      });

      $scope.$on('$ionicView.beforeLeave', function (e) {
        if (baseConfig.debug) {
          console.log('TimeSheetQueryCtrl.$ionicView.beforeLeave');
        }
        $scope.exitQuery = true;
        stopSlipping();
        $timeout(function () {
          $scope.exitQuery = false;
        }, 2000)
      });

      $scope.$on('$ionicView.afterLeave', function (e) {
        if (baseConfig.debug) {
          console.log('TimeSheetQueryCtrl.$ionicView.afterLeave');
        }
      });

      $scope.$on('$ionicView.unloaded', function (e) {
        if (baseConfig.debug) {
          console.log('TimeSheetQueryCtrl.$ionicView.unloaded');
        }
        $scope.exitQuery = true;
        stopSlipping();
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('TimeSheetQueryCtrl.$destroy');
        }
        $scope.popover.remove();
      });
    }]);
