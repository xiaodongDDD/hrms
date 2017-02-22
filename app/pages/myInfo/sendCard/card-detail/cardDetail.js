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
    '$stateParams',
    'sendCardService'];

  function cardDetailCtrl($scope,
                      $stateParams,
                     sendCardService) {
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
    }
    $scope.EN=false;
    $scope.changeLauguage=function(flag){
      $scope.EN=flag;
    };
    var cardId=$stateParams.params.card_id;
    console.log($stateParams.params);
    var getSingleCardSuccess=function(result){
      $scope.cardDetail=result;
    };

    sendCardService.getSingleCard(getSingleCardSuccess,cardId);
    //vm.ORCode=ORCode;
    //function ORCode(){
    //  console.log("===");
    //}
  }
})();

