/**
 * Created by wkh on 2016/11/30.
 */
angular.module('contactModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.addressBook', {
          url: '/addressBook',
          views: {
            'tab-contact': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/contact/addressBook/addressBook.html',
              controller: 'addressBookCtrl'
            }
          }
        })
    }]);
angular.module('contactModule')
  .controller('addressBookCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$ionicHistory',
    '$ionicGesture',
    '$location',
    '$anchorScroll',
    '$timeout',
    'TestContactService',
    'hmsPopup',
    'contactLocal',
    function ($scope,
              $rootScope,
              $state,
              $ionicHistory,
              $ionicGesture,
              $location,
              $anchorScroll,
              $timeout,
              TestContactService,
              hmsPopup,
              contactLocal) {

      $scope.list = [];

      $scope.click = function (item) {
        console.log('testContactCtrl.$scope.click ...');
      };
     var num =CC2PYF(9);
      console.log(num);
      $scope.chooseItem = function (item) {
        console.log(item);
      };
/*      $timeout(function () {*/
        $scope.list = [
          {
            "header": "#",
            "elementList": []
          }, {
            "header": "A",
            "elementList": []
          }, {
            "header": "B",
            "elementList": []
          }, {
            "header": "C",
            "elementList": []
          }, {
            "header": "D",
            "elementList": []
          }, {
            "header": "E",
            "elementList": []
          }, {
            "header": "F",
            "elementList": []
          }, {
            "header": "G",
            "elementList": []
          }, {
            "header": "H",
            "elementList": []
          }, {
            "header": "I",
            "elementList": []
          }, {
            "header": "J",
            "elementList": []
          }, {
            "header": "K",
            "elementList": []
          }, {
            "header": "L",
            "elementList": []
          }, {
            "header": "M",
            "elementList": []
          }, {
            "header": "N",
            "elementList": []
          }, {
            "header": "O",
            "elementList": []
          }, {
            "header": "P",
            "elementList": []
          }, {
            "header": "Q",
            "elementList": []
          }, {
            "header": "R",
            "elementList": []
          },
          {
            "header": "S",
            "elementList": []
          },
          {
            "header": "T",
            "elementList": []
          },
          {"header": "U", "elementList": []},
          {
            "header": "V",
            "elementList": []
          }, {
            "header": "W",
            "elementList": []
          }, {
            "header": "X",
            "elementList": []
          }, {
            "header": "Y",
            "elementList": []
          }, {
            "header": "Z",
            "elementList": []
          }];
        $scope.findAddressBook = function () {
          hmsPopup.showLoading("加载中...");
          console.log("in");
          ContactsPlugin.pickContact(getContactSuccess, onError);
          // contactLocal.findLocal(onSuccess, onError);
        };
        $scope.findAddressBook();

        function getContactSuccess(result){
          console.log("success");
          hmsPopup.hideLoading();
          hmsPopup.showPopup(JSON.stringify(result))
        }

        // onSuccess: Get a snapshot of the current contacts
        function onSuccess(contacts) {
          hmsPopup.hideLoading();
          // 联系人与电话号码 全写在这儿
          var aResult = [];
          if (ionic.Platform.isIOS()) {
            console.log("ios");
            console.log(contacts[i]);
            alert(angular.toJson(contacts[i]));
          }
          var name = "";
          for (var i = 0; contacts[i]; i++) {
            console.log(contacts[i]);
            if (ionic.Platform.isIOS()) {
              console.log("name" + contacts[i].familyName + contacts[i].givenName);
              if (typeof(contacts[i].familyName) == "undefined") {
                $scope.familyName = ""
              }
              name = $scope.familyName + contacts[i].name.givenName;
              console.log(contacts[i].name + "ios name");
            }
            if (ionic.Platform.isAndroid()) {
              name = contacts[i].displayName;
            }
            console.log("Display Name = " + contacts[i].displayName);
            if (contacts[i].phoneNumbers && contacts[i].phoneNumbers.length) {

              var contactPhoneList = [];

              for (var j = 0; contacts[i].phoneNumbers[j]; j++) {
                // alert(contacts[i].phoneNumbers[j].type+"	"+contacts[i].displayName+"---------" + contacts[i].phoneNumbers[j].value );

                contactPhoneList.push(
                  {
                    'type': contacts[i].phoneNumbers[j].type,
                    'value': contacts[i].phoneNumbers[j].value
                  }
                );

              }

              aResult.push({
                name: name,
                phone: contactPhoneList
              });

            }
            //
          }
          $scope.addressBook = aResult;
          console.log(aResult);
          console.log("----------------");
          console.log($scope.addressBook);
          for (var i = 0; i < $scope.list.length; i++) {
            for (var j = 0; j < $scope.addressBook.length; j++) {
              if($scope.addressBook[j].name==null||$scope.addressBook[j].name.substr(0,1)<='9'){
                var tem = {
                  element: $scope.addressBook[j].name,
                  phone: $scope.addressBook[j].phone
                };
                if($scope.addressBook[j].phone){
                  $scope.list[0].elementList.push(tem);
                }
              }else{
                var t = CC2PYF($scope.addressBook[j].name).substr(0, 1);
                console.log(t);
                if ($scope.list[i].header == t) {
                  var tem = {
                    element: $scope.addressBook[j].name,
                    phone: $scope.addressBook[j].phone
                  };
                  console.log($scope.list[i]);
                  $scope.list[i].elementList.push(tem);
                  console.log($scope.list[i]);
                }
              }
            }
          }
          console.log($scope.list);
          $scope.$apply();
          return $scope.list;
        }

        /*     /!*   $timeout(function () {

         }, 400);*!/*/
        // onError: Failed to get the contacts
        function onError(contactError) {
          console.log("error");
          hmsPopup.hideLoading();
        }
         }])
  .service('TestContactService',
  function () {

    var elementList = [
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];

    this.generateContactList = function (contactList) {
      var list = {};
      var result = [];
      angular.forEach(elementList, function (data) {
        list[data] = [];
      });

      angular.forEach(contactList.rows, function (data1) {
        //console.log('data1 ' + angular.toJson(data1))
        if (!list[data1.pinYinC] || list[data1.pinYinC].length < 20) {
          if (list[data1.pinYinC]) {
            list[data1.pinYinC].push({
              "element": data1.name
            })
          } else {
            list[data1.pinYinC] = [{
              "element": data1.name
            }]
          }
        }
      });

      angular.forEach(elementList, function (data2) {
        var item = {
          "header": data2,
          "elementList": list[data2]
        };
        result.push(item);
      });

      return result;
    }
  })

  .directive('contactQuickBar', function () {
    return {
      restrict: 'E',
      replace: true,
      require: ['contactQuickBar'],
      controller: 'contactQuickBarCtrl',
      template: '<div><div class="contact-quick-bar-header" ng-if="showHeaderFlag" ng-bind="contactHeaderItem"></div>' +
      '<div class="contact-quick-bar" ng-style="quickBarStyle">' +
      '<div class="contact-quick-content" id="contactQuickHandle" ng-style="quickContentStyle">' +
      '<div ng-repeat="item in quickSearchBar" ng-style="item.style">' +
      '<div ng-bind="item.element" ng-click="contactQuick(item.element)">' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div></div>',
      link: function ($scope, $element, $attrs, ctrls) {

        var contactCtrl = ctrls[0];
        console.log(typeof(angular.element('#contactQuickHandle')));
        console.log(angular.element('#contactQuickHandle'));
        console.log(angular.element('#contactQuickHandle')[0].offsetTop);
        console.log(angular.element('#contactQuickHandle')[0].offsetHeight);

        var offsetTop = angular.element('#contactQuickHandle')[0].offsetTop;
        contactCtrl.init(offsetTop);
      }
    }
  }
)
  .controller('contactQuickBarCtrl', [
    '$scope',
    '$state',
    '$attrs',
    '$ionicBind',
    '$ionicGesture',
    '$location',
    '$anchorScroll',
    function ($scope,
              $state,
              $attrs,
              $ionicBind,
              $ionicGesture,
              $location,
              $anchorScroll) {
      var self = this;

      //字母检索栏的字母的默认大小
      var barDefaultElementSize = '12px';

      //字母检索栏的字母的默认颜色
      var barDefaultElementColor = 'blue';

      //字母检索栏的字母的默认占用高度
      var barDefaultElementHeight = 16;

      var touchDefaultOffset = 3;

      //字母检索栏的默认高度，后面可以根据屏幕尺寸设置自适应匹配
      var barDefaultHeight = barDefaultElementHeight * 26;

      //字母检索栏的默认背景颜色
      var barDefaultBackground = 'gray';

      //当前选中的字母
      var currentElement = '';

      //字母检索滑动动画的半径
      var roundRate = 9;

      var elementNum = 26;

      $scope.contactHeaderItem = '';

      $scope.showHeaderFlag = false;

      //字母检索滑动动画的偏移系数
      var offsetList = [
        1,
        0.97,
        0.94,
        0.9,
        0.826,
        0.749,
        0.67,
        0.559,
        0.38
      ];

      var elementBarTopHeight = 44;
      var barElementHeight;
      var touchOffset;

      //是否显示快速检索的动画
      var showAnimate;

      if (angular.isDefined($attrs.showAnimate) && $attrs.showAnimate == 'true') {
        showAnimate = true;
      } else {
        showAnimate = false;
      }

      if (!angular.isDefined($attrs.barElementSize) || $attrs.barElementSize === '') {
        $attrs.$set('barElementSize', barDefaultElementSize);
      }
      if (!angular.isDefined($attrs.barElementColor) || $attrs.barElementColor === '') {
        $attrs.$set('barElementColor', barDefaultElementColor);
      }
      if (!angular.isDefined($attrs.barElementHeight) || $attrs.barElementHeight === '') {
        $attrs.$set('barElementHeight', barDefaultElementHeight);
      }
      if (!angular.isDefined($attrs.barBackground) || $attrs.barBackground === '') {
        $attrs.$set('barBackground', barDefaultBackground);
      }
      if (!angular.isDefined($attrs.touchOffset) || $attrs.touchOffset === '') {
        $attrs.$set('touchOffset', touchDefaultOffset);
      }

      try {
        barElementHeight = parseInt($attrs.barElementHeight);
        if (barElementHeight > 20) {
          barElementHeight = barDefaultElementHeight;
          console.log('字符的高度不能超过20');
        }
      }
      catch (e) {
        console.log('字符的高度必须为数字');
        barElementHeight = barDefaultElementHeight;
      }

      try {
        touchOffset = parseInt($attrs.touchOffset);
        if (touchOffset < 1 || touchOffset >= $attrs.barElementHeight) {
          touchOffset = barDefaultElementHeight;
          console.log('字符的高度不能超过20');
        }
      }
      catch (e) {
        console.log('字符的高度必须为数字');
        touchOffset = barDefaultElementHeight;
      }

      var barActualHeight = barDefaultHeight;

      var offsetTop = (parseInt($attrs.barHeight) + 44) / 2;

      if (ionic.Platform.isIOS()) {
        offsetTop = (parseInt($attrs.barHeight) + 64) / 2;
        //elementBarTopHeight = elementBarTopHeight + 24;
      }

      $scope.quickContentStyle = {
        "margin-top": "90px",
        "height": barActualHeight + "px"
      };

      $ionicBind($scope, $attrs, {
        $onElementClick: '&onElementClick',
        $onElementTouched: '&onElementTouched'
      });

      console.log('ctrl.barElementSize ' + $attrs.barElementSize);
      console.log('ctrl.barElementColor ' + $attrs.barElementColor);
      console.log('ctrl.barElementHeight ' + $attrs.barElementHeight);
      console.log('ctrl.barBackground ' + $attrs.barBackground);
      console.log('ctrl.showAnimate ' + showAnimate);

      //快速检索条
      $scope.quickSearchBar = [];

      $scope.elementList = [
       "#", 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
      ];

      //初始化数据
      self.init = function (offsetTop) {

        console.log('contactQuickBarCtrl.init offsetTop ' + offsetTop);

        angular.forEach($scope.elementList, function (data) {
          var item = {
            "element": data,
            "style": getElementStyle(0)
          };
          $scope.quickSearchBar.push(item);
        });

        barActualHeight = $attrs.barElementHeight * elementNum;
        var topHeightOffset = (barDefaultHeight - barActualHeight) / 2;

        var offset = offsetTop + topHeightOffset;

        elementBarTopHeight = elementBarTopHeight + offsetTop + topHeightOffset;

        console.log('contactQuickBarCtrl.init offset ' + offset);
        console.log('contactQuickBarCtrl.init elementBarTopHeight ' + elementBarTopHeight);

        $scope.quickContentStyle = {
          "margin-top": offset + "px",
          "width": 20 + "px",
          "height": barActualHeight + "px"
        };

        $scope.quickBarStyle = {
          "background": $attrs.barBackground
        }
      };

      $scope.contactQuick = function (item) {
        console.log('contactQuick...');
        if ($scope.$onElementClick) {
          $scope.$onElementClick();
        }


        //正式使用
        //$location.hash('element' + item);
        //$anchorScroll();
        //只是为了演示使用
        document.getElementById('element' + item).scrollIntoView();
      };

      var element = angular.element(document.querySelector('#contactQuickHandle'));

      function isLocateToElement(top, y, index) {
        /*console.log('isLocateToElement top ' + top);
         console.log('isLocateToElement y ' + y);
         console.log('isLocateToElement index ' + index);*/

        if (y > (top + (index) * $attrs.barElementHeight) + $attrs.touchOffset
          && y <= (top + (index + 1) * $attrs.barElementHeight) - $attrs.touchOffset) {
          return true;
        }
        return false;
      }

      function getElementStyle(offset, selectedFlag) {
        if (selectedFlag) {
          return {
            "color": $attrs.barElementColor,
            "font-size": '16px',
            "font-weight": "bold",
            //"border-radius": "8px",
            //"border": "1px solid #f5f5f5",
            "height": $attrs.barElementHeight + "px",
            "line-height": $attrs.barElementHeight + "px",
            "width": "20px",
            "margin-left": (0 - offset) + "px"
          };
        } else {
          return {
            "color": $attrs.barElementColor,
            "font-size": $attrs.barElementSize,
            "height": $attrs.barElementHeight + "px",
            "line-height": $attrs.barElementHeight + "px",
            "width": "20px",
            "margin-left": (0 - offset) + "px"
          };
        }
      }

      function animate(index, showAnimate) {
        angular.forEach($scope.quickSearchBar, function (data) {
          data.style = getElementStyle(0);
        });

        if (!showAnimate) {
          $scope.quickSearchBar[index].style = getElementStyle(0, true);
          return;
        }

        var offset;
        if (index < roundRate) {
          for (var i = 0; i < index + roundRate; i++) {
            offset = $attrs.barElementHeight * roundRate * offsetList[Math.abs(index - i)];
            $scope.quickSearchBar[i].style = getElementStyle(offset);
            if (i == index) {
              $scope.quickSearchBar[i].style = getElementStyle(offset, true);
            }
          }
        } else {
          for (var i = index - roundRate + 1; i < index + roundRate; i++) {
            offset = $attrs.barElementHeight * roundRate * offsetList[Math.abs(index - i)];
            if ($scope.quickSearchBar[i]) {
              $scope.quickSearchBar[i].style = getElementStyle(offset);
              if (i == index) {
                $scope.quickSearchBar[i].style = getElementStyle(offset, true);
              }
            }
          }
        }
      }

      function quickLocate(pageY) {
        for (var i = 0; i < elementNum; i++) {
          if (isLocateToElement(elementBarTopHeight, pageY, i)) {

            /*console.log('quickLocate elementBarTopHeight ' + elementBarTopHeight);
             console.log('quickLocate pageY ' + pageY);
             console.log('quickLocate i ' + i);
             console.log('quickLocate currentElement ' + currentElement);
             console.log('quickLocate $scope.elementList[i] ' + $scope.elementList[i]);*/

            if (currentElement === '' || currentElement != $scope.elementList[i]) {
              $scope.showHeaderFlag = true;
              currentElement = $scope.elementList[i];
              $scope.contactHeaderItem = $scope.elementList[i];
              animate(i, showAnimate);
              $scope.$apply();
              //正式使用
              //$location.hash('element' + $scope.elementList[i]);
              //$anchorScroll();
              //只是为了演示使用
              document.getElementById('element' + $scope.elementList[i]).scrollIntoView();
            }
          }
        }
      }

      //拖拽标记TimeSheet具体天
      $ionicGesture.on("drag", function (e) {
        /*console.log('drag.screenY ' + e.gesture.touches[0].screenY);
         console.log('drag.pageY ' + e.gesture.touches[0].pageY);
         console.log('drag.clientY ' + e.gesture.touches[0].clientY);*/
        quickLocate(e.gesture.touches[0].pageY);
      }, element);

      //
      $ionicGesture.on("touch", function (e) {
        //quickLocate(e.gesture.touches[0].pageY);
      }, element);

      //
      $ionicGesture.on("release", function (e) {
        $scope.showHeaderFlag = false;
        angular.forEach($scope.quickSearchBar, function (data) {
          data.style = getElementStyle(0);
        });
        $scope.$apply();
      }, element);
    }]);
