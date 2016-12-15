/**
 * Created by gusenlin on 2016/12/15.
 */
/**
 * Created by gusenlin on 2016/12/9.
 */
(function () {
  'use strict';
  angular
    .module('myInfoModule')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tab.face-ecognition', {
        url: '/myInfo/face-ecognition',
        params: {},
        views: {
          'tab-myInfo': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/myInfo/face-ecognition/face-ecognition.html',
            controller: 'faceEcognitionCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }

  angular
    .module('myInfoModule')
    .controller('faceEcognitionCtrl', faceEcognitionCtrl);

  //plansDetailCtrl.$inject = [];

  function faceEcognitionCtrl($scope,
                              $stateParams) {
    var vm = this;

    vm.list = [
      {
        "image": "build/img/myInfo/1-1@3x.png",
        "text": "光线充足 正对手机"
      },
      {
        "image": "build/img/myInfo/1-2@3x.png",
        "text": "不要在昏暗或逆光下扫描"
      },
      {
        "image": "build/img/myInfo/1-3@3x.png",
        "text": "不要斜视手机"
      }
    ];

    vm.faceEcognition = faceEcognition;


    function faceEcognition() {
      if (baseConfig.debug) {
        console.log('faceEcognition.work...');
      }
      var success = function (result) {
        alert(result);
        alert('faceEcogniition.success ' + angular.toJson(result));
      }

      function error(result) {
        alert(result);
        alert('faceEcogniition.error ' + angular.toJson(result));
      }

      pluginface.faceDetect(success, error, '');
    }
  }
})();
