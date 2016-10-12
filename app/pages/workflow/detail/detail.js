angular.module('myApp')
  .config(['$stateProvider', 'baseConfig',
    function ($stateProvider, baseConfig) {
      $stateProvider
        .state('tab.workflow-detail', {
          url: '/workflow-detail',
          params: {"detail": {}, "processedFlag": {}, "myPrsonalApplicationFlag": false, "type": "", 'fromLock': false},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/workflow/detail/detail.html',
              controller: 'WorkFLowDetailCtrl'
            }
          }
        })
        if(!baseConfig.isWeixinWebview){
          $stateProvider
            .state('workflow-employee', {
              url: 'workflow-employee',
              templateUrl: 'build/pages/contact/detail/employee-detail.html',
              controller: 'contactEmployeeDetailCtl',
              params: {
                'employeeNumber': ""
              }
            })

            .state('tab.tab-application-workflow-employee', {
              url: '/tab-application-workflow-employee',
              views: {
                'tab-application': {
                  templateUrl: 'build/pages/contact/detail/employee-detail.html',
                  controller: 'contactEmployeeDetailCtl'
                }
              },
              params: {
                'employeeNumber': ""
              }
            })
            .state('tab.tab-message-workflow-employee', {
              url: '/tab-message-workflow-employee',
              views: {
                'tab-message': {
                  templateUrl: 'build/pages/contact/detail/employee-detail.html',
                  controller: 'contactEmployeeDetailCtl'
                }
              },
              params: {
                'employeeNumber': ""
              }
            })
            .state('tab.tab-contact-workflow-employee', {
              url: '/tab-contact-workflow-employee',
              views: {
                'tab-contact': {
                  templateUrl: 'build/pages/contact/detail/employee-detail.html',
                  controller: 'contactEmployeeDetailCtl'
                }
              },
              params: {
                'employeeNumber': ""
              }
            })
            .state('tab.tab-myInfo-workflow-employee', {
              url: '/tab-myInfo-workflow-employee',
              views: {
                'tab-myInfo': {
                  templateUrl: 'build/pages/contact/detail/employee-detail.html',
                  controller: 'contactEmployeeDetailCtl'
                }
              },
              params: {
                'employeeNumber': ""
              }
            });
        }
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
  .controller('WorkFLowDetailCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$ionicModal',
    '$timeout',
    '$ionicScrollDelegate',
    '$ionicActionSheet',
    '$filter',
    'baseConfig',
    // 'TimeSheetService',
    'workFLowListService',
    'hmsPopup',
    '$ionicHistory',
    'HmsDateFormat',
    'hmsHttp',
    '$ionicPopup',
    function ($scope,
              $state,
              $stateParams,
              $ionicModal,
              $timeout,
              $ionicScrollDelegate,
              $ionicActionSheet,
              $filter,
              baseConfig,
              // TimeSheetService,
              workFLowListService,
              hmsPopup,
              $ionicHistory,
              HmsDateFormat,
              hmsHttp,
              $ionicPopup) {
      $scope.isWeixinWebview = baseConfig.isWeixinWebview;
      if($scope.isWeixinWebview){
        $scope.inputIosStyle = function(){
          if(ionic.Platform.isIOS()){
            return {
              '-webkit-appearance': 'none',
              '-ms-progress-appearance': 'none',
              '-moz-appearance': 'none',
              'appearance': 'none'
            }
          } else {
            return {}
          }
        }
      }

      if (ionic.Platform.isIOS() && $scope.isWeixinWebview){
        if(document.setTitle){
          document.setTitle('工作流详情');
        }
      }

      $scope.myPrsonalApplicationFlag = $stateParams.myPrsonalApplicationFlag;
      $scope.showBackbtn = true;
      //$scope.showBackbtn = $stateParams.fromLock;
      $scope.currentDetail = $stateParams.detail; //传过来的数据块
      var detail = $stateParams.detail;//传过来的数据块
      var processedFlag = $stateParams.processedFlag; //已经审批和未审批的标记
      var multipleArrayList = [];

      if (baseConfig.debug) {
        console.log('WorkFLowDetailCtrl.detail ' + angular.toJson(detail));
        console.log('WorkFLowDetailCtrl.processedFlag ' + processedFlag);
      }

      var historyEachWidth = 102;

      var workflowIdSpecial = {
        "renewContractWorkflowId": "100728",
        "applicationFullMemberWorkflowId": "10008",
        "openProjectWorkflowId": "10206"
      }

      $scope.LoadingPushData = true;
      $scope.LoadingModalData = true;

      //var detailScroll = angular.element('#workflowDetailScroll');
      //var detailHistory = angular.element('#workflowDetailHistory');

      if($scope.isWeixinWebview){
        $scope.workflowDetailScroll = {
          "width": (document.body.clientWidth -20) + "px",
          "height": "139px"
        };
      } else {
        $scope.workflowDetailScroll = {
          "width": document.body.clientWidth
        };
      }

      $scope.workflowDetailHistory = {};

      //控制需要显示的数据模块
      $scope.showList = {
        contractRenewShowFlag: false, //合同续签地址回写数据块,
        applicationFullMemberShowFlag: false, //转正申请数据块
      }

      $scope.actionType = {
        "approve": "0",
        "reject": "-1",
        "back": "2",
        "transmit": "3"
      };

      $scope.renewContract = {
        "method": "",
        "address": "",
      };
      $scope.renewContractMethodList = [];
      $scope.renewContractSaveFlag = false;
      $scope.newOpenProjectSaveFlag = false;
      $scope.renewContractEditable = false;

      $scope.historyList = [];
      $scope.singalArrayList = [];
      $scope.loadingDataFlag = false;
      $scope.multipleLine = [];
      $scope.workflowActionShowFlag = !$stateParams.processedFlag.value;
      $scope.transmitPerson = [];
      $scope.processExtroInfo = {
        "opinion": "",
        "transmitPerson": {
          "code": "",
          "name": ""
        }
      };

      $scope.multpleLine = {
        "editAble": false
      };

      $scope.multLineInputText = {
        "value": ""
      };

      $scope.transmitPersonFilter = {
        "value": ""
      };

      /*------------------转正申请数据源------------------*/
      $scope.applicationEmployeeType = {
        "agree": {"selected": false, "value": "1"},
        "reject": {"selected": false, "value": "-1"},
        "notChange": {"selected": false, "value": "0"}
      };
      $scope.applicationEmployeeSaveFlag = false;
      $scope.applicationEmployeeDetail = {};
      $scope.applicationEmployeeInfo = [];
      $scope.applicationEmployeeAbility = [];
      $scope.applicationEmployeeTrial = {};
      $scope.employeeGrade = [
        {item: '100000', value: '优秀'},
        {item: '100001', value: '好'},
        {item: '100002', value: '达标'},
        {item: '100003', value: '待提高'},
        {item: '100004', value: '不满意'}
      ];
      $scope.currentApplicationEmployeeAbility = {};
      /*------------------转正申请数据源------------------*/

      $scope.openProjectDetail = {};

      $scope.currentNeedLov = {};

      var contractRenewal = {
        queryData: function () {
        }
      };

      var analyze = function (currentState) {
        if(!$scope.isWeixinWebview){
          if (currentState.views) {
            if (currentState.views['tab-application']) {
              return 'tab.tab-application-';
            } else if (currentState.views['tab-message']) {
              return 'tab.tab-message-';
            } else if (currentState.views['tab-contact']) {
              return 'tab.tab-contact-';
            } else if (currentState.views['tab-myInfo']) {
              return 'tab.tab-myInfo-';
            }
          }
        }
        return '';
      };

      $scope.goEmployeeDetail = function () {
        if(!$scope.isWeixinWebview){
          if (detail.employeeCode) {
            if ($stateParams.type == 'WORKFLOWDETAIL') {
              $state.go('tab.tab-application-workflow-employee', {"employeeNumber": detail.employeeCode})
            } else {
              $state.go(analyze + '-employee-detail', {"employeeNumber": detail.employeeCode})
            }
          }
        }
      };

      $ionicModal.fromTemplateUrl('build/pages/workflow/detail/modal/data-list.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.dataListModal = modal;
      });//初始化下拉列表的modal

      $ionicModal.fromTemplateUrl('build/pages/workflow/detail/modal/employee-ability.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.abilityGradeModal = modal;
      });//初始化下拉列表的modal

//加载项目画面
      $ionicModal.fromTemplateUrl('build/pages/workflow/detail/modal/transmit-person.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.transmitPersonModal = modal;
      });


// 合并项目选择 modal
      $ionicModal.fromTemplateUrl('project-modal.html', {
        scope: $scope,
      }).then(function (modal) {
        $scope.openProjectModal = modal;
      });
      $scope.showOpenProjectModal = function () {
        $scope.openProjectModal.show();
      };
      $scope.closeOpenProjectModal = function () {
        $scope.openProjectModal.hide();
      };

      $scope.openProjectSearch = function () {
        if ($scope.openProjectDetail.condition == "" || $scope.openProjectDetail.condition == undefined || $scope.openProjectDetail.condition == null) {
          hmsPopup.showShortCenterToast('请输入查询条件!');
        } else {

          var success = function (result) {
            $scope.projectItems = result.project;
          };
          var error = function (response) {
          }
          hmsPopup.showLoading('查询项目中');
          workFLowListService.getProjectData(success, error, $scope.openProjectDetail.condition);
        }
      };

//项目选择与清选
      $scope.openProjectChoose = function (item) {
        $scope.openProjectDetail.projectCode = item.value;
        $scope.openProjectDetail.projectName = item.name;
        $scope.openProjectModal.hide();
      };
      $scope.clearOpenProjectChoose = function () {
        $scope.openProjectDetail.projectCode = '';
        $scope.openProjectDetail.projectName = '';
        $scope.openProjectModal.hide();
      };


// 职位选择 modal
      $ionicModal.fromTemplateUrl('build/pages/workflow/detail/modal/position-modal.html', {
        scope: $scope,
      }).then(function (modal) {
        $scope.positionModal = modal;
      });
      $scope.openPositionModal = function () {
        $scope.positionUtil.getDepartmentData(1000);
        $scope.getPositionData(1000);
        $scope.positionModal.show();
      };
      $scope.closePositionModal = function () {
        $scope.positionModal.hide();
      };

      $scope.getPositionData = function (unitId) {
        var success = function (response) {
          $scope.position = response["position"];
          hmsPopup.hideLoading();
        };
        var error = function (response) {
          hmsPopup.hideLoading();
        };
        hmsPopup.showLoading('获取部门信息');
        workFLowListService.getPositionData(success, error, unitId);
      };

//职位选择与清选
      $scope.positionUtil = {
        positionChoose: function (item) {
          $scope.applicationEmployeeDetail.position = item.name;
          $scope.applicationEmployeeDetail.position_id = item.value;
          ;
          $scope.positionModal.hide();
        },

        clearPositionChoose: function () {
          $scope.applicationEmployeeDetail.position = '';
          $scope.applicationEmployeeDetail.position_id = '';
          //$scope.config.position.value = '';
          $scope.positionModal.hide();
        },

        closePositionModal: function () {
          $scope.positionModal.hide();
        },

        getDepartmentData: function (unitId) {
          var success = function (response) {
            $scope.parent = response.parent[0];
            $scope.child = response.child;
            hmsPopup.hideLoading();
          };
          var error = function (response) {
            hmsPopup.hideLoading();
          };
          hmsPopup.showLoading('获取部门信息');
          workFLowListService.getUnitData(success, error, unitId);
        },

        getParentDepartmentData: function (unitId) {
          var success = function (response) {
            $scope.parent = response.parent[0];
            $scope.child = response.child;
            $scope.getPositionData($scope.parent.value);
          };
          var error = function (response) {
          };
          hmsPopup.showLoading('获取部门信息');
          workFLowListService.getParentUnitData(success, error, unitId);
        }
      };

//选择值列表的数据
      $scope.selectData = function (data) {
        if (detail.workflowId == workflowIdSpecial.renewContractWorkflowId) { //合同续签地址维护
          $scope.renewContract.method = data.item;
          if (data.value == "") {
            $scope.renewContractEditable = true;
            $scope.renewContract.address = '';
          } else {
            $scope.renewContract.address = data.value;
            $scope.renewContractEditable = false;
          }
          $scope.dataListModal.hide();
        } else if (detail.workflowId == workflowIdSpecial.openProjectWorkflowId) {
          $scope.openProjectDetail.openNewProjectFlag = data.value;
          $scope.openProjectDetail.openProjectTypeDesc = data.item;
          $scope.openProjectDetail.projectCode = '';
          $scope.openProjectDetail.projectName = '';
          $scope.dataListModal.hide();
        }
      };

//转正申请功能
      $scope.applicationFullMemberUtil = {
        changeType: function (item, type) {
          var cache = {
            "selected": item.selected
          };
          $scope.applicationEmployeeType.agree.selected = false;
          $scope.applicationEmployeeType.reject.selected = false;
          $scope.applicationEmployeeType.notChange.selected = false;
          item.selected = !cache.selected;
        },
        selectAbilityGrade: function (data) {
          $scope.currentApplicationEmployeeAbility.element_value = data.item;
          $scope.currentApplicationEmployeeAbility.element_desc = data.value;
          $scope.abilityGradeModal.hide();
        },
        showEmployeeGrade: function (ability) {
          $scope.currentApplicationEmployeeAbility = ability;
          $scope.abilityGradeModal.show();
        },
        showDate: function () {
          if(!$scope.isWeixinWebview){
            var options = {
              date: $scope.applicationEmployeeDetail.trialDate,
              mode: 'date',
              titleText: '请选择时间',
              okText: '确定',
              cancelText: '取消',
              doneButtonLabel: '确认',
              cancelButtonLabel: '取消',
              locale: 'zh_cn',
              androidTheme: window.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
            };
            $cordovaDatePicker.show(options).then(function (date) {
              if (date) {
                $scope.applicationEmployeeDetail.date = date;
                $scope.applicationEmployeeDetail.dateString = HmsDateFormat.getDateString(date);
              }
            });
          }
        },
        inputDateStart: function() {
        },
        inputDateIng: function(){
        },
        inputDateEnd: function() {
          if(!$scope.applicationEmployeeDetail.inputDate){
            $scope.applicationEmployeeDetail.inputDate = new Date();
          }

          $scope.applicationEmployeeDetail.date = $scope.applicationEmployeeDetail.inputDate;
          $scope.applicationEmployeeDetail.dateString = HmsDateFormat.getDateString($scope.applicationEmployeeDetail.inputDate);
        },
        //保存转正信息
        savePositiveBlock1: function (Empdetail, Emptype) {
          if (baseConfig.debug) {
            console.log('Empdetail ' + angular.toJson(Empdetail));
            console.log('Emptype ' + angular.toJson(Emptype));
          }

          var trialResult;

          if (Emptype.agree.selected) {
            trialResult = Emptype.agree.value;
          }
          if (Emptype.reject.selected) {
            trialResult = Emptype.reject.value;
          }
          if (Emptype.notChange.selected) {
            trialResult = Emptype.notChange.value;
          }

          var params = {
            "params": {
              "p_instance_id": detail.instanceId + "",
              "p_trial_result": trialResult,
              "p_approve_date": Empdetail.trial_date,
              "p_position_id": Empdetail.position_id
            }
          };

          if (baseConfig.debug) {
            console.log('savePositiveBlock1.params ' + angular.toJson(params));
          }

          var success = function (result) {
            if (result.status == 'S') {
              hmsPopup.showPopup('保存转正信息成功!');
              $scope.applicationEmployeeSaveFlag = true;//标记已经保存
            }
            else {
              hmsPopup.showPopup('保存转正信息失败!');
            }
          };
          var error = function (response) {
          };
          hmsPopup.showLoading('保存转正信息中');
          workFLowListService.savePositiveBlock1(success, error, params);
        },
        saveTrailResult: function (trailResult) {
          if (baseConfig.debug) {
            console.log('saveTrailResult.trailResult ' + angular.toJson(trailResult))
          }
          var trailField;
          angular.forEach(trailResult, function (data) {
            if (data.can_update == '1') {
              trailField = data;
            }
          });

          var success = function (result) {
            if (result.status == 'S') {
              hmsPopup.showPopup('保存转正评价成功!');
            }
            else {
              hmsPopup.showPopup('保存转正评价失败!');
            }
          };
          var error = function (response) {
          };
          hmsPopup.showLoading('保存转正评价中');
          if (baseConfig.debug) {
            console.log('saveTrailResult.trailField ' + angular.toJson(trailField));
          }
          workFLowListService.savePositiveBlock3(success, error, detail.instanceId, trailField.field_id, trailField.field_value);
        },
        saveAbility: function (ability) {
          if (baseConfig.debug) {
            console.log('saveTrailResult.saveAbility ' + angular.toJson(ability))
          }

          var validateFlag = true;

          var abilityArray = [];
          angular.forEach(ability, function (data) {
            if (!data.element_value || data.element_value == '') {
              validateFlag = false;
            }
            var abilityItem = {
              "element_name": data.element_name,
              "element_id": data.element_id,
              "element_value": data.element_value
            };
            abilityArray.push(abilityItem);
          });

          if (!validateFlag) {
            hmsPopup.showPopup('请填写完正的考评结果信息!');
            return;
          }

          var success = function (result) {
            if (result.status == 'S') {
              hmsPopup.showPopup('保存考评结果成功!');
            }
            else {
              hmsPopup.showPopup('保存考评结果失败!');
            }
          };
          var error = function (response) {
          };
          hmsPopup.showLoading('保存考评结果中');
          workFLowListService.savePositiveBlock2(success, error, detail.instanceId, abilityArray);
        }
      };

//转正申请功能包
      var applicationFullMember = function () {
        var __self = {};
        __self.query = function () {
          var success = function (result) {
            if (baseConfig.debug) {
              console.log('applicationFullMember.getWorkflowDetailresult ' + angular.toJson(result));
            }

            if (result.status == 'S') {
              $scope.historyList = result.history;
              workflowDetail().setWorkflowDetailHistoryWidth(result.history.length);
              //判断是否有工作流明细数据
              if (result.workflow_data && result.workflow_data.details.detail) {
                $scope.applicationEmployeeDetail = result.workflow_data.details.detail;
                $scope.applicationEmployeeDetail.showFlag = true;

                if ($scope.applicationEmployeeDetail.comments) {
                  if ($scope.applicationEmployeeDetail.comments == $scope.applicationEmployeeType.agree.value) {
                    $scope.applicationEmployeeType.agree.selected = true;
                  } else if ($scope.applicationEmployeeDetail.comments == $scope.applicationEmployeeType.reject.value) {
                    $scope.applicationEmployeeType.reject.selected = true;
                  } else if ($scope.applicationEmployeeDetail.comments == $scope.applicationEmployeeType.notChange.value) {
                    $scope.applicationEmployeeType.notChange.selected = true;
                  } else {
                    $scope.applicationEmployeeType.agree.selected = true;
                  }
                }
                try {
                  if ($scope.applicationEmployeeDetail.trial_date != "") {
                    $scope.applicationEmployeeSaveFlag = true;//标记已经保存
                    var dateString = $scope.applicationEmployeeDetail.trial_date.replace(/-/g, "/");
                    $scope.applicationEmployeeDetail.trialDate = new Date(dateString);
                  } else {
                    $scope.applicationEmployeeDetail.trialDate = new Date();
                    $scope.applicationEmployeeDetail.inputDate = new Date();
                    $scope.applicationEmployeeDetail.trial_date =
                      HmsDateFormat.getDateString($scope.applicationEmployeeDetail.trialDate);
                  }
                } catch (e) {
                }
                $scope.applicationEmployeeInfo = result.workflow_data.testResult.detail;
                $scope.applicationEmployeeAbility = result.workflow_data.testResult.record;
                $scope.applicationEmployeeTrial = result.workflow_data.trialSummary.summary;

                angular.forEach($scope.applicationEmployeeAbility, function (data) {
                  if (data.element_value == '100000') {
                    data.element_desc = '优秀';
                  }
                  else if (data.element_value == '100001') {
                    data.element_desc = '好';
                  }
                  else if (data.element_value == '100002') {
                    data.element_desc = '达标';
                  }
                  else if (data.element_value == '100003') {
                    data.element_desc = '待提高';
                  }
                  else if (data.element_value == '100004') {
                    data.element_desc = '不满意';
                  }
                });
              }
            }

            $scope.LoadingModalData = false;
          };
          workFLowListService.getWorkflowDetail(success, detail.workflowId, detail.instanceId, workflowDetail().getSubmitFlag());
        };
        __self.init = function () {

        }

        return __self;
      };

//合通续签功能
      $scope.renewContractUtil = {
        showDataList: function () {
          $scope.dataTitle = '合同续签方式维护方式';
          $scope.dataList = [];
          angular.forEach($scope.renewContractMethodList, function (data) {
            var item = {
              "item": data.renewMethod,
              "value": data.defaultRenewAddress
            };
            $scope.dataList.push(item);
          });

          $scope.dataListModal.show();
        },
        submit: function () {
          if (!$scope.renewContract.address && $scope.renewContract.address == "") {
            hmsPopup.showPopup('请填写邮寄地址!');
            return;
          }
          var success = function (result) {
            if (result.returnCode == 'S') {
              $scope.renewContractSaveFlag = true;
              hmsPopup.showPopup('保存邮寄地址成功!');
            }
            else {
            }
          };
          var error = function (response) {
          };
          hmsPopup.showLoading('提交合同续签数据中');
          var params = {
            "params": {
              "p_employee_number": window.localStorage.empno + "",
              "p_instance_id": detail.instanceId + "",
              "p_renewmethod": $scope.renewContract.method + "",
              "p_renewaddress": $scope.renewContract.address + ""
            }
          };
          workFLowListService.contractRenewalSubmit(success, error, params);
        }
      };

//合通续签功能包
      var renewContract = function () {
        var __self = {};
        __self.query = function () {
          var success = function (result) {
            if (result.returnCode == 'S') {
              $scope.renewContract.method = result.returnData.renewMethod;
              $scope.renewContract.address = result.returnData.renewAddress;
              $scope.renewContractMethodList = result.returnData.renewMethodList;
              if (result.returnData.renewAddress && result.returnData.renewAddress != "") {
                $scope.renewContractSaveFlag = true;
              }
            }
            else {
            }
            $scope.LoadingModalData = false;
          };
          var error = function (response) {
          };
          workFLowListService.contractRenewalQuery(success, error, detail.instanceId);
        };
        return __self;
      };

//新建项目
      $scope.openProjectUtil = {
        openProjectTypeShow: function () {
          $scope.dataTitle = '新开项目或者合并项目';
          $scope.dataList = [{
            "item": "新开项目",
            "value": "0"
          },
            {
              "item": "合并项目",
              "value": "1"
            }];
          $scope.dataListModal.show();
        },
        saveOpenProject: function (openProjectDetail) {
          if (baseConfig.debug) {
            console.log('saveOpenProject.openProjectDetail ' + angular.toJson(openProjectDetail));
          }

          if (openProjectDetail.projectCode == '' || !openProjectDetail.projectCode ||
            openProjectDetail.projectName == '' || !openProjectDetail.projectName) {
            hmsPopup.showPopup('请填写完整的新建项目信息!');
            return;
          }

          var success = function (response) {
            if (response.status == 'S') {
              hmsPopup.showPopup('提交新建项目信息成功!');
              $scope.newOpenProjectSaveFlag = true;
            }
            else {
              hmsPopup.showPopup('提交新建项目信息失败!');
            }
          };
          var error = function (response) {
          };
          hmsPopup.showLoading('提交新建项目信息中');
          workFLowListService.saveNewProjectApplyData(success, error, detail.instanceId,
            openProjectDetail.projectCode, openProjectDetail.projectName,
            openProjectDetail.amount, openProjectDetail.openNewProjectFlag);
        }
      };

//新建项目
      var openProject = function () {
        var self = {};
        self.init = function (projectData) {
          $scope.openProjectDetail.amount = projectData.expenses;
          $scope.openProjectDetail.projectCode = projectData.pact_code;
          $scope.openProjectDetail.projectName = projectData.project_name;
          $scope.openProjectDetail.showFlag = true;
          if (projectData.pact_code && projectData.pact_code != '') {
            $scope.newOpenProjectSaveFlag = true;
          }
          if (projectData.merge_flag == '0') {
            $scope.openProjectDetail.openProjectTypeDesc = '新开项目';
            $scope.openProjectDetail.openNewProjectFlag = '0';
          }
          else if (projectData.merge_flag == '1') {
            $scope.openProjectDetail.openProjectTypeDesc = '合并项目';
            $scope.openProjectDetail.openNewProjectFlag = '1';
          }
          else {
            $scope.openProjectDetail.openProjectTypeDesc = '新开项目';
            $scope.openProjectDetail.openNewProjectFlag = '0';
          }
        };
        return self;
      };

//通用工作流
      $scope.workflowDetailUtil = {

        goUrl: function (url) {
          window.open(url, '_system', 'location=yes');
        },
        //对表单数据进行缩放
        showContent: function (array, $event) {
          var detail = $ionicScrollDelegate.$getByHandle('workflowDetailHandle').getScrollView();
          if (baseConfig.debug) {
            console.log('detail ' + angular.toJson(detail.__clientHeight));
            console.log('$event ' + angular.toJson($event.pageY));
          }

          if (!array.showFlag) {
            array.showFlag = true;
            if ($event.pageY + 15 > detail.__clientHeight) {
              var detailScroll = $ionicScrollDelegate.$getByHandle('workflowDetailHandle').getScrollPosition();
              if (baseConfig.debug) {
                console.log('detailScroll ' + angular.toJson(detailScroll));
              }
              var detailScroll1 = $ionicScrollDelegate.$getByHandle('workflowDetailHandle').scrollTo(0, (detailScroll.top + 300), true);
              //$ionicScrollDelegate.$getByHandle('workflowDetailHandle').scrollBottom(true);
            }
          } else {
            array.showFlag = false;
          }
          $ionicScrollDelegate.resize();
        },
        //
        selectTransmitPerson: function (person) {
          if (baseConfig.debug) {
            console.log("selectTransmitPerson.person " + angular.toJson(person));
          }
          $scope.processExtroInfo.transmitPerson = person;
          $scope.transmitPersonModal.hide();
        },
        //
        hideTransmitPerson: function () {
          $scope.transmitPersonModal.hide();
        },
        //
        chooseTransmitPerson: function () {
          $scope.transmitPersonModal.show();
        },
        //二维表单上一页操作
        toBack: function (array) {
          if (array.currentPage <= 1) {
            return '';
          } else {
            var currentPage = array.currentPage - 1;
            array.currentPage = currentPage;
            for (var i = 0; i < array.currentArray.length; i++) {
              array.currentArray[i].value = array.arrayList[currentPage - 1].line_values[i].line_value;
            }
          }
        },
        //二维表单下一页操作
        goForward: function (array) {
          if (array.currentPage >= array.arrayList.length) {
            return '';
          } else {
            var currentPage = array.currentPage + 1;
            array.currentPage = currentPage;
            for (var i = 0; i < array.currentArray.length; i++) {
              array.currentArray[i].value = array.arrayList[currentPage - 1].line_values[i].line_value;
            }
          }
        },

        //可以编辑二维表单上一页操作
        toBackEdit: function (array) {
          if (array.currentPage <= 1) {
            return '';
          } else {

            workflowDetail().saveCurrentLine(array);

            var currentPage = array.currentPage - 1;
            array.currentPage = currentPage;
            array.currentArray.lineId = array.arrayList[currentPage - 1].line_id;
            for (var i = 0; i < array.currentArray.array.length; i++) {
              if (array.arrayList[currentPage - 1].line_values[i].lov) {
                array.currentArray.array[i].currentValue = {
                  "value": array.arrayList[currentPage - 1].line_values[i].line_value,
                  "name": ""
                }
              } else {
                array.currentArray.array[i].value = array.arrayList[currentPage - 1].line_values[i].line_value;
              }
            }
          }
        },
        //可以编辑二维表单下一页操作
        goForwardEdit: function (array) {
          if (array.currentPage >= array.arrayList.length) {
            return '';
          } else {
            workflowDetail().saveCurrentLine(array);
            var currentPage = array.currentPage + 1;
            array.currentPage = currentPage;
            array.currentArray.lineId = array.arrayList[currentPage - 1].line_id;
            for (var i = 0; i < array.currentArray.array.length; i++) {
              if (array.arrayList[currentPage - 1].line_values[i].lov) {
                array.currentArray.array[i].currentValue = {
                  "value": array.arrayList[currentPage - 1].line_values[i].line_value,
                  "name": ""
                }
              } else {
                array.currentArray.array[i].value = array.arrayList[currentPage - 1].line_values[i].line_value;
              }
            }
          }
        },

        //提交工作流数据
        submitAction: function (actionType) {
          if (baseConfig.debug) {
            console.log('actionType ' + actionType);
          }
          if (workflowDetail().validateWorkFlowAction(actionType)) {
          } else {
            return '';
          }

          if (actionType == $scope.actionType.back) {
            workflowDetail().goBackAction();
            return '';
          }

          var employeeCode = window.localStorage.empno;
          var opinion = $scope.processExtroInfo.opinion;
          if (actionType == $scope.actionType.transmit) {
            employeeCode = $scope.processExtroInfo.transmitPerson.code;
          }
          var params = {
            "params": {
              p_action_type: actionType + "",
              p_attr1: "",
              p_attr2: "",
              p_attr3: "",
              p_attr4: "",
              p_attr5: "",
              p_comment: opinion + "",
              p_desc: opinion + "",
              p_employee_code: employeeCode + "",
              p_record_id: detail.recordId + ""
            }
          };
          var success = function (result) {
            if (result.status == 'S') {
              hmsPopup.showPopup('处理工作流成功!');
              if ($stateParams.type == 'WORKFLOWDETAIL') {
                workFLowListService.setRefreshWorkflowList(true);
              }
              $ionicHistory.goBack();
            }
            else {
              hmsPopup.showPopup('处理工作流失败!');
            }
          };
          var error = function (response) {
          };

          var submit = function (buttonIndex) {
            if (baseConfig.debug) {
              console.log('You selected button ' + buttonIndex);
            }
            if (buttonIndex == 1) {
              hmsPopup.showLoading('处理工作流中');
              workFLowListService.submitAction(success, error, params);
            } else {
            }
          }
          hmsPopup.confirm("是否确认提交工作流?", "", submit);
        },
        //查询转交人数据
        searchTransmitPerson: function () {
          if (baseConfig.debug) {
            console.log('$scope.transmitPersonFilter.value ' + $scope.transmitPersonFilter.value);
          }
          if ($scope.transmitPersonFilter.value == '') {
            return '';
          } else {
            $scope.loadingDataFlag = true;
            var success = function (result) {
              $scope.loadingDataFlag = false;
              if (result.status == 'S') {
                $scope.transmitPerson = result.employeeList;
              }
            };
            var error = function (response) {
            };
            workFLowListService.getTransmitPerson(success, error, $scope.transmitPersonFilter.value);
          }
        },

        needSave: function () {
          var needs = [];
          var lov, datepicker;
          var canSave = true;
          for (var i = 0; i < $scope.needList.length; i++) {
            if ($scope.needList[i].required == 'Y' &&
              (
                ($scope.needList[i].type == 'lov' && ($scope.needList[i].lov.value == '' || $scope.needList[i].lov.value == null)) ||
                ($scope.needList[i].type != 'lov' && ($scope.needList[i].value == '' || $scope.needList[i].value == null))
              )
            ) {
              canSave = false;
              hmsPopup.showPopup('保存失败：必输项不能为空');
              break;
            }
            if ($scope.needList[i].type == 'lov') {
              lov = {
                default: '',
                name: '',
                required: '',
                title: '',
                type: '',
                value: ''
              };
              lov.default = $scope.needList[i].default;
              lov.name = $scope.needList[i].name;
              lov.required = $scope.needList[i].required;
              lov.title = $scope.needList[i].title;
              lov.type = $scope.needList[i].type;
              lov.value = $scope.needList[i].lov.value;
              needs.push(lov);
            } else if ($scope.needList[i].type == 'datepicker') {
              datepicker = {
                default: '',
                name: '',
                required: '',
                title: '',
                type: '',
                value: ''
              };
              datepicker.default = $scope.needList[i].default;
              datepicker.name = $scope.needList[i].name;
              datepicker.required = $scope.needList[i].required;
              datepicker.title = $scope.needList[i].title;
              datepicker.type = $scope.needList[i].type;
              datepicker.value = $scope.needList[i].value;
              needs.push(datepicker);
            } else {
              needs.push($scope.needList[i]);
            }
          }
          if (baseConfig.debug) {
            console.log('needSave needs ' + angular.toJson(needs));
          }
          if (canSave) {
            var url = baseConfig.businessPath + "/wfl_wx_workflow_appr/workflow_save_action";
            var params = {
              params: {
                "p_instance_id": detail.instanceId,
                "p_param_json": '{"need":' + JSON.stringify(needs) + '}'
              }
            };
            hmsPopup.showLoading('保存数据中');
            hmsHttp.post(url, params).success(function (result) {
              hmsPopup.hideLoading();
              if (result.status == 'S') {
                hmsPopup.showPopup('确认信息保存成功');
              } else {
                hmsPopup.showPopup('确认信息保存失败 ' + result.errmsg);
              }
            }).error(function () {
              hmsPopup.hideLoading();
              hmsPopup.showPopup('确认信息保存失败,可能是网络错误');
            });
          }
        },

        showInputFieldScreen: function (title, item) {
          $scope.multLineInputText.value = item.value;
          var inputPopup = $ionicPopup.show({
            template: '<textarea type="text" style="padding:10px;" ng-model="multLineInputText.value" rows="6" >',
            title: '<h4>' + title + '</h4>',
            scope: $scope,
            buttons: [
              {text: '取消'},
              {
                text: '确认',
                type: 'button-positive',
                onTap: function (e) {
                  return true;
                }
              }
            ]
          });
          inputPopup.then(function (res) {
            if (res) {
              item.value = $scope.multLineInputText.value;
            }
            $scope.multLineInputText.value = '';
          });
        },

        checkBoxChange: function (item, lineArray) {
          if (item.value && item.value == '0') {
            item.value = '1';
            for (var i = 0; i < lineArray.length; i++) {
              if (lineArray[i].special == 'Y' && lineArray[i].type == 'input') {
                lineArray[i].required = 'N'
              }
            }
          } else {
            item.value = '0';
            for (var i = 0; i < lineArray.length; i++) {
              if (lineArray[i].special == 'Y' && lineArray[i].type == 'input') {
                lineArray[i].required = 'Y'
              }
            }
          }
        },

        saveEditLine: function (array) {
          if (baseConfig.debug) {
            console.log('saveEditLine array ' + angular.toJson(array));
            console.log('saveEditLine array.currentArray ' + angular.toJson(array.currentArray));
            console.log('saveEditLine array.saveAction ' + angular.toJson(array.saveAction));
          }

          workflowDetail().saveCurrentLine(array);

          if (baseConfig.debug) {
            console.log('saveEditLine array ' + angular.toJson(array));
          }

          var canSave = true;
          for (var i = 0; i < array.arrayList.length; i++) {
            for (var j = 0; j < array.arrayList[i].line_values.length; j++) {
              if (array.arrayList[i].line_values[j].required == 'Y' && array.arrayList[i].line_values[j].line_value == '') {
                canSave = false;
                hmsPopup.showPopup('保存失败：必输项不能为空!');
                break;
              }
            }
          }
          if (canSave) {
            var url = baseConfig.businessPath + '/' + array.saveAction.procedure + '/' + array.saveAction.function;
            var params = {
              params: {
                "p_lines": '{"line":' + JSON.stringify(array.arrayList) + '}'
              }
            };
            hmsPopup.showLoading('保存数据中');
            hmsHttp.post(url, params).success(function (result) {
              hmsPopup.hideLoading();
              if (result.status == 'S') {
                hmsPopup.showPopup('保存成功');
              } else {
                hmsPopup.showPopup('保存失败 ' + result.errmsg);
              }
            }).error(function () {
              hmsPopup.hideLoading();
              hmsPopup.showPopup('保存失败,可能是网络错误');
            });
          }
        }
      };

      var workflowDetail = function () {
        var self = {};


        self.saveCurrentLine = function (array) {
          var currentPage = array.currentPage - 1;
          for (var i = 0; i < array.currentArray.array.length; i++) {
            if (array.arrayList[currentPage].line_values[i].lov) {
              array.arrayList[currentPage].line_values[i].line_value = array.currentArray.array[i].currentValue.value;
            } else {
              array.arrayList[currentPage].line_values[i].line_value = array.currentArray.array[i].value;
            }
          }
        },

          self.submitBackAction = function (backAction) {
            if (baseConfig.debug) {
              console.log('submitBackAction ' + angular.toJson(backAction))
            }

            var opinion = $scope.processExtroInfo.opinion;

            var success = function (result) {
              if (result.status == 'S') {
                hmsPopup.showPopup('处理退回工作流成功!');
                if ($stateParams.type == 'WORKFLOWDETAIL') {
                  workFLowListService.setRefreshWorkflowList(true);
                }
                $ionicHistory.goBack();
              } else {
                hmsPopup.showPopup('处理退回工作流失败!');
              }
            };
            var error = function (response) {
            };

            var submit = function (buttonIndex) {
              if (baseConfig.debug) {
                console.log('You selected button ' + buttonIndex);
              }
              if (buttonIndex == 1) {
                hmsPopup.showLoading('处理退回工作流中');
                workFLowListService.backTo(success, error, detail.recordId, backAction.actionId, opinion);
              } else {
              }
            }
            hmsPopup.confirm('是否确认' + backAction.title + '?', '', submit);
          };

        self.goBackAction = function () {
          var success = function (result) {
            if (result.con_status == 'S' && result.backList && result.backList[0]) {

              if (result.backList.length == 1) {
                self.submitBackAction(result.backList[0]);
              }

              else {
                if (baseConfig.nativeScreenFlag == true) {
                  var buttons = []
                  angular.forEach(result.backList, function (data) {
                    buttons.push(data.title);
                  });
                  var options = {
                    title: '选择返回的工作流列表',
                    buttonLabels: buttons,
                    addCancelButtonWithLabel: '取消',
                    androidEnableCancelButton: true,
                    winphoneEnableCancelButton: true
                  };
                  window.plugins.actionsheet.show(options, function (index) {
                    self.submitBackAction(result.backList[index - 1]);
                  });
                } else {
                  var buttons = []
                  angular.forEach(result.backList, function (data) {
                    buttons.push({
                      "text": data.title
                    });
                  });
                  $ionicActionSheet.show({
                    buttons: buttons,
                    titleText: '选择返回的工作流列表',
                    cancelText: '取消',
                    buttonClicked: function (index) {
                      self.submitBackAction(result.backList[index]);
                      return true;
                    }
                  });
                }
              }
            }
          };

          var error = function (response) {
          };

          workFLowListService.getBackList(success, error, detail.nodeId);
        };
        //验证工作
        self.setWorkflowDetailHistoryWidth = function (historyNum) {
          var historyWidth = document.body.clientWidth;
          try {
            historyWidth = parseInt(historyNum) * historyEachWidth;
          } catch (e) {
          }
          if($scope.isWeixinWebview){
            $scope.workflowDetailHistoryWidth = {
              "width": historyWidth + "px",
              "height": "139px"
            };
          } else {
            $scope.workflowDetailHistoryWidth = {
              "width": historyWidth
            };
          }
        };

        self.validateWorkFlowAction = function (actionType) {

          if (detail.workflowId == workflowIdSpecial.renewContractWorkflowId) {
            if (!$scope.renewContractSaveFlag) {
              hmsPopup.showPopup('请先保存合同续签方式!');
              return false;
            }
          }

          if (detail.workflowId == workflowIdSpecial.applicationFullMemberWorkflowId) {
            if (!$scope.applicationEmployeeSaveFlag) {
              hmsPopup.showPopup('请先保存转正信息!');
              return false;
            }
          }

          if (detail.workflowId == workflowIdSpecial.openProjectWorkflowId &&
            (detail.nodeId == 100146 || detail.nodeId == 100148)) {
            if (!$scope.newOpenProjectSaveFlag) {
              hmsPopup.showPopup('请先保存新建项目信息!');
              return false;
            }
          }

          if (actionType == $scope.actionType.approve) {
            return true;
          } else if (actionType == $scope.actionType.reject) {
            if ($scope.processExtroInfo.opinion == '') {
              hmsPopup.showPopup('请输入拒绝原因!');
              return false;
            }
            else {
              return true;
            }
          } else if (actionType == $scope.actionType.transmit) {
            if ($scope.processExtroInfo.opinion == '') {
              hmsPopup.showPopup('请输入转交原因!');
              return false;
            }

            if ($scope.processExtroInfo.transmitPerson.code == '') {
              hmsPopup.showPopup('请输入转交人!');
              return false;
            }
            else {
              return true;
            }
          } else if (actionType == $scope.actionType.back) {
            return true;
          } else {
            hmsPopup.showPopup('请输入处理类型!');
            return false;
          }
        };

        self.processLine = function (line) {
          var oneLine = {
            title: line.line_big_title,
            arrayList: line.line,
            currentPage: 1,
            currentArray: [],
            showFlag: true
          };
          if (line.line.length > 0) {
            var currentList = [];
            var lineTitle = line.line_title;
            var list = line.line[0].line_values;
            for (var i = 0; i < list.length; i++) {
              var array = {
                "name": lineTitle[i].line_title,
                "value": list[i].line_value
              };
              currentList.push(array);
            }
            oneLine.currentArray = currentList;
          }
          return oneLine;
        };


        self.processEditAbleLine = function (line) {
          var oneLine = {
            title: line.line_big_title,
            arrayList: line.line,
            currentPage: 1,
            currentArray: {
              lineId: "",
              array: [],
            },
            saveAction: line.saveAction,
            showFlag: true
          };
          if (line.line.length > 0) {
            var currentList = [];
            var lineTitle = line.line_title;
            var list = line.line[0].line_values;
            for (var i = 0; i < list.length; i++) {
              var array = {
                "name": lineTitle[i].line_title,
                "value": list[i].line_value,
                "canUpdate": list[i].canUpdate,
                "type": list[i].type,
                "required": list[i].required,
                "special": list[i].special,
              };
              if (list[i].lov) {
                array.lov = list[i].lov;
                array.currentValue = {"value": list[i].line_value};
              }
              currentList.push(array);
            }
            oneLine.currentArray.array = currentList;
            oneLine.currentArray.lineId = line.line[0].line_id
          }
          return oneLine;
        };

        self.getLovList = function (neeListItem) {
          var url = baseConfig.businessPath + "/" + neeListItem.default.procedure + "/" + neeListItem.default.function;
          var params = {"params": {"p_instance_id": detail.instanceId}}
          hmsHttp.post(url, params).success(function (result) {
            if (result.con_status == 'S' && result.lov) {
              neeListItem.options = result.lov;
              angular.forEach(result.lov, function (data) {
                if (data.value == neeListItem.value) {
                  neeListItem.lov = {
                    "value": data.value,
                    "name": data.name,
                  };
                }
              });
              if(baseConfig.debug){
                console.log('getLov neeListItem ' + angular.toJson(neeListItem));
              }
            } else {
            }
          }).error(function () {
            hmsPopup.showPopup('获取值列表信息错误!');
          });
        };

        self.getWorkflowDetail = function () {
          var success = function (result) {
            if (baseConfig.debug) {
              console.log('getWorkflowDetail.result ' + angular.toJson(result));
            }
            if (result.status == 'S') {
              $scope.historyList = result.history;
              self.setWorkflowDetailHistoryWidth(result.history.length);
              if (result.workflow_data) {
                $scope.singalArrayList = result.workflow_data.details;
                angular.forEach($scope.singalArrayList, function (data) {
                  data.showFlag = true;
                });

                if (detail.workflowId == 100466 && (detail.nodeId == 100966 || detail.nodeId == 101167) ||
                  detail.workflowId == 100470 && detail.nodeId == 100849 ||
                  detail.workflowId == 100727 && (detail.nodeId == 101371 || detail.nodeId == 101381)
                ) {
                  $scope.multpleLine.editAble = true;
                  multipleArrayList = result.workflow_data.lines;
                  angular.forEach(multipleArrayList, function (data) {
                    $scope.multipleLine.push(self.processEditAbleLine(data));
                  });
                } else {
                  multipleArrayList = result.workflow_data.lines;
                  angular.forEach(multipleArrayList, function (data) {
                    $scope.multipleLine.push(self.processLine(data));
                  });
                }

                if (detail.workflowId == workflowIdSpecial.openProjectWorkflowId && result.workflow_data.project_data) {
                  openProject().init(result.workflow_data.project_data);
                  $scope.showList.newOpenProjectShowFlag = true;
                }


                if (baseConfig.debug) {
                  console.log('$scope.multipleLine ' + angular.toJson($scope.multipleLine));
                  console.log('$scope.singalArrayList ' + angular.toJson($scope.singalArrayList));
                }

                $scope.needList = result.workflow_data.need;
                //lov、datepicker类型额外处理
                if ($scope.needList) {
                  var dpIndex, defaultValue;
                  for (var i = 0; i < $scope.needList.length; i++) {
                    if ($scope.needList[i].type == 'lov') {
                      var lovIndex = i;
                      $scope.needList[i].options = [];

                      self.getLovList($scope.needList[i]);

                    }
                    if ($scope.needList[i].type == 'datepicker') {
                      dpIndex = i;
                      defaultValue = $scope.needList[i].value;
                      $scope.needList[i].datepickerObject = {
                        titleLabel: '日期选择',  //Optional
                        todayLabel: '今天',  //Optional
                        closeLabel: '关闭',  //Optional
                        setLabel: '确定',  //Optional
                        setButtonType: 'button-assertive',  //Optional
                        todayButtonType: 'button',  //Optional
                        closeButtonType: 'button',  //Optional
                        inputDate: new Date(), //Optional
                        mondayFirst: true,  //Optional
                        disabledDates: [], //Optional
                        weekDaysList: ["日", "一", "二", "三", "四", "五", "六"], //Optional
                        monthList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], //Optional
                        templateType: 'popup', //Optional
                        showTodayButton: 'true', //Optional
                        modalHeaderColor: 'bar-positive', //Optional
                        modalFooterColor: 'bar-positive', //Optional
                        from: new Date(1900, 0, 1), //Optional
                        to: new Date(2101, 0, 1),  //Optional
                        dateFormat: ' yyyy - MM - dd ', //Optional
                        closeOnSelect: false, //Optional
                        dateModel: defaultValue,
                        callback: function (val) { //Mandatory
                          this.dateModel = $filter('date')(val, 'yyyy-MM-dd');
                          $scope.needList[dpIndex].value = this.dateModel;
                        }
                      };
                    }
                  }
                }
              }
            }
            $scope.LoadingModalData = false;
          };

          workFLowListService.getWorkflowDetail(success, detail.workflowId, detail.instanceId, self.getSubmitFlag());
        };

        self.getSubmitFlag = function () {
          var submitFlag = '';
          if (processedFlag.value == true) {
            submitFlag = 'Y';
          } else {
            submitFlag = 'N';
          }

          if (baseConfig.debug) {
            console.log('$stateParams.myPrsonalApplicationFlag ' + $stateParams.myPrsonalApplicationFlag);
          }

          if ($stateParams.myPrsonalApplicationFlag && $stateParams.myPrsonalApplicationFlag == true) {
            if (detail.status) {
              if (detail.status == 1) {
                submitFlag = 'N';
              } else {
                submitFlag = 'Y';
              }
            } else {
              submitFlag = 'Y';
            }
          }
          return submitFlag;
        };

        return self;
      };

      var init = {
        initDataModal: function () {
          if (detail.workflowId == workflowIdSpecial.renewContractWorkflowId) { //合同续签地址维护
            $scope.showList.contractRenewShowFlag = true;
            renewContract().query();
            //workflowDetail().getWorkflowDetail();
          } else if (detail.workflowId == workflowIdSpecial.applicationFullMemberWorkflowId) { //转正申请
            $scope.showList.applicationFullMemberShowFlag = true;
            applicationFullMember().query();
          } else {
            workflowDetail().getWorkflowDetail();
          }
        },
        initPushDetail: function (detailId) {
          var success = function (result) {
            //alert('initPushDetail.result ' + angular.toJson(result));
            if (result.returnData.processedFlag == 'Y') {
              processedFlag.value = true;
            } else {
              processedFlag.value = false;
            }
            $scope.workflowActionShowFlag = !processedFlag.value;
            detail.canApprove = result.returnData.canApprove;
            detail.canGoBack = result.returnData.canGoBack;
            detail.canBackTo = result.returnData.canBackTo;
            detail.canTransmit = result.returnData.canTransmit;
            detail.canRefuse = result.returnData.canRefuse;
            detail.employeeCode = result.returnData.employeeCode;

            $scope.currentDetail = detail;

            $scope.LoadingPushData = false;

            //alert('initPushDetail.detail ' + angular.toJson(detail));

          };
          var error = function (response) {
          };

          var recordId = '';
          var workflowId = '';
          var instanceId = '';
          var nodeId = '';

          if (detailId.recordId) {
            recordId = detailId.recordId;
          }
          if (detailId.workflowId) {
            workflowId = detailId.workflowId;
          }
          if (detailId.instanceId) {
            instanceId = detailId.instanceId;
          }
          if (detailId.nodeId) {
            nodeId = detailId.nodeId;
          }
          workFLowListService.getDetailBase(success, error, recordId, workflowId, instanceId, nodeId);
        }
      };

      if(!$scope.isWeixinWebview){ //app端
        if ($stateParams.type == 'PUSHDETAIL') { //消息推送过来的
          init.initPushDetail(detail);
          $timeout(function () {
            init.initDataModal();
          }, 250);
        } else if ($stateParams.type == 'WORKFLOWDETAIL') {
          $scope.LoadingPushData = false;
          $timeout(function () {
            init.initDataModal();
          }, 250);
        }
      } else { //微信端
        var argsWx = {};
        var queryWx = location.search.substring(1);//获取查询串
        var pairsWx = queryWx.split("&");//在逗号处断开
        for (var i = 0; i < pairsWx.length; i++) {
          var pos = pairsWx[i].indexOf('=');//查找name=value
          if (pos == -1) {
            continue;
          }    //如果没有找到就跳过
          var argName = pairsWx[i].substring(0, pos);//提取name
          argsWx[argName] = pairsWx[i].substring(pos + 1);//存为属性
        }

        var codeWx = argsWx.code;
        var isPushFromWx = window.location.href.indexOf('indexWorkflowDetail.html');

        if(isPushFromWx == -1){ //微信非推送
          var data = workFLowListService.getParamData();
          $stateParams.detail = data.detail;
          $stateParams.myPrsonalApplicationFlag = data.myPrsonalApplicationFlag;
          $stateParams.type = data.type;

          workFLowListService.getSubmitFlag(function(data){
            // $stateParams.processedFlag = data.processedFlag;
            if(data.status == 'N'){
              $stateParams.processedFlag = {value: false};
            } else {
              $stateParams.processedFlag = {value: true};
            }

            $scope.workflowActionShowFlag = !$stateParams.processedFlag.value;
            $scope.currentDetail = $stateParams.detail; //传过来的数据块
            detail = $stateParams.detail;//传过来的数据块
            processedFlag = $stateParams.processedFlag; //已经审批和未审批的标记
            $scope.LoadingPushData = false;
            $timeout(function () {
              init.initDataModal();
            }, 250);
          },function(data){
            hmsPopup.showPopup('获取审核操作异常，审核操作已屏蔽');
            $stateParams.processedFlag = {value: true};

            $scope.workflowActionShowFlag = !$stateParams.processedFlag.value;
            $scope.currentDetail = $stateParams.detail; //传过来的数据块
            detail = $stateParams.detail;//传过来的数据块
            processedFlag = $stateParams.processedFlag; //已经审批和未审批的标记
            $scope.LoadingPushData = false;
            $timeout(function () {
              init.initDataModal();
            }, 250);
          },$stateParams.detail.instanceId);
        } else { //微信推送
          $scope.showBackbtn = false;
          var paramsKey = ['instanceId','workflowId','nodeId','submitFlag','recordId','approve','refuse','toOther','goBack'];
          var detailParams = decodeURI(pairsWx[0]).split("|"); // "|"在iOS微信浏览器中被转义
          var paramsJson = {};
          for(i = 0; i < paramsKey.length; i++){
            paramsJson[paramsKey[i]] = detailParams[i];
          }

          detail = paramsJson;
          $scope.currentDetail = paramsJson;
          if(paramsJson.submitFlag == 'Y'){
            $stateParams.processedFlag = {value: true};
          } else {
            $stateParams.processedFlag = {value: false};
          }
          $scope.workflowActionShowFlag = !$stateParams.processedFlag.value;
          $scope.LoadingPushData = false;

          var callback = function(){
            init.initPushDetail(paramsJson);
            $timeout(function () {
              init.initDataModal();
            }, 250);
          }
          if(hmsHttp.wxLogin){
            hmsHttp.wxLogin(codeWx, callback);
          }
        }
      };

      $scope.$on('$ionicView.beforeEnter', function () {
        if (ionic.Platform.isIOS() && $scope.isWeixinWebview){
          if(document.setTitle){
            document.setTitle('待办事项明细');
          }
        }
      });
    }]);
