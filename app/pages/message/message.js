/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('messageModule')

  .controller('messageCtrl', [
    '$scope',
    '$state',
    '$timeout',
    '$ionicPlatform',
    '$ionicScrollDelegate',
    '$ionicActionSheet',
    '$cordovaActionSheet',
    '$location',
    '$rootScope',
    '$ionicHistory',
    'imService',
    'checkVersionService',
    'baseConfig',
    'hmsHttp',
    '$http',
    'hmsPopup',
    'messageService',
    function ($scope,
              $state,
              $timeout,
              $ionicPlatform,
              $ionicScrollDelegate,
              $ionicActionSheet,
              $cordovaActionSheet,
              $location,
              $rootScope,
              $ionicHistory,
              imService,
              checkVersionService,
              baseConfig,
              hmsHttp,
              $http,
              hmsPopup,
              messageService) {

      //消息列表
      $scope.messageList = [];

      //是否弹出员工查询过滤层
      $scope.showFilter = false;

      //员工查询界面加载更多数据标志
      $scope.loadMoreFlag = false;

      $scope.empFilterValue = '';

      $scope.loadingMoreFlag = false;


      if (baseConfig.debug) {
        console.log('window.localStorage.myInfoImg ' + window.localStorage.myInfoImg);
      }

      alert('daiwen....');
      $http.get('https://zt.bjgas.com/bjgas-server/c/api/getHomePagePic', '',{
        headers: {'Authorization':'Bearer eb13123f-58d3-4514-93a6-eff9cafb23d1'}
      }).success(function (response) {
        alert('response ' + angular.toJson(response))
      }).error(function (response, status) {
        alert('response ' + angular.toJson(response))
      });

      /*hmsCacheService.loadImageCache('img/tabs/message-f@3x.png',function () {});
       hmsCacheService.loadImageCache('img/tabs/application-F@3x.png',function () {});
       hmsCacheService.loadImageCache('img/tabs/contact-B@3x.png',function () {});
       hmsCacheService.loadImageCache('img/tabs/mine-B@3x.png',function () {});
       hmsCacheService.loadImageCache('img/myInfo/background.png',function () {});
       hmsCacheService.loadImageCache('img/myInfo/man-portrait.png',function () {});
       hmsCacheService.loadImageCache('img/myInfo/woman-portrait.png',function () {});
       if (window.localStorage.myInfoImg && window.localStorage.myInfoImg != '') {
       hmsCacheService.loadImageCache(window.localStorage.myInfoImg, function () {
       messageService.setMyInfoImageCacheFlag(true);
       });
       }*/


      $timeout(function () {
        var scriptEle = document.createElement("script");
        //scriptEle.type = "text/javasctipt";
        scriptEle.async = true;
        scriptEle.src = "http://webapi.amap.com/maps?v=1.3&key=afa17826e025989b36d837f9f4b4ba1f";

        var styleEle = document.createElement("link");
        styleEle.rel = "stylesheet";
        styleEle.async = true;
        styleEle.href = "http://cache.amap.com/lbs/static/main.css?v=1.0";
        var x1 = document.getElementsByTagName("head")[0];
        x1.insertBefore(styleEle, x1.firstChild);
        x1.insertBefore(scriptEle, x1.firstChild);
      }, 0);

      //分页
      var currentPage = 1;

      var messageCacheList1 = [
        {
          "name": '顾森林',
          "content": '你最近怎么样1?',
          "imgUrl": 'build/img/application/profile@3x.png',
          "count": 3,
          "employee": '',
          "time": '23:54',
          "messageType": 'MESSAGE',
          "sortTime": "20160830145901",
          "conversationType": ""
        },
        {
          "name": '石顺',
          "content": '你最近怎么样2?',
          "imgUrl": 'build/img/application/profile@3x.png',
          "count": 4,
          "employee": '',
          "time": '23:54',
          "messageType": 'MESSAGE',
          "sortTime": "20160830145911",
          "conversationType": ""
        }, {
          "name": '马云飞',
          "content": '你最近怎么样3?',
          "imgUrl": 'build/img/application/profile@3x.png',
          "count": 5,
          "employee": '',
          "time": '23:54',
          "messageType": 'MESSAGE4',
          "sortTime": "20160830145931",
          "conversationType": ""
        },
        {
          "name": '成志唯',
          "content": '你最近怎么样5?',
          "imgUrl": 'build/img/application/profile@3x.png',
          "count": 6,
          "employee": '',
          "time": '23:54',
          "messageType": 'MESSAGE',
          "sortTime": "20160830145941",
          "conversationType": ""
        }
      ];

      var messageCacheList = [
        {
          "name": '顾森林',
          "content": '你最近怎么样1?',
          "imgUrl": "",
          "imgName": "森林",
          "imgColorStyle": messageService.getRandomColor('0221'),
          "count": 3,
          "employee": '',
          "time": '23:54',
          "messageType": 'MESSAGE',
          "sortTime": "2016:01",
          "conversationType": ""
        },
        {
          "name": '石顺',
          "content": '你最近怎么样2?',
          "imgUrl": "",
          "imgName": "石顺",
          "imgColorStyle": messageService.getRandomColor('00232'),
          "count": 4,
          "employee": '',
          "time": '23:54',
          "messageType": 'MESSAGE',
          "sortTime": "20160822234412",
          "conversationType": ""
        }, {
          "name": '马云飞',
          "content": '你最近怎么样3?',
          "imgUrl": 'build/img/application/profile@3x.png',
          "count": 5,
          "employee": '',
          "time": '23:54',
          "messageType": 'MESSAGE4',
          "sortTime": "20160822234421",
          "conversationType": ""
        },
        {
          "name": '成志唯',
          "content": '你最近怎么样5?',
          "imgUrl": 'build/img/application/profile@3x.png',
          "count": 6,
          "employee": '',
          "time": '23:54',
          "messageType": 'MESSAGE',
          "sortTime": "20160822234424",
          "conversationType": ""
        }
      ];

      //将页面的导航bar设置成白色
      /*$ionicPlatform.ready(function () {
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
      });*/

      $scope.firstRefresh = false;

      /*$timeout(function () {
       messageService.getNotifyMessageList(refreshMessageAndNotify, refreshOnlyMessage, false, messageCacheList1);
       },3000);

       $timeout(function () {
       messageService.getNotifyMessageList(refreshMessageAndNotify, refreshOnlyMessage, false, messageCacheList);
       },6000);*/

      document.addEventListener('IMPush.openNotification', function (result) {
        if (baseConfig.debug) {
          console.log('IMPush.openNotification result ' + angular.toJson(result));
        }

        if (result && result.message) {
          var friendList = [];

          if (angular.isArray(result.message)) {
            friendList = messageService.getEmployeeMessageList(result);
          }

          //messageService.getNotifyMessageList(refreshMessageAndNotify, refreshOnlyMessage, false, friendList);
          var notifyList = messageService.getCachedNotifyList()
          $scope.messageList = messageService.mergeNotifyToFriendList(notifyList, friendList);
          $scope.$apply();
        }
      }, false);

      document.addEventListener('jpush.receiveNotification', function (result) {
        if (baseConfig.debug) {
          console.log('jpush.receiveNotification ' + angular.toJson(result));
        }
        refreshMessageList();
        if (result.message_type == 'work_flow') {
          hmsPopup.showPopup('你有一个待办事项要处理,请进入工作流列表进行处理!');
        }
      }, false);

      /*document.addEventListener('jpush.receiveMessage', function (result) {
       //if (baseConfig.debug) {
       alert('jpush.receiveMessage ' + angular.toJson(result));
       //}
       refreshMessageList();
       }, false);*/

      //刷新消息列表
      var refreshMessageList = function (refreshDom) {
        if (baseConfig.debug) {
          console.log('in refreshMessageList.getTime ' + new Date().getTime());
        }
        messageService.getNotifyMessageList(refreshPluginMessageAndNotify, refreshPluginOnlyMessage, true, []);
      };

      var refreshPluginMessageAndNotify = function (notifyList) {
        if (baseConfig.debug) {
          console.log('in refreshPluginMessageAndNotify');
        }
        if (baseConfig.isMobilePlatform) {
          HandIMPlugin.returnConversationList(function success(result) {
            if (baseConfig.debug) {
              console.log('returnConversationList result ' + angular.toJson(result));
            }
            if (result && result.message) {
              var friendList = [];
              if (angular.isArray(result.message)) {
                friendList = messageService.getEmployeeMessageList(result);
              }

              $scope.messageList = messageService.mergeNotifyToFriendList(notifyList, friendList);
            }
            $scope.$broadcast("scroll.refreshComplete");
          }, function error(result) {
            if (baseConfig.debug) {
              console.log('returnConversationList error result ' + angular.toJson(result));
            }
            $scope.$broadcast("scroll.refreshComplete");
          }, '');
        } else {
          var friendList = messageCacheList;
          angular.forEach(friendList, function (data) {
            data.sortTime = parseInt(data.sortTime);
            data.time = data.sortTime;
          });
          $scope.messageList = messageService.mergeNotifyToFriendList(notifyList, friendList);
          $scope.$broadcast("scroll.refreshComplete");
          if (baseConfig.debug) {
            console.log('in refreshPluginMessageAndNotify.getTime ' + new Date().getTime());
          }
        }
      };

      var refreshPluginOnlyMessage = function () {
        if (baseConfig.debug) {
          console.log('in refreshPluginOnlyMessage');
        }
        if (baseConfig.isMobilePlatform) {
          HandIMPlugin.returnConversationList(function success(result) {
            if (baseConfig.debug) {
              console.log('returnConversationList result ' + angular.toJson(result));
            }
            if (result && result.message && angular.isArray(result.message)) {
              $scope.messageList = messageService.getEmployeeMessageList(result);
            }
            $scope.$broadcast("scroll.refreshComplete");
          }, function error(result) {
            if (baseConfig.debug) {
              console.log('returnConversationList error result ' + angular.toJson(result));
            }
            $scope.$broadcast("scroll.refreshComplete");
          }, '');
        } else {
          var messageList = messageCacheList;
          angular.forEach(messageList, function (data) {
            data.sortTime = parseInt(data.sortTime);
            data.time = data.sortTime;
          });
          $scope.messageList = messageList;
          $scope.$broadcast("scroll.refreshComplete");
        }
      };

      var refreshMessageAndNotify = function (notifyList, friendList) {
        if (baseConfig.debug) {
          console.log('in refreshMessageAndNotify');
        }
        $scope.messageList = messageService.mergeNotifyToFriendList(notifyList, friendList);
      };

      var refreshOnlyMessage = function (friendList) {
        if (baseConfig.debug) {
          console.log('in refreshOnlyMessage');
        }
        $scope.messageList = friendList;

      };

      var searchTimeout;

      $scope.messageHandle = {
        blur: function () {
          if (baseConfig.debug) {
            console.log('messageHandle.blur');
          }
        },

        focus: function () {
          if (baseConfig.debug) {
            console.log('messageHandle.focus');
          }
          $scope.showFilter = true;
        },

        cancel: function () {
          $scope.showFilter = false;
          $scope.employeeList = [];
          $scope.loadMoreFlag = false;
          $scope.empFilterValue = '';
          $timeout(function () {
            $ionicScrollDelegate.$getByHandle('employeeListHandle').scrollTop();
          }, 0);
        },

        chatWithNative: function (item) {
          if (baseConfig.debug) {
            console.log('item ' + angular.toJson(item));
          }
          //go native page --im talk
          if (ionic.Platform.isWebView()) {
            var emp = {
              "friendId": item.emp_code,
              "friendName": item.emp_name,
              "friendIcon": item.avatar,
              "telephoneNumbers": item.mobil
            };
            imService.toNativeChatPage(emp);
            $timeout(function () {
              $scope.showFilter = false;
              $scope.empFilterValue = '';
              $scope.$apply();
            }, 200);
          } else {
            hmsPopup.showShortCenterToast('不支持网页聊天!');
          }
        },

        createGroupChat: function () {
          HandIMPlugin.createDiscussion(function success() {
          }, function error() {
          });
        },

        telSaveNumber: function (event, baseInfo) { //拨打电话按钮的响应事件
          event.stopPropagation(); //阻止事件冒泡

          var options = {
            buttonLabels: ['拨打电话', '拨打网络电话', '增加到通讯录'],
            addCancelButtonWithLabel: '取消',
            androidEnableCancelButton: true,
            androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT
          };

          $cordovaActionSheet.show(options)
            .then(function (btnIndex) {
              if (baseConfig.debug) {
                warn(btnIndex);
              }
              messageService.contactPerson($scope, baseInfo, btnIndex);
            });
        },

        deleteMessage: function (message) {
          if (message.messageType == 'MESSAGE') {
            message.deleteAnimate = true;
            $timeout(function () {
              messageService.deletePluginMessage($scope, message);
            }, 0);
          } else {
            message.deleteAnimate = true;
            $timeout(function () {
              var index = $scope.messageList.indexOf(message);
              $scope.messageList.splice(index, 1);
              messageService.readAllMessage(message.conversationType);
            }, 0);
          }
        },

        search: function (loadMoreFlag) {
          if (loadMoreFlag) {
            currentPage = parseInt(currentPage) + 1;
          } else {
            currentPage = 1;
          }

          if (baseConfig.debug) {
            console.log('search.currentPage ' + currentPage);
          }

          if(loadMoreFlag){
            messageService.searchEmployee($scope, currentPage, loadMoreFlag);
          }else{
            $timeout.cancel(searchTimeout);
            searchTimeout = $timeout(function () {
              messageService.searchEmployee($scope, currentPage, loadMoreFlag);
            },200);
          }

        },

        goMessageDetail: function (messageDetail) {
          if (baseConfig.debug) {
            console.log('messageDetail ' + angular.toJson(messageDetail));
          }
          if (messageDetail.messageType == 'MESSAGE') {
            if (messageDetail.conversationType == '1' || messageDetail.conversationType == 'private') {
              var emp = {
                "friendId": messageDetail.employee,
                "friendName": messageDetail.name,
                "friendIcon": messageDetail.imgUrl
              };
              imService.toNativeChatPage(emp);
            } else if (messageDetail.conversationType == '2' || messageDetail.conversationType == 'discussion') {
              var discussion = {"discussionId": messageDetail.employee};
              HandIMPlugin.openDiscussion(function () {
              }, function () {
              }, discussion);
            }
          } else {
            $state.go('tab.message-detail', {"messageDetail": messageDetail});
          }
        },

        notifyMessageDetail: function (messageDetail) {
          $state.go('tab.message-detail', {"messageDetail": messageDetail});
        }
      };

      $scope.talk = function (message) {
        console.log('$scope.talk');
        $state.go("tab.messageDetail", {message: message});
      };

      $scope.refresh = function () {
        refreshMessageList(true);
      };

      if (baseConfig.debug) {
        console.log('messageCtrl.enter');
      }

      $ionicPlatform.registerBackButtonAction(function (e) {

        if (baseConfig.debug) {
          console.log('messageCtrl.$ionicPlatform.registerBackButtonAction');
        }

        if ($location.path() == '/tab/message') {
          if (!$scope.showFilter) {
            if ($rootScope.backButtonPressedOnceToExit) {
              ionic.Platform.exitApp();
            } else {
              $rootScope.backButtonPressedOnceToExit = true;
              hmsPopup.showVeryShortCenterToast('再次点击返回键退出应用!');
              setTimeout(function () {
                $rootScope.backButtonPressedOnceToExit = false;
              }, 1500);
            }
          }
          else {
            $scope.messageHandle.cancel();
            var input = document.getElementById("your-input-id");
            input.blur();
            $scope.$apply();

          }
        } else if ($location.path() == '/tab/application' || $location.path() == '/tab/contact' ||
          $location.path() == '/tab/myInfo' || $location.path() == '/login' || $location.path() == '/gesture-lock') {
          if ($rootScope.backButtonPressedOnceToExit) {
            ionic.Platform.exitApp();
          } else {
            $rootScope.backButtonPressedOnceToExit = true;
            hmsPopup.showVeryShortCenterToast('再次点击返回键退出应用!');
            setTimeout(function () {
              $rootScope.backButtonPressedOnceToExit = false;
            }, 1500);
          }
        }
        else if ($ionicHistory.backView() && $location.path() != '/tab/message') {
          $ionicHistory.goBack();
        }
        e.preventDefault();
        return false;
      }, 101);

      $scope.$on('$ionicView.leave', function (e) {
        console.log('同事.$ionicView.leave');
      });

      $timeout(function () {
        messageService.registerDeviceInfo();
      },1000);

      $scope.$on('$ionicView.enter', function (e) {

        try{
          navigator.splashscreen.hide();
        }catch(e){
        }

        checkVersionService.checkAppVersion();

        if (!$scope.firstRefresh) {
          $timeout(function () {
            refreshMessageList(true);
          }, 1000);
        } else {
          refreshMessageList(true);
        }
        $scope.firstRefresh = true;
      });

      $scope.$on('$destroy', function (e) {
        if (baseConfig.debug) {
          console.log('messageCtrl.$destroy');
        }
        document.removeEventListener('IMPush.openNotification', function (result) {
        }, false);
      });
    }
  ]);
