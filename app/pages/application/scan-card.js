/**
 * Created by ZaraNengap on 2016/10/8.
 */
angular.module('applicationModule')

  .controller('ScanCardController', [
    '$scope',
    '$ionicModal',
    '$cordovaActionSheet',
    'baseConfig',
    'hmsPopup',
    '$state',
    'contactLocal',
    'customerSearchService',
    '$cordovaClipboard',
    function ($scope,
              $ionicModal,
              $cordovaActionSheet,
              baseConfig,
              hmsPopup,
              $state,
              contactLocal,
              customerSearchService,
              $cordovaClipboard) {
      $scope.saveToLocalContacts = function () {
        var info = {
          email: $scope.manInfo.email,
          mobil: $scope.manInfo.mobil,
          emp_name: $scope.manInfo.emp_name,
          organization: $scope.manInfo.organization
        };
        var onSaveContactSuccess = function () {
          hmsPopup.hideLoading();
          hmsPopup.showPopup("添加成功");
          $scope.scanCardModal.hide();
        };
        var onSaveContactError = function () {
          hmsPopup.hideLoading();
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
              $scope.scanCardModal.hide();
            } else {
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
            title: '名片扫描',
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
                  console.log("进入");
                  hmsPopup.showLoading('名片扫描中,请稍后...');
                  scanCard.takePicturefun(function (msg) {
                    dealScanData(msg);
                  }, function (error) {
                    console.log(error);
                    hmsPopup.showShortCenterToast('扫描失败！请重新扫描！');
                    hmsPopup.hideLoading();
                  });
                  return true;
                } else if (btnIndex == 2) {
                  console.log("2进入");
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

    }
  ])
;
