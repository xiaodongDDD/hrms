/**
 * Created by gusenlin on 2016/6/12.
 */
"use strict";
HmsModule.directive('hmsWorkflowList', function () {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    scope: {
      selectedFlag: '=workflowSelectedFlag',
      showCheckedFlag: '=workflowShowCheckedFlag',
      title: '=workflowTitle',
      icon: '=workflowIcon',
      type: '=workflowType',
      typeValue: '=workflowTypeValue',
      node: '=workflowNode',
      nodeValue: '=workflowNodeValue',
      submit: '=workflowSubmit',
      submitPerson: '=workflowSubmitPerson',
      key1: '=workflowKey1',
      value1: '=workflowValue1',
      key2: '=workflowKey2',
      value2: '=workflowValue2',
      key3: '=workflowKey3',
      value3: '=workflowValue3',
      showExtraFlag: '=showExtraFlag'
    },

    template: '<a class="workflow-list-item">' +
    '<div class="workflow-list-logo">' +
    '<img ng-src="{{icon}}"/>' +
    '</div>' +
    '<div class="workflow-list-header">{{title}}</div>' +
    '<div class="workflow-list-content">' +
    '  <div class="row no-padding">' +
    '    <div class="col col-10 col-center no-padding" ng-if="showCheckedFlag" style="color: #1D4D95;font-size: 18px">' +
    '      <i class="ion-ios-checkmark" ng-if="selectedFlag"></i>' +
    '      <i class="ion-ios-circle-outline" ng-if="!selectedFlag"></i>' +
    '    </div>' +
    '    <div class="col col-80 no-padding" ng-if="showCheckedFlag">' +
    '      <div class="row no-padding"> ' +
    '        <div class="col col-33 no-padding color-type">{{type}}</div>' +
    '        <div class="col col-67 no-padding color-content">{{typeValue}}</div>' +
    '      </div>' +
    '      <div class="row no-padding">' +
    '        <div class="col col-33 no-padding color-type">{{node}}</div>' +
    '        <div class="col col-67 no-padding color-content">{{nodeValue}}</div>' +
    '      </div>' +
    '      <div class="row no-padding">' +
    '        <div class="col col-33 no-padding color-type">{{submit}}</div>' +
    '        <div class="col col-67 no-padding color-content">{{submitPerson}}</div>' +
    '      </div>' +
    '      <div class="row no-padding" ng-if="showExtraFlag"> ' +
    '        <div class="col col-33 no-padding color-type">{{key1}}</div>' +
    '        <div class="col col-67 no-padding color-content">{{value1}}</div>' +
    '      </div>' +
    '      <div class="row no-padding" ng-if="showExtraFlag">' +
    '        <div class="col col-33 no-padding color-type">{{key2}}</div>' +
    '        <div class="col col-67 no-padding color-content">{{value2}}</div>' +
    '      </div>' +
    '      <div class="row no-padding" ng-if="showExtraFlag">' +
    '        <div class="col col-33 no-padding color-type">{{key3}}</div>' +
    '        <div class="col col-67 no-padding color-content">{{value3}}</div>' +
    '      </div>' +
    '    </div>' +
    '    <div class="col col-90 no-padding" ng-if="!showCheckedFlag">' +
    '      <div class="row no-padding"> ' +
    '        <div class="col col-33 no-padding color-type">{{type}}</div>' +
    '        <div class="col col-67 no-padding color-content">{{typeValue}}</div>' +
    '      </div>' +
    '      <div class="row no-padding">' +
    '        <div class="col col-33 no-padding color-type">{{node}}</div>' +
    '        <div class="col col-67 no-padding color-content">{{nodeValue}}</div>' +
    '      </div>' +
    '      <div class="row no-padding">' +
    '        <div class="col col-33 no-padding color-type">{{submit}}</div>' +
    '        <div class="col col-67 no-padding color-content">{{submitPerson}}</div>' +
    '      </div>' +
    '      <div class="row no-padding" ng-if="showExtraFlag"> ' +
    '        <div class="col col-33 no-padding color-type">{{key1}}</div>' +
    '        <div class="col col-67 no-padding color-content">{{value1}}</div>' +
    '      </div>' +
    '      <div class="row no-padding" ng-if="showExtraFlag">' +
    '        <div class="col col-33 no-padding color-type">{{key2}}</div>' +
    '        <div class="col col-67 no-padding color-content">{{value2}}</div>' +
    '      </div>' +
    '      <div class="row no-padding" ng-if="showExtraFlag">' +
    '        <div class="col col-33 no-padding color-type">{{key3}}</div>' +
    '        <div class="col col-67 no-padding color-content">{{value3}}</div>' +
    '      </div>' +
    '    </div>' +
    '    <div class="col col-10 no-padding col-center workflow-list-select">' +
    '      <img src="build/img/workflow/select@3x.png"/>' +
    '    </div>' +
    '  </div>' +
    '</div></a>',
    controller: ["$scope", function ($scope) {
    }],
    link: function (scope, element, attrs) {

    }
  }
});
