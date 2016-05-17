/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('messageModule')

  .controller('messageDetailCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$ionicHistory',
    function ($scope,
              $state,
              $stateParams,
              $ionicHistory) {

      var message = $stateParams.message;
      console.log('message : ' + angular.toJson(message));

      $scope.message = message;

      $scope.goBack = function(){
        $ionicHistory.goBack();
      };

      $scope.$on('$ionicView.enter', function (e) {
        console.log('messageDetailCtrl.$ionicView.enter');
      });
      console.log('messageDetailCtrl.enter');

      $scope.$on('$destroy', function (e) {
        console.log('messageDetailCtrl.$destroy');
      });
    }]);
