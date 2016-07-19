'use strict';
angular.module('contactModule')
  .controller('carpoolingModalCtl', [
    '$scope',
    'baseConfig',
    '$timeout',
    function ($scope,
              baseConfig,
              $timeout) {
      $scope.$on('', function () {
        if (ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
        }
        $timeout(function () {
          //var item = document.getElementById("employeeInputSearch");
          //item.focus();
          //$scope.$apply();
        }, 400);
      });
    }]);
