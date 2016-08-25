/**
 * Created by ZaraNengap on 2016/8/16.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function($stateProvider) {
      $stateProvider
        .state('tab.contractDetail', {
          url: '/contract-detail',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/contractapproval/detail/contract-detail.html',
              controller: 'ContractDetailCtrl'
            }
          },
          params: {
            data: ""
          }
        });
    }
  ]);

angular.module('applicationModule')
  .controller('ContractDetailCtrl', [
    '$scope',
    '$stateParams',
    '$timeout',
    '$ionicHistory',
    '$ionicActionSheet',
    'hmsPopup',
    'contractDetailService',
    'contractListService',
    function($scope, $stateParams, $timeout, $ionicHistory, $ionicActionSheet, hmsPopup, contractDetailService,contractListService) {
      $scope.nowContractInfoNum = 0;
      $scope.nowContractInfo = {};
      $scope.noNextDataFlag = false;
      $scope.fetchDataFlag = true;
      $scope.essenceData = {};
      $scope.essenceData.result = 'E';
      $scope.essenceData.message = "没有数据";
      $scope.contractId = '';
      $scope.showHint = false;
      $scope.showIosHeader = ionic.Platform.isIOS();

      //合同要素数据成功返回后
      var essenceSuccess = function(responce) {
        $scope.essenceData = responce;
      };

      //初始化页面所需数据
      var httpSuccess = function(response) {
        $scope.data = response;
        $scope.fetchDataFlag = false;
        if ($scope.data.result == "E") {
          $ionicHistory.goBack();
          hmsPopup.showPopup($scope.data.message);
          return 0;
        }
        $scope.nowContractInfo = $scope.data.contractInfo.lines[0].line[0].line_values;
        //原date格式为 yyyy-MM-dd At hh:mm:ss ,拆分为两个字段并保存
        if ($scope.data.historyData) {
          for (var i = 0; i < $scope.data.historyData.length; i++) {
            $scope.data.historyData[i].receiveDate = $scope.data.historyData[i].receveTime.split(" ")[0];
            $scope.data.historyData[i].receiveTime = $scope.data.historyData[i].receveTime.split(" ")[2];
          }
        }
        if (!window.localStorage.contractDetailHintFlag) {
          $timeout(function() {
            $scope.showHint = true;
            window.localStorage.contractDetailHintFlag = "true";
          }, 1000);
        }
        $scope.contractId = $scope.nowContractInfo[8].line_value;
        if ($scope.data.contractInfo.lines[0].line.length < 2)
          $scope.noNextDataFlag = true;
        $scope.showOperateButton = $scope.data.approvalAction ? true : false;
        contractDetailService.getEssence(essenceSuccess, $scope.contractId);
      };

      //取初始化页面所需数据
      contractDetailService.check(httpSuccess,
        $stateParams.data.activityId ? $stateParams.data.activityId : "" ,
        $stateParams.data.procId ? $stateParams.data.procId : "");

      //显示合同要素弹出框
      $scope.showEssenceDiv = function() {
        if ($scope.essenceData.result == "E") {
          hmsPopup.showPopup($scope.essenceData.message);
          return 0;
        } else {
          $scope.showDesc = false;
          $scope.showProc = false;
          $scope.showEssence = !$scope.showEssence;
          $scope.showCover = !$scope.showCover;
        }
      };

      //合同信息上一页
      $scope.toLast = function() {
        if ($scope.nowContractInfoNum == 0)
          return 0;
        $scope.nowContractInfoNum--;
        $scope.nowContractInfo = $scope.data.contractInfo.lines[0].line[$scope.nowContractInfoNum].line_values;
        $scope.noNextDataFlag = ($scope.nowContractInfoNum == $scope.data.contractInfo.lines[0].line.length - 1);
      };

      //合同信息下一页
      $scope.toNext = function() {
        if ($scope.nowContractInfoNum == $scope.data.contractInfo.lines[0].line.length - 1)
          return 0;
        $scope.nowContractInfoNum++;
        $scope.nowContractInfo = $scope.data.contractInfo.lines[0].line[$scope.nowContractInfoNum].line_values;
        $scope.noNextDataFlag = ($scope.nowContractInfoNum == $scope.data.contractInfo.lines[0].line.length - 1);
      };

      $scope.workflowDetailScroll = {
        "width": document.body.clientWidth,
        "height": 137
      };

      $scope.showProc = false;
      $scope.showCover = false;
      $scope.showDesc = false;
      $scope.showEssence = false;

      //显示流程弹出框
      $scope.showProcDiv = function() {
        $scope.showEssence = false;
        $scope.showDesc = false;
        $scope.showProc = !$scope.showProc;
        $scope.showCover = !$scope.showCover;
      };

      //关闭页面所有弹出框及遮罩层
      $scope.closeCover = function() {
        $scope.showProc = false;
        $scope.showCover = false;
        $scope.showDesc = false;
        $scope.showEssence = false;
      };

      //显示流程信息弹出框
      $scope.showDescDiv = function(stageItem) {
        $scope.showEssence = false;
        $scope.showProc = false;
        $scope.showDesc = !$scope.showProc;
        $scope.showCover = !$scope.showCover;
        $scope.nowDesc = stageItem;
      };

      $scope.showProcessFlag = true;

      $scope.hideProcess = function() {
        $scope.showProcessFlag = false;
      };

      $scope.showProcess = function() {
        $scope.showProcessFlag = true;
      };

      $scope.showContractFlag = true;

      $scope.hideContract = function() {
        $scope.showContractFlag = false;
      };

      $scope.showContract = function() {
        $scope.showContractFlag = true;
      };

      //提交操作后的回掉
      var submitSuccess = function(response) {
        if (response.result == "S") {
          contractListService.removeItem();
          $ionicHistory.goBack();
          hmsPopup.showPopup('操作成功');
        } else {
          hmsPopup.showPopup(response.message);
        }
      };

      $scope.submitMessage = { text: "" };
      //显示操作action sheet
      $scope.showOperate = function() {
        var buttonText = [];
        for (var i = 0; i < $scope.data.approvalAction.length; i++) {
          buttonText[i] = { text: $scope.data.approvalAction[i].action_value };
        }
        $ionicActionSheet.show({
          buttons: buttonText,
          titleText: '请选择操作',
          cancelText: '取消',
          buttonClicked: function(index) {
            var key = $scope.data.approvalAction[index].action_key;
            if (key == '$TRANSPOND$') {
              if ($scope.transpondId == '') {
                hmsPopup.showPopup('请选择转交人');
                return 0;
              } else {
                contractDetailService.transpond(submitSuccess, $stateParams.data.procId, $stateParams.data.activityId, $scope.transpondId, $scope.submitMessage.text);
              }
            } else {
              contractDetailService.submit(submitSuccess, $stateParams.data.procId, $stateParams.data.activityId, key, $scope.submitMessage.text);
            }
          }
        });
      };

      $scope.fetchTranspondData = false;
      $scope.showTransFlag = false;
      $scope.transponds = [];
      $scope.searchKey = "";

      //定义字符串包含函数
      function isContains(str, substr) {
        return new RegExp(substr).test(str);
      }

      //取得转交人数据成功的回调
      var transpondSuccess = function(response) {
        $scope.fetchTranspondData = false;
        $scope.transpondsData = response.transpondUsers;
        $scope.transponds = [];
        for (var item in $scope.transpondsData) {
          var transpond = { name: $scope.transpondsData[item], id: item };
          $scope.transponds.push(transpond);
        }
        if ($scope.transponds.length == 0)
          $scope.transponds.push({ name: "没有找到相关转交人", id: "" });
      };

      //显示转交人弹出框
      $scope.showTransDiv = function() {
        if ($scope.transponds.length == 0) {
          $scope.fetchTranspondData = true;
          contractDetailService.getTranspond(transpondSuccess);
        }
        $scope.showTransFlag = !$scope.showTransFlag;
      };

      //筛选符合搜索框输入条件的转交人
      $scope.shiftTranspond = function() {
        $scope.transponds = [];
        for (var item in $scope.transpondsData) {
          if (isContains($scope.transpondsData[item], $scope.searchKey) || isContains(item, $scope.searchKey)) {
            var transpond = { name: $scope.transpondsData[item], id: item };
            $scope.transponds.push(transpond);
          }
        }
      };

      $scope.transpondName = "";
      $scope.transpondId = "";

      //选择转交人
      $scope.selectTranspond = function(name, id) {
        $scope.transpondName = name;
        $scope.transpondId = id;
        $scope.showTransDiv();
      };

    }
  ])

.service('contractDetailService', ['hmsHttp',
  'hmsPopup',
  'baseConfig',
  'contractListService',
  function(hmsHttp,
    hmsPopup,
    baseConfig,
    contractListService) {

    var baseUrlTest = baseConfig.queryPath + '/handcontract';

    this.check = function(success, activityId, procId) {

      var needActInstId = contractListService.getListType() == 'myTask_todo';
      var params;

      if(needActInstId){
        params = {
          userId: window.localStorage.empno,
          method: "processInfoByAct",
          actInstId: activityId
        };
      }
      else{
        params = {
          userId: window.localStorage.empno,
          method: "processInfoByProc",
          procInstId: procId
        };
      }

      hmsHttp.post(baseUrlTest, params).success(function(result) {
        success(result);
      }).error(function(response, status) {
        hmsPopup.showPopup(response);
      });

    };

    this.getEssence = function(success, contractId) {

      var params = {
        userId: window.localStorage.empno,
        method: "essence",
        contractId: contractId
      };
      hmsHttp.post(baseUrlTest, params).success(function(result) {
        success(result);
      }).error(function(response, status) {
        hmsPopup.showPopup(response);
      });
    };

    this.getTranspond = function(success) {
      var params = {
        userId: window.localStorage.empno,
        method: "transpondUsers"
      };
      hmsHttp.post(baseUrlTest, params).success(function(result) {
        success(result);
      }).error(function(response, status) {
        hmsPopup.showPopup(response);
      });

    };

    this.submit = function(success, procInstId, actInstId, submitKey, comment) {

      var params = {
        userId: window.localStorage.empno,
        method: "submit",
        procInstId: procInstId,
        actInstId: actInstId,
        submitKey: submitKey,
        comment: comment
      };
      hmsHttp.post(baseUrlTest, params).success(function(result) {
        success(result);
      }).error(function(response, status) {
        hmsPopup.showPopup(response);
      });

    };

    this.transpond = function(success, procInstId, actInstId, transpondUser, message) {

      var params = {
        userId: window.localStorage.empno,
        method: "transpond",
        procInstId: procInstId,
        actInstId: actInstId,
        transpondUser: transpondUser,
        message: message
      };
      hmsHttp.post(baseUrlTest, params).success(function(result) {
        success(result);
      }).error(function(response, status) {
        hmsPopup.showPopup(response);
      });

    };

  }
]);
