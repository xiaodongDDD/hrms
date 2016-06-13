angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.timesheet-write', {
          url: '/timesheet-write',
          params: {day: {}},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/timesheet/write/write.html',
              controller: 'TimeSheetWriteCtrl'
            }
          }
        });
    }]);

/**
 * @ngdoc controller
 * @name TimeSheetWriteCtrl
 * @module applicationModule
 * @description
 *
 * @author
 * gusenlin
 */
angular.module('applicationModule')
  .controller('TimeSheetWriteCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$ionicModal',
    '$timeout',
    'baseConfig',
    'TimeSheetService',
    'hmsPopup',
    function ($scope,
              $state,
              $stateParams,
              $ionicModal,
              $timeout,
              baseConfig,
              TimeSheetService,
              hmsPopup) {

      var checked = 'ion-ios-checkmark';
      var unchecked = 'ion-ios-circle-outline'
      $scope.projectList = [];
      $scope.addressList = [];
      $scope.flybackList = [];

      //初始化timesheet填写界面字段
      $scope.timesheetDetail =
      {
        currentDay: "",
        approver: "",
        currentProject: {},
        currentAddress: {},
        currentFlyback: {},
        travelingAllowance: {flag: false, style: unchecked},
        normalAllowance: {flag: false, style: unchecked},
        charging: {flag: false, style: unchecked}, //ion-ios-checkmark
        description: ""
      };

      if (baseConfig.debug) {
        console.log('$stateParams.day ' + angular.toJson($stateParams.day));
      }

      //加载项目画面
      $ionicModal.fromTemplateUrl('build/pages/application/timesheet/write/modal/projectModal.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.projectModal = modal;
      });

      //加载项目地点画面
      $ionicModal.fromTemplateUrl('build/pages/application/timesheet/write/modal/addressModal.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.addressModal = modal;
      });

      //加载机票补贴画面
      $ionicModal.fromTemplateUrl('build/pages/application/timesheet/write/modal/flybackList.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.flybackModal = modal;
      });

      $scope.showProjectModal = function () {
        $scope.projectModal.show();
      }
      $scope.hideProjectModal = function () {
        $scope.projectModal.hide();
      }

      $scope.showFlybackModal = function () {
        $scope.flybackModal.show();
      }
      $scope.hideFlybackModal = function () {
        $scope.flybackModal.hide();
      }

      $scope.showAddressModal = function () {
        $scope.addressModal.show();
      }
      $scope.hideAddressModal = function () {
        $scope.addressModal.hide();
      }



      var fetchEachDay = function (result) {
        hmsPopup.hideLoading();
        if(result.status == 'S'){
          var projectList = result.project;
          var flybackList = result.flyback;
          var addressList = result.projaddress;

          if(result.every_day.offbase ==='1'){
            $scope.timesheetDetail.travelingAllowance = {flag: true, style: checked};
          }else{
            $scope.timesheetDetail.travelingAllowance = {flag: false, style: unchecked};
          }

          if(result.every_day.base ==='Y'){
            $scope.timesheetDetail.normalAllowance = {flag: true, style: checked};
          }else{
            $scope.timesheetDetail.normalAllowance = {flag: false, style: unchecked};
          }

          if(result.every_day.externalcharge === '1'){
            $scope.timesheetDetail.charging = {flag: true, style: checked};
          }else{
            $scope.timesheetDetail.charging = {flag: false, style: unchecked};
          }

          $scope.timesheetDetail.currentDay = result.every_day.every_day;
          $scope.timesheetDetail.approver = result.every_day.approver;
          $scope.timesheetDetail.description = result.every_day.descrpt;
          $scope.timesheetDetail.allowance = result.every_day.allowance;

          angular.forEach(projectList,function(data){
            if(data.selected_flag === 'Y'){
              $scope.timesheetDetail.currentProject = data;
              return;
            }
          });
          angular.forEach(addressList,function(data){
            if(data.selected_flag === 'Y'){
              $scope.timesheetDetail.currentAddress = data;
              return;
            }
          });
          angular.forEach(flybackList,function(data){
            if(data.fly_select === 'Y'){
              $scope.timesheetDetail.currentFlyback = data;
              return;
            }
          });

          $scope.projectList = projectList;
          $scope.addressList = addressList;
          $scope.flybackList = flybackList;
        }
      };

      $scope.checkBoxChanged = function(item,type){
        console.log('$scope.checkBoxChanged item ' + angular.toJson(item));
        if(item.flag){
          item.flag = false;
          item.style = unchecked;
        }else{
          item.flag = true;
          item.style = checked;
        }
        if(type == 'travelingAllowance' && $scope.timesheetDetail.travelingAllowance.flag){
          $scope.timesheetDetail.normalAllowance = {flag: false, style: unchecked};
        }
        if(type == 'normalAllowance' && $scope.timesheetDetail.normalAllowance.flag){
          $scope.timesheetDetail.travelingAllowance = {flag: false, style: unchecked};
        }
      };

      $scope.submitTimesheet = function(timesheetDetail){
        if(baseConfig.debug){
          console.log('timesheetDetail ' + angular.toJson(timesheetDetail));
        }
      };

      $timeout(
        function(){
          hmsPopup.showLoading('获取timesheet明细数据');
          TimeSheetService.fetchEachDay(fetchEachDay);
        }
      );

    }]);
