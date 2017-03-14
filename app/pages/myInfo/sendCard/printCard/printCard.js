/**
 * Created by wkh on 2017/2/21.
 */
(function () {
  'use strict';
  angular
    .module('myInfoModule')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tab.printCard', {
        url: '/myInfo/sendCard/printCard',
        params: {
          params:{}
        },
        views: {
          'tab-myInfo': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/myInfo/sendCard/printCard/printCard.html',
            controller: 'printCardCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }

  angular
    .module('myInfoModule')
    .controller('printCardCtrl', printCardCtrl);

  printCardCtrl.$inject = [
    '$scope',
    '$state',
  '$stateParams',
    'sendCardService',
  'hmsPopup',
  '$rootScope'];

  function printCardCtrl($scope,
                          $state,
                         $stateParams,
                         sendCardService,
                         hmsPopup,
                         $rootScope) {
    var vm = this;
    $scope.myAddress=[];
    hmsPopup.showLoading("正在加载");
    var cardId=$stateParams.params.card_id;
    console.log($stateParams.params);
    //$scope.cardDetail={
    //  printNum:1
    //};
   $scope.cardDetail={};
    var getSingleCardSuccess=function(result){
      hmsPopup.hideLoading();
      console.log(result);
      $scope.cardDetail.card=result;
      console.log( $scope.cardDetail);
      $scope.cardDetail.printNum=1;
    };


    //减少件数
   $scope.needMail=false;

    var getAddressInfoSuccess=function(result){
      hmsPopup.hideLoading();
      console.log(result);
      $scope.temDefaultArr=[];
      for(var i=0;i<result.res_list.length;i++){
        //$scope.myAddress[i].flag=true;
        var tem=result.res_list[i].is_default;
        if(result.res_list[i].is_default=="Y"){
          $scope.cardDetail.address_id=result.res_list[i].address_id;
          $scope.cardDetail.address=result.res_list[i];
        }else{

        }
        $scope.temDefaultArr.push(tem);
      }
      console.log($scope.temDefaultArr.indexOf("Y"));
      if($scope.temDefaultArr.indexOf("Y")=="-1"){
        $scope.needMail=false;
       console.log(angular.toJson($scope.cardDetail.address));
      }else{
        $scope.needMail=true;
        console.log(angular.toJson($scope.cardDetail.address));
      }
      if(result.res_list.length==0){

      }
      console.log( $scope.myAddress);
      $scope.myAddress.push($scope.defaultAddress);
      console.log("======");
      console.log( $scope.cardDetail);
    };
    function init(){
      hmsPopup.showLoading("正在加载");
      sendCardService.getSingleCard(getSingleCardSuccess,cardId);
      sendCardService.getAddressInfo(getAddressInfoSuccess);
    }
    init();
    var CHANGE_DEFAULT_ADDRESS = $rootScope.$on('CHANGE_DEFAULT_ADDRESS',function(){
      console.log("CHANGE_DEFAULT_ADDRESS");
      sendCardService.getAddressInfo(getAddressInfoSuccess);
    });
    $scope.subPrint = function (x) {
      console.log(x);
      if(x==1){
        hmsPopup.showShortCenterToast("打印名片数量不能少于1");
        return;
      }
      $scope.cardDetail.printNum=Number(x)-1;
    };

    $scope.addPrint = function (x) {
      $scope.cardDetail.printNum=Number(x)+1;
    };
    $scope.chooseAddress=function(){
      //$state.go("tab.myAddress");
      $state.go("tab.myAddress",{params:"print"});
    };
    var printCardApplySuccess=function(result){
      hmsPopup.hideLoading();
      hmsPopup.showPopup(result.message);
      console.log(result);
    };
    //选择地址
    var CHOOSE_ADDRESS = $rootScope.$on('CHOOSE_ADDRESS',function(){
      console.log(sendCardService.getMailAddress());
      $scope.cardDetail.address=sendCardService.getMailAddress();
      console.log(angular.toJson($scope.cardDetail.address));
      if( $scope.cardDetail.address.name!='' ){
        $scope.needMail=true;
      }else{
        $scope.needMail=false;
      }
    });
    $scope.cardApply=function(){
      hmsPopup.showLoading("正在提交");
      var printCardApplyParam={
        params:{
          "p_card_id":$scope.cardDetail.card.card_id,
          "p_employee_number":window.localStorage.empno,
          "p_is_mailing":"",
          "p_amount":$scope.cardDetail.printNum
        }
      };
      console.log($scope.cardDetail);
      if( $scope.needMail){
        printCardApplyParam.params.p_is_mailing="Y";
        printCardApplyParam.params.p_address_id=$scope.cardDetail.address.address_id;
      }else{
        printCardApplyParam.params.p_is_mailing="N";
      }
      sendCardService.printCardApply(printCardApplySuccess,printCardApplyParam);
    };
    //销毁广播
    $scope.$on('$destroy',function(){//controller回收资源时执行
      CHOOSE_ADDRESS();//回收广播
      CHANGE_DEFAULT_ADDRESS();
    });
  }
})();
