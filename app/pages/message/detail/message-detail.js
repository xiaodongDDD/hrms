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
                message.detail = {
                  "instanceId": "3771193",
                  "nodeId": "100140",
                  "recordId": "2422700",
                  "workflowId": "10205"
                };
                message.messageDetailDesc = [
                  {"name": "申请人", "value": "顾森林"},
                  {"name": "申请日期", "value": "2016-08-23"},
                  {"name": "描述", "value": "timesheet解冻申请"}
                ];
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
        messageService.getMessageDetail(success, error, messageDetail.type, currentPage);
      }

      $scope.readMessage = function (messageDetail) {
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
            changeBadgeNumber();
          }
        };
        var error = function (response) {
        };
        messageService.getMessageProcess(success,error,messageList);
      };

      var changeBadgeNumber = function () {
        window.plugins.jPushPlugin.getApplicationIconBadgeNumber(function(data) {
          if(baseConfig.debug) {
            console.log("changeBadgeNumber data " + angular.toJson(data));
          }
          var badgeNumber;

          if(parseInt(data) > 0){
            badgeNumber= parseInt(data) -1;
          }else{
            badgeNumber = 0;
          }
          window.plugins.jPushPlugin.setApplicationIconBadgeNumber(badgeNumber);
        });
      }

      getDetail(false);

      $scope.loadMoreData = function () {
        currentPage = currentPage + 1;
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
