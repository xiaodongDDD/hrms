'use strict';
angular.module('competitorModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.competitor', {
          url: '/competitor',
          /*  cache:false,*/
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/competitor/competitor.html',
              controller: 'competitorCtrl'
            }
          }
        })

    }]);
angular.module('competitorModule')
  .controller('competitorCtrl',
  ['$scope',
    '$ionicHistory',
    'competitorListService',
    'hmsPopup',
    '$state',
    '$ionicModal',
    '$ionicScrollDelegate',
    '$rootScope',
    function ($scope,
              $ionicHistory,
              competitorListService,
              hmsPopup,
              $state,
              $ionicModal,
              $ionicScrollDelegate,
              $rootScope) {
      $scope.showContent = false;
      $scope.showShift = false;
      $scope.showHead = true;
      $scope.showData = {
        statusValue: "有效",
        areaValue: ""
      };
      $scope.data = {
        dataStatus: "HCRM_ENABLE",
        areaProperty: "",
        page: 1,
        pageSize: "20",
        fullName: "",
        shortName: ""
      };
      $scope.items = [];
      $scope.onDrag = function($event){
        var deltaY = $event.gesture.deltaY;
        $scope.showHead = deltaY > 0;
      };

      $scope.showShiftDiv = function () {
        console.log("打开搜索框");
        $scope.showShift = !$scope.showShift;
      };
      $scope.goBack = function () {
        if ($ionicHistory.viewHistory().backView) {
          $ionicHistory.goBack();

        } else {
          $state.go('tab.application');
        }
      };
      $scope.goCompetitorDetail = function (item) {
        $state.go("tab.competitor-detail", {param: item});
      };
      $scope.goSearch = function () {
        $state.go('tab.competitor-search');
      };
      $scope.goState = function () {
        $state.go('tab.competitors-add');
      };
      $scope.Global = "HCRM_GLOBAL";
      /*   hmsPopup.showLoading("加载中...");*/
      $scope.competitors = [];//竞争对手列表
      var getListSuccessInit = function (result) {
        $scope.showContent = true;
        if (result.returnCode == "S") {
          $scope.moreDataCanBeLoaded = true;
          $scope.competitors = result.competitor_list;
          if (result.competitor_list.length == 0||result.competitor_list.length< $scope.data.pageSize) {
            $scope.moreDataCanBeLoaded = false;
          }
        } else {
          if(result.returnMsg){
            hmsPopup.showPopup(result.returnMsg)
          }else{
            hmsPopup.showPopup('服务器系统出现异常，请联系管理员！')
          }
        }
      };
      var error = function (response) {
      };
      competitorListService.getCompetitorList(getListSuccessInit, error, $scope.data);
      var getListSuccessInitConcat = function (result) {
        $scope.showContent = true;
        if (result.returnCode == "S") {
          $scope.competitors = result.competitor_list;
        } else{
          if(result.returnMsg){
            hmsPopup.showPopup(result.returnMsg)
          }else{
            hmsPopup.showPopup('服务器系统出现异常，请联系管理员！')
          }
        }
        $scope.$broadcast('scroll.refreshComplete');
      };
      $scope.doRefresh = function () {
        $scope.data.page = 1;
        $scope.moreDataCanBeLoaded = true;
        var error = function (response) {
        };
        competitorListService.getCompetitorList(getListSuccessInitConcat, error, $scope.data);

      };
      $rootScope.$on("REFRESH_COMPETITOR_ADD", function () {
        $scope.doRefresh();
      });
      $scope.moreDataCanBeLoaded = true;
      var getMoreListSuccessInitConcat = function (result) {
        if (result.returnCode == "S") {
          $scope.competitors = $scope.competitors.concat(result.competitor_list);
          if (result.competitor_list.length < $scope.data.pageSize || result.competitor_list.length == 0) {
            console.log("没有数据了" + $scope.moreDataCanBeLoaded);
            $scope.moreDataCanBeLoaded = false;
          }
        } else{
          if(result.returnMsg){
            $scope.moreDataCanBeLoaded = false;
            hmsPopup.showPopup(result.returnMsg);
          }else{
            hmsPopup.showPopup('服务器系统出现异常，请联系管理员！')
          }
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      $scope.loadMore = function () {
        console.log("上拉加载" + $scope.moreDataCanBeLoaded);
        $scope.data.page++;
        var error = function (response) {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        competitorListService.getCompetitorList(getMoreListSuccessInitConcat, error, $scope.data);
        //$ionicScrollDelegate.$getByHandle("slideimgs").resize();
      };
      var upData =
        [
          {
            "code": "HCRM.COMPETITOR_DATA_STATUS",
            "lastUpdateDate": "COMPETITOR_DATA_STATUS_DATE",
            localList: 'COMPETITOR_DATA_STATUS'
          },
          {
            "code": "HCRM.COMPETITOR_AREA_PROPERTY",
            "lastUpdateDate": "COMPETITOR_AREA_PROPERTY_DATE",
            localList: 'COMPETITOR_AREA_PROPERTY'
          }
        ];
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

      var getValueObjByCode = function (code) {
        console.log(code);
        for (var i = 0; i < upData.length; i++) {
          if (code == upData[i].code)
            return cloneObj(upData[i]);
        }

      };
      var listInitSuccess = function (response) {
        hmsPopup.hideLoading();
        if (response.returnCode == 'S') {
          console.log(response);
          for (var i = 0; i < response.lookup_detail.length; i++) {
            var code = response.lookup_detail[i].lookup_code;
            var lastUpdateDate = response.lookup_detail[i].last_update_date;
            var valueObj = getValueObjByCode(code);
            if (lastUpdateDate != window.localStorage[valueObj.lastUpdateDate]) {
              window.localStorage[valueObj.lastUpdateDate] = lastUpdateDate;
              window.localStorage[valueObj.localList] = JSON.stringify(response.lookup_detail[i].lookup_value_list);
            }
          }
        }else{
          if(response.returnMsg){
            hmsPopup.showPopup(response.returnMsg)
          }else{
            hmsPopup.showPopup('服务器系统出现异常，请联系管理员！')
          }
        }
        ;
      };
      /*  console.log(upData);*/
      competitorListService.getValueList(listInitSuccess, upData);
      var showValueInList = function (code) {
        var valueObj = getValueObjByCode(code);
        $scope.items = $scope.items.concat(JSON.parse(window.localStorage[valueObj.localList]));
        $scope.sourceItems = $scope.items.clone();
      };
      //通用选择弹窗
      $scope.selectTargets = [{
        'key': 'area',
        'interface': showValueInList,
        'params': ['HCRM.COMPETITOR_AREA_PROPERTY'],
        'showKey': 'description',
        'dataKey': 'value',
        'dataModel': '$scope.data.areaProperty',
        'showDataModel': '$scope.showData.areaValue'
      }, {
        'key': 'status',
        'interface': showValueInList,
        'params': ['HCRM.COMPETITOR_DATA_STATUS'],
        'showKey': 'description',
        'dataKey': 'value',
        'dataModel': '$scope.data.dataStatus',
        'showDataModel': '$scope.showData.statusValue'
      }];
      function isContains(str, substr) {
        return new RegExp(substr).test(str);
      }

      Array.prototype.clone = function () {
        return [].concat(this);
      };
      $scope.searchModel = {
        searchValueKey: ""
      };
      $scope.sourceItems = [];
      $scope.noDataFlag = false;
      $scope.clearSelectFilter = function () {
        console.log("clear");
        $scope.searchModel.searchValueKey = '';
        $scope.searchSelectValue();
        $ionicScrollDelegate.scrollTop();
        /* $scope.items = $scope.data.clone();*/
      };
      $scope.searchSelectValue = function(){
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
        if($scope.nowSelectTarget['searchInterface']){
          //需要接口搜索的
          $scope.showCrmLoading = true;
          $scope.moreDataCanBeLoaded = false;
          if($scope.searchModel.searchValueKey == ''){
            $scope.items = [];
            $scope.nowPage = 1;
            $scope.nowSelectTarget = cloneObj($scope.sourceTargetData);
            $scope.nowSelectTarget.interface.apply(null,$scope.nowSelectTarget.params);
          } else{
            $scope.items = [];
            $scope.nowPage = 1;
            $scope.pageSize = 15;
            $scope.nowSelectTarget.searchInterface.call(null,$scope.nowSelectTarget.searchParams,$scope.searchModel.searchValueKey,$scope.nowPage,$scope.pageSize);
          }
        } else {
          //本地字段搜索的
          $scope.nowPage = 1;
          $scope.pageSize = 15;
          var notShowNum = 0;
          if($scope.searchModel.searchValueKey == ''){
            $scope.noDataFlag = false;
            $scope.items = $scope.sourceItems.clone();
          }
          else{
            for(var i = 0; i < $scope.sourceItems.length; i++){
              if(isContains($scope.sourceItems[i][$scope.nowSelectTarget['showKey']],$scope.searchModel.searchValueKey))
                $scope.items[i] = $scope.sourceItems[i];
              else{
                $scope.items[i] = '';
                notShowNum++;
              }
            }
            $scope.noDataFlag = notShowNum == $scope.sourceItems.length;
          }
        }
      };
      $ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal1) {
        $scope.crmSelectModal = modal1;
      });
      $scope.showSelect = false;
      $scope.showSelectDiv = function (key) {
        $scope.searchModel.searchValueKey = '';
        $scope.nowPage = 1;
        //打开模态框
        if ($scope.showSelect) {
          console.log("隐藏");
          $scope.crmSelectModal.hide();
        } else {
          console.log("打开");
          $scope.crmSelectModal.show();
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
        $scope.showSelectDiv();
      };
      $scope.clearSifting = function () {
        $scope.showData = {
          statusValue: "",
          areaValue: ""
        };
        $scope.data = {
          dataStatus: "",
          areaProperty: "",
          page: 1,
          pageSize: "20",
          fullName: "",
          shortName: ""
        };
      };
      $scope.sifting = function () {
        $scope.showContent = false;
        $scope.data.page = 1;
        $scope.showShift = !$scope.showShift;
        var error = function (response) {
        };
        $ionicScrollDelegate.scrollTop();
        competitorListService.getCompetitorList(getListSuccessInit, error, $scope.data);
      };

    }])
