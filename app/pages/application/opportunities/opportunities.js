/**
 * Created by ZaraNengap on 2016/10/11.
 */
'use strict';
angular.module('opportunityModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.opportunities', {
          url: '/opportunities',
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/opportunities/opportunities.html',
              controller: 'OpportunitiesCtrl'
            }
          }
        })
    }]);

angular.module('opportunityModule')
  .controller('OpportunitiesCtrl', [
    '$scope',
    'baseConfig',
    '$timeout',
    '$ionicHistory',
    '$state',
    'hmsPopup',
    'opportunityService',
    '$rootScope',
    'ionicDatePicker',
    '$ionicModal',
    '$ionicScrollDelegate',
    '$cordovaDatePicker',
    function($scope,
             baseConfig,
             $timeout,
             $ionicHistory,
             $state,
             hmsPopup,
             opportunityService,
             $rootScope,
             ionicDatePicker,
             $ionicModal,
             $ionicScrollDelegate,
             $cordovaDatePicker) {
      $rootScope.img="";
      $scope.goBack = function(){
        $ionicHistory.goBack();
      };

      $scope.goState = function(url){
        $state.go(url);
      };

      $scope.goSearch = function(){
        $state.go('tab.opportunities-search',{
          data: 'HCRM_OPPORTUNITY'
        });
      };

      $ionicModal.fromTemplateUrl('build/pages/application/opportunities/opportunity-add/opportunity-add.html',{
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal){
        $scope.opportunityAddModel = modal;
      });

      $scope.$on('CLOSE_OPPORTUNITY_ADD',function(){
        $scope.opportunityAddModel.hide();
      });

      $scope.$on('OPPORTUNITY_ADD_SUCCESS',function(){
        $scope.opportunityAddModel.hide();
        $ionicScrollDelegate.$getByHandle('opportunityScroll').scrollTop(false);

        $scope.opportunities = [];
        $scope.siftingKey = {
          opportunityStatus: '',
          saleTeamId: '',
          businessFrom: '',
          saleStage: '',
          page: 1,
          pageSize: 10,
          prjBeginDateFrom: '',
          prjBeginDateTo: '',
          preSignDateFrom: '',
          preSignDateTo: '',
          creationDateFrom: '',
          creationDateTo: '',
          finishYear: '',
          saleEmployeeId:'',
          queryType:$scope.queryType,
          sortname: 'creationDate',
          sortorder: 'desc',
          status:'HCRM_ENABLE'
        };
        $scope.siftingShowData = {
          opportunityStatus:"",
          businessFrom: '',
          saleStage: '',
          saleArea:'',
          saleTeam:'',
          employee:'',
          status: 1
        };
        $scope.lastSelectSortIndex = 5;
        $scope.showHead = false;
        opportunityService.getBoardData(getBoardDataSuccess, $scope.queryType);
        opportunityService.getOpportunities(initOpportunitySuccess,$scope.siftingKey, getMoreDataFailure);
      });

      $scope.showAddOpportunity = function(){
        $ionicScrollDelegate.$getByHandle('slide-img').scrollTop(false);
        $scope.opportunityAddModel.show();
      };

      $scope.goDetail=function(para) {
        $state.go("tab.opportunity-detail",{data:para});
      };

      $scope.showShift = false;
      $scope.showSort = false;
      $scope.showHead = true;

      $scope.onDrag = function($event){
        var deltaY = $event.gesture.deltaY;
        if(Math.abs(deltaY) > 100)
          $scope.showHead = deltaY > 0;
      };

      $scope.showShiftDiv = function(){
        $scope.showShift = !$scope.showShift;
        $scope.showSort = false;
      };

      $scope.showSortDiv = function(){
        $scope.showSort = !$scope.showSort;
        $scope.showShift = false;
      };

      $scope.boardItemSelected = [true];
      $scope.selectBoardItem = function(index){
        $scope.boardItemSelected = [];
        $scope.boardItemSelected[index] = true;
        if(index == 0){
          $scope.siftingKey.opportunityStatus = '';
        } else if(index == 1){
          $scope.siftingKey.opportunityStatus = 'HCRM_HOT_CHANCE';
        } else if(index == 2){
          $scope.siftingKey.opportunityStatus = 'HCRM_PROBABLY_WIN';
        } else if(index == 3){
          $scope.siftingKey.opportunityStatus = 'HCRM_WIN_CONFIRMED';
        }
        $scope.showLoading = true;
        $scope.moreOpportunityCanBeLoaded = false;
        $scope.siftingKey.page = 1;
        $scope.siftingKey.pageSize = 10;
        opportunityService.getOpportunities(initOpportunitySuccess,$scope.siftingKey, getMoreDataFailure);
      };

      $scope.dragHideSort = function($event){
        if($event.gesture.deltaY > 0)
          $scope.showSort = false;
      };

      ////////接口数据相关////////

      var getMoreDataFailure = function(){
        $scope.moreOpportunityCanBeLoaded = false;
      };

      $scope.myOpportunityFlag = false;

      $scope.queryType = $scope.myOpportunityFlag ? 'MY_OPPORTUNITY' : 'ALL_OPPORTUNITY';

      $scope.opportunities = [];
      $scope.siftingKey = {
        opportunityStatus: '',
        saleTeamId: '',
        businessFrom: '',
        saleStage: '',
        page: 1,
        pageSize: 10,
        prjBeginDateFrom: '',
        prjBeginDateTo: '',
        preSignDateFrom: '',
        preSignDateTo: '',
        creationDateFrom: '',
        creationDateTo: '',
        finishYear: '',
        saleEmployeeId:'',
        queryType:$scope.queryType,
        sortname: 'creationDate',
        sortorder: 'desc',
        status:'HCRM_ENABLE'
      };


      //定义字符串包含函数
      function isContains(str, substr) {
        return new RegExp(substr).test(str);
      }

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

      Array.prototype.clone=function(){
        return [].concat(this);
      };

      $scope.changeModel = function(flag){
        if(flag == $scope.myOpportunityFlag)
          return 0;
        else{
          $scope.myOpportunityFlag = flag;
          $scope.queryType = $scope.myOpportunityFlag ? 'MY_OPPORTUNITY' : 'ALL_OPPORTUNITY';
          $scope.siftingKey = {
            opportunityStatus: '',
            saleAreaId: '',
            saleTeamId: '',
            businessFrom: '',
            saleStage: '',
            page: 1,
            pageSize: 10,
            prjBeginDateFrom: '',
            prjBeginDateTo: '',
            preSignDateFrom: '',
            preSignDateTo: '',
            creationDateFrom: '',
            creationDateTo: '',
            queryType:$scope.queryType,
            finishYear: '',
            saleEmployeeId:'',
            sortname: 'creationDate',
            sortorder: 'desc',
            status:'HCRM_ENABLE'

          };
          $scope.siftingShowData = {
            opportunityStatus:"",
            businessFrom: '',
            saleStage: '',
            saleArea:'',
            saleTeam:'',
            employee:'',
            status:1
          };
          $scope.showLoading = true;
          $scope.lastSelectSortIndex = 5;
          opportunityService.getOpportunities(initOpportunitySuccess,$scope.siftingKey, getMoreDataFailure);
          opportunityService.getBoardData(getBoardDataSuccess, $scope.queryType);
        }
      };

      $rootScope.$on('REFRESH_OPPORTUNITY',function(){
        $scope.moreOpportunityCanBeLoaded = false;
        $scope.siftingKey.page = 1;
        $scope.siftingKey.pageSize = 10;
        opportunityService.getOpportunities(initOpportunitySuccess,$scope.siftingKey, getMoreDataFailure);
        opportunityService.getBoardData(getBoardDataSuccess, $scope.queryType);
      });

      $scope.showLoading = true;

      var initOpportunitySuccess = function(response){
        $scope.showLoading = false;
        $scope.opportunities = [];
        $ionicScrollDelegate.$getByHandle('opportunityScroll').scrollTop(false);
        if(response.returnCode == "S"){
          $scope.opportunities = response.opportunity_list;
          $timeout(function(){
            $scope.moreOpportunityCanBeLoaded = response.opportunity_list.length == $scope.siftingKey.pageSize;
          }, 500);
        } else {
          if(response.returnCode == "E" && response.returnMsg != '')
            hmsPopup.showShortCenterToast('获取负责人失败，请联系管理员');
        }
      };

      var getBoardDataSuccess = function(response){
        if(response.returnCode == "S"){
          $scope.boardData = {
            hotOppCount: response.hotOppCount,
            winOppCount: response.winOppCount,
            larOppCount: response.larOppCount,
            hotMoney: parseInt(response.opportunity_money.hotMoney),
            winMoney: parseInt(response.opportunity_money.winMoney),
            larMoney: parseInt(response.opportunity_money.larMoney)
          };
        } else {
          hmsPopup.showShortCenterToast('看板数据获取失败，请联系管理员');
        }
      };

      opportunityService.getBoardData(getBoardDataSuccess, $scope.queryType);

      $scope.getMoneyString = function(money){
        if(!money)
          return '';
        if(money > 100000000)
          return (money/100000000).toFixed(1) + '亿';
        else if(money > 10000)
          return (money/10000).toFixed(1) + '万';
        else
          return money.toFixed(2);
      };

      $scope.sortList = [{
        flag: 'asc',
        name: 'opportunityName',
        text: '商机名称',
        icon: 'icon_sign@3x'
      }, {
        flag: 'asc',
        name: 'opportunityStatusName',
        text: '商机状态',
        icon: 'icon_share@3x'
      },{
        flag: 'asc',
        name: 'saleEmployeeName',
        text: '负责人',
        icon: 'icon_bottom4_selected@3x'
      },{
        flag: 'desc',
        name: 'preMoney',
        text: '预计收入最高',
        icon: 'icon_business_selected@3x'
      },{
        flag: 'asc',
        name: 'preMoney',
        text: '预计收入最低',
        icon: 'icon_business_selected@3x'
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
      }];

      $scope.lastSelectSortIndex = 5;

      $scope.selectSort = function(index){
        $scope.siftingKey.sortname = $scope.sortList[index].name;
        $scope.siftingKey.sortorder = $scope.sortList[index].flag;
        $scope.lastSelectSortIndex = index;
        $scope.sort();
      };

      opportunityService.getOpportunities(initOpportunitySuccess,$scope.siftingKey, getMoreDataFailure);

      $scope.sifting = function(){
        $scope.showShift = !$scope.showShift;
        $scope.siftingKey.page = 1;
        $scope.showLoading = true;
        opportunityService.getOpportunities(initOpportunitySuccess,$scope.siftingKey, getMoreDataFailure);
      };

      $scope.sort = function(){
        $scope.siftingKey.page = 1;
        $scope.showLoading = true;
        opportunityService.getOpportunities(initOpportunitySuccess,$scope.siftingKey, getMoreDataFailure);
      };

      $scope.items = [];
      $scope.nowSelectTarget = {};

      $scope.siftingShowData = {
        opportunityStatus:"",
        businessFrom: '',
        saleStage: '',
        saleArea:'',
        saleTeam:'',
        employee:'',
        status: 1
      };

      var opportunity_value_list=[
        {
          code: "HCRM.OPPORTUNITY_SALE_STAGE",
          lastUpdateDate: "OPPORTUNITY_SALE_STAGE_DATE",
          localList : 'OPPORTUNITY_SALE_STAGE'
        }
      ];

      $scope.selectStatus = function(flag){
        $scope.siftingShowData.status = flag;
        $scope.siftingKey.status = flag == 0 ? "" : (flag == 1 ? "HCRM_ENABLE" : "HCRM_DISABLE");
      };

      var getValueObjByCode = function(code){
        for(var i = 0; i < opportunity_value_list.length; i++){
          if(code == opportunity_value_list[i].code)
            return opportunity_value_list[i];
        }
      };

      var getBusinessFromSuccess = function(response){
        $scope.showLoading = false;
        if(response.returnCode == 'S')
          $scope.items = $scope.items.concat(response.business_from_list);
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

      var getOpportunitySuccess = function(response){
        $scope.showLoading = false;
        if(response.returnCode == 'S') {
          $scope.items = $scope.items.concat(response.opportunity_status);
        }
      };

      var getCustomerEmployeeSuccess = function(response){
        $scope.showLoading = false;
        console.log(response);
        if(response.returnCode == 'S'){
          for(var i = 0; i < response.employee_list.length; i++){
            response.employee_list[i].showModal = response.employee_list[i].name + '(' + response.employee_list[i].employeeCode + ') ';
          }
          $scope.moreDataCanBeLoaded = response.employee_list.length == $scope.pageSize;
          $scope.items = $scope.items.concat(response.employee_list);
          $scope.sourceItems = $scope.items.clone();
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      };

      var getCustomerEmployeeResultSuccess = function(response){
        $scope.showLoading = false;
        if(response.returnCode == 'S'){
          for(var i = 0; i < response.employee_list.length; i++){
            response.employee_list[i].showModal = response.employee_list[i].name + '(' + response.employee_list[i].employeeCode + ') ';
          }
          $scope.moreDataCanBeLoaded = response.employee_list.length == $scope.pageSize;
          console.log(response.employee_list.length + "：" + $scope.pageSize);
          $scope.items = $scope.items.concat(response.employee_list);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      };

      var showValueInList = function(code){
        var valueObj = getValueObjByCode(code);
        $scope.items = $scope.items.concat(JSON.parse(window.localStorage[valueObj.localList]));
        $scope.sourceItems = $scope.items.clone();
      };

      var initYear = function(){
        $scope.items = [];
        for(var i = 1989; i <= 2120; i++){
          $scope.items.push({year: i});
        }
        var date = new Date();
        var thisYear = date.getFullYear();
        var deltaY = (thisYear - 1989 - 5) * 50;
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTo(0,deltaY);
      };

      var getAreaSuccess= function(response){
        $scope.showLoading = false;
        if(response.returnCode == "S"){
          $scope.items = $scope.items.concat(response.sale_area_list);
          $scope.sourceItems = $scope.items.clone();
        }
      };

      var getTeamSuccess= function(response){
        $scope.showLoading = false;
        if(response.returnCode == "S"){
          $scope.items = $scope.items.concat(response.sale_team_list);
          $scope.sourceItems = $scope.items.clone();
        }
      };

      //根据时间戳刷新页面值列表
      opportunityService.getValueList(getValueListSuccess, opportunity_value_list);

      $scope.items = [];
      $scope.nowSelectTarget = {};

      $scope.moreDataCanBeLoaded = false;

      $scope.sourceItems = [];
      $scope.noDataFlag = false;

      $scope.nowPage = 1;
      $scope.pageSize = 15;

      //通用选择弹窗
      $scope.selectTargets = [{
        'key' : 'business_from',
        'interface' :  opportunityService.getBusinessFrom,
        'params' : [getBusinessFromSuccess, 'HCRM_BUSIFROM_CATE_1', 'HCRM.BUSINESS_FROM_CATEGORY'],
        'showKey' : 'businessFromName',
        'dataKey' : 'businessFrom',
        'dataModel' : '$scope.siftingKey.businessFrom',
        'showDataModel' : '$scope.siftingShowData.businessFrom'
      },{
        'key' : 'opportunity_status',
        'interface' :  opportunityService.getOpportunityStatus,
        'params' : [getOpportunitySuccess, 'HCRM_OPPORTUNITY'],
        'showKey' : 'opportunityTypeName',
        'dataKey' : 'opportunityType',
        'dataModel' : '$scope.siftingKey.opportunityStatus',
        'showDataModel' : '$scope.siftingShowData.opportunityStatus'
      },{
        'key' : 'opportunity_sale_stage',
        'interface' :  showValueInList,
        'params' : ['HCRM.OPPORTUNITY_SALE_STAGE'],
        'showKey' : 'description',
        'dataKey' : 'value',
        'dataModel' : '$scope.siftingKey.saleStage',
        'showDataModel' : '$scope.siftingShowData.saleStage'
      },{
        'key' : 'year',
        'interface' :  initYear,
        'params' : [],
        'showKey' : 'year',
        'dataKey' : 'year',
        'dataModel' : '$scope.siftingKey.finishYear',
        'showDataModel' : '$scope.siftingKey.finishYear'
      },{
        'key' : 'customer_employee',
        'interface' :  opportunityService.getCustomerEmployee,
        'params' : [getCustomerEmployeeSuccess, $scope.nowPage, $scope.pageSize],
        'showKey' : 'showModal',
        'dataKey' : 'userId',
        'dataModel' : '$scope.siftingKey.saleEmployeeId',
        'showDataModel' : '$scope.siftingShowData.employee',
        'searchInterface' : opportunityService.searchCustomerEmployee,
        'searchParams' : getCustomerEmployeeResultSuccess,
        'needShowMore' : true
      },{
        'key' : 'sale_area',
        'interface' :  opportunityService.getSaleArea,
        'params' : [getAreaSuccess],
        'showKey' : 'saleAreaName',
        'dataKey' : 'saleAreaId',
        'dataModel' : '$scope.siftingKey.saleAreaId',
        'showDataModel' : '$scope.siftingShowData.saleArea'
      },{
        'key' : 'sale_team',
        'interface' :  opportunityService.getSaleTeam,
        'params' : [getTeamSuccess, $scope.siftingKey.saleAreaId],
        'showKey' : 'saleTeamName',
        'dataKey' : 'saleTeamId',
        'dataModel' : '$scope.siftingKey.saleTeamId',
        'showDataModel' : '$scope.siftingShowData.saleTeam'
      }];

      $ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal) {
        $scope.crmSelectModal = modal;
      });

      $scope.showSelectDiv = function(key){
        $scope.searchModel.searchValueKey = '';
        $scope.nowPage = 1;
        if ($scope.showSelect) {
          $scope.crmSelectModal.hide();
        } else {
          $scope.crmSelectModal.show();
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
        if($scope.nowSelectTarget['key'] == 'sale_area'){
          $scope.siftingKey.saleTeamId = '';
          $scope.siftingShowData.saleTeam = '';
          $scope.selectTargets[6].params = [getTeamSuccess, $scope.siftingKey.saleAreaId];
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

      $scope.clearSifting = function(){
        $scope.siftingShowData = {
          opportunityStatus:"",
          businessFrom: '',
          saleStage: '',
          saleArea:'',
          saleTeam:'',
          employee:'',
          status:1
        };
        var sortname = $scope.siftingKey.sortname;
        var sortorder = $scope.siftingKey.sortorder;
        $scope.siftingKey = {
          opportunityStatus: '',
          saleAreaId:'',
          saleTeamId: '',
          businessFrom: '',
          saleStage: '',
          page: 1,
          pageSize: 15,
          prjBeginDateFrom: '',
          prjBeginDateTo: '',
          preSignDateFrom: '',
          preSignDateTo: '',
          creationDateFrom: '',
          creationDateTo: '',
          queryType:$scope.queryType,
          finishYear: '',
          saleEmployeeId:'',
          sortname: sortname,
          sortorder: sortorder,
          status:'HCRM_ENABLE'
        };
      };

      $scope.clearSort = function(){
        $scope.siftingKey.sortname = '';
        $scope.siftingKey.sortorder = '';
        $scope.sort();
        if($scope.lastSelectSortIndex == -1)
            return;
        $scope.lastSelectSortIndex = -1;
      };

      $scope.selectDate = function(key){
        if (ionic.Platform.isWebView()) {
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

          if(key == 'prjBeginDateFrom'){
            $cordovaDatePicker.show(options).then(function (dateNo) {
              if (dateNo) {
                var year = dateNo.getFullYear();
                var month = dateNo.getMonth() + 1;
                var date = dateNo.getDate();
                $scope.siftingKey.prjBeginDateFrom = year + '-' + month + '-' + date;
                console.log($scope.siftingKey.prjBeginDateFrom);
              }
              $scope.$apply();
            });
          } else if(key == 'prjBeginDateTo'){
            $cordovaDatePicker.show(options).then(function (dateNo) {
              if (dateNo) {
                var year = dateNo.getFullYear();
                var month = dateNo.getMonth() + 1;
                var date = dateNo.getDate();
                $scope.siftingKey.prjBeginDateTo = year + '-' + month + '-' + date;
                console.log($scope.siftingKey.prjBeginDateTo);
              }
              $scope.$apply();
            });
          }else if(key == 'preSignDateFrom'){
            $cordovaDatePicker.show(options).then(function (dateNo) {
              if (dateNo) {
                var year = dateNo.getFullYear();
                var month = dateNo.getMonth() + 1;
                var date = dateNo.getDate();
                $scope.siftingKey.preSignDateFrom = year + '-' + month + '-' + date;
                console.log($scope.siftingKey.preSignDateFrom);
              }
              $scope.$apply();
            });
          }else if(key == 'preSignDateTo'){
            $cordovaDatePicker.show(options).then(function (dateNo) {
              if (dateNo) {
                var year = dateNo.getFullYear();
                var month = dateNo.getMonth() + 1;
                var date = dateNo.getDate();
                $scope.siftingKey.preSignDateTo = year + '-' + month + '-' + date;
                console.log($scope.siftingKey.preSignDateTo);
              }
              $scope.$apply();
            });
          }else if(key == 'creationDateFrom'){
            $cordovaDatePicker.show(options).then(function (dateNo) {
              if (dateNo) {
                var year = dateNo.getFullYear();
                var month = dateNo.getMonth() + 1;
                var date = dateNo.getDate();
                $scope.siftingKey.creationDateFrom = year + '-' + month + '-' + date;
                console.log($scope.siftingKey.creationDateFrom);
              }
              $scope.$apply();
            });
          }else if(key == 'creationDateTo'){
            $cordovaDatePicker.show(options).then(function (dateNo) {
              if (dateNo) {
                var year = dateNo.getFullYear();
                var month = dateNo.getMonth() + 1;
                var date = dateNo.getDate();
                $scope.siftingKey.creationDateTo = year + '-' + month + '-' + date;
                console.log($scope.siftingKey.creationDateTo);
              }
              $scope.$apply();
            });
          }
        }else{
          eval("ionicDatePicker.openDatePicker(" + key + ")");
        }
      };

      $scope.searchModel = {
        searchValueKey: ''
      };

      var prjBeginDateFrom = {
        callback: function (val) {
          var selectedDate = new Date(val);
          var dateText = selectedDate.getFullYear() + "-" + ((selectedDate.getMonth() + 1) > 9 ? (selectedDate.getMonth() + 1) : ("0" + (selectedDate.getMonth() + 1))) + "-" + (selectedDate.getDate() > 9 ? selectedDate.getDate() : ("0" + selectedDate.getDate()));
          $scope.siftingKey.prjBeginDateFrom = dateText;
        },
        from: new Date(2012, 1, 1),
        to: new Date(2017, 10, 30),
        inputDate: new Date(),
        mondayFirst: true,
        closeOnSelect: false,
        templateType: 'popup'
      };

      var prjBeginDateTo = {
        callback: function (val) {
          var selectedDate = new Date(val);
          var dateText = selectedDate.getFullYear() + "-" + ((selectedDate.getMonth() + 1) > 9 ? (selectedDate.getMonth() + 1) : ("0" + (selectedDate.getMonth() + 1))) + "-" + (selectedDate.getDate() > 9 ? selectedDate.getDate() : ("0" + selectedDate.getDate()));
          $scope.siftingKey.prjBeginDateTo = dateText;
        },
        from: new Date(2012, 1, 1),
        to: new Date(2017, 10, 30),
        inputDate: new Date(),
        mondayFirst: true,
        closeOnSelect: false,
        templateType: 'popup'
      };

      var preSignDateFrom = {
        callback: function (val) {
          var selectedDate = new Date(val);
          var dateText = selectedDate.getFullYear() + "-" + ((selectedDate.getMonth() + 1) > 9 ? (selectedDate.getMonth() + 1) : ("0" + (selectedDate.getMonth() + 1))) + "-" + (selectedDate.getDate() > 9 ? selectedDate.getDate() : ("0" + selectedDate.getDate()));
          $scope.siftingKey.preSignDateFrom = dateText;
        },
        from: new Date(2012, 1, 1),
        to: new Date(2017, 10, 30),
        inputDate: new Date(),
        mondayFirst: true,
        closeOnSelect: false,
        templateType: 'popup'
      };

      var preSignDateTo = {
        callback: function (val) {
          var selectedDate = new Date(val);
          var dateText = selectedDate.getFullYear() + "-" + ((selectedDate.getMonth() + 1) > 9 ? (selectedDate.getMonth() + 1) : ("0" + (selectedDate.getMonth() + 1))) + "-" + (selectedDate.getDate() > 9 ? selectedDate.getDate() : ("0" + selectedDate.getDate()));
          $scope.siftingKey.preSignDateTo = dateText;
        },
        from: new Date(2012, 1, 1),
        to: new Date(2017, 10, 30),
        inputDate: new Date(),
        mondayFirst: true,
        closeOnSelect: false,
        templateType: 'popup'
      };

      var creationDateFrom = {
        callback: function (val) {
          var selectedDate = new Date(val);
          var dateText = selectedDate.getFullYear() + "-" + ((selectedDate.getMonth() + 1) > 9 ? (selectedDate.getMonth() + 1) : ("0" + (selectedDate.getMonth() + 1))) + "-" + (selectedDate.getDate() > 9 ? selectedDate.getDate() : ("0" + selectedDate.getDate()));
          $scope.siftingKey.creationDateFrom = dateText;
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
          $scope.siftingKey.creationDateTo = dateText;
        },
        from: new Date(2012, 1, 1),
        to: new Date(2017, 10, 30),
        inputDate: new Date(),
        mondayFirst: true,
        closeOnSelect: false,
        templateType: 'popup'
      };

      $scope.doRefresh = function(){
        $scope.moreOpportunityCanBeLoaded = false;
        $scope.siftingKey.page = 1;
        $scope.siftingKey.pageSize = 10;
        opportunityService.getOpportunities(initOpportunitySuccess,$scope.siftingKey, getMoreDataFailure);
        $scope.$broadcast('scroll.refreshComplete');
      };

      var getMoreOpportunitiesSuccess = function(response){
        if(response.returnCode == "S"){
          $scope.opportunities = $scope.opportunities.concat(response.opportunity_list);
          $scope.moreOpportunityCanBeLoaded = (response.opportunity_list.length % $scope.siftingKey.pageSize == 0) && (response.opportunity_list.length != 0);
        } else {
          $scope.moreOpportunityCanBeLoaded = false;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      $scope.loadMoreOpportunity = function() {
        console.log('loadMore');
        $scope.siftingKey.page++;
        opportunityService.getOpportunities(getMoreOpportunitiesSuccess,$scope.siftingKey, getMoreDataFailure);
      };

    }]);

angular.module('opportunityModule')
.service('opportunityService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    '$http',
    function(hmsHttp,
             hmsPopup,
             baseConfig,
             $http) {

      var baseUrl = baseConfig.basePath;

      this.getOpportunities = function(success, key, failure) {
        hmsHttp.post(baseUrl + 'query_opportunity_list', key).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showShortCenterToast('获取商机失败，请联系管理员');
          hmsPopup.hideLoading();
          failure();
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
          hmsPopup.hideLoading();
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
          hmsPopup.showShortCenterToast('获取商机来源失败，请联系管理员');
          hmsPopup.hideLoading();
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
          hmsPopup.showShortCenterToast('获取区域失败，请联系管理员');
          hmsPopup.hideLoading();
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
          hmsPopup.showShortCenterToast('获取团队失败，请联系管理员');
          hmsPopup.hideLoading();
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
          hmsPopup.showShortCenterToast('获取商机状态失败，请联系管理员');
          hmsPopup.hideLoading();
        });
      };

      //得到负责人
      this.getCustomerEmployee = function(success, page, pageSize){
        var params = {
          page: page,
          pageSize: pageSize
        };
        hmsHttp.post(baseUrl + 'customer_employee', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showShortCenterToast('获取负责人失败，请联系管理员');
          hmsPopup.hideLoading();
        });
      };

      //搜索负责人
      this.searchCustomerEmployee = function(success, KeyWord, page, pageSize){
        var params = {
          keyWord: KeyWord,
          page: page,
          pageSize: pageSize
        };
        hmsHttp.post(baseUrl + 'customer_employee', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showShortCenterToast('获取负责人失败，请联系管理员');
          hmsPopup.hideLoading();
        });
      };

      //得到看板数据
      this.getBoardData = function(success, type){
        var params = {
          type: type,
          theYear: (new Date()).getFullYear()
        };
        hmsHttp.post(baseUrl + 'opportunity_performance', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showShortCenterToast('获取看板数据失败，请联系管理员');
          hmsPopup.hideLoading();
        });
      };
  }
]);
