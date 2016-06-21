angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.personnel-policy', {
          url: '/personnel-policy',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/personnel-policy/personnel-policy.html',
              controller: 'PersonnelPolicyCtrl'
            }
          }
        })
    }]);

angular.module('applicationModule')
  .controller('PersonnelPolicyCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory) {

      $scope.goBack=function(){
        $ionicHistory.goBack();
      };
      $scope.openwin=function($url){
        //window.open($url,'newwindow','top=0,left=0,toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes,location=yes,status=yes');
        window.open("http://www.daxuequan.org/ceshi/"+$url, '_system', 'location=yes');
        };
    }]
);


