/**
 * Created by wkh on 2016/10/27.
 */
'use strict';
angular.module('customerModule')
  .controller('CustomerDetailContactCtrl', [
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
    'customerDetailContact',
    '$rootScope',
    'customerSearchService',
    'customerDetailService',
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
              customerDetailContact,
              $rootScope,
              customerSearchService,
              customerDetailService) {
      console.log("CustomerDetailContactCtrl");
      customerDetailService.setTabNumber(2);
      customerDetailService.setIsContact(false);
      $scope.data = {
        page: 1,
        pageSize:10,
        contactId: "",
        contactType: "",
        status: "",
        customerId: window.localStorage.customerId
      };
      $scope.linkmanData = [];
 /*     hmsPopup.showLoading("加载中");*/
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
          if (data.customer_contact_list.length <$scope.data .pageSize || data.customer_contact_list.length == 0) {
            console.log("没有数据了" + $scope.moreDataCanBeLoaded);
            $scope.moreDataCanBeLoaded = false;
          }
        } else {
          $scope.moreDataCanBeLoaded = false;
          hmsPopup.showPopup(data.returnMsg);
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      customerLinkman.getGetContactsList(getContactListInit, $scope.data );
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
      $rootScope.$on("REFRESH_ADD_LINKMAN", function () {
        $scope.doRefresh();
      });
      $scope.loadMore=function(){
        $scope.data .page++;
        var error = function (response) {
          $scope.$broadcast('scroll.infiniteScrollComplete');
        };
        customerLinkman.getGetContactsList(getContactListInit, $scope.data );
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
      $scope.goDetail = function (item) {
        $state.go('tab.contactDetail3', {contactData: item});
      };
      $scope.saveToLocalContacts = function () {
        var info = {
          email: $scope.manInfo.email,
          mobil: $scope.manInfo.mobil,
          emp_name: $scope.manInfo.emp_name,
          organization: $scope.manInfo.organization
        };
        var onSaveContactSuccess=function(){
          hmsPopup.showPopup("添加成功");
          $scope.scanCardModal.hide();
        };
        var onSaveContactError=function(){
          hmsPopup.showPopup("添加失败");
          $scope.scanCardModal.hide();
        };
        //保存到本地
        contactLocal.contactLocal(info,onSaveContactSuccess,onSaveContactError);
      };
      // 创建名片扫描结果的modal现实页面
      (function scanCardModal() {
        $ionicModal.fromTemplateUrl('build/pages/application/model/scan-card-result.html', {
          scope: $scope
        }).then(function (modal) {
          $scope.scanCardModal = modal;
        });
      })();
      $scope.saveToContacts = function () {
        var contact = {
          "contactId": "",
          "customerId": "",
          "contactType": "",
          "fullName": $scope.manInfo.fullName,
          "name": $scope.manInfo.emp_name,
          "sex": "",
          "department": $scope.manInfo.organization,
          "position": "",
          "phone": $scope.manInfo.mobil,
          "tel": "",
          "email": $scope.manInfo.email,
          "wechat": "",
          "role": "",
          "status": "",
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
              if( result.customer_list.length!=0){
                contact.customerId = result.customer_list[0].customerId;
              }else{
                contact.customerId = "";
                contact.fullName="";
              }
              $state.go('tab.addLinkman', {param: contact});
              $scope.scanCardModal.hide();
            }else{
              hmsPopup.showPopup("没有找到匹配的客户");
              $state.go('tab.addLinkman', {param: contact});
              $scope.scanCardModal.hide();
            }
          };
          customerSearchService.getSearchData(searchSuccessInit, $scope.searchParam)
        } else {
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
        console.log(JSON.parse(msg));
        try {
          $scope.scanCardModal.show();
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
              $scope.scanCardModal.show();
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
      $scope.findAddressBook = function () {
        /*  findLocal();*/
        hmsPopup.showLoading("加载中...");
        contactLocal.findLocal(onSuccess, onError);
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

    }])
  .service('customerDetailContact', ['baseConfig', 'hmsHttp', 'hmsPopup', function (baseConfig, hmsHttp, hmsPopup) {
    var baseUrl = baseConfig.basePath;
    this.deleteItemFun = function (success, key, index) {
      hmsHttp.post(baseUrl + 'contact_remove', key, index).success(function (result) {
        hmsPopup.hideLoading();
        success(result, index);
      }).error(function (response, status) {
        hmsPopup.hideLoading();
        hmsPopup.showPopup(response.error_description);
      });
    };
  }]);
