/**
 * Created by wolf on 2016/5/23.
 */
"use strict";

/**
 * @1:暴露三个method--
 * a:selectAllItem();b:passThrough();refuse();
 */
HmsModule.directive("footerSelect", function () {
  return {
    restrict: "E",        // 指令是一个元素(并非属性)
    scope: {              // 设置指令对于的scope
      //name: "@",        // name 值传递(字符串，单向绑定)
      //amount: "=",      // amount 引用传递(双向绑定)
      selectAllItem: "&", // 全选操作--应用表达式
      passThrough: "&",   // 通过操作--应用表达式
      refuse: "&"         // 拒绝操作--应用表达式
    },
    template: '<ion-footer-bar class="footBar">' +
    '<div class="row buttons">' +
    '<button class="button button-clear ts-buttonLeft" ng-click="selectAllItem()">全选</button>' +
    '<button class="button button-clear ts-buttonCenter" ng-click="passThrough()">通过</button>' +
    '<button class="button button-clear ts-buttonRight" ng-click="refuse()">拒绝</button>' +
    '</div>' +
    '</ion-footer-bar>',
    replace: true, //使用模板替换原始标记
    transclude: false,    // 不复制原始HTML内容
    controller: ["$scope", function ($scope) {
    }],
    link: function (scope, element, attrs, controller) {
    }
  }
});
