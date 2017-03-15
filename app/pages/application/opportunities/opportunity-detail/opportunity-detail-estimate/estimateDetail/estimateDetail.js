/**
 * Created by wkh on 2017/3/14.
 */
'use strict';
angular.module('opportunityModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.estimateDetail', {
          url: '/opportunity-estimateDetail',
          params: {
            data: {}
          },
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/opportunities/opportunity-detail/opportunity-detail-estimate/estimateDetail/estimateDetail.html',
              controller: 'opportunityEstimateDetailCtrl'
            }
          }
        })

    }]);
angular.module('opportunityModule')
  .controller('opportunityEstimateDetailCtrl',
  ['$scope',
    'hmsPopup',
    'T',
    'opportunityAddService',
    '$ionicModal',
    '$ionicScrollDelegate',
    '$ionicHistory',
    function($scope,
             hmsPopup,
             T,
             opportunityAddService,
             $ionicModal,
             $ionicScrollDelegate,
             $ionicHistory){
      $scope.detailFlag=true;
      $scope.newEstimate = {
        level2Product	:	"",
        manday :	"测试",
        opportunityId :	-9999,
        product :	"",
        productId :	"",
        productType :	"",
        total :	"",
        unitId :	"",
        unitPrice : "1000",
        unitName : "测试",
        productTypeName: "测试",
        level2ProductName: "测试",
        productName: "测试"
      };
      console.log($scope.detailFlag);
      $scope.newEstimateProductModel = '';
      $scope.editEstimateFlag = false;
    console.log("售前预估详情");
      $scope.hideAddEstimate=function(){
        $ionicHistory.goBack();
      };
    //通用选择框
    $ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function (modal) {
      $scope.addPresalesSelectModal = modal;
    });
      //商品列表
      $ionicModal.fromTemplateUrl('build/pages/application/opportunities/modal/product-select.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal) {
        $scope.productSelectModal = modal;
      });
    $scope.titleList = {
      competitors: T.T('NEW_OPPORTUNITY.COMPETITORS'),
      customer: T.T('NEW_OPPORTUNITY.SELECT_CUSTOMER'),
      productTypeName: T.T('NEW_OPPORTUNITY.PRODUCT_TYPE'),
      opportunityStatus: T.T('NEW_OPPORTUNITY.OPPORTUNITY_STATE'),
      ownedIndustry: T.T('NEW_OPPORTUNITY.INDUSTRY'),
      majorIndustry: T.T('NEW_OPPORTUNITY.MAJOR_INDUSTRY'),
      customerContacts: T.T('NEW_OPPORTUNITY.SELECT_CUSTOMER_CONTACTS'),
      businessFrom: T.T('NEW_OPPORTUNITY.SOURCE'),
      originalFactoryFrom: T.T('NEW_OPPORTUNITY.SOURCE_SOURCE'),
      prjBeginDate: T.T('NEW_OPPORTUNITY.START_DATE'),
      preSignDate: T.T('NEW_OPPORTUNITY.SIGN_DATE'),
      saleBelong: T.T('NEW_OPPORTUNITY.LONG_BELONG'),
      theCompany: T.T('NEW_OPPORTUNITY.COMPANY_PROPERTY'),
      saleStage: T.T('NEW_OPPORTUNITY.SALE_STATE'),
      preSaleEmployee: T.T('NEW_OPPORTUNITY.ADVANCE_LEADER'),
      chargingMode: T.T('NEW_OPPORTUNITY.CHARGING_MODE'),
      currency: T.T('NEW_OPPORTUNITY.CURRENCY'),
      newEstimateProductModel: T.T('NEW_OPPORTUNITY.ESTIMATE_PRODUCT') + " | " + T.T('NEW_OPPORTUNITY.ESTIMATE_SUB_PRODUCT'),
      unitName: T.T('NEW_OPPORTUNITY.BU'),
      prjRisk: T.T('NEW_OPPORTUNITY.RISK'),
      description: T.T('NEW_OPPORTUNITY.OPPORTUNITY_DESCRIPTION'),
      productName: T.T('NEW_OPPORTUNITY.COMPETITORS_PRODUCT'),
      advantage: T.T('NEW_OPPORTUNITY.COMPETITORS_OPPONENT'),
      otherDescription: T.T('NEW_OPPORTUNITY.OTHER_DESCRIPTION'),
      manday: T.T('NEW_OPPORTUNITY.MAN_DAY'),
      unitPrice: T.T('NEW_OPPORTUNITY.PRICE'),
      incomeScale: T.T('NEW_OPPORTUNITY.INCOME_SCALE'),
      isListed: T.T('NEW_OPPORTUNITY.IS_LISTED'),
      winningCompetitor: T.T('NEW_OPPORTUNITY.WINNING_COMPETITOR'),
      theYear: T.T('NEW_OPPORTUNITY.COMPANY_YEAR')
    };
    $scope.addEstimate = function(){

      if($scope.newEstimate.productType == ''){
        hmsPopup.showShortCenterToast('产品类别不能为空');
        return ;
      }

      if($scope.newEstimate.level2Product == ''){
        hmsPopup.showShortCenterToast('二级产品不能为空');
        return ;
      }

      if($scope.newEstimate.productType == ''){
        hmsPopup.showShortCenterToast('产品类型不能为空');
        return ;
      }

      if($scope.newEstimate.manday < 0 || isNaN(Number($scope.newEstimate.manday))){
        hmsPopup.showShortCenterToast('人天必须为数字正数或0');
        return ;
      }

      if($scope.newEstimate.unitPrice < 0 || isNaN(Number($scope.newEstimate.unitPrice))){
        hmsPopup.showShortCenterToast('单价必须为数字正数或0');
        return ;
      }

      $scope.newEstimate.total = $scope.newEstimate.manday * $scope.newEstimate.unitPrice;
      $scope.estimates.push($scope.newEstimate);
      $scope.newEstimate = {
        level2Product	:	"",
        manday :	"",
        opportunityId :	-9999,
        product :	"",
        productId :	"",
        productType :	"",
        total :	"",
        unitId :	"",
        unitPrice : "",
        unitName : "",
        productTypeName: "",
        level2ProductName: "",
        productName: ""
      };
      $scope.newEstimateProductModel = '';
      $scope.showAddEstimate();
    };
    $scope.items = [];
    $scope.nowSelectTarget = {};
    $scope.searchModel={};
    $scope.editEstimateFlag = false;
    $scope.nowEditEstimateIndex = -1;
      function cloneObj(obj){
        var o, obj;
        if (obj.constructor == Object){
          o = new obj.constructor();
        }else{
          o = new obj.constructor(obj.valueOf());
        }
        for(var key in obj){
          if ( o[key] != obj[key] ){
            if ( typeof(obj[key]) == 'object' ){
              o[key] = cloneObj(obj[key]);
            }else{
              o[key] = obj[key];
            }
          }
        }
        o.toString = obj.toString;
        o.valueOf = obj.valueOf;
        return o;
      }
    $scope.editEstimate=function(){
     $scope.detailFlag=false;
    };
    //$scope.editEstimate = function($index){
    //
    //  $scope.newEstimate = cloneObj($scope.estimates[$index]);
    //  $scope.newEstimateProductModel = $scope.newEstimate.productName + '|' + $scope.newEstimate.level2ProductName;
    //  $scope.addPresalesForecast.show();
    //  $scope.editEstimateFlag = true;
    //  $scope.showAddEstimateDiv = true;
    //  $scope.nowEditEstimateIndex = $index;
    //};

    $scope.saveEstimate = function(){
      if($scope.newEstimate.productType == ''){
        hmsPopup.showShortCenterToast('产品类别不能为空');
        return ;
      }
      if($scope.newEstimate.level2Product == ''){
        hmsPopup.showShortCenterToast('二级产品不能为空');
        return ;
      }
      if($scope.newEstimate.productType == ''){
        hmsPopup.showShortCenterToast('产品类型不能为空');
        return ;
      }
      if($scope.newEstimate.manday < 0 || isNaN(Number($scope.newEstimate.manday))){
        hmsPopup.showShortCenterToast('人天必须为数字正数或0');
        return ;
      }
      if($scope.newEstimate.unitPrice < 0 || isNaN(Number($scope.newEstimate.unitPrice))) {
        hmsPopup.showShortCenterToast('单价必须为数字正数或0');
        return ;
      }
      $scope.newEstimate.total = $scope.newEstimate.manday * $scope.newEstimate.unitPrice;
      $scope.estimates.splice($scope.nowEditEstimateIndex, 1, $scope.newEstimate);
      $scope.newEstimate = {
        level2Product	:	"",
        manday :	"",
        opportunityId :	-9999,
        product :	"",
        productId :	"",
        productType :	"",
        total :	"",
        unitId :	"",
        unitPrice : "",
        unitName : "",
        productTypeName: "",
        level2ProductName: "",
        productName: ""
      };
      $scope.newEstimateProductModel = '';
      $scope.addPresalesForecast.hide();
      $scope.editEstimateFlag = false;
      $scope.showAddEstimateDiv = false;
    };
    var getBusinessFromSuccess = function(response){
      $scope.showCrmLoading = false;
      $scope.moreDataCanBeLoaded = response.business_from_list.length == $scope.pageSize;
      if(response.returnCode == 'S') {
        $scope.items = $scope.items.concat(response.business_from_list);
        $scope.sourceItems = $scope.items.clone();
      }
    };
      var getBusinessUnitSuccess = function(response){
        $scope.showCrmLoading = false;
        $scope.moreDataCanBeLoaded = response.business_unit.length == $scope.pageSize;
        if(response.returnCode == 'S'){
          $scope.items = $scope.items.concat(response.business_unit);
          $scope.sourceItems = $scope.items.clone();
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
    var opportunity_value_list=[
      {
        code: "HCRM.ORDER_PRODUCT_TYPE",
        lastUpdateDate: "ORDER_PRODUCT_TYPE_DATE",
        localList : 'ORDER_PRODUCT_TYPE'
      }
    ];

    var getValueObjByCode = function(code){
      for(var i = 0; i < opportunity_value_list.length; i++){
        if(code == opportunity_value_list[i].code)
          return cloneObj(opportunity_value_list[i]);
      }
    };
      Array.prototype.clone=function(){
        return [].concat(this);
      };
    var showValueInList = function(code){
      var valueObj = getValueObjByCode(code);
      $scope.items = $scope.items.concat(JSON.parse(window.localStorage[valueObj.localList]));
      $scope.sourceItems = $scope.items.clone();
    };
      $scope.nowPage=1; $scope.pageSize=20;
    //通用选择弹窗
    $scope.selectTargets = [{
      'key' : 'business_from_source',
      'interface' :  opportunityAddService.getBusinessFrom,
      'params' : [getBusinessFromSuccess, 'HCRM_BUSIFROM_CATE_2', 'HCRM.BUSINESS_FROM_CATEGORY'],
      'showKey' : 'businessFromName',
      'dataKey' : 'businessFrom',
      'dataModel' : '$scope.data.originalFactoryFrom',
      'showDataModel' : '$scope.showData.originalFactoryFrom'
    },{
      'key' : 'business_unit',
      'interface' :  opportunityAddService.getBusinessUnit,
      'params' : [getBusinessUnitSuccess, $scope.nowPage, $scope.pageSize],
      'showKey' : 'fullUnitName',
      'dataKey' : 'unitId',
      'dataModel' : '$scope.newEstimate.unitId',
      'showDataModel' : '$scope.newEstimate.unitName',
      'searchInterface' : opportunityAddService.searchBusinessUnit,
      'searchParams' : getBusinessUnitSuccess,
      'needShowMore' : true
    },{
      'key' : 'product_type',
      'interface' :  showValueInList,
      'params' : ['HCRM.ORDER_PRODUCT_TYPE'],
      'showKey' : 'description',
      'dataKey' : 'value',
      'dataModel' : '$scope.newEstimate.productType',
      'showDataModel' : '$scope.newEstimate.productTypeName'
    }];

    $scope.showSelectDiv = function(key){

      console.log('showSelectDiv key ' + key);

      if(!$scope.editCustomerFlag && key == 'income_scale'){
        hmsPopup.showPopup('抱歉，你没有权限修改该客户。');
        return ;
      }

      if(!$scope.editCustomerFlag && key == 'isListed'){
        hmsPopup.showPopup('抱歉，你没有权限修改该客户。');
        return ;
      }

      $scope.searchModel.searchValueKey = '';
      $scope.nowPage = 1;

      if(key == 'product_type' || key == 'business_unit'){
        if ($scope.showSelect) {

        }else{
          $scope.addPresalesSelectModal.show();
        }

      }else if(key == 'competitor'){
        if ($scope.showSelect) {

        }else{
          $scope.addCompetitorSelectModal.show();
        }
      }
      else{
        if ($scope.showSelect) {
        } else {
          $scope.crmSelectModal.show();
        }
      }

      if ($scope.showSelect) {
        if($scope.crmSelectModal){
          $scope.crmSelectModal.hide();
        }
        if($scope.addPresalesSelectModal){
          $scope.addPresalesSelectModal.hide();
        }
        if($scope.addCompetitorSelectModal){
          $scope.addCompetitorSelectModal.hide();
        }
      } else {
      }

      $scope.showSelect = !$scope.showSelect;

      $scope.moreDataCanBeLoaded = false;

      $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);

      if(!$scope.showSelect){
        return ;
      }

      for(var i = 0; i < $scope.selectTargets.length; i++){
        if(key == $scope.selectTargets[i].key){
          $scope.nowSelectTarget = cloneObj($scope.selectTargets[i]);
          break;
        }
      }
      var showKey = $scope.nowSelectTarget['showKey'];
      var dataKey = $scope.nowSelectTarget['dataKey'];
      eval('$scope.items = [{' + showKey + ': "空",' + dataKey + ': ""}]');
      $scope.sourceTargetData = cloneObj($scope.nowSelectTarget);

      console.log('showSelectDiv nowSelectTarget ' + angular.toJson($scope.nowSelectTarget));
      if($scope.nowSelectTarget.interface != showValueInList)
        $scope.showCrmLoading = true;
      $scope.nowPage = 1;
      $scope.nowSelectTarget.interface.apply(null,$scope.nowSelectTarget.params);
    };
      $scope.selectItem = function($index){
        var data = $scope.items[$index][$scope.nowSelectTarget['dataKey']];  //接口所需数据
        console.log($scope.nowSelectTarget['key']);
        if($scope.nowSelectTarget['key'] == 'product_type'){
          console.log($scope.items[$index]);
        }
        //if($scope.nowSelectTarget['key'] == 'competitor'){
        //  for(var i = 0; i < $scope.competitors.length; i++) {
        //    if($scope.competitors[i].competitorId == data){
        //      hmsPopup.showShortCenterToast('已添加过该竞争对手！请重新选择');
        //      return ;
        //    }
        //  }
        //}
        //if($scope.nowSelectTarget['key'] == 'customer')
        //  $scope.sourceCustomer = {
        //    customerId: $scope.data.customerId,
        //    customerName: $scope.showData.customerName
        //  };
        //var showKey = $scope.items[$index][$scope.nowSelectTarget['showKey']];
        //showKey = (showKey == '空') ? "" : showKey;
        //var dataModel = $scope.nowSelectTarget['dataModel'];                 //最终操作提交所需的数据变量
        //var showDataModel = $scope.nowSelectTarget['showDataModel'];         //显示用的数据变量ng-model
        //eval(dataModel + " = data");
        //eval(showDataModel + " = showKey");
        //if($scope.nowSelectTarget['key'] == 'opportunity_status'){
        //  $scope.opportunityRate = $scope.items[$index].opportunityRate;
        //  if($scope.opportunityRate == undefined)
        //    $scope.opportunityRate = 0;
        //}
        //if($scope.nowSelectTarget['key'] == 'business_from'){
        //  $scope.isOrigin = $scope.items[$index].businessFrom == 'ORIGINALS';
        //  $scope.data.originalFactoryFrom = "";
        //  $scope.showData.originalFactoryFrom = ""
        //}
        //if($scope.nowSelectTarget['key'] == 'customer'){
        //  $scope.showCrmLoading = true;
        //  opportunityAddService.getCustomerDetail(getCustomerDetailSuccess, $scope.data.customerId);
        //  return;
        //}
        //if($scope.nowSelectTarget['key'] == 'opportunity_status'){
        //  $scope.needCompetitorFlag = (data == 'HCRM_HOT_CHANCE' || data == 'HCRM_PROBABLY_WIN' || data == 'HCRM_WIN_CONFIRMED');
        //  $scope.showWinCompanyFlag = $scope.data.opportunityStatus == "HCRM_LOST";
        //  if(!$scope.showWinCompanyFlag){
        //    $scope.data.winningCompetitorId = "";
        //    $scope.showData.winningCompetitor = "";
        //  }
        //}
        $scope.showSelectDiv();
      };
      $scope.loadMore = function() {
        console.log('loadMore ...');
        $scope.nowPage++;
        for(var i = 0; i < $scope.nowSelectTarget.params.length; i++){
          if($scope.nowSelectTarget.params[i] == $scope.nowPage - 1){
            $scope.nowSelectTarget.params[i] = $scope.nowPage;
            break;
          }
        }
        if($scope.nowSelectTarget['searchInterface'] && $scope.searchModel.searchValueKey != ''){
          $scope.nowSelectTarget.searchInterface.call(null,$scope.nowSelectTarget.searchParams,
            $scope.searchModel.searchValueKey,$scope.nowPage,$scope.pageSize);
        } else
          $scope.nowSelectTarget.interface.apply(null,$scope.nowSelectTarget.params);
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
            $scope.nowSelectTarget.searchInterface.call(null,$scope.nowSelectTarget.searchParams,
              $scope.searchModel.searchValueKey,$scope.nowPage,$scope.pageSize);
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

      $scope.clearSelectFilter = function(){
        $scope.searchModel.searchValueKey = '';
        $scope.searchSelectValue();
      };

      //选择商品
      $scope.newEstimate.product = '';
      $scope.newEstimate.productId = '';
      $scope.newEstimate.productName = '';
      $scope.parentCategoryId = -1;
      $scope.categoryType = 'HCRM_CATEGORY_1';

      var getProductSuccess= function(response){
        $scope.showCrmLoading = false;
        if(response.returnCode == "S")
          $scope.products = response.product_list;
      };

      $scope.showEstimateProductSelect = false;

      //显示售前预估界面
      $scope.showEstimateProductSelectDiv = function(){
        //$scope.showEstimateProductSelect = true;
        $scope.productSelectModal.show();
        $scope.showCrmLoading = true;
        opportunityAddService.getProducts(getProductSuccess, $scope.categoryType, $scope.parentCategoryId);
      };

      //关闭售前预估界面
      $scope.productBack = function(){

        console.log('$scope.productBack ' + $scope.parentCategoryId);

        $ionicScrollDelegate.$getByHandle('productScroll').scrollTop(false);
        //当目录在一级时，返回
        if($scope.parentCategoryId == -1)
          $scope.productSelectModal.hide();
        //$scope.showEstimateProductSelect = false;
        //否则跳到一级,并清空第二级数据
        else{
          $scope.showCrmLoading = true;
          $scope.newEstimate.product = '';
          $scope.newEstimate.productId = '';
          $scope.newEstimate.productName = '';
          $scope.parentCategoryId = -1;
          $scope.categoryType = 'HCRM_CATEGORY_1';
          opportunityAddService.getProducts(getProductSuccess, $scope.categoryType, $scope.parentCategoryId);
        }
      };

      $scope.selectProduct = function($index){
        $ionicScrollDelegate.$getByHandle('productScroll').scrollTop(false);
        if($scope.parentCategoryId != -1){   //选中二级商品
          $scope.newEstimate.level2ProductName = $scope.products[$index].categotyName;
          $scope.newEstimate.level2Product = $scope.products[$index].categotyCode;
          $scope.newEstimateProductModel = $scope.newEstimate.productName + ' | ' + $scope.newEstimate.level2ProductName;
          //$scope.showEstimateProductSelect = false;
          $scope.productSelectModal.hide();
          $scope.products = [];
        } else {                             //选中一级商品，展开二级商品目录
          $scope.showCrmLoading = true;
          $scope.categoryType = 'HCRM_CATEGORY_2';
          $scope.newEstimate.productName =  $scope.products[$index].categotyName;
          $scope.newEstimate.product = $scope.products[$index].categotyCode;
          $scope.parentCategoryId = $scope.products[$index].categotyId;
          opportunityAddService.getProducts(getProductSuccess, $scope.categoryType, $scope.parentCategoryId);
        }
      };

    }]);
