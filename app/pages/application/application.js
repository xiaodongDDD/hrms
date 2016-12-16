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
    function ($scope,
              $state,
              $ionicGesture,
              baseConfig,
              $timeout,
              workFLowListService,
              contractListService,
              applicationService) {
      
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
      $scope.manageApp = [{
        list: [{
          appName:"客户",
          imageUrl: "build/img/application/application/personnelPolicy@3x.png",
          destUrl: "tab.customers"
        }, {
          appName: "联系人",
          imageUrl: "build/img/application/application/personnelPolicy@3x.png",
          destUrl: "tab.contact"
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
          destUrl: "tab.clues"
        }, {
          appName:"保证金",
          imageUrl: "build/img/application/application/personnelPolicy@3x.png",
          destUrl: "tab.opportunities"
        }, {
          appName: "立项",
          imageUrl: "build/img/application/application/personnelPolicy@3x.png",
          destUrl: "tab.clues"
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
          }
          contractListService.getTodoCount(successGetTodoCount);
        }

      };

      $scope.openSetting = function () {
        if ($scope.animationsEnabled) {
          $scope.animationsEnabled = false;
        } else {
          $scope.animationsEnabled = true;
        }
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
        }
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

