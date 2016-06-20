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
    }]);

angular.module('applicationModule')
  .controller('TimeSheetQueryCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$timeout',
    '$ionicScrollDelegate',
    'TimeSheetService',
    'hmsHttp',
    function ($scope,
              $rootScope,
              $state,
              baseConfig,
              $ionicHistory,
              $timeout,
              $ionicScrollDelegate,
              TimeSheetService,
              hmsHttp) {

      var currentTimeSheetPosition = true;
      $scope.calendar = [];
      $scope.loadingDataFlag = true;

      //年表
      $scope.currentYear = '';
      $scope.currentMonth = '';
      //月份列表
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

      var formatMonth = function (month) {
        if (parseInt(month) < 10) {
          return '0' + month;
        } else {
          return '' + month;
        }
      };

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
        if (baseConfig.debug) {
          console.log('initDate.year ' + year);
          console.log('initDate.month ' + month)
        }

        var monthParams = year + '' + formatMonth(month);
        fetchCalendar(monthParams);
      }

      var init = function () {
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
              day: i + "" + j,
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

      $scope.writeTimesheet = function (day) {
        $state.go('tab.timesheet-write', {day: day});
      }

      $scope.scrollToFixScreen = function () {
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
                lockFlag: lockFlag
              };
            } else {
              item = {
                day: '',
                style_outline: style_outline,
                style_color: style_color,
                money: money,
                project: project,
                each_day: '',
                lockFlag: lockFlag
              };
            }

            week.list.push(item);

            seq = seq + 1;
          }
          $scope.calendar.push(week);
        }
      }

      var fetchCalendar = function (monthParams) {
        init();
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
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
        }).error(function (response, status) {
          $scope.loadingDataFlag = false;
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(response));
          }
        });
      };

      $scope.getTimeSheet = function (year, month) {
        angular.forEach($scope.monthList, function (data) {
          data.selected = false;
        });
        month.selected = true;
        var monthParams = year + '' + formatMonth(month.value);
        fetchCalendar(monthParams);
      };

      //从服务器获取请求
      $timeout(
        function () {
          initDate();
        }, 300
      );

      $scope.goBack = function () {
        $ionicHistory.$ionicGoBack();
      };

      $rootScope.$on('refreshTimesheet', function(event,data) {
        if (baseConfig.debug) {
          console.log('refreshTimesheet', data);
        }
        $timeout(
          function () {
            var monthParams = $scope.currentYear  + '' + formatMonth($scope.currentMonth);
            fetchCalendar(monthParams);
          }, 300
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
      });
    }])

  .service('TimeSheetService', [
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    function (baseConfig,
              hmsHttp,
              hmsPopup) {
      this.fetchCalendar = function (monthParams) {

        var url = baseConfig.businessPath + "/timesheet_process/fetch_calendar";
        var params = {
          "params": {
            "p_employee": window.localStorage.empno,
            "p_month": monthParams + "",
            "p_offset": "0"
          }
        };
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          //hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
        }).error(function (response, status) {
          //hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(response));
          }
        });
      };

      this.fetchEachDay = function (callback, oneDate) {
        var url = baseConfig.businessPath + '/timesheet_process/fetch_projects';
        var params = {'params': {'p_employee': window.localStorage.empno + "", 'p_date': +oneDate + ""}};
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          callback(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('获取状态错误,请检查网络!');
        });
      };

      this.fetchProjectDetailInfo = function (callback, oneDate, projectId) {
        var url = baseConfig.businessPath + "/timesheet_process/project_change"
        var params = {
          'params': {
            'p_employee': window.localStorage.empno + "", 'p_date': +oneDate + "",
            'p_project_id': projectId + ""
          }
        };
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          callback(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('获取项目信息错误,请检查网络!');
        });
      };

      this.submitTimesheet = function (callback,params) {
        var url = baseConfig.businessPath + "/timesheet_process/save_timesheet1";
        var params = params;
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          callback(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('提交Timesheet错误,请检查网络!');
        });
      }
    }]);
