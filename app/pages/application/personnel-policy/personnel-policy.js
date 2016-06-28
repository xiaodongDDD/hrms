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
        if(ionic.Platform.isIOS())
        {
          var urls = $url.split("?");
          var pdfurl = urls[0];
          window.open("http://www.daxuequan.org/ceshi/"+pdfurl, '_system', 'location=yes');
        } else if(ionic.Platform.isAndroid())
        {
          var urls = $url.split("?");
          var urlid = urls[1];
          window.open("http://www.daxuequan.org/hrms-pdf/web/viewer.html?"+urlid, '_system', 'location=yes');
        }else
        {
        }
        };
    }]
);


