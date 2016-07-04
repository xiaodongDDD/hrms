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

      $scope.actionType = {
        "approve": "0",
        "reject": "-1",
        "back": "",
        "transmit": "3"
      }
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
      //加载项目画面
      $ionicModal.fromTemplateUrl('build/pages/workflow/detail/modal/transmit-person.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.transmitPersonModal = modal;
      });
      $scope.selectTransmitPerson = function (person) {
        if (baseConfig.debug) {
          console.log("selectTransmitPerson.person " + angular.toJson(person));
        }
        $scope.processExtroInfo.transmitPerson = person;
        $scope.transmitPersonModal.hide();
      };
      $scope.hideTransmitPerson = function () {
        $scope.transmitPersonModal.hide();
      };
      $scope.chooseTransmitPerson = function () {
        $scope.transmitPersonModal.show();
      };

      $scope.searchTransmitPerson = function () {
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
      };

      var processLine = function (line) {
        var oneLine = {
          title: line.line_big_title,
          arrayList: line.line,
          currentPage: 1,
          currentArray: [],
          showFlag : !$scope.workflowActionShowFlag
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

      $scope.showContent = function (array) {
        if (!array.showFlag) {
          array.showFlag = true;
        } else {
          array.showFlag = false;
        }
        $ionicScrollDelegate.resize();
      };

      $scope.toBack = function (array) {
        if (array.currentPage <= 1) {
          return '';
        } else {
          var currentPage = array.currentPage - 1;
          array.currentPage = currentPage;
          for (var i = 0; i < array.currentArray.length; i++) {
            array.currentArray[i].value = array.arrayList[currentPage - 1].line_values[i].line_value;
          }
        }
      };

      $scope.goForward = function (array) {
        if (array.currentPage >= array.arrayList.length) {
          return '';
        } else {
          var currentPage = array.currentPage + 1;
          array.currentPage = currentPage;
          for (var i = 0; i < array.currentArray.length; i++) {
            array.currentArray[i].value = array.arrayList[currentPage - 1].line_values[i].line_value;
          }
        }
      };

      var validateWorkFlowAction = function (actionType) {
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

      $scope.submitAction = function (actionType) {
        if (baseConfig.debug) {
          console.log('actionType ' + actionType);
        }

        if (validateWorkFlowAction(actionType)) {
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
      };

      var getWorkflowDetail = function () {
        var success = function (result) {
          if (baseConfig.debug) {
            console.log('getWorkflowDetail.result ' + angular.toJson(result));
          }

          if (result.status == 'S') {
            $scope.historyList = result.history;
            if (result.workflow_data) {
              $scope.singalArrayList = result.workflow_data.details;
              angular.forEach($scope.singalArrayList, function (data) {
                data.showFlag = !$scope.workflowActionShowFlag;
              });
              
              multipleArrayList = result.workflow_data.lines;
              angular.forEach(multipleArrayList, function (data) {
                $scope.multipleLine.push(processLine(data));
              });

              if (baseConfig.debug) {
                console.log('$scope.multipleLine ' + angular.toJson($scope.multipleLine));
              }
            }
          }
        };
        workFLowListService.getWorkflowDetail(success, detail.workflowId, detail.instanceId, 'Y');
      };

      getWorkflowDetail();
    }]);
