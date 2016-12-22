/**
 * Created by ZaraNengap on 2016/10/11.
 */
'use strict';
// angular.module('opportunityModule')
//   .config(['$stateProvider',
//     function ($stateProvider) {
//       $stateProvider
//         .state('tab.opportunity-add', {
//           url: '/opportunities/opportunity-add',
//           views: {
//             'tab-application': {
//               templateUrl: 'build/pages/application/opportunities/opportunity-add/opportunity-add.html',
//               controller: 'OpportunityAddCtrl'
//             }
//           }
//         })
//         .state('tab.opportunity-add2', {
//           url: '/opportunities/opportunity-add',
//           views:{
//             'tab-add': {
//               templateUrl: 'build/pages/application/opportunities/opportunity-add/opportunity-add.html',
//               controller: 'OpportunityAddCtrl'
//             }
//           }
//
//         })
//}]);

angular.module('opportunityModule')

  .controller('OpportunityAddCtrl', [
    '$scope',
    'baseConfig',
    '$ionicHistory',
    '$state',
    'opportunityAddService',
    'hmsPopup',
    '$rootScope',
    'ionicDatePicker',
    '$ionicScrollDelegate',
    '$ionicModal',
    'T',
    'opportunityDetailDataService',
    'clueDetailDataService',
    function($scope,
             baseConfig,
             $ionicHistory,
             $state,
             opportunityAddService,
             hmsPopup,
             $rootScope,
             ionicDatePicker,
             $ionicScrollDelegate,
             $ionicModal,
             T,
             opportunityDetailDataService,
             clueDetailDataService) {

      $rootScope.img="";

      $scope.crmSelectModal;
      $scope.addPresalesSelectModal;
      $scope.addCompetitorSelectModal;
      $scope.addPresalesForecast;
      $scope.addCompetitorModal;
      $scope.productSelectModal;

      $scope.titleList = {
        competitors: T.T('NEW_OPPORTUNITY.COMPETITORS'),
        customer: T.T('NEW_OPPORTUNITY.SELECT_CUSTOMER'),
        productTypeName: T.T('NEW_OPPORTUNITY.PRODUCT_TYPE'),
        opportunityStatus: T.T('NEW_OPPORTUNITY.OPPORTUNITY_STATE'),
        ownedIndustry: T.T('NEW_OPPORTUNITY.INDUSTRY'),
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

      $scope.inputType = {
        number: 'number'
      };

      //屏蔽有输入框的元素
      $scope.inputItemReadOnlyFlag = true;

      $scope.goBack = function(){
        $ionicScrollDelegate.$getByHandle('slide-img').scrollTop(false);
        $scope.$emit('CLOSE_OPPORTUNITY_ADD');
        $scope.$emit('CLOSE_PROMOTE');
      };

      $scope.hideAreaFlag = [];

      $scope.removeCompetitor = function($index){
        $scope.competitors.splice($index,1);
      };

      $scope.opportunityRate = 0;

      $scope.removeEstimate = function($index){
        $scope.estimates.splice($index,1);
      };

      //售前预估
      $ionicModal.fromTemplateUrl('build/pages/application/opportunities/modal/add-presales-forecast.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal) {
        $scope.addPresalesForecast = modal;
      });

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

      $scope.showAddEstimateDiv = false;

      $scope.showAddEstimate = function(flag,$event){
        if(flag){
          $scope.addPresalesForecast.show();
          $scope.inputItemReadOnlyFlag = false;
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
          $scope.editEstimateFlag = false;
        }else{
          $scope.inputItemReadOnlyFlag = true;
        }
        $scope.showAddEstimateDiv = !$scope.showAddEstimateDiv;
        if(!$scope.showAddEstimateDiv){
          $scope.addPresalesForecast.hide();
          $scope.editEstimateFlag = false;
        }
        $scope.products = [];
        $scope.categoryType = 'HCRM_CATEGORY_1';
        $scope.parentCategoryId = -1;
      };

      $scope.showAddCompetitorDiv = false;

      $scope.showAddCompetitor = function(showFlag){
        if(showFlag) {
          //竞争对手
          $ionicModal.fromTemplateUrl('build/pages/application/opportunities/modal/add-competitor.html', {
            scope: $scope,
            animation: 'slide-in-right'
          }).then(function (modal) {
            $scope.addCompetitorModal = modal;
            $scope.addCompetitorModal.show();
          });

          //通用选择框
          $ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
            scope: $scope,
            animation: 'slide-in-right'
          }).then(function (modal) {
            $scope.addCompetitorSelectModal = modal;
          });

        }else{
          $scope.addCompetitorModal.remove();
          $scope.addCompetitorSelectModal.remove();
        }

        $scope.showAddCompetitorDiv = !$scope.showAddCompetitorDiv;
      };

      $scope.hideArea = function(num){
        $scope.hideAreaFlag[num] = !$scope.hideAreaFlag[num];
        $ionicScrollDelegate.$getByHandle("slide-img").resize();
      };

      $scope.showSelect = false;

      $scope.selectDate = function(key){
        if(key == 'startDate')
          ionicDatePicker.openDatePicker(startDate);
        else if(key == 'signDate')
          ionicDatePicker.openDatePicker(signDate);
      };

      var startDate = {
        callback: function (val) {
          var selectedDate = new Date(val);
          var dateText = selectedDate.getFullYear() + "-" + ((selectedDate.getMonth() + 1) > 9 ? (selectedDate.getMonth() + 1) : ("0" + (selectedDate.getMonth() + 1))) + "-" + (selectedDate.getDate() > 9 ? selectedDate.getDate() : ("0" + selectedDate.getDate()));
          $scope.data.prjBeginDate = dateText;
        },
        from: new Date(2012, 1, 1),
        to: new Date(2017, 10, 30),
        inputDate: new Date(),
        mondayFirst: true,
        closeOnSelect: false,
        templateType: 'popup'
      };

      var signDate = {
        callback: function (val) {
          var selectedDate = new Date(val);
          var dateText = selectedDate.getFullYear() + "-" + ((selectedDate.getMonth() + 1) > 9 ? (selectedDate.getMonth() + 1) : ("0" + (selectedDate.getMonth() + 1))) + "-" + (selectedDate.getDate() > 9 ? selectedDate.getDate() : ("0" + selectedDate.getDate()) );
          $scope.data.preSignDate = dateText;
        },
        from: new Date(2012, 1, 1),
        to: new Date(2017, 10, 30),
        inputDate: new Date(),
        mondayFirst: true,
        closeOnSelect: false,
        templateType: 'popup'
      };

      ////////接口数据相关////////
      //克隆对象
      // function cloneObj(obj){
      //   function Clone(){}
      //   Clone.prototype = obj;
      //   var o = new Clone();
      //   for(var a in o){
      //     if(typeof o[a] == "object") {
      //       o[a] = cloneObj(o[a]);
      //     }
      //   }
      //   return o;
      //}

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

      $scope.initData = function(){
        $scope.competitors = [];

        $scope.estimates = [];

        $scope.newCompetitor = {
          fullName : "",
          advantage :	"",
          competitorId :	"",
          description	:	"",
          opportunityId :	-9999,
          productName : ""
        };

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

        $scope.data = {
          businessFrom: "",//商机来源
          chargingMode: "",//计费模式
          competitors: [],//竞争对手
          creationYear: "",
          currency: "",//币种
          customerId: "",//客户Id
          customersContactsId: "",//客户联系人Id
          description: "",//商机描述
          finishYear: "",
          fullName: "",//商机名称
          opportunityCode: "",
          opportunityStatus: "",//商机状态
          originalFactoryFrom: "",//原厂划分
          preMoney: "",//预计收入
          preSaleEmployeeId: "",//预售Leader Id
          preSignDate: "",//项目签署日期
          presells: [],//售前预估
          prjBeginDate: "",//项目开始日期
          prjRisk: "",//项目风险
          saleStage: "",//销售阶段
          theCompany: "",//公司属性
          theYear: (new Date()).getFullYear(),
          winningRate: "",//赢面
          saleAreaId: "",//区域id
          saleEmployeeId: "",//默认
          saleTeamId: "",//团队id
          majorIndustry: "",//主行业
          subIndustry: "",//副行业
          winningCompetitorId: ""//赢单公司
        };

        //界面显示的数据
        $scope.showData = {
          preSaleEmployee: "",
          newEstimateUnitName: "",
          theCompany: "",
          businessFrom: "",
          opportunityStatus: "",
          industry: "",
          winningRate:"",
          saleStage:"",
          chargingMode:"",
          currency:"",
          saleArea:"",
          saleTeam:"",
          customerName:"",
          customerContactsName:"",
          saleBelong: "",
          originalFactoryFrom:"",
          majorIndustry: "",
          subIndustry: "",
          incomeScale: "",
          isListed: "",
          cusMajorIndustry: "",
          cusSubIndustry: "",
          cusIndustry: "",
          winningCompetitor: ""
        };

        $scope.searchModel = {
          searchValueKey: ''
        };

        $scope.nowPage = 1;
        $scope.pageSize = 15;

        $scope.items = [];
        $scope.nowSelectTarget = {};

        $scope.moreDataCanBeLoaded = false;

        $scope.sourceItems = [];
        $scope.noDataFlag = false;

        $scope.validNameFlag = true;

        $scope.editFlag = false;

        opportunityAddService.getEmployeeDetail(function(response){
          $scope.data.saleAreaId = response.employee_detail.saleAreaId;
          $scope.data.saleTeamId = response.employee_detail.saleTeamId;
          $scope.showData.saleArea = response.employee_detail.saleArea;
          $scope.showData.saleTeam = response.employee_detail.saleTeam;
          if($scope.showData.saleArea != '')
            $scope.showData.saleBelong = $scope.showData.saleArea;
          if($scope.showData.saleTeam != '')
            $scope.showData.saleBelong += " | " + $scope.showData.saleTeam;
        });

      };

      $scope.initData();

      var getStatusForRateSuccess = function(response){
        if(response.returnCode == 'S') {
          for(var i = 0; i < response.opportunity_status.length; i++){
            if(response.opportunity_status[i].opportunityType == $scope.data.opportunityStatus){
              $scope.opportunityRate = response.opportunity_status[i].opportunityRate;
              if($scope.opportunityRate == undefined)
                $scope.opportunityRate = 0;
              return ;
            }
          }
        }
      };

      $scope.$on('PROMOTE_CLUE',function(){
        $scope.promoteFlag = true;
        $scope.firstInEdit = true;
        var tempOpportunity = clueDetailDataService.getClue();
        $scope.nameBeforeEdit = tempOpportunity.opportunityName;

        $scope.data = {
          businessFrom: tempOpportunity.businessFrom,//商机来源,判断原厂划分
          customerId: tempOpportunity.customerId,    //客户Id，判断客户联系人
          description: tempOpportunity.description,  //商机描述
          fullName: tempOpportunity.opportunityName, //商机名称
          opportunityCode: tempOpportunity.opportunityCode, //必传
          opportunityId: tempOpportunity.opportunityId,     //必传
          preMoney: tempOpportunity.preMoney,        //预计收入
          preSignDate: tempOpportunity.preSignDate,  //项目签署日期
          prjBeginDate: tempOpportunity.prjBeginDate,//项目开始日期
          opportunityStatus: tempOpportunity.opportunityStatus, //商机状态，判断rate
          prjRisk: tempOpportunity.prjRisk,           //项目风险
          theYear: (new Date()).getFullYear()         //商机所属年份
        };

        //禁止修改项：客户名称、所属

        $scope.showData = {
          preSaleEmployee: "",
          newEstimateUnitName: "",
          theCompany: tempOpportunity.theCompanyName,
          businessFrom: tempOpportunity.businessFromName,
          opportunityStatus: "",
          saleStage: "",
          chargingMode: "",
          currency: "",
          saleArea: tempOpportunity.saleAreaName,
          saleTeam: tempOpportunity.saleTeamName,
          customerName: tempOpportunity.customerName,
          customerContactsName: tempOpportunity.customersContactsName,
          saleBelong: tempOpportunity.saleAreaName + ' | ' + tempOpportunity.saleTeamName,
          originalFactoryFrom: tempOpportunity.originalFactoryFromName,
          winningCompetitor: tempOpportunity.winningCompetitorName
        };

        $scope.needCompetitorFlag = ($scope.data.opportunityStatus == 'HCRM_HOT_CHANCE' ||
                                     $scope.data.opportunityStatus == 'HCRM_PROBABLY_WIN' ||
                                     $scope.data.opportunityStatus == 'HCRM_WIN_CONFIRMED');

        $scope.showWinCompanyFlag = $scope.data.opportunityStatus == "HCRM_LOST";
        $scope.sourceCustomer = {
          customerId: $scope.data.customerId,
          customerName: $scope.showData.customerName
        };

        opportunityAddService.getCustomerDetail(getCustomerDetailSuccess, $scope.data.customerId);

      });

      $scope.$on('EDIT_OPPORTUNITY',function(){
        $scope.editFlag = true;
        $scope.firstInEdit = true;
        var tempOpportunity = opportunityDetailDataService.getOpportunity();
        $scope.nameBeforeEdit = tempOpportunity.opportunityName;

        $scope.data = {
          businessFrom: tempOpportunity.businessFrom,//商机来源,判断原厂划分
          customerId: tempOpportunity.customerId,    //客户Id，判断客户联系人
          description: tempOpportunity.description,  //商机描述
          fullName: tempOpportunity.opportunityName, //商机名称
          opportunityCode: tempOpportunity.opportunityCode, //必传
          opportunityId: tempOpportunity.opportunityId,     //必传
          preMoney: tempOpportunity.preMoney,        //预计收入
          preSignDate: tempOpportunity.preSignDate,  //项目签署日期
          prjBeginDate: tempOpportunity.prjBeginDate,//项目开始日期
          opportunityStatus: tempOpportunity.opportunityStatus, //商机状态
          prjRisk: tempOpportunity.prjRisk,          //项目风险
          winningCompetitorId: tempOpportunity.winningCompetitorId, //赢单公司
          theYear: tempOpportunity.theYear           //所属年份
        };

        $scope.showData = {
          preSaleEmployee: tempOpportunity.preSaleEmployeeName,
          newEstimateUnitName: "",
          theCompany: tempOpportunity.theCompanyName,
          businessFrom: tempOpportunity.businessFromName,
          opportunityStatus: tempOpportunity.opportunityStatusName,
          saleStage: tempOpportunity.saleStageName,
          chargingMode: tempOpportunity.chargingModeName,
          currency: tempOpportunity.currencyName,
          saleArea: tempOpportunity.saleAreaName,
          saleTeam: tempOpportunity.saleTeamName,
          customerName: tempOpportunity.customerName,
          customerContactsName: tempOpportunity.customersContactsName,
          saleBelong: tempOpportunity.saleAreaName + ' | ' + tempOpportunity.saleTeamName,
          originalFactoryFrom: tempOpportunity.originalFactoryFromName,
          majorIndustry: tempOpportunity.majorIndustryName,
          subIndustry: tempOpportunity.subIndustryName,
          industry: tempOpportunity.majorIndustryName + " | " +  tempOpportunity.subIndustryName,
          winningCompetitor: tempOpportunity.winningCompetitorName
        };


        $scope.needCompetitorFlag = ($scope.data.opportunityStatus == 'HCRM_HOT_CHANCE' ||
                                     $scope.data.opportunityStatus == 'HCRM_PROBABLY_WIN' ||
                                     $scope.data.opportunityStatus == 'HCRM_WIN_CONFIRMED');

        $scope.showWinCompanyFlag = $scope.data.opportunityStatus == "HCRM_LOST";

        if(tempOpportunity.majorIndustry == "")
          $scope.showData.industry = "";
        else {
          if(tempOpportunity.subIndustryName == ""){
            $scope.showData += " | " + tempOpportunity.subIndustryName;
          }
        }

        $scope.competitors = tempOpportunity.competitors.clone();
        $scope.estimates = tempOpportunity.presells.clone();

        opportunityAddService.getOpportunityStatus(getStatusForRateSuccess, 'HCRM_OPPORTUNITY');

      });

      $scope.customerDataFlag = false;
      $scope.$on('HAVE_DATA',function(event,data){
        $scope.customerDataFlag = true;
        $scope.data.customerId = data.customerId;
        $scope.showData.customerName = data.customerName;
        $scope.data.theYear = (new Date()).getFullYear();
        opportunityAddService.getCustomerDetail(getCustomerDetailSuccess, $scope.data.customerId);
      });

      $scope.addEstimate = function(){

        if($scope.newEstimate.productType == ''){
          hmsPopup.showPopup('产品类别不能为空');
          return ;
        }

        if($scope.newEstimate.level2Product == ''){
          hmsPopup.showPopup('二级产品不能为空');
          return ;
        }

        if($scope.newEstimate.productType == ''){
          hmsPopup.showPopup('产品类型不能为空');
          return ;
        }

        if($scope.newEstimate.manday < 0 || isNaN(Number($scope.newEstimate.manday))){
          hmsPopup.showPopup('人天必须为数字正数或0');
          return ;
        }

        if($scope.newEstimate.unitPrice < 0 || isNaN(Number($scope.newEstimate.unitPrice))){
          hmsPopup.showPopup('单价必须为数字正数或0');
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

      $scope.editEstimateFlag = false;
      $scope.nowEditEstimateIndex = -1;

      $scope.editEstimate = function($index){

        $scope.newEstimate = cloneObj($scope.estimates[$index]);
        $scope.newEstimateProductModel = $scope.newEstimate.productName + '|' + $scope.newEstimate.level2ProductName;
        $scope.addPresalesForecast.show();
        $scope.editEstimateFlag = true;
        $scope.showAddEstimateDiv = true;
        $scope.nowEditEstimateIndex = $index;
      };

      $scope.saveEstimate = function(){
        if($scope.newEstimate.productType == ''){
          hmsPopup.showPopup('产品类别不能为空');
          return ;
        }
        if($scope.newEstimate.level2Product == ''){
          hmsPopup.showPopup('二级产品不能为空');
          return ;
        }
        if($scope.newEstimate.productType == ''){
          hmsPopup.showPopup('产品类型不能为空');
          return ;
        }
        if($scope.newEstimate.manday < 0 || isNaN(Number($scope.newEstimate.manday))){
          hmsPopup.showPopup('人天必须为数字正数或0');
          return ;
        }
        if($scope.newEstimate.unitPrice < 0 || isNaN(Number($scope.newEstimate.unitPrice))) {
          hmsPopup.showPopup('单价必须为数字正数或0');
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

      $scope.addCompetitor = function(){
        if($scope.newCompetitor.competitorId == ''){
          hmsPopup.showPopup('竞争对手名称不能为空');
          return ;
        }
        if($scope.newCompetitor.productName == ''){
          hmsPopup.showPopup('竞争产品不能为空');
          return ;
        }
        if($scope.newCompetitor.advantage == ''){
          hmsPopup.showPopup('对手优势不能为空');
          return ;
        }
        $scope.competitors.push($scope.newCompetitor);
        $scope.newCompetitor = {
          fullName : "",
          advantage :	"",
          competitorId :	"",
          description	:	"",
          opportunityId :	-9999,
          productName : ""
        };
        $scope.showAddCompetitor();
      };

      var addOpportunitySuccess = function(response){
        hmsPopup.hideLoading();
        if(response.returnCode == "S"){
          $ionicScrollDelegate.$getByHandle('slide-img').scrollTop(false);
          if($scope.editFlag){
            hmsPopup.showPopup("添加修改成功");
            $scope.$emit('OPPORTUNITY_EDIT_SUCCESS');
          } else {
            $scope.initData();
            hmsPopup.showPopup("添加商机成功");
            $scope.$emit('OPPORTUNITY_ADD_SUCCESS');
          }
        } else {
          hmsPopup.showPopup(response.returnMsg);
        }
      };

      var promoteClueSuccess = function(response){
        hmsPopup.hideLoading();
        if(response.returnCode == "S"){
            hmsPopup.showPopup("线索提升成功");
            $scope.$emit('CLUE_PROMOTE_SUCCESS');
        } else {
          hmsPopup.showPopup(response.returnMsg);
        }
      };

      $scope.addOpportunity = function(){

        console.log($scope.data);
        console.log($scope.competitors);
        console.log($scope.estimates);

        if($scope.data.customerId == ''){
          hmsPopup.showPopup("关联客户不能为空！");
          return ;
        }
        if($scope.showData.incomeScale == ''){
          hmsPopup.showPopup("收入规模不能为空！");
          return ;
        }
        if($scope.showData.isListed == ''){
          hmsPopup.showPopup("是否上市不能为空！");
          return ;
        }
        if($scope.showData.industry == ''){
          hmsPopup.showPopup("行业不能为空！");
          return ;
        }
        if($scope.showData.subIndustry == '空' || $scope.showData.subIndustry == ''){
          hmsPopup.showPopup("明细行业不能为空！");
          return ;
        }
        if(!$scope.validNameFlag){
          hmsPopup.showPopup("商机名称重复，请重新输入！");
          return ;
        }
        if($scope.data.opportunityStatus == ''){
          hmsPopup.showPopup("商机状态不能为空！");
          return ;
        }
        if($scope.data.fullName == ''){
          hmsPopup.showPopup("商机名称不能为空！");
          return ;
        }
        if($scope.showData.customerContactsName == ''){
          hmsPopup.showPopup("关联客户联系人不能为空！");
          return ;
        }
        if($scope.showData.businessFrom == ''){
          hmsPopup.showPopup("商机来源不能为空！");
          return ;
        }
        if($scope.isOrigin && $scope.showData.originalFactoryFrom == ''){
          hmsPopup.showPopup("当商机来源为原厂时原厂划分不能为空！");
          return ;
        }
        if($scope.data.prjBeginDate == ''){
          hmsPopup.showPopup("项目开始日期不能为空！");
          return ;
        }
        if($scope.data.preSignDate == ''){
          hmsPopup.showPopup("项目签署日期不能为空！");
          return ;
        }
        if($scope.showData.theCompany == ''){
          hmsPopup.showPopup("公司属性不能为空！");
          return ;
        }
        if($scope.showData.saleArea == ''){
          hmsPopup.showPopup("所属项目大区不能为空！");
          return ;
        }
        if($scope.showData.saleStage == ''){
          hmsPopup.showPopup("销售阶段不能为空！");
          return ;
        }
        if($scope.showData.preSaleEmployee == ''){
          hmsPopup.showPopup("预销售顾问不能为空！");
          return ;
        }
        if($scope.showData.chargingMode == ''){
          hmsPopup.showPopup("计费模式不能为空！");
          return ;
        }
        if($scope.showData.currency == ''){
          hmsPopup.showPopup("货币不能为空！");
          return ;
        }
        if($scope.data.preMoney == ''){
          hmsPopup.showPopup("预计合同金额不能为空！");
          return ;
        }
        if($scope.estimates.length == 0){
          hmsPopup.showPopup("必须输入至少一条售前预估！");
          return ;
        }
        if($scope.needCompetitorFlag && $scope.competitors.length == 0){
          hmsPopup.showPopup("商机状态如果选择了'热门商机、赢面大、赢取商机'，则必输'竞争对手'!");
          return ;
        }
        if($scope.showWinCompanyFlag && $scope.data.winningCompetitorId == ''){
          hmsPopup.showPopup("丢失商机时赢单公司不能为空!");
          return ;
        }
        hmsPopup.showLoading($scope.data.winningCompetitorId);
        if($scope.promoteFlag)
          opportunityAddService.promoteClue(promoteClueSuccess,$scope.data, $scope.competitors, $scope.estimates);
        else if($scope.editFlag)
          opportunityAddService.updateOpportunities(addOpportunitySuccess,$scope.data, $scope.competitors, $scope.estimates);
        else
          opportunityAddService.addOpportunities(addOpportunitySuccess,$scope.data, $scope.competitors, $scope.estimates);
      };

      var opportunity_value_list=[
        {
          code: "HCRM.WINNING_RATE",
          lastUpdateDate: "WINNING_RATE_DATE",
          localList : 'WINNING_RATE'
        },
        {
          code: "HCRM.OPPORTUNITY_SALE_STAGE",
          lastUpdateDate: "OPPORTUNITY_SALE_STAGE_DATE",
          localList : 'OPPORTUNITY_SALE_STAGE'
        },
        {
          code: "HCRM.CHARGING_MODE",
          lastUpdateDate: "CHARGING_MODE_DATE",
          localList : 'CHARGING_MODE'
        },
        {
          code: "HCRM.CURRENCY",
          lastUpdateDate: "CURRENCY_DATE",
          localList : 'CURRENCY'
        },
        {
          code: "HCRM.ORDER_PRODUCT_TYPE",
          lastUpdateDate: "ORDER_PRODUCT_TYPE_DATE",
          localList : 'ORDER_PRODUCT_TYPE'
        },
        {
          code: "HCRM.INCOME_SCALE",
          lastUpdateDate: "HCRM.INCOME_SCALE_DATE",
          localList: "INCOME_SCALE"
        },
        {
          code: "SYS.YES_NO",
          lastUpdateDate: "SYS.YES_NO_DATE",
          localList: "YES_NO"
        }
      ];

      var getValueObjByCode = function(code){
        for(var i = 0; i < opportunity_value_list.length; i++){
          if(code == opportunity_value_list[i].code)
            return cloneObj(opportunity_value_list[i]);
        }
      };

      var getMoreSaleEmployeeSuccess = function(response){
        $scope.showCrmLoading = false;
        console.log("more");
        if(response.returnCode == 'S'){
          for(var i = 0; i < response.sale_employee_list.length; i++){
            response.sale_employee_list[i].showModal = response.sale_employee_list[i].name + '(' + response.sale_employee_list[i].employeeCode + ') ' + response.sale_employee_list[i].unit_name;
          }
          $scope.items = $scope.items.concat(response.sale_employee_list);
          $scope.sourceItems = $scope.items.clone();
          $scope.moreDataCanBeLoaded = response.sale_employee_list.length == $scope.pageSize;
        } else {
          $scope.moreDataCanBeLoaded = false;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
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

      var getCompanySuccess = function(response){
        $scope.showCrmLoading = false;
        $scope.moreDataCanBeLoaded = response.company_list.length == $scope.pageSize;
        if(response.returnCode == 'S'){
          $scope.items = $scope.items.concat(response.company_list);
          $scope.sourceItems = $scope.items.clone();
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      var getBusinessFromSuccess = function(response){
        $scope.showCrmLoading = false;
        $scope.moreDataCanBeLoaded = response.business_from_list.length == $scope.pageSize;
        if(response.returnCode == 'S') {
          $scope.items = $scope.items.concat(response.business_from_list);
          $scope.sourceItems = $scope.items.clone();
        }
      };

      var getCustomerSuccess = function(response){
        $scope.moreDataCanBeLoaded = false;
        $scope.showCrmLoading = false;
        if(response.returnCode == 'S'){
          $scope.items = $scope.items.concat(response.customer_list);
          $scope.moreDataCanBeLoaded = response.customer_list.length == $scope.pageSize;
          $scope.sourceItems = $scope.items.clone();
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      var getCustomerContactsSuccess = function(response){
        $scope.moreDataCanBeLoaded = false;
        $scope.showCrmLoading = false;
        if(response.returnCode == 'S'){
          $scope.items = $scope.items.concat(response.customer_contact_list);
          $scope.sourceItems = $scope.items.clone();
          $scope.moreDataCanBeLoaded = response.customer_contact_list.length == $scope.pageSize;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      var getCompetitorSuccess = function(response){
        $scope.showCrmLoading = false;
        $scope.moreDataCanBeLoaded = response.competitor_list.length == $scope.pageSize;
        if(response.returnCode == 'S'){
          $scope.items = $scope.items.concat(response.competitor_list);
          $scope.sourceItems = $scope.items.clone();
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      var getCustomerSearchSuccess = function(response){
        $scope.moreDataCanBeLoaded = false;
        $scope.showCrmLoading = false;
        if(response.returnCode == 'S'){
          $scope.items = $scope.items.concat(response.customer_list);
          $scope.moreDataCanBeLoaded = response.customer_list.length == $scope.pageSize;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      var getCompetitorResultSuccess = function(response){
        var flag = false;
        if(response.returnCode == 'S'){
          $scope.items = [];
          for(var i = 0; i < response.search_result.length; i++){
            if(response.search_result[i].type == "HCRM_COMPETITOR"){
              $scope.items.push(response.search_result[i]);
              flag = true;
            }
          }
          $scope.moreDataCanBeLoaded = ($scope.items.length % $scope.pageSize == 0) && flag;
          $scope.$broadcast('scroll.infiniteScrollComplete');
          $scope.nowSelectTarget.showKey = 'fullName';
          $scope.nowSelectTarget.dataKey = 'value';
        }
      };

      var getOpportunitySuccess = function(response){
        $scope.showCrmLoading = false;
        if(response.returnCode == 'S') {
          $scope.items = $scope.items.concat(response.opportunity_status);
          $scope.sourceItems = $scope.items.clone();
        }
      };

      var getValueListSuccess = function(response){
        if(response.returnCode == 'S'){
          for(var i = 0; i < response.lookup_detail.length; i++){
            var code = response.lookup_detail[i].lookup_code;
            var lastUpdateDate = response.lookup_detail[i].last_update_date;
            var valueObj = getValueObjByCode(code);
            if(lastUpdateDate != window.localStorage[valueObj.lastUpdateDate]){
              window.localStorage[valueObj.lastUpdateDate] = lastUpdateDate;
              window.localStorage[valueObj.localList] = JSON.stringify(response.lookup_detail[i].lookup_value_list);
            }
          }
        }
      };

      var showValueInList = function(code){
        var valueObj = getValueObjByCode(code);
        $scope.items = $scope.items.concat(JSON.parse(window.localStorage[valueObj.localList]));
        $scope.sourceItems = $scope.items.clone();
      };

      var getCustomerDetailSuccess = function(response){
        if(response.dataStatus == "HCRM_DISABLE"){
          $scope.data.customerId = $scope.sourceCustomer.customerId;
          $scope.showData.customerName = $scope.sourceCustomer.customerName;
          hmsPopup.showPopup('该客户已被禁用，不能进行操作！');
          $scope.showCrmLoading = false;
          return ;
        }
        if(!response.HCRM_OPERATION_EDIT && (response.incomeScale == null || response.majorIndustry == null || response.isListed == null)){
          $scope.data.customerId = $scope.sourceCustomer.customerId;
          $scope.showData.customerName = $scope.sourceCustomer.customerName;
          hmsPopup.showPopup('客户缺少：主要联系人、行业、是否上市、收入规模 信息，不得创建商机，请补充客户信息后再进行创建！');
          $scope.showCrmLoading = false;
          return ;
        }
        if(response.approveType != "HCRM_APPROVED"){
          $scope.data.customerId = $scope.sourceCustomer.customerId;
          $scope.showData.customerName = $scope.sourceCustomer.customerName;
          hmsPopup.showPopup('客户未审核，不能进行创建！');
          $scope.showCrmLoading = false;
          return ;
        }
        $scope.editCustomerFlag = response.HCRM_OPERATION_EDIT;
        $scope.showData.cusMajorIndustry = response.majorIndustryName;
        $scope.showData.cusSubIndustry = response.subIndustryName;
        $scope.showData.incomeScale = response.incomeScaleName;
        $scope.showData.isListed = response.isListed;
        if($scope.showData.cusMajorIndustry != '')
          $scope.showData.cusIndustry = $scope.showData.cusMajorIndustry;
        if($scope.showData.cusSubIndustry != '')
          $scope.showData.cusIndustry += " | " + $scope.showData.cusSubIndustry;
        $scope.data.incomeScale = response.incomeScale;
        console.log(response);
        if(!$scope.promoteFlag && !$scope.customerDataFlag)
          $scope.showSelectDiv();
      };

      var initYear = function(){
        $scope.showCrmLoading = false;
        $scope.items = [];
        for(var i = 1989; i <= 2120; i++){
          $scope.items.push({year: i});
        }
        var date = new Date();
        var thisYear = date.getFullYear();
        //滚动条定位到当前年份-5的位置上
        var deltaY = (thisYear - 1989 - 5) * 50;
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTo(0,deltaY);
      };

      //根据时间戳刷新页面值列表
      opportunityAddService.getValueList(getValueListSuccess, opportunity_value_list);

      $scope.$watch('data.customerId',function(newValue,oldValue){
        $scope.nowPage = 1;
        $scope.selectTargets[12].params = [getCustomerContactsSuccess, $scope.nowPage, $scope.pageSize, newValue];
        if($scope.firstInEdit){
          $scope.firstInEdit = false;
          return ;
        }
        $scope.data.customersContactsId = "";
        $scope.showData.customerContactsName = "";
      });

      //通用选择弹窗
      $scope.selectTargets = [{
        'key' : 'sale_employee',
        'interface' :  opportunityAddService.getPreLeader,  //获得选择项的接口
        'params' : [getMoreSaleEmployeeSuccess, $scope.nowPage, $scope.pageSize],  //获得选择项时接口所需参数
        'showKey' : 'showModal',            //选择界面显示的数据
        'dataKey' : 'userId',               //对象内最终操作提交所需的数据变量
        'dataModel' : '$scope.data.preSaleEmployeeId',  //最终操作提交所需的数据变量
        'showDataModel' : '$scope.showData.preSaleEmployee', //显示在界面上的ng-model
        'needShowMore' : true,          //需要分页显示
        'searchInterface' : opportunityAddService.searchPreLeader,
        'searchParams' : getMoreSaleEmployeeSuccess
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
        'key' : 'company',
        'interface' :  opportunityAddService.getCompany,
        'params' : [getCompanySuccess, $scope.nowPage, $scope.pageSize],
        'showKey' : 'companyName',
        'dataKey' : 'theCompany',
        'dataModel' : '$scope.data.theCompany',
        'showDataModel' : '$scope.showData.theCompany',
        'needShowMore' : true
      },{
        'key' : 'business_from',
        'interface' :  opportunityAddService.getBusinessFrom,
        'params' : [getBusinessFromSuccess, 'HCRM_BUSIFROM_CATE_1', 'HCRM.BUSINESS_FROM_CATEGORY'],
        'showKey' : 'businessFromName',
        'dataKey' : 'businessFrom',
        'dataModel' : '$scope.data.businessFrom',
        'showDataModel' : '$scope.showData.businessFrom'
      },{
        'key' : 'business_from_source',
        'interface' :  opportunityAddService.getBusinessFrom,
        'params' : [getBusinessFromSuccess, 'HCRM_BUSIFROM_CATE_2', 'HCRM.BUSINESS_FROM_CATEGORY'],
        'showKey' : 'businessFromName',
        'dataKey' : 'businessFrom',
        'dataModel' : '$scope.data.originalFactoryFrom',
        'showDataModel' : '$scope.showData.originalFactoryFrom'
      },{
        'key' : 'opportunity_status',
        'interface' :  opportunityAddService.getOpportunityStatus,
        'params' : [getOpportunitySuccess, 'HCRM_OPPORTUNITY'],
        'showKey' : 'opportunityTypeName',
        'dataKey' : 'opportunityType',
        'dataModel' : '$scope.data.opportunityStatus',
        'showDataModel' : '$scope.showData.opportunityStatus'
      },{
        'key' : 'owned_industry',
        'interface' :  showValueInList,
        'params' : ['HCRM.OWNED_INDUSTRY'],
        'showKey' : 'description',
        'dataKey' : 'value',
        'dataModel' : '$scope.data.industry',
        'showDataModel' : '$scope.showData.industry'
      },{
        'key' : 'winning_rate',
        'interface' :  showValueInList,
        'params' : ['HCRM.WINNING_RATE'],
        'showKey' : 'description',
        'dataKey' : 'value',
        'dataModel' : '$scope.data.winningRate',
        'showDataModel' : '$scope.showData.winningRate'
      },{
        'key' : 'opportunity_sale_stage',
        'interface' :  showValueInList,
        'params' : ['HCRM.OPPORTUNITY_SALE_STAGE'],
        'showKey' : 'description',
        'dataKey' : 'value',
        'dataModel' : '$scope.data.saleStage',
        'showDataModel' : '$scope.showData.saleStage'
      },{
        'key' : 'charging_mode',
        'interface' :  showValueInList,
        'params' : ['HCRM.CHARGING_MODE'],
        'showKey' : 'description',
        'dataKey' : 'value',
        'dataModel' : '$scope.data.chargingMode',
        'showDataModel' : '$scope.showData.chargingMode'
      },{
        'key' : 'currency',
        'interface' :  showValueInList,
        'params' : ['HCRM.CURRENCY'],
        'showKey' : 'description',
        'dataKey' : 'value',
        'dataModel' : '$scope.data.currency',
        'showDataModel' : '$scope.showData.currency'
      },{
        'key' : 'customer',
        'interface' :  opportunityAddService.getCustomers,
        'params' : [getCustomerSuccess, $scope.nowPage, $scope.pageSize, 'MY_CUSTOMER'],
        'showKey' : 'fullName',
        'dataKey' : 'customerId',
        'dataModel' : '$scope.data.customerId',
        'showDataModel' : '$scope.showData.customerName',
        'searchInterface' : opportunityAddService.searchCustomer,
        'searchParams' : getCustomerSearchSuccess,
        'needShowMore' : true
      },{
        'key' : 'customer_contacts',
        'interface' :  opportunityAddService.getCustomerContacts,
        'params' : [getCustomerContactsSuccess, $scope.nowPage, $scope.pageSize, $scope.data.customerId],
        'showKey' : 'name',
        'dataKey' : 'contactId',
        'dataModel' : '$scope.data.customersContactsId',
        'showDataModel' : '$scope.showData.customerContactsName',
        'needShowMore' : true
      },{
        'key' : 'product_type',
        'interface' :  showValueInList,
        'params' : ['HCRM.ORDER_PRODUCT_TYPE'],
        'showKey' : 'description',
        'dataKey' : 'value',
        'dataModel' : '$scope.newEstimate.productType',
        'showDataModel' : '$scope.newEstimate.productTypeName'
      },{
        'key' : 'competitor',
        'interface' :  opportunityAddService.getCompetitor,
        'params' : [getCompetitorSuccess, $scope.nowPage, $scope.pageSize],
        'showKey' : 'fullName',
        'dataKey' : 'competitorId',
        'dataModel' : '$scope.newCompetitor.competitorId',
        'showDataModel' : '$scope.newCompetitor.fullName',
        'searchInterface' : opportunityAddService.searchCompetitor,
        'searchParams' : getCompetitorResultSuccess,
        'needShowMore' : true
      },{
        'key' : 'income_scale',
        'interface' :  showValueInList,
        'params' : ['HCRM.INCOME_SCALE'],
        'showKey' : 'description',
        'dataKey' : 'value',
        'dataModel' : '$scope.data.incomeScale',
        'showDataModel' : '$scope.showData.incomeScale'
      },{
        'key' : 'is_listed',
        'interface' :  showValueInList,
        'params' : ['SYS.YES_NO'],
        'showKey' : 'description',
        'dataKey' : 'value',
        'dataModel' : '$scope.data.isListed',
        'showDataModel' : '$scope.showData.isListed'
      },{
        'key' : 'winning_competitor',
        'interface' :  opportunityAddService.getCompetitor,
        'params' : [getCompetitorSuccess, $scope.nowPage, $scope.pageSize],
        'showKey' : 'fullName',
        'dataKey' : 'competitorId',
        'dataModel' : '$scope.data.winningCompetitorId',
        'showDataModel' : '$scope.showData.winningCompetitor',
        'searchInterface' : opportunityAddService.searchCompetitor,
        'searchParams' : getCompetitorResultSuccess,
        'needShowMore' : true
      },{
        'key' : 'year',
        'interface' :  initYear,
        'params' : [],
        'showKey' : 'year',
        'dataKey' : 'year',
        'dataModel' : '$scope.data.theYear',
        'showDataModel' : '$scope.data.theYear'
      }];

      //通用选择框
      $ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal) {
        $scope.crmSelectModal = modal;
      });

      $scope.showSelectDiv = function(key){

        if($scope.promoteFlag && key == 'customer')
          return ;

        if($scope.customerDataFlag && key == 'customer')
          return ;

        if($scope.editFlag && key == 'customer')
          return ;

        if(!$scope.editCustomerFlag && key == 'income_scale'){
          hmsPopup.showPopup('抱歉，你没有权限修改该客户。');
          return ;
        }
        if(!$scope.editCustomerFlag && key == 'is_listed'){
          hmsPopup.showPopup('抱歉，你没有权限修改该客户。');
          return ;
        }

        console.log('showSelectDiv key ' + key);

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
          $scope.nowSelectTarget.searchInterface.call(null,$scope.nowSelectTarget.searchParams,$scope.searchModel.searchValueKey,$scope.nowPage,$scope.pageSize);
        } else
          $scope.nowSelectTarget.interface.apply(null,$scope.nowSelectTarget.params);
      };

      var validCustomerContactsSuccess = function(response){
        $scope.showCrmLoading = false;
        if(response.returnCode == 'S'){
          if(response.customer_contact_list.length == 0){
            hmsPopup.showPopup('客户缺少"主要联系人"信息，请补充信息后再进行创建');
          } else
            opportunityAddService.getCustomerDetail(getCustomerDetailSuccess, $scope.data.customerId);
        }
      };

      $scope.selectItem = function($index){
        var data = $scope.items[$index][$scope.nowSelectTarget['dataKey']];  //接口所需数据
        if($scope.nowSelectTarget['key'] == 'competitor'){
          for(var i = 0; i < $scope.competitors.length; i++) {
            if($scope.competitors[i].competitorId == data){
              hmsPopup.showPopup('已添加过该竞争对手！请重新选择');
              return ;
            }
          }
        }
        if($scope.nowSelectTarget['key'] == 'customer')
          $scope.sourceCustomer = {
            customerId: $scope.data.customerId,
            customerName: $scope.showData.customerName
          };
        var showKey = $scope.items[$index][$scope.nowSelectTarget['showKey']];
        showKey = (showKey == '空') ? "" : showKey;
        var dataModel = $scope.nowSelectTarget['dataModel'];                 //最终操作提交所需的数据变量
        var showDataModel = $scope.nowSelectTarget['showDataModel'];         //显示用的数据变量ng-model
        eval(dataModel + " = data");
        eval(showDataModel + " = showKey");
        if($scope.nowSelectTarget['key'] == 'opportunity_status'){
          $scope.opportunityRate = $scope.items[$index].opportunityRate;
          if($scope.opportunityRate == undefined)
            $scope.opportunityRate = 0;
        }
        if($scope.nowSelectTarget['key'] == 'business_from'){
          $scope.isOrigin = $scope.items[$index].businessFrom == 'ORIGINALS';
          $scope.data.originalFactoryFrom = "";
          $scope.showData.originalFactoryFrom = ""
        }
        if($scope.nowSelectTarget['key'] == 'customer'){
          $scope.showCrmLoading = true;
          opportunityAddService.getCustomerContacts(validCustomerContactsSuccess, 1, 10, data);
          return;
        }
        if($scope.nowSelectTarget['key'] == 'opportunity_status'){
          $scope.needCompetitorFlag = (data == 'HCRM_HOT_CHANCE' || data == 'HCRM_PROBABLY_WIN' || data == 'HCRM_WIN_CONFIRMED');
          $scope.showWinCompanyFlag = $scope.data.opportunityStatus == "HCRM_LOST";
          if(!$scope.showWinCompanyFlag){
            $scope.data.winningCompetitorId = "";
            $scope.showData.winningCompetitor = "";
          }
        }
        $scope.showSelectDiv();
      };

      function isContains(str, substr) {
        return new RegExp(substr).test(str);
      }

      Array.prototype.clone=function(){
        return [].concat(this);
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

      $scope.clearSelectFilter = function(){
        $scope.searchModel.searchValueKey = '';
        $scope.searchSelectValue();
      };

      //选择商品
      $scope.products = [];
      $scope.categoryType = 'HCRM_CATEGORY_1';
      $scope.parentCategoryId = -1;

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

      //所属级联
      $scope.saleAreas = [];
      $scope.saleTeams = [];
      $scope.showSaleTeam = false;

      var getSaleAreaSuccess= function(response){
        $scope.showCrmLoading = false;
        if(response.returnCode == "S")
          $scope.saleAreas = response.sale_area_list;
      };

      var getSaleTeamSuccess= function(response){
        $scope.showCrmLoading = false;
        if(response.returnCode == "S"){
          $scope.saleTeams = [{
            saleTeamName: "空",
            saleTeamId: ""
          }];
          $scope.saleTeams = $scope.saleTeams.concat(response.sale_team_list);
        }
      };

      $scope.showSaleSelectFlag = false;

      $scope.showSaleSelect = function(){
        if($scope.promoteFlag)
          return ;
        $scope.showSaleSelectFlag = true;
        $scope.showCrmLoading = true;
        opportunityAddService.getSaleArea(getSaleAreaSuccess);
      };

      $scope.selectArea = function(area){
        $ionicScrollDelegate.$getByHandle('saleScroll').scrollTop(false);
        $scope.showSaleTeam = true;
        $scope.showData.saleArea = area.saleAreaName;
        $scope.data.saleAreaId = area.saleAreaId;
        $scope.showCrmLoading = true;
        opportunityAddService.getSaleTeam(getSaleTeamSuccess, area.saleAreaId);
      };

      $scope.selectTeam = function(team){
        $ionicScrollDelegate.$getByHandle('saleScroll').scrollTop(false);
        $scope.showSaleTeam = false;
        $scope.showSaleSelectFlag = false;
        $scope.showData.saleTeam = team.saleTeamName;
        $scope.showData.saleBelong = $scope.showData.saleArea + " | " + $scope.showData.saleTeam;
        $scope.data.saleTeamId = team.saleTeamId;
      };

      $scope.saleBack = function(){
        $ionicScrollDelegate.$getByHandle('saleScroll').scrollTop(false);
        //当目录在一级时，返回
        if(!$scope.showSaleTeam)
          $scope.showSaleSelectFlag = false;
        //否则跳到一级,并清空第二级数据
        else{
          $scope.showSaleTeam = false;
          $scope.saleTeams = [];
        }
      };

      //校验名称
      $scope.validNameFlag = true;
      var validNameSuccess= function(response){
        $scope.validNameFlag = response.returnFlag;
        if(!$scope.validNameFlag)
          hmsPopup.showPopup('商机名称重复！请重新输入');
      };

      $scope.validName = function(){
        if($scope.editFlag && $scope.nameBeforeEdit == $scope.data.fullName){
          $scope.validNameFlag = true;
          return ;
        }
        opportunityAddService.validName(validNameSuccess, $scope.data.fullName);
      };

      $scope.$on('$destroy', function (e) {
        if($scope.crmSelectModal)
          $scope.crmSelectModal.remove();
        if($scope.addPresalesSelectModal)
          $scope.addPresalesSelectModal.remove();
        if($scope.addCompetitorSelectModal)
          $scope.addCompetitorSelectModal.remove();
        if($scope.addPresalesForecast)
          $scope.addPresalesForecast.remove();
        if($scope.addCompetitorModal)
          $scope.addCompetitorModal.remove();
        if($scope.productSelectModal)
          $scope.productSelectModal.remove();
      });

      //所属行业级联
      $scope.majorIndustrys = [];
      $scope.subIndustrys = [];
      $scope.showSubIndustry = false;

      var getMajorIndustrySuccess= function(response){
        $scope.showLoading = false;
        if(response.returnCode == "S")
          $scope.majorIndustrys = response.industry_list;
      };

      var getSubIndustrySuccess= function(response){
        $scope.showLoading = false;
        if(response.returnCode == "S")
          var obj = {
            industryId:'',
            industryName:'空'
          };
        $scope.subIndustrys = response.industry_list;
        $scope.subIndustrys.unshift(obj);
      };

      $scope.showIndustrySelectFlag = false;

      $scope.showIndustrySelect = function(key){
        $scope.isCustomerIndustry = key == 'customer';
        if(!$scope.editCustomerFlag && $scope.isCustomerIndustry){
          hmsPopup.showPopup('抱歉，你没有权限修改该客户。');
          return ;
        }
        $scope.showIndustrySelectFlag = true;
        $scope.showLoading = true;
        opportunityAddService.getIndustry(getMajorIndustrySuccess,0);
      };

      $scope.selectMajor = function(industry){
        $ionicScrollDelegate.$getByHandle('industryScroll').scrollTop(false);
        $scope.showSubIndustry = true;
        if($scope.isCustomerIndustry){
          $scope.showData.cusMajorIndustry = industry.industryName;
          $scope.data.cusMajorIndustry = industry.industryId;
        } else {
          $scope.showData.majorIndustry = industry.industryName;
          $scope.data.majorIndustry = industry.industryId;
        }
        $scope.showLoading = true;
        opportunityAddService.getIndustry(getSubIndustrySuccess, industry.industryId);
      };

      $scope.selectSub = function(industry){
        $ionicScrollDelegate.$getByHandle('industryScroll').scrollTop(false);
        $scope.showSubIndustry = false;
        $scope.showIndustrySelectFlag = false;
        if($scope.isCustomerIndustry){
          $scope.showData.cusSubIndustry = industry.industryName;
          $scope.showData.cusIndustry = $scope.showData.cusMajorIndustry + " | " + $scope.showData.cusSubIndustry;
          $scope.data.cusSubIndustry = industry.industryId;
        } else {
          $scope.showData.subIndustry = industry.industryName;
          $scope.showData.industry = $scope.showData.majorIndustry + " | " + $scope.showData.subIndustry;
          $scope.data.subIndustry = industry.industryId;
        }
      };

      $scope.industryBack = function(){
        $ionicScrollDelegate.$getByHandle('industryScroll').scrollTop(false);
        //当目录在一级时，返回
        if(!$scope.showSubIndustry)
          $scope.showIndustrySelectFlag = false;
        //否则跳到一级,并清空第二级数据
        else{
          $scope.showSubIndustry = false;
          $scope.subIndustrys = [];
        }
      };


    }]);

angular.module('opportunityModule')
  .service('opportunityAddService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function(hmsHttp,
             hmsPopup,
             baseConfig) {

      var baseUrl = baseConfig.basePath;

      //新增商机
      this.addOpportunities = function(success, data, competitors, estimates) {

        var params = data;
        params.presells = angular.copy(estimates);
        params.competitors = angular.copy(competitors);

        console.log(JSON.stringify(params));

        hmsHttp.post(baseUrl + 'add_opportunity', params).success(function(result) {
          console.log(result);
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });

      };

      //编辑商机
      this.updateOpportunities = function(success, data, competitors, estimates) {
        var params = data;
        if(estimates)
          params.presells = angular.copy(estimates);
        if(competitors)
          params.competitors = angular.copy(competitors);
        console.log(JSON.stringify(params));
        hmsHttp.post(baseUrl + 'opportunity_update', params).success(function(result) {
          console.log(result);
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });

      };

      this.promoteClue = function(success, data, competitors, estimates){
        var params = data;
        params.presells = angular.copy(estimates);
        params.competitors = angular.copy(competitors);
        console.log(JSON.stringify(params));
        hmsHttp.post(baseUrl + 'promote_clue', params).success(function(result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };


      //新增线索
      this.addClue = function(success, data) {

        var params = data;
        console.log(JSON.stringify(params));
        hmsHttp.post(baseUrl + 'add_clue', params).success(function(result) {
          console.log(result);
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });

      };

      //线索编辑
      this.updateClue = function(success, data) {

        var params = data;
        console.log(JSON.stringify(params));
        hmsHttp.post(baseUrl + 'clue_update', params).success(function(result) {
          console.log(result);
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });

      };

      //得到客户列表
      this.getCustomers = function(success, page, pageSize, queryType){
        var params = {
          page: page,
          pageSize: pageSize,
          queryType: queryType
        };
        hmsHttp.post(baseUrl + 'query_customer_list', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //得到客户联系人列表
      this.getCustomerContacts = function(success, page, pageSize, customerId){
        var params = {
          page: page,
          pageSize: pageSize,
          customerId: customerId
        };
        console.log(params);
        hmsHttp.post(baseUrl + 'customer_contact_list', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //查询预销售Leader
      this.getPreLeader = function(success, page, pageSize){
        var params = {
          page: page,
          pageSize: pageSize
        };
        hmsHttp.post(baseUrl + 'query_sale_employee', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //预销售Leader
      this.searchPreLeader = function(success, keyWord, page, pageSize) {
        var params = {
          page: page,
          pageSize: pageSize,
          keyWord: keyWord
        };
        hmsHttp.post(baseUrl + 'query_sale_employee', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //得到产品目录
      this.getProducts = function(success, categoryType, parentCategoryId){
        var params = {};
        if(parentCategoryId == -1)
          params = {
            categotyType : categoryType
          };
        else
          params = {
            categotyType : categoryType,
            parentCategotyId : parentCategoryId
          };
        console.log(params);
        hmsHttp.post(baseUrl + 'product_categoty', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //得到事业部
      this.getBusinessUnit = function(success, page, pageSize) {
        var params = {
          page: page,
          pageSize: pageSize
        };
        hmsHttp.post(baseUrl + 'business_unit', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //得到公司属性
      this.getCompany = function(success, page, pageSize) {
        var params = {
          page: page,
          pageSize: pageSize
        };
        hmsHttp.post(baseUrl + 'inside_company', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //得到商机来源
      this.getBusinessFrom = function(success, levelType, valueType) {
        var params = {
          levelType: levelType,
          valueType: valueType
        };
        hmsHttp.post(baseUrl + 'business_from', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //得到值列表
      this.getValueList = function(success, list) {
        var params = {lookupList : []};
        for(var i = 0; i < list.length; i++){
          params.lookupList.push({
            code : list[i].code,
            lastUpdateDate: window.localStorage[list[i].lastUpdateDate]
          })
        }
        hmsHttp.post(baseUrl + 'query_lookup', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //校验商机名称
      this.validName = function(success, fullName) {
        var params = {
          fullName: fullName
        };
        hmsHttp.post(baseUrl + 'opportunity_valid_name', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //得到所属区域
      this.getSaleArea = function(success) {
        var params = {
          orgType: "HCRM_SALE_AREA"
        };
        hmsHttp.post(baseUrl + 'query_sale_area', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //得到所属团队
      this.getSaleTeam = function(success, organizationId) {
        var params = {
          organizationId: organizationId,
          orgType: "HCRM_SALE_TEAM"
        };
        hmsHttp.post(baseUrl + 'query_sale_team', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //得到竞争对手
      this.getCompetitor = function(success, page, pageSize) {
        var params = {
          page: page,
          pageSize: pageSize
        };
        hmsHttp.post(baseUrl + 'query_competitor_list', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //搜索客户
      this.searchCustomer = function(success, keyWord, page, pageSize){
        var params = {
          keyWord: keyWord,
          page: page,
          pageSize: pageSize
        };
        hmsHttp.post(baseUrl + 'select_customers', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //搜索竞争对手
      this.searchCompetitor = function(success, keyWord){
        var params = {
          keyWord: keyWord
        };
        hmsHttp.post(baseUrl + 'search_competitor', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //搜索事业部
      this.searchBusinessUnit = function(success, keyWord, page, pageSize) {
        var params = {
          keyWord: keyWord,
          page: page,
          pageSize: pageSize
        };
        hmsHttp.post(baseUrl + 'business_unit', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //得到商机状态
      this.getOpportunityStatus = function(success, status){
        var params = {
          statusType: status
        };
        hmsHttp.post(baseUrl + 'opportunity_status', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //所属行业级联
      this.getIndustry = function (success,parentIndustryId) {
        var params={
          parentIndustryId:parentIndustryId
        };
        hmsHttp.post(baseUrl + 'industry_lookup',params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };

      this.getCustomerDetail = function(success, customerId){
        var params={
          customerId:customerId
        };
        hmsHttp.post(baseUrl + 'get_condition',params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };

      this.getEmployeeDetail = function(success){
        hmsHttp.post(baseUrl + 'employee_detail', {}).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };


    }]);

