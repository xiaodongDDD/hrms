/**
 * Created by zaranengap on 2016/12/12.
 */
angular.module('clueModule')

  .controller('ClueAddCtrl', [
    '$scope',
    'baseConfig',
    '$ionicHistory',
    '$state',
    'opportunityAddService',
    'hmsPopup',
    'ionicDatePicker',
    '$ionicScrollDelegate',
    '$ionicModal',
    'T',
    'clueDetailDataService',
    'crmEmployeeService',
    function($scope,
             baseConfig,
             $ionicHistory,
             $state,
             opportunityAddService,
             hmsPopup,
             ionicDatePicker,
             $ionicScrollDelegate,
             $ionicModal,
             T,
             clueDetailDataService,
             crmEmployeeService) {

      $scope.titleList = {
        competitors: T.T('NEW_OPPORTUNITY.COMPETITORS'),
        customer: T.T('NEW_OPPORTUNITY.SELECT_CUSTOMER'),
        productTypeName: T.T('NEW_OPPORTUNITY.PRODUCT_TYPE'),
        clueStatus: T.T('NEW_CLUE.CLUE_STATE'),
        ownedIndustry: T.T('NEW_OPPORTUNITY.INDUSTRY'),
        customerContacts: T.T('NEW_OPPORTUNITY.SELECT_CUSTOMER_CONTACTS'),
        businessFrom: T.T('NEW_CLUE.SOURCE'),
        originalFactoryFrom: T.T('NEW_OPPORTUNITY.SOURCE_SOURCE'),
        prjBeginDate: T.T('NEW_OPPORTUNITY.START_DATE'),
        preSignDate: T.T('NEW_OPPORTUNITY.SIGN_DATE'),
        saleBelong: T.T('CLUE.LONG_BELONG'),
        theCompany: T.T('CLUE.COMPANY_PROPERTY'),
        description: T.T('NEW_CLUE.CLUE_DESCRIPTION'),
        productName: T.T('NEW_OPPORTUNITY.COMPETITORS_PRODUCT'),
        advantage: T.T('NEW_OPPORTUNITY.COMPETITORS_OPPONENT'),
        otherDescription: T.T('NEW_OPPORTUNITY.OTHER_DESCRIPTION')
      };

      $scope.goBack = function(){
        $scope.$emit('CLOSE_CLUE_ADD');
      };

      $scope.$on('HAVE_DATA',function(event,data){
        $scope.data.customerId = data.customerId;
        $scope.showData.customerName = data.customerName;
      });

      $scope.hideAreaFlag = [];
      $scope.hideArea = function(num){
        $scope.hideAreaFlag[num] = !$scope.hideAreaFlag[num];
        $ionicScrollDelegate.$getByHandle("slide-img").resize();
      };

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
          console.log(dateText);
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
          console.log(dateText);
          $scope.data.preSignDate = dateText;
        },
        from: new Date(2012, 1, 1),
        to: new Date(2017, 10, 30),
        inputDate: new Date(),
        mondayFirst: true,
        closeOnSelect: false,
        templateType: 'popup'
      };

      ////////////////////接口数据相关///////////////////////////

      function initData(){

        $scope.editFlag = $state.current.name == 'tab.clue-detail';

        $scope.validNameFlag = true;

        $scope.data = {
          opportunityCode: "",
          customerId: "",
          fullName: "",
          opportunityStatus: "HCRM_INITIAL_CHANCE",
          // industry: "",
          customersContactsId: "",
          businessFrom: "",
          originalFactoryFrom: "",
          prjBeginDate: "",
          preSignDate: "",
          saleEmployeeId: "",
          theCompany: "",
          theYear: "",
          creationYear: "",
          finishYear: "",
          description: "",
          saleAreaId: "",
          saleTeamId: "",
          majorIndustry: "",
          subIndustry: ""
        };

        //$scope.competitors = [];
        //
        //$scope.newCompetitor = {
        //  competitorId: "",
        //  opportunityId: -9999,
        //  productName: "",
        //  advantage: "",
        //  description: ""
        //};

        $scope.showData = {
          theCompany: "",
          businessFrom: "",
          opportunityStatus: "初始线索",
          industry: "",
          saleArea:"",
          saleTeam:"",
          customerName:"",
          customerContactsName:"",
          saleBelong: "",
          originalFactoryFrom:"",
          majorIndustry: "",
          subIndustry: ""
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

        var employeeDetail = crmEmployeeService.getEmployeeDetail();
        if(!employeeDetail){
          crmEmployeeService.initDetail(function(){
            employeeDetail = crmEmployeeService.getEmployeeDetail();
            $scope.data.saleAreaId = employeeDetail.saleAreaId;
            $scope.data.saleTeamId = employeeDetail.saleTeamId;
            $scope.showData.saleArea = employeeDetail.saleArea;
            $scope.showData.saleTeam = employeeDetail.saleTeam;
            $scope.showData.saleBelong = employeeDetail.saleBelong;
          });
        } else {
          $scope.data.saleAreaId = employeeDetail.saleAreaId;
          $scope.data.saleTeamId = employeeDetail.saleTeamId;
          $scope.showData.saleArea = employeeDetail.saleArea;
          $scope.showData.saleTeam = employeeDetail.saleTeam;
          $scope.showData.saleBelong = employeeDetail.saleBelong;
        }

      }

      initData();

      //////////////////////编辑////////////////////////

      $scope.$on('EDIT_CLUE',function(){
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
          opportunityStatus: tempOpportunity.opportunityStatus, //必传
          preSignDate: tempOpportunity.preSignDate,  //项目签署日期
          prjBeginDate: tempOpportunity.prjBeginDate //项目开始日期
        };

        $scope.showData = {
          theCompany: tempOpportunity.theCompanyName,
          businessFrom: tempOpportunity.businessFromName,
          opportunityStatus: tempOpportunity.opportunityStatusName,
          // industry: tempOpportunity.industryName,
          saleArea: tempOpportunity.saleAreaName,
          saleTeam: tempOpportunity.saleTeamName,
          customerName: tempOpportunity.customerName,
          customerContactsName: tempOpportunity.customersContactsName,
          saleBelong: tempOpportunity.saleAreaName + ' | ' + tempOpportunity.saleTeamName,
          originalFactoryFrom: tempOpportunity.originalFactoryFromName,
          industry: tempOpportunity.industry
        };
        $scope.data.customersContactsId = tempOpportunity.customersContactsId;
        $scope.showData.customerContactsName = tempOpportunity.customersContactsName;

      });

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


      var opportunity_value_list=[
        {
          code: "HCRM.OWNED_INDUSTRY",
          lastUpdateDate: "OWNED_INDUSTRY_DATE",
          localList : 'OWNED_INDUSTRY'
        }
      ];

      var getValueObjByCode = function(code){
        for(var i = 0; i < opportunity_value_list.length; i++){
          if(code == opportunity_value_list[i].code)
            return cloneObj(opportunity_value_list[i]);
        }
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
          $scope.moreDataCanBeLoaded = response.customer_list.length == $scope.pageSize;
          $scope.items = $scope.items.concat(response.customer_list);
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
          $scope.items = response.customer_list;
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

      //通用选择弹窗
      $scope.selectTargets = [{
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
        'params' : [getOpportunitySuccess, 'HCRM_CLUE'],
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
      }];

      $scope.$watch('data.customerId',function(newValue,oldValue){
        $scope.nowPage = 1;
        $scope.selectTargets[6].params = [getCustomerContactsSuccess, $scope.nowPage, $scope.pageSize, newValue];
        if($scope.firstInEdit){
          $scope.firstInEdit = false;
          return ;
        }
        $scope.data.customersContactsId = "";
        $scope.showData.customerContactsName = "";
      });

      //通用选择框
      $ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal) {
        $scope.crmSelectModal = modal;
      });

      $scope.showSelectDiv = function(key){

        $scope.searchModel.searchValueKey = '';
        $scope.nowPage = 1;

        if(key == 'competitor'){
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
          console.log(response.customer_contact_list.length);
          if(response.customer_contact_list.length == 0){
            hmsPopup.showPopup('客户缺少"主要联系人"信息，请补充信息后再进行创建');
          } else{
            opportunityAddService.getCustomerDetail(getCustomerDetailSuccess, $scope.data.customerId);
          }
        }
      };

      var getCustomerDetailSuccess = function(response){
        if(response.dataStatus == "HCRM_DISABLE"){
          $scope.data.customerId = $scope.sourceCustomer.customerId;
          $scope.showData.customerName = $scope.sourceCustomer.customerName;
          hmsPopup.showPopup('该客户已被禁用，不能进行操作！');
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
        console.log(response);
        $scope.showSelectDiv();
      };

      $scope.selectItem = function($index){
        var data = $scope.items[$index][$scope.nowSelectTarget['dataKey']];  //接口所需数据
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
        if($scope.nowSelectTarget['key'] == 'business_from')
          $scope.isOrigin = $scope.items[$index].businessFrom == 'ORIGINALS';
        if($scope.nowSelectTarget['key'] == 'customer'){
          $scope.sourceCustomer = {
            customerId: $scope.data.customerId,
            customerName: $scope.showData.customerName
          };
          $scope.showCrmLoading = true;
          opportunityAddService.getCustomerContacts(validCustomerContactsSuccess, 1, 10, data);
          return;
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

      var addClueSuccess = function(response){
        hmsPopup.hideLoading();
        if(response.returnCode == "S"){
          $ionicScrollDelegate.$getByHandle("slide-img").scrollTop(false);
          if($scope.editFlag){
            hmsPopup.showPopup("修改线索成功");
            $scope.$emit('CLUE_EDIT_SUCCESS');
          } else {
            initData();
            hmsPopup.showPopup("添加线索成功");
            $scope.$emit('CLUE_ADD_SUCCESS');
          }
        } else {
          hmsPopup.showPopup(response.returnMsg);
        }
      };

      $scope.addClue = function(){
        console.log($scope.data);

        if($scope.data.customerId == ''){
          hmsPopup.showPopup("关联客户不能为空！");
          return ;
        }
        if(!$scope.validNameFlag){
          hmsPopup.showPopup("线索名称重复，请重新输入！");
          return ;
        }
        if($scope.data.opportunityStatus == ''){
          hmsPopup.showPopup("线索状态不能为空！");
          return ;
        }
        if($scope.data.fullName == ''){
          hmsPopup.showPopup("线索名称不能为空！");
          return ;
        }
        if($scope.showData.customerContactsName == ''){
          hmsPopup.showPopup("关联客户联系人不能为空！");
          return ;
        }
        if($scope.showData.businessFrom == ''){
          hmsPopup.showPopup("线索来源不能为空！");
          return ;
        }
        if($scope.isOrigin && $scope.showData.originalFactoryFrom == ''){
          hmsPopup.showPopup("当线索来源为原厂时原厂划分不能为空！");
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
        if($scope.showData.saleArea == ''){
          hmsPopup.showPopup("所属项目大区不能为空！");
          return ;
        }
        if($scope.showData.theCompany == ''){
          hmsPopup.showPopup("公司属性不能为空！");
          return ;
        }
        hmsPopup.showLoading();
        if($scope.editFlag)
          opportunityAddService.updateClue(addClueSuccess,$scope.data);
        else
          opportunityAddService.addClue(addClueSuccess,$scope.data);
      };

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

      $scope.showIndustrySelect = function(){
        $scope.showIndustrySelectFlag = true;
        $scope.showLoading = true;
        opportunityAddService.getIndustry(getMajorIndustrySuccess,0);
      };

      $scope.selectMajor = function(industry){
        $ionicScrollDelegate.$getByHandle('industryScroll').scrollTop(false);
        $scope.showSubIndustry = true;
        $scope.showData.majorIndustry = industry.industryName;
        $scope.data.majorIndustry = industry.industryId;
        $scope.showLoading = true;
        opportunityAddService.getIndustry(getSubIndustrySuccess, industry.industryId);
      };

      $scope.selectSub = function(industry){
        $ionicScrollDelegate.$getByHandle('industryScroll').scrollTop(false);
        $scope.showSubIndustry = false;
        $scope.showIndustrySelectFlag = false;
        $scope.showData.subIndustry = industry.industryName;
        $scope.showData.industry = $scope.showData.majorIndustry + " | " + $scope.showData.subIndustry;
        $scope.data.subIndustry = industry.industryId;
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


