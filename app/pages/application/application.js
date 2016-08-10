
/**
 * Created by gusenlin on 16/4/24.
 */
//应用模块
angular.module('applicationModule')

  .controller('applicationCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    'workFLowListService',
    function ($scope,
              $state,
              baseConfig,
              workFLowListService) {

      $scope.animationsEnabled = false;
      $scope.openDoor = 0;
      $scope.fetchWorkflowData = true;

      var initSetting = function () {
        if(!window.localStorage.slippingEnableFlag){
          window.localStorage.slippingEnableFlag = "true";
          $scope.slippingEnableFlag = true;
        }else{
          if(window.localStorage.slippingEnableFlag == "true"){
            $scope.slippingEnableFlag = true;
          }else{
            $scope.slippingEnableFlag = false;
          }
        }
      };

      $scope.changeSlippingSetting = function () {
        if($scope.slippingEnableFlag==true){
          $scope.slippingEnableFlag = false;
          window.localStorage.slippingEnableFlag = "false";
        }else{
          $scope.slippingEnableFlag = true;
          window.localStorage.slippingEnableFlag = "true";
        }
      };

      //个人办公
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
              appName: "预报销",
              imageUrl: "build/img/application/application/forecast@3x.png",
              destUrl: "tab.cst_list"
            },
            {
              appName: "记一笔",
              imageUrl: "build/img/application/application/sign@3x.png",
              destUrl: "tab.acc_main"
            }
          ]
        },
        {
          list: [
            {
              appName: "机票预定",
              imageUrl: "build/img/application/application/flightBooking@3x.png",
              destUrl: "tab.flyback",
            },
            {
              appName: "工作流",
              imageUrl: "build/img/application/application/schedule@3x.png",
              destUrl: "tab.workflow-list",
              hasWorkflowNum: true,
              count: 0
            },
            {
              appName: "报销单查询",
              imageUrl: "build/img/application/application/wipeOut@3x.png",
              destUrl: "tab.expense",
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
              appName: "住宿申请",
              imageUrl: "build/img/application/application/dormApply@3x.png",
              destUrl: "tab.dorm-apply"
            },
            {
              appName: "房屋转租",
              imageUrl: "build/img/application/application/housingrental@3x.png",
              destUrl: "tab.houses-tab",
            },
            {
              appName: "班车信息",
              imageUrl: "build/img/application/application/bus@3x.png",
              destUrl: "tab.bus-information",
            },
            {
              appName: "",
              imageUrl: "",
              destUrl: "",
            }
            /*{
              appName: "拼车",
              imageUrl: "build/img/application/application/carpooling@3x.png",
              destUrl: "tab.carpooling",
            }*/
          ]
        }
      ];

      $scope.openSetting = function () {
        if ($scope.animationsEnabled) {
          $scope.animationsEnabled = false;
        }
        else {
          $scope.animationsEnabled = true;
        }
      };

      $scope.goPage = function (appItem) {
        if (baseConfig.debug) {
          console.log("appItem " + angular.toJson(appItem));
        }
        if(appItem.destUrl != ""){
          $state.go(appItem.destUrl);
        }
      };

      if (baseConfig.debug) {
        console.log('applicationCtrl.enter');
      }

      var getWorkflowNum = function () {
        var success = function (result) {
          if(result.status == 'S'){
            var count = result.workflowcount;
            angular.forEach($scope.officeApp,function (data) {
              angular.forEach(data.list,function (detail) {
                if(detail.hasWorkflowNum){
                  detail.count = count;
                }
              });
            });
          }
          $scope.fetchWorkflowData = false;
        };
        var error = function () {
          angular.forEach($scope.officeApp,function (data) {
            angular.forEach(data.list,function (detail) {
              if(detail.hasWorkflowNum){
                detail.count = 0;
              }
            });
          });
          $scope.fetchWorkflowData = false;
        }
        workFLowListService.getNoticeListCount(success,error);
      };

      $scope.$on('$ionicView.beforeEnter', function (e) {
        if (baseConfig.debug) {
          console.log('applicationCtrl.$ionicView.beforeEnter');
        }
        initSetting();
        getWorkflowNum();
        $scope.openDoor = 0;
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('applicationCtrl.$destroy');
        }
      });
    }]);
