/**
 * Created by ZaraNengap on 2016/10/9.
 */
'use strict';
angular.module('customerModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.customers', {
          url: '/customers',
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/customers/customers.html',
              controller: 'CustomersCtrl'
            }
          }
        })

    }]);

angular.module('customerModule')
  .controller('CustomersCtrl', [
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
    'T',
    'CloneData',
    'customerService',
    'ionicDatePicker',
    'baseConfig',
    'opportunityAddService',
    '$ionicScrollDelegate',
    '$cordovaDatePicker',
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
              T,
              CloneData,
              customerService,
              ionicDatePicker,
              baseConfig,
              opportunityAddService,
              $ionicScrollDelegate,
              $cordovaDatePicker) {
      $scope.isIos = false;
      $scope.showShift = false;
      $scope.showSort = false;
      $scope.showHead = true;
      $scope.showLoading = true;
      $scope.loadMoreDataFlag = false;
      //值列表上啦加载
      $scope.moreDataCanBeLoaded=false;
      $scope.customers = [];
      $scope.valueType = [{
        page: 1,
        pageSize: 20,
        queryType:'ALL_CUSTOMER',
        sortname: '',
        sortorder: ''
      },{
        page: 1,
        pageSize: 20,
        queryType:'MY_CUSTOMER',
        sortname: '',
        sortorder: ''
      }];
      $scope.value= $scope.valueType[0];
      //查询接口所需参数
      $scope.data = {
        parentCustomersId: "",//上级客户
        saleAreaId: "",//所属大区
        saleTeamId: "",//所属团队
        saleEmployeeId: "",//负责人
        enterpriseNature: "",//企业性质
        majorIndustry: "",//所属行业
        subIndustry:"",
        incomeScale: "",//收入规模
        creationDateFrom: '',//创建时间开始
        creationDateTo: '',//创建时间结束
        addressCountry:'',//国家
        addressProvince:'',//省
        addressCity:'',//城市
        addressZone:'',//区
        isListed:'',//是否上市
        page:1,
        pageSize:20,
        sortname:'',
        sortorder:'',
        queryType:'ALL_CUSTOMER',
        approveType:'',
        dataStatus:''
      };
      if(ionic.Platform.isIOS() || ionic.Platform.isIPad()){
        $scope.isIos = true;
      }

      $scope.onDrag = function ($event) {
        var deltaY = $event.gesture.deltaY;
        $scope.showHead = deltaY > 0;
      };

      $scope.showShiftDiv = function () {
        $scope.showShift = !$scope.showShift;
        $scope.showSort = false;
      };
      $scope.showSortDiv = function(){
        $scope.showSort = !$scope.showSort;
        $scope.showShift = false;
      };
      var error = function (response) {
      };

      $scope.subHeadersSelect = [true, false];
      //多语言字段
      $scope.bilingual = CloneData.getCustomer_find();
      $scope.filterBilingual = CloneData.getCustomer_information();

      $scope.selectSubHeader = function ($index) {

        console.log($index);
        if ($scope.subHeadersSelect[$index])
          return 0;
        else {
          $scope.showLoading = true;
          $scope.valueType[0].sortname = $scope.data.sortname;
          $scope.valueType[1].sortname = $scope.data.sortname;
          $scope.valueType[0].sortorder = $scope.data.sortorder;
          $scope.valueType[1].sortorder = $scope.data.sortorder;
          $scope.value = $scope.valueType[$index];
          $scope.data.queryType = $scope.valueType[$index].queryType;
          $scope.data.page=1;
          $scope.loadMoreDataFlag =false;
          $scope.subHeadersSelect = [false,false];
          $scope.subHeadersSelect[$index] = true;
          $ionicScrollDelegate.scrollTop(false);
        }
        //hmsPopup.showLoading();
        console.log("切换type之后传的值：==="+$scope.data.page);
        customerService.queryCustomer(queryCustomerSuccess,error,$scope.data);
      };
      $scope.customers = [];

      $scope.goBack = function () {
        $state.go('tab.application');
      };

      $scope.goState = function (url) {
        $state.go(url);
      };

      $scope.onDrag = function($event){
        var deltaY = $event.gesture.deltaY;
        $scope.showHead = deltaY > 0;
      };

      $scope.goDetail = function (customer) {
        window.localStorage.customerId = customer.customerId;
        window.localStorage.fullName= customer.fullName;
        customerService.setIsCustomer(true);
        console.log(customer);
        $state.go('tab.customer-detail',{
          customerDetail:customer
        });
      /*  $state.go("tab.customer-detail",{customerDetail:customer});*/
      };

      var queryCustomerSuccess = function(response){
        //hmsPopup.hideLoading();
        $scope.showLoading = false;
        $ionicScrollDelegate.scrollTop(false);
        if(response.returnCode == "S"){
          if(response.customer_list.length===0){
            //未找到数据
            $scope.loadMoreDataFlag = false;
          }else{
            $scope.customers = response.customer_list;
            $scope.loadMoreDataFlag = $scope.loadMoreDataFlag = response.customer_list.length==$scope.data.pageSize;
            console.log($scope.customers.length)
          }

        } else {
          alert(response.returnMsg);
        }
        //$scope.$broadcast('scroll.infiniteScrollComplete');
      };
      customerService.queryCustomer(queryCustomerSuccess,error,$scope.data);
      //下拉刷新
      $scope.doRefresh = function () {
        $scope.data.page= 1;
        $scope.customers = [];
        var error = function (response) {
          $scope.$broadcast('scroll.refreshComplete');
        };
        customerService.queryCustomer(queryCustomerSuccess,error,$scope.data);
        $scope.$broadcast('scroll.refreshComplete');
      }

      var loadMoreListSuccess = function (result) {
        if (result.returnCode == "S") {
          $scope.customers = $scope.customers.concat(result.customer_list);
          if (result.customer_list.length == 0) {
            console.log("没有数据了" + $scope.loadMoreDataFlag);
            $scope.loadMoreDataFlag = false;
          }
        } else {
          $scope.loadMoreDataFlag = false;
          hmsPopup.showPopup(result.returnMsg);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      //上啦加载
      $scope.loadMoreData = function () {
        console.log("上拉加载" + $scope.loadMoreDataFlag);
        $scope.data.page++;
        var error = function (response) {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        customerService.queryCustomer(loadMoreListSuccess,error,$scope.data);
        //$ionicScrollDelegate.$getByHandle("slideimgs").resize();
      };
      //排序数据
      $scope.sortList = [{
        flag: 'asc',
        name: 'fullName',
        text: '客户名称升序',
        icon: 'icon_customer'
      }, {
        flag: 'desc',
        name: 'fullName',
        text: '客户名称降序',
        icon: 'icon_customer'
      },{
        flag: 'asc',
        name: 'cityName',
        text: '所在城市升序',
        icon: 'icon_house_blue'
      },{
        flag: 'desc',
        name: 'cityName',
        text: '所在城市降序',
        icon: 'icon_house_blue'
      },{
        flag: 'desc',
        name: 'creationDate',
        text: '创建时间最近',
        icon: 'icon_day'
      },{
        flag: 'asc',
        name: 'creationDate',
        text: '创建时间最早',
        icon: 'icon_day'
      },{
        flag: 'asc',
        name: 'saleArea',
        nameSecond:'saleTeam',
        nameThird:'saleEmployee',
        text: '所属大区、所属团队、负责人升序',
        icon: 'icon_flat_blue'
      },{
        flag: 'desc',
        name: 'saleArea',
        nameSecond:'saleTeam',
        nameThird:'saleEmployee',
        text: '所属大区、所属团队、负责人降序',
        icon: 'icon_flat_blue'
      }];

      $scope.lastSelectSortIndex = 4;

      $scope.selectSort = function(index){
        if(index<4){
          $scope.data.sortname = $scope.sortList[index].name;
          $scope.value.sortname =$scope.sortList[index].name;
        }else{
          $scope.data.sortname = $scope.sortList[index].name;
          $scope.value.sortname = $scope.sortList[index].name;
        }
        $scope.data.sortorder = $scope.sortList[index].flag;
        $scope.value.sortorder = $scope.sortList[index].flag;
        $scope.lastSelectSortIndex = index;
        $scope.sort();
      };



      //界面显示的数据
      $scope.showData = {
        fullName: "",//上级客户
        saleAreaName: "",//所属大区
        team: "",//所属团队
        principal: "",//负责人
        enterpriseNature: "",//企业性质
        majorIndustry: "", //所属行业
        subIndustry:"",
        incomeScale: "",//收入规模
        creationDateFrom: '',
        creationDateTo: '',
        address:'',
        approveType:'',
        dataStatus:''
      };

      $scope.items = [];
      $scope.nowSelectTarget = {};
      var business_value_list = [
        {
          code : 'HCRM.INCOME_SCALE',
          lastUpdateDate : 'INCOME_SCALE_DATE',
          localList : 'INCOME_SCALE'
        },
        //{
        //  code: 'HCRM.OWNED_INDUSTRY',
        //  lastUpdateDate : 'OWNED_INDUSTRY_DATE',
        //  localList : 'OWNED_INDUSTRY'
        //},
        {
          code: 'HCRM.ENTERPRISE_NATURE',
          lastUpdateDate : 'ENTERPRISE_NATURE_DATE',
          localList : 'ENTERPRISE_NATURE'
        }
      ]
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
        for(var i = 0; i < business_value_list.length; i++){
          if(code == business_value_list[i].code)
            return cloneObj(business_value_list[i]);
        }

      };
      var initApprove = function () {
        $scope.showCrmLoading = false;
        $scope.items = [{
          approveType:'',
          name:'不限'
        },{
          approveType:'HCRM_NEW',
          name:'未提交'
        },{
          approveType:'HCRM_SUBMITTED',
          name:'已提交'
        },{
          approveType:'HCRM_APPROVED',
          name:'已审核'
        },{
          approveType:'HCRM_REJECTED',
          name:'已拒绝'
        }];
      }
      var initDataStatus = function () {
        $scope.showCrmLoading = false;
        $scope.items = [{
          statusType:'',
          name:'不限'
        },{
          statusType:'HCRM_VALID',
          name:'启用'
        },{
          statusType:'HCRM_DISABLE',
          name:'禁用'
        },{
          statusType:'HCRM_LIMITED',
          name:'受限'
        }];
      }
      //所属大区
      var getSaleAreaSuccess = function (response) {
        $scope.showCrmLoading = false;
        hmsPopup.hideLoading();
        if (response.returnCode == 'S')
          $scope.items = $scope.items.concat(response.sale_area_list);
        $scope.sourceItems = $scope.items.clone();
      };
      //所属团队
      var getSaleTeamSuccess = function (response) {
        $scope.showCrmLoading = false;
        hmsPopup.hideLoading();
        if (response.returnCode == 'S')
          $scope.items = $scope.items.concat(response.sale_team_list);
        $scope.sourceItems = $scope.items.clone();
      };
      //主行业
      var getMajorSuccess = function (response) {
        $scope.showCrmLoading = false;
        hmsPopup.hideLoading();
        if (response.returnCode == 'S')
          $scope.items = $scope.items.concat(response.industry_list);
        $scope.sourceItems = $scope.items.clone();
      };
      //二级行业
      var getSubSuccess = function (response) {
        $scope.showCrmLoading = false;
        hmsPopup.hideLoading();
        if (response.returnCode == 'S')
          $scope.items = $scope.items.concat(response.industry_list);
        $scope.sourceItems = $scope.items.clone();
      };
      function isContains(str, substr) {
        return new RegExp(substr).test(str);
      }

      Array.prototype.clone = function () {
        return [].concat(this);
      };

      /*  console.log(JSON.parse(window.localStorage.sexdata));*/
      var listInitSuccess = function (response) {
        console.log("--------");
        console.log(response);
        //$scope.showCrmLoading = false;
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
        }
      };
      //上级客户分页查询
      var getParentCustomerSuccess = function (response) {
        console.log("第一次进来");
        console.log( $scope. nowSelectTarget.needShowMore && $scope.moreDataCanBeLoaded);
        $scope.showCrmLoading=false;
        $scope.moreDataCanBeLoaded=false;
        if(response.returnCode == 'S'){
          $scope.items = $scope.items.concat(response.parent_customer_list);
          $scope.sourceItems = $scope.items.clone();
          $scope.moreDataCanBeLoaded = response.parent_customer_list.length == $scope.pageSize;
          console.log("成功之后");
          console.log( $scope. nowSelectTarget.needShowMore && $scope.moreDataCanBeLoaded)
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      var getCustomerSearchSuccess = function(response){
        hmsPopup.hideLoading();
        $scope.showCrmLoading = false;
        $scope.moreDataCanBeLoaded = response.parent_customer_list.length == $scope.pageSize;
        if(response.returnCode == 'S'){
          $scope.items = response.parent_customer_list;
        }
      };
    //负责人分页查询
      var getEmployeeSuccess = function (response) {
        $scope.showCrmLoading = false;
        console.log("more");
        if(response.returnCode == 'S'){
          for(var i = 0; i < response.employee_list.length; i++){
            response.employee_list[i].showModal = response.employee_list[i].name + ' (' + response.employee_list[i].employeeCode + ')   ' + response.employee_list[i].organizationName;
          }
          $scope.items = $scope.items.concat(response.employee_list);
          $scope.sourceItems = $scope.items.clone();
          $scope.moreDataCanBeLoaded = response.employee_list.length == $scope.pageSize;
        } else {
          $scope.moreDataCanBeLoaded = false;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      var getPrincipalSearchSuccess = function(response){
        $scope.showCrmLoading = false;
        if(response.returnCode == 'S'){
          for(var i = 0; i < response.employee_list.length; i++){
            response.employee_list[i].showModal = response.employee_list[i].name + '(' + response.employee_list[i].employeeCode + ') ' + response.employee_list[i].organizationName;
          }
          $scope.moreDataCanBeLoaded = response.employee_list.length == $scope.pageSize;
          console.log(response.employee_list.length + "：" + $scope.pageSize);
          $scope.items = $scope.items.concat(response.employee_list);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      };
      /*  console.log(upData);*/
      opportunityAddService.getValueList(listInitSuccess, business_value_list);
      var showValueInList = function (code) {
        $scope.showCrmLoading = false;
        var valueObj = getValueObjByCode(code);
        $scope.items = $scope.items.concat(JSON.parse(window.localStorage[valueObj.localList]));
        $scope.sourceItems = $scope.items.clone();
      };
      $scope.items = [];
      $scope.nowSelectTarget = {};

      $scope.moreDataCanBeLoaded = false;

      $scope.sourceItems = [];
      $scope.noDataFlag = false;
      $scope.nowPage = 1;
      $scope.pageSize =15;

      //通用选择弹窗
      $scope.selectTargets = [{
        'key': 'parent_customer',
        'interface': customerService.getParentCustomer,  //获得选择项的接口
        'params': [getParentCustomerSuccess,'',$scope.nowPage,$scope.pageSize],  //获得选择项时接口所需参数
        'showKey': 'fullName',            //选择界面显示的数据
        'dataKey': 'customerId',      //对象内最终操作提交所需的数据变量
        'dataModel': '$scope.data.parentCustomersId',  //最终操作提交所需的数据变量
        'showDataModel': '$scope.showData.fullName', //显示在界面上的ng-model
        'searchInterface' : customerService.getParentCustomer,
        'searchParams' : getCustomerSearchSuccess,
        'needShowMore': true
      }, {
        'key': 'belongs_region',
        'interface': customerService.getSaleArea,
        'params': [getSaleAreaSuccess, 'HCRM_SALE_AREA'],
        'showKey': 'saleAreaName',
        'dataKey': 'saleAreaId',
        'dataModel': '$scope.data.saleAreaId',
        'showDataModel': '$scope.showData.saleAreaName'
      }, {
        'key': 'team',
        'interface': customerService.getSaleTeam,
        'params': [getSaleTeamSuccess,$scope.data.saleAreaId],
        'showKey': 'saleTeamName',
        'dataKey': 'saleTeamId',
        'dataModel': '$scope.data.saleTeamId',
        'showDataModel': '$scope.showData.team'
      }, {
        'key': 'principal',
        'interface': customerService.getEmployee,
        'params': [getEmployeeSuccess,'',$scope.nowPage,$scope.pageSize],
        'showKey': 'showModal',
        'dataKey': 'userId',
        'dataModel': '$scope.data.saleEmployeeId',
        'showDataModel': '$scope.showData.principal',
        'searchInterface' : customerService.getEmployee,
        'searchParams' : getPrincipalSearchSuccess,
        'needShowMore': true
      }, {
        'key': 'ENTERPRISE_NATURE',
        'interface':showValueInList,
        'params': [ 'HCRM.ENTERPRISE_NATURE'],
        'showKey': 'description',
        'dataKey': 'value',
        'dataModel': '$scope.data.enterpriseNature',
        'showDataModel': '$scope.showData.enterpriseNature'
      }, {
        'key': 'major_industry',
        'interface': customerService.getIndustry,
        'params': [getMajorSuccess,0],
        'showKey': 'industryName',
        'dataKey': 'industryId',
        'dataModel': '$scope.data.majorIndustry',
        'showDataModel': '$scope.showData.majorIndustry'
      }, {
        'key': 'sub_industry',
        'interface': customerService.getIndustry,
        'params': [getSubSuccess,$scope.data.majorIndustry],
        'showKey': 'industryName',
        'dataKey': 'industryId',
        'dataModel': '$scope.data.subIndustry',
        'showDataModel': '$scope.showData.subIndustry'
      },{
        'key': 'income_scale',
        'interface': showValueInList,
        'params': ['HCRM.INCOME_SCALE'],
        'showKey': 'description',
        'dataKey': 'value',
        'dataModel': '$scope.data.incomeScale',
        'showDataModel': '$scope.showData.incomeScale'
      },{
        'key' : 'approve',
        'interface' :  initApprove,
        'params' : [],
        'showKey' : 'name',
        'dataKey' : 'approveType',
        'dataModel' : '$scope.data.approveType',
        'showDataModel' : '$scope.showData.approveType'
      },{
        'key' : 'status',
        'interface' :  initDataStatus,
        'params' : [],
        'showKey' : 'name',
        'dataKey' : 'statusType',
        'dataModel' : '$scope.data.dataStatus',
        'showDataModel' : '$scope.showData.dataStatus'
      }];


      $ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal1) {
        $scope.crmSelectModal = modal1;
      });

      $scope.showSelectDiv = function(key){
        $scope.searchModel.searchValueKey = '';
        $scope.nowPage = 1;
        if ($scope.showSelect) {
          $scope.crmSelectModal.hide();
          $scope.showLoading = false;
        } else {
          $scope.crmSelectModal.show();
          $scope.showLoading = true;
        }
        $scope.showSelect = !$scope.showSelect;
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
        if(!$scope.showSelect)
          return ;
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
        if(key == 'sale_team')
          $scope.selectTargets[6].params = [getTeamSuccess, $scope.siftingKey.saleAreaId];
        if($scope.nowSelectTarget.interface != showValueInList && $scope.nowSelectTarget.key != 'year')
          $scope.showLoading = true;
        $scope.nowSelectTarget.interface.apply(null,$scope.nowSelectTarget.params);
      };

      //克隆对象
      function cloneObj(obj){
        function Clone(){}
        Clone.prototype = obj;
        var o = new Clone();
        for(var a in o){
          if(typeof o[a] == "object") {
            o[a] = cloneObj(o[a]);
          }
        }
        return o;
      }


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
        if($scope.nowSelectTarget['key'] == 'belongs_region'){
          $scope.data.saleTeamId = '';
          $scope.showData.team = '';
          $scope.selectTargets[2].params = [getSaleTeamSuccess, $scope.data.saleAreaId];
        }
        if($scope.nowSelectTarget['key'] == 'major_industry'){
          $scope.data.subIndustry = '';
          $scope.showData.subIndustry = '';
          $scope.selectTargets[6].params = [getSubSuccess,$scope.data.majorIndustry];
        }
        $scope.showSelectDiv();
      };

      $scope.loadMore = function() {
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

      function isContains(str, substr) {
        return new RegExp(substr).test(str);
      }

      Array.prototype.clone=function(){
        return [].concat(this);
      };

      $scope.searchModel = {
        searchValueKey: ''
      };


      $scope.searchSelectValue = function(){
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
        if($scope.nowSelectTarget['searchInterface']){
          //需要接口搜索的
          $scope.showLoading = true;
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

      $scope.timeItems = [{
        flag:false,
        text:"是",
        code:'Y'
      },{
        flag:false,
        text:"否",
        code:'N'
      },{
        flag:true,
        text:"不限",
        code:''
      }];

      $scope.selectTime = function(index){
        $scope.timeItems[0].flag = false;
        $scope.timeItems[1].flag = false;
        $scope.timeItems[2].flag = false;
        $scope.timeItems[index].flag = true;
        $scope.data.isListed = $scope.timeItems[index].code;
      };

      $scope.clearSifting = function(){
        $scope.data = {
          parentCustomersId: "",//上级客户
          saleAreaId: "",//所属大区
          saleTeamId: "",//所属团队
          saleEmployeeId: "",//负责人
          enterpriseNature: "",//企业性质
          majorIndustry: "",//所属行业
          subIndustry:"",
          incomeScale: "",//收入规模
          creationDateFrom: '',//创建时间开始
          creationDateTo: '',//创建时间结束
          addressCountry:'',//国家
          addressProvince:'',//省
          addressCity:'',//城市
          addressZone:'',//区
          isListed:'',//是否上市
          page:1,
          pageSize:20,
          sortname:$scope.value.sortname,
          sortorder:$scope.value.sortorder,
          queryType:$scope.value.queryType,
          approveType:'',
          dataStatus:''
        };

        //界面显示的数据
        $scope.showData = {
          fullName: "",//上级客户
          saleAreaName: "",//所属大区
          team: "",//所属团队
          principal: "",//负责人
          enterpriseNature: "",//企业性质
          majorIndustry: "",//所属行业
          subIndustry:"",
          incomeScale: "",//收入规模
          creationDateFrom: '',
          creationDateTo: '',
          address:''
        };
      };

      //var options = {
      //  date: new Date(),
      //  mode: 'date',
      //  titleText: '请选择时间',
      //  okText: '确定',
      //  cancelText: '取消',
      //  doneButtonLabel: '确认',
      //  cancelButtonLabel: '取消',
      //  locale: 'zh_cn',
      //  androidTheme: window.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
      //};
      //
      //$cordovaDatePicker.show(options).then(function (dateNo) {
      //  if (dateNo) {
      //    var year = dateNo.getFullYear();
      //    var month = dateNo.getMonth() + 1;
      //    var date = dateNo.getDate();
      //    $scope.data.creationDateFrom = year + '-' + month + '-' + date;
      //    $scope.showData.creationDateFrom = year + '-' + month + '-' + date;
      //    console.log($scope.data.planDate);
      //
      //    //$scope.showData.week = showTime(dateNo);
      //    //console.log($scope.showData.week);
      //  }
      //  $scope.$apply();
      //});


      $scope.selectDate = function(key){
        eval("ionicDatePicker.openDatePicker(" + key + ")");
      };

      var creationDateFrom = {
        callback: function (val) {
          var selectedDate = new Date(val);
          var dateText = selectedDate.getFullYear() + "-" + ((selectedDate.getMonth() + 1) > 9 ? (selectedDate.getMonth() + 1) : ("0" + (selectedDate.getMonth() + 1))) + "-" + (selectedDate.getDate() > 9 ? selectedDate.getDate() : ("0" + selectedDate.getDate()));
          $scope.showData.creationDateFrom = dateText;
          $scope.data.creationDateFrom = dateText;
        },
        from: new Date(2012, 1, 1),
        to: new Date(2017, 10, 30),
        inputDate: new Date(),
        mondayFirst: true,
        closeOnSelect: false,
        templateType: 'popup'
      };

      var creationDateTo = {
        callback: function (val) {
          var selectedDate = new Date(val);
          var dateText = selectedDate.getFullYear() + "-" + ((selectedDate.getMonth() + 1) > 9 ? (selectedDate.getMonth() + 1) : ("0" + (selectedDate.getMonth() + 1))) + "-" + (selectedDate.getDate() > 9 ? selectedDate.getDate() : ("0" + selectedDate.getDate()));
          $scope.showData.creationDateTo = dateText;
          $scope.data.creationDateTo = dateText;
        },
        from: new Date(2012, 1, 1),
        to: new Date(2017, 10, 30),
        inputDate: new Date(),
        mondayFirst: true,
        closeOnSelect: false,
        templateType: 'popup'
      };


      ///////////////////////城市选择/////////////////////////////
      Array.prototype.clone = function () {
        return [].concat(this);
      };
      $scope.places = [];
      var CHINA_CODE = 1037;
      $scope.selectCity={
        placeKey:""
      };
      //省市历史栈
      $scope.selectedPlaces = [];
      $scope.clearFilter = function () {
        $scope.selectCity.placeKey = '';
        getCountry(0);
        /* $scope.items = $scope.data.clone();*/
      };
      var getCountryObjById = function (id) {
        for (var i = 0; i < $scope.places.length; i++)
          if ($scope.places[i].addressId == id)
            return $scope.places[i];
      };

      var getCountry = function (parentAddressId) {
        $scope.showCrmLoading=true;
        $scope.selectCity.placeKey = '';
        var temp = getCountryObjById(parentAddressId);
        if(!temp)
          temp = {
            "addressId": 1037,
            "addressName": "中国",
            "type": "COUNTRY",
            "parentAddressId": 0
          };
        var baseUrl = baseConfig.basePath;
        var url = baseUrl + "query_address";
        hmsHttp.post(url, {"parentAddressId": parentAddressId}).success(function (data) {
          $scope.showCrmLoading=false;
          $scope.placeData = data.address_list.clone();
          $ionicScrollDelegate.$getByHandle('countryScroll').scrollTop(false);
          if (data.address_list.length == 0) {
            console.log($scope.selectedPlaces);
            $scope.showData.address = "";
            var str = "";
            if ($scope.inChina) {
              for (var i = 0; i < $scope.selectedPlaces.length; i++) {
                str += $scope.selectedPlaces[i].addressName;
                $scope.showData.address = str;
              }
              $scope.data.addressCountry = $scope.selectedPlaces[0].addressId;
              if ($scope.selectedPlaces.length > 2) {
                $scope.data.addressProvince = $scope.selectedPlaces[1].addressId;
                $scope.data.addressCity = $scope.selectedPlaces[2].addressId;
              } else {
                $scope.data.addressProvince = "";
                $scope.data.addressCity = "";
              }

              $scope.data.addressZone = temp.addressId;
            } else {
              $scope.data.addressCountry = temp.addressId;
              $scope.data.addressProvince = "";
              $scope.data.addressCity = "";
              $scope.data.addressZone="";
            }
            $scope.showData.address = $scope.showData.address + temp.addressName;
            console.log($scope.showData.address);
            console.log("last select:" + temp.addressName + ", code is:" + temp.addressId);
            $scope.showCountrySelect();
            return;
          } else {
            if ($scope.inChina && temp != undefined)
              $scope.selectedPlaces.push(temp);
          }
          if(parentAddressId != 0)
            $scope.places = [{addressName: "空", addressId: "-1"}].concat(data.address_list);
          else
            $scope.places = data.address_list;
          /*  console.log( $scope.places);*/
        }).error(function (data, status) {

        });
      };

      $scope.showCountryFlag = false;
      $ionicModal.fromTemplateUrl('build/pages/modals/crmCityModal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal1) {
        $scope.crmCityModal = modal1;
      });
      $scope.showCountrySelect = function () {
        $scope.inChina = true;
        $scope.showCrmLoading=!$scope.showCrmLoading;
        if ($scope.showCountryFlag) {
          $scope.crmCityModal.hide();
        } else {
          $scope.crmCityModal.show();
        }
        $scope.showCountryFlag = !$scope.showCountryFlag;
        if ($scope.showCountrySelect) {
          $scope.selectedPlaces = [];
          getCountry(CHINA_CODE);
        }
      };

      $scope.inChina = true;

      $scope.changeChina = function (flag) {
        $scope.showCrmLoading=true;
        if (flag == $scope.inChina)
          return;
        $scope.selectedPlaces=[];
        $scope.places=[];
        $scope.inChina = flag;
        if ($scope.inChina) {
          getCountry(CHINA_CODE);
        } else {
          getCountry(0);
        }
      };
      $scope.changeChina(true);
      $scope.selectPlace = function ($index) {
        if($scope.places[$index].addressId == -1){
          $scope.showData.address = "";
          var str = "";
          for (var i = 0; i < $scope.selectedPlaces.length; i++) {
            str += $scope.selectedPlaces[i].addressName;
            $scope.showData.address = str;
          }
          $scope.data.addressCountry = $scope.selectedPlaces[0].addressId;
          $scope.data.addressProvince = $scope.selectedPlaces[1] ? $scope.selectedPlaces[1].addressId : "";
          $scope.data.addressCity = $scope.selectedPlaces[2] ? $scope.selectedPlaces[2].addressId : "";
          $scope.showCountrySelect();
          return;
        }
        getCountry($scope.places[$index].addressId);
      };

      $scope.placeBackTo = function ($index) {
        $scope.selectedPlaces = $scope.selectedPlaces.slice(0, $index + 1);
        getCountry($scope.selectedPlaces[$index].addressId);
      };


      $scope.filterCountry = function () {
        if ($scope.selectCity.placeKey == '')
          $scope.places = $scope.placeData.clone();
        else {
          for (var i = 0; i < $scope.placeData.length; i++) {
            if (isContains($scope.placeData[i].addressName, $scope.selectCity.placeKey))
              $scope.places[i] = $scope.placeData[i];
            else
              $scope.places[i] = '';
          }
        }
      }

      $scope.sifting = function(){
        $scope.showLoading = true;
        $scope.data.page = 1;
        $scope.showShift = !$scope.showShift;
        console.log(JSON.stringify($scope.data));
        customerService.queryCustomer(queryCustomerSuccess,error,$scope.data);
        $ionicScrollDelegate.scrollTop(false);
      };
      $scope.sort = function(){
        $scope.data.page = 1;
        $scope.showLoading = true;
        customerService.queryCustomer(queryCustomerSuccess,error,$scope.data);
        $ionicScrollDelegate.scrollTop(false);
      };

      //$rootScope.$on('$ionicView.enter', function (e) {
      //  customerService.queryCustomer(queryCustomerSuccess,error,$scope.data);
      //})

    }])


angular.module('customerModule')
  .service('customerService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function (hmsHttp,
              hmsPopup,
              baseConfig) {

      var baseUrl = baseConfig.basePath;
      var customer = {};
      var isCustomer = true;

      this.queryCustomer = function (success,error,param) {
        var params = param;
        hmsHttp.post(baseUrl + 'query_customer_list', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
          error(response);
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      }

      this.searchCustomer = function (success,param) {
        var params = param;
        hmsHttp.post(baseUrl + 'select_customers', params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      }


      //上级客户查询
      this.getParentCustomer = function (success,fullName,page,pageSize) {
        var params = {
          fullName:fullName,
          page:page,
          pageSize:pageSize

        };
        hmsHttp.post(baseUrl + 'parent_customer', params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };

      //所属大区
      this.getSaleArea = function (success, orgType) {
        var params = {
          orgType: orgType
        };
        hmsHttp.post(baseUrl + 'query_sale_area', params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };

      //所属团队
      this.getSaleTeam = function (success,organizationId) {
        var params = {
          organizationId: organizationId,
          orgType: "HCRM_SALE_TEAM"
        };
        hmsHttp.post(baseUrl + 'query_sale_team', params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };

      //负责人
      this.getEmployee = function (success,keyWord, page, pageSize) {
        var params = {
          keyWord:keyWord,
          page: page,
          pageSize: pageSize
        };
        hmsHttp.post(baseUrl + 'customer_employee', params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };

      //业务负责人
      this.getNormalEmployee = function (success,keyWord, page, pageSize) {
        var params = {
          keyWord:keyWord,
          page: page,
          pageSize: pageSize
        };
        hmsHttp.post(baseUrl + 'query_notSales', params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };

      //个人信息查询
      this.getEmployeeDetail = function (success) {
        var params={};
        hmsHttp.post(baseUrl + 'employee_detail',params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };

      //税号重复检测
      this.validParagraph = function (success,dutyParagraph,customerId) {
        var params={
          dutyParagraph:dutyParagraph,
          customerId:customerId
        };
        hmsHttp.post(baseUrl + 'valid_dutyParagraph',params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };

      //社会统一信用代码重复检测
      this.validCreditCode = function (success,creditCode,customerId) {
        var params={
          creditCode:creditCode,
          customerId:customerId
        };
        hmsHttp.post(baseUrl + 'valid_creditCode',params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
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
          hmsPopup.hideLoading();
        });
      };
      //客户审批提交
      this.submitReview = function (success,customerId) {
        var params={
          customerId:customerId
        };
        hmsHttp.post(baseUrl + 'customer_approve',params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };


      //上传附件的进度管控
     this.processProgress =function (progressEvent, scope, prompt) {
        var progress;
        if (progressEvent.lengthComputable) {
          progress = progressEvent.loaded / progressEvent.total * 100;
          if (progress == 100) {
            //hmsPopup.hidePopup();
          } else {
            hmsPopup.showLoading('上传图片进度为 ' + Math.round(progress) + '%');
          }
        } else {
        }
        if (progress == 100) {
          hmsPopup.showLoading(prompt);
        }
        scope.$apply();
      }

      //将附件上传到腾讯服务器中进行采集或者识别
      this.uploadImage = function (imgPath, success, error) {
        if (baseConfig.debug) {
          //alert('uploadImage.start ');
        }

        var url = baseConfig.queryPath;
        //var options = new FileUploadOptions();
        //options.filekey = "file";
        //options.mimeType = "image/jpeg";
        //options.chunkedMode = false;
        //options.params = 'crm';
        //options.headers = {
        //  Authorization: 'Bearer' + ' ' + window.localStorage.token
        //}
        var options = new FileUploadOptions(
          'file', 'image.jpg', 'image/jpeg', null,
          {"Authorization": "Bearer " + window.localStorage.token}, 'POST');
         console.log('url=='+url,'token=='+window.localStorage.token,'图片URL=='+imgPath);
        var trustAllHosts = true;
        var fileTransfer = new FileTransfer();

        if (baseConfig.debug) {
          alert('uploadImage.start url ' + angular.toJson(url));
          alert('uploadImage.start options ' + angular.toJson(options));
          alert('uploadImage.start imgPath ' + angular.toJson(imgPath));
        }

        hmsPopup.showLoading('提交处理中');

        fileTransfer.upload(
          imgPath,
          encodeURI(url),//上传服务器的接口地址
          success,
          error,
          options
        );
      }

      this.getIsCustomer = function () {
        return isCustomer;
      }
      this.setIsCustomer = function (val) {
        isCustomer = val;
      }
      //return {
      //  setCustomer:function(val){
      //    customer=val;
      //  },
      //  getCustomer:function(){
      //    return customer;
      //  }
      //}


    }])



