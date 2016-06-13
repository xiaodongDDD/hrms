angular.module("baseConfig", [])
.constant("baseConfig", {"debug":true,"isMobilePlatform":false,"clearTable":true,"nativeScreenFlag":false,"basePath":"http://wechat.hand-china.com/hmbms_hand/api","businessPath":"http://wechat.hand-china.com/hmbms_hand/api/dataEngine","currentVersion":"2.0.0","url":"","pkgIdentifier":"","versionName":"此版本为dev测试环境 2.0.0","appEnvironment":"UAT"});

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
      //name: "@",        // name 值传递(字符串，单向绑定)
      //amount: "=",      // amount 引用传递(双向绑定)
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
      actionName: "@",        // actionName 值传递(字符串，单向绑定)
      customTitle: "@",
      //amount: "=",      // amount 引用传递(双向绑定)
      goBackPage: "&", // 返回
      doAction: "&"   //
    },
    template: '<div class="custom-head">' +
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
          $log.debug(postName + " response " + angular.toJson(response));
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
        if (!ROOTCONFIG.isMobilePlatform) {
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


    }]);

/**
 * Created by gusenlin on 16/4/24.
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

      //个人办公
      $scope.officeApp = [
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
        },
        {
          appName: "假期管理",
          imageUrl: "build/img/application/holidayManage@3x.png",
          destUrl: "tab.time-off-manage",
        },
        {
          appName: "住宿申请",
          imageUrl: "build/img/application/dorm-apply/dorm-apply.png",
          destUrl: "tab.dorm-apply"
        },{
          appName: "Timesheet填写",
          imageUrl: "build/img/application/timesheet@3x.png",
          destUrl: "tab.timesheet",
        },
        {
          appName: "Timesheet审批",
          imageUrl: "build/img/application/timesheetExamine@3x.png",
          destUrl: "tab.tsApproveList",
        }
      ];

      //项目门户
      $scope.projectApp = [
        {
          appName: "机票预定",
          imageUrl: "build/img/application/flightBooking@3x.png",
          destUrl: "",
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
        },
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
        }
      ];

      //员工社区
      $scope.employeeApp = [
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
        }
      ];

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
angular.module('loginModule')

  .controller('loginCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicLoading',
    '$http',
    '$timeout',
    '$ionicHistory',
    'hmsPopup',
    function ($scope,
              $state,
              baseConfig,
              $ionicLoading,
              $http,
              $timeout,
              $ionicHistory,
              hmsPopup) {

      $scope.loginData = {};
      $scope.currentVersionNum = baseConfig.versionName;

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
angular.module('myInfoModule')

  .controller('myInfoCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    function ($scope,
              $state,
              baseConfig) {

      if(baseConfig.debug){
        console.log('myInfoCtrl.enter');
      }

      $scope.logout = function(){
        window.localStorage.token = "";
        window.localStorage.password = "";
        $state.go('login');
      }

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
        $scope.$apply();
      }
    });
  }]);

/**
 * Created by LeonChan on 2016/5/31.
 */
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
          }
        })
    }]);
angular.module('applicationModule')
  .controller('DormApplyDetailFirstCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'dormApplyTypeService',
    'hmsHttp',
    'hmsPopup',
    '$rootScope',
    '$timeout',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              dormApplyTypeService,
              hmsHttp,
              hmsPopup,
              $rootScope,
              $timeout) {
      $scope.applyInfo=dormApplyTypeService.getInfo();
      $scope.approving=false;//审批中状态标志位
      $scope.rejected=false;//已拒绝状态标识位
      $scope.approvedResult="";
      if($scope.applyInfo.status == "审批中"){
        $scope.approving=true;
        $scope.rejected=false;
        $scope.approvedResult="";
      }else if($scope.applyInfo.status == "已拒绝"){
        $scope.approving=false;
        $scope.rejected=true;
        $scope.approvedResult="已拒绝";
      }
      $scope.goBack=function(){//返回上一界面
        $ionicHistory.goBack();
      };
      $scope.cancelApply=function(){//取消申请
        var url=baseConfig.businessPath+"/wfl_apply_room/cancel_application";
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
          }
        })
    }]);
angular.module('applicationModule')
  .controller('DormApplyDetailSecondCtrl', [
    '$scope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'dormApplyTypeService',
    'hmsHttp',
    'hmsPopup',
    '$rootScope',
    '$timeout',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              dormApplyTypeService,
              hmsHttp,
              hmsPopup,
              $rootScope,
              $timeout) {
      $scope.applyInfo = dormApplyTypeService.getInfo();
      $scope.checkIn = false;//审批中状态标志位
      $scope.checkOut = false;//已拒绝状态标识位
      $scope.buttonText = ""//按钮上显示的文字
      if ($scope.applyInfo.status == "已入住") {//已入住
        $scope.checkIn = true;
        $scope.checkOut = false;
        $scope.buttonText = "续住";
      } else if ($scope.applyInfo.status == "已退房") {//已退房
        $scope.checkIn = false;
        $scope.checkOut = true;
        $scope.buttonText = "再次预定";
      }
      $scope.goBack = function () {//返回上一界面
        $ionicHistory.goBack();
      };

      $scope.renewContract=function(){//续住
        var url=baseConfig.businessPath+"/wfl_apply_room/overstay_apply_room";
        var param={
          "params": {
            p_employee_number:window.localStorage.empno,
            p_checkin_date:"20160815",
            p_checkout_date:"20160920",
            p_room_number:$scope.applyInfo.roomNumber,
            p_bed_number:$scope.applyInfo.bedNumber,
            p_apply_type:$scope.applyInfo.applyType,
            p_reason:""
          }
        };
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

/**
 * Created by LeonChan on 2016/6/3.
 */
angular.module('applicationModule')
.factory('dormApplyTypeService',function(){//查看历史宿舍申请的时候，从住宿申请向住宿详情发送申请类型的数据
  var info='';
  return{
    getInfo:function(){
      return info;
    },
    putInfo:function(param){
      info=param;
    }
  }
})
.factory('dormApplySearchResultService',function(){//空闲可申请房间查询结果放入service中
    var info='';
    return{
      getInfo:function(){
        return info;
      },
      putInfo:function(param){
        info=param;
      }
    }
})

/**
 * Created by LeonChan on 2016/6/7.
 */
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
    'dormApplySearchResultService',
    'hmsHttp',
    'hmsPopup',
    '$timeout',
    function ($scope,
              $rootScope,
              $state,
              baseConfig,
              $ionicHistory,
              dormApplySearchResultService,
              hmsHttp,
              hmsPopup,
              $timeout) {

     var resultInfo=dormApplySearchResultService.getInfo();//从service中拿到查询界面得到的查询结果
     $scope.roomlist=resultInfo.result;
     $scope.goBack=function(){//返回上一界面
       $ionicHistory.goBack();
     };
     $scope.applyRoom=function(num){
       var url=baseConfig.businessPath+"/wfl_apply_room/apply_room";
       var param={
         "params": {
           p_employee_number:window.localStorage.empno,
           p_checkin_date:resultInfo.checkinDate,
           p_checkout_date:resultInfo.checkoutDate,
           p_room_number:$scope.roomlist[num].room_number,
           p_bed_number:$scope.roomlist[num].bed_number,
           p_apply_type:resultInfo.applyType,
           p_reason:""
         }
       };
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
    }])

/**
 * Created by LeonChan on 2016/5/27.
 */
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
    'dormApplyTypeService',
    'hmsHttp',
    'hmsPopup',
    '$ionicScrollDelegate',
    '$timeout',
    function ($scope,
              $rootScope,
              $state,
              baseConfig,
              $ionicHistory,
              dormApplyTypeService,
              hmsHttp,
              hmsPopup,
              $ionicScrollDelegate,
              $timeout) {
      $scope.descriptionAppearance = false;
      $scope.items=[];//历史列表中的数据
      searchHistoryApplyListAutomatically();//自动获取历史申请数据
      function searchHistoryApplyListAutomatically() {
        $scope.items=[];
        var url = baseConfig.businessPath + "/wfl_apply_room/query_room_history_list";
        var param = {
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
          var i = 0;
          for (i; i < $scope.items.length; i++) {//处理显示某种小戳图片
            if ($scope.items[i].apply_status == "已入住") {
              $scope.items[i].modeCheckIn = true;
              $scope.items[i].modeCheckOut = false;
              $scope.items[i].modeApproving = false;
              $scope.items[i].modeRejected = false;
            } else if ($scope.items[i].apply_status == "已退房") {
              $scope.items[i].modeCheckIn = false;
              $scope.items[i].modeCheckOut = true;
              $scope.items[i].modeApproving = false;
              $scope.items[i].modeRejected = false;
            } else if ($scope.items[i].apply_status == "审批中") {
              $scope.items[i].modeCheckIn = false;
              $scope.items[i].modeCheckOut = false;
              $scope.items[i].modeApproving = true;
              $scope.items[i].modeRejected = false;
            } else if ($scope.items[i].apply_status == "已拒绝") {
              $scope.items[i].modeCheckIn = false;
              $scope.items[i].modeCheckOut = false;
              $scope.items[i].modeApproving = false;
              $scope.items[i].modeRejected = true;
            }
          }
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
          applyId:info.apply_id//申请id
        };
        dormApplyTypeService.putInfo(param);//将申请状态存储在service中
        if (param.status == "已入住" || param.status == "已退房") {
          $state.go("tab.dorm-apply-detail-b");
        } else if (param.status == "审批中" || param.status == "已拒绝") {
          $state.go("tab.dorm-apply-detail-a");
        }
      };

      $scope.judgeApplyType = function (param) {//通过判断申请类型是否显示剩余天数字段
        var internalParam = param.apply_status;
        if (internalParam == "已入住" || internalParam == "已退房") {
          return true;
        } else if (internalParam == "审批中" || internalParam == "已拒绝") {
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
 * Created by LeonChan on 2016/5/30.
 */
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
    'dormApplySearchResultService',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              $ionicModal,
              hmsHttp,
              hmsPopup,
              dormApplySearchResultService) {
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
      $scope.defaultApplyType="常驻申请";//默认申请类型
      $scope.defaultRoomType="单人间";//默认房间类型
      $scope.defaultProjectInfo={
        projectName:"",//项目名称
        projectId:""//项目ID
      };//默认项目名称
      $scope.showProjectItem=false;//显示选择项目的入口
      $scope.applytype=["常驻申请","加班申请","临时申请","项目申请"];//项目申请选项
      $scope.roomtype=["单人间","四人间"];//房间申请
      $scope.projectlist=[];//项目列表
      $scope.showNumButton=true;//显示数字按钮，隐藏图片按钮
      $scope.inputinfo={
        floornum:"",//输入楼层号
        roomnum:""//输入房间号
      }
      var url=baseConfig.businessPath+"/wfl_apply_room/query_project_list";
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
            $scope.defaultProjectInfo.projectName="无";
            $scope.defaultProjectInfo.projectId="";
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
      $scope.goBack=function(){//返回按钮
        $ionicHistory.goBack();
      };

      $scope.chooseApplyType=function(){//显示申请类型modal
        $scope.chooseTypePopup.show();
      };

      $scope.chooseRoomType=function(){//显示房间类型modal
        $scope.chooseRoomPopup.show();
      };

      $scope.chooseProjectName=function(){//显示项目名称列表modal
        if($scope.projectlist.length==0){
          hmsPopup.showShortCenterToast("项目列表为空，请更改申请类型");//项目列表为空时
        }else if($scope.projectlist.length>0){
          $scope.chooseProjectPopup.show();
        }
      };

      $scope.finishChoosingApplyType=function(param){//选择完成申请类型
        $scope.defaultApplyType=param;
        if($scope.defaultApplyType=="项目申请"){
          $scope.showProjectItem=true;
        }else if($scope.defaultApplyType!="项目申请"){
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
        if($scope.defaultApplyType=="常驻申请"){
          $scope.showNumButton=!$scope.showNumButton;
        }
      };

      $scope.searchVacantRoom=function(){//查询空闲房间
        if($scope.defaultProjectInfo.projectName=="无" && $scope.defaultApplyType=="项目申请"){//项目申请类型，当项目列表为空时，不能查询房间
          hmsPopup.showShortCenterToast("项目列表为空，请更改申请类型");
        }else{
          var url = baseConfig.businessPath + "/wfl_apply_room/query_free_room_list";
          var param = {
            "params": {
              p_employee_number: window.localStorage.empno,
              p_check_in_date: "20160615",
              p_check_out_date: "20160820",
              p_apply_type: $scope.defaultApplyType,
              p_room_type: $scope.defaultRoomType,
              p_room_number: $scope.inputinfo.roomnum,
              p_floor_number: $scope.inputinfo.floornum,
              p_project_id:""
            }
          };
          if($scope.defaultApplyType=="项目申请"){
           param.params.p_project_id=$scope.defaultProjectInfo.projectId;
          }
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
              dormApplySearchResultService.putInfo(info);//查询结果放入service中
              $state.go("tab.dorm-apply-vacant-room");
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

/**
 * Created by shishun on 16/5/22.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.time-off-manage', {
          url: '/time-off-manage',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/time-off-manage/timeOffManageList.html',
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
    '$ionicHistory',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory) {}]);

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

      var workflowIcon = 'build/img/application/profile@3x.png';
      var workflowType = '工作流类型';
      var workflowNode = '当前节点';
      var workflowPerson = '提交人';

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
              submitPerson: data.employee_name
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
        WorkFLowListService.getTodoList(success, error);
      };

      getTodoList(false);

      $ionicModal.fromTemplateUrl('build/pages/application/timesheet-approve/modal/ts-filter-modal.html', { //筛选modal
        scope: $scope
      }).then(function (modal) {
        $scope.tsFilterModal = modal;
      });

      $scope.filterTsInfo = function () { //响应筛选按钮的方法
        $scope.tsFilterModal.show();
      };

      $scope.refresh = function () {
        $scope.list = [];
        $scope.$apply();
        $timeout(function () {
          getTodoList(true);
        },300);
      }
    }])

  .service('WorkFLowListService', ['hmsHttp',
    'baseConfig',
    'hmsPopup',
    function (hmsHttp,
              baseConfig,
              hmsPopup) {

      this.getTodoList = function (success, error) {
        var url = baseConfig.businessPath + "/wfl_wx_workflow_appr/get_instance_list";
        var params = {'params': {'p_employee_code': window.localStorage.empno, 'p_flag': 'N'}};
        hmsHttp.post(url, params).success(function (result) {
          success(result)
        }).error(function (response, status) {
          hmsPopup.showPopup('获取代办事项出错,可能是网络问题!');
          error(response);
        });
      }
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
    '$state',
    'baseConfig',
    '$ionicHistory',
    '$timeout',
    '$ionicScrollDelegate',
    'TimeSheetService',
    'hmsHttp',
    function ($scope,
              $state,
              baseConfig,
              $ionicHistory,
              $timeout,
              $ionicScrollDelegate,
              TimeSheetService,
              hmsHttp) {

      $scope.calendar = [];
      var currentTimeSheetPosition = true;
      $scope.loadingDataFlag = true;

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
      }

      test = function () {

        var url = baseConfig.businessPath + "/wfl_timesheet_view/get_timesheet_list";
        var params = {
          "params": {
            "p_employee_number": "4040",
            "p_start_date": "2015-11-01",
            "p_end_date": "2015-11-01",
            "p_project_name": "",
            "p_project_id": "",
            "p_project_person_number": "",
            "p_page": "1",
            "p_line_number": "5"
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

      test();

      init();

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

      var fetchCalendar = function (month) {
        init();
        $scope.loadingDataFlag = true;

        var url = baseConfig.businessPath + "/timesheet_process/fetch_calendar";
        var params = {
          "params": {
            "p_employee": window.localStorage.empno,
            "p_month": month + "",
            "p_offset": 1
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
          $scope.$apply();
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(response));
          }
        });
      };

      fetchCalendar('201511');

      $scope.getTimeSheet = function (month) {
        fetchCalendar(month);
      };


      $scope.goBack = function () {
        $ionicHistory.$ionicGoBack();
      };

      if (baseConfig.debug) {
        console.log('applicationCtrl.enter');
      }
      ;

      $scope.$on('$ionicView.enter', function (e) {
        if (baseConfig.debug) {
          console.log('applicationCtrl.$ionicView.enter');
        }
        ;
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('applicationCtrl.$destroy');
        }
        ;
      });
    }])

  .service('TimeSheetService', [
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    function (baseConfig,
              hmsHttp,
              hmsPopup) {
      this.fetchCalendar = function () {

        var url = baseConfig.businessPath + "/timesheet_process/fetch_calendar";
        var params = {
          "params": {
            "p_employee": window.localStorage.empno,
            "p_month": '201511',
            "p_offset": 1
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

      this.fetchEachDay = function (callback) {
        var url = baseConfig.businessPath + '/timesheet_process/fetch_projects';
        var params = {'params': {'p_employee': window.localStorage.empno + "", 'p_date': '20151013' + ""}};
        //hmsPopup.showLoading('获取timesheet数据中...');
        hmsHttp.post(url, params).success(function (result) {
          callback(result);
        }).error(function (response, status) {
          hmsPopup.hideLoading();
          hmsPopup.showPopup('获取状态错误,请检查');
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

      var checked = 'ion-ios-checkmark';
      var unchecked = 'ion-ios-circle-outline'
      $scope.projectList = [];
      $scope.addressList = [];
      $scope.flybackList = [];

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
        charging: {flag: false, style: unchecked}, //ion-ios-checkmark
        description: ""
      };

      if (baseConfig.debug) {
        console.log('$stateParams.day ' + angular.toJson($stateParams.day));
      }

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

      $scope.showProjectModal = function () {
        $scope.projectModal.show();
      }
      $scope.hideProjectModal = function () {
        $scope.projectModal.hide();
      }

      $scope.showFlybackModal = function () {
        $scope.flybackModal.show();
      }
      $scope.hideFlybackModal = function () {
        $scope.flybackModal.hide();
      }

      $scope.showAddressModal = function () {
        $scope.addressModal.show();
      }
      $scope.hideAddressModal = function () {
        $scope.addressModal.hide();
      }



      var fetchEachDay = function (result) {
        hmsPopup.hideLoading();
        if(result.status == 'S'){
          var projectList = result.project;
          var flybackList = result.flyback;
          var addressList = result.projaddress;

          if(result.every_day.offbase ==='1'){
            $scope.timesheetDetail.travelingAllowance = {flag: true, style: checked};
          }else{
            $scope.timesheetDetail.travelingAllowance = {flag: false, style: unchecked};
          }

          if(result.every_day.base ==='Y'){
            $scope.timesheetDetail.normalAllowance = {flag: true, style: checked};
          }else{
            $scope.timesheetDetail.normalAllowance = {flag: false, style: unchecked};
          }

          if(result.every_day.externalcharge === '1'){
            $scope.timesheetDetail.charging = {flag: true, style: checked};
          }else{
            $scope.timesheetDetail.charging = {flag: false, style: unchecked};
          }

          $scope.timesheetDetail.currentDay = result.every_day.every_day;
          $scope.timesheetDetail.approver = result.every_day.approver;
          $scope.timesheetDetail.description = result.every_day.descrpt;
          $scope.timesheetDetail.allowance = result.every_day.allowance;

          angular.forEach(projectList,function(data){
            if(data.selected_flag === 'Y'){
              $scope.timesheetDetail.currentProject = data;
              return;
            }
          });
          angular.forEach(addressList,function(data){
            if(data.selected_flag === 'Y'){
              $scope.timesheetDetail.currentAddress = data;
              return;
            }
          });
          angular.forEach(flybackList,function(data){
            if(data.fly_select === 'Y'){
              $scope.timesheetDetail.currentFlyback = data;
              return;
            }
          });

          $scope.projectList = projectList;
          $scope.addressList = addressList;
          $scope.flybackList = flybackList;
        }
      };

      $scope.checkBoxChanged = function(item,type){
        console.log('$scope.checkBoxChanged item ' + angular.toJson(item));
        if(item.flag){
          item.flag = false;
          item.style = unchecked;
        }else{
          item.flag = true;
          item.style = checked;
        }
        if(type == 'travelingAllowance' && $scope.timesheetDetail.travelingAllowance.flag){
          $scope.timesheetDetail.normalAllowance = {flag: false, style: unchecked};
        }
        if(type == 'normalAllowance' && $scope.timesheetDetail.normalAllowance.flag){
          $scope.timesheetDetail.travelingAllowance = {flag: false, style: unchecked};
        }
      };

      $scope.submitTimesheet = function(timesheetDetail){
        if(baseConfig.debug){
          console.log('timesheetDetail ' + angular.toJson(timesheetDetail));
        }
      };

      $timeout(
        function(){
          hmsPopup.showLoading('获取timesheet明细数据');
          TimeSheetService.fetchEachDay(fetchEachDay);
        }
      );

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
          }
        })
    }]);
tsApproveModule.controller('tsApproveDetailCtrl', [
  '$scope',
  '$state',
  'baseConfig',
  '$ionicHistory',
  function ($scope,
            $state,
            baseConfig,
            $ionicHistory) {

    /**
     * init var section
     */
    {
      var warn = console.warn.bind(console);
      var selectItem = []; //初始化点击全部条目为false
      var clickSelectAll = false; //默认没有点击全选
      $scope.detailActionName = "操作";
      $scope.showActionBar = false; //默认不显示勾选按钮和底部的bar
      $scope.detailInfoArray = ['1', '2', '3']; //用于接收列表对应数据的数组
      $scope.selectArray = [];
    }

    $scope.$on('$ionicView.enter', function (e) {
      warn('tsApproveListCtrl.$ionicView.enter');
    });

    $scope.$on('$destroy', function (e) {
      warn('tsApproveListCtrl.$destroy');
    });

    function __initSelectArray(selectParam) { //初始化选择按钮
      //先初始化数据操作--
      $scope.selectArray = [];
      selectItem = [];
      angular.forEach($scope.detailInfoArray, function (data, index) {
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
        angular.element('#tsApproveItem').css('paddingLeft','6%');
      } else if ($scope.detailActionName == "取消") {
        $scope.detailActionName = "操作";
        $scope.showActionBar = false;
        __initSelectArray('undoSelectAll');
        angular.element('#tsApproveItem').css('paddingLeft','0');
        warn(angular.toJson($scope.selectArray, true));
      }
    };

    $scope.selectItem = function (index) { //单击选中条目的响应method
      selectItem[index] = !selectItem[index];
      if (selectItem[index]) {
        $scope.selectArray[index] = true;
      } else {
        $scope.selectArray[index] = false;
      }
    };

    $scope.selectAllDetail = function () { //全选
      clickSelectAll = !clickSelectAll;
      if(clickSelectAll) {
        __initSelectArray('selectedAll');
      } else {
        __initSelectArray('undoSelectAll');
      }
    };

    $scope.passThroughDetailItem = function () { //通过
      warn("passThroughDetailItem");
    };

    $scope.refuseDetailItem = function () { //拒绝
      warn("refuseDetailItem");
    };
  }]);


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
        })
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
    function ($scope,
              $state,
              baseConfig,
              $ionicModal,
              $ionicScrollDelegate,
              $ionicPopup,
              $timeout) {
      /**
       * initial var section
       */
      {
        var warn = console.warn.bind(console);
        $scope.showRocket = false; //默认不显示小火箭
        $scope.showConnectBlock = true; //默认显示连接块
        $scope.showDetailArrow = true; //默认显示向右的箭头--go list detail
        var clickSelectAll = false; //默认没有点击全选
        $scope.actionName = "操作";
        $scope.selectArray = [];
        $scope.listInfoArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        var position = ""; //记录滚动条的位置
        var selectItem = []; //初始化点击全部条目为false
        //var connectBlock = document.getElementById('#connect-block');
      }

      $scope.$on('$ionicView.enter', function (e) {
        console.log('tsApproveListCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('tsApproveListCtrl.$destroy');
      });

      function __initSelectArray(selectParam) { //初始化选择按钮
        //先初始化数据操作--
        $scope.selectArray = [];
        selectItem = [];
        angular.forEach($scope.listInfoArray, function (data, index) {
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
          __initSelectArray('undoSelectAll');
        }
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
          //if (position >= -5 && position < 0) {
          //  //connectBlock.style.width = '25px';
          //  //angular.element('#connect-block').addClass('connect-block-1');
          //} else if (position >= -12 && position < -5) {
          //  //angular.element('#connect-block').addClass('connect-block-2');
          //} else if (position >= -19 && position < -12) {
          //  //angular.element('#connect-block').addClass('connect-block-3');
          //  //angular.element('#connect-block').addClass('ng-hide');
          //}
          if(position < 0) {
            $scope.showConnectBlock = false;
          } else if (position >= 0 && position < 400) { //在顶部时显示连接块
            //angular.element('#connect-block').addClass('connect-block');
            $scope.showRocket = false;
            $scope.showConnectBlock = true;
          } else if (position >= 400) {
            $scope.showRocket = true;
          } else {
          }
        });
        warn(position);
      };

      $scope.tsListrefresh = function () { //下拉刷新
        $timeout(function () {
          //$scope.showConnectBlock = true;
          //angular.element('#connect-block').removeClass("connect-block connect-block-3 ng-hide connect-block-1");
          $scope.$broadcast("scroll.refreshComplete");
        }, 1000);
      };

      $scope.getAttentionInfo = function (e) {
        e.stopPropagation(); //阻止事件冒泡
        $ionicPopup.show({
          template: '<div class="warn-attention-icon">BASE地与项目一致</div>',
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
        $scope.tsFilterModal.show();
      };

      $scope.goApproveDetail = function (index) {
        if ($scope.showDetailArrow) {
          $state.go('tab.tsApproveDetail');
        } else {
          selectItem[index] = !selectItem[index];
          if (selectItem[index]) {
            $scope.selectArray[index] = true;
          } else {
            $scope.selectArray[index] = false;
          }
        }
      };

      $scope.selectAllList = function () { //全选
        clickSelectAll = !clickSelectAll;
        if (clickSelectAll) {
          __initSelectArray('selectedAll');
        } else {
          __initSelectArray('undoSelectAll');
        }
      };

      $scope.passThroughListItem = function () { //通过
        warn("passThroughDetailItem");
      };

      $scope.refuseListItem = function () { //拒绝
        warn("refuseDetailItem");
      };

      /**
       *  筛选modal方法区--
       */
      $scope.selectScreening = function (selectParam) {
        if (selectParam == 'projectName') {
          angular.element('#project-name').addClass('active-select');
          angular.element('#project-name').removeClass('active-off');
          angular.element('#person-select').removeClass('active-select');
        } else if (selectParam == 'personSelect') {
          angular.element('#person-select').addClass('active-select');
          angular.element('#project-name').addClass('active-off');
        }
      };

      $scope.selectFilterItem = function () { //点击单个条目时的响应方法

      };

    }]);
