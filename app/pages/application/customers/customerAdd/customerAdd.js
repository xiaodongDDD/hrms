angular.module('customerModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.customerAdd', {
          url: '/customers/customerAdd',
          views: {
            'tab-application': {
              //prefetchTemplate: false,
              templateUrl: 'build/pages/application/customers/customerAdd/customerAdd.html',
              controller: 'customerAddCtrl'
            }
          }
        })
    }]);

angular.module('customerModule')

  .controller('customerAddCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$ionicHistory',
    'publicMethod',
    'history',
    'hmsPopup',
    '$timeout',
    'hmsHttp',
    'T',
    'CloneData',
    'customerAddService',
    'baseConfig',
    'customerService',
    '$ionicModal',
    '$cordovaInAppBrowser',
    'customerDetailService',
    '$cordovaClipboard',
    function ($scope,
              $rootScope,
              $state,
              $ionicHistory,
              publicMethod,
              history,
              hmsPopup,
              $timeout,
              hmsHttp,
              T,
              CloneData,
              customerAddService,
              baseConfig,
              customerService,
              $ionicModal,
              $cordovaInAppBrowser,
              customerDetailService,
              $cordovaClipboard) {


      $scope.goBack = function () {
        if ($ionicHistory.viewHistory().backView) {
          $ionicHistory.goBack();
        } else {
          $state.go('tab.application');
        }
      };


      $scope.goState = function (val) {
        $state.go(val);
      };
      $scope.showLoadings = false;
      var baseUrl = baseConfig.basePath;
      //多语言字段
      $scope.bilingual = CloneData.getCustomer_add();

      $scope.customer = {
        fullName: "",
        simpleName: ""
      }
      $scope.items = [{
        text: "客户全称",
        input: "",
        placeholder: "请输入",
        important: true
      }, {
        text: "客户简称",
        input: "",
        placeholder: "请输入",
        important: false
      }];
      if(customerDetailService.getIsEdit()){
        console.log('修改页面过来的~~~！！'+customerDetailService.getEditCustomer().fullName,'+++'+customerDetailService.getEditCustomer().simpleName)
        $scope.items[0].input = customerDetailService.getEditCustomer().fullName;
        $scope.items[1].input = customerDetailService.getEditCustomer().simpleName;
      }

      //工信部modal
      $ionicModal.fromTemplateUrl('build/pages/application/customers/model/guideModal.html', {
        scope: $scope,
        animation: 'slide-in-right'
      }).then(function (modal1) {
        $scope.guideModal = modal1;
      });
      function openBrower(url){
        var options = {
          closebuttoncaption: 'yes',  //ios的关闭按钮（可能无效）
          hardwareback: 'yes', //安卓的返回键退出浏览器
          location: 'yes', //locationbar
          toolbar: 'yes'
        };
        if (ionic.Platform.isAndroid()) {
          //_system表示调用系统的浏览器
          $cordovaInAppBrowser.open(url, '_system', options);
        }
        else if (ionic.Platform.isIOS()) {
          //判断是否为IOS系统  $cordovaInAppBrowser.open方法打开链接 没有返回按钮
          //改为window.open可以打开系统的浏览器
          window.open(url, '_system', options);
        }
      }
      $scope.goNational=function(){
        openBrower("http://gsxt.saic.gov.cn/");
      };
      $scope.goApp=function(){
        openBrower("http://www.qixin.com/");
      };
      //打开工信部
      $scope.showMessage=function(){
        $scope.guideModal.show();
      };
      $scope.closeModal=function(){
        $scope.guideModal.hide();
      };

      ////长按复制
      //stop_browser_behavior: false
      //self.touchStart = function (e) {
      //  self.startCoordinates = getPointerCoordinates(e);
      //  if (ionic.tap.ignoreScrollStart(e)) {
      //    return;
      //  }
      //  if (ionic.tap.containsOrIsTextInput(e.target)) {
      //    // do not start if the target is a text input
      //    // if there is a touchmove on this input, then we can start the scroll
      //    self.__hasStarted = false;
      //    return;
      //  }
      //  self.__isSelectable = true;
      //  self.__enableScrollY = true;
      //  self.__hasStarted = true;
      //  self.doTouchStart(e.touches, e.timeStamp);
      //  // e.preventDefault();
      //};

      $scope.copyFullName = function (value) {
        if (ionic.Platform.isIOS()) {
          $cordovaClipboard
            .copy(value)
            .then(function () {
              hmsPopup.showPopup(options, '客户名称已复制至手机粘贴板');
            }, function () {
              hmsPopup.showPopup("复制失败，请重新尝试");
            });
        }else{
          cordova.plugins.clipboard.copy(
            value,
            function(r){hmsPopup.showPopup('客户名称已复制至手机粘贴板');},
            function(e){hmsPopup.showPopup("复制失败，请重新尝试");}
          );
        }
      }


      $scope.add = function () {
          $scope.customer = {
            //customerId:'',
            fullName: $scope.items[0].input,
            simpleName: $scope.items[1].input
          };

        if ($scope.customer.fullName === "") {
          hmsPopup.showPopup('客户全称不能为空！');
        } else {
          $scope.showLoadings = true;
          customerAddService.setCustomer($scope.customer);
          if(customerDetailService.getIsEdit()) {
            var param = {
              customerId:customerDetailService.getEditCustomer().customerId,
              fullName: $scope.items[0].input
            }
          }else {
            var param = {
              fullName: $scope.items[0].input
            }
          }
          var saveUrl = baseUrl + "valid_name";
          hmsHttp.post(saveUrl, param).success(function (data) {
            /*  console.log(data);*/
            $scope.showLoadings = false;
            if(data.returnCode==='S'){
              $state.go('tab.improveInformation');
            } else {
              hmsPopup.showPopupCustomer(data.returnMsg,data.customerName,data.approveStatusName,
                data.saleArea,data.saleTeam,data.saleEmployeeName,data.saleEmployeeCode);
            }

          })
        }

      };
      $scope.$on('$ionicView.enter', function (e) {
        customerAddService.setIsAdd(true);
        if(customerService.getIsCustomer()==true){
          console.log('进来了。。。。')
          $scope.customer = {
            fullName:'',
            simpleName:''
          };
          $scope.items[0].input = '';
          $scope.items[1].input = '';
        }
        if(customerDetailService.getIsEdit()){
          console.log('修改页面过来的~~~！！'+customerDetailService.getEditCustomer().fullName,'+++'+customerDetailService.getEditCustomer().simpleName)
          $scope.items[0].input = customerDetailService.getEditCustomer().fullName;
          $scope.items[1].input = customerDetailService.getEditCustomer().simpleName;
        }

        //if(customerDetailService.getIsEdit()!==null){
        //  $scope.items[0].input = customerDetailService.getIsEdit().fullName;
        //  $scope.items[1].input = customerDetailService.getIsEdit().simpleName;
        //
        //}

      } )

    }]);

angular.module('customerModule')
  .service('customerAddService', ['hmsHttp',
    'hmsPopup',
    'baseConfig',
    function (hmsHttp,
              hmsPopup,
              baseConfig) {

      var baseUrl = baseConfig.basePath;
      var customer = {};
      var isAdd = true;

      ////上级客户查询
      //this.getParentCustomer = function (success) {
      //  var params = {};
      //  hmsHttp.post(baseUrl + 'parent_customer', params).success(function (result) {
      //    success(result);
      //  }).error(function (response, status) {
      //    hmsPopup.showPopup(response);
      //    hmsPopup.hideLoading();
      //  });
      //};

      return {
        setCustomer: function (val) {
          customer = val;
        },
        getCustomer: function () {
          return customer;
        },
        setIsAdd:function(val){
          isAdd=val;
        },
        getIsAdd:function(){
          return isAdd;
        }
      }
    }]);
