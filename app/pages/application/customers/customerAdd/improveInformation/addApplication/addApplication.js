angular.module('customerModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
      .state('tab.addApplication', {
          url: '/customers/customerAdd/improveInformation/addApplication',
          params: {
            param: {}
          },
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/customers/customerAdd/improveInformation/addApplication/addApplication.html',
              controller: 'addApplicationCtrl'
            }
          }
      })
    }]);

angular.module('customerModule')

  .controller('addApplicationCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'publicMethod',
    '$ionicActionSheet',
    '$timeout',
    '$ionicHistory',
    '$filter',
    'hmsPopup',
    'hmsHttp',
    'T',
    'CloneData',
    'addApplicationService',
    'baseConfig',
    'customerService',
    '$ionicModal',
    '$ionicScrollDelegate',
    'improveInformationService',
    function($scope,
             $state,
             $stateParams,
             publicMethod,
             $ionicActionSheet,
             $timeout,
             $ionicHistory,
             $filter,
             hmsPopup,
             hmsHttp,
             T,
             CloneData,
             addApplicationService,
             baseConfig,
             customerService,
             $ionicModal,
             $ionicScrollDelegate,
             improveInformationService) {
      $scope.goBack=function(){
        addApplicationService.setIsApplication(true);
        improveInformationService.setIsEdit(false);
        $ionicHistory.goBack();
      };

      $scope.goState = function (val) {
        $state.go(val);
      };

      var baseUrl = baseConfig.basePath;
      //多语言字段
      $scope.bilingual=CloneData.getApplicaion_add();
      $scope.application = {
        situationId: null,
        customerId: -9999,
        productType:'',
        productTypeName:'',
        product:'',
        productName:'',
        implementationCompany:'',
        description:''
      };

      $scope.applicationStatusInput =  [{
        text:$scope.bilingual.company,
        input:"",
        placeholder:"请输入"
      },{
        text:$scope.bilingual.other_instructions,
        input:"",
        placeholder:"请输入"
      }];
      $scope.applicationSelect =[{
        text:$scope.bilingual.product_category,
        placeholder:'请选择',
        important:true,
        showLine:false,
        lastLine:false
      },{
        text:$scope.bilingual.product_brand,
        placeholder:'请选择',
        important:true,
        showLine:false,
        lastLine:false
      }]

      $scope.data = {
        productBrand:'',
        productCatalog:''
      };

      //界面显示的数据
      $scope.showData = {
        productBrand:'',
        productCatalog:''
      };

     //编辑
      if(improveInformationService.getIsEdit()){
        $scope.id = $stateParams.param;
        console.log('编辑Id==='+$scope.id)
        if($scope.id!=undefined&&$scope.id!=null){
          $scope.application = addApplicationService.getApplication($scope.id);
          console.log($scope.application.productTypeName,$scope.application.productName,
            $scope.application.implementationCompany,$scope.application.description);
          $scope.showData.productCatalog = $scope.application.productTypeName ;
          $scope.showData.productBrand = $scope.application.productName;
          $scope.data.productCatalog = $scope.application.productType;
          $scope.data.productBrand = $scope.application.product;
          $scope.applicationStatusInput[0].input =$scope.application.implementationCompany;
          $scope.applicationStatusInput[1].input =$scope.application.description;
        }
      }


      $scope.items = [];
      $scope.nowSelectTarget = {};
      var application_value_list = [
        {
          code: 'HCRM.APPLIED_PRODUCT_BRAND',
          lastUpdateDate : 'APPLIED_PRODUCT_BRAND_DATE',
           localList : 'APPLIED_PRODUCT_BRAND'
        },
        {
          code: 'HCRM.APPLIED_PRODUCT_CATALOG',
          lastUpdateDate: 'APPLIED_PRODUCT_CATALOG_DATE',
           localList : 'APPLIED_PRODUCT_CATALOG'
        }
      ]

      var getValueObjByCode = function (code) {
        for (var i = 0; i < application_value_list.length; i++) {
          if (code == application_value_list[i].code)
            return application_value_list[i];
        }
      };

      var getValueListSuccess = function(response){
        hmsPopup.hideLoading();
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
      //根据时间戳刷新页面值列表
      customerService.getValueList(getValueListSuccess, application_value_list);

      $scope.selectTargets = [{
        'key': 'product_brand',
        'interface': showValueInList,
        'params': ['HCRM.APPLIED_PRODUCT_BRAND'],
        'showKey': 'description',
        'dataKey': 'value',
        'dataModel': '$scope.data.productBrand',
        'showDataModel': '$scope.showData.productBrand'
      },{
          'key': 'product_catalog',
          'interface': showValueInList,
          'params': ['HCRM.APPLIED_PRODUCT_CATALOG'],
          'showKey': 'description',
          'dataKey': 'value',
          'dataModel': '$scope.data.productCatalog',
          'showDataModel': '$scope.showData.productCatalog'
        }];

      $scope.loadMore = function () {
        $scope.nowPage++;
        for (var i = 0; i < $scope.nowSelectTarget.params.length; i++) {
          if ($scope.nowSelectTarget.params[i] == $scope.nowPage - 1) {
            $scope.nowSelectTarget.params[i] = $scope.nowPage;
            break;
          }
        }
        $scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
      };
      $ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal1) {
        $scope.crmSelectModal = modal1;
      });
      $scope.showSelectDiv = function(key){
        $scope.moreDataCanBeLoaded=false;
        $scope.searchModel.searchValueKey = '';
        $scope.nowPage = 1;
        if ($scope.showSelect) {
          $scope.showCrmLoading = false;
          $scope.crmSelectModal.hide();
        } else {
          $scope.crmSelectModal.show();
          //$scope.showCrmLoading = true;
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
        $scope.showSelectDiv();
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
      $scope.sourceItems = [];
      $scope.noDataFlag = false;

      $scope.searchSelectValue = function(){
        if($scope.nowSelectTarget['searchInterface']){
          $scope.showCrmLoading = true;
          //需要接口搜索的
          if($scope.searchModel.searchValueKey == ''){
            $scope.items = [];
            $scope.nowPage = 1;
            $scope.nowSelectTarget = cloneObj($scope.sourceTargetData);
            $scope.nowSelectTarget.interface.apply(null,$scope.nowSelectTarget.params);
          } else{
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



      $scope.confirm = function () {

          $scope.application.productTypeName = $scope.showData.productCatalog;
          $scope.application.productName= $scope.showData.productBrand;
          $scope.application.productType = $scope.data.productCatalog;
          $scope.application.product= $scope.data.productBrand;
          $scope.application.implementationCompany = $scope.applicationStatusInput[0].input;
          $scope.application.description = $scope.applicationStatusInput[1].input;
        if($scope.application.productType===""){
          hmsPopup.showPopup("产品类别不能为空");
        }else if($scope.application.product===""){
          hmsPopup.showPopup("产品品牌不能为空");
        }else {
          if(improveInformationService.getIsEdit()){
            addApplicationService.editApplication($scope.id,$scope.application);
            improveInformationService.setIsEdit(false);
            addApplicationService.setIsApplication(true);
          }else {
            addApplicationService.addApplicationList($scope.application);
            addApplicationService.setIsApplication(true);
          }

          $state.go('tab.improveInformation')
        }
      }

    }])

  .factory('addApplicationService',function () {

    var applicationList = [];
    var isApplication = false;
    return {
      addApplicationList:function(val){
        applicationList.push(val);
      },
      getApplicationList:function(){
        return applicationList;
      },
      setApplicationList:function(val){
        applicationList = val;
      },
      getApplication: function (index) {
        return applicationList[index];
      },
      editApplication: function (index,val) {
         applicationList[index] = val;
      },
      deleteApplication:function(index){
        applicationList.splice(index,1);
      },
      cleanApplication:function(){
        applicationList=[];
      },
      getIsApplication:function(){
        return isApplication;
      },
       setIsApplication:function(val){
        isApplication =  val;
      },
    };
  });
