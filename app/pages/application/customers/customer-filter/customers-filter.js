/**
 * Created by ZaraNengap on 2016/10/9.
 */
'use strict';
angular.module('customerModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.customer-filter', {
          url: '/customers/customer-filter',
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/customers/customer-filter/customer-filter.html',
              controller: 'customerFilterCtrl'
            }
          }
        })

    }]);

angular.module('customerModule')
  .controller('customerFilterCtrl', [
    '$scope',
    '$state',
    'publicMethod',
    '$ionicHistory',
    'history',
    'hmsPopup',
    '$timeout',
    'hmsHttp',
    '$ionicModal',
    'T',
    'CloneData',
    function($scope,
             $state,
             publicMethod,
             $ionicHistory,
             history,
             hmsPopup,
             $timeout,
             hmsHttp,
             $ionicModal,
             T,
             CloneData) {

      $scope.value = {
        page:1,
        pageSize:10
      }

      //多语言字段
      //$scope.bilingual=CloneData.getCustomer_find();
      $scope.filterBilingual=CloneData.getCustomer_information();
      $scope.imgSrc = ["build/img/application/icon-custom@3x.png"];

      $scope.goBack = function(){
        $ionicHistory.goBack();
      };

      $scope.goState = function (url) {
        $state.go(url);
      };

      $scope.goDetail = function(customer){
        $state.go("tab.customer-detail");
      }
      $scope.parentCustomerValue={};
      var parentCustomerUrl="http://172.20.0.194:8080/crm/api/crm_customer/parent_customer";
      $scope.parentCustomer ={
        valueName:"请选择",
        valueList:["张三","李四","王五","赵六"],
        valueId:[],
        modalTitle:"请选择",
      }

      $scope.areaValue = {"orgType":"HCRM_SALE_AREA"}
      var areaUrl="http://172.20.0.194:8080/crm/api/address/query_sale_area";
      $scope.belongsRegion ={
          valueName:"请选择",
        valueList:["张三","李四","王五","赵六"],
        valueId:[],
        modalTitle:"请选择"
      }

      $scope.teamValue = {
        'organizationId':'902',
        'orgType':'HCRM_SALE_TEAM'
      }
      var teamUrl="http://172.20.0.194:8080/crm/api/address/query_sale_team";
      $scope.team = {
        valueName:"请选择",
        valueList:["张三","李四","王五","赵六"],
        valueId:[],
        modalTitle:"请选择",
      }

      $scope.principal = {
        valueName:"请选择",
        valueList:["张然","李四","王明","赵六"],
        valueId:[],
        modalTitle:"请选择",
      }

      var companyUrl="http://172.20.0.194:8080/crm/api/crm_customer/query_lookup";
      $scope.businessDetai =[{
        text:"收入规模",
        valueName:"请选择",
        valueList:["张三","李四","王五","赵六"],
        code:[],
        modalTitle:"请选择"
      },{
        text:"员工规模",
        valueName:"请选择",
        valueList:["张三","李四","王五","赵六"],
        code:[],
        modalTitle:"请选择",
        import:false
      },{
        text:"所属行业",
        valueName:"请选择",
        valueList:["张三","李四","王五","赵六"],
        code:[],
        modalTitle:"请选择",
        import:true
      },{
        text:"企业性质",
        valueName:"请选择",
        valueList:["张三","李四","王五","赵六"],
        code:[],
        modalTitle:"请选择",
        import:false
      },{
        text:"上市公司",
        valueName:"请选择",
        valueList:["张三","李四","王五","赵六"],
        code:[],
        modalTitle:"请选择",
        import:true
      }];

      $scope.companyValue = [
        {
          "code": "HCRM.INCOME_SCALE",
          "lastUpdateDate ": ""
        },
        {
          "code": "HCRM.WORKER_SCALE",
          "lastUpdateDate ": ""
        },
        {
          "code": "HCRM.OWNED_INDUSTRY",
          "lastUpdateDate ": ""
        },
        {
          "code": "HCRM.ENTERPRISE_NATURE",
          "lastUpdateDate ": ""
        },
        {
          "code": "SYS.YES_NO",
          "lastUpdateDate ": ""
        }
      ]

        //上级客户数据请求
        hmsHttp.post(parentCustomerUrl,$scope.parentCustomerValue).success(function(data){
          if(data.parent_customer_list.length==0){
            hmsPopup.showPopup('未找到上级客户');
          }else {

            for(var i = 0;i<data.parent_customer_list.length; i++){
              $scope.parentCustomer.valueList.push(data.parent_customer_list[i].fullName);
              $scope.parentCustomer.valueId.push(data.parent_customer_list[i].customerId);
            }
          }
        })
        //所属大区数据请求
        hmsHttp.post(areaUrl,$scope.areaValue).success(function(data){
          if(data.sale_area_list.length==0){
            hmsPopup.showPopup('未找到所属大区');
          }else {

            for(var i = 0;i<data.sale_area_list.length; i++){
              $scope.belongsRegion.valueList.push(data.sale_area_list[i].saleAreaName);
              $scope.belongsRegion.valueId.push(data.sale_area_list[i].saleAreaId);
            }
          }
        })
        //所属团队数据请求
        hmsHttp.post(teamUrl,$scope.teamValue).success(function(data){
          if(data.sale_team_list.length==0){
            hmsPopup.showPopup('未找到所属团队');
          }else {

            for(var i = 0;i<data.sale_team_list.length; i++){
              $scope.team.valueList.push(data.sale_team_list[i].saleTeamName);
              $scope.team.valueId.push(data.sale_team_list[i].saleTeamId);
            }
          }
        })
        //企业信息搜索数据请求
        hmsHttp.post(companyUrl,$scope.companyValue).success(function(data){
          if(data.lookup_detail.length==0){
            hmsPopup.showPopup('未找到企业信息');
          }else {

            for(var i = 0;i<data.lookup_detail.length; i++){
              if(data.lookup_detail[i].lookup_value_list.length!==0){
                for(var j= 0;j<data.lookup_detail[i].lookup_value_list.length;j++){
                  $scope.businessDetai[i].valueList.push(data.lookup_detail[i].lookup_value_list[j].description);
                  $scope.businessDetai[i].code.push(data.lookup_detail[i].lookup_value_list[j].value);
                }
              }
            }
          }
        })

      ////通用选择弹窗
      //$scope.selectTargets = [{
      //  'key' : 'sale_employee',
      //  'interface' :  opportunityAddService.getPreLeader,  //获得选择项的接口
      //  'params' : [getMoreSaleEmployeeSuccess, $scope.nowPage, $scope.pageSize],  //获得选择项时接口所需参数
      //  'showKey' : 'name',            //选择界面显示的数据
      //  'dataKey' : 'employeeId',      //对象内最终操作提交所需的数据变量
      //  'dataModel' : '$scope.data.preSaleEmployeeId',  //最终操作提交所需的数据变量
      //  'showDataModel' : '$scope.showData.preSaleEmployee' //显示在界面上的ng-model
      //},{
      //  'key' : 'business_unit',
      //  'interface' :  opportunityAddService.getBusinessUnit,
      //  'params' : [getBusinessUnitSuccess],
      //  'showKey' : 'fullUnitName',
      //  'dataKey' : 'unitId',
      //  'dataModel' : '$scope.newEstimate.unitId',
      //  'showDataModel' : '$scope.newEstimate.unitName'
      //},{
      //  'key' : 'company',
      //  'interface' :  opportunityAddService.getCompany,
      //  'params' : [getCompanySuccess, $scope.nowPage, $scope.pageSize],
      //  'showKey' : 'companyName',
      //  'dataKey' : 'theCompany',
      //  'dataModel' : '$scope.data.theCompany',
      //  'showDataModel' : '$scope.showData.theCompany'
      //},{
      //  'key' : 'business_from',
      //  'interface' :  opportunityAddService.getBusinessFrom,
      //  'params' : [getBusinessFromSuccess, 'HCRM.BUSINESS_FROM_CATEGORY', 'HCRM_BUSIFROM_CATE_1'],
      //  'showKey' : 'businessFromName',
      //  'dataKey' : 'businessFrom',
      //  'dataModel' : '$scope.data.businessFrom',
      //  'showDataModel' : '$scope.showData.businessFrom'
      //},{
      //  'key' : 'opportunity_status',
      //  'interface' :  opportunityAddService.getValueList,
      //  'params' : [getValueListSuccess, 'HCRM.OPPORTUNITY_STATUS', window.localStorage.OPPORTUNITY_STATUS_DATE],
      //  'showKey' : 'description',
      //  'dataKey' : 'value',
      //  'dataModel' : '$scope.data.opportunityStatus',
      //  'showDataModel' : '$scope.showData.opportunityStatus'
      //},{
      //  'key' : 'owned_industry',
      //  'interface' :  opportunityAddService.getValueList,
      //  'params' : [getValueListSuccess, 'HCRM.OWNED_INDUSTRY', window.localStorage.OWNED_INDUSTRY],
      //  'showKey' : 'description',
      //  'dataKey' : 'value',
      //  'dataModel' : '$scope.data.industry',
      //  'showDataModel' : '$scope.showData.industry'
      //},{
      //  'key' : 'winning_rate',
      //  'interface' :  opportunityAddService.getValueList,
      //  'params' : [getValueListSuccess, 'HCRM.WINNING_RATE', window.localStorage.WINNING_RATE],
      //  'showKey' : 'description',
      //  'dataKey' : 'value',
      //  'dataModel' : '$scope.data.winningRate',
      //  'showDataModel' : '$scope.showData.winningRate'
      //},{
      //  'key' : 'opportunity_sale_stage',
      //  'interface' :  opportunityAddService.getValueList,
      //  'params' : [getValueListSuccess, 'HCRM.OPPORTUNITY_SALE_STAGE', window.localStorage.OPPORTUNITY_SALE_STAGE],
      //  'showKey' : 'description',
      //  'dataKey' : 'value',
      //  'dataModel' : '$scope.data.saleStage',
      //  'showDataModel' : '$scope.showData.saleStage'
      //},{
      //  'key' : 'charging_mode',
      //  'interface' :  opportunityAddService.getValueList,
      //  'params' : [getValueListSuccess, 'HCRM.CHARGING_MODE', window.localStorage.CHARGING_MODE],
      //  'showKey' : 'description',
      //  'dataKey' : 'value',
      //  'dataModel' : '$scope.data.chargingMode',
      //  'showDataModel' : '$scope.showData.chargingMode'
      //},{
      //  'key' : 'currency',
      //  'interface' :  opportunityAddService.getValueList,
      //  'params' : [getValueListSuccess, 'HCRM.CURRENCY', window.localStorage.CURRENCY],
      //  'showKey' : 'description',
      //  'dataKey' : 'value',
      //  'dataModel' : '$scope.data.currency',
      //  'showDataModel' : '$scope.showData.currency'
      //}];
      //
      //$scope.showSelectDiv = function(key){
      //  $scope.showSelect = !$scope.showSelect;
      //  if(!$scope.showSelect){
      //    $scope.items = [];
      //    return 0;
      //  }
      //  for(var i = 0; i < $scope.selectTargets.length; i++){
      //    if(key == $scope.selectTargets[i].key){
      //      $scope.nowSelectTarget = $scope.selectTargets[i];
      //      break;
      //    }
      //  }
      //  hmsPopup.showLoading();
      //  $scope.nowSelectTarget.interface.apply(null,$scope.nowSelectTarget.params);
      //};
      //
      //$scope.selectItem = function($index){
      //  var data = $scope.items[$index][$scope.nowSelectTarget['dataKey']];  //接口所需数据
      //  var showKey = $scope.items[$index][$scope.nowSelectTarget['showKey']];
      //  var dataModel = $scope.nowSelectTarget['dataModel'];                 //最终操作提交所需的数据变量
      //  var showDataModel = $scope.nowSelectTarget['showDataModel'];         //显示用的数据变量ng-model
      //  eval(dataModel + " = data");
      //  eval(showDataModel + " = showKey");
      //  $scope.showSelectDiv();
      //};

    }]);

customerModule.directive('hmsSelector2',function ($ionicModal) {
  return {
    restrict:"EA",
    templateUrl:"hmsSelector2.html",
    scope:{
      hmsTitle:"=",
      hmsValue:"=",
      hmsModalValue:"=",
      hmsPaging:"=",
      hmsImg:"="
    },
    link: function (scope,element,attrs) {
      scope.screenHeig = window.innerHeight;
      console.log("高度",scope.screenHeig);
      //根据值的多少判断打开哪个modal
      if (scope.hmsModalValue.length>=scope.hmsPaging) {        //数值多，打开带筛选框的
        $ionicModal.fromTemplateUrl('hms-many-data-modal.html', {
          scope: scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          scope.manyModal = modal;
        });
        scope.info = {    //过滤器
          filter:""
        };
        scope.openModal = function() {    //打开modal
          scope.manyModal.show();
        };
        //清选
        scope.clear = function () {
          scope.hmsValue = "";
          scope.info.filter = "";
          scope.manyModal.hide();
        }
        //返回,关闭modal
        scope.closeModal = function() {
          scope.manyModal.hide();
          scope.info.filter = "";
        };
        //选值
        scope.choose = function (item) {
          scope.hmsValue = item;
          scope.info.filter = "";
          scope.manyModal.hide();
        };
        //删除输入的值
        scope.delete = function () {
          scope.info.filter = "";
        }
      } else {    //数值不多，打开不带筛选框的
        $ionicModal.fromTemplateUrl('hms-modal.html', {
          scope: scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          scope.modal = modal;
        });
        scope.openModal = function() {
          scope.modal.show();
          setTimeout(function () {
            if (scope.hmsModalValue.length == 3) {
              $(".hmsModal").css("top", scope.screenHeig - 202 + 'px')
            } else if (scope.hmsModalValue.length >= 4 && scope.hmsModalValue.length<scope.hmsPaging) {
              $(".hmsModal").css("top", 47 + '%');
              $(".hmsModal").css("min-height", 53 + '%')
            } else if(scope.hmsModalValue.length<3){
              $(".hmsModal").css("top", scope.screenHeig - 149 + 'px')
            }
          },0)
        };
        scope.choose = function (item) {
          scope.hmsValue = item;
          scope.modal.hide();
        }
      }
    }
  }
});
