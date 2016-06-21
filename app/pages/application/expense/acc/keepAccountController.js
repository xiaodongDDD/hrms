/**
 * Created by wuxiaocheng on 15/8/26.
 */

// angular.module('myApp')
//   .config(['$stateProvider',
//     function ($stateProvider) {
//       $stateProvider
//         .state('tab.expense_acc', {
//           url: '/expense/acc',
//           params: {},
//           views: {
//             'tab-application': {
//               templateUrl: 'build/pages/application/expense/acc/accounts.html',
//               controller: 'keepAccountController'
//             }
//           }
//         });
//     }]);

angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.acc_main', {
          url: '/acc',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/acc/accounts.html',
              controller: 'keepAccountController'
            }
          }
        });
    }]);
     
angular.module("applicationModule")
  .controller('keepAccountController', function ($scope, keepAccount, $http, $state, $rootScope, $q, hmsPopup) {

    $scope.openCreatePage = function () {
      keepAccount.operation = "INSERT";
      keepAccount.canEdit = true;
      keepAccount.canUpload = false;
      keepAccount.sourceFrom = "ACCOUNT";
      keepAccount.initData();

      console.log("should null " + angular.toJson(keepAccount.expenseItemList));

      keepAccount.expenseItemList = [];
      console.log("should null " + angular.toJson(keepAccount.expenseItemList));

      keepAccount.boolLoadExpenseObject = false;
      $state.go('tab.acc_detail', {hideTabs: true}); 
    };


    $scope.openAccountListPage = function () {
      $state.go("tab.acc_accountList");

    };

    $scope.openUploadBatchPage = function () {
      //globalNavigator.pushPage(moduleHtmlPath.ACC+'uploadAccount.html', { animation : 'slide' });

      $state.go("tab.acc_uploadAccount");

    };

    //$rootScope.hideTabs = $stateParams.hideTabs;
   // $rootScope.hideTabs = true; // mod by ciwei

    // add by ciwei
    $scope.showHelp = function () {
      var template = 'Step1：在“记一笔”功能中创建待报销记录，保存并上传。' + '<br> ' +
        'Step2：在“报销”功能中，创建报销单，选择项目，再选择已经上传的“记一笔”作为报销行信息，保存提交。' + '<br><br> ' +
        '**“记一笔”保存，是保存在手机本地，只有上传后，才能在报销单处选到。另，如果app被卸载了，再重新下载，之前没上传的“记一笔”会丢失。';

      hmsPopup.showPopup(template, '报销功能使用说明');
    };

  });
