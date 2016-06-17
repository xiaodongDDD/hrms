/**
 * Created by shishun on 16/5/22.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.time-off-manage', {
          url: '/time-off-manage',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/time-off-manage/timeOffManageList.html',
              controller: 'TimeOffManageCtrl'
            }
          }
        })
    }]);

angular.module('applicationModule')

  .controller('TimeOffManageCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory) {
      $scope.paidHolidayLeftDays=20;//带薪年假剩余天数-蓝
      $scope.paidHolidayTotalDays=90;//带薪年假总天数
      $scope.paidSickLeftDays=50;//病假剩余天数-绿
      $scope.paidSickTotalDays=90;//病假总天数
      $scope.extPaidHolidayLeftDays=45;//橙色的剩余天数
      $scope.extPaidHolidayTotalDays=90;//橙色的总天数
    }]);
