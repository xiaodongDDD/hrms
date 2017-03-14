(function () {
  'use strict';
  angular
    .module('myInfoModule')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tab.my-card', {
        url: '/myInfo/sendCard/my-card',
        params: {
          params:""
        },
        views: {
          'tab-myInfo': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/myInfo/sendCard/my-card/my-card.html',
            controller: 'myCardCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }

  angular
    .module('myInfoModule')
    .controller('myCardCtrl', myCardCtrl);

  myCardCtrl.$inject = [
    '$scope',
    '$stateParams',
    'sendCardService',
  'hmsPopup'];

  function myCardCtrl($scope,
                        $stateParams,
                      sendCardService,
                      hmsPopup) {
    var vm = this;
    var cardId=$stateParams.params;
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

  }
})();

