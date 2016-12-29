/**
 * Created by ZaraNengap on 2016/10/9.
 */
'use strict';
angular.module('customerModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.customer-detail', {
          url: '/customers/customer-detail',
          /*   cache:false,*/
          params:{
            customerDetail:{}
          },
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/customers/customer-detail/customer-detail.html',
              controller: 'CustomerDetailCtrl'
            }
          }
        })
    }]);

angular.module('customerModule')
  .controller('CustomerDetailCtrl', [
    '$scope',
    '$ionicHistory',
    '$state',
    '$rootScope',
    '$timeout',
    '$stateParams',
    'customerDetailService',
    '$cordovaClipboard',
    'hmsPopup',
    '$ionicActionSheet',
    '$ionicScrollDelegate',
    '$cordovaActionSheet',
    '$ionicModal',
    'customerSearchService',
    'baseConfig',
    'contactLocal',
    'customerService',
    'customerAddService',
    '$filter',
    '$cordovaGeolocation',
    '$http',
    function ($scope,
              $ionicHistory,
              $state,
              $rootScope,
              $timeout,
              $stateParams,
              customerDetailService,
              $cordovaClipboard,
              hmsPopup,
              $ionicActionSheet,
              $ionicScrollDelegate,
              $cordovaActionSheet,
              $ionicModal,
              customerSearchService,
              baseConfig,
              contactLocal,
              customerService,
              customerAddService,
              $filter,
              $cordovaGeolocation,
              $http) {
        console.log( $stateParams.customerDetail);
        $rootScope.$broadcast("REFRESH_CUSTOMER_HISTORY");
        $rootScope.img = "build/img/tabs/edit_add@3x_5.png";
        $scope.permissionFlag =  false;
        $scope.myLocation = {};
        $scope.cusLocation = {};
        $scope.imgButton = true;
        $scope.customer = {};
        $scope.application = [];
        $scope.permission =[];
        $scope.subHeaders = [{
          title: "销售动态",
          icon: "icon_windmill"
        }, {
          title: "详情",
          icon: "icon_letter"
        }, {
          title: "联系人",
          icon: "icon_contact"
        }, {
          title: "协作人",
          icon: "icon_partner"
        }, {
          title: "线索",
          icon: "icon_link"
        }, {
          title: "商机",
          icon: "icon_business"
        }, {
		  title: "保证金",
		  icon: "icon_moeny_gray"
		}];
        //  , {
        //  title: "变更日志",
        //  icon: "icon_letter"
        //}];

        $scope.showMenuFlag = -1;
        $scope.subHeadersSelect = [true];

        function getCustomerDetailSuccess(response) {
        if (response.returnCode == "S") {
          $scope.customer = response.customer_detail;
          $scope.customer.approveShow = $scope.customer.approveTypeName=='已审核'||$scope.customer.approveTypeName==''?'':'('+$scope.customer.approveTypeName+')';
          if(response.situtions){
            $scope.application = response.situtions;
          }else{
            $scope.application =[];
          }
          console.log($scope.customer);
        }
      }

        $scope.copyAddress = function () {
          var textAddress = $scope.customer.provinceName + $scope.customer.cityName + $scope.customer.zoneName + $scope.customer.addressDetails;
          $cordovaClipboard
            .copy(textAddress)
            .then(function () {
              hmsPopup.showPopup('地址复制成功:'+textAddress);
            }, function () {
              hmsPopup.showPopup("复制失败，请重新尝试");
            });
        };


        console.log($scope.customerId);
        //customerDetailService.getCustomerDetail(getCustomerDetailSuccess, $scope.customerId);

        $scope.showMenu = function () {
          var hideSheet = $ionicActionSheet.show({
            buttons: [
              {text: '共享'},
              {text: '转移'},
              {text: '修改'},
              {text: $scope.customer.dataStatusName=='启用'?'禁用客户':'启用客户'},
              {text: '提交审批'},
            ],
            cancelText: '取消',
            cancel: function () {
              // add cancel code..
            },
            buttonClicked: function (index) {
              if (index == 0) {//共享
                for(var i=0;i<$scope.permission.length;i++){
                  if($scope.permission[i]=='HCRM_OPERATION_SHARE'){
                    $scope.showShareSelect();
                    $scope.permissionFlag =true;
                  }
                }
                if(!$scope.permissionFlag){
                  hmsPopup.showPopup('权限不足！');
                }else{
                  $scope.permissionFlag =  false;
                }

              } else if (index == 1) {//客户转移
                for(var i=0;i<$scope.permission.length;i++){
                  if($scope.permission[i]=='HCRM_OPERATION_TRANSFER'){
                    $scope.showSelectDiv('transfer');

                    $scope.selectItem = function ($index) {
                      $scope.showSelectDiv();
                      var date = $filter('date')(new Date(), 'yyyy-MM-dd');
                      var transferParam = {
                        "customerId": $scope.customer.customerId,
                        "transferBeforEmp": window.localStorage.empno,
                        "transferAfterEmp": $scope.items[$index].userId,
                        "effectiveDate": date,
                        "description": "转移原因"
                      };
                      customerDetailService.customerTransfer(transferCustomerSuccess, transferParam);
                    };
                    $scope.permissionFlag =true;
                  }
                }
                if(!$scope.permissionFlag){
                  hmsPopup.showPopup('权限不足！');
                }else{
                  $scope.permissionFlag =  false;
                }

              } else if (index == 2) {//修改
                for(var i=0;i<$scope.permission.length;i++){
                  if($scope.permission[i]=='HCRM_OPERATION_EDIT'){
                    customerDetailService.setIsEdit(true);
                    customerAddService.setIsAdd(true);
                    customerDetailService.setEditCustomer($scope.customer);
                    customerDetailService.setApplication($scope.application);
                    $scope.permissionFlag =true;
                    if($scope.customer.approveTypeName=='未提交'||$scope.customer.approveTypeName=='已拒绝'){
                      $state.go('tab.customerAdd');
                    }else {
                      $state.go('tab.improveInformation');
                    }
                  }
                }
                if(!$scope.permissionFlag){
                  hmsPopup.showPopup('权限不足！');
                }else{
                  $scope.permissionFlag =  false;
                }

              } else if (index == 3) {//客户禁用启用
                for(var i=0;i<$scope.permission.length;i++){
                  if($scope.permission[i]=='HCRM_OPERATION_ENABLE'||$scope.permission[i]=='HCRM_OPERATION_DISABLE'){
                    customerDetailService.disableCustomer(disableCustomerSuccess,$scope.customer.customerId,$scope.customer.dataStatus);
                    $scope.permissionFlag =true;
                  }
                }
                if(!$scope.permissionFlag){
                  hmsPopup.showPopup('权限不足！');
                }else{
                  $scope.permissionFlag =  false;
                }


              }else if (index == 4) {//客户审批
                if($scope.customer.approveType=='HCRM_SUBMITTED'||$scope.customer.approveType=='HCRM_APPROVED'){
                  hmsPopup.showPopup('该客户已提交审批！');
                }else {
                  for(var i=0;i<$scope.permission.length;i++){
                    if($scope.permission[i]=='HCRM_OPERATION_APPROVAL_COMMIT'){
                      customerService.submitReview(customerCheckSuccess,$scope.customer.customerId);
                      $scope.permissionFlag =true;
                      customerDetailService.getCustomerDetail(getCustomerDetailSuccess, $scope.customerId);
                    }
                  }
                  if(!$scope.permissionFlag){
                    hmsPopup.showPopup('权限不足！');
                  }else{
                    $scope.permissionFlag =  false;
                  }

                }


              }
              return true;
            }
          });
        };

        var addData = {
          customerId: $stateParams.customerDetail.customerId,
          fullName: $stateParams.customerDetail.fullName
        };

        $ionicModal.fromTemplateUrl('build/pages/application/opportunities/opportunity-add/opportunity-add.html',{
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal){
          $scope.opportunityAddModel = modal;
        });

      $scope.$on('CLOSE_OPPORTUNITY_ADD',function(){
        $scope.opportunityAddModel.hide();
      });

      $scope.$on('OPPORTUNITY_ADD_SUCCESS',function() {
        $scope.opportunityAddModel.hide();
        $scope.$broadcast("REFRESH_OPPORTUNITY");
        $ionicScrollDelegate.$getByHandle('detailScroll').scrollTop(false);
      });

      $ionicModal.fromTemplateUrl('build/pages/application/clue/clue-add/clue-add.html',{
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal){
        $scope.clueAddModel = modal;
      });

      $scope.$on('CLOSE_CLUE_ADD',function(){
        $scope.clueAddModel.hide();
      });

      $scope.$on('CLUE_ADD_SUCCESS',function() {
        $scope.clueAddModel.hide();
        $scope.$broadcast("REFRESH_CLUE");
        $ionicScrollDelegate.$getByHandle('detailScroll').scrollTop(false);
      });

      $scope.$on('$ionicView.beforeEnter', function (e) {
          $scope.selectSubHeader(customerDetailService.getTabNumber());
      } )
      console.log("enter外面");
      console.log($ionicHistory.viewHistory().backView);
      console.log(angular.toJson($stateParams.customerDetail));

      $scope.$on('$ionicView.enter', function (e) {
        console.log($ionicHistory.viewHistory().backView);
        console.log(angular.toJson($stateParams.customerDetail));
        /*$scope.customerId = $stateParams.customerDetail.customerId;*/
        customerDetailService.setIsEdit(true);
        $scope.customerId =window.localStorage.customerId;
          console.log($scope.customerId);
        $scope.permissionValue = {
          recordId : $scope.customerId,
          modularCode :'HCRM_MODULAR_CUSTOMER'
        }
        if(customerDetailService.getTabNumber()==3){
          $scope.imgButton = false;
        }else {
          $scope.imgButton = true;
        }
        customerDetailService.getCustomerDetail(getCustomerDetailSuccess, $scope.customerId);
        customerDetailService.getPermissions(getPermissionsSuccess,$scope.permissionValue );
        $scope.$apply();
        //$scope.selectSubHeader(0);
        $scope.selectSubHeader(customerDetailService.getTabNumber());
        //if(customerService.getIsCustomer()){
        //  $scope.selectSubHeader(0);
        //}
      });

        $ionicModal.fromTemplateUrl('build/pages/application/bidbond/bidbond-add/bidbond-add.html', {
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal) {
			$scope.addbidbondModel = modal;
		});

      var pickContact = function(){
        ContactsPlugin.pickContact(function(response){
          var email = response.emailList.length == 0 ? "" : response.emailList[0].value;
          var phone = response.phoneList.length == 0 ? "" : response.phoneList[0].value;
          hmsPopup.showLoading("加载中");
          console.log($scope.customer);
          var contact = {
            "contactId": "",
            "customerId": $scope.customerId,
            "contactType": "",
            "fullName": $scope.customer.fullName,
            "name": response.name,
            "sex": "",
            "department": "",
            "position": "",
            "phone": phone,
            "tel": "",
            "email": email,
            "wechat": "",
            "role": "",
            "status": "HCRM_ENABLE",
            "statusValue": "有效",
            "addressCountry": "",
            "addressProvince": "",
            "addressCity": "",
            "addressZone": "",
            "addressDetails": "",
            "addressZipCode": ""
          };
          $state.go('tab.addLinkman', {param: contact});
        }, function(){
          hmsPopup.showPopup('选取错误，请重新选择');
        });
      };

      var validCustomerContactsSuccess;

      $scope.contentInner = "build/pages/application/customers/customer-detail/customer-detail-state/customer-detail-state.html";
        $scope.selectSubHeader = function ($index) {
          console.log("进去切换页");
          $ionicScrollDelegate.$getByHandle('detailScroll').scrollTop(true);
          $scope.transformButton($index);
          if ($index == 0) {
            $scope.imgButton = true;
            var addData = {
              customerId: $scope.customerId,
              fullName: $scope.customer.fullName
            };
            $scope.contentInner = "build/pages/application/customers/customer-detail/customer-detail-state/customer-detail-state.html";
            $scope.chooseThis = function () {
              $state.go('tab.plans-add',{planData:addData});
            }
          } else if ($index == 1) {
            $scope.imgButton = true;
            $scope.contentInner = "build/pages/application/customers/customer-detail/customer-detail-detail/customer-detail-detail.html";
            $scope.chooseThis = function () {

              for(var i=0;i<$scope.permission.length;i++){
                if($scope.permission[i]=='HCRM_OPERATION_EDIT'){
                  customerDetailService.setIsEdit(true);
                  customerAddService.setIsAdd(true);
                  customerDetailService.setEditCustomer($scope.customer);
                  customerDetailService.setApplication($scope.application);
                  $scope.permissionFlag =true;
                  if($scope.customer.approveTypeName=='未提交'||$scope.customer.approveTypeName=='已拒绝'){
                    $state.go('tab.customerAdd');
                  }else {
                    $state.go('tab.improveInformation');
                  }
                }
              }
              if(!$scope.permissionFlag){
                hmsPopup.showPopup('权限不足！');
              }else{
                $scope.permissionFlag =  false;
              }
            }
          } else if ($index == 2) {
            $scope.imgButton = true;
            $scope.contentInner = "build/pages/application/customers/customer-detail/customer-detail-contact/customer-detail-contact.html";
            $scope.chooseThis = function () {
              var addData = {
                customerId: $scope.customerId,
                fullName: $scope.customer.fullName,
                statusValue:"有效",
                status:"HCRM_ENABLE"
              };
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
                      /*    if (baseConfig.debug) {
                       warn(btnIndex);
                       }*/
                      if (btnIndex == 1) {
                        $state.go('tab.addLinkman', {param: addData});
                        return true;
                      } else if (btnIndex == 2) {

                        $scope.scanBusinessCard();

                        return true;
                      } else if (btnIndex == 3) {
                        pickContact()
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
                      $state.go('tab.addLinkman', {param: addData});
                    } else if (index == 1) {
                      $scope.scanBusinessCard();
                    } else if (index == 2) {
                      pickContact();
                    }
                  }
                });
              }
            }
          } else if ($index == 3) {
            $scope.imgButton = false;
            $scope.contentInner = "build/pages/application/customers/customer-detail/customer-detail-collaborators/customer-detail-collaborators.html";
          } else if($index == 4) {
            $scope.imgButton = true;
            $scope.contentInner = "build/pages/application/customers/customer-detail/customer-detail-clue/customer-detail-clue.html";
            validCustomerContactsSuccess = function(response){
              $scope.showCrmLoading = false;
              if(response.returnCode == 'S'){
                if(response.customer_contact_list.length == 0){
                  hmsPopup.showPopup('客户缺少"主要联系人"信息，请补充信息后再进行创建');
                } else{
                  $scope.searchModel = {
                    searchValueKey: ''
                  };
                  $scope.clueAddModel.show();
                  $scope.$broadcast("HAVE_DATA",{
                    customerId : $scope.customerId,
                    customerName : $scope.customer.fullName
                  });
                }
              }
            };
            $scope.chooseThis = function () {
              if($scope.customer.dataStatus == 'HCRM_DISABLE'){
                hmsPopup.showPopup('该客户已被禁用，无法创建线索');
                return ;
              }
              $scope.showCrmLoading = true;
              customerDetailService.getCustomerContacts(validCustomerContactsSuccess, 1, 10, $scope.customerId);
            }
          } else if ($index == 5) {
            $scope.imgButton = true;
            $scope.contentInner = "build/pages/application/customers/customer-detail/customer-detail-opportunity/customer-detail-opportunity.html";
            validCustomerContactsSuccess = function(response){
              $scope.showCrmLoading = false;
              if(response.returnCode == 'S'){
                if(response.customer_contact_list.length == 0){
                  hmsPopup.showPopup('客户缺少"主要联系人"信息，请补充信息后再进行创建');
                } else{
                  $scope.searchModel = {
                    searchValueKey: ''
                  };
                  $scope.opportunityAddModel.show();
                  $scope.$broadcast("HAVE_DATA",{
                    customerId : $scope.customerId,
                    customerName : $scope.customer.fullName
                  });
                }
              }
            };

            $scope.chooseThis = function () {
              if($scope.customer.dataStatus == 'HCRM_DISABLE'){
                hmsPopup.showPopup('该客户已被禁用，无法创建商机');
                return ;
              }
              $scope.showCrmLoading = true;
              customerDetailService.getCustomerContacts(validCustomerContactsSuccess, 1, 10, $scope.customerId);
            }
          }else if($index == 6) {
				$scope.imgButton = true;
				$scope.contentInner = "build/pages/application/customers/customer-detail/customer-detail-bidbond/customer-detail-bidbond.html";
				$scope.chooseThis = function() {
					$state.go('tab.bidbond-add');
				}
		  } else if ($index == 7) {
            $scope.contentInner = "build/pages/application/customers/customer-detail/customer-detail-change-log/customer-detail-change-log.html";
          }
          if ($scope.subHeadersSelect[$index])
            return 0;
          else {
            $scope.subHeadersSelect = [];
            $scope.subHeadersSelect[$index] = true;
          }
        };

        $scope.goBack = function (customer) {
          console.log("goBck--===");
          console.log(customer);
          console.log($ionicHistory.viewHistory());
          customerDetailService.setIsEdit(false);
          customerDetailService.setTabNumber(0);
          if ($ionicHistory.viewHistory().backView && customerDetailService.getIsCustomerAdd()===false) {
            $ionicHistory.goBack();

          }else if (customerDetailService.getIsCustomerAdd()===true){
            customerDetailService.setIsCustomerAdd(false);
            customerService.setIsCustomer(true);
            $state.go('tab.customers');
          } else {
            $state.go('tab.contactDetail',{customerDetail:customer});
          }
        };

        $scope.isEdit = false;
        $scope.buttonImg = "build/img/application/customer/detail/edit_add@3x_5.png";
        $scope.transformButton = function (index) {
          $scope.isEdit = index == 1;
          $scope.buttonImg = $scope.isEdit ? "build/img/application/customer/detail/edit@3x.png" : "build/img/application/customer/detail/edit_add@3x_5.png";
          console.log(index);
        };
      $scope.selectSubHeader(0);
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

      $scope.data = {
        employeeId: ""
      };
      $scope.showData = {
        name: ""
      };
      $scope.items = [];

      $scope.searchValueKey = '';
      $scope.sourceItems = [];
      $scope.noDataFlag = false;

      $scope.searchValue = function () {
        $ionicScrollDelegate.$getByHandle('transferScroll').scrollTop(false);
        $scope.items = [];
        if ($scope.searchValueKey == '') {
          customerService.getEmployee(transferEmployeeSuccess,'',1,1000);
        }
        else {
          customerService.getEmployee(transferEmployeeSuccess,$scope.searchValueKey,1,1000);
        }
      };
      $scope.showSelectDiv = function () {
        $ionicScrollDelegate.$getByHandle('transferScroll').scrollTop(false);
        $scope.showSelect = !$scope.showSelect;
        customerService.getEmployee(transferEmployeeSuccess,'',1,1000);
      };
      $scope.clearSelectFilter = function(){
        $scope.searchValueKey = '';
        $scope.searchValue();
      };

      var transferEmployeeSuccess = function (response) {
        $scope.showCrmLoading = false;
        console.log("more");
        if(response.returnCode == 'S'){
          for(var i = 0; i < response.employee_list.length; i++){
            response.employee_list[i].showModal = response.employee_list[i].name + ' (' + response.employee_list[i].employeeCode + ')   ' + response.employee_list[i].organizationName;
          }
          $scope.items = $scope.items.concat(response.employee_list);
          $scope.sourceItems = $scope.items.clone();
          $scope.moreDataCanBeLoaded = response.employee_list.length == $scope.pageSize;
        } else {
          $scope.moreDataCanBeLoaded = false;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };
      ///////////////////////分享客户选择/////////////////////////////

      var getTeamSuccess = function (response) {
        $scope.showCrmLoading = false;
        console.log("more");
        if(response.returnCode == 'S'){
          for(var i = 0; i < response.sale_team_list.length; i++){
            response.sale_team_list[i].showModal = response.sale_team_list[i].saleTeamName;
          }
          $scope.shareData = $scope.shareData.concat(response.sale_team_list);
        } else {
          $scope.moreDataCanBeLoaded = false;
        }
      };

      var getEmployeeSuccess = function (response) {
        $scope.showCrmLoading = false;
        console.log("more");
        if(response.returnCode == 'S'){
          for(var i = 0; i < response.employee_list.length; i++){
            response.employee_list[i].showModal = response.employee_list[i].name + ' (' + response.employee_list[i].employeeCode + ')   ' + response.employee_list[i].organizationName;
          }
          $scope.shareData = $scope.shareData.concat(response.employee_list);
          $scope.moreDataCanBeLoaded = response.employee_list.length ==  $scope.selectValue.pageSize;
          console.log($scope.moreDataCanBeLoaded);
        } else {
          $scope.moreDataCanBeLoaded = false;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      $scope.loadMoreData = function () {
        if($scope.inPersonal){
          console.log("上拉加载" + $scope.moreDataCanBeLoaded);
          $scope.selectValue.page++;
          customerService.getEmployee(getEmployeeSuccess,$scope.selectValue.keyWord,$scope.selectValue.page,$scope.selectValue.pageSize);

        }else{
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      };

      Array.prototype.clone = function () {
        return [].concat(this);
      };
      $scope.shareData = [];
      var CHINA_CODE = 1037;
      $scope.selectValue={
        keyWord:"",
        page:1,
        pageSize:15
      };
      $scope.shareValue = {
        "customerId": '',
        "shareType": "HCRM_SHARE_SALE",
        "fullName":'',
        "saleId": "",
        "teamId": "",
        "beginDate": "2000-01-01",
        "endDate": "5000-01-01"
      }
      $scope.moreDataCanBeLoaded = false;
      $scope.clearFilter = function () {
        $scope.selectValue.keyWord = '';
        $scope.selectValue.page = 1;
      };

      $scope.showShareFlag = false;
      $ionicModal.fromTemplateUrl('build/pages/modals/crmCustomerShareModal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal1) {
        $scope.crmShareModal = modal1;
      });
      $scope.showShareSelect = function () {
        $scope.inPersonal = true;
        $scope.selectValue.page =  1;
        $scope.shareData = [];
        $scope.showCrmLoading=!$scope.showCrmLoading;
        if ($scope.showShareFlag) {
          $scope.crmShareModal.hide();
        } else {
          $scope.crmShareModal.show();
        }
        $scope.showShareFlag = !$scope.showShareFlag;
        if($scope.inPersonal){
          customerService.getEmployee(getEmployeeSuccess,$scope.selectValue.keyWord,$scope.selectValue.page,$scope.selectValue.pageSize);
        }else{
          customerDetailService.getSaleTeam(getTeamSuccess,'');
        }
      };

      $scope.inPersonal = true;

      $scope.changePersonal = function (flag) {
        $ionicScrollDelegate.$getByHandle('shareScroll').scrollTop(false);
        $scope.showCrmLoading=true;
        if (flag == $scope.inPersonal)
          return;
        $scope.shareData=[];
        $scope.selectValue.keyWord=''
        $scope.selectValue.page= 1;
        $scope.inPersonal = flag;
        if($scope.inPersonal){
          customerService.getEmployee(getEmployeeSuccess,$scope.selectValue.keyWord,$scope.selectValue.page,$scope.selectValue.pageSize);
        }else{
          customerDetailService.getSaleTeam(getTeamSuccess,'');
        }
      };

      $scope.selectShare = function ($index) {
        //拿到选择的值
        if($scope.inPersonal){
          $scope.shareValue.saleId =  $scope.shareData[$index].userId
          $scope.shareValue.fullName = $scope.customer.fullName;
          $scope.shareValue.customerId =$scope.customer.customerId;
          $scope.shareValue.shareType = 'HCRM_SHARE_SALE';
          console.log('共享权限==='+angular.toJson($scope.shareValue ));
          customerDetailService.shareCustomer(shareCustomerSuccess,$scope.shareValue);
        }else {
          $scope.shareValue.teamId =  $scope.shareData[$index].saleTeamId
          $scope.shareValue.fullName = $scope.customer.fullName;
          $scope.shareValue.customerId =$scope.customer.customerId;
          $scope.shareValue.shareType = 'HCRM_SHARE_TEAM';
          customerDetailService.shareCustomer(shareCustomerSuccess,$scope.shareValue);
        }
          $scope.showShareSelect();
          return;
      };
      //搜索分享人
      $scope.filterShare = function () {
        $ionicScrollDelegate.$getByHandle('shareScroll').scrollTop(false);
        if($scope.inPersonal){
           $scope.shareData = [];
           $scope.selectValue.page = 1;
           customerService.getEmployee(getEmployeeSuccess,$scope.selectValue.keyWord,$scope.selectValue.page,$scope.selectValue.pageSize);

        }else {
          $scope.shareData = [];
          $scope.selectValue.page = 1;
          customerDetailService.getSaleTeam(getTeamSuccess,$scope.selectValue.keyWord);
        }
      }

      //客户禁用
      var disableCustomerSuccess = function (data) {
        if(data.returnCode=='S'){
          hmsPopup.showPopup(data.returnMsg);
          customerDetailService.getCustomerDetail(getCustomerDetailSuccess, $scope.customerId);
          customerDetailService.getPermissions(getPermissionsSuccess,$scope.permissionValue );
        }else{
          if(data.returnMsg){
            hmsPopup.showPopup(data.returnMsg)
          }else{
            hmsPopup.showPopup('服务器系统出现异常，请联系管理员！')
          }
        }
      }
      //客户分享
      var shareCustomerSuccess = function (data) {
        if(data.returnCode=='S'){
          hmsPopup.showPopup(data.returnMsg);
          customerDetailService.getCustomerDetail(getCustomerDetailSuccess, $scope.customerId);
          customerDetailService.getPermissions(getPermissionsSuccess,$scope.permissionValue );
        }else{
          if(data.returnMsg){
            hmsPopup.showPopup(data.returnMsg)
          }else{
            hmsPopup.showPopup('服务器系统出现异常，请联系管理员！')
          }
        }
      }

      //客户转移
      var transferCustomerSuccess = function (data) {
        if(data.returnCode=='S'){
          hmsPopup.showPopup(data.returnMsg);
          customerDetailService.getCustomerDetail(getCustomerDetailSuccess, $scope.customerId);
          customerDetailService.getPermissions(getPermissionsSuccess,$scope.permissionValue );
        }else{
          if(data.returnMsg){
            hmsPopup.showPopup(data.returnMsg)
          }else{
            hmsPopup.showPopup('服务器系统出现异常，请联系管理员！')
          }
        }
      }
      //权限获取
      var getPermissionsSuccess = function (data) {
        if(data.returnCode=='S'&& data.returnCode){
          $scope.permission = data.permissions;
        }else{
          if(data.returnMsg){
            hmsPopup.showPopup(data.returnMsg)
          }else{
            hmsPopup.showPopup('服务器系统出现异常，请联系管理员！')
          }
        }
      }
      //客户审批
      var customerCheckSuccess = function(data){
        $scope.showCrmLoading = false;
        if(data.returnCode == 'S'){
          hmsPopup.showPopup(data.returnMsg);
          customerDetailService.getCustomerDetail(getCustomerDetailSuccess, $scope.customerId);
          customerDetailService.getPermissions(getPermissionsSuccess,$scope.permissionValue );
        }else{
          if(data.returnMsg){
            hmsPopup.showPopup(data.returnMsg)
          }else{
            hmsPopup.showPopup('服务器系统出现异常，请联系管理员！')
          }
        }
      };

      $scope.showLocation = function () {
        var hideSheet = $ionicActionSheet.show({
          buttons: [
            {text: '复制地址'},
            {text: '地图导航'}
          ],
          cancelText: '取消',
          cancel: function () {
            // add cancel code..
          },
          buttonClicked: function (index) {
            if (index == 0) {
              $scope.copyAddress();
            } else if (index == 1) {
              $scope.openLocation();
            }
            return true;
          }
        });
      }
      var onSuccess = function (position1) {
        console.log('成功=='+angular.toJson(position1));
        $scope.myLocation.lat = position1.coords.latitude;
        $scope.myLocation.lng = position1.coords.longitude;
        //通过客户地址返回客户所在地经纬度
        var cusUrl = "http://api.map.baidu.com/geocoder/v2/?callback=renderOption()&output=json&address="+$scope.customer.cityName+
          $scope.customer.zoneName+$scope.customer.addressDetails+ "&city="+$scope.customer.cityName+"&ak=5WXxKpATT2RsEaYyVs6jxVOAbP6047m2";
        //alert(cusUrl);
        $http.post(cusUrl).success(function (data) {
          console.log('请求数据成功！！');
          console.log(data);
          if(data.result!=''&&data.status==0&&(data.result.level=='城市'||data.result.level=='区县'||data.result.level=='道路')){
            console.log("json==="+angular.toJson(data.result.location));
            $scope.cusLocation.lat = data.result.location.lat;
            $scope.cusLocation.lng = data.result.location.lng;
            // 通过 Ip 定位自己返回经纬度 、详细地址信息。
            var locUrl = "https://api.map.baidu.com/location/ip?ak=5WXxKpATT2RsEaYyVs6jxVOAbP6047m2&coor=bd09ll"
            $http.post(locUrl).success(function (data) {
              console.log('请求数据成功！！');
              console.log(data);
              if(data.content==''){
                hmsPopup.showPopup('当前位置定位失败');
              }else {
                $scope.myLocation.address = data.content.address;
                $scope.myLocation.province = data.content.address_detail.province;
                var url = "https://api.map.baidu.com/direction?origin=latlng:"+$scope.myLocation.lat+","+$scope.myLocation.lng+"|name:"+ $scope.myLocation.address+
                  "&destination=latlng:"+$scope.cusLocation.lat+","+$scope.cusLocation.lng+"|name:"+$scope.customer.addressDetails+
                  "&mode=driving&origin_region="+$scope.myLocation.province+"&destination_region="+$scope.customer.cityName+
                  "&output=html&ak=5WXxKpATT2RsEaYyVs6jxVOAbP6047m2";
                window.open(encodeURI(url), '_system', 'location=yes');
              }
            }).error(function (data) {
              console.log('请求数据失败！！');
            })

          }else {
            hmsPopup.showPopup('客户位置解析错误');
          }
        }).error(function (data) {
          console.log('请求数据失败！！');
          hmsPopup.showPopup('客户位置解析错误');
        })
      };

      var onError = function (error) {
        console.log('错误== '+error);
        //alert('错误== '+angular.toJson(error));
        hmsPopup.showPopup('当前定位失败！'+angular.toJson(error));
      }


      //地图
      $scope.openLocation = function () {
        var options = {
          enableHighAccuracy: true,  // 是否使用 GPS
          maximumAge: 30000,         // 缓存时间
          timeout: 27000,            // 超时时间
          coorType: 'bd09ll'         // 默认是 gcj02，可填 bd09ll 以获取百度经纬度用于访问百度 API
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

      }

    }]);

angular.module('customerModule')
  .service('customerDetailService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    '$http',
    function (hmsHttp,
              hmsPopup,
              baseConfig,
              $http) {
      var isCustomerAdd = false;
      var isEdit = false;
      var tabNumber = 0;
      var editCustomer = {};
      var application = [];
      var contactFlag=true;
      var baseUrl = baseConfig.basePath;

      this.getCustomerDetail = function (success, customerId) {
        var params = {
          customerId: customerId
        };
        console.log(params);
        hmsHttp.post(baseUrl + 'query_customer_detail', params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });

      };

      //得到客户联系人列表
      this.getCustomerContacts = function(success, page, pageSize, customerId){
        var params = {
          page: page,
          pageSize: pageSize,
          customerId: customerId
        };
        console.log(params);
        hmsHttp.post(baseUrl + 'customer_contact_list', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };
      //所属团队
      this.getSaleTeam = function (success,keyWord) {
        var params = {
          keyWord:keyWord
        };
        hmsHttp.post(baseUrl + 'query_sale_team', params).success(function (result) {
          success(result);
        }).error(function (response, status) {
          hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };
      //禁用、启用客户
      this.disableCustomer = function(success,customerId,dataStatus){
        var params = {
          customerId: customerId,
          dataStatus:dataStatus
        };
        console.log(params);
        hmsHttp.post(baseUrl + 'customer_transform_status', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      //分享客户
      this.shareCustomer = function(success,param){
        var params =  param;
        console.log(params);
        hmsHttp.post(baseUrl + 'customer_share', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.showPopup(response);
        });
      };

      this.customerTransfer = function (success, key) { //转移客户
        hmsHttp.post(baseUrl + 'customer_transfer', key).success(function (result) {
          success(result);
          hmsPopup.hideLoading();
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          // hmsPopup.showPopup(response);
        });
      };
      this.getPermissions = function (success, key) { //权限获取
        hmsHttp.post(baseUrl + 'all_permissions', key).success(function (result) {
          success(result);
          hmsPopup.hideLoading();
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          // hmsPopup.showPopup(response);
        });
      };

      this.setIsCustomerAdd = function (val) {
        isCustomerAdd = val;
      };
      this.getIsCustomerAdd = function () {
        return isCustomerAdd;
      };
      this.setEditCustomer = function (val) {
        editCustomer = val;
      };
      this.getEditCustomer = function () {
        return editCustomer;
      };
      this.setIsEdit = function (val) {
        isEdit = val;
      };
      this.getIsEdit = function () {
        return isEdit;
      };
      this.getApplication = function () {
        return application;
      };
      this.setApplication = function (val) {
        application = val;
      };
      this.getTabNumber = function () {
        return tabNumber;
      };
      this.setTabNumber = function (val) {
        tabNumber = val;
      };
      this.setIsContact=function(val){
        contactFlag = val;
      };
      this.getIsContact=function(){
        return contactFlag;
      };
      this.getCustomerEmployee = function (page,pageSize,keyWord,success) { //查询客户负责人
        var params = {
          page: page,
          pageSize:pageSize,
          keyWord:keyWord
        };
        hmsHttp.post(baseUrl + 'customer_employee', params).success(function (result) {
          success(result);
          hmsPopup.hideLoading();
        }).error(function (response, status) {
          // hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };
      this.transferEmployee = function (params,success) { //转移客户负责人
        hmsHttp.post(baseUrl + 'customer_transfer', params).success(function (result) {
          success(result);
          hmsPopup.hideLoading();
        }).error(function (response, status) {
          // hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };
      this.collaboratorInvalid=function(params,success,index){
        hmsHttp.post(baseUrl + 'collaborator_invalid', params).success(function (result) {
          success(result,index);
          hmsPopup.hideLoading();
        }).error(function (response, status) {
          // hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      }
    }
  ]);



