/**
 * Created by gusenlin on 16/4/24.
 */
angular.module('messageModule')

  .controller('messageCtrl', [
    '$scope',
    '$state',
    '$timeout',
    function ($scope,
              $state,
              $timeout) {

      $scope.messageList = [
        {
          user: "模版1",
          content: "内容1"
        },
        {
          user: "模版2",
          content: "内容2"
        },
        {
          user: "模版3",
          content: "内容3"
        },
        {
          user: "模版4",
          content: "内容4"
        },
        {
          user: "模版5",
          content: "内容5"
        },
        {
          user: "模版6",
          content: "内容6"
        },
        {
          user: "模版7",
          content: "内容7"
        },
        {
          user: "模版8",
          content: "内容8"
        },
        {
          user: "模版9",
          content: "内容9"
        },
        {
          user: "模版10",
          content: "内容10"
        }
      ];

      $scope.talk = function (message) {
        console.log('$scope.talk');
        $state.go("tab.messageDetail", {message: message});
      };

      $scope.refresh = function(){
        $timeout(function(){
          $scope.$broadcast("scroll.refreshComplete");
        },2000);
      };

      console.log('messageCtrl.enter');

      $scope.$on('$ionicView.enter', function (e) {
        console.log('messageCtrl.$ionicView.enter');
      });

      $scope.$on('$destroy', function (e) {
        console.log('messageCtrl.$destroy');
      });

    }]);
