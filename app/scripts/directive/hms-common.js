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
});
