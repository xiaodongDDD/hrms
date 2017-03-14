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
      .state('tab.myAddress', {
        url: '/myInfo/sendCard/printCard/myAddress',
        params: {
          params:""
        },
        views: {
          'tab-myInfo': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/myInfo/sendCard/myAddress/myAddress.html',
            controller: 'myAddressCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }

  angular
    .module('myInfoModule')
    .controller('myAddressCtrl', myAddressCtrl);

  myAddressCtrl.$inject = [
    '$scope',
    '$rootScope',
    '$ionicModal',
    'sendCardService',
    'hmsPopup',
    'hmsHttp',
    'baseConfig',
    '$ionicScrollDelegate',
    '$ionicHistory',
    '$stateParams'
  ];

  function myAddressCtrl($scope,
                         $rootScope,
                         $ionicModal,
                         sendCardService,
                         hmsPopup,
                         hmsHttp,
                         baseConfig,
                         $ionicScrollDelegate,
                         $ionicHistory,
                         $stateParams) {
    var vm = this;
    console.log($stateParams.params);
    $scope.data={
      name:"测试",
      title:"测试"
    };
    $scope.myAddress=[];
    $scope.defaultAddress=  {
      "name":"",
      "isDefault":"",
      "address_id":"-9999",
      "defaultImg":"build/img/myInfo/card/choose.png"
    };
    $ionicModal.fromTemplateUrl('build/pages/myInfo/sendCard/addAddress/addAddress.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.addAddressModel = modal;
    });
    var getAddressInfoSuccess=function(result){
      console.log(result);
      $scope.myAddress=result.res_list;
      $scope.temDefaultArr=[];
      for(var i=0;i<result.res_list.length;i++){
        //$scope.myAddress[i].flag=true;
         var tem=result.res_list[i].is_default;
        if(result.res_list[i].is_default=="Y"){
          $scope.myAddress[i].defaultImg="build/img/myInfo/card/choose.png";
          $scope.myAddress[i].defaultFlag=true;

        }else{
          $scope.myAddress[i].defaultImg="build/img/myInfo/card/nochoose.png";
          $scope.myAddress[i].defaultFlag=false;
        }
        $scope.temDefaultArr.push(tem);
      }
      console.log($scope.temDefaultArr.indexOf("Y"));
      if($scope.temDefaultArr.indexOf("Y")=="-1"){
        $scope.defaultAddress.defaultFlag=true;
        $scope.defaultAddress.is_default="Y";
        $scope.defaultAddress.defaultImg="build/img/myInfo/card/choose.png";
      }else{
        $scope.defaultAddress.defaultFlag=false;
        $scope.defaultAddress.is_default="N";
        $scope.defaultAddress.defaultImg="build/img/myInfo/card/nochoose.png";
      }
      if(result.res_list.length==0){
        $scope.defaultAddress.defaultImg="build/img/myInfo/card/choose.png";
      }
      console.log( $scope.myAddress);
      $scope.myAddress.push($scope.defaultAddress);
    };
    var setDefaultAddressSuccess=function(result){
      console.log(result);
      $scope.$emit('CHANGE_DEFAULT_ADDRESS');
    };
    $scope.chooseDefault=function(item){
      for(var i=0;i<$scope.myAddress.length;i++){
        $scope.myAddress[i].defaultFlag=false;
        $scope.myAddress[i].defaultImg="build/img/myInfo/card/nochoose.png";
        $scope.myAddress[i].is_default="N";
      }
      item.defaultFlag=true;
      item.defaultImg="build/img/myInfo/card/choose.png";
      item.is_default="Y";
      sendCardService.setDefaultAddress(setDefaultAddressSuccess, item.address_id);
      console.log(item.defaultFlag=true);

    };
    sendCardService.getAddressInfo(getAddressInfoSuccess);

    //$scope.setDefaultAddress=function(id){
    //
    //};
    $scope.goAddAddress=function(){
      $scope.$emit('ADD_ADDRESS');
      $scope.addAddressModel.show();
    };
    var CLOSE_ADDRESS_ADD = $rootScope.$on('CLOSE_ADDRESS_ADD',function(){
      console.log("CLOSE_ADDRESS_ADD");
      $scope.addAddressModel.hide();
    });
    var UPDATE_ADDRESS_LIST = $rootScope.$on('UPDATE_ADDRESS_LIST',function(){
      sendCardService.getAddressInfo(getAddressInfoSuccess);
      $scope.addAddressModel.hide();
    });
    //编辑地址
    $scope.editAddress=function(item){
      sendCardService.setEditAddress(item);
      $scope.addAddressModel.show();
      $scope.$emit('EDIT_ADDRESS');
    };
    var deleteAddressInfoSuccess=function(result){
      console.log(result);
      sendCardService.getAddressInfo(getAddressInfoSuccess);
      hmsPopup.showShortCenterToast(result.message);
    };
    //删除地址
    $scope.deleteAddress=function(item){
      hmsPopup.confirmNoTitle("确定要删除该地址吗？",confirmFun);
      var confirmFun=function(flag){
        if(flag){
          sendCardService.deleteAddressInfo(deleteAddressInfoSuccess,item.address_id)
        }
      };

    };
    //选择地址
    if($stateParams.params=="print"){
      $scope.chooseAddress=function(item){
        console.log("选择地址"+angular.toJson(item));
        sendCardService.setMailAddres(item);
        $ionicHistory.goBack();
        $scope.$emit('CHOOSE_ADDRESS');
      }
    }else{
      $scope.chooseAddress=function(item){

      }
    }


    $scope.$on('$destroy',function(){//controller回收资源时执行
      CLOSE_ADDRESS_ADD();//回收广播
      UPDATE_ADDRESS_LIST();
    });
  }
})();

