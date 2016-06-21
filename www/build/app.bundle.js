angular.module("baseConfig", [])
.constant("baseConfig", {"debug":true,"isMobilePlatform":false,"clearTable":true,"nativeScreenFlag":false,"basePath":"http://wechat.hand-china.com/hmbms_hand/api","businessPath":"http://wechat.hand-china.com/hmbms_hand/api/dataEngine","currentVersion":"2.0.0","url":"","pkgIdentifier":"","versionName":"此版本为dev测试环境 2.0.0","appEnvironment":"UAT","dbName":"my_hrms.db","appRootFile":"helloCordova","appRootPath":""});

/**
 * Created by gusenlin on 16/5/22.
 */
var utilModule = angular.module('utilModule',[]);
var HmsModule = angular.module('HmsModule',[]);//汉得公用模块库
var loginModule = angular.module('loginModule', []);
var messageModule = angular.module('messageModule', []);
var contactModule = angular.module('contactModule', []);
var applicationModule = angular.module('applicationModule', []);
var myInfoModule = angular.module('myInfoModule', []);
var tsApproveModule = angular.module('tsApproveModule', []);

/**
 * @ngdoc directive
 * @name hideTabs
 * @module utilModule
 * @description
 * This is the http interceptor
 * @author
 * gusenlin
 */
HmsModule.directive('hideTabs', function($rootScope) {
  return {
    restrict: 'A',
    link: function(scope, element, attributes) {
      scope.$on('$ionicView.beforeEnter', function() {
        scope.$watch(attributes.hideTabs, function(value){
          console.log('$ionicView.beforeEnter value ' + value );
          if(value){
            $rootScope.hideTabs = false;
          }
          else{
            $rootScope.hideTabs = true;
          }
        });
      });

      scope.$on('$ionicView.beforeLeave', function() {
        $rootScope.hideTabs = true;
        console.log('$ionicView.beforeLeave value ');
      });
    }
  };
})
.directive('elasticImage', function($ionicScrollDelegate) {
  return {
    restrict: 'A',
    link: function($scope, $scroller, $attr) {
      var image = document.getElementById($attr.elasticImage);
      var imageHeight = image.offsetHeight;
      $scroller.bind('scroll', function(e) {
        var scrollTop = e.detail.scrollTop;

        var newImageHeight = imageHeight - scrollTop;
        if (newImageHeight < 0) {
          newImageHeight = 0;
        }
        image.style.height = newImageHeight + 'px';
      });
    }
  }
}).directive('circleRotate', function($timeout) {
  return {
    restrict: 'A',
    link: function($scope, $scroller, $attr) {
      var params=$attr.circleRotate;
      var domsId=params.split(',');
      console.log(domsId);
      if(domsId[0]=="dorm-apply") {
        var leftball = document.getElementById(domsId[1]);
        var rightball = document.getElementById(domsId[2]);
        var calculation = $scope.leftDays / $scope.totalDays;
        if (calculation <= 0.5) {//剩余天数大于总天数的一半
          leftball.style.transition = "all 0.3s linear";
          leftball.style.webkitTransition = "all 0.3s linear";
          rightball.style.transition = "all 0.3s ease-out";//右半圆过渡动画0.3s，渐快，无延迟
          rightball.style.webkitTransition = "all 0.3s ease-out";
        } else if (calculation > 0.5) {//剩余天数不到入住天数的一半
          leftball.style.transition = "all 0.3s ease-out 0.3s";//左半圆过渡动画0.3s，渐缓，0.3s延迟
          leftball.style.webkitTransition = "all 0.3s ease-out 0.3s";
          rightball.style.transition = "all 0.3s ease-in";//右半圆过渡动画0.3s，渐快，无延迟
          rightball.style.webkitTransition = "all 0.3s ease-in";
        }
        leftball.style.webkitTransform = "rotate(-135deg)";
        leftball.style.transform = "rotate(-135deg)";
        rightball.style.webkitTransform = "rotate(-135deg)";
        rightball.style.transform = "rotate(-135deg)";
        $timeout(function () {//定时器中决定两个圆的终止角度
          var angle = 0;
          if (calculation <= 0.5) {
            angle = 360 * calculation;
            angle = angle - 135;
            //console.log("角度："+angle);
            leftball.style.webkitTransform = "rotate(-135deg)";
            leftball.style.transform = "rotate(-135deg)";
            rightball.style.webkitTransform = "rotate(" + angle + "deg)";
            rightball.style.transform = "rotate(" + angle + "deg)";
          } else if (calculation > 0.5) {
            calculation = calculation - 0.5;
            angle = 360 * calculation;
            angle = angle - 135;
            //console.log("角度："+angle);
            leftball.style.webkitTransform = "rotate(" + angle + "deg)";
            leftball.style.transform = "rotate(" + angle + "deg)";
            rightball.style.webkitTransform = "rotate(45deg)";
            rightball.style.transform = "rotate(45deg)";
          }
        }, 500);
      }else if(domsId[0]=="time-off-manage"){
        var leftball1 = document.getElementById(domsId[1]);
        var rightball1 = document.getElementById(domsId[2]);
        var leftball2 = document.getElementById(domsId[3]);
        var rightball2 = document.getElementById(domsId[4]);
        var leftball3 = document.getElementById(domsId[5]);
        var rightball3 = document.getElementById(domsId[6]);
        var calculation1 = $scope.paidHolidayLeftDays / $scope.paidHolidayTotalDays;
        var calculation2 = $scope.paidSickLeftDays / $scope.paidSickTotalDays;
        var calculation3 = $scope.extPaidHolidayLeftDays / $scope.extPaidHolidayTotalDays;
        if (calculation1 <= 0.5) {//剩余天数大于总天数的一半
          leftball1.style.transition = "all 0.3s linear";
          leftball1.style.webkitTransition = "all 0.3s linear";
          rightball1.style.transition = "all 0.3s ease-out";//右半圆过渡动画0.3s，渐快，无延迟
          rightball1.style.webkitTransition = "all 0.3s ease-out";
        } else if (calculation1 > 0.5) {//剩余天数不到入住天数的一半
          leftball1.style.transition = "all 0.3s ease-out 0.3s";//左半圆过渡动画0.3s，渐缓，0.3s延迟
          leftball1.style.webkitTransition = "all 0.3s ease-out 0.3s";
          rightball1.style.transition = "all 0.3s ease-in";//右半圆过渡动画0.3s，渐快，无延迟
          rightball1.style.webkitTransition = "all 0.3s ease-in";
        }
        if (calculation2 <= 0.5) {//剩余天数大于总天数的一半
          leftball2.style.transition = "all 0.3s linear";
          leftball2.style.webkitTransition = "all 0.3s linear";
          rightball2.style.transition = "all 0.3s ease-out";//右半圆过渡动画0.3s，渐快，无延迟
          rightball2.style.webkitTransition = "all 0.3s ease-out";
        } else if (calculation2 > 0.5) {//剩余天数不到入住天数的一半
          leftball2.style.transition = "all 0.3s ease-out 0.3s";//左半圆过渡动画0.3s，渐缓，0.3s延迟
          leftball2.style.webkitTransition = "all 0.3s ease-out 0.3s";
          rightball2.style.transition = "all 0.3s ease-in";//右半圆过渡动画0.3s，渐快，无延迟
          rightball2.style.webkitTransition = "all 0.3s ease-in";
        }
        if (calculation3 <= 0.5) {//剩余天数大于总天数的一半
          leftball3.style.transition = "all 0.3s linear";
          leftball3.style.webkitTransition = "all 0.3s linear";
          rightball3.style.transition = "all 0.3s ease-out";//右半圆过渡动画0.3s，渐快，无延迟
          rightball3.style.webkitTransition = "all 0.3s ease-out";
        } else if (calculation3 > 0.5) {//剩余天数不到入住天数的一半
          leftball3.style.transition = "all 0.3s ease-out 0.3s";//左半圆过渡动画0.3s，渐缓，0.3s延迟
          leftball3.style.webkitTransition = "all 0.3s ease-out 0.3s";
          rightball3.style.transition = "all 0.3s ease-in";//右半圆过渡动画0.3s，渐快，无延迟
          rightball3.style.webkitTransition = "all 0.3s ease-in";
        }
        leftball1.style.webkitTransform = "rotate(-135deg)";
        leftball1.style.transform = "rotate(-135deg)";
        rightball1.style.webkitTransform = "rotate(-135deg)";
        rightball1.style.transform = "rotate(-135deg)";
        leftball2.style.webkitTransform = "rotate(-135deg)";
        leftball2.style.transform = "rotate(-135deg)";
        rightball2.style.webkitTransform = "rotate(-135deg)";
        rightball2.style.transform = "rotate(-135deg)";
        leftball3.style.webkitTransform = "rotate(-135deg)";
        leftball3.style.transform = "rotate(-135deg)";
        rightball3.style.webkitTransform = "rotate(-135deg)";
        rightball3.style.transform = "rotate(-135deg)";
        $timeout(function () {//定时器中决定两个圆的终止角度
          var angle1 = 0;
          var angle2 = 0;
          var angle3 = 0;
          if (calculation1 <= 0.5) {
            angle1 = 360 * calculation1;
            angle1 = angle1 - 135;
            //console.log("角度："+angle);
            leftball1.style.webkitTransform = "rotate(-135deg)";
            leftball1.style.transform = "rotate(-135deg)";
            rightball1.style.webkitTransform = "rotate(" + angle1 + "deg)";
            rightball1.style.transform = "rotate(" + angle1 + "deg)";
          } else if (calculation1 > 0.5) {
            calculation1 = calculation1 - 0.5;
            angle1 = 360 * calculation1;
            angle1 = angle1 - 135;
            //console.log("角度："+angle);
            leftball1.style.webkitTransform = "rotate(" + angle1 + "deg)";
            leftball1.style.transform = "rotate(" + angle1 + "deg)";
            rightball1.style.webkitTransform = "rotate(45deg)";
            rightball1.style.transform = "rotate(45deg)";
          }
          if (calculation2 <= 0.5) {
            angle2 = 360 * calculation2;
            angle2 = angle2 - 135;
            //console.log("角度："+angle);
            leftball2.style.webkitTransform = "rotate(-135deg)";
            leftball2.style.transform = "rotate(-135deg)";
            rightball2.style.webkitTransform = "rotate(" + angle2 + "deg)";
            rightball2.style.transform = "rotate(" + angle2 + "deg)";
          } else if (calculation2 > 0.5) {
            calculation2 = calculation2 - 0.5;
            angle2 = 360 * calculation2;
            angle2 = angle2 - 135;
            //console.log("角度："+angle);
            leftball2.style.webkitTransform = "rotate(" + angle2 + "deg)";
            leftball2.style.transform = "rotate(" + angle2 + "deg)";
            rightball2.style.webkitTransform = "rotate(45deg)";
            rightball2.style.transform = "rotate(45deg)";
          }
          if (calculation3 <= 0.5) {
            angle3 = 360 * calculation3;
            angle3 = angle3 - 135;
            //console.log("角度："+angle);
            leftball3.style.webkitTransform = "rotate(-135deg)";
            leftball3.style.transform = "rotate(-135deg)";
            rightball3.style.webkitTransform = "rotate(" + angle3 + "deg)";
            rightball3.style.transform = "rotate(" + angle3 + "deg)";
          } else if (calculation3 > 0.5) {
            calculation3 = calculation3 - 0.5;
            angle3 = 360 * calculation3;
            angle3 = angle3 - 135;
            //console.log("角度："+angle);
            leftball3.style.webkitTransform = "rotate(" + angle3 + "deg)";
            leftball3.style.transform = "rotate(" + angle3 + "deg)";
            rightball3.style.webkitTransform = "rotate(45deg)";
            rightball3.style.transform = "rotate(45deg)";
          }
        }, 500);
      }
    }
  }
});
/**
 * @description:loading tag
 *
 */
HmsModule.directive('hmsLoading', function($rootScope) {
  return {
    restrict: 'E',
    template: '<div class="hms-hide-content">'+
    '<div class="content">数据加载中...</div>'+
    '<div class="hide-icon">'+
    '<ion-spinner icon="ios" class="spinner spinner-ios"></ion-spinner>'+
    '</div>'+
    '</div>',
    replace: true, //使用模板替换原始标记
    transclude: false,    // 不复制原始HTML内容
    controller: ["$scope", function ($scope) {
    }],
    link: function (scope, element, attrs, controller) {
    }
  };
});


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
      selectAllItem: "&", // 全选操作--应用表达式
      passThrough: "&",   // 通过操作--应用表达式
      refuse: "&"         // 拒绝操作--应用表达式
    },
    template: '<ion-footer-bar class="foot-bar">' +
    '<div class="row buttons">' +
    '<button class="button button-clear ts-button-left" ng-click="selectAllItem()">全选</button>' +
    '<button class="button button-clear ts-button-center" ng-click="passThrough()">通过</button>' +
    '<button class="button button-clear ts-button-right" ng-click="refuse()">拒绝</button>' +
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

/**
 * 自定义head头
 */
HmsModule.directive("customHeadBar", function () {
  return {
    restrict: "E",        // 指令是一个元素(并非属性)
    scope: {              // 设置指令对于的scope
      actionName: "@",    // actionName 值传递(字符串，单向绑定)
      //test:"=",         // 引用传递--双向绑定
      customTitle: "@",   //
      goBackPage: "&", // 返回
      doAction: "&"   //
    },
    template: '<div class="custom-head custom-head-background">' +
    '<div class="row custom-first-head">' +
    '<button class="button button-clear back-button" ng-click="goBackPage()">' +
    '<i class="ion-ios-arrow-back"></i>' +
    '<span class="back-text">返回</span>' +
    '</button>' +
    '<button class="button button-clear action-button" ng-click="doAction()" ng-bind="actionName">' +
    '</button>' +
    '</div>' +
    '<div class="ts-list-title" ng-bind="customTitle"></div>' +
    '<div class="custom-second-head" ng-transclude>' +
    '</div>' +
    '</div>',
    replace: true, //使用模板替换原始标记
    transclude: true,    // 不复制原始HTML内容
    controller: ["$scope", function ($scope) {
    }],
    link: function (scope, element, attrs, controller) {
    }
  }
});

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
      title: '=workflowTitle',
      icon: '=workflowIcon',
      type: '=workflowType',
      typeValue: '=workflowTypeValue',
      node: '=workflowNode',
      nodeValue: '=workflowNodeValue',
      submit: '=workflowSubmit',
      submitPerson: '=workflowSubmitPerson'
    },
    /*template : '<div>'
     + '<div class="title" ng-click="toggle()">{{title}}</div>'
     + '<div class="body" ng-show="showMe" ng-transclude></div>'
     + '</div>', */

    template: '<a class="workflow-list">' +
    '<div class="workflow-list-logo"><img src="{{icon}}"/>' +
    '</div><div class="workflow-list-header">{{title}}</div>' +
    '<div class="workflow-list-content">' +
    '<div class="row no-padding">' +
    '<div class="col col-90 no-padding">' +
    '<div class="row no-padding"> ' +
    '<div class="col col-33 no-padding color-type">{{type}}</div>' +
    '<div class="col col-67 no-padding color-content">{{typeValue}}</div>' +
    '</div>' +
    '<div class="row no-padding">' +
    '<div class="col col-33 no-padding color-type">{{node}}</div>' +
    '<div class="col col-67 no-padding color-content">{{nodeValue}}</div>' +
    '</div>' +
    '<div class="row no-padding">' +
    '<div class="col col-33 no-padding color-type">{{submit}}</div>' +
    '<div class="col col-67 no-padding color-content">{{submitPerson}}</div>' +
    '</div>' +
    '</div>' +
    '<div class="col col-10 no-padding col-center workflow-list-select">' +
    '<img src="build/img/workflow/select@3x.png"/>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</a>',
    controller: ["$scope", function ($scope) {
    }],
    link: function (scope, element, attrs) {

    }
  }
});

/**
 * Created by gusenlin on 16/5/22.
 */

/**
 * @ngdoc directive
 * @name hmsslidecalendar
 * @module ionic
 * @codepen AjgEB
 * @deprecated will be removed in the next Ionic release in favor of the new ion-slides component.
 * Don't depend on the internal behavior of this widget.
 * @delegate ionic.service:$ionicSlideBoxDelegate
 * @restrict E
 * @description
 * The Slide Box is a multi-page container where each page can be swiped or dragged between:
 *
 *
 * @usage
 * ```html
 * <ion-slide-box on-slide-changed="slideHasChanged($index)">
 * </ion-slide-box>
 * ```
 *
 * @param {string=} delegate-handle The handle used to identify this slideBox
 * with {@link ionic.service:$ionicSlideBoxDelegate}.
 * @param {boolean=} does-continue Whether the slide box should loop.
 * @param {boolean=} auto-play Whether the slide box should automatically slide. Default true if does-continue is true.
 * @param {number=} slide-interval How many milliseconds to wait to change slides (if does-continue is true). Defaults to 4000.
 * @param {boolean=} show-pager Whether a pager should be shown for this slide box. Accepts expressions via `show-pager="{{shouldShow()}}"`. Defaults to true.
 * @param {expression=} pager-click Expression to call when a pager is clicked (if show-pager is true). Is passed the 'index' variable.
 * @param {expression=} on-slide-changed Expression called whenever the slide is changed.  Is passed an '$index' variable.
 * @param {expression=} active-slide Model to bind the current slide index to.
 */
angular.module('HmsModule')
  .directive('hmsslidecalendar', [
    '$animate',
    '$timeout',
    '$compile',
    '$ionicHistory',
    '$ionicScrollDelegate',
    function($animate, $timeout, $compile, $ionicHistory, $ionicScrollDelegate) {
      return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
          autoPlay: '=',
          doesContinue: '@',
          slideInterval: '@',
          showPager: '@',
          pagerClick: '&',
          disableScroll: '@',
          onSlideChanged: '&',
          activeSlide: '=?',
          bounce: '@'
        },
        controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {

          console.log("$element[0] " + angular.toJson($element[0]));

          var _this = this;

          function isDefined(value) {return typeof value !== 'undefined';}

          var continuous = $scope.$eval($scope.doesContinue) === true;
          var bouncing = ($scope.$eval($scope.bounce) !== false); //Default to true
          var shouldAutoPlay = isDefined($attrs.autoPlay) ? !!$scope.autoPlay : false;
          var slideInterval = shouldAutoPlay ? $scope.$eval($scope.slideInterval) || 4000 : 0;

          console.log("continuous " + continuous);
          console.log("bouncing " + bouncing);
          console.log("shouldAutoPlay " + shouldAutoPlay);
          console.log("slideInterval " + slideInterval);

          var slider = new ionic.views.calendar({
            el: $element[0],
            auto: slideInterval,
            continuous: continuous,
            startSlide: $scope.activeSlide,
            bouncing: bouncing,
            slidesChanged: function() {
              $scope.currentSlide = slider.currentIndex();

              // Try to trigger a digest
              $timeout(function() {});
            },
            callback: function(slideIndex) {
              $scope.currentSlide = slideIndex;
              $scope.onSlideChanged({ index: $scope.currentSlide, $index: $scope.currentSlide});
              $scope.$parent.$broadcast('slideBox.slideChanged', slideIndex);
              $scope.activeSlide = slideIndex;
              // Try to trigger a digest
              $timeout(function() {});
            },
            onDrag: function() {
              console.log("slider.onDrag ");
              freezeAllScrolls(true);
            },
            onDragEnd: function() {
              console.log("slider.onDragEnd ");
              freezeAllScrolls(false);
            }
          });

          /*function freezeAllScrolls(shouldFreeze) {
            if (shouldFreeze && !_this.isScrollFreeze) {
              $ionicScrollDelegate.freezeAllScrolls(shouldFreeze);

            } else if (!shouldFreeze && _this.isScrollFreeze) {
              $ionicScrollDelegate.freezeAllScrolls(false);
            }
            _this.isScrollFreeze = shouldFreeze;
          }*/

          //slider.enableSlide($scope.$eval($attrs.disableScroll) !== true);

          $scope.$watch('activeSlide', function(nv) {
            console.log("slider.scope.activeSlide ");
            if (isDefined(nv)) {
              slider.slide(nv);
            }
          });

          $scope.$on('slideBox.nextSlide', function() {
            console.log("slider.slideBox.nextSlide ");
            slider.next();
          });

          $scope.$on('slideBox.prevSlide', function() {
            console.log("slider.slideBox.prevSlide ");
            slider.prev();
          });

          $scope.$on('slideBox.setSlide', function(e, index) {
            console.log("slider.slideBox.setSlide ");
            slider.slide(index);
          });

          //Exposed for testing
          this.__slider = slider;

          /*var deregisterInstance = $ionicSlideBoxDelegate._registerInstance(
            slider, $attrs.delegateHandle, function() {
              return $ionicHistory.isActiveScope($scope);
            }
          );*/

          $scope.$on('$destroy', function() {
            console.log("$destroy ");
            //deregisterInstance();
            //slider.kill();
          });

          /*this.slidesCount = function() {
            return slider.slidesCount();
          };

          this.onPagerClick = function(index) {
            $scope.pagerClick({index: index});
          };*/

          $timeout(function() {
            //slider.load();
          });
        }],
        template: '<div class="slider">' +
        '<div class="slider-slides" ng-transclude>' +
        '</div>' +
        '</div>',

        link: function($scope, $element, $attr) {
          // Disable ngAnimate for slidebox and its children
          $animate.enabled($element, false);

          function isDefined(value) {return typeof value !== 'undefined';}

          // if showPager is undefined, show the pager
          /*if (!isDefined($attr.showPager)) {
            $scope.showPager = true;
            getPager().toggleClass('hide', !true);
          }

          $attr.$observe('showPager', function(show) {
            if (show === undefined) return;
            show = $scope.$eval(show);
            getPager().toggleClass('hide', !show);
          });

          var pager;
          function getPager() {
            if (!pager) {
              var childScope = $scope.$new();
              pager = jqLite('<ion-pager></ion-pager>');
              $element.append(pager);
              pager = $compile(pager)(childScope);
            }
            return pager;
          }*/
        }
      };
    }]);

  /*.directive('ionSlide', function() {
    return {
      restrict: 'E',
      require: '?^ionSlideBox',
      compile: function(element) {
        element.addClass('slider-slide');
      }
    };
  })*/

/**
 * @ngdoc interceptor
 * @name httpRequestHeader
 * @module utilModule
 * @description
 * This is the http interceptor
 * @author
 * gusenlin
 */
angular.module('utilModule').factory('httpRequestHeader', function () {
  var interceptor = {
    'request': function (config) {
      if (window.localStorage.token && window.localStorage.empno) {
        var timestamp = new Date().getTime();
        var token = CryptoJS.MD5(window.localStorage.token + timestamp);
        config.headers.timestamp = timestamp;
        config.headers.token     = token;
        config.headers.loginName = window.localStorage.empno;
      }
      return config;
    }
  };

  return interceptor;
});

/**
 * Created by wolf on 2016/6/13. (_wen.dai_)
 */
"use strict";
//根据日期获取星期
HmsModule.filter('weekDay', function () {
  return function (data) {
    if (data == "") {
      return data;
    } else {
      var d = new Date(data);
      var day = d.getDay();
      switch (day) {
        case  0:
          data = data + "　" + "星期天";
          break;
        case  1:
          data = data + "　" + "星期一";
          break;
        case  2:
          data = data + "　" + "星期二";
          break;
        case  3:
          data = data + "　" + "星期三";
          break;
        case  4:
          data = data + "　" + "星期四";
          break;
        case  5:
          data = data + "　" + "星期五";
          break;
        case  6:
          data = data + "　" + "星期六";
          break;
      }
      return data;
    }
  }
});

/**
 * Created by wolf on 2016/6/12.
 * @author:wen.dai@hand-china.com
 */

'use strict';

/**
 * 打印--console--level
 */
var log = console.log.bind(console);
var warn = console.warn.bind(console);
var error = console.error.bind(console);

//格式化json
function jsonFormat(newParam) {
  var Json = angular.toJson(newParam, true);
  return Json;
};

//获取当前的年月日 日期
function getCurrentDate(now) {
  //eg:获取当前日期 xxxxxxxx(format)
  var year = now.getFullYear();       //年
  var month = now.getMonth() + 1;     //月
  var day = now.getDate();            //日
  month = (month < 10 ? "0" + month : month);
  day = (day < 10 ? "0" + day : day);
  var myCurrentDate = (year.toString() + month.toString() + day.toString());
  return myCurrentDate;
};

//获取上个月的月末
function getLastMonthDate(now) {
  //eg:获取当前日期 xxxxxxxx(format)
  var year = now.getFullYear();       //年
  var month = now.getMonth();     //月
  var newDate = new Date(year, month, 1);
  var day = new Date(newDate.getTime() - 1000 * 60 * 60 * 24).getDate(); //日
  month = (month < 10 ? "0" + month : month);
  day = (day < 10 ? "0" + day : day);
  var myLastMonthDate = (year.toString() + month.toString() + day.toString());
  return myLastMonthDate;
};

//获取当前月的月末
function getCurrentMonthLastDate(now) {
  //eg:获取当前日期 xxxxxxxx(format)
  var year = now.getFullYear();       //年
  var month = now.getMonth() + 1;     //月
  var newDate = new Date(year, month, 1);
  var day = new Date(newDate.getTime() - 1000 * 60 * 60 * 24).getDate(); //日
  month = (month < 10 ? "0" + month : month);
  day = (day < 10 ? "0" + day : day);
  var myCurrentMonthLastDate = (year.toString() + month.toString() + day.toString());
  return myCurrentMonthLastDate;
};

//获取月和日
function getMonthDay(newDate) {
  var newMonthDay = newDate.substring(4,6) + "月" + newDate.substring(6,8) + "日";
  return newMonthDay;
};

/**
 ​ *  下面是去重的3个写法
 ​ *  @1：最常规
 ​ *  @2：思路好，但是性能差点
 ​ *  @3：更好的
 ​ */

//@1:
function unique_normal(arr) {
  var ret = [];
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    if (ret.indexOf(item) === -1) {
      ret.push(item);
    }
  }
  return ret;
};

//@2:
var indexOf = [].indexOf ?
  function (arr, item) {
    return arr.indexOf(item);
  } :
  function indexOf(arr, item) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === item) {
        return i;
      }
    }
    return -1;
  };

function unique(arr) {
  var ret = [];
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    if (indexOf(ret, item) === -1) {
      ret.push(item);
    }
  }
  return ret;
};

//@3: 支持数组子条目为对象的去重
function unique_better(arr, newitem) {
  var ret = [];
  var hash = {};
  for (var i = 0; i < arr.length; i++) {
    if (typeof(arr[i]) == 'object') {
      var item = arr[i][newitem];
    } else {
      var item = arr[i];
    }
    var item1 = arr[i]
    var key = typeof(item) + item;
    if (hash[key] !== 1) {
      ret.push(item1);
      hash[key] = 1;
    }
  }
  return ret;
};

/**
 * Created by gusenlin on 16/5/21.
 */ 
angular.module('HmsModule')
  .factory('hmsHttp', ['$log', '$http', 'hmsPopup', function ($log, $http, hmsPopup) {
    var serivieName = "HmsHttp";
    var isSucessfullName = "isSucessfull";
    var noAuthorPostName = serivieName + ".noAuthorPost";
    var noAuthorGetName = serivieName + ".noAuthorGet";
    var postName = serivieName + ".post";
    var getName = serivieName + ".get";
    var procedure;

    var init = function (procedure) {
      procedure = procedure;
    };
    var debug = function (text) {
      $log.debug(procedure + " success");
    };

    //如果登录令牌失效，跳转会登录界面
    var goBackLogin = function (state) {
      Prompter.hideLoading();
      state.go('login');
    };

    var request = {
      goBackLogin: function (state) {
        goBackLogin(state);
      },
      isSuccessfull: function (status) {
        $log.debug(isSucessfullName + " Start!");
        $log.debug(noAuthorPostName + " status " + status);
        if (status == "S" || status == "SW") {
          return true;
        } else {
          return false;
        }
      },
      post: function (url, paramter) {
        $log.debug(postName + " Start!");
        $log.debug(postName + " url " + url);
        $log.debug(postName + " paramter " + angular.toJson(paramter));
        var post = $http.post(url, paramter).success(function (response) {
          $log.debug(postName + " success");
          //$log.debug(postName + " response " + angular.toJson(response));
          $log.debug(postName + " End!");
        }).error(function (response, status) {
          $log.debug(postName + " error");
          $log.debug(postName + " response " + response);
          $log.debug(postName + " status " + status);
          $log.debug(postName + " End!");
        });
        return post;
      },
      get: function (url) {
        $log.debug(getName + " Start!");
        $log.debug(getName + " url " + url);
        var get = $http.get(url).success(function (response) {
          $log.debug(getName + " success");
          $log.debug(getName + " response " + angular.toJson(response));
          $log.debug(getName + " End!");
        }).error(function (response, status) {
          $log.debug(getName + " error");
          $log.debug(getName + " response " + response);
          $log.debug(getName + " status " + status);
          $log.debug(getName + " End!");
        });
        return get;
      }
    };
    return request;
  }])

  .service('hmsPopup', ['$ionicLoading', '$cordovaToast', '$ionicPopup', 'baseConfig',
    function ($ionicLoading, $cordovaToast, $ionicPopup, baseConfig) {
      this.showLoading = function (content) {
        $ionicLoading.show({
          template: '<ion-spinner icon="ios" class="spinner spinner-ios spinner-stable"></ion-spinner>' +
          '<div style="color: white;font-size: 12px;text-align: center;height:25px;line-height: 25px;">' + content + '</div>'
        });
      };
      this.hideLoading = function () {
        $ionicLoading.hide();
      };
      this.showShortCenterToast = function (content) {
        if (!baseConfig.nativeScreenFlag) {
          $ionicLoading.show({
            template: (angular.isDefined(content) ? content : "操作失败"),
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            duration: 2000
          });
        } else {
          $cordovaToast.showLongBottom((angular.isDefined(content) ? content : "操作失败")).then(function (success) {
          }, function (error) {
          });
        }
      };
      //弹出确认弹出框
      this.showPopup = function (template, title) {
        if (!baseConfig.nativeScreenFlag) {
          $ionicPopup.show({
            title: "提示",
            template: template,
            buttons: [{
              text: '确定',
              type: 'button button-cux-popup-confirm'
            }]
          });
        } else {
          var alertDismissed = function () {
          };
          navigator.notification.alert(
            template, // message
            alertDismissed, // callback
            "提示", // title
            '确定' // buttonName
          );
        }
      };
      //弹出是否确认的窗口
      this.prompt = function (myscope, title, popup, pluginPopup) {
        if (!baseConfig.nativeScreenFlag) {
          var myPopup = $ionicPopup.show({
            template: '<input type="type" ng-model="myScope.data.city">',
            title: title,
            subTitle: title,
            scope: myscope,
            buttons: [
              {text: '取消'},
              {
                text: '<b>确定</b>',
                type: 'button-positive',
                onTap: function (e) {
                  if (!myscope.myScope.data.city) {
                    e.preventDefault();
                  } else {
                    return myscope.myScope.data.city;
                  }
                }
              },
            ]
          });
          myPopup.then(popup);

        } else {
          navigator.notification.prompt(
            title,  // message
            pluginPopup,          // callback to invoke
            '填写信息',           // title
            ['确定', '退出'],    // buttonLabels
            ''                 // defaultText
          );
        }
      }
      ;
      /*function onPrompt(results) {
       alert("You selected button number " + results.buttonIndex + " and entered " + results.input1);
       }
       navigator.notification.prompt(
       'Please enter your name',  // message
       onPrompt,                  // callback to invoke
       'Registration',            // title
       ['Ok','Exit'],             // buttonLabels
       'Jane Doe'                 // defaultText
       );
       */
      this.confirm = function (message, title, onConfirm) {
        if (!baseConfig.nativeScreenFlag) {
          var confirmPopup = $ionicPopup.confirm({
            title: (angular.isDefined(title) ? title : "提示"),
            template: message,
            cancelText: '取消',
            cancelType: 'button-cux-popup-cancel',
            okText: '确定',
            okType: 'button-cux-popup-confirm'
          });
          confirmPopup.then(onConfirm);
        } else {
          navigator.notification.confirm(
            message, // message
            onConfirm, // callback to invoke with index of button pressed
            title, // title
            ['确定', '取消'] // buttonLabels
          );
        }
      };
    }
  ])

  .factory('hmsReturnView', ['$ionicHistory', 'baseConfig', function ($ionicHistory, baseConfig) {
    //当前屏幕宽度
    var screenWidth = window.screen.width - 50;
    //滑动栏的宽度
    var scrollWidth = {
      width: ''
    };
    //当前内容的宽度
    var contentWidth = 0;
    //当前标题的宽度
    var viewLength;

    return {
      go: function (depth) {
        // get the right history stack based on the current view
        var historyId = $ionicHistory.currentHistoryId();
        var history = $ionicHistory.viewHistory().histories[historyId];
        // set the view 'depth' back in the stack as the back view
        var targetViewIndex = history.stack.length - 1 - depth;
        $ionicHistory.backView(history.stack[targetViewIndex]);
        // navigate to it
        $ionicHistory.goBack();
      },
      returnToState: function (stateName) {
        var historyId = $ionicHistory.currentHistoryId();
        var history = $ionicHistory.viewHistory().histories[historyId];
        if (baseConfig.debug) {
          console.log('history.stack.length : ' + history.stack.length);
        }
        for (var i = history.stack.length - 1; i >= 0; i--) {
          if (baseConfig.debug) {
            console.log('history.stack[i].stateName : ' + history.stack[i].stateName);
          }
          if (history.stack[i].stateName == stateName) {
            $ionicHistory.backView(history.stack[i]);
            $ionicHistory.goBack();
          }
        }
      },
      getStackList: function (currentIonicHistory, viewName) {
        var stackList = [];
        var historyId = currentIonicHistory.currentHistoryId();
        var history = currentIonicHistory.viewHistory().histories[historyId];
        if (baseConfig.debug) {
          console.log(currentIonicHistory.viewHistory());
        }
        var color = '#F99D32';
        for (var i = 0; i < history.stack.length; i++) {
          if (i == history.stack.length - 1) {
            color = 'black';
          }
          var stackItem = {
            viewId: history.stack[i].viewId,
            stateName: history.stack[i].stateName,
            title: history.stack[i].title,
            color: {
              color: color
            }
          };
          if (baseConfig.debug) {
            console.log(history.stack[i]);
          }
          stackList.push(stackItem);
        }
        stackList[stackList.length - 1].title = viewName;
        return stackList;
      },
      getWidth: function () {
        return scrollWidth;
      }
    };
  }])

  .factory('hmsBackLine', ['$ionicHistory', 'baseConfig', function ($ionicHistory) {
    //当前屏幕宽度
    var screenWidth = window.screen.width - 50;
    //滑动栏的宽度
    var scrollWidth = {
      width: ''
    };
    //当前内容的宽度
    var contentWidth = 0;
    //当前标题的宽度
    var viewLength;
    var backViews = [];
    return {
      getViews: function (viewName) {
        viewLength = viewName.toString().length;
        if (ROOTCONFIG.debug) {
          console.log(viewLength);
        }
        //				alert(viewName)
        for (var i = 0; i < backViews.length; i++) {
          if (viewName == backViews[i].name) {
            //						if(i==0){
            //							i=i+1;
            //						}
            backViews = backViews.slice(0, i + 1);
            //						alert(backViews.length)
            contentWidth = 0;
            for (var j = 0; j < backViews.length; j++) {
              if (j == backViews.length - 1) {
                contentWidth = contentWidth + backViews[j].name.toString().length * 14 + 8;
              } else {
                contentWidth = contentWidth + backViews[j].name.toString().length * 14 + 18 + 8;
              }
            }
            console.log(contentWidth);
            if (contentWidth < screenWidth) {
              scrollWidth.width = '';
            } else {
              scrollWidth.width = contentWidth + 'px';
            }
            for (var k = 0; k < backViews.length - 1; k++) {
              backViews[k].myStyle.color = '#F99D32';
            }
            console.log(backViews);
            backViews[backViews.length - 1].myStyle.color = 'black';
            return backViews;
          }
        }

        var view = {
          name: viewName,
          myStyle: {
            color: ''
          }
        };
        backViews.push(view);
        contentWidth = 0;
        for (var ii = 0; i < backViews.length; ii++) {
          if (ii == backViews.length - 1) {
            contentWidth = contentWidth + backViews[ii].name.toString().length * 14 + 8;
          } else {
            contentWidth = contentWidth + backViews[ii].name.toString().length * 14 + 18 + 8;
          }
        }
        if (contentWidth > screenWidth) {
          scrollWidth.width = contentWidth + 'px';
        }
        for (var iii = 0; iii < backViews.length - 1; i++) {
          backViews[iii].myStyle.color = '#F99D32';
        }
        return backViews;
      },
      getWidth: function () {
        return scrollWidth;
      }
    };
  }])

  .factory('$hmsHelp', [
    '$ionicTemplateLoader',
    '$ionicBackdrop',
    '$q',
    '$timeout',
    '$rootScope',
    '$ionicBody',
    '$compile',
    '$ionicPlatform',
    '$ionicModal',
    'IONIC_BACK_PRIORITY',
    function ($ionicTemplateLoader,
              $ionicBackdrop,
              $q,
              $timeout,
              $rootScope,
              $ionicBody,
              $compile,
              $ionicPlatform,
              $ionicModal,
              IONIC_BACK_PRIORITY) {
      //TODO allow this to be configured
      var config = {
        stackPushDelay: 75
      };
      var HELP_TPL;
      if (ionic.Platform.isIOS()) {
        HELP_TPL = '<div style="position: absolute;top:2px;left: -4px;bottom: 0;right: 0;' +
          'background: url(img/mainHide.png); background-size: cover;;z-index: 12;">' +
          '<div style="height: 100%;width: 100%;background: none" ng-click="$buttonTapped()"></div></div>';
      } else {
        HELP_TPL = '<div style="position: absolute;top: -14px;left: -4px;bottom: 0;right: 0;' +
          'background: url(img/mainHide.png); background-size: cover;;z-index: 12;">' +
          '<div style="height: 100%;width: 100%;background: none" ng-click="$buttonTapped()"></div></div>';
      }
      var popupStack = [];

      function setHashKey(obj, h) {
        if (h) {
          obj.$$hashKey = h;
        } else {
          delete obj.$$hashKey;
        }
      }

      function extend(dst, args) {
        var h = dst.$$hashKey;
        if(baseConfig.debug){
          console.log(arguments);
        }
        for (var i = 1, ii = arguments.length; i < ii; i++) {
          var obj = arguments[i];
          if (obj) {
            var keys = Object.keys(obj);
            for (var j = 0, jj = keys.length; j < jj; j++) {
              var key = keys[j];
              dst[key] = obj[key];
            }
          }
        }
        setHashKey(dst, h);
        return dst;
      }

      var $hmsHelp = {
        showPopup: showPopup,
        _createPopup: createPopup,
        _popupStack: popupStack
      };


      return $hmsHelp;

      function createPopup() {
        var self = {};
        self.scope = ($rootScope).$new();
        self.element = angular.element(HELP_TPL);
        self.responseDeferred = $q.defer();
        $ionicBody.get().appendChild(self.element[0]);
        if(baseConfig.debug){
          debug(self.element);
        }
        $compile(self.element)(self.scope);

        extend(self.scope, {
          title: "",
          $buttonTapped: function () {
            //event = event.originalEvent || event; //jquery events
            if (baseConfig.debug) {
              debug("$buttonTapped");
            }
            self.responseDeferred.resolve(1);
          }
        });
        self.show = function () {
          if (self.isShown || self.removed) return;
          $ionicModal.stack.add(self);
          self.isShown = true;
          ionic.requestAnimationFrame(function () {
            //if hidden while waiting for raf, don't show
            if (!self.isShown) return;

            //self.element.removeClass('popup-hidden');
            //self.element.addClass('popup-showing active');
            focusInput(self.element);
          });
        };
        self.hide = function (callback) {
          if (baseConfig.debug) {
            console.log("4 self.hide " + callback);
          }
          callback = callback || function () {
            };
          if (!self.isShown) return callback();

          $ionicModal.stack.remove(self);
          self.isShown = false;
          //self.element.removeClass('active');
          //self.element.addClass('popup-hidden');
          $timeout(callback, 250, false);
        };
        self.remove = function () {
          if (baseConfig.debug) {
            console.log("5 self.remove ");
          }
          if (self.removed || !$ionicModal.stack.isHighest(self)) return;
          self.hide(function () {
            self.element.remove();
            self.scope.$destroy();
          });
          self.removed = true;
        };
        return self;
      }

      function onHardwareBackButton() {
        var last = popupStack[popupStack.length - 1];
        last && last.responseDeferred.resolve();
      }

      function showPopup() {
        var popup = $HmsHelp._createPopup();
        var showDelay = 0;

        if (popupStack.length > 0) {
          popupStack[popupStack.length - 1].hide();
          showDelay = config.stackPushDelay;
        } else {
          //Add popup-open & backdrop if this is first popup
          //$ionicBody.addClass('popup-open');
          //$ionicBackdrop.retain();
          //only show the backdrop on the first popup
          $hmsHelp._backButtonActionDone = $ionicPlatform.registerBackButtonAction(
            onHardwareBackButton,
            IONIC_BACK_PRIORITY.popup
          );
        }

        // Expose a 'close' method on the returned promise
        popup.responseDeferred.promise.close = function popupClose(result) {
          if (!popup.removed) popup.responseDeferred.resolve(result);
        };
        //DEPRECATED: notify the promise with an object with a close method
        popup.responseDeferred.notify({
          close: popup.responseDeferred.close
        });

        doShow();

        return popup.responseDeferred.promise;

        function doShow() {
          popupStack.push(popup);
          if (baseConfig.debug) {
            console.log("popupStack.push(popup)");
          }
          $timeout(popup.show, showDelay, false);

          popup.responseDeferred.promise.then(function (result) {
            var index = popupStack.indexOf(popup);
            if (index !== -1) {
              popupStack.splice(index, 1);
            }
            if (baseConfig.debug) {
              console.log("popupStack.length");
            }
            if (popupStack.length > 0) {
              popupStack[popupStack.length - 1].show();
            } else {
              //$ionicBackdrop.release();
              //Remove popup-open & backdrop if this is last popup
              $timeout(function () {
                // wait to remove this due to a 300ms delay native
                // click which would trigging whatever was underneath this
                if (!popupStack.length) {
                  //$ionicBody.removeClass('popup-open');
                }
              }, 400, false);
              ($hmsHelp._backButtonActionDone || function () {
              })();
            }

            popup.remove();
            return result;
          });
        }
      }

      function focusInput(element) {
        var focusOn = element[0].querySelector('[autofocus]');
        if (focusOn) {
          focusOn.focus();
        }
      }
    }
  ])

  .factory("hmsFastPath", function () {
    var request = {
      configFastPath: function (scope, returnView, ionicHistory) {
        scope.screenWidth = {
          width: (window.screen.width - 50 + 'px')
        };
        scope.scrollWidth = returnView.getWidth();
        var viewTag = document.getElementsByTagName('ion-view');
        var viewName = viewTag[viewTag.length - 1].attributes[0].value;
        scope.currentStackList = returnView.getStackList(ionicHistory, viewName);
        scope.goStack = function (stackItem) {
          returnView.returnToState(stackItem.stateName);
        };
      }
    };
    return request;
  });

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('myApp', [
  'ionic',
  'ngCordova',
  'loginModule',
  'baseConfig',
  'messageModule',
  'contactModule',
  'applicationModule',
  'myInfoModule',
  'utilModule',
  'tsApproveModule',
  'HmsModule'
]); 

angular.module('myApp')
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  });
<<<<<<< HEAD

angular.module('myApp')
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$ionicConfigProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider) {
      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js

      $httpProvider.interceptors.push('httpRequestHeader');//注册过滤器
      $ionicConfigProvider.platform.ios.tabs.style('standard');
      $ionicConfigProvider.platform.ios.tabs.position('bottom');
      $ionicConfigProvider.platform.android.tabs.style('standard');
      $ionicConfigProvider.platform.android.tabs.position('standard');

      $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
      $ionicConfigProvider.platform.android.navBar.alignTitle('center');

      //$ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
      $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

      $ionicConfigProvider.platform.ios.views.transition('ios');
      $ionicConfigProvider.platform.android.views.transition('android');

      $stateProvider
        // setup an abstract state for the tabs directive
        .state('tab', {
          url: '/tab',
          abstract: true,
          templateUrl: 'build/pages/tab/tabs.html',
          controller: 'TabsCtrl'
        })

        // Each tab has its own nav history stack:

=======

angular.module('myApp')
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$ionicConfigProvider', 'baseConfig',
    function ($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider, baseConfig) {
      // Ionic uses AngularUI Router which uses the concept of states
      // Learn more here: https://github.com/angular-ui/ui-router
      // Set up the various states which the app can be in.
      // Each state's controller can be found in controllers.js

      $httpProvider.interceptors.push('httpRequestHeader');//注册过滤器
      $ionicConfigProvider.platform.ios.tabs.style('standard');
      $ionicConfigProvider.platform.ios.tabs.position('bottom');
      $ionicConfigProvider.platform.android.tabs.style('standard');
      $ionicConfigProvider.platform.android.tabs.position('standard');

      $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
      $ionicConfigProvider.platform.android.navBar.alignTitle('center');

      //$ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
      $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

      $ionicConfigProvider.platform.ios.views.transition('ios');
      $ionicConfigProvider.platform.android.views.transition('android');

      $stateProvider
        // setup an abstract state for the tabs directive
        .state('tab', {
          url: '/tab',
          abstract: true,
          templateUrl: 'build/pages/tab/tabs.html',
          controller: 'TabsCtrl'
        })

        // Each tab has its own nav history stack:

>>>>>>> xbr
        .state('tab.message', {
          url: '/message',
          views: {
            'tab-message': {
              templateUrl: 'build/pages/message/message.html',
              controller: 'messageCtrl'
            }
          }
        })

        .state('tab.messageDetail', {
          url: '/messageDetail',
          params: {message: {}},
          views: {
            'tab-message': {
              templateUrl: 'build/pages/message/detail/messageDetail.html',
              controller: 'messageDetailCtrl'
            }
          }
        })

        .state('tab.contact', {
          url: '/contact',
          views: {
            'tab-contact': {
              templateUrl: 'build/pages/contact/contact.html',
              controller: 'contactCtrl'
            }
          }
        })

        .state('tab.application', {
          url: '/application',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/application.html',
              controller: 'applicationCtrl'
            }
          }
        })

        .state('tab.myInfo', {
          url: '/myInfo',
          views: {
            'tab-myInfo': {
              templateUrl: 'build/pages/myInfo/myInfo.html',
              controller: 'myInfoCtrl'
            }
          }
        })

        .state('guide', {
          url: '/guide',
          templateUrl: 'build/pages/guide/guide.html',
          controller: 'guideCtrl'
        })

        .state('login', {
          url: '/login',
          templateUrl: 'build/pages/login/login.html',
          controller: 'loginCtrl'
        });

      // if none of the above states are matched, use this as the fallback
      if(window.localStorage.token&&window.localStorage.token!=""){
        $urlRouterProvider.otherwise('/tab/message');
        //$urlRouterProvider.otherwise('/login');
      }else{
        $urlRouterProvider.otherwise('/login');
      }

      if(ionic.Platform.isWebView()){
        alert(window.sqlitePlugin);
        alert(window.sqlitePlugin.openDatabase);
        //alert(LocalFileSystem);
          /*window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
            // 获取路径
            baseConfig.appRootPath = fileSys.root.toURL() + '/' + baseConfig.appRootFile + '/';
            //showMessage(baseConfig.appRootPath+' - '+ fileSys.root.toURL() );
            //The folder is created if doesn't exist
            fileSys.root.getDirectory(baseConfig.appRootFile, {create: true, exclusive: false},
              function (directory) {
              },
              function (error) {
                alert(error);
              });
          });*/

          //var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1});
          /*db.transaction(function (tx) {
            tx.executeSql(' CREATE TABLE IF NOT EXISTS MOBILE_EXP_REPORT_LINE \
                  (line_id integer primary key AUTOINCREMENT,\
                  expenseObject_id INTEGER,\
                  expenseObject_code TEXT,\
                  expenseObject_desc TEXT,\
                  expenseObject_type TEXT,\
                  costObject_id TEXT,\
                  costObject_desc TEXT,\
                  expense_type_id INTEGER,  \
                  expense_type_desc TEXT,   \
                  expense_item_id INTEGER,\
                  expense_item_code TEXT,\
                  expense_item_desc TEXT,\
                  expense_apply_id TEXT,\
                  expense_apply_desc TEST,\
                  expense_price INTEGER,\
                  expense_quantity INTEGER,\
                  currency_code TEXT,\
                  currency_code_desc text,\
                  invoice_quantity INTEGER,\
                  exchange_rate INTEGER,\
                  total_amount INTEGER,\
                  expense_date_from TEXT,\
                  expense_date_to TEXT,\
                  expense_place Text ,\
                  description TEXT,\
                  local_status TEXT,\
                  service_id INTEGER,\
                  creation_date  TEXT ,\
                  created_by TEXT,\
                  timestamp TEXT,\
                  segment_1 INTEGER,\
                  segment_2 INTEGER,\
                  segment_3 INTEGER,\
                  segment_4 INTEGER,\
                  segment_5 INTEGER,\
                  segment_6 TEXT,\
                  segment_7 TEXT,\
                  segment_8 TEXT ,\
                  segment_9 TEXT,\
                  segment_10 TEXT )'
            );
            tx.executeSql('CREATE TABLE IF NOT EXISTS MOBILE_EXP_LINE_PHOTOS (' +
                'photo_id integer primary key, ' +
                'line_id integer, ' +
                'photo_name text,' +
                'photo_src text,' +
                'creation_date text,' +
                'created_by integer)'
            );
          }); */
      }

      

      


    }]);

/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('loginModule')

  .controller('loginCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicLoading',
    '$http',
    '$timeout',
    '$ionicHistory',
    '$ionicPlatform',
    'hmsPopup',
    function ($scope,
              $state,
              baseConfig,
              $ionicLoading,
              $http,
              $timeout,
              $ionicHistory,
              $ionicPlatform,
              hmsPopup) {

<<<<<<< HEAD
      //将页面的导航bar设置成白色
      $ionicPlatform.ready(function () {
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
      });

      $scope.loginData = {};
      $scope.currentVersionNum = baseConfig.versionName;
=======
      $scope.animationsEnabled = false;
      
      //个人办公 
      $scope.officeApp = [
        {
          list: [
            {
              appName: "会议管理",
              imageUrl: "build/img/application/meetingManage@3x.png",
              destUrl: "",
            },
            {
              appName: "个人申请",
              imageUrl: "build/img/application/meetingManage@3x.png",
              destUrl: "",
            },
            {
              appName: "报表分析",
              imageUrl: "build/img/application/meetingManage@3x.png",
              destUrl: "",
            },
            {
              appName: "人事政策",
              imageUrl: "build/img/application/meetingManage@3x.png",
              destUrl: "",
            }]
        },
        {
          list: [
            {
              appName: "假期管理",
              imageUrl: "build/img/application/holidayManage@3x.png",
              destUrl: "tab.time-off-manage",
            }, 
            {
              appName: "住宿申请",
              imageUrl: "build/img/application/dorm-apply/dorm-apply.png",
              destUrl: "tab.dorm-apply"
            }, {
              appName: "Timesheet填写",
              imageUrl: "build/img/application/timesheet@3x.png",
              destUrl: "tab.timesheet",
            },
            {
              appName: "Timesheet审批",
              imageUrl: "build/img/application/timesheetExamine@3x.png",
              destUrl: "tab.tsApproveList",
            }
          ]
        }];
>>>>>>> xbr

<<<<<<< HEAD
      //项目门户
      $scope.projectApp = [
        {
          list: [
            {
              appName: "机票预定",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "tab.flyback",
            },
            {
              appName: "代办事项",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "tab.workflow-list",
            },
            {
              appName: "报销单查询",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "首款查询",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            }]
        },
        {
          list: [
            {
              appName: "外勤汇报",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "记一笔",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "tab.acc_main"
            },
            {
              appName: "报销",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "tab.expense"
            },
            {
              appName: "预报销",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "tab.cst_list"
            }]
        }
      ];

      //员工社区
      $scope.employeeApp = [
        {
          list: [
            {
              appName: "在线培训",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "知识门户",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "新闻",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "分享社区",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            }]
        },
        {
          list: [
            {
              appName: "在线培训",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "知识门户",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "新闻",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "分享社区",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            }]
        }
      ];


      $scope.openSetting = function(){
        if($scope.animationsEnabled){
          $scope.animationsEnabled = false;
        }
        else{
          $scope.animationsEnabled = true;
        }
      };

      $scope.goPage = function (appItem) {
        if (baseConfig.debug) {
          console.log("appItem " + angular.toJson(appItem));
        }
        $state.go(appItem.destUrl);
      };

      console.log('applicationCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('applicationCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('applicationCtrl.$destroy');
      });
    }]);

/**
 * Created by gusenlin on 16/5/16.
 */
<<<<<<< HEAD
angular.module('contactModule')

  .controller('contactCtrl', [
=======
angular.module('loginModule')

  .controller('guideCtrl', [
>>>>>>> xbr
    '$scope',
    '$state',
    function ($scope,
              $state) {
<<<<<<< HEAD
      console.log('contactCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('contactCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('contactCtrl.$destroy');
      });
    }]);

/**
 * Created by gusenlin on 16/5/16.
 */
angular.module('loginModule')

  .controller('guideCtrl', [
    '$scope',
    '$state',
    function ($scope,
              $state) {

      console.log('loginCtrl.enter');

      $scope.toLogin = function () {
        console.log("跳过导航页到登陆页");
        $state.go("login");
      };

=======

      console.log('loginCtrl.enter');

      $scope.toLogin = function () {
        console.log("跳过导航页到登陆页");
        $state.go("login");
      };

>>>>>>> xbr
      $scope.$on('$ionicView.enter', function (e) {
        console.log('guideCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('guideCtrl.$destroy');
      });
    }]);

/**
 * Created by gusenlin on 16/4/24.
 */
<<<<<<< HEAD
angular.module('loginModule')

  .controller('loginCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicLoading',
    '$http',
    '$timeout',
    '$ionicHistory',
    '$ionicPlatform',
    'hmsPopup',
    function ($scope,
=======
angular.module('contactModule')

  .controller('contactCtrl', [
    '$scope',
    '$state',
    function ($scope,
              $state) {
      console.log('contactCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('contactCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('contactCtrl.$destroy');
      });
    }]);

/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('loginModule')

  .controller('loginCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicLoading',
    '$http',
    '$timeout',
    '$ionicHistory',
    '$ionicPlatform',
    'hmsPopup',
    function ($scope,
>>>>>>> xbr
              $state,
              baseConfig,
              $ionicLoading,
              $http,
              $timeout,
              $ionicHistory,
              $ionicPlatform,
              hmsPopup) {

      //将页面的导航bar设置成白色
      $ionicPlatform.ready(function () {
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
      });

      $scope.loginData = {};
      $scope.currentVersionNum = baseConfig.versionName;

=======
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
      if (window.localStorage.empno) {
        $scope.loginData.username = window.localStorage.empno;
      }

      if (!window.localStorage.checkboxSavePwd) {
        $scope.checkboxSavePwd = true;
        window.localStorage.checkboxSavePwd = "true";
      }

      if (window.localStorage.checkboxSavePwd == "true") {
        $scope.checkboxSavePwd = true;
        $scope.loginData.password = window.localStorage.password;
      } else {
        $scope.checkboxSavePwd = false;
      }

      if (baseConfig.debug) {
        console.log('loginCtrl.enter');
      }

      $scope.savePassword = function () {
        $scope.checkboxSavePwd = !$scope.checkboxSavePwd;//取反 记住密码框的状态
        if (baseConfig.debug) {
          console.log("此时密码框的状态为 :", angular.toJson($scope.checkboxSavePwd));
        }
        if ($scope.loginData.password !== "") {
          if ($scope.checkboxSavePwd === true) {
            window.localStorage.password = $scope.loginData.password;
          } else {
            window.localStorage.password = "";
          }
        }
      };

      $scope.clearUser = function () {
        $scope.loginData.username = '';
      }
      $scope.clearPassword = function () {
        $scope.loginData.password = '';
      }

      //login
      $scope.doLogin = function () {
        window.localStorage.empno = $scope.loginData.username;
        if ($scope.checkboxSavePwd) {
          window.localStorage.password = $scope.loginData.password;
        } else {
          window.localStorage.password = "";
        }

        if (!$scope.loginData.username || $scope.loginData.username == '') {
          hmsPopup.showPopup('用户名不能为空');
          return;
        }
        if (!$scope.loginData.password || $scope.loginData.password == '') {
          hmsPopup.showPopup('密码不能为空');
          return;
        }

        var url = baseConfig.basePath + "/appLogin/user_login/login";
        var params = {
          "params": {
            "p_user_name": +$scope.loginData.username,
            "p_password": $scope.loginData.password
          }
        };
        hmsPopup.showLoading('登陆中...');
        $http.post(url, params).success(function (result) {
          hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
          if (!result.status && result.con_status == 'S') {
            window.localStorage.token = result.pre_token + result.token_key;
            window.localStorage.empno = $scope.loginData.username;
            window.localStorage.checkboxSavePwd = $scope.checkboxSavePwd;
            $state.go("tab.message");
          } else {
            hmsPopup.showPopup('登陆失败,可能是密码不对!');
          }
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(response));
          }
        });
      };

      $scope.$on('$ionicView.enter', function (e) {
        if (baseConfig.debug) {
          console.log('loginCtrl.$ionicView.enter');
        }

        $timeout(function () {
          $ionicHistory.clearCache();
          $ionicHistory.clearHistory();
        }, 400);
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('loginCtrl.$destroy');
        }
      });
    }]);

/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('messageModule')

  .controller('messageCtrl', [
    '$scope',
    '$state',
    '$timeout',
    '$ionicPlatform',
    function ($scope,
              $state,
              $timeout,
              $ionicPlatform) {
<<<<<<< HEAD
<<<<<<< HEAD

      $scope.messageList = [
      ];

      //将页面的导航bar设置成白色
      $ionicPlatform.ready(function () {
        if (window.StatusBar) {
          StatusBar.styleLightContent();
        }
      });

      $scope.talk = function (message) {
        console.log('$scope.talk');
        $state.go("tab.messageDetail", {message: message});
      };

      $scope.refresh = function(){
        $timeout(function(){
          $scope.$broadcast("scroll.refreshComplete");
        },2000);
      };

      console.log('messageCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('messageCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('messageCtrl.$destroy');
      });

    }]);

/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('loginModule').controller('TabsCtrl', ['$scope', '$rootScope', '$state', 'baseConfig',
  function ($scope, $rootScope, $state, baseConfig) {
    $rootScope.$on('$ionicView.beforeEnter', function () {
      var statename = $state.current.name;
      if (baseConfig.debug) {
        console.log('$ionicView.beforeEnter statename ' + statename);
      }
      //tabs中存在的主页面不需要隐藏，hidetabs=false
      if (statename != 'tab.message' && statename != 'tab.application' &&
        statename != 'tab.contact' && statename != 'tab.myInfo') {
        $scope.hideTabs = true;
      }
    });

    $rootScope.$on('$ionicView.afterEnter', function () {
      var statename = $state.current.name;
      if (baseConfig.debug) {
        console.log('$ionicView.afterEnter statename ' + statename);
      }
      //tabs中存在的主页面不需要隐藏，hidetabs=false
      if (statename === 'tab.message' || statename === 'tab.application' ||
        statename === 'tab.contact' || statename === 'tab.myInfo') {
        $scope.hideTabs = false;
      }
    });
  }]);

/**
=======

      $scope.messageList = [
      ];

      //将页面的导航bar设置成白色
      $ionicPlatform.ready(function () {
        if (window.StatusBar) {
          StatusBar.styleLightContent();
        }
      });

      $scope.talk = function (message) {
        console.log('$scope.talk');
        $state.go("tab.messageDetail", {message: message});
      };

      $scope.refresh = function(){
        $timeout(function(){
          $scope.$broadcast("scroll.refreshComplete");
        },2000);
      };

      console.log('messageCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('messageCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('messageCtrl.$destroy');
      });

    }]);

/**
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
=======

      $scope.messageList = [
      ];

      //将页面的导航bar设置成白色
      $ionicPlatform.ready(function () {
        if (window.StatusBar) {
          StatusBar.styleLightContent();
        }
      });

      $scope.talk = function (message) {
        console.log('$scope.talk');
        $state.go("tab.messageDetail", {message: message});
      };

      $scope.refresh = function(){
        $timeout(function(){
          $scope.$broadcast("scroll.refreshComplete");
        },2000);
      };

      console.log('messageCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('messageCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('messageCtrl.$destroy');
      });

    }]);

/**
>>>>>>> xbr
 * Created by LeonChan on 2016/6/17.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.feedback', {
          url: '/feedback',
          views: {
            'tab-myInfo': {
              templateUrl: 'build/pages/myInfo/feedback.html',
              controller: 'FeedbackCtrl'
            }
          }
        })
    }]);
angular.module('myInfoModule')
  .controller('FeedbackCtrl', [
    '$scope',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    function ($scope,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup) {

      $scope.qualityIssue=[false,false,false,false];//反馈问题类型样式
      $scope.feedbackInfo={//反馈信息
        info:""
      }
      $scope.selectQualityIssue=function(num){//选择反馈问题类型
        angular.forEach($scope.qualityIssue,function(data,index,array){
          array[index]=false;
        });
        $scope.qualityIssue[num]=true;
      }
      $scope.goBack=function(){//返回按钮
        $ionicHistory.goBack();
      }

      $scope.commit=function(){//提交反馈
        var i=0;
        angular.forEach($scope.qualityIssue,function(data,index,array){
          if(array[index]==false){
            i++;
          }
        });
        if(i==$scope.qualityIssue.length){
          hmsPopup.showShortCenterToast('请选择反馈问题类型');
        }else if($scope.feedbackInfo.info==""){
          hmsPopup.showShortCenterToast('请填写产品质量问题反馈');
        }
      }
    }])

/**
 * Created by LeonChan on 2016/6/20.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.my-info-detail', {
          url: '/my-info-detail',
          views: {
            'tab-myInfo': {
              templateUrl: 'build/pages/myInfo/my-info-detail.html',
              controller: 'MyInfoDetailCtrl'
            }
          }
        })
    }]);
angular.module('myInfoModule')
  .controller('MyInfoDetailCtrl', [
    '$scope',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    function ($scope,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup) {

      $scope.goBack=function(){//返回按钮
        $ionicHistory.goBack();
      }



    }])

/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('myInfoModule')

  .controller('myInfoCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    function ($scope,
              $state,
              baseConfig,
              hmsHttp,
              hmsPopup) {

      if(baseConfig.debug){
        console.log('myInfoCtrl.enter');
      }

      //var url=baseConfig.businessPath + "/get_empinfo/get_emp_detail";//获取用户信息
      //var param={
      //   "params":{
      //     "p_emp_code":window.localStorage.empno
      //   }
      //};
      //hmsHttp.post(url,param).success(function (result) {
      //  console.log(angular.toJson(result));
      //}).error(function(err,status){
      //
      //});
      $scope.logout = function(){//注销登录
        window.localStorage.token = "";
        window.localStorage.password = "";
        window.localStorage.timesheetAuto="";
        window.localStorage.messagePush="";
        $state.go('login');
      };

      $scope.setup=function(){//进入设置界面
        $state.go('tab.setup');
      };

      $scope.feedback=function(){//进入反馈界面
        $state.go('tab.feedback');
      };

      $scope.checkMyInfo=function(){//进入查看我的信息界面
        $state.go('tab.my-info-detail');
      };

      $scope.$on('$ionicView.enter', function (e) {
        if(baseConfig.debug) {
          console.log('myInfoCtrl.$ionicView.enter');
        }
      });

      $scope.$on('$destroy', function (e) {
        if(baseConfig.debug) {
          console.log('myInfoCtrl.$destroy');
        }
      });
    }]);

/**
 * Created by LeonChan on 2016/6/15.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.setup', {
          url: '/setup',
          views: {
            'tab-myInfo': {
              templateUrl: 'build/pages/myInfo/setup.html',
              controller: 'SetupCtrl'
            }
          }
        })
    }]);
angular.module('myInfoModule')
  .controller('SetupCtrl', [
    '$scope',
    'baseConfig',
    '$ionicHistory',
    function ($scope,
              baseConfig,
              $ionicHistory) {

      if (!window.localStorage.timesheetAuto) {
        $scope.timesheetAuto = false;
        window.localStorage.timesheetAuto= "false";
        if (baseConfig.debug) {
          console.log('timesheet自动填写功能默认关闭');
        }
      }
      if(!window.localStorage.messagePush){
        $scope.messagePush = false;
        window.localStorage.messagePush= "false";
        if (baseConfig.debug) {
          console.log('消息推送功能默认关闭');
        }
      }
      if (window.localStorage.timesheetAuto == "true") {
        $scope.timesheetAuto = true;
        if (baseConfig.debug) {
          console.log('打开timesheet自动填写功能');
        }
      }else{
        $scope.timesheetAuto = false;
        if (baseConfig.debug) {
          console.log('关闭timesheet自动填写功能');
        }
      }
      if (window.localStorage.messagePush == "true") {
        $scope.messagePush = true;
        if (baseConfig.debug) {
          console.log('打开消息推送功能');
        }
      }else{
        $scope.messagePush = false;
        if (baseConfig.debug) {
          console.log('关闭消息推送功能');
        }
      }

      $scope.clickTimesheetAuto=function(){
        $scope.timesheetAuto=!$scope.timesheetAuto;
        if($scope.timesheetAuto==true){
          window.localStorage.timesheetAuto="true";
          if (baseConfig.debug) {
            console.log('打开timesheet自动填写功能');
          }
        }else if($scope.timesheetAuto==false){
          window.localStorage.timesheetAuto="false";
          if (baseConfig.debug) {
            console.log('关闭timesheet自动填写功能');
          }
        }
      }

      $scope.clickMessagePush=function(){
        $scope.messagePush=!$scope.messagePush;
        if($scope.messagePush==true){
          window.localStorage.messagePush="true";
          if (baseConfig.debug) {
            console.log('打开消息推送功能');
          }
        }else if($scope.messagePush==false){
          window.localStorage.messagePush="false";
          if (baseConfig.debug) {
            console.log('关闭消息推送功能');
          }
        }
      }

      $scope.goBack=function(){//返回按钮
        $ionicHistory.goBack();
      }

    }]);

/**
<<<<<<< HEAD
<<<<<<< HEAD
 * Created by LeonChan on 2016/5/31.
=======
=======
>>>>>>> xbr
 * Created by gusenlin on 16/4/24.
 */
angular.module('loginModule').controller('TabsCtrl', ['$scope', '$rootScope', '$state', 'baseConfig',
  function ($scope, $rootScope, $state, baseConfig) {
    $rootScope.$on('$ionicView.beforeEnter', function () {
      var statename = $state.current.name;
      if (baseConfig.debug) {
        console.log('$ionicView.beforeEnter statename ' + statename);
      }
      //tabs中存在的主页面不需要隐藏，hidetabs=false
      if (statename != 'tab.message' && statename != 'tab.application' &&
        statename != 'tab.contact' && statename != 'tab.myInfo') {
        $scope.hideTabs = true;
      }
    });

    $rootScope.$on('$ionicView.afterEnter', function () {
      var statename = $state.current.name;
      if (baseConfig.debug) {
        console.log('$ionicView.afterEnter statename ' + statename);
      }
      //tabs中存在的主页面不需要隐藏，hidetabs=false
      if (statename === 'tab.message' || statename === 'tab.application' ||
        statename === 'tab.contact' || statename === 'tab.myInfo') {
        $scope.hideTabs = false;
      }
    });
  }]);

/**
<<<<<<< HEAD
 * Created by gusenlin on 16/4/24.
 */
angular.module('contactModule')

  .controller('contactCtrl', [
    '$scope',
    '$state',
    function ($scope,
              $state) {
      console.log('contactCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('contactCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('contactCtrl.$destroy');
      });
    }]);

/**
 * Created by gusenlin on 16/5/16.
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
 */
angular.module('loginModule')

  .controller('guideCtrl', [
    '$scope',
    '$state',
    function ($scope,
              $state) {

      console.log('loginCtrl.enter');

      $scope.toLogin = function () {
        console.log("跳过导航页到登陆页");
        $state.go("login");
      };

      $scope.$on('$ionicView.enter', function (e) {
        console.log('guideCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('guideCtrl.$destroy');
      });
    }]);

/**
 * Created by gusenlin on 16/4/24.
=======
 * Created by LeonChan on 2016/5/31.
>>>>>>> xbr
 */
//应用模块
angular.module('applicationModule')

  .controller('applicationCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    function ($scope,
              $state,
              baseConfig) {

      $scope.animationsEnabled = false;

      //个人办公
      $scope.officeApp = [
        {
          list: [
            {
              appName: "会议管理",
              imageUrl: "build/img/application/meetingManage@3x.png",
              destUrl: "",
            },
            {
              appName: "个人申请",
              imageUrl: "build/img/application/meetingManage@3x.png",
              destUrl: "",
            },
            {
              appName: "报表分析",
              imageUrl: "build/img/application/meetingManage@3x.png",
              destUrl: "",
            },
            {
              appName: "人事政策",
              imageUrl: "build/img/application/meetingManage@3x.png",
              destUrl: "tab.personnel-policy",
            }]
        },
        {
          list: [
            {
              appName: "假期管理",
              imageUrl: "build/img/application/holidayManage@3x.png",
              destUrl: "tab.time-off-manage",
            }, 
            {
              appName: "住宿申请",
              imageUrl: "build/img/application/dorm-apply/dorm-apply.png",
              destUrl: "tab.dorm-apply"
            }, {
              appName: "Timesheet填写",
              imageUrl: "build/img/application/timesheet@3x.png",
              destUrl: "tab.timesheet",
            },
            {
              appName: "Timesheet审批",
              imageUrl: "build/img/application/timesheetExamine@3x.png",
              destUrl: "tab.tsApproveList",
            }
          ]
        }];

      //项目门户
      $scope.projectApp = [
        {
          list: [
            {
              appName: "机票预定",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "tab.flyback",
            },
            {
              appName: "代办事项",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "tab.workflow-list",
            },
            {
              appName: "报销单查询",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "首款查询",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            }]
        },
        {
          list: [
            {
              appName: "外勤汇报",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "",
              imageUrl: "",
              destUrl: "",
            },
            {
              appName: "",
              imageUrl: "",
              destUrl: "",
            },
            {
              appName: "",
              imageUrl: "",
              destUrl: "",
            }]
        }
      ];

      //员工社区
      $scope.employeeApp = [
        {
          list: [
            {
              appName: "在线培训",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "知识门户",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "新闻",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "分享社区",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            }]
        },
        {
          list: [
            {
              appName: "在线培训",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "知识门户",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "新闻",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            },
            {
              appName: "分享社区",
              imageUrl: "build/img/application/flightBooking@3x.png",
              destUrl: "",
            }]
        }
      ];


      $scope.openSetting = function(){
        if($scope.animationsEnabled){
          $scope.animationsEnabled = false;
        }
        else{
          $scope.animationsEnabled = true;
        }
      };

      $scope.goPage = function (appItem) {
        if (baseConfig.debug) {
          console.log("appItem " + angular.toJson(appItem));
        }
        $state.go(appItem.destUrl);
      };

      console.log('applicationCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('applicationCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('applicationCtrl.$destroy');
      });
    }]);

/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('messageModule')

  .controller('messageDetailCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$ionicHistory',
    function ($scope,
              $state,
              $stateParams,
              $ionicHistory) {

      var message = $stateParams.message;
      console.log('message : ' + angular.toJson(message));

      $scope.message = message;

      $scope.goBack = function(){
        $ionicHistory.goBack();
      };

      $scope.$on('$ionicView.enter', function (e) {
        console.log('messageDetailCtrl.$ionicView.enter');
      });
      console.log('messageDetailCtrl.enter');

      $scope.$on('$destroy', function (e) {
        console.log('messageDetailCtrl.$destroy');
      });
    }]);

angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.workflow-detail', {
          url: '/workflow-detail',
          params: {detail: {}},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/workflow/detail/detail.html',
              controller: 'WorkFLowDetailCtrl'
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
  .controller('WorkFLowDetailCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$ionicModal',
    '$timeout',
    'baseConfig',
    'TimeSheetService',
    'hmsPopup',
    'WorkFLowListService',
    function ($scope,
              $state,
              $stateParams,
              $ionicModal,
              $timeout,
              baseConfig,
              TimeSheetService,
              hmsPopup,
              WorkFLowListService) {
      var detail = $stateParams.detail;
      if(baseConfig.debug){
        console.log('WorkFLowDetailCtrl.detail ' + angular.toJson(detail));
      }

      $scope.historyList = [];
      $scope.singalArrayList = [];
      $scope.multipleArrayList = [];

      //var
      var success = function (result) {
        if(baseConfig.debug){
          console.log('getWorkflowDetail.result ' + angular.toJson(result));
        }
        if(result.status == 'S'){
          $scope.historyList = result.history;
          $scope.singalArrayList = result.workflow_data.details;
          $scope.multipleArrayList = result.workflow_data.lines;
        }
      }
      WorkFLowListService.getWorkflowDetail(success,detail.workflowId,detail.instanceId,'Y');
    }]);

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
    'WorkFLowListService',
    function ($scope,
              $state,
              $stateParams,
              $ionicModal,
              $timeout,
              baseConfig,
              TimeSheetService,
              hmsPopup,
              WorkFLowListService) {

      $scope.list = [];
      $scope.fetchDataFlag = true;
      $scope.pullRefreshDataFlag = false;
      $scope.showDetailArrow = true;
      $scope.listStatus = {
        todo: {
          selected: true
        },
        done: {
          selected: false
        }
      };

      var workflowIcon = 'build/img/application/profile@3x.png';
      var workflowType = '工作流类型';
      var workflowNode = '当前节点';
      var workflowPerson = '提交人';

      $scope.fetchTodoList = function () {
        if ($scope.listStatus.todo.selected) {

        } else {
          if (!$scope.fetchDataFlag && !$scope.pullRefreshDataFlag) {
            $scope.listStatus.todo.selected = true;
            $scope.listStatus.done.selected = false;
            getTodoList(false);
          }
        }
      };

      $scope.fetchDoneList = function () {
        if ($scope.listStatus.done.selected) {

        } else {
          if (!$scope.fetchDataFlag && !$scope.pullRefreshDataFlag) {
            $scope.listStatus.done.selected = true;
            $scope.listStatus.todo.selected = false;
            getDoneList(false);
          }

        }
      };

      var getTodoList = function (pullRefresh) {
        $scope.list = [];
        if (pullRefresh) {
          $scope.fetchDataFlag = false;
          $scope.pullRefreshDataFlag = true;
        } else {
          $scope.fetchDataFlag = true;
        }
        var success = function (result) {
          var list = result.待审批列表;
          angular.forEach(list, function (data) {
            var item = {
              title1: data.workflow_name,
              icon: workflowIcon,
              type: workflowType,
              typeValue: data.workflow_name,
              node: workflowNode,
              nodeValue: data.current_node,
              submit: workflowPerson,
              submitPerson: data.employee_name,
              workflowId:data.workflow_id,
              instanceId:data.instance_id
            };
            $scope.list.push(item);
          });
          $scope.fetchDataFlag = false;
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }

        };
        var error = function (result) {
          $scope.fetchDataFlag = false;
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }
        }
        $timeout(function () {
          WorkFLowListService.getTodoList('N', success, error);
        }, 100);
      };

      var getDoneList = function (pullRefresh) {
        $scope.list = [];
        if (pullRefresh) {
          $scope.fetchDataFlag = false;
          $scope.pullRefreshDataFlag = true;
        } else {
          $scope.fetchDataFlag = true;
        }
        var success = function (result) {
          var list = result.已审批列表;
          angular.forEach(list, function (data) {
            var item = {
              title1: data.workflow_desc,
              icon: workflowIcon,
              type: workflowType,
              typeValue: data.workflow_desc,
              node: workflowNode,
              nodeValue: data.status_name,
              submit: workflowPerson,
              submitPerson: data.created_by_name,
              workflowId:data.workflow_id,
              instanceId:data.instance_id
            };
            $scope.list.push(item);
          });
          $scope.fetchDataFlag = false;
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }

        };
        var error = function (result) {
          $scope.fetchDataFlag = false;
          if (pullRefresh) {
            $scope.pullRefreshDataFlag = false;
            $scope.$broadcast('scroll.refreshComplete');
          }
        }
        $timeout(function () {
          WorkFLowListService.getTodoList('Y', success, error);
        }, 100);
      };

      getTodoList(false);

      $scope.enterWorkflowDetail = function (detail) {
        $state.go('tab.workflow-detail', {"detail": detail})
      }

      $ionicModal.fromTemplateUrl('build/pages/application/timesheet-approve/modal/ts-filter-modal.html', { //筛选modal
        scope: $scope
      }).then(function (modal) {
        $scope.tsFilterModal = modal;
      });

      $scope.filterTsInfo = function () { //响应筛选按钮的方法
        $scope.tsFilterModal.show();
      };

      $scope.refresh = function () {
        if (!$scope.fetchDataFlag) {

          $scope.list = [];
          $scope.$apply();
          $timeout(function () {
            if ($scope.listStatus.todo.selected) {
              getTodoList(true);
            } else {
              getDoneList(true);
            }
          }, 300);
        } else {
          $scope.$broadcast('scroll.refreshComplete');
        }
      }
    }])

  .service('WorkFLowListService', ['hmsHttp',
    'baseConfig',
    'hmsPopup',
    function (hmsHttp,
              baseConfig,
              hmsPopup) {

      this.getTodoList = function (flag, success, error) {
        var url = baseConfig.businessPath + "/wfl_wx_workflow_appr/get_instance_list";
        var params = {'params': {'p_employee_code': window.localStorage.empno, 'p_flag': flag + ''}};
        hmsHttp.post(url, params).success(function (result) {
          success(result)
        }).error(function (response, status) {
          hmsPopup.showPopup('获取代办事项出错,可能是网络问题!');
          error(response);
        });
      };

      this.getWorkflowDetail = function (success,workflowId, recordId, submitFlag) {
        var url = baseConfig.businessPath + "/wfl_wx_workflow_appr/get_workflow_detail";
        var params = {
          "params": {
            "p_workflow_id": workflowId,
            "p_instance_id": recordId,
            "p_employee_code": window.localStorage.empno,
            "p_submit_flag": submitFlag
          }
        };
        hmsHttp.post(url, params).success(function (data) {
          success(data);
        }).error(function (data) {
        });
      };
    }]);

/**
 * Created by LeonChan on 2016/5/31.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.dorm-apply-detail-a', {
          url: '/dorm-apply-detail-a',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/dorm-apply/dorm-apply-detail-a.html',
              controller: 'DormApplyDetailFirstCtrl'
            }
          },
          params:{
            dormApplyDetailInfo:''
          }
        })
    }]);
angular.module('applicationModule')
  .controller('DormApplyDetailFirstCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$rootScope',
    '$timeout',
    '$stateParams',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $rootScope,
              $timeout,
              $stateParams) {
      $scope.applyInfo=$stateParams.dormApplyDetailInfo;
      $scope.approving=false;//审批中状态标志位
      $scope.rejected=false;//已拒绝状态标识位
      $scope.checkingin=false;//未入住状态标识位
      $scope.approvedResult="";
      if($scope.applyInfo.status == '审批中'){
        $scope.approving=true;
        $scope.rejected=false;
        $scope.checkingin=false;
        $scope.approvedResult="";
      }else if($scope.applyInfo.status == '已拒绝'){
        $scope.approving=false;
        $scope.rejected=true;
        $scope.checkingin=false;
        $scope.approvedResult='已拒绝';
      }else if($scope.applyInfo.status == '未入住'){
        $scope.approving=false;
        $scope.rejected=false;
        $scope.checkingin=true;
        $scope.approvedResult="已通过";

      }
      $scope.goBack=function(){//返回上一界面
        $ionicHistory.goBack();
      };
      $scope.cancelApply=function(){//取消申请
        var url=baseConfig.businessPath+"/api_apply_room/cancel_application";
        var param={
          "params": {
            p_apply_id:$scope.applyInfo.applyId,//用申请id取消申请
            p_employee_number:window.localStorage.empno//工号
          }
        };
        hmsPopup.showLoading('请稍候');
        hmsHttp.post(url,param).success(function(result){
          hmsPopup.hideLoading();
          var message=result.message;
          hmsPopup.showShortCenterToast(message);//展示接口返回的message
          if(result.status=="S"){
              $rootScope.$broadcast("APPLY_CANCELLED");//触发上一界面重新刷新数据
              $ionicHistory.goBack();//删除申请成功后返回上一界面
          }
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
        }).error(function(error,status){
          hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(error));
          }
        });
      };
    }]);

/**
 * Created by LeonChan on 2016/6/4.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.dorm-apply-detail-b', {
          url: '/dorm-apply-detail-b',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/dorm-apply/dorm-apply-detail-b.html',
              controller: 'DormApplyDetailSecondCtrl'
            }
          },
          params:{
            dormApplyDetailInfo:''
          }
        })
    }]);
angular.module('applicationModule')
  .controller('DormApplyDetailSecondCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$rootScope',
    '$timeout',
    '$stateParams',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $rootScope,
              $timeout,
              $stateParams) {
      $scope.applyInfo = $stateParams.dormApplyDetailInfo;
      $scope.checkIn = false;//审批中状态标志位
      $scope.checkOut = false;//已拒绝状态标识位
      $scope.buttonText = '';//按钮上显示的文字
      $scope.leftDays=$scope.applyInfo.leftDays;//剩余天数
      $scope.totalDays=parseInt($scope.applyInfo.checkinDays);
////////////
//      var childDays=parseInt($scope.leftDays);//计算圆旋转角度的剩余天数
//      var motherDays=parseInt($scope.applyInfo.checkinDays);//计算圆旋转角度的入住天数
//      var calculation=childDays/motherDays;//分子除以分母
//      //console.log(calculation);
//      //JS圆环动画
//      var leftball=document.getElementById('left_ball');//拿到左半圆DOM
//      var rightball=document.getElementById('right_ball');//拿到右半圆DOM
//      if(calculation<=0.5){//剩余天数大于总天数的一半
//        leftball.style.transition="all 0.3s linear";
//        leftball.style.webkitTransition="all 0.3s linear";
//        rightball.style.transition="all 0.3s ease-out";//右半圆过渡动画0.3s，渐快，无延迟
//        rightball.style.webkitTransition="all 0.3s ease-out";
//      }else if(calculation>0.5){//剩余天数不到入住天数的一半
//        leftball.style.transition="all 0.3s ease-out 0.3s";//左半圆过渡动画0.3s，渐缓，0.3s延迟
//        leftball.style.webkitTransition="all 0.3s ease-out 0.3s";
//        rightball.style.transition="all 0.3s ease-in";//右半圆过渡动画0.3s，渐快，无延迟
//        rightball.style.webkitTransition="all 0.3s ease-in";
//      }
//      leftball.style.webkitTransform = "rotate(-135deg)";
//      leftball.style.transform = "rotate(-135deg)";
//      rightball.style.webkitTransform = "rotate(-135deg)";
//      rightball.style.transform = "rotate(-135deg)";
      //定时器中决定两个圆的终止角度
      //$timeout(function(){
      //  var angle=0;
      //  if(calculation<=0.5){
      //    angle=360*calculation;
      //    angle=angle-135;
      //    //console.log("角度："+angle);
      //    leftball.style.webkitTransform = "rotate(-135deg)";
      //    leftball.style.transform = "rotate(-135deg)";
      //    rightball.style.webkitTransform = "rotate("+angle+"deg)";
      //    rightball.style.transform = "rotate("+angle+"deg)";
      //  }else if(calculation>0.5){
      //    calculation=calculation-0.5;
      //    angle=360*calculation;
      //    angle=angle-135;
      //    //console.log("角度："+angle);
      //    leftball.style.webkitTransform = "rotate("+angle+"deg)";
      //    leftball.style.transform = "rotate("+angle+"deg)";
      //    rightball.style.webkitTransform = "rotate(45deg)";
      //    rightball.style.transform = "rotate(45deg)";
      //  }
      //},500);

      if ($scope.applyInfo.status == '已入住') {//已入住
        $scope.checkIn = true;
        $scope.checkOut = false;
        $scope.buttonText = '续住';
      } else if ($scope.applyInfo.status == '已退房') {//已退房
        $scope.checkIn = false;
        $scope.checkOut = true;
        $scope.buttonText = '再次预定';
      }

      $scope.goBack = function () {//返回上一界面
        $ionicHistory.goBack();
      };

      $scope.renewContract=function(){//续住
        var url=baseConfig.businessPath+"/api_apply_room/overstay_apply_room";
        var param={
          "params": {
            p_employee_number:window.localStorage.empno,
            p_pro_id:"",
            p_checkin_date:"2016-08-15",
            p_checkout_date:"2016-09-20",
            p_room_number:$scope.applyInfo.roomNumber,
            p_bed_number:$scope.applyInfo.bedNumber,
            p_apply_type:$scope.applyInfo.applyType,
            p_reason:""
          }
        };
        if($scope.applyInfo.applyType=='项目申请'){
          param.params.p_pro_id=$scope.applyInfo.projectId;
        }
        hmsPopup.showLoading('请稍候');
        hmsHttp.post(url,param).success(function(result){
          hmsPopup.hideLoading();
          var message=result.message;
          hmsPopup.showShortCenterToast(message);
          if(result.status=="S"){
              $rootScope.$broadcast("APPLY_SUCCESS");//触发上一界面重新刷新数据
              $ionicHistory.goBack();//删除申请成功后返回上一界面
          }
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
        }).error(function(error,status){
          hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(error));
          }
        });
      };

    }]);

<<<<<<< HEAD
/**
 * Created by LeonChan on 2016/6/7.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.dorm-apply-vacant-room', {
          url: '/dorm-apply-vacant-room',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/dorm-apply/dorm-apply-vacant-room.html',
              controller: 'DormApplyVacantRoomCtrl'
            }
          },
          params:{
            dormApplySearchResult:'',
            projectId:'',
            applyType:''
          }
        })
    }]);
angular.module('applicationModule')
  .controller('DormApplyVacantRoomCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$timeout',
    '$stateParams',
    function ($scope,
              $rootScope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $timeout,
              $stateParams) {

<<<<<<< HEAD
=======
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.acc_expenseObjectList', {
          url: '/acc/expenseObjectList',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/expenseObjectList.html',
              controller: 'expenseObjectController'
            }
          }
        });
    }]);

angular.module("applicationModule")
    .controller('expenseObjectController', function($scope,expenseObject,expenseApply,$ionicHistory,keepAccount, $ionicLoading, baseConfig) {
        $scope.businessType=expenseObject.businessType;
        $scope.objectType=expenseObject.objectType;
        $ionicLoading.show({
            template: "下载项目信息..."
            //duration: 3000
        });

        $scope.objectType = "PRJ";
        //businessType = 'ACC';
        if($scope.objectType=="UNIT"){
            $scope.title="选择部门";
            console.log(expenseObject);
            var promise=expenseObject.queryUnitList();
            promise.then(function(response) {
                var code=getResponseCode(response);
                if(code=="ok"){

                }else if(code=="failure"){
                }
                else if (code =="login_required"){
                    showMessage("登录状态异常\n"+angular.toJson(response));
                    reLogin();
                }else{
                    showMessage("未知错误:"+angular.toJson(response));
                }
                $scope.unitList=response.body.unitList;
            }, function(response) {
                alert("网络连接错误,初始化数据 unitList");
            });
        }else if($scope.objectType=="PRJ") {
            $scope.title = "选择项目";
            console.log(expenseObject);
            var promise = expenseObject.queryProjectList();
            promise.then(function (response) {

                console.log(angular.toJson(response));

                if(response["status"] == "S") {



                    keepAccount.projectList = [];
                    var proj_tmp = response["proj"];
                    $.each(proj_tmp, function (i, value) {
                        var item = {
                            expenseObject_id : value.pj_id,
                            expenseObject_code:value.pj_code,
                            expenseObject_desc : value.pj_name,
                            expenseObject_type : value.cost_type,
//                            expenseItemList: value.expense,
                            expenseItemList_index:i
                        };

                        //expenseObject.projectList.push(item);

                        keepAccount.projectList.push(item);
                        //expenseApply.projectList.push(item);

                    });

                    //console.log( keepAccount.projectList);

                    $scope.projectList = keepAccount.projectList;
                    //console.log( angular.toJson($scope.projectList));

                    $ionicLoading.hide();

                } else {
                    var errmsg = angular.toJson(response);
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        template: errmsg,
                        duration: 1000
                    });
                }

                $ionicLoading.hide();


                /*
                 $scope.projectList=[
                 {
                 "projectId": 12,
                 "projectCode": "PRJ0001",
                 "projectName": "XXX公司人力资源管理系统实施项目",
                 "enabledFlag": "Y",
                 "companyId": 2
                 },
                 {
                 "projectId": 23,
                 "projectCode": "PRJ0004",
                 "projectName": "外包",
                 "enabledFlag": "Y",
                 "companyId": 2
                 },
                 {
                 "projectId": 13,
                 "projectCode": "PRJ0002",
                 "projectName": "XXX公司财务管理系统实施项目",
                 "enabledFlag": "Y",
                 "companyId": 2
                 },
                 {
                 "projectId": 14,
                 "projectCode": "PRJ0003",
                 "projectName": "XXX公司财务共享实施项目",
                 "enabledFlag": "Y",
                 "companyId": 2
                 }
                 ];
                 */


            }, function (response) {
                //alert("网络连接错误,初始化数据 projectList");
                showMessage(response);
                $ionicLoading.hide();
                $ionicLoading.show({
                    template: '网络连接错误,初始化数据 ',
                    duration: 500
                });


            });

        }




        $scope.selectExpenseObject=function (e){
            var target= e.target;
            var expenseObject_id=target.getAttribute('expenseObject_id');
            var expenseObject_code=target.getAttribute('expenseObject_code');
            var expenseObject_desc=target.getAttribute('expenseObject_desc');
            var expenseObject_type=target.getAttribute('expenseObject_type');

            var expenseItemList_index=target.getAttribute('expenseItemList_index');
            /*
             if(businessType=="TRP"){
             travelApply.data.objectType=$scope.objectType;
             travelApply.data.expenseObject=expenseObject;
             travelApply.data.expenseObjectName=expenseObjectName;
             }
             else if(businessType == 'CSH') {
             console.log("CSH ...");

             loanApply.data.objectType=$scope.objectType;
             loanApply.data.expenseObject=expenseObject;
             loanApply.data.expenseObjectName=expenseObjectName;
             }
             else if(businessType == 'EXP') {
             console.log("EXP ...");
             console.log( expenseApply.data);
             expenseApply.data.objectType=$scope.objectType;
             expenseApply.data.expenseObject=expenseObject;
             expenseApply.data.expenseObjectName=expenseObjectName;
             // console.log(            expenseApply.data.expenseObjectName );
             }
             else
             */

            //showMessage($scope.businessType);
            if ($scope.businessType == 'ACC') {
                console.log("ACC ...");
                //console.log( keepAccount.data);

                if(expenseObject_id == '0' || expenseObject_id =='-1') {

                }
                else {
                    keepAccount.data.objectType=$scope.objectType;
                    keepAccount.data.expenseObject_id=expenseObject_id;
                    keepAccount.data.expenseObject_code=expenseObject_code;
                    keepAccount.data.expenseObject_desc=expenseObject_desc;
                    keepAccount.data.expenseObject_type=expenseObject_type;




                    keepAccount.data.expense_item_code="";
                    keepAccount.data.expense_item_desc="";

                    keepAccount.data.costObject_id  = "";
                    keepAccount.data.costObject_desc= "";
                    keepAccount.expenseItemList = [];
                    keepAccount.expenseCostList = [];

//                    console.log(expenseObject_id);
                    console.log("get the objectId = "+expenseObject_id+" get the objectCode = "+expenseObject_code);
                    var promise=expenseObject.queryExpenseList(expenseObject_id, expenseObject_code);
                    
                    promise.then(function (response) {

                        console.log(response);
                        if(response["status"] == "S") {
                            var expenseItemList_tmp = response["expense"];
                            $.each(expenseItemList_tmp, function (i, value) {
                                var item = {
                                   expense_item_code : value.exp_code,
                                   expense_item_desc:value.exp_name,
                                   expense_item_house:value.exp_house,
                                   expense_item_index:i
                                };
                                keepAccount.expenseItemList.push(item);
                            });
                        }
                    }, function (response) {
                        //alert("网络连接错误,初始化数据 projectList");
                        showMessage(response);
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: '网络连接错误,初始化数据 ',
                            duration: 500
                        });
                    });
                    

                    //keepAccount.expenseItemList = keepAccount.projectList[expenseItemList_index].expenseItemList;

                    //console.log(angular.toJson(keepAccount.expenseItemList));

                }


            }
            else if ($scope.businessType == 'EXP') {

                expenseApply.data.expenseObject_desc=expenseObject_desc;
                expenseApply.data.expenseObject_id=expenseObject_id;

            }
            else{
                console.log('程序错误 expenseObjectController line23');
            }

            $ionicHistory.goBack();

            //globalNavigator.popPage();

        }

    });
/*结算对象service*/
angular.module("applicationModule")
    .factory('expenseObject', function ($http,$q, $ionicLoading, baseConfig) {
    var service= {
        businessType:'',
        objectType:'',
        queryUnitList: function (){
            var deferred = $q.defer();
            $http.get(baseConfig.basePath+"TRP/TRP1130/app_unit_list.svc?companyId=2",{cache:false}).
                success(function(response) {
                    deferred.resolve(response);
                }).
                error(function(response ) {
                    deferred.reject(response);
                });
            return deferred.promise;
        },
        queryProjectList:function (){
            //showMessage("查询项目列表");
            var deferred = $q.defer();

            var Url = baseConfig.businessPath + "/expense_account/fetch_expense_proj";
            var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '"}}';

            $http.post(Url,PostData).success(function (data){

                deferred.resolve(data);

            }).error(function(data) {
                deferred.reject(data);

                //$ionicLoading.hide();

            });

            /*
            $http.get(baseConfig.basePath+"TRP/TRP1130/app_project_list.svc?companyId=2",{cache:false}).
                success(function(response) {
                    deferred.resolve(response);
                }).
                error(function(response) {
                    deferred.reject(response);
                });

                */

            //deferred.resolve("ok");

            return deferred.promise;
        },
        queryExpenseList:function (projectId, projectCode){
            //showMessage("查询项目列表");
            var deferred = $q.defer();

            var Url = baseConfig.businessPath + "/expense_account/fetch_expense_types";
//            var PostData = '{"params":{"p_employee":"' + window.localStorage.empno +
//            '","p_project_code":' + projectCode +
//            '","p_project_id":' + projectId +'}}';
            var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_project_code":"' + projectCode +  '","p_project_id":"' + projectId +  '"}}';


            $http.post(Url,PostData).success(function (data){
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(data);

                //$ionicLoading.hide();

            });

            /*
            $http.get(baseConfig.basePath+"TRP/TRP1130/app_project_list.svc?companyId=2",{cache:false}).
                success(function(response) {
                    deferred.resolve(response);
                }).
                error(function(response) {
                    deferred.reject(response);
                });

                */

            //deferred.resolve("ok");

            return deferred.promise;
        }
    };
    return service;
});

function showMessage(msg) {
  //navigator.notification.alert('未知错误 saveData', function(){}, '提示', '确定');
  //alert(msg);
}
function getFormatDate(date) {
  var seperator1 = "-";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  return date.getFullYear() + seperator1 + month + seperator1 + strDate;
}
/*对话框service*/
angular.module("applicationModule")
    .factory('dialog', function ( $ionicPopup, baseConfig) {
        var service= {
            // 一个提示对话框
            showAlert : function(type,msg) {
                var title = "";
                switch (type) {
                    case 'E':
                        title = "错误";
                        break;
                    case 'I':
                        title = "提示";
                        break;
                    default :
                        title = "提示";
                        break;
                }
                /***
                 * {
                      title: '', // String. The title of the popup.
                      subTitle: '', // String (optional). The sub-title of the popup.
                      template: '', // String (optional). The html template to place in the popup body.
                      templateUrl: '', // String (optional). The URL of an html template to place in the popup   body.
                      okText: '', // String (default: 'OK'). The text of the OK button.
                      okType: '', // String (default: 'button-positive'). The type of the OK button.
                    }
                 * ***/
                var alertPopup = $ionicPopup.alert({
                    title: title,
                    template: msg,
                    okText:"好的",
                    okType: 'button-light'
                });
                alertPopup.then(function(res) {
                    console.log("dialog: "+title+" - "+msg);
                });
            }
        };
        return service;
    });

/*结算对象service*/ 
angular.module("applicationModule")
    .factory('expenseObject', function ($http,$q, $ionicLoading, baseConfig) {
    var service= {
        businessType:'',
        objectType:'',
        queryUnitList: function (){
            var deferred = $q.defer();
            $http.get(baseConfig.basePath+"TRP/TRP1130/app_unit_list.svc?companyId=2",{cache:false}).
                success(function(response) {
                    deferred.resolve(response);
                }).
                error(function(response ) {
                    deferred.reject(response);
                });
            return deferred.promise;
        },
        queryProjectList:function (){
            //showMessage("查询项目列表");
            var deferred = $q.defer();
            var Url = baseConfig.businessPath + "/expense_account/fetch_expense_proj";
            var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '"}}';

            $http.post(Url,PostData).success(function (data){
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(data);
            });
            /*
                $http.get(baseConfig.basePath+"TRP/TRP1130/app_project_list.svc?companyId=2",{cache:false}).
                    success(function(response) {
                        deferred.resolve(response);
                    }).
                    error(function(response) {
                        deferred.reject(response);
                    });
            */
            //deferred.resolve("ok");
            return deferred.promise;
        },
        queryExpenseList:function (projectId, projectCode){
            //showMessage("查询项目列表");
            var deferred = $q.defer();

            var Url = baseConfig.businessPath + "/expense_account/fetch_expense_types";
//            var PostData = '{"params":{"p_employee":"' + window.localStorage.empno +
//            '","p_project_code":' + projectCode +
//            '","p_project_id":' + projectId +'}}';
            var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_project_code":"' + projectCode +  '","p_project_id":"' + projectId +  '"}}';


            $http.post(Url,PostData).success(function (data){
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(data);

                //$ionicLoading.hide();

            });

            /*
            $http.get(baseConfig.basePath+"TRP/TRP1130/app_project_list.svc?companyId=2",{cache:false}).
                success(function(response) {
                    deferred.resolve(response);
                }).
                error(function(response) {
                    deferred.reject(response);
                });

                */

            //deferred.resolve("ok");

            return deferred.promise;
        }
    };
    return service;
});
>>>>>>> xbr
angular.module("applicationModule")
.factory('flaybackService', ['$ionicLoading', function ($ionicLoading) {
  var projName = "";
  var projCode = "";
  var ticketTypeList = [];
  var routeTypeList = [];
  var passengerList = [];
  var passenger = "";
  var certification = "";
  var fbLines = [];
  var pageStatusCreate = {};// var param = {"canEdit": true,"dataSource":"create"}
  function getFormatDate(date) {
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    return date.getFullYear() + seperator1 + month + seperator1 + strDate;
  }
  return {
    getFormatDate: getFormatDate,
    getNowFormatDate: function () {
      var date = new Date();
      var seperator = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator + month + seperator + strDate;
      return currentdate;
    },
    setPageStatusCreate: function (obj) {
      pageStatusCreate = obj;
    },
    getPageStatusCreate: function (obj) {
      return pageStatusCreate;
    },
    setProjName: function (obj) {
      projName = obj;
    },
    getProjName: function (obj) {
      return projName;
    },
    setProjCode: function (obj) {
      projCode = obj;
    },
    getProjCode: function (obj) {
      return projCode;
    },
    setTicketTypeList: function (obj) {
      ticketTypeList = obj;
    },
    getTicketTypeList: function (obj) {
      return ticketTypeList;
    },
    setRouteTypeList: function (obj) {
      routeTypeList = obj;
    },
    getRouteTypeList: function (obj) {
      return routeTypeList;
    },
    setPassengerList: function (obj) {
      passengerList = obj;
    },
    getPassengerList: function (obj) {
      return passengerList;
    },
    setPassenger: function (obj) {
      passenger = obj;
    },
    getPassenger: function (obj) {
      return passenger;
    },
    setCertification: function (obj) {
      certification = obj;
    },
    getCertification: function (obj) {
      return certification;
    },
    addLine: function (obj) {
      /* var flight_date = getFormatDate(new Date(obj.flight_date));
       obj.flight_date = flight_date;*/
      fbLines.push(obj);
    },
    updateLine: function (obj, index) {
      var flight_date = getFormatDate(new Date(obj.flight_date));
      obj.flight_date = flight_date;
      fbLines[index] = obj;
    },
    getLines: function () {
      return fbLines;
    },
    setLines: function (obj) {
      fbLines = obj;
    },
    /* deleteLine: function (item) {
     //  fbLines.splice(index, 1);
     console.log("fbLines.indexOf(item) = " + fbLines.indexOf(item));
     console.log("fbLines  = " + angular.toJson(fbLines));
     console.log("item  = " + angular.toJson(item));
     fbLines.splice(fbLines.indexOf(item), 1);
     },*/
    deleteLine: function (index) {
      fbLines.splice(index, 1);
    },
    clearLines: function () {
      fbLines = [];
    }

  }

}])
;

/** Author      : joshua.shi
 *
 *  History:
 *      1.00    2016-4-28   joshua.shi   Creation
=======
     var resultInfo=$stateParams.dormApplySearchResult;//从$stateParams中拿到查询界面得到的查询结果
     var projectId=$stateParams.projectId;//从$stateParams中拿到项目id，如果不是项目类型就不用
     var applyType=$stateParams.applyType;//从$satteParams中拿到申请类型
     $scope.roomlist=resultInfo.result;
     $scope.goBack=function(){//返回上一界面
       $ionicHistory.goBack();
     };
     $scope.applyRoom=function(num){
       var url=baseConfig.businessPath+"/api_apply_room/apply_room";
       var param={
         "params": {
           p_employee_number:window.localStorage.empno,
           p_pro_id:"",
           p_checkin_date:resultInfo.checkinDate,
           p_checkout_date:resultInfo.checkoutDate,
           p_room_number:$scope.roomlist[num].room_number,
           p_bed_number:$scope.roomlist[num].bed_number,
           p_apply_type:resultInfo.applyType,
           p_reason:""
         }
       };
       if(applyType=='项目申请'){
         param.params.p_pro_id=projectId;
       }
       hmsPopup.showLoading('请稍候');
       hmsHttp.post(url,param).success(function(result){
         hmsPopup.hideLoading();
         var message=result.message;
         hmsPopup.showShortCenterToast(message);
         if(result.status=="S"){//如果申请成功的话
             $ionicHistory.goBack(-2);//返回住宿申请界面
             $rootScope.$broadcast("APPLY_SUCCESS");//自动触发刷新历史申请数据
         }
         if (baseConfig.debug) {
           console.log("result success " + angular.toJson(result));
         }
       }).error(function(error,status){
         hmsPopup.hideLoading();
         if (baseConfig.debug) {
           console.log("response error " + angular.toJson(error));
         }
       });
     };
    }]);

/**
 * Created by LeonChan on 2016/5/27.
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.dorm-apply', {
          url: '/dorm-apply',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/dorm-apply/dorm-apply.html',
              controller: 'DormApplyCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('DormApplyCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$ionicScrollDelegate',
    '$timeout',
    function ($scope,
              $rootScope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
<<<<<<< HEAD
              $ionicHistory) {

      $scope.timeOffHeader       ={
        userId                 : 999,
        paidHoliday            : 9,
        paidSickLeave          : 9,
        extPaidHoliday         : 9,
        usedPaidHoliday        : 9,
        usedPaidSickLeave      : 9,
        usedExtPaidHoliday     : 9
      };

      $scope.timeOffHistoryList  =[
        {
        holidayIcon          : 'build/img/application/time-off-manage/PaidHoliday@3x.png',
        timeOffType          : 'paid-holiday',
        timeOffTypeMeaning   : '带薪年假',
        datetimeFrom         : '2016-6-16',
        datetimeTo           : '2016-6-18',
        timeLeave            : '2天',
        approveStatus        : 'APPROVED',
        approveStatusMeaning : '已审批',
        applyReason          : '陪老婆去迪斯尼玩',
        reason_image         : [
          {
            image_url1       : '',
            image_url2       : '',
            image_url3       : '',
            image_url4       : '',
            image_url5       : '',
            image_url6       : '',
            image_url7       : '',
            image_url8       : '',
            image_url9       : '',
          }
        ]
      }];


      $scope.timeOffCreate = function(){

      }


      function getServeData() {

        var requestUrl = baseConfig.businessPath + "/api_holiday/get_holidays_data";
        var requestParams = {
=======
              $ionicScrollDelegate,
              $timeout) {
      $scope.descriptionAppearance = false;
      $scope.items=[];//历史列表中的数据
      searchHistoryApplyListAutomatically();//自动获取历史申请数据
      function searchHistoryApplyListAutomatically() {
        $scope.items=[];
        var url = baseConfig.businessPath + "/api_apply_room/query_room_history_list";
        var param = {
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
          "params": {
            p_employee_number: window.localStorage.empno
          }
        };
        //hmsPopup.showLoading('请稍候');
        hmsHttp.post(url, param).success(function (result) {
          //hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
          $scope.items = result.result;
          angular.forEach($scope.items,function(data,index,array){
            if(array[index].apply_status=='已入住'){
               array[index].modeCheckIn=true;
               array[index].modeCheckOut=false;
               array[index].modeApproving=false;
               array[index].modeRejected=false;
               array[index].modeCheckingIn=false;
            }else if(array[index].apply_status=='已退房'){
               array[index].modeCheckIn=false;
               array[index].modeCheckOut=true;
               array[index].modeApproving=false;
               array[index].modeRejected=false;
               array[index].modeCheckingIn=false;
            }else if(array[index].apply_status=='审批中'){
              array[index].modeCheckIn=false;
              array[index].modeCheckOut=false;
              array[index].modeApproving=true;
              array[index].modeRejected=false;
              array[index].modeCheckingIn=false;
            }else if(array[index].apply_status=='已拒绝'){
              array[index].modeCheckIn=false;
              array[index].modeCheckOut=false;
              array[index].modeApproving=false;
              array[index].modeRejected=true;
              array[index].modeCheckingIn=false;
            }else if(array[index].apply_status=='未入住'){
              array[index].modeCheckIn=false;
              array[index].modeCheckOut=false;
              array[index].modeApproving=false;
              array[index].modeRejected=false;
              array[index].modeCheckingIn=true;
            }
          });
        }).error(function (error, status) {
          hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(error));
          }
        });
      }
      $scope.goBack = function () {//返回按钮
        $ionicHistory.goBack();
      };

      $scope.createNewDormApply = function () {//跳转到新建申请界面
        $state.go("tab.new-dorm-apply");
      };

      $scope.viewApplyDetail = function (num) {//跳转到申请详情界面
        var info=$scope.items[num];
        var param={
          status:info.apply_status,//申请状态
          checkinDate:info.checkin_date,//入住日期
          checkoutDate:info.checkout_date,//退房日期
          applyType:info.apply_type,//申请类型
          floorNumber:info.floor_number,//楼层
          roomNumber:info.room_number,//房间号
          roomType:info.room_type,//房间类型
          bedNumber:info.bed_number,//床位
          applyId:info.apply_id,//申请id
          projectId:info.project_id,//项目id
          checkinDays:info.checkin_days,//入住天数
          leftDays:info.left_days//剩余天数
        };
        if (param.status == '已入住' || param.status == '已退房') {
          $state.go("tab.dorm-apply-detail-b",{
            'dormApplyDetailInfo':param
          });
        } else if (param.status == '审批中' || param.status == '已拒绝' || param.status == '未入住') {
          $state.go("tab.dorm-apply-detail-a",{
            'dormApplyDetailInfo':param
          });
        }
      };

      $scope.judgeApplyType = function (param) {//通过判断申请类型是否显示剩余天数字段
        var internalParam = param.apply_status;
        if (internalParam == '已入住' || internalParam == '已退房' || internalParam == '未入住') {
          return true;
        } else if (internalParam == '审批中' || internalParam == '已拒绝') {
          return false;
        }
      };
      $scope.showDescription = function () {//显示住宿说明
        $scope.descriptionAppearance = true;
      };
      $scope.hideDescription = function () {//隐藏住宿说明
        $scope.descriptionAppearance = false;
      };
      $rootScope.$on("APPLY_SUCCESS",function(){//空房间申请成功时，返回查询界面自动刷新历史申请数据
        $timeout(function() {
          $ionicScrollDelegate.$getByHandle('dormScroll').scrollTop(false);
        },200);
        searchHistoryApplyListAutomatically();//自动刷新数据
      });
      $rootScope.$on("APPLY_CANCELLED",function(){//审批中状态的申请被删除后，返回了这个界面，自动触发刷新数据
        $timeout(function() {
          $ionicScrollDelegate.$getByHandle('dormScroll').scrollTop(false);
        },200);
        searchHistoryApplyListAutomatically();//自动刷新数据
      });
    }]);

/**
<<<<<<< HEAD
 * Created by gusenlin on 16/4/24.
 */
angular.module('messageModule')

  .controller('messageDetailCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$ionicHistory',
    function ($scope,
              $state,
              $stateParams,
              $ionicHistory) {

      var message = $stateParams.message;
      console.log('message : ' + angular.toJson(message));

      $scope.message = message;

      $scope.goBack = function(){
        $ionicHistory.goBack();
      };

      $scope.$on('$ionicView.enter', function (e) {
        console.log('messageDetailCtrl.$ionicView.enter');
      });
      console.log('messageDetailCtrl.enter');

      $scope.$on('$destroy', function (e) {
        console.log('messageDetailCtrl.$destroy');
      });
    }]);

/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('messageModule')

  .controller('messageDetailCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$ionicHistory',
    function ($scope,
              $state,
              $stateParams,
              $ionicHistory) {

      var message = $stateParams.message;
      console.log('message : ' + angular.toJson(message));

      $scope.message = message;

      $scope.goBack = function(){
        $ionicHistory.goBack();
      };

      $scope.$on('$ionicView.enter', function (e) {
        console.log('messageDetailCtrl.$ionicView.enter');
      });
      console.log('messageDetailCtrl.enter');

      $scope.$on('$destroy', function (e) {
        console.log('messageDetailCtrl.$destroy');
      });
    }]);

angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.workflow-detail', {
          url: '/workflow-detail',
          params: {detail: {}},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/workflow/detail/detail.html',
              controller: 'WorkFLowDetailCtrl'
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
  .controller('WorkFLowDetailCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$ionicModal',
    '$timeout',
    'baseConfig',
    'TimeSheetService',
    'hmsPopup',
    'WorkFLowListService',
    function ($scope,
              $state,
              $stateParams,
              $ionicModal,
              $timeout,
              baseConfig,
              TimeSheetService,
              hmsPopup,
              WorkFLowListService) {
      var detail = $stateParams.detail;
      if(baseConfig.debug){
        console.log('WorkFLowDetailCtrl.detail ' + angular.toJson(detail));
      }

      $scope.historyList = [];
      $scope.singalArrayList = [];
      $scope.multipleArrayList = [];

      //var
      var success = function (result) {
        if(baseConfig.debug){
          console.log('getWorkflowDetail.result ' + angular.toJson(result));
        }
        if(result.status == 'S'){
          $scope.historyList = result.history;
          $scope.singalArrayList = result.workflow_data.details;
          $scope.multipleArrayList = result.workflow_data.lines;
        }
      }
      WorkFLowListService.getWorkflowDetail(success,detail.workflowId,detail.instanceId,'Y');
    }]);

angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.workflow-detail', {
          url: '/workflow-detail',
          params: {detail: {}},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/workflow/detail/detail.html',
              controller: 'WorkFLowDetailCtrl'
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
  .controller('WorkFLowDetailCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$ionicModal',
    '$timeout',
    'baseConfig',
    'TimeSheetService',
    'hmsPopup',
    'WorkFLowListService',
    function ($scope,
              $state,
              $stateParams,
              $ionicModal,
              $timeout,
              baseConfig,
              TimeSheetService,
              hmsPopup,
              WorkFLowListService) {
      var detail = $stateParams.detail;
      if(baseConfig.debug){
        console.log('WorkFLowDetailCtrl.detail ' + angular.toJson(detail));
      }

      $scope.historyList = [];
      $scope.singalArrayList = [];
      $scope.multipleArrayList = [];

      //var
      var success = function (result) {
        if(baseConfig.debug){
          console.log('getWorkflowDetail.result ' + angular.toJson(result));
        }
        if(result.status == 'S'){
          $scope.historyList = result.history;
          $scope.singalArrayList = result.workflow_data.details;
          $scope.multipleArrayList = result.workflow_data.lines;
        }
      }
      WorkFLowListService.getWorkflowDetail(success,detail.workflowId,detail.instanceId,'Y');
    }]);

=======
 * Created by LeonChan on 2016/5/30.
 */
'use strict';
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.new-dorm-apply', {
          url: '/new-dorm-apply',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/dorm-apply/new-dorm-apply.html',
              controller: 'NewDormApplyCtrl'
            }
          }
        })
    }]);
angular.module('applicationModule')
  .controller('NewDormApplyCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$ionicModal',
    'hmsHttp',
    'hmsPopup',
    '$cordovaDatePicker',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              $ionicModal,
              hmsHttp,
              hmsPopup,
              $cordovaDatePicker) {
      $ionicModal.fromTemplateUrl('build/pages/application/dorm-apply/modal/new-dorm-apply-choose-apply-type.html', {//定义modal
        scope: $scope
      }).then(function (modal1) {
        $scope.chooseTypePopup = modal1;
      });//初始化选择申请类型的modal
      $ionicModal.fromTemplateUrl('build/pages/application/dorm-apply/modal/new-dorm-apply-choose-room-type.html', {//定义modal
        scope: $scope
      }).then(function (modal2) {
        $scope.chooseRoomPopup = modal2;
      });//初始化选择房间类型的modal
      $ionicModal.fromTemplateUrl('build/pages/application/dorm-apply/modal/new-dorm-apply-choose-project-name.html', {//定义modal
        scope: $scope
      }).then(function (modal3) {
        $scope.chooseProjectPopup = modal3;
      });//初始化选择房间类型的modal
      $scope.defaultApplyType='常驻申请';//默认申请类型
      $scope.defaultRoomType='单人间';//默认房间类型
      $scope.defaultProjectInfo={
        projectName:'',//项目名称
        projectId:''//项目ID
      };//默认项目名称
      $scope.showProjectItem=false;//显示选择项目的入口
      $scope.applytype=["常驻申请","加班申请","临时申请","项目申请"];//项目申请选项
      $scope.roomtype=["单人间","四人间"];//房间申请
      $scope.projectlist=[];//项目列表
      $scope.showNumButton=true;//显示数字按钮，隐藏图片按钮
      $scope.inputinfo={
        floornum:"",//输入楼层号
        roomnum:""//输入房间号
      };
      var todayDate = new Date();//今天日期
      var weekday=todayDate.getDay();
      var month=todayDate.getMonth()+1;
      var day=todayDate.getDate();
      $scope.startDate={//开始日期
        year:todayDate.getFullYear(),
        month:"",
        day:"",
        weekday:""
      };
      $scope.endDate={//结束日期
        year:"",
        month:"",
        day:"",
        weekday:""
      };
      if(weekday==0){
        $scope.startDate.weekday="周日";
      }else if(weekday==1){
        $scope.startDate.weekday="周一";
      }else if(weekday==2){
        $scope.startDate.weekday="周二";
      }else if(weekday==3){
        $scope.startDate.weekday="周三";
      }else if(weekday==4){
        $scope.startDate.weekday="周四";
      }else if(weekday==5){
        $scope.startDate.weekday="周五";
      }else if(weekday==6){
        $scope.startDate.weekday="周六";
      }
      if(month<10){
        month="0"+month;
      }
      if(day<10){
        day="0"+day;
      }
      $scope.startDate.month=month;
      $scope.startDate.day=day;
      refreshEndDate(1);//结束日期默认比开始晚1天
      var url=baseConfig.businessPath+"/api_apply_room/query_project_list";
      var param={
        "params": {
          p_employee_number:window.localStorage.empno//工号
        }
      };
      hmsPopup.showLoading('请稍候');
      hmsHttp.post(url,param).success(function(result){//自动获取项目列表信息
        hmsPopup.hideLoading();
        if(result.status=="S"){
          $scope.projectlist=result.result;
          $scope.projectlist=$scope.projectlist.splice(1,$scope.projectlist.length-1);
          if($scope.projectlist.length>0){//如果查出结果的项目列表长度大于1的话则抓取第一个
            $scope.defaultProjectInfo.projectName=$scope.projectlist[0].project_name;
            $scope.defaultProjectInfo.projectId=$scope.projectlist[0].project_id;
            console.log(angular.toJson($scope.defaultProjectInfo));
          }else if($scope.projectlist.length==0){//如果查出项目列表的长度为0的话，则自动把默认变为无
            $scope.defaultProjectInfo.projectName='无';
            $scope.defaultProjectInfo.projectId='';
          }
        }
        if (baseConfig.debug) {
          console.log("result success " + angular.toJson(result));
        }
      }).error(function(error){
        hmsPopup.hideLoading();
        if (baseConfig.debug) {
          console.log("response error " + angular.toJson(error));
        }
      });

      function refreshEndDate(num){//选择30,60,90后刷新结束日期
        var myDate=$scope.startDate;
        var todayDate=new Date(myDate.year,myDate.month-1,myDate.day);
        var tomorrowDate=new Date(myDate.year,myDate.month-1,myDate.day);
        var tomorrowYear="";
        var tomorrowDay="";
        var tomorrowMonth="";
        var tomorrowWeekDay="";
        num=parseInt(num);
        tomorrowDate.setDate(todayDate.getDate()+num);
        tomorrowYear=tomorrowDate.getFullYear();
        tomorrowDay=tomorrowDate.getDate();
        tomorrowMonth=tomorrowDate.getMonth()+1;
        tomorrowWeekDay=tomorrowDate.getDay();
        if(tomorrowWeekDay==0){
          $scope.endDate.weekday="周日";
        }else if(tomorrowWeekDay==1){
          $scope.endDate.weekday="周一";
        }else if(tomorrowWeekDay==2){
          $scope.endDate.weekday="周二";
        }else if(tomorrowWeekDay==3){
          $scope.endDate.weekday="周三";
        }else if(tomorrowWeekDay==4){
          $scope.endDate.weekday="周四";
        }else if(tomorrowWeekDay==5){
          $scope.endDate.weekday="周五";
        }else if(tomorrowWeekDay==6){
          $scope.endDate.weekday="周六";
        }
        if(tomorrowMonth<10){
          tomorrowMonth="0"+tomorrowMonth;
        }
        if(tomorrowDay<10){
          tomorrowDay="0"+tomorrowDay;
        }
        $scope.endDate.year=tomorrowYear;
        $scope.endDate.month=tomorrowMonth;
        $scope.endDate.day=tomorrowDay;
      };

      $scope.goBack=function(){//返回按钮
        $ionicHistory.goBack();
      };

      $scope.chooseStartDate=function(){//选择开始日期
        var myDate=$scope.startDate;
        var previousDate=new Date(myDate.year,myDate.month-1,myDate.day);
        var options={
          date: previousDate,
          mode: 'date',
          titleText:'请选择入住日期',
          okText:'确定',
          cancelText:'取消',
          doneButtonLabel:'确认',
          cancelButtonLabel:'取消',
          androidTheme : window.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
          locale:"zh_cn"
        }
        $cordovaDatePicker.show(options).then(function(date){
          var month=date.getMonth()+1;
          var day=date.getDate();
          var weekday=date.getDay();
          if(weekday==0){
            $scope.startDate.weekday="周日";
          }else if(weekday==1){
            $scope.startDate.weekday="周一";
          }else if(weekday==2){
            $scope.startDate.weekday="周二";
          }else if(weekday==3){
            $scope.startDate.weekday="周三";
          }else if(weekday==4){
            $scope.startDate.weekday="周四";
          }else if(weekday==5){
            $scope.startDate.weekday="周五";
          }else if(weekday==6){
            $scope.startDate.weekday="周六";
          }
          if(month<10){
            month="0"+month;
          }
          if(day<10){
            day="0"+day;
          }
          $scope.startDate.year=date.getFullYear();
          $scope.startDate.month=month;
          $scope.startDate.day=day;
          $scope.$apply();
        });
      };

      $scope.chooseEndDate=function() {//选择结束
        var myDate=$scope.endDate;
        var previousDate=new Date(myDate.year,myDate.month-1,myDate.day);
        var options={
          date: previousDate,
          mode: 'date',
          titleText:'请选择结束日期',
          okText:'确定',
          cancelText:'取消',
          doneButtonLabel:'确认',
          cancelButtonLabel:'取消',
          androidTheme : window.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK,
          locale:"zh_cn"
        }
        $cordovaDatePicker.show(options).then(function(date){
          var month=date.getMonth()+1;
          var day=date.getDate();
          var weekday=date.getDay();
          if(weekday==0){
            $scope.endDate.weekday="周日";
          }else if(weekday==1){
            $scope.endDate.weekday="周一";
          }else if(weekday==2){
            $scope.endDate.weekday="周二";
          }else if(weekday==3){
            $scope.endDate.weekday="周三";
          }else if(weekday==4){
            $scope.endDate.weekday="周四";
          }else if(weekday==5){
            $scope.endDate.weekday="周五";
          }else if(weekday==6){
            $scope.endDate.weekday="周六";
          }
          if(month<10){
            month="0"+month;
          }
          if(day<10){
            day="0"+day;
          }
          $scope.endDate.year=date.getFullYear();
          $scope.endDate.month=month;
          $scope.endDate.day=day;
          $scope.$apply();
        });
      };

<<<<<<< HEAD
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.flybackApply', {
          url: '/flyback-apply',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/flyback/apply/apply.html',
              controller: 'FlyBackApplyCtrl'
=======
      $scope.chooseLongDays=function(num){//选择30,60,90天的点击事件
        refreshEndDate(num);
        $scope.showNumButton=true;
      };

      $scope.chooseApplyType=function(){//显示申请类型modal
        $scope.chooseTypePopup.show();
      };

      $scope.chooseRoomType=function(){//显示房间类型modal
        $scope.chooseRoomPopup.show();
      };

      $scope.chooseProjectName=function(){//显示项目名称列表modal
        if($scope.projectlist.length==0){
          hmsPopup.showShortCenterToast('项目列表为空，请更改申请类型');//项目列表为空时
        }else if($scope.projectlist.length>0){
          $scope.chooseProjectPopup.show();
        }
      };

      $scope.finishChoosingApplyType=function(param){//选择完成申请类型
        $scope.defaultApplyType=param;
        if($scope.defaultApplyType=='项目申请'){
          $scope.showProjectItem=true;
        }else if($scope.defaultApplyType!='项目申请'){
          $scope.showProjectItem=false;
        }
        $scope.chooseTypePopup.hide();
      };

      $scope.finishChoosingRoomType=function(param){//选择完成房间类型
        $scope.defaultRoomType=param;
        $scope.chooseRoomPopup.hide();
      };

      $scope.finishChoosingProjectName=function(num){
        $scope.defaultProjectInfo.projectName=$scope.projectlist[num].project_name;
        $scope.defaultProjectInfo.projectId=$scope.projectlist[num].project_id;
        $scope.chooseProjectPopup.hide();
      };

      $scope.chooseDays=function(){//选择入住天数以及取消入住天数
        if($scope.defaultApplyType=='常驻申请'){
          $scope.showNumButton=!$scope.showNumButton;
        }
      };

      $scope.searchVacantRoom=function(){//查询空闲房间
        var startYear=$scope.startDate.year;//开始日期年份
        var startMonth=$scope.startDate.month;//开始日期月份
        var startDay=$scope.startDate.day;//开始日期
        var endYear=$scope.endDate.year;//结束日期年份
        var endMonth=$scope.endDate.month;//结束日期月份
        var endDay=$scope.endDate.day;//结束日期
        startMonth=parseInt(startMonth);
        startDay=parseInt(startDay);
        endMonth=parseInt(endMonth);
        endDay=parseInt(endDay);
        if($scope.defaultProjectInfo.projectName=='无' && $scope.defaultApplyType=='项目申请'){//项目申请类型，当项目列表为空时，不能查询房间
          hmsPopup.showShortCenterToast('项目列表为空，请更改申请类型');
        }else if( (startYear>endYear) ||((startYear==endYear)&&(startMonth>endMonth)) || ((startYear==endYear)&&(startMonth==endMonth)&&(startDay>endDay))){
          hmsPopup.showShortCenterToast('入住日期不能晚于结束日期');
        }else{
          var url = baseConfig.businessPath + "/api_apply_room/query_free_room_list";
          var param = {
            "params": {
              p_employee_number: window.localStorage.empno,
              p_check_in_date: $scope.startDate.year+"-"+$scope.startDate.month+"-"+$scope.startDate.day,
              p_check_out_date: $scope.endDate.year+"-"+$scope.endDate.month+"-"+$scope.endDate.day,
              p_apply_type: $scope.defaultApplyType,
              p_room_type: $scope.defaultRoomType,
              p_room_number: $scope.inputinfo.roomnum,
              p_floor_number: $scope.inputinfo.floornum,
              p_pro_id:""
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
            }
          };
          if($scope.defaultApplyType=='项目申请'){
           param.params.p_pro_id=$scope.defaultProjectInfo.projectId;
          }
<<<<<<< HEAD
        });
    }])

angular.module("applicationModule")
  .controller('FlyBackApplyCtrl', [
=======
          hmsPopup.showLoading('请稍候');
          hmsHttp.post(url, param).success(function (result) {
            var message = result.message;
            hmsPopup.hideLoading();
            if (result.status == "S" && result.result.length > 0) {
              var resultlist = result.result;//查询结果列表
              var info = {//要放入到service中的信息
                applyType: param.params.p_apply_type,
                checkinDate: param.params.p_check_in_date,
                checkoutDate: param.params.p_check_out_date,
                result: resultlist
              };
              $state.go("tab.dorm-apply-vacant-room",{
                'dormApplySearchResult':info,
                'projectId':$scope.defaultProjectInfo.projectId,
                'applyType':$scope.defaultApplyType
              });
            } else if (result.status == "E") {
              hmsPopup.showShortCenterToast(message);
            }
            if (baseConfig.debug) {
              console.log("result success " + angular.toJson(result));
            }
          }).error(function (error, status) {
            hmsPopup.hideLoading();
            if (baseConfig.debug) {
              console.log("response error " + angular.toJson(error));
            }
          });
        }
      };
    }]);

angular.module("applicationModule")
.factory('flaybackService', ['$ionicLoading', function ($ionicLoading) {
  var projName = "";
  var projCode = "";
  var ticketTypeList = [];
  var routeTypeList = [];
  var passengerList = [];
  var passenger = "";
  var certification = "";
  var fbLines = [];
  var pageStatusCreate = {};// var param = {"canEdit": true,"dataSource":"create"}
  function getFormatDate(date) {
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    return date.getFullYear() + seperator1 + month + seperator1 + strDate;
  }
  return {
    getFormatDate: getFormatDate,
    getNowFormatDate: function () {
      var date = new Date();
      var seperator = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator + month + seperator + strDate;
      return currentdate;
    },
    setPageStatusCreate: function (obj) {
      pageStatusCreate = obj;
    },
    getPageStatusCreate: function (obj) {
      return pageStatusCreate;
    },
    setProjName: function (obj) {
      projName = obj;
    },
    getProjName: function (obj) {
      return projName;
    },
    setProjCode: function (obj) {
      projCode = obj;
    },
    getProjCode: function (obj) {
      return projCode;
    },
    setTicketTypeList: function (obj) {
      ticketTypeList = obj;
    },
    getTicketTypeList: function (obj) {
      return ticketTypeList;
    },
    setRouteTypeList: function (obj) {
      routeTypeList = obj;
    },
    getRouteTypeList: function (obj) {
      return routeTypeList;
    },
    setPassengerList: function (obj) {
      passengerList = obj;
    },
    getPassengerList: function (obj) {
      return passengerList;
    },
    setPassenger: function (obj) {
      passenger = obj;
    },
    getPassenger: function (obj) {
      return passenger;
    },
    setCertification: function (obj) {
      certification = obj;
    },
    getCertification: function (obj) {
      return certification;
    },
    addLine: function (obj) {
      /* var flight_date = getFormatDate(new Date(obj.flight_date));
       obj.flight_date = flight_date;*/
      fbLines.push(obj);
    },
    updateLine: function (obj, index) {
      var flight_date = getFormatDate(new Date(obj.flight_date));
      obj.flight_date = flight_date;
      fbLines[index] = obj;
    },
    getLines: function () {
      return fbLines;
    },
    setLines: function (obj) {
      fbLines = obj;
    },
    /* deleteLine: function (item) {
     //  fbLines.splice(index, 1);
     console.log("fbLines.indexOf(item) = " + fbLines.indexOf(item));
     console.log("fbLines  = " + angular.toJson(fbLines));
     console.log("item  = " + angular.toJson(item));
     fbLines.splice(fbLines.indexOf(item), 1);
     },*/
    deleteLine: function (index) {
      fbLines.splice(index, 1);
    },
    clearLines: function () {
      fbLines = [];
    }

  }

}])
;

angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.personnel-policy', {
          url: '/personnel-policy',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/personnel-policy/personnel-policy.html',
              controller: 'PersonnelPolicyCtrl'
            }
          }
        })
    }]);

<<<<<<< HEAD
angular.module('applicationModule')
  .controller('PersonnelPolicyCtrl', [
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
<<<<<<< HEAD
    '$timeout',
    'hmsHttp',
    '$ionicModal',
    'flaybackService',
=======
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory) {

      $scope.goBack=function(){
        $ionicHistory.goBack();
      };
      $scope.openwin=function($url){
        //window.open($url,'newwindow','top=0,left=0,toolbar=yes,menubar=yes,scrollbars=yes,resizable=yes,location=yes,status=yes');
        window.open("http://www.daxuequan.org/ceshi/"+$url, '_system', 'location=yes');
        };
    }]
);



/** Author      : joshua.shi
 *
 *  History:
 *      1.00    2016-4-28   joshua.shi   Creation
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.time-off-manage', {
          url: '/time-off-manage',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/time-off-manage/time-off-manage-list.html',
              controller: 'TimeOffManageCtrl'
            }
          }
        })
    }]);

angular.module('applicationModule')

  .controller('TimeOffManageCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    'hmsHttp',
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
    'hmsPopup',
    '$ionicHistory',
    function ($scope,
              $state,
              baseConfig,
              hmsHttp,
              hmsPopup,
              $ionicHistory) {

      $scope.timeOffHeader       ={
        userId                 : 999,
        paidHoliday            : 9,
        paidSickLeave          : 9,
        extPaidHoliday         : 9,
        usedPaidHoliday        : 9,
        usedPaidSickLeave      : 9,
        usedExtPaidHoliday     : 9
      };

      $scope.timeOffHistoryList  =[
        {
        holidayIcon          : 'build/img/application/time-off-manage/PaidHoliday@3x.png',
        timeOffType          : 'paid-holiday',
        timeOffTypeMeaning   : '带薪年假',
        datetimeFrom         : '2016-6-16',
        datetimeTo           : '2016-6-18',
        timeLeave            : '2天',
        approveStatus        : 'APPROVED',
        approveStatusMeaning : '已审批',
        applyReason          : '陪老婆去迪斯尼玩',
        reason_image         : [
          {
            image_url1       : '',
            image_url2       : '',
            image_url3       : '',
            image_url4       : '',
            image_url5       : '',
            image_url6       : '',
            image_url7       : '',
            image_url8       : '',
            image_url9       : '',
          }
        ]
      }];


      $scope.timeOffCreate = function(){

      }


      function getServeData() {

        var requestUrl = baseConfig.businessPath + "/api_holiday/get_holidays_data";
        var requestParams = {
          "params": {
            "p_employee_code": window.localStorage.empno
          }
        };

        hmsHttp.post(requestUrl, requestParams).success(function (response) {
          hmsPopup.hideLoading();
          if (hmsHttp.isSuccessfull(response.status)) {

            var baseImgUrl = 'build/img/application/time-off-manage/';

            //处理前置结构
            if(response.result[0]) {
              var responseData = response.result[0];
            }else{
              hmsPopup.showShortCenterToast("服务器返回结构解析错误!");
              return;
            }

            //将获取到的数据绑定到页面
            //赋值头数据
            $scope.timeOffHeader.paidHoliday        = responseData.paidHoliday;
            $scope.timeOffHeader.paidSickLeave      = responseData.paidSickLeave;
            $scope.timeOffHeader.extPaidHoliday     = responseData.extPaidHoliday;
            $scope.timeOffHeader.usedPaidHoliday    = responseData.usedPaidHoliday;
            $scope.timeOffHeader.usedPaidSickLeave  = responseData.usedPaidSickLeave;
            $scope.timeOffHeader.usedExtPaidHoliday = responseData.usedExtPaidHoliday;

            //赋值行数据
            $scope.timeOffHistoryList  = [];
            $scope.timeOffHistoryList = responseData.timeOffHistory;


            //1:带薪年假，2,额外福利年假，3:事假，4.带薪病假，5.病假，6.婚嫁，7.产假，8.丧假，9.陪产假
            angular.forEach($scope.timeOffHistoryList, function (data, index) {
              if ('1' == data.timeOffType) {
                data.holidayIcon        = baseImgUrl + 'PaidHoliday@3x.png';
                data.timeOffTypeMeaning = '带薪年假';
              } else if ('2' == data.timeOffType) {
                data.holidayIcon         = baseImgUrl + 'ExtPaidHoliday@3x.png';
                data.timeOffTypeMeaning  = '额外福利年假';
              } else if ('3' == data.timeOffType) {
                data.holidayIcon         = baseImgUrl + 'CasualLeave@3x.png';
                data.timeOffTypeMeaning  = '事假';
              } else if ('4' == data.timeOffType) {
                data.holidayIcon         = baseImgUrl + 'SickLeave@@3x.png';
                data.timeOffTypeMeaning  = '带薪病假';
              } else if ('5' == data.timeOffType) {
                data.holidayIcon         = baseImgUrl + 'SickLeave@3x.png';
                data.timeOffTypeMeaning  = '病假';
              } else if ('6' == data.timeOffType) {
                data.holidayIcon         = baseImgUrl + 'HoneyMood@3x.png';
                data.timeOffTypeMeaning  = '婚嫁';
              } else if ('7' == data.timeOffType) {
                data.holidayIcon         = baseImgUrl + 'MaternityLeave@3x.png';
                data.timeOffTypeMeaning  = '产假';
              } else if ('8' == data.timeOffType) {
                data.holidayIcon         = baseImgUrl + 'ExtPaidHoliday@3x.png';
                data.timeOffTypeMeaning  = '丧假';
              } else if ('9' == data.timeOffType) {
                data.holidayIcon         = baseImgUrl + 'PaternityLeave@3x.png';
                data.timeOffTypeMeaning  = '陪产假';
              }

              //1.审批通过：APPROVED,2.审批中：APPROVING,3：审批拒绝：REJECTED,4.草稿：DRAFT
              if ('APPROVED'         == data.approveStatus) {
                data.approveStatusMeaning = '审批通过';
              } else if ('APPROVING' == data.approveStatus) {
                data.approveStatusMeaning = '审批中';
              } else if ('REJECTED'  == data.approveStatus) {
                data.approveStatusMeaning = '审批拒绝';
              } else if ('DRAFT'     == data.approveStatus) {
                data.approveStatusMeaning = '草稿';
              }
            });

            //$scope.$apply();

          } else {
            if (response.status === 'E' || response.status == 'e') {
              hmsPopup.showShortCenterToast("没有相关数据!");
            } else {
              hmsPopup.showShortCenterToast("网络异常,请稍后重试!");
            }
          }
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast("服务请求异常,请检查网络连接和输入参数后重新操作!");
        });
      };

      getServeData();
    }]);

angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.flybackApply', {
          url: '/flyback-apply',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/flyback/apply/apply.html',
              controller: 'FlyBackApplyCtrl'
            }
          }
        });
    }])
=======
/**
 * Created by wuxiaocheng on 15/8/26.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.acc_detail', {
          url: '/acc/detail',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/acc/accountDetail.html',
              controller: 'accountDetailController',
              cache: false
            }
          }
        });
    }]);

angular.module("applicationModule")
    .controller('accountDetailController', function($scope,keepAccount,expenseApply,expenseObject,dialog,$http,$rootScope,$state, $ionicHistory, $ionicLoading, baseConfig) {

        $scope.canEdit=keepAccount.canEdit;
        $scope.canUpload=keepAccount.canUpload;
        $scope.accountDetail=keepAccount.data;

        expenseObject.businessType = 'ACC';

        /*
        $ionicLoading.show({
            template: 'Loading ... ',
            duration: 1000
        });
        */
        //showMessage(angular.toJson($scope.accountDetail));
        //showMessage(angular.toJson(keepAccount.data));

        $scope.currentProgress = '';
        $scope.photoPathURL = baseConfig.appRootPath;




        /*是否隐藏 从记一笔创建 按钮的标识位 ,当来源为ACCOUNT 时表示从记一笔端进入，此时隐藏改按钮*/
        var sourceFrom=keepAccount.sourceFrom;
        if(sourceFrom=="ACCOUNT"){    //ACCOUNT  表示从记一笔进入
            if (keepAccount.canEdit == true) {
                $scope.title = '记一笔';
            }
            else {
                $scope.title = "记一笔"
            }
            //$scope.title="记一笔";
        }else{                        //EXPENSE 或其他  表示从报销单进入
            $scope.title="报销明细";
        }

            if (sourceFrom==1) {

            }
        /******
         *  照片响应
         */
        $scope.showPhoto=function(){
            $scope.valueChange();
            //globalNavigator.pushPage('html/acc/photos.html', { animation : 'slide' });

            $state.go('tab.acc_photos');
            //showMessage("t");
            //$state.go("tab.acc_photoDetail");

        };



        if (keepAccount.canEdit == true && keepAccount.boolLoadExpenseObject == true){
            $ionicLoading.show({
                template: '下载基础后台数据 ... '
                //duration: 3000
            });

            /****************
             *  查看
             *
             */
            var promise = expenseObject.queryProjectList();
            promise.then(function (response) {

                //console.log(angular.toJson(response));
                //showMessage("status -" +response["status"]);


                if(response["status"] == "S") {



                    keepAccount.boolLoadExpenseObject = false;
                    // 清空 数据

                    keepAccount.projectList = [];
                    keepAccount.expenseItemList = [];
                    keepAccount.expenseCostList = [];



                    // 项目列表
                    var proj_tmp = response["proj"];
                    $.each(proj_tmp, function (i, value) {
                        var item = {
                            expenseObject_id : value.pj_id,
                            expenseObject_code:value.pj_code,
                            expenseObject_desc : value.pj_name,
                            expenseObject_type : value.cost_type,
                            //expenseItemList: value.expense,
                            expenseItemList_index:i
                        };


                        // 如果 当前 费用对象 匹配  加载费用类型 列表
                        if ($scope.accountDetail.expenseObject_id == item.expenseObject_id ) {
                          var promise=expenseObject.queryExpenseList(item.expenseObject_id, item.expenseObject_code);

                          promise.then(function (response) {
                            //console.log("接口返回数据+++：" + angular.toJson(response));
                            // 费用类型
                            var expenseItemList_tmp =  response.expense;
                            //console.log("=========: " + angular.toJson(expenseItemList_tmp));
                            $.each(expenseItemList_tmp, function (i, value) {
                              var item = {
                                expense_item_code : value.exp_code,
                                expense_item_desc:value.exp_name,
                                expense_item_house:value.exp_house,
                                expense_item_index:i

                              };

                              // 租房
                              if($scope.accountDetail.expense_item_code == item.expense_item_code) {

                                var expenseHouseList_tmp =  item.expense_item_house;

                                $.each(expenseHouseList_tmp, function (i, value) {
                                  var item = {
                                    costObjectId : value.id,
                                    desc:value.name

                                  };

                                  keepAccount.expenseCostList.push(item);

                                });



                                console.log("coutList -- "+angular.toJson( keepAccount.expenseCostList));
                              }

                              keepAccount.expenseItemList.push(item);

                            });
                          }, function (response) {
                            //alert("网络连接错误,初始化数据 projectList");
                            showMessage(response);
                            $ionicLoading.hide();
                            $ionicLoading.show({
                              template: '网络连接错误,初始化数据 ',
                              duration: 500
                            });
                          });
                        }

                        keepAccount.projectList.push(item);

                    });

                    //console.log( keepAccount.projectList);

                    //$scope.projectList = keepAccount.projectList;
                    //console.log( angular.toJson($scope.projectList));

                    $ionicLoading.hide();

                } else {
                    var errmsg = data["message"];
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        template: errmsg,
                        duration: 1000
                    });
                }





            }, function (response) {
                //alert("网络连接错误,初始化数据 projectList");

                dialog.showAlert("E",response);
                $ionicLoading.hide();
                $ionicLoading.show({
                    template: '网络连接错误,初始化数据 ',
                    duration: 1000
                });


            });
        }


       // */


    /**
     * 保存数据至本地数据库
     * */
    $scope.saveData=function(){
        //showMessage($scope.accountDetail.photos[0].photo_src);

        var date_from= getFormatDate(new Date($scope.accountDetail.expense_date_from));
        var date_to= getFormatDate(new Date($scope.accountDetail.expense_date_to));


        //-------------------------------
        //          合法性 检验
        //-------------------------------
        var checkDataValid = true;
        var msg = "";
        if(date_from>date_to) {

            //showMessage("开始日期大于结束日期");
            //dialog.showAlert("I","开始日期大于结束日期");

            msg = msg+"开始日期大于结束日期";
            checkDataValid = false;
        }

        //"费用类型为水电燃气费是，没有判断租房信息必须输入
        //（此5项费用类型都需要判断租房信息必须输入：租房租金费用、住宿杂项费、固定通讯费、水电燃气费、赔偿房东押金）"


        if ($scope.accountDetail.costObject_id == '' || $scope.accountDetail.costObject_id == undefined ||
            $scope.accountDetail.costObject_id == null ) {

            var code = isNeedHouseApply($scope.accountDetail.expense_item_code );

            //showMessage("租房 必输检查"+ code);
            //dialog.showAlert("I","租房 必输检查"+ code);


            // 判断 是否 需要 租房申请的5类费用 之中
            if ( code == true ) {
                checkDataValid = false;

                //dialog.showAlert("I","租房信息 不能为空");

                msg = msg+" 租房信息 不能为空";
>>>>>>> xbr


            }

        }


        if (checkDataValid == false) {

            dialog.showAlert("I",msg);

            /*
            $ionicLoading.show({
                template: '数据不合法，请修改后重试 ',
                duration: 1000
            });
            */

            //showMessage("租房信息 不能为空");
            //checkDataValid = false;
        }
        else {


            $ionicLoading.show({
                template: '数据保存中 ... '
            });



            var sum = 0;


            if(keepAccount.operation=="INSERT"){

                //showMessage("准备插入2");

                sum=($scope.accountDetail.expense_price*$scope.accountDetail.expense_quantity*$scope.accountDetail.exchange_rate).toFixed(2);


                $scope.accountDetail.total_amount=sum==NaN?0:sum;

                $scope.accountDetail.local_status="NEW";

                keepAccount.data=$scope.accountDetail;

                var promise=keepAccount.insert();
                promise.then(
                    function(lineID){
                        showMessage("保存成功--line_id:"+lineID);
                        dialog.showAlert("I","新建成功");

                        keepAccount.data.line_id=lineID;
                        keepAccount.operation="UPDATE";
                        keepAccount.canUpload=true;
                        $scope.canUpload=true;
                        $ionicLoading.hide();
                    },
                    function(err){
                        $ionicLoading.hide();

                        showMessage(err);
                    }
                )
            }else if(keepAccount.operation=="UPDATE"){
                showMessage("update");

                sum=($scope.accountDetail.expense_price*$scope.accountDetail.expense_quantity*$scope.accountDetail.exchange_rate).toFixed(2);
                $scope.accountDetail.total_amount=sum==NaN?0:sum;
                $scope.accountDetail.local_status="NEW";
                keepAccount.data=$scope.accountDetail;
                var promise=keepAccount.update();
                promise.then(
                    function(lineID){
                        showMessage("更新成功--line_id:"+keepAccount.data.line_id+' return '+lineID);
                        dialog.showAlert("I","更新成功");

                        //keepAccount.data.line_id=lineID;
                        keepAccount.operation="UPDATE";
                        keepAccount.canUpload=true;
                        $scope.canUpload=true;
                        $ionicLoading.hide();

                    },
                    function(err){
                        $ionicLoading.hide();

                        showMessage(err);

                        dialog.showAlert("E","更新失败"+err);

                    }
                )
            }
        }
    };

    // 判断是否可删除
    $scope.canToRemove = function() {
        /*
         if (loanApply.data.status ==  'NEW' ||  loanApply.data.status == 'REJECTED') {
         return true;
         }else {
         return false;
         }
         */
        //return (loanApply.data.status ==  'NEW' ||  loanApply.data.status == 'REJECTED');
        return (keepAccount.data.local_status ==  'NEW' );

    };

    // 删除记一笔
    $scope.removeData=function() {
        var promise = keepAccount.remove(keepAccount.data.line_id);
        promise.then(
            function(response) {  // 调用承诺API获取数据 .resolve

                  //  showMessage("数据删除成功");
                dialog.showAlert("I","数据删除成功");


                removePhotoFiles();

                    //var pages = globalNavigator.getPages();
                    //console.log(pages);
                    //pages[pages.length - 1].destroy();
                    //pages[pages.length - 1].destroy();
                    //globalNavigator.pushPage(moduleHtmlPath.ACC+'accountList.html', { animation : 'slide' } );

                    //loanApply.applyList = response.body.tempRecord;
                    //$scope.expenseList=response.body.list;

            },
            function(err) {  // 处理错误 .reject
                //showMessage("删除失败...."+angular.toJson(err));
                dialog.showAlert("E","删除失败...."+angular.toJson(err));

            }
        )
    };


        /**********

            上传数据
         *************/
        $scope.uploadDataTest=function(){

            //showMessage("上传成功");
           // /*

            $ionicLoading.show({
                template: '数据检验...'
                //duration: 1000
            });

            //-------------------------------
            //          合法性 检验
            //-------------------------------
            var checkDataValid = true;


            if (keepAccount.data.costObject_id == '' || keepAccount.data.costObject_id == undefined ||
                keepAccount.data.costObject_id == null ) {


                //showMessage("合法性检验");
                checkDataValid = keepAccount.checkCostObject(
                    keepAccount.data.expenseObject_type,
                    keepAccount.data.expense_item_code,
                    keepAccount.data.total_amount
                );

            }
            if (checkDataValid == false ) {

                $ionicLoading.hide();
                $ionicLoading.show({
                    template: '预报销申请不能为空...',
                    duration: 1000
                });

            }
            else {
                $ionicLoading.show({
                    template: '上传数据中...'
                    //duration: 1000
                });
                uploadDataUnit();

            }

            //showUploadProgress("准备上传:");



             //*/
        };

        function uploadDataUnit () {

            var form=new FormData();

            var myDate = new Date();

            var month = fillNumberBySize(myDate.getMonth()+1,2);
            var date = fillNumberBySize(myDate.getDate(),2);
            var hours = fillNumberBySize(myDate.getHours(),2);
            var minutes = fillNumberBySize(myDate.getMinutes(),2);
            var seconds = fillNumberBySize(myDate.getSeconds(),2);
            var milliseconds = fillNumberBySize(myDate.getMilliseconds(),3);


            var expense_detail_id = window.localStorage.empno+myDate.getFullYear()
                    +month+date+hours+minutes+seconds+milliseconds;

            //var expense_detail_id_copy = myDate.toLocaleString();        //获取日期与时间


            showMessage(expense_detail_id);

            //console.log(expense_detail_id+" - "+expense_detail_id_copy);


            form.append("expense_detail_id",expense_detail_id);


            /*
            form.append("line_id",keepAccount.data.line_id);
            form.append("expense_type_id",keepAccount.data.expense_type_id);
            form.append("expense_type_desc",keepAccount.data.expense_type_desc);
            form.append("expense_item_id",keepAccount.data.expense_item_id);
            form.append("expense_item_desc",keepAccount.data.expense_item_desc);
            form.append("expense_price",keepAccount.data.expense_price);
            form.append("expense_quantity",keepAccount.data.expense_quantity);
            form.append("currency_code",keepAccount.data.currency_code);
            form.append("currency_code_desc",keepAccount.data.currency_code_desc);
            form.append("exchange_rate",keepAccount.data.exchange_rate);
            form.append("total_amount",keepAccount.data.total_amount);
            //        form.append("expense_date_from", keepAccount.data.expense_date_from);
            //        form.append("expense_date_to",keepAccount.data.expense_date_to);
            form.append("expense_date_from", getFormatDate(new Date(keepAccount.data.expense_date_from))); //getFormatDate(new Date(this.data.expense_date_from)) getFormatDate(new Date())
            form.append("expense_date_to",getFormatDate(new Date(keepAccount.data.expense_date_to)));    //getFormatDate(new Date(this.data.expense_date_from))
            form.append("expense_place",keepAccount.data.expense_place);
            form.append("description",keepAccount.data.description);
            form.append("created_by",keepAccount.data.created_by);

        */


            //showMessage("将执行上传:"+angular.toJson(form));
            //showUploadProgress("执行上传中，上传时长与附件数量有关");
            //uploadProgressModal.show();
            var Photos=keepAccount.data.photos;
            //var promise= keepAccount.uploadData(form,Photos);
            //var promise= keepAccount.uploadDataByJosn(keepAccount.data);
            var promise= keepAccount.uploadDataV2(form,Photos);

            promise.then(
                function(response) {
                    //var code=getResponseCode(response);
                    showMessage(angular.toJson(response));
                    var code = response.head.code;
                    if(code=="success"){
                        //接受返回参数
                        //keepAccount.data.expenseDetailId=response.body.expenseDetailId;

                        // 开始 上传数据

                        var upload_option = {
                            source_code: "HIH_PIC_UPLOAD",
                            source_line_id: expense_detail_id

                        };

                        var p2= keepAccount.uploadDataByJosn(keepAccount.data,upload_option);
                        p2.then(

                            function(res){

                                var code = res.status;
                                if(code=="S"){

                                    // $ionicLoading.hide();
                                    showMessage("上传成功 数据"+angular.toJson(res));


                                    keepAccount.data.local_status="UPLOADED";
                                    $scope.accountDetail=keepAccount.data;
                                    keepAccount.canEdit=false;
                                    $scope.canEdit=false;
                                    //更新本地数据库，修改local_status
                                    var p=keepAccount.updateLocalStatus(keepAccount.data.line_id,"UPLOADED");
                                    p .then(
                                        function(res){

                                            $ionicLoading.hide();
                                            showMessage("上传成功"+angular.toJson(res));

                                            dialog.showAlert("I","上传成功");


                                            //若此时的sourceFrom 为报销单，将keepAccount.data 的数据赋值给 expenseApply.data.lines ,完成值传递
                                            if(sourceFrom=="EXPENSE"){
                                                var line={
                                                    appSourceId:keepAccount.data.expenseDetailId,
                                                    price:keepAccount.data.expense_price,
                                                    quantity:keepAccount.data.expense_quantity,
                                                    expenseTypeId:keepAccount.data.expense_type_id,
                                                    expenseTypeName:keepAccount.data.expense_type_desc,
                                                    expenseItemId:keepAccount.data.expense_item_id,
                                                    expenseItemName:keepAccount.data.expense_item_desc,
                                                    place:keepAccount.data.expense_place,
                                                    dateFrom:keepAccount.data.expense_date_from,
                                                    dateTo:keepAccount.data.expense_date_to,
                                                    originalCurrency:keepAccount.data.currency_code,
                                                    exchangeRate:keepAccount.data.exchange_rate,
                                                    description:keepAccount.data.description
                                                };
                                                expenseApply.data.lines.push(line);
                                                //globalNavigator.popPage();

                                                $ionicHistory.goBack();
                                            }
                                        },
                                        function(e){
                                            $ionicLoading.hide();

                                            dialog.showAlert("E","上传失败"+angular.toJson(e) );

                                            showMessage(angular.toJson(e));
                                        }
                                    );

                                }
                                else {
                                    showMessage("上传失败 数据"+angular.toJson(res));
                                    dialog.showAlert("E","上传失败 数据"+angular.toJson(e));


                                }



                                /**

                                //若此时的sourceFrom 为报销单，将keepAccount.data 的数据赋值给 expenseApply.data.lines ,完成值传递
                                if(sourceFrom=="EXPENSE"){
                                    var line={
                                        appSourceId:keepAccount.data.expenseDetailId,
                                        price:keepAccount.data.expense_price,
                                        quantity:keepAccount.data.expense_quantity,
                                        expenseTypeId:keepAccount.data.expense_type_id,
                                        expenseTypeName:keepAccount.data.expense_type_desc,
                                        expenseItemId:keepAccount.data.expense_item_id,
                                        expenseItemName:keepAccount.data.expense_item_desc,
                                        place:keepAccount.data.expense_place,
                                        dateFrom:keepAccount.data.expense_date_from,
                                        dateTo:keepAccount.data.expense_date_to,
                                        originalCurrency:keepAccount.data.currency_code,
                                        exchangeRate:keepAccount.data.exchange_rate,
                                        description:keepAccount.data.description
                                    };
                                    expenseApply.data.lines.push(line);
                                    //globalNavigator.popPage();

                                    $ionicHistory.goBack();
                                }

                                 */
                            },
                            function(e){
                                $ionicLoading.hide();

                                dialog.showAlert("E","上传失败"+angular.toJson(e));

                                showMessage(angular.toJson(e));
                            }

                        );




                    }else if(code=="E"){
                        $ionicLoading.hide();
                        dialog.showAlert("E","上传失败"+angular.toJson(response));

                        showMessage("查询失败:"+angular.toJson(response))
                    }
                    else{
                        $ionicLoading.hide();
                        dialog.showAlert("E","获取信息错误"+angular.toJson(response));

                        showMessage("未知错误:"+angular.toJson(response));
                    }


                },
                function(err) {  // 处理错误 .reject

                    $ionicLoading.hide();
                    dialog.showAlert("E","网络连接错误...."+angular.toJson(err));

                    showMessage("网络连接错误...."+angular.toJson(err));
                    //uploadProgressModal.hide();

                });  // end of 上传

        }




        /***********
         *  通过 合法性检验后  上传 数据
         *
         */

        /*******
        function uploadDataUnit (){


            var form=new FormData();
            form.append("line_id",keepAccount.data.line_id);
            form.append("expense_type_id",keepAccount.data.expense_type_id);
            form.append("expense_type_desc",keepAccount.data.expense_type_desc);
            form.append("expense_item_id",keepAccount.data.expense_item_id);
            form.append("expense_item_desc",keepAccount.data.expense_item_desc);
            form.append("expense_price",keepAccount.data.expense_price);
            form.append("expense_quantity",keepAccount.data.expense_quantity);
            form.append("currency_code",keepAccount.data.currency_code);
            form.append("currency_code_desc",keepAccount.data.currency_code_desc);
            form.append("exchange_rate",keepAccount.data.exchange_rate);
            form.append("total_amount",keepAccount.data.total_amount);
            //        form.append("expense_date_from", keepAccount.data.expense_date_from);
            //        form.append("expense_date_to",keepAccount.data.expense_date_to);
            form.append("expense_date_from", getFormatDate(new Date(keepAccount.data.expense_date_from))); //getFormatDate(new Date(this.data.expense_date_from)) getFormatDate(new Date())
            form.append("expense_date_to",getFormatDate(new Date(keepAccount.data.expense_date_to)));    //getFormatDate(new Date(this.data.expense_date_from))
            form.append("expense_place",keepAccount.data.expense_place);
            form.append("description",keepAccount.data.description);
            form.append("created_by",keepAccount.data.created_by);




            //showMessage("将执行上传:"+angular.toJson(form));
            //showUploadProgress("执行上传中，上传时长与附件数量有关");
            //uploadProgressModal.show();
            var Photos=keepAccount.data.photos;
            //var promise= keepAccount.uploadData(form,Photos);
            var promise= keepAccount.uploadDataByJosn(keepAccount.data);
            promise.then(
                function(response) {
                    //var code=getResponseCode(response);
                    var code = response.status;
                    if(code=="S"){
                        //接受返回参数
                        //keepAccount.data.expenseDetailId=response.body.expenseDetailId;
                        keepAccount.data.local_status="UPLOADED";
                        $scope.accountDetail=keepAccount.data;
                        keepAccount.canEdit=false;
                        $scope.canEdit=false;
                        //更新本地数据库，修改local_status
                        var p=keepAccount.updateLocalStatus(keepAccount.data.line_id,"UPLOADED");
                        p .then(
                            function(res){

                                $ionicLoading.hide();
                                showMessage("上传成功"+angular.toJson(res));

                                //若此时的sourceFrom 为报销单，将keepAccount.data 的数据赋值给 expenseApply.data.lines ,完成值传递
                                if(sourceFrom=="EXPENSE"){
                                    var line={
                                        appSourceId:keepAccount.data.expenseDetailId,
                                        price:keepAccount.data.expense_price,
                                        quantity:keepAccount.data.expense_quantity,
                                        expenseTypeId:keepAccount.data.expense_type_id,
                                        expenseTypeName:keepAccount.data.expense_type_desc,
                                        expenseItemId:keepAccount.data.expense_item_id,
                                        expenseItemName:keepAccount.data.expense_item_desc,
                                        place:keepAccount.data.expense_place,
                                        dateFrom:keepAccount.data.expense_date_from,
                                        dateTo:keepAccount.data.expense_date_to,
                                        originalCurrency:keepAccount.data.currency_code,
                                        exchangeRate:keepAccount.data.exchange_rate,
                                        description:keepAccount.data.description
                                    };
                                    expenseApply.data.lines.push(line);
                                    //globalNavigator.popPage();

                                    $ionicHistory.goBack();
                                }
                            },
                            function(e){
                                $ionicLoading.hide();


                                showMessage(angular.toJson(e));
                            }
                        );

                    }else if(code=="E"){
                        $ionicLoading.hide();

                        showMessage("查询失败:"+angular.toJson(response))
                    }
                    else{
                        $ionicLoading.hide();

                        showMessage("未知错误:"+angular.toJson(response));
                    }


                },
                function(err) {  // 处理错误 .reject

                    $ionicLoading.hide();

                    showMessage("网络连接错误...."+angular.toJson(err));
                    uploadProgressModal.hide();

                });
        }
         */

    /*上传数据*/
    $scope.uploadData=function(){

        showMessage("上传成功");
        /*
        showUploadProgress("准备上传:");

        var form=new FormData();
        form.append("line_id",keepAccount.data.line_id);
        form.append("expense_type_id",keepAccount.data.expense_type_id);
        form.append("expense_type_desc",keepAccount.data.expense_type_desc);
        form.append("expense_item_id",keepAccount.data.expense_item_id);
        form.append("expense_item_desc",keepAccount.data.expense_item_desc);
        form.append("expense_price",keepAccount.data.expense_price);
        form.append("expense_quantity",keepAccount.data.expense_quantity);
        form.append("currency_code",keepAccount.data.currency_code);
        form.append("currency_code_desc",keepAccount.data.currency_code_desc);
        form.append("exchange_rate",keepAccount.data.exchange_rate);
        form.append("total_amount",keepAccount.data.total_amount);
//        form.append("expense_date_from", keepAccount.data.expense_date_from);
//        form.append("expense_date_to",keepAccount.data.expense_date_to);
        form.append("expense_date_from", getFormatDate(new Date(keepAccount.data.expense_date_from))); //getFormatDate(new Date(this.data.expense_date_from)) getFormatDate(new Date())
        form.append("expense_date_to",getFormatDate(new Date(keepAccount.data.expense_date_to)));    //getFormatDate(new Date(this.data.expense_date_from))
        form.append("expense_place",keepAccount.data.expense_place);
        form.append("description",keepAccount.data.description);
        form.append("created_by",keepAccount.data.created_by);




        //showMessage("将执行上传:"+angular.toJson(form));
        showUploadProgress("执行上传中，上传时长与附件数量有关");
        uploadProgressModal.show();
        var Photos=keepAccount.data.photos;
        var promise= keepAccount.uploadData(form,Photos);
        promise.then(
            function(response) {
                var code=getResponseCode(response);
                if(code=="ok"){
                    //接受返回参数
                    keepAccount.data.expenseDetailId=response.body.expenseDetailId;
                    keepAccount.data.local_status="UPLOADED";
                    $scope.accountDetail=keepAccount.data;
                    keepAccount.canEdit=false;
                    $scope.canEdit=false;
                    //更新本地数据库，修改local_status
                    var p=keepAccount.updateLocalStatus(keepAccount.data.line_id,"UPLOADED");
                    p .then(
                        function(res){
                            showMessage("上传成功"+angular.toJson(res));

                            //若此时的sourceFrom 为报销单，将keepAccount.data 的数据赋值给 expenseApply.data.lines ,完成值传递
                            if(sourceFrom=="EXPENSE"){
                                var line={
                                    appSourceId:keepAccount.data.expenseDetailId,
                                    price:keepAccount.data.expense_price,
                                    quantity:keepAccount.data.expense_quantity,
                                    expenseTypeId:keepAccount.data.expense_type_id,
                                    expenseTypeName:keepAccount.data.expense_type_desc,
                                    expenseItemId:keepAccount.data.expense_item_id,
                                    expenseItemName:keepAccount.data.expense_item_desc,
                                    place:keepAccount.data.expense_place,
                                    dateFrom:keepAccount.data.expense_date_from,
                                    dateTo:keepAccount.data.expense_date_to,
                                    originalCurrency:keepAccount.data.currency_code,
                                    exchangeRate:keepAccount.data.exchange_rate,
                                    description:keepAccount.data.description
                                };
                                expenseApply.data.lines.push(line);
                                globalNavigator.popPage();
                            }
                        },
                        function(e){


                            showMessage(angular.toJson(e));
                        }
                    );

                }else if(code=="failure"){
                    showMessage("查询失败:"+angular.toJson(response))
                }
                else if (code =="login_required"){
                    showMessage("登录状态异常\n"+angular.toJson(response));
                    reLogin();
                }else{
                    showMessage("未知错误:"+angular.toJson(response));
                }

                uploadProgressModal.hide();

            },
            function(err) {  // 处理错误 .reject
                showMessage("网络连接错误...."+angular.toJson(err));
                uploadProgressModal.hide();

            });

            */
    };


    $scope.openCurrencyList=function(){

        /*
        keepAccount.sourceFrom='acc';
        if($scope.canEdit){
            $scope.valueChange();
            //globalNavigator.pushPage('html/acc/currencyList.html', { animation : 'slide' });
            $state.go("tab.acc_currencyList");
        }
        */
    };

    $scope.openExpenseTypeList=function(){
        if($scope.canEdit){
            $scope.valueChange();
            //globalNavigator.pushPage('html/exp/expenseTypeList.html', { animation : 'slide' });
            $state.go("tab.exp_expenseTypeList");

        }
    };

    $scope.openExpenseItemList=function(){
        if($scope.canEdit){
            $scope.valueChange();
            //globalNavigator.pushPage('html/exp/expenseItemList.html', { animation : 'slide' });
            $state.go("tab.exp_expenseItemList");

        }
    };

    $scope.openExpenseObjectList = function() {
        if($scope.canEdit){
            $scope.valueChange();
            //globalNavigator.pushPage('html/exp/expenseItemList.html', { animation : 'slide' });
            $state.go("tab.acc_expenseObjectList");

        }
    };

        $scope.openCostObjectList = function() {
            if($scope.canEdit){
                $scope.valueChange();
                //globalNavigator.pushPage('html/exp/expenseItemList.html', { animation : 'slide' });
                $state.go("tab.cst_costObjectList");

            }
        };




        $scope.valueChange=function(){
            keepAccount.canUpload=false;
            $scope.canUpload=false;
        };


    //以插件的形式来 充当时间控件，   添加crosswalk  的webview后被弃用
    $scope.selectDate=function(field){
        var options = {
            date: new Date(),
            mode: 'date'
        };
        datePicker.show(options, function(date){
            showMessage(date);
            if(date!=undefined){
                if(field=="date_from"){
                    $scope.accountDetail.expense_date_from=getFormatDate(date);
                }else if(field=="date_to"){
                    $scope.accountDetail.expense_date_to=getFormatDate(date);
                }
            }else{
                if(field=="date_from"){
                    $scope.accountDetail.expense_date_from='';
                }else if(field=="date_to"){
                    $scope.accountDetail.expense_date_to='';
                }
            }
            $scope.$apply();
        });
    };

    function showUploadProgress(msg) {
        //console.log($scope.currentProgress);
        $scope.currentProgress = msg;
        //console.log($scope.currentProgress);

    }
    // 删除照片
    function removePhotoFiles() {
        //showMessage("删除照片操作 begin");

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, onError);
    }

    function onSuccess(fileSystem) {
        console.log(fileSystem.name);
        showMessage(fileSystem.name);

        //showMessage(keepAccount.tempPhoto.photo_src);
        var myFolderApp = baseConfig.appRootFile;


        // 数据删除完成 开始删除图片
        var length=keepAccount.data.photos.length;
        showMessage("总长度 "+ keepAccount.data.photos.length);

        var count=0;
        //keepAccount.tempDeleteIndex =0;
        if(length>0){
            for(var i=0;i<length;i++){
                /*插数据库*/
                count = i;
                showMessage("删除 "+i+" name "+keepAccount.data.photos[i].photo_name);
                fileSystem.root.getFile(myFolderApp+'/'+keepAccount.data.photos[i].photo_name, null, onGetFileSuccess, onGetFileError);

            }
        }else{
            dialog.showAlert("I","图片删除成功");

            deferred.resolve(lineID);
        }
        //showMessage(myFolderApp+'/'+keepAccount.tempPhoto.photo_name);
        //fileSystem.root.getFile(myFolderApp+'/'+data.photo[this.tempDeleteIndex].photo_name, null, onGetFileSuccess, onGetFileError);
    }

    function onError(error) {
        dialog.showAlert("E","图片删除出错");

        showMessage(error.code);
    }

    function onGetFileSuccess(fileEntry) {
        console.log("File Name: " + fileEntry.name);
        //showMessage("File Name: " + fileEntry.name);

        // remove the file
        fileEntry.remove(onRemoveSuccess, onRemoveFail);

    }

    function onGetFileError(error) {
        dialog.showAlert("E","图片删除出错");

        showMessage("Failed to retrieve file: " + error.code);
    }

    function onRemoveSuccess(entry) {
        console.log("Removal succeeded");
        showMessage("Removal succeeded");
        //showMessage(keepAccount.tempPhotoIndex);
        showMessage( angular.toJson(keepAccount.data.photos));

        keepAccount.data.photos.splice(keepAccount.tempPhotoIndex,1);
        //showMessage( 'photos list:'+angular.toJson(keepAccount.data.photos));


        /*
         var pages = globalNavigator.getPages();
         //console.log(pages);
         pages[pages.length - 1].destroy();
         pages[pages.length - 1].destroy();
         globalNavigator.pushPage('html/acc/photos.html', { animation : 'slide' });
         */

    }

    function onRemoveFail(error) {
        showMessage('Error removing file: ' + error.code);
        dialog.showAlert("E","图片删除出错");

    }
});

angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.acc_accountList', {
          url: '/acc/accountList',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/acc/accountList.html',
              controller: 'accountListController'
            }
          }
        });
    }]);

angular.module("applicationModule")
<<<<<<< HEAD
  .controller('FlyBackQueryCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$timeout',
    '$ionicModal',
    '$ionicScrollDelegate',
    'hmsHttp',
    'flaybackService',
    'hmsPopup',
    'hmsHttp',
    function ($scope, $rootScope, $state, baseConfig, $ionicHistory, 
      $timeout, $ionicModal, $ionicScrollDelegate, hmsHttp, 
      flaybackService, hmsPopup, HttpAppService){

        var strDate = flaybackService.getNowFormatDate();
        var dateTo = new Date(strDate.replace(/\-/g, "/"));
        var now = new Date(strDate.replace(/\-/g, "/"));
        var dateFrom = new Date(now.setMonth(now.getMonth() - 1));
        $scope.param = {
          "projectCode": "",
          "projectName": "",
          "filter": "",
          "reqDateFrom": dateFrom,//默认最近一个月
          "reqDateTo": dateTo
        };
        $scope.flybackList = [];
=======
  .controller('accountListController', function ($scope, $http, $q, keepAccount, $state, $ionicLoading, baseConfig) {

    $scope.shouldShowDelete = true;

    function queryAccountList() {
>>>>>>> xbr

      //showMessage("查询列表");
      var list = [];

      var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1});
      var deferred = $q.defer();
      db.transaction(function (tx) {
        var querySql = "select * from MOBILE_EXP_REPORT_LINE where created_by = ? order by creation_date desc, line_id desc";
        var para = [
          window.localStorage.empno
        ];
        tx.executeSql(querySql, para, function (tx, res) {
          if (res.rows.length == 0) {
            showMessage("表里的数据为空!! -");
            deferred.resolve(list);

          } else {
            //                  alert(angular.toJson(res.rows.item(0)));
            for (var i = 0; i < res.rows.length; i++) {
              list.push(res.rows.item(i));
            }
            deferred.resolve(list);
          }
        });
      });
      return deferred.promise;
    }

    $ionicLoading.show({
      template: 'Loading...',
      duration: 1000
    });

    ///*
    var promise = queryAccountList();
    promise.then(function (list) {  // 调用承诺API获取数据 .resolve
      $scope.accountList = groupJSON(list);

      //showMessage("查询 结束");
      //$ionicLoading.hide();

    }, function (response) {  // 处理错误 .reject
      showMessage("查询数据库错误");
    });


    $scope.doRefresh = function () {
      $ionicLoading.show({
        template: '刷新列表...',
        duration: 1000
      });
      var promise = queryAccountList();
      promise.then(function (list) {  // 调用承诺API获取数据 .resolve
        $scope.accountList = groupJSON(list);
        $scope.$broadcast('scroll.refreshComplete');
        $ionicLoading.hide();


      }, function (response) {  // 处理错误 .reject
        showMessage("查询数据库错误");
        $scope.$broadcast('scroll.refreshComplete');
        $ionicLoading.hide();


      });
    };

    function doReLoadList() {

      var promise = queryAccountList();
      promise.then(function (list) {  // 调用承诺API获取数据 .resolve


        $scope.accountList = groupJSON(list);
        //showMessage(angular.toJson($scope,accountList));
        $ionicLoading.hide();


      }, function (response) {  // 处理错误 .reject
        showMessage("查询数据库错误");

        $ionicLoading.hide();

      });
    }


    // 删除记一笔
    $scope.removeData = function (e) {

      var target = e.target;
      var lineId = target.getAttribute('lineId');
      var timestamp = target.getAttribute('timestamp');

      showMessage("delete clicked lineid " + lineId);


      $ionicLoading.show({
        template: '正在删除...'
        //duration: 1000
      });

      var promiseGetPhotos = keepAccount.queryDetailPhoto(lineId);
      promiseGetPhotos.then(
        function (response) {
          var promiseRemove = keepAccount.removeItem(timestamp);
          promiseRemove.then(function (removeResponse) {
              var statusCode = removeResponse.status;
              console.log("get the statusCode = " + statusCode);
              if (statusCode === "S") {
                keepAccount.initData();
                keepAccount.data.photos = response.photos;
                keepAccount.data.line_id = lineId;

                var promise = keepAccount.remove(lineId);
                promise.then(
                  function (response) {  // 调用承诺API获取数据 .resolve

                    showMessage("数据删除成功");
                    showMessage(angular.toJson(keepAccount.data.photos));
                    showMessage("length - " + (keepAccount.data.photos.length));


                    if (keepAccount.data.photos.length != undefined && keepAccount.data.photos.length != 0) {

                      //showMessage("length - "+(keepAccount.data.photos.length));

                      removePhotoFiles();
                    }
                    else {
                      showMessage("无照片");
                      doReLoadList();
                    }


                  },
                  function (err) {  // 处理错误 .reject
                    $ionicLoading.hide();
                    showMessage("删除失败...." + angular.toJson(err));
                  }
                );
              } else {
                $ionicLoading.hide();
                $ionicLoading.show({
                  template: '删除失败...',
                  duration: 1000
                });
              }
            },
            function (err) {  // 处理错误 .reject
              $ionicLoading.hide();
              showMessage("删除失败...." + angular.toJson(err));
            });
        },
        function (error) {
          $ionicLoading.hide();
          showMessage("删除失败...." + angular.toJson(err));

        }
      );

    };


    function groupJSON(jsons) {

      var newJson = [];
      loop1:for (var i = 0; i < jsons.length; i++) {
        var t1 = jsons[i].creation_date;
        var arr = {time: t1, list: []};
        arr.list.push(jsons[i]);
        for (var j = i + 1; j < jsons.length; j++) {
          var t2 = jsons[j].creation_date;
          if (t2 == t1) {
            arr.list.push(jsons[j]);
          } else {
            i = j - 1;
            break;
          }
          if (j == jsons.length - 1) {
            newJson.push(arr);
            break loop1;
          }
        }
        newJson.push(arr);
      }
      return newJson;
    }


    $scope.openDetail = function (e) {
      var target = e.target;
      var lineId = target.getAttribute('lineId');
      var status = target.getAttribute('status');
      showMessage(lineId + "----" + status);
      if (status == "UPLOADED") {
        keepAccount.canEdit = false;
        keepAccount.canUpload = false;
        keepAccount.boolLoadExpenseObject = false;
      } else {
        keepAccount.canEdit = true;
        keepAccount.canUpload = true;
        keepAccount.sourceFrom = "ACCOUNT";
        keepAccount.operation = "UPDATE";
        keepAccount.boolLoadExpenseObject = true;
      }

      keepAccount.queryDetail(lineId).then(
        function (detailData) {
          showMessage(angular.toJson(detailData.photos));
          keepAccount.data = detailData;
          //globalNavigator.pushPage('html/acc/accountDetail.html', { animation : 'slide' });
          //showMessage("acc_detail");
          $state.go("tab.acc_detail");
        },
        function (err) {
          showMessage(err);
        }
      );
    };


    // 删除照片
    function removePhotoFiles() {
      showMessage("删除照片操作 begin");

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, onError);
    }

    function onSuccess(fileSystem) {
      console.log(fileSystem.name);
      //showMessage(fileSystem.name);

      //showMessage(keepAccount.tempPhoto.photo_src);
      var myFolderApp = baseConfig.appRootFile;


      // 数据删除完成 开始删除图片
      var length = keepAccount.data.photos.length;
      showMessage("总长度 " + keepAccount.data.photos.length);

      var count = 0;
      //keepAccount.tempDeleteIndex =0;
      if (length > 0) {
        for (var i = 0; i < length; i++) {
          /*插数据库*/
          count = i;
          showMessage("删除 " + i + " name " + keepAccount.data.photos[i].photo_name);
          fileSystem.root.getFile(myFolderApp + '/' + keepAccount.data.photos[i].photo_name, null, onGetFileSuccess, onGetFileError);

        }
      } else {
        deferred.resolve(lineID);
      }
      //showMessage(myFolderApp+'/'+keepAccount.tempPhoto.photo_name);
      //fileSystem.root.getFile(myFolderApp+'/'+data.photo[this.tempDeleteIndex].photo_name, null, onGetFileSuccess, onGetFileError);
    }

    function onError(error) {
      showMessage(error.code);
    }

    function onGetFileSuccess(fileEntry) {
      console.log("File Name: " + fileEntry.name);
      //showMessage("File Name: " + fileEntry.name);

      // remove the file
      fileEntry.remove(onRemoveSuccess, onRemoveFail);

    }

    function onGetFileError(error) {
      showMessage("Failed to retrieve file: " + error.code);
    }

    function onRemoveSuccess(entry) {
      console.log("Removal succeeded");
      showMessage("Removal succeeded");
      //showMessage(keepAccount.tempPhotoIndex);
      showMessage(angular.toJson(keepAccount.data.photos));

      keepAccount.data.photos.splice(keepAccount.tempPhotoIndex, 1);
      //showMessage( 'photos list:'+angular.toJson(keepAccount.data.photos));

      doReLoadList();

    }

    function onRemoveFail(error) {
      showMessage('Error removing file: ' + error.code);
    }

  });

/**
 * Created by wuxiaocheng on 15/8/26.
 */


angular.module("applicationModule")
    .factory('keepAccount', function ($http,$q,$window, baseConfig) {


    // 上传附件
    function doPostHttp(form,deferred) {
        //showMessage("doPostHttp");
        //http://172.20.0.175:8090/handhr_aurora/hand_app_fileupload.svc
        showMessage( window.localStorage.expUploadUrl);

        $http.post( window.localStorage.expUploadUrl,form,{
            transformRequest: angular.identity,
            headers: { 'Content-Type':undefined}
        })
            .success(function(response) {
                showMessage("上传成功 图片");

                deferred.resolve(response);
            })
            .error(function(err) {
                showMessage("上传失败 图片");

                deferred.reject("上传失败 图片");
            });
    }

    function doPostHttpOnlyData(json, deferred) {


        var Url = baseConfig.businessPath + "/expense_account/create_expense_details";
        var PostData = '{"params":{"p_employee":"' + window.localStorage.empno +
            '","p_details":' + json +'}}';

        console.log(PostData);
        showMessage(PostData );
        $http.post(Url,PostData).success(function (data){

            showMessage(angular.toJson(data));
            deferred.resolve(data);

        }).error(function(data) {
            showMessage("error:"+angular.toJson(data));

            deferred.reject(data);

            //$ionicLoading.hide();

        });


        return deferred.promise;
    }
    
    function deleteAccountItem(timestamp, deferred) {
        console.log("get the timestamp = "+timestamp);
        var Url = baseConfig.businessPath + "/expense_account/delete_expense_details";
//        var PostData = '{"params":{"p_employee":"' + window.localStorage.empno +
//            '","p_time_stamp":' + timestamp+'}}';
        var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_time_stamp":"' + timestamp +  '"}}';

        console.log(PostData);
        showMessage(PostData );
        $http.post(Url,PostData).success(function (data){

            showMessage(angular.toJson(data));
            deferred.resolve(data);

        }).error(function(data) {
            showMessage("error:"+angular.toJson(data));

            deferred.reject(data);

            //$ionicLoading.hide();

        });


        return deferred.promise;
    }


    function createBlob(data, type) {
        var r;
        try {
            r = new $window.Blob([data], {type: type});
        }
        catch (e) {
            // TypeError old chrome and FF
            $window.BlobBuilder = $window.BlobBuilder ||
                $window.WebKitBlobBuilder ||
                $window.MozBlobBuilder ||
                $window.MSBlobBuilder;
            // consider to use crosswalk for android

            if (e.name === 'TypeError' && window.BlobBuilder) {
                var bb = new BlobBuilder();
                bb.append([data.buffer]);
                r = bb.getBlob(type);
            }
            else if (e.name == "InvalidStateError") {
                // InvalidStateError (tested on FF13 WinXP)
                r = new $window.Blob([data.buffer], {type: type});
            }
            else {
                throw e;
            }
        }
        return r;
    }


    /******************************************
     *
     */


    var service= {
        data:{},
        sourceFrom:"",
        canEdit:'',
        canUpload:'',
        operation:'',
        tempPhoto:{},
        tempPhotoIndex:'',
        projectList:[],
        expenseItemList:[],
        expenseCostList:[],
        boolLoadExpenseObject:'',
        //curreentPhotoIndex:0,


        queryDetail: function (lineId) {
            //请求数据库，查询操作
            var detailData={};
            var deferred=$q.defer();
            var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1});
            db.transaction(function(tx) {
                var querySql="select * from MOBILE_EXP_REPORT_LINE t where t.line_id=?";
                var para=[lineId];
                //showMessage("query sql "+querySql);

                //showMessage("query para "+para);
                tx.executeSql(querySql, para, function(tx, res) {

                    //showMessage("查询成功");

                    //返回结果
                    detailData={
                        line_id:res.rows.item(0).line_id,
                        expense_type_id:res.rows.item(0).expense_type_id,
                        expense_type_desc:res.rows.item(0).expense_type_desc,
                        expense_item_id:res.rows.item(0).expense_item_id,
                        expense_item_code:res.rows.item(0).expense_item_code,
                        expense_item_desc:res.rows.item(0).expense_item_desc,
                        costObject_id:res.rows.item(0).costObject_id,
                        costObject_desc:res.rows.item(0).costObject_desc,
                        expense_price:res.rows.item(0).expense_price,
                        expense_quantity:res.rows.item(0).expense_quantity,
                        currency_code:res.rows.item(0).currency_code,
                        currency_code_desc:res.rows.item(0).currency_code_desc,
                        exchange_rate:res.rows.item(0).exchange_rate,
                        total_amount:res.rows.item(0).total_amount,
                        expense_date_from:new Date(res.rows.item(0).expense_date_from),
                        expense_date_to:new Date(res.rows.item(0).expense_date_to),
                        expense_place:res.rows.item(0).expense_place,
                        description:res.rows.item(0).description,
                        local_status:res.rows.item(0).local_status,
                        creation_date:res.rows.item(0).creation_date,
                        created_by:res.rows.item(0).created_by,
                        invoice_quantity:res.rows.item(0).invoice_quantity,
                        expenseObject_id:res.rows.item(0).expenseObject_id,
                        expenseObject_desc:res.rows.item(0).expenseObject_desc,
                        expenseObject_type:res.rows.item(0).expenseObject_type,
                        time_stamp:res.rows.item(0).timestamp

                    };

                    //showMessage(detailData.expense_date_from +' -- '+res.rows.item(0).expense_date_from);
                    db.transaction(function(tx) {
                        var photos=[];
                        var sql="select * from MOBILE_EXP_LINE_PHOTOS t where t.line_id=?";
                        tx.executeSql(sql, [lineId], function(tx, res) {
                            for(var i=0;i<res.rows.length;i++){
                                photos.push({
                                    "line_id":res.rows.item(i).line_id,
                                    "photo_id":res.rows.item(i).photo_id,
                                    "photo_name":res.rows.item(i).photo_name,
                                    "photo_src":res.rows.item(i).photo_src,
                                    "creation_date":new Date(res.rows.item(i).creation_date),
                                    "created_by":res.rows.item(i).created_by
                                });
                            }
                            detailData.photos=photos;
                            deferred.resolve(detailData);
                        },function(err) {
                            deferred.reject(err);
                        });
                    });
                }, function(e) {
                    showMessage('ERROR: '+ e.message);
                    deferred.reject(e);
                });
            });
            return deferred.promise;
        },


        /******
         * 功能： 查询 行 关联的照片列表
         * @param lineId
         * @returns {*}
         */
        queryDetailPhoto: function(lineId) {
            var detailData={};
            var deferred=$q.defer();
            var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1});

            db.transaction(function(tx) {
                var photos=[];
                var sql="select * from MOBILE_EXP_LINE_PHOTOS t where t.line_id=?";
                tx.executeSql(sql, [lineId], function(tx, res) {
                    for(var i=0;i<res.rows.length;i++){
                        photos.push({
                            "line_id":res.rows.item(i).line_id,
                            "photo_id":res.rows.item(i).photo_id,
                            "photo_name":res.rows.item(i).photo_name,
                            "photo_src":res.rows.item(i).photo_src,
                            "creation_date":new Date(res.rows.item(i).creation_date),
                            "created_by":res.rows.item(i).created_by
                        });
                    }
                    detailData.photos=photos;
                    deferred.resolve(detailData);
                },function(err) {
                    showMessage('ERROR: '+ err.message);

                    deferred.reject(err);
                });



            });
            return deferred.promise;
        },





        remove:function() {
            //
            var deferred=$q.defer();
            var data=this.data;
            showMessage('open db');
            var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1});
            var lineID;
            db.transaction(function(tx) {
                // 删除记一笔数据
                var deleteSql="DELETE FROM MOBILE_EXP_REPORT_LINE WHERE line_id =" +
                    "?";
                var para=[
                    data.line_id
                ];
                showMessage('deleteSql '+deleteSql);

                tx.executeSql(deleteSql, para, function(tx, res) {
                    //返回line_id
                    lineID=res.insertId;
                    db.transaction(function(tx) {
                        // 删除图片
                        var deletePhotoSql="DELETE FROM MOBILE_EXP_LINE_PHOTOS WHERE line_id = "+
                            "? ";

                        var para=[
                            data.line_id
                        ];

                        tx.executeSql(deletePhotoSql,  para, function(tx, res) {
                            deferred.resolve(lineID);
                        },function(err) {
                            deferred.reject(err);
                        });
                    });
                }, function(e) {
                    deferred.reject(e);
                });
            });
            return deferred.promise;
        },

        /************
         * 删除图片 的 数据库表
         */
        removePhoto:function(line_id) {

            var deferred=$q.defer();
            var data=this.data;
            var resID;
            showMessage('open db to del lineid'+ line_id);
            var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1});
           // var lineID;
            db.transaction(function(tx) {
                // 删除记一笔数据
                var deletePhotoSql="DELETE FROM MOBILE_EXP_LINE_PHOTOS WHERE line_id = "+
                    "? ";

                var para=[
                    line_id
                ];
                showMessage('deleteSql '+deletePhotoSql + ' --- line_id -'+line_id);

                tx.executeSql(deletePhotoSql, para, function(tx, res) {

                    resID=res.insertId;

                    deferred.resolve(resID);

                    //返回line_id

                }, function(e) {
                    deferred.reject(e);
                });
            });
            return deferred.promise;

        },


        /********
         * 记一笔 插入
         * *******/
        insert:function(){
            //转换日期格式


            //showMessage("insert");
            var timestamp = Date.parse(new Date()) / 1000;
            var deferred=$q.defer();
            this.data.time_stamp = ""+timestamp;
            var data=this.data;

            var expense_date_from=getFormatDate(new Date(data.expense_date_from));
            var expense_date_to=getFormatDate(new Date(data.expense_date_to));
            //data.creation_date,


            /*
            var myDate = new Date();

            var month = fillNumberBySize(myDate.getMonth()+1,2);
            var date = fillNumberBySize(myDate.getDate(),2);
            var hours = fillNumberBySize(myDate.getHours(),2);
            var minutes = fillNumberBySize(myDate.getMinutes(),2);
            var seconds = fillNumberBySize(myDate.getSeconds(),2);
            //var milliseconds = fillNumberBySize(myDate.getMilliseconds(),3);


            var creation_date = myDate.getFullYear()+"-"+month+"-"+date+""+hours+":"+minutes
                        +':'+seconds;
               ***/
            var creation_date= getFormatDate(new Date());


            showMessage("creation_date"+creation_date);
            var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1});
            var lineID;


            db.transaction(function(tx) {
                var insertSql="INSERT INTO MOBILE_EXP_REPORT_LINE (" +
                    "expense_type_id,"+
                    "expense_type_desc,"+
                    "expense_item_id,"+
                    "expense_item_code,"+
                    "expense_item_desc,"+
                    "expense_price ,"+

                    "expense_quantity,"+
                    "currency_code,"+
                    "currency_code_desc,"+
                    "exchange_rate,"+
                    "total_amount,"+

                    "expense_date_from,"+
                    "expense_date_to,"+
                    "expense_place,"+
                    "description,"+
                    "local_status,"+


                    'invoice_quantity,'+
                    'expenseObject_id,'+
                    'expenseObject_code,'+
                    'expenseObject_desc,'+
                    'expenseObject_type,'+
                    'costObject_id,'+
                    'costObject_desc,'+

                    "creation_date,"+
                    "created_by,"+
                    "timestamp"+

                    ") VALUES (" +
                    "?,?,?,?,?,?,"+
                    "?,?,?,?,?,"+
                    "?,?,?,?,?,"+
                    "?,?,?,?,?,?,?,"+

                    "?,?,?)";
                var para=[
                    data.expense_type_id,
                    data.expense_type_desc,
                    data.expense_item_id,
                    data.expense_item_code,
                    data.expense_item_desc,
                    data.expense_price ,

                    data.expense_quantity,
                    data.currency_code,
                    data.currency_code_desc,
                    data.exchange_rate,
                    data.total_amount,

                    expense_date_from,
                    expense_date_to,
                    data.expense_place,
                    data.description,
                    data.local_status,

                    data.invoice_quantity,
                    data.expenseObject_id,
                    data.expenseObject_code,
                    data.expenseObject_desc,
                    data.expenseObject_type,
                    data.costObject_id,
                    data.costObject_desc,


                    creation_date,
                    data.created_by,
                    timestamp
                ];

                //showMessage('sql '+insertSql);
                showMessage('para '+angular.toJson(para));
                //showMessage(data.creation_date           );

                console.log(para);
               console.log(data.expense_type_id         );
               console.log(data.expense_type_desc           );
               console.log(data.expense_item_id         );
               console.log(data.expense_item_code           );
               console.log(data.expense_item_desc           );
               console.log(data.expense_price           );
               console.log(data.expense_quantity            );
               console.log(data.currency_code           );
               console.log(data.currency_code_desc          );
               console.log(data.exchange_rate           );
               console.log(data.total_amount            );
               console.log(data.expense_date_from           );
               console.log(data.expense_date_to         );
               console.log(data.expense_place           );
               console.log(data.description         );
               console.log(data.local_status            );
               console.log(data.invoice_quantity            );
               console.log(data.expenseObject_id            );
               console.log(data.expenseObject_code          );
               console.log(data.expenseObject_desc          );
               console.log(data.costObject_id           );
               console.log(data.costObject_desc         );
               console.log(creation_date           );
               console.log(data.created_by          );

                tx.executeSql(insertSql, para, function(tx, res) {

                    //showMessage("res"+angular.toJson(res));


                    //showMessage("插入图片");
                    //返回line_id
                    lineID=res.insertId;
                    db.transaction(function(tx) {
                        var sql="INSERT INTO MOBILE_EXP_LINE_PHOTOS ("+
                            "line_id , " +
                            "photo_name ,"+
                            "photo_src ,"+
                            "creation_date ,"+
                            "created_by )"+
                            "values("+
                            "? ,"+
                            "? ,"+
                            "? ,"+
                            "? ,"+
                            "? )";
                        var length=data.photos.length;
                        var count=0;
                        this.curreentPhotoIndex++

                        if(length>0){
                            for(var i=0;i<length;i++){


                                //showMessage("--" +i);
                                var index = i;
                                /*插数据库*/
                                tx.executeSql(sql, [
                                    lineID,
                                    data.photos[i].photo_name,
                                    data.photos[i].photo_src,
                                    data.photos[i].creation_date,
                                    data.photos[i].created_by
                                ], function(tx, res) {


                                    showMessage(count + " -- res insert photo  -"+res.insertId);

                                    showMessage(angular.toJson(data.photos));

                                    data.photos[count].photo_id = res.insertId;
                                    //showMessage(angular.toJson(data.photos[index]));



                                    count++;
                                    if(count==length){
                                        deferred.resolve(lineID);
                                    }
                                },function(err) {
                                    count++;
                                    if(count==length){
                                        //dialog.showAlert("E", " insert ERROR: " + angular.toJson(err) );

                                        deferred.reject(err);
                                    }
                                })
                            }
                        }else{
                            deferred.resolve(lineID);
                        }
                    });
                }, function(e) {


                    showMessage(" insert ERROR: " + e.message);

                    dialog.showAlert("E", " insert ERROR: " + e.message)

                    deferred.reject(e);
                });
            });
            return deferred.promise;
        },  // end of insert





        getData:function(){
            return this.data;
        },

        /***
         * 数据初始化
         */
        initData:function(){

            //prj_project_cost_type_v 项目报销类型归属，其中'SH'为营销，'RH' 管理费用，'PD'为项目实施，‘DN’为笔记本报销

            this.data={
                //userId:baseConfig.user.userId,
                //companyId:baseConfig.user.companyId,
                companyId:"",

                created_by:window.localStorage.empno,
                photos:[],
                expense_type_id :'',
                expense_type_desc : '',
                expense_item_id: '',
                expense_item_code  : '',
                expense_item_desc  : '',
                expense_price  : '',
    
                expense_quantity  : '',
                currency_code  : '',
                currency_code_desc  : '',
                exchange_rate  : '',
                total_amount  : '',
    
                expense_date_from  : '',
                expense_date_to  : '',
                expense_place  : '',
                description  : '',
                local_status  : '',

                invoice_quantity:'',
                expenseObject_id:'',
                expenseObject_code:'',

                expenseObject_desc:'',
                expenseObject_type:'',
                costObject_id:'',
                costObject_desc:'',


                creation_date  : ''



                
            };
            this.boolLoadExpenseObject = false;
            this.projectList = [];
            this.expenseItemList=[];
            this.expenseCostList=[];
            console.log("数据 清空");

            this.data.expense_date_from = new Date();
            this.data.expense_date_to = new Date();
            this.data.expense_quantity = 1;
            //showMessage("数据清空");
            console.log("初始化 默认人民币");
            this.data.currency_code="CNY";
            this.data.currency_code_desc="CNY-人民币";
            this.data.exchange_rate=Number(1);
        },


        /******
         *   记一笔更新本地数据库
         *
         * @param lineId 行id
         * @returns {*}
         */
        update:function(){
            //转换日期格式
            //this.data.expense_date_from=getFormatDate(new Date(this.data.expense_date_from));
            //this.data.expense_date_to=getFormatDate(new Date(this.data.expense_date_to));

            var deferred=$q.defer();
            var data=this.data;
            var expense_date_from=getFormatDate(new Date(data.expense_date_from));
            var expense_date_to=getFormatDate(new Date(data.expense_date_to));


            var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1});
            // var lineID;
            var rowsAffacted = 0;
            //showMessage("打开数据库成功");
            //console.log('update'+angular.toJson(date));
            showMessage(angular.toJson(this.date));
            //showMessage('aaa');

            db.transaction(function(tx) {
                // 拼接字符串 行字段
                var updateSql="UPDATE MOBILE_EXP_REPORT_LINE SET " +
                    //"expense_type_id = ?,"+
                    //"expense_type_desc = ?,"+
                    "expense_item_id = ?,"+
                    "expense_item_code = ?,"+
                    "expense_item_desc = ? ,"+
                    "expense_price = ?,"+

                    "expense_quantity = ?,"+
                    "currency_code = ?,"+
                    "currency_code_desc = ?,"+
                    "exchange_rate = ?,"+
                    "total_amount = ?,"+

                    "expense_date_from = ?,"+
                    "expense_date_to = ?,"+
                    "expense_place = ?,"+
                    "description = ?,"+
                    "local_status = ?,"+

                    'invoice_quantity = ?,'+
                    'expenseObject_id = ?,'+
                    'expenseObject_code = ?,'+
                    'expenseObject_desc = ?,'+
                    'expenseObject_type = ?,'+

                    'costObject_id = ?,'+
                    'costObject_desc = ?,'+

                    //"creation_date = ?,"+
                    "created_by = ?"+
                    "WHERE line_id = ?";
                var para=[
                   // data.expense_type_id,
                    //data.expense_type_desc,
                    data.expense_item_id,
                    data.expense_item_code,
                    data.expense_item_desc,
                    data.expense_price,

                    data.expense_quantity,
                    data.currency_code,
                    data.currency_code_desc,
                    data.exchange_rate,
                    data.total_amount,

                    expense_date_from,
                    expense_date_to,
                    data.expense_place,
                    data.description,
                    data.local_status,

                    data.invoice_quantity,
                    data.expenseObject_id,
                    data.expenseObject_code,
                    data.expenseObject_desc,
                    data.expenseObject_type,
                    data.costObject_id,
                    data.costObject_desc,

                    //data.creation_date,
                    data.created_by,
                    data.line_id
                ];

                // 更新字段
                tx.executeSql(updateSql, para, function(tx, res) {

                    //showMessage(rowsAffacted);
                    showMessage("res"+angular.toJson(res));

                    rowsAffacted = res.rowsAffected;


                    db.transaction(function(tx) {

                        //showMessage("插入图片");


                        var insertPhotoSql="INSERT INTO MOBILE_EXP_LINE_PHOTOS ("+
                            "line_id , " +
                            "photo_name ,"+
                            "photo_src ,"+
                            "creation_date ,"+
                            "created_by )"+
                            "values("+
                            "? ,"+
                            "? ,"+
                            "? ,"+
                            "? ,"+
                            "? )";

                        var length=data.photos.length;
                        //showMessage("photo length"+length);

                        ///*
                        var count=0;
                        if(length>0){

                            for(var i=0;i<length;i++){

                                showMessage("photo detail "+angular.toJson(data.photos[i]));
                                //var index =i;

                                //    补齐 新添加的照片记录
                                //    原有照片记录 已在本地数据库 无需更新
                                //   有另外一个页面入口删除本地照片

                                if (typeof(data.photos[i].photo_id) == "undefined" || data.photos[i].photo_id == "") {
                                    showMessage("undefined photo insert");
                                    tx.executeSql(insertPhotoSql, [
                                            data.line_id,
                                            data.photos[i].photo_name,
                                            data.photos[i].photo_src,
                                            data.photos[i].creation_date,
                                            data.photos[i].created_by
                                        ], function(tx, res) {

                                            //this.data.photos[i].photo_id = res.insertId;
                                            //showMessage("insert "+angular.toJson(res));

                                            showMessage(angular.toJson(data.photos));
                                            showMessage(count +"--update --"+ res.insertId );
                                            data.photos[count].photo_id = res.insertId;
                                            showMessage(angular.toJson(data.photos));


                                            //setPhotoID(i,res.insertId);

                                            count++;
                                            showMessage(count);
                                            if(count==length){
                                                //showMessage("插入成功");
                                                deferred.resolve(rowsAffacted);
                                            }
                                        },function(err) {
                                            count++;
                                            if(count==length){
                                                //showMessage("deferred");
                                                //dialog.showAlert("E", " insert ERROR: " + angular.toJson(err) );

                                                deferred.reject(err);
                                            }
                                        }
                                    ); // end of executeSql
                                }
                                else {
                                    count++;
                                    showMessage(count);
                                    if(count==length){
                                        //showMessage("插入成功");
                                        deferred.resolve(rowsAffacted);
                                    }
                                }

                            }
                        }else{
                            deferred.resolve(rowsAffacted);
                        }
                    });
                }, function(e) {
                    showMessage("deferred");
                    deferred.reject(e);
                });
            });
            return deferred.promise;

        },



        uploadDataV2:function(form,photos) {
            console.log("进入");
            //showMessage("上传开始");

            showMessage("photos.length" +photos.length);


            var deferred=$q.defer();
            //showMessage("photos.length" +photos.length);
            //deferred.reject("error");
            if(photos.length>0){
                showMessage("上传有照片");
                //setProgress("上传有照片");
                var  count  = 0;
                for(var i=0;i<photos.length;i++){
                    //这里是异步调用cordova 的文件操作，给form 增加
                    window.resolveLocalFileSystemURL(baseConfig.appRootPath+photos[i].photo_name, function (fileEntry) {
                        fileEntry.file(function (file) {
                            var reader = new FileReader();
                            reader.onloadend = function (fileReadResult) {
                                var data = new Uint8Array(fileReadResult.target.result);
                                var blob = createBlob(data, "image/jpeg");

                                //alert("size: "+file.size);
;                               //dialog.showAlert("I", "size: "+file.size);
                                form.append(file.name, blob, file.name);
                                count ++;
                                if(count == photos.length){
                                    doPostHttp(form,deferred);
                                }
                            };
                            reader.onerror = function (fileReadResult) {
                                //如果失败也算完成的话，这里也加上就行
                                //count ++
                                //if(count == photos.length()){
                                //doPostHttp(form);
                                //}
                            };
                            reader.readAsArrayBuffer(file);
                        });
                    },
                    function (error) {
                        showMessage(error.code);
                    });
                }
            }else{

                //showMessage("上传无照片");

                doPostHttp(form,deferred);
            }

            return deferred.promise;
        },

        uploadDataByJosn: function(dataList, option) {


            var lines = {
                expense_lines:[]
            };
            //showMessage("josn");
            //showMessage(angular.toJson(dataList));
            //showMessage(datalist.expenseObject_id );
            //showMessage(datalist.expense_date_from );


            /*

            console.log(dataList.expenseObject_id );
               console.log(dataList.expense_place );
               console.log(dataList.expense_item_code );
               console.log(dataList.expense_date_from );
               console.log(dataList.expense_date_to );
               console.log(dataList.expense_price );
               console.log(dataList.expense_quantity );
               console.log(dataList.expense_quantity );
               console.log(dataList.exchange_rate );
               console.log(dataList.description );
               console.log("RMB");
               console.log(dataList.costObject_id);
               console.log(dataList.line_id);

                */


            // 日期转化
            var expense_date_from=getFormatDate(new Date(dataList.expense_date_from));
            var expense_date_to=getFormatDate(new Date(dataList.expense_date_to));
            var invoice_quantity =  dataList.invoice_quantity;
           // showMessage("total_amount"+dataList.total_amount);

            var total_amount   = Number(dataList.total_amount).toFixed(2);
           // showMessage("total_amount"+total_amount);



            if (invoice_quantity == '' || invoice_quantity == undefined
                || invoice_quantity == null) {
                invoice_quantity = "";

            }

            showMessage("invoice_quantity - "+ invoice_quantity);
            showMessage("rentals_infor_id - "+ dataList.costObject_id);
            //rentals_infor_id:   ""+dataList.costObject_id,

            //alert("invoice_quantity - "+ invoice_quantity);


            //showMessage("构建数据" +dataList.expense_quantity);
            var item = {
                project_id :        ""+dataList.expenseObject_id,
                place       :       dataList.expense_place,
                fee_item_code:      dataList.expense_item_code,
                date_from :         expense_date_from,
                date_to:            expense_date_to,

                unit_price:         ""+dataList.expense_price,
                quantity:           ""+dataList.expense_quantity,
                amount:             ""+total_amount,
                exchange_rate:      ""+dataList.exchange_rate,
                description:        dataList.description,

                original_currency:  "CNY",
                rentals_infor_id:   ""+dataList.costObject_id,
                attach_number:      ""+invoice_quantity,
                source_code:        option.source_code,
                source_line_id:     option.source_line_id,
                time_stamp:         dataList.time_stamp

            };
            
            console.log("构建上传数据结束 "+ angular.toJson(item));
            showMessage("构建上传数据结束 "+ angular.toJson(item));


            lines.expense_lines.push(item);
/*
            data.expense_type_id,
                data.expense_type_desc,
                data.expense_item_id,
                data.expense_item_code,
                data.expense_item_desc,
                data.expense_price ,

                data.expense_quantity,
                data.currency_code,
                data.currency_code_desc,
                data.exchange_rate,
                data.total_amount,

                data.expense_date_from,
                data.expense_date_to,
                data.expense_place,
                data.description,
                data.local_status,

                data.invoice_quantity,
                data.expenseObject_id,
                data.expenseObject_code,
                data.expenseObject_desc,
                data.costObject_id,
                data.costObject_desc,


                data.creation_date,
                data.created_by

                */
            var data = JSON.stringify(  lines);
            console.log(data);
            showMessage(data);

            console.log("进入");
            showMessage("上传开始");

            //showMessage("photos.length" +photos.length);


            var deferred=$q.defer();
            //showMessage("photos.length" +photos.length);
            //deferred.reject("error");


                //showMessage("上传无照片");

            doPostHttpOnlyData(data,deferred);


            return deferred.promise;

        },



        uploadData:function(form,photos) {    // 以formdatade 形式上传文件
            console.log("进入");
            showMessage("上传开始");

            showMessage("photos.length" +photos.length);


            var deferred=$q.defer();
            //showMessage("photos.length" +photos.length);
            //deferred.reject("error");
            if(photos.length>0){
                showMessage("上传有照片");
                //setProgress("上传有照片");
                var  count  = 0;
                for(var i=0;i<photos.length;i++){
                    //这里是异步调用cordova 的文件操作，给form 增加
                    window.resolveLocalFileSystemURL(photos[i].photo_src, function (fileEntry) {
                        fileEntry.file(function (file) {
                            var reader = new FileReader();
                            reader.onloadend = function (fileReadResult) {
                                var data = new Uint8Array(fileReadResult.target.result);
                                var blob = createBlob(data, "image/jpeg");
                                form.append(file.name, blob, file.name);
                                count ++;
                                if(count == photos.length){
                                    doPostHttp(form,deferred);
                                }
                            };
                            reader.onerror = function (fileReadResult) {
                                //如果失败也算完成的话，这里也加上就行
                                //count ++
                                 //if(count == photos.length()){
                                 //doPostHttp(form);
                                 //}
                            };
                            reader.readAsArrayBuffer(file);
                        });
                    });
                }
            }else{

                //showMessage("上传无照片");

                doPostHttp(form,deferred);
            }

            return deferred.promise;
        },
        uploadFile:function (interfaceId,fileName,fileURL) {    //以FileTransfer 的upload方法上传单个文件
            /*以FileTransfer的方式上传文�?*//*
             var deferred  = $q.defer();
             alert("uploadFile.....");
             var deferred  = $q.defer();
             // 显示上传进度
             var showUploadingProgress=function(progressEvt ){
             if( progressEvt.lengthComputable ){
             navigator.notification.progressValue( Math.round( ( progressEvt.loaded / progressEvt.total ) * 100) );
             }
             }
             var win = function (r) {
             deferred.resolve( r );
             };
             var fail = function (error) {
             deferred.reject(error);
             alert("提示图片上传失败，错误信息：" + angular.toJson(error));
             };
             var options = new FileUploadOptions();
             options.fileKey = interfaceId;
             options.fileName = fileName;
             options.mimeType = "image/jpeg";
             var ft = new FileTransfer();
             ft.onprogress = showUploadingProgress;
             ft.upload(fileURL, encodeURI(baseConfig.basePath+"uploadAttachment.svc?interfaceId="+interfaceId), win, fail, options);

             return deferred.promise;*/
        },
        updateLocalStatus:function(lineId,status){  //根据lineId 更新本地记一笔的local_status
            var deferred=$q.defer();
            var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1});
            db.transaction(function(tx) {
                var insertSql="UPDATE MOBILE_EXP_REPORT_LINE  "+
                    " SET  local_status = ? " +
                    " WHERE line_id= ? ";
                var para=[
                    status,
                    lineId
                ];
                tx.executeSql(insertSql, para, function(tx, res) {
                        deferred.resolve(res);
                    },
                    function(e){
                        deferred.reject(e);
                    });
            });
             return deferred.promise;
        },


        // 上传 预报销申请 控制

        // @return  true: 合法   false: 非法

        checkCostObject:function (expenseObject_type,expense_item_code,total_amount) {
            var checkDataValid = true;
            //showMessage("checkCostObject");
            //showMessage(expenseObject_type+" -" +expense_item_code +" - "+total_amount);
            if (expenseObject_type == "SH") {
                // 营销类
                showMessage("expense_item_code - "+expense_item_code);
                if (expense_item_code == EXPENSE_ITEM_CODE.OfficeExpenses ) {
                    // 办公费
                    checkDataValid = false;

                }
                else {

                    //showMessage("是否在租房类别之内");
                    var code =  isNeedHouseApply(expense_item_code);
                    if ( false == code ) {

                        // 非 租房 和 办公费
                        if (total_amount >=2000 ) {

                            checkDataValid = false;

                        }
                    }

                }


            }

            //showMessage("checkDataValid -"+checkDataValid );

            console.log("checkDataValid -"+checkDataValid );
            return checkDataValid;

        },







        explogin:function () {


            var deferred = $q.defer();

            showMessage("login");
            var postData = {username: "admin", password: "admin"};

            var url =baseConfig.basePath+"LOGIN/login.svc";
            console.log('登录请求的地址是:'+url);

            $http({
                method: 'POST',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (data) {
//                return  'para=' + JSON.stringify(data);
                    return  'para=' + JSON.stringify(data);
                },
                data: postData,
                timeout:15000
            }).
                success(function(response) {
                    deferred.resolve(response);
                }).
                error(function(err) {

                    deferred.reject(err);
                });
            return deferred.promise;



        },
        

        removeItem:function(timestamp){
            //删除服务器记一笔数据
            console.log("进入删除服务器记一笔数据");
            showMessage("上传删除");
            var deferred=$q.defer();
            deleteAccountItem(timestamp, deferred);
            return deferred.promise;
        }


    };
    return service;
});
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.acc_photoDetail', {
          url: '/acc/photoDetail',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/acc/photoDetail.html',
              controller: 'checkPhotoController'
            }
          }
        });
    }]);

angular.module("applicationModule")
    .controller('checkPhotoController', function($scope,keepAccount, dialog,$ionicHistory, baseConfig) {

    $scope.tempPhoto=keepAccount.tempPhoto;
    $scope.photoPathURL = baseConfig.appRootPath;
    $scope.canEdit  =   keepAccount.canEdit;

    $scope.back=function(){
        //globalNavigator.popPage();

        showMessage($scope.tempPhoto.photo_src);



        /*

        showMessage("下砸图片");

        var sourceUrl = baseConfig.appRootPath + keepAccount.tempPhoto.photo_name;
        showMessage(sourceUrl);
        var targetUrl = baseConfig.appRootPath +"temp.jpg";
        showMessage(targetUrl);


        var fileTransfer = new FileTransfer();
        var uri = encodeURI(sourceUrl);

        fileTransfer.download(
            uri,targetUrl,function(entry){
                showMessage("下载完成");

                //var smallImage = document.getElementById('smallImage');
                //smallImage.style.display = 'block';
                //smallImage.src = entry.fullPath;

            },function(error){
                console.log("下载网络图片出现错误");
            });

        */

        $ionicHistory.goBack();
    };

    $scope.testFunction=function(){

        alert("11111");
    };

    // 删除照片
    $scope.removePhoto=function() {
        console.log("删除照片操作");

        //  删除 数据库
        var promise = keepAccount.removePhoto(keepAccount.tempPhoto.line_id);
        promise.then(
            function(response) {  // 调用承诺API获取数据 .resolve

                showMessage("数据删除成功");

                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, onError);

                //removePhotoFiles();

               // var pages = globalNavigator.getPages();
                //console.log(pages);
                //pages[pages.length - 1].destroy();
                //pages[pages.length - 1].destroy();
                //globalNavigator.pushPage(moduleHtmlPath.ACC+'accountList.html', { animation : 'slide' } );

                //loanApply.applyList = response.body.tempRecord;
                //$scope.expenseList=response.body.list;

            },
            function(err) {  // 处理错误 .reject
                dialog.showAlert("E","删除失败...."+angular.toJson(err));

                showMessage("删除失败...."+angular.toJson(err));
            }
        );

    };

    function onSuccess(fileSystem,test) {
        console.log(fileSystem.name);
        showMessage(fileSystem.name);
        showMessage(keepAccount.tempPhoto.photo_src);
        var myFolderApp = baseConfig.appRootFile;

        showMessage(myFolderApp+'/'+keepAccount.tempPhoto.photo_name);
        fileSystem.root.getFile(myFolderApp+'/'+keepAccount.tempPhoto.photo_name, null, onGetFileSuccess, onGetFileError);
    }

    function onError(error) {
        showMessage(error.code);
    }

    function onGetFileSuccess(fileEntry) {
        console.log("File Name: " + fileEntry.name);
        showMessage("File Name: " + fileEntry.name);



        //  删除 文件
        // remove the file
        fileEntry.remove(onRemoveSuccess, onRemoveFail);

        // 删除 数组

    }

    function onGetFileError(error) {
        showMessage("Failed to retrieve file: " + error.code);
    }

    function onRemoveSuccess(entry) {
        console.log("Removal succeeded");
        showMessage("Removal succeeded");
        showMessage(keepAccount.tempPhotoIndex);
        showMessage( angular.toJson(keepAccount.data.photos));

        // 删除 照片纪录表
        keepAccount.removePhoto();

        // 删除 内存中照片列表
        keepAccount.data.photos.splice(keepAccount.tempPhotoIndex,1);
        showMessage( 'photos list:'+angular.toJson(keepAccount.data.photos));


        $ionicHistory.goBack();

        //var pages = globalNavigator.getPages();
        //console.log(pages);
        //pages[pages.length - 1].destroy();
        //pages[pages.length - 1].destroy();
        //globalNavigator.pushPage('html/acc/photos.html', { animation : 'slide' });

    }

    function onRemoveFail(error) {
        showMessage('Error removing file: ' + error.code);
    }

});

/**
 * Created by wuxiaocheng on 15/8/26.
 */
angular.module("applicationModule")
    .controller('currencyController', function($scope,$rootScope,keepAccount,expenseApply,$http,$q,$ionicHistory, baseConfig) {

    function queryCurrencyList(){
        var companyId=baseConfig.user.companyId;
        var deferred = $q.defer();


        /*
        $http.get(baseConfig.basePath+"EXP/currencyList.svc?companyId="+companyId,{cache:false}).
            success(function(response, status, headers, config) {

                //showMessage('test');
                deferred.resolve(response);
            }).
            error(function(error, status, headers, config) {
                deferred.reject(error);
            });

            */

        $scope.currencyList = [
            {
                "currencyName": "人民币",
                "currencyCode": "CNY",
                "exchangeRate": 1
            },
            {
                "currencyName": "欧元",
                "currencyCode": "EUR",
                "exchangeRate": 1
            },
            {
                "currencyName": "美元",
                "currencyCode": "USD",
                "exchangeRate": 1
            },
            {
                "currencyName": "港币",
                "currencyCode": "HKD",
                "exchangeRate": 1
            }
        ];
        deferred.resolve("ok");


        return deferred.promise;
    }

    var promise=queryCurrencyList();
    promise.then(
        function(response) {
            var code=getResponseCode(response);
            if(code=="ok"){
                $scope.currencyList=response.body.currencyList;
            }else if(code=="failure"){
                showMessage("查询失败:"+angular.toJson(response))
            }
            else if (code =="login_required"){
                console.log(angular.toJson(response));
                //showMessage("登录状态异常\n"+angular.toJson(response));

                $scope.currencyList = [
                    {
                        "currencyName": "人民币",
                        "currencyCode": "CNY",
                        "exchangeRate": 1
                    },
                    {
                        "currencyName": "欧元",
                        "currencyCode": "EUR",
                        "exchangeRate": 1
                    },
                    {
                        "currencyName": "美元",
                        "currencyCode": "USD",
                        "exchangeRate": 1
                    },
                    {
                        "currencyName": "港币",
                        "currencyCode": "HKD",
                        "exchangeRate": 1
                    }
                ];

                //reLogin();
            }else{
                showMessage("未知错误:"+angular.toJson(response));
            }
        },
        function(err) {  // 处理错误 .reject
            //showMessage("网络连接错误...."+angular.toJson(err));
            $scope.currencyList = [
                {
                    "currencyName": "人民币",
                    "currencyCode": "CNY",
                    "exchangeRate": 1
                },
                {
                    "currencyName": "欧元",
                    "currencyCode": "EUR",
                    "exchangeRate": 1
                },
                {
                    "currencyName": "美元",
                    "currencyCode": "USD",
                    "exchangeRate": 1
                },
                {
                    "currencyName": "港币",
                    "currencyCode": "HKD",
                    "exchangeRate": 1
                }
            ];

        });

    $scope.selectCurrency=function(e){
        var target= e.target;
        var currencyName=target.getAttribute('currencyName');
        var currencyCode=target.getAttribute('currencyCode');
        var exchangeRate=target.getAttribute('exchangeRate');
        if(keepAccount.sourceFrom=='acc')
        {
        keepAccount.data.currency_code=currencyCode;
        keepAccount.data.currency_code_desc=currencyCode+"-"+currencyName;
        keepAccount.data.exchange_rate=Number(exchangeRate);
        }
        if(expenseApply.sourceFrom=='EXP'){
        expenseApply.tempLine.originalCurrency=currencyCode;
        expenseApply.tempLine.exchangeRate=Number(exchangeRate);
        }
        //expenseApply.tempLine.expenseTypeName=expenseTypeName;

        //$ionicNavBarDelegate.back();
        //globalNavigator.popPage();
        $ionicHistory.goBack();
    };

   // $rootScope.hideTabs = true; // mod by ciwei
});

/**
<<<<<<< HEAD
 * Created by wolf on 2016/5/21. (_wen.dai_)
 */
'use strict';
//应用-timeSheet审批模块-详情
=======
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

>>>>>>> xbr
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
<<<<<<< HEAD
        .state('tab.tsApproveDetail', {
          url: 'application/tsApproveDetail',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/timesheet-approve/detail/ts-approve-detail.html',
              controller: 'tsApproveDetailCtrl'
=======
        .state('tab.acc_main', {
          url: '/acc',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/acc/accounts.html',
              controller: 'keepAccountController'
>>>>>>> xbr
            }
          },
          params: {
            'employeeNumber': "",
            'projectId': "",
            'startDate': "",
            'endDate': ""
          }
        })
    }]);
<<<<<<< HEAD
tsApproveModule.controller('tsApproveDetailCtrl', [
  '$scope',
  '$state',
  'baseConfig',
  '$ionicHistory',
  '$stateParams',
  'hmsHttp',
  'hmsPopup',
  '$timeout',
  'ApproveDetailService',
  function ($scope,
            $state,
            baseConfig,
            $ionicHistory,
            $stateParams,
            hmsHttp,
            hmsPopup,
            $timeout,
            ApproveDetailService) {

    /**
     * init var section
     */
    {
      if(ionic.Platform.isIOS()) {
        angular.element('.ae-detail-head').css('marginTop','64px');
        angular.element('#approveDetailContent').css('top','64px');
      }
      var selectItem = []; //初始化点击全部条目为false
      var clickSelectAll = false; //默认没有点击全选
      $scope.detailActionName = "操作";
      $scope.showActionBar = false; //默认不显示勾选按钮和底部的bar
      $scope.detailInfoArray = {}; //用于接收列表对应数据object
      $scope.selectArray = [];
      var tsApproveDetailUrl = baseConfig.businessPath + "/api_timesheet/query_timesheet_approve_list";
      var tsApproveDetailParams = {
        "params": {
          "p_employee_number": $stateParams.employeeNumber,
          "p_start_date": $stateParams.startDate.toString(),
          "p_end_date": $stateParams.endDate.toString(),
          "p_project_id": $stateParams.projectId
        }
      };
      var tsActionUrl = baseConfig.businessPath + "/api_timesheet/timesheet_approve";
      var tsActionParams = { //审批拒绝/通过的参数
        "params": {
          "p_approve_flag": "AGREE",
          "p_employee_number": window.localStorage.empno,
          "p_param_json": ''
        }
      };
      var approveList = { //审批拒绝/通过的子对象
        "approve_list": []
      };
    }

    $scope.$on('$ionicView.enter', function (e) {
      ApproveDetailService.setRefreshFlag('');
    });

    $scope.$on('$destroy', function (e) {
      warn('tsApproveListCtrl.$destroy');
    });

    hmsPopup.showLoading('加载中...');
    function getData() {
      hmsHttp.post(tsApproveDetailUrl, tsApproveDetailParams).success(function (response) {
        hmsPopup.hideLoading();
        if (hmsHttp.isSuccessfull(response.status)) {
          $scope.detailInfoArray = response.timesheet_approve_detail_response;
          if ($scope.detailInfoArray.subsidy_list.length === 0) {
            ApproveDetailService.setRefreshFlag('refresh-approve-list');
            $ionicHistory.goBack();
          }
        } else {
          if (response.status === 'E' || response.status == 'e') {
            hmsPopup.showShortCenterToast("没有相关数据!");
          } else {
            hmsPopup.showShortCenterToast("网络异常,请稍后重试!");
          }
        }
      }).error(function (response, status) {
        hmsPopup.hideLoading();
        hmsPopup.showShortCenterToast("服务请求异常,请检查网络连接和输入参数后重新操作!");
      });
    };
    getData();

    function __initSelectArray(selectParam) { //初始化选择按钮
      //先初始化数据操作--
      $scope.selectArray = [];
      selectItem = [];
      angular.forEach($scope.detailInfoArray.subsidy_list, function (data, index) {
        if ('undoSelectAll' == selectParam) {
          $scope.selectArray.push(false);
          selectItem.push(false);
        } else if ('selectedAll' == selectParam) {
          $scope.selectArray.push(true);
          selectItem.push(true);
        }
      });
    };
    __initSelectArray('undoSelectAll');

    $scope.dealDetailInfo = function () {
      if ($scope.detailActionName == "操作") {
        $scope.detailActionName = "取消";
        $scope.showActionBar = true;
        angular.element('#tsApproveItem').css('paddingLeft', '6%');
      } else if ($scope.detailActionName == "取消") {
        $scope.detailActionName = "操作";
        $scope.showActionBar = false;
        __initSelectArray('undoSelectAll');
        angular.element('#tsApproveItem').css('paddingLeft', '0');
        tsActionParams = { //审批拒绝/通过的参数
          "params": {
            "p_approve_flag": "AGREE",
            "p_employee_number": window.localStorage.empno,
            "p_param_json": ''
          }
        };
        approveList = {
          "approve_list": []
        };
      }
    };

    $scope.selectItem = function (index, newLineNumber) { //单击选中条目的响应method
      selectItem[index] = !selectItem[index];
      var approve = {
        "p_project_id": $scope.detailInfoArray.project_id,
        "p_project_person_number": $scope.detailInfoArray.employee_number,
        "p_start_date": "",
        "p_end_date": "",
        "p_record_id": ""
      };
      if (selectItem[index]) {
        $scope.selectArray[index] = true;
        approve.p_record_id = newLineNumber;
        approveList.approve_list[index] = approve;
      } else {
        $scope.selectArray[index] = false;
        approveList.approve_list.splice(index, 1, 'delete');
      }
    };

    $scope.selectAllDetail = function () { //全选
      clickSelectAll = !clickSelectAll;
      if (clickSelectAll) {
        __initSelectArray('selectedAll');
        for (var i = 0; i < $scope.detailInfoArray.subsidy_list.length; i++) {
          var approve = {
            "p_project_id": $scope.detailInfoArray.project_id,
            "p_project_person_number": $scope.detailInfoArray.employee_number,
            "p_start_date": "",
            "p_end_date": "",
            "p_record_id": ""
          };
          approve.p_record_id = $scope.detailInfoArray.subsidy_list[i].line_number;
          approveList.approve_list.push(approve);
        }
        warn(approveList.approve_list);
      } else {
        __initSelectArray('undoSelectAll');
        approveList.approve_list = [];
      }
    };

    function deleteSuperfluous() {
      for (var i = 0; i < approveList.approve_list.length; i++) {
        if (approveList.approve_list[i] === 'delete') {
          approveList.approve_list.splice(i, 1);
          i--;
        } else if (!approveList.approve_list[i] || approveList.approve_list[i] == "" || typeof(approveList.approve_list[i]) == "undefined") {
          approveList.approve_list.splice(i, 1);
          i--;
        }
      }
    };

    $scope.passThroughDetailItem = function () { //通过
      if (approveList.approve_list.length === 0) {
        hmsPopup.showShortCenterToast('请先选择操作项！');
        return;
      }
      deleteSuperfluous();
      tsActionParams.params.p_approve_flag = "AGREE";
      tsActionParams.params.p_param_json = JSON.stringify(approveList);
      hmsPopup.showLoading("审批中...");
      hmsHttp.post(tsActionUrl, tsActionParams).success(function (response) {
        hmsPopup.hideLoading();
        if (hmsHttp.isSuccessfull(response.status)) {
          hmsPopup.showShortCenterToast('审批成功！');
        } else {
          hmsPopup.showShortCenterToast('审批失败！');
        }
        $scope.dealDetailInfo();
        $timeout(function () {
          hmsPopup.showLoading('加载中...');
          getData();
        }, 1000);
      }).error(function (e) {
        hmsPopup.hideLoading();
        hmsPopup.showShortCenterToast('审批失败！请检查网络稍后重试');
        $scope.dealDetailInfo();
        $timeout(function () {
          hmsPopup.showLoading('加载中...');
          getData();
        }, 1000);
=======
     
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

angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.acc_photos', {
          url: '/acc/photos',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/acc/photos.html',
              controller: 'photosController'
            }
          }
        });
    }]);

angular.module("applicationModule")
  .controller('photosController', function ($scope, keepAccount, $state, $ionicPopup, $ionicLoading, $ionicActionSheet, dialog, baseConfig, hmsPopup) {

    $scope.photos = keepAccount.data.photos;

    //showMessage(angular.toJson(keepAccount.data.photos));
    $scope.serverURL = baseConfig.serverPath;

    $scope.photoPathURL = baseConfig.appRootPath;


    $scope.showAlertPhoto = function (photoName) {//点击图片 放大图片
      $scope.photoNameUrl = photoName;
      // 自定义弹窗
      var myPopup = $ionicPopup.show({
        scope: $scope,
        template: '<div style="text-align: center;"><img ng-src="{{photoPathURL + photoNameUrl}}"  style="width: 95%; height: 350px"></div>',
        buttons: [
          {text: '取消'},
        ]
      });
      myPopup.then(function (res) {
        console.log('Tapped!', res);
      });
    }
    /*
     destinationType:Camera.DestinationType.FILE_URI,
     sourceType:Camera.PictureSourceType.CAMERA,
     quality :35,
     allowEdit:true,
     encodingType:Camera.EncodingType.JPEG,
     saveToPhotoAlbum:false};
     */
    //var optionCameraOld = {
    //    quality: 25,
    //    destinationType: Camera.DestinationType.FILE_URI ,
    //    sourceType : Camera.PictureSourceType.CAMERA,
    //    saveToPhotoAlbum : false,
    //    allowEdit:true
    //
    //
    //    //sourceType : Camera.PictureSourceType.PHOTOLIBRARY
    //
    //};
    /*拍摄照片 相机*/
    // $scope.getPhotoFromCamera=function(){
    getPhotoFromCamera = function () {
      if (detectOS() == "iPhone") {
        var optionsCamera = {
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          quality: 50,
          allowEdit: false,
          targetWidth: 1366,
          targetHeight: 768,
          encodingType: Camera.EncodingType.JPEG,
          saveToPhotoAlbum: false
        };
        //alert("iphone");
      }
      else {
        var optionsCamera = {
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          quality: 50,
          allowEdit: false,
          //targetWidth : 100,
          //targetHeight : 100,
          encodingType: Camera.EncodingType.JPEG,
          saveToPhotoAlbum: false
        };
        //alert("not iphone");

      }
      navigator.camera.getPicture(onSuccess, onFail, optionsCamera);

    };

    /*拍摄照片 相册*/
    getPhotoFromLibary = function () {
      var optionsPhotoLibrary = {
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        quality: 50,
        allowEdit: false,
        targetWidth: 1366,
        targetHeight: 768,
        encodingType: Camera.EncodingType.JPEG,
        saveToPhotoAlbum: false
      };
      navigator.camera.getPicture(onSuccess, onFail, optionsPhotoLibrary);

    };


    /*打开dialog*/

    /*
     $scope.dialogs = {};
     $scope.openDialog=function(dlg) {
     if (!$scope.dialogs[dlg]) {
     ons.createDialog(dlg).then(function(dialog) {
     $scope.dialogs[dlg] = dialog;
     dialog.show();
     });
     }
     else {
     $scope.dialogs[dlg].show();
     }
     };

     ****/

    /**/
    $scope.openPopup = function () {
      //$state.go('tab.acc_photos');


      if (keepAccount.canEdit == true) {
        $scope.popupView = $ionicPopup.show({

          templateUrl: 'templates/expense/popCamera.html',
          scope: $scope,
          title: "拍照"

        });
        $scope.popupView.then(function () {

          console.log("popup close");

        });
      }


    };

    //照相相册选择弹出框   add by xuchengcheng
    $scope.addPicture = function () {
      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: '相册 '
        }, {
          text: '照相'
        }],
        titleText: '请选择获取方式',
        cancelText: '取 消',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          // 相册文件选择上传
          if (index == 0) {
            console.log("相册");
            $scope.selectPhotoSource("PhotoLibary");
          } else if (index == 1) {
            console.log("相机");
            // 拍照上传
            $scope.selectPhotoSource("Cemera");
          } else if (index == 2) {
            $scope.viewPhotos();
          }
          return true;
        }
      });
    }

    /*选择相机*/
    $scope.selectPhotoSource = function (sourceType) {
      if (sourceType == "Cemera") {
        getPhotoFromCamera();
      } else if (sourceType == "PhotoLibary") {
        getPhotoFromLibary();
      }
      console.log("sourceType " + sourceType);
      //$ionicPopup.close();
      // $scope.popupView.close();
      $ionicActionSheet.hide;
    };


    function onSuccess(imageURI) {

      //var image = document.getElementById('myImage');
      //image.src = imageURI;
      // alert("asd");

      console.log("----------" + angular.toJson(imageURI));
      movePic(imageURI);
      //$scope.$apply();
    }

    function onFail(message) {
      // alert('Failed because: ' + message);
    }


    function movePic(file) {
      window.resolveLocalFileSystemURL(file, resolveOnSuccess, resOnError);

    }

    //Callback function when the file system uri has been resolved
    function resolveOnSuccess(entry) {
      var d = new Date();
      var n = d.getTime();
      //new file name
      var newFileName = n + ".jpg";
      var myFolderApp = baseConfig.appRootFile;

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
          //The folder is created if doesn't exist
          fileSys.root.getDirectory(myFolderApp,
            {create: true, exclusive: false},
            function (directory) {
              entry.moveTo(directory, newFileName, successMove, resOnError);
            },
            resOnError);
        },
        resOnError);
    }


    //Callback function when the file has been moved successfully - inserting the complete path
    function successMove(entry) {

      // 加载loading
      $ionicLoading.show({
        template: 'Loading...',
        duration: 1000
>>>>>>> xbr
      });
    };

<<<<<<< HEAD
    $scope.refuseDetailItem = function () { //拒绝
      if (approveList.approve_list.length === 0) {
        hmsPopup.showShortCenterToast('请先选择操作项！');
        return;
      }
      deleteSuperfluous();
      tsActionParams.params.p_approve_flag = "REFUSE";
      tsActionParams.params.p_param_json = JSON.stringify(approveList);
      hmsPopup.showLoading("审批中...");
      hmsHttp.post(tsActionUrl, tsActionParams).success(function (response) {
        hmsPopup.hideLoading();
        if (hmsHttp.isSuccessfull(response.status)) {
          hmsPopup.showShortCenterToast('拒绝成功');
        } else {
          hmsPopup.showShortCenterToast('拒绝失败！');
=======
      //Store imagepath in session for future use
      // like to store it in database
      var date = getFormatDate(new Date());
      var photo = {

        photo_id: '',
        photo_name: entry.name,
        // photo_src:entry.toNativeURL(),
        photo_src: entry.toURL(),
        creation_date: date,
        created_by: window.localStorage.empno
      };

      showMessage(photo.photo_src);
      showMessage(photo.photo_name);

      //showMessage(entry.toNativeURL()+' - '+entry.toURL());

      keepAccount.data.photos.push(photo);
      /*清除缓存*/
      //cleanupCache();
      $scope.photos = keepAccount.data.photos;
      //$scope.$apply();

      $ionicLoading.hide();
    }

    function resOnError(error) {
      alert(error.code);
    }

    /*打开确认照片页面*/
    $scope.showConfirmPhoto = function (index) {//图片长按删除
      //showMessage('showConfirmPhoto aa');
      //alert(index);
      keepAccount.tempPhoto = keepAccount.data.photos[index];
      keepAccount.tempPhotoIndex = index;
      showMessage("temp - - " + angular.toJson(keepAccount.tempPhoto));

      $scope.tempPhoto = keepAccount.tempPhoto;
      $scope.photoPathURL = baseConfig.appRootPath;
      $scope.canEdit = keepAccount.canEdit;

    if($scope.canEdit){
      //  confirm 对话框
      var confirmPopup = $ionicPopup.confirm({
        title: '<strong>提示</strong>',
        template: '<div style="text-align: center">是否确定删除本张图片?</div>'
      });
      confirmPopup.then(function (res) {
        if (res) {
          console.log('You are sure');
          $scope.removePhoto();
        } else {
          console.log('You are not sure');
>>>>>>> xbr
        }
        $scope.dealDetailInfo();
        $timeout(function () {
          hmsPopup.showLoading('加载中...');
          getData();
        }, 1000);
      }).error(function (e) {
        hmsPopup.hideLoading();
        hmsPopup.showShortCenterToast('拒绝失败！请检查网络稍后重试');
        $scope.dealDetailInfo();
        $timeout(function () {
          hmsPopup.showLoading('加载中...');
          getData();
        }, 1000);
      });
<<<<<<< HEAD
<<<<<<< HEAD
    };
  }]).service('ApproveDetailService', function () {
  var flag = ''; //刷新上个列表的标识
  return {
    setRefreshFlag: function (newFlag) {
      flag = newFlag;
    },
    getRefreshFlag: function () {
      return flag;
    }
  }
});
=======
    }])
=======
    }
>>>>>>> xbr

      // 删除照片
      $scope.removePhoto = function () {
        console.log("删除照片操作");
        //  删除 数据库
        var promise = keepAccount.removePhoto(keepAccount.tempPhoto.line_id);
        promise.then(
          function (response) {  // 调用承诺API获取数据 .resolve
            showMessage("数据删除成功");
            $scope.photos.splice(index, 1);
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, onError);
          },
          function (err) {  // 处理错误 .reject
            dialog.showAlert("E", "删除失败...." + angular.toJson(err));
            showMessage("删除失败...." + angular.toJson(err));
          });
      };

      function onSuccess(fileSystem, test) {
        console.log(fileSystem.name);
        showMessage(fileSystem.name);
        showMessage(keepAccount.tempPhoto.photo_src);
        var myFolderApp = baseConfig.appRootFile;

<<<<<<< HEAD
      this.fetchEachDay = function (callback, oneDate) {
        var url = baseConfig.businessPath + '/timesheet_process/fetch_projects';
        var params = {'params': {'p_employee': window.localStorage.empno + "", 'p_date': +oneDate + ""}};
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          callback(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('获取状态错误,请检查网络!');
        });
      };

      this.fetchProjectDetailInfo = function (callback, oneDate, projectId) {
        var url = baseConfig.businessPath + "/timesheet_process/project_change"
        var params = {
          'params': {
            'p_employee': window.localStorage.empno + "", 'p_date': +oneDate + "",
            'p_project_id': projectId + ""
          }
        };
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          callback(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('获取项目信息错误,请检查网络!');
        });
      };
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353

=======
        showMessage(myFolderApp + '/' + keepAccount.tempPhoto.photo_name);
        fileSystem.root.getFile(myFolderApp + '/' + keepAccount.tempPhoto.photo_name, null, onGetFileSuccess, onGetFileError);
      }

      function onError(error) {
        showMessage(error.code);
      }

      function onGetFileSuccess(fileEntry) {
        console.log("File Name: " + fileEntry.name);
        showMessage("File Name: " + fileEntry.name);
        // remove the file
        fileEntry.remove(onRemoveSuccess, onRemoveFail);
      }

      function onGetFileError(error) {
        showMessage("Failed to retrieve file: " + error.code);
      }

      function onRemoveSuccess(entry) {
        console.log("Removal succeeded");
        showMessage("Removal succeeded");
        showMessage(keepAccount.tempPhotoIndex);
        showMessage(angular.toJson(keepAccount.data.photos));

        // 删除 照片纪录表
        keepAccount.removePhoto();

        // 删除 内存中照片列表
        //keepAccount.data.photos.splice(keepAccount.tempPhotoIndex, 1);
        keepAccount.data.photos = $scope.photos;


        showMessage('photos list:' + angular.toJson(keepAccount.data.photos));
      }

      function onRemoveFail(error) {
        showMessage('Error removing file: ' + error.code);
      }
    };


    /*清除相机缓存*/
    function cleanupCache() {
      navigator.camera.cleanup(cameraSuccess, cameraError);
    }

    function cameraSuccess() {
    }

    function cameraError(e) {
      alert(angular.toJson(e));
    }
  });

angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.acc_uploadAccount', {
          url: '/acc/uploadAccount',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/acc/uploadAccount.html',
              controller: 'uploadController'
            }
          }
        });
    }]);


angular.module("applicationModule")
    .controller('uploadController', function ($scope, keepAccount, dialog, $http, $q,$ionicLoading, baseConfig) {


    $scope.currentProgress = '批量上传';
    var recordToUpload = 0;
    var recordUploaded = 0;
    var recordToUploadLength = 0;

        //showMessage(window.localStorage.empno);
    function queryAccountList() {
        var list = [];
        var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1});
        var deferred = $q.defer();
        db.transaction(function (tx) {
            var querySql = "select * from MOBILE_EXP_REPORT_LINE t WHERE local_status = 'NEW' AND created_by =? order by creation_date desc, line_id desc ;"
            var para=[
                window.localStorage.empno
            ];
            tx.executeSql(querySql, para, function (tx, res) {
                //alert(angular.toJson(res.rows.item(0)));
                for (var i = 0; i < res.rows.length; i++) {
                    list.push(res.rows.item(i));
                }
                deferred.resolve(list);
            });
        }, function (e) {
            console.log("ERROR: " + e.message);
            deferred.reject(e);
        });
        return deferred.promise;
    }

    function queryAccountPhotos(lineId) {
        var list = [];
        //alert("打开数据库...");
        var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1});

        var deferred = $q.defer();
        db.transaction(function (tx) {
            var querySql = "select * from MOBILE_EXP_LINE_PHOTOS t where t.line_id=? ;";
            tx.executeSql(querySql, [lineId], function (tx, res) {
                //alert(angular.toJson(res.rows.item(0)));
                for (var i = 0; i < res.rows.length; i++) {
                    list.push(res.rows.item(i));
                }
                //showMessage("List:--" +angular.toJson(list));
                deferred.resolve(list);
            });
        }, function (e) {
            console.log("ERROR: " + e.message);
            deferred.reject(e);
        });
        return deferred.promise;
    }

       // /*
    var promise = queryAccountList();
    promise.then(function (list) {  // 调用承诺API获取数据 .resolve
        $scope.accountList = list;

        console.log("list - "+angular.toJson($scope.accountList));
        $scope.accountList2 = groupJSON($scope.accountList);
        //alert(angular.toJson($scope.accountList2));
    }, function (response) {  // 处理错误 .reject
        //alert("查询数据库错误,初始化数据");
        dialog.showAlert("E","查询数据库错误,初始化数据");

    });
   // */


        function doReloadData () {
            var promise = queryAccountList();
            promise.then(function (list) {  // 调用承诺API获取数据 .resolve
                $scope.accountList = list;

                console.log("list - "+angular.toJson($scope.accountList));
                $scope.accountList2 = groupJSON($scope.accountList);


                $ionicLoading.hide();
                //alert(angular.toJson($scope.accountList2));
            }, function (response) {  // 处理错误 .reject

                $ionicLoading.hide();
                dialog.showAlert("E","查询数据库错误,初始化数据");

                //alert("查询数据库错误,初始化数据");
            });
        }


        /**
        $scope.accountList2 = [
            {
                time:"20120202",
                list: [
                    {
                        "line_id": "123",
                        "local_status":"UPLOADED",
                        "expenseObject_desc":"项目1",
                        expense_item_desc:"办公费",
                        total_amount:22,
                        expense_date_from:"20120202",
                        expense_date_to:"20120202",
                        expense_place:'上海'



                    },
                    {
                        "line_id": "123",
                        "local_status":"NEW",
                        "expenseObject_desc":"项目2",
                        expense_item_desc:"办公费",
                        total_amount:22,
                        expense_date_from:"20120202",
                        expense_date_to:"20120202",
                        expense_place:'上海'

                    }
                ]

            },
            {
                time:"20120202",
                list: [
                    {
                        "line_id": "123",
                        local_status:"NEW",
                        "expenseObject_desc":"项目2",
                        expense_item_desc:"办公费",
                        total_amount:27,
                        expense_date_from:"20120202",
                        expense_date_to:"20120202",
                        expense_place:'上海'

                    },
                    {
                        "line_id": "123",
                        "local_status":"UPLOADED",
                        "expenseObject_desc":"项目2",
                        expense_item_desc:"办公费",
                        total_amount:24,
                        expense_date_from:"20120202",
                        expense_date_to:"20120202",
                        expense_place:'上海'
                    }
                ]

            }

        ];


         //*/

//    author:郑旭 用于对json进行分组并在界面上显示
    function groupJSON(jsons) {

            /*
        var newJson = [];
        loop1:for (var i = 0; i < jsons.length; i++) {
            var t1 = jsons[i].expense_date_from;
            var arr = {time: t1, list: []};
            arr.list.push(jsons[i]);
            for (var j = i + 1; j < jsons.length; j++) {
                var t2 = jsons[j].expense_date_from;
                if (t2 == t1) {
                    arr.list.push(jsons[j]);
                } else {
                    i = j - 1;
                    break;
                }
                if (j == jsons.length - 1) {
                    newJson.push(arr);
                    break loop1;
                }
            }
            newJson.push(arr);
        }
        return newJson;

        */
            var newJson=[];
            loop1:for(var i=0;i<jsons.length;i++){
                var t1=jsons[i].creation_date;
                var arr={time:t1,list:[]};
                arr.list.push(jsons[i]);
                for(var j=i+1;j<jsons.length;j++){
                    var t2=jsons[j].creation_date;
                    if(t2==t1){
                        arr.list.push(jsons[j]);
                    }else{
                        i=j-1;
                        break;
                    }
                    if(j==jsons.length-1){
                        newJson.push(arr);
                        break loop1;
                    }
                }
                newJson.push(arr);
            }
            return newJson;
    }

    /*$scope.accountList=[
     {
     line_id:1,
     expense_type_id:1,
     expense_type_desc:'日常报销',
     expense_item_id:1,
     expense_item_desc:'交通费',
     expense_price:2.5,
     expense_quantity:4,
     currency_code:'CNY',
     currency_code_desc:'人民币',
     exchangeRate:1.5,
     total_amount:10,
     expense_date_from:'2015-05-01',
     expense_date_to:'2015-05-30',
     expense_place:'上海',
     description:'往返交通费',
     local_status:'NEW',
     creation_date:'2015-05-15',
     created_by:1
     }
     ];*/

    $scope.showSelected = function () {
        console.log($scope.accountList);
    };

    function queryPhotosList() {
        var promise = keepAccount.queryPhotosList();
    }



        function uploadDataUnitV2(keepAccountUnit){

            showMessage("uploadDataUmit ："+angular.toJson(keepAccountUnit));

            var form=new FormData();


            var myDate = new Date();

           // var expense_detail_id = window.localStorage.empno+myDate.getFullYear()+myDate.getMonth()+myDate.getDate()
               // + myDate.getHours()+ myDate.getMinutes()+ myDate.getSeconds()+ myDate.getMilliseconds();
            var month = fillNumberBySize(myDate.getMonth()+1,2);
            var date = fillNumberBySize(myDate.getDate(),2);
            var hours = fillNumberBySize(myDate.getHours(),2);
            var minutes = fillNumberBySize(myDate.getMinutes(),2);
            var seconds = fillNumberBySize(myDate.getSeconds(),2);
            var milliseconds = fillNumberBySize(myDate.getMilliseconds(),3);


            var expense_detail_id = window.localStorage.empno+myDate.getFullYear()
                +month+date+hours+minutes+seconds+milliseconds;


            showMessage(expense_detail_id);
            console.log(expense_detail_id+" - "+expense_detail_id);

            form.append("expense_detail_id",expense_detail_id);



            var Photos = [];
            var promisePhoto = queryAccountPhotos(keepAccountUnit.line_id);
            promisePhoto.then(
                function(response) {
                    //showMessage("照片列表获取成功"+angular.toJson(response));
                    Photos=response;
                    //showMessage("照片列表获取成功"+Photos);

                    showMessage("准备上传:"+angular.toJson(form));

                    //var promise= keepAccount.uploadData(form,Photos);

                    var promise= keepAccount.uploadDataV2(form,Photos);

                    promise.then(
                        function(response) {
                            //var code=getResponseCode(response);
                            showMessage(angular.toJson(response));
                            var code = response.head.code;
                            if(code=="success"){
                                //接受返回参数
                                //keepAccount.data.expenseDetailId=response.body.expenseDetailId;

                                // 开始 上传数据

                                var upload_option = {
                                    source_code: "HIH_PIC_UPLOAD",
                                    source_line_id: expense_detail_id

                                };

                                var p2= keepAccount.uploadDataByJosn(keepAccountUnit,upload_option);
                                p2.then(

                                    function(res){

                                        var code = res.status;

                                        if (code == 'S') {
                                            // $ionicLoading.hide();
                                            showMessage("上传成功 数据"+angular.toJson(res));


                                            keepAccountUnit.local_status="UPLOADED";
                                            //$scope.accountDetail=keepAccount.data;
                                            //keepAccount.canEdit=false;
                                            //$scope.canEdit=false;
                                            //更新本地数据库，修改local_status
                                            var p=keepAccount.updateLocalStatus(keepAccountUnit.line_id,"UPLOADED");
                                            p .then(
                                                function(res){

                                                    recordToUpload--;

                                                    $ionicLoading.hide();
                                                    checkUploadFinish();

                                                    showMessage("上传成功 本地状态修改成功"+angular.toJson(res));

                                                },
                                                function(e){
                                                    $ionicLoading.hide();
                                                    checkUploadFinish();



                                                    showMessage(angular.toJson(e));
                                                }
                                            );

                                        }
                                        else {
                                            checkUploadFinish();
                                            showMessage("上传失败 数据"+angular.toJson(res));


                                        }




                                    },
                                    function(e){
                                        $ionicLoading.hide();
                                        checkUploadFinish();



                                        showMessage(angular.toJson(e));
                                    }

                                );




                            }else if(code=="E"){
                                $ionicLoading.hide();
                                checkUploadFinish();


                                showMessage("查询失败:"+angular.toJson(response))
                            }
                            else{
                                checkUploadFinish();

                                $ionicLoading.hide();

                                showMessage("未知错误:"+angular.toJson(response));
                            }


                        },
                        function(err) {  // 处理错误 .reject

                            $ionicLoading.hide();

                            checkUploadFinish();


                            showMessage("网络连接错误...."+angular.toJson(err));
                            //uploadProgressModal.hide();

                        });  // end of 上传

                },
                function(err) {
                    $ionicLoading.hide();

                    checkUploadFinish();
                    showMessage("照片列表获取失败"+err);

                }
            );


        }



    function uploadDataUnit(keepAccountUnit){

        showMessage("uploadDataUmit ："+angular.toJson(keepAccountUnit));

        var form=new FormData();

        showMessage("line_id ："+keepAccountUnit.line_id);

        form.append("line_id",keepAccountUnit.line_id);
        //showMessage("form:"+angular.toJson(form));

        form.append("expense_type_id",keepAccountUnit.expense_type_id);
        form.append("expense_type_desc",keepAccountUnit.expense_type_desc);
        form.append("expense_item_id",keepAccountUnit.expense_item_id);
        form.append("expense_item_desc",keepAccountUnit.expense_item_desc);
        form.append("expense_price",keepAccountUnit.expense_price);
        form.append("expense_quantity",keepAccountUnit.expense_quantity);
        form.append("currency_code",keepAccountUnit.currency_code);
        form.append("currency_code_desc",keepAccountUnit.currency_code_desc);
        form.append("exchange_rate",keepAccountUnit.exchange_rate);
        form.append("total_amount",keepAccountUnit.total_amount);
        form.append("expense_date_from",keepAccountUnit.expense_date_from);
        form.append("expense_date_to",keepAccountUnit.expense_date_to);
        form.append("expense_place",keepAccountUnit.expense_place);
        form.append("description",keepAccountUnit.description);
        form.append("created_by",keepAccountUnit.created_by);

        var Photos = [];
        var promisePhoto = queryAccountPhotos(keepAccountUnit.line_id);
        promisePhoto.then(
            function(response) {
                //showMessage("照片列表获取成功"+angular.toJson(response));
                Photos=response;
                //showMessage("照片列表获取成功"+Photos);

                showMessage("准备上传:"+angular.toJson(form));

                //var promise= keepAccount.uploadData(form,Photos);

                var promise= keepAccount.uploadDataByJosn(keepAccountUnit);

                promise.then(
                    function(response) {

                        showMessage("上传返回:"+"--"+angular.toJson(response));

                        //showMessage("上传返回:"+keepAccountUnit.line_id+"--"+angular.toJson(response));

                        //var code=getResponseCode(response);
                        var code=response.status;
                        showMessage("status -"+code);

                        if(code=="S"){

                            showMessage("上传成功:"+keepAccountUnit.line_id+"--"+angular.toJson(response));

                            //接受返回参数
                            //keepAccountUnit.expenseDetailId=response.body.expenseDetailId;
                            keepAccountUnit.local_status="UPLOADED";
                            //$scope.accountDetail=keepAccountUnit;
                            // keepAccount.canEdit=false;
                            //$scope.canEdit=false;
                            //更新本地数据库，修改local_status
                            var p=keepAccount.updateLocalStatus(keepAccountUnit.line_id,"UPLOADED");
                            p .then(
                                function(res){
                                    showMessage("更新成功"+angular.toJson(res));
                                    recordToUpload--;
                                    //showUploadProgress('剩余上传记录：'+ recordToUpload);

                                    checkUploadFinish();

                                    //若此时的sourceFrom 为报销单，将keepAccountUnit 的数据赋值给 expenseApply.data.lines ,完成值传递
                                    /*   报销单 入口
                                     if(sourceFrom=="EXPENSE"){
                                     var line={
                                     appSourceId:keepAccountUnit.expenseDetailId,
                                     price:keepAccountUnit.expense_price,
                                     quantity:keepAccountUnit.expense_quantity,
                                     expenseTypeId:keepAccountUnit.expense_type_id,
                                     expenseTypeName:keepAccountUnit.expense_type_desc,
                                     expenseItemId:keepAccountUnit.expense_item_id,
                                     expenseItemName:keepAccountUnit.expense_item_desc,
                                     place:keepAccountUnit.expense_place,
                                     dateFrom:keepAccountUnit.expense_date_from,
                                     dateTo:keepAccountUnit.expense_date_to,
                                     originalCurrency:keepAccountUnit.currency_code,
                                     exchangeRate:keepAccountUnit.exchange_rate,
                                     description:keepAccountUnit.description
                                     };
                                     expenseApply.data.lines.push(line);
                                     globalNavigator.popPage();
                                     }
                                     */
                                },
                                function(e){
                                    checkUploadFinish();
                                    showMessage("更新失败"+angular.toJson(e));
                                }
                            );

                        }else if(code=="E"){
                            checkUploadFinish();
                            showMessage("查询失败:"+angular.toJson(response))
                        }
                        else if (code =="login_required"){
                            showMessage("登录状态异常\n"+angular.toJson(response));
                            reLogin();
                        }else{
                            checkUploadFinish();
                            showMessage("未知错误:"+angular.toJson(response));
                        }
                    },
                    function(err) {  // 处理错误 .reject
                        checkUploadFinish();
                        showMessage("网络连接错误...."+angular.toJson(err));
                    });


            },
            function(err) {
                checkUploadFinish();
                showMessage("照片列表获取失败"+err);

            }
        )
;


    }


    // 结束检查
    function checkUploadFinish () {
        recordUploaded++;

        //showMessage(recordUploaded +" - "+recordToUploadLength);
        if (recordUploaded == recordToUploadLength) {
            //uploadProgressBatchModal.hide();

            if (recordToUpload == 0) {
                showMessage("批量上传成功");
                dialog.showAlert("I","批量上传成功");

            }
            else if (recordToUpload < 0){
                dialog.showAlert("I","批量上传长度统计异常");

                showMessage("批量上传长度统计异常");

            }else {
                showMessage("批量上传没有全部成功");
                dialog.showAlert("I","批量上传 部分 失败");


            }


            doReloadData();


            /*
             var pages = globalNavigator.getPages();
             pages[pages.length - 1].destroy();
             globalNavigator.pushPage(moduleHtmlPath.ACC+'uploadAccount.html', { animation : 'slide' });
             */


        }
    }

    /*上传数据*/
    $scope.uploadDataBatch=function(){
        /**/
        //showMessage("批量上传 prepare");

        $ionicLoading.show({
            template: '批量上传 ... '
            //duration: 3000
        });

        //console.log("批量上传操作");




       // showMessage("批量上传操作");
        ///*

        //uploadProgressBatchModal.show();
        var selectedAccounts = getSelected();
        //showMessage("select "+angular.toJson(selectedAccounts));

        ///*
        recordToUpload = selectedAccounts.length;
        recordUploaded = 0;
        recordToUploadLength = selectedAccounts.length;
        //showUploadProgress('剩余上传记录：'+ recordToUpload);
        //showMessage('剩余上传记录：'+ recordToUpload);
        ///*

        if (recordToUploadLength == 0 || recordToUploadLength == undefined) {
            $ionicLoading.hide();
        }
        else {
            for (var i = 0; i < selectedAccounts.length; i++) {
                showMessage("批量上传 序列："+i);

                //-----------------------
                //       合法性  检验
                //-----------------------
                var checkDataValid = true;
                var data_temp = selectedAccounts[i];
                if (data_temp.costObject_id == '' || data_temp.costObject_id == undefined ||
                    data_temp.costObject_id == null ) {


                    checkDataValid = keepAccount.checkCostObject(
                        data_temp.expenseObject_type,
                        data_temp.expense_item_code,
                        data_temp.total_amount
                    );


                }

                if (checkDataValid == false ) {

                    /*
                     $ionicLoading.show({
                     template: '预报销申请不能为空...跳过',
                     duration: 1000
                     });
                     //*/

                    showMessage('预报销申请不能为空...跳过- '+i);

                    //dialog.showAlert("E",'预报销申请不能为空...跳过第 '+i+" 条");


                    checkUploadFinish();

                }
                else {

                    uploadDataUnitV2 (selectedAccounts[i]);

                }


                //showMessage("批量上传 end 序列："+i);

            }
        }


        //*/
      
    };


    function showUploadProgress(msg) {
        //console.log($scope.currentProgress);
        $scope.currentProgress = msg;
        //console.log($scope.currentProgress);

    }
    
    $scope.uploadAccounts = function () {
        var selectedAccounts = getSelected();


        for (var i = 0; i < selectedAccounts.length; i++) {
            /*将本地数据提交到后台接口表*/
            alert("开始上传数据" + i);
            var line_id = selectedAccounts[i].line_id;
            $http({
                method: 'POST',
                url: baseConfig.basePath + "EXP/EXP5030/mobile_exp_report_detail_insert.svc",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (data) {
                    return  'para=' + JSON.stringify(data);
                },
                data: selectedAccounts[i]
            })
                .success(function (response) {
                    console.log("response:" + "成功返回");
                    alert("response:" + angular.toJson(response));
                    /*获取返回的interfaceId*/
                    var interfaceId = response.body.expenseDetailId;

                    /*查询照片列表，上传照片到服务器*/
                    var promise = queryAccountPhotos(line_id);
                    promise.then(function (list) {
                        var Photos = list;
                        alert("获取photos数据成功" + Photos.length);
                        alert("开始上传文件");
                        for (var j = 0; j < Photos.length; j++) {
                            keepAccount.uploadFile(interfaceId, Photos[j].photo_name, Photos[j].photo_src);
                        }
                        /*更新本地记一笔数据状态，local_status 更改为 UPLOADED*/
                        keepAccount.updateLocalStatus(line_id);
                    }, function (response) {
                        alert("查询照片数据库错误");
                    });
                }).error(function (response, status) {
                    console.log("response:" + "失败返回");
                    console.log("response:" + response + ",status:" + status);
                });
        }
    };

    function getSelected() {
        var accountList = $scope.accountList;
        var selectedList = [];
        for (var i = 0; i < accountList.length; i++) {

            showMessage("行："+accountList[i].upLoadSelected );
            if (!(accountList[i].upLoadSelected==undefined || accountList[i].upLoadSelected==false)) {
                selectedList.push(accountList[i]);
            }

            //showMessage("selectedList "+ angular.toJson(selectedList));
        }
        return selectedList;
    }


});
>>>>>>> xbr

/**
 * Created by wolf on 2016/5/19.
 * @author: wen.dai@hand-china.com
 *
 */
'use strict';
//应用-timeSheet审批模块-列表
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
<<<<<<< HEAD
        .state('tab.tsApproveList', {
          url: 'application/tsApproveList',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/timesheet-approve/list/ts-approve-list.html',
              controller: 'tsApproveListCtrl'
=======
        .state('tab.cst_costDetail', {
          url: '/expense/cst/costDetail',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/cst/costDetail.html',
              controller: 'costDetailController',
              cache: false
>>>>>>> xbr
            }
          }
        });
    }]);
<<<<<<< HEAD
<<<<<<< HEAD
angular.module('tsApproveModule')
  .controller('tsApproveListCtrl', [
=======

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
  .controller('TimeSheetWriteCtrl', [
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicModal',
    '$ionicScrollDelegate',
    '$ionicPopup',
    '$timeout',
    'TsApproveListService',
    'hmsPopup',
    'hmsHttp',
    'ApproveDetailService',
    '$ionicPopover',
    '$cordovaDatePicker',
    function ($scope,
              $rootScope,
              $state,
              baseConfig,
              $ionicModal,
              $ionicScrollDelegate,
              $ionicPopup,
              $timeout,
              TsApproveListService,
              hmsPopup,
              hmsHttp,
              ApproveDetailService,
              $ionicPopover,
              $cordovaDatePicker) {
      /**
       * initial var section
       */
      {
<<<<<<< HEAD
        if (ionic.Platform.isIOS()) {
          angular.element('.custom-head').css('paddingTop', '10px');
          angular.element('.ts-list-bg').css('paddingTop', '110px');
=======
        currentDay: "",
        approver: "",
        currentProject: {},
        currentAddress: {},
        currentFlyback: {},
        travelingAllowance: {flag: false, style: unchecked},
        normalAllowance: {flag: false, style: unchecked},
        intCharge: {flag: false, style: unchecked}, //ion-ios-checkmark
        extCharge: {flag: false, style: unchecked}, //ion-ios-checkmark
        description: ""
      };
=======


angular.module("applicationModule")
  .controller('costDetailController', ['$scope','dialog','costApply','$location','$http','$q','$state','$ionicHistory','$ionicLoading',function($scope,dialog,costApply,$location, $http,$q,$state, $ionicHistory,$ionicLoading) {

    //初始化数据
     $scope.canEdit=costApply.canEdit;
    //$scope.objectType=loanApply.objectType;
    //$scope.detailData=loanApply.getData();
    //$scope.currentQueryTypeDesc = loanApply.currentQueryTypeDesc;

    $scope.canSubmit = costApply.canSubmit;
>>>>>>> xbr

    //$scope.detailData=loanApply.getDataFromTravel(globalNavigator.getCurrentPage().options.travelDataPara);


    //$scope.canSubmit = loanApply.canSubmit;

<<<<<<< HEAD
      //加载项目地点画面
      $ionicModal.fromTemplateUrl('build/pages/application/timesheet/write/modal/addressModal.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.addressModal = modal;
      });

      //加载机票补贴画面
      $ionicModal.fromTemplateUrl('build/pages/application/timesheet/write/modal/flybackList.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.flybackModal = modal;
      });

      $scope.selectAddress = function (address) {
        if (baseConfig.debug) {
          console.log("selectAddress.address " + angular.toJson(address));
        }
        $scope.timesheetDetail.currentAddress = address;
        $scope.addressModal.hide();
      };

      $scope.selectFlyback = function (flyback) {
        if (baseConfig.debug) {
          console.log("selectAddress.flyback " + angular.toJson(flyback));
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
        }
        $scope.showProjectName = true; //默认显示项目名称
        $scope.showRocket = false; //默认不显示小火箭image
        $scope.showConnectBlock = false; //默认不显示连接块
        $scope.showDetailArrow = true; //默认显示向右的箭头--go list detail
        $scope.showLsLoading = false; //loading默认不显示
        var clickSelectAll = false; //默认没有点击全选
        $scope.endApproveDate = "";
        $scope.actionName = "操作";
        $scope.selectArray = [];
        $scope.isClickedProject = []; //控制点击选择筛选条目的样式(modal-filter)
        $scope.selectEndItem = [false, true, false]; //控制点击选择截止日期条目的样式(modal-date)
        $scope.listInfoArray = {};
        $scope.personList = [];
        $scope.projectList = [];
        $scope.endDateList = [{//记录常用的三个截止日期
          dateValue: getMonthDay(getLastMonthDate(new Date())).replace(/\b(0+)/gi, ""),
          dateCode: getLastMonthDate(new Date())
        }, {
          dateValue: getMonthDay(getCurrentDate(new Date())).replace(/\b(0+)/gi, ""),
          dateCode: getCurrentDate(new Date())
        }, {
          dateValue: getMonthDay(getCurrentMonthLastDate(new Date())).replace(/\b(0+)/gi, ""),
          dateCode: getCurrentMonthLastDate(new Date())
        }];
        var position = ""; //记录滚动条的位置
        var selectItem = []; //初始化点击全部条目为false
        var tsLsUrl = baseConfig.businessPath + "/api_timesheet/get_timesheet_list";
        var tsProjectPersonListUrl = baseConfig.businessPath + "/api_timesheet/get_project_person_list";
        var tsActionUrl = baseConfig.businessPath + "/api_timesheet/timesheet_approve";
        var tsListParams = { //获取列表的参数
          "params": {
            "p_employee_number": window.localStorage.empno, //参考angularjs的localStorange--
            "p_start_date": "",
            "p_end_date": "",
            "p_project_name": "",
            "p_project_id": "",
            "p_project_person_number": "",
            "p_page": 1,
            "p_page_size": 6
          }
        };
        var tsActionParams = { //审批拒绝/通过的参数
          "params": {
            "p_approve_flag": "AGREE",
            "p_employee_number": window.localStorage.empno,
            "p_param_json": ''
          }
        };
        var approveList = { //审批拒绝/通过的子对象
          "approve_list": []
        };
        var currentDay = new Date().getDate();
        if (currentDay <= 10) {
          tsListParams.params.p_end_date = getLastMonthDate(new Date());
          $scope.endApproveDate = getMonthDay(getLastMonthDate(new Date())).replace(/\b(0+)/gi, "");
        } else if (currentDay > 10 && currentDay <= 20) {
          tsListParams.params.p_end_date = getCurrentDate(new Date());
          $scope.endApproveDate = getMonthDay(getCurrentDate(new Date())).replace(/\b(0+)/gi, "");
        } else if (currentDay > 20) {
          tsListParams.params.p_end_date = getCurrentMonthLastDate(new Date());
          $scope.endApproveDate = getMonthDay(getCurrentMonthLastDate(new Date())).replace(/\b(0+)/gi, "");
        }
      }

      /**
       * 立即执行 拉取数据的代码
       */
      function initData() {
        $scope.showLsLoading = true;
        hmsHttp.post(tsProjectPersonListUrl, tsListParams).success(function (response) {
          if (hmsHttp.isSuccessfull(response.status)) {
            $scope.personList = unique_better(response.project_person_list, 'employee_number');
            $scope.projectList = unique_better(response.project_list, 'project_id');
          }
        }).error(function (e) {
        });
        $scope.listInfoArray = new TsApproveListService($scope, tsLsUrl, tsListParams, $scope.showLsLoading);
      };
      initData();

      $scope.$on('$ionicView.enter', function (e) {
        if (ApproveDetailService.getRefreshFlag() === 'refresh-approve-list') {
          $scope.tsListRefresh();
        }
      });

      $scope.$on('$destroy', function (e) {
        log('tsApproveListCtrl.$destroy');
      });

      function __initSelectArray(selectParam) { //初始化选择按钮
        //先初始化数据操作--
        $scope.selectArray = [];
        selectItem = [];
        angular.forEach($scope.listInfoArray.listArray, function (data, index) {
          if ('undoSelectAll' == selectParam) {
            $scope.selectArray.push(false);
            selectItem.push(false);
          } else if ('selectedAll' == selectParam) {
            $scope.selectArray.push(true);
            selectItem.push(true);
          }
        });
      };
      __initSelectArray('undoSelectAll');

      $scope.doSelectAction = function () { //header 右上角显示操作按钮
        if ($scope.actionName == "操作") {
          $scope.actionName = "取消";
          $scope.showDetailArrow = false;
          angular.element('.ts-approve-list-item').css("paddingLeft", "10%");
        } else if ($scope.actionName == "取消") {
          $scope.actionName = "操作";
          $scope.showDetailArrow = true;
          angular.element('.ts-approve-list-item').css("paddingLeft", "10px");
          tsActionParams = { //审批拒绝/通过的参数
            "params": {
              "p_approve_flag": "AGREE",
              "p_employee_number": window.localStorage.empno,
              "p_param_json": ''
            }
          };
          approveList = {
            "approve_list": []
          };
          __initSelectArray('undoSelectAll');
        }
      };

      $ionicModal.fromTemplateUrl('build/pages/application/timesheet-approve/modal/ts-date-modal.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.dateModal = modal;
      });

      $ionicPopover.fromTemplateUrl("endDate.html", {
        scope: $scope
      }).then(function (popover) {
        $scope.endDatePopover = popover;
      });

      $scope.selectEndDate = function ($event) { //显示截止日期列表界面
        tsListParams.params.p_end_date = $scope.endApproveDate;
        if (ionic.Platform.isIOS()) {
          $scope.endDatePopover.show($event);
          angular.element('#popover-date2').css('borderBottom', '0px');
        } else {
          $scope.dateModal.show();
        }
      };


      $scope.chooseStartDate = function () {//选择开始日期
        var myDate = $scope.startDate = new Date();
        var previousDate = new Date(myDate.year, myDate.month - 1, myDate.day);
        var options = {
          date: previousDate,
          mode: 'date',
          titleText: '请选择截止日期',
          okText: '确定',
          cancelText: '取消',
          doneButtonLabel: '确认',
          cancelButtonLabel: '取消',
          androidTheme: window.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
          locale: "zh_cn"
        }
        $cordovaDatePicker.show(options).then(function (date) {
          var month = date.getMonth() + 1;
          var day = date.getDate();
          var weekday = date.getDay();
          if (weekday == 0) {
            $scope.startDate.weekday = "周日";
          } else if (weekday == 1) {
            $scope.startDate.weekday = "周一";
          } else if (weekday == 2) {
            $scope.startDate.weekday = "周二";
          } else if (weekday == 3) {
            $scope.startDate.weekday = "周三";
          } else if (weekday == 4) {
            $scope.startDate.weekday = "周四";
          } else if (weekday == 5) {
            $scope.startDate.weekday = "周五";
          } else if (weekday == 6) {
            $scope.startDate.weekday = "周六";
          }
          if (month < 10) {
            month = "0" + month;
          }
          if (day < 10) {
            day = "0" + day;
          }
          $scope.startDate.year = date.getFullYear();
          $scope.startDate.month = month;
          $scope.startDate.day = day;
          $scope.$apply();
        });
      };
      $scope.selectEndDateItem = function (newEndDateCode, newEndDateValue, newIndex) { //选择不同的截止日期
        $scope.selectEndItem = [];
        $scope.selectEndItem[newIndex] = true;
        $scope.endApproveDate = newEndDateValue;
        tsListParams.params.p_page = 1;
        tsListParams.params.p_end_date = newEndDateCode;
        $scope.listInfoArray = new TsApproveListService($scope, tsLsUrl, tsListParams, $scope.showLsLoading);
        if (ionic.Platform.isIOS()) {
          $scope.endDatePopover.hide();
        } else {
          $scope.dateModal.hide();
        }
      };

      $scope.cancelDateModal = function () { //取消date modal
        tsListParams.params.p_end_date = $scope.endApproveDate;
        $scope.dateModal.hide()
      };

      $scope.onDrag = function () { //拖拽
        $scope.showConnectBlock = false;
      };

      $scope.onDragUp = function () { //向上拖拽
        $scope.showConnectBlock = true; //显示连接块
      };

      $scope.watchScroll = function () { //滚动内容时执行的method
        position = $ionicScrollDelegate.getScrollPosition().top;
        $scope.$apply(function () {
          if (position < 0) {
            $scope.showConnectBlock = false;
          } else if (position >= 0 && position < 400) { //在顶部时显示连接块
            $scope.showRocket = false;
            $scope.showConnectBlock = true;
          } else if (position >= 400) {
            $scope.showRocket = true;
          } else {
          }
        });
      };

      $scope.tsListRefresh = function () { //下拉刷新
        tsListParams.params.p_page = 1;
        $scope.listInfoArray = new TsApproveListService($scope, tsLsUrl, tsListParams, $scope.showLsLoading);
      };

      $scope.getAttentionInfo = function (e, newWarnList) {
        if (!$scope.showDetailArrow) {
          return;
        }
        e.stopPropagation(); //阻止事件冒泡
        warn(newWarnList);
        $ionicPopup.show({
          template: '<div class="warn-attention-icon">' + newWarnList[0].description + '</div>',
          scope: $scope,
          buttons: [
            {
              text: '<div class="warn-cancel-icon"></div>',
              type: 'button-clear',
              onTap: function (e) {
              }
            }
          ]
        });
      };

      $scope.goTsLsTop = function () { //返回列表顶部
        angular.element('#rocket').addClass('ng-hide');
        $ionicScrollDelegate.scrollTop(true);
      };

      $ionicModal.fromTemplateUrl('build/pages/application/timesheet-approve/modal/ts-filter-modal.html', { //筛选modal
        scope: $scope
      }).then(function (modal) {
        $scope.tsFilterModal = modal;
      });

      $scope.filterTsInfo = function () { //响应筛选按钮的方法
        tsListParams.params.p_project_id = "";
        tsListParams.params.p_project_person_number = "";
        $scope.tsFilterModal.show();
      };

      $scope.goApproveDetail = function (index, newEmployeeNumber, newProjectId, newStartDate, newEndDate) {
        if ($scope.showDetailArrow) {
          $state.go('tab.tsApproveDetail', {
              'employeeNumber': newEmployeeNumber,
              'projectId': newProjectId,
              'startDate': newStartDate,
              'endDate': newEndDate
            }
          );
        } else {
          selectItem[index] = !selectItem[index];
          var approve = {
            "p_project_id": "",
            "p_project_person_number": "",
            "p_start_date": "",
            "p_end_date": "",
            "p_record_id": ""
          };
          if (selectItem[index]) {
            $scope.selectArray[index] = true;
            approve.p_project_id = newProjectId;
            approve.p_project_person_number = newEmployeeNumber;
            approve.p_start_date = newStartDate;
            approve.p_end_date = newEndDate;
            approveList.approve_list[index] = approve;
          } else {
            approveList.approve_list.splice(index, 1, 'delete');
            $scope.selectArray[index] = false;
          }
        }
      };

<<<<<<< HEAD
      $scope.selectAllList = function () { //全选
        clickSelectAll = !clickSelectAll;
        if (clickSelectAll) {
          for (var i = 0; i < $scope.listInfoArray.listArray.length; i++) {
            var approve = {
              "p_project_id": "",
              "p_project_person_number": "",
              "p_start_date": "",
              "p_end_date": "",
              "p_record_id": ""
            };
            approve.p_project_id = $scope.listInfoArray.listArray[i].project_id;
            approve.p_project_person_number = $scope.listInfoArray.listArray[i].employee_number;
            approve.p_start_date = $scope.listInfoArray.listArray[i].start_date;
            approve.p_end_date = $scope.listInfoArray.listArray[i].end_date;
            approveList.approve_list.push(approve);
=======
        var success = function (result) {
          hmsPopup.hideLoading();
          if (result.status == 'S') {
            hmsPopup.showPopup('提交Timesheet成功');
            $rootScope.$broadcast('refreshTimesheet', 'parent');
            $ionicHistory.goBack();
          } else {
            hmsPopup.showPopup('提交Timesheet错误,错误原因为');
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
          }
          __initSelectArray('selectedAll');
        } else {
          approveList.approve_list = [];
          __initSelectArray('undoSelectAll');
        }
      };

<<<<<<< HEAD
      function deleteSuperfluous() {
        for (var i = 0; i < approveList.approve_list.length; i++) {
          if (approveList.approve_list[i] === 'delete') {
            approveList.approve_list.splice(i, 1);
            i--;
          } else if (!approveList.approve_list[i] || approveList.approve_list[i] == "" || typeof(approveList.approve_list[i]) == "undefined") {
            approveList.approve_list.splice(i, 1);
            i--;
          }
        }
      };
      $scope.passThroughListItem = function () { //通过
        if (approveList.approve_list.length === 0) {
          hmsPopup.showShortCenterToast('请先选择操作项！');
          return;
        }
        deleteSuperfluous();
        tsActionParams.params.p_approve_flag = "AGREE";
        tsActionParams.params.p_param_json = JSON.stringify(approveList);
        hmsPopup.showLoading("审批中...");
        hmsHttp.post(tsActionUrl, tsActionParams).success(function (response) {
          hmsPopup.hideLoading();
          if (hmsHttp.isSuccessfull(response.status)) {
            hmsPopup.showShortCenterToast('审批成功！');
          } else {
            hmsPopup.showShortCenterToast('审批失败！');
          }
          $scope.doSelectAction();
          $timeout(function () {
            $scope.tsListRefresh();
          }, 1000);
        }).error(function (e) {
          hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast('审批失败！请检查网络稍后重试');
          $scope.doSelectAction();
          $timeout(function () {
            $scope.tsListRefresh();
          }, 1000);
        });
      };

      $scope.refuseListItem = function () { //拒绝
        if (approveList.approve_list.length === 0) {
          hmsPopup.showShortCenterToast('请先选择操作项！');
          return;
        }
        deleteSuperfluous();
        tsActionParams.params.p_approve_flag = "REFUSE";
        tsActionParams.params.p_param_json = JSON.stringify(approveList);
        hmsPopup.showLoading("审批中...");
        hmsHttp.post(tsActionUrl, tsActionParams).success(function (response) {
          hmsPopup.hideLoading();
          if (hmsHttp.isSuccessfull(response.status)) {
            hmsPopup.showShortCenterToast('拒绝成功！');
          } else {
            hmsPopup.showShortCenterToast('拒绝失败！');
          }
          $scope.doSelectAction();
          $timeout(function () {
            $scope.tsListRefresh();
          }, 1000);
        }).error(function (e) {
          hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast('拒绝失败！请检查网络稍后重试');
          $scope.doSelectAction();
          $timeout(function () {
            $scope.tsListRefresh();
          }, 1000);
        });
      };

      /**
       *  筛选modal方法区--
       */
      $scope.selectScreening = function (selectParam) {
        if (selectParam == 'projectName') {
          $scope.showProjectName = true;
          angular.element('#project-name').css({'backgroundColor': 'white', 'color': '#4A4A4A'});
          angular.element('#person-select').css({'backgroundColor': '#fafafa', 'color': '#9b9b9b'});
        } else if (selectParam == 'personSelect') {
          $scope.showProjectName = false;
          angular.element('#person-select').css({'backgroundColor': 'white', 'color': '#4A4A4A'});
          angular.element('#project-name').css({'backgroundColor': '#fafafa', 'color': '#9b9b9b'});
=======
      //从服务器获取请求
      $timeout(
        function () {
          hmsPopup.showLoading('获取timesheet明细数据');
          TimeSheetService.fetchEachDay(fetchEachDay, $scope.currentDate);
=======

    $scope.detailData = costApply.data;

    if ($scope.detailData.status == '') {
        $scope.showButtonSave = true;
        $scope.showButtonSubmit = false;

    }
    else if ($scope.detailData.status == 'NEW') {

        $scope.showButtonSave = false;
        $scope.showButtonSubmit = true;


    }
    else {
        $scope.showButtonSave = false;
        $scope.showButtonSubmit = false;

    }

    //showMessage(angular.toJson($scope.detailData));
    /********
     * 费用申请 保存
     */
    $scope.saveData = function() {




        costApply.data = $scope.detailData;


        var checkDataValid = true;
        showMessage(costApply.data.cost_type_id );

        if (costApply.data.cost_type_code != 'BX_002'  ) {


            //showMessage(costApply.data.cost_amount);
            // 非 无消费明细 金额 不能为空
            if(costApply.data.cost_amount == "" || costApply.data.cost_amount == undefined ) {

                $ionicLoading.show({
                    template: '请输入金额 ... ',
                    duration: 1000
                });
                //showMessage("请输入金额");
                checkDataValid = false;
            }
>>>>>>> xbr
        }
      );
    }
  ])
;

<<<<<<< HEAD
/**
 * Created by wolf on 2016/5/21. (_wen.dai_)
 */
'use strict';
//应用-timeSheet审批模块-详情
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.tsApproveDetail', {
          url: 'application/tsApproveDetail',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/timesheet-approve/detail/ts-approve-detail.html',
              controller: 'tsApproveDetailCtrl'
            }
          },
          params: {
            'employeeNumber': "",
            'projectId': "",
            'startDate': "",
            'endDate': ""
          }
        })
    }]);
tsApproveModule.controller('tsApproveDetailCtrl', [
  '$scope',
  '$state',
  'baseConfig',
  '$ionicHistory',
  '$stateParams',
  'hmsHttp',
  'hmsPopup',
  '$timeout',
  'ApproveDetailService',
  function ($scope,
            $state,
            baseConfig,
            $ionicHistory,
            $stateParams,
            hmsHttp,
            hmsPopup,
            $timeout,
            ApproveDetailService) {

    /**
     * init var section
     */
    {
      if(ionic.Platform.isIOS()) {
        angular.element('.ae-detail-head').css('marginTop','64px');
        angular.element('#approveDetailContent').css('top','64px');
      }
      var selectItem = []; //初始化点击全部条目为false
      var clickSelectAll = false; //默认没有点击全选
      $scope.detailActionName = "操作";
      $scope.showActionBar = false; //默认不显示勾选按钮和底部的bar
      $scope.detailInfoArray = {}; //用于接收列表对应数据object
      $scope.selectArray = [];
      var tsApproveDetailUrl = baseConfig.businessPath + "/api_timesheet/query_timesheet_approve_list";
      var tsApproveDetailParams = {
        "params": {
          "p_employee_number": $stateParams.employeeNumber,
          "p_start_date": $stateParams.startDate.toString(),
          "p_end_date": $stateParams.endDate.toString(),
          "p_project_id": $stateParams.projectId
        }
      };
      var tsActionUrl = baseConfig.businessPath + "/api_timesheet/timesheet_approve";
      var tsActionParams = { //审批拒绝/通过的参数
        "params": {
          "p_approve_flag": "AGREE",
          "p_employee_number": window.localStorage.empno,
          "p_param_json": ''
        }
      };
      var approveList = { //审批拒绝/通过的子对象
        "approve_list": []
      };
    }

    $scope.$on('$ionicView.enter', function (e) {
      ApproveDetailService.setRefreshFlag('');
    });

    $scope.$on('$destroy', function (e) {
      warn('tsApproveListCtrl.$destroy');
    });

    hmsPopup.showLoading('加载中...');
    function getData() {
      hmsHttp.post(tsApproveDetailUrl, tsApproveDetailParams).success(function (response) {
        hmsPopup.hideLoading();
        if (hmsHttp.isSuccessfull(response.status)) {
          $scope.detailInfoArray = response.timesheet_approve_detail_response;
          if ($scope.detailInfoArray.subsidy_list.length === 0) {
            ApproveDetailService.setRefreshFlag('refresh-approve-list');
            $ionicHistory.goBack();
          }
        } else {
          if (response.status === 'E' || response.status == 'e') {
            hmsPopup.showShortCenterToast("没有相关数据!");
          } else {
            hmsPopup.showShortCenterToast("网络异常,请稍后重试!");
          }
        }
      }).error(function (response, status) {
        hmsPopup.hideLoading();
        hmsPopup.showShortCenterToast("服务请求异常,请检查网络连接和输入参数后重新操作!");
      });
    };
    getData();

    function __initSelectArray(selectParam) { //初始化选择按钮
      //先初始化数据操作--
      $scope.selectArray = [];
      selectItem = [];
      angular.forEach($scope.detailInfoArray.subsidy_list, function (data, index) {
        if ('undoSelectAll' == selectParam) {
          $scope.selectArray.push(false);
          selectItem.push(false);
        } else if ('selectedAll' == selectParam) {
          $scope.selectArray.push(true);
          selectItem.push(true);
        }
      });
    };
    __initSelectArray('undoSelectAll');

    $scope.dealDetailInfo = function () {
      if ($scope.detailActionName == "操作") {
        $scope.detailActionName = "取消";
        $scope.showActionBar = true;
        angular.element('#tsApproveItem').css('paddingLeft', '6%');
      } else if ($scope.detailActionName == "取消") {
        $scope.detailActionName = "操作";
        $scope.showActionBar = false;
        __initSelectArray('undoSelectAll');
        angular.element('#tsApproveItem').css('paddingLeft', '0');
        tsActionParams = { //审批拒绝/通过的参数
          "params": {
            "p_approve_flag": "AGREE",
            "p_employee_number": window.localStorage.empno,
            "p_param_json": ''
          }
        };
        approveList = {
          "approve_list": []
        };
      }
    };

    $scope.selectItem = function (index, newLineNumber) { //单击选中条目的响应method
      selectItem[index] = !selectItem[index];
      var approve = {
        "p_project_id": $scope.detailInfoArray.project_id,
        "p_project_person_number": $scope.detailInfoArray.employee_number,
        "p_start_date": "",
        "p_end_date": "",
        "p_record_id": ""
      };
      if (selectItem[index]) {
        $scope.selectArray[index] = true;
        approve.p_record_id = newLineNumber;
        approveList.approve_list[index] = approve;
      } else {
        $scope.selectArray[index] = false;
        approveList.approve_list.splice(index, 1, 'delete');
      }
    };

    $scope.selectAllDetail = function () { //全选
      clickSelectAll = !clickSelectAll;
      if (clickSelectAll) {
        __initSelectArray('selectedAll');
        for (var i = 0; i < $scope.detailInfoArray.subsidy_list.length; i++) {
          var approve = {
            "p_project_id": $scope.detailInfoArray.project_id,
            "p_project_person_number": $scope.detailInfoArray.employee_number,
            "p_start_date": "",
            "p_end_date": "",
            "p_record_id": ""
          };
          approve.p_record_id = $scope.detailInfoArray.subsidy_list[i].line_number;
          approveList.approve_list.push(approve);
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
        }
        warn(approveList.approve_list);
      } else {
        __initSelectArray('undoSelectAll');
        approveList.approve_list = [];
      }
    };

<<<<<<< HEAD
      $scope.selectFilterItem = function (newName, index, newId) { //点击modal单个条目时的响应方法
        if (newName === 'projectName') {
          $scope.isClickedProject = [];
          $scope.isClickedProject[index] = true;
          tsListParams.params.p_project_id = newId;
        } else if (newName === 'personSelect') {
          $scope.isClickedPerson = [];
          $scope.isClickedPerson[index] = true;
          tsListParams.params.p_project_person_number = newId;
=======
    function deleteSuperfluous() {
      for (var i = 0; i < approveList.approve_list.length; i++) {
        if (approveList.approve_list[i] === 'delete') {
          approveList.approve_list.splice(i, 1);
          i--;
        } else if (!approveList.approve_list[i] || approveList.approve_list[i] == "" || typeof(approveList.approve_list[i]) == "undefined") {
          approveList.approve_list.splice(i, 1);
          i--;
=======
        if (checkDataValid == true ) {
            $ionicLoading.show({
                template: '请等待 ... '
                //duration: 1000
            });


            var promise = costApply.save();
            promise.then(
                function(response) {
                    var code = response.status;
                    if (code == "S") {



                        costApply.data.cost_apply_id = response.apply_id;


                        //$scope.canEdit=false;
                        costApply.canSubmit = true;
                        $scope.canSubmit = true;

                        dialog.showAlert("I","保存成功");

                        //showMessage(angular.toJson(response));
                        $ionicLoading.hide();


                    }
                    else {
                        $ionicLoading.hide();
                        dialog.showAlert("E","保存失败"+angular.toJson(response));


                        showMessage("error :"+angular.toJson(response));
                    }
                },
                function (error) {
                    $ionicLoading.hide();
                    dialog.showAlert("E","保存失败"+angular.toJson(error));
                    showMessage(angular.toJson(error));
                }
            )
>>>>>>> xbr
        }
      }
    };

<<<<<<< HEAD
    $scope.passThroughDetailItem = function () { //通过
      if (approveList.approve_list.length === 0) {
        hmsPopup.showShortCenterToast('请先选择操作项！');
        return;
      }
      deleteSuperfluous();
      tsActionParams.params.p_approve_flag = "AGREE";
      tsActionParams.params.p_param_json = JSON.stringify(approveList);
      hmsPopup.showLoading("审批中...");
      hmsHttp.post(tsActionUrl, tsActionParams).success(function (response) {
        hmsPopup.hideLoading();
        if (hmsHttp.isSuccessfull(response.status)) {
          hmsPopup.showShortCenterToast('审批成功！');
        } else {
          hmsPopup.showShortCenterToast('审批失败！');
        }
        $scope.dealDetailInfo();
        $timeout(function () {
          hmsPopup.showLoading('加载中...');
          getData();
        }, 1000);
      }).error(function (e) {
        hmsPopup.hideLoading();
        hmsPopup.showShortCenterToast('审批失败！请检查网络稍后重试');
        $scope.dealDetailInfo();
        $timeout(function () {
          hmsPopup.showLoading('加载中...');
          getData();
        }, 1000);
      });
    };

    $scope.refuseDetailItem = function () { //拒绝
      if (approveList.approve_list.length === 0) {
        hmsPopup.showShortCenterToast('请先选择操作项！');
        return;
      }
      deleteSuperfluous();
      tsActionParams.params.p_approve_flag = "REFUSE";
      tsActionParams.params.p_param_json = JSON.stringify(approveList);
      hmsPopup.showLoading("审批中...");
      hmsHttp.post(tsActionUrl, tsActionParams).success(function (response) {
        hmsPopup.hideLoading();
        if (hmsHttp.isSuccessfull(response.status)) {
          hmsPopup.showShortCenterToast('拒绝成功');
        } else {
          hmsPopup.showShortCenterToast('拒绝失败！');
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
        }
        $scope.dealDetailInfo();
        $timeout(function () {
          hmsPopup.showLoading('加载中...');
          getData();
        }, 1000);
      }).error(function (e) {
        hmsPopup.hideLoading();
        hmsPopup.showShortCenterToast('拒绝失败！请检查网络稍后重试');
        $scope.dealDetailInfo();
        $timeout(function () {
          hmsPopup.showLoading('加载中...');
          getData();
        }, 1000);
      });
    };
  }]).service('ApproveDetailService', function () {
  var flag = ''; //刷新上个列表的标识
  return {
    setRefreshFlag: function (newFlag) {
      flag = newFlag;
    },
    getRefreshFlag: function () {
      return flag;
    }
  }
});

<<<<<<< HEAD
      function __initModal() { //初始化modal的样式
        $scope.tsFilterModal.hide();
        $scope.showProjectName = true;
        $scope.isClickedProject = [];
        $scope.isClickedPerson = [];
        angular.element('#project-name').addClass('active-select');
        angular.element('#project-name').removeClass('active-off');
        angular.element('#person-select').removeClass('active-select');
=======
=======




    };

    /********
     * 费用申请 提交
     */
    $scope.submitData = function() {

       //showMessage("提交数据接口 接口 未实现");

        $ionicLoading.show({
            template: '数据提交中 请稍后 ... '
        });

        var promise = costApply.submit();
        promise.then(
            function(response) {
                var code = response.status;
                if (code == "S") {

                    //costApply.cost_apply_id = response.apply_id;
                    $scope.canEdit=false;

                    dialog.showAlert("I","提交成功");

                    showMessage(angular.toJson(response));


                }
                else {
                    dialog.showAlert("E","提交失败"+angular.toJson(response));

                    showMessage("error :"+angular.toJson(response));
                }

                $ionicLoading.hide();
            },
            function (error) {
                $ionicLoading.hide();
                dialog.showAlert("E","提交失败"+angular.toJson(error));


                showMessage(angular.toJson(error));
            }
        )
    };




    /*********
     * 字段列表 项目
     */
    $scope.openCostProjectItemList = function() {
        if ($scope.canEdit == true)  {
            $scope.valueChange();

            $state.go("tab.cst_costProjectItemList");

        }

    };

    /**********
     * 字段列表 费用类型
     */
    $scope.openCostTypeItemList = function() {
        if ($scope.canEdit == true)  {
            $scope.valueChange();

            $state.go("tab.cst_costTypeItemList");

        }
>>>>>>> xbr



    };

    $scope.valueChange=function(){
        //showMessage("valueChange");
        costApply.canSubmit=false;
        $scope.canSubmit=false;
    };

    /**********
     * 取消
     */
    $scope.cancel = function () {

        $ionicHistory.goBack();

    };





}]);

// 费用申请
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.cst_list', {
          url: '/expense/acc/costList',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/cst/costList.html',
              controller: 'costListController',
              cache: false
            }
          }
        });
<<<<<<< HEAD
    }]);
angular.module('tsApproveModule')
  .controller('tsApproveListCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicModal',
    '$ionicScrollDelegate',
    '$ionicPopup',
    '$timeout',
    'TsApproveListService',
    'hmsPopup',
    'hmsHttp',
    'ApproveDetailService',
    '$ionicPopover',
    '$cordovaDatePicker',
    function ($scope,
              $state,
              baseConfig,
              $ionicModal,
              $ionicScrollDelegate,
              $ionicPopup,
              $timeout,
              TsApproveListService,
              hmsPopup,
              hmsHttp,
              ApproveDetailService,
              $ionicPopover,
              $cordovaDatePicker) {
      /**
       * initial var section
       */
      {
        if (ionic.Platform.isIOS()) {
          angular.element('.custom-head').css('paddingTop', '10px');
          angular.element('.ts-list-bg').css('paddingTop', '110px');
        }
        $scope.showProjectName = true; //默认显示项目名称
        $scope.showRocket = false; //默认不显示小火箭image
        $scope.showConnectBlock = false; //默认不显示连接块
        $scope.showDetailArrow = true; //默认显示向右的箭头--go list detail
        $scope.showLsLoading = false; //loading默认不显示
        var clickSelectAll = false; //默认没有点击全选
        $scope.endApproveDate = "";
        $scope.actionName = "操作";
        $scope.selectArray = [];
        $scope.isClickedProject = []; //控制点击选择筛选条目的样式(modal-filter)
        $scope.listInfoArray = {};
        $scope.personList = [];
        $scope.projectList = [];
        $scope.endDateList = [{//记录常用的三个截止日期
          dateValue: getMonthDay(getLastMonthDate(new Date())).replace(/\b(0+)/gi, ""),
          dateCode: getLastMonthDate(new Date())
        }, {
          dateValue: getMonthDay(getCurrentDate(new Date())).replace(/\b(0+)/gi, ""),
          dateCode: getCurrentDate(new Date())
        }, {
          dateValue: getMonthDay(getCurrentMonthLastDate(new Date())).replace(/\b(0+)/gi, ""),
          dateCode: getCurrentMonthLastDate(new Date())
        }];
        var position = ""; //记录滚动条的位置
        var selectItem = []; //初始化点击全部条目为false
        var tsLsUrl = baseConfig.businessPath + "/api_timesheet/get_timesheet_list";
        var tsProjectPersonListUrl = baseConfig.businessPath + "/api_timesheet/get_project_person_list";
        var tsActionUrl = baseConfig.businessPath + "/api_timesheet/timesheet_approve";
        var tsListParams = { //获取列表的参数
          "params": {
            "p_employee_number": window.localStorage.empno, //参考angularjs的localStorange--
            "p_start_date": "",
            "p_end_date": "",
            "p_project_name": "",
            "p_project_id": "",
            "p_project_person_number": "",
            "p_page": 1,
            "p_page_size": 6
          }
        };
        var tsActionParams = { //审批拒绝/通过的参数
          "params": {
            "p_approve_flag": "AGREE",
            "p_employee_number": window.localStorage.empno,
            "p_param_json": ''
          }
        };
        var approveList = { //审批拒绝/通过的子对象
          "approve_list": []
        };
        var currentDay = new Date().getDate();
        if (currentDay <= 10) {
          tsListParams.params.p_end_date = getLastMonthDate(new Date());
          $scope.endApproveDate = getMonthDay(getLastMonthDate(new Date())).replace(/\b(0+)/gi, "");
          $scope.selectEndItem = [true, false, false]; //控制点击选择截止日期条目的样式(modal-date)
        } else if (currentDay > 10 && currentDay <= 20) {
          tsListParams.params.p_end_date = getCurrentDate(new Date());
          $scope.endApproveDate = getMonthDay(getCurrentDate(new Date())).replace(/\b(0+)/gi, "");
          $scope.selectEndItem = [false, true, false];
        } else if (currentDay > 20) {
          tsListParams.params.p_end_date = getCurrentMonthLastDate(new Date());
          $scope.endApproveDate = getMonthDay(getCurrentMonthLastDate(new Date())).replace(/\b(0+)/gi, "");
          $scope.selectEndItem = [false, false, true];
        }
      }

      /**
       * 立即执行 拉取数据的代码
       */
      function initData() {
        $scope.showLsLoading = true;
        hmsHttp.post(tsProjectPersonListUrl, tsListParams).success(function (response) {
          if (hmsHttp.isSuccessfull(response.status)) {
            $scope.personList = unique_better(response.project_person_list, 'employee_number');
            $scope.projectList = unique_better(response.project_list, 'project_id');
          }
        }).error(function (e) {
        });
        $scope.listInfoArray = new TsApproveListService($scope, tsLsUrl, tsListParams, $scope.showLsLoading);
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
      };
      initData();

<<<<<<< HEAD
      $scope.cancelFilter = function () { //取消按钮
        tsListParams.params.p_project_id = "";
        tsListParams.params.p_project_person_number = "";
        __initModal();
=======
      $scope.$on('$ionicView.enter', function (e) {
        if (ApproveDetailService.getRefreshFlag() === 'refresh-approve-list') {
          $scope.tsListRefresh();
        }
      });
=======
  }]);

angular.module("applicationModule")
  .controller('costListController', function ($scope, $http, $q, dialog, costApply, $state, $ionicLoading, baseConfig) {

    var statusType = {
      new: "NEW",
      submit: "SUBMIT"
    };
>>>>>>> xbr

    var currentListStatusType = statusType.new;

    $scope.canClickButton = {
      toSubmit: false,
      submitted: true,
      approved: true
    };

    var noApprove = document.getElementById("noApprove");// add by ciwei
    var alreadyApprove = document.getElementById("alreadyApprove");// add by ciwei

      $scope.$on('$stateChangeSuccess',
          function (event, toState, toParams, fromState, fromParams) {
            if (toState.name == 'tab.cst_list' && fromState.name == 'tab.cst_costDetail') {
              queryCostApplyList(currentListStatusType);
            }
          });

    $scope.changeTabButton = function (type) {

      switch (type) {
        case 'toSubmit':
          $scope.canClickButton = {
            toSubmit: false,
            submitted: true,
            approved: true
          };
          currentListStatusType = statusType.new;
          noApprove.style.backgroundColor = "#D1F4F6";
          noApprove.style.color = "#20CBD3";
          alreadyApprove.style.backgroundColor = "#20CBD3";
          alreadyApprove.style.color = "white";
          break;

        case 'submitted':
          $scope.canClickButton = {
            toSubmit: true,
            submitted: false,
            approved: true
          };

          currentListStatusType = statusType.submit;
          alreadyApprove.style.backgroundColor = "#D1F4F6";
          alreadyApprove.style.color = "#20CBD3";
          noApprove.style.backgroundColor = "#20CBD3";
          noApprove.style.color = "white";
          break;
        case 'approved':
          $scope.canClickButton = {
            toSubmit: true,
            submitted: true,
            approved: false
          };

          currentListStatusType = statusType.submit;

          break;
        default :
          showMessage("未知按钮");
          break;
      }
      queryCostApplyList(currentListStatusType);

    };


    /***************
     *  功能： 查询指定状态的 预报销申请列表
     * @param statusType: NEW ,SUBMIT
     * @returns {*}
     */
    function queryListData(statusType) {

      var deferred = $q.defer();

      var Url = baseConfig.businessPath + "/expenses_apply/get_apply_list";
      var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_status":"' + statusType + '","p_project_id":"' + "" + '"}}';


      console.log(PostData);
      showMessage(PostData);
      $http.post(Url, PostData).success(function (data) {

        //showMessage(angular.toJson(data));
        deferred.resolve(data);

      }).error(function (data) {
        showMessage("error:" + angular.toJson(data));

        deferred.reject(data);

      });


      return deferred.promise;
    }

    function queryCostApplyList(statusType) {

      $ionicLoading.show({
        template: 'Loading...',
        duration: 1000
      });

      var promise = queryListData(statusType);
      promise.then(
        function (response) {
          var detailData = [];
          console.log(angular.toJson(response));
          var code = response.status;
          if (code == "S") {

            var list_tmp = response["apply_list"];
            $.each(list_tmp, function (i, value) {
              var item = {

                cost_apply_id: value.apply_id,
                cost_place: value.location,
                cost_date: value.apply_date,
                cost_type_id: '',
                cost_type_code: value.apply_type_code,
                cost_type_name: value.apply_type_name,
                cost_subject_code: value.subject_code,
                cost_project_code: value.project_code,
                cost_project_id: value.project_id,
                cost_project_name: value.project_name,
                cost_full_name: value.full_name,
                cost_amount: value.apply_money,
                description: value.reason,
                apply_by: value.apply_by,
                status: value.status
              };


<<<<<<< HEAD
      $scope.chooseStartDate = function () {//选择开始日期
        var myDate = $scope.startDate = new Date();
        var previousDate = new Date(myDate.year, myDate.month - 1, myDate.day);
        var options = {
          date: previousDate,
          mode: 'date',
          titleText: '请选择截止日期',
          okText: '确定',
          cancelText: '取消',
          doneButtonLabel: '确认',
          cancelButtonLabel: '取消',
          androidTheme: window.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
          locale: "zh_cn"
        };
        $cordovaDatePicker.show(options).then(function (date) {
          var month = date.getMonth() + 1;
          var day = date.getDate();
          var weekday = date.getDay();
          if (weekday == 0) {
            $scope.startDate.weekday = "周日";
          } else if (weekday == 1) {
            $scope.startDate.weekday = "周一";
          } else if (weekday == 2) {
            $scope.startDate.weekday = "周二";
          } else if (weekday == 3) {
            $scope.startDate.weekday = "周三";
          } else if (weekday == 4) {
            $scope.startDate.weekday = "周四";
          } else if (weekday == 5) {
            $scope.startDate.weekday = "周五";
          } else if (weekday == 6) {
            $scope.startDate.weekday = "周六";
          }
          if (month < 10) {
            month = "0" + month;
=======
              detailData.push(item);

            });


            $scope.applyList = detailData;
            costApply.appLyList = detailData;

>>>>>>> xbr
          }
          else {
            dialog.showAlert("E", "查询失败");
            //dialog.showAlert("E","查询失败"+angular.toJson(response));

            showMessage("error :" + angular.toJson(response));
          }

          //console.log(angular.toJson($scope.expenseItemList));

          $ionicLoading.hide();

        },
        function (err) {  // 处理错误 .reject

          dialog.showAlert("E", "网络连接错误...." + angular.toJson(err));

          showMessage("网络连接错误...." + angular.toJson(err));

        });

<<<<<<< HEAD
      $scope.cancelDateModal = function () { //取消date modal
        //tsListParams.params.p_end_date = $scope.endApproveDate;//这个地方有小bug
        $scope.dateModal.hide()
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
      };

      $scope.confirmFilter = function () { //确定按钮
        __initModal();
        tsListParams.params.p_page = 1;
        $scope.showLsLoading = true;
        $scope.listInfoArray = new TsApproveListService($scope, tsLsUrl, tsListParams, $scope.showLsLoading);
      };

      $scope.clearFilterParams = function () { //响应清空筛选的点击
        $scope.isClickedProject = [];
        $scope.isClickedPerson = [];
        tsListParams.params.p_project_id = "";
        tsListParams.params.p_project_person_number = "";
      };
    }])
/**
 * @params:
 *  1:scope  //controller的作用域
 *  2:url //请求地址
 *  3:params //请求的参数
 *  4: refurbishParam //控制下拉刷线的参数
 *  5:busy //用于控制下拉刷新的flag
 *  6:totalNumber //获取的数据总数
 *  7:listArray //数据列表
 *  8:loading //数据加载标记
 */
  .service('TsApproveListService', ['hmsHttp', 'baseConfig', 'hmsPopup',
    function (hmsHttp, baseConfig, hmsPopup) {
      var TsApproveListService = function (scope, requestUrl, requestSearchParams, loadingFlag, refurbishParam) {
        var _self = this;
        _self.scope = scope;
        _self.url = requestUrl;
        _self.params = {};
        _self.params = requestSearchParams;
        _self.refurbishParam = refurbishParam;
        _self.busy = false;
        _self.totalNumber = 0;
        _self.listArray = [];
        _self.loading = loadingFlag;
        if (_self.refurbishParam === 'clickRefreshEvent') {
          _self.scope.$broadcast('scroll.infiniteScrollComplete');
        }

        hmsHttp.post(_self.url, _self.params).success(function (response) {
          _self.loading = false;
          try {
            if (hmsHttp.isSuccessfull(response.status)) {
              var tsResult = response.timesheet_approve_response;
              if (baseConfig.debug) {
                warn('hi,create a new factory!!' + '\n' + jsonFormat());
              }
              _self.totalNumber = response.count;
              try {
                _self.listArray = _self.listArray.concat(tsResult.result_list);
              } catch (e) {
                _self.listArray = [];
                _self.projectList = [];
                _self.employeeList = [];
              }
              if (response.count == 0) {
                _self.busy = false;
                _self.listArray = [];
              } else if (response.count <= 6) {
                _self.busy = false;
              } else {
                _self.busy = true;
              }
              _self.scope.$broadcast('scroll.refreshComplete');
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              _self.busy = false;
              if (response.status === 'E' || response.status == 'e') {
                hmsPopup.showShortCenterToast("没有相关数据!");
              } else {
                hmsPopup.showShortCenterToast("网络异常,请稍后重试!");
              }
              _self.scope.$broadcast('scroll.refreshComplete');
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
            }
          } catch (e) {
          }

        }.bind(_self)).error(function (error) {
          _self.loading = false;
          _self.params.params.p_page = 1;
          _self.busy = false;
          _self.scope.$broadcast('scroll.refreshComplete');
          _self.scope.$broadcast('scroll.infiniteScrollComplete');
          hmsPopup.showShortCenterToast("服务请求异常,请检查网络连接和输入参数后重新操作!");
        }.bind(_self));
      };
      TsApproveListService.prototype.nextPage = function () {
        var _self = this;
        if (baseConfig.debug) {
          warn('enter next page!');
        }
        if (!_self.busy) {
          return;
        }
        if (_self.busy) {
          if (_self.refurbishParam === 'clickRefreshEvent') {
            _self.refurbishParam = '';
            _self.scope.$broadcast('scroll.infiniteScrollComplete');
            return;
          }
        }
        _self.busy = true;
        _self.params.params.p_page++;
        hmsHttp.post(_self.url, _self.params).success(function (response) {
          try {
            if (hmsHttp.isSuccessfull(response.status)) {
              if (angular.isUndefined(response.timesheet_approve_response.result_list)) {
                _self.busy = false;
                hmsPopup.showShortCenterToast("数据已经加载完毕!");
              } else {
                var tsResult = response.timesheet_approve_response;
                _self.listArray = _self.listArray.concat(tsResult.result_list);
              }
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              if (response.status === 'E') {
                _self.params.params.p_page--;
                hmsPopup.showShortCenterToast("数据请求错误,请检查传入参数重新操作!");
              }
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
            }
          } catch (e) {
            _self.params.params.p_page--;
            _self.scope.$broadcast('scroll.infiniteScrollComplete');
          }
        }.bind(_self)).error(function (error) {
          _self.params.params.p_page--;
          _self.scope.$broadcast('scroll.infiniteScrollComplete');
          hmsPopup.showShortCenterToast("网络异常,请稍后重试!");
        }.bind(_self));
      };
      return TsApproveListService;
    }]);

/**
 * Created by gusenlin on 16/5/22.
 */ 
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.timesheet', {
          url: '/timesheet',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/timesheet/query/query.html',
              controller: 'TimeSheetQueryCtrl'
            }
          }
        });
    }]);

angular.module('applicationModule')
  .controller('TimeSheetQueryCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig', 
    '$ionicHistory',
    '$timeout',
    '$ionicScrollDelegate',
    'TimeSheetService',
    'hmsHttp',
    function ($scope,
              $rootScope,
              $state,
              baseConfig,
              $ionicHistory,
              $timeout,
              $ionicScrollDelegate,
              TimeSheetService,
              hmsHttp) {

      var currentTimeSheetPosition = true;
      $scope.calendar = [];
      $scope.loadingDataFlag = true;

      //年表
      $scope.currentYear = '';
      $scope.currentMonth = '';
      //月份列表
      $scope.monthList = [
        {"selected": false, value: "1"}, {"selected": false, value: "2"}, {"selected": false, value: "3"},
        {"selected": false, value: "4"}, {"selected": false, value: "5"}, {"selected": false, value: "6"},
        {"selected": false, value: "7"}, {"selected": false, value: "8"}, {"selected": false, value: "9"},
        {"selected": false, value: "10"}, {"selected": false, value: "11"}, {"selected": false, value: "12"}
      ];
      //周列表
      $scope.weekTitleList = [
        '日', '一', '二', '三', '四', '五', '六'
      ];

      var formatMonth = function (month) {
        if (parseInt(month) < 10) {
          return '0' + month;
        } else {
          return '' + month;
=======

      $ionicLoading.hide();
      //queryCostApplyList(type);

    }

    queryCostApplyList(currentListStatusType);

    /**************
     * 新建费用申请
     *
     * ********/
    $scope.createCostApply = function () {
      costApply.canEdit = true;
      costApply.initData();

      costApply.data.status = "";
      $state.go('tab.cst_costDetail');
    };

    /***********
     *
     *  下拉刷新
     * ******/

    $scope.doRefresh = function () {
      console.log('Refreshing!');
      showMessage('Refreshing!');

      queryCostApplyList(currentListStatusType);

      $scope.$broadcast('scroll.refreshComplete');


    };

    // 删除记一笔
    $scope.removeData = function (e) {

      var target = e.target;
      var lineId = target.getAttribute('lineId');

      showMessage("delete clicked lineid " + lineId);

      $ionicLoading.show({
        template: 'Loading...',
        duration: 1000
      });
      var promise = keepAccount.remove(lineId);
      promise.then(
        function (response) {  // 调用承诺API获取数据 .resolve

          showMessage("数据删除成功");

          removePhotoFiles();

        },
        function (err) {  // 处理错误 .reject
          showMessage("删除失败...." + angular.toJson(err));
>>>>>>> xbr
        }
      )
    };

<<<<<<< HEAD
      var initDate = function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        $scope.currentYear = year;
        $scope.currentMonth = month;
        angular.forEach($scope.monthList, function (data) {
          if (data.value === month + '') {
            data.selected = true;
            return;
          }
        });
        if (baseConfig.debug) {
          console.log('initDate.year ' + year);
          console.log('initDate.month ' + month)
        }

        var monthParams = year + '' + formatMonth(month);
        fetchCalendar(monthParams);
      }

      var init = function () {
        $scope.calendar = [];
        for (i = 0; i < 5; i++) {
          var style_outline = 'each-day';
          var style_color = 'day-item';
          var money = '';
          var project = '';
          var week = {
            week: i,
            list: []
          };
          for (j = 0; j < 7; j++) {
            var item = {
              day: i + "" + j,
              style_outline: style_outline,
              style_color: style_color,
              money: money,
              project: project
            };
            week.list.push(item);
          }
          $scope.calendar.push(week);
        }
      };

      $scope.writeTimesheet = function (day) {
        $state.go('tab.timesheet-write', {day: day});
      }

      $scope.scrollToFixScreen = function () {
        if (currentTimeSheetPosition) {
          $ionicScrollDelegate.scrollTo(0, 400, true);
          currentTimeSheetPosition = false;
        } else {
          $ionicScrollDelegate.scrollTo(0, 0, true);
          currentTimeSheetPosition = true;
=======

    function groupJSON(jsons) {
      var newJson = [];
      loop1:for (var i = 0; i < jsons.length; i++) {
        var t1 = jsons[i].expense_date_from;
        var arr = {time: t1, list: []};
        arr.list.push(jsons[i]);
        for (var j = i + 1; j < jsons.length; j++) {
          var t2 = jsons[j].expense_date_from;
          if (t2 == t1) {
            arr.list.push(jsons[j]);
          } else {
            i = j - 1;
            break;
          }
          if (j == jsons.length - 1) {
            newJson.push(arr);
            break loop1;
          }
>>>>>>> xbr
        }
        newJson.push(arr);
      }
      return newJson;
    }

<<<<<<< HEAD
      var fetchData = function (result) {
        var timesheetArray = result.timesheet;
        var seq = 0;
        $scope.calendar = [];
        for (i = 0; i < 5; i++) {
          var week = {
            week: i,
            list: []
          };
          for (j = 0; j < 7; j++) {
            var item;
            var style_outline = 'each-day';
            var style_color = 'day-item';
            var money = '';
            var project = '';
            var lockFlag = false;

            if (timesheetArray[seq]) {
              if (timesheetArray[seq].lockflag == '0') {
                lockFlag = false;
              } else {
                lockFlag = true;
              }
              if (timesheetArray[seq].status == 'Empty') {
                style_outline = 'each-day';
                style_color = 'day-item';
              } else if (timesheetArray[seq].status == 'Draft') {
                style_outline = 'each-day attendance';
                style_color = 'day-item attendance';
              } else if (timesheetArray[seq].status == 'Approved') {
                style_outline = 'each-day approve';
                style_color = 'day-item approve';
              } else if (timesheetArray[seq].status == 'Rejected') {
                style_outline = 'each-day reject';
                style_color = 'day-item reject';
              }
              item = {
                day: timesheetArray[seq].day.replace('0', ''),
                style_outline: style_outline,
                style_color: style_color,
                money: timesheetArray[seq].allowance,
                project: timesheetArray[seq].proj,
                each_day: timesheetArray[seq].each_day,
                lockFlag: lockFlag
              };
            } else {
              item = {
                day: '',
                style_outline: style_outline,
                style_color: style_color,
                money: money,
                project: project,
                each_day: '',
                lockFlag: lockFlag
              };
            }

            week.list.push(item);

            seq = seq + 1;
          }
          $scope.calendar.push(week);
        }
      }

      var fetchCalendar = function (monthParams) {
        init();
        $scope.loadingDataFlag = true;

        var url = baseConfig.businessPath + "/timesheet_process/fetch_calendar";
        var params = {
          "params": {
            "p_employee": window.localStorage.empno,
            "p_month": monthParams + "",
            "p_offset": 0
          }
        };
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          fetchData(result);
          $scope.loadingDataFlag = false;
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
        }).error(function (response, status) {
          $scope.loadingDataFlag = false;
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(response));
          }
        });
      };

      $scope.getTimeSheet = function (year, month) {
        angular.forEach($scope.monthList, function (data) {
          data.selected = false;
        });
        month.selected = true;
        var monthParams = year + '' + formatMonth(month.value);
        fetchCalendar(monthParams);
      };

      //从服务器获取请求
      $timeout(
        function () {
          initDate();
        }, 300
      );

      $scope.goBack = function () {
        $ionicHistory.$ionicGoBack();
      };
<<<<<<< HEAD

      $rootScope.$on('refreshTimesheet', function(event,data) {
        if (baseConfig.debug) {
          console.log('refreshTimesheet', data);
=======
    }])
/**
 * @params:
 *  1:scope  //controller的作用域
 *  2:url //请求地址
 *  3:params //请求的参数
 *  4:refurbishParam //控制下拉刷线的参数
 *  5:busy //用于控制下拉刷新的flag
 *  6:totalNumber //获取的数据总数
 *  7:listArray //数据列表
 *  8:loading //数据加载标记
 *  9:subsidyDaysArray //记录每月的补助天数
 */
  .service('TsApproveListService', ['hmsHttp', 'baseConfig', 'hmsPopup',
    function (hmsHttp, baseConfig, hmsPopup) {
      var TsApproveListService = function (scope, requestUrl, requestSearchParams, loadingFlag, refurbishParam) {
        var _self = this;
        _self.scope = scope;
        _self.url = requestUrl;
        _self.params = {};
        _self.params = requestSearchParams;
        _self.refurbishParam = refurbishParam;
        _self.busy = false;
        _self.totalNumber = 0;
        _self.listArray = [];
        _self.subsidyDaysArray = [];
        _self.loading = loadingFlag;
        if (_self.refurbishParam === 'clickRefreshEvent') {
          _self.scope.$broadcast('scroll.infiniteScrollComplete');
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
        }
        $timeout(
          function () {
            var monthParams = $scope.currentYear  + '' + formatMonth($scope.currentMonth);
            fetchCalendar(monthParams);
          }, 300
        );
      });

<<<<<<< HEAD
      if (baseConfig.debug) {
        console.log('applicationCtrl.enter');
      }

      $scope.$on('$ionicView.enter', function (e) {
        if (baseConfig.debug) {
          console.log('applicationCtrl.$ionicView.enter');
        }
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('applicationCtrl.$destroy');
        }
      });
    }])

  .service('TimeSheetService', [
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    function (baseConfig,
              hmsHttp,
              hmsPopup) {
      this.fetchCalendar = function (monthParams) {

        var url = baseConfig.businessPath + "/timesheet_process/fetch_calendar";
        var params = {
          "params": {
            "p_employee": window.localStorage.empno,
            "p_month": monthParams + "",
            "p_offset": "0"
          }
        };
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          //hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
        }).error(function (response, status) {
          //hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(response));
          }
        });
      };

      this.fetchEachDay = function (callback, oneDate) {
        var url = baseConfig.businessPath + '/timesheet_process/fetch_projects';
        var params = {'params': {'p_employee': window.localStorage.empno + "", 'p_date': +oneDate + ""}};
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          callback(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('获取状态错误,请检查网络!');
        });
      };

      this.fetchProjectDetailInfo = function (callback, oneDate, projectId) {
        var url = baseConfig.businessPath + "/timesheet_process/project_change"
        var params = {
          'params': {
            'p_employee': window.localStorage.empno + "", 'p_date': +oneDate + "",
            'p_project_id': projectId + ""
          }
        };
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          callback(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('获取项目信息错误,请检查网络!');
        });
      };

      this.submitTimesheet = function (callback,params) {
        var url = baseConfig.businessPath + "/timesheet_process/save_timesheet1";
        var params = params;
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          callback(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('提交Timesheet错误,请检查网络!');
        });
      }
    }]);

angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.timesheet-write', {
          url: '/timesheet-write',
          params: {day: {}},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/timesheet/write/write.html',
              controller: 'TimeSheetWriteCtrl'
=======
        hmsHttp.post(_self.url, _self.params).success(function (response) {
          _self.loading = false;
          try {
            if (hmsHttp.isSuccessfull(response.status)) {
              var tsResult = response.timesheet_approve_response;
              if (baseConfig.debug) {
                warn('hi,create a new factory!!' + '\n' + jsonFormat());
              }
              _self.totalNumber = response.count;
              try {
                _self.listArray = _self.listArray.concat(tsResult.result_list);
                for (var i = 0; i < _self.listArray.length; i++) {
                  var subsidys = 0;
                  if (_self.listArray[i].subsidy_list.length == 0) {
                    subsidys++;
                    _self.subsidyDaysArray.push(subsidys);
                  } else {
                    for (var j = 0; j < _self.listArray[i].subsidy_list.length; j++) {
                      subsidys = parseInt(subsidys) + parseInt(_self.listArray[i].subsidy_list[j].subsidy_days);
                      subsidys++;
                      _self.subsidyDaysArray.push(subsidys);
                    }
                  }
                }
              } catch (e) {
                _self.listArray = [];
                _self.subsidyDaysArray = [];
              }
              if (response.count == 0) {
                _self.busy = false;
                _self.listArray = [];
                hmsPopup.showShortCenterToast("没有相关数据!");
              } else if (response.count <= 6) {
                _self.busy = false;
              } else {
                _self.busy = true;
              }
              _self.scope.$broadcast('scroll.refreshComplete');
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              _self.busy = false;
              if (response.status === 'E' || response.status == 'e') {
                hmsPopup.showShortCenterToast("没有相关数据!");
              } else {
                hmsPopup.showShortCenterToast("网络异常,请稍后重试!");
              }
              _self.scope.$broadcast('scroll.refreshComplete');
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
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
  .controller('TimeSheetWriteCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$ionicModal',
    '$timeout',
    '$ionicHistory',
    'baseConfig',
    'TimeSheetService',
    'hmsPopup',
    function ($scope,
              $rootScope,
              $state,
              $stateParams,
              $ionicModal,
              $timeout,
              $ionicHistory,
              baseConfig,
              TimeSheetService,
              hmsPopup) {

      var checked = 'ion-ios-checkmark';
      var unchecked = 'ion-ios-circle-outline'
      $scope.projectList = [];
      $scope.addressList = [];
      $scope.flybackList = [];
      var editable = 'N';
      var uncheckedJson = {flag: false, style: unchecked};
      var checkedJson = {flag: true, style: checked};


      //初始化timesheet填写界面字段
      $scope.timesheetDetail =
      {
        currentDay: "",
        approver: "",
        currentProject: {},
        currentAddress: {},
        currentFlyback: {},
        travelingAllowance: {flag: false, style: unchecked},
        normalAllowance: {flag: false, style: unchecked},
        intCharge: {flag: false, style: unchecked}, //ion-ios-checkmark
        extCharge: {flag: false, style: unchecked}, //ion-ios-checkmark
        description: ""
      };

      if (baseConfig.debug) {
        console.log('$stateParams.day ' + angular.toJson($stateParams.day));
      }

      $scope.currentDate = $stateParams.day.each_day;

      //加载项目画面
      $ionicModal.fromTemplateUrl('build/pages/application/timesheet/write/modal/projectModal.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.projectModal = modal;
      });

      //加载项目地点画面
      $ionicModal.fromTemplateUrl('build/pages/application/timesheet/write/modal/addressModal.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.addressModal = modal;
      });

      //加载机票补贴画面
      $ionicModal.fromTemplateUrl('build/pages/application/timesheet/write/modal/flybackList.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.flybackModal = modal;
      });

      $scope.selectAddress = function (address) {
        if (baseConfig.debug) {
          console.log("selectAddress.address " + angular.toJson(address));
        }
        $scope.timesheetDetail.currentAddress = address;
        $scope.addressModal.hide();
      };

      $scope.selectFlyback = function (flyback) {
        if (baseConfig.debug) {
          console.log("selectAddress.flyback " + angular.toJson(flyback));
        }
        $scope.timesheetDetail.currentFlyback = flyback;
        $scope.flybackModal.hide();
      };

      $scope.selectProject = function (project) {
        if (baseConfig.debug) {
          console.log("selectAddress.project " + angular.toJson(project));
        }
<<<<<<< HEAD
        $scope.timesheetDetail.currentProject = project;
        $scope.projectModal.hide();

        var success = function (result) {
          hmsPopup.hideLoading();
          if (result.status == 'S') {
            $scope.addressList = result.projaddress;
            $scope.flybackList = result.flyback;
            $scope.timesheetDetail.approver = result.approver;
            $scope.timesheetDetail.travelingAllowance = {flag: false, style: unchecked};
            $scope.timesheetDetail.normalAllowance = {flag: false, style: unchecked};
            if (result.projaddress[0]) {
              $scope.timesheetDetail.currentAddress = result.projaddress[0];
=======
        _self.busy = true;
        _self.params.params.p_page++;
        hmsHttp.post(_self.url, _self.params).success(function (response) {
          try {
            if (hmsHttp.isSuccessfull(response.status)) {
              if (angular.isUndefined(response.timesheet_approve_response.result_list)) {
                _self.busy = false;
                hmsPopup.showShortCenterToast("数据已经加载完毕!");
              } else {
                var tsResult = response.timesheet_approve_response;
                _self.listArray = _self.listArray.concat(tsResult.result_list);
                for (var i = (_self.params.params.p_page - 1) * 6; i < _self.listArray.length; i++) {
                  var new_subsidys = 0;
                  if (_self.listArray[i].subsidy_list.length == 0) {
                    new_subsidys++;
                    _self.subsidyDaysArray.push(new_subsidys);
                  } else {
                    for (var j = 0; j < _self.listArray[i].subsidy_list.length; j++) {
                      new_subsidys = parseInt(new_subsidys) + parseInt(_self.listArray[i].subsidy_list[j].subsidy_days);
                      new_subsidys++;
                      _self.subsidyDaysArray.push(new_subsidys);
                    }
                  }
                }
              }
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
            } else {
              $scope.timesheetDetail.currentAddress = {"selected_flag": "Y", "address_id": "0", "address_name": "缺省地点"};
            }
            if (result.flyback[0]) {
              $scope.timesheetDetail.currentFlyback = result.flyback[0];
            } else {
              $scope.timesheetDetail.currentFlyback = {"fly_select": "Y", "fly_name": "无flyback", "fly_id": "-1"};
            }
          } else {
            hmsPopup.showPopup('获取项目信息错误,请检查');
          }
        }
        $timeout(function () {
          hmsPopup.showLoading('获取项目信息中');
          TimeSheetService.fetchProjectDetailInfo(success, $scope.currentDate, project.project_id)
        });
      };
<<<<<<< HEAD

      $scope.showProjectModal = function () {
        $scope.projectModal.show();
      };
      $scope.hideProjectModal = function () {
        $scope.projectModal.hide();
      };

      $scope.showFlybackModal = function () {
        $scope.flybackModal.show();
      };
      $scope.hideFlybackModal = function () {
        $scope.flybackModal.hide();
      };

      $scope.showAddressModal = function () {
        $scope.addressModal.show();
      };
      $scope.hideAddressModal = function () {
        $scope.addressModal.hide();
      };

      var fetchEachDay = function (result) {
        hmsPopup.hideLoading();
        if (result.status == 'S') {
          var projectList = result.project;
          var flybackList = result.flyback;
          var addressList = result.projaddress;

          if (baseConfig.debug) {
            console.log('fetchEachDay result.every_day ' + angular.toJson(result.every_day));
          }

          //判断是否可编辑 // add by ciwei
          if (result.every_day.holiday == 'Y') {
            editable = 'Y';
          } else if (result.every_day.holiday == 'N') {
            editable = 'N';
          }

          if (result.every_day.offbase == '1') {
            $scope.timesheetDetail.travelingAllowance = checkedJson;
          } else {
            $scope.timesheetDetail.travelingAllowance = uncheckedJson;
          }
          if (result.every_day.base == 'Y') {
            $scope.timesheetDetail.normalAllowance = checkedJson;
          } else {
            $scope.timesheetDetail.normalAllowance = uncheckedJson;
          }

          //判断内外部计费是否被选中
          if (result.every_day.internalcharge == '1') {
            $scope.timesheetDetail.intCharge = checkedJson;
          } else {
            $scope.timesheetDetail.intCharge = uncheckedJson;
          }
          if (result.every_day.externalcharge == '1') {
            $scope.timesheetDetail.extCharge = checkedJson;
          } else {
            $scope.timesheetDetail.extCharge = uncheckedJson;
          }

          $scope.timesheetDetail.currentDay = result.every_day.every_day;
          $scope.timesheetDetail.approver = result.every_day.approver;
          $scope.timesheetDetail.description = result.every_day.descrpt;
          $scope.timesheetDetail.allowance = result.every_day.allowance;

          angular.forEach(projectList, function (data) {
            if (data.selected_flag === 'Y') {
              $scope.timesheetDetail.currentProject = data;
              return;
            }
          });
          angular.forEach(addressList, function (data) {
            if (data.selected_flag === 'Y') {
              $scope.timesheetDetail.currentAddress = data;
              return;
            }
          });
          angular.forEach(flybackList, function (data) {
            if (data.fly_select === 'Y') {
              $scope.timesheetDetail.currentFlyback = data;
              return;
            }
          });

          $scope.projectList = projectList;
          $scope.addressList = addressList;
          $scope.flybackList = flybackList;
        }
        else {
          hmsPopup.showPopup('获取timesheet错误,错误原因为');
        }
      };

      $scope.checkBoxChanged = function (item, type) {
        console.log('$scope.checkBoxChanged item ' + angular.toJson(item));
        if (editable == "N" && type == 'charging') {
          return;
        }
        if (item.flag) {
          item.flag = false;
          item.style = unchecked;
        } else {
          item.flag = true;
          item.style = checked;
        }
        if (type == 'travelingAllowance' && $scope.timesheetDetail.travelingAllowance.flag) {
          $scope.timesheetDetail.normalAllowance = {flag: false, style: unchecked};
        }
        if (type == 'normalAllowance' && $scope.timesheetDetail.normalAllowance.flag) {
          $scope.timesheetDetail.travelingAllowance = {flag: false, style: unchecked};
        }
      };

      $scope.submitTimesheet = function (timesheetDetail) {
        if (baseConfig.debug) {
          console.log('timesheetDetail ' + angular.toJson(timesheetDetail));
        }

        var employee = window.localStorage.empno;
        var currentDate = $scope.currentDate;
        var projectId = $scope.timesheetDetail.currentProject.project_id;
        var description = '';
        var offBaseFlag = '';
        var baseFlag = '';
        var extCharge = '';
        var intCharge = '';
        var addressId = $scope.timesheetDetail.currentAddress.address_id;
        var flybackId = $scope.timesheetDetail.currentFlyback.fly_id;

        //内外部计费
        if ($scope.timesheetDetail.extCharge.flag) {
          extCharge = 1;
        } else {
          extCharge = 0;
        }
        if ($scope.timesheetDetail.intCharge.flag) {
          intCharge = 1;
        } else {
          intCharge = 0;
        }
        if ($scope.timesheetDetail.travelingAllowance.flag) {
          offBaseFlag = 1;
        } else {
          offBaseFlag = 0;
        }
        if ($scope.timesheetDetail.normalAllowance.flag) {
          baseFlag = 1;
        } else {
          baseFlag = 0;
        }

        description = $scope.timesheetDetail.description.replace(/[\n]/g, "\\n").replace(/[\r]/g, "\\r");

        var params = {
          "params": {
            "p_employee": employee + "",
            "p_date": currentDate + "",
            "p_project": projectId + "",
            "p_description": description + "",
            "p_offbase_flag": offBaseFlag + "",
            "p_base_flag": baseFlag + "",
            "p_ext_charge": extCharge + "",
            "p_int_charge": intCharge + "",
            "p_address": addressId + "",
            "p_flyback": flybackId + ""
          }
        };

        if (baseConfig.debug) {
          console.log('submitTimesheet.params ' + angular.toJson(params));
        }

        var success = function (result) {
          hmsPopup.hideLoading();
          if (result.status == 'S') {
            hmsPopup.showPopup('提交Timesheet成功');
            $rootScope.$broadcast('refreshTimesheet', 'parent');
            $ionicHistory.goBack();
          } else {
            hmsPopup.showPopup('提交Timesheet错误,错误原因为');
          }
        }
        hmsPopup.showLoading('提交数据中');
        TimeSheetService.submitTimesheet(success, params)
      };

      //从服务器获取请求
      $timeout(
        function () {
          hmsPopup.showLoading('获取timesheet明细数据');
          TimeSheetService.fetchEachDay(fetchEachDay, $scope.currentDate);
        }
      );
    }
  ])
;
=======
      return TsApproveListService;
    }]);
>>>>>>> cece32b2585ec8df47ca2184035e04d510fc3353
=======

    /**************
     *
     * 说明 打开费用申请明细
     * @param index
     */
    $scope.openCostDetail = function (status, index) {
      showMessage("查询明细 index: " + index);


      costApply.canEdit = false;
      costApply.canSubmit = false;


      if (status == 'NEW') {
        //showMessage("New");
        costApply.canSubmit = true;

        costApply.canEdit = true;

      }

      //showMessage(angular.toJson(costApply.appLyList));


      costApply.data = costApply.appLyList[index];
      //showMessage(angular.toJson(costApply.data));
      $state.go('tab.cst_costDetail');


    };


    // 删除照片
    function removePhotoFiles() {
      showMessage("删除照片操作 begin");

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, onError);
    }

    function onSuccess(fileSystem) {
      console.log(fileSystem.name);
      showMessage(fileSystem.name);

      //showMessage(keepAccount.tempPhoto.photo_src);
      var myFolderApp = baseConfig.appRootFile;


      // 数据删除完成 开始删除图片
      var length = keepAccount.data.photos.length;
      showMessage("总长度 " + keepAccount.data.photos.length);

      var count = 0;
      //keepAccount.tempDeleteIndex =0;
      if (length > 0) {
        for (var i = 0; i < length; i++) {
          /*插数据库*/
          count = i;
          showMessage("删除 " + i + " name " + keepAccount.data.photos[i].photo_name);
          fileSystem.root.getFile(myFolderApp + '/' + keepAccount.data.photos[i].photo_name, null, onGetFileSuccess, onGetFileError);

        }
      } else {
        deferred.resolve(lineID);
      }
      //showMessage(myFolderApp+'/'+keepAccount.tempPhoto.photo_name);
      //fileSystem.root.getFile(myFolderApp+'/'+data.photo[this.tempDeleteIndex].photo_name, null, onGetFileSuccess, onGetFileError);
    }

    function onError(error) {
      showMessage(error.code);
    }

    function onGetFileSuccess(fileEntry) {
      console.log("File Name: " + fileEntry.name);
      //showMessage("File Name: " + fileEntry.name);

      // remove the file
      fileEntry.remove(onRemoveSuccess, onRemoveFail);

    }

    function onGetFileError(error) {
      showMessage("Failed to retrieve file: " + error.code);
    }

    function onRemoveSuccess(entry) {
      console.log("Removal succeeded");
      showMessage("Removal succeeded");
      //showMessage(keepAccount.tempPhotoIndex);
      showMessage(angular.toJson(keepAccount.data.photos));

      keepAccount.data.photos.splice(keepAccount.tempPhotoIndex, 1);
      //showMessage( 'photos list:'+angular.toJson(keepAccount.data.photos));

      //$ionicLoading.hide();


      var promise = queryAccountList();
      promise.then(function (list) {  // 调用承诺API获取数据 .resolve
        $scope.accountList = groupJSON(list);
        showMessage($scope, accountList);
        $ionicLoading.hide();

      }, function (response) {  // 处理错误 .reject
        showMessage("查询数据库错误");
      });


    }

    function onRemoveFail(error) {
      showMessage('Error removing file: ' + error.code);
    }

  });


angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.cst_costObjectList', {
          url: '/expense/cst/costObjectList',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/cst/costObjectList.html',
              controller: 'costObjectController'
            }
          }
        });
    }]);


angular.module("applicationModule")
    .controller('costObjectController', function($scope,expenseObject,$ionicHistory,keepAccount, $q, $ionicLoading, baseConfig) {
        function queryCostObjectList(){
            $ionicLoading.show({
                template: 'Loading...',
                duration: 1000
            });
            var deferred = $q.defer();

            /**
            $http.get(baseConfig.basePath+"EXP/expenseItemList.svc?expenseTypeId="+expenseTypeId,{cache:false}).
                success(function(response, status, headers, config) {
                    deferred.resolve(response);
                }).
                error(function(error, status, headers, config) {
                    deferred.reject(error);
                });


             **/

                /*
                var response = {
                        costObjectList:[
                            {
                                "costObjectId": 41,
                                "costObjectNO": "CST001",
                                "desc": '描述 1'
                            },
                            {
                                "costObjectId": 42,
                                "costObjectNO": "CST0012",
                                "desc":"描述 2"
                            }
                            ]

                };
                */
            var response = keepAccount.expenseCostList;

            deferred.resolve(response);


            return deferred.promise;
        }

        var promise=queryCostObjectList();
        promise.then(
            function(response) {

                $scope.costObjectList=response;


                /***
                var code=getResponseCode(response);
                if(code=="ok"){
                    $scope.costObjectList=response.body.costObjectList;

                    $ionicLoading.hide();
                }
                else if (code =="login_required"){
                    //showMessage("登录状态异常\n"+angular.toJson(response));
                    //reLogin();


                }
                else if(code=="failure"){
                    showMessage("查询失败:"+angular.toJson(response));
                }else{
                    showMessage("未知错误:"+angular.toJson(response));
                }

                 */
            },
            function(err) {  // 处理错误 .reject
                showMessage("网络连接错误...."+angular.toJson(err));
            });

        $scope.selectCostObject=function(e){

            //showMessage("选择了费用申请");

            /*
            var target= e.target;
            var costObjectId=target.getAttribute('costObjectId');
            var costObjectDesc=target.getAttribute('costObjectDesc');
            //var expenseItemName=target.getAttribute('expenseItemName');

            */
            keepAccount.data.costObject_id=keepAccount.expenseCostList[e].costObjectId;
            keepAccount.data.costObject_desc=keepAccount.expenseCostList[e].desc;

            console.log('id - '+  keepAccount.data.costObject_id  );
            console.log('id - '+ keepAccount.data.costObject_desc);
            //expenseApply.tempLine.expenseItemId=expenseItemId;
            //expenseApply.tempLine.expenseItemName=expenseItemName;
            //globalNavigator.popPage();
            //$ionicNavBarDelegate.back();
            $ionicHistory.goBack();

        };

        //$rootScope.hideTabs = true;
    });
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.cst_costProjectItemList', {
          url: '/expense/cst/costProjectItemList',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/cst/costProjectItemList.html',
              controller: 'costProjectItemController'
            }
          }
        });
    }]);


angular.module("applicationModule")
    .controller('costProjectItemController', function($scope,$http,$q, costApply,$ionicHistory,$ionicLoading, baseConfig) {


    $ionicLoading.show({
        template: "Loading...",
        duration: 1000
    });


    function queryProjectItemList(){

        var deferred = $q.defer();

        //deferred.resolve(keepAccount.expenseItemList);

        var Url = baseConfig.businessPath + "/expenses_apply/get_project_list";
        var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '"}}';

        console.log(PostData);
        //showMessage(PostData );
        $http.post(Url,PostData).success(function (data){

            showMessage(angular.toJson(data));
            deferred.resolve(data);

        }).error(function(data) {
            showMessage("error:"+angular.toJson(data));

            deferred.reject(data);

        });


        return deferred.promise;
    }

    var promise=queryProjectItemList();
    promise.then(
        function(response) {
            var detailData = [];
            var code = response.status;
            if (code == "S") {

                var proj_tmp = response["project_list"];
                $.each(proj_tmp, function (i, value) {
                    var item = {
                        project_id : value.project_id,
                        project_code:value.project_code,
                        project_name:value.project_name

                    };

                    detailData.push(item);

                });

                //console.log( keepAccount.projectList);

                //$scope.projectList = keepAccount.projectList;
                $scope.costProjectItenList = detailData;
            }
            else {
                showMessage("error :"+angular.toJson(response));
            }

            //console.log(angular.toJson($scope.expenseItemList));

            //console.log(angular.toJson(keepAccount.expenseItemList));

            $ionicLoading.hide();

        },
        function(err) {  // 处理错误 .reject
            showMessage("网络连接错误...."+angular.toJson(err));

        });

    $scope.selectCostProjectItem=function(e){
        var target= e.target;
        // var expenseItemId=target.getAttribute('expenseItemId');
        var costProjectId       =   target.getAttribute('costProjectId');
        var costProjectName     =   target.getAttribute('costProjectName');
        var costProjectCode     =   target.getAttribute('costProjectCode');


        //keepAccount.data.expense_item_id=expenseItemId;
        costApply.data.cost_project_id  = costProjectId;
        costApply.data.cost_project_code  = costProjectCode;

        costApply.data.cost_project_name = costProjectName;

        //expenseApply.tempLine.expenseItemId=expenseItemId;
        //expenseApply.tempLine.expenseItemName=expenseItemName;



        //globalNavigator.popPage();
        //$ionicNavBarDelegate.back();
        $ionicHistory.goBack();

    };

});



/* 借款服务 */
angular.module("applicationModule").factory('costApply', function ($http, $q, baseConfig) {
    var service= {
        data:{},
        canEdit:'',
        canSubmit:'',
        tempFlight:{airportFlag:''},
        objectType:"",
        currentQueryType:"",
        canEditObjectType:true,
        currentQueryTypeDesc:'',

        currentListStatusType:'',

        queryDetail: function (costApplyId) {
            //请求服务器，查询操作
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行

            console.log("query detail: "+costApplyId);

            /*
            //$http.get(baseConfig.basePath+"EXP/EXP5020/exp_payment_requisition_query.svc?paymentRequisitionId="+paymentRequisitionId,{cache:false}).
            $http.get(baseConfig.basePath+"EXP/EXP5020/exp_payment_requisition_query.svc?paymentRequisitionId="+paymentRequisitionId,{cache:false}).

                success(function(response, status, headers, config) {
                    console.log(response);
                    //this.applyList = response.body;
                    deferred.resolve(response);  // 声明执行成功，即http请求数据成功，可以返回数据了
                }).
                error(function(response, status, headers, config) {
                    console.log(response);
                    deferred.reject(response);   // 声明执行失败，即服务器返回错误
                });

                */

            this.data = {
                costApplyId : '11',
                costApplyNO : "CST00X",
                status: 'submitted',
                statusNmae:'已提交',
                amount: 123
            };

            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        },

        queryList:function (){
            var userId      =baseConfig.user.userId;
            var companyId   =baseConfig.user.companyId;
            var deferred = $q.defer();
            $http.get(baseConfig.basePath+'/EXP/EXP5020/exp_payment_requisition_list.svc?userId='+userId+'&companyId='+companyId,{cache:false}).
                success(function(response, status, headers, config) {
                    console.log(response);
                    deferred.resolve(response);
                }).
                error(function(response, status, headers, config) {
                    console.log(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        },



        getData:function(){
            return this.data;
        },

        getDataList:function(){
            return this.applyList;
        },

        // 删除 add by wuxiaocheng
        remove:function(paymentRequisitionId) {
            var dataPara = {
                paymentRequisitionId: paymentRequisitionId
            };
            var deferred = $q.defer();
            $http({
                method :'POST',
                url:baseConfig.basePath+"EXP/EXP5020/app_payment_requisition_delete.svc",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest:function(data) {

                    return  'para='+JSON.stringify(data);
                },
                data:dataPara
            })
                .success(function (response) {
                    console.log("response:" +  "成功返回"+angular.toJson(response));
                    deferred.resolve(response);
                })
                .error(function (err) {
                    console.log( "失败返回:"+angular.toJson(err));
                    deferred.reject(err);
                });
            return deferred.promise;
        },

        save:function() {
            //请求数据库服务器，进行存储操作


            //showMessage("提交数据");
            console.log(angular.toJson(this.data));

            console.log("参数准备");
            var Url = baseConfig.businessPath + "/expenses_apply/create_expense_apply";

            this.data.cost_date=getFormatDate(new Date(this.data.cost_date));
            if (this.data.cost_amount == null) {
                showMessage("金额 null 转 空");
                this.data.cost_amount = "";
            }

            // 参数次序 固定 不可 更换位置 否则 会出错
            var PostData = '{"params":{"p_employee":"' + window.localStorage.empno
                + '","p_location":"' + this.data.cost_place
                + '","p_apply_type_code":"' + this.data.cost_type_code
                + '","p_project_code":"' + this.data.cost_project_code
                + '","p_apply_money":"' + this.data.cost_amount
                + '","p_reason":"' + this.data.description
                + '","p_apply_id":"' + this.data.cost_apply_id+ '"}}';


            console.log(PostData);

            var deferred = $q.defer();
            $http.post(Url,PostData)
                .success(function (data){

                    showMessage(angular.toJson(data));
                    console.log(angular.toJson(data));
                    deferred.resolve(data);

                })
                .error(function(data) {
                    showMessage("error:"+angular.toJson(data));
                    console.log(angular.toJson(data));

                    deferred.reject(data);

                    //$ionicLoading.hide();

                });
            return deferred.promise;
        },

        submit:function() {
            //请求数据库服务器，进行存储操作


            showMessage("提交数据");
            console.log(angular.toJson(this.data));

            console.log("参数准备");
            var Url = baseConfig.businessPath + "/expenses_apply/submit_expense_apply";



            this.data.cost_date=getFormatDate(new Date(this.data.cost_date));


            // 参数次序 固定 不可 更换位置 否则 会出错
            var PostData = '{"params":{"p_employee":"' + window.localStorage.empno
                + '","p_apply_id":"' + this.data.cost_apply_id+ '"}}';


            console.log(PostData);

            var deferred = $q.defer();
            $http.post(Url,PostData)
                .success(function (data){

                    showMessage(angular.toJson(data));
                    console.log(angular.toJson(data));

                    deferred.resolve(data);

                })
                .error(function(data) {
                    showMessage("error:"+angular.toJson(data));
                    console.log(angular.toJson(data));


                    deferred.reject(data);

                    //$ionicLoading.hide();

                });
            return deferred.promise;
        },

        initData:function(){

            this.data = {
                cost_apply_id           : '',
                cost_project_id         : '',
                cost_project_name       : '',
                cost_type_id            : '',
                cost_type_code          : '',
                cost_type_name          : '',
                cost_amount             : '',
                cost_date               : '',
                cost_place              : '',
                cost_subject_code       : '',
                cost_full_name          : '',
                description             :''

            }

        },
        addData:function(record){
            this.data.push(record);
        }


    };

    return service;
});
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.cst_costTypeItemList', {
          url: '/expense/cst/costTypeItemList',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/cst/costTypeItemList.html',
              controller: 'costTypeItemController'
            }
          }
        });
    }]);


angular.module("applicationModule").controller('costTypeItemController', function($scope,$http,$q, costApply,$ionicHistory,$ionicLoading, baseConfig) {


    $ionicLoading.show({
        template: "Loading...",
        duration: 1000
    });


    function queryItemList(){


        var deferred = $q.defer();

        //deferred.resolve(keepAccount.expenseItemList);

        var Url = baseConfig.businessPath + "/expenses_apply/get_typeitme_list";
        var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '"}}';

        console.log(PostData);
        //showMessage(PostData );
        $http.post(Url,PostData).success(function (data){

            showMessage(angular.toJson(data));
            deferred.resolve(data);

        }).error(function(data) {
            showMessage("error:"+angular.toJson(data));

            deferred.reject(data);

        });


        return deferred.promise;
    }

    var promise=queryItemList();
    promise.then(
        function(response) {
            var detailData = [];
            var code = response.status;
            if (code == "S") {

                var list_tmp = response["type_list"];
                $.each(list_tmp, function (i, value) {
                    var item = {
                        type_id : value.type_id,
                        type_code:value.type_code,
                        type_name:value.type_name


                    };

                    detailData.push(item);

                });

                //showMessage(angular.toJson(detailData));

                //console.log( keepAccount.projectList);

                //$scope.projectList = keepAccount.projectList;
                $scope.itemList = detailData;
                //showMessage(angular.toJson($scope.itemList));

            }
            else {
                showMessage("error :"+angular.toJson(response));
            }

            //console.log(angular.toJson($scope.expenseItemList));

            //console.log(angular.toJson(keepAccount.expenseItemList));

            $ionicLoading.hide();

        },
        function(err) {  // 处理错误 .reject
            showMessage("网络连接错误...."+angular.toJson(err));

        });

    $scope.selectCostItem=function(e){
        var target= e.target;
        // var expenseItemId=target.getAttribute('expenseItemId');
        var itemId       =   target.getAttribute('itemId');
        var itemCode     =   target.getAttribute('itemCode');
        var itemName     =   target.getAttribute('itemName');


        //keepAccount.data.expense_item_id=expenseItemId;
        costApply.data.cost_type_id  = itemId;
        costApply.data.cost_type_code = itemCode;
        costApply.data.cost_type_name = itemName;

        //expenseApply.tempLine.expenseItemId=expenseItemId;
        //expenseApply.tempLine.expenseItemName=expenseItemName;



        //globalNavigator.popPage();
        //$ionicNavBarDelegate.back();
        $ionicHistory.goBack();

    };

});

/**
 * Created by huchaoliang on 15-5-15.
 */ 
angular.module("applicationModule").controller('attachmentController', function($scope,$q,$http,expenseApply, baseConfig) {

    var page = globalNavigator.getCurrentPage();
    var expLineId= page.options.expLineId;
    $scope.addAttachments = expenseApply.photoData.photos;

    $scope.serverURL =  rootConfig.serverPath;

    $scope.currentProgress = '执行补传，时间与照片大小有关';


    //$scope.attachmentList=expenseApply.data.attachmentList;

    /*
    function addAttachmentList(){
        var deferred = $q.defer();
        $http.get(rootConfig.basePath+"EXP/EXP5010/exp_upload_line_photos.svc?expLineId="+expLineId,{cache:false}).
            success(function(response, status, headers, config) {
                deferred.resolve(response);
            }).
            error(function(error, status, headers, config) {
                deferred.reject(error);
            });
        return deferred.promise;
    }
    var promise=addAttachmentList();
    promise.then(function(response){
        var code=getResponseCode(response);
        if(code=="ok"){
            console.log("获取附件列表");
             console.log(response);
            $scope.attachmentList=response.body;
        }else if(code=="failure"){
            showMessage("查询失败:"+angular.toJson(response))
        }else{
            showMessage("未知错误:"+angular.toJson(response));
        }

    },function(error){
        showMessage("网络连接错误...."+angular.toJson(error));
    });

    */

    function attachmentList(){
        var deferred = $q.defer();
        //$http.get(rootConfig.basePath+"EXP/EXP5010/mobile_exp_report_list.svc",{cache:false}).
       $http.get(rootConfig.basePath+"PUBLIC/expense_lines_attachment.svc?tableName=EXP_REIMBURSEMENT_LN&tablePkValue="+expLineId,{cache:false}).
            success(function(response, status, headers, config) {
              deferred.resolve(response);

            }).
            error(function(error, status, headers, config) {
                deferred.reject(error);
            });
        return deferred.promise;
    }
    var promise=attachmentList();
    promise.then(function(response){
        var code=getResponseCode(response);
        if(code=="ok"){
            // console.log(response);
            $scope.attachmentData=response.body;
          //  console.log(response.body);
            console.log(response.body);
            console.log(angular.toJson($scope.attachmentData));

        }else if(code=="failure"){
            showMessage("查询失败:"+angular.toJson(response));
        }
        else if (code =="login_required"){
            showMessage("登录状态异常\n"+angular.toJson(response));
            reLogin();
        }
        else{
            showMessage("未知错误:"+angular.toJson(response));
        }

    },function(error){
        showMessage("网络连接错误...."+angular.toJson(error));
    });

    /*打开dialog*/
    $scope.dialogs = {};
    $scope.openDialog=function(dlg) {
        if (!$scope.dialogs[dlg]) {
            ons.createDialog(dlg).then(function(dialog) {
                $scope.dialogs[dlg] = dialog;
                dialog.show();
            });
        }
        else {
            $scope.dialogs[dlg].show();
        }
    };
    /*选择相机*/
    $scope.selectPhotoSource=function(sourceType){
        if (sourceType == "Cemera") {
            getPhotoFromCamera();
        }else if (sourceType == "PhotoLibary") {
            getPhotoFromLibary();
        }
        $scope.attachmentSourceDialog.hide();
    };

    /*拍摄照片 相机*/
    getPhotoFromCamera=function(){

        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URL ,
            sourceType : Camera.PictureSourceType.CAMERA
            // saveToPhotoAlbum : true
            //sourceType : Camera.PictureSourceType.PHOTOLIBRARY
        });
    };

    /*拍摄照片 相册*/
    getPhotoFromLibary=function(){

        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URL ,
            //sourceType : Camera.PictureSourceType.CAMERA
            sourceType : Camera.PictureSourceType.PHOTOLIBRARY
        });
    };

    /*打开确认照片页面*/
    $scope.showConfirmAttachment=function(index){
        expenseApply.tempAttachment=expenseApply.data.tempAttachment[index];
        globalNavigator.pushPage(moduleHtmlPath.ACC+'checkPhoto.html', { animation : 'slide' });
    };

    function onSuccess(imageURI) {

        //var image = document.getElementById('myImage');
        //image.src = imageURI;
        // alert("asd");
        showMessage("补拍照片 ："+imageURI);

        getPic(imageURI);
        //$scope.$apply();
    }
    function onFail(message) {
        alert('Failed because: ' + message);
    }

    function getPic(file){
        window.resolveLocalFileSystemURI(file, resolveGetOnSuccess, resOnError);
    }

    function resolveGetOnSuccess(entry){
        var date= getFormatDate(new Date());
        var photo={
            photo_name:entry.name,
            photo_src:entry.toNativeURL(),
            creation_date:date,
            created_by:rootConfig.user.userId
        };

       // showMessage("src:"+photo.photo_src);
        //showMessage('name:'+photo.photo_name);
       // showMessage( angular.toJson(expenseApply.photoData.photos));


        expenseApply.photoData.photos.push(photo);

        showMessage( angular.toJson(expenseApply.photoData.photos));

        //showMessage( angular.toJson($scope.attachmentData.attachments));
        //keepAccount.data.photos.push(photo);
        /*清除缓存*/
        //cleanupCache();

        uploadData();

        $scope.$apply();
        showMessage("补拍完成");


    }

    function showUploadProgress(msg) {
        //console.log($scope.currentProgress);
        //showMessage($scope.currentProgress);
        $scope.currentProgress = msg;
        //console.log($scope.currentProgress);
        //showMessage(msg);
        //showMessage($scope.currentProgress);


    }

    /*上传数据*/
    uploadData=function(){
        /**/

        showMessage("进入上传");
        var form=new FormData();
        form.append("expense_line_id",expLineId);

        //showMessage("准备上传:"+angular.toJson(form));
        var length = expenseApply.photoData.photos.length;
        var Photos=[];
        Photos.push(expenseApply.photoData.photos[length-1]);

        //showUploadProgress("执行补传，时间与照片大小有关");
        uploadProgressModal.show();
        var promise= expenseApply.uploadData(form,Photos);
        promise.then(
            function(response) {
                var code=getResponseCode(response);
                if(code=="ok"){
                    //接受返回参数
                   showMessage("上传结束");


                }else if(code=="failure"){
                    showMessage("查询失败:"+angular.toJson(response))
                }
                else if (code =="login_required"){
                    showMessage("登录状态异常\n"+angular.toJson(response));
                    reLogin();
                }else{
                    showMessage("未知错误:"+angular.toJson(response));
                }

                uploadProgressModal.hide();

            },
            function(err) {  // 处理错误 .reject
                showMessage("网络连接错误...."+angular.toJson(err));
                uploadProgressModal.hide();     //网络错误退出

            });
    };


    function resOnError(error) {
        alert(error.code);
    }
});
/**
 * Created by Administrator on 15-5-15.
 */

angular.module("applicationModule").controller('checkAttachmentController', function($scope,expenseApply) {

    $scope.tempAttachment=expenseApply.tempAttachment;

    $scope.back=function(){
        globalNavigator.popPage();
    };

    $scope.testFunction=function(){

        alert("11111");
    };

    // 删除照片
    $scope.deleteAttachment=function() {
        showMessage("删除照片操作");
    };

});

angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.expenseDetail', {
          url: '/expenseDetail',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/exp/expenseDetail.html',
              controller: 'expenseDetailController'
            }
          }
        });
    }]);

angular.module("applicationModule")
  .controller('expenseDetailController', [
      '$scope', 'expenseApply', 'keepAccount', 'dialog', 
      'expenseObject', '$state', '$http', '$ionicLoading', 
      '$q', 'baseConfig', 
    function ($scope, expenseApply, keepAccount, dialog, expenseObject, 
      $state, $http, $ionicLoading, $q, baseConfig) {

    $scope.isshow=true;
    if(window.localStorage.AlertPage=="" || window.localStorage.AlertPage==undefined )
    {
      $scope.navBar = true;
      window.localStorage.AlertPage="exist";
    }
    else
    {
      $scope.navBar = false;
      $scope.isshow=false;
    }
    $scope.hide=function()
    {
      $scope.isshow=false;
      $scope.navBar = false;
    };
    //expenseDetail 缓冲图片added by heLiu

    expenseObject.businessType = 'EXP';
    $scope.canEdit = expenseApply.canEdit;
    //  expenseApply.dateFmtForSave();
    $scope.canUpload = expenseApply.canUpload;
    console.log($scope.canUpload);
    $scope.detailData = expenseApply.data;
    //console.log("参数数据为：" + angular.toJson( $scope.detailData));
    $scope.currentQueryTypeDesc = expenseApply.currentQueryTypeDesc;
    //  $scope.detailData=expenseApply.getDataFromTravel(globalNavigator.getCurrentPage().options.travelDataPara);

    $scope.canSubmit = expenseApply.canSubmit;

    /*创建明细行*/
    $scope.openCreateDetail = function () {
      keepAccount.operation = "INSERT";
      keepAccount.canEdit = true;
      keepAccount.sourceFrom = "EXPENSE";
      keepAccount.initData();
      if (expenseApply.canEditObjectType == true) {
        $scope.valueChange();
        $state.go('tab.acc_detail');
        // globalNavigator.pushPage('html/acc/accountDetail.html', { animation : 'slide' });
      }
    };


    /*从记一笔选择明细行*/
    $scope.openSelectDetail = function () {
      console.log("expenseApply.data.lines: " + angular.toJson(expenseApply.data.lines));
      console.log("canEditObjectType="+expenseApply.canEditObjectType);
      console.log("expenseObject_desc="+$scope.detailData.expenseObject_desc);
      expenseApply.canUpload = false;
      if (expenseApply.canEditObjectType == true && ($scope.detailData.expenseObject_desc) != null) {
        $scope.valueChange();
        $state.go('tab.exp_SelectDetail');
        // globalNavigator.pushPage('html/exp/interfaceReportList.html', { animation : 'slide' });
      }
    };

    /*保存数据*/
    $scope.saveData = function () {
      expenseApply.data = $scope.detailData;
      if (expenseApply.data.description == undefined) {
        expenseApply.data.description = " ";
      }

      if (expenseApply.data.lines.length == 0) {
        dialog.showAlert("I", "请先从记一笔选择");
        // showMessage("请先从记一笔选择");
      }
      else {
        $ionicLoading.show({
          template: "正在保存..."
        });

        if (expenseApply.operation == "INSERT") {
          var promise = expenseApply.insert($scope.detailData);
          promise.then(
            function (response) {
              //console.log("接口返回参数： " + angular.toJson(response));
              if (response["status"] == "S") {
                $ionicLoading.hide();
                expenseApply.data.expHeaderId = response["ra_id"];
                //console.log("新增返回参数： " + angular.toJson(response));
                //console.log("参数数据：" + angular.toJson(expenseApply.data));
                $scope.detailData.lines = response.expense_list;
                //console.log("更新后参数数据：" + angular.toJson($scope.detailData.lines));
                expenseApply.selectedLineId = [];

                //showMessage("保存成功");
                dialog.showAlert("I", "保存成功");
                expenseApply.operation = "UPDATE";
                //  expenseApply.canUpload=true;
                $scope.canUpload = true;
              }
              else {
                // showMessage("未知错误:"+angular.toJson(response));
                dialog.showAlert("E", "获取信息错误");
                $ionicLoading.hide();

              }
            },
            function (err) {  // 处理错误 .reject
              // showMessage("网络连接错误:"+angular.toJson(err));
              dialog.showAlert("E", "网络连接错误");
              $ionicLoading.hide();
            });
        } else if (expenseApply.operation == "UPDATE") {
          var promise = expenseApply.update($scope.detailData);
          promise.then(function (response) {
            if (response["status"] == "S") {
              //console.log("接口返回参数： " + angular.toJson(response));
              $scope.detailData.lines = response.expense_list;
              //console.log("更新后参数数据：" + angular.toJson($scope.detailData.lines));
              expenseApply.selectedLineId = [];
              $ionicLoading.hide();
              expenseApply.operation = "UPDATE";
              expenseApply.saveAfterSubmit = true;
              dialog.showAlert("I", "更新成功");
              //  expenseApply.canUpload=true;
              $scope.canUpload = true;
              //showMessage("更新成功");
            }
            else {
              // showMessage("未知错误:"+angular.toJson(response));
              dialog.showAlert("E", "获取信息错误");
              $ionicLoading.hide();

            }
          }, function (err) {  // 处理错误 .reject
            //showMessage("网络连接错误:"+angular.toJson(err));
            dialog.showAlert("E", "网络连接错误");
            $ionicLoading.hide();
          });
        }
      }
    };

    // 判断是否可删除
    $scope.canToRemove = function () {
      /*
       if (loanApply.data.status ==  'NEW' ||  loanApply.data.status == 'REJECTED') {
       return true;
       }else {
       return false;
       }
       */
      //return (expenseApply.data.status ==  'NEW' ||  expenseApply.data.status == 'REJECTED');
      return (expenseApply.data.status == 'NEW' );
    };

    //打开报销单明细
    $scope.openReportLines = function (index) {
      //根据index做相应处理
      expenseApply.tempLine = expenseApply.data.lines[index];
      $state.go('tab.exp_expenseLines');
    };

    $scope.valueChange = function () {
      expenseApply.canSubmit = false;
      $scope.canSubmit = false;
      expenseApply.canUpload = false;
      $scope.canUpload = false;
    };

    /*提交报销数据*/
    $scope.submitData = function () {
      expenseApply.data = $scope.detailData;

      $ionicLoading.show({
        template: "正在提交..."
      });
      var expHeaderId = $scope.detailData.expHeaderId;
      var Url = baseConfig.businessPath + "/expense_account/submit_expense";
      var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_ra_id":"' + expHeaderId + '"}}';
      $http.post(Url, PostData).success(function (response) {
        if (response["status"] == "S") {
          $ionicLoading.hide();
          // showMessage("提交成功");
          dialog.showAlert("I", "提交成功");
          $state.go('tab.exp_main');
          var promise = expenseApply.queryTabList('toSubmit')
          promise.then(function (response) {
            if (response["status"] == "S") {
              $("#toSubmit").addClass("button-positive")
              $scope.expList = response["expense_list"];
              var length = $scope.expList.length;
              console.log(length);
              for (var i = 0; i < length; i++) {
                if ($scope.expList[i].descrpt == 'undefined') {
                  $scope.expList[i].descrpt = "";
                }
              }
            }
            else {
              //  showMessage("未知错误:"+angular.toJson(response));
              dialog.showAlert("E", "获取信息错误");
              $ionicLoading.hide();
            }

          }, function (error) {
            // showMessage("网络连接错误...."+angular.toJson(error));
            dialog.showAlert("E", "网络连接错误");
            $ionicLoading.hide();
          });


          $scope.canEdit = false;
        }
        else {
          // showMessage("未知错误:"+angular.toJson(response));
          dialog.showAlert("E", "获取信息错误");
          $ionicLoading.hide();

        }
      }).error(function (data) {
        //  $ionicLoading.hide();
        $ionicLoading.show({
          template: '网络连接错误'

        });
        $ionicLoading.hide();
      })
    }

    $scope.openExpenseObjectList = function () {
      console.log($scope.canEdit);
      console.log($scope.detailData.expHeaderId);
      if ($scope.detailData.lines.length == 0 && $scope.detailData.expHeaderId == undefined) {
        $scope.valueChange();
        $state.go("tab.acc_expenseObjectList");
      }
    }

    $scope.removeLine = function (canDeleteLine, index) {
      var amount = $scope.detailData.lines[index].amount;
      console.log($scope.detailData.lines[index].amount);
      console.log(expenseApply.data.lines.length);
      if (canDeleteLine == true) {
        $ionicLoading.show({
          template: "正在删除..."
        });
        var deferred = $q.defer();
        var lineId = $scope.detailData.lines[index].lineId;
        var expHeaderId = $scope.detailData.expHeaderId;
        //console.log("+++++++++++++++++++++++++++++" +　lineId);
        var Url = baseConfig.businessPath + "/expense_account/delete_expense_line";
        var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_ra_id":"' + expHeaderId + '","p_ra_line_id":"' + lineId + '"}}';

        $http.post(Url, PostData).success(function (response) {
          if (response["status"] == "S") {
            console.log(expenseApply.data.lines.length);
            // dialog.showAlert("I", "删除成功"); // mod by ciwei
            console.log(expenseApply.data.lines.length);
            for (var i = 0; i < expenseApply.selectedLineId.length; i++) {
              if (expenseApply.selectedLineId[i] == lineId) {
                expenseApply.selectedLineId = removeElement(i, expenseApply.selectedLineId);
              }
            }
            expenseApply.data.sum = expenseApply.data.sum - amount;
            $scope.detailData.lines.splice(index, 1);
            expenseApply.data = $scope.detailData;
            $ionicLoading.hide(); // move by ciwei
          }
          else {
            //showMessage("未知错误:"+angular.toJson(response));
            dialog.showAlert("E", "获取信息错误");
            $ionicLoading.hide();

          }
        }).error(function (data) {
          $ionicLoading.hide();
          $ionicLoading.show({
            template: '网络连接错误'

          });
        })
      }

      else if (canDeleteLine == false) {
        dialog.showAlert("I", "不能删除");
      }
    }
    function removeElement(index, array) {
      if (index >= 0 && index < array.length) {
        for (var i = index; i < array.length; i++) {
          array[i] = array[i + 1];
        }
        array.length = array.length - 1;
      }
      return array;
    }

  }]);


angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.exp_expenseItemList', {
          url: '/expense/acc/expenseItemList',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/exp/expenseItemList.html',
              controller: 'expenseItemController'
            }
          }
        });
    }]);

angular.module("applicationModule").controller('expenseItemController', function ($scope, $rootScope, keepAccount, expenseApply, $http, $q, $ionicHistory, $ionicLoading) {

  $ionicLoading.show({
    template: "Loading...",
    duration: 1000
  });

  function queryExpenseItemList() {
    var expenseTypeId = keepAccount.data.expense_type_id;
    var deferred = $q.defer();
    deferred.resolve(keepAccount.expenseItemList);
    return deferred.promise;
  }

  var promise = queryExpenseItemList();
  promise.then(
    function (response) {
      $scope.expenseItemList = response;
      console.log(angular.toJson(keepAccount.expenseItemList));
      $ionicLoading.hide();
    },
    function (err) {  // 处理错误 .reject
      //showMessage("网络连接错误...."+angular.toJson(err));
    });

  $scope.selectExpenseItem = function (e) {
    var target = e.target;
    // var expenseItemId=target.getAttribute('expenseItemId');
    var expenseItemCode = target.getAttribute('expenseItemCode');
    var expenseItemName = target.getAttribute('expenseItemName');
    var expenseItemIndex = target.getAttribute('expenseItemIndex');

    //keepAccount.data.expense_item_id=expenseItemId;
    keepAccount.data.expense_item_code = expenseItemCode;
    keepAccount.data.expense_item_desc = expenseItemName;

    // 清空 费用申请
    keepAccount.data.costObject_id = "";
    keepAccount.data.costObject_desc = "";

    keepAccount.expenseCostList = [];

    var expenseHouseList_tmp = keepAccount.expenseItemList[expenseItemIndex].expense_item_house;

    $.each(expenseHouseList_tmp, function (i, value) {
      var item = {
        costObjectId: value.id,
        desc: value.name
      };
      keepAccount.expenseCostList.push(item);
    });

    console.log("coutList -- " + angular.toJson(keepAccount.expenseCostList));

    $ionicHistory.goBack();
  };

  //$rootScope.hideTabs = true;// mod by ciwei
});


angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.exp_expenseLines', {
          url: '/expenseLines',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/exp/expenseLines.html',
              controller: 'expenseLinesController'
            }
          }
        });
    }]);

angular.module("applicationModule")
    .controller('expenseLinesController', ['$scope','expenseApply','keepAccount','$ionicHistory',function($scope,expenseApply,keepAccount,$ionicHistory) {


    $scope.detailData=expenseApply.tempLine;

    $scope.canEdit=expenseApply.canEdit;
    $scope.local_status=expenseApply.local_status;
    //  $scope.sourceFrom="exp";
    console.log( $scope.detailData);
  // var canEdit=expenseApply.canEdit;
  /*  $scope.detailData.dateFrom=new Date( $scope.detailData.dateFrom);
    $scope.detailData.dateTo=new Date($scope.detailData.dateTo);*/
    $scope.openCurrencyList=function(e){
        /*var target= e.target;
        var currencyName=target.getAttribute('currencyName');
        var currencyCode=target.getAttribute('currencyCode');
        var exchangeRate=target.getAttribute('exchangeRate');*/
      /*expenseApply.tempLine.currencyName=currencyName;
        expenseApply.tempLine.currencyCode=currencyCode+"-"+currencyName;
        expenseApply.tempLine.exchangeRate=Number(exchangeRate);*/
       // expenseApply.tempLine.currency_code=currencyCode;
        //expenseApply.tempLine.currency_code_desc=currencyCode+"-"+currencyName;
       // expenseApply.tempLine.originalCurrency=currencyCode
         expenseApply.sourceFrom="EXP";
        if (expenseApply.canEditObjectType==true){

       globalNavigator.pushPage('html/acc/currencyList.html', { animation : 'slide' });
        }
    };
     $scope.valueChange=function(){
            expenseApply.canUpload=false;
            $scope.canUpload=false;
        };


    $scope.openExpenseTypeList=function(){
        if (expenseApply.canEditObjectType==true){
            globalNavigator.pushPage('html/exp/expenseTypeList.html', { animation : 'slide' });
        }

    };
    $scope.openExpenseItemList=function(){
        if (expenseApply.canEditObjectType==true){
            globalNavigator.pushPage('html/exp/expenseItemList.html', { animation : 'slide' });
        }
    };

    //
    $scope.canShow = function() {

        if($scope.detailData.price.toFixed(2)==null)
        {
            $scope.sum=0.00;
        }
        else{
          //  $scope.sum=($scope.detailData.price*$scope.detailData.quantity*$scope.detailData.exchangeRate).toFixed(2);
            $scope.sum=5;
        }

    };
    $scope.removeLine=function(){
        var index=$scope.detailData.index;
      //  console.log(index);
        expenseApply.data.lines.splice(index,1);
      //  expenseApply.removeLine(expenseApply.tempLine.expLineId);
        showMessage("删除成功");
        $ionicHistory.goBack();
    };
    $scope.confirmLine=function(){
        var index=$scope.detailData.index;
        if(index==-1){
            expenseApply.data.lines.push($scope.tempLine);
        }
        else{
            expenseApply.data.lines[index]=$scope.tempLine;
        }
        var date_from= getFormatDate(new Date($scope.detailData.dateFrom));
        var date_to= getFormatDate(new Date($scope.detailData.dateTo));
        if(date_from>date_to)
        {showMessage("开始日期大于结束日期");}
        else{
            globalNavigator.popPage();
        }
    };


  /*  $scope.removeLine=function(){
        var index=$scope.detailData.index;
        expenseApply.data.lines.splice(index,1);
        expenseApply.removeLine(expenseApply.tempLine.expLineId);
        showMessage("删除成功");
        globalNavigator.popPage();
    };*/


    $scope.openAttachment=function(){
        var LineId=$scope.detailData.expLineId;
        console.log(LineId);
        //globalNavigator.pushPage("html/exp/attachmentList.html");

        globalNavigator.pushPage("html/exp/attachmentList.html", { expLineId: LineId, param2: "value2" });
    }

}]);
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.expense', {
          url: '/expenseQueryTabList',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/exp/expenseQueryTabList.html',
              controller: 'expenseQueryController'
            }
          }
        });
    }]);

angular.module("applicationModule")
  .controller('expenseQueryController', [
    '$scope', 'expenseApply', 'dialog', 
    '$http', '$q', '$state', '$ionicLoading', 
    'hmsHttp', 'hmsPopup', "baseConfig",
    function ($scope, expenseApply, dialog, 
      $http, $q, $state, $ionicLoading, 
      HttpAppService, hmsPopup, baseConfig) {

    $scope.newPage = 0;
    $scope.isshow = true;
    $scope.canClickButton = {
      toSubmit: true,
      submitted: false
    };
    var statusType = {
      new: "toSubmit",
      submit: "submitted"
    };
    var currentListStatusType = statusType.new;

    var noApprove = document.getElementById("noApprove");// add by ciwei
    var alreadyApprove = document.getElementById("alreadyApprove");// add by ciwei
    $scope.changeButton = function (type) {
      switch (type) {
        case 'toSubmit':
          $scope.canClickButton = {
            toSubmit: false,
            submitted: true
          };
          //  $("#toSubmit").addClass("button-positive")
          // $("#submitted").removeClass("button-positive")
          noApprove.style.backgroundColor = "#D1F4F6";
          noApprove.style.color = "#20CBD3";
          alreadyApprove.style.backgroundColor = "#20CBD3";
          alreadyApprove.style.color = "white";
          currentListStatusType = statusType.new;
          break;
        case 'submitted':
          $scope.canClickButton = {
            toSubmit: true,
            submitted: false
          };
          //  $("#submitted").addClass("button-positive")
          //  $("#toSubmit").removeClass("button-positive")
          alreadyApprove.style.backgroundColor = "#D1F4F6";
          alreadyApprove.style.color = "#20CBD3";
          noApprove.style.backgroundColor = "#20CBD3";
          noApprove.style.color = "white";
          currentListStatusType = statusType.submit;
          break;
      }
      queryTabList(type);
    };

    $scope.$on('$stateChangeSuccess', // add by jiangzuoyong
      function (event, toState, toParams, fromState, fromParams) {
        if (toState.name == 'tab.exp_main' && fromState.name == 'tab.expenseDetail') {
          var promise = queryList();
          promise.then(function (response) {
            if (response["status"] == "S") {
              $("#toSubmit").addClass("button-positive")
              $scope.expList = response["expense_list"];
              var length = $scope.expList.length;
              console.log(length);
              for (var i = 0; i < length; i++) {
                if ($scope.expList[i].descrpt == 'undefined') {
                  $scope.expList[i].descrpt = "";
                }
              } 
              $ionicLoading.hide();
            } else if (response["status"] == "ETOKEN") {// add by ciwei
              dialog.showAlert("E", response["returnMsg"]);
              $ionicLoading.hide();
              $state.go('login');
            }
            else {
              // showMessage("未知错误:"+angular.toJson(response));
              dialog.showAlert("E", "获取信息错误");
              $ionicLoading.hide();
            }
          }, function (error) {
            // showMessage("网络连接错误...."+angular.toJson(error));
            dialog.showAlert("E", "网络连接错误");
            $ionicLoading.hide();
          });
        }
      });

    // add by ciwei
    $scope.showHelp = function () {
      var template = 'Step1：“新建记一笔”，填写待报销记录，保存并上传。' + '<br> ' +
        'Step2：在“报销”功能中，创建报销单，选择项目，再选择已经上传的“记一笔”作为报销行信息，保存提交。' + '<br><br> ' +
        '**“记一笔”保存，是保存在手机本地，只有上传后，才能在报销单处选到。另，如若要卸载app，需先将所有记一笔“上传”，否则会丢失。';

      var alertPopup = hmsPopup.showPopup(template, "报销功能使用说明");
    };

    $scope.show = function () {
      $ionicLoading.show({
        template: 'Loading...' 
      });
    };
    $scope.hide = function () {
      $ionicLoading.hide();
    };
    //初始化列表
    function queryList() {
      // $scope.expList.splice(0, $scope.expList.length);
      // // baseConfig.businessPath   baseConfig.businessPath
      $ionicLoading.show({
        template: "Loading..."
      });
      var expStatues = 'SAVE';
      var deferred = $q.defer();
      var Url = baseConfig.businessPath + "/expense_account/fetch_expense_list";
      var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_expense_type":"' + expStatues
        + '","p_page_num":"' + "1" + '"}}';

      $http.post(Url, PostData).success(function (response) {
        deferred.resolve(response);

      }).error(function (response) {
        deferred.reject(response);
      });
      return deferred.promise;
    }

    var promise = queryList();
    promise.then(function (response) {
      if (response["status"] == "S") {
        $("#toSubmit").addClass("button-positive")
        $scope.expList = response["expense_list"];
        var length = $scope.expList.length;
        console.log(length);
        for (var i = 0; i < length; i++) {
          if ($scope.expList[i].descrpt == 'undefined') {
            $scope.expList[i].descrpt = "";
          }
        }
        $ionicLoading.hide();
      } else if (response["status"] == "ETOKEN") {// add by ciwei
        dialog.showAlert("E", response["returnMsg"]);
        $ionicLoading.hide();
        $state.go('login');
      }
      else {
        // showMessage("未知错误:"+angular.toJson(response));
        dialog.showAlert("E", "获取信息错误");
        $ionicLoading.hide();
      }
    }, function (error) {
      // showMessage("网络连接错误...."+angular.toJson(error));
      dialog.showAlert("E", "网络连接错误");
      $ionicLoading.hide();
    });

    function queryTabList(statues) {
      $scope.isshow = false;
      console.log("helloworld");
      $scope.expList = new Array();
      // $scope.expList.splice(0, $scope.expList.length);
      $scope.newPage = $scope.newPage + 1;

      console.log($scope.newPage);

      var expStatues
      if (statues == 'toSubmit') {
        expStatues = 'SAVE';
      }
      else if (statues == 'submitted') {
        expStatues = 'SUBMIT';
      }
      //  console.log("queryList");
      var Url = baseConfig.businessPath + "/expense_account/fetch_expense_list";
      var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_expense_type":"' + expStatues + '","p_page_num":"' + $scope.newPage + '"}}';
      $scope.show();
      $http.post(Url, PostData).success(function (response) {
        if (response["status"] == "S") {
          //  $scope.isshow = true;
          console.log(123);
          console.log($scope.newPage);
          console.log(456);
          $scope.expenseList = response["expense_list"];
          //  console.log(expenseList);
          $.each($scope.expenseList, function (n, value) {
            $scope.expList.push(value);
          });
          //$scope.expList=Item;
          var length = $scope.expList.length;
          //console.log(length);
          for (var i = 0; i < length; i++) {
            //  console.log($scope.expList[i].descrpt);
            if ($scope.expList[i].descrpt == 'undefined') {
              $scope.expList[i].descrpt = "";
            }
          }
          //  $scope.isshow = false;
          $scope.hide();
          $scope.$broadcast('scroll.infiniteScrollComplete');
        } else if (response["expense_list"].length == 0) {
          // alert(123);
          $scope.isshow = false;
          $ionicLoading.show({template: '没有更多的数据了....', noBackdrop: true, duration: 1000});
          $scope.$broadcast('scroll.infiniteScrollComplete');
        }
      }).error(function (data) {
        $scope.isshow = false;
        //$scope.hide();
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $ionicLoading.hide();
      });
    }

    /*打开申请创建页面*/
    $scope.openCreateExpense = function () {
      //初始化数据
      expenseApply.initData();
      expenseApply.operation = "INSERT";
      //expenseApply.initData();
      expenseApply.selectedLineId = [];
      //prepareForReturn();
      // prepareForReturn();
      expenseApply.canEdit = true;
      expenseApply.canSubmit = false;
      expenseApply.canUpload = false;
      expenseApply.canEditObjectType = true;// add by ciwei
      $state.go('tab.expenseDetail');
      // globalNavigator.pushPage(moduleHtmlPath.EXP+'expenseDetail.html', { animation: 'slide' });


    };

    //明细打开,更新可编辑
    function openUpdate() {
      //初始化数据，
      expenseApply.canEdit = true;
      expenseApply.operation = "UPDATE";
      expenseApply.canEditObjectType = true;
      expenseApply.canSubmit = true;
      $state.go('tab.expenseDetail');
    }

    //明细打开,只读方式
    function openReadOnly() {
      //初始化数据
      expenseApply.canEdit = false;
      expenseApply.canEditObjectType = false;
      expenseApply.canSubmit = false;
      $state.go('tab.expenseDetail');
    }


    $scope.openExpenseDetail = function (status, index) {
      // expenseApply.data.splice(0, expenseApply.data.length);
      // expenseApply.data.lines=[];
      //设置标志，保存后才能提交
      // expenseApply.saveAfterSubmit=false;

      expenseApply.selectedLineId = [];
      $ionicLoading.show({
        template: "Loading..."

      });
      var expHeaderId;
      expHeaderId = $scope.expList[index].ra_id;

      console.log("明细打开：" + expHeaderId);
      var promise = expenseApply.queryDetail(expHeaderId);
      promise.then(
        function (response) {
          if (response["status"] == "S") {
            var Item1 = [];
            //expenseApply.dateFmtForUI();
            var detailData = response["expense_list"];
            var head = response["expense_heaeder"];
            console.log(head);
            console.log(detailData);
            // Item1.push(detailData[0].ra_id);
            // expenseApply.data.expHeaderId=detailData[0].ra_id,
            expenseApply.data.expHeaderId = head.ra_id;
            expenseApply.data.description = head.description;
            expenseApply.canUpload = true;

            if (expenseApply.data.description == 'undefined') {
              expenseApply.data.description = "";
            }
            expenseApply.data.expenseObject_id = head.project_id
            expenseApply.data.expenseObject_desc = head.project_name;
            expenseApply.data.sum = head.amount;
            console.log(expenseApply.data.sum);
            // expenseApply.data.sum=head.amount;
            //  expenseApply.data.sum=0;
            $.each(detailData, function (n, value) {
              var item = {
                dateFrom: value.date_from,
                dateTo: value.date_to,
                place: value.place,
                memo: value.abstract,
                expenseItemName: value.ra_name,
                expObject_desc: value.fee_item_name,
                price: value.unit_price,
                quantity: value.quantity,
                amount: value.amount,
                lineId: value.ra_line_id,
                original_currency: value.original_currency,
                exchange_rate: value.exchange_rate,
                attach_number: value.attach_number,
                rentals_infor: value.rentals_infor

              };

              Item1.push(item);
              console.log(Item1);
              // this.date.head=Item;
              //console.log(this.date.head);
              $ionicLoading.hide();
            });

            expenseApply.data.lines = Item1;

            for (var i = 0; i < expenseApply.data.lines.length; i++) {
              expenseApply.selectedLineId.push(expenseApply.data.lines[i].lineId);
            }
            console.log(8888);
            console.log(expenseApply.selectedLineId);
            console.log(9999);

            /*  var length=expenseApply.data.lines.length;
             for(var i=0;i<length;i++)
             {
             expenseApply.data.sum+=expenseApply.data.lines[i].amount;
             }
             */

            $ionicLoading.hide();
            //  expenseApply.data = response["expense_list"];
            if (status == "已经保存") {
              openUpdate();
            }
            else if (status == "已经审批" || status == "已提交") {
              console.log("SUBMITTED Query");
              openReadOnly();

            }
          }
        },
        function (err) {
          // showMessage('网络连接错误:'+angular.toJson(err));
          dialog.showAlert("E", "网络连接错误");
          $ionicLoading.hide();
        });
    }
    $scope.removeData = function (status, index) {
      if (status == "已经保存") {
        $ionicLoading.show({
          template: "正在删除报销单"

        });
        var deferred = $q.defer();
        var expHeaderId = $scope.expList[index].ra_id;
        console.log(expHeaderId);
        var Url = baseConfig.businessPath + "/expense_account/delete_expense";
        var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_ra_id":"' + expHeaderId + '"}}';
        $http.post(Url, PostData).success(function (response) {
          if (response["status"] == "S") {
            $scope.expList.splice(index, 1);
            $ionicLoading.hide();
            // dialog.showAlert("I", "删除成功");// mod by ciwei
          }
          else {
            dialog.showAlert("E", "获取信息错误");

          }
        }).error(function (data) {

          $ionicLoading.show({
            template: '网络连接错误'

          });
          $ionicLoading.hide();
        })
      }

      else if (status == "已提交" || status == "已经审批") {
        // showMessage("不能删除");
        dialog.showAlert("I", "不能删除");
      }
    }

    $scope.doRefresh = function () {
      console.log('Refreshing!');
      // showMessage('Refreshing!');

      queryTabList(currentListStatusType);

      $scope.$broadcast('scroll.refreshComplete');


    };

  }]);

/**
 * Created by huchaoliang on 15/5/6.
 */

/*报销服务*/
angular.module("applicationModule")
.factory('expenseApply', function ($http, $q, $window, $ionicLoading, baseConfig) {

  // 上传附件
  function doPostHttp(form, deferred) {
    //showMessage("doPostHttp");
    $http.post(baseConfig.basePath + 'EXP/EXP5010/exp_upload_line_photos.svc', form, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    })
      .success(function (response) {
        //showMessage("上传成功");

        deferred.resolve(response);
      })
      .error(function (err) {
        showMessage("上传失败");

        deferred.reject(err);
      });
  }

  function createBlob(data, type) {
    var r;
    try {
      r = new $window.Blob([data], {type: type});
    }
    catch (e) {
      // TypeError old chrome and FF
      $window.BlobBuilder = $window.BlobBuilder ||
        $window.WebKitBlobBuilder ||
        $window.MozBlobBuilder ||
        $window.MSBlobBuilder;
      // consider to use crosswalk for android

      if (e.name === 'TypeError' && window.BlobBuilder) {
        var bb = new BlobBuilder();
        bb.append([data.buffer]);
        r = bb.getBlob(type);
      }
      else if (e.name == "InvalidStateError") {
        // InvalidStateError (tested on FF13 WinXP)
        r = new $window.Blob([data.buffer], {type: type});
      }
      else {
        throw e;
      }
    }
    return r;
  }

  var service = {

    data: {},
    dataBuffer: {},
    canEdit: '',
    tempLine: {},
    tempAttachment: {},
    projectList: [],
    selectedLineId: [],
    currentQueryType: "",
    canEditObjectType: true,
    canSelectProject: "",
    canUpload: '',
    photoData: {},
    currentQueryTypeDesc: '',
    sourceFrom: '',
    ListItem: {},
    canSubmit: '',
    expenseObject_id: '',
    queryDetail: function (expHeaderId) {
      //请求服务器，查询操作
      var deferred = $q.defer();
      console.log(1122);
      var Item = [];
      var Url = baseConfig.businessPath + "/expense_account/fetch_expense_detail";
      var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_ra_id":"' + expHeaderId + '"}}';
      $http.post(Url, PostData).success(function (response) {
        //console.log("返回数据：" + angular.toJson(response));
        deferred.resolve(response);

      }).error(function (err) {

        deferred.reject(err);
      });
      return deferred.promise;
    },
    // 查询tab列表
    queryTabList: function (queryType) {

      var deferred = $q.defer();
      var expStatues
      if (queryType == 'toSubmit') {
        expStatues = 'SAVE';
      }
      else if (queryType == 'submitted') {
        expStatues = 'SUBMIT';
      }
      var Url = baseConfig.businessPath + "/expense_account/fetch_expense_list";
      var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_expense_type":"' + expStatues
        + '","p_page_num":"' + "1" + '"}}';

      $http.post(Url, PostData).success(function (response) {
        deferred.resolve(response);

      }).error(function (response) {
        deferred.reject(err);
      });
      return deferred.promise;
    },

    getDataFromTravel: function (travelDataPara) {
      if (travelDataPara != undefined) {
        this.canEditObjectType = false;
        this.data.travelApplicationNumber = travelDataPara.travelNo;
        this.data.objectType = travelDataPara.objectType;
        this.data.expenseObject = travelDataPara.expenseObject;
        this.data.expenseObjectName = travelDataPara.expenseObjectName;
      } else {
        //showMessage("没有差旅申请�?)
      }
      return this.data;

    },

    insert: function (detailData) {
      //请求数据库服务器
      /* console.log("response:" +  "进入");
       console.log(angular.toJson(this.data));*/
      console.log(detailData);
      console.log("lineId=" + detailData.lines[0].lineId);
      console.log("detailData.lines.length=" + detailData.lines.length);
      var linesId
      if (detailData.lines.length == 1)
        linesId = detailData.lines[0].lineId;
      else if (detailData.lines.length > 1) {
        linesId = detailData.lines[0].lineId + "#";
        for (var i = 1; i < detailData.lines.length; i++) {
          linesId = linesId + detailData.lines[i].lineId;
          if (i != detailData.lines.length - 1)
            linesId = linesId + "#";
        }
      }
      console.log(linesId);
      var deferred = $q.defer();
      var Url = baseConfig.businessPath + "/expense_account/create_expense";
      var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_ra_id":"' + "" + '","p_description":"'
        + detailData.description + '","p_line":"' + linesId + '"}}';

      $http.post(Url, PostData).success(function (response) {
        deferred.resolve(response);

      }).error(function (response) {
        deferred.reject(err);
      });
      return deferred.promise;
    },

    remove: function (expHeaderId) {
      var dataPara = {
        expHeaderId: expHeaderId
      };
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: baseConfig.basePath + "EXP/EXP5010/app_reimbursement_delete.svc",
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (data) {

          return 'para=' + JSON.stringify(data);
        },
        data: dataPara
      })
        .success(function (response) {
          console.log("response:" + "成功返回" + angular.toJson(response));
          deferred.resolve(response);
        })
        .error(function (err) {
          console.log("失败返回:" + angular.toJson(err));
          deferred.reject(err);
        });
      return deferred.promise;
    },

    submit: function (expHeaderIdToSubmit) {
      //请求数据库服务器，进行存储操�?
      console.log("response:" + "进入");

      console.log(angular.toJson(this.data));
      this.data.userId = window.localStorage.empno;
      var datatemp = {
        userId: window.localStorage.empno,
        expHeaderId: expHeaderIdToSubmit
      };

      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: baseConfig.basePath + 'EXP/EXP5010/exp_reimbursement_hd_submit.svc',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (data) {
          return 'para=' + JSON.stringify(data);
        },
        data: datatemp
      })
        .success(function (response) {
          //login
          console.log("response:" + "成功返回");
          console.log("response:" + angular.toJson(response));
          deferred.resolve(response);
        }).error(function (response, status) {
          // login
          console.log("response:" + "失败返回");
          console.log("response:" + response + ",status:" + status);
          deferred.reject(response);
        });
      return deferred.promise;
    },

    initDataForAddAttachment: function () {
      this.photoData = {
        photos: []
      }
    },

    initData: function () {
      this.data = {
        userId: window.localStorage.empno,
        companyId: baseConfig.companyId,
        lines: []
      };
    },

    addData: function (record) {
      this.data.push(record);
    },
    uploadData: function (form, photos) {    // 以formdatade 形式上传文件
      console.log("进入");

      showMessage("photos.length" + photos.length);

      var deferred = $q.defer();
      //showMessage("photos.length" +photos.length);
      //deferred.reject("error");
      if (photos.length > 0) {

        var count = 0;
        for (var i = 0; i < photos.length; i++) {
          //这里是异步调用cordova 的文件操作，给form 增加
          window.resolveLocalFileSystemURL(photos[i].photo_src, function (fileEntry) {
            fileEntry.file(function (file) {
              var reader = new FileReader();
              reader.onloadend = function (fileReadResult) {
                var data = new Uint8Array(fileReadResult.target.result);
                var blob = createBlob(data, "image/jpeg");
                form.append(file.name, blob, file.name);
                count++;
                if (count == photos.length) {
                  doPostHttp(form, deferred);
                }
              };
              reader.onerror = function (fileReadResult) {
                //如果失败也算完成的话，这里也加上就行
                //count ++
                //if(count == photos.length()){
                //doPostHttp(form);
                //}
              };
              reader.readAsArrayBuffer(file);
            });
          });
        }
      } else {

        //  showMessage("上传无照�?);

        doPostHttp(form, deferred);
      }

      return deferred.promise;
    },
    update: function (detailData) {
      //请求数据库服务器，进行存储操作
      /*  var length=detailData.lines.length;
       var linesId=detailData.lines[length-1].lineId;
       */
      console.log(detailData.lines);
      var linesId;
      // console.log(detailData.lines[0].lineId)
      /*   if(detailData.lines.length==1)
       linesId=detailData.lines[0].lineId;
       else if(detailData.lines.length>1){*/
      // linesId=detailData.lines[0].lineId+"#";
      if (detailData.lines.length == 1)
        linesId = detailData.lines[0].lineId;
      else if (detailData.lines.length > 1) {
        linesId = detailData.lines[0].lineId + "#";
        for (var i = 1; i < detailData.lines.length; i++) {
          linesId = linesId + detailData.lines[i].lineId;
          if (i != detailData.lines.length - 1)
            linesId = linesId + "#";
        }
      }
      console.log(linesId);

      var deferred = $q.defer();
      var Url = baseConfig.businessPath + "/expense_account/create_expense";
      var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_ra_id":"' + detailData.expHeaderId
        + '","p_description":"' + detailData.description + '","p_line":"' + linesId + '"}}';
      $http.post(Url, PostData).success(function (response) {
        deferred.resolve(response);

      }).error(function (response) {
        deferred.reject(err);
      });
      return deferred.promise;
    },
    // 删除报销行信息
    removeLine: function (expLineId) {
      console.log('expLineId' + expLineId);
      var dataPara = {
        expLineId: expLineId
      };
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: baseConfig.basePath + 'EXP/EXP5010/app_reimbursement_ln_delete.svc',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function (data) {
          return 'para=' + JSON.stringify(data);
        },
        data: dataPara
      })
        .success(function (response) {
          console.log("response:" + "成功返回" + angular.toJson(response));
          deferred.resolve(response);
        })
        .error(function (err) {
          console.log("失败返回:" + angular.toJson(err));
          deferred.reject(err);
        });

      return deferred.promise;
    },


    dateFmtForSave: function () {
      // 日期格式处理
      for (var i = 0; i < this.dataBuffer.lines.length; i++) {
        this.dataBuffer.lines[i].dateFrom = getFormatDate(new Date(this.dataBuffer.lines[i].dateFrom));
        this.dataBuffer.lines[i].dateTo = getFormatDate(new Date(this.dataBuffer.lines[i].dateTo));
      }
    },
    dateFmtForUI: function () {
      for (var i = 0; i < this.data.lines.length; i++) {
        this.data.lines[i].dateFrom = new Date(this.data.lines[i].dateFrom);
        this.data.lines[i].dateTo = new Date(this.data.lines[i].dateTo);
      }
    }

  }

  return service;
});



// 报销
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.exp_expenseTypeList', {
          url: '/acc/expenseTypeList',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/exp/expenseTypeList.html',
              controller: 'expenseTypeController'
            }
          }
        });
    }]);
angular.module("applicationModule").controller('expenseTypeController', function($scope,$rootScope,keepAccount,expenseApply,$http,$q,$ionicHistory, baseConfig) {

    function queryExpenseTypeList(){
        var companyId=baseConfig.user.companyId;
        var deferred = $q.defer();

        /*
        $http.get(baseConfig.basePath+"EXP/expenseTypeList.svc?companyId="+companyId,{cache:false}).
            success(function(response, status, headers, config) {
                deferred.resolve(response);
            }).
            error(function(error, status, headers, config) {
                deferred.reject(error);
            });

        */
        $scope.expenseTypeList =
            [
                {
                    "expenseTypeId": 21,
                    "expenseTypeCode": "DAILY_MANAGEMENT",
                    "expenseTypeName": "日常管理",
                    "reimbursementTypeId": 21
                },
                {
                    "expenseTypeId": 22,
                    "expenseTypeCode": "PROJECT_IMPLEMENTATION",
                    "expenseTypeName": "项目实施",
                    "reimbursementTypeId": 21
                }
            ];
        return deferred.promise;
    }

    var promise=queryExpenseTypeList();
    promise.then(
        function(response) {
            var code=getResponseCode(response);
            if(code=="ok"){
                $scope.expenseTypeList=response.body.expenseTypeList;
            }
            else if (code =="login_required") {
                //showMessage("登录状态异常\n"+angular.toJson(response));
                //reLogin();}
                $scope.expenseTypeList =
                    [
                        {
                            "expenseTypeId": 21,
                            "expenseTypeCode": "DAILY_MANAGEMENT",
                            "expenseTypeName": "日常管理",
                            "reimbursementTypeId": 21
                        },
                        {
                            "expenseTypeId": 22,
                            "expenseTypeCode": "PROJECT_IMPLEMENTATION",
                            "expenseTypeName": "项目实施",
                            "reimbursementTypeId": 21
                        }
                    ];
            }
            else if(code=="failure"){
                showMessage("查询失败:"+angular.toJson(response))
            }else{
                showMessage("未知错误:"+angular.toJson(response));
            }
        },
        function(err) {  // 处理错误 .reject
            showMessage("网络连接错误...."+angular.toJson(err));
        });

    $scope.selectExpenseType=function(e){
        var target= e.target;
        var expenseTypeName=target.getAttribute('expenseTypeName');
        var expenseTypeId=target.getAttribute('expenseTypeId');
        var expenseTypeCode=target.getAttribute('expenseTypeCode');
        if(keepAccount.data.expense_type_id!=expenseTypeId){
            keepAccount.data.expense_item_id=null;
            keepAccount.data.expense_item_desc='';
            keepAccount.data.expense_type_id=expenseTypeId;
            keepAccount.data.expense_type_desc=expenseTypeName
        }
        expenseApply.tempLine.expenseTypeId=expenseTypeId;
        expenseApply.tempLine.expenseTypeName=expenseTypeName;

        //globalNavigator.popPage();
        //$ionicNavBarDelegate.back();
        $ionicHistory.goBack();
    };

   // $rootScope.hideTabs = true; // mod by ciwei
});

angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.exp_SelectDetail', {
          url: '/interfaceReportList',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/exp/interfaceReportList.html',
              controller: 'interfaceReportListController'
            }
          }
        });
    }]);

angular.module("applicationModule")
.controller('interfaceReportListController', function($scope,keepAccount,$http,$q,expenseApply,dialog,$state,$ionicHistory,$ionicLoading, baseConfig) {
    var Item = [];
    $scope.detailData=expenseApply.data;
    //console.log( $scope.detailData.expenseObject_id);
    console.log(expenseApply.data.expenseObject_id);
    $scope.selectedLineId=expenseApply.selectedLineId;
    console.log(111);
    console.log( $scope.selectedLineId);
    //console.log("$scope.selectedLinedId+++++: " + angular.toJson($scope.selectedLineId));
    console.log(222);
   // console.log(expenseApply.projectList);
    $ionicLoading.show({
        template: "Loading..."
    });
    function interfaceReportList(){
        var deferred = $q.defer();
        var expenseObject_id= expenseApply.data.expenseObject_id;
        var Url = baseConfig.businessPath + "/expense_account/fetch_exp_details";
        var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_project_id":"' + expenseObject_id + '"}}';
        $http.post(Url,PostData).success(function (response){
            console.log(response);
            //console.log("接口返回数据： " + angular.toJson(response));
            deferred.resolve(response);

        }).error(function(err) {

                deferred.reject(err);
            });
        return deferred.promise;
    }
    var promise=interfaceReportList();
    promise.then(function(response){
        if(response["status"] == "S")
      {
          var interfaceReportList = response["detail"];
          $.each(interfaceReportList, function (n, value) {
              var item = {
                  dateFrom : value.date_from,
                  dateTo   : value.date_to,
                  place    : value.place,
                  memo    : value.desc,
                  amount :value.amt,
                  expObject_desc:value.exp_item,
                  lineId:value.expense_detail_id,
                  original_currency:value.original_currency,
                  exchange_rate:value.exchange_rate,
                  attach_number:value.attach_number,
                  rentals_infor:value.rentals_infor,
                  quantity:value.qty,
                  price:value.price
          };
             /* for(var i=0;i<$scope.selectedLineId.length;i++)
              {
                  if($scope.selectedLineId[i]!==item.lineId)


              }*/
             // Item.push(item);
              console.log(Item);
              //console.log("Item++++: " + angular.toJson(Item));
              if(contains( $scope.selectedLineId,item.lineId))
              {
                console.log(456);
              }
              else{
                  Item.push(item);
                  console.log(789);
              }
          });
          $scope.interfaceReportList=Item;
          $ionicLoading.hide();
      }
        else{
           // showMessage("未知错误:"+angular.toJson(response));
            dialog.showAlert("E","获取信息错误");
            $ionicLoading.hide();
        }

    },function(error){
       // showMessage("网络连接错误...."+angular.toJson(error));
        dialog.showAlert("E","网络连接错误");
        $ionicLoading.hide();
    });

    function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }

        return false;
    }


    $scope.confirmAccounts=function(){
        var selectedAccounts=getSelected();
        console.log(selectedAccounts);


          for(var i=0;i<selectedAccounts.length;i++){

              selectedAccounts[i].dateFrom= selectedAccounts[i].dateFrom.toString();
              selectedAccounts[i].dateTo= selectedAccounts[i].dateTo.toString();
              expenseApply.data.lines.push(selectedAccounts[i]);

              expenseApply.selectedLineId.push(selectedAccounts[i].lineId);

            //  expenseApply.dateFmtForUI();
          }
        console.log(4444);
        console.log( expenseApply.selectedLineId);
        console.log(5555);
        expenseApply.data.sum=0;
        for(var i=0;i<expenseApply.data.lines.length;i++){
            expenseApply.data.sum+=expenseApply.data.lines[i].amount;
        }
       // console.log(expenseApply.data.sum);
        $ionicHistory.goBack();
        //$state.go('tab.expenseLines_expenseDetail');


    };

        function getSelected(){
            var accountList=$scope.interfaceReportList;
            var selectedList=[];

            console.log(accountList);

            for(var i=0;i<accountList.length;i++){
                //alert(accountList[i].Selected==undefined || accountList[i].Selected=="NO");

                if(!(accountList[i].Selected==undefined || accountList[i].Selected=="NO")){
                   // showMessage(accountList[i].Selected);
                    selectedList.push(accountList[i]);
                    //从记一笔列表中删除已选行项目
                   // $scope.interfaceReportList.splice(i,1);
                }
            }
            return selectedList;
        }


    });

/**
 * Created by huchaoliang on 15-5-22.
 */

angular.module("applicationModule").controller('reportTypeController', function($scope,keepAccount,$http,$q,expenseApply,travelApply, baseConfig) {

    function queryReportTypeList(){
        var companyId=baseConfig.user.companyId;
        var deferred = $q.defer();
        $http.get(baseConfig.basePath+"EXP/reimbursementList.svc?companyId="+companyId,{cache:false}).
            success(function(response, status, headers, config) {
                deferred.resolve(response);
            }).
            error(function(error, status, headers, config) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    var promise=queryReportTypeList();
    promise.then(function(response){

        $scope.reportTypeList=[];

        var code=getResponseCode(response);
        if(code=="ok"){
            console.log(response);
            $scope.reportTypeList=response.body.reimbursementList;
        }else if(code=="failure"){
        }
        else if (code =="login_required"){
            showMessage("登录状态异常\n"+angular.toJson(response));
            reLogin();
        }else{
            showMessage("未知错误:"+angular.toJson(response));
        }
    },function(error){
        $scope.reportTypeList=[];

        alert("网络连接错误,初始化数据"+error.message);
    });

    $scope.selectReportType=function(e){
        var target= e.target;
        var reportTypeName=target.getAttribute('reportTypeName');
        var reportTypeId=target.getAttribute('reportTypeId');
        var reportTypeCode=target.getAttribute('reportTypeCode');
         console.log(reportTypeName);
      //  travelApply.data.expType="123";

        expenseApply.data.reportType=reportTypeId;
        expenseApply.data.reportTypeName=reportTypeName;

        console.log( expenseApply.data);

        globalNavigator.popPage();
    }
});

angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.flybackApply', {
          url: '/flyback-apply',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/flyback/apply/apply.html',
              controller: 'FlyBackApplyCtrl'
            }
          }
        });
    }]);

angular.module("applicationModule")
  .controller('FlyBackApplyCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$timeout',
    'hmsHttp',
    '$ionicModal',
    'flaybackService',
    'hmsPopup',
    function ($scope, $rootScope, $state, baseConfig, $ionicHistory, 
      $timeout, HttpAppService, $ionicModal, fbService,
      Prompter){
      $scope.viewtitle = "机票申请";
      $scope.pageParam = fbService.getPageStatusCreate();  //JSON.parse($stateParams.param);
      console.log(" $scope.pageParam =" + $scope.pageParam);
      $scope.canEdit = $scope.pageParam.canEdit;// 页面是否可编辑
      var dataSource = $scope.pageParam.dataSource;//页面数据来源

      fbService.setLines($scope.flybacklines);
      //数据
      function init() {
        if (dataSource == "create") {
          $scope.flybackHeader = {
            "applyId": "",
            "projName": "",
            "projCode": ""
          };
          fbService.clearLines();
          $scope.flybacklines = fbService.getLines();
        } else if (dataSource == "query") {
          var applyId = $scope.pageParam.applyId;
          Prompter.showLoading("Loading...");
          var urlValueList = baseConfig.businessPath + "/create_ticket_apply/get_flyback_detail";
          var paramValueList = '{"params":{"p_apply_id":"' + applyId + '"}}';
          HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
            console.log("get_flyback_detail =" + angular.toJson(response));
            if (response.status == "S") {
              $scope.flybackHeader = response["flybackHeader"];
              $scope.flybacklines = response["flybacklines"];
              fbService.setLines($scope.flybacklines);
              Prompter.hideLoading("");
            } else {
              console.log("获取机票申请信息失败：" + response.returnMsg);
              Prompter.hideLoading("");
            }
          }).error(function (response, status) {
            console.log("HttpAppService error ");
            Prompter.hideLoading("");
          });
        }
      }

      init();

      //
      $scope.$on("$ionicView.enter", function () {
        console.log("fbService.getLines()");
        $scope.flybacklines = fbService.getLines();
        console.log(angular.toJson($scope.flybacklines));
        $scope.$apply();
      });


      // 获取值列表数据
      if ($scope.canEdit) {
        Prompter.showLoading("Loading...");
        var urlValueList = baseConfig.businessPath + "/create_ticket_apply/get_value_list";
        var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno + '"}}';
        HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
          if (response.status == "S") {
            $scope.projectList = response.projectList;
            fbService.setTicketTypeList(response.ticketTypeList);// 订票类型
            fbService.setRouteTypeList(response.routeTypeList);//行程类别
            fbService.setPassenger(response.passengerList);//乘机人列表
            fbService.setPassenger(response.passenger);//默认乘机人
            fbService.setCertification(response.certification);//默认身份证
            Prompter.hideLoading("");
          } else {
            console.log("获取值列表失败：" + response.returnMsg);
          }
        }).error(function (response, status) {
          console.log("HttpAppService error ");
          Prompter.hideLoading("");
        });
      }

      // 项目值列表
      $ionicModal.fromTemplateUrl('build/pages/application/flyback/apply/model/project-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal
      });
      $scope.openProjectList = function () {
        $scope.modal.show();
      };
      $scope.closeModal = function (proj) {
        $scope.modal.hide();
        //若更换项目则清空订票行
        if (proj !== undefined) {
          if ((typeof($scope.flybackHeader.projCode) !== "undefined") && ($scope.flybackHeader.projCode !== null)) {
            if ($scope.flybackHeader.projCode !== proj.value) {
              $scope.flybacklines = [];
              fbService.clearLines();
            }
          }
          $scope.flybackHeader.projName = proj.name;
          $scope.flybackHeader.projCode = proj.value;
          fbService.setProjName($scope.flybackHeader.projName);
          fbService.setProjCode($scope.flybackHeader.projCode);
        }
      };
      $scope.$on('$destroy', function () {
        $scope.modal.remove();
      });


      $scope.goDetail = function (detail, index) {
        var param = {
          "canEdit": $scope.canEdit,
          "dataSource": dataSource,
          "status": "update",
          "detail": detail,
          "index": index,
          "applyId": $scope.flybackHeader.applyId
        };
        $state.go("tab.flybackDetail", {param: angular.toJson(param)});
      };

    //添加更多订票信息
      $scope.addFlightInfo = function () {
        fbService.setProjName($scope.flybackHeader.projName);
        fbService.setProjCode($scope.flybackHeader.projCode);
        var param = {"canEdit": $scope.canEdit, "status": "new"};
        $state.go("tab.flybackDetail", {param: angular.toJson(param)});
      };
    //保存 baseConfig.businessPath   baseConfig.businessPath
      $scope.save = function () {
        Prompter.showLoading("Loading...");
        var urlValueList = baseConfig.businessPath + "/create_ticket_apply/save_flyback";
        var jsonData = JSON.stringify($scope.flybacklines);
        var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno
          + '","p_apply_id":"' + $scope.flybackHeader.applyId
          + '","p_project_code":"' + $scope.flybackHeader.projCode
          + '","p_fb_lines":' + jsonData + '}}';
        console.log(paramValueList);
        HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
          console.log("save_flyback = " + angular.toJson(response));
          if (response.status == "S") {
            $scope.flybackHeader.applyId = response["applyId"];
            $scope.flybacklines = response["flybackLines"];
            fbService.setLines($scope.flybacklines);
            Prompter.hideLoading("");
            Prompter.showPopup("保存成功!");
          } else {
            console.log("保存失败：" + response["returnMsg"]);
            Prompter.hideLoading("");
          }
        }).error(function (response, status) {
          console.log("HttpAppService error ");
          Prompter.hideLoading("");
        });
      };
    //提交
      $scope.submit = function () {
        Prompter.showLoading("Loading...");
        var urlValueList = baseConfig.businessPath + "/create_ticket_apply/flyback_submit";
        var jsonData = JSON.stringify($scope.flybacklines);
        var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno
          + '","p_apply_id":"' + $scope.flybackHeader.applyId
          + '","p_project_code":"' + $scope.flybackHeader.projCode
          + '","p_fb_lines":' + jsonData + '}}';
        HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
          console.log("flyback_submit = " + angular.toJson(response));
          if (response.status == "S") {
            Prompter.hideLoading("");
            Prompter.showPopup("提交成功!");
            $scope.canEdit = false;
          } else {
            Prompter.hideLoading("");
            Prompter.showPopup("提交失败：" + response["returnMsg"]);
          }
        }).error(function (response, status) {
          console.log("HttpAppService error ");
          Prompter.hideLoading("");
        });
      };

      // 删除fyback
      $scope.deleteFB = function () {
        console.log(angular.toJson($scope.flybackHeader));
        if ($scope.flybackHeader.applyId == "") {
          $state.go("tab.flyback");
        } else {
          if ($scope.canEdit) {
            Prompter.showLoading("Loading...");
            var urlValueList = baseConfig.businessPath + "/create_ticket_apply/delete_flyback_all";
            var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_apply_id":"' + $scope.flybackHeader.applyId + '"}}';
            console.log(paramValueList);
            HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
              if (response.status == "S") {
                Prompter.hideLoading("");
                Prompter.showPopup("删除成功!");
                $state.go("tab.flybackQuery");
                dataSource = "create";
                init();
              } else {
                console.log("删除失败：" + response.returnMsg);
                Prompter.hideLoading("");
                Prompter.showPopup("删除失败,请重新查询后再操作!");
              }
            }).error(function (response, status) {
              console.log("HttpAppService error ");
              Prompter.hideLoading("");
            });
          } else {
            Prompter.showPopup("已提交数据无法删除!");
          }

        }
      }
    }]);
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.flybackDetail', {
          url: '/flyback-detail/:param',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/flyback/detail/detail.html',
              controller: 'FlyBackDetailCtrl'
            }
          }
        });
    }])

angular.module("applicationModule")
  .controller('FlyBackDetailCtrl', [
    '$scope',
    '$rootScope', 
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$timeout',
    'hmsHttp',
    '$ionicModal',
    'flaybackService',
    'hmsPopup',
    '$stateParams',
    function ($scope, $rootScope, $state, baseConfig, $ionicHistory, 
      $timeout, HttpAppService, $ionicModal, fbService,
      Prompter, $stateParams){
        //  $scope.canEdit = true;
        // 获取页面参数
        $scope.pageParam = JSON.parse($stateParams.param);
        $scope.canEdit = $scope.pageParam.canEdit;//页面是否可编辑
        var dataSource = $scope.pageParam.dataSource;//页面数据来源
        if ($scope.pageParam.status == "update") {
          $scope.flybackline = $scope.pageParam.detail;
          var flight_date = new Date($scope.flybackline.flight_date);
          $scope.flybackline.flight_date = flight_date;
          var flybacklineOld = $scope.flybackline;
          var index = $scope.pageParam.index;
          var applyId = $scope.pageParam.applyId;
        } else if ($scope.pageParam.status == "new") {

          var flight_date = new Date(fbService.getNowFormatDate().replace(/\-/g, "/"));
          $scope.flybackline = {
            "apply_detail_id": "",
            "projName": "",
            "projCode": "",
            "ticketTypeName": "",
            "ticket_type": "",
            "routeTypeName": "",
            "route_type": "",
            "flyback1": "",
            "flyback1_id": "",
            "flyback2": "",
            "flyback2_id": "",
            "from_place": "",
            "go_place": "",
            "flight_date": flight_date,
            "flight_time": "",
            "place": "",
            // "placeCode": "",
            "passenger": "",
            "certificate_code": "",
            "customer_paid": "0",
            "is_ticket_only_record": "0",
            "description": ""
          };
          $scope.flybackline.projName = fbService.getProjName();
          $scope.flybackline.projCode = fbService.getProjCode();
          $scope.flybackline.passenger = fbService.getPassenger();
          $scope.flybackline.certificate_code = fbService.getCertification();
          console.log(" $scope.flybackline.projName " + $scope.flybackline.projName);
        }


        // 获取值列表
        if ($scope.canEdit) {
          $scope.ticketTypeList = fbService.getTicketTypeList();
          $scope.routeTypeList = fbService.getRouteTypeList();
          $scope.passengerList = fbService.getPassengerList();
          //给默认值
          if ($scope.pageParam.status == "new") {
            if ($scope.ticketTypeList.length > 0) {
              $scope.flybackline.ticketTypeName = $scope.ticketTypeList[0].name;
              $scope.flybackline.ticket_type = $scope.ticketTypeList[0].value;
            }
            if ($scope.routeTypeList.length > 0) {
              $scope.flybackline.routeTypeName = $scope.routeTypeList[0].name;
              $scope.flybackline.route_type = $scope.routeTypeList[0].value;
            }
          }
          Prompter.showLoading("Loading...");
          var urlValueList = baseConfig.businessPath + "/create_ticket_apply/get_value_list2";
          var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_project_code":"' + $scope.flybackline.projCode + '"}}';
          console.log("");
          HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
            if (response.status == "S") {
              $scope.placeList = response.placeList;
              $scope.flybackList = response.flybackList;
              $scope.preflybackList = response.preflybackList;
              // 项目地默认取值列表中的第一个
              if ($scope.placeList.length > 0) {
                $scope.flybackline.place = $scope.placeList[0].name;
                //  $scope.flybackline.placeCode = $scope.placeList[0].value;
              }
              Prompter.hideLoading("");
            } else {
              console.log("获取值列表失败：" + response.returnMsg);
              Prompter.hideLoading("");
            }
          }).error(function (response, status) {
            console.log("HttpAppService error ");
            Prompter.hideLoading("");
          });
        }


        //日历插件调用
        $scope.datepickerObject = {};
        $scope.datepickerObject.inputDate = new Date();

        $scope.datepickerObjectPopup = {
          titleLabel: '日期选择',  //Optional
          todayLabel: '今天',  //Optional
          closeLabel: '关闭',  //Optional
          setLabel: '确定',  //Optional
          setButtonType: 'button-assertive',  //Optional
          todayButtonType: 'button',  //Optional
          closeButtonType: 'button',  //Optional
          inputDate: $scope.datepickerObject.inputDate, //Optional
          mondayFirst: true,  //Optional
          disabledDates: [], //Optional
          weekDaysList: ["日", "一", "二", "三", "四", "五", "六"], //Optional
          monthList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"], //Optional
          templateType: 'popup', //Optional
          showTodayButton: 'true', //Optional
          modalHeaderColor: 'bar-positive', //Optional
          modalFooterColor: 'bar-positive', //Optional
          from: new Date(1900, 0, 1), //Optional
          to: new Date(2101, 0, 1),  //Optional
          dateFormat: ' yyyy - MM - dd ', //Optional
          closeOnSelect: false, //Optional
          callback: function (val) { //Optional
            datePickerCallbackPopup(val);
          }
        };
        var datePickerCallbackPopup = function (val) {
          if (typeof(val) === 'undefined') {
            console.log('No date selected');
          } else {
            $scope.datepickerObjectPopup.inputDate = val;
            $scope.flybackline.flight_date = val;
            console.log('Selected date is : ', $scope.flybackline.flight_date)
          }
        };


        // 值列表
        $ionicModal.fromTemplateUrl('build/pages/application/flyback/detail/model/select-modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function (modal) {
          $scope.modal = modal
        });

        $scope.openModal = function (type) {
          if ($scope.canEdit) {
            if (type == "ticketType") {
              $scope.listType = "ticketType";
              $scope.lists = $scope.ticketTypeList;
            } else if (type == "routeType") {
              $scope.listType = "routeType";
              $scope.lists = $scope.routeTypeList;
            } else if (type == "flyback1") {
              $scope.listType = "flyback1";
              if ($scope.flybackline.ticket_type == "10") {
                $scope.lists = $scope.flybackList;
              } else if ($scope.flybackline.ticket_type == "20") {
                $scope.lists = $scope.preflybackList;
              }
            } else if (type == "flyback2") {
              $scope.listType = "flyback2";
              if ($scope.flybackline.ticket_type == "10") {
                $scope.lists = $scope.flybackList;
              } else if ($scope.flybackline.ticket_type == "20") {
                $scope.lists = $scope.preflybackList;
              }
            } else if (type == "place") {
              $scope.listType = "place";
              $scope.lists = $scope.placeList;
            } else if (type == "passenger") {
              $scope.listType = "passenger";
              $scope.lists = $scope.passengerList;
            }
            $scope.modal.show();
          }
        };
        $scope.closeModal = function (item) {
          $scope.modal.hide();
          if (item !== undefined) {
            if ($scope.listType == "ticketType") {
              if ((typeof($scope.flybackline.ticket_type) !== "undefined") && ($scope.flybackline.ticket_type !== null)) {
                if ($scope.flybackline.flybackline !== item.value) {
                  $scope.flybackline.flyback1 = "";
                  $scope.flybackline.flyback1_id = "";
                  $scope.flybackline.flyback2 = "";
                  $scope.flybackline.flyback2_id = "";
                }
              }
              $scope.flybackline.ticketTypeName = item.name;
              $scope.flybackline.ticket_type = item.value;
            } else if ($scope.listType == "routeType") {
              $scope.flybackline.routeTypeName = item.name;
              $scope.flybackline.route_type = item.value;
            } else if ($scope.listType == "flyback1") {
              $scope.flybackline.flyback1 = item.type_name;
              $scope.flybackline.flyback1_id = item.value;
            }
            else if ($scope.listType == "flyback2") {
              $scope.flybackline.flyback2 = item.type_name;
              $scope.flybackline.flyback2_id = item.value;
            } else if ($scope.listType == "place") {
              $scope.flybackline.place = item.name;
              //  $scope.flybackline.placeCode = item.value;
            } else if ($scope.listType == "passenger") {
              $scope.flybackline.passenger = item.name;
              $scope.flybackline.certificate_code = item.value;
            }
          }
        };

        $scope.clearSelect = function () {
          $scope.modal.hide();
          if ($scope.listType == "ticketType") {
            $scope.flybackline.ticketTypeName = "";
            $scope.flybackline.ticket_type = "";
            $scope.flybackline.flyback1 = "";
            $scope.flybackline.flyback1_id = "";
            $scope.flybackline.flyback2 = "";
            $scope.flybackline.flyback2_id = "";
          } else if ($scope.listType == "routeType") {
            $scope.flybackline.routeTypeName = "";
            $scope.flybackline.route_type = "";
          } else if ($scope.listType == "flyback1") {
            $scope.flybackline.flyback1 = "";
            $scope.flybackline.flyback1_id = "";
          }
          else if ($scope.listType == "flyback2") {
            $scope.flybackline.flyback2 = "";
            $scope.flybackline.flyback2_id = "";
          } else if ($scope.listType == "place") {
            $scope.flybackline.place = "";
            //   $scope.flybackline.placeCode = "";
          } else if ($scope.listType == "passenger") {
            $scope.flybackline.passenger = "";
            $scope.flybackline.certificate_code = "";
          }
        };

        var checkbox = {
          checked: "ion-ios-checkmark fb-checkbox",
          unchecked: "ion-ios-circle-outline fb-checkbox"
        }
        // 客户承担
        $scope.customerpaid = {id: 1, selected: 'N', style: "ion-ios-circle-outline fb-checkbox", editable: 'Y'};
        $scope.customerPaid = function () {
          if ($scope.canEdit) {
            if ($scope.customerpaid.editable == "Y") {// add by ciwei
              if ($scope.customerpaid.selected == "Y") {
                $scope.customerpaid.selected = "N";
                $scope.customerpaid.style = checkbox.unchecked;
                $scope.flybackline.customer_paid = "0";
              } else {
                $scope.customerpaid.selected = "Y";
                $scope.customerpaid.style = checkbox.checked;
                $scope.flybackline.customer_paid = "1";
              }
            }
          }
        };
        // 机票补录
        $scope.ticketonly = {id: 1, selected: 'N', style: "ion-ios-circle-outline timesheet-checkbox", editable: 'Y'};
        $scope.ticketOnly = function () {
          if ($scope.canEdit) {
            if ($scope.ticketonly.selected == "Y") {
              $scope.ticketonly.selected = "N";
              $scope.ticketonly.style = checkbox.unchecked;
              $scope.flybackline.is_ticket_only_record = "0";
            } else {
              $scope.ticketonly.selected = "Y";
              $scope.ticketonly.style = checkbox.checked;
              $scope.flybackline.is_ticket_only_record = "1";
            }
          }
        };
        // 初始化数据
        if ($scope.flybackline.customer_paid == "0") {
          $scope.customerpaid.selected = "N";
          $scope.customerpaid.style = checkbox.unchecked;
        } else {
          $scope.customerpaid.selected = "Y";
          $scope.customerpaid.style = checkbox.checked;
        }
        if ($scope.flybackline.is_ticket_only_record == "0") {
          $scope.ticketonly.selected = "N";
          $scope.ticketonly.style = checkbox.unchecked;
        } else {
          $scope.ticketonly.selected = "Y";
          $scope.ticketonly.style = checkbox.checked;
        }


        $scope.$on('$destroy', function () {
          $scope.modal.remove();
        });

        //删除
        $scope.delete = function () {
          if ($scope.canEdit) {
            //  var flight_date = getFormatDate(new Date($scope.flybackline.flight_date));
            //  $scope.flybackline.flight_date = flight_date;
            if ($scope.flybackline.apply_detail_id !== "") {
              Prompter.showLoading("Loading...");
              var urlValueList = baseConfig.businessPath + "/create_ticket_apply/delete_flyback_line";
              var paramValueList = '{"params":{"p_apply_id":"' + applyId + '","p_apply_detail_id":"' + $scope.flybackline.apply_detail_id + '"}}';
              console.log("paramValueList =" + paramValueList);
              HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
                if (response.status == "S") {
                  fbService.deleteLine(index);
                  Prompter.hideLoading("");
                } else {
                  console.log("删除失败：" + response.returnMsg);
                  Prompter.hideLoading("");
                }
              }).error(function (response, status) {
                console.log("HttpAppService error ");
                Prompter.hideLoading("");
              });
            } else {
              fbService.deleteLine(index);
            }
            $state.go("tab.flybackApply");
          } else {
            Prompter.showPopup("已提交数据无法删除!");
          }
        }
        //确认
        $scope.confirm = function () {
          console.log("confirm status =" + $scope.pageParam.status);
          if ($scope.pageParam.status == "new") {
            var flight_date = getFormatDate(new Date($scope.flybackline.flight_date));
            $scope.flybackline.flight_date = flight_date;
            fbService.addLine($scope.flybackline);
            $state.go("tab.flybackApply");
          } else if ($scope.pageParam.status == "update") {
            fbService.updateLine($scope.flybackline, index);
            $state.go("tab.flybackApply");
          }

        };
    }]);
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.flybackQuery', {
          url: '/flyback-query',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/flyback/query/query.html',
              controller: 'FlyBackQueryCtrl'
            }
          }
        });
    }]);

angular.module("applicationModule")
  .controller('FlyBackQueryCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$timeout',
    '$ionicModal',
    '$ionicScrollDelegate',
    'hmsHttp',
    'flaybackService',
    'hmsPopup',
    'hmsHttp',
    function ($scope, $rootScope, $state, baseConfig, $ionicHistory, 
      $timeout, $ionicModal, $ionicScrollDelegate, hmsHttp, 
      flaybackService, hmsPopup, HttpAppService){

        var strDate = flaybackService.getNowFormatDate();
        var dateTo = new Date(strDate.replace(/\-/g, "/"));
        var now = new Date(strDate.replace(/\-/g, "/"));
        var dateFrom = new Date(now.setMonth(now.getMonth() - 1));
        $scope.param = {
          "projectCode": "",
          "projectName": "",
          "filter": "",
          "reqDateFrom": dateFrom,//默认最近一个月
          "reqDateTo": dateTo
        };
        $scope.flybackList = [];

        // 查询按钮
        $scope.query = function () {
          if ($scope.param.reqDateFrom == "" || $scope.param.reqDateTo == "") {
            hmsPopup.showPopup("请输入查询日期范围！");
          } else {
            var dateFrom = flaybackService.getFormatDate(new Date($scope.param.reqDateFrom));
            var dateTo = flaybackService.getFormatDate(new Date($scope.param.reqDateTo));
            hmsPopup.showLoading("Loading...");
            var urlValueList = baseConfig.businessPath + "/create_ticket_apply/get_flyback_lists";
            var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno
              + '","p_project_code":"' + $scope.param.projectCode
              + '","p_apply_date_from":"' + dateFrom
              + '","p_apply_date_to":"' + dateTo
              + '"}}';
            HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
              //console.log("get_flyback_lists =" + angular.toJson(response));
              if (response.status == "S") {
                $scope.flybackList = response.flybackList;
                hmsPopup.hideLoading("");
              } else {
                console.log("查询机票申请失败：" + response.returnMsg);
                hmsPopup.hideLoading("");
              }
            }).error(function (response, status) {
              console.log("HttpAppService error ");
              hmsPopup.hideLoading("");
            });
          }
        };

        $scope.query();
        // 进入页面自动查询。
        $scope.$on("$ionicView.enter", function () {
          $scope.query();
        });

        //获取项目列表
        hmsPopup.showLoading("Loading...");
        var urlValueList = baseConfig.businessPath + "/create_ticket_apply/get_project_list";
        var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno + '"}}';
        HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
          //console.log("get_project_list =" + angular.toJson(response));
          if (response.status == "S") {
            $scope.projectList = response.projectList;
            hmsPopup.hideLoading("");
          } else {
            console.log("获取项目列表失败：" + response.returnMsg);
            hmsPopup.hideLoading("");
          }
        }).error(function (response, status) {
          console.log("HttpAppService error ");
          hmsPopup.hideLoading("");
        });


        // 值列表
        $ionicModal.fromTemplateUrl('build/pages/application/flyback/query/model/select-modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function (modal) {
          $scope.modal = modal
        });
        $scope.openModal = function (type) {
          if (type == "project") {
            $scope.listType = "project";
            $scope.lists = $scope.projectList;
          }
          $scope.modal.show();
        };
        $scope.chooseModal = function (item) {
          $scope.modal.hide();
          if ($scope.listType == "project") {
            $scope.param.projectName = item.name;
            $scope.param.projectCode = item.value;
            $scope.param.filter = "";
          }
        };
        $scope.closeModal = function () {
          $scope.modal.hide();
        };
        $scope.clearChoose = function (type) {
          $scope.modal.hide();
          if ($scope.listType == "project") {
            $scope.param.projectName = "";
            $scope.param.projectCode = "";
            $scope.param.filter = "";
          }
        };
        $scope.$on('$destroy', function () {
          $scope.modal.remove();
        });


        $scope.goDetail = function (data) {
          if (data.isSubmitted == "0") {
            var canEdit = true;
          } else if (data.isSubmitted == "1") {
            var canEdit = false;
          }
          var param = {"canEdit": canEdit, "dataSource": "query", "applyId": data.applyId};
          flaybackService.setPageStatusCreate(param);
          $state.go("tab.flybackApply");
        }

        // 删除fyback
        $scope.deleteFB = function (applyId, index) {
          hmsPopup.showLoading("Loading...");
          var urlValueList = baseConfig.businessPath + "/create_ticket_apply/delete_flyback_all";
          var paramValueList = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_apply_id":"' + applyId + '"}}';
          HttpAppService.post(urlValueList, paramValueList, $scope).success(function (response) {
            if (response.status == "S") {
              $scope.flybackList.splice(index, 1);
              hmsPopup.hideLoading("");
            } else {
              console.log("删除失败：" + response.returnMsg);
              hmsPopup.hideLoading("");
            }
          }).error(function (response, status) {
            console.log("HttpAppService error ");
            hmsPopup.hideLoading("");
          });
        }

    }]);
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.flyback', { 
          url: '/flyback-main',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/flyback/main/main.html',
              controller: 'FlyBackMainCtrl'
            }
          }
        });
    }])

angular.module("applicationModule")
  .controller('FlyBackMainCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$timeout',
    'hmsHttp',
    'flaybackService',
    function ($scope, $rootScope, $state, baseConfig, $ionicHistory, 
      $timeout, hmsHttp, fbService){

        $scope.createFlightBook = function(){
          var param = {"canEdit": true, "dataSource": "create"};
          fbService.setPageStatusCreate(param);
          $state.go("tab.flybackApply");
        };
        $scope.queryFlightBook = function(){
          $state.go("tab.flybackQuery");
        };

    }]);
/**
 * Created by gusenlin on 16/5/22.
 */ 
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.timesheet', {
          url: '/timesheet',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/timesheet/query/query.html',
              controller: 'TimeSheetQueryCtrl'
            }
          }
        });
    }]);

angular.module('applicationModule')
  .controller('TimeSheetQueryCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig', 
    '$ionicHistory',
    '$timeout',
    '$ionicScrollDelegate',
    'TimeSheetService',
    'hmsHttp',
    function ($scope,
              $rootScope,
              $state,
              baseConfig,
              $ionicHistory,
              $timeout,
              $ionicScrollDelegate,
              TimeSheetService,
              hmsHttp) {

      var currentTimeSheetPosition = true;
      $scope.calendar = [];
      $scope.loadingDataFlag = true;

      //年表
      $scope.currentYear = '';
      $scope.currentMonth = '';
      //月份列表
      $scope.monthList = [
        {"selected": false, value: "1"}, {"selected": false, value: "2"}, {"selected": false, value: "3"},
        {"selected": false, value: "4"}, {"selected": false, value: "5"}, {"selected": false, value: "6"},
        {"selected": false, value: "7"}, {"selected": false, value: "8"}, {"selected": false, value: "9"},
        {"selected": false, value: "10"}, {"selected": false, value: "11"}, {"selected": false, value: "12"}
      ];
      //周列表
      $scope.weekTitleList = [
        '日', '一', '二', '三', '四', '五', '六'
      ];

      var formatMonth = function (month) {
        if (parseInt(month) < 10) {
          return '0' + month;
        } else {
          return '' + month;
        }
      };

      var initDate = function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        $scope.currentYear = year;
        $scope.currentMonth = month;
        angular.forEach($scope.monthList, function (data) {
          if (data.value === month + '') {
            data.selected = true;
            return;
          }
        });
        if (baseConfig.debug) {
          console.log('initDate.year ' + year);
          console.log('initDate.month ' + month)
        }

        var monthParams = year + '' + formatMonth(month);
        fetchCalendar(monthParams);
      }

      var init = function () {
        $scope.calendar = [];
        for (i = 0; i < 5; i++) {
          var style_outline = 'each-day';
          var style_color = 'day-item';
          var money = '';
          var project = '';
          var week = {
            week: i,
            list: []
          };
          for (j = 0; j < 7; j++) {
            var item = {
              day: i + "" + j,
              style_outline: style_outline,
              style_color: style_color,
              money: money,
              project: project
            };
            week.list.push(item);
          }
          $scope.calendar.push(week);
        }
      };

      $scope.writeTimesheet = function (day) {
        $state.go('tab.timesheet-write', {day: day});
      }

      $scope.scrollToFixScreen = function () {
        if (currentTimeSheetPosition) {
          $ionicScrollDelegate.scrollTo(0, 400, true);
          currentTimeSheetPosition = false;
        } else {
          $ionicScrollDelegate.scrollTo(0, 0, true);
          currentTimeSheetPosition = true;
        }
      };

      var fetchData = function (result) {
        var timesheetArray = result.timesheet;
        var seq = 0;
        $scope.calendar = [];
        for (i = 0; i < 5; i++) {
          var week = {
            week: i,
            list: []
          };
          for (j = 0; j < 7; j++) {
            var item;
            var style_outline = 'each-day';
            var style_color = 'day-item';
            var money = '';
            var project = '';
            var lockFlag = false;

            if (timesheetArray[seq]) {
              if (timesheetArray[seq].lockflag == '0') {
                lockFlag = false;
              } else {
                lockFlag = true;
              }
              if (timesheetArray[seq].status == 'Empty') {
                style_outline = 'each-day';
                style_color = 'day-item';
              } else if (timesheetArray[seq].status == 'Draft') {
                style_outline = 'each-day attendance';
                style_color = 'day-item attendance';
              } else if (timesheetArray[seq].status == 'Approved') {
                style_outline = 'each-day approve';
                style_color = 'day-item approve';
              } else if (timesheetArray[seq].status == 'Rejected') {
                style_outline = 'each-day reject';
                style_color = 'day-item reject';
              }
              item = {
                day: timesheetArray[seq].day.replace('0', ''),
                style_outline: style_outline,
                style_color: style_color,
                money: timesheetArray[seq].allowance,
                project: timesheetArray[seq].proj,
                each_day: timesheetArray[seq].each_day,
                lockFlag: lockFlag
              };
            } else {
              item = {
                day: '',
                style_outline: style_outline,
                style_color: style_color,
                money: money,
                project: project,
                each_day: '',
                lockFlag: lockFlag
              };
            }

            week.list.push(item);

            seq = seq + 1;
          }
          $scope.calendar.push(week);
        }
      }

      var fetchCalendar = function (monthParams) {
        init();
        $scope.loadingDataFlag = true;

        var url = baseConfig.businessPath + "/timesheet_process/fetch_calendar";
        var params = {
          "params": {
            "p_employee": window.localStorage.empno,
            "p_month": monthParams + "",
            "p_offset": 0
          }
        };
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          fetchData(result);
          $scope.loadingDataFlag = false;
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
        }).error(function (response, status) {
          $scope.loadingDataFlag = false;
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(response));
          }
        });
      };

      $scope.getTimeSheet = function (year, month) {
        angular.forEach($scope.monthList, function (data) {
          data.selected = false;
        });
        month.selected = true;
        var monthParams = year + '' + formatMonth(month.value);
        fetchCalendar(monthParams);
      };

      //从服务器获取请求
      $timeout(
        function () {
          initDate();
        }, 300
      );

      $scope.goBack = function () {
        $ionicHistory.$ionicGoBack();
      };

      $rootScope.$on('refreshTimesheet', function(event,data) {
        if (baseConfig.debug) {
          console.log('refreshTimesheet', data);
        }
        $timeout(
          function () {
            var monthParams = $scope.currentYear  + '' + formatMonth($scope.currentMonth);
            fetchCalendar(monthParams);
          }, 300
        );
      });

      if (baseConfig.debug) {
        console.log('applicationCtrl.enter');
      }

      $scope.$on('$ionicView.enter', function (e) {
        if (baseConfig.debug) {
          console.log('applicationCtrl.$ionicView.enter');
        }
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('applicationCtrl.$destroy');
        }
      });
    }])

  .service('TimeSheetService', [
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    function (baseConfig,
              hmsHttp,
              hmsPopup) {
      this.fetchCalendar = function (monthParams) {

        var url = baseConfig.businessPath + "/timesheet_process/fetch_calendar";
        var params = {
          "params": {
            "p_employee": window.localStorage.empno,
            "p_month": monthParams + "",
            "p_offset": "0"
          }
        };
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          //hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
        }).error(function (response, status) {
          //hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(response));
          }
        });
      };

      this.fetchEachDay = function (callback, oneDate) {
        var url = baseConfig.businessPath + '/timesheet_process/fetch_projects';
        var params = {'params': {'p_employee': window.localStorage.empno + "", 'p_date': +oneDate + ""}};
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          callback(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('获取状态错误,请检查网络!');
        });
      };

      this.fetchProjectDetailInfo = function (callback, oneDate, projectId) {
        var url = baseConfig.businessPath + "/timesheet_process/project_change"
        var params = {
          'params': {
            'p_employee': window.localStorage.empno + "", 'p_date': +oneDate + "",
            'p_project_id': projectId + ""
          }
        };
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          callback(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('获取项目信息错误,请检查网络!');
        });
      };

      this.submitTimesheet = function (callback,params) {
        var url = baseConfig.businessPath + "/timesheet_process/save_timesheet1";
        var params = params;
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          callback(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('提交Timesheet错误,请检查网络!');
        });
      }
    }]);

/**
 * Created by wolf on 2016/5/21. (_wen.dai_)
 */
'use strict';
//应用-timeSheet审批模块-详情
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.tsApproveDetail', {
          url: 'application/tsApproveDetail',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/timesheet-approve/detail/ts-approve-detail.html',
              controller: 'tsApproveDetailCtrl'
            }
          },
          params: {
            'employeeNumber': "",
            'projectId': "",
            'startDate': "",
            'endDate': ""
          }
        })
    }]);
tsApproveModule.controller('tsApproveDetailCtrl', [
  '$scope',
  '$state',
  'baseConfig',
  '$ionicHistory',
  '$stateParams',
  'hmsHttp',
  'hmsPopup',
  '$timeout',
  'ApproveDetailService',
  function ($scope,
            $state,
            baseConfig,
            $ionicHistory,
            $stateParams,
            hmsHttp,
            hmsPopup,
            $timeout,
            ApproveDetailService) {

    /**
     * init var section
     */
    {
      if(ionic.Platform.isIOS()) {
        angular.element('.ae-detail-head').css('marginTop','64px');
        angular.element('#approveDetailContent').css('top','64px');
      }
      var selectItem = []; //初始化点击全部条目为false
      var clickSelectAll = false; //默认没有点击全选
      $scope.detailActionName = "操作";
      $scope.showActionBar = false; //默认不显示勾选按钮和底部的bar
      $scope.detailInfoArray = {}; //用于接收列表对应数据object
      $scope.selectArray = [];
      var tsApproveDetailUrl = baseConfig.businessPath + "/api_timesheet/query_timesheet_approve_list";
      var tsApproveDetailParams = {
        "params": {
          "p_employee_number": $stateParams.employeeNumber,
          "p_start_date": $stateParams.startDate.toString(),
          "p_end_date": $stateParams.endDate.toString(),
          "p_project_id": $stateParams.projectId
        }
      };
      var tsActionUrl = baseConfig.businessPath + "/api_timesheet/timesheet_approve";
      var tsActionParams = { //审批拒绝/通过的参数
        "params": {
          "p_approve_flag": "AGREE",
          "p_employee_number": window.localStorage.empno,
          "p_param_json": ''
        }
      };
      var approveList = { //审批拒绝/通过的子对象
        "approve_list": []
      };
    }

    $scope.$on('$ionicView.enter', function (e) {
      ApproveDetailService.setRefreshFlag('');
    });

    $scope.$on('$destroy', function (e) {
      warn('tsApproveListCtrl.$destroy');
    });

    hmsPopup.showLoading('加载中...');
    function getData() {
      hmsHttp.post(tsApproveDetailUrl, tsApproveDetailParams).success(function (response) {
        hmsPopup.hideLoading();
        if (hmsHttp.isSuccessfull(response.status)) {
          $scope.detailInfoArray = response.timesheet_approve_detail_response;
          if ($scope.detailInfoArray.subsidy_list.length === 0) {
            ApproveDetailService.setRefreshFlag('refresh-approve-list');
            $ionicHistory.goBack();
          }
        } else {
          if (response.status === 'E' || response.status == 'e') {
            hmsPopup.showShortCenterToast("没有相关数据!");
          } else {
            hmsPopup.showShortCenterToast("网络异常,请稍后重试!");
          }
        }
      }).error(function (response, status) {
        hmsPopup.hideLoading();
        hmsPopup.showShortCenterToast("服务请求异常,请检查网络连接和输入参数后重新操作!");
      });
    };
    getData();

    function __initSelectArray(selectParam) { //初始化选择按钮
      //先初始化数据操作--
      $scope.selectArray = [];
      selectItem = [];
      angular.forEach($scope.detailInfoArray.subsidy_list, function (data, index) {
        if ('undoSelectAll' == selectParam) {
          $scope.selectArray.push(false);
          selectItem.push(false);
        } else if ('selectedAll' == selectParam) {
          $scope.selectArray.push(true);
          selectItem.push(true);
        }
      });
    };
    __initSelectArray('undoSelectAll');

    $scope.dealDetailInfo = function () {
      if ($scope.detailActionName == "操作") {
        $scope.detailActionName = "取消";
        $scope.showActionBar = true;
        angular.element('#tsApproveItem').css('paddingLeft', '6%');
      } else if ($scope.detailActionName == "取消") {
        $scope.detailActionName = "操作";
        $scope.showActionBar = false;
        __initSelectArray('undoSelectAll');
        angular.element('#tsApproveItem').css('paddingLeft', '0');
        tsActionParams = { //审批拒绝/通过的参数
          "params": {
            "p_approve_flag": "AGREE",
            "p_employee_number": window.localStorage.empno,
            "p_param_json": ''
          }
        };
        approveList = {
          "approve_list": []
        };
      }
    };

    $scope.selectItem = function (index, newLineNumber) { //单击选中条目的响应method
      selectItem[index] = !selectItem[index];
      var approve = {
        "p_project_id": $scope.detailInfoArray.project_id,
        "p_project_person_number": $scope.detailInfoArray.employee_number,
        "p_start_date": "",
        "p_end_date": "",
        "p_record_id": ""
      };
      if (selectItem[index]) {
        $scope.selectArray[index] = true;
        approve.p_record_id = newLineNumber;
        approveList.approve_list[index] = approve;
      } else {
        $scope.selectArray[index] = false;
        approveList.approve_list.splice(index, 1, 'delete');
      }
    };

    $scope.selectAllDetail = function () { //全选
      clickSelectAll = !clickSelectAll;
      if (clickSelectAll) {
        __initSelectArray('selectedAll');
        for (var i = 0; i < $scope.detailInfoArray.subsidy_list.length; i++) {
          var approve = {
            "p_project_id": $scope.detailInfoArray.project_id,
            "p_project_person_number": $scope.detailInfoArray.employee_number,
            "p_start_date": "",
            "p_end_date": "",
            "p_record_id": ""
          };
          approve.p_record_id = $scope.detailInfoArray.subsidy_list[i].line_number;
          approveList.approve_list.push(approve);
        }
        warn(approveList.approve_list);
      } else {
        __initSelectArray('undoSelectAll');
        approveList.approve_list = [];
      }
    };

    function deleteSuperfluous() {
      for (var i = 0; i < approveList.approve_list.length; i++) {
        if (approveList.approve_list[i] === 'delete') {
          approveList.approve_list.splice(i, 1);
          i--;
        } else if (!approveList.approve_list[i] || approveList.approve_list[i] == "" || typeof(approveList.approve_list[i]) == "undefined") {
          approveList.approve_list.splice(i, 1);
          i--;
        }
      }
    };

    $scope.passThroughDetailItem = function () { //通过
      if (approveList.approve_list.length === 0) {
        hmsPopup.showShortCenterToast('请先选择操作项！');
        return;
      }
      deleteSuperfluous();
      tsActionParams.params.p_approve_flag = "AGREE";
      tsActionParams.params.p_param_json = JSON.stringify(approveList);
      hmsPopup.showLoading("审批中...");
      hmsHttp.post(tsActionUrl, tsActionParams).success(function (response) {
        hmsPopup.hideLoading();
        if (hmsHttp.isSuccessfull(response.status)) {
          hmsPopup.showShortCenterToast('审批成功！');
        } else {
          hmsPopup.showShortCenterToast('审批失败！');
        }
        $scope.dealDetailInfo();
        $timeout(function () {
          hmsPopup.showLoading('加载中...');
          getData();
        }, 1000);
      }).error(function (e) {
        hmsPopup.hideLoading();
        hmsPopup.showShortCenterToast('审批失败！请检查网络稍后重试');
        $scope.dealDetailInfo();
        $timeout(function () {
          hmsPopup.showLoading('加载中...');
          getData();
        }, 1000);
      });
    };

    $scope.refuseDetailItem = function () { //拒绝
      if (approveList.approve_list.length === 0) {
        hmsPopup.showShortCenterToast('请先选择操作项！');
        return;
      }
      deleteSuperfluous();
      tsActionParams.params.p_approve_flag = "REFUSE";
      tsActionParams.params.p_param_json = JSON.stringify(approveList);
      hmsPopup.showLoading("审批中...");
      hmsHttp.post(tsActionUrl, tsActionParams).success(function (response) {
        hmsPopup.hideLoading();
        if (hmsHttp.isSuccessfull(response.status)) {
          hmsPopup.showShortCenterToast('拒绝成功');
        } else {
          hmsPopup.showShortCenterToast('拒绝失败！');
        }
        $scope.dealDetailInfo();
        $timeout(function () {
          hmsPopup.showLoading('加载中...');
          getData();
        }, 1000);
      }).error(function (e) {
        hmsPopup.hideLoading();
        hmsPopup.showShortCenterToast('拒绝失败！请检查网络稍后重试');
        $scope.dealDetailInfo();
        $timeout(function () {
          hmsPopup.showLoading('加载中...');
          getData();
        }, 1000);
      });
    };
  }]).service('ApproveDetailService', function () {
  var flag = ''; //刷新上个列表的标识
  return {
    setRefreshFlag: function (newFlag) {
      flag = newFlag;
    },
    getRefreshFlag: function () {
      return flag;
    }
  }
});


angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.timesheet-write', {
          url: '/timesheet-write',
          params: {day: {}},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/timesheet/write/write.html',
              controller: 'TimeSheetWriteCtrl'
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
  .controller('TimeSheetWriteCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$stateParams',
    '$ionicModal',
    '$timeout',
    '$ionicHistory',
    'baseConfig',
    'TimeSheetService',
    'hmsPopup',
    function ($scope,
              $rootScope,
              $state,
              $stateParams,
              $ionicModal,
              $timeout,
              $ionicHistory,
              baseConfig,
              TimeSheetService,
              hmsPopup) {

      var checked = 'ion-ios-checkmark';
      var unchecked = 'ion-ios-circle-outline'
      $scope.projectList = [];
      $scope.addressList = [];
      $scope.flybackList = [];
      var editable = 'N';
      var uncheckedJson = {flag: false, style: unchecked};
      var checkedJson = {flag: true, style: checked};


      //初始化timesheet填写界面字段
      $scope.timesheetDetail =
      {
        currentDay: "",
        approver: "",
        currentProject: {},
        currentAddress: {},
        currentFlyback: {},
        travelingAllowance: {flag: false, style: unchecked},
        normalAllowance: {flag: false, style: unchecked},
        intCharge: {flag: false, style: unchecked}, //ion-ios-checkmark
        extCharge: {flag: false, style: unchecked}, //ion-ios-checkmark
        description: ""
      };

      if (baseConfig.debug) {
        console.log('$stateParams.day ' + angular.toJson($stateParams.day));
      }

      $scope.currentDate = $stateParams.day.each_day;

      //加载项目画面
      $ionicModal.fromTemplateUrl('build/pages/application/timesheet/write/modal/projectModal.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.projectModal = modal;
      });

      //加载项目地点画面
      $ionicModal.fromTemplateUrl('build/pages/application/timesheet/write/modal/addressModal.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.addressModal = modal;
      });

      //加载机票补贴画面
      $ionicModal.fromTemplateUrl('build/pages/application/timesheet/write/modal/flybackList.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.flybackModal = modal;
      });

      $scope.selectAddress = function (address) {
        if (baseConfig.debug) {
          console.log("selectAddress.address " + angular.toJson(address));
        }
        $scope.timesheetDetail.currentAddress = address;
        $scope.addressModal.hide();
      };

      $scope.selectFlyback = function (flyback) {
        if (baseConfig.debug) {
          console.log("selectAddress.flyback " + angular.toJson(flyback));
        }
        $scope.timesheetDetail.currentFlyback = flyback;
        $scope.flybackModal.hide();
      };

      $scope.selectProject = function (project) {
        if (baseConfig.debug) {
          console.log("selectAddress.project " + angular.toJson(project));
        }
        $scope.timesheetDetail.currentProject = project;
        $scope.projectModal.hide();

        var success = function (result) {
          hmsPopup.hideLoading();
          if (result.status == 'S') {
            $scope.addressList = result.projaddress;
            $scope.flybackList = result.flyback;
            $scope.timesheetDetail.approver = result.approver;
            $scope.timesheetDetail.travelingAllowance = {flag: false, style: unchecked};
            $scope.timesheetDetail.normalAllowance = {flag: false, style: unchecked};
            if (result.projaddress[0]) {
              $scope.timesheetDetail.currentAddress = result.projaddress[0];
            } else {
              $scope.timesheetDetail.currentAddress = {"selected_flag": "Y", "address_id": "0", "address_name": "缺省地点"};
            }
            if (result.flyback[0]) {
              $scope.timesheetDetail.currentFlyback = result.flyback[0];
            } else {
              $scope.timesheetDetail.currentFlyback = {"fly_select": "Y", "fly_name": "无flyback", "fly_id": "-1"};
            }
          } else {
            hmsPopup.showPopup('获取项目信息错误,请检查');
          }
        }
        $timeout(function () {
          hmsPopup.showLoading('获取项目信息中');
          TimeSheetService.fetchProjectDetailInfo(success, $scope.currentDate, project.project_id)
        });
      };

      $scope.showProjectModal = function () {
        $scope.projectModal.show();
      };
      $scope.hideProjectModal = function () {
        $scope.projectModal.hide();
      };

      $scope.showFlybackModal = function () {
        $scope.flybackModal.show();
      };
      $scope.hideFlybackModal = function () {
        $scope.flybackModal.hide();
      };

      $scope.showAddressModal = function () {
        $scope.addressModal.show();
      };
      $scope.hideAddressModal = function () {
        $scope.addressModal.hide();
      };

      var fetchEachDay = function (result) {
        hmsPopup.hideLoading();
        if (result.status == 'S') {
          var projectList = result.project;
          var flybackList = result.flyback;
          var addressList = result.projaddress;

          if (baseConfig.debug) {
            console.log('fetchEachDay result.every_day ' + angular.toJson(result.every_day));
          }

          //判断是否可编辑 // add by ciwei
          if (result.every_day.holiday == 'Y') {
            editable = 'Y';
          } else if (result.every_day.holiday == 'N') {
            editable = 'N';
          }

          if (result.every_day.offbase == '1') {
            $scope.timesheetDetail.travelingAllowance = checkedJson;
          } else {
            $scope.timesheetDetail.travelingAllowance = uncheckedJson;
          }
          if (result.every_day.base == 'Y') {
            $scope.timesheetDetail.normalAllowance = checkedJson;
          } else {
            $scope.timesheetDetail.normalAllowance = uncheckedJson;
          }

          //判断内外部计费是否被选中
          if (result.every_day.internalcharge == '1') {
            $scope.timesheetDetail.intCharge = checkedJson;
          } else {
            $scope.timesheetDetail.intCharge = uncheckedJson;
          }
          if (result.every_day.externalcharge == '1') {
            $scope.timesheetDetail.extCharge = checkedJson;
          } else {
            $scope.timesheetDetail.extCharge = uncheckedJson;
          }

          $scope.timesheetDetail.currentDay = result.every_day.every_day;
          $scope.timesheetDetail.approver = result.every_day.approver;
          $scope.timesheetDetail.description = result.every_day.descrpt;
          $scope.timesheetDetail.allowance = result.every_day.allowance;

          angular.forEach(projectList, function (data) {
            if (data.selected_flag === 'Y') {
              $scope.timesheetDetail.currentProject = data;
              return;
            }
          });
          angular.forEach(addressList, function (data) {
            if (data.selected_flag === 'Y') {
              $scope.timesheetDetail.currentAddress = data;
              return;
            }
          });
          angular.forEach(flybackList, function (data) {
            if (data.fly_select === 'Y') {
              $scope.timesheetDetail.currentFlyback = data;
              return;
            }
          });

          $scope.projectList = projectList;
          $scope.addressList = addressList;
          $scope.flybackList = flybackList;
        }
        else {
          hmsPopup.showPopup('获取timesheet错误,错误原因为');
        }
      };

      $scope.checkBoxChanged = function (item, type) {
        console.log('$scope.checkBoxChanged item ' + angular.toJson(item));
        if (editable == "N" && type == 'charging') {
          return;
        }
        if (item.flag) {
          item.flag = false;
          item.style = unchecked;
        } else {
          item.flag = true;
          item.style = checked;
        }
        if (type == 'travelingAllowance' && $scope.timesheetDetail.travelingAllowance.flag) {
          $scope.timesheetDetail.normalAllowance = {flag: false, style: unchecked};
        }
        if (type == 'normalAllowance' && $scope.timesheetDetail.normalAllowance.flag) {
          $scope.timesheetDetail.travelingAllowance = {flag: false, style: unchecked};
        }
      };

      $scope.submitTimesheet = function (timesheetDetail) {
        if (baseConfig.debug) {
          console.log('timesheetDetail ' + angular.toJson(timesheetDetail));
        }

        var employee = window.localStorage.empno;
        var currentDate = $scope.currentDate;
        var projectId = $scope.timesheetDetail.currentProject.project_id;
        var description = '';
        var offBaseFlag = '';
        var baseFlag = '';
        var extCharge = '';
        var intCharge = '';
        var addressId = $scope.timesheetDetail.currentAddress.address_id;
        var flybackId = $scope.timesheetDetail.currentFlyback.fly_id;

        //内外部计费
        if ($scope.timesheetDetail.extCharge.flag) {
          extCharge = 1;
        } else {
          extCharge = 0;
        }
        if ($scope.timesheetDetail.intCharge.flag) {
          intCharge = 1;
        } else {
          intCharge = 0;
        }
        if ($scope.timesheetDetail.travelingAllowance.flag) {
          offBaseFlag = 1;
        } else {
          offBaseFlag = 0;
        }
        if ($scope.timesheetDetail.normalAllowance.flag) {
          baseFlag = 1;
        } else {
          baseFlag = 0;
        }

        description = $scope.timesheetDetail.description.replace(/[\n]/g, "\\n").replace(/[\r]/g, "\\r");

        var params = {
          "params": {
            "p_employee": employee + "",
            "p_date": currentDate + "",
            "p_project": projectId + "",
            "p_description": description + "",
            "p_offbase_flag": offBaseFlag + "",
            "p_base_flag": baseFlag + "",
            "p_ext_charge": extCharge + "",
            "p_int_charge": intCharge + "",
            "p_address": addressId + "",
            "p_flyback": flybackId + ""
          }
        };

        if (baseConfig.debug) {
          console.log('submitTimesheet.params ' + angular.toJson(params));
        }

        var success = function (result) {
          hmsPopup.hideLoading();
          if (result.status == 'S') {
            hmsPopup.showPopup('提交Timesheet成功');
            $rootScope.$broadcast('refreshTimesheet', 'parent');
            $ionicHistory.goBack();
          } else {
            hmsPopup.showPopup('提交Timesheet错误,错误原因为');
          }
        }
        hmsPopup.showLoading('提交数据中');
        TimeSheetService.submitTimesheet(success, params)
      };

      //从服务器获取请求
      $timeout(
        function () {
          hmsPopup.showLoading('获取timesheet明细数据');
          TimeSheetService.fetchEachDay(fetchEachDay, $scope.currentDate);
        }
      );
    }
  ])
;

/**
 * Created by wolf on 2016/5/19.
 * @author: wen.dai@hand-china.com
 *
 */
'use strict';
//应用-timeSheet审批模块-列表
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.tsApproveList', {
          url: 'application/tsApproveList',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/timesheet-approve/list/ts-approve-list.html',
              controller: 'tsApproveListCtrl'
            }
          }
        });
    }]);
angular.module('tsApproveModule')
  .controller('tsApproveListCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicModal',
    '$ionicScrollDelegate',
    '$ionicPopup',
    '$timeout',
    'TsApproveListService',
    'hmsPopup',
    'hmsHttp',
    'ApproveDetailService',
    '$ionicPopover',
    '$cordovaDatePicker',
    function ($scope,
              $state,
              baseConfig,
              $ionicModal,
              $ionicScrollDelegate,
              $ionicPopup,
              $timeout,
              TsApproveListService,
              hmsPopup,
              hmsHttp,
              ApproveDetailService,
              $ionicPopover,
              $cordovaDatePicker) {
      /**
       * initial var section
       */
      {
        if (ionic.Platform.isIOS()) {
          angular.element('.custom-head').css('paddingTop', '10px');
          angular.element('.ts-list-bg').css('paddingTop', '110px');
        }
        $scope.showProjectName = true; //默认显示项目名称
        $scope.showRocket = false; //默认不显示小火箭image
        $scope.showConnectBlock = false; //默认不显示连接块
        $scope.showDetailArrow = true; //默认显示向右的箭头--go list detail
        $scope.showLsLoading = false; //loading默认不显示
        var clickSelectAll = false; //默认没有点击全选
        $scope.endApproveDate = "";
        $scope.actionName = "操作";
        $scope.selectArray = [];
        $scope.isClickedProject = []; //控制点击选择筛选条目的样式(modal-filter)
        $scope.selectEndItem = [false, true, false]; //控制点击选择截止日期条目的样式(modal-date)
        $scope.listInfoArray = {};
        $scope.personList = [];
        $scope.projectList = [];
        $scope.endDateList = [{//记录常用的三个截止日期
          dateValue: getMonthDay(getLastMonthDate(new Date())).replace(/\b(0+)/gi, ""),
          dateCode: getLastMonthDate(new Date())
        }, {
          dateValue: getMonthDay(getCurrentDate(new Date())).replace(/\b(0+)/gi, ""),
          dateCode: getCurrentDate(new Date())
        }, {
          dateValue: getMonthDay(getCurrentMonthLastDate(new Date())).replace(/\b(0+)/gi, ""),
          dateCode: getCurrentMonthLastDate(new Date())
        }];
        var position = ""; //记录滚动条的位置
        var selectItem = []; //初始化点击全部条目为false
        var tsLsUrl = baseConfig.businessPath + "/api_timesheet/get_timesheet_list";
        var tsProjectPersonListUrl = baseConfig.businessPath + "/api_timesheet/get_project_person_list";
        var tsActionUrl = baseConfig.businessPath + "/api_timesheet/timesheet_approve";
        var tsListParams = { //获取列表的参数
          "params": {
            "p_employee_number": window.localStorage.empno, //参考angularjs的localStorange--
            "p_start_date": "",
            "p_end_date": "",
            "p_project_name": "",
            "p_project_id": "",
            "p_project_person_number": "",
            "p_page": 1,
            "p_page_size": 6
          }
        };
        var tsActionParams = { //审批拒绝/通过的参数
          "params": {
            "p_approve_flag": "AGREE",
            "p_employee_number": window.localStorage.empno,
            "p_param_json": ''
          }
        };
        var approveList = { //审批拒绝/通过的子对象
          "approve_list": []
        };
        var currentDay = new Date().getDate();
        if (currentDay <= 10) {
          tsListParams.params.p_end_date = getLastMonthDate(new Date());
          $scope.endApproveDate = getMonthDay(getLastMonthDate(new Date())).replace(/\b(0+)/gi, "");
        } else if (currentDay > 10 && currentDay <= 20) {
          tsListParams.params.p_end_date = getCurrentDate(new Date());
          $scope.endApproveDate = getMonthDay(getCurrentDate(new Date())).replace(/\b(0+)/gi, "");
        } else if (currentDay > 20) {
          tsListParams.params.p_end_date = getCurrentMonthLastDate(new Date());
          $scope.endApproveDate = getMonthDay(getCurrentMonthLastDate(new Date())).replace(/\b(0+)/gi, "");
        }
      }

      /**
       * 立即执行 拉取数据的代码
       */
      function initData() {
        $scope.showLsLoading = true;
        hmsHttp.post(tsProjectPersonListUrl, tsListParams).success(function (response) {
          if (hmsHttp.isSuccessfull(response.status)) {
            $scope.personList = unique_better(response.project_person_list, 'employee_number');
            $scope.projectList = unique_better(response.project_list, 'project_id');
          }
        }).error(function (e) {
        });
        $scope.listInfoArray = new TsApproveListService($scope, tsLsUrl, tsListParams, $scope.showLsLoading);
      };
      initData();

      $scope.$on('$ionicView.enter', function (e) {
        if (ApproveDetailService.getRefreshFlag() === 'refresh-approve-list') {
          $scope.tsListRefresh();
        }
      });

      $scope.$on('$destroy', function (e) {
        log('tsApproveListCtrl.$destroy');
      });

      function __initSelectArray(selectParam) { //初始化选择按钮
        //先初始化数据操作--
        $scope.selectArray = [];
        selectItem = [];
        angular.forEach($scope.listInfoArray.listArray, function (data, index) {
          if ('undoSelectAll' == selectParam) {
            $scope.selectArray.push(false);
            selectItem.push(false);
          } else if ('selectedAll' == selectParam) {
            $scope.selectArray.push(true);
            selectItem.push(true);
          }
        });
      };
      __initSelectArray('undoSelectAll');

      $scope.doSelectAction = function () { //header 右上角显示操作按钮
        if ($scope.actionName == "操作") {
          $scope.actionName = "取消";
          $scope.showDetailArrow = false;
          angular.element('.ts-approve-list-item').css("paddingLeft", "10%");
        } else if ($scope.actionName == "取消") {
          $scope.actionName = "操作";
          $scope.showDetailArrow = true;
          angular.element('.ts-approve-list-item').css("paddingLeft", "10px");
          tsActionParams = { //审批拒绝/通过的参数
            "params": {
              "p_approve_flag": "AGREE",
              "p_employee_number": window.localStorage.empno,
              "p_param_json": ''
            }
          };
          approveList = {
            "approve_list": []
          };
          __initSelectArray('undoSelectAll');
        }
      };

      $ionicModal.fromTemplateUrl('build/pages/application/timesheet-approve/modal/ts-date-modal.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.dateModal = modal;
      });

      $ionicPopover.fromTemplateUrl("endDate.html", {
        scope: $scope
      }).then(function (popover) {
        $scope.endDatePopover = popover;
      });

      $scope.selectEndDate = function ($event) { //显示截止日期列表界面
        tsListParams.params.p_end_date = $scope.endApproveDate;
        if (ionic.Platform.isIOS()) {
          $scope.endDatePopover.show($event);
          angular.element('#popover-date2').css('borderBottom', '0px');
        } else {
          $scope.dateModal.show();
        }
      };


      $scope.chooseStartDate = function () {//选择开始日期
        var myDate = $scope.startDate = new Date();
        var previousDate = new Date(myDate.year, myDate.month - 1, myDate.day);
        var options = {
          date: previousDate,
          mode: 'date',
          titleText: '请选择截止日期',
          okText: '确定',
          cancelText: '取消',
          doneButtonLabel: '确认',
          cancelButtonLabel: '取消',
          androidTheme: window.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
          locale: "zh_cn"
        }
        $cordovaDatePicker.show(options).then(function (date) {
          var month = date.getMonth() + 1;
          var day = date.getDate();
          var weekday = date.getDay();
          if (weekday == 0) {
            $scope.startDate.weekday = "周日";
          } else if (weekday == 1) {
            $scope.startDate.weekday = "周一";
          } else if (weekday == 2) {
            $scope.startDate.weekday = "周二";
          } else if (weekday == 3) {
            $scope.startDate.weekday = "周三";
          } else if (weekday == 4) {
            $scope.startDate.weekday = "周四";
          } else if (weekday == 5) {
            $scope.startDate.weekday = "周五";
          } else if (weekday == 6) {
            $scope.startDate.weekday = "周六";
          }
          if (month < 10) {
            month = "0" + month;
          }
          if (day < 10) {
            day = "0" + day;
          }
          $scope.startDate.year = date.getFullYear();
          $scope.startDate.month = month;
          $scope.startDate.day = day;
          $scope.$apply();
        });
      };
      $scope.selectEndDateItem = function (newEndDateCode, newEndDateValue, newIndex) { //选择不同的截止日期
        $scope.selectEndItem = [];
        $scope.selectEndItem[newIndex] = true;
        $scope.endApproveDate = newEndDateValue;
        tsListParams.params.p_page = 1;
        tsListParams.params.p_end_date = newEndDateCode;
        $scope.listInfoArray = new TsApproveListService($scope, tsLsUrl, tsListParams, $scope.showLsLoading);
        if (ionic.Platform.isIOS()) {
          $scope.endDatePopover.hide();
        } else {
          $scope.dateModal.hide();
        }
      };

      $scope.cancelDateModal = function () { //取消date modal
        tsListParams.params.p_end_date = $scope.endApproveDate;
        $scope.dateModal.hide()
      };

      $scope.onDrag = function () { //拖拽
        $scope.showConnectBlock = false;
      };

      $scope.onDragUp = function () { //向上拖拽
        $scope.showConnectBlock = true; //显示连接块
      };

      $scope.watchScroll = function () { //滚动内容时执行的method
        position = $ionicScrollDelegate.getScrollPosition().top;
        $scope.$apply(function () {
          if (position < 0) {
            $scope.showConnectBlock = false;
          } else if (position >= 0 && position < 400) { //在顶部时显示连接块
            $scope.showRocket = false;
            $scope.showConnectBlock = true;
          } else if (position >= 400) {
            $scope.showRocket = true;
          } else {
          }
        });
      };

      $scope.tsListRefresh = function () { //下拉刷新
        tsListParams.params.p_page = 1;
        $scope.listInfoArray = new TsApproveListService($scope, tsLsUrl, tsListParams, $scope.showLsLoading);
      };

      $scope.getAttentionInfo = function (e, newWarnList) {
        if (!$scope.showDetailArrow) {
          return;
        }
        e.stopPropagation(); //阻止事件冒泡
        warn(newWarnList);
        $ionicPopup.show({
          template: '<div class="warn-attention-icon">' + newWarnList[0].description + '</div>',
          scope: $scope,
          buttons: [
            {
              text: '<div class="warn-cancel-icon"></div>',
              type: 'button-clear',
              onTap: function (e) {
              }
            }
          ]
        });
      };

      $scope.goTsLsTop = function () { //返回列表顶部
        angular.element('#rocket').addClass('ng-hide');
        $ionicScrollDelegate.scrollTop(true);
      };

      $ionicModal.fromTemplateUrl('build/pages/application/timesheet-approve/modal/ts-filter-modal.html', { //筛选modal
        scope: $scope
      }).then(function (modal) {
        $scope.tsFilterModal = modal;
      });

      $scope.filterTsInfo = function () { //响应筛选按钮的方法
        tsListParams.params.p_project_id = "";
        tsListParams.params.p_project_person_number = "";
        $scope.tsFilterModal.show();
      };

      $scope.goApproveDetail = function (index, newEmployeeNumber, newProjectId, newStartDate, newEndDate) {
        if ($scope.showDetailArrow) {
          $state.go('tab.tsApproveDetail', {
              'employeeNumber': newEmployeeNumber,
              'projectId': newProjectId,
              'startDate': newStartDate,
              'endDate': newEndDate
            }
          );
        } else {
          selectItem[index] = !selectItem[index];
          var approve = {
            "p_project_id": "",
            "p_project_person_number": "",
            "p_start_date": "",
            "p_end_date": "",
            "p_record_id": ""
          };
          if (selectItem[index]) {
            $scope.selectArray[index] = true;
            approve.p_project_id = newProjectId;
            approve.p_project_person_number = newEmployeeNumber;
            approve.p_start_date = newStartDate;
            approve.p_end_date = newEndDate;
            approveList.approve_list[index] = approve;
          } else {
            approveList.approve_list.splice(index, 1, 'delete');
            $scope.selectArray[index] = false;
          }
        }
      };

      $scope.selectAllList = function () { //全选
        clickSelectAll = !clickSelectAll;
        if (clickSelectAll) {
          for (var i = 0; i < $scope.listInfoArray.listArray.length; i++) {
            var approve = {
              "p_project_id": "",
              "p_project_person_number": "",
              "p_start_date": "",
              "p_end_date": "",
              "p_record_id": ""
            };
            approve.p_project_id = $scope.listInfoArray.listArray[i].project_id;
            approve.p_project_person_number = $scope.listInfoArray.listArray[i].employee_number;
            approve.p_start_date = $scope.listInfoArray.listArray[i].start_date;
            approve.p_end_date = $scope.listInfoArray.listArray[i].end_date;
            approveList.approve_list.push(approve);
          }
          __initSelectArray('selectedAll');
        } else {
          approveList.approve_list = [];
          __initSelectArray('undoSelectAll');
        }
      };

      function deleteSuperfluous() {
        for (var i = 0; i < approveList.approve_list.length; i++) {
          if (approveList.approve_list[i] === 'delete') {
            approveList.approve_list.splice(i, 1);
            i--;
          } else if (!approveList.approve_list[i] || approveList.approve_list[i] == "" || typeof(approveList.approve_list[i]) == "undefined") {
            approveList.approve_list.splice(i, 1);
            i--;
          }
        }
      };
      $scope.passThroughListItem = function () { //通过
        if (approveList.approve_list.length === 0) {
          hmsPopup.showShortCenterToast('请先选择操作项！');
          return;
        }
        deleteSuperfluous();
        tsActionParams.params.p_approve_flag = "AGREE";
        tsActionParams.params.p_param_json = JSON.stringify(approveList);
        hmsPopup.showLoading("审批中...");
        hmsHttp.post(tsActionUrl, tsActionParams).success(function (response) {
          hmsPopup.hideLoading();
          if (hmsHttp.isSuccessfull(response.status)) {
            hmsPopup.showShortCenterToast('审批成功！');
          } else {
            hmsPopup.showShortCenterToast('审批失败！');
          }
          $scope.doSelectAction();
          $timeout(function () {
            $scope.tsListRefresh();
          }, 1000);
        }).error(function (e) {
          hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast('审批失败！请检查网络稍后重试');
          $scope.doSelectAction();
          $timeout(function () {
            $scope.tsListRefresh();
          }, 1000);
        });
      };

      $scope.refuseListItem = function () { //拒绝
        if (approveList.approve_list.length === 0) {
          hmsPopup.showShortCenterToast('请先选择操作项！');
          return;
        }
        deleteSuperfluous();
        tsActionParams.params.p_approve_flag = "REFUSE";
        tsActionParams.params.p_param_json = JSON.stringify(approveList);
        hmsPopup.showLoading("审批中...");
        hmsHttp.post(tsActionUrl, tsActionParams).success(function (response) {
          hmsPopup.hideLoading();
          if (hmsHttp.isSuccessfull(response.status)) {
            hmsPopup.showShortCenterToast('拒绝成功！');
          } else {
            hmsPopup.showShortCenterToast('拒绝失败！');
          }
          $scope.doSelectAction();
          $timeout(function () {
            $scope.tsListRefresh();
          }, 1000);
        }).error(function (e) {
          hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast('拒绝失败！请检查网络稍后重试');
          $scope.doSelectAction();
          $timeout(function () {
            $scope.tsListRefresh();
          }, 1000);
        });
      };

      /**
       *  筛选modal方法区--
       */
      $scope.selectScreening = function (selectParam) {
        if (selectParam == 'projectName') {
          $scope.showProjectName = true;
          angular.element('#project-name').css({'backgroundColor': 'white', 'color': '#4A4A4A'});
          angular.element('#person-select').css({'backgroundColor': '#fafafa', 'color': '#9b9b9b'});
        } else if (selectParam == 'personSelect') {
          $scope.showProjectName = false;
          angular.element('#person-select').css({'backgroundColor': 'white', 'color': '#4A4A4A'});
          angular.element('#project-name').css({'backgroundColor': '#fafafa', 'color': '#9b9b9b'});
        }
      };

      $scope.selectFilterItem = function (newName, index, newId) { //点击modal单个条目时的响应方法
        if (newName === 'projectName') {
          $scope.isClickedProject = [];
          $scope.isClickedProject[index] = true;
          tsListParams.params.p_project_id = newId;
        } else if (newName === 'personSelect') {
          $scope.isClickedPerson = [];
          $scope.isClickedPerson[index] = true;
          tsListParams.params.p_project_person_number = newId;
        }
      };

      function __initModal() { //初始化modal的样式
        $scope.tsFilterModal.hide();
        $scope.showProjectName = true;
        $scope.isClickedProject = [];
        $scope.isClickedPerson = [];
        angular.element('#project-name').addClass('active-select');
        angular.element('#project-name').removeClass('active-off');
        angular.element('#person-select').removeClass('active-select');
      };

      $scope.cancelFilter = function () { //取消按钮
        tsListParams.params.p_project_id = "";
        tsListParams.params.p_project_person_number = "";
        __initModal();
      };

      $scope.confirmFilter = function () { //确定按钮
        __initModal();
        tsListParams.params.p_page = 1;
        $scope.showLsLoading = true;
        $scope.listInfoArray = new TsApproveListService($scope, tsLsUrl, tsListParams, $scope.showLsLoading);
      };

      $scope.clearFilterParams = function () { //响应清空筛选的点击
        $scope.isClickedProject = [];
        $scope.isClickedPerson = [];
        tsListParams.params.p_project_id = "";
        tsListParams.params.p_project_person_number = "";
      };
    }])
    /**
     * @params:
     *  1:scope  //controller的作用域
     *  2:url //请求地址
     *  3:params //请求的参数
     *  4: refurbishParam //控制下拉刷线的参数
     *  5:busy //用于控制下拉刷新的flag
     *  6:totalNumber //获取的数据总数
     *  7:listArray //数据列表
     *  8:loading //数据加载标记
     */
  .service('TsApproveListService', ['hmsHttp', 'baseConfig', 'hmsPopup',
    function (hmsHttp, baseConfig, hmsPopup) {
      var TsApproveListService = function (scope, requestUrl, requestSearchParams, loadingFlag, refurbishParam) {
        var _self = this;
        _self.scope = scope;
        _self.url = requestUrl;
        _self.params = {};
        _self.params = requestSearchParams;
        _self.refurbishParam = refurbishParam;
        _self.busy = false;
        _self.totalNumber = 0;
        _self.listArray = [];
        _self.loading = loadingFlag;
        if (_self.refurbishParam === 'clickRefreshEvent') {
          _self.scope.$broadcast('scroll.infiniteScrollComplete');
        }

        hmsHttp.post(_self.url, _self.params).success(function (response) {
          _self.loading = false;
          try {
            if (hmsHttp.isSuccessfull(response.status)) {
              var tsResult = response.timesheet_approve_response;
              if (baseConfig.debug) {
                warn('hi,create a new factory!!' + '\n' + jsonFormat());
              }
              _self.totalNumber = response.count;
              try {
                _self.listArray = _self.listArray.concat(tsResult.result_list);
              } catch (e) {
                _self.listArray = [];
                _self.projectList = [];
                _self.employeeList = [];
              }
              if (response.count == 0) {
                _self.busy = false;
                _self.listArray = [];
              } else if (response.count <= 6) {
                _self.busy = false;
              } else {
                _self.busy = true;
              }
              _self.scope.$broadcast('scroll.refreshComplete');
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              _self.busy = false;
              if (response.status === 'E' || response.status == 'e') {
                hmsPopup.showShortCenterToast("没有相关数据!");
              } else {
                hmsPopup.showShortCenterToast("网络异常,请稍后重试!");
              }
              _self.scope.$broadcast('scroll.refreshComplete');
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
            }
          } catch (e) {
          }

        }.bind(_self)).error(function (error) {
          _self.loading = false;
          _self.params.params.p_page = 1;
          _self.busy = false;
          _self.scope.$broadcast('scroll.refreshComplete');
          _self.scope.$broadcast('scroll.infiniteScrollComplete');
          hmsPopup.showShortCenterToast("服务请求异常,请检查网络连接和输入参数后重新操作!");
        }.bind(_self));
      };
      TsApproveListService.prototype.nextPage = function () {
        var _self = this;
        if (baseConfig.debug) {
          warn('enter next page!');
        }
        if (!_self.busy) {
          return;
        }
        if (_self.busy) {
          if (_self.refurbishParam === 'clickRefreshEvent') {
            _self.refurbishParam = '';
            _self.scope.$broadcast('scroll.infiniteScrollComplete');
            return;
          }
        }
        _self.busy = true;
        _self.params.params.p_page++;
        hmsHttp.post(_self.url, _self.params).success(function (response) {
          try {
            if (hmsHttp.isSuccessfull(response.status)) {
              if (angular.isUndefined(response.timesheet_approve_response.result_list)) {
                _self.busy = false;
                hmsPopup.showShortCenterToast("数据已经加载完毕!");
              } else {
                var tsResult = response.timesheet_approve_response;
                _self.listArray = _self.listArray.concat(tsResult.result_list);
              }
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
            } else {
              if (response.status === 'E') {
                _self.params.params.p_page--;
                hmsPopup.showShortCenterToast("数据请求错误,请检查传入参数重新操作!");
              }
              _self.scope.$broadcast('scroll.infiniteScrollComplete');
            }
          } catch (e) {
            _self.params.params.p_page--;
            _self.scope.$broadcast('scroll.infiniteScrollComplete');
          }
        }.bind(_self)).error(function (error) {
          _self.params.params.p_page--;
          _self.scope.$broadcast('scroll.infiniteScrollComplete');
          hmsPopup.showShortCenterToast("网络异常,请稍后重试!");
        }.bind(_self));
      };
      return TsApproveListService;
    }]);
>>>>>>> xbr
