/**
 *  modify by shellWolf on 16/06/28.
 */
angular.module('contactModule')
  .controller('ContactCtrl', [
    '$scope',
    '$ionicScrollDelegate',
    '$ionicModal',
    function ($scope,
              $ionicScrollDelegate,
              $ionicModal) {
      /**
       * var section
       */
      {
        $scope.customContactsInfo = [
          {
            name: '小哥',
            tel: '13478654565',
            imgUrl: 'build/img/contact/profile3@3x.png'
          }, {
            name: '成成',
            tel: '13478654565',
            imgUrl: 'build/img/contact/profile2@3x.png'
          }, {
            name: '晴子',
            tel: '13478654565',
            imgUrl: 'build/img/contact/profile1@3x.png'
          }, {
            name: '小鹿',
            tel: '13478654565',
            imgUrl: 'build/img/contact/profile4@3x.png'
          }, {
            name: '小狼',
            tel: '15675348120',
            imgUrl: 'build/img/contact/profile-2@3x.png'
          }, {
            name: '小哥',
            tel: '13478654565',
            imgUrl: 'build/img/contact/profile3@3x.png'
          }, {
            name: '成成',
            tel: '13478654565',
            imgUrl: 'build/img/contact/profile2@3x.png'
          }, {
            name: '晴子',
            tel: '13478654565',
            imgUrl: 'build/img/contact/profile1@3x.png'
          }, {
            name: '小鹿',
            tel: '13478654565',
            imgUrl: 'build/img/contact/profile4@3x.png'
          }, {
            name: '小狼',
            tel: '15675348120',
            imgUrl: 'build/img/contact/profile-2@3x.png'
          }
        ];
        $scope.showTopInput = false; // 默认不显示bar上的搜索框
        var position = ''; //记录滚动条的位置

      }
      $scope.$on('$ionicView.enter', function (e) {
      });

      $scope.$on('$destroy', function (e) {
      });

      $scope.watchScroll = function () { //滚动内容时执行的method
        position = $ionicScrollDelegate.getScrollPosition().top;
        $scope.$apply(function () {
          warn('Now Position:' + position);
          if (position < 30) {
            $scope.showTopInput = false;
          } else if (position >= 30) {
            $scope.showTopInput = true;
          }
        });
      };

      /**
       * modal input 方法区
       */
      $ionicModal.fromTemplateUrl('build/pages/contact/modal/contact-search.html', {
        scope: $scope
      }).then(function (modal) {
        $scope.contactInputModal = modal;
      });
      $scope.goInputModal = function () {
        $scope.contactInputModal.show();
      };

      $scope.hideContactSearch = function () {
        $scope.contactInputModal.hide();
      };

      $scope.searchContacts = function () {

      };

      $scope.selectPerson = function () {

      };

      $scope.goStructure = function () {

      };

      $scope.goDetailInfo = function () {

      };

      $scope.telNumber = function (event, newNumber) {
        event.stopPropagation(); //阻止事件冒泡
        window.location.href = "tel:" + newNumber;
      };

    }]);
