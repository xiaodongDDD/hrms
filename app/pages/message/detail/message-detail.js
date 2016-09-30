/**
 * Created by gusenlin on 16/4/24.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.message-detail', {
          url: 'message/detail',
          views: {
            'tab-message': {
              templateUrl: 'build/pages/message/detail/message-detail.html',
              controller: 'messageDetailCtrl'
            }
          },
          params: {
            'messageDetail': {}
          }
        });
    }]);

angular.module('messageModule')

  .controller('messageDetailCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    '$ionicHistory',
    '$ionicPlatform',
    'baseConfig',
    'messageService',
    function ($scope,
              $state,
              $stateParams,
              $ionicHistory,
              $ionicPlatform,
              baseConfig,
              messageService) {

      $scope.customZoom = {
        width: document.body.scrollWidth,
        height: document.body.scrollHeight
      };

      window.frames("sFrameName").document.body.style.zoom = "50%";

      $scope.loadMoreDataFlag = false;

      var messageDetail = $stateParams.messageDetail;

      $scope.detailTitle = messageDetail.name;

      $scope.messageDetailList = [];

      var currentPage = 1;

      //将页面的导航bar设置成白色
      $ionicPlatform.ready(function () {
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
      });

      function getDetail(loadMoreFlag) {
        var success = function (result) {
          if (result.returnCode == 'S') {
            //$scope.messageDetailList = [];
            angular.forEach(result.returnData, function (data) {
              var message = {
                "messageId": data.messageId,
                "pushMessageId": data.pushMessageId,
                "sendTime": data.sendTime,
                "status": data.status,
                "messageContent": data.messageContent,
              };

              if (data.messageDetail) {
                message.messageDetailDesc = data.messageDetail;
              }

              if (data.messageSecret) {
                message.detail = {
                  "instanceId": "",
                  "nodeId": "",
                  "recordId": "",
                  "workflowId": ""
                };
                angular.forEach(data.messageSecret,function (data) {
                  if(data.name == 'sourceInstanceId'){
                    message.detail.instanceId = data.value;
                  }
                  if(data.name == 'nodeId'){
                    message.detail.nodeId = data.value;
                  }
                  if(data.name == 'recordId'){
                    message.detail.recordId = data.value;
                  }
                  if(data.name == 'workflowId'){
                    message.detail.workflowId = data.value;
                  }
                });

                message.messageDetailDesc = data.messageDetail;
              }

              $scope.messageDetailList.push(message);
            });

            if(result.returnData.length >= 10){
              $scope.loadMoreDataFlag = true;
            }
            else{
              $scope.loadMoreDataFlag = false;
            }
          }

          if(loadMoreFlag){
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        };
        var error = function () {
          if(loadMoreFlag){
            $scope.$broadcast('scroll.infiniteScrollComplete');
          }
        };
        messageService.getMessageDetail(success, error, messageDetail.conversationType, currentPage);
      };


      var goWorkflowDetail = function (workflowDetail) {
        if(workflowDetail.detail){
          var detail = {
            "recordId": workflowDetail.detail.recordId,
            "workflowId": workflowDetail.detail.workflowId,
            "instanceId": workflowDetail.detail.instanceId,
            "nodeId": workflowDetail.detail.nodeId
          };
          $state.go('tab.tab-message-pushDetail', {
            "detail": detail,
            "processedFlag": {value: true},
            "type": "PUSHDETAIL"
          });
        }
      };

      $scope.readMessage = function (messageDetail) {
        goWorkflowDetail(messageDetail);
        if(messageDetail.status == 'COMPLETE'){
          return;
        }
        var messageList = [
          {
            "messageId": messageDetail.messageId,
            "actionCode": "change"
          }
        ]
        var success = function (result) {
          if(baseConfig.debug){
            console.log('messageService.getMessageProcess success result')
          }
          if(result.returnCode == 'S'){
            messageDetail.status = 'COMPLETE';

            if(ionic.Platform.isIOS()) {
              messageService.changeBadgeNumber();
            }
          }
        };
        var error = function (response) {
        };
        messageService.getMessageProcess(success,error,messageList);
      };

      getDetail(false);

      $scope.loadMoreData = function () {
        currentPage = currentPage + 1;
        if(angular)
        getDetail(true);
      };

      if (baseConfig.debug) {
        console.log('messageDetail : ' + angular.toJson(messageDetail));
      }

      $scope.goBack = function () {
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
