/**
 * Created by wkh on 2016/10/27.
 */
'use strict';
angular.module('opportunityModule')
  .controller('OpportunityDetailContactCtrl', [
    '$scope',
    '$state',
    'hmsPopup',
    'hmsHttp',
    '$ionicActionSheet',
    'contactLocal',
    '$cordovaActionSheet',
    'baseConfig',
    '$ionicModal',
    'customerLinkman',
    '$rootScope',
    'customerDetailContact',
    function ($scope,
              $state,
              hmsPopup,
              hmsHttp,
              $ionicActionSheet,
              contactLocal,
              $cordovaActionSheet,
              baseConfig,
              $ionicModal,
              customerLinkman,
              $rootScope,
              customerDetailContact
    ) {
      console.log("opportunityModule");
      var url=baseConfig.basePath+"customer_contact_list";
      $scope.data  = {
        page: 1,
        pageSize:10,
        contactId: "",
        contactType: "",
        status: "",
        customerId: window.localStorage.customerId
      };
      $scope.linkmanData=[];
      $scope.showCrmLoading=true;
      var getContactListInit = function (data) {
        $scope.moreDataCanBeLoaded = true;
        $scope.showCrmLoading=false;
        if (data.returnCode == 'S') {
          for (var i = 0; i < data.customer_contact_list.length; i++) {
            if (data.customer_contact_list[i].sexName == "男") {
              data.customer_contact_list[i].sexImg = "build/img/contact/icon_man@3x.png";
            } else {
              data.customer_contact_list[i].sexImg = "build/img/contact/icon_female@3x.png";
            }
          }
          $scope.linkmanData =   $scope.linkmanData.concat(data.customer_contact_list);
          if (data.customer_contact_list.length < $scope.data.pageSize || data.customer_contact_list.length == 0) {
            console.log("没有数据了" + $scope.moreDataCanBeLoaded);
            $scope.moreDataCanBeLoaded = false;
          }
        } else {
          $scope.moreDataCanBeLoaded = false;
          hmsPopup.showPopup(data.returnMsg);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      var doRefreshSuccess=function(data){
        if (data.returnCode == 'S') {
          for (var i = 0; i < data.customer_contact_list.length; i++) {
            if (data.customer_contact_list[i].sexName == "男") {
              data.customer_contact_list[i].sexImg = "build/img/contact/icon_man@3x.png";
            } else {
              data.customer_contact_list[i].sexImg = "build/img/contact/icon_female@3x.png";
            }
          }
          if (data.customer_contact_list.length <$scope.data .pageSize || data.customer_contact_list.length == 0) {
            $scope.moreDataCanBeLoaded = false;
            console.log("没有数据了" + $scope.moreDataCanBeLoaded);
          }
          $scope.linkmanData =  data.customer_contact_list;
        } else {
          $scope.moreDataCanBeLoaded = false;
          hmsPopup.showPopup(data.returnMsg);
        }
      };
      customerLinkman.getGetContactsList(getContactListInit, $scope.data);
      $scope.doRefresh = function () {
        $scope.data  = {
          page: 1,
          pageSize:10,
          contactId: "",
          contactType: "",
          status: "",
          customerId: window.localStorage.customerId
        };
        $scope.moreDataCanBeLoaded = true;
        customerLinkman.getGetContactsList(doRefreshSuccess, $scope.data );
        $scope.$broadcast('scroll.refreshComplete');
      };
      $scope.loadMore=function(){
        data.page++;
        var error = function (response) {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        customerLinkman.getGetContactsList(getContactListInit,  $scope.data);
      };
      var deleteSuccessinit = function (data, index) {
        if (data.returnCode == 'S') {
          $scope.linkmanData.splice(index, 1);
          hmsPopup.showPopup(data.returnMsg);
        } else {
          hmsPopup.showPopup(data.returnMsg);
        }
      };
      $scope.deleteItem = function (item, index) {
        /* historyContact.removeHistory(item);*/
        var deleteData = {
          contactId: item.contactId,
          customerId: item.customerId
        };
        customerDetailContact.deleteItemFun(deleteSuccessinit, deleteData, index);
      };
      $scope.showMoreChache=function(){
        var hideSheet = $ionicActionSheet.show({
          buttons: [
            { text: '名片扫描' },
            { text:  '手动输入'},
            { text: '通讯录导入' }
          ],
          cancelText: '取消',
          cancel: function() {
            // add cancel code..
          },
          buttonClicked: function(index) {
            console.log(index);
            if(index==0){
              $scope.scanBusinessCard();
            }else if(index==1) {
              $state.go('tab.addLinkman2')
            }else if(index==2){
              $scope.findAddressBook();
            }
          }
        });
      };
      $rootScope.$on("REFRESH_ADD_LINKMAN", function () {
       $scope.doRefresh();
      });
      $scope.goDetail=function(item){
        $state.go('tab.contactDetail2',{contactData:item});
      };
      $scope.saveToLocalContacts = function () {
        var info = {
          email: $scope.manInfo.email,
          mobil: $scope.manInfo.mobil,
          emp_name: $scope.manInfo.emp_name,
          organization: $scope.manInfo.organization
        };
        var onSaveContactSuccess = function () {
          hmsPopup.showPopup("添加成功");
          $scope.scanCardModal.hide();
        };
        var onSaveContactError = function () {
          hmsPopup.showPopup("添加失败");
          $scope.scanCardModal.hide();
        };
        //保存到本地
        contactLocal.contactLocal(info, onSaveContactSuccess, onSaveContactError);
      };
      function dealScanData(msg) { //处理名片扫描插件的返回数据
        try {
          $scope.scanCardModal.show();
          if (JSON.parse(msg)) {
            $scope.manInfo = {
              emp_name: '',
              mobil: '',
              email: '',
              organization: '',
              fullName: ""
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
              /*  alert("扫描成功");*/
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
      }

      // 创建名片扫描结果的modal现实页面
      (function scanCardModal() {
        $ionicModal.fromTemplateUrl('build/pages/application/model/scan-card-result.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.scanCardModal = modal;
        });
      })();
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
          "department": "",
          "position": "",
          "phone": $scope.manInfo.mobil,
          "tel": "",
          "email": $scope.manInfo.email,
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
              if( result.customer_list.length!=0){
                contact.customerId = result.customer_list[0].customerId;
                contact.fullName = result.customer_list[0].fullName;
              }else{
                contact.customerId = "";
                contact.fullName="";
              }
              $state.go('tab.addLinkman', {param: contact});
              $scope.scanCardModal.hide();
            }else{
              hmsPopup.hideLoading();
              hmsPopup.showPopup("没有找到匹配的客户");
              $state.go('tab.addLinkman', {param: contact});
              $scope.scanCardModal.hide();
            }
          };
          customerSearchService.getSearchData(searchSuccessInit, $scope.searchParam)
        } else {
          hmsPopup.hideLoading();
          $state.go('tab.addLinkman', {param: contact});
          $scope.scanCardModal.hide();
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
                    dealScanData(msg);
                  }, function (error) {
                    hmsPopup.showShortCenterToast('扫描失败！请重新扫描！');
                    hmsPopup.hideLoading();
                  });
                  return true;
                } else if (btnIndex == 2) {
                  hmsPopup.showLoading('名片扫描中,请稍后...');
                  scanCard.choosePicturefun(function (msg) {
                    dealScanData(msg);
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
      //获取联系人
      $scope.findAddressBook=function(){
        /*  findLocal();*/
        hmsPopup.showLoading("加载中...");
        contactLocal.findLocal(onSuccess,onError);
      };
      // onSuccess: Get a snapshot of the current contacts
      function onSuccess(contacts) {
        hmsPopup.hideLoading();
        // 联系人与电话号码 全写在这儿
        var aResult = [];
        if (ionic.Platform.isIOS()) {
          console.log("ios");
          console.log(contacts[i]);
          alert(angular.toJson(contacts[i]));
        }
        var name = "";
        for (var i = 0; contacts[i]; i++) {
          console.log(contacts[i]);
          if (ionic.Platform.isIOS()) {
            console.log("name" + contacts[i].familyName + contacts[i].givenName);
            name = contacts[i].familyName + contacts[i].name.givenName;
            console.log(contacts[i].name + "ios name");
          }
          if (ionic.Platform.isAndroid()) {
            name = contacts[i].displayName;
          }
          console.log("Display Name = " + contacts[i].displayName);
          if (contacts[i].phoneNumbers && contacts[i].phoneNumbers.length) {

            var contactPhoneList = [];

            for (var j = 0; contacts[i].phoneNumbers[j]; j++) {
              // alert(contacts[i].phoneNumbers[j].type+"	"+contacts[i].displayName+"---------" + contacts[i].phoneNumbers[j].value );

              contactPhoneList.push(
                {
                  'type': contacts[i].phoneNumbers[j].type,
                  'value': contacts[i].phoneNumbers[j].value
                }
              );

            }

            aResult.push({
              name: name,
              phone: contactPhoneList
            });

          }
        }
      }

    }]);
