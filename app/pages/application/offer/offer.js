/**
 * Created by wkh on 2017/2/28.
 */
'use strict';
angular.module('offerModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.offer', {
          url: '/offer',
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/offer/offer.html',
              controller: 'offerCtrl'
            }
          }
        })
    }]);

angular.module('offerModule')
  .controller('offerCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'publicMethod',
    '$ionicHistory',
    'history',
    'hmsPopup',
    '$timeout',
    'hmsHttp',
    '$ionicModal',
    '$ionicPopover',
    'offerListService',
    'historyOpportunity',
    'competitorListService',
    function ($scope,
              $rootScope,
              $state,
              publicMethod,
              $ionicHistory,
              history,
              hmsPopup,
              $timeout,
              hmsHttp,
              $ionicModal,
              $ionicPopover,
              offerListService,
              historyOpportunity, competitorListService) {
      var item = $('#offerInputSearch');
      $scope.operating=[
        {text:"新建投保报价"},
        {text:"新建定标报价"}
      ];
      $scope.showLoadingFlag=true;
      $scope.showCrmEstimateLoading=false;
      $scope.valueType = [{
        page: 1,
        pageSize: 20,
        queryType:'ALL',
        sortname: '',
        sortorder: ''
      },{
        page: 1,
        pageSize: 20,
        queryType:'MY',
        sortname: '',
        sortorder: ''
      }];
      $scope.subHeadersSelect=[
        false,true
      ];
      $scope.showShift = false;
      $scope.showSort = false;
      //$scope.showLoading = true;
      $scope.loadMoreDataFlag = false;
      $scope.showHead = true;
      $scope.offers=[];
      $scope.offerListParam={
        "opportunityName": "",
        "sortname":"",
        "sortorder":"",
        "offerStageList":[],
        "offerStatusList":[],
        "queryType":"ALL",
        "page":"1",
        "pageSize":"20"
      };
      //排序数据
      $scope.sortList = [{
        flag: 'desc',
        name: 'creationDate',
        text: '创建时间最近',
        icon: 'icon_customer'
      }, {
        flag: 'asc',
        name: 'creationDate',
        text: '创建时间最早',
        icon: 'icon_customer'
      },{
        flag: 'asc',
        name: 'offerStage',
        text: '按阶段排序',
        icon: 'icon_house_blue'
      },{
        flag: 'asc',
        name: 'dataStatus',
        text: '按状态排序',
        icon: 'icon_house_blue'
      }];
      $scope.historyGoBack=function(){
        $ionicHistory.goBack();
      };
      $scope.subHeadersSelect=false;
      $scope.selectSubHeader = function (index) {
        $scope.offerListParam.page=1;
        $scope.selectSubHeaderIndex=index;
        if(index=="MY"){
          $scope.subHeadersSelect=true;
        }else{
          $scope.subHeadersSelect=false;
        }
        $scope.showLoadingFlag=true;
        $scope.offers=[];
        $scope.offerListParam.queryType=index;
        offerListService.getOfferList(getOfferListSuccess,$scope.offerListParam);
      };
      $scope.selectSort = function(index){
        $scope.offerListParam.page=1;
        $scope.offerListParam.sortorder=index.flag;
        $scope.offerListParam.sortname=index.name;
        $scope.showLoadingFlag=true;
        $scope.offers=[];
        console.log( $scope.offerListParam);
        offerListService.getOfferList(getOfferListSuccess,$scope.offerListParam);
      };
      $ionicPopover.fromTemplateUrl('build/pages/modals/popover-offer.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.popoverCard = popover;
      });
      $scope.openPopover = function($event) {
        $scope.popoverCard.show($event);
      };
      $scope.closePopover = function(index) {
        $scope.popoverCard.hide();
        if(index==0){
          $scope.addOfferModal.show();
          $scope.$emit('INIT_OFFER');
        }else{
          hmsPopup.showPopup("定标报价须由投标报价创建，请至“已审核”的投标报价详情页面，进行创建");
        }
      };
      $ionicModal.fromTemplateUrl('build/pages/application/offer/add-offer/add-offer.html',{
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.addOfferModal = modal;
      });
      $ionicModal.fromTemplateUrl('build/pages/application/offer/offer-search/offer-search.html',{
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.offerSearchModal = modal;
      });
      $scope.onDrag = function ($event) {
        var deltaY = $event.gesture.deltaY;
        $scope.showHead = deltaY > 0;
      };
      $scope.openSearch=function(){
        //$state.go("tab.offerSearch");
        $scope.offerSearchModal.show();
        $scope.offerSearchListParam.opportunityName="";
      };
      $scope.goOfferDetail=function(item){
        $state.go("tab.offerDetail",{param:item.offerHeaderId});
      };
      $scope.showShiftDiv = function () {
        $scope.showShift = !$scope.showShift;
        $scope.showSort = false;
      };
      $scope.showSortDiv = function(){
        $scope.showSort = !$scope.showSort;
        $scope.showShift = false;
      };
      $scope.saveFilter=function(){
        $scope.showShift = false;
        $scope.showSort = false;
        $scope.showLoadingFlag=true;
        $scope.offers=[];
        $scope.offerListParam.page=1;
        $scope.offerListParam.offerStageList=$scope.offerStageList;
        $scope.offerListParam.offerStatusList=$scope.offerStatusList;
        offerListService.getOfferList(getOfferListSuccess,$scope.offerListParam);
      };
      console.log($scope.bilingual);
      var upData = [
        {
          "code": "HOM.OFFER_STAGE",
          "lastUpdateDate": "OFFER_STAGE_DATA",
          localList: 'OFFER_STAGE'
        }
      ];
      var getValueObjByCode = function (code) {
        console.log(code);
        for (var i = 0; i < upData.length; i++) {
          if (code == upData[i].code)
            return cloneObj(upData[i]);
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
      /*  console.log(JSON.parse(window.localStorage.sexdata));*/
      var listInitSuccess = function (response) {
        console.log("--------");
        console.log(response);
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
            $scope.offerStage=JSON.parse(window.localStorage.OFFER_STAGE);
            console.log($scope.offerStage);
          }
          console.log( angular.toJson($scope.offerStage)+"----");
          for(var i=0;i<$scope.offerStage.length;i++){
            $scope.offerStage[i].checked=false;
          }
          console.log($scope.offerStage);
        }else{
          if(response.returnMsg){
            $scope.showContent=true;
            hmsPopup.showShortCenterToast(response.returnMsg)
          }else{
            hmsPopup.showShortCenterToast('服务器系统出现异常，请联系管理员！')
          }
        }
      };
      /*  console.log(upData);*/
      competitorListService.getValueList(listInitSuccess, upData);
      var offerStatusSuccess=function(result){
        console.log(result);
        $scope.offerStatusData=result.offer_status;
        for(var i=0;i<$scope.offerStatusData.length;i++){
          $scope.offerStatusData[i].checked=false;
        }
        console.log(angular.toJson($scope.offerStatusData)+"====9999");
      };
      $scope.offerStageList=[];
      $scope.offerStatusList=[];
      $scope.chooseOfferStage=function(item){
        console.log(item);
        item.checked=!item.checked;
        if(item.checked){
          $scope.offerStageList.push(item.value);
          console.log( $scope.offerStageList);

          console.log(s);
        }else{
          var s=$scope.offerStageList.indexOf(item.value);
          $scope.offerStageList.splice(s,1);
          console.log( $scope.offerStageList);
        }
        console.log(item.checked);
      };
      $scope.chooseOfferStatus=function(item){
        item.checked=!item.checked;
        if(item.checked){
          $scope.offerStatusList.push(item.offerStatusCode);
          console.log( $scope.offerStatusList);

          console.log(s);
        }else{
          var s=$scope.offerStatusList.indexOf(item.offerStatusCode);
          $scope.offerStatusList.splice(s,1);
          console.log( $scope.offerStatusList);
        }
        console.log(item.checked);
      };
      var offerStatusData={};
      offerListService.offerStatus(offerStatusSuccess,offerStatusData);

      var getOfferListSuccess=function(result){
        console.log(result);
        $scope.showLoadingFlag=false;
        hmsPopup.hideLoading();
        if(result.returnCode=="S"){
          $scope.offers=result.offer_list;
          if(result.offer_list.length<$scope.offerListParam.pageSize || result.offer_list.length == 0){
            $scope.loadMoreDataFlag=false;
          }else{
            $scope.loadMoreDataFlag=true;
          }
        }else{
          $scope.loadMoreDataFlag = false;
        }
        $scope.$broadcast('scroll.refreshComplete');
      };
      var getOfferRefreshListSuccess=function(result){
        console.log(result);
        hmsPopup.hideLoading();
        $scope.loadMoreDataFlag=true;
        if(result.returnCode=="S"){
          $scope.offers=result.offer_list;

        }else{
          $scope.loadMoreDataFlag = false;
        }
        $scope.$broadcast('scroll.refreshComplete');
      };
      var getOfferMoreListSuccess=function(result){
        console.log(result);
        hmsPopup.hideLoading();
        if (result.returnCode == "S") {
          $scope.offers = $scope.offers.concat(result.offer_list);
          if (result.offer_list.length < $scope.offerListParam.pageSize || result.offer_list.length == 0) {
            console.log("没有数据了" + $scope.loadMoreDataFlag);
            $scope.loadMoreDataFlag = false;
          }
        } else{
          $scope.loadMoreDataFlag = false;
          if(result.returnMsg){
            $scope.moreDataCanBeLoaded = false;
            hmsPopup.showShortCenterToast(result.returnMsg);
          }else{
            hmsPopup.showShortCenterToast('服务器系统出现异常，请联系管理员！')
          }
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      $scope.doRefresh=function(){
        $scope.offers=[];
        $scope.offerListParam.page=1;
        offerListService.getOfferList(getOfferRefreshListSuccess,$scope.offerListParam)
      };
      $scope.resetData=function(){
        $scope.offerStageList=[];
        $scope.offerStatusList=[];
        offerListService.offerStatus(offerStatusSuccess,offerStatusData);
        competitorListService.getValueList(listInitSuccess, upData);
      };
      $scope.loadMoreData=function(){
        $scope.offerListParam.page++;
        offerListService.getOfferList(getOfferMoreListSuccess,$scope.offerListParam);
      };
      //hmsPopup.showLoading("正在加载");
      offerListService.getOfferList(getOfferListSuccess,$scope.offerListParam);

      $scope.showContent = true;
      var item = $('#opportunityInputSearch');
      $scope.offerSearchListParam={
        "opportunityName": "",
        "page":"1",
        "pageSize":"20"
      };

      $scope.moreDataCanBeLoaded = false;

      $scope.$on('$ionicView.afterEnter', function () { //初始化input框-自动聚焦
        if (ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
          $timeout(function () {
            item.focus();
            $scope.$apply();
          }, 0);
        }
      });

      $scope.historys = [];
      //显示更多
      $scope.showMore = function (item) {
        console.log(item);
        item.flag = !item.flag;
        var heightItem = $("#repeat-item").height();
        console.log(heightItem);
      };

      $scope.searchData = [];
      var searchMoreSuccess = function (result) {
        console.log(":" + $scope.moreDataCanBeLoaded);
        $scope.showLoading = false;
        if (result.returnCode == 'S') {
          $scope.showContent = true;
          $scope.searchData[0].data = $scope.searchData[0].data.concat(result.opportunity_list);
          $scope.moreDataCanBeLoaded = result.opportunity_list.length == $scope.pageSize;
        } else {
          $scope.moreDataCanBeLoaded = false;
          $scope.showContent = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      var searchSuccessInit = function (result) {
        $scope.showLoading = false;
        console.log("success");
        $scope.searchData = [
          {
            typeName: "商机",
            type: "HCRM_OPPORTUNITY",
            data: []
          }
        ];
        console.log("==========");
        if (result.returnCode == 'S') {
          $scope.showContent = true;
          for (var i = 0; i < result.opportunity_list.length; i++) {
            var tem = result.opportunity_list[i];
            $scope.searchData[0].data.push(tem);
          }
          $timeout(function(){
            $scope.moreDataCanBeLoaded = result.opportunity_list.length == $scope.pageSize;
          }, 500)
        } else {
          $scope.moreDataCanBeLoaded = false;
          $scope.showContent = true;
        }
      };
      var getOfferSearchListSuccess=function(result){
        console.log(result);
        console.log("success");
        $scope.searchData = [
          {
            typeName: "商机",
            type: "HCRM_OPPORTUNITY",
            data: []
          }
        ];
        console.log("==========");
        if (result.returnCode == 'S') {
          $scope.showContent = true;
          for (var i = 0; i <result.offer_list.length; i++) {
            var tem =result.offer_list[i];
            $scope.searchData[0].data.push(tem);
          }
          $timeout(function(){
            $scope.moreDataCanBeLoaded = result.offer_list.length == $scope.pageSize;
          }, 500)
        } else {
          $scope.moreDataCanBeLoaded = false;
          $scope.showContent = true;
        }
        hmsPopup.hideLoading();
      };
      $scope.searchWholeData = function () {

        $scope.showContent = false;
        $scope.moreDataCanBeLoaded = false;
        $scope.searchData = [];
        offerListService.getOfferList(getOfferSearchListSuccess,$scope.offerSearchListParam)
      };

      $scope.loadMore = function(){
        $scope.searchParam.page++;
        offerListService.getOfferList(getOfferSearchListSuccess,$scope.offerSearchListParam)
      };
      $scope.history = {};//临时存放历史记录
      //删除单条记录
      $scope.deleteItem = function (item, index) {
        console.log(item);
        historyOpportunity.removeHistory(item);
        $scope.historys.splice(index, 1);
      };
      //初始化历史记录
      $scope.init = function () {
        console.log('初始化历史记录');
        historyOpportunity.getAllHistory(function (data) {
          console.log(angular.toJson(data)+"没保存数据目前打印的是空数组");    //还没保存数据目前打印的是空数组
          $scope.historys = [];
          for (var i = 0; i < data.length; i++) {
            $scope.historys.push(data[i]);
          }
          $scope.$apply();
          /* $scope.birthdays = data;*/
        })
      };
      $scope.init();
      var REFRESH_OFFER_HISTORY = $rootScope.$on("REFRESH_OFFER_HISTORY", function () {
        $scope.init();
      });
      var DO_REFRESH=$rootScope.$on("DO_REFRESH",function(){
        $scope.doRefresh();
      });
      $scope.chooseCustomer=function(item){
        console.log(item);
        $scope.offerListParam.opportunityName=item.customerName;
        $scope.offerListParam.page=1;
        offerListService.getOfferList(getOfferListSuccess,$scope.offerListParam);
        console.log(item);
        $scope.history.fullName = item.opportunityName;
        $scope.history.customerName = item.customerName;
        $scope.history.offerHeaderId = item.offerHeaderId;
        console.log("=====是否存在");
        console.log(angular.toJson($scope.historys));
        console.log(!inArrayOfferHeaderId($scope.historys, $scope.history.offerHeaderId));
        if (!inArrayOfferHeaderId($scope.historys, $scope.history.offerHeaderId)) {//判断是否已经存储
          historyOpportunity.addHistory($scope.history);
          $scope.$emit('REFRESH_OFFER_HISTORY');
        }
        $scope.offerSearchModal.hide();
      };
      $scope.chooseHistory=function(item){
        console.log(item);
        $scope.offerListParam.opportunityName=item.customerName;
        $scope.offerListParam.page=1;
        offerListService.getOfferList(getOfferListSuccess,$scope.offerListParam);
        $scope.offerSearchModal.hide();
      };
      $scope.hideSearch = function () {
        $scope.offerSearchModal.hide();
      };
      //清除历史记录
      $scope.deleteHistory = function () {
        console.log($scope.historys);
        for (var i = 0; i < $scope.historys.length; i++) {
          historyOpportunity.removeHistory($scope.historys[i]);
          console.log($scope.historys[i])
        }
        console.log($scope.historys);
        $scope.historys = [];
      };
      $scope.clearInputContent = function () {
        $scope.offerSearchListParam.opportunityName = "";
        if (ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
        }
        $timeout(function () {
          item.focus();
          $scope.$apply();
        }, 400);
      };
      $scope.clearInputOfferContent=function(){
        $scope.offerListParam.opportunityName = "";
        $scope.offerListParam.page=1;
        offerListService.getOfferList(getOfferListSuccess,$scope.offerListParam);
        if (ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
        }
        $timeout(function () {
          item.focus();
          $scope.$apply();
        }, 400);
      };
      //销毁广播
      $scope.$on('$destroy',function(){//controller回收资源时执行
        REFRESH_OFFER_HISTORY();//回收广播
        DO_REFRESH();
      });
    }]);
angular.module('offerModule')
  .service('offerListService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function (hmsHttp,
              hmsPopup,
              baseConfig) {

      var baseUrl = baseConfig.basePath;
      //得到报价状态列表
      this.offerStatus = function (success, key) {
        hmsHttp.post(baseUrl + 'offer_status', key).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
        });
      };
      //得到报价类型值列表
      this.offerType = function (success, key) {
        hmsHttp.post(baseUrl + 'offer_type', key).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
        });
      };
      //获取报价列表
      this.getOfferList = function (success, param) {
        hmsHttp.post(baseUrl + 'select_offer', param).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
        });
      };
      //获取商机列表
      this.getOpportunitiesList = function (success, keyWord, page, pageSize) {
        var param={
          opportunityName: keyWord,
          page: page,
          pageSize: pageSize
        };
        hmsHttp.post(baseUrl + 'select_offer_opps', param).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
        });
      };
      //获取报价详情
      this.getOfferDetail = function (success,offerDetailId) {
        var param={
          "offerHeaderId": offerDetailId
        };
        hmsHttp.post(baseUrl + 'offer_detail', param).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
        });
      };
      //获取售前预估列表
      this.getEstimateList = function (success,param) {
        hmsHttp.post(baseUrl + 'offer_opp_product', param).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
        });
      };
      //新建商机校验
      this.getVailedLine = function (success,opportunityId) {
        var param={
          "opportunityId":opportunityId
        };
        hmsHttp.post(baseUrl + 'offer_valied_line', param).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
        });
      };
      //产品类型列表
      this.getProductType= function (success,parentCode) {
        var param= {"parentCode":parentCode};
        hmsHttp.post(baseUrl + 'query_brandType', param).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
        });
      };
      //二级产品类型列表
      this.getQueryProductType= function (success,parentCode) {
        var param= {"parentCode":parentCode};
        hmsHttp.post(baseUrl + 'query_productType', param).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
        });
      };
      //顾问类型值列表
      this.getCounselorTypeList=function(success,params){
        hmsHttp.post(baseUrl + 'counselor_type', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
        });
      };
      //失效报价单
      this.offerInvalid=function(success,offerHeaderId){
        var params = {
          offerHeaderId:offerHeaderId
        };
        hmsHttp.post(baseUrl + 'offer_invalid', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
        });
      };
      //删除报价单
      this.offerDelete=function(success,offerHeaderId){
        var params = {
          offerHeaderId:offerHeaderId
        };
        hmsHttp.post(baseUrl + 'offer_delete', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
        });
      };
      //获取值列表
      this.getValueList = function (success, code) {
        var params = {
          "lookupList": [{
            code: code,
            lastUpdateDate: ""
          }]
        };
        hmsHttp.post(baseUrl + 'query_lookup', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (error) {
        });
      };
      //获取顾问级别
      this.getCounselorLevel=function(success,params){
        hmsHttp.post(baseUrl + 'counselor_level', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (error) {
        });
      };
      //顾问人天单价查询
      this.getResourcePrice = function (success, params) {
        hmsHttp.post(baseUrl + 'resource_price', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (error) {
        });
      };
      //保存报价
      this.offerSubmit = function (success, params) {
        hmsHttp.post(baseUrl + 'offer_submit', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (error) {
        });
      };
      //创建定标报价（选择是的时候）
      this.createBidedCopy = function (success, params) {
        hmsHttp.post(baseUrl + 'tender_to_award', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (error) {
        });
      };
      //编辑详情
      this.offerEdit = function (success, params) {
        hmsHttp.post(baseUrl + 'offer_edit', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (error) {
        });
      };
      //创建新版投标报价(新接口)
      this.createBid = function (success, params) {
        hmsHttp.post(baseUrl + 'create_tender', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (error) {
        });
      };
      //创建新版投标定价(新接口)
      this.createAward = function (success, params) {
        hmsHttp.post(baseUrl + 'create_award', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (error) {
        });
      };
      //售前预估行校验
      this.checkSameOffer = function (success, params) {
        hmsHttp.post(baseUrl + 'check_same_offer', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (error) {
        });
      };
      //创建新版投标报价的权限
      this.createNewBidAuth = function (success, offerHeaderId) {
        var params = {
          offerHeaderId:offerHeaderId
        };
        hmsHttp.post(baseUrl + 'create_newbid_auth', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (error) {
        });
      };
      //提交的权限
      this.offerSubmitAuth= function (success, offerHeaderId) {
        var params = {
          offerHeaderId:offerHeaderId
        };
        hmsHttp.post(baseUrl + 'offer_submit_auth', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (error) {
        });
      };
      //创建新版定标报价的权限
      this.createNewBidedAuth = function (success, offerHeaderId) {
        var params = {
          offerHeaderId:offerHeaderId
        };
        hmsHttp.post(baseUrl + 'create_newbided_auth', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (error) {
        });
      };
      //编辑权限
      this.offerEditAuth = function (success, offerHeaderId) {
        var params = {
          offerHeaderId:offerHeaderId
        };
        hmsHttp.post(baseUrl + 'offer_edit_auth', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (error) {
        });
      };
      //编辑权限
      this.offerDeleteAuth = function (success, offerHeaderId) {
        var params = {
          offerHeaderId:offerHeaderId
        };
        hmsHttp.post(baseUrl + 'offer_delete_auth', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (error) {
        });
      };
      //允许创建定标报价标志(针对投标报价)的权限
      this.createNewBidBidedAuth = function (success, offerHeaderId) {
        var params = {
          offerHeaderId:offerHeaderId
        };
        hmsHttp.post(baseUrl + 'create_newbidbided_auth', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (error) {
        });
      };
      //提交审核的模拟接口
      this.approveOffer = function (success, offerHeaderId) {
        var params = {
          offerHeaderId:offerHeaderId
        };
        hmsHttp.post(baseUrl + 'approve_offer', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (error) {
        });
      };
      //存储报价详情
      this.offerDetail = {};
      function cloneObj(obj) {
        var o;
        if (obj.constructor == Object) {
          o = new obj.constructor();
        } else {
          o = new obj.constructor(obj.valueOf());
        }
        for (var key in obj) {
          if (o[key] != obj[key]) {
            if (typeof(obj[key]) == 'object') {
              o[key] = cloneObj(obj[key]);
            } else {
              o[key] = obj[key];
            }
          }
        }
        return o;
      }

      Array.prototype.clone = function () {
        return [].concat(this);
      };

      this.getOfferDetailService= function () {
        return this.offerDetail;
      };

      this.setOfferDetailService = function (offerDetail) {
        this.offerDetail = cloneObj(offerDetail);
      };
    }
  ]);


