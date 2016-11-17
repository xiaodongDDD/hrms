/**
 * Created by gusenlin on 16/8/7.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.timesheet-batch-write', {
          url: '/timesheet-batch-write',
          params: {dayRange: {}},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/timesheet/batch/batch-write.html',
              controller: 'TimeSheetBatchWriteCtrl'
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
  .controller('TimeSheetBatchWriteCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$ionicModal',
    '$ionicHistory',
    '$timeout',
    'baseConfig',
    'TimeSheetService',
    '$ionicScrollDelegate',
    'hmsPopup',
    function ($scope,
              $state,
              $stateParams,
              $ionicModal,
              $ionicHistory,
              $timeout,
              baseConfig,
              TimeSheetService,
              $ionicScrollDelegate,
              hmsPopup) {

      var checked = 'ion-ios-checkmark';
      var unchecked = 'ion-ios-circle-outline'
      $scope.projectList = [];
      $scope.addressList = [];
      $scope.approver = [];
      var editable = 'N';
      $scope.searchProjectName = {"value": ""};

      var dayRange = $stateParams.dayRange;

      if (baseConfig.debug) {
        console.log('dayRange ' + angular.toJson(dayRange));
      }

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

      $scope.timeSheetBatchDetail = {
        "dayRange": {},
        "travelingAllowance": {},
        "normalAllowance": {},
        "includeWeekend": {},
        "extChargeIncludeWeekend": {},
        "currentProject": {},
        "currentAddress": {},
        "approver": "",
        "description": ""
      };

      $scope.timeSheetBatchDetail.dayRange = {
        "dayRange": $stateParams.dayRange,
        "dayRangeDesc": $stateParams.dayRange.dateFrom + '~' + $stateParams.dayRange.dateTo
      }

      var uncheckedJson = function () {
        var json = {flag: false, style: unchecked};
        return json;
      };

      var checkedJson = function () {
        var json = {flag: true, style: checked};
        return json;
      };


      $scope.timeSheetBatchDetail.travelingAllowance = uncheckedJson();
      $scope.timeSheetBatchDetail.normalAllowance = uncheckedJson();
      $scope.timeSheetBatchDetail.includeWeekend = checkedJson();
      $scope.timeSheetBatchDetail.extChargeIncludeWeekend = uncheckedJson();

      $scope.projectListModalHandle = {
        selectProjectType: function (type) {
          var changeProject = true;

          if (baseConfig.debug) {
            console.log('projectListModalHandle.type ' + angular.toJson(type));
            console.log('projectListModalHandle.projectCategory ' + angular.toJson($scope.projectCategory));
          }

          angular.forEach($scope.projectListType, function (data) {
            if (data.id == type.id && data.selected == true) {
              changeProject = false;
            }
          });

          if (!changeProject && $scope.currentProjectListCategory.length > 0) {
            return;
          }

          $scope.searchProjectName.value = '';
          $ionicScrollDelegate.$getByHandle('projectModalHandle').scrollTop();

          angular.forEach($scope.projectListType, function (data) {
            data.selected = false;
          });

          type.selected = true;

          var typeId = type.id;
          if ($scope.projectCategory[typeId]) {
            $scope.currentProjectListCategory = $scope.projectCategory[typeId].array;
          } else {
            $scope.currentProjectListCategory = [];
          }

          if (baseConfig.debug) {
            console.log('$scope.currentProjectListCategory ' + angular.toJson($scope.currentProjectListCategory));
          }
        }
      };

      $scope.checkBoxChanged = function (item, type) {
        if (baseConfig.debug) {
          console.log('$scope.checkBoxChanged item ' + angular.toJson(item));
        }
        if (item.flag) {
          item.flag = false;
          item.style = unchecked;
        } else {
          item.flag = true;
          item.style = checked;
        }

        if (type == 'travelingAllowance' && $scope.timeSheetBatchDetail.travelingAllowance.flag) {
          $scope.timeSheetBatchDetail.normalAllowance = {flag: false, style: unchecked};
        }
        if (type == 'normalAllowance' && $scope.timeSheetBatchDetail.normalAllowance.flag) {
          $scope.timeSheetBatchDetail.travelingAllowance = {flag: false, style: unchecked};
        }
      };


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

      $scope.selectProject = function (project) {
        $scope.addressList = project.address;
        $scope.timeSheetBatchDetail.currentProject = project;
        if (project.address[0]) {
          $scope.timeSheetBatchDetail.currentAddress = project.address[0];
        }
        $scope.timeSheetBatchDetail.approver = project.approver;
        $scope.projectModal.hide();
      };

      $scope.selectAddress = function (address) {
        if (baseConfig.debug) {
          console.log("selectAddress.address " + angular.toJson(address));
        }
        $scope.timeSheetBatchDetail.currentAddress = address;
        $scope.addressModal.hide();
      };

      $scope.hideProjectModal = function () {
        $scope.projectModal.hide();
      };

      $scope.hideAddressModal = function () {
        $scope.addressModal.hide();
      };

      $scope.timeSheetBatchHandle = {
        showProjectModal: function () {

          if (baseConfig.debug) {
            console.log('$scope.timeSheetBatchDetail.currentProject ' + angular.toJson($scope.timeSheetBatchDetail.currentProject));
            console.log('$scope.timeSheetBatchDetail.currentProject.project_type_id ' + $scope.timeSheetBatchDetail.currentProject.project_type_id)
          }

          var porjectTypeId = $scope.timeSheetBatchDetail.currentProject.project_type_id - 1;
          if ($scope.timeSheetBatchDetail.currentProject.project_type_id == '') {
            porjectTypeId = 0
          }
          $scope.projectListModalHandle.selectProjectType($scope.projectListType[porjectTypeId]);

          angular.forEach($scope.projectCategory, function (data) {
            angular.forEach(data.array, function (data1) {
              data1.selected_flag = 'N';
              if (data1.project_id == $scope.timeSheetBatchDetail.currentProject.project_id) {
                data1.selected_flag = 'Y';
              }
            });
          });

          $scope.projectModal.show();
        },
        showAddressModal: function () {
          $scope.addressModal.show();
        },
        submitTimesheet: function (detail) {
          if (baseConfig.debug) {
            console.log('submitTimesheet detail ' + angular.toJson(detail));
          }

          var dataRange = detail.dayRange.dayRange.dateFrom.replace(/-/g, '') + '-' +
            detail.dayRange.dayRange.dateTo.replace(/-/g, '')
          var offBaseFlag = 0;
          var baseFlag = 0;
          var isOffBaseIncludeWeekend = 0;
          var extCharge = 1;
          var includeWeekend = 'N';
          var description = detail.description.replace(/[\n]/g, "\\n").replace(/[\r]/g, "\\r");

          if (detail.travelingAllowance.flag) {
            offBaseFlag = 1;
          }
          if (detail.normalAllowance.flag) {
            baseFlag = 1;
          }
          if (detail.includeWeekend.flag) {
            isOffBaseIncludeWeekend = 1;
          }
          if (detail.extChargeIncludeWeekend.flag) {
            extCharge = 1;
            includeWeekend = 'Y';
          }

          var params = {
            "params": {
              "p_employee": window.localStorage.empno,
              "p_date_from": dataRange + "",
              "p_date_to": "",
              "p_project": detail.currentProject.project_id,
              "p_offbase_flag": offBaseFlag + "",
              "p_base_flag": baseFlag + "",
              "p_ext_charge": extCharge + "",
              "p_int_charge": "",
              "p_include_weekend": includeWeekend + "",
              "p_is_off_base": isOffBaseIncludeWeekend + "",
              "p_address": detail.currentAddress.address_id,
              "p_description": description
            }
          };

          var success = function (result) {
            if (result.status == 'S' || result.status == 'W') {
              if (result.refresh_status == 'S') {
                hmsPopup.showPopup('批量填写成功!');
                $ionicHistory.goBack();
                TimeSheetService.setRefreshTimeSheetFlag(true);
                TimeSheetService.cacheTimeSheetList(result.refresh_timesheet.timesheet);
              } else {
                hmsPopup.showPopup('批量填写成功后获取TimeSheet数据失败! 请手动返回TimeSheet页面!');
              }
            } else {
              if(result.returnMsg){
                hmsPopup.showPopup(result.returnMsg);
              }else{
                hmsPopup.showPopup('批量填写TimeSheet出现错误，请联系管理员！');
              }
            }
          };
          hmsPopup.showLoading('批量填写TimeSheet中');
          TimeSheetService.submitBatchWrite(success, params);
        }
      };

      var timeSheetBatchUtil = function () {
        var self = {};
        self.initProjectList = function () {
          var success = function (result) {
            if (result.status == 'S') {
              $scope.projectList = result.project;
              if (result.project[0]) {
                $scope.addressList = result.project[0].address;
              }
              else {
                $scope.addressList = [{
                  "address_id": 0,
                  "address_name": "缺省地点",
                  "selected_flag": "Y"
                }];
              }

              angular.forEach(result.project, function (data) {
                if (data.selected_id == 'Y') {
                  $scope.timeSheetBatchDetail.currentProject = data;
                  if (data.address[0]) {
                    $scope.timeSheetBatchDetail.currentAddress = data.address[0];
                  }
                  $scope.timeSheetBatchDetail.approver = data.approver;
                }
              });

              if (!$scope.timeSheetBatchDetail.currentProject.project_id) {
                $scope.timeSheetBatchDetail.currentProject = $scope.projectList[0];
                if ($scope.projectList[0].address[0]) {
                  $scope.timeSheetBatchDetail.currentAddress = $scope.projectList[0].address[0];
                }
                $scope.timeSheetBatchDetail.approver = $scope.projectList[0].approver;
              }


              /*添加项目类型的逻辑*/
              $scope.projectCategory = TimeSheetService.processProject(result.project,true);

            } else {
              hmsPopup.showPopup('获取项目信息错误,请检查');
            }
          }
          hmsPopup.showLoading('获取项目信息中');
          TimeSheetService.fetchBatchProjectList(success);
        };
        return self;
      };

      $timeout(function () {
        timeSheetBatchUtil().initProjectList();
      }, 400);
    }
  ])
;
