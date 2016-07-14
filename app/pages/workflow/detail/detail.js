angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.workflow-detail', {
          url: '/workflow-detail',
          params: {"detail": {}, "processedFlag": {}, "type": ""},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/workflow/detail/detail.html',
              controller: 'WorkFLowDetailCtrl'
            }
          }
        })

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
    'baseConfig',
    'TimeSheetService',
    'workFLowListService',
    'hmsPopup',
    '$ionicHistory',
    'HmsDateFormat',
    function ($scope,
              $state,
              $stateParams,
              $ionicModal,
              $timeout,
              $ionicScrollDelegate,
              baseConfig,
              TimeSheetService,
              workFLowListService,
              hmsPopup,
              $ionicHistory,
              HmsDateFormat) {

      $scope.currentDetail = $stateParams.detail; //传过来的数据块
      var detail = $stateParams.detail;//传过来的数据块
      var processedFlag = $stateParams.processedFlag; //已经审批和未审批的标记
      var multipleArrayList = [];

      if (baseConfig.debug) {
        console.log('WorkFLowDetailCtrl.detail ' + angular.toJson(detail));
        console.log('WorkFLowDetailCtrl.processedFlag ' + processedFlag);
      }

      var historyEachWidth = 102;

      $scope.LoadingPushData = true;
      $scope.LoadingModalData = true;

      //var detailScroll = angular.element('#workflowDetailScroll');
      //var detailHistory = angular.element('#workflowDetailHistory');

      $scope.workflowDetailScroll = {
        "width": document.body.clientWidth
      };

      $scope.workflowDetailHistory = {};

      //控制需要显示的数据模块
      $scope.showList = {
        contractRenewShowFlag: false, //合同续签地址回写数据块,
        applicationFullMemberShowFlag: false, //转正申请数据块
      }

      $scope.actionType = {
        "approve": "0",
        "reject": "-1",
        "back": "",
        "transmit": "3"
      };

      $scope.renewContract = {
        "method": "",
        "address": "",
      };
      $scope.renewContractMethodList = [];
      $scope.renewContractSaveFlag = false;
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

      $scope.transmitPersonFilter = {
        "value": ""
      };

      /*------------------转正申请数据源------------------*/
      $scope.applicationEmployeeType = {
        "agree": {"selected": true, "value": "1"},
        "reject": {"selected": false, "value": "-1"},
        "notChange": {"selected": false, "value": "0"}
      };
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

      var contractRenewal = {
        queryData: function () {

        }
      };

      var analyze = function (currentState) {
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
        return '';
      };

      $scope.goEmployeeDetail = function () {
        if(detail.employeeCode){
          if ($stateParams.type == 'WORKFLOWDETAIL') {
            $state.go('tab.tab-application-workflow-employee', {"employeeNumber": detail.employeeCode})
          } else {
            $state.go(analyze + '-employee-detail', {"employeeNumber": detail.employeeCode})
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
      },

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
        $scope.renewContract.method = data.item;
        if (data.value == "") {
          $scope.renewContractEditable = true;
        } else {
          $scope.renewContract.address = data.value;
          $scope.renewContractEditable = false;
        }
        $scope.dataListModal.hide();
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
        },
        //保存转正信息
        savePositiveBlock1: function (detail) {
          if (baseConfig.debug) {
            console.log('detail ' + angular.toJson(detail));
          }

          return;

          var success = function (result) {
            if (result.status == 'S') {
              hmsPopup.showPopup('保存转正信息成功!');
            }
            else {
              hmsPopup.showPopup('保存转正信息失败!');
            }
          };
          var error = function (response) {
          };
          hmsPopup.showLoading('保存转正信息中');
          workFLowListService.savePositiveBlock1(success, error, params);
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
              if (result.workflow_data) {
                $scope.applicationEmployeeDetail = result.workflow_data.details.detail;
                $scope.applicationEmployeeDetail.showFlag = true;
                try {
                  if ($scope.applicationEmployeeDetail.trial_date == "") {
                    var dateString = $scope.applicationEmployeeDetail.trial_date.replace(/-/g, "/");
                    $scope.applicationEmployeeDetail.trialDate = new Date(dateString);
                  } else {
                    $scope.applicationEmployeeDetail.trialDate = new Date();
                    $scope.applicationEmployeeDetail.trial_date =
                      HmsDateFormat.getDateString($scope.applicationEmployeeDetail.trialDate);
                  }
                } catch (e) {
                }
                $scope.applicationEmployeeInfo = result.workflow_data.testResult.detail;
                $scope.applicationEmployeeAbility = result.workflow_data.testResult.record;
                $scope.applicationEmployeeTrial = result.workflow_data.trialSummary.summary;
              }
            }

            $scope.LoadingModalData = false;
          };
          workFLowListService.getWorkflowDetail(success, detail.workflowId, detail.instanceId, 'Y');
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

      //通用工作流
      $scope.workflowDetailUtil = {
        //对表单数据进行缩放
        showContent: function (array, $event) {
          var detail = $ionicScrollDelegate.$getByHandle('workflowDetailHandle').getScrollView();
          if (baseConfig.debug) {
            console.log('detail ' + angular.toJson(detail.__clientHeight));
            console.log('$event ' + angular.toJson($event.pageY));
          }

          if (!array.showFlag) {
            array.showFlag = true;
            if ($event.pageY + 10 > detail.__clientHeight) {
              $ionicScrollDelegate.$getByHandle('workflowDetailHandle').scrollBottom(true);
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
        //提交工作流数据
        submitAction: function (actionType) {
          if (baseConfig.debug) {
            console.log('actionType ' + actionType);
          }
          if (workflowDetail().validateWorkFlowAction(actionType)) {
          } else {
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
        }
      };

      var workflowDetail = function () {
        var self = {};
        //验证工作
        self.setWorkflowDetailHistoryWidth = function (historyNum) {
          var historyWidth = document.body.clientWidth;
          try {
            historyWidth = parseInt(historyNum) * historyEachWidth;
          } catch (e) {
          }
          $scope.workflowDetailHistoryWidth = {
            "width": historyWidth
          };
        };
        self.validateWorkFlowAction = function (actionType) {

          if (detail.workflowId == 100728) {
            if (!$scope.renewContractSaveFlag) {
              hmsPopup.showPopup('请先保存合同续签方式!');
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
            else {
              return true;
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
        }
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

                multipleArrayList = result.workflow_data.lines;
                angular.forEach(multipleArrayList, function (data) {
                  $scope.multipleLine.push(self.processLine(data));
                });

                if (baseConfig.debug) {
                  console.log('$scope.multipleLine ' + angular.toJson($scope.multipleLine));
                  console.log('$scope.singalArrayList ' + angular.toJson($scope.singalArrayList));
                }
              }
            }
            $scope.LoadingModalData = false;
          };
          workFLowListService.getWorkflowDetail(success, detail.workflowId, detail.instanceId, 'Y');
        };
        return self;
      };

      var init = {
        initDataModal: function () {
          if (detail.workflowId == 100728) { //合同续签地址维护
            $scope.showList.contractRenewShowFlag = true;
            renewContract().query();
            workflowDetail().getWorkflowDetail();
          } else if (detail.workflowId == 10008) { //合同续签地址维护
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
              processedFlag = true;
            } else {
              processedFlag = false;
            }
            $scope.workflowActionShowFlag = !processedFlag;
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

      if ($stateParams.type == 'PUSHDETAIL') { //消息推送过来的
        init.initPushDetail(detail);
        init.initDataModal();
      } else if ($stateParams.type == 'WORKFLOWDETAIL') {
        $scope.LoadingPushData = false;
        init.initDataModal();
      }


    }]);
