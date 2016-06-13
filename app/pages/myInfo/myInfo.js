/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('myInfoModule')

  .controller('myInfoCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    function ($scope,
              $state,
              baseConfig) {

      if(baseConfig.debug){
        console.log('myInfoCtrl.enter');
      }

      $scope.logout = function(){
        window.localStorage.token = "";
        window.localStorage.password = "";
        $state.go('login');
      }

      $scope.$on('$ionicView.enter', function (e) {
        if(baseConfig.debug) {
          console.log('myInfoCtrl.$ionicView.enter');
        }
      });

      $scope.$on('$destroy', function (e) {
        if(baseConfig.debug) {
          console.log('myInfoCtrl.$destroy');
        }
      });
    }]);
