/**
 * Created by gusenlin on 16/7/9.
 */
angular.module('loginModule')

  .controller('pushDetailCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$stateParams',
    '$ionicHistory',
    function ($scope,
              $state,
              baseConfig,
              $stateParams,
              $ionicHistory) {

      $scope.content = angular.toJson($stateParams.content);

      $scope.goBack = function () {
        $state.go('tab.message');
      };

      $scope.$on('$ionicView.enter', function (e) {
        if (baseConfig.debug) {
          console.log('pushDetailCtrl.$ionicView.enter');
        }
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('pushDetailCtrl.$destroy');
        }
      });
    }]);
