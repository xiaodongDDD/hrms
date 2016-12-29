/**
 * Created by zaranengap on 2016/12/10.
 */
angular.module('clueModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.clues', {
          url: '/clues',
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/clue/clues.html',
              controller: 'CluesCtrl'
            }
          }
        })
    }]);

angular.module('clueModule')
  .controller('CluesCtrl', [
    '$scope',
    'baseConfig',
    '$ionicHistory',
    '$state',
    'hmsPopup',
    '$timeout',
    '$rootScope',
    'ionicDatePicker',
    '$ionicModal',
    '$ionicScrollDelegate',
    'clueService',
    'opportunityService',
    function($scope,
             baseConfig,
             $ionicHistory,
             $state,
             hmsPopup,
             $timeout,
             $rootScope,
             ionicDatePicker,
             $ionicModal,
             $ionicScrollDelegate,
             clueService,
             opportunityService) {

      $scope.goBack = function(){
        $ionicHistory.goBack();
      };

      $scope.goState = function(url){
        $state.go(url);
      };

      $scope.goSearch = function(){
        $state.go('tab.opportunities-search',{
          data:'HCRM_CLUE'
        });
      };

      $scope.goDetail = function(id){
        window.localStorage.clueId = id;
        $state.go('tab.clue-detail',{
          data : id
        })
      };

      $ionicModal.fromTemplateUrl('build/pages/application/clue/clue-add/clue-add.html',{
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal){
        $scope.clueAddModel = modal;
      });

      $scope.$on('CLOSE_CLUE_ADD',function(){
        $scope.clueAddModel.hide();
      });

      $scope.showAddClue = function(){
        $scope.clueAddModel.show();
      };

      $scope.myClueFlag = false;

      $scope.changeModel = function(flag){
        if(flag == $scope.myClueFlag)
          return ;
        $scope.myClueFlag = flag;
        $scope.siftingKey = {
          "page":1,
          "pageSize":10,
          "queryType":"",
          "opportunityStatus":"",
          "saleAreaId":"",
          "saleTeamId":"",
          "theYear":"",
          "businessFrom":"",
          "saleStage":"",
          "prjBeginDateFrom":"",
          "prjBeginDateTo":"",
          "preSignDateFrom":"",
          "preSignDateTo":"",
          "creationDateFrom":"",
          "creationDateTo":"",
          "sortname": "creationDate",
          "sortorder": "desc",
          "status":"HCRM_ENABLE"
        };
        $scope.lastSelectSortIndex = 3;
        $scope.showLoading = true;
        $scope.clues = [];
        $scope.siftingKey.queryType = flag ? "MY_CLUE" : "ALL_CLUE";
        clueService.getClues(getCluesSuccess, $scope.siftingKey, failure);
      };

      $scope.clues = [];

      $scope.siftingKey = {
        "page":1,
        "pageSize":10,
        "queryType":"ALL_CLUE",
        "opportunityStatus":"",
        "saleAreaId":"",
        "saleTeamId":"",
        "theYear":"",
        "businessFrom":"",
        "saleStage":"",
        "prjBeginDateFrom":"",
        "prjBeginDateTo":"",
        "preSignDateFrom":"",
        "preSignDateTo":"",
        "creationDateFrom":"",
        "creationDateTo":"",
        "sortname": "creationDate",
        "sortorder": "desc",
        "status":"HCRM_ENABLE"
      };

      $scope.selectStatus = function(flag){
        $scope.siftingShowData.status = flag;
        $scope.siftingKey.status = flag == 0 ? "" : (flag == 1 ? "HCRM_ENABLE" : "HCRM_DISABLE");
      };

      $scope.showLoading = true;

      $rootScope.$on('REFRESH_CLUE',function(){
        $scope.doRefresh();
      });

      var failure = function(response){
        $scope.showLoading = false;
        hmsPopup.showShortCenterToast(response);
        $scope.moreClueCanBeLoaded = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      var getCluesSuccess = function(response){
        $ionicScrollDelegate.$getByHandle('clueScroll').scrollTop(false);
        $scope.showLoading = false;
        $scope.clues = [];
        if(response.returnCode == "S"){
          $scope.clues = response.clue_list;
          $timeout(function(){
            $scope.moreClueCanBeLoaded = response.clue_list.length == $scope.siftingKey.pageSize;
          }, 500)
        } else {
          if(response.returnMsg)
            hmsPopup.showShortCenterToast(response.returnMsg);
          else
            hmsPopup.showShortCenterToast('获取失败，请检查网络或联系管理员');
        }
      };

      clueService.getClues(getCluesSuccess, $scope.siftingKey, failure);

      $scope.doRefresh = function(){
        $scope.moreClueCanBeLoaded = false;
        $scope.siftingKey.page = 1;
        $scope.siftingKey.pageSize = 10;
        clueService.getClues(getCluesSuccess, $scope.siftingKey, failure);
        $scope.$broadcast('scroll.refreshComplete');
      };

      $scope.moreClueCanBeLoaded = false;

      var getMoreCluesSuccess = function(response){
        if(response.returnCode == "S"){
          $scope.clues = $scope.clues.concat(response.clue_list);
          $scope.moreClueCanBeLoaded = (response.clue_list.length % $scope.siftingKey.pageSize == 0) && (response.clue_list.length != 0);
        } else {
          $scope.moreClueCanBeLoaded = false;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      $scope.loadMoreClue = function() {
        $scope.siftingKey.page++;
        clueService.getClues(getMoreCluesSuccess,$scope.siftingKey, failure);
      };

      $scope.showBottonButton = true;

      $scope.onDrag = function($event){
        $scope.showBottonButton = $event.gesture.deltaY > 0;
      };

      $scope.sortList = [{
        flag: 'asc',
        name: 'opportunityName',
        text: '线索名称',
        icon: 'icon_sign@3x'
      }, {
        flag: 'asc',
        name: 'opportunityStatusName',
        text: '线索状态',
        icon: 'icon_share@3x'
      },{
        flag: 'asc',
        name: 'saleEmployeeName',
        text: '负责人',
        icon: 'icon_bottom4_selected@3x'
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

      $scope.lastSelectSortIndex = 3;

      $scope.showSort = false;

      $scope.showSortDiv = function(){
        $scope.showSort = !$scope.showSort;
        $scope.showSifting = false;
      };

      $scope.selectSort = function(index){
        $scope.siftingKey.sortname = $scope.sortList[index].name;
        $scope.siftingKey.sortorder = $scope.sortList[index].flag;
        $scope.lastSelectSortIndex = index;
        $scope.sort();
      };

      $scope.sort = function(){
        $scope.siftingKey.page = 1;
        $scope.showLoading = true;
        clueService.getClues(getCluesSuccess,$scope.siftingKey, failure);
      };

      ////////////////筛选///////////////

      $scope.siftingShowData = {
        opportunityStatus:"",
        businessFrom: '',
        saleArea:'',
        saleTeam:'',
        employee:'',
        status:1
      };

      $scope.clearSifting = function(){
        $scope.siftingShowData = {
          opportunityStatus:"",
          businessFrom: '',
          saleArea:'',
          saleTeam:'',
          employee:'',
          status:1
        };
        var sortname = $scope.siftingKey.sortname;
        var sortorder = $scope.siftingKey.sortorder;
        $scope.siftingKey = {
          "page":1,
          "pageSize":10,
          "queryType":"ALL_CLUE",
          "opportunityStatus":"",
          "saleAreaId":"",
          "saleTeamId":"",
          "theYear":"",
          "businessFrom":"",
          "saleStage":"",
          "prjBeginDateFrom":"",
          "prjBeginDateTo":"",
          "preSignDateFrom":"",
          "preSignDateTo":"",
          "creationDateFrom":"",
          "creationDateTo":"",
          "sortname": sortname,
          "sortorder": sortorder,
          "status":"HCRM_ENABLE"
        };
      };

      $scope.showSiftingDiv = function(){
        $scope.showSifting = !$scope.showSifting;
        $scope.showSort = false;
      };

      $scope.selectDate = function(key){
        eval("ionicDatePicker.openDatePicker(" + key + ")");
      };

      $scope.sifting = function(){
        $scope.showSifting = !$scope.showSifting;
        $scope.siftingKey.page = 1;
        $scope.showLoading = true;
        clueService.getClues(getCluesSuccess,$scope.siftingKey, failure);
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

      //////////////////////该死的值列表///////////////////////

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

      $scope.items = [];
      $scope.nowSelectTarget = {};

      $scope.moreDataCanBeLoaded = false;

      $scope.sourceItems = [];
      $scope.noDataFlag = false;

      $scope.nowPage = 1;
      $scope.pageSize = 10;

      $scope.searchModel = {
        searchValueKey: ''
      };

      var getBusinessFromSuccess = function(response){
        $scope.showLoading = false;
        if(response.returnCode == 'S')
          $scope.items = $scope.items.concat(response.business_from_list);
      };

      var getCustomerEmployeeSuccess = function(response){
        $scope.showLoading = false;
        if(response.returnCode == 'S'){
          $scope.moreDataCanBeLoaded = response.employee_list.length == $scope.pageSize;
          $scope.items = $scope.items.concat(response.employee_list);
          $scope.sourceItems = $scope.items.clone();
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      };

      var getCustomerEmployeeResultSuccess = function(response){
        $scope.showLoading = false;
        if(response.returnCode == 'S'){
          $scope.moreDataCanBeLoaded = response.employee_list.length == $scope.pageSize;
          $scope.items = $scope.items.concat(response.employee_list);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
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

      var getOpportunitySuccess = function(response){
        $scope.showLoading = false;
        if(response.returnCode == 'S') {
          $scope.items = $scope.items.concat(response.opportunity_status);
        }
      };

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
        'key' : 'customer_employee',
        'interface' :  opportunityService.getCustomerEmployee,
        'params' : [getCustomerEmployeeSuccess, $scope.nowPage, $scope.pageSize],
        'showKey' : 'name',
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
      },{
        'key' : 'opportunity_status',
          'interface' :  opportunityService.getOpportunityStatus,
          'params' : [getOpportunitySuccess, 'HCRM_CLUE'],
          'showKey' : 'opportunityTypeName',
          'dataKey' : 'opportunityType',
          'dataModel' : '$scope.siftingKey.opportunityStatus',
          'showDataModel' : '$scope.siftingShowData.opportunityStatus'
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
          $scope.selectTargets[3].params = [getTeamSuccess, $scope.siftingKey.saleAreaId];
        if($scope.nowSelectTarget.key != 'year')
          $scope.showLoading = true;
        console.log($scope.nowSelectTarget);
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
          $scope.selectTargets[3].params = [getTeamSuccess, $scope.siftingKey.saleAreaId];
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

      $scope.$on('CLUE_ADD_SUCCESS',function(){
        $scope.clueAddModel.hide();
        $ionicScrollDelegate.$getByHandle('clueScroll').scrollTop(false);
        $scope.clues = [];
        $scope.siftingShowData = {
          opportunityStatus:"",
          businessFrom: '',
          saleArea:'',
          saleTeam:'',
          employee:'',
          status:1
        };
        $scope.siftingKey = {
          "page":1,
          "pageSize":10,
          "queryType":"ALL_CLUE",
          "opportunityStatus":"",
          "saleAreaId":"",
          "saleTeamId":"",
          "theYear":"",
          "businessFrom":"",
          "saleStage":"",
          "prjBeginDateFrom":"",
          "prjBeginDateTo":"",
          "preSignDateFrom":"",
          "preSignDateTo":"",
          "creationDateFrom":"",
          "creationDateTo":"",
          "sortname": "creationDate",
          "sortorder": "desc",
          "status":"HCRM_ENABLE"
        };
        $scope.showLoading = true;
        $scope.lastSelectSortIndex = 3;
        $scope.doRefresh();
      });

    }]);

angular.module('clueModule')
  .service('clueService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    '$http',
    function(hmsHttp,
             hmsPopup,
             baseConfig,
             $http) {

      var baseUrl = baseConfig.basePath;

      this.getClues = function(success, params, failure){
        hmsHttp.post(baseUrl + 'query_clue_list', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showShortCenterToast(response);
          hmsPopup.hideLoading();
          failure(response);
        });
      }

    }]);
