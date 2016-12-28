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

        /*var colorList = [
         {
         "border": "1px solid #dd1144"
         },
         {
         "border": "1px solid #4b8bf4"
         },
         {
         "border": "1px solid #F99D32"
         },
         {
         "border": "1px solid #5CB281"
         },
         {
         "border": "1px solid #6BB9F0"
         },
         ];*/
        var loadMyInfoImageCacheFlag = false;

        var colorList = [
          {
            "background": "#dd1144", "color": "white"
          },
          {
            "background": "#4b8bf4", "color": "white"
          },
          {
            "background": "#F99D32", "color": "white"
          },
          {
            "background": "#5CB281", "color": "white"
          },
          {
            "background": "#6BB9F0", "color": "white"
          },
          {
            "background": "#94c840", "color": "white"
          },
          {
            "background": "#0a9dc7", "color": "white"
          },
          {
            "background": "#e6b500", "color": "white"
          },
          {
            "background": "#d45b7a", "color": "white"
          },
          {
            "background": "#ffabd7", "color": "white"
          }
        ];

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

        var getRandomColor = function (userId) {
          //alert('getRandomColor.userId ' + userId)
          var index;
          try {
            index = parseInt(userId) % 9;
          } catch (e) {
            index = 1;
          }
          //var index = parseInt(Math.random() * 4);
          if (baseConfig.debug) {
            console.log('getRandomColor.Math.random() ' + Math.random())
            console.log('getRandomColor.index ' + index);
            console.log('getRandomColor.colorList[index] ' + angular.toJson(colorList[index]));
          }

          //alert('getRandomColor.index ' + index)

          return colorList[index];
        };

        this.setMyInfoImageCacheFlag = function (flag) {
          loadMyInfoImageCacheFlag = flag;
        };

        this.getMyInfoImageCacheFlag = function (flag) {
          return loadMyInfoImageCacheFlag;
        };

        this.getRandomColor = function (userId) {
          return getRandomColor(userId);
        };

        this.getCachedNotifyList = function () {
          var list = [];
          angular.forEach(notifyList, function (data) {
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
                notifyList[j].selected = true;
                notifyList[j].deleteAnimate = false;
                messageList.push(notifyList[j]);
              }
            }
            friendList[i].deleteAnimate = false;
            messageList.push(friendList[i]);
          }
          for (var ii = 0; ii < notifyList.length; ii++) {
            if (!notifyList[ii].selected) {
              notifyList[ii].deleteAnimate = false;
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

            if (userIcon.indexOf("http://") == 0) {
            } else {
              userIcon = '';
            }

            if (userName.length == 2) {
              imgName = userName;
            } else if (userName.length == 3) {
              imgName = userName.substr(1, 2);
            } else {
              imgName = userName.substr(0, 1);
            }

            var item = {
              "name": userName,
              "content": data.message.content,
              "imgUrl": userIcon,
              "imgName": imgName,
              "imgColorStyle": getRandomColor(data.message.sendId),
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

                if (messageDetail.messageTypeCode != 'work_flow') {
                  totalMessageCount = totalMessageCount + parseInt(messageDetail.messageNum);
                  var notify = {
                    "name": notifyType[messageDetail.messageTypeCode].name,
                    "content": messageDetail.messageContent,
                    "imgUrl": notifyType[messageDetail.messageTypeCode].imgUrl,
                    "imgName": "",
                    "imgColorStyle": "",
                    "count": messageDetail.messageNum,
                    "employee": "",
                    "time": messageDetail.compareTime,
                    "messageType": messageType.notify,
                    "sortTime": filterData(messageDetail.latestMessageTime),
                    "conversationType": messageDetail.messageTypeCode,
                    "deleteAnimate": false
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
                window.plugins.jPushPlugin.setBadge(totalMessageCount);
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
            var callImgUrl = baseInfo.avatar;
            if (baseInfo.avatar != '' || baseInfo.avatar) {
            } else {
              callImgUrl = '';
            }
            HandIMPlugin.callNetPhone(function () {
            }, function () {
            }, baseInfo.emp_code, baseInfo.emp_name, callImgUrl);
            return true;
          } else if (btnIndex == 3) {
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
            window.plugins.jPushPlugin.setBadge(badgeNumber);
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
        };


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
                myscope.employeeList = [];
                angular.forEach(response.rows, function (data) {
                  if (data.avatar && data.avatar != "") {
                    data.avatar = data.avatar + '64';
                  }
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
        };

        function toIPhoneModel(model) {
          var dictionary = {
            "i386"    :"Simulator",
            "x86_64"  :"Simulator",
            "iPod1,1":"iPod Touch",         // (Original)
            "iPod2,1":"iPod Touch 2",       // (Second Generation)
            "iPod3,1":"iPod Touch 3",       // (Third Generation)
            "iPod4,1":"iPod Touch 4",       // (Third Generation)
            "iPod7,1":"iPod Touch 6",       // (6th Generation)
            "iPhone1,1":"iPhone",           // (Original)
            "iPhone1,2":"iPhone 3G",        // (3G)
            "iPhone2,1":"iPhone 3GS",       // (3GS)
            "iPad1,1":"iPad",               // (Original)
            "iPad2,1":"iPad 2",             // (2nd Generation)
            "iPad3,1":"new iPad",           // (3rd Generation)
            "iPhone3,1":"iPhone 4",         // (GSM)
            "iPhone3,3":"iPhone 4",         // (CDMA/Verizon/Sprint)
            "iPhone4,1":"iPhone 4S",
            "iPhone5,1":"iPhone 5",         // (model A1428, AT&T/Canada)
            "iPhone5,2":"iPhone 5",         // (model A1429, everything else)
            "iPad3,4":"iPad 4th Generation",// (4th Generation)
            "iPad2,5":"iPad Mini",          // (Original)
            "iPhone5,3":"iPhone 5c",        // (model A1456, A1532 | GSM)
            "iPhone5,4":"iPhone 5c",        // (model A1507, A1516, A1526 (China), A1529 | Global)
            "iPhone6,1":"iPhone 5s",        // (model A1433, A1533 | GSM)
            "iPhone6,2":"iPhone 5s",        // (model A1457, A1518, A1528 (China), A1530 | Global)
            "iPhone7,1":"iPhone 6 Plus",
            "iPhone7,2":"iPhone 6",
            "iPhone8,1":"iPhone 6S",
            "iPhone8,2":"iPhone 6S Plus",
            "iPhone8,4":"iPhone SE",
            "iPhone9,1":"iPhone 7",
            "iPhone9,3":"iPhone 7",
            "iPhone9,2":"iPhone 7 Plus",
            "iPhone9,4":"iPhone 7 Plus",
            "iPad4,1":"iPad Air",           // 5th Generation iPad (iPad Air) - Wifi
            "iPad4,2":"iPad Air",           // 5th Generation iPad (iPad Air) - Cellular
            "iPad4,4":"iPad Mini",          // (2nd Generation iPad Mini - Wifi)
            "iPad4,5":"iPad Mini",          // (2nd Generation iPad Mini - Cellular)
            "iPad4,7":"iPad Mini",          // (3rd Generation iPad Mini - Wifi (model A1599))
            "iPad6,7":"iPad Pro (12.9\")",  // iPad Pro 12.9 inches - (model A1584)
            "iPad6,8":"iPad Pro (12.9\")",  // iPad Pro 12.9 inches - (model A1652)
            "iPad6,3":"iPad Pro (9.7\")",   // iPad Pro 9.7 inches - (model A1673)
            "iPad6,4":"iPad Pro (9.7\")"    // iPad Pro 9.7 inches - (models A1674 and A1675)
          };
          if(dictionary[model]){
            return dictionary[model];
          } else {
            return "Unknown IOS model";
          }
        }

        this.registerDeviceInfo = function () {
          var url = baseConfig.queryPath + '/device/insertOrUpdate';

          var model;
          var appVersion = baseConfig.version.currentVersion + '.' + baseConfig.version.currentSubVersion;
          if( ionic.Platform.isIOS() ){
            model = toIPhoneModel(device.model);
          } else {
            model  = device.model;
          }

          var params = {
            "deviceBrand": model,
            "deviceType": device.manufacturer,
            "operationSystem": device.platform,
            "operationSystemVersion": device.version,
            "clientVersion": appVersion,
            "ime": device.uuid,
            "width": window.innerWidth,
            "height": window.innerHeight,
            "pixelRatio": window.devicePixelRatio
          };
          alert('registerDeviceInfo.params ' + angular.toJson(params));
          hmsHttp.post(url, params).success(function (result) {
            alert('registerDeviceInfo.result ' + angular.toJson(result));
          }).error(function (response, status) {
          });
        }
      }]);
