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
              appName: "会议管理",
              imageUrl: "build/img/application/meetingManage@3x.png",
              destUrl: "",
            },
            {
              appName: "个人申请",
              imageUrl: "build/img/application/meetingManage@3x.png",
              destUrl: "",
            },
            {
              appName: "报表分析",
              imageUrl: "build/img/application/meetingManage@3x.png",
              destUrl: "",
            },
            {
              appName: "人事政策",
              imageUrl: "build/img/application/meetingManage@3x.png",
              destUrl: "tab.personnel-policy",
            }]
        },
        {
          list: [
            {
              appName: "假期管理",
              imageUrl: "build/img/application/holidayManage@3x.png",
              destUrl: "tab.time-off-manage",
            },
            {
              appName: "住宿申请",
              imageUrl: "build/img/application/dorm-apply/dorm-apply.png",
              destUrl: "tab.dorm-apply"
            }, {
              appName: "Timesheet填写",
              imageUrl: "build/img/application/timesheet@3x.png",
              destUrl: "tab.timesheet",
            },
            {
              appName: "Timesheet审批",
              imageUrl: "build/img/application/timesheetExamine@3x.png",
              destUrl: "tab.tsApproveList",
            }
          ]
        }];

      //项目门户
      $scope.projectApp = [
        {
          list: [
            {
              appName: "机票预定",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "tab.flyback",
            },
            {
              appName: "代办事项",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "tab.workflow-list",
            },
            {
              appName: "报销单查询",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "首款查询",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            }]
        },
        {
          list: [
            {
              appName: "外勤汇报",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "记一笔",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "tab.acc_main"
            },
            {
              appName: "报销",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "tab.expense"
            },
            {
              appName: "预报销",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "tab.cst_list"
            }]
        },
        {
          list: [
            {
              appName: "资源查询",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "tab.resources-query",
            },
            {
              appName: "",
              imageUrl: "",
              destUrl: ""
            },
            {
              appName: "",
              imageUrl: "",
              destUrl: ""
            },
            {
              appName: "",
              imageUrl: "",
              destUrl: ""
            }]
        }
      ];

      //员工社区
      $scope.employeeApp = [
        {
          list: [
            {
              appName: "在线培训",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "知识门户",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "新闻",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "分享社区",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            }]
        },
        {
          list: [
            {
              appName: "在线培训",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "知识门户",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "新闻",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "分享社区",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            }]
        }
      ];


      $scope.openSetting = function(){
        if($scope.animationsEnabled){
          $scope.animationsEnabled = false;
        }
        else{
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
