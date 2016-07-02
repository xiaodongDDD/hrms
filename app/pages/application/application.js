/**
 * Created by gusenlin on 16/4/24.
 */
//应用模块
angular.module('applicationModule')

  .controller('applicationCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    function ($scope,
              $state,
              baseConfig) {

      $scope.animationsEnabled = false;

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
              appName: "住宿申请",
              imageUrl: "build/img/application/dorm-apply/dorm-apply.png",
              destUrl: "tab.dorm-apply"
            },
            {
              appName: "预报销",
              imageUrl: "build/img/application/application/forecast@3x.png",
              destUrl: "tab.cst_list"
            }]
        },
        {
          list: [
            {
              appName: "机票预定",
              imageUrl: "build/img/application/application/flightBooking@3x.png",
              destUrl: "tab.flyback",
            },
            {
              appName: "代办事项",
              imageUrl: "build/img/application/application/schedule@3x.png",
              destUrl: "tab.workflow-list",
            },
            {
              appName: "报销单查询",
              imageUrl: "build/img/application/application/wipeOut@3x.png",
              destUrl: "tab.expense",
            },
            {
              appName: "记一笔",
              imageUrl: "build/img/application/application/sign@3x.png",
              destUrl: "tab.acc_main"
            }]
        }];

      //项目门户
      $scope.projectApp = [
        {
          list: [
            {
              appName: "Timesheet填写",
              imageUrl: "build/img/application/application/timesheet@3x.png",
              destUrl: "tab.timesheet",
            },
            {
              appName: "Timesheet审批",
              imageUrl: "build/img/application/application/timesheetExamine@3x.png",
              destUrl: "tab.tsApproveList",
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
              appName: "拼车",
              imageUrl: "build/img/application/application/carpooling@3x.png",
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
            },
            {
              appName: "",
              imageUrl: "",
              destUrl: "",
            },]
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
        $state.go(appItem.destUrl);
      };

      console.log('applicationCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('applicationCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('applicationCtrl.$destroy');
      });
    }]);
