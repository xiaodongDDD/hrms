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
    'imService',
    'checkVersionService',
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    'messageService',
    'contactService',
    function ($scope,
              $state,
              $timeout,
              $ionicPlatform,
              $ionicScrollDelegate,
              $ionicActionSheet,
              $cordovaActionSheet,
              imService,
              checkVersionService,
              baseConfig,
              hmsHttp,
              hmsPopup,
              messageService,
              contactService) {

      //消息列表
      $scope.messageList = [];

      //是否弹出员工查询过滤层
      $scope.showFilter = false;

      //员工查询界面加载更多数据标志
      $scope.loadMoreFlag = false;

      $scope.empFilterValue = '';

      //即时通讯消息列表
      $scope.employeeMessageList = [];

      //特殊数据消息列表
      $scope.notifyMessageList = [
        {
          "name": "待办事项",
          "content": "",
          "imgUrl": "build/img/message/todo@3x.png",
          "count": "0",
          "type": "work_flow",
          "time": "3月20日"
        },
        {
          "name": "住宿申请",
          "content": "",
          "imgUrl": "build/img/message/dorm@3x.png",
          "count": "0",
          "type": "room",
          "time": "3月20日"
        },
        {
          "name": "timesheet未填提醒",
          "content": "",
          "imgUrl": "build/img/message/timesheet@3x.png",
          "count": "0",
          "type": "timesheet",
          "time": "3月20日"
        },
        {
          "name": "日常提醒",
          "content": "",
          "imgUrl": "build/img/message/announcement@3x.png",
          "count": "0",
          "type": "other",
          "time": "3月20日"
        }
      ];

      $scope.loadingMoreFlag = false;

      //分页
      var page = 1;

      //将页面的导航bar设置成白色
      $ionicPlatform.ready(function () {
        if (window.StatusBar) {
          StatusBar.styleLightContent();
        }
      });

      document.addEventListener('IMPush.openNotification', function (result) {
        console.log('IMPush.openNotification result ' + angular.toJson(result));
        if (result && result.message && angular.isArray(result.message)) {
          messageService.getEmployeeMessageList($scope, result);
        }
      }, false);

      var getEmployeeMessageList = function () {
        if (baseConfig.debug) {
          console.log('in getMessageList');
        }
        if (baseConfig.isMobilePlatform) {
          HandIMPlugin.returnConversationList(function success(result) {
            if (baseConfig.debug) {
              console.log('returnConversationList result ' + angular.toJson(result));
            }
            var needFresh = true;

            if (needFresh) {
              if (result && result.message && angular.isArray(result.message)) {
                messageService.getEmployeeMessageList($scope, result);
              }
            }
            $scope.$broadcast("scroll.refreshComplete");
          }, function error(result) {
            if (baseConfig.debug) {
              console.log('returnConversationList error result ' + angular.toJson(result));
            }
            $scope.$broadcast("scroll.refreshComplete");
          }, '');
        }
      };

      //$timeout(function () {
      //  getMessageList();
      //}, 1000);

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
          $ionicScrollDelegate.$getByHandle('employeeListHandle').scrollTop();
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
              "friendIcon": item.avatar
            };
            imService.toNativeChatPage(emp);
          } else {
            hmsPopup.showShortCenterToast('不支持网页聊天!');
          }
        },

        createGroupChat: function () {
          HandIMPlugin.createGroupChat(function success() {
          }, function error() {
          });
        },

        telSaveNumber: function (event, baseInfo) { //拨打电话按钮的响应事件
          event.stopPropagation(); //阻止事件冒泡

          var options = {
            buttonLabels: ['拨打电话', '增加到通讯录'],
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
          messageService.deletePluginMessage($scope, message);
        },

        chatWithYou: function (message) {
          if (baseConfig.debug) {
            console.log('message ' + angular.toJson(message));
          }

          if (message.conversationType == 1) {
            var emp = {
              "friendId": message.employee,
              "friendName": message.name,
              "friendIcon": message.imgUrl
            };
            imService.toNativeChatPage(emp);
          }
          else {
            HandIMPlugin.toDiscussionGroup(function () {
            }, function () {
            }, {"discussionId": message.employee});
          }

          //imService.toNativeChatPage(emp);
          $timeout(function () {
            //getMessageList();
          }, 1000);
        },

        search: function (loadMoreFlag) {
          messageService.searchEmployee($scope, page, loadMoreFlag);
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
        getEmployeeMessageList();
        messageService.getNotifyMessageList($scope);
      };

      if (baseConfig.debug) {
        console.log('messageCtrl.enter');
      }

      $scope.$on('$ionicView.enter', function (e) {
        //将页面的导航bar设置成白色
        $ionicPlatform.ready(function () {
          if (window.StatusBar) {
            StatusBar.styleLightContent();
          }
        });
        getEmployeeMessageList();
        messageService.getNotifyMessageList($scope);
        if (baseConfig.debug) {
          console.log('messageCtrl.$ionicView.enter');
        }
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
