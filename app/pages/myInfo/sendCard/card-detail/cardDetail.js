(function () {
  'use strict';
  angular
    .module('myInfoModule')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tab.cardDetail', {
        url: '/myInfo/sendCard/cardDetail',
        params: {
          params:{}
        },
        views: {
          'tab-myInfo': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/myInfo/sendCard/card-detail/cardDetail.html',
            controller: 'cardDetailCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }

  angular
    .module('myInfoModule')
    .controller('cardDetailCtrl', cardDetailCtrl);

  cardDetailCtrl.$inject = [
    '$scope',
    '$state',
    '$stateParams',
    'sendCardService',
  'hmsPopup'];

  function cardDetailCtrl($scope,
                          $state,
                      $stateParams,
                     sendCardService,
                          hmsPopup) {
    var vm = this;
    $scope.data={
      name:"测试",
      title:"测试"
    };
    $scope.ENdata={
      phone:"phone",
      email:"email",
      telephone:"telephone",
      address:"address",
      CDcard:"QR code",
      share:"share"
    };
    $scope.EN=false;
    $scope.changeLauguage=function(){
      $scope.EN=!$scope.EN;
    };
    var cardId=$stateParams.params.card_id;
    console.log($stateParams.params);
    var getSingleCardSuccess=function(result){
      $scope.cardDetail=result;
    };

    sendCardService.getSingleCard(getSingleCardSuccess,cardId);
    var getCompanyInfoSuccess=function(result){
      console.log(result);
      $scope.companyInfo=result;
    };

    sendCardService.getCompanyInfo(getCompanyInfoSuccess);

    $scope.ORCode=function(item){
      console.log(item);
      if(item.status=="APPROVED"){
        $state.go("tab.my-card",{params:item.card_id});
      }else{
        hmsPopup.showPopup("名片需审批通过后，方可分享");
      }
    };
    $scope.shareMyCard = function (item){
      if(item.status=="APPROVED"){
        console.log(item);
        //分享显示的图片，默认
        var imgurl = 'http://mobile-app.hand-china.com/hrmsstatic/hrms-img/icon.png';
        //分享显示的图片，取转租信息中的第一张照片
        //if ($scope.housesSubDetail.imgs.length > 0) {
        //  imgurl = $scope.housesSubDetail.imgs[$scope.slideIndex].objectUrl;
        //}
        var youtuiShare = window.plugins.youtuiShare;
        youtuiShare.share(success, fail, [
          '分享名片',   //标题
          "http://www.baidu.com", //链接
          "分享我的名片", //描述
          imgurl  //图片
        ]);

      }else{
        hmsPopup.showPopup("名片需审批通过后，方可分享");
      }
      function success(success) {
        if(success.code=='0'){
          //分享成功
        }
      }
      function fail(error) {
        if(error.code=='-1'){
          //分享失败
        }else if(error.code=='-2'){
          //用户取消
        }
      }
    };
  }
})();

