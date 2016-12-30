/**
 * update by wangkaihua on 16/10/9
 */
angular.module('contactModule')

  .controller('contactCrmCtrl', [
    '$scope',
    '$state',
    'historyContact',
    '$ionicModal',
    'T',
    'hmsPopup',
    'CloneData',
    'hmsHttp',
    'baseConfig',
    '$rootScope',
    'addLinkmanService',
    '$timeout',
    'customerLinkman',
    '$ionicHistory',
    '$ionicScrollDelegate',
    'competitorListService',
    'contactLocal',
    '$cordovaActionSheet',
    '$ionicActionSheet',
    'customerSearchService',
    'getInitStructureInfo',
    '$ionicPlatform',
    'contactService',
    function ($scope,
              $state,
              historyContact,
              $ionicModal,
              T,
              hmsPopup,
              CloneData,
              hmsHttp,
              baseConfig,
              $rootScope,
              addLinkmanService,
              $timeout,
              customerLinkman,
              $ionicHistory,
              $ionicScrollDelegate,
              competitorListService,
              contactLocal,
              $cordovaActionSheet,
              $ionicActionSheet,
              customerSearchService,
              getInitStructureInfo,
              $ionicPlatform,
              contactService) {

      console.log($ionicHistory.viewHistory());
      $scope.hasCrm = window.localStorage.crm == 'true';
      $scope.searched = {
        "page": 1,
        "pageSize": 10,
        "keyWord": ""
      };
      $scope.showLoading = true;
      $scope.doRefreshFlag = false;
      $scope.moreDataCanBeLoaded = false;//上拉加载
      $scope.goSearch = function () {
        $state.go('tab.contact-search');
      };
      var resultSuccessInit = function (result) {
        $scope.showLoading = false;
        if (result.returnCode == 'S') {
          for (var i = 0; i < result.customer_contact_list.length; i++) {
            if (result.customer_contact_list[i].sexName == "男") {
              result.customer_contact_list[i].sexImg = "build/img/contact/icon_man@3x.png";
            } else {
              result.customer_contact_list[i].sexImg = "build/img/contact/icon_female@3x.png";
            }
          }
          $scope.searchData = result.customer_contact_list;
        } else {
          hmsPopup.showPopup(result.returnMsg);
        }
      };
      $scope.searchLinkman = function () {
        $scope.showLoading = true;
        customerLinkman.getSearchResult(resultSuccessInit, $scope.searched);
      };
      var item = document.getElementById('customerLinkmaninput');

      $scope.hideAreaFlag = [];
      $scope.items = [];
      $scope.nowSelectTarget = {};
      console.log('customerLinkmanCtrl.enter');
      $scope.linkmanData = [];//联系人数据
      $scope.historyContact = [];//初始化常用客户联系人
      $scope.selectParam = "";//查询字段
      $scope.searchLink = true;//初始化显示
      $scope.showResult = false;
      $scope.linkmanData = [];
      $scope.hideAreaFlag = [];
      var url = baseConfig.basePath + "customer_contact_list";
      $scope.data = {
        pageSize: "10",
        page: "1",
        contactId: "",
        contactType: "",
        status: ""
      };
      $scope.showData = {
        contactType: "",
        status: ""
      };
      $scope.hideArea = function (num) {
        //显示更多
        $scope.hideAreaFlag[num] = !$scope.hideAreaFlag[num];
        $ionicScrollDelegate.$getByHandle("slideimgs").resize();
      };
      $scope.history = {};//临时存放历史记录
      $scope.goDetail = function (item) {
        console.log(item);
        $state.go('tab.contactDetail', {contactData: item});
        $scope.history.name = item.name;
        $scope.history.sex = item.sex;
        $scope.history.sexName = item.sexName;
        $scope.history.status = item.status;
        $scope.history.statusName = item.statusName;
        $scope.history.position = item.position;
        $scope.history.department = item.department;
        $scope.history.customerId = item.customerId;
        $scope.history.fullName = item.fullName;
        $scope.history.phone = item.phone;
        $scope.history.contactType = item.contactType;
        $scope.history.contactTypeName = item.contactTypeName;
        $scope.history.contactId = item.contactId;
        $scope.history.sexImg = item.sexImg;
        console.log($scope.history);
        console.log("临时存放");
        //存放历史记录
        if (!inArrayId($scope.historyContact, $scope.history.contactId)) {//判断是否已经存储
          historyContact.addHistory($scope.history);
        }
      };
      $scope.filterCustomer = function () {

      };
      $scope.clearInputContent = function () {
        $scope.selectParam = "";
      };
      //初始化历史记录
      $scope.init = function () {
      /*  $timeout(function(){
          $scope.showLoading = false;
        },3000);*/
        historyContact.getAllHistory(function (data) {
          console.log("初始化历史纪录");
          $scope.showLoading = false;
          console.log(data);    //还没保存数据目前打印的是空数组
          $scope.historyContact = data;
          $scope.$apply();
          /* $scope.birthdays = data;*/
        })
      };
      $scope.init();
      $rootScope.$on("REFRESH_CONTACT_HISTORY", function () {
        $scope.init();
      });
      //删除单条常用联系人
      $scope.deleteHisItem = function (item, index) {
        console.log(item);
        historyContact.removeHistory(item);
        $scope.historyContact.splice(index, 1);
      };
      //筛选框
      $ionicModal.fromTemplateUrl('build/pages/contactCrm/model/filterContactsModel.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.filterContactsModel = modal;
      });
      $scope.showFilterContactsModel = function () {
        $scope.filterContactsModel.show();
        console.log(screen.height);
        /*  $(".hmsModal").css("top", 112 + 'px')*/
       if(ionic.Platform.isAndroid()){
          $(".hmsModal").css("top", 92 + 'px');
        }else{
         $(".hmsModal").css("top", 112 + 'px');
       }

      };
      $scope.clearParam = function () {//重置
        $scope.data = {
          pageSize: 10,
          page: 1,
          contactId: "",
          contactType: "",
          status: ""
        };
        $scope.showData = {
          contactType: "",
          status: ""
        };
      };
      var getContactsListSuccessInit = function (data) {
        $scope.showLoading = false;
        console.log(data);
        if (data.returnCode == "S") {
          for (var i = 0; i < data.customer_contact_list.length; i++) {
            if (data.customer_contact_list[i].sexName == "男") {
              data.customer_contact_list[i].sexImg = "build/img/contact/icon_man@3x.png";
            } else {
              data.customer_contact_list[i].sexImg = "build/img/contact/icon_female@3x.png";
            }
          }
          $scope.linkmanData = $scope.linkmanData.concat(data.customer_contact_list);
          if (data.customer_contact_list.length < $scope.data.pageSize) {
            $scope.moreDataCanBeLoaded = false;
          }
        } else {
          $scope.moreDataCanBeLoaded = false;
          hmsPopup.showPopup(data.returnMsg);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      $scope.closeFilterContactsModel = function () {
        $scope.moreDataCanBeLoaded = true;
        $scope.linkmanData = [];
       /* $scope.data = {
          pageSize: "10",
          page: "1",
          contactId: "",
          contactType: "",
          status: ""
        };*/
        $scope.data.page=1;
        $scope.showLoading = true;
        $scope.doRefreshFlag = true;
        $scope.filterContactsModel.hide();
        $scope.showResult = true;
        $scope.hideAreaFlag[0] = true;
        customerLinkman.getGetContactsList(getListSuccessInitConcat, $scope.data);
      };
      $scope.loadMore = function () {
        $scope.data.page++;
        customerLinkman.getGetContactsList(getContactsListSuccessInit, $scope.data);
        /*    $timeout(function(){
         $ionicScrollDelegate.$getByHandle("slideimgs").resize();
         });*/
      };
      var getListSuccessInitConcat = function (result) {
        $scope.showLoading = false;
        if (result.returnCode == "S") {
          $scope.moreDataCanBeLoaded = true;
          for (var i = 0; i < result.customer_contact_list.length; i++) {
            if (result.customer_contact_list[i].sexName == "男") {
              result.customer_contact_list[i].sexImg = "build/img/contact/icon_man@3x.png";
            } else {
              result.customer_contact_list[i].sexImg = "build/img/contact/icon_female@3x.png";
            }
          }
          if (result.customer_contact_list.length < $scope.data.pageSize || result.customer_contact_list.length == 0) {
            $scope.moreDataCanBeLoaded = false;
          }
          $scope.linkmanData = result.customer_contact_list;
          /*     $timeout(function(){
           $ionicScrollDelegate.$getByHandle("slideimgs").resize();
           });*/

        }else{
          if(result.returnMsg){
            hmsPopup.showPopup(result.returnMsg)
          }else{
            hmsPopup.showPopup('服务器系统出现异常，请联系管理员！')
          }
        }
        $scope.$broadcast('scroll.refreshComplete');
      };
      $scope.doRefresh = function () {
        $scope.linkmanData = [];
        $scope.data = {
          pageSize: "10",
          page: "1",
          contactId: "",
          contactType: "",
          status: ""
        };
        $scope.showData = {
          contactType: "",
          status: ""
        };
        $scope.moreDataCanBeLoaded = false;
        customerLinkman.getGetContactsList(getListSuccessInitConcat, $scope.data);
      };
      $scope.items = [];
      var upData =
        [
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
            "lastUpdateDate": "CONTACTS_STATUS_DATE",
            localList: 'CONTACTS_STATUS'
          }
        ];
      $scope.searchModel = {
        searchValueKey: ""
      };
      function isContains(str, substr) {
        return new RegExp(substr).test(str);
      }

      Array.prototype.clone = function () {
        return [].concat(this);
      };
      /*  console.log(JSON.parse(window.localStorage.sexdata));*/
      var getValueObjByCode = function (code) {
        console.log(code);
        for (var i = 0; i < upData.length; i++) {
          if (code == upData[i].code)
            return cloneObj(upData[i]);
        }

      };
      var listInitSuccess = function (response) {
        console.log("--------");
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
        }
        ;
      };
      /*  console.log(upData);*/
      competitorListService.getValueList(listInitSuccess, upData);
      var showValueInList = function (code) {
        var valueObj = getValueObjByCode(code);
        $scope.items = $scope.items.concat(JSON.parse(window.localStorage[valueObj.localList]));
        $scope.sourceItems = $scope.items.clone();
      };
      //通用选择弹窗
      $scope.selectTargets = [{
        'key': 'contactType',
        'interface': showValueInList,  //获得选择项的接口
        'params': ['HCRM.CONTACTS_TYPE'],  //获得选择项时接口所需参数
        'showKey': 'description',
        'dataKey': 'value',
        'dataModel': '$scope.data.contactType',  //最终操作提交所需的数据变量
        'showDataModel': '$scope.showData.contactType' //显示在界面上的ng-model
      }, {
        'key': 'status',
        'interface': showValueInList,
        'params': ['HCRM.CONTACTS_STATUS'],
        'showKey': 'description',
        'dataKey': 'value',
        'dataModel': '$scope.data.status',
        'showDataModel': '$scope.showData.status'
      }
      ];
      $scope.clearSelectFilter = function () {
        console.log("clear");
        $scope.searchModel.searchValueKey = '';
        $scope.searchSelectValue();
        /* $scope.items = $scope.data.clone();*/
      };
      $scope.searchSelectValue = function () {
        if ($scope.nowSelectTarget['searchInterface']) {
          //需要接口搜索的
          if ($scope.searchModel.searchValueKey == '') {
            $scope.items = [];
            $scope.nowPage = 1;
            $scope.nowSelectTarget = cloneObj($scope.sourceTargetData);
            $scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
          } else {
            $scope.nowPage = 1;
            $scope.pageSize = 30;
            $scope.nowSelectTarget.searchInterface.call(null, $scope.nowSelectTarget.searchParams, $scope.searchModel.searchValueKey, $scope.nowPage, $scope.pageSize);
          }
        } else {
          //本地字段搜索的
          var notShowNum = 0;
          if ($scope.searchModel.searchValueKey == '') {
            $scope.noDataFlag = false;
            $scope.items = $scope.sourceItems.clone();
          }
          else {
            for (var i = 0; i < $scope.sourceItems.length; i++) {
              if (isContains($scope.sourceItems[i][$scope.nowSelectTarget['showKey']], $scope.searchModel.searchValueKey))
                $scope.items[i] = $scope.sourceItems[i];
              else {
                $scope.items[i] = '';
                notShowNum++;
              }
            }
            $scope.noDataFlag = notShowNum == $scope.sourceItems.length;
          }
        }
      };
      $ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal1) {
        $scope.crmSelectModal = modal1;
      });
      $scope.showSelectDiv = function (key) {
        $scope.searchModel.searchValueKey = '';
        $scope.nowPage = 1;
        //打开模态框
        if ($scope.showSelect) {
          $scope.showLoading = false;
          $scope.crmSelectModal.hide();
        } else {
          $scope.crmSelectModal.show();
        }
        $scope.showSelect = !$scope.showSelect;
        if (!$scope.showSelect)
          return;
        if (!$scope.showSelect) {
          $scope.items = [];
          return 0;
        }
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
        for (var i = 0; i < $scope.selectTargets.length; i++) {
          if (key == $scope.selectTargets[i].key) {
            $scope.nowSelectTarget = cloneObj($scope.selectTargets[i]);
            break;
          }
        }
        if ($scope.showSelect) {
          var showKey = $scope.nowSelectTarget['showKey'];
          var dataKey = $scope.nowSelectTarget['dataKey'];
          eval('$scope.items = [{' + showKey + ': "空",' + dataKey + ': ""}]');
        }
        console.log($scope.nowSelectTarget.params);
        $scope.sourceTargetData = cloneObj($scope.nowSelectTarget);
        $scope.showLoading = true;
        $scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
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
        $scope.showSelectDiv();
      };
      $rootScope.img = "build/img/tabs/edit_add@3x_5.png";
      console.log('contactCtrl.enter');
      $scope.subHeaders = [
        "客户", "同事"
      ];
      $scope.subHeadersSelect = [true];

      $scope.goback = function () {
        $ionicHistory.goBack();
      };
      $scope.bilingual = CloneData.getContactbilingual();
      console.log( $scope.bilingual);
      /*    $scope.$on('$ionicView.enter', function (e) {
       $ionicScrollDelegate.$getByHandle("slideimgs").resize();
       });*/

      $scope.$on('$destroy', function (e) {
        console.log('contactCtrl.$destroy');
      });
      $scope.showCustomer=0;
      $scope.selectSubHeader = function ($index) {
        console.log($index);
        $scope.showCustomer=$index;
        if ($scope.subHeadersSelect[$index])
          return 0;
        else {
          $scope.subHeadersSelect = [];
          $scope.subHeadersSelect[$index] = true;
        }
      };
      if(!$scope.hasCrm){
        $scope.selectSubHeader(1);
      }

      var pickContact = function(){

        ContactsPlugin.pickContact(function(response){
          var email = response.emailList.length == 0 ? "" : response.emailList[0].value;
          var phone = response.phoneList.length == 0 ? "" : response.phoneList[0].value;
          $scope.manInfo = {
            organization: response.orgName,
            emp_name: response.name,
            mobil: phone,
            email: email
          };
          $scope.saveToContacts();
        }, function(){
          hmsPopup.showPopup('选取错误，请重新选择');
        });
      };
      $scope.saveToLocalContacts = function () {
        var info = {
          email: $scope.manInfo.email,
          mobil: $scope.manInfo.mobil,
          emp_name: $scope.manInfo.emp_name,
          organization: $scope.manInfo.organization
        };
        var onSaveContactSuccess = function () {
          hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast("添加成功");
          if($scope.hasCrm)
            $scope.crmScanCardModal.hide();
          else
            $scope.scanCardModal.hide();
        };
        var onSaveContactError = function () {
          hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast("添加失败");
          if($scope.hasCrm)
            $scope.crmScanCardModal.hide();
          else
            $scope.scanCardModal.hide();
        };
        //保存到本地
        contactLocal.contactLocal(info, onSaveContactSuccess, onSaveContactError);
      };

      $scope.set2localContact = function () {
        contactService.contactLocal($scope.manInfo,$scope.scanCardModal);
      };

      function dealScanData(msg) { //处理名片扫描插件的返回数据
        // alert("msg " + jsonFormat(JSON.parse(msg)));
        console.log("HEHEHEHEHEHH");
        try {
          if (JSON.parse(msg)) {
            $scope.manInfo = {
              emp_name: '',
              mobil: '',
              email: '',
              organization: ''
            };
            msg = JSON.parse(msg);
            try {
              $scope.manInfo.emp_name = msg.formatted_name[0].item;
            } catch (e) {
              try {
                $scope.manInfo.emp_name = msg.name[0].item.family_name + msg.name[0].item.given_name;
              } catch (e) {
                $scope.manInfo.emp_name = '';
              }
            }
            try {
              var phones = msg.telephone;
              if (phones.length > 0) {
                $scope.manInfo.mobil = phones[0].item.number;
              } else {
                $scope.manInfo.mobil = "";
              }
            } catch (e) {
              $scope.manInfo.mobil = '';
            }
            try {
              var emails = msg.email;
              if (emails.length > 0) {
                $scope.manInfo.email = emails[0].item;
              }
            } catch (e) {
              $scope.manInfo.email = '';
            }
            try {
              var organization = msg.organization;
              if (organization.length > 0) {
                $scope.manInfo.organization = organization[0].item.name;
              }
            } catch (e) {
              $scope.manInfo.organization = '';
            }

            try {
              angular.element('.contact').css({
                'WebkitFilter': 'blur(5px) brightness(1)',
                'filter': 'blur(5px) brightness(1)'
              });
              $scope.$apply();
              $scope.scanCardModal.show();
            } catch (e) {
            }
          }
          hmsPopup.hideLoading();
        } catch (e) {
          hmsPopup.showShortCenterToast('扫描失败！请重新扫描！');
          hmsPopup.hideLoading();
        }
      };

      function dealCrmScanData(msg) { //处理名片扫描插件的返回数据
        console.log(JSON.parse(msg));
        try {
          console.log(JSON.parse(msg));
          if (JSON.parse(msg)) {
            $scope.manInfo = {
              emp_name: '',
              mobil: '',
              email: '',
              organization: '',
              fullName: "",
              department:"",
              position:"",
              street:"",
              postal_code:""
            };
            msg = JSON.parse(msg);
            console.log(angular.toJson(msg));
            $scope.testI = msg;
            console.log(angular.toJson(msg));
            try {
              $scope.manInfo.emp_name = msg.formatted_name[0].item;
            } catch (e) {
              try {
                $scope.manInfo.emp_name = msg.name[0].item.family_name + msg.name[0].item.given_name;
              } catch (e) {
                $scope.manInfo.emp_name = '';
              }
            }
            try {
              var phones = msg.telephone;
              if (phones.length > 0) {
                $scope.manInfo.mobil = phones[0].item.number;
              } else {
                $scope.manInfo.mobil = "";
              }
            } catch (e) {
              $scope.manInfo.mobil = '';
            }
            try {
              var emails = msg.email;
              if (emails.length > 0) {
                $scope.manInfo.email = emails[0].item;
              }
            } catch (e) {
              $scope.manInfo.email = '';
            }
            try {
              var organization = msg.organization;
              if (organization.length > 0) {
                /*  $scope.manInfo.organization = organization[1].item.name;
                 $scope.manInfo.department = organization[0].item.name;*/
                if(organization[0].item.hasOwnProperty('name')){
                  $scope.manInfo.organization = organization[0].item.name;
                  $scope.manInfo.department="";
                }else{
                  $scope.manInfo.department = organization[0].item.unit;
                  $scope.manInfo.organization = organization[1].item.name;
                }
              }
            } catch (e) {
              $scope.manInfo.organization = '';
              $scope.manInfo.department = '';
            }
            try {
              var address = msg.address;
              if (address.length > 0) {
                $scope.manInfo.street = address[0].item.street;
                $scope.manInfo.postal_code = address[0].item.postal_code;
              }
            } catch (e) {
              $scope.manInfo.street = '';
              $scope.manInfo.postal_code='';
            }
            try {
              var title = msg.title;
              if (title.length > 0) {
                $scope.manInfo.position = title[0].item;
              }
            } catch (e) {
              $scope.manInfo.position = '';
            }
            try {
              /*  alert("扫描成功");*/
              $scope.$apply();
              $scope.crmScanCardModal.show();
            } catch (e) {
            }
          }
          hmsPopup.hideLoading();
        }
        catch
          (e) {
          hmsPopup.showShortCenterToast('扫描失败！请重新扫描！');
          hmsPopup.hideLoading();
        }
      }
      // 创建名片扫描结果的modal现实页面
      (function scanCardModal() {
        $ionicModal.fromTemplateUrl('build/pages/application/model/scan-card-result.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.crmScanCardModal = modal;
        });
      })();

      (function scanCardModal() {
        $ionicModal.fromTemplateUrl('build/pages/contact/modal/scan-card-result.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.scanCardModal = modal;
        });
      })();
     $scope.closescanCardModal=function(){
       $scope.crmScanCardModal.hide();
       $scope.scanCardModal.hide();
     };
      $scope.saveToContacts = function () {
        hmsPopup.showLoading("加载中");
        //需要客户模糊查询接口
        var contact = {
          "contactId": "",
          "customerId": "",
          "contactType": "",
          "fullName": $scope.manInfo.organization,
          "name": $scope.manInfo.emp_name,
          "sex": "",
          "department": $scope.manInfo.department,
          "position": $scope.manInfo.position,
          "phone": $scope.manInfo.mobil,
          "tel": "",
          "email": $scope.manInfo.email,
          "wechat": "",
          "role": "",
          "status": "HCRM_ENABLE",
          statusValue: "有效",
          "addressCountry": "",
          "addressProvince": "",
          "addressCity": "",
          "addressZone": "",
          "addressDetails": $scope.manInfo.street,
          "addressZipCode":  $scope.manInfo.postal_code
        };
        if ($scope.manInfo.organization != "") {
          $scope.searchParam = {
            keyWord: $scope.manInfo.organization,
            page: 1,
            pageSize: 10
          };
          var searchSuccessInit = function (result) {

            if (result.returnCode == 'S') {
              hmsPopup.hideLoading();
              /* $scope.searchData = result.search_result;*/
              if (result.customer_list.length != 0) {
                contact.customerId = result.customer_list[0].customerId;
                contact.fullName = result.customer_list[0].fullName;
              } else {
                contact.customerId = "";
                contact.fullName = "";
              }
              $state.go('tab.addLinkman', {param: contact});
              if($scope.hasCrm){
                $scope.crmScanCardModal.hide();
              }
              else{
                $scope.scanCardModal.hide();
              }

            } else {
              hmsPopup.hideLoading();
              hmsPopup.showPopup("没有找到匹配的客户");
              $state.go('tab.addLinkman', {param: contact});
              if($scope.hasCrm)
                $scope.crmScanCardModal.hide();
              else
                $scope.scanCardModal.hide();
            }
          };
          customerSearchService.getSearchData(searchSuccessInit, $scope.searchParam)
        } else {
          hmsPopup.hideLoading();
          $state.go('tab.addLinkman', {param: contact});
          if($scope.hasCrm){
            $scope.crmScanCardModal.hide();
          } else{
            $scope.scanCardModal.hide();
          }
          console.log($scope.searchData);
        }

      };

      $scope.$on('modal.hidden', function () {
        angular.element('.contact').css({'WebkitFilter': '', 'filter': ''});
      });

      $scope.resetScanCard = function () {
        $scope.scanBusinessCard();
      };

      $scope.scanBusinessCard = function () { //名片扫描添加联系人到通讯录
        if (ionic.Platform.isWebView()) {
          var options = {
            buttonLabels: ['拍照', '从相册中选择'],
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
                  hmsPopup.showLoading('名片扫描中,请稍后...');
                  scanCard.takePicturefun(function (msg) {
                    console.log($scope.hasCrm);
                    if($scope.hasCrm){
                      dealCrmScanData(msg);
                    }else{
                      dealScanData(msg);
                    }
                  }, function (error) {
                    hmsPopup.showShortCenterToast('扫描失败！请重新扫描！');
                    hmsPopup.hideLoading();
                  });
                  return true;
                } else if (btnIndex == 2) {
                  hmsPopup.showLoading('名片扫描中,请稍后...');
                  scanCard.choosePicturefun(function (msg) {
                    if($scope.hasCrm){
                      dealCrmScanData(msg);
                    }else{
                      dealScanData(msg);
                    }
                  }, function (error) {
                    hmsPopup.showShortCenterToast('扫描失败！请重新扫描！');
                    hmsPopup.hideLoading();
                  });
                  return true;
                }
              });
          }, false);
        } else {
          hmsPopup.showShortCenterToast('暂不支持网页端的名片扫描!');
        }
      };
      $scope.showMore = function () {
        if (ionic.Platform.isWebView()) {
          console.log("webView");
          var options = {
            buttonLabels: ['手工录入', '名片扫描', '从手机通讯录导入'],
            addCancelButtonWithLabel: '取消',
            androidEnableCancelButton: true,
            androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT,
            title: '新建联系人'
          };
          document.addEventListener("deviceready", function () {
            $cordovaActionSheet.show(options)
              .then(function (btnIndex) {
                if (btnIndex == 1) {
                  $state.go('tab.addLinkman2');
                  return true;
                } else if (btnIndex == 2) {
                  $scope.scanBusinessCard();
                  return true;
                } else if (btnIndex == 3) {
                  pickContact();
                }
              });
          }, false);
        } else {
          var hideSheet = $ionicActionSheet.show({
            buttons: [
              {text: '手工录入'},
              {text: '名片扫描'},
              {text: '从手机通讯录导入'}
            ],
            cancelText: '取消',
            cancel: function () {
              // add cancel code..
            },
            titleText: '新建联系人',
            buttonClicked: function (index) {
              console.log(index);
              if (index == 0) {
                $state.go('tab.addLinkman2');
              } else if (index == 1) {
                $scope.scanBusinessCard();
              } else if (index == 2) {
                pickContact();
              }
            }
          });
        }
      };
      {
        $scope.customContactsInfo = [];
        $scope.showTopInput = false; // 默认不显示bar上的搜索框
        $scope.structureName = ''; //当前员工所属层级的名字
        $scope.currentStructure = {};
        var CONTACT_TAG = 'contact:\n';
        var position = ''; //记录滚动条的位置--
        var LINK_MAN = 'common_linkman2';
      }

      function getCurrentDepartInfo(result) {
        try {
          if (Object.keys(result).length !== 0) { //枚举
            $scope.currentStructure = result;
            for (var i = 1; i < result.deptInfo.length; i++) {
              if (i === (result.deptInfo.length - 1)) {
                $scope.structureName += result.deptInfo[i].name;
              } else {
                $scope.structureName += result.deptInfo[i].name + '-';
              }
            }
          }
        } catch (e) {
        }
      };

      getInitStructureInfo.getCurrentStructure(getCurrentDepartInfo);

      function getCommonLinkMan() { //获取常用联系人
        $scope.customContactsInfo = unique_better(storedb(LINK_MAN).find(), 'employeeNumber');
        if ($scope.customContactsInfo.length > 15) {
          $scope.customContactsInfo = $scope.customContactsInfo.slice(0, 15);
        }
      };


      $scope.$on('$ionicView.beforeEnter', function (e) {
        console.log("获取常用联系人");
        getCommonLinkMan();
      });


      /*  $scope.$on('$destroy', function (e) {
       if (baseConfig.debug) {
       console.log('ContactCtrl.$destroy');
       }
       });*/

      $scope.watchScroll = function () { //滚动内容时执行的method
        position = $ionicScrollDelegate.getScrollPosition().top;
        $scope.$apply(function () {
          if (position < 33) {
            $scope.showTopInput = false;
          } else if (position >= 33) {
            $scope.showTopInput = true;
          }
        });
      };
      $scope.telNumber = function (event, baseInfo) { //拨打电话按钮的响应事件
        event.stopPropagation(); //阻止事件冒泡
        //常用联系人拨打电话
        window.location.href = "tel:" + baseInfo.replace(/\s+/g, "");
      };

      $scope.goInputSearch = function () { //去搜索界面
        console.log("搜索界面");
        $state.go('tab.contactCrmSearch');
      };

      $scope.goStructure = function (flag) {
        // hmsPopup.showShortCenterToast('下一版本上线!');
        // return;
        if (angular.equals(flag, 'current')) {
          $state.go('tab.contactCrmStructure', {
            routeId: "currentDepartment",
            structureId: "1",
            currentDepartInfo: $scope.currentStructure
          });
        } else {
          $state.go('tab.contactCrmStructure');
        }
      };

      $scope.goDetailInfo = function (newEmployeeNumber) {
        $state.go('tab.employeeDetailCrm', {employeeNumber: newEmployeeNumber});
      };
    }])
/*
  .service('getInitStructureInfo', ['hmsHttp', 'baseConfig', function (hmsHttp, baseConfig) {
    var _currentStructureUrl = baseConfig.queryPath + '/dept/getStaffDeptInfo';
    var _structureUrl = baseConfig.queryPath + '/dept/getDetail';
    this._returnData = {};
    return {
      getCurrentStructure: function (callback) {
        hmsHttp.post(_currentStructureUrl).success(function (response) {
          if (response.returnData) {
          } else {
            response.returnData = {};
          }
          callback(response.returnData);
        }).error(function (error) {
        });
      },
      getStructure: function (callback, newId) {
        var params = {
          "id": newId
        };

        hmsHttp.post(_structureUrl, params).success(function (response) {
          try {
            this._returnData = response.returnData;
          } catch (e) {
            this._returnData = {};
          }
          callback(this._returnData);
        }.bind(this)).error(function (error) {
        });
      }
    }

  }]);
*/
