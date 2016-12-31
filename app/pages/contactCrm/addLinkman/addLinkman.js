/**
 * Created by wangkaihua on 16/10/09.
 */
angular.module('contactModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.addLinkman', {
          url: '/addLinkman',
          params: {
            param: {}
          },
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/contactCrm/addLinkman/addLinkman.html',
              controller: 'addLinkmanCtrl'
            }
          }
        })
        .state('tab.addLinkman2', {
          url: '/addLinkman',
          params: {
            param: {}
          },
          views: {
            'tab-contactCrm': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/contactCrm/addLinkman/addLinkman.html',
              controller: 'addLinkmanCtrl'
            }
          }
        })
    }]);
angular.module('contactModule')
  .controller('addLinkmanCtrl',
  ['$scope',
    '$state',
    '$ionicHistory',
    'history',
    'hmsPopup',
    '$timeout',
    'contactLocal',
    'CloneData',
    'hmsHttp',
    '$ionicModal',
    '$stateParams',
    'baseConfig',
    'addLinkmanService',
    '$rootScope',
    '$http',
    '$ionicScrollDelegate',
    'competitorListService',
    'customerDetailService',
    function ($scope,
              $state,
              $ionicHistory,
              history,
              hmsPopup,
              $timeout,
              contactLocal,
              CloneData,
              hmsHttp,
              $ionicModal,
              $stateParams,
              baseConfig,
              addLinkmanService,
              $rootScope,
              $http,
              $ionicScrollDelegate,
              competitorListService,
              customerDetailService) {
      console.log($stateParams.param);
      $scope.hideAreaFlag = [];
      $scope.items = [];
      $scope.moreDataCanBeLoaded = false;
      console.log($ionicHistory.viewHistory().backView);
      /*    $scope.showCrmLoading=false;//loading展示*/
      $scope.$on('$ionicView.enter', function (e) {
        console.log($stateParams.param);
        if (isNotNullObj($stateParams.param)) {
          $scope.data = {
            "contactId": $stateParams.param.contactId,
            "customerId": $stateParams.param.customerId,
            "contactType": $stateParams.param.contactType,
            "name": $stateParams.param.name,
            "sex": $stateParams.param.sex,
            "isPrimary":$stateParams.param.isPrimary,
            "department": $stateParams.param.department,
            "position": $stateParams.param.position,
            "phone": $stateParams.param.phone,
            "tel": $stateParams.param.tel,
            "email": $stateParams.param.email,
            "wechat": $stateParams.param.wechat,
            "role": $stateParams.param.role,
            "status": "HCRM_ENABLE",
            "addressCountry": $stateParams.param.addressCountry,
            "addressProvince": $stateParams.param.addressProvince,
            "addressCity": $stateParams.param.addressCity,
            "addressZone": $stateParams.param.addressZone,
            "addressDetails": $stateParams.param.addressDetails,
            "addressZipCode": $stateParams.param.addressZipCode
          };
          $scope.showData = {
            name: $stateParams.param.name,
            sexValue: $stateParams.param.sexValue,//性别
            department: $stateParams.param.department,//部门
            position: $stateParams.param.position,//职务
            contactTypeValue: $stateParams.param.contactTypeValue,//联系人类别
            contactType: $stateParams.param.contactType,
            contactId: $stateParams.param.contactId,//关联客户
            fullName: $stateParams.param.fullName,//关联客户名称
            roleValue: $stateParams.param.roleValue,//联系人角色
            phone: $stateParams.param.phone,//手机号
            address: $stateParams.param.address,
            detailAddress: $stateParams.param.detailAddress,
            addressCity: $stateParams.param.addressCity,
            addressZone: $stateParams.param.addressZone,
            addressDetails: $stateParams.param.addressDetails,
            tel: $stateParams.param.tel,//办公电话
            wechat: $stateParams.param.wechat,
            addressZipCode: $stateParams.param.addressZipCode,//邮编
            remark: $stateParams.param.remark,//备注
            status: $stateParams.param.status,
            statusValue: $stateParams.param.statusValue
          };
          $scope.pushNotification.checked = false;
          if($scope.data.isPrimary=="Y"){
            $scope.importantContact.checked = true;
          }else{
            $scope.importantContact.checked = false;
          }
          function getCustomerDetailSuccess(response) {
            if (response.returnCode == "S") {
              $scope.customer = response.customer_detail;
              console.log($scope.customer);
              $scope.data.addressCountry=response.customer_detail.addressCountry;
              $scope.data.addressProvince=response.customer_detail.addressProvince;
              $scope.data.addressCity=response.customer_detail.addressCity;
              $scope.data.addressZone=response.customer_detail.addressZone;
              $scope.showData.address=response.customer_detail.countryName+response.customer_detail.provinceName+response.customer_detail.cityName+response.customer_detail.zoneName;
              $scope.data.addressDetails=response.customer_detail.addressDetails;
            }
          }
          if($stateParams.param.customerId!=""&&$stateParams.param.customerId!=undefined){
            customerDetailService.getCustomerDetail(getCustomerDetailSuccess, $stateParams.param.customerId);
          }
          console.log($scope.data);
        } else {
          $scope.data = {
            "contactId": "",
            "customerId": "",
            "contactType": "",
            "name": "",
            "sex": "",
            "isPrimary":"N",
            "department": "",
            "position": "",
            "phone": "",
            "tel": "",
            "email": "",
            "wechat": "",
            "role": "",
            "status": "HCRM_ENABLE",
            "addressCountry": "",
            "addressProvince": "",
            "addressCity": "",
            "addressZone": "",
            "addressDetails": "",
            "addressZipCode": ""
          };
          $scope.showData = {
            name: "",
            sexValue: "",//性别
            department: "",//部门
            position: "",//职务
            contactTypeValue: "",//联系人类别
            contactType: "",
            contactId: "",//关联客户
            fullName: "",//关联客户名称
            roleValue: "",//联系人角色
            phone: "",//手机号
            address: "",
            detailAddress: "",
            addressCity: "",
            addressZone: "",
            addressDetails: "",
            tel: "",//办公电话
            wechat: "",
            addressZipCode: "",//邮编
            remark: "",//备注
            status: "HCRM_ENABLE",
            statusValue: "有效"
          };
        }
      });


      $scope.nowSelectTarget = {};
      $scope.cancleSaveLinkman = function () {
        /*  $ionicHistory.goBack();*/
        /* console.log($ionicHistory.viewHistory().backView);*/
        if ($ionicHistory.viewHistory().backView) {
          $ionicHistory.goBack();
        } else {
          $state.go('tab.application');
        }
      };
      $rootScope.img = "build/img/tabs/edit_add@3x_5.png";
      $scope.pushNotificationChange = function () {
        $scope.pushNotification.checked=!$scope.pushNotification.checked;
        console.log($scope.pushNotification);
        console.log('Push Notification Change', $scope.pushNotification.checked);
      };
      $scope.importantContactChange= function () {
        $scope.importantContact.checked=!$scope.importantContact.checked;
        console.log('Push contact Change', $scope.importantContact.checked);
      };
      $scope.hideArea = function (num) {
        $scope.hideAreaFlag[num] = !$scope.hideAreaFlag[num];
        $ionicScrollDelegate.$getByHandle("slideimgs").resize();
      };
      /*      if (isNotNullObj($stateParams.param)) {
       $scope.showData = $stateParams.param;
       console.log($scope.showData);
       } else {
       $scope.showData = {
       name: "",
       sexValue: "",//性别
       department: "",//部门
       position: "",//职务
       contactTypeValue: "",//联系人类别
       contactType: "",
       contactId: "",//关联客户
       fullName: "",//关联客户名称
       roleValue: "",//联系人角色
       phone: "",//手机号
       email: "",
       addressCountry: "",
       addressProvince: "",
       addressCity: "",
       addressZone: "",
       addressDetails: "",
       tel: "",//办公电话
       wechat: "",
       addressZipCode: "",//邮编
       remark: "",//备注
       statusValue: "有效"
       };
       console.log($scope.showData);
       }*/
      $scope.searchModel = {
        searchValueKey: ""
      };
      $scope.nowPage = 1;
      $scope.pageSize = 15;
      $scope.sourceItems = [];
      $scope.noDataFlag = false;
      $scope.screenHeig = window.innerHeight;
      $scope.pushNotification = {checked: true};
      $scope.importantContact={checked:false};
      $scope.bilingual = CloneData.getQuickCreate();
      console.log($scope.bilingual);
      var upData = [
        {
          "code": "HCRM.CONTACTS_SEX",
          "lastUpdateDate": "CONTACTS_SEX_DATE",
          localList: 'CONTACTS_SEX'
        },
        {
          "code": "HCRM.CONTACTS_ROLE",
          "lastUpdateDate": "CONTACTS_ROLE_DATE",
          localList: 'CONTACTS_ROLE'
        },
        {
          "code": "HCRM.CONTACTS_TYPE",
          "lastUpdateDate": "CONTACTS_TYPE_DATE",
          localList: 'CONTACTS_TYPE'
        },
        {
          "code": "HCRM.CONTACTS_STATUS",
          "lastUpdateDate": "HCRM.CONTACTS_STATUS_DATE",
          localList: 'CONTACTS_STATUS'
        }
      ];
      var getValueObjByCode = function (code) {
        console.log(code);
        for (var i = 0; i < upData.length; i++) {
          if (code == upData[i].code)
            return cloneObj(upData[i]);
        }

      };
      /*  console.log(JSON.parse(window.localStorage.sexdata));*/
      var listInitSuccess = function (response) {
        console.log("--------")
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
          }
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
      function isContains(str, substr) {
        return new RegExp(substr).test(str);
      }

      Array.prototype.clone = function () {
        return [].concat(this);
      };
      $scope.saveLinkman = function () {
        hmsPopup.showLoading("保存中");
        console.log($scope.data);
        console.log($scope.showData);
        console.log(angular.toJson($scope.data));
        console.log("呵呵呵呵");
        console.log($scope.data.contactType);
        if ($scope.importantContact.checked == true){
          $scope.data.isPrimary="Y";
        }else{
          $scope.data.isPrimary="N";
        }
        if($scope.data.customerId==""){
          hmsPopup.hideLoading();
          hmsPopup.showPopup("请选择关联客户");
        }
        else if ($scope.data.contactType == "") {
          /*   $scope.showLoading = false;*/
          hmsPopup.hideLoading();
          hmsPopup.showPopup("联系人类型不能为空")
        } else if ($scope.data.name == "") {
          hmsPopup.hideLoading();
          hmsPopup.showPopup("联系人姓名不能为空")
        } else if ($scope.data.department == "") {
          hmsPopup.hideLoading();
          hmsPopup.showPopup("部门不能为空")
        } else if ($scope.data.position == "") {
          hmsPopup.hideLoading();
          hmsPopup.showPopup("职务不能为空")
        } else if ($scope.data.status == "") {
          hmsPopup.hideLoading();
          hmsPopup.showPopup("状态不能为空")
        } else if ($scope.data.phone == "") {
          hmsPopup.hideLoading();
          hmsPopup.showPopup("手机号码不能为空")
        } else if ((phoneNumber($scope.data.phone) || phoneNumber86($scope.data.phone) ) == false) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup("手机号码格式错误")
        } else if ($scope.data.email == "") {
          hmsPopup.hideLoading();
          hmsPopup.showPopup("电子邮箱不能为空")
        } else if (isEmailAddress($scope.data.email) == false) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup("电子邮箱格式错误")
        } else if ($scope.data.addressCountry == "") {
          hmsPopup.hideLoading();
          hmsPopup.showPopup("地址不能为空")
        } else if ($scope.data.addressDetails == "") {
          hmsPopup.hideLoading();
          hmsPopup.showPopup("地址不能为空")
        }
        else {
          //保存到通讯录
          if ($scope.pushNotification.checked == true) {
            var info = {
              email: $scope.data.email,
              mobil: $scope.data.phone,
              emp_name: $scope.data.name,
              organization: $scope.data.department
            };
            var onSaveContactSuccess = function () {
              hmsPopup.hideLoading();
              hmsPopup.showShortCenterToast("添加成功");
            };
            var onSaveContactError = function () {
              hmsPopup.hideLoading();
              hmsPopup.showShortCenterToast("添加失败");
            };
            //保存到本地
            contactLocal.contactLocal(info,onSaveContactSuccess,onSaveContactError);
          }
          var initAddContactSuccess = function (data) {
            hmsPopup.hideLoading();
            if (data.returnCode == "S") {
              $stateParams.param={};
              $scope.data = {
                "contactId": "",
                "customerId": "",
                "contactType": "",
                "name": "",
                "sex": "",
                "department": "",
                "position": "",
                "phone": "",
                "tel": "",
                "email": "",
                "wechat": "",
                "role": "",
                "status": "HCRM_ENABLE",
                "addressCountry": "",
                "addressProvince": "",
                "addressCity": "",
                "addressZone": "",
                "addressDetails": "",
                "addressZipCode": ""
              };
              $scope.showData = {
                name: "",
                sexValue: "",//性别
                department: "",//部门
                position: "",//职务
                contactTypeValue: "",//联系人类别
                contactType: "",
                contactId: "",//关联客户
                fullName: "",//关联客户名称
                roleValue: "",//联系人角色
                phone: "",//手机号
                address: "",
                detailAddress: "",
                addressCity: "",
                addressZone: "",
                addressDetails: "",
                tel: "",//办公电话
                wechat: "",
                addressZipCode: "",//邮编
                remark: "",//备注
                status: "HCRM_ENABLE",
                statusValue: "有效"
              };
              $rootScope.$broadcast("REFRESH_ADD_LINKMAN");
              hmsPopup.showShortCenterToast(data.returnMsg);
              $timeout(function () {
                $ionicHistory.goBack();
              });
            }else{
              if(data.returnMsg){
                $scope.showContent=true;
                hmsPopup.showPopup(data.returnMsg);
                console.log(data.returnMsg);
              }else{
                hmsPopup.showShortCenterToast('服务器系统出现异常，请联系管理员！')
              }
            }

          };
          if ($stateParams.param.type == "update") {
            var statusurl = baseConfig.basePath + "contact_update";
            hmsHttp.post(statusurl, $scope.data).success(function (data) {
              hmsPopup.hideLoading();
              $rootScope.$broadcast("REFRESH_LINKMAN_UPDATE");
              hmsPopup.showShortCenterToast(data.returnMsg);
              console.log($ionicHistory.viewHistory().backView);
              $timeout(function () {
                $ionicHistory.goBack();
              });
            });
          } else {
            addLinkmanService.addContact(initAddContactSuccess, $scope.data);
          }
        }
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
      var showValueInList = function (code) {
        $scope.showCrmLoading = false;
        var valueObj = getValueObjByCode(code);
        $scope.items = $scope.items.concat(JSON.parse(window.localStorage[valueObj.localList]));
        $scope.sourceItems = $scope.items.clone();
      };
      //通用选择弹窗
      $scope.selectTargets = [{
        'key': 'contact',
        'interface': addLinkmanService.searchCustomer,  //获得选择项的接口
        'params': [getCustomerSuccess, $scope.searchModel.searchValueKey,$scope.nowPage, $scope.pageSize],  //获得选择项时接口所需参数
        'showKey': 'fullName',            //选择界面显示的数据
        'dataKey': 'customerId',      //对象内最终操作提交所需的数据变量
        'dataModel': '$scope.data.customerId',  //最终操作提交所需的数据变量
        'showDataModel': '$scope.showData.fullName', //显示在界面上的ng-model
        'searchInterface': addLinkmanService.searchCustomer,
        'searchParams': getCustomerSearchSuccess,
        'needShowMore': true
      }, {
        'key': 'contactRole',
        'interface': showValueInList,
        'params': ['HCRM.CONTACTS_ROLE'],
        'showKey': 'description',
        'dataKey': 'value',
        'dataModel': '$scope.data.role',
        'showDataModel': '$scope.showData.roleValue'
      }, {
        'key': 'status',
        'interface': showValueInList,
        'params': ['HCRM.CONTACTS_STATUS'],
        'showKey': 'description',
        'dataKey': 'value',
        'dataModel': '$scope.data.status',
        'showDataModel': '$scope.showData.statusValue'
      }, {
        'key': 'contactType',
        'interface': showValueInList,
        'params': ['HCRM.CONTACTS_TYPE'],
        'showKey': 'description',
        'dataKey': 'value',
        'dataModel': '$scope.data.contactType',
        'showDataModel': '$scope.showData.contactTypeValue'
      }, {
        'key': 'sex',
        'interface': showValueInList,
        'params': ['HCRM.CONTACTS_SEX'],
        'showKey': 'description',
        'dataKey': 'value',
        'dataModel': '$scope.data.sex',
        'showDataModel': '$scope.showData.sexValue'
      }
      ];
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

      $ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal) {
        $scope.crmSelectModal = modal;
      });

      $scope.showSelectDiv = function (key) {
        $scope.moreDataCanBeLoaded = false;
        $scope.searchModel.searchValueKey = '';
        $scope.nowPage = 1;
        //打开模态框
        if ($scope.showSelect) {
          $scope.showCrmLoading = false;
          $scope.crmSelectModal.hide();
        } else {
          $scope.crmSelectModal.show();
          $scope.showCrmLoading = true;
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

      $scope.selectItem = function ($index) {
        var data = $scope.items[$index][$scope.nowSelectTarget['dataKey']];  //接口所需数据
        var showKey = $scope.items[$index][$scope.nowSelectTarget['showKey']];
        showKey = (showKey == '空') ? "" : showKey;
        var dataModel = $scope.nowSelectTarget['dataModel'];                 //最终操作提交所需的数据变量
        var showDataModel = $scope.nowSelectTarget['showDataModel'];         //显示用的数据变量ng-model
        eval(dataModel + " = data");
        eval(showDataModel + " = showKey");
        if ($scope.nowSelectTarget['key'] == 'contact') {
          /*   $scope.data.customerId = '';
           $scope.showData.fullName = '';*/
          /*  console.log($scope.items[$index]);
           $scope.showData.fullName =  $scope.items[$index].customerName;
           $scope.data.customerId =  $scope.items[$index].customerId;*/
          function getCustomerDetailSuccess(response) {
            if (response.returnCode == "S") {
              $scope.customer = response.customer_detail;
              console.log($scope.customer);
              $scope.data.addressCountry=response.customer_detail.addressCountry;
              $scope.data.addressProvince=response.customer_detail.addressProvince;
              $scope.data.addressCity=response.customer_detail.addressCity;
              $scope.data.addressZone=response.customer_detail.addressZone;
              $scope.showData.address=response.customer_detail.countryName+response.customer_detail.provinceName+response.customer_detail.cityName+response.customer_detail.zoneName;
              $scope.data.addressDetails=response.customer_detail.addressDetails;
            }
          }
          customerDetailService.getCustomerDetail(getCustomerDetailSuccess, $scope.data.customerId);
        }
        $scope.showSelectDiv();
      };
      $scope.clearSelectFilter = function(){
        $scope.searchModel.searchValueKey = '';
        $scope.searchSelectValue();
        $ionicScrollDelegate.scrollTop();
      };
      /*      $scope.clearSelectFilter = function () {
       $scope.nowPage = 1;
       $scope.searchModel.searchValueKey = '';
       $scope.searchSelectValue();
       $ionicScrollDelegate.scrollTop();
       /!* $scope.items = $scope.data.clone();*!/
       };*/
      $scope.searchSelectValue = function(){
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
        if($scope.nowSelectTarget['searchInterface']){
          //需要接口搜索的
          $scope.showCrmLoading = true;
          $scope.moreDataCanBeLoaded = false;
          /*       if($scope.searchModel.searchValueKey == ''){
           $scope.items = [];
           $scope.nowPage = 1;
           $scope.nowSelectTarget = cloneObj($scope.sourceTargetData);
           $scope.nowSelectTarget.interface.apply(null,$scope.nowSelectTarget.params);
           } else{*/
          $scope.items = [];
          $scope.nowPage = 1;
          $scope.pageSize = 15;
          $scope.nowSelectTarget.searchInterface.call(null,$scope.nowSelectTarget.searchParams,$scope.searchModel.searchValueKey,$scope.nowPage,$scope.pageSize);
          /* }*/
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
      ///////////////////////城市选择/////////////////////////////
      Array.prototype.clone = function () {
        return [].concat(this);
      };
      $scope.places = [];
      var CHINA_CODE = 1037;
      $scope.selectCity = {
        placeKey: ""
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
        $scope.showCrmLoading = true;
        $scope.selectCity.placeKey = '';
        var temp = getCountryObjById(parentAddressId);
        var baseUrl = baseConfig.basePath;
        var url = baseUrl + "query_address";
        hmsHttp.post(url, {"parentAddressId": parentAddressId}).success(function (data) {
          $scope.showCrmLoading = false;
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
              $scope.data.addressCountry = temp.addressId
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
        $scope.showCrmLoading = !$scope.showCrmLoading;
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
        $scope.showCrmLoading = true;
        if (flag == $scope.inChina)
          return;
        $scope.selectedPlaces = [];
        $scope.places = [];
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
    }])
angular.module('contactModule')
  .service('addLinkmanService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function (hmsHttp,
              hmsPopup,
              baseConfig) {

      var baseUrl = baseConfig.basePath;
      console.log("addlinkmand"+baseUrl);
      this.getCustomer = function (success, key) {
        hmsHttp.post(baseUrl + 'parent_customer', key).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
        });
      };
      this.addContact = function (success, key) {
        hmsHttp.post(baseUrl + 'add_contact', key).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (response, status) {
        });

      };
      //得到值列表
      this.getValueList = function (success, code, lastUpdateDate) {
        var params = {
          "lookupList": [{
            code: code,
            lastUpdateDate: lastUpdateDate
          }]
        };
        hmsHttp.post(baseUrl + 'query_lookup', params).success(function (result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function (error) {
        });
      };

      //得到客户列表
      this.getCustomers = function (success, page, pageSize) {
        var params = {
          page: page,
          pageSize: pageSize,
          queryType: 'MY_CUSTOMER'
        };
        hmsHttp.post(baseUrl + 'query_customer_list', params).success(function (result) {
          success(result);
        }).error(function (error) {
        });
      };
      this.searchCustomer = function (success, keyWord, page, pageSize) {
        var params = {
          keyWord: keyWord,
          page: page,
          pageSize: pageSize
        };
        hmsHttp.post(baseUrl + 'saleplan_customers', params).success(function (result) {
          success(result);
        }).error(function (error) {
        });
      };
    }
  ]);
