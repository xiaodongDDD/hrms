/**
 * Created by gusenlin on 2016/11/22.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.test', {
          url: '/test',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/test/test.html',
              controller: 'testCtrl'
            }
          }
        })
    }]);

angular.module('applicationModule')
  .controller('testCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    '$ionicHistory',
    '$ionicGesture',
    '$location',
    '$anchorScroll',
    function ($scope,
              $rootScope,
              $state,
              $ionicHistory,
              $ionicGesture,
              $location,
              $anchorScroll) {

      $scope.list = [];
      $scope.statusBar = [];

      $scope.elementList = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
      ];

      function getDate(element, index) {
        var item = {
          "header": element,
          "elementList": []
        };
        for (var i = 0; i < index; i++) {
          item.elementList.push(
            {
              "element": i
            }
          )
        }
        return item;
      }

      angular.forEach($scope.elementList, function (data, i) {
        var index = (i % 8);
        if (index >= 5) {
          index = 8 - index;
        }

        index = index * 12;

        var item = {
          "element": data,
          "style": {
            "color": "gray",
            "height": "16px",
            "line-height": "16px",
            "margin-left": 0 + "px"
          }
        };

        $scope.statusBar.push(item);
        $scope.list.push(getDate(data, i + 5));
      });

      $scope.contactQuick = function (item) {
        console.log('contactQuick...');
        $location.hash('element' + item);
        $anchorScroll();
        //location.hash="#elementC";
      };

      var element = angular.element(document.querySelector('#contactQuickHandle'));

      var currentElement = '';

      var roundRate = 9;
      var offset = 25;

      var offsetList = [
        25 * 5,
        25 * 4.6,
        25 * 4.2,
        25 * 3.8,
        25 * 3.2,
        25 * 2.5,
        25 * 2.2,
        25 * 1.8,
        25 * 1,
      ]

      function animate(index) {
        angular.forEach($scope.statusBar, function (data) {
          data.style = {
            "color": "gray",
            "height": "16px",
            "line-height": "16px",
            "margin-left": "0px"
          };
        });


        console.log('animate index ' + index);

        if (index < roundRate) {
          for (var i = 0; i < index + roundRate; i++) {
            var leftIndex1 = offsetList[Math.abs(index - i)];
            $scope.statusBar[i].style = {
              "color": "gray",
              "height": "16px",
              "line-height": "16px",
              "margin-left": (0 - leftIndex1) + "px"
            };
            console.log('animate i ' + i);
            console.log('animate leftIndex ' + leftIndex1);
            console.log('animate index ' + angular.toJson($scope.statusBar[index].style));
          }
        } else {
          for (var i = index - roundRate + 1; i < index + roundRate; i++) {
            var leftIndex1 = offsetList[Math.abs(index - i)];
            if ($scope.statusBar[i]) {
              $scope.statusBar[i].style = {
                "color": "gray",
                "height": "16px",
                "line-height": "16px",
                "margin-left": (0 - leftIndex1) + "px"
              };
            }
          }
        }
      }

      //拖拽标记TimeSheet具体天
      $ionicGesture.on("drag", function (e) {
        //e.preventDefault();
        var top = 100;
        var element = '';
        for (var i = 0; i < 26; i++) {
          if (e.gesture.touches[0].pageY > (top + (i) * 16) && e.gesture.touches[0].pageY <= (top + (i + 1) * 16)) {
            element = $scope.elementList[i];
            if (currentElement === '' || currentElement != element) {
              console.log('drag.startTouchX ' + e.gesture.touches[0].pageX);
              console.log('drag.startTouchY ' + e.gesture.touches[0].pageY);
              console.log('currentElement: ' + currentElement);
              console.log('element: ' + element)
              currentElement = element;
              animate(i);
              $location.hash('element' + element);
              $anchorScroll();
              $scope.$apply();
            }
          }
        }
        //console.log('drag.startTouchX ' + e.gesture.touches[0].pageX);
        //console.log('drag.startTouchY ' + e.gesture.touches[0].pageY);
      }, element);

      $ionicGesture.on("touch", function (e) {
        console.log('drag.startTouchX ' + e.gesture.touches[0].pageX);
        console.log('drag.startTouchY ' + e.gesture.touches[0].pageY);
      }, element);

      $ionicGesture.on("release", function (e) {
        console.log('drag.startTouchX ' + e.gesture.touches[0].pageX);
        console.log('drag.startTouchY ' + e.gesture.touches[0].pageY);
        angular.forEach($scope.statusBar, function (data) {
          data.style = {
            "color": "gray",
            "height": "16px",
            "line-height": "16px",
            "margin-left": "0px"
          };
        });
        $scope.$apply();
      }, element);
    }]);
