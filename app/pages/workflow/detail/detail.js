angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.workflow-detail', {
          url: '/workflow-detail',
          params: {"detail": {}, "processedFlag": {}},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/workflow/detail/detail.html',
              controller: 'WorkFLowDetailCtrl'
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
              $ionicHistory) {
      var detail = $stateParams.detail;
      $scope.currentDetail = $stateParams.detail;
      var multipleArrayList = [];

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

      if (baseConfig.debug) {
        console.log('WorkFLowDetailCtrl.detail ' + angular.toJson(detail));
      }

      var contractRenewal = {
        queryData: function () {

        }
      }

      $ionicModal.fromTemplateUrl('build/pages/workflow/detail/modal/data-list.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.dataListModal = modal;
      });//初始化下拉列表的modal

      //加载项目画面
      $ionicModal.fromTemplateUrl('build/pages/workflow/detail/modal/transmit-person.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.transmitPersonModal = modal;
      });

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
        changeType: function (item,type) {
          var cache = {
            "selected": item.selected
          };
          $scope.applicationEmployeeType.agree.selected = false;
          $scope.applicationEmployeeType.reject.selected = false;
          $scope.applicationEmployeeType.notChange.selected = false;
          item.selected = !cache.selected;
        },
        showEmployeeGrade: function () {
          $scope.dataListModal = modal;
        }
      };

      $scope.applicationEmployeeType = {
        "agree": {"selected": true},
        "reject": {"selected": false},
        "notChange": {"selected": false}
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
              if (result.workflow_data) {
                $scope.applicationEmployeeDetail = result.workflow_data.details.detail;
                $scope.applicationEmployeeDetail.showFlag = true;
                $scope.applicationEmployeeInfo = result.workflow_data.testResult.detail;
                $scope.applicationEmployeeAbility = result.workflow_data.testResult.record;
                $scope.applicationEmployeeTrial = result.workflow_data.trialSummary.summary;
              }
            }
          };
          workFLowListService.getWorkflowDetail(success, detail.workflowId, detail.instanceId, 'Y');
        };
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
              workFLowListService.setRefreshWorkflowList(true);
              $ionicHistory.goBack();

            }
            else {
              hmsPopup.showPopup('处理工作流失败!');
            }
          };
          var error = function (response) {
            hmsPopup.showPopup('处理工作流出现错误,可能是网络问题!');
          };
          hmsPopup.showLoading('处理工作流中');
          workFLowListService.submitAction(success, error, params);
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
          } else if (detail.workflowId == 10008) { //合同续签地址维护
            $scope.showList.applicationFullMemberShowFlag = true;
            applicationFullMember().query();
          } else {
            workflowDetail().getWorkflowDetail();
          }
        }
      };

      init.initDataModal();

    }]);
