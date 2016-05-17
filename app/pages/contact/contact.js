/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('contactModule')

  .controller('contactCtrl', [
    '$scope',
    '$state',
    function ($scope,
              $state) {
      console.log('contactCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('contactCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('contactCtrl.$destroy');
      });
    }]);
