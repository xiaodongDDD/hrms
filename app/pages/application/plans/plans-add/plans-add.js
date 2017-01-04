/**
 * Created by wkh on 2016/10/17.
 */
'use strict';
angular.module('planModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.plans-add', {
          url: '/plans/plans-add',
          params: {
            planData: {}
          },
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/plans/plans-add/plans-add.html',
              controller: 'PlansAddCtrl'
            }
          }
        })
        .state('tab.plans-add2', {
          url: '/plans/plans-add',
          params: {
            planData: {}
          },
          views: {
            'tab-contactCrm': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/plans/plans-add/plans-add.html',
              controller: 'PlansAddCtrl'
            }
          }
        })
    }]);

angular.module('planModule')
  .controller('PlansAddCtrl',
  ['$scope',
    '$cordovaDatePicker',
    '$ionicHistory',
    '$ionicPopup', 'hmsPopup',
    '$rootScope',
    '$state',
    'plansAddService',
    'T',
    '$filter',
    '$ionicModal',
    '$ionicScrollDelegate',
    'opportunityAddService',
    '$timeout',
    '$stateParams',
    'plansService',
    function ($scope,
              $cordovaDatePicker,
              $ionicHistory,
              $ionicPopup,
              hmsPopup,
              $rootScope,
              $state,
              plansAddService,
              T,
              $filter,
              $ionicModal,
              $ionicScrollDelegate,
              opportunityAddService,
              $timeout,
              $stateParams,
              plansService) {
      $scope.showSlide = function (num) {
        $scope.slideParam = num;
        console.log($scope.slideParam);
      };
      $scope.nowPage = 1;
      $scope.pageSize = 15;
      $scope.searchModel = {
        searchValueKey: ""
      };
      $scope.showSmallCrmLoading = false;
      $scope.sourceItems = [];
      $scope.noDataFlag = false;
/*      $scope.data = {
        "planDate": $filter('date')(new Date(), 'yyyy-MM-dd'),
        "customerId": "",
        "opportunityId": "",
        "timeBucket": "",
        "saleContent": "",
        "userId": window.localStorage.empno,
        "planType": "",
        "planSource": null,
        "dataStatus": "HCRM_VALID"
      };
      /!*     new Date().getFullYear();*!/
      $scope.showData = {
        fullName: "",
        opportunityName: "",
        planTime: "",
        week: showTime(new Date()),
        saleContent: ""
      };*/
/*      $scope.data = {
        "customerId": $stateParams.planData.customerId,
        "opportunityId": $stateParams.planData.opportunityId,
        "isImportant":$stateParams.planData.isImportant
      };*/
  /*    $scope.$on('$ionicView.enter', function (e) {
        if (isNotNullObj($stateParams.planData)) {
          console.log("====");
          console.log($stateParams.planData.planDate);
          $scope.data = {
            "planDate": $stateParams.planData.planDate,
            "customerId": "",
            "opportunityId": "",
            "timeBucket": "",
            "saleContent": "",
            "userId": window.localStorage.empno,
            "planType": "",
            "planSource": null,
            "dataStatus": "HCRM_VALID"
          };
          /!*     new Date().getFullYear();*!/
          $scope.showData = {
            fullName: "",
            opportunityName: "",
            planTime: "",
            week: showTime($stateParams.planData.planDate),
            saleContent: ""
          };
        }else{
          console.log("====");
          $scope.data = {
            "planDate": $filter('date')(new Date(), 'yyyy-MM-dd'),
            "customerId": "",
            "opportunityId": "",
            "timeBucket": "",
            "saleContent": "",
            "userId": window.localStorage.empno,
            "planType": "",
            "planSource": null,
            "dataStatus": "HCRM_VALID"
          };
          /!*     new Date().getFullYear();*!/
          $scope.showData = {
            fullName: "",
            opportunityName: "",
            planTime: "",
            week: showTime(new Date()),
            saleContent: ""
          };
        }
      });*/
      $scope.showSlide(0);
      $scope.goBackPlan = function () {
        if ($ionicHistory.viewHistory().backView) {
          $ionicHistory.goBack();
        } else {
          $state.go('tab.application');
        }
      };
      $scope.$on('$ionicView.enter', function (e) {
        console.log($stateParams.planData);
        $scope.backNeedFresh = false;
        if (isNotNullObj($stateParams.planData)) {
          $scope.backNeedFresh = true;
          $scope.data = {
            "planDate":$stateParams.planData.planDate,
            "customerId": $stateParams.planData.customerId,
            "opportunityId": $stateParams.planData.opportunityId,
            "timeBucket": "HCRM_MORNING",
            "saleContent": "",
            "isImportant":$stateParams.planData.isImportant,
            "userId": window.localStorage.empno,
            "planType": "HCRM_NEW_PLAN",
            "planSource": null,
            "dataStatus": "HCRM_VALID"
          };
          if($stateParams.planData.isImportant=="N"){
            $scope.importantNum=0;
          }else if($stateParams.planData.isImportant=="Y"){
            $scope.importantNum=1;
          }else{
            $scope.importantNum=0;
          }
        /*  var date = new Date(2013,08,30);
          alert(date.getTime());*/
          /*     new Date().getFullYear();*/
          if($stateParams.planData.planDate){
            $scope.data.planDate=$stateParams.planData.planDate;
          }else{
            $scope.data.planDate= $filter('date')(new Date(), 'yyyy-MM-dd');
          }
          $scope.showData = {
            fullName: $stateParams.planData.fullName,
            opportunityName: $stateParams.planData.opportunityName,
            planTime: "",
            week: showTime(new Date($scope.data.planDate)),
            saleContent: ""
          };
        } else {
          $scope.data = {
            "planDate": $filter('date')(new Date(), 'yyyy-MM-dd'),
            "customerId": "",
            "opportunityId": "",
            "timeBucket": "HCRM_MORNING",
            "saleContent": "",
            "isImportant":"N",
            "userId": window.localStorage.empno,
            "planType": "HCRM_NEW_PLAN",
            "planSource": null,
            "dataStatus": "HCRM_VALID"
          };
          $scope.importantNum=0;
          /*     new Date().getFullYear();*/
          $scope.showData = {
            fullName: "",
            opportunityName: "",
            planTime: "",
            week: showTime(new Date()),
            saleContent: ""
          };
        }
        //通用选择弹窗
        $scope.selectTargets = [{
          'key': 'contact',
          'interface': plansAddService.searchCustomer,  //获得选择项的接口
          'params': [initCustomerSuccess, $scope.searchModel.searchValueKey, $scope.nowPage, $scope.pageSize],  //获得选择项时接口所需参数
          'showKey': 'fullName',            //选择界面显示的数据
          'dataKey': 'customerId',      //对象内最终操作提交所需的数据变量
          'dataModel': '$scope.data.customerId',  //最终操作提交所需的数据变量
          'showDataModel': '$scope.showData.fullName', //显示在界面上的ng-model
          'searchInterface': plansAddService.searchCustomer,
          'searchParams': getCustomerSearchSuccess,
          'needShowMore': true
        }, {
          'key': 'business',
          'interface': plansAddService.getBusiness,  //获得选择项的接口
          'params': [getBusinessSuccess, $scope.searchModel.searchValueKey, $scope.nowPage, $scope.pageSize, $scope.data.customerId],  //获得选择项时接口所需参数
          'showKey': 'opportunityName',            //选择界面显示的数据
          'dataKey': 'opportunityId',      //对象内最终操作提交所需的数据变量
          'dataModel': '$scope.data.opportunityId',  //最终操作提交所需的数据变量
          'showDataModel': '$scope.showData.opportunityName', //显示在界面上的ng-model,
          'searchInterface': plansAddService.getBusiness,
          'searchParams': getOpportunitySearchSuccess,
          'needShowMore': true
        }];
      });
      $scope.items = [];
      $scope.weekData = {
        "summaryId": "",
        "beginDate": "",
        "endDate": "",
        "summaryContent": ""
      };
      $scope.nowSelectTarget = {};
      $scope.choosePlanTime = function () {
        var options = {
          date: new Date(),
          mode: 'date',
          titleText: '请选择时间',
          okText: '确定',
          cancelText: '取消',
          doneButtonLabel: '确认',
          cancelButtonLabel: '取消',
          locale: 'zh_cn',
          androidTheme: window.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
        };

        $cordovaDatePicker.show(options).then(function (dateNo) {
          if (dateNo) {
            var year = dateNo.getFullYear();
            var month = dateNo.getMonth() + 1;
            var date = dateNo.getDate();
            $scope.data.planDate = year + '-' + month + '-' + date;
            console.log($scope.data.planDate);

            $scope.showData.week = showTime(dateNo);
            console.log($scope.showData.week);
          }
          $scope.$apply();
        });
      };
      var addSuccessInit = function (result) {
        hmsPopup.hideLoading();
        console.log(result);
        if (result.returnCode == "S") {
          plansService.setRefreshDataFlag(true);
          hmsPopup.showPopup(result.returnMsg);
          if ($ionicHistory.viewHistory().backView) {
            $ionicHistory.goBack();
          } else {
            $state.go('tab.application');
          }
        } else {
          if (result.returnMsg) {
            hmsPopup.showPopup(result.returnMsg);
          }
          else {
            hmsPopup.showPopup('服务器系统出现异常，请联系管理员！');
          }
        }
      };
      var addToSuccessInit = function (result) {
        hmsPopup.hideLoading();
        console.log(result);
        if (result.returnCode == "S") {
          plansService.setRefreshDataFlag(true);
          hmsPopup.showPopup(result.returnMsg);
          if (isNotNullObj($stateParams.planData)) {
            console.log("hhh");
            $scope.backNeedFresh = true;
            $scope.data = {
              "planDate": $filter('date')(new Date(), 'yyyy-MM-dd'),
              "customerId": $stateParams.planData.customerId,
              "opportunityId": $stateParams.planData.opportunityId,
              "timeBucket": "HCRM_MORNING",
              "saleContent": "",
              "isImportant":"N",
              "userId": window.localStorage.empno,
              "planType": "HCRM_NEW_PLAN",
              "planSource": null,
              "dataStatus": "HCRM_VALID"
            };
            /*     new Date().getFullYear();*/
            $scope.showData = {
              fullName: $stateParams.planData.fullName,
              opportunityName: $stateParams.planData.opportunityName,
              planTime: "",
              week: showTime(new Date()),
              saleContent: ""
            };
          } else {
            $scope.data = {
              "planDate": $filter('date')(new Date(), 'yyyy-MM-dd'),
              "customerId": "",
              "opportunityId": "",
              "timeBucket": "HCRM_MORNING",
              "isImportant":"N",
              "saleContent": "",
              "userId": window.localStorage.empno,
              "planType": "HCRM_NEW_PLAN",
              "planSource": null,
              "dataStatus": "HCRM_VALID"
            };
            /*     new Date().getFullYear();*/
            $scope.showData = {
              fullName: "",
              opportunityName: "",
              planTime: "",
              week: showTime(new Date()),
              saleContent: ""
            };
            $scope.importantNum=0;
          }
        } else {
          if (result.returnMsg) {
            hmsPopup.showPopup(result.returnMsg);
          }
          else {
            hmsPopup.showPopup('服务器系统出现异常，请联系管理员！');
          }
        }
      };
      $scope.importantItems=[
        {
          description:"一般",
          value:"N"
        },
        {
          description:"重要",
          value:"Y"
        }
      ];
      var initCustomerSuccess = function (response) {
        $scope.moreDataCanBeLoaded = false;
        $scope.showCrmLoading = true;
        if (response.returnCode == 'S') {
          $scope.showCrmLoading = false;
          $scope.moreDataCanBeLoaded = response.customer_list.length == $scope.pageSize;
          $scope.items = $scope.items.concat(response.customer_list);
          $scope.sourceItems = $scope.items.clone();
        } else {
          if (response.returnMsg) {
            $scope.showCrmLoading = false;
          }
          else {
            hmsPopup.showPopup('服务器系统出现异常，请联系管理员！');
          }
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      var getCustomerSearchSuccess = function (response) {
        $scope.moreDataCanBeLoaded = false;
        $scope.showCrmLoading = false;
        if (response.returnCode == 'S') {
          $scope.items = $scope.items.concat(response.customer_list);
          $scope.moreDataCanBeLoaded = response.customer_list.length == $scope.pageSize;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      var getBusinessSuccess = function (response) {
        $scope.showCrmLoading = true;
        console.log(response);
        if (response.returnCode == 'S') {
          $scope.showCrmLoading = false;
          $scope.moreDataCanBeLoaded = response.opportunity_list.length == $scope.pageSize;
          $scope.items = $scope.items.concat(response.opportunity_list);
          $scope.sourceItems = $scope.items.clone();
        } else {
          if (response.returnMsg) {
            $scope.showCrmLoading = false;
            $scope.moreDataCanBeLoaded = false;
          }
          else {
            hmsPopup.showPopup('服务器系统出现异常，请联系管理员！');
          }
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      var getOpportunitySearchSuccess = function (response) {
        $scope.showCrmLoading = false;
        if (response.returnCode == 'S') {
          $scope.moreDataCanBeLoaded = response.opportunity_list.length == $scope.pageSize;
          $scope.items = $scope.items.concat(response.opportunity_list);
        } else {
          $scope.moreDataCanBeLoaded = false;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      function insertText(obj, str) {
        if (document.selection) {
          var sel = document.selection.createRange();
          sel.text = str;
        } else if (typeof obj.selectionStart === 'number' && typeof obj.selectionEnd === 'number') {
          var startPos = obj.selectionStart,
            endPos = obj.selectionEnd,
            cursorPos = startPos,
            tmpStr = obj.value;
          obj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);
          cursorPos += str.length;
          obj.selectionStart = obj.selectionEnd = cursorPos;
        } else {
          obj.value += str;
        }
      }


      $scope.savePlans = function () {
        console.log($scope.data);
        $scope.data.saleContent = $('#text').val();

        if ($scope.data.saleContent == "") {
          hmsPopup.showPopup("计划内容不能为空");
        } else {

          hmsPopup.showLoading("正在保存");
          if ($scope.data.saleContent == "") {
            hmsPopup.showPopup("计划内容不能为空");
            hmsPopup.hideLoading();
          } else {
            plansAddService.saleplanAdd(addSuccessInit, $scope.data);
          }
        }
      };
      $scope.savePlansTo = function () {
        hmsPopup.showLoading("正在保存");
        $scope.data.saleContent = $('#text').val();
        if ($scope.data.saleContent == "") {
          hmsPopup.showPopup("计划内容不能为空");
          hmsPopup.hideLoading();
        } else {
          plansAddService.saleplanAdd(addToSuccessInit, $scope.data);
        }
      };
      $scope.holdText = false;
      $scope.holdText2 = false;
      //开始录音
      $scope.voiceTo = function () {

        $scope.holdText = true;
        cordova.plugins.pluginIflytek.startRecorerRecognize(
          function (msg) {

            $('#voice-img').addClass('big-img');
          }, function (msg) {

            $('#voice-img').addClass('big-img');
          });
      };
      //结束录音
      $scope.onRelease = function () {
        $scope.holdText = false;
        $scope.showVoiceFlag = false;
        $scope.showSmallCrmLoading = true;
        console.log("结束录音");
        $timeout(function () {
          console.log("timeout");
          $scope.showSmallCrmLoading = false;
        /*  hmsPopup.showPopup("识别失败，请重新尝试！");*/
        }, 5000);
        cordova.plugins.pluginIflytek.stopRecorderRecognize(
          function (msg) {
            hmsPopup.hideLoading();
            console.log("测试错误");
            $scope.showSmallCrmLoading = false;
            $('#voice-img').removeClass('big-img');
            hmsPopup.showPopup(msg);
     /*       $timeout(function () {
              insertText(document.getElementById('text'), msg);
              $scope.$apply();
              $scope.showSmallCrmLoading = false;
            }, 0);*/
            /*  $scope.$apply();*/
          }, function (msg) {
            $('#voice-img').removeClass('big-img');
            console.log("测试正确");
            /* $scope.$apply();*/
            $timeout(function () {
              insertText(document.getElementById('text'), msg);
              $scope.$apply();
              $scope.showSmallCrmLoading = false;
            }, 0);
          });
      };
      //开始录音
      $scope.voiceWeekTo = function () {

        $scope.holdText2 = true;
        cordova.plugins.pluginIflytek.startRecorerRecognize(
          function (msg) {
            $('#voice-img').addClass('big-img');

          }, function (msg) {
            $('#voice-img').addClass('big-img');

          });
      };
      //结束录音
      $scope.onWeekRelease = function () {
        $scope.holdText2 = false;
        $scope.showVoiceFlag = false;
        $scope.showSmallCrmLoading = true;
        $timeout(function () {
          console.log("timeout");
          $scope.showSmallCrmLoading = false;
        }, 5000);
        cordova.plugins.pluginIflytek.stopRecorderRecognize(
          function (msg) {
            console.log("测试错误")
        /*    hmsPopup.hideLoading();
            $('#voice-img').removeClass('big-img');
            $timeout(function () {
              insertText(document.getElementById('text'), msg);
              $scope.$apply();
              $scope.showSmallCrmLoading = false;
            }, 0);*/
            $scope.showSmallCrmLoading = false;
            hmsPopup.showPopup(msg);
            /*  $scope.$apply();*/
          }, function (msg) {
            console.log("测试正确")

            $('#voice-img').removeClass('big-img');
            /* $scope.$apply();*/
            $timeout(function () {
              insertText(document.getElementById('text2'), msg);
              $scope.$apply();
              $scope.showSmallCrmLoading = false;
            }, 0);
          });
      };

      $scope.loadMore = function () {
        console.log('loadMore ...');
        $scope.nowPage++;
        for (var i = 0; i < $scope.nowSelectTarget.params.length; i++) {
          if ($scope.nowSelectTarget.params[i] == $scope.nowPage - 1) {
            $scope.nowSelectTarget.params[i] = $scope.nowPage;
            break;
          }
        }
        if ($scope.nowSelectTarget['searchInterface'] && $scope.searchModel.searchValueKey != '') {
          console.log("有参数");
          $scope.nowSelectTarget.searchInterface.call(null, $scope.nowSelectTarget.searchParams, $scope.searchModel.searchValueKey, $scope.nowPage, $scope.pageSize);
        } else {
          console.log("无参数");
          $scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
        }

      };
      $scope.clearSelectFilter = function () {
        $scope.searchModel.searchValueKey = '';
        /*      $ionicScrollDelegate.scrollTop();*/
        $scope.nowPage = 1;
        /*
         if ($scope.nowSelectTarget['key'] == 'business') {
         console.log("test");
         /!*   $scope.data.customerId = '';
         $scope.showData.fullName = '';*!/
         /!*   $scope.selectTargets[1].params = [getBusinessSuccess, $scope.searchModel.searchValueKey, $scope.nowPage, $scope.pageSize, ""];*!/
         }*/
        $scope.searchSelectValue();
        /*       $scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
         $scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);*/
        /* $scope.items = $scope.data.clone();*/
      };
      function isContains(str, substr) {
        return new RegExp(substr).test(str);
      }

      Array.prototype.clone = function () {
        return [].concat(this);
      };

      $scope.searchSelectValue = function () {
        console.log($scope.nowPage);
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
        if ($scope.nowSelectTarget['searchInterface']) {
          //需要接口搜索的
          $scope.showCrmLoading = true;
          console.log($scope.showCrmLoading);
          $scope.moreDataCanBeLoaded = false;
          /*        if ($scope.searchModel.searchValueKey == '') {
           $scope.items = [];
           $scope.nowPage = 1;
           $scope.nowSelectTarget = cloneObj($scope.sourceTargetData);
           $scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
           } else {*/
          $scope.items = [];
          $scope.nowPage = 1;
          $scope.pageSize = 15;
          $scope.nowSelectTarget.searchInterface.call(null, $scope.nowSelectTarget.searchParams, $scope.searchModel.searchValueKey, $scope.nowPage, $scope.pageSize);
          /*}*/
        } else {
          //本地字段搜索的
          $scope.nowPage = 1;
          $scope.pageSize = 15;
          var notShowNum = 0;
          if ($scope.searchModel.searchValueKey == '') {
            $scope.noDataFlag = false;
            $scope.items = $scope.sourceItems.clone();
          }
          else {
            for (var i = 0; i < $scope.sourceItems.length; i++) {
              if (isContains($scope.sourceItems[i][$scope.nowSelectTarget['showKey']], $scope.searchModel.searchValueKey))
                $scope.items[i] = $scope.sourceItems[i];
              else {
                $scope.items[i] = '';
                notShowNum++;
              }
            }
            $scope.noDataFlag = notShowNum == $scope.sourceItems.length;
          }
        }
      };
      //克隆对象
      function cloneObj(obj) {
        function Clone() {
        }

        Clone.prototype = obj;
        var o = new Clone();
        for (var a in o) {
          if (typeof o[a] == "object") {
            o[a] = cloneObj(o[a]);
          }
        }
        return o;
      }

      $ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal1) {
        $scope.crmSelectModal = modal1;
      });
      $scope.showSelectDiv = function (key) {
        $scope.moreDataCanBeLoaded = false;
        $scope.searchModel.searchValueKey = '';
        $scope.nowPage = 1;
        //打开模态框
        if ($scope.showSelect) {
          console.log("关闭");
          $scope.crmSelectModal.hide();
          $scope.showCrmLoading = false;
        } else {
          console.log("dakia");
          /* hmsPopup.showLoading();*/

          $scope.crmSelectModal.show();
          $scope.showCrmLoading = true;

        }
        $scope.showSelect = !$scope.showSelect;
        if (!$scope.showSelect)
          return;
        if (!$scope.showSelect) {
          $scope.items = [];
          return 0;
        }
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
        for (var i = 0; i < $scope.selectTargets.length; i++) {
          if (key == $scope.selectTargets[i].key) {
            $scope.nowSelectTarget = cloneObj($scope.selectTargets[i]);
            break;
          }
        }
        if ($scope.showSelect) {
          var showKey = $scope.nowSelectTarget['showKey'];
          var dataKey = $scope.nowSelectTarget['dataKey'];
          eval('$scope.items = [{' + showKey + ': "空",' + dataKey + ': ""}]');
        }
        console.log($scope.nowSelectTarget.params);
        $scope.sourceTargetData = cloneObj($scope.nowSelectTarget);
        $scope.showLoading = true;
        if (key == 'business')
          $scope.selectTargets[1].params = [getBusinessSuccess, $scope.searchModel.searchValueKey, $scope.nowPage, $scope.pageSize, $scope.data.customerId];
        $scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
      };
      $scope.selectItem = function ($index) {
        var data = $scope.items[$index][$scope.nowSelectTarget['dataKey']];  //接口所需数据
        var showKey = $scope.items[$index][$scope.nowSelectTarget['showKey']];
        showKey = (showKey == '空') ? "" : showKey;
        var dataModel = $scope.nowSelectTarget['dataModel'];                 //最终操作提交所需的数据变量
        var showDataModel = $scope.nowSelectTarget['showDataModel'];         //显示用的数据变量ng-model
        eval(dataModel + " = data");
        eval(showDataModel + " = showKey");

        if ($scope.nowSelectTarget['key'] == 'contact') {
          /*   $scope.data.customerId = '';
           $scope.showData.fullName = '';*/
          $scope.nowPage=1;
          $scope.searchModel.searchValueKey="";
          window.localStorage.customerId = $scope.items[$index].customerId;
          $scope.data.opportunityId = "";
          $scope.showData.opportunityName = "";

          $scope.selectTargets[1].params = [getBusinessSuccess, $scope.searchModel.searchValueKey, $scope.nowPage, $scope.pageSize, $scope.data.customerId];
        }
        console.log(showKey);
        console.log(data);
        console.log($scope.items[$index].customerName);
        if ($scope.nowSelectTarget['key'] == 'business') {
          $scope.nowPage=1;
          $scope.searchModel.searchValueKey="";
          /*   $scope.data.customerId = '';
           $scope.showData.fullName = '';*/
          if ($scope.items[$index].customerName != "") {
            $scope.data.customerId = $scope.items[$index].customerId;
            $scope.showData.fullName = $scope.items[$index].customerName;
          }

          $scope.selectTargets[1].params = [getBusinessSuccess, $scope.searchModel.searchValueKey, $scope.nowPage, $scope.pageSize, $scope.data.customerId];

        }
        $scope.showSelectDiv();
      };
      $scope.showVoiceFlag = false;
      $scope.showVoice = function () {
        $scope.showVoiceFlag = true;
      };
      $scope.timeItems = [];
      var listSuccessInit = function (result) {
        $scope.num = 0;
        console.log(result.lookup_detail[0].lookup_value_list);
        $scope.timeItems = result.lookup_detail[0].lookup_value_list;
      };
      plansAddService.getValueList(listSuccessInit, "HCRM.TIME_BUCKET", "");
      $scope.selectTime = function ($index, item) {
        $scope.num = $index;
        $scope.data.timeBucket = item.value;
      };
      $scope.selectImportant = function ($index, item) {
        $scope.importantNum = $index;
        $scope.data.isImportant = item.value;
      };
  /*    $scope.selectImportant( $scope.importantNum);*/
      $ionicModal.fromTemplateUrl('build/pages/modals/crm-item-common.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.opportunityAddModel = modal;
      });

      $scope.showWeekChoose = function () {
        $scope.opportunityAddModel.show();
      };
      $scope.goBack = function () {
        $scope.opportunityAddModel.hide();
      };

      //////////////////////////转盘//////////////////////////////
      $scope.rotates = [];
      $scope.sourceDeg = 180;
      $scope.weeksIndex = [];
      var weekNum = 16;
      $scope.nowIndex = weekNum / 2;
      $scope.stageRotate = {
        "transform": "rotateX(" + $scope.sourceDeg + "deg)",
        "-webkit-transform": "rotateX(" + $scope.sourceDeg + "deg)"
      };
      for (var i = 0; i < weekNum; i++) {
        $scope.weeksIndex.push(i);
      }
      $scope.baseDeg = 360 / $scope.weeksIndex.length;

      for (var i = (weekNum - 1); i >= 0; i--) {
        var deg = 360 / weekNum * (weekNum - i);
        $scope.rotates[i] = {
          "transform": "rotateX(" + deg + "deg) translateZ(90px)",
          "-webkit-transform": "rotateX(" + deg + "deg) translateZ(90px)"
        };
      }

      function getLastDeg(deg) {
        return Math.round(deg / $scope.baseDeg) * $scope.baseDeg;
      }

      function getNextIndex(nowIndex) {
        var temp = nowIndex + 1;
        if (temp > (weekNum - 1))
          temp = 0;
        return temp;
      }

      function getPrevIndex(nowIndex) {
        var temp = nowIndex - 1;
        if (temp < 0)
          temp = weekNum - 1;
        return temp;
      }

      function refreshData() {
        $scope.nowIndex = Math.round($scope.nowIndex);
        if ($scope.nowIndex > (weekNum - 1))
          $scope.nowIndex -= weekNum;
        $scope.year = $scope.weeks[$scope.nowIndex].getFullYear();
        var needChangeUpIndex = $scope.nowIndex - weekNum / 4;
        if (needChangeUpIndex < 0)
          needChangeUpIndex = weekNum + needChangeUpIndex;
        var UpDate = new Date($scope.weeks[getNextIndex(needChangeUpIndex)]);
        UpDate.setDate(UpDate.getDate() - 7);
        $scope.weeks[needChangeUpIndex] = UpDate;

        var needChangeDownIndex = $scope.nowIndex + weekNum / 4;
        if (needChangeDownIndex > (weekNum - 1))
          needChangeDownIndex = needChangeDownIndex - weekNum;
        var DownDate = new Date($scope.weeks[getPrevIndex(needChangeDownIndex)]);
        DownDate.setDate(DownDate.getDate() + 7);
        $scope.weeks[needChangeDownIndex] = DownDate;
      }

      function getNowIndex(deg) {
        var temp = deg / $scope.baseDeg % weekNum;
        $scope.nowIndex = temp < 0 ? (weekNum + temp) : temp;
        refreshData();
      }

      $scope.lastDeg = 0;
      $scope.onDragScroll = function ($event) {
        // $scope.sourceDeg -= $event.gesture.deltaY / 15;
        $scope.lastDeg = $scope.sourceDeg - $event.gesture.deltaY / 2;
        $scope.stageRotate = {
          "transform": "rotateX(" + $scope.lastDeg + "deg)",
          "-webkit-transform": "rotateX(" + $scope.lastDeg + "deg)"
        };
        getNowIndex($scope.lastDeg);
      };

      $scope.onReleaseScroll = function ($event) {
        if ($event.gesture.deltaY > 0)
          $scope.sourceDeg = getLastDeg($scope.lastDeg) - $scope.baseDeg;
        else
          $scope.sourceDeg = getLastDeg($scope.lastDeg);
        $scope.stageRotate = {
          "transform": "rotateX(" + $scope.sourceDeg + "deg)",
          "-webkit-transform": "rotateX(" + $scope.sourceDeg + "deg)"
        };
        getNowIndex($scope.sourceDeg);
      };


      $scope.today = new Date();
      $scope.year = $scope.today.getFullYear();
      $scope.chooseWeek = "";

      function formatDate(value) {
        if (parseInt(value) < 10) {
          return '0' + value;
        }
        return value;
      }

      $scope.getWeekString = function (date) {
        var day = date.getDay();
        var weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - (day - 1));
        var weekEnd = new Date(date);
        weekEnd.setDate(weekEnd.getDate() + (7 - day));
        return formatDate(weekStart.getMonth() + 1) + '月' + formatDate(weekStart.getDate()) + '日 ~ ' +
          formatDate(weekEnd.getMonth() + 1) + '月' + formatDate(weekEnd.getDate()) + '日';
      }

      function initWeeks(year) {
        $scope.weeks = [];
        var listDate = new Date();
        listDate.setFullYear(year);
        listDate.setDate($scope.today.getDate() - 6 * 7);
        for (var i = 0; i < weekNum; i++) {
          var tempDate = new Date(listDate);
          $scope.weeks[i] = tempDate;
          listDate.setDate(listDate.getDate() + 7);
        }
      }

      initWeeks($scope.today.getFullYear());

      $scope.onReleaseYear = function ($event) {
        var slideLeft = $event.gesture.deltaX < 0;
        if (slideLeft)
          $scope.year++;
        else
          $scope.year--;
        initWeeks($scope.year);
      };

      $scope.selectWeek = function (nowIndex) {

        console.log('selectWeek $scope.year ' + $scope.year);
        console.log('selectWeek $scope.nowIndex ' + nowIndex);
        console.log('selectWeek $scope.weeks ' + angular.toJson($scope.weeks));
        console.log('selectWeek $scope.weeks(nowIndex) ' + $scope.getWeekString($scope.weeks[nowIndex]));

        var period = plansService.getWeekPeriod($scope.weeks[nowIndex]);
        console.log('selectWeek .period ' + angular.toJson(period));
        $scope.chooseWeek = $scope.getWeekString($scope.weeks[nowIndex]);
        $scope.weekData.beginDate = period.dateFrom;
        $scope.weekData.endDate = period.dateTo;
        $scope.showWeek = false;
        $scope.opportunityAddModel.hide();
        //截断字符串拼接起来
        /* $scope.weekData.beginDate=;
         $scope.weekData.endDate=

         $scope.weekData.beginDate= $scope.chooseWeek.substring(0,9);
         $scope.weekData.endDate=$scope.chooseWeek.substring(10,$scope.chooseWeek.length-1);
         console.log( $scope.weekData);*/
      };


      $scope.saveWeeklyAdd = function () {
        $scope.weekData.summaryContent = $('#text2').val();
        var saveWeeklySuccessInit = function (result) {

          console.log($scope.weekData.summaryContent);
          //$rootScope.$broadcast("REFRESH_ADD_PLAN");
          if (result.returnCode == 'S') {
            plansService.setRefreshDataFlag(true);
            $ionicHistory.goBack();
          }
          else {
            if (result.returnMsg) {
              hmsPopup.showPopup('提交周报中报错， ' + result.returnMsg);
            }
            else {
              hmsPopup.showPopup('提交周报中报错，请联系管理员！');
            }
          }
        };
        if ($scope.chooseWeek == "") {
          hmsPopup.showPopup("请选择日期");
        } else if ($scope.weekData.summaryContent == "") {
          hmsPopup.showPopup("周报内容不能为空");
        } else {
          hmsPopup.showLoading('提交周报中');
          plansAddService.saleWeeklyAdd(saveWeeklySuccessInit, $scope.weekData);
        }
      }
    }])
  .service('plansAddService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function (hmsHttp,
              hmsPopup,
              baseConfig) {

      var baseUrl = baseConfig.basePath;
      //搜索客户
      this.searchCustomer = function (success, keyWord, page, pageSize) {
        var params = {
          keyWord: keyWord,
          page: page,
          pageSize: pageSize
        };
        hmsHttp.post(baseUrl + 'saleplan_customers', params).success(function (result) {
          success(result);
        }).error(function (response, status) {
        });
      };

      //关联商机
      this.getBusiness = function (success, keyword, page, pageSize, customerId) {
        var params = {
          "page": page,
          "pageSize": pageSize,
          "customerId": customerId,
          "keyWord": keyword
        };
        hmsHttp.post(baseUrl + 'saleplan_opportunitys', params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
        });
      };
      //得到值列表
      this.getValueList = function (success, code, lastUpdateDate) {
        var params = {
          lookupList: [{
            code: code,
            lastUpdateDate: lastUpdateDate
          }]
        };
        hmsHttp.post(baseUrl + 'query_lookup', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
        });
      };
      //保存计划
      this.saleplanAdd = function (success, params) {
        hmsHttp.post(baseUrl + 'saleplan_add', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
        });
      };
      //保存周报
      this.saleWeeklyAdd = function (success, params) {
        hmsHttp.post(baseUrl + 'weekly_add', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
        });
      };
      this.getSearchOpportunity = function (success, keyWord, page, pageSize) {
        var params = {
          keyWord: keyWord,
          page: page,
          pageSize: pageSize,
          customerId: window.localStorage.customerId
        };
        hmsHttp.post(baseUrl + 'search_opportunity', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
        });
      }
    }
  ]);
