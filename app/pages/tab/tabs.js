/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('loginModule').controller('TabsCtrl', ['$scope', '$rootScope', '$state', 'baseConfig',
  function ($scope, $rootScope, $state, baseConfig) {
    $scope.$on('$ionicView.beforeEnter', function () {
      var statename = $state.current.name;
      if (baseConfig.debug) {
        console.log('$ionicView.beforeEnter statename ' + statename);
      }
      //tabs中存在的主页面不需要隐藏，hidetabs=false
      if (statename != 'tab.message' && statename != 'tab.application' &&
        statename != 'tab.contact' && statename != 'tab.myInfo') {
        $scope.hideTabs = true;
      }
    });

    $scope.$on('$ionicView.afterEnter', function () {
      var statename = $state.current.name;
      if (baseConfig.debug) {
        console.log('$ionicView.afterEnter statename ' + statename);
      }
      //tabs中存在的主页面不需要隐藏，hidetabs=false
      if (statename === 'tab.message' || statename === 'tab.application' ||
        statename === 'tab.contact' || statename === 'tab.myInfo') {
        $scope.hideTabs = false;
      }
    });
  }]);
