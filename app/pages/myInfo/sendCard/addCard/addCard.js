(function () {
  'use strict';
  angular
    .module('myInfoModule')
    .controller('addCardCtrl', addCardCtrl);
  function addCardCtrl($scope,
                      $stateParams,
                      baseConfig,
                      hmsPopup,
                      $state,
                      $http,
                      $ionicHistory,
                      $timeout,
                       sendCardService) {
    var vm = this;
    $scope.title="创建名片";
    $scope.data={
      name:"测试",
      title:"测试"
    };
    var updateCardInfoSuccess=function(result){
      console.log(result);
      hmsPopup.hideLoading();
      hmsPopup.showShortCenterToast(result.message);
      $scope.$emit('CLOSE_CARD_ADD');
      $scope.$emit('UPDATE_CARD_INFO');
    };
    function Trim(str)
    {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    }
    $scope.addCardData={
      "name":"",
      "name_en":"",
      "job":"",
      "job_en":"",
      "phone":"",
      "email":"",
      "telephone":"",
      "submit":""
    };
    var getEmployeeInfoSuccees=function(result){
      if(result.status=="S"){
        $scope.addCardData.name=result.name;
        $scope.addCardData.name_en=result.name_en;
        $scope.addCardData.job=result.unit+" "+result.job;
        $scope.addCardData.phone=result.phone;
        $scope.addCardData.email=result.email;
        $scope.addCardData.telephone=tirmWhitespace(result.telephone);
        //$scope.$apply();
        console.log( $scope.addCardData)
      }
    };

    $scope.saveCard=function(flag){
      hmsPopup.showLoading("正在提交");
      $scope.addCardData.p_submit=flag;
      if($scope.addCardData.hasOwnProperty("card_id")){
        var data={
          "p_card_id":$scope.addCardData.card_id,
          "p_employee_number": window.localStorage.empno,
          "p_name":$scope.addCardData.name,
          "p_name_en":$scope.addCardData.name_en,
          "p_job":$scope.addCardData.job,
          "p_job_en":$scope.addCardData.job_en,
          "p_phone":$scope.addCardData.phone,
          "p_email":$scope.addCardData.email,
          "p_telephone":$scope.addCardData.telephone,
          "p_submit":$scope.addCardData.p_submit
        };
      }else{
        var data={
          "p_employee_number": window.localStorage.empno,
          "p_name":$scope.addCardData.name,
          "p_name_en":$scope.addCardData.name_en,
          "p_job":$scope.addCardData.job,
          "p_job_en":$scope.addCardData.job_en,
          "p_phone":$scope.addCardData.phone,
          "p_email":$scope.addCardData.email,
          "p_telephone":$scope.addCardData.telephone,
          "p_submit":$scope.addCardData.p_submit
        };
      }


      var updateData= {"params":data};
      sendCardService.updateCardInfo(updateCardInfoSuccess,updateData)
    };
    $scope.$on('ADD_CARD',function(){
      $scope.title="新建名片";
      sendCardService.getEmployeeInfo(getEmployeeInfoSuccees);
    });
    //var updateData= {"params":{
    //  "p_card_id": "",
    //  "p_employee_number":"",
    //  "p_name":"",
    //  "p_name_en":"",
    //  "p_job":"",
    //  "p_job_en":"",
    //  "p_phone":"",
    //  "p_email":"",
    //  "p_telephone":"",
    //  "p_submit":""
    //}};
    //sendCardService.updateCardInfo(updateCardInfoSuccess,updateData);
    $scope.goBack=function(){
      console.log("返回");
      $scope.$emit('CLOSE_CARD_ADD');
    };
    $scope.$on('EDIT_CARD',function(){
     $scope.title="编辑名片";
      $scope.addCardData=sendCardService.getCardDetail();
      console.log(sendCardService.getCardDetail());
    });
  }
})();
