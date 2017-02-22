/**
 * Created by wkh on 2017/2/21.
 */
(function () {
  'use strict';
  angular
    .module('myInfoModule')
    .controller('addAddressCtrl', addAddressCtrl);
  function addAddressCtrl($scope,
                          hmsPopup,
                        sendCardService) {
    var vm = this;
    $scope.data={
      name:"测试",
      title:"测试"
    };
    $scope.addressDetail={
      name:"",
      phone:"",
      province:"",
      city:"",
      zone:"",
      addr_details:""
    };
    var pickContact = function () {

      ContactsPlugin.pickContact(function (response) {
        var email = response.emailList.length == 0 ? "" : response.emailList[0].value;
        var phone = response.phoneList.length == 0 ? "" : response.phoneList[0].value;
        $scope.addressDetail.name=response.name;
        $scope.addressDetail.phone=response.phone;
      }, function () {
        hmsPopup.showPopup('选取错误，请重新选择');
      });
    };
    $scope.pickContactTo=function(){
      pickContact();
    };
    $scope.goBack=function(){
      $scope.$emit('CLOSE_ADDRESS_ADD');
    };
    var updateAddressInfoSuccess=function(){

    };
    var updateAddressInfoData={};
    $scope.addAddress=function(){
      sendCardService.updateAddressInfo(updateAddressInfoSuccess,updateAddressInfoData)
    };
    //vm.ORCode=ORCode;
    //function ORCode(){
    //  console.log("===");
    //}
  }
})();

