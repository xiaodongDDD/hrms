/**
 * @ngdoc directive
 * @name hideTabs
 * @module utilModule
 * @description
 * This is the http interceptor
 * @author
 * gusenlin
 */
HmsModule.directive('hideTabs', function($rootScope) {
  return {
    restrict: 'A',
    link: function(scope, element, attributes) {
      scope.$on('$ionicView.beforeEnter', function() {
        scope.$watch(attributes.hideTabs, function(value){
          console.log('$ionicView.beforeEnter value ' + value );
          if(value){
            $rootScope.hideTabs = false;
          }
          else{
            $rootScope.hideTabs = true;
          }
        });
      });

      scope.$on('$ionicView.beforeLeave', function() {
        $rootScope.hideTabs = true;
        console.log('$ionicView.beforeLeave value ');
      });
    }
  };
})
  .directive('elasticImage', function($ionicScrollDelegate) {
  return {
    restrict: 'A',
    link: function($scope, $scroller, $attr) {
      var image = document.getElementById($attr.elasticImage);
      var imageHeight = image.offsetHeight;
      $scroller.bind('scroll', function(e) {
        var scrollTop = e.detail.scrollTop;

        var newImageHeight = imageHeight - scrollTop;
        if (newImageHeight < 0) {
          newImageHeight = 0;
        }
        image.style.height = newImageHeight + 'px';
      });
    }
  }
}).directive('circleRotate', function($timeout) {
    return {
      restrict: 'A',
      link: function($scope, $scroller, $attr) {
        var params=$attr.circleRotate;
        var domsId=params.split(',');
        var leftball=document.getElementById(domsId[0]);
        var rightball=document.getElementById(domsId[1]);
        var calculation=$scope.leftDays/$scope.totalDays;
        if(calculation<=0.5){//剩余天数大于总天数的一半
           leftball.style.transition="all 0.3s linear";
           leftball.style.webkitTransition="all 0.3s linear";
           rightball.style.transition="all 0.3s ease-out";//右半圆过渡动画0.3s，渐快，无延迟
           rightball.style.webkitTransition="all 0.3s ease-out";
        }else if(calculation>0.5){//剩余天数不到入住天数的一半
           leftball.style.transition="all 0.3s ease-out 0.3s";//左半圆过渡动画0.3s，渐缓，0.3s延迟
           leftball.style.webkitTransition="all 0.3s ease-out 0.3s";
           rightball.style.transition="all 0.3s ease-in";//右半圆过渡动画0.3s，渐快，无延迟
           rightball.style.webkitTransition="all 0.3s ease-in";
        }
          leftball.style.webkitTransform = "rotate(-135deg)";
          leftball.style.transform = "rotate(-135deg)";
          rightball.style.webkitTransform = "rotate(-135deg)";
          rightball.style.transform = "rotate(-135deg)";
          $timeout(function(){//定时器中决定两个圆的终止角度
            var angle=0;
            if(calculation<=0.5){
              angle=360*calculation;
              angle=angle-135;
              //console.log("角度："+angle);
              leftball.style.webkitTransform = "rotate(-135deg)";
              leftball.style.transform = "rotate(-135deg)";
              rightball.style.webkitTransform = "rotate("+angle+"deg)";
              rightball.style.transform = "rotate("+angle+"deg)";
            }else if(calculation>0.5){
              calculation=calculation-0.5;
              angle=360*calculation;
              angle=angle-135;
              //console.log("角度："+angle);
              leftball.style.webkitTransform = "rotate("+angle+"deg)";
              leftball.style.transform = "rotate("+angle+"deg)";
              rightball.style.webkitTransform = "rotate(45deg)";
              rightball.style.transform = "rotate(45deg)";
            }
          },500);
      }
    }
});
