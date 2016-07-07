/** Author      : joshua.shi
 *
 *  History:
 *      1.00    2016-7-05   joshua.shi   Creation
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.time-off-manage-detail', {
          url: '/time-off-manage',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/time-off-manage/time-off-manage-detail.html',
              controller: 'TimeOffManageDetailCtrl'
            }
          }
        })
    }]);

angular.module('applicationModule')

  .controller('TimeOffManageDetailCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    '$ionicHistory',
    function ($scope,
              $state,
              baseConfig,
              hmsHttp,
              hmsPopup,
              $ionicHistory) {
      $scope.descriptionAppearance = "";

      $scope.showDescription = function () {
        $scope.descriptionAppearance = true;
      };
      $scope.hideDescription = function () {
        $scope.descriptionAppearance = false;
      };

    }]);
