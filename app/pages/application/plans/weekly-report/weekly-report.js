/**
 * Created by gusenlin on 2016/12/13.
 */
(function () {
  'use strict';
  angular
    .module('planModule')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tab.weekly-report', {
        url: '/plans/weekly-report',
        params: {
          authority: "",
          period: {}
        },
        views: {
          'tab-application': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/application/plans/weekly-report/weekly-report.html',
            controller: 'weeklyReportCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }

  angular
    .module('planModule')
    .controller('weeklyReportCtrl', weeklyReportCtrl);

  function weeklyReportCtrl($scope,
                            $state,
                            $stateParams,
                            $ionicHistory,
                            baseConfig,
                            hmsPopup,
                            plansService) {
    var vm = this;

    vm.showLoading = true;
    vm.weeklyReportList = [];

    var param = {
      type: $stateParams.type,
      authority: $stateParams.authority,
      period: $stateParams.period
    }

    vm.goDetail = goDetail;

    loadData();

    $scope.$on('$ionicView.beforeEnter', function (e) {
      if (baseConfig.debug) {
        console.log('weeklyReportCtrl.$ionicView.beforeEnter');
      }
      if (plansService.getRefreshDataFlag()) {
        plansService.setRefreshDataFlag(false);
        loadData();
      }
    });

    function loadData() {
      var success = function (result) {
        vm.showLoading = false;
        if (result.returnCode == 'S') {
          angular.forEach(result.weeklys, function (data) {
            var item = {
              "summaryId": data.summaryId,
              "employee": data.userId,
              "employeeName": data.name,
              "beginDate": data.beginDate,
              "endDate": data.endDate,
              "period": data.beginDate.substr(0, 10) + '~' + data.endDate.substr(0, 10),
              "content": data.summaryContent,
              "headUrl": data.headUrl
            }
            vm.weeklyReportList.push(item);
          })
        }
      };
      vm.showLoading = true;
      vm.weeklyReportList = [];
      plansService.queryWeekReport(success, param.authority, param.period.date, param.period.date, vm.showLoading);
    }

    function goDetail(weeklyReport) {
      if (baseConfig.debug) {
        console.log('goDetail.weeklyReport ' + angular.toJson(weeklyReport));
      }
      if (param.authority == 'MY') {
        $state.go('tab.weekly-report-detail',
          {
            "type": "DETAIL",
            "authority": param.authority,
            "params": {},
            "detail": angular.copy(weeklyReport)
          });
      }
    }
  }
})();
