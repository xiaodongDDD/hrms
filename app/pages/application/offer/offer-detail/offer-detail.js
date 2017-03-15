/**
 * Created by wkh on 2017/2/28.
 */
'use strict';
angular.module('offerModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.offerDetail', {
          url: '/offerDetail',
          params: {
            param: {}
          },
          views: {
            'tab-application': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/application/offer/offer-detail/offer-detail.html',
              controller: 'offerDetailCtrl'
            }
          }
        })
    }]);

angular.module('offerModule')
  .controller('offerDetailCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'publicMethod',
    '$ionicHistory',
    'history',
    'hmsPopup',
    '$timeout',
    'hmsHttp',
    '$ionicModal',
    '$cordovaActionSheet',
    '$ionicActionSheet',
    'offerListService',
    '$stateParams',
    function ($scope,
              $rootScope,
              $state,
              publicMethod,
              $ionicHistory,
              history,
              hmsPopup,
              $timeout,
              hmsHttp,
              $ionicModal,
              $cordovaActionSheet,
              $ionicActionSheet,
              offerListService,
              $stateParams) {
      $scope.offer={};
      hmsPopup.showLoading("正在加载");
      var getOfferDetailSuccess=function(result){
        console.log(result);
        if(result.returnCode=="S"){
          $scope.offer=result.offer_detail;
          hmsPopup.hideLoading();
        }else{
          hmsPopup.hideLoading();
        }


      };
      var getOfferDetailId=$stateParams.param;
      offerListService.getOfferDetail(getOfferDetailSuccess,getOfferDetailId);
      $ionicModal.fromTemplateUrl('build/pages/application/offer/add-offer/add-offer.html',{
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.addOfferModal = modal;
      });
      $scope.goBackList=function(){
        $scope.addOfferModal.hide();
      };
      $scope.historyGoBack=function(){
        $ionicHistory.goBack();
      };
      $scope.goAddOffer=function(){
        $scope.addOfferModal.show();
      };
      var offer_invalidSuccess=function(result){
        hmsPopup.showShortCenterToast(result.returnMsg);
        $scope.addOfferModal.show();
        offerListService.setOfferDetailService($scope.offer);
        $rootScope.$broadcast('EDIT_OFFER_BID_DETAIL');
      };
      var offer_deleteSuccess=function(index){
        hmsPopup.showShortCenterToast(index.returnMsg);
      };
      var deleteOnConfirm=function(index){
        console.log("deleteOnConfirm"+index);
        if(index){
          offerListService.offerDelete(offer_deleteSuccess,$scope.offer.offerHeaderId)
        }
      };
      $ionicModal.fromTemplateUrl('build/pages/application/offer/add-offer/add-offer.html',{
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.addOfferModal = modal;
      });

      var  editOfferDetail=function(){
        $scope.addOfferModal.show();
        offerListService.setOfferDetailService($scope.offer);
        $rootScope.$broadcast('EDIT_OFFER_BID_DETAIL');
      };
      var createBidedOnConfirm=function(flag){
        $scope.offer.promptFlag=true;
        console.log(flag);
        if(flag){
          //不做更改的   保存调用的是创建定标报价的接口
          $scope.offer.showDisable=true;
          $scope.addOfferModal.show();
          $scope.offer.offerStage="OFFER_STAGE_BIDED";
          $scope.offer.offerStageName="定标报价";
          offerListService.setOfferDetailService($scope.offer);
          $rootScope.$broadcast('CREATE_OFFER_BIDEDED_NO_CHANGE_DETAIL');
        }
      };
      var cancelBidedCancle=function(flag){
        console.log(flag+"====cancelBidedCancle");
        //先失效
        //offerListService.offerInvalid(offer_invalidSuccess,$scope.offer.offerHeaderId);
        //做了更改的   保存调用的是创建新版本的接口
        $scope.offer.showDisable=false;
        $scope.offer.offerStage="OFFER_STAGE_BIDED";
        $scope.offer.offerStageName="定标报价";
        $scope.addOfferModal.show();
        offerListService.setOfferDetailService($scope.offer);
        $rootScope.$broadcast('CREATE_OFFER_BIDEDED_CHANGE_DETAIL');
      };

      //创建新版投标报价
      var createNewOnConfirm=function(flag){
        if(flag){
          //选择否
          //true 立即失效
          //offerListService.offerInvalid(offer_invalidSuccess,$scope.offer.offerHeaderId);
          $scope.offer.showDisable=false;
          //$scope.offer.offerStage="OFFER_STAGE_BIDED";
          //$scope.offer.offerStageName="定标报价";
          $scope.addOfferModal.show();
          offerListService.setOfferDetailService($scope.offer);
          $rootScope.$broadcast('CREATE_NEW_BIDED_DETAIL');
        }
        console.log("createNewOnConfirm"+flag);

      };
      //创建新版定标报价
      var createNewBidedOnConfirm=function(flag){
        if(flag){
          //选择是
          //true 立即失效
          //offerListService.offerInvalid(offer_invalidSuccess,$scope.offer.offerHeaderId);
          $scope.addOfferModal.show();
          offerListService.setOfferDetailService($scope.offer);
          $rootScope.$broadcast('CREATE_OFFER_BIDEDED_NO_CHANGE_DETAIL');
        }
        console.log("createNewBidedOnConfirm"+flag);
      };
      var createNewBidBidedAuthSuccess=function(result){
        if(result.returnCode=="S"){
          hmsPopup.confirmDIY("是否使用定标价作为投标价",'提示','确定','取消', createBidedOnConfirm,cancelBidedCancle);
        }else{
          hmsPopup.showPopup("该状态不允许进行此操作");
        }
      };
      var createNewBidAuthSuccess=function(result){
        if(result.returnCode=="S"){
          hmsPopup.confirmNoTitle("创建新版投标报价后，当前报价单将自动失效，确定创建吗？", createNewOnConfirm);
        }else{
          hmsPopup.showPopup("该状态不允许进行此操作");
        }
      };
      var createNewBidedAuthSuccess=function(result){
        if(result.returnCode=="S"){
          hmsPopup.confirmNoTitle("创建新版定标报价后，当前报价单将自动失效，确定创建吗？", createNewBidedOnConfirm);
        }else{
          hmsPopup.showPopup("该状态不允许进行此操作");
        }
      };
      var offerEditAuthSuccess=function(result){
        if(result.returnCode=="S"){
          editOfferDetail();
        }else{
          hmsPopup.showPopup("该状态不允许进行此操作");
        }
      };
      var offerDeleteAuthSuccess=function(result){
        if(result.returnCode=="S"){
          hmsPopup.confirmNoTitle("确定删除该报价单吗？", deleteOnConfirm);
        }else{
          hmsPopup.showPopup("该状态不允许进行此操作");
        }
      };
      var approveOfferSuccess=function(result){
        if(result.returnCode=="S"){
          hmsPopup.showShortCenterToast(result.returnMsg);
        }else{
          hmsPopup.showShortCenterToast(result.returnMsg);
        }
      };
      var offerSubmitAuthSuccess=function(result){
        if(result.returnCode=="S"){
         //提交
         offerListService.approveOffer(approveOfferSuccess,$scope.offer.offerHeaderId)
        }else{
          hmsPopup.showPopup("该状态不允许进行此操作");
        }
      };
      $scope.showMenu=function(){
        if (ionic.Platform.isWebView()) {
          console.log("webView");
          var options = {
            buttonLabels: ['编辑','提交','删除','创建定标报价','创建新版投标报价','创建新版定标报价'],
            addCancelButtonWithLabel: '取消',
            androidEnableCancelButton: true,
            androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT
          };
          document.addEventListener("deviceready", function () {
            $cordovaActionSheet.show(options)
              .then(function (btnIndex) {
                //1开始
                if(btnIndex==1){
                  offerListService.offerEditAuth(offerEditAuthSuccess,$scope.offer.offerHeaderId);
                }else if(btnIndex==2){
                  offerListService.offerSubmitAuth(offerSubmitAuthSuccess,$scope.offer.offerHeaderId);
                }else if(btnIndex==3){
                  offerListService. offerDeleteAuth( offerDeleteAuthSuccess,$scope.offer.offerHeaderId);
                }else if(btnIndex==4){
                  offerListService.createNewBidBidedAuth(createNewBidBidedAuthSuccess,$scope.offer.offerHeaderId);
                }else if(btnIndex==5){
                  offerListService.createNewBidAuth(createNewBidAuthSuccess,$scope.offer.offerHeaderId);
                }else if(btnIndex==6){
                  offerListService.createNewBidedAuth(createNewBidedAuthSuccess,$scope.offer.offerHeaderId);
                }
              })
          }, false)
        }else{
          var hideSheet = $ionicActionSheet.show({
            buttons: [
              {text: '编辑'},
              {text: '提交'},
              {text: '删除'},
              {text: '创建定标报价'},
              {text: '创建新版投标报价'},
              {text: '创建新版定标报价'}
            ],
            cancelText: '取消',
            cancel: function () {
              // add cancel code..
            },
            buttonClicked: function (index) {
              console.log(index);
              if (index == 0) {//更新状态}
                offerListService.offerEditAuth(offerEditAuthSuccess,$scope.offer.offerHeaderId);
              }else if(index == 1){
               // 提交权限
                offerListService.offerSubmitAuth(offerSubmitAuthSuccess,$scope.offer.offerHeaderId);
              }else if(index == 2){
                offerListService. offerDeleteAuth( offerDeleteAuthSuccess,$scope.offer.offerHeaderId);
              }else if(index == 3){
                //定标
                offerListService.createNewBidBidedAuth(createNewBidBidedAuthSuccess,$scope.offer.offerHeaderId);
              }else if(index == 4){
                //新版投标
                offerListService.createNewBidAuth(createNewBidAuthSuccess,$scope.offer.offerHeaderId);
              }else if(index == 5){
                //新版定标
                offerListService.createNewBidedAuth(createNewBidedAuthSuccess,$scope.offer.offerHeaderId);
              }
              return true;
            }

          });
        }
      };
    }]);



