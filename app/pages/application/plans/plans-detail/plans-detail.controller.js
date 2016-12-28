/**
 * Created by gusenlin on 2016/12/9.
 */
(function () {
  'use strict';
  angular
    .module('planModule')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tab.plans-detail', {
        url: '/plans/plans-detail',
        params: {
          "authority": '',
          planDetail: {},
          planId: ''
        },
        views: {
          'tab-application': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/application/plans/plans-detail/plans-detail.html',
            controller: 'plansDetailCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }

  angular
    .module('planModule')
    .controller('plansDetailCtrl', plansDetailCtrl);

  //plansDetailCtrl.$inject = ['$scope', '$stateParams', '$ionicHistory', 'plansAddService','opportunityAddService'];

  function plansDetailCtrl($scope,
                           $stateParams,
                           $ionicHistory,
                           plansAddService,
                           opportunityAddService,
                           $ionicModal,
                           $ionicScrollDelegate,
                           plansService,
                           baseConfig,
                           hmsPopup,
                           $cordovaDatePicker,
                           $timeout) {
    var vm = this;
    /*  if( $stateParams.planDetail)*/
    $scope.showCommentFlag = false;
    $scope.showSmallCrmLoading = false;
    var authority = $stateParams.authority;
    /*    vm.showComment=showComment;*/
    var detail = $stateParams.planDetail;
    var planId = $stateParams.planId;
    var param = {
      "planId": ''
    };
    var getPlanSuccess = function (data) {
      $scope.showSmallCrmLoading = false;
      if (data.returnCode == 'S') {
        detail = data.saleplan_detail;
        console.log('拿到值====' + angular.toJson(detail));
        vm.planDetail.relateCustomer = data.saleplan_detail.customerFullName;
        vm.planDetail.relateCustomerId = data.saleplan_detail.customerId;
        vm.planDetail.relateOpportunity = data.saleplan_detail.opportunityFullName;
        vm.planDetail.relateOpportunityId = data.saleplan_detail.opportunityId;
        init();
      } else {
        hmsPopup.showPopup(data.returnMsg);
      }
    }
    var error = function () {
      $scope.showSmallCrmLoading = false;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    if (planId != '' && planId != undefined) {
      param.planId = planId;

      plansService.getPlanByDate(getPlanSuccess, error, param);
    }
    console.log(detail);
    if (baseConfig.debug) {
      console.log('plansDetailCtrl authority ' + angular.toJson(authority));
      console.log('plansDetailCtrl detail' + angular.toJson(detail));
    }

    var pageControl = {
      nowPage: 1,
      pageSize: 30,
    };

    vm.timeItemsBucket = {};

    var timeItemsBucketList =
    {
      "上午": 0,
      "下午": 1,
      "晚上": 2
    };

    if (detail.dataStatus == 'HCRM_VALID' && authority == 'MY') {
      //有效的计划
      vm.planType = 0;
    } else if (detail.dataStatus == 'HCRM_VALID' && authority == 'OTHER') {
      //复制的计划
      vm.planType = 1;
    } else {
      //无效的计划
      vm.planType = 3;
    }

    if (detail.planType == 'HCRM_COPY_PLAN' && authority == 'MY') {
      vm.planType = 2;
    }
    if (detail.isImportant == "Y") {
      $scope.importantNum = 1;
    } else {
      $scope.importantNum = 0;
    }
    $scope.searchModel = {
      searchValueKey: ""
    };
    vm.planDetail = {
      "relateCustomerId": $stateParams.planDetail.customerId,
      "relateOpportunityId": $stateParams.planDetail.opportunityId
    };
    /* $scope.nowPage=1;
     $scope.pageSize=20;*/
    //通用选择弹窗
    var selectTargets = [{
      'key': 'contact',
      'interface': plansAddService.searchCustomer,  //获得选择项的接口
      'params': [initCustomerSuccess, $scope.searchModel.searchValueKey, pageControl.nowPage, pageControl.pageSize],  //获得选择项时接口所需参数
      'showKey': 'fullName',            //选择界面显示的数据
      'dataKey': 'customerId',      //对象内最终操作提交所需的数据变量
      'dataModel': 'vm.planDetail.relateCustomerId',  //最终操作提交所需的数据变量
      'showDataModel': 'vm.planDetail.relateCustomer', //显示在界面上的ng-model
      'searchInterface': plansAddService.searchCustomer,
      'searchParams': getCustomerSearchSuccess,
      'needShowMore': true
    }, {
      'key': 'business',
      'interface': plansAddService.getBusiness,  //获得选择项的接口
      'params': [getBusinessSuccess, $scope.searchModel.searchValueKey, pageControl.nowPage, pageControl.pageSize, vm.planDetail.relateCustomerId],  //获得选择项时接口所需参数
      'showKey': 'opportunityName',            //选择界面显示的数据
      'dataKey': 'opportunityId',      //对象内最终操作提交所需的数据变量
      'dataModel': 'vm.planDetail.relateOpportunityId',  //最终操作提交所需的数据变量
      'showDataModel': 'vm.planDetail.relateOpportunity', //显示在界面上的ng-model,
      'searchInterface': plansAddService.getBusiness,
      'searchParams': getOpportunitySearchSuccess,
      'needShowMore': true
    }];
    /*    var selectTargets = {
     'contact': {
     'key': "contact",
     'interface': opportunityAddService.getCustomers,  //获得选择项的接口
     'params': [
     initCustomerSuccess,
     pageControl.nowPage,
     pageControl.pageSize,
     'MY_CUSTOMER'],  //获得选择项时接口所需参数
     'showKey': 'fullName',            //选择界面显示的数据
     'dataKey': 'customerId',      //对象内最终操作提交所需的数据变量
     'dataModel': 'vm.planDetail.relateCustomerId',  //最终操作提交所需的数据变量
     'showDataModel': 'vm.planDetail.relateCustomer', //显示在界面上的ng-model
     'searchInterface': opportunityAddService.searchCustomer,
     'searchParams': getCustomerSearchSuccess,
     'needShowMore': true
     },
     'business': {
     'key': "business",
     'interface': plansAddService.getBusiness,  //获得选择项的接口
     'params': [
     getBusinessSuccess,
     pageControl.nowPage,
     pageControl.pageSize,
     detail.customerId],  //获得选择项时接口所需参数
     'showKey': 'opportunityName',            //选择界面显示的数据
     'dataKey': 'opportunityId',      //对象内最终操作提交所需的数据变量
     'dataModel': 'vm.planDetail.relateOpportunityId',  //最终操作提交所需的数据变量
     'showDataModel': 'vm.planDetail.relateOpportunity', //显示在界面上的ng-model,
     'searchInterface': plansAddService.getSearchOpportunity,
     'searchParams': getOpportunitySearchSuccess,//要换的！！！
     'needShowMore': true
     }
     };*/

    vm.planDetail = {
      "leaderName": detail.leaderName,
      "relateCustomer": detail.customerFullName,
      "relateCustomerId": detail.customerId,
      "relateOpportunity": detail.opportunityFullName,
      "relateOpportunityId": detail.opportunityId,
      "annotate": detail.annotate,
      "scheduleDate": "",
      "scheduleDateStr": "",
      "isImportant": detail.isImportant
    };

    vm.iconList = {
      "customer": "build/img/plans/icon_partner@3x.png",
      "opportunity": "build/img/plans/icon_money2@3x.png",
      "schedule": "build/img/plans/icon_plan@3x.png"
    };

    vm.titleList = {
      "relateCustomer": "关联客户",
      "relateOpportunity": "商机/线索",
      "scheduleDate": "计划日期"
    };

    vm.goBack = goBack;
    vm.selectTime = selectTime;
    vm.cancelPlan = cancelPlan;
    vm.savePlan = savePlan;
    vm.copyPlan = copyPlan;
    vm.voiceTo = voiceTo;
    vm.onRelease = onRelease;
    vm.showWeekChoose = showSelectDiv;
    vm.choosePlanTime = choosePlanTime;


    $scope.showSelectDiv = showSelectDiv;
    $scope.selectItem = selectItem;
    $scope.loadMore = loadMore;
    $scope.searchSelectValue = searchSelectValue;
    $scope.showSelect = false;
    $scope.moreDataCanBeLoaded = false;
    $scope.nowSelectTarget = {};
    $scope.searchModel = {}

    $ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function (modal) {
      $scope.crmSelectModal = modal;
    });
    if (planId == '' || !planId) {
      init();
    }
    Array.prototype.clone = function () {
      return [].concat(this);
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

    //成功获取客户列表方法
    function initCustomerSuccess(response) {
      $scope.showCrmLoading = false;
      if (response.returnCode == 'S') {
        $scope.moreDataCanBeLoaded = response.customer_list.length == pageControl.pageSize;
        $scope.items = $scope.items.concat(response.customer_list);
        $scope.sourceItems = $scope.items.clone();
      } else {
        $scope.moreDataCanBeLoaded = false;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    //成功获取客户列表方法
    function getCustomerSearchSuccess(response) {
      $scope.showCrmLoading = false;
      if (response.returnCode == 'S') {
        $scope.items = response.customer_list;
        $scope.moreDataCanBeLoaded = response.customer_list.length == pageControl.pageSize;
      } else {
        $scope.moreDataCanBeLoaded = false;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    function getBusinessSuccess(response) {
      $scope.showCrmLoading = false;
      console.log(response);
      if (response.returnCode == 'S') {
        $scope.moreDataCanBeLoaded = response.opportunity_list.length == pageControl.pageSize;
        $scope.items = $scope.items.concat(response.opportunity_list);
        $scope.sourceItems = $scope.items.clone();
      } else {
        $scope.moreDataCanBeLoaded = false;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    function getOpportunitySearchSuccess(response) {
      $scope.showCrmLoading = false;
      if (response.returnCode == 'S') {
        $scope.items = response.opportunity_list;
        $scope.moreDataCanBeLoaded = response.opportunity_list.length == pageControl.pageSize;
      } else {
        $scope.moreDataCanBeLoaded = false;
      }
      console.log('$scope.moreDataCanBeLoaded ' + $scope.moreDataCanBeLoaded);
      console.log('$scope.nowSelectTarget.needShowMore ' + $scope.nowSelectTarget.needShowMore)
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    function init() {
      vm.planDetail = {
        "leaderName": detail.leaderName,
        "relateCustomer": detail.customerFullName,
        "relateCustomerId": detail.customerId,
        "relateOpportunity": detail.opportunityFullName,
        "relateOpportunityId": detail.opportunityId,
        "annotate": detail.annotate,
        "scheduleDate": "",
        "scheduleDateStr": "",
        "isImportant": detail.isImportant
      };
      //vm.planType = 0;
      //var str = '';
      console.log(angular.toJson(detail));
      var str = detail.planDate;
      str = str.replace(/-/g, "/");//注释掉的地方
      var date = new Date(str);
      console.log(detail);
      console.log("=====");
      vm.planDetail.scheduleDate = date;
      vm.planDetail.scheduleDateStr = plansService.getDateString(date) + ' ' + showTime(date);
      vm.planDetail.annotate = detail.annotate;
      vm.saleContent = detail.saleContent;
      vm.planDetail.status = detail.dataStatusName;
      console.log(vm.planDetail);
      var listSuccessInit = function (result) {
        vm.timeItemsBucket.number = 0;
        //console.log(result.lookup_detail[0].lookup_value_list);
        vm.timeItems = result.lookup_detail[0].lookup_value_list;

        vm.timeItemsBucket = {
          number: timeItemsBucketList[detail.timeBucketName],
          value: detail.timeBucketName
        };
        console.log('vm.timeItemsBucket ' + angular.toJson(vm.timeItemsBucket));
      };
      plansAddService.getValueList(listSuccessInit, "HCRM.TIME_BUCKET", "");
    }

    function showSelectDiv(key) {
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
      for (var i = 0; i < selectTargets.length; i++) {
        if (key == selectTargets[i].key) {
          $scope.nowSelectTarget = cloneObj(selectTargets[i]);
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
        selectTargets[1].params = [getBusinessSuccess, $scope.searchModel.searchValueKey, pageControl.nowPage, pageControl.pageSize, vm.planDetail.relateCustomerId];
      $scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
    };
    /*    function showSelectDiv(key) {
     if (baseConfig.debug) {
     console.log('showSelectDiv key ' + key);
     }
     $scope.moreDataCanBeLoaded = false;
     pageControl.nowPage = 1;

     //打开模态框
     if ($scope.showSelect) {
     $scope.showCrmLoading = false;
     $scope.crmSelectModal.hide();
     } else {
     $scope.showCrmLoading = true;
     $scope.crmSelectModal.show();
     }
     $scope.showSelect = !$scope.showSelect;

     if (!$scope.showSelect) {
     $scope.items = [];
     return;
     }

     $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);

     $scope.nowSelectTarget = angular.copy(selectTargets[key]);
     console.log( $scope.nowSelectTarget);
     //初始化一个空值
     if ($scope.showSelect) {
     var showKey = $scope.nowSelectTarget['showKey'];
     var dataKey = $scope.nowSelectTarget['dataKey'];
     eval('$scope.items = [{' + showKey + ': "空",' + dataKey + ': ""}]');
     }

     if (baseConfig.debug) {
     console.log($scope.nowSelectTarget.params);
     }

     $scope.sourceTargetData = cloneObj($scope.nowSelectTarget);
     //$scope.showLoading = true;

     if (key == 'business' || vm.planDetail.relateCustomerId != '') {
     selectTargets[key].params[3] = vm.planDetail.relateCustomerId;
     }

     $scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
     }*/

    /*   function selectItem($index) {
     var item = $scope.items[$index];
     var dynamicValue = $scope.nowSelectTarget;
     var id = item[dynamicValue.dataKey];  //接口所需数据
     var name = item[dynamicValue.showKey];

     name = (name == '空') ? "" : name;
     var idModal = dynamicValue.dataModel;                 //最终操作提交所需的数据变量
     var nameModal = dynamicValue.showDataModel;         //显示用的数据变量ng-model
     eval(idModal + " = id");
     eval(nameModal + " = name");

     if (dynamicValue.key == 'contact') {
     vm.planDetail.opportunityId = '';
     vm.planDetail.relateOpportunity = '';
     selectTargets['business'].params[3] = vm.planDetail.relateCustomerId;
     }
     showSelectDiv();
     }*/
    $scope.clearSelectFilter = function () {
      $scope.searchModel.searchValueKey = '';
      searchSelectValue();
    };
    function selectItem($index) {
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
        window.localStorage.customerId = $scope.items[$index].customerId;
        vm.planDetail.relateOpportunityId = "";
        vm.planDetail.relateOpportunity = "";
        selectTargets[1].params = [getBusinessSuccess, $scope.searchModel.searchValueKey, pageControl.nowPage, pageControl.pageSize, vm.planDetail.relateCustomerId];
      }
      console.log(showKey);
      console.log(data);
      console.log($scope.items[$index].customerName);
      if ($scope.nowSelectTarget['key'] == 'business') {
        /*   $scope.data.customerId = '';
         $scope.showData.fullName = '';*/
        if ($scope.items[$index].customerName != "") {
          vm.planDetail.relateCustomerId = $scope.items[$index].customerId;
          vm.planDetail.relateCustomer = $scope.items[$index].customerName;
        }
        selectTargets[1].params = [getBusinessSuccess, $scope.searchModel.searchValueKey, pageControl.nowPage, pageControl.pageSize, vm.planDetail.relateCustomerId];
      }
      showSelectDiv();
    }

    function loadMore() {
      pageControl.nowPage++;
      $scope.nowSelectTarget.params[1] = pageControl.nowPage;
      $scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
    }

    function searchSelectValue() {
      $scope.showCrmLoading = true;
      if ($scope.nowSelectTarget['searchInterface']) {
        //需要接口搜索的
        if ($scope.searchModel.searchValueKey == '') {
          $scope.items = [];
          pageControl.nowPage = 1;
          $scope.nowSelectTarget = angular.copy($scope.sourceTargetData);
          $scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
        } else {
          $scope.items = [];
          pageControl.nowPage = 1;
          var pageSize = 15;
          $scope.nowSelectTarget.searchInterface.call(null,
            $scope.nowSelectTarget.searchParams,
            $scope.searchModel.searchValueKey,
            pageControl.nowPage,
            pageSize);
        }
      }
    }

    function savePlan() {
      if (baseConfig.debug) {
        console.log('savePlan vm.planDetail' + angular.toJson(vm.planDetail));
        console.log('savePlan vm.timeItemsBucket' + angular.toJson(vm.timeItemsBucket));
      }

      var timeBucket;
      if (vm.timeItemsBucket.number == '0') {
        timeBucket = 'HCRM_MORNING';
      } else if (vm.timeItemsBucket.number == '1') {
        timeBucket = 'HCRM_AFTERNOON';
      } else if (vm.timeItemsBucket.number == '2') {
        timeBucket = 'HCRM_EVENING';
      }

      var params = {
        "customerId": vm.planDetail.relateCustomerId,
        "customerFullName": vm.planDetail.relateCustomer,
        "opportunityId": vm.planDetail.relateOpportunityId,
        "opportunityFullName": vm.planDetail.relateOpportunity,
        "annotate": vm.planDetail.annotate,
        "planDate": plansService.getDateTimeString(vm.planDetail.scheduleDate),
        "planSource": detail.planSource,
        "planType": 'HCRM_NEW_PLAN',
        "saleContent": vm.saleContent,
        "timeBucket": timeBucket,
        "dataStatus": detail.dataStatus,
        "userId": detail.userId,
        "planId": detail.planId
      };
      if (baseConfig.debug) {
        console.log('savePlan params ' + angular.toJson(params));
      }

      function success(result) {
        if (result.returnCode == 'S') {
          plansService.setRefreshDataFlag(true);
          $ionicHistory.goBack();
          hmsPopup.showPopup('修改销售计划成功！');
        } else {
          if (result.errorMessage) {
            hmsPopup.showPopup('修改销售计划出现报错 ' + result.errorMessage);
          } else {
            hmsPopup.showPopup('修改销售计划出现报错，请联系管理员！');
          }
        }
      }

      hmsPopup.showLoading('修改销售计划中');
      plansService.updatePlan(success, params);
    }

    function copyPlan() {
      if (baseConfig.debug) {
        console.log('savePlan vm.planDetail' + angular.toJson(vm.planDetail));
        console.log('savePlan vm.timeItemsBucket' + angular.toJson(vm.timeItemsBucket));
      }

      var params = {
        "customerId": detail.customerId,
        "customerFullName": detail.customerFullName,
        "opportunityId": detail.opportunityId,
        "annotate": detail.annotate,
        "opportunityFullName": detail.opportunityFullName,
        "planDate": detail.planDate,
        "planSource": detail.planSource,
        "planType": 'HCRM_NEW_PLAN',
        "saleContent": detail.saleContent,
        "timeBucket": detail.timeBucket,
        "dataStatus": detail.dataStatus,
        "userId": detail.userId,
        "planId": detail.planId
      };
      if (baseConfig.debug) {
        console.log('savePlan params ' + angular.toJson(params));
      }

      function success(result) {
        if (result.returnCode == 'S') {
          plansService.setRefreshDataFlag(true);
          $ionicHistory.goBack();
          hmsPopup.showPopup('复制销售计划成功！');
        } else {
          if (result.returnCode == "E") {
            hmsPopup.showPopup(result.returnMsg);
          } else {
            hmsPopup.showPopup('复制销售计划出现报错，请联系管理员！');
          }
        }
      }

      hmsPopup.showLoading('复制销售计划中');
      plansService.copyPlan(success, params);
    }

    $scope.importantItems = [
      {
        description: "一般",
        value: "N"
      },
      {
        description: "重要",
        value: "Y"
      }
    ];
    //取消销售计划
    function cancelPlan() {
      function success(result) {
        if (result.returnCode == 'S') {
          plansService.setRefreshDataFlag(true);
          $ionicHistory.goBack();
          hmsPopup.showPopup('取消销售计划成功！');
        } else {
          hmsPopup.showPopup(result.returnMsg);
        }
      }

      hmsPopup.showLoading('取消销售计划中');
      plansService.cancelPlan(success, detail.planId);
    }

    function choosePlanTime() {
      var defaultDate = new Date();
      if (vm.planDetail.scheduleDate) {
        defaultDate = vm.planDetail.scheduleDate
      }
      var options = {
        date: defaultDate,
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
          vm.planDetail.scheduleDate = dateNo;
          vm.planDetail.scheduleDateStr = plansService.getDateString(dateNo) + ' ' + showTime(dateNo);
        }
        $scope.$apply();
      });
    }


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

    //开始录音
    function voiceTo() {
      $scope.holdText = true;
      cordova.plugins.pluginIflytek.startRecorerRecognize(
        function (msg) {
          $('#voice-img').addClass('big-img');
        }, function (msg) {
          $('#voice-img').addClass('big-img');
        });
    }

    //结束录音
    function onRelease() {
      $scope.holdText = false;
      $scope.showVoiceFlag = false;
      $scope.showSmallCrmLoading = true;
      $timeout(function () {
        console.log("timeout");
        $scope.showSmallCrmLoading = false;
        /*  hmsPopup.showPopup("识别失败，请重新尝试！");*/
      }, 5000);
      cordova.plugins.pluginIflytek.stopRecorderRecognize(
        function (msg) {
          hmsPopup.hideLoading();
          $scope.showSmallCrmLoading = false;
          hmsPopup.showPopup(msg);
          /*  $scope.$apply();*/
        }, function (msg) {
          $('#voice-img').removeClass('big-img');
          /* $scope.$apply();*/
          $timeout(function () {
            insertText(document.getElementById('planDetailText'), msg);
            $scope.$apply();
            $scope.showSmallCrmLoading = false;
          }, 0);
        });
    };
    $scope.hideCommont = function () {
      $scope.showCommentFlag = false;
      var item = $('#commentAdd');
      if (ionic.Platform.isWebView()) {
        $timeout(function () {
          cordova.plugins.Keyboard.close();
          console.log("失焦");
          item.blur();
          $scope.$apply();
        }, 300);
      }
    };
    $scope.showComment = function () {
      console.log("======");
      $scope.showCommentFlag = !$scope.showCommentFlag;
      var item = $('#commentAdd');
      if ($scope.showCommentFlag == true) {
        if (ionic.Platform.isWebView()) {
          $timeout(function () {
            cordova.plugins.Keyboard.show();
            console.log("聚焦");
            item.focus();
            $scope.$apply();
            var itemHeight = document.getElementById("commentAdd");
            itemHeight.style.height = '40px';
            itemHeight.scrollTop = 0; //防抖动
            itemHeight.style.height = itemHeight.scrollHeight + "px";
            console.log(itemHeight.style.height);
          }, 300);
        } else {
          $timeout(function () {
            /*  cordova.plugins.Keyboard.show();*/
            console.log("聚焦");
            /* item.focus();*/
            $scope.$apply();
            var itemHeight = document.getElementById("commentAdd");
            itemHeight.style.height = '40px';
            itemHeight.scrollTop = 0; //防抖动
            itemHeight.style.height = itemHeight.scrollHeight + "px";
            console.log(itemHeight.style.height);
          });
        }
      } else {
        $timeout(function () {
          console.log("失焦");
          cordova.plugins.Keyboard.close();
          item.blur();
          $scope.$apply();
        }, 300);
      }
      console.log(detail);
      vm.planDetail.annotate=detail.annotate;
    };
    $scope.annotateSubmit = function () {
      /*  console.log("ssssss");*/
      console.log("发送");
      var annotate = detail.annotate = $('#commentAdd').val();
      console.log(detail);
      var params = {
        planId: detail.planId,
        annotate: annotate
      };
      /*   getPlanByLastSelectDay();*/
      var annotateSuccess = function (result) {
        $scope.showCommentFlag = false;
        if (result.returnCode == "S") {
          init();
        } else {
          hmsPopup.showPopup = result.returnMsg;
          console.log(result);
        }
      };
      var annotatError = function (result) {
        vm.showCommentFlag = false;
        console.log(result);
      };
      plansService.saleAnnotate(annotateSuccess, annotatError, params);
    };
    function selectTime($index, item) {
      vm.timeItemsBucket.number = $index;
      vm.timeItemsBucket.value = item.value;
    }

    $scope.selectImportant = function ($index, item) {
      $scope.importantNum = $index;
      vm.planDetail.isImportant = item.value;
    };
    function goBack() {
      $ionicHistory.goBack();
    }

    $scope.showSmallCrmLoading = false;
    $scope.holdAnnotate = false;
    $scope.touchAnnotate = function () {
      $scope.holdAnnotate = true;
      cordova.plugins.pluginIflytek.startRecorerRecognize(
        function (msg) {
        }, function (msg) {

        });
    };
    $scope.annotateRelease = function () {
      $scope.holdAnnotate = false;
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
            insertText(document.getElementById('commentAdd'), msg);
            $scope.$apply();
            $scope.showSmallCrmLoading = false;
          }, 0);
        });
    };
  }
})();
