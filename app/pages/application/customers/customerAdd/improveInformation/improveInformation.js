angular.module('customerModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
      .state('tab.improveInformation', {
          url: '/customers/customerAdd/improveInformation',
          params: {
            param: {}
          },
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/customers/customerAdd/improveInformation/improveInformation.html',
              controller: 'improveInformationCtrl'
            }
          }
      })
    }]);

angular.module('customerModule')

  .controller('improveInformationCtrl', [
    '$scope',
    '$state',
    'publicMethod',
    '$cordovaActionSheet',
    '$timeout',
    '$cordovaDatePicker',
    '$cordovaCamera',
    '$cordovaImagePicker',
    '$cordovaFile',
    '$log',
    '$ionicHistory',
    'history',
    'hmsPopup',
    'hmsHttp',
    'T',
    'CloneData',
    'addApplicationService',
    'customerService',
    'baseConfig',
    'customerAddService',
    '$ionicModal',
    '$ionicScrollDelegate',
    'customerDetailService',
    'opportunityAddService',
    'improveInformationService',
    function($scope,
             $state,
             publicMethod,
             $cordovaActionSheet,
             $timeout,
             $cordovaDatePicker,
             $cordovaCamera,
             $cordovaImagePicker,
             $cordovaFile,
             $log,
             $ionicHistory,
             history,
             hmsPopup,
             hmsHttp,
             T,
             CloneData,
             addApplicationService,
             customerService,
             baseConfig,
             customerAddService,
             $ionicModal,
             $ionicScrollDelegate,
             customerDetailService,
             opportunityAddService,
             improveInformationService) {
      $scope.goBack=function(){
        customerService.setIsCustomer(false);
        $ionicHistory.goBack();
      };
      $scope.showCustomerAddImgGuide;
      $scope.buttonTapped=function(){
        $scope.showCustomerAddImgGuide = false;
        window.localStorage.showCustomerAddImgGuide=false;
      };
      if (!window.localStorage.showCustomerAddImgGuide || window.localStorage.guideHelpAuto == "true") {
        window.localStorage.showCustomerAddImgGuide="false";
        $scope.showCustomerAddImgGuide = true;
      } else {
      }
      $scope.goState = function (val) {
        $state.go(val);
      };

      var baseUrl = baseConfig.basePath;

      //初始化数据
      $scope.loading = function () {
        $scope.imageUrl = '';
        $scope.imagevalue = 'build/img/application/information/camera3x.png';
        $scope.customer = {};
        $scope.validCredit = false;
        $scope.validParagraph = false;
        $scope.showLoading = false;
        $scope.applicationStatus= addApplicationService.getApplicationList();
        $scope.showFlag=[false,false,false,false,false,false,false];
        //多语言字段
        $scope.bilingual=CloneData.getCustomer_information();
        $scope.customerName = customerAddService.getCustomer();
        //基本输入信息
        $scope.basicInformation=[{
          text: $scope.bilingual.english_name,
          input:"",
          placeholder:"请输入",
          important:false
        },{
          text: $scope.bilingual.simple_name,
          input:"",
          placeholder:"请输入",
          important:false
        },{
          text: $scope.bilingual.register_id,
          input:"",
          placeholder:"请输入",
          important:false
        }];
        $scope.creditCode={
          text: $scope.bilingual.credit_code,
            input:"",
            placeholder:"对于中国区域，二选一必输",
            important:false,
            readonlyFlag:false
        }
        $scope.dutyParagraph = {
          text: $scope.bilingual.duty_paragraph,
          input:"",
          placeholder:"对于中国区域，二选一必输",
          important:false,
          readonlyFlag: false
        }
        //联系人输入信息
        $scope.contact =[{
          text: $scope.bilingual.zip_code,
          input:"",
          placeholder:"请输入",
          important:false,
          showLine:false
        },{
          text: $scope.bilingual.fax,
          input:"",
          placeholder:"请输入",
          important:false,
          showLine:false
        },{
          text: $scope.bilingual.website,
          input:"",
          placeholder:"请输入",
          important:false,
          showLine:true
        }];
        $scope.phone = {
          text: $scope.bilingual.phone,
          input:"",
          placeholder:"请输入",
          important:false,
          showLine:false
        }

        //其他输入信息
        $scope.others =  [{
          text:'其他信息化建设状况',
          input:"",
          placeholder:"请输入",
          important:false,
          showLine:true
        },{
          text:'其他描述',
          input:"",
          placeholder:"请输入",
          important:false,
          showLine:true
        }];

        //上级客户选择
         $scope.parentCustomer={
           text:$scope.bilingual.parent_customers,
           placeholder:'请选择',
           important:false,
           showLine:false
         }
        //国家省市区选择
        $scope.address={
          text:$scope.bilingual.address,
          placeholder:'请选择',
          important:true,
          showLine:false
        }
        //所属大区、团队选择
        $scope.longBelong={
          text:$scope.bilingual.long_belong,
          placeholder:'请选择',
          important:true,
          showLine:false
        }
        //企业信息选择
        $scope.business=[{
          text:$scope.bilingual.enterprise_nature,
          placeholder:'请选择',
          important:false,
          showLine:false,
          lastLine:false
        },{
          text:$scope.bilingual.major_industry,
          placeholder:'请选择',
          important:false,
          showLine:false,
          lastLine:false
        },{
          text:$scope.bilingual.is_listed,
          placeholder:'请选择',
          important:false,
          showLine:false,
          lastLine:false
        },{
          text:$scope.bilingual.income_scale,
          placeholder:'请选择',
          important:false,
          showLine:false,
          lastLine:false
        },{
          text:$scope.bilingual.worker_scale,
          placeholder:'请选择',
          important:false,
          showLine:false,
          lastLine:false
        },]
        $scope.data = {
          parentCustomersId: "",//上级客户
          saleAreaId: "",//所属大区
          saleTeamId: "",//所属团队
          normalEmployeeId: "",//业务客户负责人
          enterpriseNature: "",//企业性质
          majorIndustry: "",//所属主行业
          subIndustry:"",//二级行业
          incomeScale: "",//收入规模
          workerScale:'',
          creationDateFrom: '',//创建时间开始
          creationDateTo: '',//创建时间结束
          addressCountry:'',//国家
          addressProvince:'',//省
          addressCity:'',//城市
          addressZone:'',//区
          isListed:'Y',//是否上市
          website:'',
          addressDetail:'',
          attribute1:''
        };

        //界面显示的数据
        $scope.showData = {
          fullName: "",//上级客户
          saleAreaName: "",//所属大区
          team: "",//所属团队
          principal: "",//负责人
          normalEmployeeName: "",//业务客户负责人
          enterpriseNature: "",//企业性质
          majorIndustry: "",//所属主行业
          subIndustry:"",//二级行业
          industry:'',
          incomeScale: "",//收入规模
          workerScale:'',
          creationDateFrom: '',
          creationDateTo: '',
          address:'',
          isListed:'',
          saleBelong:''
        };
        customerService.getEmployeeDetail(getEmployeeDetailSuccess);
        //保存的数据
        $scope.saveValue = {
          "customerId": '',
          "customerCode": "",
          "fullName": $scope.customerName.fullName,
          "simpleName": $scope.customerName.simpleName,
          "englishName": $scope.basicInformation[0].input,
          "simpleCode": $scope.basicInformation[1].input,
          "registerId": $scope.basicInformation[2].input,
          "creditCode": $scope.creditCode.input,
          "dutyParagraph": $scope.dutyParagraph.input,
          "parentCustomersId": $scope.data.parentCustomersId,
          "addressCountry": $scope.data.addressCountry,
          "addressProvince": $scope.data.addressProvince,
          "addressCity": $scope.data.addressCity,
          "addressZone": $scope.data.addressZone,
          "addressDetails":$scope.data.addressDetail,
          "addressZipCode": $scope.contact[0].input,
          "phone": $scope.phone.input,
          "fax": $scope.contact[1].input,
          "website": $scope.contact[2].input,
          "saleAreaId": $scope.data.saleAreaId,
          "saleTeamId": $scope.data.saleTeamId,
          "normalEmployeeId": $scope.data.normalEmployeeId,
          "enterpriseNature": $scope.data.enterpriseNature,
          "majorIndustry": $scope.data.majorIndustry,
          "subIndustry": $scope.data.subIndustry,
          "isListed": $scope.data.isListed,
          "workerScale": $scope.data.workerScale,
          "incomeScale": $scope.data.incomeScale,
          "itStatusDes": $scope.others[0].input,
          "otherDescription":  $scope.others[1].input,
          "dataStatus": "HCRM_VALID",
          "attachments": [],
          "situations": $scope.applicationStatus,
          "contacts": [],
          "logoUrl":''
        }
        $scope.items = [];
        $scope.nowSelectTarget = {};
      }

      $scope.editCustomer = function () {
        $scope.saveValue = customerDetailService.getEditCustomer();
        $scope.applicationStatus = customerDetailService.getApplication();
        addApplicationService.setApplicationList($scope.applicationStatus);
        if(customerDetailService.getEditCustomer().approveTypeName=='已提交'||customerDetailService.getEditCustomer().approveTypeName=='已审核'){
          $scope.customerName.fullName = $scope.saveValue.fullName;
          $scope.customerName.simpleName = $scope.saveValue.simpleName;
        }
        $scope.imageUrl = $scope.saveValue.logoUrl;
        if($scope.imageUrl!==''){
          $scope.imagevalue = $scope.imageUrl;
        }
        $scope.basicInformation[0].input = $scope.saveValue.englishName;
        $scope.basicInformation[1].input = $scope.saveValue.simpleCode;
        $scope.basicInformation[2].input = $scope.saveValue.registerId;
        $scope.creditCode.input = $scope.saveValue.creditCode;
        $scope.dutyParagraph.input = $scope.saveValue.dutyParagraph;
        $scope.data.parentCustomersId = $scope.saveValue.parentCustomersId;
        $scope.data.addressCountry = $scope.saveValue.addressCountry;
        $scope.data.addressProvince = $scope.saveValue.addressProvince;
        $scope.data.addressCity = $scope.saveValue.addressCity;
        $scope.data.addressZone = $scope.saveValue.addressZone;
        $scope.data.addressDetail = $scope.saveValue.addressDetails;
        $scope.data.normalEmployeeId = $scope.saveValue.normalEmployeeId;
        $scope.contact[0].input = $scope.saveValue.addressZipCode;
        $scope.phone.input = $scope.saveValue.phone;
        $scope.contact[1].input = $scope.saveValue.fax;
        $scope.contact[2].input = $scope.saveValue.website;
        $scope.data.saleAreaId = $scope.saveValue.saleAreaId;
        $scope.data.saleTeamId = $scope.saveValue.saleTeamId;
        $scope.data.majorIndustry = $scope.saveValue.majorIndustry;
        $scope.data.subIndustry = $scope.saveValue.subIndustry;
        $scope.data.enterpriseNature = $scope.saveValue.enterpriseNature;
        $scope.data.ownedIndustry = $scope.saveValue.ownedIndustry;
        $scope.data.isListed = $scope.saveValue.isListed;
        $scope.data.workerScale = $scope.saveValue.workerScale;
        $scope.data.incomeScale = $scope.saveValue.incomeScale;
        $scope.others[0].input = $scope.saveValue.itStatusDes;
        $scope.others[1].input = $scope.saveValue.otherDescription;
        $scope.data.attribute1 = customerDetailService.getEditCustomer().approveType;

        $scope.showData.fullName = $scope.saveValue.parentFullName;//上级客户
        $scope.showData.saleAreaName = $scope.saveValue.saleArea;//所属大区
        $scope.showData.team = $scope.saveValue.saleTeam;//所属团队
        $scope.showData.normalEmployeeName = $scope.saveValue.normalEmployeeName;
        $scope.showData.enterpriseNature = $scope.saveValue.enterpriseName;//企业性质
        $scope.showData.majorIndustry = $scope.saveValue.majorIndustryName;
        $scope.showData.subIndustry = $scope.saveValue.subIndustryName;
        $scope.showData.industry = $scope.saveValue.majorIndustryName+"|"+$scope.saveValue.subIndustryName;//所属行业
        $scope.showData.incomeScale = $scope.saveValue.incomeScaleName;//收入规模
        $scope.showData.workerScale = $scope.saveValue.workerScaleName;
        $scope.showData.address = $scope.saveValue.countryName+$scope.saveValue.provinceName+$scope.saveValue.cityName+$scope.saveValue.zoneName;
        $scope.showData.isListed = $scope.saveValue.listedName;
        $scope.showData.saleBelong = $scope.saveValue.saleArea+"|"+$scope.saveValue.saleTeam;
        if($scope.creditCode.input!=''){
          $scope.validCredit = true;
        }
        if( $scope.dutyParagraph.input!=''){
          $scope.validParagraph = true;
        }
        if( customerDetailService.getEditCustomer().approveTypeName=='已提交'|| customerDetailService.getEditCustomer().approveTypeName=='已审核'){
          console.log( '改变FLAG'+customerDetailService.getEditCustomer().approveTypeName);
          if($scope.creditCode.input==''){
            $scope.creditCode.readonlyFlag = false;
          }else {
            $scope.creditCode.readonlyFlag = true;
          }
          if( $scope.dutyParagraph.input==''){
            $scope.dutyParagraph.readonlyFlag = false;
          }else {
            $scope.dutyParagraph.readonlyFlag = true;
          }
        }
      }

      $scope.areaValue = {"orgType":"HCRM_SALE_AREA"}

      $scope.teamValue = {
        'organizationId':'902',
        'orgType':'HCRM_SALE_TEAM'
      }
      $scope.parentValue = {
        page:1,
        pageSize:30
      }

      $scope.show = function (val) {
        $scope.showFlag[val] = !$scope.showFlag[val];
        $ionicScrollDelegate.$getByHandle("employeeSearchHandle").resize();
      }
      // 添加应用模块
      $scope.deleteApplication = function (index) {
        addApplicationService.deleteApplication(index);
      }
      //修改应用
      $scope.edit = function (index) {
        improveInformationService.setIsEdit(true);
        $state.go('tab.addApplication',{
          param:index
        });
      }

      //检测社会统一信用代码
      $scope.validCreditCode = function () {
        if($scope.creditCode.input!==''&&$scope.creditCode.input!='000000'&&$scope.creditCode.readonlyFlag==false){
          if(customerDetailService.getIsEdit()){
            customerService.validCreditCode(validCreditCodeSuccess,$scope.creditCode.input,customerDetailService.getEditCustomer().customerId);
          }else {
            customerService.validCreditCode(validCreditCodeSuccess,$scope.creditCode.input,'');
          }

        }
      }
      var validCreditCodeSuccess = function(data){
        $scope.showCrmLoading = false;
        if(data.returnCode == 'E'){
          hmsPopup.showPopupCustomerAdd(data.returnMsg,data.flagMsg,data.customerName,data.approveStatusName,
            data.saleArea,data.saleTeam,data.saleEmployeeName,data.saleEmployeeCode);
          $scope.creditCode.input = '';
          if(customerDetailService.getIsEdit()&&(customerDetailService.getEditCustomer().approveTypeName=='已提交'|| customerDetailService.getEditCustomer().approveTypeName=='已审核')){
            $scope.validCredit = false;
          }else{
            $scope.validCredit = false;
            //$scope.validParagraph = false;
          }

        }else{
          $scope.validCredit = true;
        }
      };

      //检测税号
      $scope.validDutyParagraph = function () {
        if($scope.dutyParagraph.input!==''&&$scope.dutyParagraph.readonlyFlag==false){
          if(customerDetailService.getIsEdit()){
            customerService.validParagraph(validDutyParagraphSuccess,$scope.dutyParagraph.input,customerDetailService.getEditCustomer().customerId);
          }else {
            customerService.validParagraph(validDutyParagraphSuccess,$scope.dutyParagraph.input,'');
          }

        }
      }
      var validDutyParagraphSuccess = function(data){
        $scope.showCrmLoading = false;
        if(data.returnCode == 'E'){
         hmsPopup.showPopupCustomerAdd(data.returnMsg,data.flagMsg,data.customerName,data.approveStatusName,
           data.saleArea,data.saleTeam,data.saleEmployeeName,data.saleEmployeeCode);
          $scope.dutyParagraph.input = '';
          if(customerDetailService.getIsEdit()&&(customerDetailService.getEditCustomer().approveTypeName=='已提交'|| customerDetailService.getEditCustomer().approveTypeName=='已审核')){
            $scope.validParagraph = false;
          }else{
            //$scope.validCredit = false;
            $scope.validParagraph = false;
          }
        }else {
          $scope.validParagraph = true;
        }
      };
      //检测手机格式
      $scope.validPhone = function () {
        if($scope.phone.input!==""){
          console.log("匹配结果：=="+phoneNumber($scope.phone.input));
          if (phoneNumber($scope.phone.input)||phoneNumber86($scope.phone.input)) {
            //hmsPopup.showPopup("手机号码格式错误")
            console.log('格式正确')
            return true;
          }else{
            hmsPopup.showPopup("手机号码格式错误,请重新输入！")
            $scope.phone.input="";
            return false;
          }
        }
      }


      //值列表接口所需字段
      var business_value_list = [
        {
           code : 'HCRM.INCOME_SCALE',
          lastUpdateDate : 'INCOME_SCALE_DATE',
          localList : 'INCOME_SCALE'
        },
        {
          code: 'HCRM.WORKER_SCALE',
          lastUpdateDate : 'WORKER_SCALE_DATE',
          localList : 'WORKER_SCALE'
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
        },
        {
          code: 'SYS.YES_NO',
          lastUpdateDate : 'YES_NO_DATE',
          localList : 'YES_NO'
        }
      ]

      var getValueObjByCode = function (code) {
        console.log(code);
        for(var i = 0; i < business_value_list.length; i++){
          if(code == business_value_list[i].code)
            return cloneObj(business_value_list[i]);
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
        $scope.showCrmLoading=true;
        $scope.moreDataCanBeLoaded = response.parent_customer_list.length == $scope.pageSize;
        if(response.returnCode == 'S'){
          $scope.showCrmLoading=false;
          $scope.items = response.parent_customer_list;
        }else{
          $scope.showCrmLoading=false;
        }
      };

      //业务负责人分页查询
      var getNormalEmployeeSuccess = function (response) {
        $scope.showCrmLoading = false;
        console.log("more");
        if(response.returnCode == 'S'){
          for(var i = 0; i < response.sale_employees.length; i++){
            response.sale_employees[i].showModal = response.sale_employees[i].name + ' (' + response.sale_employees[i].employeeCode + ') ' + response.sale_employees[i].unit_name;
          }
          $scope.items = $scope.items.concat(response.sale_employees);
          $scope.sourceItems = $scope.items.clone();
          $scope.moreDataCanBeLoaded = response.sale_employees.length == $scope.pageSize;
        } else {
          $scope.moreDataCanBeLoaded = false;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      var getEmployeesSearchSuccess = function(response){
        $scope.showCrmLoading = false;
        if(response.returnCode == 'S'){
          $scope.nowPage = 1;
          for(var i = 0; i < response.sale_employees.length; i++){
            response.sale_employees[i].showModal = response.sale_employees[i].name + ' (' + response.sale_employees[i].employeeCode + ') ' + response.sale_employees[i].unit_name;
          }
          $scope.moreDataCanBeLoaded = response.sale_employees.length == $scope.pageSize;
          $scope.items = $scope.items.concat(response.sale_employees);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      };

      //获取个人信息
      var getEmployeeDetailSuccess = function (response) {
        if (response.returnCode == 'S'){
           $scope.showData.principal=response.employee_detail.name;
           $scope.showData.saleAreaName = response.employee_detail.saleArea;
           $scope.showData.team = response.employee_detail.saleTeam;
           $scope.showData.saleBelong = $scope.showData.saleAreaName + " | " + $scope.showData.team;
           $scope.data.saleAreaId = response.employee_detail.saleAreaId;
           $scope.data.saleTeamId = response.employee_detail.saleTeamId;
        }
      };

      //var getSaleAreaSuccess = function (response) {
      //  hmsPopup.hideLoading();
      //  if (response.returnCode == 'S')
      //    $scope.items = $scope.items.concat(response.sale_area_list);
      //  $scope.sourceItems = $scope.items.clone();
      //};
      //var getSaleTeamSuccess = function (response) {
      //  hmsPopup.hideLoading();
      //  if (response.returnCode == 'S')
      //    $scope.items = $scope.items.concat(response.sale_team_list);
      //  $scope.sourceItems = $scope.items.clone();
      //};


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
        $scope.showCrmLoading=false;
        var valueObj = getValueObjByCode(code);
        $scope.items = $scope.items.concat(JSON.parse(window.localStorage[valueObj.localList]));
        $scope.sourceItems = $scope.items.clone();
      };
      //根据时间戳刷新页面值列表
      customerService.getValueList(getValueListSuccess, business_value_list);

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
        'params': [getSaleTeamSuccess, $scope.teamValue.organizationId, $scope.teamValue.orgType],
        'showKey': 'saleTeamName',
        'dataKey': 'saleTeamId',
        'dataModel': '$scope.data.saleTeamId',
        'showDataModel': '$scope.showData.team'
      }, {
        'key': 'enterprise_nature',
        'interface': showValueInList,
        'params': [ 'HCRM.ENTERPRISE_NATURE'],
        'showKey': 'description',
        'dataKey': 'value',
        'dataModel': '$scope.data.enterpriseNature',
        'showDataModel': '$scope.showData.enterpriseNature'
      }, {
        'key': 'owned_industry',
        'interface': showValueInList,
        'params': ['HCRM.OWNED_INDUSTRY'],
        'showKey': 'description',
        'dataKey': 'value',
        'dataModel': '$scope.data.ownedIndustry',
        'showDataModel': '$scope.showData.ownedIndustry'
      }, {
        'key': 'is_listed',
        'interface': showValueInList,
        'params': ['SYS.YES_NO'],
        'showKey': 'description',
        'dataKey': 'value',
        'dataModel': '$scope.data.isListed',
        'showDataModel': '$scope.showData.isListed'
      },{
        'key': 'income_scale',
        'interface': showValueInList,
        'params': ['HCRM.INCOME_SCALE'],
        'showKey': 'description',
        'dataKey': 'value',
        'dataModel': '$scope.data.incomeScale',
        'showDataModel': '$scope.showData.incomeScale'
      },{
        'key': 'worker_scale',
        'interface': showValueInList,
        'params': ['HCRM.WORKER_SCALE'],
        'showKey': 'description',
        'dataKey': 'value',
        'dataModel': '$scope.data.workerScale',
        'showDataModel': '$scope.showData.workerScale'
      },{
        'key': 'normal_employee',
        'interface': customerService.getNormalEmployee,  //获得选择项的接口
        'params': [getNormalEmployeeSuccess,'',$scope.nowPage,$scope.pageSize],  //获得选择项时接口所需参数
        'showKey': 'showModal',            //选择界面显示的数据
        'dataKey': 'userId',      //对象内最终操作提交所需的数据变量
        'dataModel': '$scope.data.normalEmployeeId',  //最终操作提交所需的数据变量
        'showDataModel': '$scope.showData.normalEmployeeName', //显示在界面上的ng-model
        'searchInterface' : customerService.getNormalEmployee,
        'searchParams' : getEmployeesSearchSuccess,
        'needShowMore': true
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
          $scope.showCrmLoading = false;
          $scope.showLoading = false;
        } else {
          $scope.crmSelectModal.show();
          $scope.showLoading = true;
          $scope.showCrmLoading = true;
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


      //所属级联
      $scope.saleAreas = [];
      $scope.saleTeams = [];
      $scope.showSaleTeam = false;
      $scope.areaValue = {
        key:''
      };
      $scope.inArea = true;

      var getSaleAreaSuccess= function(response){
        $scope.showCrmLoading = false;
        if(response.returnCode == "S")
          $scope.saleAreas = response.sale_area_list;
      };

      var getSaleTeamSuccess= function(response){
        $scope.showCrmLoading = false;
        if(response.returnCode == "S"){
          var obj = {
            saleTeamId:'',
            saleTeamName:'空'
          };
          $scope.saleTeams = response.sale_team_list;
          $scope.saleTeams.unshift(obj);
        }
      };
      $ionicModal.fromTemplateUrl('build/pages/modals/crmAreaModal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal1) {
        $scope.crmAreaModal = modal1;
      });
      $scope.showSaleSelectFlag = false;

      $scope.showSaleSelect = function(){
        $scope.showSaleSelectFlag = true;
        if($scope.showSaleSelectFlag){
          $scope.crmAreaModal.show();
        }else {
          $scope.crmAreaModal.hide();
        }
        $scope.showCrmLoading = true;
        customerService.getSaleArea(getSaleAreaSuccess,'');
      };

      $scope.selectArea = function(area){
        $ionicScrollDelegate.$getByHandle('saleScroll').scrollTop(false);
        $scope.areaValue.key='';
        $scope.inArea = false;
        $scope.showSaleTeam = true;
        $scope.showData.saleAreaName = area.saleAreaName;
        $scope.data.saleAreaId = area.saleAreaId;
        $scope.showCrmLoading = true;
        opportunityAddService.getSaleTeam(getSaleTeamSuccess,area.saleAreaId);
      };

      $scope.selectTeam = function(team){
        $ionicScrollDelegate.$getByHandle('saleScroll').scrollTop(false);
        $scope.inArea = true;
        $scope.areaValue.key='';
        $scope.showSaleTeam = false;
        $scope.showSaleSelectFlag = false;
        $scope.crmAreaModal.hide();
        $scope.showData.team = team.saleTeamName;
        $scope.showData.saleBelong = $scope.showData.saleAreaName + " | " + $scope.showData.team;
        $scope.data.saleTeamId = team.saleTeamId;
      };

      $scope.saleBack = function(){
        $ionicScrollDelegate.$getByHandle('saleScroll').scrollTop(false);
        //当目录在一级时，返回
        if(!$scope.showSaleTeam){
          $scope.showSaleSelectFlag = false;
          $scope.crmAreaModal.hide();
          $scope.inArea = true;
          $scope.data.saleAreaId = '';
          $scope.areaValue.key = '';
        }
        //否则跳到一级,并清空第二级数据
      else{
          customerService.getSaleArea(getSaleAreaSuccess,'');
          $scope.showSaleTeam = false;
          $scope.saleTeams = [];
          $scope.inArea = true;
          $scope.data.saleAreaId = '';
          $scope.areaValue.key = '';
      }
    };

      $scope.filterArea = function () {
        $ionicScrollDelegate.$getByHandle('saleScroll').scrollTop(false);
        $scope.saleTeams = [];
        if($scope.inArea){
          if($scope.areaValue.key==''){
            $scope.saleAreas = [];
            customerService.getSaleArea(getSaleAreaSuccess,'');
          }else {
            $scope.saleAreas = [];
            customerService.getSaleArea(getSaleAreaSuccess,$scope.areaValue.key);
          }
        }else {
          if($scope.areaValue.key==''){
            customerService.getSaleTeam(getSaleTeamSuccess,'', $scope.data.saleAreaId);
          }else {
            customerService.getSaleTeam(getSaleTeamSuccess,$scope.areaValue.key,$scope.data.saleAreaId);
          }
        }
      }
      $scope.clearAreaFilter = function () {
        $scope.areaValue.key='';
        if($scope.inArea){
          $scope.saleAreas = [];
          customerService.getSaleArea(getSaleAreaSuccess,'');
        }else {
          $scope.saleTeams = [];
          customerService.getSaleTeam(getSaleTeamSuccess,'', $scope.data.saleAreaId);
        }
      }

      //所属行业级联
      $scope.majorIndustrys = [];
      $scope.subIndustrys = [];
      $scope.showSubIndustry = false;
      $scope.industrySearch = {
        key:''
      };
      $scope.inMajor = true;

      var getMajorIndustrySuccess= function(response){
        $scope.showCrmLoading = false;
        if(response.returnCode == "S")
          $scope.majorIndustrys = response.industry_list;
      };

      var getSubIndustrySuccess= function(response){
        $scope.showCrmLoading = false;
        if(response.returnCode == "S"){
          var obj = {
            industryId:'',
            industryName:'空'
          };
          $scope.subIndustrys = response.industry_list;
          $scope.subIndustrys.unshift(obj);
        }

      };

      $ionicModal.fromTemplateUrl('build/pages/modals/crmIndustryModal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal1) {
        $scope.crmIndustryModal = modal1;
      });
      $scope.showIndustrySelectFlag = false;

      $scope.showIndustrySelect = function(){
        $scope.showIndustrySelectFlag = !$scope.showIndustrySelectFlag;
        if($scope.showIndustrySelectFlag){
          $scope.crmIndustryModal.show();
        }else {
          $scope.crmIndustryModal.hide();
        }
        $scope.showCrmLoading = true;
        customerService.getIndustry(getMajorIndustrySuccess,'',0);
      };

      $scope.selectMajor = function(industry){
        $ionicScrollDelegate.$getByHandle('industryScroll').scrollTop(false);
        $scope.industrySearch.key ='';
        $scope.showSubIndustry = true;
        $scope.inMajor = false;
        $scope.showData.majorIndustry = industry.industryName;
        $scope.data.majorIndustry = industry.industryId;
        $scope.showCrmLoading = true;
        customerService.getIndustry(getSubIndustrySuccess,'', industry.industryId);
      };

      $scope.selectSub = function(industry){
        $ionicScrollDelegate.$getByHandle('industryScroll').scrollTop(false);
        $scope.industrySearch.key='';
        $scope.showSubIndustry = false;
        $scope.inMajor = true;
        $scope.showIndustrySelectFlag = false;
        $scope.crmIndustryModal.hide();
        $scope.showData.subIndustry = industry.industryName;
        $scope.showData.industry = $scope.showData.majorIndustry + " | " + $scope.showData.subIndustry;
        $scope.data.subIndustry = industry.industryId;
      };

      $scope.industryBack = function(){
        $ionicScrollDelegate.$getByHandle('industryScroll').scrollTop(false);
        //当目录在一级时，返回
        if(!$scope.showSubIndustry){
          $scope.showIndustrySelectFlag = false;
          $scope.crmIndustryModal.hide();
          $scope.inMajor = true;
          $scope.data.majorIndustry='';
        }
        //否则跳到一级,并清空第二级数据
        else{
          customerService.getIndustry(getMajorIndustrySuccess,'', 0);
          $scope.industrySearch.key='';
          $scope.showSubIndustry = false;
          $scope.inMajor = true;
          $scope.subIndustrys = [];
          $scope.data.majorIndustry='';
        }
      };

      $scope.filterIndustry = function () {
        $ionicScrollDelegate.$getByHandle('industryScroll').scrollTop(false);
        $scope.subIndustrys = [];
        if($scope.inMajor){
          if($scope.industrySearch.key==''){
            $scope.majorIndustrys = [];
            customerService.getIndustry(getMajorIndustrySuccess,'', 0);
          }else {
            $scope.majorIndustrys = [];
            customerService.getIndustry(getMajorIndustrySuccess,$scope.industrySearch.key, 0);
          }
        }else {
          if($scope.industrySearch.key==''){
            customerService.getIndustry(getSubIndustrySuccess,'', $scope.data.majorIndustry);
          }else {
            customerService.getIndustry(getSubIndustrySuccess,$scope.industrySearch.key, $scope.data.majorIndustry);
          }
        }
      }

      $scope.clearIndustryFilter = function () {
        $scope.industrySearch.key='';
        if($scope.inMajor){
          $scope.majorIndustrys = [];
          customerService.getIndustry(getMajorIndustrySuccess,'', 0);
        }else {
          $scope.subIndustrys = [];
          customerService.getIndustry(getSubIndustrySuccess,'', $scope.data.majorIndustry);
        }
      }
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
      $scope.selectedPlaces = [{
        "addressId": 1037,
        "addressName": "中国",
        "type": "COUNTRY",
        "parentAddressId": 0
      }];
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
          $scope.selectedPlaces = [{
            "addressId": 1037,
            "addressName": "中国",
            "type": "COUNTRY",
            "parentAddressId": 0
          }];
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
          $scope.selectedPlaces = [{
            "addressId": 1037,
            "addressName": "中国",
            "type": "COUNTRY",
            "parentAddressId": 0
          }];
          getCountry(CHINA_CODE);
        } else {
          getCountry(0);
        }
      };
      $scope.changeChina(true);
      $scope.selectPlace = function ($index) {
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

      //$scope.placeBackTo = function($index){
      //  if(!$scope.inChina)
      //    return;
      //  $scope.selectedPlaces = $scope.selectedPlaces.slice(0,$index + 1);
      //  getCountry($scope.selectedPlaces[$index].addressId);
      //  $scope.showData.address="";
      //};



        var success = function (res) {
          hmsPopup.hideLoading();
          var result = JSON.parse(res.response);
          if (baseConfig.debug) {
            alert('complete.success ' + angular.toJson());
          }
          if(result.success == true){
            //hmsPopup.showPopup('上传成功');
            console.log('上传成功。。。'+angular.toJson(result))
            $scope.imageUrl = result.rows[0].objectUrl;
            $scope.saveValue.logoUrl =  $scope.imageUrl;

          }else{
            console.log('上传失败了。。。'+angular.toJson(result))
            hmsPopup.showShortCenterToast('上传失败');
            //hmsPopup.showPopup('上传失败！');
          }
          $scope.save();
        };

        var error = function (response) {
          hmsPopup.hideLoading();
          if (baseConfig.debug) {
            alert('complete.error ' + angular.toJson(response));
          }
          console.log('上传错误了。。。'+angular.toJson(response))
          //hmsPopup.showPopup('上传失败！');
          hmsPopup.showShortCenterToast('上传错误')
          $scope.save();
        };


      $scope.checkData = function () {

        if($scope.creditCode.input==''||$scope.creditCode.input=='000000'||$scope.creditCode.readonlyFlag){
          $scope.validCredit = true;
        }
        if($scope.dutyParagraph.input==''||$scope.dutyParagraph.readonlyFlag){
          $scope.validParagraph = true;
        }

        $timeout(function () {
          if(customerDetailService.getIsEdit()){

            $scope.saveValue = {
              "customerId": customerDetailService.getEditCustomer().customerId,
              "customerCode": customerDetailService.getEditCustomer().customerCode,
              "fullName": $scope.customerName.fullName,
              "simpleName": $scope.customerName.simpleName,
              "englishName": $scope.basicInformation[0].input,
              "simpleCode": $scope.basicInformation[1].input,
              "registerId": $scope.basicInformation[2].input,
              "creditCode": $scope.creditCode.input,
              "dutyParagraph": $scope.dutyParagraph.input,
              "parentCustomersId": $scope.data.parentCustomersId,
              "addressCountry": $scope.data.addressCountry,
              "addressProvince": $scope.data.addressProvince,
              "addressCity": $scope.data.addressCity,
              "addressZone": $scope.data.addressZone,
              "addressDetails":$scope.data.addressDetail,
              "addressZipCode": $scope.contact[0].input,
              "phone": $scope.phone.input,
              "fax": $scope.contact[1].input,
              "website": $scope.contact[2].input,
              "saleAreaId": $scope.data.saleAreaId,
              "saleTeamId": $scope.data.saleTeamId,
              "normalEmployeeId": $scope.data.normalEmployeeId,
              "enterpriseNature": $scope.data.enterpriseNature,
              "majorIndustry": $scope.data.majorIndustry,
              "subIndustry": $scope.data.subIndustry,
              "isListed": $scope.data.isListed,
              "workerScale": $scope.data.workerScale,
              "incomeScale": $scope.data.incomeScale,
              "itStatusDes": $scope.others[0].input,
              "otherDescription":  $scope.others[1].input,
              "dataStatus": "HCRM_VALID",
              "attachments": [],
              "situations": addApplicationService.getApplicationList(),
              "contacts": [],
              "attribute1":$scope.data.attribute1,
              "logoUrl" :$scope.imageUrl
            }
          }else {
            $scope.saveValue = {
              "customerId": '',
              "customerCode": "",
              "fullName": $scope.customerName.fullName,
              "simpleName": $scope.customerName.simpleName,
              "englishName": $scope.basicInformation[0].input,
              "simpleCode": $scope.basicInformation[1].input,
              "registerId": $scope.basicInformation[2].input,
              "creditCode": $scope.creditCode.input,
              "dutyParagraph": $scope.dutyParagraph.input,
              "parentCustomersId": $scope.data.parentCustomersId,
              "addressCountry": $scope.data.addressCountry,
              "addressProvince": $scope.data.addressProvince,
              "addressCity": $scope.data.addressCity,
              "addressZone": $scope.data.addressZone,
              "addressDetails":$scope.data.addressDetail,
              "addressZipCode": $scope.contact[0].input,
              "phone": $scope.phone.input,
              "fax": $scope.contact[1].input,
              "website": $scope.contact[2].input,
              "saleAreaId": $scope.data.saleAreaId,
              "saleTeamId": $scope.data.saleTeamId,
              "normalEmployeeId": $scope.data.normalEmployeeId,
              "enterpriseNature": $scope.data.enterpriseNature,
              "majorIndustry": $scope.data.majorIndustry,
              "subIndustry": $scope.data.subIndustry,
              "isListed": $scope.data.isListed,
              "workerScale": $scope.data.workerScale,
              "incomeScale": $scope.data.incomeScale,
              "itStatusDes": $scope.others[0].input,
              "otherDescription":  $scope.others[1].input,
              "dataStatus": "HCRM_VALID",
              "attachments": [],
              "situations": $scope.applicationStatus,
              "contacts": [],
              "logoUrl" :''
            }
          }

          console.log(JSON.stringify($scope.saveValue));
          if($scope.saveValue.addressCountry===""){
            hmsPopup.showPopup("国家不能为空");

          }else if($scope.saveValue.addressDetails===""){
            hmsPopup.showPopup("详细地址不能为空");

          }else if($scope.saveValue.saleAreaId===""){
            hmsPopup.showPopup("所属大区不能为空");

          }else if($scope.validCredit==false){

          }else if($scope.validParagraph==false){

          }else if($scope.saveValue.addressCountry==1037) {
            if ($scope.saveValue.creditCode === '' && $scope.saveValue.dutyParagraph === '') {
              hmsPopup.showPopup("税号与社会统一信用代码不能同时为空");

            }else{
              if(customerDetailService.getIsEdit()){
                if($scope.imagevalue =='build/img/application/information/camera3x.png'||
                $scope.imageUrl == $scope.imagevalue){
                  $scope.save();
                }else {
                  customerService.uploadImage($scope.imagevalue, success, error);
                  //$scope.save();
                }
              }else {
                if($scope.imagevalue =='build/img/application/information/camera3x.png'){
                  $scope.save();
                }else {
                  customerService.uploadImage($scope.imagevalue, success, error);
                  //$scope.save();
                }
              }


            }
          }else {
            if($scope.imagevalue =='build/img/application/information/camera3x.png'){
              $scope.save();
            }else {
              customerService.uploadImage($scope.imagevalue, success, error);
            }
          }
        },500);

      }


    //客户审批
      var customerCheckSuccess = function(data){
        $scope.showCrmLoading = false;
        if(data.returnCode == 'S'){
          hmsPopup.showPopup(data.returnMsg);
          }else{
          if(data.returnMsg){
            hmsPopup.showPopup(data.returnMsg);
          }else {
            hmsPopup.showPopup('提交失败，请检查网络或者联系管理员！');
          }
        }
        $state.go('tab.customer-detail',{
          customerDetail:$scope.customer
        });
        };

      var successConfirm = function (res,data) {
        console.log('提交审核：==='+res);
        if(res){
          customerService.submitReview(customerCheckSuccess,data);
        }else {
          $state.go('tab.customer-detail',{
            customerDetail:$scope.customer
          });
        }
      }

      //保存
      $scope.save = function () {
           if(customerDetailService.getIsEdit()){
             hmsPopup.showLoading();
             var teamUrl=baseUrl+"save_customer";
             hmsHttp.post(teamUrl,$scope.saveValue).success(function(data){
               hmsPopup.hideLoading();
               if(data.returnCode==='S'){
                 customerAddService.setIsAdd(false);
                 customerService.setIsCustomer(false);
                 customerAddService.setCustomer({});
                 customerDetailService.setIsEdit(false);
                 customerDetailService.setIsContact(true);
                 customerDetailService.setIsCustomerAdd(true);
                 customerDetailService.setTabNumber(1);
                 if(customerDetailService.getEditCustomer().approveTypeName!='已提交'&&customerDetailService.getEditCustomer().approveTypeName!='已审核'){
                   hmsPopup.confirmCrmCheck('修改成功，是否现在提交审核？',$scope,successConfirm,customerDetailService.getEditCustomer().customerId);
                 }else{
                   hmsPopup.showPopup('修改成功！');
                   $state.go('tab.customer-detail');
                 }

               }else if(data.returnCode==='E'){
                 if(data.returnMsg){
                   hmsPopup.showPopup(data.returnMsg);
                 } else {
                   hmsPopup.showPopup('保存失败，请检查网络或联系管理员');
                 }
               }
             })
           }else {
             hmsPopup.showLoading();
             var teamUrl=baseUrl+"add_customer";
             hmsHttp.post(teamUrl,$scope.saveValue).success(function(data){
               hmsPopup.hideLoading();
               if(data.returnCode==='S'){
                 //hmsPopup.showPopup('保存成功!请添加联系人。');
                 customerAddService.setIsAdd(false);
                 customerAddService.setCustomer({});
                 customerService.setIsCustomer(false);
                 customerDetailService.setIsEdit(false);
                 customerDetailService.setIsContact(true);
                 customerDetailService.setTabNumber(2);
                 window.localStorage.customerId = data.customer.customerId;
                 customerDetailService.setCustomerId(data.customer.customerId);
                 customerDetailService.setIsCustomerAdd(true);
                 hmsPopup.confirmCrmCheck('保存成功，是否现在提交审核？',$scope,successConfirm,data.customer.customerId);
                 $scope.customer =data.customer;

               }else if(data.returnCode==='E'){
                 hmsPopup.showPopup(data.returnMsg);
               } else {
                 hmsPopup.showPopup('保存失败，请检查网络或联系管理员');
               }
             })
           }

      }

      $scope.closeBigPic = function(){
        $scope.showBig = false;
      }


      $scope.isShow_image = false;
      $scope.va_phote_succflag = false;
      $scope.showImageUploadChoices = function() {
        if (ionic.Platform.isWebView()) {
          var options = {
            title:'请选择客户Logo图片',
            buttonLabels: ['拍照', '从相册中选择','查看大图'],
            addCancelButtonWithLabel: '取消',
            androidEnableCancelButton: true,
            androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT
          };

          document.addEventListener("deviceready", function () {
            $cordovaActionSheet.show(options)
              .then(function (btnIndex) {
                if (baseConfig.debug) {
                  warn(btnIndex);
                }
                if (btnIndex == 1) {
                  // 拍照
                  $scope.taskPicture();
                  return true;
                } else if (btnIndex == 2) {
                  // 相册文件选择上传
                  $scope.readalbum();
                  return true;
                } else if (btnIndex == 3) {
                  if($scope.imagevalue == "")
                    hmsPopup.showPopup('请先选择图片');
                  else{
                    $scope.showBig = true;
                    return true;
                  }
                }
              });
          }, false);
        } else {
          hmsPopup.showShortCenterToast('暂不支持网页端的头像上传!');
        }
      };


        //相册功能
      $scope.readalbum  = function() {
        var sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
        var options = {
          quality: 20,
          sourceType: sourceType,
          destinationType: Camera.DestinationType.FILE_URL, //1, //'FILE_URL',
          encodingType: Camera.EncodingType.JPEG, //0, //'JPEG',
          mediaType: Camera.MediaType.PICTURE, //0, //'PICTURE',
          saveToPhotoAlbum: false,
          cameraDirection: Camera.Direction.BACK, // 0, //'BACK'
          //targetWidth: 1366, targetHeight: 768,
          correctOrientation: true
        };
        if (navigator.camera) {
          navigator.camera.getPicture(onSuccess, onFail, options);
        } else {
          alert("Camera 插件未安装!");
        }
        function onSuccess(imageUrl) {
          $scope.imagevalue = imageUrl;
          $scope.va_phote_succflag = true;

          try {
            if ($scope.va_phote_succflag == true) {

              var imageParam = {
                imagePath: $scope.imagevalue
              };

              cordova.plugins.ImageExt.cropimage(
                function success(newPath) {
                  $scope.$apply(function () {
                    $scope.imagevalue = newPath;
                  });
                },
                function fail(err) {
                  $scope.va_phote_succflag = false;
                }, imageParam.imagePath);

              // var imageParam = {
              //   imagePath: $scope.imagevalue,
              //   radius: 200
              // };
              //
              // cordova.plugins.ImageExt.cropCircleDrawable(
              //   function success(newPath) {
              //     $scope.$apply(function () {
              //       $scope.imagevalue = newPath;
              //     });
              //   },
              //   function fail(err) {
              //     $scope.va_phote_succflag = false;
              //   }, imageParam.imagePath, imageParam.radius);

              // plugins.crop.promise($scope.imagevalue, options)
              //   .then(function psuccess(newPath) {
              //     $scope.$apply(function () {
              //       //$scope.person_imgsrc = newPath;
              //       $scope.imagevalue = newPath;
              //     });
              //   })
              //   .catch(function fail(err) {
              //     //$scope.person_imgsrcvalue = '';
              //     $scope.va_phote_succflag = false;
              //     //$scope.Toast.show('取消裁剪功能');
              //   });
            }
            ;
          } catch (e) {
            alert(e.message)
          }
        }
        function onFail(message) {
          $scope.va_phote_succflag = false;
          alert('Failed because: ' + message);
        }

      };
      //相机功能
      $scope.taskPicture  = function(type) {
        var options = {
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          quality: 30,
          correctOrientation: true
        };
        $cordovaCamera.getPicture(options).then(function(imageURI) {

          $scope.imagevalue = imageURI;
          $scope.isShow_image = true;

          var imageParam = {
            imagePath: $scope.imagevalue
          };

          cordova.plugins.ImageExt.cropimage(
            function success(newPath) {
              $scope.$apply(function () {
                $scope.imagevalue = newPath;
              });
            },
            function fail(err) {
              $scope.va_phote_succflag = false;
            }, imageParam.imagePath);

        }, function(err) {
          //$scope.person_imgsrcvalue = '';
          //$scope.Toast.show('取消使用相机功能');
        });
      };



      $scope.$on('$ionicView.beforeEnter', function (e) {
        console.log(customerAddService.getIsAdd());
        console.log("这是enter的IsADD"+customerAddService.getIsAdd());
        console.log("这是enter的IsADD"+addApplicationService.getIsApplication());
        if(customerAddService.getIsAdd()===false){
          $state.go('tab.customers');
        }else
         if(addApplicationService.getIsApplication()===false){
              addApplicationService.cleanApplication();
              $ionicScrollDelegate.scrollTop(false);
              $scope.loading();
           if(customerDetailService.getIsEdit()){
             $scope.editCustomer();
           }
        }else{
          addApplicationService.setIsApplication(false);
          $ionicScrollDelegate.scrollBottom(false);
        }
      } )




    }])

angular.module('customerModule')
  .service('improveInformationService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function (hmsHttp,
              hmsPopup,
              baseConfig) {

      var isEdit = false;
      return {
        setIsEdit:function(val){
          isEdit=val;
        },
        getIsEdit:function(){
          return isEdit;
        }
      }


    }])


  .directive('handWholePicture',function($templateCache,$ionicModal){
    return{
      restrict:'ACE',
      scope:{
        pictureList:'=picturelist',
        pictureNumber:'=picturenumber'
      },
      template:'<div style="width: 95px;float: left;text-align: center;margin-right:-10px ;">'+
      '<img ng-src="{{pictureList[pictureNumber]}}" ng-click="showBigPic(pictureNumber)" style="width: 70px;height: 65px;background-color: transparent;border: 2px solid #ffffff;"/>'+
      '<i class="ion-ios-trash-outline" style="font-size: 25px;" ng-click="deleteImg(pictureNumber)"></i>'+
      '</div>',
      link:function($scope,element,attrs){
        $templateCache.put("new-picture-modal.html",'<ion-modal-view>'+
          '<ion-content>'+
          '<ion-scroll overflow-scroll="false" direction="xy" scrollbar-x="false" scrollbar-y="false" zooming="true" min-zoom="1" class="scroll-height" ng-click="hideBigPicture()" style="height: 100%;">'+
          '<div class="picture-position" style="background-image: url({{wholePicBack}});height: 100%;"></div>'+
          '</ion-scroll>'+
          '</ion-content>'+
          '</ion-modal-view>');
        $ionicModal.fromTemplateUrl('new-picture-modal.html', {//拿到modal
          scope: $scope
        }).then(function (modal1) {
          $scope.mymodal1 = modal1;
        });

        $scope.wholePicBack="";

        $scope.showBigPic=function(number){
            $scope.wholePicBack=$scope.pictureList[number];
            $scope.mymodal1.show();
        };
        $scope.deleteImg = function (index) {
          $scope.pictureList.splice(index,1);
        }

        $scope.hideBigPicture=function(){//隐藏大图
          $scope.mymodal1.hide();
        };
      }
    }
  })


