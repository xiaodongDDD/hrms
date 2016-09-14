/**
 * Created by gusenlin on 16/8/23.
 */
angular.module('applicationModule')
  .service('messageService',
    ['$ionicScrollDelegate',
      '$timeout',
      'hmsHttp',
      'baseConfig',
      'hmsPopup',
      'contactService',
      function ($ionicScrollDelegate,
                $timeout,
                hmsHttp,
                baseConfig,
                hmsPopup,
                contactService) {

        var messageType = {
          message: 'MESSAGE',
          notify: 'NOTIFY'
        };

        var notifyType = {
          /*"work_flow": {
            "name": "待办事项",
            "imgUrl": "build/img/message/todo@3x.png",
          },*/
          "room": {
            "name": "住宿申请",
            "imgUrl": "build/img/message/dorm@3x.png",
          },
          "timesheet": {
            "name": "timesheet未填提醒",
            "imgUrl": "build/img/message/timesheet@3x.png",
          },
          "other": {
            "name": "日常提醒",
            "imgUrl": "build/img/message/announcement@3x.png",
          }
        };

        var notifyList = [];

        var messageDefaultIcon = 'build/img/application/profile@3x.png';

        function dealCommonLinkMan(myscope, newObject) { //存储常用联系人最多15个
          storedb(LINK_MAN).insert(newObject, function (err) {
            if (!err) {
              myscope.customContactsInfo = unique_better(storedb(LINK_MAN).find(), 'employeeNumber');
            } else {
              hmsPopup.showShortCenterToast(err);
            }
          });
          if (myscope.customContactsInfo.length > 15) {
            myscope.customContactsInfo = myscope.customContactsInfo.slice(0, 15);
          }
        }

        var filterData = function (data) {
          var result = '';
          if (data && data != "null" || data == "") {
            result = data;
          }
          return result;
        };

        var setCachedNotifyList = function (list) {
          notifyList = list
        };

        this.getCachedNotifyList = function () {
          var list = [];
          angular.forEach(notifyList,function (data) {
            data.selected = false;
            list.push(data);
          })
          return list;
        }

        this.mergeNotifyToFriendList = function (notifyList, friendList) {
          if (baseConfig.debug) {
            console.log('mergeNotifyToFriendList.notifyList ' + angular.toJson(notifyList));
            console.log('mergeNotifyToFriendList.friendList ' + angular.toJson(friendList));
          }
          var messageList = [];
          for (var i = 0; i < friendList.length; i++) {
            for (var j = 0; j < notifyList.length; j++) {
              if (parseInt(friendList[i].sortTime) < parseInt(notifyList[j].sortTime) && !notifyList[j].selected) {
                messageList.push(notifyList[j]);
                notifyList[j].selected = true;
              }
            }
            messageList.push(friendList[i]);
          }
          for (var ii = 0; ii < notifyList.length; ii++) {
            if (!notifyList[ii].selected) {
              messageList.push(notifyList[ii]);
            }
          }
          return messageList;
        };

        this.getEmployeeMessageList = function (result) {
          var userIcon;
          var userName;
          var employeeMessageList = [];

          angular.forEach(result.message, function (data) {
            userIcon = data.message.userIcon;
            userName = data.message.userName;
            if (!userName || userName == '') {
              userIcon = messageDefaultIcon;
              userName = data.message.sendId;
            }
            var item = {
              "name": userName,
              "content": data.message.content,
              "imgUrl": userIcon,
              "count": data.message.messageNum,
              "employee": data.message.sendId,
              "time": data.message.sendTime,
              "messageType": messageType.message,
              "sortTime": data.message.sortTime,
              "conversationType": data.message.conversationType,
            };
            employeeMessageList.push(item);
          });
          return employeeMessageList;
        };

        this.getNotifyMessageList = function (mergeMessageAndNotifyList, mergeOnlyMessageList, AutoRefresh, friendList) {
          var success = function (result) {
            if (baseConfig.debug) {
              console.log('in getNotifyMessageList.getTime ' + new Date().getTime());
            }
            if (result.returnCode == 'S') {
              var totalMessageCount = 0;
              var messageList = [];
              angular.forEach(result.returnData, function (messageDetail) {

                if(notifyType[messageDetail.messageTypeCode]){
                  totalMessageCount = totalMessageCount + parseInt(messageDetail.messageNum);
                  var notify = {
                    "name": notifyType[messageDetail.messageTypeCode].name,
                    "content": messageDetail.messageContent,
                    "imgUrl": notifyType[messageDetail.messageTypeCode].imgUrl,
                    "count": messageDetail.messageNum,
                    "employee": "",
                    "time": messageDetail.compareTime,
                    "messageType": messageType.notify,
                    "sortTime": filterData(messageDetail.latestMessageTime),
                    "conversationType": messageDetail.messageTypeCode
                  };
                  messageList.push(notify);
                }

              });

              setCachedNotifyList(messageList);

              if (AutoRefresh) {
                mergeMessageAndNotifyList(messageList);
              } else {
                mergeMessageAndNotifyList(messageList, friendList);
              }
              if (ionic.Platform.isWebView() && ionic.Platform.isIOS()) {
                window.plugins.jPushPlugin.setApplicationIconBadgeNumber(totalMessageCount);
              }
            }
          };
          var error = function (response) {
            if (AutoRefresh) {
              mergeMessageAndNotifyList();
            } else {
              mergeMessageAndNotifyList(friendList);
            }
          };
          this.getMessageSummary(success, error);
        };

        this.deletePluginMessage = function (myscope, message) {
          var optsList = {
            "friendId": message.employee,
            "conversationType": message.conversationType
          };
          if (baseConfig.debug) {
            alert('deletePluginMessage.optsList ' + angular.toJson(optsList));
          }
          var success = function () {
            var index = myscope.messageList.indexOf(message);
            myscope.messageList.splice(index, 1);
            myscope.$apply();
          };
          var error = function () {
          };
          HandIMPlugin.deleteConversationList(success, error, optsList);
          /*if(ionic.Platform.isIOS()){
           var group = {
           "conversationId": message.employee,
           "conversationType": message.conversationType
           };
           HandIMPlugin.deleteConversationList(success, error, group);
           }else{
           HandIMPlugin.deleteConversationList(success, error, message.employee);
           }*/
        };

        this.contactPerson = function (myscope, baseInfo, btnIndex) {
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
              dealCommonLinkMan(myscope, employeeBaseInfo);
            }
            return true;
          } else if (btnIndex == 2) {
            contactService.contactLocal(baseInfo);
            return true;
          }
        }

        this.getMessageCenter = function (success, error) {
          var url = baseConfig.queryPath + "/messageCenter";
          var params = {
            'params': {
              "employeeCode": window.localStorage.empno,
              "interfaceCode": "summary"
            }
          };
          hmsHttp.post(url, params).success(function (result) {
            success(result)
          }).error(function (response, status) {
            error(response);
          });
        };

        this.getMessageSummary = function (success, error) {
          var url = baseConfig.queryPath + "/message/summary";
          var params = {
            "employeeCode": window.localStorage.empno,
            "interfaceCode": "summary"
          };
          hmsHttp.post(url, params).success(function (result) {
            success(result)
          }).error(function (response, status) {
            error(response);
          });
        };

        this.changeBadgeNumber = function () {
          window.plugins.jPushPlugin.getApplicationIconBadgeNumber(function (data) {
            if (baseConfig.debug) {
              console.log("changeBadgeNumber data " + angular.toJson(data));
            }

            var badgeNumber;

            if (parseInt(data) > 0) {
              badgeNumber = parseInt(data) - 1;
            } else {
              badgeNumber = 0;
            }
            window.plugins.jPushPlugin.setApplicationIconBadgeNumber(badgeNumber);
          });
        }

        this.getMessageProcess = function (success, error, messageList) {
          var url = baseConfig.queryPath + "/message/process";
          var params = {
            "employeeCode": window.localStorage.empno,
            "interfaceCode": "process",
            "messageList": messageList
          };
          hmsHttp.post(url, params).success(function (result) {
            success(result)
          }).error(function (response, status) {
            error(response);
          });
        };

        this.getMessageDetail = function (success, error, type, page) {
          var url = baseConfig.queryPath + "/message/detail";
          var params = {
            "employeeCode": window.localStorage.empno,
            "interfaceCode": "detail",
            "messageType": type,
            "page": page
          };
          hmsHttp.post(url, params).success(function (result) {
            success(result)
          }).error(function (response, status) {
            error(response);
          });
        };

        this.readAllMessage = function (type) {
          var url = baseConfig.queryPath + "/message/readAllByType";
          var params =
          {
            "MessageTypeCode": type
          };
          hmsHttp.post(url, params).success(function (result) {
          }).error(function (response, status) {
          });
        }
        ;


        this.searchEmployee = function (myscope, page, loadMoreFlag) {
          if (!myscope.empFilterValue || myscope.empFilterValue == '') {
            return;
          }
          if (!loadMoreFlag) {
            page = 1;
            myscope.employeeList = [];
            myscope.loadMoreFlag = false;
            $timeout(function () {
              $ionicScrollDelegate.$getByHandle('employeeListHandle').scrollTop();
            });
          } else {
            myscope.loadingMoreFlag = true;
            page = page + 1;
          }
          var url = baseConfig.queryPath + '/staff/query';
          var params = {
            "key": myscope.empFilterValue + "",
            "page": page + "",
            "pageSize": "30"
          };

          hmsHttp.post(url, params).success(function (response) {
            if (response.success == true) {
              if (response.total && response.total > 0) {
                angular.forEach(response.rows, function (data) {
                  myscope.employeeList.push(data);
                });

                if (response.total == 30) {
                  myscope.loadMoreFlag = true;
                  myscope.loadingMoreFlag = false;
                }
                else {
                  myscope.loadMoreFlag = false;
                }
                $ionicScrollDelegate.$getByHandle('employeeListHandle').resize();
              }
              else {
                myscope.loadMoreFlag = false;
              }
            }
            else {
              myscope.loadMoreFlag = false;
            }
            if (loadMoreFlag) {
              myscope.$broadcast('scroll.infiniteScrollComplete');
            }
          }).error(function (error) {
            myscope.$broadcast('scroll.infiniteScrollComplete');
          });
        }
      }])
;
