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
    'imService',
    'checkVersionService',
    'baseConfig',
    'hmsHttp',
    'hmsPopup',
    'contactService',
    function ($scope,
              $state,
              $timeout,
              $ionicPlatform,
              $ionicScrollDelegate,
              $ionicActionSheet,
              imService,
              checkVersionService,
              baseConfig,
              hmsHttp,
              hmsPopup,
              contactService) {

      $scope.messageList = [];
      var fetchData = true;
      $scope.showFilter = false;
      var page = 1;
      $scope.loadMoreFlag = false;
      $scope.empFilterValue = '';
      $scope.employeeList = [];

      $scope.loadingMoreFlag = false;

      //将页面的导航bar设置成白色
      $ionicPlatform.ready(function () {
        if (window.StatusBar) {
          StatusBar.styleLightContent();
        }
      });

      $scope.deleteMessage = function (message) {
        var success = function () {
          var index = $scope.messageList.indexOf(message);
          $scope.messageList.splice(index, 1);
          $scope.$apply();
        };
        var error = function () {
        };
        HandIMPlugin.deleteConversationList(success, error, message.employee);
      };

      document.addEventListener('IMPush.openNotification', function (result) {
        console.log('IMPush.openNotification result ' + angular.toJson(result));
        if (result && result.message && angular.isArray(result.message)) {
          getMessage(result);
        }
      }, false);

      var getMessage = function (result) {
        var userIcon;
        var userName;
        $scope.messageList = [];
        angular.forEach(result.message, function (data) {
          userIcon = data.message.userIcon;
          userName = data.message.userName;
          if (!userName || userName == '') {
            userIcon = '';
            userName = data.message.sendId;
          }
          var item = {
            "name": userName,
            "content": data.message.content,
            "imgUrl": userIcon,
            "count": data.message.messageNum,
            "employee": data.message.sendId,
            "time": data.message.sendTime
          };
          $scope.messageList.push(item);
        });
        $scope.$apply();
      };

      var getMessageList = function () {
        if (baseConfig.debug) {
          console.log('in getMessageList');
        }
        if (HandIMPlugin) {
          HandIMPlugin.returnConversationList(function success(result) {
            if (baseConfig.debug) {
              console.log('returnConversationList result ' + angular.toJson(result));
            }
            var needFresh = true;

            /*var needFresh = false;
             if (result.message.length != $scope.messageList.length) {
             needFresh = true;
             }
             angular.forEach(result.message, function (data, i) {
             if ($scope.messageList[i]) {
             if (data.message.sendId == $scope.messageList[i].employee && data.message.messageNum == $scope.messageList[i].count) {
             } else {
             needFresh = true;
             }
             } else {
             needFresh = true;
             }
             });*/

            if (needFresh) {
              if (result && result.message && angular.isArray(result.message)) {
                getMessage(result);
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

      function dealCommonLinkMan(newObject) { //存储常用联系人最多15个
        storedb(LINK_MAN).insert(newObject, function (err) {
          if (!err) {
            $scope.customContactsInfo = unique_better(storedb(LINK_MAN).find(), 'employeeNumber');
          } else {
            hmsPopup.showShortCenterToast(err);
          }
        });
        if ($scope.customContactsInfo.length > 15) {
          $scope.customContactsInfo = $scope.customContactsInfo.slice(0, 15);
        }
      };

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
              if (btnIndex == 1) {
                window.location.href = "tel:" + 88888888888; //不明觉厉--
                window.location.href = "tel:" + baseInfo.mobil.replace(/\s+/g, "");
                var imgUrl = baseInfo.avatar;
                if (baseInfo.avatar != '' || baseInfo.avatar) {
                } else {
                  if (baseInfo.gender == "男") {//根据性别判定头像男女
                    imgUrl = "build/img/myInfo/man-portrait.png";
                  } else if (baseInfo.gender == "女") {
                    imgUrl = "build/img/myInfo/woman-portrait.png";
                  }
                }

                var employeeBaseInfo = {
                  tel: baseInfo.mobil.replace(/\s+/g, ""),
                  name: baseInfo.emp_name,
                  employeeNumber: baseInfo.emp_code,
                  imgUrl: imgUrl
                };
                if (employeeBaseInfo.name) {
                  dealCommonLinkMan(employeeBaseInfo);
                }
                return true;
              } else if (btnIndex == 2) {
                contactService.contactLocal(baseInfo);
                return true;
              }
            });
        },

        search: function (loadMoreFlag) {
          if (!$scope.empFilterValue || $scope.empFilterValue == '') {
            return;
          }
          if (!loadMoreFlag) {
            page = 1;
            $scope.employeeList = [];
            $scope.loadMoreFlag = false;
            $ionicScrollDelegate.$getByHandle('employeeListHandle').scrollTop();
          } else {
            $scope.loadingMoreFlag = true;
            page = page + 1;
          }
          var url = baseConfig.queryPath + '/staff/query';
          var params = {
            "key": $scope.empFilterValue + "",
            "page": page + "",
            "pageSize": "30"
          };

          hmsHttp.post(url, params).success(function (response) {
            if (response.success == true) {
              if (response.total && response.total > 0) {
                angular.forEach(response.rows, function (data) {
                  $scope.employeeList.push(data);
                });

                if (response.total == 30) {
                  $scope.loadMoreFlag = true;
                  $scope.loadingMoreFlag = false;
                }
                else {
                  $scope.loadMoreFlag = false;
                }
                $ionicScrollDelegate.$getByHandle('employeeListHandle').resize();
              }
              else {
                $scope.loadMoreFlag = false;
              }
            }
            else {
              $scope.loadMoreFlag = false;
            }
            if (loadMoreFlag) {
              $scope.$broadcast('scroll.infiniteScrollComplete');
            }
          }).error(function (error) {
            $scope.$broadcast('scroll.infiniteScrollComplete');
          });
        }
      };

      /*$scope.messageList = [
       {
       "name": "11111",
       "content": "11111",
       "imgUrl": "11111",
       "count": "11111",
       "employee": "11111",
       "time": "111111111111111111111111"
       }
       ];*/

      var userInfo = {};

      $scope.chatWithYou = function (message) {
        if (baseConfig.debug) {
          console.log('message ' + angular.toJson(message));
        }
        var emp = {
          "friendId": message.employee,
          "friendName": message.name,
          "friendIcon": message.imgUrl
        };
        imService.toNativeChatPage(emp);

        $timeout(function () {
          getMessageList();
        }, 1000);
      };

      $scope.talk = function (message) {
        console.log('$scope.talk');
        $state.go("tab.messageDetail", {message: message});
      };

      $scope.refresh = function () {
        getMessageList();
      };

      console.log('messageCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        getMessageList();
        console.log('messageCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('messageCtrl.$destroy');
        document.removeEventListener('IMPush.openNotification', function (result) {
        }, false);
      });
    }
  ]);
