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

      $scope.allowanceList = [];
      $scope.selectYearList = [];

      var offset = -5;
      var yearCount = 10;

      var startTouchX = 0;
      var startTouchY = 0;

      var slippingFlag = false;
      var slippingEnableFlag = true;

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
        $state.go('tab.timesheet-write', {day: day});
      };

      $scope.scrollToFixScreen = function () {
        if (isScrollFreeze) {
          isScrollFreeze = $ionicScrollDelegate.$getByHandle('timeSheetHandle').freezeScroll(false);
        } else {
          isScrollFreeze = $ionicScrollDelegate.$getByHandle('timeSheetHandle').freezeScroll(true);
        }

        //isScrollFreeze = $ionicScrollDelegate.$getByHandle('timeSheetHandle').freezeScroll(true);
        console.log('scrollToFixScreen result ' + isScrollFreeze);

        if (currentTimeSheetPosition) {
          $ionicScrollDelegate.scrollTo(0, 400, true);
          currentTimeSheetPosition = false;
        } else {
          $ionicScrollDelegate.scrollTo(0, 0, true);
          currentTimeSheetPosition = true;
        }
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
              item = {
                day: timesheetArray[seq].day.replace('0', ''),
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
          fetchData(result);
          $scope.loadingDataFlag = false;
        }).error(function (response, status) {
          $scope.loadingDataFlag = false;
        });
      };

      var element = angular.element(document.querySelector('#timesheetCalandar'));

      var startSlipping = function () {
        slippingFlag = true;
        $ionicScrollDelegate.$getByHandle('timeSheetHandle').freezeScroll(true);
        scrollPosition = $ionicScrollDelegate.$getByHandle('timeSheetHandle').getScrollPosition().top;
      };
      var stopSlipping = function () {
        slippingFlag = false;
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
            if ((touchY >= lengthY + 0 + offsetY) && (touchY <= lengthY + 1 * averageY - offsetY)) {
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
        if (!slippingFlag && slippingEnableFlag) {
          if (Math.abs(startTouchX - e.gesture.touches[0].pageX) > 3 || Math.abs(startTouchY - e.gesture.touches[0].pageY) > 3) {
            toTime = new Date().getTime();
            if (baseConfig.debug) {
              console.log('startTime ' + startTime);
              console.log('toTime ' + toTime);
            }
            if ((toTime - startTime) > 250) {
              startSlipping();
            }
          }
        }
        if (slippingFlag && slippingEnableFlag) {
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
        console.log('touch.startTouchX ' + e.gesture.touches[0].pageX);
        console.log('touch.startTouchY ' + e.gesture.touches[0].pageY);
        var position = $ionicScrollDelegate.$getByHandle('timeSheetHandle').getScrollPosition();
        console.log('position ' + angular.toJson(position));
        startTouchX = e.gesture.touches[0].pageX;
        startTouchY = e.gesture.touches[0].pageY;
        startTime = new Date().getTime();
        copyFromDay = {};
      }, element);

      $ionicGesture.on("release", function (e) {
        if (slippingFlag && slippingEnableFlag) {
          stopSlipping();
          //console.log('release.startTouchX ' + e.gesture.touches[0].pageX);
          //console.log('release.startTouchY ' + e.gesture.touches[0].pageY);
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
        }
      }, element);

      $scope.getTimeSheet = function (year, month) {
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


      //获取津贴信息
      var generateAllowance = function (monthParams) {
        $scope.loadingAllowanceFlag = true;
        $scope.allowanceList = [];
        var success = function (result) {
          if (result.status == 'S') {
            angular.forEach(result.allowance, function (data) {
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
            $scope.loadingAllowanceFlag = false;
          } else {
            $scope.loadingAllowanceFlag = false;
          }
        }
        var error = function () {
          $scope.loadingAllowanceFlag = false;
        }
        TimeSheetService.generateAllowance(success, error, 'N', monthParams);
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
        console.log('applicationCtrl.enter');
      }

      $scope.$on('$ionicView.enter', function (e) {
        if (baseConfig.debug) {
          console.log('applicationCtrl.$ionicView.enter');
        }
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('applicationCtrl.$destroy');
        }
        $scope.popover.remove();
      });
    }]);
