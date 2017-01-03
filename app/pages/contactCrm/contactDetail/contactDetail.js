/**
 * update by wangkaihua on 16/10/9
 */
angular.module('contactModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.contactDetail', {
          url: '/contactDetail',
          params: {contactData: {}},
          views: {
            'tab-contactCrm': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/contactCrm/contactDetail/contactDetail.html',
              controller: 'contactDetailCtrl'
            }
          }

        })
        .state('tab.contactDetail4', {
          url: '/contactDetail',
          params: {contactData: {}},
          views: {
            'tab-contactCrm': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/contactCrm/contactDetail/contactDetail.html',
              controller: 'contactDetailCtrl'
            }
          }

        })
        .state('tab.contactDetail2', {
          url: '/contactDetail',
          params: {contactData: {}},
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/contactCrm/contactDetail/contactDetail.html',
              controller: 'contactDetailCtrl'
            }
          }
        })
        .state('tab.contactDetail3', {
          url: '/contactDetail',
          params: {contactData: {}},
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/contactCrm/contactDetail/contactDetail.html',
              controller: 'contactDetailCtrl'
            }
          }
        })
    }]);
angular.module('contactModule')
  .controller('contactDetailCtrl', [
    '$scope',
    '$state',
    'publicMethod',
    '$ionicHistory',
    '$stateParams',
    '$ionicActionSheet',
    'contactLocal',
    'CloneData',
    'hmsHttp',
    'hmsPopup',
    'baseConfig',
    '$rootScope',
    '$timeout',
    '$cordovaActionSheet',
    '$cordovaClipboard',
    'customerDetailService',
    function ($scope,
              $state,
              publicMethod,
              $ionicHistory,
              $stateParams,
              $ionicActionSheet,
              contactLocal,
              CloneData,
              hmsHttp,
              hmsPopup,
              baseConfig,
              $rootScope,
              $timeout,
              $cordovaActionSheet,
              $cordovaClipboard,
              customerDetailService) {
      /*console.log($ionicHistory.viewHistory().currentView.stateName);
      console.log('contactDetailCtrl.enter');*/
      $scope.showContactDetailGuide;
      $scope.showLoading = true;
      $scope.buttonTapped=function(){
        $scope.showContactDetailGuide = false;
        window.localStorage.showContactDetailGuide=false;
      };
      if (!window.localStorage.showContactDetailGuide || window.localStorage.guideHelpAuto == "true") {
        window.localStorage.showContactDetailGuide="false";
        $scope.showContactDetailGuide = true;
      } else {
      }
      $scope.$on('$ionicView.enter', function (e) {
        $rootScope.img = "build/img/tabs/edit_add@3x_5.png";
        var url = baseConfig.basePath + "customer_contact_detail";
        var data = {
          contactId: $stateParams.contactData.contactId
        };
        $scope.showPhoneIcon = false;
        $scope.showofficeNumIcon = false;
        $scope.bilingual = CloneData.getContactbilingual();
        $rootScope.dataHistroy = data;//测试手势解锁
        $rootScope.stateHistory = $ionicHistory.viewHistory().currentView.stateName;//测试手势解锁
        $scope.showLoading = true;
        $scope.contactDetail = {
          contactId: $stateParams.contactData.contactId
        };
        /*     console.log(JSON.parse(window.localStorage.linkRoleData));*/
        $rootScope.$broadcast("REFRESH_CONTACT_HISTORY");
        $scope.goBack = function () {
          if ($ionicHistory.viewHistory().backView) {
            $ionicHistory.goBack();
          } else {
            $state.go('tab.application');
          }
        };
        function initContactDetail() {


          hmsHttp.post(url, data).success(function (data) {
            $scope.showLoading = false;
            if (data.returnCode == 'S') {
              console.log(data);
              $scope.contactDetail = data.customer_contact_detail;

              if ($scope.contactDetail.sexName == "男") {
                $scope.contactDetail.sexImg = "build/img/contact/icon_man@3x.png";
              } else {
                $scope.contactDetail.sexImg = "build/img/contact/icon_female@3x.png";
              }

              if ($scope.contactDetail.statusName == "无效") {
                $scope.contactDetail.statusChange = "有效";
                $scope.contactDetail.statusCodeChange = "HCRM_ENABLE";
              } else {
                $scope.contactDetail.statusChange = "无效";
                $scope.contactDetail.statusCodeChange = "HCRM_DISABLE";
              }
              console.log(data);
              $scope.contactDetail = data.customer_contact_detail;

              if ($scope.contactDetail.sexName == "男") {
                $scope.contactDetail.sexImg = "build/img/contact/icon_man@3x.png";
              } else {
                $scope.contactDetail.sexImg = "build/img/contact/icon_female@3x.png";
              }

              if ($scope.contactDetail.statusName == "无效") {
                $scope.contactDetail.statusChange = "有效";
                $scope.contactDetail.statusCodeChange = "HCRM_ENABLE";
              } else {
                $scope.contactDetail.statusChange = "无效";
                $scope.contactDetail.statusCodeChange = "HCRM_DISABLE";
              }
            } else {
              if (data.returnMsg) {
                hmsPopup.showPopup(result.returnMsg);
              }
              else {
                hmsPopup.showPopup('服务器系统出现异常，请联系管理员！');
              }

            }

          }).error(function (data) {
            hmsPopup.hideLoading();
          });
        }

        initContactDetail();
      /*  $rootScope.$on("REFRESH_LINKMAN_UPDATE", function () {
          $scope.showLoading = true;*/
      /*  });*/
        //长按复制
        stop_browser_behavior: false
        self.touchStart = function (e) {
          self.startCoordinates = getPointerCoordinates(e);
          if (ionic.tap.ignoreScrollStart(e)) {
            return;
          }
          if (ionic.tap.containsOrIsTextInput(e.target)) {
            // do not start if the target is a text input
            // if there is a touchmove on this input, then we can start the scroll
            self.__hasStarted = false;
            return;
          }
          self.__isSelectable = true;
          self.__enableScrollY = true;
          self.__hasStarted = true;
          self.doTouchStart(e.touches, e.timeStamp);
          // e.preventDefault();
        };
        $scope.showPhone = function (num) {
          if (ionic.Platform.isWebView()) {
            console.log("webView");
            var options = {
              buttonLabels: ['拨打电话', '发送短信'],
              addCancelButtonWithLabel: '取消',
              androidEnableCancelButton: true,
              androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT
            };
            document.addEventListener("deviceready", function () {
              $cordovaActionSheet.show(options)
                .then(function (btnIndex) {
                  if (btnIndex == 1) {
                    window.location.href = "tel:" + num.replace(/\s+/g, "");
                    return true;
                  } else if (btnIndex == 2) {
                    window.location.href = "sms:" + num.replace(/\s+/g, "");
                    return true;
                  }
                });
            }, false);
          } else {
            var hideSheet = $ionicActionSheet.show({
              buttons: [
                {text: '拨打电话'},
                {text: '发送短信'}
              ],
              cancelText: '取消',
              cancel: function () {
                // add cancel code..
              },
              buttonClicked: function (index) {
                console.log(index);
                if (index == 0) {
                  window.location.href = "tel:" + num.replace(/\s+/g, "");
                } else if (index == 1) {
                  window.location.href = "sms:" + num.replace(/\s+/g, "");
                }
                return true;
              }
            });
          }
        };
        $scope.mailTo = function (num) {
          if (ionic.Platform.isWebView()) {
            console.log("webView");
            var options = {
              buttonLabels: ['复制邮箱地址', '发送电子邮件'],
              addCancelButtonWithLabel: '取消',
              androidEnableCancelButton: true,
              androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT
            };
            document.addEventListener("deviceready", function () {
              $cordovaActionSheet.show(options)
                .then(function (btnIndex) {
                  if (btnIndex == 1) {
                    if (ionic.Platform.isIOS()) {
                      $cordovaClipboard
                        .copy(num)
                        .then(function () {
                          hmsPopup.showPopup(options, '邮箱地址复制成功');
                        }, function () {
                          hmsPopup.showPopup("复制失败，请重新尝试");
                        });
                    } else {
                      cordova.plugins.clipboard.copy(
                        num,
                        function (r) {
                          hmsPopup.showPopup('邮箱地址复制成功');
                        },
                        function (e) {
                          hmsPopup.showPopup("复制失败，请重新尝试");
                        }
                      );
                    }
                    return true;
                  } else if (btnIndex == 2) {
                    window.location.href = "mailTo:" + num;
                    return true;
                  }
                });
            }, false);
          } else {
            var hideSheet = $ionicActionSheet.show({
              buttons: [
                {text: '复制邮箱地址'},
                {text: '发送电子邮件'}
              ],
              cancelText: '取消',
              cancel: function () {
                // add cancel code..
              },
              buttonClicked: function (index) {
                console.log(index);
                if (index == 0) {
                  if (ionic.Platform.isIOS()) {
                    $cordovaClipboard
                      .copy(num)
                      .then(function () {
                        hmsPopup.showPopup(options, '邮箱地址复制成功');
                      }, function () {
                        hmsPopup.showPopup("复制失败，请重新尝试");
                      });
                  } else {
                    cordova.plugins.clipboard.copy(
                      num,
                      function (r) {
                        hmsPopup.showPopup('邮箱地址复制成功');
                      },
                      function (e) {
                        hmsPopup.showPopup("复制失败，请重新尝试");
                      }
                    );
                  }
                } else if (index == 1) {
                  window.location.href = "sms:" + num;
                }
                return true;
              }
            });
          }
        };
        $scope.showOfficeNum = function () {
          $scope.showofficeNumIcon = !$scope.showofficeNumIcon;
        };
        $scope.showMore = function () {
          if (ionic.Platform.isWebView()) {
            console.log("webView");
            var options = {
              buttonLabels: ['保存至通讯录', $scope.contactDetail.statusChange, '编辑'],
              addCancelButtonWithLabel: '取消',
              androidEnableCancelButton: true,
              androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT
            };
            document.addEventListener("deviceready", function () {
              $cordovaActionSheet.show(options)
                .then(function (btnIndex) {
                  /*    if (baseConfig.debug) {
                   warn(btnIndex);
                   }*/
                  if (btnIndex == 1) {
                    /*     var contactDetail = {
                     mail: $scope.contactDetail.mail,
                     mobil: $scope.contactDetail.phonenum,
                     emp_name: $scope.contactDetail.name
                     };
                     contactLocal.contactLocal(contactDetail);*/
                    var contactDetail = {
                      mail: $scope.contactDetail.mail,
                      mobil: $scope.contactDetail.phonenum,
                      emp_name: $scope.contactDetail.name
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
                    contactLocal.contactLocal(contactDetail, onSaveContactSuccess, onSaveContactError);
                    return true;
                  } else if (btnIndex == 2) {
                    hmsPopup.showLoading("正在更改状态");
                    var statusParam = {
                      "contactId": $scope.contactDetail.contactId,
                      "status": $scope.contactDetail.statusCodeChange
                    };
                    var statusurl = baseConfig.basePath + "contact_update";
                    hmsHttp.post(statusurl, statusParam).success(function (data) {
                      hmsPopup.hideLoading();
                      if (data.returnCode == "S") {
                        hmsPopup.showPopup(data.returnMsg);
                        initContactDetail();
                      } else {
                        hmsPopup.showPopup(data.returnMsg);
                      }
                    });
                    return true;
                  } else if (btnIndex == 3) {
                    console.log($scope.contactDetail);
                    var param = {
                      type: "update",
                      customerId: $scope.contactDetail.customerId,
                      name: $scope.contactDetail.name,
                      sex: $scope.contactDetail.sex,
                      sexValue: $scope.contactDetail.sexName,//性别
                      department: $scope.contactDetail.department,//部门
                      position: $scope.contactDetail.position,//职务
                      contactTypeValue: $scope.contactDetail.contactTypeName,//联系人类别
                      contactType: $scope.contactDetail.contactType,
                      contactId: $scope.contactDetail.contactId,//关联客户
                      fullName: $scope.contactDetail.fullName,//关联客户名称
                      role: $scope.contactDetail.role,
                      roleValue: $scope.contactDetail.roleName,//联系人角色
                      phone: $scope.contactDetail.phone,//手机号
                      email: $scope.contactDetail.email,
                      address: $scope.contactDetail.countryName + $scope.contactDetail.provinceName + $scope.contactDetail.cityName + $scope.contactDetail.zoneName,
                      addressCountry: $scope.contactDetail.addressCountry,
                      addressCity: $scope.contactDetail.addressCity,
                      addressZone: $scope.contactDetail.addressZone,
                      addressDetails: $scope.contactDetail.addressDetails,
                      isPrimary: $scope.contactDetail.isPrimary,
                      tel: $scope.contactDetail.tel,//办公电话
                      wechat: $scope.contactDetail.wechat,
                      addressZipCode: $scope.contactDetail.addressZipCode,//邮编
                      remark: "",//备注
                      status: $scope.contactDetail.status,
                      statusValue: $scope.contactDetail.statusName
                    };
                    console.log($ionicHistory.viewHistory().backView);
                    if ($ionicHistory.viewHistory().backView.stateName == "tab.contactCrm") {
                      $state.go("tab.addLinkman2", {param: param});
                    }else if($ionicHistory.viewHistory().backView.stateName =='tab.contact-search'){
                      $state.go("tab.addLinkman2", {param: param});
                    } else {
                      $state.go("tab.addLinkman", {param: param});
                    }
                  }
                });
            }, false);
          } else {
            var hideSheet = $ionicActionSheet.show({
              buttons: [
                {text: '保存至通讯录'},
                {text: $scope.contactDetail.statusChange},
                {text: '编辑'}
              ],
              cancelText: '取消',
              cancel: function () {
                // add cancel code..
              },
              buttonClicked: function (index) {
                console.log(index);
                if (index == 0) {
                  var contactDetail = {
                    mail: $scope.contactDetail.mail,
                    mobil: $scope.contactDetail.phonenum,
                    emp_name: $scope.contactDetail.name
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
                  contactLocal.contactLocal(contactDetail, onSaveContactSuccess, onSaveContactError);
                  /*    console.log("保存至通讯录")*/
                } else if (index == 1) {
                  hmsPopup.showLoading("正在更改状态");
                  var statusParam = {
                    "contactId": $scope.contactDetail.contactId,
                    "status": $scope.contactDetail.statusCodeChange
                  };
                  var statusurl = baseConfig.basePath + "contact_update";
                  hmsHttp.post(statusurl, statusParam).success(function (data) {
                    hmsPopup.hideLoading();
                    if (data.returnCode == "S") {
                      hmsPopup.showPopup(data.returnMsg);
                      initContactDetail();
                    } else {
                      hmsPopup.showPopup(data.returnMsg);
                    }
                  })
                } else if (index == 2) {
                  console.log($scope.contactDetail);
                  var param = {
                    type: "update",
                    customerId: $scope.contactDetail.customerId,
                    name: $scope.contactDetail.name,
                    sex: $scope.contactDetail.sex,
                    sexValue: $scope.contactDetail.sexName,//性别
                    department: $scope.contactDetail.department,//部门
                    position: $scope.contactDetail.position,//职务
                    contactTypeValue: $scope.contactDetail.contactTypeName,//联系人类别
                    contactType: $scope.contactDetail.contactType,
                    contactId: $scope.contactDetail.contactId,//关联客户
                    fullName: $scope.contactDetail.fullName,//关联客户名称
                    role: $scope.contactDetail.role,
                    roleValue: $scope.contactDetail.roleName,//联系人角色
                    phone: $scope.contactDetail.phone,//手机号
                    email: $scope.contactDetail.email,
                    address: $scope.contactDetail.countryName + $scope.contactDetail.provinceName + $scope.contactDetail.cityName + $scope.contactDetail.zoneName,
                    addressCountry: $scope.contactDetail.addressCountry,
                    addressCity: $scope.contactDetail.addressCity,
                    addressZone: $scope.contactDetail.addressZone,
                    isPrimary: $scope.contactDetail.isPrimary,
                    addressDetails: $scope.contactDetail.addressDetails,
                    tel: $scope.contactDetail.tel,//办公电话
                    wechat: $scope.contactDetail.wechat,
                    addressZipCode: $scope.contactDetail.addressZipCode,//邮编
                    remark: "",//备注
                    status: $scope.contactDetail.status,
                    statusValue: $scope.contactDetail.statusName
                  };
                  console.log($ionicHistory.viewHistory().backView);
                  if ($ionicHistory.viewHistory().backView.stateName == "tab.contactCrm") {
                    $state.go("tab.addLinkman2", {param: param});
                  }else if($ionicHistory.viewHistory().backView.stateName =='tab.contact-search'){
                    $state.go("tab.addLinkman2", {param: param});
                  } else {
                    $state.go("tab.addLinkman", {param: param});
                  }
                }
                return true;
              }
            });
          }
        };
        $scope.goContactDetail = function (item) {
          customerDetailService.setCustomerId(item.customerId);
          window.localStorage.customerId = item.customerId;
          /* console.log("客户详情");*/
          console.log($ionicHistory.viewHistory().backView);
          console.log($ionicHistory.viewHistory().backView.stateName);
          /* if()*/
          if ($ionicHistory.viewHistory().backView.stateName == "tab.contactCrm") {
            $state.go("tab.customer-detail2");
          }else if($ionicHistory.viewHistory().backView.stateName =="tab.opportunity-detail"){
            $state.go("tab.customer-detail");
          }else if($ionicHistory.viewHistory().backView.stateName =="tab.contact-search"){
            $state.go("tab.customer-detail2");
          } else {
            console.log("从别的地方进来的");
            $ionicHistory.goBack();
            /* $state.go($ionicHistory.viewHistory().backView.stateName);*/
          }
        };
      });
    }])
;
