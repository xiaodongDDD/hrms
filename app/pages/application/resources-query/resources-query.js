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
              $ionicPopup

              // HmsDateFormat
              // $ionicModal,
              // //Prompter,
              // $ionicScrollDelegate,
              // hmsHttp

            )


    {
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


      // var monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
      // var ipObj1 = {
      //   callback: function (val) {  //Mandatory
      //
      //     $scope.dateFrom = new Date(val);
      //     $scope.monthFrom = $scope.dateFrom.getMonth()+1;
      //     $scope.dayFrom = $scope.dateFrom.getDate();
      //     $scope.weekFrom = weekDaysList[$scope.dateFrom.getDay()];
      //     $scope.yearFrom = $scope.dateFrom.getFullYear();
      //
      //     if($scope.monthFrom < 10){
      //       $scope.monthFrom = "0" + $scope.monthFrom;
      //     }
      //     if($scope.dayFrom < 10){
      //       $scope.dayFrom = "0" + $scope.dayFrom;
      //     }
      //
      //     dateFrom = $scope.yearFrom + '-' + $scope.monthFrom + '-' + $scope.dayFrom;
      //
      //
      //
      //
      //   },
      //   disabledDates: [            //Optionals
      //
      //   ],
      //   titleLabel: '选择日期',  //可选
      //   todayLabel: '今天',  //可选
      //   closeLabel: '关闭',  //可选
      //   setLabel: '设置',  //可选
      //   setButtonType : 'button-balanced',  //Optional
      //   todayButtonType : 'button-balanced',  //Optional
      //   closeButtonType : 'button-balanced',  //Optional
      //   showTodayButton: 'true',
      //   from: new Date(1988, 1, 1), //Optional
      //   to: new Date(2028, 10, 30), //Optional
      //   inputDate: new Date(),      //Optional
      //   mondayFirst: false,          //Optional
      //   weeksList: ["日", "一", "二", "三", "四", "五", "六"], //Optional
      //   monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],       //Optional
      //   modalHeaderColor: 'bar-balanced', //Optional
      //   modalFooterColor: 'bar-balanced', //Optional
      //   closeOnSelect: false,       //Optional
      //   templateType: 'popup'    //Optional
      // };
      //
      // $scope.selectDateFrom = function(){
      //   ionicDatePicker.openDatePicker(ipObj1);
      // };
      //
      // var ipObj2 = {
      //   callback: function (val) {  //Mandatory
      //     $scope.dateTo = new Date(val);
      //     $scope.monthTo = $scope.dateTo.getMonth()+1;
      //     $scope.dayTo = $scope.dateTo.getDate();
      //     $scope.weekTo = weekDaysList[$scope.dateTo.getDay()];
      //     $scope.yearTo = $scope.dateTo.getFullYear();
      //
      //     if($scope.monthTo < 10){
      //       $scope.monthTo = "0" + $scope.monthTo;
      //     }
      //     if($scope.dayTo < 10){
      //       $scope.dayTo = "0" + $scope.dayTo;
      //     }
      //     dateTo = $scope.yearTo + '-' + $scope.monthTo + '-' + $scope.dayTo;
      //
      //
      //
      //   },
      //   disabledDates: [            //Optionals
      //
      //   ],
      //   titleLabel: '选择日期',  //可选
      //   todayLabel: '今天',  //可选
      //   closeLabel: '关闭',  //可选
      //   setLabel: '设置',  //可选
      //   setButtonType : 'button-balanced',  //Optional
      //   todayButtonType : 'button-balanced',  //Optional
      //   closeButtonType : 'button-balanced',  //Optional
      //   showTodayButton: 'true',
      //   from: new Date(1988, 1, 1), //Optional
      //   to: new Date(2028, 10, 30), //Optional
      //   inputDate: new Date(),      //Optional
      //   mondayFirst: false,          //Optional
      //   weeksList: ["日", "一", "二", "三", "四", "五", "六"], //Optional
      //   monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],       //Optional
      //   modalHeaderColor: 'bar-balanced', //Optional
      //   modalFooterColor: 'bar-balanced', //Optional
      //   closeOnSelect: false,       //Optional
      //   templateType: 'popup'    //Optional
      // };
      //
      // $scope.selectDateTo = function(){
      //   ionicDatePicker.openDatePicker(ipObj2);
      // };


      //init data
      {

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

        dateFrom = $scope.datetimeFrom.year + '-' + $scope.datetimeFrom.month + '-' + $scope.datetimeFrom.day;


        //初始化结束时间
        refreshEndDate(1);


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


      $scope.selectDateFrom = function () {
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

          //$scope.$apply();
          // getLeaveDays();

          /*var offDays = getOffDays($scope.datetimeFrom, $scope.datetimeTo) + 1;
           if (offDays > 0) {
           $scope.timeOffData.timeLeave = offDays;
           } else {
           $scope.timeOffData.timeLeave = '';
           }*/
        });
      };
      $scope.selectDateTo = function () {
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

          //$scope.$apply();
          // getLeaveDays();
          /*var offDays = getOffDays($scope.datetimeFrom, $scope.datetimeTo) + 1;

           if (offDays > 0) {
           $scope.timeOffData.timeLeave = offDays;
           } else {
           $scope.timeOffData.timeLeave = '';
           }*/


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
        // console.log($scope.dateFrom);
        // console.log($scope.dateTo);
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
      $scope.showPopup = function(word) {
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
        if(!$scope.employeeName && !$scope.branchName && !$scope.subjectName){
          $scope.showPopup('请至少选择一个查询条件!');
        }
        if(!$scope.employeeName && $scope.branchName && $scope.subjectName){
          $scope.showPopup('请单独查询部门或项目!');
        }
        if($scope.employeeName && $scope.branchName && $scope.subjectName){
          $scope.showPopup('部门和项目不能同时查询!');
        }
        if(($scope.employeeName && !$scope.branchName && !$scope.subjectName)|| ($scope.employeeName && $scope.branchName && !$scope.subjectName) || ($scope.employeeName && !$scope.branchName && $scope.subjectName)){
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
        if(!$scope.employeeName && $scope.branchName&& !$scope.subjectName){
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
        if(!$scope.employeeName && !$scope.branchName && $scope.subjectName){
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


        //判断输入信息
        // if ($scope.queryParams.dateFrom == "" || $scope.queryParams.dateFrom == undefined ||
        //   $scope.queryParams.dateTo == "" || $scope.queryParams.dateTo == undefined) {
        //   $ionicLoading.show({template: '请输入开始时间和结束时间！', duration: 2000});
        // } else {
        //   if ($scope.queryParams.dateFrom > $scope.queryParams.dateTo) {
        //     $ionicLoading.show({template: '结束时间早于开始时间！', duration: 2000});
        //   } else {
        //     if ($scope.queryParams.employeeId == "" &&
        //       $scope.queryParams.departmentId == "" &&
        //       $scope.queryParams.groupId == "") {
        //       $ionicLoading.show({template: '请至少输入一项查询条件！', duration: 2000});
        //     } else {
        //       $scope.toggleQuery();// add by ciwei
        //       //Prompter.showLoading("Loading...");
        //       var dateForm = formatDate($scope.queryParams.dateFrom);
        //       var dateTo = formatDate($scope.queryParams.dateTo);
        //       var urlValueList = window.localStorage.wsurl + "/resource_query/get_resource_result";
        //       var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno + '",' +
        //         '"p_department_id":"' + $scope.queryParams.departmentId + '",' +
        //         '"p_sub_dept_id ":"' + $scope.queryParams.groupId + '",' +
        //         '"p_emp_id":"' + $scope.queryParams.employeeId + '",' +
        //         '"p_date_from":"' + dateForm + '",' +
        //         '"p_date_to":"' + dateTo + '",' +
        //         '"p_dimission_include":"' + $scope.dimissionCtrl.dimissionInclude + '"}}';
        //       console.log(paramValueList);
        //       hmsHttp.post(urlValueList, paramValueList, $scope).success(function (response) {
        //         if (response.status == "S") {
        //
        //           $scope.headerItems = response.headerItems;
        //           $scope.lineItems = response.lineItems;
        //           console.log("拉取列表成功" + angular.toJson(response));
        //           $scope.tableShow = true;
        //           //Prompter.hideLoading("");
        //         } else {
        //           console.log("拉取列表失败：" + response.returnMsg);
        //           //Prompter.hideLoading("");
        //           $ionicLoading.show({template: response.returnMsg, duration: 2000});
        //         }
        //       }).error(function (response, status) {
        //         console.log("hmsHttp error ");
        //         //Prompter.hideLoading("");
        //       });
        //     }
        //   }
        // }

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





