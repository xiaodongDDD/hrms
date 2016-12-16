/**
 * Created by gusenlin on 2016/12/15.
 */
(function () {
  'use strict';
  angular
    .module('myInfoModule')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tab.face-ecognition-setting', {
        url: '/myInfo/face-ecognition-setting',
        params: {},
        views: {
          'tab-myInfo': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/myInfo/face-ecognition/ecognition/ecognition.html',
            controller: 'faceEcognitionSettingCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }

  angular
    .module('myInfoModule')
    .controller('faceEcognitionSettingCtrl', faceEcognitionSettingCtrl);

  //plansDetailCtrl.$inject = [];

  function faceEcognitionSettingCtrl($scope,
                              $stateParams,
                              baseConfig,
                              hmsPopup,
                              faceEcognitionService) {
    var vm = this;

  }
})();
