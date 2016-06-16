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
});

/**
 * @description:loading tag
 *
 */
HmsModule.directive('hmsLoading', function($rootScope) {
  return {
    restrict: 'E',
    template: '<div class="hms-hide-content">'+
    '<div class="content">数据加载中...</div>'+
    '<div class="hide-icon">'+
    '<ion-spinner icon="ios" class="spinner spinner-ios"></ion-spinner>'+
    '</div>'+
    '</div>',
    replace: true, //使用模板替换原始标记
    transclude: false,    // 不复制原始HTML内容
    controller: ["$scope", function ($scope) {
    }],
    link: function (scope, element, attrs, controller) {
    }
  };
});


