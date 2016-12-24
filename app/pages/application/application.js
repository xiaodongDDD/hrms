/**
 * Created by gusenlin on 16/4/24.
 */
//应用模块
angular.module('applicationModule')

  .controller('applicationCtrl', [
    '$scope',
    '$state',
    '$ionicGesture',
    'baseConfig',
    '$timeout',
    'workFLowListService',
    'contractListService',
    'applicationService',
    'TimeSheetService',
    'plansService',
    'hmsPopup',
    'crmEmployeeService',
    function ($scope,
              $state,
              $ionicGesture,
              baseConfig,
              $timeout,
              workFLowListService,
              contractListService,
              applicationService,
              TimeSheetService,
              plansService,
              hmsPopup,
              crmEmployeeService) {

      $scope.animationsEnabled = false;
      $scope.openDoor = 0;
      $scope.fetchWorkflowData = true;

      var menuFetchFlag = false;

      /*//个人办公
       $scope.officeApp = [
       {
       list: [
       {
       appName: "人事政策",
       imageUrl: "build/img/application/application/personnelPolicy@3x.png",
       destUrl: "tab.personnel-policy",
       },
       {
       appName: "假期管理",
       imageUrl: "build/img/application/application/holidayManage@3x.png",
       destUrl: "tab.time-off-manage",
       },
       {
       appName: "机票预定",
       imageUrl: "build/img/application/application/flightBooking@3x.png",
       destUrl: "tab.flight-ticket-list",
       },
       {
       appName: "工作流",
       imageUrl: "build/img/application/application/schedule@3x.png",
       destUrl: "tab.workflow-list",
       hasWorkflowNum: true,
       count: 0
       }]
       },
       {
       list: [
       {
       appName: "合同管理",
       imageUrl: "build/img/application/application/schedule@3x.png",
       destUrl: "tab.contractlist",
       hasWorkflowNum: true,
       count: 0
       },
       {
       appName: "",
       imageUrl: "",
       destUrl: "",
       },
       {
       appName: "",
       imageUrl: "",
       destUrl: "",
       },
       {
       appName: "",
       imageUrl: "",
       destUrl: "",
       }
       ]
       }
       ];

       //项目门户
       $scope.projectApp = [{
       list: [
       {
       appName: "Timesheet审批",
       imageUrl: "build/img/application/application/timesheetExamine@3x.png",
       destUrl: "tab.tsApproveList",
       },
       {
       appName: "Timesheet填写",
       imageUrl: "build/img/application/application/timesheet@3x.png",
       destUrl: "tab.timesheet",
       },
       {
       appName: "资源查询",
       imageUrl: "build/img/application/application/search@3x.png",
       destUrl: "tab.resources-query",
       },
       {
       appName: "",
       imageUrl: "",
       destUrl: "",
       }]
       }];

       //员工社区
       $scope.employeeApp = [{
       list: [
       {
       appName: "住宿申请",
       imageUrl: "build/img/application/application/dormApply@3x.png",
       destUrl: "tab.dorm-apply"
       }, {
       appName: "房屋转租",
       imageUrl: "build/img/application/application/housingrental@3x.png",
       destUrl: "tab.houses-tab",
       }, {
       appName: "班车信息",
       imageUrl: "build/img/application/application/bus@3x.png",
       destUrl: "tab.bus-information",
       }, {
       appName: "拼车",
       imageUrl: "build/img/application/application/carpooling@3x.png",
       destUrl: "tab.carpooling",
       }
       ]
       }];*/
      //CRM
      $scope.crmApp = [{
        list: [{
          appName:"客户",
          imageUrl: "build/img/application/application/personnelPolicy@3x.png",
          destUrl: "tab.customers"
        }, {
          appName: "联系人",
          imageUrl: "build/img/application/application/personnelPolicy@3x.png",
          destUrl: "tab.contactCrm"
        }, {
          appName: "线索",
          imageUrl: "build/img/application/application/personnelPolicy@3x.png",
          destUrl: "tab.clues"
        }, {
          appName:"商机",
          imageUrl: "build/img/application/application/personnelPolicy@3x.png",
          destUrl: "tab.opportunities"
        }]
      },{
        list:[
        {
          appName: "销售计划",
          imageUrl: "build/img/application/application/personnelPolicy@3x.png",
          destUrl: "tab.plans"
        }, {
          appName:"保证金",
          imageUrl: "build/img/application/application/personnelPolicy@3x.png",
          destUrl: "tab.bidbond"
        }, {
          appName:"竞争对手",
          imageUrl: "build/img/application/application/personnelPolicy@3x.png",
          destUrl: "tab.competitor"
        }
      ]
      }];

      //个人办公
      $scope.officeApp = [
        {
          list: [
            {
              appName: "",
              imageUrl: "",
              destUrl: ""
            },
            {
              appName: "",
              imageUrl: "",
              destUrl: "",
            },
            {
              appName: "",
              imageUrl: "",
              destUrl: "",
            },
            {
              appName: "",
              imageUrl: "",
              destUrl: "",
            }
          ]
        }];

      //项目门户
      $scope.projectApp = [
        {
          list: [
            {
              appName: "",
              imageUrl: "",
              destUrl: ""
            },
            {
              appName: "",
              imageUrl: "",
              destUrl: "",
            },
            {
              appName: "",
              imageUrl: "",
              destUrl: "",
            },
            {
              appName: "",
              imageUrl: "",
              destUrl: "",
            }
          ]
        }
      ];

      //员工社区
      $scope.employeeApp = [
        {
          list: [
            {
              appName: "",
              imageUrl: "",
              destUrl: ""
            },
            {
              appName: "",
              imageUrl: "",
              destUrl: "",
            },
            {
              appName: "",
              imageUrl: "",
              destUrl: "",
            },
            {
              appName: "",
              imageUrl: "",
              destUrl: "",
            }
          ]
        }
      ];

      $scope.weekdays = ['一','二','三','四','五','六','日'];
      $scope.days = [];

      crmEmployeeService.initDetail(function(){});

      (function getDays() {
        var today = new Date();
        var day = today.getDay();
        if(day == 0){
          day = 7;
        }
        var weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - (day - 1));
        for(var i = 0; i < 7; i++){
          var tempDate = new Date(weekStart);
          tempDate.setDate(tempDate.getDate() + i);
          tempDate.planCount = 0;
          $scope.days.push(tempDate);
          if(tempDate.getDate() == today.getDate())
            $scope.nowSelectedDate = i;
        }
      })();

      $scope.getDateText = function(date){
        return date.getDate() == (new Date).getDate() ? '今' : date.getDate()
      };

      $scope.selectDate = function($index){
        $scope.nowSelectedDate = $index;
      };

      // -1 ~ 2 未填写 拒绝 未审批 已审批
      var getTimeSheetSuccess = function(response){
        if(response.returnCode == 'S'){
          var resultIndex = 0;
          var noMoreFlag = response.timesheet_list.length == 0;
          for(var i = 0; i < $scope.days.length; i++){
            if(!noMoreFlag && response.timesheet_list[resultIndex].record_date.substr(-2,2) == $scope.days[i].getDate()){
              $scope.days[i].project = response.timesheet_list[resultIndex].project_name;
              $scope.days[i].timeSheetValue = response.timesheet_list[resultIndex].is_verified + 1;
              $scope.days[i].timeSheetText = response.timesheet_list[resultIndex].is_verified_value;
              $scope.days[i].money = response.timesheet_list[resultIndex].allowance;
              resultIndex++;
              if(resultIndex == response.timesheet_list.length - 1)
                noMoreFlag = true;
            } else {
              $scope.days[i].project = '';
              $scope.days[i].timeSheetValue = -1;
              $scope.days[i].timeSheetText= '未填写';
              $scope.days[i].money = "";
            }
          }
        } else {
          hmsPopup.showPopup(response.returnMsg)
        }
      };

      var getHasPlanListSuccess = function(response){
        if(response.returnCode == 'S'){
          var resultIndex = 0;
          var noMoreFlag = response.saleplan_list.length == 0;
          for(var i = 0; i < $scope.days.length; i++){
            if(!noMoreFlag && response.saleplan_list[resultIndex].planDate.substr(-2,2) == $scope.days[i].getDate()){
              $scope.days[i].planCount = response.saleplan_list[resultIndex].planCount;
              resultIndex++;
              if(resultIndex == response.saleplan_list.length - 1)
                noMoreFlag = true;
            } else {
              $scope.days[i].planCount = 0;
            }
          }
        } else {
          hmsPopup.showPopup(response.returnMsg)
        }
      };

      function formatDateByDate(date) {
        return date.getFullYear() + '-' +
          (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' +
          ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
      }

      (function initCalendarDate(){
        var today = new Date();
        var day = today.getDay();
        if(day == 0)
          day = 7;
        var weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - (day - 1));
        var weekEnd = new Date(today);
        weekEnd.setDate(weekEnd.getDate() + (7 - day));
        var params = {
          "page": 1,
          "pageSize": 7,
          "planDateFrom": formatDateByDate(weekStart),
          "planDateTo": formatDateByDate(weekEnd),
          "type": "MY"
        };
        plansService.getHasPlanList(getHasPlanListSuccess, params);
        TimeSheetService.getWeekTimeSheet(getTimeSheetSuccess, formatDateByDate(weekStart), formatDateByDate(weekEnd));
        // TimeSheetService.getWeekTimeSheet(getTimeSheetSuccess, "2015-12-19", "2015-12-25");
      })();

      $scope.goPlan = function(){
        $state.go('tab.plans',{
          data: 'WEEK'
        })
      };

      // -1 ~ 2 未填写 拒绝 未审批 已审批
      $scope.goWrite = function(date){
        var style_outline,style_color;
        if (date.timeSheetValue == -1) {
          style_outline = 'each-day';
          style_color = 'day-item';
        } else if (date.timeSheetValue == 1) {
          style_outline = 'each-day attendance';
          style_color = 'day-item attendance';
        } else if (date.timeSheetValue == 2) {
          style_outline = 'each-day approve';
          style_color = 'day-item approve';
        } else if (date.timeSheetValue == 0) {
          style_outline = 'each-day reject';
          style_color = 'day-item reject';
        }
        var day = {
          "day":date.getDate(),
          "style_outline":style_outline,
          "style_color":style_color,
          "money":date.money,
          "project":date.project_name,
          "each_day":formatDateByDate(date).replace(/-/g,''),
          "lockFlag":false,
          "choosed":false
        };
        $state.go('tab.timesheet-write',{
          day: day
        })
      };

      var initSetting = function () {
        if (!window.localStorage.slippingEnableFlag) {
          window.localStorage.slippingEnableFlag = "true";
          $scope.slippingEnableFlag = true;
        } else {
          if (window.localStorage.slippingEnableFlag == "true") {
            $scope.slippingEnableFlag = true;
          } else {
            $scope.slippingEnableFlag = false;
          }
        }
      };

      if (baseConfig.debug) {
        console.log('navigator.userAgent  ' + navigator.userAgent)
      }

      $scope.changeSlippingSetting = function () {
        if ($scope.slippingEnableFlag == true) {
          $scope.slippingEnableFlag = false;
          window.localStorage.slippingEnableFlag = "false";
        } else {
          $scope.slippingEnableFlag = true;
          window.localStorage.slippingEnableFlag = "true";
        }

      };

      var successCheckContract = function (result) {
        if (result.result == 'S') {
          var successGetTodoCount = function (result) {
            if (result.result == 'S') {
              angular.forEach($scope.officeApp, function (data) {
                angular.forEach(data.list, function (detail) {
                  if (detail.hasWorkflowNum && detail.appName == '合同管理') {
                    detail.count = result.procSize;
                  }
                });
              });
            }
          };
          contractListService.getTodoCount(successGetTodoCount);
        }

      };

      $scope.openSetting = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };

      $scope.goPage = function (appItem) {
        if (baseConfig.debug) {
          console.log("appItem " + angular.toJson(appItem));
        }
        if (appItem.destUrl != "") {
          $state.go(appItem.destUrl);
        }
      };

      if (baseConfig.debug) {
        console.log('applicationCtrl.enter');
      }

      var getWorkflowNum = function () {
        var success = function (result) {
          if (result.status == 'S') {
            var count = result.workflowcount;
            angular.forEach($scope.officeApp, function (data) {
              angular.forEach(data.list, function (detail) {
                if (detail.hasWorkflowNum && detail.appName == '工作流') {
                  detail.count = count;
                }
              });
            });
          }
          $scope.fetchWorkflowData = false;
        };
        var error = function () {
          angular.forEach($scope.officeApp, function (data) {
            angular.forEach(data.list, function (detail) {
              if (detail.hasWorkflowNum) {
                detail.count = 0;
              }
            });
          });
          $scope.fetchWorkflowData = false;
        };
        workFLowListService.getNoticeListCount(success, error);
      };

      $scope.onRelease = function () {
        if (baseConfig.debug) {
          console.log('$scope.onRelease');
        }
        $scope.animationsEnabled = false;
      };

      var fetchMenuList = function () {
        var success = function (result) {
          if (result.returnStatus == 'S') {

            $scope.officeApp = applicationService.analysisMenuList(result.returnData.officeApp);
            $scope.projectApp = applicationService.analysisMenuList(result.returnData.projectApp);
            $scope.employeeApp = applicationService.analysisMenuList(result.returnData.employeeApp);

            $timeout(function () {
              $scope.$apply();
            }, 200);

            if (baseConfig.debug) {
              console.log('$scope.officeApp ' + angular.toJson($scope.officeApp));
              console.log('$scope.projectApp ' + angular.toJson($scope.projectApp));
              console.log('$scope.employeeApp ' + angular.toJson($scope.employeeApp));
            }

            menuFetchFlag = true;
            getWorkflowNum();
            contractListService.check(successCheckContract);

          }
        };

        var error = function (result) {
        };

        applicationService.fetchMenuList(success);

      };

      $scope.freshMenuList = function () {
        fetchMenuList();
      };

      $scope.$on('$ionicView.beforeEnter', function (e) {
        if (baseConfig.debug) {
          console.log('applicationCtrl.$ionicView.beforeEnter');
        }
        initSetting();

        if (menuFetchFlag) {
          getWorkflowNum();
          contractListService.check(successCheckContract);
        } else {
          fetchMenuList();
        }

        $scope.openDoor = 0;
      });

      $scope.$on('$ionicView.beforeLeave', function (e) {
        if (baseConfig.debug) {
          console.log('applicationCtrl.$ionicView.beforeLeave');
        }
        $scope.animationsEnabled = false;
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('applicationCtrl.$destroy');
        }
      });
    }
  ]);

