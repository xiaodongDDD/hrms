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
        };

        this.getNotifyMessageList = function (myscope) {
          var success = function (result) {
            if (result.returnCode == 'S') {
              angular.forEach(result.returnData, function (messageDetail) {
                angular.forEach(myscope.notifyMessageList, function (data) {
                  if (messageDetail.messageTypeCode == data.type) {
                    data.count = messageDetail.messageNum;
                    data.content = messageDetail.messageContent;
                    return;
                  }
                });
              });
              //myscope.$apply();
            }
          };
          var error = function (response) {
          };
          this.getMessageSummary(success, error);
        };

        this.deletePluginMessage = function (myscope, message) {
          var success = function () {
            var index = myscope.messageList.indexOf(message);
            myscope.messageList.splice(index, 1);
            myscope.$apply();
          };
          var error = function () {
          };
          HandIMPlugin.deleteConversationList(success, error, message.employee);
        };

        this.getEmployeeMessageList = function (myscope, result) {
          var userIcon;
          var userName;
          myscope.employeeMessageList = [];
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
            myscope.employeeMessageList.push(item);
          });
          myscope.$apply();
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

        this.getMessageDetail = function (success, error,type,page) {
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
      }]);
