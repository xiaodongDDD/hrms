/**
 * Created by bobo on 2016/12/30.
 */
(function () {
  'use strict';
  angular
    .module('myInfoModule')
    .config(config);
  function config($stateProvider) {
    $stateProvider
      .state('tab.face-ecognition-face-affirm', {
        url: '/myInfo/face-ecognition-face-affirm',
        views: {
          'tab-myInfo': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/myInfo/face-ecognition/ecognition/face-affirm/face-affirm.html',
            controller: 'faceAffirmCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }
  angular
    .module('myInfoModule')
    .controller('faceAffirmCtrl', faceAffirmCtrl);
    function faceAffirmCtrl($scope,
                            $state,
                            $ionicHistory,
                            baseConfig,
                            $stateParams,
                            hmsPopup,
                            hmsReturnView,
                            hmsHttp,
                            $ionicScrollDelegate) {



    }
})();
