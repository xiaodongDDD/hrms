/**
 * Created by gusenlin on 16/5/22.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.timesheet', {
          url: '/timesheet',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/timesheet/query/query.html',
              controller: 'TimeSheetQueryCtrl'
            }
          }
        });
    }]);

angular.module('applicationModule')

  .controller('TimeSheetQueryCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$timeout',
    '$ionicScrollDelegate',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              $timeout,
              $ionicScrollDelegate) {

      $scope.calendar = [];
      var currentTimeSheetPosition = true;
      $scope.loadingDataFlag = true;

      var init = function () {
        $scope.calendar = [];
        for (i = 0; i < 5; i++) {
          var style_outline = 'each-day';
          var style_color = 'day-item';
          var money = '';
          var project = '';
          var week = {
            week: i,
            list: []
          };
          for (j = 0; j < 7; j++) {
            var item = {
              day: i + "" + j,
              style_outline: style_outline,
              style_color: style_color,
              money: money,
              project: project
            };
            week.list.push(item);
          }
          $scope.calendar.push(week);
        }
      }

      init();

      $scope.scrollToFixScreen = function(){
        if(currentTimeSheetPosition){
          $ionicScrollDelegate.scrollTo(0,450,true);
          currentTimeSheetPosition = false;
        }else{
          $ionicScrollDelegate.scrollTo(0,0,true);
          currentTimeSheetPosition = true;
        }
      };

      $scope.getTimeSheet = function(){
        init();
        $scope.loadingDataFlag = true;

        $timeout(function(){
          $scope.calendar = [];
          for (i = 0; i < 5; i++) {
            var style_outline = 'each-day';
            var style_color = 'day-item';
            var money = '';
            var project = '';
            if (i == 0) {
              style_outline = 'each-day approve';
              style_color = 'day-item approve';
              money = '120';
              project = 'Hrms2.0'
            } else if (i == 1) {
              style_outline = 'each-day reject';
              style_color = 'day-item reject';
              money = '120';
              project = '如新App'
            } else if (i == 2) {
              style_outline = 'each-day attendance';
              style_color = 'day-item attendance';
              money = '40';
              project = '移动内部'
            }
            var week = {
              week: i,
              list: []
            };
            for (j = 0; j < 7; j++) {
              var item = {
                day: i + "" + j,
                style_outline: style_outline,
                style_color: style_color,
                money: money,
                project: project
              };
              week.list.push(item);
            }
            $scope.calendar.push(week);
          }
          $scope.loadingDataFlag = false;
          $scope.$apply();
        },1500);
      };


      $scope.getTimeSheet();

      $scope.goBack = function () {
        $ionicHistory.$ionicGoBack();
      };

      if (baseConfig.debug) {
        console.log('applicationCtrl.enter');
      };

      $scope.$on('$ionicView.enter', function (e) {
        if (baseConfig.debug) {
          console.log('applicationCtrl.$ionicView.enter');
        };
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('applicationCtrl.$destroy');
        };
      });
    }]);
