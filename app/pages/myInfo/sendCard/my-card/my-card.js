(function () {
  'use strict';
  angular
    .module('myInfoModule')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tab.my-card', {
        url: '/myInfo/sendCard/my-card',
        params: {},
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
    'baseConfig',
    'hmsPopup',
    'faceEcognitionService',
    '$state',
    '$http',
    '$ionicHistory',
    '$timeout'];

  function myCardCtrl($scope,
                        $stateParams,
                        baseConfig,
                        hmsPopup,
                        $state,
                        $http,
                        $ionicHistory,
                        $timeout) {
    var vm = this;
    $scope.data={
      name:"测试",
      title:"测试"
    };
    //vm.ORCode=ORCode;
    //function ORCode(){
    //  console.log("===");
    //}
  }
})();

