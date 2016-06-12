angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.workflow-list', {
          url: '/workflow-list',
          params: {day: {}},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/workflow/list/workflow-list.html',
              controller: 'WorkFLowListCtrl'
            }
          }
        });
    }]);

/**
 * @ngdoc controller
 * @name TimeSheetWriteCtrl
 * @module applicationModule
 * @description
 *
 * @author
 * gusenlin
 */
angular.module('applicationModule')
  .controller('WorkFLowListCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$ionicModal',
    '$timeout',
    'baseConfig',
    'TimeSheetService',
    'hmsPopup',
    function ($scope,
              $state,
              $stateParams,
              $ionicModal,
              $timeout,
              baseConfig,
              TimeSheetService,
              hmsPopup) {

      $scope.list = [
        {
          title1: 'Timesheet解冻申请',
          icon: 'build/img/application/profile@3x.png',
          type: '工作流类型',
          typeValue: 'Timesheet解冻申请Timesheet解冻申请Timesheet解冻申请Timesheet解冻申请',
          node: '当前节点',
          nodeValue: '项目经理审批项目经理审批项目经理审批',
          submit: '提交人',
          submitPerson: '成志唯'
        },
        {
          title1: 'Timesheet解冻申请',
          icon: 'build/img/application/profile@3x.png',
          type: '工作流类型',
          typeValue: 'Timesheet解冻申请',
          node: '当前节点',
          nodeValue: '项目经理审批',
          submit: '提交人',
          submitPerson: '成志唯'
        },
        {
          title1: 'Timesheet解冻申请',
          icon: 'build/img/application/profile@3x.png',
          type: '工作流类型',
          typeValue: 'Timesheet解冻申请',
          node: '当前节点',
          nodeValue: '项目经理审批',
          submit: '提交人',
          submitPerson: '成志唯'
        },
        {
          title1: 'Timesheet解冻申请',
          icon: 'build/img/application/profile@3x.png',
          type: '工作流类型',
          typeValue: 'Timesheet解冻申请',
          node: '当前节点',
          nodeValue: '项目经理审批',
          submit: '提交人',
          submitPerson: '成志唯'
        },
        {
          title1: 'Timesheet解冻申请',
          icon: 'build/img/application/profile@3x.png',
          type: '工作流类型',
          typeValue: 'Timesheet解冻申请',
          node: '当前节点',
          nodeValue: '项目经理审批',
          submit: '提交人',
          submitPerson: '成志唯'
        }
      ]

      $ionicModal.fromTemplateUrl('build/pages/application/timesheet-approve/modal/ts-filter-modal.html', { //筛选modal
        scope: $scope
      }).then(function (modal) {
        $scope.tsFilterModal = modal;
      });

      $scope.filterTsInfo = function () { //响应筛选按钮的方法
        $scope.tsFilterModal.show();
      };
    }]);
