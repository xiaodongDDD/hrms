/**
 * Created by gusenlin on 2016/11/15.
 */
angular.module('applicationModule')
  .service('TabsService',
    ['baseConfig',
      '$timeout',
      function (baseConfig,
                $timeout) {
        var manualReturnFlag = false;
        this.setManualReturnFlag = function (flag) {
          manualReturnFlag = flag;
        };
        this.getManualReturnFlag = function () {
          return manualReturnFlag;
        }
      }]);
