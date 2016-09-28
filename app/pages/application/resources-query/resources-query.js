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
    'ionicDatePicker',
    '$rootScope',



    // '$ionicModal',
    // '$timeout',
    // //'Prompter',
    // '$ionicLoading',
    // '$ionicScrollDelegate',
    // 'hmsHttp',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              $stateParams,
              ionicDatePicker,
              $rootScope



              // $ionicModal,
              // $timeout,
              // //Prompter,
              // $ionicLoading,
              // $ionicScrollDelegate,
              // hmsHttp
    ) {
      $scope.goBack=function(){
        $ionicHistory.goBack();
      };

      //初始化搜索数据
      {
        var weekDaysList = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];


        $scope.dateFrom = new Date();
        $scope.dateFrom.setDate(1);
        $scope.monthFrom = $scope.dateFrom.getMonth();
        $scope.dayFrom = $scope.dateFrom.getDate();
        $scope.dateFrom.setMonth($scope.dateFrom.getMonth()-1);
        $scope.weekFrom = weekDaysList[$scope.dateFrom.getDay()];
        $scope.YearFrom = $scope.dateFrom.getFullYear();

        if($scope.monthFrom < 10){
          $scope.monthFrom = "0" + $scope.monthFrom;
        }
        if($scope.dayFrom < 10){
          $scope.dayFrom = "0" + $scope.dayFrom;
        }

        var dateFrom = $scope.YearFrom + '-' + $scope.monthFrom + '-' + $scope.dayFrom;




        $scope.dateTo = new Date();
        $scope.monthTo = $scope.dateTo.getMonth()+1;
        $scope.dayTo = $scope.dateTo.getDate();
        $scope.weekTo = weekDaysList[$scope.dateTo.getDay()];
        $scope.YearTo = $scope.dateTo.getFullYear();

        if($scope.monthTo < 10){
          $scope.monthTo = "0" + $scope.monthTo;
        }
        if($scope.dayTo < 10){
          $scope.dayTo = "0" + $scope.dayTo;
        }
        var dateTo = $scope.YearTo + '-' + $scope.monthTo+ '-' + $scope.dayTo;



        $scope.employeeName = '';
        // $scope.employeeNumber = 21123;
        $scope.branch= '汉得移动';
        $scope.subject = '内部培训项目';

        $scope.dimission = false;
      }



      //是否包含离职人员
      $scope.dimissionClick = function () {
        $scope.dimission = !$scope.dimission;
        // console.log($scope.dimission);
      };





      // var monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
      var ipObj1 = {
        callback: function (val) {  //Mandatory
          $scope.dateFrom = new Date(val);
          $scope.monthFrom = $scope.dateFrom.getMonth()+1;
          $scope.dayFrom = $scope.dateFrom.getDate();
          $scope.weekFrom = weekDaysList[$scope.dateFrom.getDay()];
          $scope.YearFrom = $scope.dateFrom.getFullYear();

          if($scope.monthFrom < 10){
            $scope.monthFrom = "0" + $scope.monthFrom;
          }
          if($scope.dayFrom < 10){
            $scope.dayFrom = "0" + $scope.dayFrom;
          }

          dateFrom = $scope.YearFrom + '-' + $scope.monthFrom + '-' + $scope.dayFrom;




        },
        disabledDates: [            //Optionals

        ],
        titleLabel: '选择日期',  //可选
        todayLabel: '今天',  //可选
        closeLabel: '关闭',  //可选
        setLabel: '设置',  //可选
        setButtonType : 'button-balanced',  //Optional
        todayButtonType : 'button-balanced',  //Optional
        closeButtonType : 'button-balanced',  //Optional
        showTodayButton: 'true',
        from: new Date(1988, 1, 1), //Optional
        to: new Date(2028, 10, 30), //Optional
        inputDate: new Date(),      //Optional
        mondayFirst: false,          //Optional
        weeksList: ["日", "一", "二", "三", "四", "五", "六"], //Optional
        monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],       //Optional
        modalHeaderColor: 'bar-balancede', //Optional
        modalFooterColor: 'bar-balanced', //Optional
        closeOnSelect: false,       //Optional
        templateType: 'popup'    //Optional
      };

      $scope.selectDateFrom = function(){
        ionicDatePicker.openDatePicker(ipObj1);
      };

      var ipObj2 = {
        callback: function (val) {  //Mandatory
          $scope.dateTo = new Date(val);
          $scope.monthTo = $scope.dateTo.getMonth()+1;
          $scope.dayTo = $scope.dateTo.getDate();
          $scope.weekTo = weekDaysList[$scope.dateTo.getDay()];
          $scope.YearTo = $scope.dateTo.getFullYear();

          if($scope.monthTo < 10){
            $scope.monthTo = "0" + $scope.monthTo;
          }
          if($scope.dayTo < 10){
            $scope.dayTo = "0" + $scope.dayTo;
          }
          dateTo = $scope.YearTo + '-' + $scope.monthTo + '-' + $scope.dayTo;



        },
        disabledDates: [            //Optionals

        ],
        titleLabel: '选择日期',  //可选
        todayLabel: '今天',  //可选
        closeLabel: '关闭',  //可选
        setLabel: '设置',  //可选
        setButtonType : 'button-balanced',  //Optional
        todayButtonType : 'button-balanced',  //Optional
        closeButtonType : 'button-balanced',  //Optional
        showTodayButton: 'true',
        from: new Date(1988, 1, 1), //Optional
        to: new Date(2028, 10, 30), //Optional
        inputDate: new Date(),      //Optional
        mondayFirst: false,          //Optional
        weeksList: ["日", "一", "二", "三", "四", "五", "六"], //Optional
        monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],       //Optional
        modalHeaderColor: 'bar-balanced', //Optional
        modalFooterColor: 'bar-balanced', //Optional
        closeOnSelect: false,       //Optional
        templateType: 'popup'    //Optional
      };

      $scope.selectDateTo = function(){
        ionicDatePicker.openDatePicker(ipObj2);
      };

      //接收搜索页面返回的数据
      {
        $rootScope.$on("EMP_NAME",function(e,data){
          $scope.employeeName = data;
        });
        $rootScope.$on("EMP_CODE",function(e,data){
          $scope.employeeCode = data;
        });
        $rootScope.$on("BRANCH_NAME",function(e,data){
          $scope.branchName = data;
        });
        $rootScope.$on("UNIT_ID",function(e,data){
          $scope.unitId = data;
        });
        $rootScope.$on("BRANCH_ID",function(e,data){
          $scope.branchId = data;
        });
        $rootScope.$on("SUBJECT_NAME",function(e,data){
          $scope.subjectName = data;
        });
        $rootScope.$on("SUBJECT_ID",function(e,data){
          $scope.subjectId = data;
        });


        $scope.dimission = false;


      }


      $scope.goInputSearch = function (page) { //去搜索界面
        // console.log($scope.dateFrom);
        // console.log($scope.dateTo);
        if(page == 'person'){
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
        if(page == 'branch'){
          $state.go('tab.resourcesSearchBranch',
            {
              page: page,
              employeeCode: $scope.employeeCode,
              branchId: $scope.branchId,
              subjectId: $scope.subjectId

            }
          );
        }
        if(page == 'subject'){
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






    $scope.doQuery = function () {
      // $scope.toggleQuery(); // mod by ciwei
      // console.log(window.localStorage.empno);
      if($scope.employeeName){
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
      if(!$scope.employeeName && $scope.branchName){
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





