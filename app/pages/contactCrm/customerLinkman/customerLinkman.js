/**
 * Created by wangkaihua on 2016/10/10.
 */
'use strict';
angular.module('contactModule')
  .controller('customerLinkmanCtrl', [
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
    'opportunityAddService',
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
              opportunityAddService) {

      console.log($ionicHistory.viewHistory());
      $scope.searched = {
        "page": 1,
        "pageSize": 10,
        "keyWord": ""
      };
      $scope.doRefreshFlag=false;
      $scope.moreDataCanBeLoaded=false;//上拉加载
      $scope.goSearch = function () {
        $state.go('tab.contact-search');
      };
      var resultSuccessInit = function (result) {
        $scope.showLoading=false;
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
        $scope.showLoading=true;
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
      $scope.showData={
        contactType:"",
        status:""
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
        historyContact.getAllHistory(function (data) {
          console.log(data);    //还没保存数据目前打印的是空数组
          $scope.historyContact = data;
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
      $ionicModal.fromTemplateUrl('build/pages/contact/model/filterContactsModel.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.filterContactsModel = modal;
      });
      $scope.showFilterContactsModel = function () {
        $scope.filterContactsModel.show();
        console.log(screen.height);
        $(".hmsModal").css("top", 112 + 'px')

      };
      $scope.clearParam = function () {//重置
        $scope.data = {
          pageSize: "10",
          page: "1",
          contactId: "",
          contactType: "",
          status: ""
        };
        $scope.showData={
          contactType:"",
          status:""
        };
      };
      var getContactsListSuccessInit = function (data) {
        $scope.showLoading=false;
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
          $timeout(function(){
            $ionicScrollDelegate.$getByHandle("slideimgs").resize();
          });
          if(data.customer_contact_list.length==0){
            $scope.moreDataCanBeLoaded=false;
          }
        } else {
          $scope.moreDataCanBeLoaded=false;
          hmsPopup.showPopup(data.returnMsg);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      $scope.closeFilterContactsModel = function () {
        $scope.linkmanData=[];
        $scope.data = {
          pageSize: "10",
          page: "1",
          contactId: "",
          contactType: "",
          status: ""
        };
        $scope.showLoading=true;
        $scope.doRefreshFlag=true;
        $scope.filterContactsModel.hide();
        $scope.showResult = true;
        $scope.hideAreaFlag[0]=true;
        customerLinkman.getGetContactsList(getListSuccessInitConcat, $scope.data);
      };
      $scope.loadMore=function(){
        $scope.data.page++;
        customerLinkman.getGetContactsList(getContactsListSuccessInit, $scope.data);
        $timeout(function(){
          $ionicScrollDelegate.$getByHandle("slideimgs").resize();
        });

      };

      var getListSuccessInitConcat = function (result) {
        $scope.showLoading=false;
        if (result.returnCode == "S") {
          $scope.moreDataCanBeLoaded=true;
          for (var i = 0; i < result.customer_contact_list.length; i++) {
            if (result.customer_contact_list[i].sexName == "男") {
              result.customer_contact_list[i].sexImg = "build/img/contact/icon_man@3x.png";
            } else {
              result.customer_contact_list[i].sexImg = "build/img/contact/icon_female@3x.png";
            }
          }
          if(result.customer_contact_list==0){
            $scope.moreDataCanBeLoaded=false;
          }
          $scope.linkmanData = result.customer_contact_list;
          $timeout(function(){
            $ionicScrollDelegate.$getByHandle("slideimgs").resize();
          });

        }
      };
      $scope.doRefresh=function(){
        $scope.linkmanData=[];
        $scope.data = {
          pageSize: "10",
          page: "1",
          contactId: "",
          contactType: "",
          status: ""
        };
        $scope.showData={
          contactType:"",
          status:""
        };
        $scope.moreDataCanBeLoaded=false;
        customerLinkman.getGetContactsList(getListSuccessInitConcat, $scope.data);
        $scope.$broadcast('scroll.refreshComplete');
      };
      $scope.items=[];
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
     $scope.searchModel={
       searchValueKey:""
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
        for(var i = 0; i < upData.length; i++){
          if(code == upData[i].code)
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
      opportunityAddService.getValueList(listInitSuccess, upData);
      var showValueInList = function (code) {
        var valueObj = getValueObjByCode(code);
        $scope.items = $scope.items.concat(JSON.parse(window.localStorage[valueObj.localList]));
        $scope.sourceItems = $scope.items.clone();
      };
      //通用选择弹窗
      $scope.selectTargets = [{
        'key': 'contactType',
        'interface':showValueInList,  //获得选择项的接口
        'params': [ 'HCRM.CONTACTS_TYPE'],  //获得选择项时接口所需参数
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
      $scope.searchSelectValue = function(){
        if($scope.nowSelectTarget['searchInterface']){
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
          $scope.showLoading=false;
          $scope.crmSelectModal.hide();
        } else {
          $scope.crmSelectModal.show();
        }
        $scope.showSelect = !$scope.showSelect;
        if(!$scope.showSelect)
          return ;
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
        if($scope.showSelect){
          var showKey = $scope.nowSelectTarget['showKey'];
          var dataKey = $scope.nowSelectTarget['dataKey'];
          eval('$scope.items = [{' + showKey + ': "空",' + dataKey + ': ""}]');
        }
        console.log($scope.nowSelectTarget.params);
        $scope.sourceTargetData = cloneObj($scope.nowSelectTarget);
        $scope.showLoading=true;
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
    }])
