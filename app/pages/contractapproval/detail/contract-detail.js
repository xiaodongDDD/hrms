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
              prefetchTemplate: false,
              templateUrl: 'build/pages/contractapproval/detail/contract-detail.html',
              controller: 'ContractDetailCtrl'
            }
          },
          params: {
            data: ""
          }
        });
    }
  ])
  .config(['$stateProvider', 'baseConfig',
    function($stateProvider, baseConfig) {
      if(!baseConfig.isWeixinWebview){
        $stateProvider
          .state('tab.contractDetail-employeeDetail', {
            url: '/contract-detail/authorDetail',
            views: {
              'tab-application': {
                prefetchTemplate: false,
                templateUrl: 'build/pages/contact/detail/employee-detail.html',
                controller: 'contactEmployeeDetailCtl'
              }
            },
            params: {
              'employeeNumber': ""
            }
          });
      }
    }
  ]);

angular.module('applicationModule')
  .controller('ContractDetailCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$timeout',
    '$ionicHistory',
    '$ionicActionSheet',
    '$ionicScrollDelegate',
    'hmsPopup',
    'baseConfig',
    'contractDetailService',
    'contractListService',
    function($scope,
      $state,
      $stateParams,
      $timeout,
      $ionicHistory,
      $ionicActionSheet,
      $ionicScrollDelegate,
      hmsPopup,
      baseConfig,
      contractDetailService,
      contractListService) {
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
      $scope.hisBluring = false;
      $scope.afterEnter = false;
      $scope.isWxWebview = baseConfig.isWeixinWebview;

      if (ionic.Platform.isIOS() && $scope.isWeixinWebview){
        if(document.setTitle){
          document.setTitle('合同详情');
        }
      }

      //合同要素数据成功返回后
      var essenceSuccess = function(responce, index) {
        // console.log(index + angular.toJson(responce));
        $scope.essenceData[index] = responce;
      };

      //初始化页面所需数据
      var httpSuccess = function(response) {
        if (baseConfig.isWeixinWebview) {
          contractDetailService.saveDetailData(response);
        }
        $scope.data = response;
        // console.log($scope.data);

        $scope.fetchDataFlag = false;
        if ($scope.data.result == "E") {
          $ionicHistory.goBack();
          hmsPopup.showPopup('获取数据失败' + $scope.data.message);
          return 0;
        }

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

        if ($scope.data.contractInfo.lines[0].line.length < 2)
          $scope.noNextDataFlag = true;
        $scope.showOperateButton = $scope.data.approvalAction ? true : false;

        for (var i = 0; i < $scope.data.contractInfo.lines[0].line_title.length; i++) {
          if ($scope.data.contractInfo.lines[0].line_title[i].line_title == '存储编号') {
            $scope.nowContractInfo = $scope.data.contractInfo.lines[0].line[0].line_values;
            $scope.contractId = $scope.nowContractInfo[i].line_value;
            contractDetailService.getEssence(essenceSuccess, $scope.contractId, 0);
          }
        }
        // for(var i = 0; i < $scope.data.contractInfo.lines.length; i++){
        //   var _nowContractInfo = $scope.data.contractInfo.lines[0].line[i].line_values;
        //   var _contractId = _nowContractInfo[8].line_value;
        //   contractDetailService.getEssence(essenceSuccess, _contractId, i);
        // }
      };

      //取初始化页面所需数据
      if ($stateParams.data) {
        contractDetailService.check(httpSuccess,
          $stateParams.data.activityId ? $stateParams.data.activityId : "",
          $stateParams.data.procId ? $stateParams.data.procId : "");
      } else {
        httpSuccess(contractDetailService.getDetailData());
      }
      // //取初始化页面所需数据
      // contractDetailService.check(httpSuccess,
      //   $stateParams.data.activityId ? $stateParams.data.activityId : "",
      //   $stateParams.data.procId ? $stateParams.data.procId : "");

      //显示合同要素弹出框
      $scope.showEssenceDiv = function() {
        if ($scope.essenceData[$scope.nowContractInfoNum].result == "E") {
          hmsPopup.showPopup('合同要素获取失败' + $scope.essenceData[$scope.nowContractInfoNum].message);
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

        if (!$scope.essenceData[$scope.nowContractInfoNum]) {
          for (var i = 0; i < $scope.data.contractInfo.lines[0].line_title.length; i++) {
            if ($scope.data.contractInfo.lines[0].line_title[i].line_title == '存储编号') {
              $scope.nowContractInfo = $scope.data.contractInfo.lines[0].line[$scope.nowContractInfoNum].line_values;
              $scope.contractId = $scope.nowContractInfo[i].line_value;
              contractDetailService.getEssence(essenceSuccess, $scope.contractId, $scope.nowContractInfoNum);
            }
          }
        }
      };

      $scope.workflowDetailScroll = {
        "width": document.body.clientWidth + 'px;',
        "height": 105 + 'px;'
      };

      $scope.showProc = false;
      $scope.showCover = false;
      $scope.showDesc = false;
      $scope.showEssence = false;

      $scope.filterBlur = false;

      //显示流程弹出框
      $scope.showProcDiv = function() {
        $scope.showEssence = false;
        $scope.showDesc = false;
        $scope.showProc = !$scope.showProc;
        $scope.showCover = !$scope.showCover;
        $scope.filterBlur = true;
        $scope.hisBluring = true;
      };

      //关闭页面所有弹出框及遮罩层
      $scope.closeCover = function() {
        $scope.showProc = false;
        $scope.showCover = false;
        $scope.showDesc = false;
        $scope.showEssence = false;
        $scope.filterBlur = false;
        $scope.hisBluring = false;
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

      $scope.hideProcess = function($event) {
        $scope.showProcessFlag = false;
        $scope.resizeContent($event);
      };

      $scope.showProcess = function($event) {
        $scope.showProcessFlag = true;
        $scope.resizeContent($event);
      };

      $scope.showContractFlag = true;

      $scope.hideContract = function($event) {
        $scope.showContractFlag = false;
        $scope.resizeContent($event);
      };

      $scope.showContract = function($event) {
        $scope.showContractFlag = true;
        $scope.resizeContent($event);
      };

      $scope.resizeContent = function($event) {
        var detail = $ionicScrollDelegate.$getByHandle('workflowDetailHandle').getScrollView();

        if ($scope.showContractFlag || $scope.showProcessFlag) {
          if ($event.pageY + 15 > detail.__clientHeight) {
            var detailScroll = $ionicScrollDelegate.$getByHandle('workflowDetailHandle').getScrollPosition();
            var detailScroll1 = $ionicScrollDelegate.$getByHandle('workflowDetailHandle').scrollTo(0, (detailScroll.top + 300), true);
          }
        }
        $ionicScrollDelegate.resize();
      }

      //提交操作后的回掉
      var submitSuccess = function(response) {
        if (response.result == "S") {
          contractListService.removeItem();
          $ionicHistory.goBack();
          hmsPopup.showPopup('操作成功');
        } else {
          $scope.showOperateButton = true;
          $ionicHistory.goBack();
          window.sessionStorage.refreshContractList = 'true';
          hmsPopup.showPopup('操作失败：' + angular.toJson(response.message));
        }
      };

      $scope.submitMessage = { text: "" };
      //显示操作action sheet
      $scope.showOperate = function() {
        var buttonText = [];
        for (var i = 0; i < $scope.data.approvalAction.length; i++) {
          buttonText[i] = { text: $scope.data.approvalAction[i].action_value };
        }
        // console.log($scope.data);
        $scope.hideIonicAS = $ionicActionSheet.show({
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
                contractDetailService.transpond(submitSuccess, $stateParams.data.procId, $stateParams.data.activityId, $scope.transpondId, $scope.submitMessage.text, $scope, $ionicScrollDelegate);
              }
            } else {
              contractDetailService.submit(submitSuccess, $stateParams.data.procId, $stateParams.data.activityId, key, $scope.submitMessage.text, $scope, $ionicScrollDelegate);
            }
          }
        });
      };

      $scope.fetchTranspondData = false;
      $scope.showTransFlag = [true, false, false];
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
        if ($scope.showTransFlag[0]) {
          $scope.showTransFlag[0] = false;
          $scope.showTransFlag[2] = true;
          return 0;
        }
        if ($scope.showTransFlag[2]) {
          $scope.showTransFlag[2] = false;
          $scope.showTransFlag[1] = true;
          return 0;
        }
        if ($scope.showTransFlag[1]) {
          $scope.showTransFlag[1] = false;
          $scope.showTransFlag[2] = true;
        }
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

      //add by luyufei 2016-8-26
      $scope.isFirst = function(index) {
        if (index == 0) {
          return true;
        }
        return false;
      }

      $scope.isLast = function(index) {
        if (index == $scope.data.stages.length - 1) {
          return true;
        }
        return false;
      }

      $scope.isHighlight = function(item) {
        return item.highLight;
      }

      $scope.hisMakerStyle = function(index) {
        return {
          'top': (index * 70 + 21) + 'px'
        }
      }

      $scope.filterBlurStyle = function(flag) {
        if (flag) {
          return {
            'filter': 'blur(5px)',
            '-webkit-filter': 'blur(5px)'
          }
        } else {
          return {}
        }
      }

      $scope.goToAuthorPage = function(id) {
        if (!baseConfig.isWeixinWebview) {
          if (id) {
            $state.go('tab.contractDetail-employeeDetail', { employeeNumber: id });
          } else {
            $state.go('tab.contractDetail-employeeDetail', { employeeNumber: 1876 });
          }
        }
      }

      $scope.$on('$ionicView.beforeEnter', function () {
        if (ionic.Platform.isIOS() && $scope.isWeixinWebview){
          if(document.setTitle){
            document.setTitle('合同详情');
          }
        }
      });
      $scope.$on('$ionicView.afterEnter', function() {
        $scope.afterEnter = true;
      });

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

      if (needActInstId) {
        params = {
          userId: window.localStorage.empno,
          method: "processInfoByAct",
          actInstId: activityId
        };
      } else {
        params = {
          userId: window.localStorage.empno,
          method: "processInfoByProc",
          procInstId: procId
        };
      }

      hmsHttp.post(baseUrlTest, params).success(function(result) {
        success(result);
      }).error(function(response, status) {
        // hmsPopup.showPopup(response);
      });

    };

    this.getEssence = function(success, contractId, index) {

      var params = {
        userId: window.localStorage.empno,
        method: "essence",
        contractId: contractId
      };
      hmsHttp.post(baseUrlTest, params).success(function(result) {
        success(result, index);
      }).error(function(response, status) {
        // hmsPopup.showPopup(response);
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
        // hmsPopup.showPopup(response);
      });

    };

    // add by luyufei
    var paramData = {};
    this.saveData = function(d){
      paramData = d;
    }
    this.getData = function(){
      return paramData;
    }

    var detailData = {};
    this.saveDetailData = function(d){
      detailData = d;
    }
    this.getDetailData = function(){
      return detailData;
    }
    this.disableOprate = function(){
      detailData.approvalAction = false;
    };
    //end add

    this.submit = function(success, procInstId, actInstId, submitKey, comment, scope, ionicScrollDelegate) {
      var params = {
        userId: window.localStorage.empno,
        method: "submit",
        procInstId: procInstId,
        actInstId: actInstId,
        submitKey: submitKey,
        comment: comment
      };

      var cb_ = function () {
        if (baseConfig.isWeixinWebview) {
          this.disableOprate();
        }

        scope.showOperateButton = false;
        hmsPopup.showShortCenterToast('提交中,请耐心等待');
        ionicScrollDelegate.$getByHandle('workflowDetailHandle').resize();
        ionicScrollDelegate.$getByHandle('workflowDetailHandle').scrollBottom(true);

        hmsHttp.post(baseUrlTest, params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          // hmsPopup.showPopup(response);
        });
      };

      for(var i = 0; i < scope.data.approvalAction.length; i++){
        // 找到key
        if(scope.data.approvalAction[i].action_key === submitKey){
          // value 是驳回
          if(scope.data.approvalAction[i].action_value === '驳回销售'){
            hmsPopup.confirm('确认要驳回销售吗', '提示', function (index) {
              if (index === 1){
                // 确认
                cb_();
              }
            })
          // value 不是驳回
          } else {
            cb_();
          }
          try {
            scope.hideIonicAS();
          } catch (error) {
            
          }
        }
      }
    };

    this.transpond = function(success, procInstId, actInstId, transpondUser, message, scope, ionicScrollDelegate) {
      if (baseConfig.isWeixinWebview) {
        this.disableOprate();
      }
      
      var params = {
        userId: window.localStorage.empno,
        method: "transpond",
        procInstId: procInstId,
        actInstId: actInstId,
        transpondUser: transpondUser,
        message: message
      };

      scope.showOperateButton = false;
      hmsPopup.showShortCenterToast('提交中,请耐心等待');
      ionicScrollDelegate.$getByHandle('workflowDetailHandle').resize();
      ionicScrollDelegate.$getByHandle('workflowDetailHandle').scrollBottom(true);
      
      try {
        scope.hideIonicAS();
      } catch (error) {
        
      }

      hmsHttp.post(baseUrlTest, params).success(function(result) {
        success(result);
      }).error(function(response, status) {
        // hmsPopup.showPopup(response);
      });

    };

  }
]);
