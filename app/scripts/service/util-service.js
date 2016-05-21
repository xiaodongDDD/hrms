/**
 * Created by gusenlin on 16/5/21.
 */
'use strict';
angular.module('utilModule',[])
  .factory('HmsHttp', ['$log', '$http', 'setting', 'Prompter', function ($log, $http, setting, Prompter) {
    var serivieName = "HmsHttp";
    var isSucessfullName = "isSucessfull";
    var noAuthorPostName = serivieName + ".noAuthorPost";
    var noAuthorGetName = serivieName + ".noAuthorGet";
    var postName = serivieName + ".post";
    var getName = serivieName + ".get";
    var procedure;

    var init = function (procedure) {
      procedure = procedure;
    }
    var debug = function (text) {
      $log.debug(procedure + " success");
    }

    //如果登录令牌失效，跳转会登录界面
    var goBackLogin = function (state) {
      Prompter.hideLoading();
      state.go('login');
    };

    var request = {
      goBackLogin: function (state) {
        goBackLogin(state)
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
    }
    return request;
  }])

  .service('HmsPopup', ['$ionicLoading', '$cordovaToast', '$ionicPopup',
    function ($ionicLoading, $cordovaToast, $ionicPopup) {
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
        if (!ROOTCONFIG.isMobilePlatform) {
          $ionicLoading.show({
            template: (angular.isDefined(content) ? content : "操作失败"),
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            duration: 2000
          });
        } else {
          $cordovaToast.showLongBottom((angular.isDefined(content) ? content : "操作失败")).
          then(function (success) {
          }, function (error) {
          });
        }
      };
      this.showPopup = function (template, title) {
        if (!ROOTCONFIG.isMobilePlatform) {
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
          }
          navigator.notification.alert(
            template, // message
            alertDismissed, // callback
            "提示", // title
            '确定' // buttonName
          );
        }
      };
      this.showInputPopup = function (myscope, title, popup, pluginPopup) {
        if (!ROOTCONFIG.isMobilePlatform) {
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
            pluginPopup,                  // callback to invoke
            '填写信息',            // title
            ['确定', '退出'],             // buttonLabels
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
      this.showPopupConfirm = function (message, title, onConfirm) {
        if (!ROOTCONFIG.isMobilePlatform) {
          var confirmPopup = $ionicPopup.confirm({
            title: (angular.isDefined(title) ? title : "提示"),
            template: message,
            cancelText: '取消',
            cancelType: 'button-cux-popup-cancel',
            okText: '确定',
            okType: 'button-cux-popup-confirm'
          })
          confirmPopup.then(onConfirm);
        } else {
          navigator.notification.confirm(
            message, // message
            onConfirm, // callback to invoke with index of button pressed
            title, // title
            ['确定', '取消'] // buttonLabels
          );
        }
      }
    }
  ])

  .factory('returnView', ['$ionicHistory', function ($ionicHistory) {
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
        debug('history.stack.length : ' + history.stack.length);
        for (var i = history.stack.length - 1; i >= 0; i--) {
          debug('history.stack[i].stateName : ' + history.stack[i].stateName);
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
        debug(currentIonicHistory.viewHistory())
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
          }
          debug(history.stack[i])
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

  .factory('backLine', ['$ionicHistory', function ($ionicHistory) {
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
          console.log(viewLength)
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
            console.log(contentWidth)
            if (contentWidth < screenWidth) {
              scrollWidth.width = '';
            } else {
              scrollWidth.width = contentWidth + 'px';
            }
            for (var k = 0; k < backViews.length - 1; k++) {
              backViews[k].myStyle.color = '#F99D32';
            }
            console.log(backViews)
            backViews[backViews.length - 1].myStyle.color = 'black';
            return backViews;
          }
        }

        var view = {
          name: viewName,
          myStyle: {
            color: ''
          }
        }
        backViews.push(view);
        contentWidth = 0;
        for (var i = 0; i < backViews.length; i++) {
          if (i == backViews.length - 1) {
            contentWidth = contentWidth + backViews[i].name.toString().length * 14 + 8;
          } else {
            contentWidth = contentWidth + backViews[i].name.toString().length * 14 + 18 + 8;
          }
        }
        if (contentWidth > screenWidth) {
          scrollWidth.width = contentWidth + 'px';
        }
        for (var i = 0; i < backViews.length - 1; i++) {
          backViews[i].myStyle.color = '#F99D32';
        }
        return backViews;
      },
      getWidth: function () {
        return scrollWidth;
      }
    }
  }])

  .factory('$HmsHelp', [
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
      if (ionic.Platform.isIOS()) {
        var HELP_TPL = '<div style="position: absolute;top:2px;left: -4px;bottom: 0;right: 0;' +
          'background: url(img/mainHide.png); background-size: cover;;z-index: 12;">' +
          '<div style="height: 100%;width: 100%;background: none" ng-click="$buttonTapped()"></div></div>';
      } else {
        var HELP_TPL = '<div style="position: absolute;top: -14px;left: -4px;bottom: 0;right: 0;' +
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
        debug(arguments)
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

      var $HmsHelp = {
        showPopup: showPopup,
        _createPopup: createPopup,
        _popupStack: popupStack
      };


      return $HmsHelp;

      function createPopup() {
        var self = {};
        self.scope = ($rootScope).$new();
        self.element = angular.element(HELP_TPL);
        self.responseDeferred = $q.defer();
        $ionicBody.get().appendChild(self.element[0]);
        debug(self.element)
        $compile(self.element)(self.scope);

        extend(self.scope, {
          title: "",
          $buttonTapped: function () {
            //event = event.originalEvent || event; //jquery events
            debug("$buttonTapped");
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
          console.log("4 self.hide " + callback);
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
          console.log("5 self.remove ");
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
          $HmsHelp._backButtonActionDone = $ionicPlatform.registerBackButtonAction(
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
          debug("popupStack.push(popup)")
          $timeout(popup.show, showDelay, false);

          popup.responseDeferred.promise.then(function (result) {
            var index = popupStack.indexOf(popup);
            if (index !== -1) {
              popupStack.splice(index, 1);
            }

            debug("popupStack.length")
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
              ($HmsHelp._backButtonActionDone || function () {
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

  .factory("HMSFastPath", function () {
    var request = {
      configFastPath: function (scope,returnView,ionicHistory) {
        scope.screenWidth = {
          width: (window.screen.width - 50 + 'px')
        }
        scope.scrollWidth = returnView.getWidth();
        var viewTag = document.getElementsByTagName('ion-view');
        var viewName = viewTag[viewTag.length - 1].attributes[0].value
        scope.currentStackList = returnView.getStackList(ionicHistory, viewName);
        scope.goStack = function (stackItem) {
          returnView.returnToState(stackItem.stateName)
        }
      }
    }
    return request;
  });
