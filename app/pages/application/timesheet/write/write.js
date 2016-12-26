angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.timesheet-write', {
          url: '/timesheet-write',
          params: {day: {}},
          views: {
            'tab-application': {
              prefetchTemplate: false,
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
    '$rootScope',
    '$state',
    '$stateParams',
    '$ionicModal',
    '$timeout',
    '$ionicHistory',
    '$ionicScrollDelegate',
    'baseConfig',
    'TimeSheetService',
    'hmsPopup',
    function ($scope,
              $rootScope,
              $state,
              $stateParams,
              $ionicModal,
              $timeout,
              $ionicHistory,
              $ionicScrollDelegate,
              baseConfig,
              TimeSheetService,
              hmsPopup) {

      var checked = 'ion-ios-checkmark';
      var unchecked = 'ion-ios-circle-outline'
      $scope.projectList = [];
      $scope.addressList = [];
      $scope.flybackList = [];
      var editable = 'N';

      $scope.searchProjectName = {"value": ""};

      //var uncheckedJson = {flag: false, style: unchecked};
      //var checkedJson = {flag: true, style: checked};

      var uncheckedJson = function () {
        var json = {flag: false, style: unchecked};
        return json;
      }

      var checkedJson = function () {
        var json = {flag: true, style: checked};
        return json;
      };

      $scope.projectCategory = {};
      $scope.projectListType = [
        {
          "id": "1",
          "name": "客户项目",
          "selected": true
        },
        {
          "id": "2",
          "name": "预销售",
          "selected": false
        },
        {
          "id": "3",
          "name": "内部项目",
          "selected": false
        }];
      $scope.currentProjectListCategory = [];


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
        intCharge: {flag: false, style: unchecked}, //ion-ios-checkmark
        extCharge: {flag: false, style: unchecked}, //ion-ios-checkmark
        description: ""
      };

      if (baseConfig.debug) {
        console.log('$stateParams.day ' + angular.toJson($stateParams.day));
      }

      $scope.lockFlag = $stateParams.day.lockFlag;

      $scope.currentDate = $stateParams.day.each_day;

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

      $scope.selectAddress = function (address) {
        if (baseConfig.debug) {
          console.log("selectAddress.address " + angular.toJson(address));
        }
        $scope.timesheetDetail.currentAddress = address;
        $scope.addressModal.hide();
      };

      $scope.selectFlyback = function (flyback) {
        if (baseConfig.debug) {
          console.log("selectAddress.flyback " + angular.toJson(flyback));
        }
        $scope.timesheetDetail.currentFlyback = flyback;
        $scope.flybackModal.hide();
      };

      //处理项目LOV界面中的项目数据
      $scope.projectListModalHandle = {
        //选择项目类型
        selectProjectType: function (type) {
          var changeProject = true;

          if (baseConfig.debug) {
            console.log('projectListModalHandle.type ' + angular.toJson(type))
            console.log('$scope.projectListType ' + angular.toJson($scope.projectListType))
          }

          angular.forEach($scope.projectListType, function (data) {
            if (data.id == type.id && type.selected == true) {
              changeProject = false;
            }
          });

          if (!changeProject && $scope.currentProjectListCategory.length>0) {
            return;
          }

          $scope.searchProjectName.value = '';
          $ionicScrollDelegate.$getByHandle('projectModalHandle').scrollTop();

          angular.forEach($scope.projectListType, function (data) {
            data.selected = false;
          });

          type.selected = true;

          var typeId = type.id;
          if($scope.projectCategory[typeId]){
            $scope.currentProjectListCategory = $scope.projectCategory[typeId].array;
          }else{
            $scope.currentProjectListCategory = [];
          }

          if(baseConfig.debug){
            console.log('$scope.currentProjectListCategory ' + angular.toJson($scope.currentProjectListCategory));
          }
        }
      };

      //选择项目Lov中的项目
      $scope.selectProject = function (project) {
        if (baseConfig.debug) {
          console.log("selectAddress.project " + angular.toJson(project));
        }
        $scope.timesheetDetail.currentProject = project;
        $scope.projectModal.hide();

        var success = function (result) {
          hmsPopup.hideLoading();
          if (result.status == 'S') {
            $scope.addressList = result.projaddress;
            $scope.flybackList = result.flyback;
            $scope.timesheetDetail.approver = result.approver;
            $scope.timesheetDetail.travelingAllowance = {flag: false, style: unchecked};
            $scope.timesheetDetail.normalAllowance = {flag: false, style: unchecked};
            if (result.projaddress[0]) {
              $scope.timesheetDetail.currentAddress = result.projaddress[0];
            } else {
              $scope.timesheetDetail.currentAddress = {"selected_flag": "Y", "address_id": "0", "address_name": "缺省地点"};
            }
            if (result.flyback[0]) {
              $scope.timesheetDetail.currentFlyback = result.flyback[0];
            } else {
              $scope.timesheetDetail.currentFlyback = {"fly_select": "Y", "fly_name": "无flyback", "fly_id": "-1"};
            }
          } else {
            hmsPopup.showPopup('获取项目信息错误,请检查');
          }
        }
        $timeout(function () {
          hmsPopup.showLoading('获取项目信息中');
          TimeSheetService.fetchProjectDetailInfo(success, $scope.currentDate, project.project_id)
        });
      };

      $scope.showProjectModal = function () {

        if(baseConfig.debug){
          console.log('$scope.timesheetDetail.currentProject ' + angular.toJson($scope.timesheetDetail.currentProject));
          console.log('$scope.timesheetDetail.currentProject.project_type_id ' + $scope.timesheetDetail.currentProject.project_type_id)
        }

        var porjectTypeId = $scope.timesheetDetail.currentProject.project_type_id -1;
        if($scope.timesheetDetail.currentProject.project_type_id == ''){
          porjectTypeId = 0
        }
        $scope.projectListModalHandle.selectProjectType($scope.projectListType[porjectTypeId]);

        angular.forEach($scope.projectCategory, function (data) {
          angular.forEach(data.array, function (data1) {
            data1.selected_flag = 'N';
            if (data1.project_id == $scope.timesheetDetail.currentProject.project_id) {
              data1.selected_flag = 'Y';
            }
          });
        });

        $scope.projectModal.show();
      };
      $scope.hideProjectModal = function () {
        $scope.projectModal.hide();
      };

      $scope.showFlybackModal = function () {
        $scope.flybackModal.show();
      };
      $scope.hideFlybackModal = function () {
        $scope.flybackModal.hide();
      };

      $scope.showAddressModal = function () {
        $scope.addressModal.show();
      };
      $scope.hideAddressModal = function () {
        $scope.addressModal.hide();
      };

      var fetchEachDay = function (result) {
        hmsPopup.hideLoading();
        if (result.status == 'S') {
          var projectList = result.project;
          var flybackList = result.flyback;
          var addressList = result.projaddress;

          if (baseConfig.debug) {
            console.log('fetchEachDay result.every_day ' + angular.toJson(result.every_day));
          }

          //判断是否可编辑 // add by ciwei
          if (result.every_day.holiday == 'Y') {
            editable = 'Y';
          } else if (result.every_day.holiday == 'N') {
            editable = 'N';
          }

          if (result.every_day.offbase == '1') {
            $scope.timesheetDetail.travelingAllowance = checkedJson();
          } else {
            $scope.timesheetDetail.travelingAllowance = uncheckedJson();
          }
          if (result.every_day.base == 'Y') {
            $scope.timesheetDetail.normalAllowance = checkedJson();
          } else {
            $scope.timesheetDetail.normalAllowance = uncheckedJson();
          }

          //判断内外部计费是否被选中
          if (result.every_day.internalcharge == '1') {
            $scope.timesheetDetail.intCharge = checkedJson();
          } else {
            $scope.timesheetDetail.intCharge = uncheckedJson();
          }
          if (result.every_day.externalcharge == '1') {
            $scope.timesheetDetail.extCharge = checkedJson();
          } else {
            $scope.timesheetDetail.extCharge = uncheckedJson();
          }

          $scope.timesheetDetail.currentDay = result.every_day.every_day;
          $scope.timesheetDetail.approver = result.every_day.approver;
          $scope.timesheetDetail.description = result.every_day.descrpt;
          $scope.timesheetDetail.allowance = result.every_day.allowance;

          angular.forEach(projectList, function (data) {
            if (data.selected_flag === 'Y') {
              $scope.timesheetDetail.currentProject = data;
              $scope.timesheetDetail.approver = data.approver;
              return;
            }
          });
          angular.forEach(addressList, function (data) {
            if (data.selected_flag === 'Y') {
              $scope.timesheetDetail.currentAddress = data;
              return;
            }
          });
          angular.forEach(flybackList, function (data) {
            if (data.fly_select === 'Y') {
              $scope.timesheetDetail.currentFlyback = data;
              return;
            }
          });

          $scope.projectList = projectList;
          $scope.addressList = addressList;
          $scope.flybackList = flybackList;
          $scope.projectCategory = TimeSheetService.processProject(projectList);


        }
        else {
          if (result.message) {
            hmsPopup.showPopup(result.message);
          } else {
            hmsPopup.showPopup('填写TimeSheet出现错误，请联系管理员！');
          }
        }
      };

      $scope.checkBoxChanged = function (item, type) {
        console.log('$scope.checkBoxChanged item ' + angular.toJson(item));
        if (editable == "N" && type == 'charging') {
          return;
        }
        if (item.flag) {
          item.flag = false;
          item.style = unchecked;
        } else {
          item.flag = true;
          item.style = checked;
        }
        if (type == 'travelingAllowance' && $scope.timesheetDetail.travelingAllowance.flag) {
          $scope.timesheetDetail.normalAllowance = {flag: false, style: unchecked};
        }
        if (type == 'normalAllowance' && $scope.timesheetDetail.normalAllowance.flag) {
          $scope.timesheetDetail.travelingAllowance = {flag: false, style: unchecked};
        }
      };

      $scope.submitTimesheet = function (timesheetDetail) {
        if (baseConfig.debug) {
          console.log('timesheetDetail ' + angular.toJson(timesheetDetail));
        }

        var employee = window.localStorage.empno;
        var currentDate = $scope.currentDate;
        var projectId = $scope.timesheetDetail.currentProject.project_id;
        var description = '';
        var offBaseFlag = '';
        var baseFlag = '';
        var extCharge = '';
        var intCharge = '';
        var addressId = $scope.timesheetDetail.currentAddress.address_id;
        var flybackId = $scope.timesheetDetail.currentFlyback.fly_id;

        //内外部计费
        if ($scope.timesheetDetail.extCharge.flag) {
          extCharge = 1;
        } else {
          extCharge = 0;
        }
        if ($scope.timesheetDetail.intCharge.flag) {
          intCharge = 1;
        } else {
          intCharge = 0;
        }
        if ($scope.timesheetDetail.travelingAllowance.flag) {
          offBaseFlag = 1;
        } else {
          offBaseFlag = 0;
        }
        if ($scope.timesheetDetail.normalAllowance.flag) {
          baseFlag = 1;
        } else {
          baseFlag = 0;
        }

        description = $scope.timesheetDetail.description.replace(/[\n]/g, "\\n").replace(/[\r]/g, "\\r");

        if (baseConfig.debug) {
          console.log('$scope.timesheetDetail.description ' + $scope.timesheetDetail.description);
          console.log('description ' + description);
        }

        var params = {
          "params": {
            "p_employee": employee + "",
            "p_date": currentDate + "",
            "p_project": projectId + "",
            "p_description": description + "",
            "p_offbase_flag": offBaseFlag + "",
            "p_base_flag": baseFlag + "",
            "p_ext_charge": extCharge + "",
            "p_int_charge": intCharge + "",
            "p_address": addressId + "",
            "p_flyback": flybackId + ""
          }
        };

        if (baseConfig.debug) {
          console.log('submitTimesheet.params ' + angular.toJson(params));
        }

        var success = function (result) {
          hmsPopup.hideLoading();
          if (result.status == 'S') {
            //hmsPopup.showPopup('提交Timesheet成功');
            //$rootScope.$broadcast('refreshTimesheet', 'parent');
            $ionicHistory.goBack();
            TimeSheetService.setRefreshTimeSheetFlag(true);
            TimeSheetService.cacheTimeSheetList(result.refresh_timesheet.timesheet);
          } else {
            hmsPopup.showPopup('提交Timesheet错误,错误原因为');
          }
        }
        hmsPopup.showLoading('提交数据中');
        TimeSheetService.submitTimesheet(success, params)
      };

      //从服务器获取请求
      $timeout(
        function () {
          hmsPopup.showLoading('获取timesheet明细数据');
          TimeSheetService.fetchEachDay(fetchEachDay, $scope.currentDate);
        }
      );
    }
  ])
;
