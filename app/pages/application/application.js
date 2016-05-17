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

      //个人办公
      $scope.officeApp = [
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
          destUrl: "",
        },
        {
          appName: "假期管理",
          imageUrl: "build/img/application/holidayManage@3x.png",
          destUrl: "",
        },
        {
          appName: "timesheet填写",
          imageUrl: "build/img/application/timesheet@3x.png",
          destUrl: "",
        },
        {
          appName: "timesheet审批",
          imageUrl: "build/img/application/timesheetExamine@3x.png",
          destUrl: "",
        }
      ];

      //项目门户
      $scope.projectApp = {};

      //员工社区
      $scope.employeeApp = {};

      $scope.goPage = function(appItem){
        if(baseConfig.debug){
          console.log("appItem " + appItem);
        }
      };

      console.log('applicationCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('applicationCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('applicationCtrl.$destroy');
      });
    }]);
