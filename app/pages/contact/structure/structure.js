/**
 * Created by daiwen on 16/7/21. (-wen.dai-)
 */

'use strict';
//--通讯录搜索模块路由-
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.contactStructure', {
          url: 'contact/contactStructure',
          views: {
            'tab-contact': {
              templateUrl: 'build/pages/contact/structure/structure.html',
              controller: 'structureCtl'
            }
          }
        });
    }]);

angular.module('contactModule')
  .controller('structureCtl', [
    '$scope',
    '$ionicScrollDelegate',
    '$ionicModal',
    'baseConfig',
    'hmsPopup',
    '$state',
    '$ionicActionSheet',
    'contactService',
    '$timeout',
    'hmsHttp',
    '$ionicHistory',
    function ($scope,
              $ionicScrollDelegate,
              $ionicModal,
              baseConfig,
              hmsPopup,
              $state,
              $ionicActionSheet,
              contactService,
              $timeout,
              hmsHttp,
              $ionicHistory) {
      /**
       * var section
       */

      {

      }

    }]);
