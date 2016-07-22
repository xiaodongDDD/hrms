/**
 * Created by daiwen on 16/7/21. (-wen.dai-)
 */

'use strict';
//--通讯录组织架构模块路由-
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.contactStructure', {
          url: '/contact/contactStructure',
          views: {
            'tab-contact': {
              templateUrl: 'build/pages/contact/structure/structure.html',
              controller: 'structureCtl'
            }
          },
          params: {
            structureId: "1"
          }
        })
    }]);

angular.module('myApp')
  .controller('structureCtl', [
    '$scope',
    'hmsPopup',
    '$state',
    '$stateParams',
    'test',
    function ($scope,
              hmsPopup,
              $state,
              $stateParams,
              test) {
      /**
       * var section
       */

      {
        var curr_page = ''; //当前组织架构层级的页面
        var structureParams = {
          "id": ""
        };
      }
      curr_page = $stateParams.structureId;
      structureParams.id = curr_page;
      // structureService.gteStructureInfo(structureParams);
      alert(curr_page);
      $scope.nextStructure = function () { //到下一级组织架构界面
        try {
          test.testId = "2";
          $state.go("tab.contactStructure" + curr_page, {structureId: ++curr_page});
        } catch (e) {
          warn("update highest!" + e);
        }
      };

    }])
  .constant('test', {"testId": "1"})
  .config(['$stateProvider', 'test',
    function ($stateProvider, test) {
      console.warn(test);
      $stateProvider.state('tab.contactStructure' + test.testId, {
        url: 'contact/contactStructure/' + test.testId,
        views: {
          'tab-contact': {
            templateUrl: 'build/pages/contact/structure/structure.html',
            controller: 'structureCtl'
          }
        },
        params: {
          structureId: ""
        }
      });

    }]);
