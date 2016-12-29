/**
 * @ngdoc directive
 * @name hideTabs
 * @module utilModule
 * @description
 * This is the http interceptor
 * @author
 * gusenlin
 */
HmsModule.directive('hideTabs', ['$rootScope', function ($rootScope) {
    return {
      restrict: 'A',
      link: function (scope, element, attributes) {
        scope.$on('$ionicView.beforeEnter', function () {
          scope.$watch(attributes.hideTabs, function (value) {
            console.log('$ionicView.beforeEnter value ' + value);
            if (value) {
              $rootScope.hideTabs = false;
            }
            else {
              $rootScope.hideTabs = true;
            }
          });
        });

        scope.$on('$ionicView.beforeLeave', function () {
          $rootScope.hideTabs = true;
          console.log('$ionicView.beforeLeave value ');
        });
      }
    };
  }])
  .directive('elasticImage', ['$ionicScrollDelegate', function ($ionicScrollDelegate) {
    return {
      restrict: 'A',
      link: function ($scope, $scroller, $attr) {
        var image = document.getElementById($attr.elasticImage);
        var imageHeight = image.offsetHeight;
        var currentBrightness = '';
        var brightness5 = "blur(0px) brightness(0.7)";
        var brightness4 = "blur(0px) brightness(1)";
        var brightness1 = "blur(0px) brightness(1)";
        currentBrightness = brightness5;

        $scroller.bind('scroll', function (e) {
          var scrollTop = e.detail.scrollTop;

          //console.log('scrollTop ' + scrollTop);

          var newImageHeight = imageHeight - scrollTop;
          /////////
          var calculation = 0;
          var blur = 0;
          var brightness = 0;
          if (newImageHeight < 0) {
            newImageHeight = 0;
            calculation = 0;
          }
          if (scrollTop <= 0) {

            if (-scrollTop >= 0 && -scrollTop < 60) {
              if (currentBrightness != brightness5) {
                currentBrightness = brightness5;
                image.style.filter = currentBrightness;
                image.style.webkitFilter = currentBrightness;
              }
            }
            if (-scrollTop >= 60 && -scrollTop < 120) {
              if (currentBrightness != brightness4) {
                currentBrightness = brightness4;
                image.style.filter = currentBrightness;
                image.style.webkitFilter = currentBrightness;
              }
            }

            if (-scrollTop >= 120) {
              if (currentBrightness != brightness1) {
                currentBrightness = brightness1;
                image.style.filter = currentBrightness;
                image.style.webkitFilter = currentBrightness;
              }
            }
          }
          //if(scrollTop<0){
          //  if(-scrollTop<175){
          //    calculation=-scrollTop/175;
          //    blur = 5*calculation;
          //    blur = 5-blur;
          //    brightness = 0.3*calculation;
          //    brightness = 0.7+brightness;
          //    image.style.filter = "blur("+blur+"px) "+"brightness("+brightness+")";
          //    image.style.webkitFilter = "blur("+blur+"px) "+"brightness("+brightness+")";
          //  }
          //}
          image.style.height = newImageHeight + 'px';
          $scope.$apply();
        });
      }
    }
  }])

  .directive('elasticImage2', ['$ionicScrollDelegate', function ($ionicScrollDelegate) {
    return {
      restrict: 'A',
      link: function ($scope, $scroller, $attr) {
        var image = document.getElementById($attr.elasticImage2);
        var imageHeight = 200;//image.offsetHeight;

        $scroller.bind('scroll', function (e) {
          if(e.detail.scrollTop <= 0){
            var scrollTop = e.detail.scrollTop;
            var newImageHeight = imageHeight - scrollTop;
            image.style.height = newImageHeight + 'px';
          }else{
            var newImageHeight = imageHeight;
            image.style.height = newImageHeight + 'px';
          }
          $scope.$apply();
        });
      }
    }
  }])

  .directive('circleRotate', ['$timeout','baseConfig', function ($timeout,baseConfig) {
    return {
      restrict: 'A',
      link: function ($scope, $scroller, $attr) {
        var params = $attr.circleRotate;
        var domsId = params.split(',');
        if(baseConfig.debug){
          console.log(domsId);
        }
        if (domsId[0] == "dorm-apply") {
          var leftball = document.getElementById(domsId[1]);
          var rightball = document.getElementById(domsId[2]);
          var calculation = $scope.leftDays / $scope.totalDays;
          if (calculation <= 0.5) {//剩余天数大于总天数的一半
            leftball.style.transition = "all 0.3s linear";
            leftball.style.webkitTransition = "all 0.3s linear";
            rightball.style.transition = "all 0.3s linear";//右半圆过渡动画0.3s，渐快，无延迟
            rightball.style.webkitTransition = "all 0.3s linear";
          } else if (calculation > 0.5) {//剩余天数不到入住天数的一半
            leftball.style.transition = "all 0.3s linear 0.3s";//左半圆过渡动画0.3s，渐缓，0.3s延迟
            leftball.style.webkitTransition = "all 0.3s linear 0.3s";
            rightball.style.transition = "all 0.3s linear";//右半圆过渡动画0.3s，渐快，无延迟
            rightball.style.webkitTransition = "all 0.3s linear";
          }
          leftball.style.webkitTransform = "rotate(-135deg)";
          leftball.style.transform = "rotate(-135deg)";
          rightball.style.webkitTransform = "rotate(-135deg)";
          rightball.style.transform = "rotate(-135deg)";
          $timeout(function () {//定时器中决定两个圆的终止角度
            var angle = 0;
            if (calculation <= 0.5) {
              angle = 360 * calculation;
              angle = angle - 135;
              leftball.style.webkitTransform = "rotate(-135deg)";
              leftball.style.transform = "rotate(-135deg)";
              rightball.style.webkitTransform = "rotate(" + angle + "deg)";
              rightball.style.transform = "rotate(" + angle + "deg)";
            } else if (calculation > 0.5) {
              calculation = calculation - 0.5;
              angle = 360 * calculation;
              angle = angle - 135;
              leftball.style.webkitTransform = "rotate(" + angle + "deg)";
              leftball.style.transform = "rotate(" + angle + "deg)";
              rightball.style.webkitTransform = "rotate(45deg)";
              rightball.style.transform = "rotate(45deg)";
            }
          }, 500);
        } else if (domsId[0] == "time-off-manage") {
          //$timeout(function() {
          $scope.$watch('circleAnimationFlag', function () {
            if ($scope.circleAnimationFlag == true) {
              var leftball1 = document.getElementById(domsId[1]);
              var rightball1 = document.getElementById(domsId[2]);
              var leftball2 = document.getElementById(domsId[3]);
              var rightball2 = document.getElementById(domsId[4]);
              var leftball3 = document.getElementById(domsId[5]);
              var rightball3 = document.getElementById(domsId[6]);
              var calculation1 = $scope.timeOffHeader.paidHoliday / ($scope.timeOffHeader.paidHoliday + $scope.timeOffHeader.usedPaidHoliday);
              var calculation2 = $scope.timeOffHeader.paidSickLeave / ($scope.timeOffHeader.paidSickLeave + $scope.timeOffHeader.usedPaidSickLeave);
              var calculation3 = $scope.timeOffHeader.extPaidHoliday / ($scope.timeOffHeader.extPaidHoliday + $scope.timeOffHeader.usedExtPaidHoliday);
              if (calculation1 <= 0.5) {//剩余天数大于总天数的一半
                leftball1.style.transition = "all 0.3s linear";
                leftball1.style.webkitTransition = "all 0.3s linear";
                rightball1.style.transition = "all 0.3s linear";//右半圆过渡动画0.3s，渐快，无延迟
                rightball1.style.webkitTransition = "all 0.3s linear";
              } else if (calculation1 > 0.5) {//剩余天数不到入住天数的一半
                leftball1.style.transition = "all 0.3s linear 0.3s";//左半圆过渡动画0.3s，渐缓，0.3s延迟
                leftball1.style.webkitTransition = "all 0.3s linear 0.3s";
                rightball1.style.transition = "all 0.3s linear";//右半圆过渡动画0.3s，渐快，无延迟
                rightball1.style.webkitTransition = "all 0.3s linear";
              }
              if (calculation2 <= 0.5) {//剩余天数大于总天数的一半
                leftball2.style.transition = "all 0.3s linear";
                leftball2.style.webkitTransition = "all 0.3s linear";
                rightball2.style.transition = "all 0.3s linear";//右半圆过渡动画0.3s，渐快，无延迟
                rightball2.style.webkitTransition = "all 0.3s linear";
              } else if (calculation2 > 0.5) {//剩余天数不到入住天数的一半
                leftball2.style.transition = "all 0.3s linear 0.3s";//左半圆过渡动画0.3s，渐缓，0.3s延迟
                leftball2.style.webkitTransition = "all 0.3s linear 0.3s";
                rightball2.style.transition = "all 0.3s linear";//右半圆过渡动画0.3s，渐快，无延迟
                rightball2.style.webkitTransition = "all 0.3s linear";
              }
              if (calculation3 <= 0.5) {//剩余天数大于总天数的一半
                leftball3.style.transition = "all 0.3s linear";
                leftball3.style.webkitTransition = "all 0.3s linear";
                rightball3.style.transition = "all 0.3s linear";//右半圆过渡动画0.3s，渐快，无延迟
                rightball3.style.webkitTransition = "all 0.3s linear";
              } else if (calculation3 > 0.5) {//剩余天数不到入住天数的一半
                leftball3.style.transition = "all 0.3s linear 0.3s";//左半圆过渡动画0.3s，渐缓，0.3s延迟
                leftball3.style.webkitTransition = "all 0.3s linear 0.3s";
                rightball3.style.transition = "all 0.3s linear";//右半圆过渡动画0.3s，渐快，无延迟
                rightball3.style.webkitTransition = "all 0.3s linear";
              }
              leftball1.style.webkitTransform = "rotate(-135deg)";
              leftball1.style.transform = "rotate(-135deg)";
              rightball1.style.webkitTransform = "rotate(-135deg)";
              rightball1.style.transform = "rotate(-135deg)";
              leftball2.style.webkitTransform = "rotate(-135deg)";
              leftball2.style.transform = "rotate(-135deg)";
              rightball2.style.webkitTransform = "rotate(-135deg)";
              rightball2.style.transform = "rotate(-135deg)";
              leftball3.style.webkitTransform = "rotate(-135deg)";
              leftball3.style.transform = "rotate(-135deg)";
              rightball3.style.webkitTransform = "rotate(-135deg)";
              rightball3.style.transform = "rotate(-135deg)";
              $timeout(function () {//定时器中决定两个圆的终止角度
                var angle1 = 0;
                var angle2 = 0;
                var angle3 = 0;
                if (calculation1 <= 0.5) {
                  angle1 = 360 * calculation1;
                  angle1 = angle1 - 135;
                  leftball1.style.webkitTransform = "rotate(-135deg)";
                  leftball1.style.transform = "rotate(-135deg)";
                  rightball1.style.webkitTransform = "rotate(" + angle1 + "deg)";
                  rightball1.style.transform = "rotate(" + angle1 + "deg)";
                } else if (calculation1 > 0.5) {
                  calculation1 = calculation1 - 0.5;
                  angle1 = 360 * calculation1;
                  angle1 = angle1 - 135;
                  leftball1.style.webkitTransform = "rotate(" + angle1 + "deg)";
                  leftball1.style.transform = "rotate(" + angle1 + "deg)";
                  rightball1.style.webkitTransform = "rotate(45deg)";
                  rightball1.style.transform = "rotate(45deg)";
                }
                if (calculation2 <= 0.5) {
                  angle2 = 360 * calculation2;
                  angle2 = angle2 - 135;
                  leftball2.style.webkitTransform = "rotate(-135deg)";
                  leftball2.style.transform = "rotate(-135deg)";
                  rightball2.style.webkitTransform = "rotate(" + angle2 + "deg)";
                  rightball2.style.transform = "rotate(" + angle2 + "deg)";
                } else if (calculation2 > 0.5) {
                  calculation2 = calculation2 - 0.5;
                  angle2 = 360 * calculation2;
                  angle2 = angle2 - 135;
                  leftball2.style.webkitTransform = "rotate(" + angle2 + "deg)";
                  leftball2.style.transform = "rotate(" + angle2 + "deg)";
                  rightball2.style.webkitTransform = "rotate(45deg)";
                  rightball2.style.transform = "rotate(45deg)";
                }
                if (calculation3 <= 0.5) {
                  angle3 = 360 * calculation3;
                  angle3 = angle3 - 135;
                  leftball3.style.webkitTransform = "rotate(-135deg)";
                  leftball3.style.transform = "rotate(-135deg)";
                  rightball3.style.webkitTransform = "rotate(" + angle3 + "deg)";
                  rightball3.style.transform = "rotate(" + angle3 + "deg)";
                } else if (calculation3 > 0.5) {
                  calculation3 = calculation3 - 0.5;
                  angle3 = 360 * calculation3;
                  angle3 = angle3 - 135;
                  leftball3.style.webkitTransform = "rotate(" + angle3 + "deg)";
                  leftball3.style.transform = "rotate(" + angle3 + "deg)";
                  rightball3.style.webkitTransform = "rotate(45deg)";
                  rightball3.style.transform = "rotate(45deg)";
                }
              }, 500);
            }
          });
          //},2500);
        }
      }
    }
  }])

/*  .directive('calculatePortrait', function () {
    return {
      restrict: 'A',
      link: function ($scope, $scroller, $attr) {
        var params = $attr.calculatePortrait;
        var domsId = params.split(',');
        var bigPortraitVariable = 0;//大头像的偏移量
        var myBigPortrait = document.getElementById(domsId[0]);
        var myLittlePortrait = document.getElementById(domsId[1]);
        var clientWidth = window.screen.width;
        var calculationBig = 90 * clientWidth / 375;
        var calculationLittle = 64 * clientWidth / 375;
        if (clientWidth > 300 && clientWidth <= 345) {
          bigPortraitVariable = 4;
        } else if (clientWidth > 345 && clientWidth <= 395) {
          bigPortraitVariable = -3;
        } else if (clientWidth > 395 && clientWidth <= 445) {
          bigPortraitVariable = -10;
        } else if (clientWidth > 445) {
          bigPortraitVariable = -17;
        }
        myBigPortrait.style.width = calculationBig + "px";
        myBigPortrait.style.height = calculationBig + "px";
        myLittlePortrait.style.width = calculationLittle + "px";
        myLittlePortrait.style.height = calculationLittle + "px";
        myLittlePortrait.style.top = -calculationLittle / 2 + "px";
        myBigPortrait.style.top = bigPortraitVariable * clientWidth / 375 - calculationBig / 2 + "px";
      }
    }
  });*/
/**
 * @description:loading tag
 *
 */
HmsModule.directive('hmsLoading', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'E',
    template: '<div class="hms-hide-small-content">' +
    '<div class="loading-hand"></div>' +
    '</div>',
    replace: true, //使用模板替换原始标记
    transclude: false,    // 不复制原始HTML内容
    controller: ["$scope", function ($scope) {
    }],
    link: function (scope, element, attrs, controller) {
    }
  };
}]);

/**
 * @description:loading tag
 *
 */
HmsModule.directive('hmsCommonLoading', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'EA',
    template: '' +
    '<div class="hide-icon">' +
    '<ion-spinner icon="ios" class="spinner spinner-ios"></ion-spinner>' +
    '</div>',
    replace: true, //使用模板替换原始标记
    transclude: false,    // 不复制原始HTML内容
    controller: ["$scope", function ($scope) {
    }],
    link: function (scope, element, attrs, controller) {
    }
  };
}]);

/**
 * @description:nodata tag
 *
 */
HmsModule.directive('hmsNoData', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'E',
    template: '<div class="hms-hide-small-content">' +
    '<div class="nodata-img-hand"></div>' +
    '<div class="nodata-text">没有相关数据！</div>' +
    '</div>',
    replace: true, //使用模板替换原始标记
    transclude: false,    // 不复制原始HTML内容
    controller: ["$scope", function ($scope) {
    }],
    link: function (scope, element, attrs, controller) {
    }
  };
}]);
