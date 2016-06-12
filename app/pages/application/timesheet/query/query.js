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
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$timeout',
    '$ionicScrollDelegate',
    'TimeSheetService',
    'hmsHttp',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              $timeout,
              $ionicScrollDelegate,
              TimeSheetService,
              hmsHttp) {

      $scope.calendar = [];
      var currentTimeSheetPosition = true;
      $scope.loadingDataFlag = true;

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
      }

      test = function () {

        var url = baseConfig.businessPath + "/wfl_timesheet_view/get_timesheet_list";
        var params = {
          "params": {
            "p_employee_number": "4040",
            "p_start_date": "2015-11-01",
            "p_end_date": "2015-11-01",
            "p_project_name": "",
            "p_project_id": "",
            "p_project_person_number": "",
            "p_page": "1",
            "p_line_number": "5"
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

      test();

      init();

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

      var fetchCalendar = function (month) {
        init();
        $scope.loadingDataFlag = true;

        var url = baseConfig.businessPath + "/timesheet_process/fetch_calendar";
        var params = {
          "params": {
            "p_employee": window.localStorage.empno,
            "p_month": month + "",
            "p_offset": 1
          }
        };
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          fetchData(result);
          $scope.loadingDataFlag = false;
          $scope.$apply();
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
        }).error(function (response, status) {
          $scope.loadingDataFlag = false;
          $scope.$apply();
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(response));
          }
        });
      };

      fetchCalendar('201511');

      $scope.getTimeSheet = function (month) {
        fetchCalendar(month);
      };


      $scope.goBack = function () {
        $ionicHistory.$ionicGoBack();
      };

      if (baseConfig.debug) {
        console.log('applicationCtrl.enter');
      }
      ;

      $scope.$on('$ionicView.enter', function (e) {
        if (baseConfig.debug) {
          console.log('applicationCtrl.$ionicView.enter');
        }
        ;
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('applicationCtrl.$destroy');
        }
        ;
      });
    }])

  .service('TimeSheetService', [
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    function (baseConfig,
              hmsHttp,
              hmsPopup) {
      this.fetchCalendar = function () {

        var url = baseConfig.businessPath + "/timesheet_process/fetch_calendar";
        var params = {
          "params": {
            "p_employee": window.localStorage.empno,
            "p_month": '201511',
            "p_offset": 1
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

      this.fetchEachDay = function (callback) {
        var url = baseConfig.businessPath + '/timesheet_process/fetch_projects';
        var params = {'params': {'p_employee': window.localStorage.empno + "", 'p_date': '20151013' + ""}};
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          callback(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('获取状态错误,请检查');
        });
      }
    }]);
