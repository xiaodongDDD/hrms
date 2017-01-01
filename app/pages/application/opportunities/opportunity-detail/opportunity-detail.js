/**
 * Created by wkh on 2016/10/13.
 */
'use strict';
angular.module('opportunityModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.opportunity-detail', {
          url: '/opportunity-detail',
          params: {
            data: {}
          },
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/opportunities/opportunity-detail/opportunity-detail.html',
              controller: 'opportunityDetailCtrl'
            }
          }
        })
    }]);
angular.module('opportunityModule')
  .controller('opportunityDetailCtrl', [
    '$scope',
    '$ionicHistory',
    '$state',
    'hmsHttp',
    'hmsPopup',
    'baseConfig',
    'opportunityDetailService',
    '$stateParams',
    '$ionicActionSheet',
    '$filter',
    '$timeout',
    '$cordovaClipboard',
    '$ionicScrollDelegate',
    '$rootScope',
    '$cordovaActionSheet',
    'customerSearchService',
    'contactLocal',
    '$ionicModal',
    'opportunityDetailDataService',
    'OpportunityDetailCompetitorService',
    'opportunityPermissionService',
    'opportunityBidbondService',
    function ($scope,
              $ionicHistory,
              $state,
              hmsHttp,
              hmsPopup,
              baseConfig,
              opportunityDetailService,
              $stateParams,
              $ionicActionSheet,
              $filter,
              $timeout,
              $cordovaClipboard,
              $ionicScrollDelegate,
              $rootScope,
              $cordovaActionSheet,
              customerSearchService,
              contactLocal,
              $ionicModal,
              opportunityDetailDataService,
              OpportunityDetailCompetitorService,
              opportunityPermissionService,
    		  opportunityBidbondService) {

      $rootScope.$broadcast("REFRESH_CUSTOMER_HISTORY");

      var param = {
        opportunityId: $stateParams.data.opportunityId
      };

      opportunityPermissionService.setOpportunityId($stateParams.data.opportunityId);
      opportunityPermissionService.updatePermission();

      window.localStorage.opportunityId = $stateParams.data.opportunityId;
      window.localStorage.customerId = $stateParams.data.customerId;
      window.localStorage.opportunityName = $stateParams.data.opportunityName;

      $scope.goCustomer = function () {
        window.localStorage.customerId = $scope.opportunity.customerId;
        $state.go('tab.customer-detail');
      };

      $scope.opportunity = {};
      $scope.data = {
        employeeId: ""
      };
      $scope.showData = {
        name: ""
      };
      $scope.items = [];
      $scope.nowSelectTarget = {};
      hmsPopup.showLoading("加载中...");

      //获得竞争列表并存储至service
      var getListSuccessInit = function (result) {
        if (result.returnCode == "S") {
          hmsPopup.hideLoading();
          $scope.competitors = result.competitor_list;
          opportunityDetailDataService.setOpportunityItem('competitors', $scope.competitors);
          $scope.$broadcast('REFRESH_DETAIL');
          console.log(opportunityDetailDataService.getOpportunity());
        }
      };

      //获得基本数据信息并存储至service
      var initDetailSuccess = function (result) {
        if (result.returnCode == "S") {
          $scope.opportunity = result.opportunity_detail;
          $scope.opportunity.industry = $scope.opportunity.majorIndustryName + " | " + $scope.opportunity.subIndustryName;
          $scope.opportunity.saleBelong = $scope.opportunity.saleAreaName + " | " + $scope.opportunity.saleTeamName;
          $scope.customerAddress = result.customer_address;
          $scope.noPermissionCopy = !result.customer_address.addressCountry;
          $scope.estimates = result.opportunity_products;
          opportunityDetailDataService.setOpportunity($scope.opportunity);
          opportunityDetailDataService.setOpportunityItem('presells', $scope.estimates);
          var paramCompetitors = {
            "opportunityId": window.localStorage.opportunityId
          };
          OpportunityDetailCompetitorService.getCompetitorList(getListSuccessInit, paramCompetitors);
          window.localStorage.customerId = result.opportunity_detail.customerId;
          window.localStorage.fullName = result.opportunity_detail.customerName;
        } else {
          hmsPopup.showPopup(result.returnMsg);
          $scope.goBack();
        }
      };

      var initOpportunityData = function () {
        opportunityDetailService.getOpportunityDetail(initDetailSuccess, param);
      };

      initOpportunityData();

      $scope.copyAddress = function () {
        if($scope.noPermissionCopy){
          hmsPopup.showPopup('抱歉，您无权查看该客户地址');
          return;
        }
        console.log($scope.customerAddress);
        var textAddress = $scope.customerAddress.countryName + "、" + $scope.customerAddress.provinceName + "、" + $scope.customerAddress.cityName + "、" + $scope.customerAddress.zoneName + "、" + $scope.customerAddress.addressDetails;
        $cordovaClipboard
          .copy(textAddress)
          .then(function () {
            hmsPopup.showPopup("已复制以下数据：" + textAddress);
          }, function () {
            hmsPopup.showPopup("复制失败，请重新尝试");
          });
      };

      $scope.subHeaders = [{
        title: "销售动态",
        icon: "icon_windmill"
      }, {
        title: "商机详情",
        icon: "icon_business"
      }, {
        title: "竞争对手",
        icon: "icon_pk_gray"
      }, {
        title: "联系人",
        icon: "icon_contact"
      }, {
        title: "负责人",
        icon: "icon_partner"
   	  }, {
		title: "保证金",
		icon: "icon_moeny_gray"
      // }, {
      //   title: "报价",
      //   icon: "icon_moeny_gray"
      // }, {
      //   title: "合同",
      //   icon: "icon_product"
      // }, {
      //   title: "立项",
      //   icon: "icon_pen_gray"
      // }, {
      //   title: "变更日志",
      //   icon: "icon_letter"
      }
      ];
      $scope.goCustomer = function () {
        $state.go("tab.customer-detail");
      };

      $scope.hideTitleFlag = false;
      $scope.onDragContent = function ($event) {
        if ($ionicScrollDelegate.$getByHandle('detailScroll').getScrollPosition().top <= 0 && $event.gesture.deltaY > 0)
          $scope.hideTitleFlag = false;
        else if ($event.gesture.deltaY < 0)
          $scope.hideTitleFlag = true;
      };


      $scope.showMenuFlag = -1;
      $scope.subHeadersSelect = [true];
      var statusSuccessInit = function (result) {
        console.log(result);
        opportunityPermissionService.updatePermission();
        hmsPopup.showPopup(result.returnMsg);
        initOpportunityData();
      };
      var demoteSuccessInit = function (result) {
        console.log(result);
        if(result.returnCode == 'S'){
          $ionicHistory.goBack();
          $rootScope.$broadcast('REFRESH_OPPORTUNITY');
        }
        hmsPopup.showPopup(result.returnMsg);
      };
      var transferSuccessInit = function (result) {
        console.log(result);
        opportunityPermissionService.updatePermission();
        hmsPopup.showPopup(result.returnMsg);
      };
      var getCustomerEmployeeSuccess = function (response) {
        if (response.returnCode == 'S') {
          $scope.items = $scope.items.concat(response.employee_list);
          $scope.sourceItems = $scope.items.clone();
        }

        /* hmsPopup.showPopup(result.returnMsg);*/
      };
      $scope.showMenu = function () {
        $scope.statusTitle = $scope.opportunity.status == "HCRM_ENABLE" ? "停用商机" : "启用商机";
        if (ionic.Platform.isWebView()) {
          console.log("webView");
          var options = {
            buttonLabels: [$scope.statusTitle, '转为线索', '转移'],
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
                  if($scope.opportunity.status == 'HCRM_ENABLE' && !opportunityPermissionService.checkPermission('HCRM_OPERATION_DISABLE')){
                    hmsPopup.showPopup('抱歉，你没有权限这么做。');
                    return true;
                  }
                  if($scope.opportunity.status == 'HCRM_DISABLE' && !opportunityPermissionService.checkPermission('HCRM_OPERATION_ENABLE')){
                    hmsPopup.showPopup('抱歉，你没有权限这么做。');
                    return true;
                  }
                  var statusParam = {
                    "opportunityId": param.opportunityId,
                    "status": $scope.opportunity.status
                  };
                  opportunityDetailService.transformStatus(statusSuccessInit, statusParam);
                  return true;
                } else if (btnIndex == 2) {
                  if($scope.opportunity.status == 'HCRM_DISABLE'){
                    hmsPopup.showPopup('商机已被停用，无法进行操作。');
                    return ;
                  }
                  if($scope.opportunity.opportunityStatus == 'HCRM_CLOSED'){
                    hmsPopup.showPopup('商机已关闭，无法进行操作。');
                    return ;
                  }
                  if(!opportunityPermissionService.checkPermission('HCRM_OPERATION_EDIT')){
                    hmsPopup.showPopup('抱歉，你没有权限这么做。');
                    return ;
                  }
                  opportunityDetailService.demoteOpportunity(demoteSuccessInit, $scope.opportunity);
                  return true;
                } else if (btnIndex == 3) {
                  if($scope.opportunity.status == 'HCRM_DISABLE'){
                    hmsPopup.showPopup('商机已被停用，无法进行操作。');
                    return ;
                  }
                  if(!opportunityPermissionService.checkPermission('HCRM_OPERATION_TRANSFER')){
                    hmsPopup.showPopup('抱歉，你没有权限这么做。');
                    return true;
                  }
                  $scope.showSelectDiv('transfer');
                  $scope.selectItem = function ($index) {
                    var data = $scope.items[$index][$scope.nowSelectTarget['dataKey']];  //接口所需数据
                    var showKey = $scope.items[$index][$scope.nowSelectTarget['showKey']];
                    var dataModel = $scope.nowSelectTarget['dataModel'];                 //最终操作提交所需的数据变量
                    var showDataModel = $scope.nowSelectTarget['showDataModel'];         //显示用的数据变量ng-model
                    eval(dataModel + " = data");
                    eval(showDataModel + " = showKey");
                    $scope.showSelectDiv();
                    var date = $filter('date')(new Date(), 'yyyy-MM-dd');
                    var transferParam = {
                      "opportunityId": param.opportunityId,
                      "transferBeforEmp": window.localStorage.empno,
                      "transferAfterEmp": $scope.data.employeeId,
                      "effectiveDate": date,
                      "description": "转移原因"
                    };
                    opportunityDetailService.opportunityTransfer(transferSuccessInit, transferParam);
                  };
                }
              });
          }, false);
        } else {
          var hideSheet = $ionicActionSheet.show({
            buttons: [
              {text: $scope.statusTitle},
              {text: '转为线索'},
              {text: '转移'}
            ],
            cancelText: '取消',
            cancel: function () {
              // add cancel code..
            },
            buttonClicked: function (index) {
              console.log(index);
              if (index == 0) {//更新状态
                if($scope.opportunity.status == 'HCRM_ENABLE' && !opportunityPermissionService.checkPermission('HCRM_OPERATION_DISABLE')){
                  hmsPopup.showPopup('抱歉，你没有权限这么做。');
                  return true;
                }
                if($scope.opportunity.status == 'HCRM_DISABLE' && !opportunityPermissionService.checkPermission('HCRM_OPERATION_ENABLE')){
                  hmsPopup.showPopup('抱歉，你没有权限这么做。');
                  return true;
                }
                var statusParam = {
                  "opportunityId": param.opportunityId,
                  "status": $scope.opportunity.status
                };
                opportunityDetailService.transformStatus(statusSuccessInit, statusParam);
                /*contactLocal.contactLocal(contactDetail);*/
                /*    console.log("保存至通讯录")*/
              } else if (index == 1) {
                if($scope.opportunity.status == 'HCRM_DISABLE'){
                  hmsPopup.showPopup('商机已被停用，无法进行操作。');
                  return ;
                }
                if(!opportunityPermissionService.checkPermission('HCRM_OPERATION_EDIT')){
                  hmsPopup.showPopup('抱歉，你没有权限这么做。');
                  return ;
                }
                opportunityDetailService.demoteOpportunity(demoteSuccessInit, $scope.opportunity);
              } else if (index == 2) {
                if($scope.opportunity.status == 'HCRM_DISABLE'){
                  hmsPopup.showPopup('商机已被停用，无法进行操作。');
                  return ;
                }
                if(!opportunityPermissionService.checkPermission('HCRM_OPERATION_TRANSFER')){
                  hmsPopup.showPopup('抱歉，你没有权限这么做。');
                  return true;
                }
                $scope.showSelectDiv('transfer');
                $scope.selectItem = function ($index) {
                  var data = $scope.items[$index][$scope.nowSelectTarget['dataKey']];  //接口所需数据
                  var showKey = $scope.items[$index][$scope.nowSelectTarget['showKey']];
                  var dataModel = $scope.nowSelectTarget['dataModel'];                 //最终操作提交所需的数据变量
                  var showDataModel = $scope.nowSelectTarget['showDataModel'];         //显示用的数据变量ng-model
                  eval(dataModel + " = data");
                  eval(showDataModel + " = showKey");
                  $scope.showSelectDiv();
                  var date = $filter('date')(new Date(), 'yyyy-MM-dd');
                  var transferParam = {
                    "opportunityId": param.opportunityId,
                    "transferBeforEmp": window.localStorage.empno,
                    "transferAfterEmp": $scope.data.employeeId,
                    "effectiveDate": date,
                    "description": "转移原因"
                  };
                  opportunityDetailService.opportunityTransfer(transferSuccessInit, transferParam);
                };

              }
              return true;
            }

          });
        }
      };

      $ionicModal.fromTemplateUrl('build/pages/application/opportunities/opportunity-add/opportunity-add.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.opportunityAddModel = modal;
      });

      $ionicModal.fromTemplateUrl('build/pages/application/opportunities/opportunity-detail/modal/add-competitor.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.opportunityAddCompetitorModel = modal;
      });

      $ionicModal.fromTemplateUrl('build/pages/application/bidbond/bidbond-add/bidbond-add.html', {
		scope: $scope,
		animation: 'slide-in-up'
	  }).then(function(modal) {
			$scope.addbidbondModel = modal;
	  });

      $scope.$on('CLOSE_OPPORTUNITY_ADD', function () {
        $scope.opportunityAddModel.hide();
      });

      $scope.$on('OPPORTUNITY_EDIT_SUCCESS', function () {
        $scope.opportunityAddModel.hide();
        opportunityDetailDataService.setOpportunityItem('opportunityId', $stateParams.data.opportunityId);
        opportunityPermissionService.updatePermission();
        initOpportunityData();
      });

      $scope.$on('CLOSE_COMPETITOR', function () {
        $scope.opportunityAddCompetitorModel.hide();
      });

      $scope.$on('COMPETITOR_ADD_SUCCESS', function () {
        $scope.opportunityAddCompetitorModel.hide();
        opportunityDetailDataService.setOpportunityItem('opportunityId', $stateParams.data.opportunityId);
        opportunityPermissionService.updatePermission();
        initOpportunityData();
      });

      $scope.$on('CLOSE_BIDBOND', function () {
        $scope.addbidbondModel.hide();
      });

      $scope.$on('BIDBOND_ADD_SUCCESS', function () {
        $scope.addbidbondModel.hide();
        opportunityDetailDataService.setOpportunityItem('opportunityId', $stateParams.data.opportunityId);
        opportunityPermissionService.updatePermission();
        initOpportunityData();
      });

      $scope.contentInner = "build/pages/application/opportunities/opportunity-detail/opportunity-detail-state/opportunity-detail-state.html";
      $scope.selectSubHeader = function ($index) {
        $ionicScrollDelegate.$getByHandle('detailScroll').scrollTop(true);
        $scope.transformButton($index);
        if ($index == 0) {
          $scope.contentInner = "build/pages/application/opportunities/opportunity-detail/opportunity-detail-state/opportunity-detail-state.html";
          $scope.chooseThis = function () {
            if($scope.opportunity.status == 'HCRM_DISABLE'){
              hmsPopup.showPopup('商机已被停用，无法进行操作。');
              return ;
            }
            if(!opportunityPermissionService.checkPermission('HCRM_OPERATION_CREATE_SALES_PLAN')){
              hmsPopup.showPopup('抱歉，你没有权限这么做。');
              return ;
            }
            var addData = {
              customerId: window.localStorage.customerId,
              fullName: window.localStorage.fullName,
              opportunityName: window.localStorage.opportunityName,
              opportunityId:window.localStorage.opportunityId
            };
            $state.go('tab.plans-add', {planData: addData});
          }
        } else if ($index == 1) {
          $scope.contentInner = "build/pages/application/opportunities/opportunity-detail/opportunity-detail-detail/opportunity-detail-detail.html";
          $scope.chooseThis = function () {
            if($scope.opportunity.status == 'HCRM_DISABLE'){
              hmsPopup.showPopup('商机已被停用，无法进行操作。');
              return ;
            }
            if($scope.opportunity.opportunityStatus == 'HCRM_CLOSED'){
              hmsPopup.showPopup('商机已关闭，无法进行操作。');
              return ;
            }
            if(!opportunityPermissionService.checkPermission('HCRM_OPERATION_EDIT')){
              hmsPopup.showPopup('抱歉，你没有权限这么做。');
              return ;
            }
            $ionicScrollDelegate.$getByHandle('slide-img').scrollTop(false);
            $scope.opportunityAddModel.show();
            $scope.$broadcast('EDIT_OPPORTUNITY');
          };
        } else if ($index == 2) {
          console.log("竞争对手");
          $scope.contentInner = "build/pages/application/opportunities/opportunity-detail/opportunity-detail-competitor/opportunity-detail-competitor.html";
          $scope.chooseThis = function () {
            if($scope.opportunity.status == 'HCRM_DISABLE'){
              hmsPopup.showPopup('商机已被停用，无法进行操作。');
              return ;
            }
            if($scope.opportunity.opportunityStatus == 'HCRM_CLOSED'){
              hmsPopup.showPopup('商机已关闭，无法进行操作。');
              return ;
            }
            if(!opportunityPermissionService.checkPermission('HCRM_OPERATION_EDIT')){
              hmsPopup.showPopup('抱歉，你没有权限这么做。');
              return ;
            }
            $scope.opportunityAddCompetitorModel.show();
          };
        } else if ($index == 3) {
          $scope.contentInner = "build/pages/application/opportunities/opportunity-detail/opportunity-detail-contact/opportunity-detail-contact.html";

          $scope.chooseThis = function () {
            if($scope.opportunity.status == 'HCRM_DISABLE'){
              hmsPopup.showPopup('商机已被停用，无法进行操作。');
              return ;
            }
            var addData = {
              customerId: window.localStorage.customerId,
              fullName: window.localStorage.fullName,
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
                      $scope.findAddressBook();
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
                    $scope.findAddressBook();
                  }
                }
              });
            }
          }

        } else if ($index == 4) {
          $scope.contentInner = "build/pages/application/opportunities/opportunity-detail/opportunity-detail-principal/opportunity-detail-principal.html";
        }
		else if($index == 5) {
		  $scope.contentInner = "build/pages/application/opportunities/opportunity-detail/opportunity-detail-bidbond/opportunity-detail-bidbond.html";
	 	  $scope.chooseThis = function() {
  			var addData = {
				customerId: window.localStorage.customerId,
				customerName: window.localStorage.fullName,
				fullName: window.localStorage.opportunityName,
				opportunityId: window.localStorage.opportunityId
			};
			 $state.go('tab.bidbond-add', {
					param: addData
			});
		  }
	    }

        if ($scope.subHeadersSelect[$index])
          return 0;
        else {
          $scope.subHeadersSelect = [];
          $scope.subHeadersSelect[$index] = true;
        }
      };
      $scope.goBack = function () {
        $ionicHistory.goBack();
      };

      $scope.isEdit = false;
      $scope.buttonImg = "build/img/application/customer/detail/edit_add@3x_5.png";
      $scope.transformButton = function (index) {
        $scope.isEdit = index == 1;
        $scope.buttonImg = $scope.isEdit ? "build/img/application/customer/detail/edit@3x.png" : "build/img/application/customer/detail/edit_add@3x_5.png";
        console.log(index);
      };
      $scope.selectSubHeader(0);
      //通用选择弹窗
      $scope.selectTargets = [{
        'key': 'transfer',
        'interface': opportunityDetailService.getCustomerEmployee,  //获得选择项的接口
        'params': [getCustomerEmployeeSuccess],  //获得选择项时接口所需参数
        'showKey': 'name',            //选择界面显示的数据
        'dataKey': 'employeeId',      //对象内最终操作提交所需的数据变量
        'dataModel': '$scope.data.employeeId',  //最终操作提交所需的数据变量
        'showDataModel': '$scope.showData.name' //显示在界面上的ng-model
      }];
      function isContains(str, substr) {
        return new RegExp(substr).test(str);
      }

      Array.prototype.clone = function () {
        return [].concat(this);
      };

      $scope.searchValueKey = '';
      $scope.sourceItems = [];
      $scope.noDataFlag = false;

      $scope.searchValue = function () {
        var notShowNum = 0;
        if ($scope.searchValueKey == '') {
          $scope.noDataFlag = false;
          $scope.items = $scope.sourceItems.clone();
        }
        else {
          for (var i = 0; i < $scope.sourceItems.length; i++) {
            if (isContains($scope.sourceItems[i][$scope.nowSelectTarget['showKey']], $scope.searchValueKey))
              $scope.items[i] = $scope.sourceItems[i];
            else {
              $scope.items[i] = '';
              notShowNum++;
            }
          }
          $scope.noDataFlag = notShowNum == $scope.sourceItems.length;
        }
      };
      $scope.showSelectDiv = function (key) {
        $scope.showSelect = !$scope.showSelect;
        if (!$scope.showSelect) {
          $scope.items = [];
          return 0;
        }
        for (var i = 0; i < $scope.selectTargets.length; i++) {
          if (key == $scope.selectTargets[i].key) {
            $scope.nowSelectTarget = $scope.selectTargets[i];
            break;
          }
        }
        hmsPopup.showLoading();
        $scope.nowSelectTarget.interface.apply(null, $scope.nowSelectTarget.params);
      };
      //扫描名片
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
          $scope.crmScanCardModal.hide();
        };
        var onSaveContactError = function () {
          hmsPopup.hideLoading();
          hmsPopup.showPopup("添加失败");
          $scope.crmScanCardModal.hide();
        };
        //保存到本地
        contactLocal.contactLocal(info, onSaveContactSuccess, onSaveContactError);
      };
      function dealScanData(msg) { //处理名片扫描插件的返回数据
        console.log(JSON.parse(msg));
        try {
          $scope.crmScanCardModal.show();
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
              $scope.crmScanCardModal.hide();
            } else {
              hmsPopup.hideLoading();
              hmsPopup.showPopup("没有找到匹配的客户");
              $state.go('tab.addLinkman', {param: contact});
              $scope.crmScanCardModal.hide();
            }
          };
          customerSearchService.getSearchData(searchSuccessInit, $scope.searchParam)
        } else {
          hmsPopup.hideLoading();
          $state.go('tab.addLinkman', {param: contact});
          $scope.crmScanCardModal.hide();
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
    }]).directive('scrollHeight', function ($window) {
    return {
      restrict: 'AE',
      link: function (scope, element, attr) {
        element[0].style.height = ($window.innerHeight - 44 - 71) + 'px';
      }
    }
  });

angular.module('opportunityModule')
  .service('opportunityDetailService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function (hmsHttp,
              hmsPopup,
              baseConfig) {

      var baseUrlTest = baseConfig.basePath;

      this.getOpportunityDetail = function (success, key) {
        console.log(JSON.stringify(key));

        hmsHttp.post(baseUrlTest + 'query_opportunity_detail', key).success(function (result) {
          success(result);
          hmsPopup.hideLoading();
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          // hmsPopup.showPopup(response);
        });

      };
      this.opportunityTransfer = function (success, key) { //转移商机
        hmsHttp.post(baseUrlTest + 'opportunity_transfer', key).success(function (result) {
          success(result);
          hmsPopup.hideLoading();
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          // hmsPopup.showPopup(response);
        });
      };
      this.demoteOpportunity = function (success, key) { //降级商机为线索
        hmsHttp.post(baseUrlTest + 'demote_opportunity', key).success(function (result) {
          success(result);
          hmsPopup.hideLoading();
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          // hmsPopup.showPopup(response);
        });
      };
      this.transformStatus = function (success, key) { //更改状态
        hmsHttp.post(baseUrlTest + 'transform_status', key).success(function (result) {
          success(result);
          hmsPopup.hideLoading();
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          // hmsPopup.showPopup(response);
        });
      };
      this.getCustomerEmployee = function (success) { //查询客户负责人
        var params = {
          page: 1,
          pageSize: '100000'
        };
        hmsHttp.post(baseUrlTest + 'customer_employee', params).success(function (result) {
          success(result);
          hmsPopup.hideLoading();
        }).error(function (response, status) {
          // hmsPopup.showPopup(response);
          hmsPopup.hideLoading();
        });
      };
    }
  ]);

angular.module('opportunityModule')
  .service('opportunityDetailDataService', [
    'hmsPopup',
    function (hmsPopup) {

      this.opportunity = {};

      function cloneObj(obj) {
        var o;
        if (obj.constructor == Object) {
          o = new obj.constructor();
        } else {
          o = new obj.constructor(obj.valueOf());
        }
        for (var key in obj) {
          if (o[key] != obj[key]) {
            if (typeof(obj[key]) == 'object') {
              o[key] = cloneObj(obj[key]);
            } else {
              o[key] = obj[key];
            }
          }
        }
        return o;
      }

      Array.prototype.clone = function () {
        return [].concat(this);
      };

      this.getOpportunity = function () {
        return this.opportunity;
      };

      this.setOpportunity = function (opportunity) {
        this.opportunity = cloneObj(opportunity);
      };

      this.setOpportunityItem = function (itemName, value) {
        if (value.slice)
          this.opportunity[itemName] = value.clone();
        else
          this.opportunity[itemName] = value;
      };

    }
  ]);

angular.module('opportunityModule')
  .service('opportunityPermissionService', [
    'hmsPopup',
    'hmsHttp',
    'baseConfig',
    function (hmsPopup,
              hmsHttp,
              baseConfig) {

      var baseUrlTest = baseConfig.basePath;

      this.opportunityId = '';
      this.permissions = [];

      Array.prototype.clone = function () {
        return [].concat(this);
      };

      this.setOpportunityId = function(opportunityId){
        this.opportunityId = opportunityId;
      };

      this.updatePermission = function(){
        var params = {
          recordId: this.opportunityId,
          modularCode: "HCRM_MODULAR_OPPORTUNITY"
        };
        var that = this;
        hmsHttp.post(baseUrlTest + 'all_permissions', params).success(function (result) {
          console.log(result);
          that.permissions = result.permissions.clone();
        }).error(function (response, status) {
          hmsPopup.showPopup(response);
        });
      };

      this.checkPermission = function(key){
        for(var i = 0; i < this.permissions.length; i++){
          if(this.permissions[i] == key)
            return true;
        }
        return false;
      };

    }
  ]);



