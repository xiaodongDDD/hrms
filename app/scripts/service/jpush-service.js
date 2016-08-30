/**
 * Created by gusenlin on 16/5/21.
 */
angular.module('HmsModule')
  .service('hmsJpushService', [
    'baseConfig',
    'messageService',
    function (baseConfig,
              messageService) {

      this.init = function (state) {
        if (baseConfig.debug) {
          console.log('hmsJpushService.init!! ');
        }
        if (window.plugins.jPushPlugin) {
          var getRegistrationID = function () {
            window.plugins.jPushPlugin.getRegistrationID(onGetRegistrationID);
          };
          var onGetRegistrationID = function (data) {
            try {
              //alert("JPushPlugin:registrationID is " + angular.toJson(data));
              if (baseConfig.debug) {
                console.log("JPushPlugin:registrationID is " + angular.toJson(data));
              }
              if (data.length == 0) {
                var t1 = window.setTimeout(getRegistrationID, 1000);
              }
            } catch (exception) {
              if (baseConfig.debug) {
                console.log(exception);
              }
            }
          };
          var initiateUI = function () {
            try {
              window.plugins.jPushPlugin.init();
              getRegistrationID();
              if (device.platform != "Android") {
                window.plugins.jPushPlugin.setDebugModeFromIos();
                window.plugins.jPushPlugin.setApplicationIconBadgeNumber(0);
              } else {
                window.plugins.jPushPlugin.setDebugMode(true);
                window.plugins.jPushPlugin.setStatisticsOpen(true);
              }
            } catch (exception) {
              if (baseConfig.debug) {
                console.log(exception);
              }
            }
          };

          var analyze = function (currentState) {
            if (currentState.views) {
              if (currentState.views['tab-application']) {
                return 'tab.tab-application-';
              } else if (currentState.views['tab-message']) {
                return 'tab.tab-message-';
              } else if (currentState.views['tab-contact']) {
                return 'tab.tab-contact-';
              } else if (currentState.views['tab-myInfo']) {
                return 'tab.tab-myInfo-';
              }
            }
            return '';
          };


          var readMessage = function (messageId) {
            var messageList = [
              {
                "messageId": messageId,
                "actionCode": "change"
              }
            ]
            var success = function (result) {
              if(baseConfig.debug){
                console.log('messageService.getMessageProcess success result')
              }
              if(result.returnCode == 'S'){
                if(ionic.Platform.isIOS()) {
                  messageService.changeBadgeNumber();
                }
              }
            };
            var error = function (response) {
            };
            messageService.getMessageProcess(success,error,messageList);
          };

          var onOpenNotification = function (event) {
            try {
              var alertContent;
              var result;
              var detail;
              var messageId = '';
              var messageType = '';

              //alert('event ' + angular.toJson(event));
              //alert('window.plugins.jPushPlugin ' + angular.toJson(event));
              //alert('detail ' + angular.toJson(detail));

              if (device.platform == "Android") {
                messageId = window.plugins.jPushPlugin.openNotification.extras.message_id;
                messageType = window.plugins.jPushPlugin.openNotification.extras.message_type;

                alertContent = window.plugins.jPushPlugin.openNotification.alert;
                result = {
                  "type": typeof(window.plugins.jPushPlugin),
                  "value": window.plugins.jPushPlugin
                };
                detail = {
                  "recordId": window.plugins.jPushPlugin.openNotification.extras.source_record_id,
                  "workflowId": window.plugins.jPushPlugin.openNotification.extras.source_workflow_id,
                  "instanceId": window.plugins.jPushPlugin.openNotification.extras.source_instance_id,
                  "nodeId": window.plugins.jPushPlugin.openNotification.extras.source_node_id
                };
              } else {

                messageId = event.message_id;
                messageType = event.message_type;

                alertContent = event.aps.alert;
                result = {
                  "type": typeof(event),
                  "value": event
                };
                detail = {
                  "recordId": event.source_record_id,
                  "workflowId": event.source_workflow_id,
                  "instanceId": event.source_instance_id,
                  "nodeId": event.source_node_id
                };
              }
              if (baseConfig.debug) {
                console.log("open Notification event: " + event);
              }

              /*workFLowListService.getDetailBase(success, error, detailId.recordId,
               detailId.workflowId, detailId.instanceId, detailId.nodeId);*/

              if(messageType == "work_flow"){
                state.go(analyze(state.current) + 'pushDetail', {
                  "detail": detail,
                  "processedFlag": {value: true},
                  "type": "PUSHDETAIL"
                });
                if(ionic.Platform.isIOS()) {
                  readMessage(messageId);
                }
              }

              //state.go('detail', {content: result});
              //state.go('push.pushDetail',{content:alertContent});

            } catch (exception) {
              console.log("JPushPlugin:onOpenNotification" + exception);
            }
          };
          document.addEventListener("jpush.openNotification", onOpenNotification, false);
          initiateUI();
        }
      };

      this.bind = function (userName) {
        try {
          var alias = userName;
          var tags = [];
          tags.push(userName);
          window.plugins.jPushPlugin.setTagsWithAlias(tags, alias);
        } catch (exception) {
          if (baseConfig.debug) {
            console.log(exception);
          }
        }
      }
    }]);
