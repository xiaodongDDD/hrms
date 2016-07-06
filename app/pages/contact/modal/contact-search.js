/**
 * Created by wolf on 2016/7/6. (-wen.dai-)
 */
'use strict';
angular.module('contactModule')
  .controller('employeeModalCtl', [
    '$scope',
    'baseConfig',
    '$timeout',
    function ($scope,
              baseConfig,
              $timeout) {
      $scope.$on('contact-search', function () {
        if(ionic.Platform.isWebView()) {
          cordova.plugins.Keyboard.show();
        }
        $timeout(function () {
          var item = document.getElementById("employeeInputSearch");
          warn(item);
          item.focus();
          $scope.$apply();
        }, 400);
      });
    }]);
