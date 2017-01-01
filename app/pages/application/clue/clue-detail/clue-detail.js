/**
 * Created by zaranengap on 2016/12/12.
 */
angular.module('clueModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.clue-detail', {
          url: '/clue-detail',
          params:{
            data:{}
          },
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/clue/clue-detail/clue-detail.html',
              controller: 'ClueDetailCtrl'
            }
          }
        })
        .state('tab.clue-detail2', {
          url: '/clue-detail',
          params:{
            data:{}
          },
          views: {
            'tab-contactCrm': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/clue/clue-detail/clue-detail.html',
              controller: 'ClueDetailCtrl'
            }
          }
        })
    }]);

angular.module('clueModule')
  .controller('ClueDetailCtrl', [
    '$scope',
    '$state',
    'publicMethod',
    '$ionicHistory',
    '$timeout',
    '$stateParams',
    'hmsPopup',
    '$ionicScrollDelegate',
    'clueDetailService',
    'clueDetailDataService',
    '$ionicActionSheet',
    '$cordovaActionSheet',
    '$rootScope',
    '$ionicModal',
    '$filter',
    'opportunityPermissionService',
    '$cordovaClipboard',
    '$cordovaGeolocation',
    '$http',
    function($scope,
             $state,
             publicMethod,
             $ionicHistory,
             $timeout,
             $stateParams,
             hmsPopup,
             $ionicScrollDelegate,
             clueDetailService,
             clueDetailDataService,
             $ionicActionSheet,
             $cordovaActionSheet,
             $rootScope,
             $ionicModal,
             $filter,
             opportunityPermissionService,
             $cordovaClipboard,
             $cordovaGeolocation,
             $http) {

      $scope.clueId = $stateParams.data;

      window.localStorage.clueId = $scope.clueId;
      opportunityPermissionService.setOpportunityId($scope.clueId);
      opportunityPermissionService.updatePermission();

      $scope.goBack = function(flag){
        if(flag)
          $rootScope.$broadcast('REFRESH_CLUE');
        $ionicHistory.goBack();
      };

      $scope.goCustomer = function(){
        window.localStorage.customerId = $scope.clue.customerId;
     /*   $state.go('tab.customer-detail');*/
        console.log($ionicHistory.viewHistory().backView.stateName);
        if ($ionicHistory.viewHistory().backView.stateName == "tab.customer-detail2") {
          $state.go("tab.customer-detail2");
        }else{
          $state.go("tab.customer-detail");
        }
      };
      $scope.myLocation = {};
      $scope.cusLocation = {};
      $scope.subHeaders = [{
        title:"销售动态",
        icon:"icon_windmill"
      },{
        title:"详情",
        icon:"icon_business"
      }
      //  ,{
      //  title:"竞争对手",
      //  icon:"icon_pk_gray"
      //}
      ];

      $ionicModal.fromTemplateUrl('build/pages/application/clue/clue-add/clue-add.html',{
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal){
        $scope.clueAddModel = modal;
      });

      $scope.$on('CLOSE_CLUE_ADD',function(){
        $scope.clueAddModel.hide();
      });

      $scope.$on('CLUE_EDIT_SUCCESS', function () {
        $scope.clueAddModel.hide();
        opportunityPermissionService.updatePermission();
        clueDetailService.getClueDetail(getClueSuccess, $scope.clueId);
        $scope.$broadcast('REFRESH_DETAIL');
        hmsPopup.showLoading();
      });

      $scope.subHeadersSelect = [true];

      $scope.contentInner = "build/pages/application/clue/clue-detail/clue-detail-state/clue-detail-state.html";
      $scope.chooseThis = function(){
        if(!opportunityPermissionService.checkPermission('HCRM_OPERATION_EDIT')){
          hmsPopup.showPopup('抱歉，你没有权限这么做。');
          return ;
        }
        if($scope.clue.status == 'HCRM_DISABLE'){
          hmsPopup.showPopup('该线索已被停用，无法进行操作。');
          return true;
        }
        var addData = {
          customerId: $scope.clue.customerId,
          fullName: $scope.clue.customerName,
          opportunityName: $scope.clue.opportunityName,
          opportunityId: $scope.clue.opportunityId
        };
        $state.go('tab.plans-add', {planData: addData});
      };
      $scope.selectSubHeader = function($index){
        $ionicScrollDelegate.$getByHandle('detailScroll').scrollTop(true);
        $scope.transformButton($index);
        if($scope.subHeadersSelect[$index])
          return 0;
        else{
          $scope.subHeadersSelect = [];
          $scope.subHeadersSelect[$index] = true;
        }

        if($index == 0){
          $scope.contentInner = "build/pages/application/clue/clue-detail/clue-detail-state/clue-detail-state.html";
          $scope.chooseThis = function(){
            if(!opportunityPermissionService.checkPermission('HCRM_OPERATION_CREATE_SALES_PLAN')){
              hmsPopup.showPopup('抱歉，你没有权限这么做。');
              return ;
            }
            if($scope.clue.status == 'HCRM_DISABLE'){
              hmsPopup.showPopup('该线索已被停用，无法进行操作。');
              return true;
            }
            var addData = {
              customerId: $scope.clue.customerId,
              fullName: $scope.clue.customerName,
              opportunityName: $scope.clue.opportunityName,
              opportunityId: $scope.clue.opportunityId
            };
            $state.go('tab.plans-add', {planData: addData});
          };
        } else if($index == 1){
          $scope.contentInner = "build/pages/application/clue/clue-detail/clue-detail-detail/clue-detail-detail.html";
          $scope.chooseThis = function(){
            if(!opportunityPermissionService.checkPermission('HCRM_OPERATION_EDIT')){
              hmsPopup.showPopup('抱歉，你没有权限这么做。');
              return ;
            }
            if($scope.clue.status == 'HCRM_DISABLE'){
              hmsPopup.showPopup('该线索已被停用，无法进行操作。');
              return true;
            }
            $ionicScrollDelegate.$getByHandle('slide-img').scrollTop(false);
            $scope.clueAddModel.show();
            $scope.$broadcast('EDIT_CLUE');
          }
        }
      };

      $scope.isEdit = false;
      $scope.buttonImg = "build/img/application/customer/detail/edit_add@3x_5.png";
      $scope.transformButton = function(index){
        $scope.isEdit = index == 1;
        $scope.buttonImg = $scope.isEdit ? "build/img/application/customer/detail/edit@3x.png" : "build/img/application/customer/detail/edit_add@3x_5.png";
      };

      //////////////////////数据相关/////////////////////

      $scope.clue = {};
      hmsPopup.showLoading();

      // var getClueCompetitorSuccess = function(response){
      //   hmsPopup.hideLoading();
      //   clueDetailDataService.setClueItem('competitors', response.competitor_list);
      //   console.log(clueDetailDataService.getClue());
      // };

      var getClueSuccess = function(response){
        hmsPopup.hideLoading();
        if(response.returnCode == 'S'){
          $scope.clue = response.clue_detail;
          $scope.clue.saleBelong = $scope.clue.saleAreaName + " | " + $scope.clue.saleTeamName;
          $scope.clue.industry = $scope.clue.majorIndustryName + " | " + $scope.clue.subIndustryName;
          $scope.customerAddress = response.customer_address;
          $scope.noPermissionCopy = !response.customer_address.addressCountry;
          clueDetailDataService.setClue($scope.clue);
          $scope.$broadcast('REFRESH_DETAIL');
          console.log(clueDetailDataService.getClue());
          // clueDetailService.getCompetitorList(getClueCompetitorSuccess, $scope.clueId);
        } else {
          hmsPopup.showPopup(response.returnMsg);
          $scope.goBack();
        }
      };

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

      clueDetailService.getClueDetail(getClueSuccess, $scope.clueId);

      ///////////////////////////////菜单//////////////////////////////////

      Array.prototype.clone=function(){
        return [].concat(this);
      };

      //通用选择框
      $ionicModal.fromTemplateUrl('build/pages/modals/crmSelectModal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal) {
        $scope.crmSelectModal = modal;
      });

      //线索提升
      $ionicModal.fromTemplateUrl('build/pages/application/opportunities/opportunity-add/opportunity-add.html',{
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal){
        $scope.promoteClueModal = modal;
      });

      var changeClueSuccess = function(response){
        opportunityPermissionService.updatePermission();
        hmsPopup.showPopup(response.returnMsg);
        if(response.returnCode == 'S')
          clueDetailService.getClueDetail(getClueSuccess, $scope.clueId);
      };

      var promoteClueSuccess = function(response){
        hmsPopup.showPopup(response.returnMsg);
        if(response.returnCode == 'S')
          $scope.goBack(true);
      };

      var transferSuccess = function(response){
        opportunityPermissionService.updatePermission();
        hmsPopup.showPopup(response.returnMsg);
        if(response.returnCode == 'S')
          clueDetailService.getClueDetail(getClueSuccess, $scope.clueId);
      };

      var selectOneEmployee = function(id){
        var date = $filter('date')(new Date(), 'yyyy-MM-dd');
        var params = {
          "opportunityId": $scope.clue.opportunityId,
          "transferBeforEmp": window.localStorage.empno,
          "transferAfterEmp": id,
          "effectiveDate": date,
          "description": "" //TODO：暂时没有输入界面
        };
        clueDetailService.transferClue(transferSuccess, params);
        hmsPopup.showLoading();
      };

      $scope.showMenu = function () {
        $scope.statusTitle = $scope.clue.status == "HCRM_ENABLE" ? "停用线索" : "启用线索";
        if (ionic.Platform.isWebView()) {
          var options = {
            buttonLabels: [$scope.statusTitle, '转为商机', '转移'],
            addCancelButtonWithLabel: '取消',
            androidEnableCancelButton: true,
            androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT
          };
          document.addEventListener("deviceready", function () {
            $cordovaActionSheet.show(options)
              .then(function (btnIndex) {
                if (btnIndex == 1) {
                  if($scope.clue.status == 'HCRM_ENABLE' && !opportunityPermissionService.checkPermission('HCRM_OPERATION_DISABLE')){
                    hmsPopup.showPopup('抱歉，你没有权限这么做。');
                    return true;
                  }
                  if($scope.clue.status == 'HCRM_DISABLE' && !opportunityPermissionService.checkPermission('HCRM_OPERATION_ENABLE')){
                    hmsPopup.showPopup('抱歉，你没有权限这么做。');
                    return true;
                  }
                  clueDetailService.changeStatus(changeClueSuccess, $scope.clueId, $scope.clue.status);
                  hmsPopup.showLoading();
                }else if (btnIndex == 2) {
                  if($scope.clue.status == 'HCRM_DISABLE'){
                    hmsPopup.showPopup('该线索已被停用，无法进行操作。');
                    return true;
                  }
                  if(!opportunityPermissionService.checkPermission('HCRM_OPERATION_EDIT')){
                    hmsPopup.showPopup('抱歉，你没有权限这么做。');
                    return ;
                  }
                  $scope.$broadcast('PROMOTE_CLUE');
                  $scope.promoteClueModal.show();
                }else if(btnIndex == 3){
                  if($scope.clue.status == 'HCRM_DISABLE'){
                    hmsPopup.showPopup('该线索已被停用，无法进行操作。');
                    return true;
                  }
                  if(!opportunityPermissionService.checkPermission('HCRM_OPERATION_TRANSFER')){
                    hmsPopup.showPopup('抱歉，你没有权限这么做。');
                    return true;
                  }
                  $scope.showSelectDiv();
                }
                return true;
              });
          }, false);
        }else {
          var hideSheet = $ionicActionSheet.show({
            buttons: [
              {text: $scope.statusTitle},
              {text: '转为商机'},
              {text: '转移'}
            ],
            cancelText: '取消',
            cancel: function () {

            },
            buttonClicked: function (index) {
              if (index == 0) {
                if($scope.clue.status == 'HCRM_ENABLE' && !opportunityPermissionService.checkPermission('HCRM_OPERATION_DISABLE')){
                  hmsPopup.showPopup('抱歉，你没有权限这么做。');
                  return true;
                }
                if($scope.clue.status == 'HCRM_DISABLE' && !opportunityPermissionService.checkPermission('HCRM_OPERATION_ENABLE')){
                  hmsPopup.showPopup('抱歉，你没有权限这么做。');
                  return true;
                }
                clueDetailService.changeStatus(changeClueSuccess, $scope.clueId, $scope.clue.status);
                hmsPopup.showLoading();
              } else if (index == 1) {
                if($scope.clue.status == 'HCRM_DISABLE'){
                  hmsPopup.showPopup('该线索已被停用，无法进行操作。');
                  return true;
                }
                if(!opportunityPermissionService.checkPermission('HCRM_OPERATION_EDIT')){
                  hmsPopup.showPopup('抱歉，你没有权限这么做。');
                  return ;
                }
                $scope.$broadcast('PROMOTE_CLUE');
                $scope.promoteClueModal.show();
              } else if (index == 2) {
                if($scope.clue.status == 'HCRM_DISABLE'){
                  hmsPopup.showPopup('该线索已被停用，无法进行操作。');
                  return true;
                }
                if(!opportunityPermissionService.checkPermission('HCRM_OPERATION_TRANSFER')){
                  hmsPopup.showPopup('抱歉，你没有权限这么做。');
                  return true;
                }
                $scope.showSelectDiv();
              }
              return true;
            }

          });
        }
      };

      $scope.$on('CLUE_PROMOTE_SUCCESS',function(){
        $scope.promoteClueModal.hide();
        $scope.promoteClueModal.remove();
        $ionicHistory.goBack();
        $rootScope.$broadcast('REFRESH_CLUE');
      });

      $scope.$on('CLOSE_PROMOTE',function(){
        $scope.promoteClueModal.hide();
      });

      /////////值列表//////////

      $scope.searchModel = {
        searchValueKey: ''
      };
      $scope.nowPage = 1;
      $scope.pageSize = 15;
      $scope.items = [];
      $scope.moreDataCanBeLoaded = false;
      $scope.sourceItems = [];
      $scope.noDataFlag = false;
      $scope.showSelect = false;

      function cloneObj(obj){
        var o, obj;
        if (obj.constructor == Object){
          o = new obj.constructor();
        }else{
          o = new obj.constructor(obj.valueOf());
        }
        for(var key in obj){
          if ( o[key] != obj[key] ){
            if ( typeof(obj[key]) == 'object' ){
              o[key] = cloneObj(obj[key]);
            }else{
              o[key] = obj[key];
            }
          }
        }
        o.toString = obj.toString;
        o.valueOf = obj.valueOf;
        return o;
      }

      var getMoreCustomerEmployeeSuccess = function(response){
        $scope.showCrmLoading = false;
        $scope.moreDataCanBeLoaded = response.employee_list.length == $scope.pageSize;
        if(response.returnCode == 'S'){
          $scope.items = $scope.items.concat(response.employee_list);
          $scope.sourceItems = $scope.items.clone();
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      };

      $scope.showSelectDiv = function(){
        $scope.searchModel.searchValueKey = '';
        $scope.nowPage = 1;
        if ($scope.showSelect) {
          $scope.crmSelectModal.hide()
        } else {
          $scope.crmSelectModal.show();
        }
        $scope.showSelect = !$scope.showSelect;
        $scope.moreDataCanBeLoaded = false;
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
        if(!$scope.showSelect){
          return ;
        }
        $scope.nowSelectTarget = {
          'key' : 'sale_employee',
          'interface' :  clueDetailService.getCustomerEmployee,
          'params' : [getMoreCustomerEmployeeSuccess, $scope.nowPage, $scope.pageSize],
          'showKey' : 'name',
          'dataKey' : 'employeeId',
          'needShowMore' : true,
          'searchInterface' : clueDetailService.searchCustomerEmployee,
          'searchParams' : getMoreCustomerEmployeeSuccess
        };
        var showKey = $scope.nowSelectTarget['showKey'];
        var dataKey = $scope.nowSelectTarget['dataKey'];
        $scope.sourceTargetData = cloneObj($scope.nowSelectTarget);
        $scope.showCrmLoading = true;
        $scope.nowPage = 1;
        $scope.nowSelectTarget.interface.apply(null,$scope.nowSelectTarget.params);
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

      $scope.selectItem = function($index){
        var data = $scope.items[$index][$scope.nowSelectTarget['dataKey']];  //接口所需数据
        var showKey = $scope.items[$index][$scope.nowSelectTarget['showKey']];
        selectOneEmployee(data);
        console.log(data + ":" + showKey);
        $scope.showSelectDiv();
      };

      Array.prototype.clone=function(){
        return [].concat(this);
      };

      $scope.searchSelectValue = function(){
        $ionicScrollDelegate.$getByHandle('listScroll').scrollTop(false);
        $scope.showCrmLoading = true;
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
      };

      $scope.clearSelectFilter = function(){
        $scope.searchModel.searchValueKey = '';
        $scope.searchSelectValue();
      };


      //地图导航
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
        var cusUrl = "http://api.map.baidu.com/geocoder/v2/?callback=renderOption()&output=json&address="+$scope.customerAddress.cityName+
          $scope.customerAddress.zoneName+$scope.customerAddress.addressDetails+ "&city="+$scope.customerAddress.cityName+"&ak=5WXxKpATT2RsEaYyVs6jxVOAbP6047m2";
        //alert(cusUrl);
        $http.post(cusUrl).success(function (data) {
          console.log('请求数据成功！！');
          console.log(data);
          if(data.result!=''&&data.status==0&&(data.result.level=='城市'||data.result.level=='区县'||data.result.level=='道路'||data.result.level=='旅游景点'||data.result.level=='购物')){
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
                  "&destination=latlng:"+$scope.cusLocation.lat+","+$scope.cusLocation.lng+"|name:"+$scope.customerAddress.addressDetails+
                  "&mode=driving&origin_region="+$scope.myLocation.province+"&destination_region="+$scope.customerAddress.cityName+
                  "&output=html&ak=5WXxKpATT2RsEaYyVs6jxVOAbP6047m2";
                window.open(encodeURI(url), '_system', 'location=yes');
              }
            }).error(function (data) {
              console.log('请求数据失败！！');
            })

          }else {
            hmsPopup.showPopup('客户地址解析失败，请检查客户地址是否正确');
          }
        }).error(function (data) {
          console.log('请求数据失败！！');
          hmsPopup.showPopup('客户地址解析失败，请检查客户地址是否正确');
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

angular.module('clueModule')
  .service('clueDetailService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function(hmsHttp,
             hmsPopup,
             baseConfig) {

      var baseUrl = baseConfig.basePath;

      this.getClueDetail = function(success, id) {
        var params = {
          opportunityId : id
        };
        console.log(params);
        hmsHttp.post(baseUrl + 'clue_detail', params).success(function(result) {
          success(result);
        }).error(function(response, status) {
          hmsPopup.hideLoading();
        });

      };

      this.getCompetitorList = function(success, id) {
        var params = {
          opportunityId : id
        };
        hmsHttp.post(baseUrl + 'opportunity_competitor', params).success(function(result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function(response, status) {
          hmsPopup.hideLoading();
        });
      };

      this.changeStatus = function(success, id, status) {
        var params = {
          opportunityId : id,
          status: status
        };
        hmsHttp.post(baseUrl + 'transform_status', params).success(function(result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function(response, status) {
          hmsPopup.hideLoading();
        });
      };

      this.promoteClue = function(success, clue){
        hmsHttp.post(baseUrl + 'promote_clue', clue).success(function(result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function(response, status) {
          hmsPopup.hideLoading();
        });
      };

      this.getCustomerEmployee = function(success, page, pageSize){
        var params = {
          "page": page,
          "pageSize": pageSize
        };
        hmsHttp.post(baseUrl + 'customer_employee', params).success(function(result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function(response, status) {
          hmsPopup.hideLoading();
        });
      };

      this.searchCustomerEmployee = function(success, keyWord, page, pageSize){
        var params = {
          "page": page,
          "pageSize": pageSize,
          "keyWord": keyWord
        };
        hmsHttp.post(baseUrl + 'customer_employee', params).success(function(result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function(response, status) {
          hmsPopup.hideLoading();
        });
      };

      this.transferClue = function(success, param){
        hmsHttp.post(baseUrl + 'clue_transfer', param).success(function(result) {
          hmsPopup.hideLoading();
          success(result);
        }).error(function(response, status) {
          hmsPopup.hideLoading();
        });
      };

    }
  ]);

angular.module('clueModule')
  .service('clueDetailDataService', [
    function () {

      this.clue = {};

      function cloneObj(obj){
        var o;
        if (obj.constructor == Object){
          o = new obj.constructor();
        }else{
          o = new obj.constructor(obj.valueOf());
        }
        for(var key in obj){
          if ( o[key] != obj[key] ){
            if ( typeof(obj[key]) == 'object' ){
              o[key] = cloneObj(obj[key]);
            }else{
              o[key] = obj[key];
            }
          }
        }
        return o;
      }

      Array.prototype.clone=function(){
        return [].concat(this);
      };

      this.getClue = function(){
        return this.clue;
      };

      this.setClue = function(clue){
        this.clue = cloneObj(clue);
      };

      this.setClueItem = function(itemName, value){
        if(value.slice)
          this.clue[itemName] = value.clone();
        else
          this.clue[itemName] = value;
      };

    }
  ]);
