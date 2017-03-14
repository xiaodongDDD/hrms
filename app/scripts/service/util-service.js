/**
 * Created by gusenlin on 16/5/21.
 */
angular.module('HmsModule')
  .factory('hmsHttp', ['$log',
    '$http',
    'hmsPopup',
    '$state',
    'baseConfig',
    '$rootScope',
    function ($log,
              $http,
              hmsPopup,
              $state,
              baseConfig,
              $rootScope) {
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
        if (baseConfig.debug) {
          console.log(procedure + " success");
        }
      };

      //如果登录令牌失效，跳转会登录界面
      var goBackLogin = function (state) {
        hmsPopup.hideLoading();
        $rootScope.$broadcast("REFRESH_LOGIN");
        state.go('login');
      };

      var request = {
        goBackLogin: function (state) {
          goBackLogin(state);
        },
        isSuccessfull: function (status) {
          if (baseConfig.debug) {
            console.log(isSucessfullName + " Start!");
            console.log(noAuthorPostName + " status " + status);
          }
          if (status == "S" || status == "SW") {
            return true;
          } else {
            return false;
          }
        },
        post: function (url, paramter) {
          if (baseConfig.debug) {
            console.log(postName + " Start!");
            console.log(postName + " url " + url);
            console.log(postName + " paramter " + angular.toJson(paramter));
          }
          var destUrl = url;
          var post = $http.post(destUrl, paramter,{
            headers: {'Content-Type': 'application/json','Authorization':'Bearer ' + window.localStorage.token}
          }).success(function (response) {
            if (baseConfig.debug) {
              console.log(postName + " success");
              console.log(postName + " response " + angular.toJson(response));
              console.log(postName + " End!");
            }
          }).error(function (response, status) {
            if (baseConfig.debug) {
              console.log(postName + " error");
              console.log(postName + " response " + response);
              console.log(postName + " status " + status);
              console.log(postName + " End!");
            }
            hmsPopup.hideLoading();
            if (status == '401') {
              window.localStorage.token = '';
              goBackLogin($state);
              hmsPopup.showShortCenterToast('另一个设备在登陆你的账号,请重新登陆!');
            }
            else if (status == '403') {
              window.localStorage.token = '';
              goBackLogin($state);
              hmsPopup.showShortCenterToast('用户令牌失效,请重新登陆!');
            }
            else if (status == '404') {
              hmsPopup.showShortCenterToast('后端服务器请求失败,请联系管理员!');
            }
            else {
              hmsPopup.showShortCenterToast('处理请求失败,请确认网络连接是否正常,或者联系管理员!');
            }
          });
          return post;
        },
        get: function (url) {
          if (baseConfig.debug) {
            console.log(getName + " Start!");
            console.log(getName + " url " + url);
          }
          var destUrl = url;
          var get = $http.get(destUrl,{
            headers: {'Content-Type': 'application/json','Authorization':'Bearer ' + window.localStorage.token}
          }).success(function (response) {
            if (baseConfig.debug) {
              console.log(getName + " success");
              console.log(getName + " response " + angular.toJson(response));
              console.log(getName + " End!");
            }
          }).error(function (response, status) {
            if (baseConfig.debug) {
              console.log(getName + " error");
              console.log(getName + " response " + response);
              console.log(getName + " status " + status);
              console.log(getName + " End!");
            }
          });
          return get;
        }
      };
      return request;
    }])

  .service('hmsPopup', ['$ionicLoading', '$cordovaToast', '$ionicPopup', 'baseConfig',
    function ($ionicLoading, $cordovaToast, $ionicPopup, baseConfig) {
      this.showLoading = function (content) {
        content = !content ? '加载中' : content;
        $ionicLoading.show({
          template: '<ion-spinner icon="ios" class="spinner spinner-ios spinner-stable"></ion-spinner>' +
          '<div style="color: white;font-size: 12px;text-align: center;height:25px;line-height: 25px;">' + content + '</div>'
        });
      };
      this.showLoadingWithoutBackdrop = function (content) {
        $ionicLoading.show({
          template: '<ion-spinner icon="ios" class="spinner spinner-ios spinner-stable"></ion-spinner>' +
          '<div style="color: white;font-size: 12px;text-align: center;height:25px;line-height: 25px;">' + content + '</div>',
          noBackdrop: true
        });
      };
      this.hideLoading = function () {
        $ionicLoading.hide();
      };
      this.showShortCenterToast = function (content) {//长时间底部提示toast
        if (!baseConfig.nativeScreenFlag) {
          $ionicLoading.show({
            template: (angular.isDefined(content) ? content : "操作失败"),
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            duration: 1500
          });
        } else {
          $cordovaToast.showLongBottom((angular.isDefined(content) ? content : "操作失败")).then(function (success) {
          }, function (error) {
          });
        }
      };
      this.showVeryShortCenterToast = function (content) {
        if (!baseConfig.nativeScreenFlag) {
          $ionicLoading.show({
            template: (angular.isDefined(content) ? content : "操作失败"),
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            duration: 1000
          });
        } else {
          $cordovaToast.showShortBottom((angular.isDefined(content) ? content : "操作失败")).then(function (success) {
          }, function (error) {
          });
        }
      };
      this.showLongCenterToast = function (content) {
        if (!baseConfig.nativeScreenFlag) {
          $ionicLoading.show({
            template: (angular.isDefined(content) ? content : "操作失败"),
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            duration: 3000
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
      this.confirmNoTitle = function (message, onConfirm) {
  /*      if (!baseConfig.nativeScreenFlag) {*/
          var confirmPopup = $ionicPopup.confirm({
            template: message,
            cancelText: '取消',
            cancelType: 'button-cux-popup-cancel',
            okText: '确定',
            okType: 'button-cux-popup-confirm'
          });
          confirmPopup.then(function(res){
            if(res){
              onConfirm(res);
            }else{

            }
          });
/*        } else {
          navigator.notification.confirm(
            message, // message
            function (index) {
              onConfirm(index-1);
            }, // callback to invoke with index of button pressed
            title, // title
            ['取消' , '确定'] // buttonLabels
          );
        }*/
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
      };
      //检测客户是否重名
      this.showPopupCustomer = function (template,customerName,approveStatus,saleArea,saleTeam,saleEmployeeName,saleEmployeeCode, title) {
    /*    if (!baseConfig.nativeScreenFlag) {*/
          $ionicPopup.show({
            title:title,
            template: template+'</br></br><div class="crm-customer-popup" >匹配客户: '+customerName+
            '</div><div class="crm-customer-popup">客户状态: '+approveStatus+'</div>'+
            '<div class="crm-customer-popup">所属大区: '+saleArea+'</div><div class="crm-customer-popup">所属团队: '+saleTeam+
            '</div><div class="crm-customer-popup">负责人: '+saleEmployeeName+'('+saleEmployeeCode+')</div>',
            buttons: [{
              text: '确定',
              type: 'button button-cux-popup-confirm'
            }]
          });
/*        } else {
          var alertDismissed = function () {
          };
          navigator.notification.alert(
            template, // message
            alertDismissed, // callback
            title, // title
            '确定' // buttonName
          );
        }*/
      };
      //检测客户税号和统一社会信用代码
      this.showPopupCustomerAdd = function (template,flagMsg,customerName,approveStatus,saleArea,saleTeam,saleEmployeeName,saleEmployeeCode, title) {
       /* if (!baseConfig.nativeScreenFlag) {*/
          $ionicPopup.show({
            title:title,
            template: template+'</br></br><div class="crm-customer-popup">'+flagMsg+'</div><div class="crm-customer-popup" >匹配客户: '+customerName+
            '</div><div class="crm-customer-popup">客户状态: '+approveStatus+'</div>'+
            '<div class="crm-customer-popup">所属大区: '+saleArea+'</div><div class="crm-customer-popup">所属团队: '+saleTeam+
            '</div><div class="crm-customer-popup">负责人: '+saleEmployeeName+'('+saleEmployeeCode+')</div>',
            buttons: [{
              text: '确定',
              type: 'button button-cux-popup-confirm'
            }]
          });
    /*    } else {
          var alertDismissed = function () {
          };
          navigator.notification.alert(
            template, // message
            alertDismissed, // callback
            title, // title
            '确定' // buttonName
          );
        }*/
      };

      this.confirmCrmCheck = function (message,$scope,onConfirm,data) {
    /*    if (!baseConfig.nativeScreenFlag) {*/
          var confirmPopup = $ionicPopup.confirm({
            scope: $scope,
            template: message,
            cancelText: '取消',
            cancelType: 'button-cux-popup-cancel',
            okText: '确定',
            okType: 'button-cux-popup-confirm'
          });
          confirmPopup.then(function(res){
            onConfirm(res,data);

          });
/*        } else {
          navigator.notification.confirm(
            message, // message
            function (index) {
              onConfirm(index-1);
            }, // callback to invoke with index of button pressed
            title, // title
            ['取消' , '确定'] // buttonLabels
          );
        }*/
      };

      this.confirmOnly = function (message, title, onConfirm) {
        if (!baseConfig.nativeScreenFlag) {
          var confirmPopup = $ionicPopup.confirm({
            title: (angular.isDefined(title) ? title : "提示"),
            template: message,
            okText: '确定',
            okType: 'button-cux-popup-confirm'
          });
          confirmPopup.then(function (res) {
            if (baseConfig.debug) {
              console.log('this.confirm.res ' + angular.toJson(res))
            }
            var index = 0;
            if (res) {
              index = 1;
            }
            onConfirm(index);
          });
        } else {
          navigator.notification.confirm(
            message, // message
            function (index) {
              onConfirm(index - 1);
            }, // callback to invoke with index of button pressed
            title, // title
            ['确定'] // buttonLabels
          );
        }
      };

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
          confirmPopup.then(function (res) {
            if (baseConfig.debug) {
              console.log('this.confirm.res ' + angular.toJson(res))
            }
            var index = 0;
            if (res) {
              index = 1;
            }
            onConfirm(index);
          });
        } else {
          navigator.notification.confirm(
            message, // message
            function (index) {
              onConfirm(index - 1);
            }, // callback to invoke with index of button pressed
            title, // title
            ['取消', '确定'] // buttonLabels
          );
        }
      };


    this.confirmDIY = function (message, title,okText,cancelText, onConfirm,onBack) {
  /*    if (!baseConfig.nativeScreenFlag) {*/
        var confirmPopup = $ionicPopup.confirm({
          title: (angular.isDefined(title) ? title : "提示"),
          template: message,
          cancelText: cancelText,
          cancelType: 'button-cux-popup-cancel',
          okText: okText,
          okType: 'button-cux-popup-confirm'
        });
        confirmPopup.then(function(res){
          if(res){
            onConfirm(res);
          }else{
            onBack(res)
          }
        });
    /*  } else {
        navigator.notification.confirm(
          message, // message
          function (index) {
            onConfirm(index-1);
          }, // callback to invoke with index of button pressed
          title, // title
          ['取消' , '确定'] // buttonLabels
        );
      }*/
    };

      this.confirmShare = function (title, message,  shareConfirm) {
        if (!baseConfig.nativeScreenFlag) {
          var confirmSharePopup = $ionicPopup.confirm({
            title: title,
            template: message,
            cancelText: '直接分享',
            cancelType: 'button-cux-popup-cancel',
            okText: '继续返回',
            okType: 'button-cux-popup-confirm'
          });
          confirmSharePopup.then(function (res) {
            if (baseConfig.debug) {
              console.log('this.confirm.res ' + angular.toJson(res))
            }
            console.log(index);
            var index = 0;
            if (res) {
              index = 1;
            }
            shareConfirm(index);
          });
        } else {
          navigator.notification.confirm(
            message, // message
            function (index) {
              shareConfirm(index - 1);
            }, // callback to invoke with index of button pressed
            title, // title
            ['直接分享', '继续返回'] // buttonLabels
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
        if (baseConfig.debug) {
          console.log(viewLength);
        }
        for (var i = 0; i < backViews.length; i++) {
          if (viewName == backViews[i].name) {
            backViews = backViews.slice(0, i + 1);
            contentWidth = 0;
            for (var j = 0; j < backViews.length; j++) {
              if (j == backViews.length - 1) {
                contentWidth = contentWidth + backViews[j].name.toString().length * 14 + 8;
              } else {
                contentWidth = contentWidth + backViews[j].name.toString().length * 14 + 18 + 8;
              }
            }
            if (baseConfig.debug) {
              console.log(contentWidth);
            }
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

  .factory('HmsDateFormat', ['$filter', function ($filter) {
    return {
      getDateString: function (date) {
        return $filter('date')(date, 'yyyy-MM-dd');
      },
      getDateTimeString: function (date) {
        return $filter('date')(date, 'yyyy-MM-dd HH:mm:ss');
      }
    }
  }])

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
  })

  .factory("hmsCacheService", ['baseConfig', function (baseConfig) {
    var request = {
      loadImageCache: function (url, callback) {
        var img = new Image();
        img.src = url;
        img.onerror = function () {
          if(baseConfig.debug) {
            console.log('loadImage error');
          }
          img = img.onload = img.onerror = null;
        };
        img.onload = function () {
          if(baseConfig.debug){
            console.log('loadImage onload img.width ' + img.width);
            console.log('loadImage onload img.height ' + img.height);
            console.log('loadImage onload img.align ' + img.align);
            console.log('loadImage onload img.alt ' + img.alt);
            console.log('loadImage onload img.border ' + img.border);
            console.log('loadImage onload img.complete ' + img.complete);
            console.log('loadImage onload img.id ' + img.id);
            console.log('loadImage onload img.isMap ' + img.isMap);
            console.log('loadImage onload img.longDesc ' + img.longDesc);
            console.log('loadImage onload img.lowsrc ' + img.lowsrc);
            console.log('loadImage onload img.name ' + img.name);
            console.log('loadImage onload img.src ' + img.src);
            console.log('loadImage onload img.useMap ' + img.useMap);
            console.log('loadImage onload img.vspace ' + img.vspace);
            console.log('loadImage onload img.lowsrc ' + img.lowsrc);
          }
          img.onload = null;
          callback.call(img);
        };
      }
    };
    return request;
  }])

  .service('history', function () {
    var _db;
    //dateFix 函数是用来处理SQLite读出的数据的，因为SQLite的存储的数据结构层次优点不同，
    function dateFix (result) {
      var data = [];
      result.forEach(function (each) {data.push(each.doc);　});
      console.log(data);
      return data
    }

    return {
      initDB: function () {
        _db = new PouchDB('history', {adapter: 'websql'});
      },
      getAllHistory: function (callback) {
        _db.allDocs({include_docs: true}).then(function (result) {
          callback(dateFix(result.rows));
        })
      },
      addHistory: function (history) {
        _db.post(history);
      },
      removeHistory: function (history) {
        _db.remove(history);
      }
    }
  })
  .service('historyCompetitor', function () {
    var _db;
    //dateFix 函数是用来处理SQLite读出的数据的，因为SQLite的存储的数据结构层次优点不同，
    function dateFix (result) {
      var data = [];
      result.forEach(function (each) {data.push(each.doc);　});
      console.log(data);
      return data
    }

    return {
      initDB: function () {
        _db = new PouchDB('historyCompetitor', {adapter: 'websql'});
      },
      getAllHistory: function (callback) {
        _db.allDocs({include_docs: true}).then(function (result) {
          callback(dateFix(result.rows));
        })
      },
      addHistory: function (history) {
        _db.post(history);
      },
      removeHistory: function (history) {
        _db.remove(history);
      }
    }
  })
  .service('historyOfferList', function () {
    var _db;
    //dateFix 函数是用来处理SQLite读出的数据的，因为SQLite的存储的数据结构层次优点不同，
    function dateFix (result) {
      var data = [];
      result.forEach(function (each) {data.push(each.doc);　});
      console.log(data);
      return data
    }

    return {
      initDB: function () {
        _db = new PouchDB('historyOfferList', {adapter: 'websql'});
      },
      getAllHistory: function (callback) {
        _db.allDocs({include_docs: true}).then(function (result) {
          callback(dateFix(result.rows));
        })
      },
      addHistory: function (history) {
        _db.post(history);
      },
      removeHistory: function (history) {
        _db.remove(history);
      }
    }
  })
  .service('historyOpportunity', function () {
    var _db;
    //dateFix 函数是用来处理SQLite读出的数据的，因为SQLite的存储的数据结构层次优点不同，
    function dateFix (result) {
      var data = [];
      result.forEach(function (each) {data.push(each.doc);　});
      console.log(data);
      return data
    }

    return {
      initDB: function () {
        _db = new PouchDB('historyOpportunity', {adapter: 'websql'});
      },
      getAllHistory: function (callback) {
        _db.allDocs({include_docs: true}).then(function (result) {
          callback(dateFix(result.rows));
        })
      },
      addHistory: function (history) {
        _db.post(history);
      },
      removeHistory: function (history) {
        _db.remove(history);
      }
    }
  })
  .service('historyBidbond', function () {
    var _db;
    //dateFix 函数是用来处理SQLite读出的数据的，因为SQLite的存储的数据结构层次优点不同，
    function dateFix (result) {
      var data = [];
      result.forEach(function (each) {data.push(each.doc);　});
      console.log(data);
      return data
    }

    return {
      initDB: function () {
        _db = new PouchDB('historyBidbond', {adapter: 'websql'});
      },
      getAllHistory: function (callback) {
        _db.allDocs({include_docs: true}).then(function (result) {
          callback(dateFix(result.rows));
        })
      },
      addHistory: function (history) {
        _db.post(history);
      },
      removeHistory: function (history) {
        _db.remove(history);
      }
    }
  })
  .service('historyContact', function () {
    var _db;
    //dateFix 函数是用来处理SQLite读出的数据的，因为SQLite的存储的数据结构层次优点不同，
    function dateFix (result) {
      var data = [];
      result.forEach(function (each) {data.push(each.doc);　});
      console.log(data);
      return data
    }

    return {
      initDB: function () {
        _db = new PouchDB('historyContact', {adapter: 'websql'});
      },
      getAllHistory: function (callback) {
        _db.allDocs({include_docs: true}).then(function (result) {
          callback(dateFix(result.rows));
        })
      },
      addHistory: function (history) {
        _db.post(history);
      },
      removeHistory: function (history) {
        _db.remove(history);
      }
    }
  })
  .service('contactLocal',function(hmsPopup){
    //for contact
    function onSaveContactSuccess() {
      console.log("添加成功");
    }
    //for contact
    function onSaveContactError(contactError) {
      console.log("添加失败");
    }
    return {  //联系人保存到本地--
      contactLocal: function (baseInfo,onSaveContactSuccess,onSaveContactError) {
        hmsPopup.showLoading("正在保存");
        if (ionic.Platform.isWebView()) {
          var newContact = navigator.contacts.create();
          var phoneNumbers = [];
          phoneNumbers[0] = new ContactField('mobile', baseInfo.mobil, true);
          var emails = [];
          emails[0] = new ContactField('email', baseInfo.email, true);
          var organization = [];
          organization[0] = new ContactField('organization', baseInfo.organization, true);
          var ims=[];
          ims[0]= new ContactField('ims',baseInfo.categories,true);
          var categories=[];
          categories[0]= new ContactField('categories',baseInfo.categories,true);
          var organizations=[];
          organizations[0]= new ContactField('organizations',baseInfo.categories,true);
          if (ionic.Platform.isAndroid()) {
            newContact.displayName = baseInfo.emp_name; // ios 不支持 displayName
          }
          if (ionic.Platform.isIOS()) {
            var name = new ContactName();
            name.givenName = baseInfo.emp_name.substring(1, baseInfo.emp_name.length);
            name.familyName = baseInfo.emp_name.substring(0, 1);
            newContact.name = name;
          }
          newContact.phoneNumbers = phoneNumbers;
          newContact.emails = emails;
          newContact.organizations = organization;
          newContact.categories = categories;
          newContact.save(onSaveContactSuccess, onSaveContactError);
        }
      },
      findLocal:function(onSuccess,onError){
        if (ionic.Platform.isWebView()) {
          var options = new ContactFindOptions();
          options.filter = "";
          options.multiple = true;
          /*
           查找关键字
           名字: "displayName"  ,
           电话号码:"phoneNumbers"   //ContactField[]类型

           */
          var fields = ["displayName", "name", "phoneNumbers"];
          navigator.contacts.find(fields, onSuccess, onError, options);


        }
      }
    }
  });
angular.module("HmsModule").filter("T", ['$translate', function ($translate) {
  return function (key) {
    if (key) {
      return $translate.instant(key);
    }
  };
}]);

angular.module('HmsModule').factory('T', ['$translate', function ($translate) {
  return {
    T: function (key) {
      if (key) {
        return $translate.instant(key);
      }
      return key;
    }
  };
}]);
