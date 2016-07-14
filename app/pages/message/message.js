/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('messageModule')

  .controller('messageCtrl', [
    '$scope',
    '$state',
    '$timeout',
    '$ionicPlatform',
    'imService',
    'checkVersionService',
    'baseConfig',
    function ($scope,
              $state,
              $timeout,
              $ionicPlatform,
              imService,
              checkVersionService,
              baseConfig) {
      $scope.messageList = [];

      //将页面的导航bar设置成白色
      $ionicPlatform.ready(function () {
        if (window.StatusBar) {
          StatusBar.styleLightContent();
        }
      });

      checkVersionService.checkAppVersion();

      $scope.messageList = [
        {
          "name": "石顺",
          "content": "你有一条新的消息!",
          "imgUrl": "http://shp.qpic.cn/bizmp/A3gUw79X8ZtViaeUGB2WuYGEOjNKpibmQ5ymbviaibTjiare6jI0MEtaEBw/",
          "count": "2",
          "employee": "2203",
          "time": "2分钟前"
        },
        {
          "name": "马云飞",
          "content": "你有一条新的消息!",
          "imgUrl": "http://shp.qpic.cn/bizmp/A3gUw79X8ZuKNqopcialjic0LIpP0kibLb1CQ3uau5rptwm0UJOcCbZ8A/",
          "count": "21",
          "employee": "2205",
          "time": "4分钟前"
        },
        {
          "name": "顾森林",
          "content": "你有一条新的消息!",
          "imgUrl": "http://shp.qpic.cn/bizmp/A3gUw79X8ZsbZGDqPVTVyTrINBiasBWrOWBUuYGDXfeovenGoKXA8jA/",
          "count": "20",
          "employee": "3705",
          "time": "8分钟前"
        },
        {
          "name": "史磊",
          "content": "你有一条新的消息!",
          "imgUrl": "http://shp.qpic.cn/bizmp/A3gUw79X8ZtJkHvibqPtwzW2wic8ms1F8bqyo7OcpaianZ3SNC469x3BA/",
          "count": "2",
          "employee": "3719",
          "time": "12分钟前"
        },
        {
          "name": "成志唯",
          "content": "你有一条新的消息!",
          "imgUrl": "http://shp.qpic.cn/bizmp/A3gUw79X8Zvxnl9PXC90GibYIdibIOfiajSgAeWiaXtXnnb75C8raIQe8w/",
          "count": "2",
          "employee": "4040",
          "time": "2小时前"
        },
        {
          "name": "徐方泽",
          "content": "你有一条新的消息!",
          "imgUrl": "http://shp.qpic.cn/bizmp/A3gUw79X8ZsXjlfubzwNBAe1SEfSEtmXf2beEl8mTEYDcRTY8lTySA/",
          "count": "2",
          "employee": "8897",
          "time": "6小时前"
        },
        {
          "name": "陈宇超",
          "content": "你有一条新的消息!",
          "imgUrl": "http://shp.qpic.cn/bizmp/A3gUw79X8ZtQ0S9qBDCFialm32Fh8KB0cKicQ4qiapwZvLiar6jDgzxt2w/",
          "count": "2",
          "employee": "8456",
          "time": "2天前"
        },
        {
          "name": "戴文",
          "content": "你有一条新的消息!",
          "imgUrl": "http://shp.qpic.cn/bizmp/A3gUw79X8ZvhaXAjVjjpv2CBow6GXr6hLicPdbeSUmJ3EOS2DBbNDiaQ/",
          "count": "2",
          "employee": "7963",
          "time": "3天前"
        },
        {
          "name": "汪翔",
          "content": "你有一条新的消息!",
          "imgUrl": "http://shp.qpic.cn/bizmp/A3gUw79X8Zt6eG3xRI1LicHuh2EgmJWibUASkxFy03IfOLfEKRWO6pBw/",
          "count": "2",
          "employee": "9606",
          "time": "10天前"
        }
        /*,
         {
         "name": "王胜",
         "content": "你有一条新的消息!",
         "imgUrl": "",
         "count": "2",
         "employee": "10100"
         }*/
      ];

      $scope.chatWithYou = function (message) {
        if (baseConfig.debug) {
          console.log('message ' + angular.toJson(message));
        }
        var emp = {
          "friendId": message.employee,
          "friendName": message.name
        }
        imService.toNativeChatPage(emp);
      };

      $scope.talk = function (message) {
        console.log('$scope.talk');
        $state.go("tab.messageDetail", {message: message});
      };

      $scope.refresh = function () {
        $timeout(function () {
          $scope.$broadcast("scroll.refreshComplete");
        }, 700);
      };

      console.log('messageCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('messageCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('messageCtrl.$destroy');
      });
    }]);
