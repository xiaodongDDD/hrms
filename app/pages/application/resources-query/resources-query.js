angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.resources-query', {
          url: '/resources-query',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/resources-query/resources-query.html',
              controller: 'resourceQueryController'
            }
          }
        })
    }]);

angular.module('applicationModule')
  .controller('resourceQueryController', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$stateParams',
    '$rootScope',
    '$timeout',
    '$cordovaDatePicker',
    '$ionicPopup',
    'hmsPopup',
    // 'HmsDateFormat',
    // '$ionicModal',
    // //'Prompter',
    // '$ionicScrollDelegate',
    // 'hmsHttp',

    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              $stateParams,
              $rootScope,
              $timeout,
              $cordovaDatePicker,
              $ionicPopup,
              hmsPopup
              // HmsDateFormat
              // $ionicModal,
              // //Prompter,
              // $ionicScrollDelegate,
              // hmsHttp

    ) {
      $scope.goBack = function () {
        $ionicHistory.goBack();
      };

      $scope.showClearEmployee = false; //默认隐藏搜索框的清除按钮
      $scope.showClearBranch = false; //默认隐藏搜索框的清除按钮
      $scope.showClearSubject = false; //默认隐藏搜索框的清除按钮


      //初始化搜索数据
      {
        var weekDaysList = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];


        $scope.dateFrom = new Date();
        $scope.dateFrom.setDate(1);
        $scope.monthFrom = $scope.dateFrom.getMonth();
        $scope.dayFrom = $scope.dateFrom.getDate();
        $scope.dateFrom.setMonth($scope.dateFrom.getMonth() - 1);
        $scope.weekFrom = weekDaysList[$scope.dateFrom.getDay()];
        $scope.yearFrom = $scope.dateFrom.getFullYear();

        if ($scope.monthFrom < 10) {
          $scope.monthFrom = "0" + $scope.monthFrom;
        }
        if ($scope.dayFrom < 10) {
          $scope.dayFrom = "0" + $scope.dayFrom;
        }

        var dateFrom = $scope.yearFrom + '-' + $scope.monthFrom + '-' + $scope.dayFrom;

        $scope.dateTo = new Date();
        $scope.monthTo = $scope.dateTo.getMonth() + 1;
        $scope.dayTo = $scope.dateTo.getDate();
        $scope.weekTo = weekDaysList[$scope.dateTo.getDay()];
        $scope.yearTo = $scope.dateTo.getFullYear();

        if ($scope.monthTo < 10) {
          $scope.monthTo = "0" + $scope.monthTo;
        }
        if ($scope.dayTo < 10) {
          $scope.dayTo = "0" + $scope.dayTo;
        }
        var dateTo = $scope.yearTo + '-' + $scope.monthTo + '-' + $scope.dayTo;


        $scope.employeeName = '';
        // $scope.employeeNumber = 21123;
        $scope.branch = '汉得移动';
        $scope.subject = '内部培训项目';

        $scope.dimission = false;
      }


      //是否包含离职人员
      $scope.dimissionClick = function () {
        $scope.dimission = !$scope.dimission;
        // console.log($scope.dimission);
      };

      $scope.clearInputContent = function (inputBox) { //响应清除输入框文字按钮的方法
        if (inputBox == 'employee') {
          $scope.employeeName = "";
          $scope.employeeCode = "";
          $scope.showClearEmployee = false;
        }
        if (inputBox == 'branch') {
          $scope.branchName = "";
          $scope.branchId = "";
          $scope.unitId = "";
          $scope.showClearBranch = false;
        }
        if (inputBox == 'subject') {
          $scope.subjectName = "";
          $scope.subjectId = "";
          $scope.showClearSubject = false;
        }
        if (ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
        }
        $timeout(function () {
          item.focus();
          $scope.$apply();
        }, 400);
      };

      var initEndDate = function () {
        var myDate = new Date();
        var lastDay = new Date(myDate.getFullYear(), myDate.getMonth() + 1, 0);
        if (baseConfig.debug) {
          console.log('lastDay ' + lastDay);
        }
        var endDate = new Date(myDate.getFullYear(), myDate.getMonth(), lastDay.getDate(), '18', '00', '00');
        $scope.datetimeTo.realDate = endDate;
        var endMonth = endDate.getMonth() + 1;
        var endDay = endDate.getDate();
        if (endMonth < 10) {
          endMonth = "0" + endMonth;
        }
        if (endDay < 10) {
          endDay = "0" + endDay;
        }
        $scope.datetimeTo.year = endDate.getFullYear();
        $scope.datetimeTo.month = endMonth;
        $scope.datetimeTo.day = endDay;
        dateTo = $scope.datetimeTo.year + '-' + $scope.datetimeTo.month + '-' + $scope.datetimeTo.day;
      };

      //init data
      {
        //设置初始化时间
        var todayDate = new Date();//今天日期
        var month = todayDate.getMonth() + 0;
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
        $scope.datetimeFrom.day = '01';

        var myDate = $scope.datetimeFrom;
        $scope.datetimeFrom.realDate = new Date(myDate.year, myDate.month - 2, myDate.day, '08', '30', '00');

        dateFrom = $scope.datetimeFrom.year + '-' + $scope.datetimeFrom.month + '-' + $scope.datetimeFrom.day;

        //初始化结束时间
        //refreshEndDate(1);
        initEndDate();
      }

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
        dateTo = $scope.datetimeTo.year + '-' + $scope.datetimeTo.month + '-' + $scope.datetimeTo.day;
      }


      var converterDate = function (date,dest) {
        dest.realDate = date;
        var endMonth = date.getMonth() + 1;
        var endDay = date.getDate();
        if (endMonth < 10) {
          endMonth = "0" + endMonth;
        }
        if (endDay < 10) {
          endDay = "0" + endDay;
        }
        dest.year = date.getFullYear();
        dest.month = endMonth;
        dest.day = endDay;
      };

      //调用原生日历插件来选择日期
      var pluginCalendar = function () {
        var success = function (response) {
          //alert('pluginCalendar.response ' + angular.toJson(response));
          try {
            var result = response.result;
            var startDate = new Date(result[0].replace(/-/g, '/'));
            var endDate = new Date(result[1].replace(/-/g, '/'));
            converterDate(startDate,$scope.datetimeFrom);
            converterDate(endDate,$scope.datetimeTo);
            dateFrom = $scope.datetimeFrom.year + '-' + $scope.datetimeFrom.month + '-' + $scope.datetimeFrom.day;
            dateTo = $scope.datetimeTo.year + '-' + $scope.datetimeTo.month + '-' + $scope.datetimeTo.day;
            $scope.$apply();
          } catch (e) {
            hmsPopup.showVeryShortCenterToast('选择日历出现错误!');
          }
        };
        var error = function (response) {
        };
        if (ionic.Platform.isWebView()) {
          HmsCalendar.openCalendar(success, error, '1');
        }
      };

      $scope.selectDateFrom = function () {

        pluginCalendar();
        return;
        // if ($scope.readOnly) {
        //   return;
        // }

        var myDate = $scope.datetimeFrom.realDate;

        //var previousDate = new Date(myDate.year, myDate.month - 1, myDate.day);
        var options = {
          date: myDate,
          mode: 'date',
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

          dateFrom = $scope.datetimeFrom.year + '-' + $scope.datetimeFrom.month + '-' + $scope.datetimeFrom.day;

        });
      };
      $scope.selectDateTo = function () {
        pluginCalendar();
        return;
        // if ($scope.readOnly) {
        //   return;
        // }

        var myDate = $scope.datetimeTo.realDate;
        //var previousDate = new Date(myDate.year, myDate.month - 1, myDate.day);
        var options = {
          date: myDate,
          mode: 'date',
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

          dateTo = $scope.datetimeTo.year + '-' + $scope.datetimeTo.month + '-' + $scope.datetimeTo.day;
        });
      };


      //接收搜索页面返回的数据
      {
        $rootScope.$on("EMP_NAME", function (e, data) {
          $scope.employeeName = data;
          if ($scope.employeeName) {
            $scope.showClearEmployee = true;
          } else {
            $scope.showClearEmployee = false;
          }
        });
        $rootScope.$on("EMP_CODE", function (e, data) {
          $scope.employeeCode = data;
        });
        $rootScope.$on("BRANCH_NAME", function (e, data) {
          $scope.branchName = data;
          if ($scope.branchName) {
            $scope.showClearBranch = true;
          } else {
            $scope.showClearBranch = false;
          }
        });
        $rootScope.$on("UNIT_ID", function (e, data) {
          $scope.unitId = data;
        });
        $rootScope.$on("BRANCH_ID", function (e, data) {
          $scope.branchId = data;
        });
        $rootScope.$on("SUBJECT_NAME", function (e, data) {
          $scope.subjectName = data;
          if ($scope.subjectName) {
            $scope.showClearSubject = true;
          } else {
            $scope.showClearSubject = false;
          }
        });
        $rootScope.$on("SUBJECT_ID", function (e, data) {
          $scope.subjectId = data;
        });

        $scope.dimission = false;
      }

      $scope.goInputSearch = function (page) { //去搜索界面
        if (page == 'person') {
          $state.go('tab.resourcesSearchPerson',
            {
              page: page,
              employeeCode: $scope.employeeCode,
              unitId: $scope.unitId,
              branchId: $scope.branchId,
              subjectId: $scope.subjectId
            }
          );
        }
        if (page == 'branch') {
          $state.go('tab.resourcesSearchBranch',
            {
              page: page,
              employeeCode: $scope.employeeCode,
              branchId: $scope.branchId,
              subjectId: $scope.subjectId

            }
          );
        }
        if (page == 'subject') {
          $state.go('tab.resourcesSearchSubject',
            {
              page: page,
              employeeCode: $scope.employeeCode,
              branchId: $scope.branchId,
              subjectId: $scope.subjectId
            }
          );
        }
      };


      // 定义弹窗
      $scope.showPopup = function (word) {
        $scope.data = {};
        // 一个精心制作的自定义弹窗
        var myPopup = $ionicPopup.show({
          title: word
        });
        myPopup.then(function (res) {
          console.log('Tapped!', res);
        });
        $timeout(function () {
          myPopup.close(); //由于某种原因3秒后关闭弹出
        }, 2000);
      };


      $scope.doQuery = function () {
        // $scope.toggleQuery(); // mod by ciwei
        // console.log(window.localStorage.empno);
        if (!$scope.employeeName && !$scope.branchName && !$scope.subjectName) {
          $scope.showPopup('请至少选择一个查询条件!');
        }
        if (!$scope.employeeName && $scope.branchName && $scope.subjectName) {
          $scope.showPopup('请单独查询部门或项目!');
        }
        if ($scope.employeeName && $scope.branchName && $scope.subjectName) {
          $scope.showPopup('部门和项目不能同时查询!');
        }
        if (($scope.employeeName && !$scope.branchName && !$scope.subjectName) || ($scope.employeeName && $scope.branchName && !$scope.subjectName) || ($scope.employeeName && !$scope.branchName && $scope.subjectName)) {
          $state.go('tab.rsDetailPerson',
            {
              dateFrom: dateFrom,
              dateTo: dateTo,
              employeeName: $scope.employeeName,
              employeeCode: $scope.employeeCode,
              branchName: $scope.branchName,
              branchId: $scope.branchId,
              unitId: $scope.unitId,
              subjectName: $scope.subjectName,
              subjectId: $scope.subjectId,
              dimission: $scope.dimission
            }
          );
        }
        if (!$scope.employeeName && $scope.branchName && !$scope.subjectName) {
          $state.go('tab.rsDetailBranch',
            {
              dateFrom: dateFrom,
              dateTo: dateTo,
              employeeName: $scope.employeeName,
              employeeCode: $scope.employeeCode,
              branchName: $scope.branchName,
              branchId: $scope.branchId,
              unitId: $scope.unitId,
              subjectName: $scope.subjectName,
              subjectId: $scope.subjectId,
              dimission: $scope.dimission
            }
          );
        }
        if (!$scope.employeeName && !$scope.branchName && $scope.subjectName) {
          $state.go('tab.rsDetailSubject',
            {
              dateFrom: dateFrom,
              dateTo: dateTo,
              employeeName: $scope.employeeName,
              employeeCode: $scope.employeeCode,
              branchName: $scope.branchName,
              branchId: $scope.branchId,
              unitId: $scope.unitId,
              subjectName: $scope.subjectName,
              subjectId: $scope.subjectId,
              dimission: $scope.dimission
            }
          );
        }

      }
      //滑动定位
      // $scope.scroll = function () {
      //   var scrollLeft = $ionicScrollDelegate.$getByHandle('tableBody').getScrollPosition().left;
      //   $ionicScrollDelegate.$getByHandle('tableHeader').scrollTo(scrollLeft, 0);
      // }
      //
      // //自适应列宽
      // $scope.resetWidth = function (index, str) {
      //   var newWidth = str.length * 0.875 + 0.5;
      //   if (newWidth > 3.5) {
      //     var className = "column-" + index;
      //     var elements = document.getElementsByClassName(className);
      //     for (var i = 0; i < elements.length; i++) {
      //       elements[i].style.width = newWidth + 'rem';
      //     }
      //   }
      // }
      //
      // //员工、部门、分组、项目选择与清选
      // $scope.employeeChoose = function (item) {
      //   $scope.queryParams.employeeId = item.value;
      //   $scope.queryParams.employeeName = item.name;
      //   $scope.queryParams.employee = item.name;
      //   $scope.employeeModal.hide();
      // }
      // $scope.clearEmployeeChoose = function () {
      //   $scope.queryParams.employeeId = '';
      //   $scope.queryParams.employeeName = '';
      //   $scope.queryParams.employee = '';
      //   $scope.employeeModal.hide();
      // }
      //
      // $scope.departmentChoose = function (item) {
      //   $scope.queryParams.departmentId = item.value;
      //   $scope.queryParams.department = item.name;
      //   $scope.departmentModal.hide();
      //
      //   var urlValueList = window.localStorage.wsurl + "/resource_query/get_sub_dept_lists";
      //   var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_department_id":"' + item.value + '"}}';
      //   console.log(paramValueList);
      //   hmsHttp.post(urlValueList, paramValueList, $scope).success(function (response) {
      //     if (response.status == "S") {
      //       $scope.groupItems = response.subDeptLists;
      //       console.log("拉取列表成功" + angular.toJson($scope.groupItems));
      //       if ($scope.groupItems == "") {
      //         console.log("该部门没有分组");
      //         //$ionicLoading.show({template: 'aaaaaaaaaaaaaaaaaaaaa！', duration: 2000});
      //       }
      //     } else {
      //       console.log("拉取列表失败：" + response.returnMsg);
      //     }
      //   }).error(function (response, status) {
      //     console.log("hmsHttp error ");
      //   });
      //
      // }
      // //部门清选
      // $scope.clearDepartmentChoose = function () {
      //   $scope.queryParams.department = '';
      //   $scope.queryParams.departmentId = '';
      //   $scope.queryParams.departmentName = '';
      //   $scope.queryParams.group = '';
      //   $scope.queryParams.groupId = '';
      //   $scope.queryParams.groupName = '';
      //   $scope.departmentModal.hide();
      // }
      //
      // $scope.groupChoose = function (item) {
      //   $scope.queryParams.groupId = item.value;
      //   $scope.queryParams.group = item.name;
      //   $scope.groupModal.hide();
      // }
      // //分组清选
      // $scope.clearGroupChoose = function () {
      //   $scope.queryParams.group = '';
      //   $scope.queryParams.groupId = '';
      //   $scope.queryParams.groupName = '';
      //   $scope.groupModal.hide();
      // }


    }
  ]);





