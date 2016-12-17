/**
 * Created by user on 2016/8/25.
 */
HmsModule
  /*.directive('hmsLoading', ['$rootScope', function ($rootScope) {
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
  }])*/
  .directive('hmsSelector',['$ionicModal',function ($ionicModal) {
  return {
    restrict:"EA",
    templateUrl:"build/pages/directive/hmsSelector.html",
    scope:{
      hmsTitle:"=",
      hmsValue:"=",
      hmsModalValue:"=",
      hmsPaging:"=",
    },
    link: function (scope,element,attrs) {
      scope.screenHeig = window.innerHeight;
      //根据值的多少判断打开哪个modal
      if (scope.hmsModalValue.length>=scope.hmsPaging) {        //数值多，打开带筛选框的
        $ionicModal.fromTemplateUrl('./build/pages/modals/hmsManyDataModal.html', {
          scope: scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          scope.manyModal = modal;
        });
        scope.info = {    //过滤器
          filter:""
        }
        scope.openModal = function() {    //打开modal
          scope.manyModal.show();
        };
        //清选
        scope.clear = function () {
          //scope.info.filter = "";
          scope.hmsValue = "";
          scope.info.filter = "";
          scope.manyModal.hide();
        }
        //返回,关闭modal
        scope.closeModal = function() {
          scope.manyModal.hide();
          scope.info.filter = "";
        };
        //选值
        scope.choose = function (item) {
          scope.hmsValue = item;
          scope.info.filter = "";
          scope.manyModal.hide();
        }
        //删除输入的值
        scope.delete = function () {
          scope.info.filter = "";
        }
      } else {    //数值不多，打开不带筛选框的
        $ionicModal.fromTemplateUrl('./build/pages/modals/hmsModal.html', {
          scope: scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          scope.modal = modal;
        });
        scope.openModal = function() {
          scope.modal.show();
          setTimeout(function () {
            if (scope.hmsModalValue.length == 3) {
              $(".hmsModal").css("top", scope.screenHeig - 202 + 'px')
            } else if (scope.hmsModalValue.length >= 4 && scope.hmsModalValue.length<scope.hmsPaging) {
              $(".hmsModal").css("top", 47 + '%');
              $(".hmsModal").css("min-height", 53 + '%')
            } else if(scope.hmsModalValue.length == 2){
              $(".hmsModal").css("top", scope.screenHeig - 149 + 'px')
            }else if(scope.hmsModalValue.length == 1){
              $(".hmsModal").css("top", scope.screenHeig - 96 + 'px')
            }else if(scope.hmsModalValue.length == 0){
              $(".hmsModal").css("top", scope.screenHeig - 0 + 'px');
            }
          },0)
        };
        scope.choose = function (item) {
          scope.hmsValue = item;
          scope.modal.hide();
        }
      }
    }
  }
}])
  .directive('hmsLimitNum',[function () {
    return {
      restrict:"EA",
      template:"<input class='inputSty' ng-change='limitNum(hmsValue)' ng-model='hmsValue' placeholder='请输入'>",
      scope:{
        hmsValue:"=",
      },
      link: function (scope,element,attrs) {
        scope.limitNum = function () {
          var reg = /[^\d.]/g;
          if(reg.test(scope.hmsValue)){
            scope.hmsValue=scope.hmsValue.replace(/\D/g,'')
          }
        }
      }
    }
  }])


  .directive('scrollX', function () {
      var link = function (scope, element, attrs) {
        var startX = 0;
        var startY = 0;
        var $gallery = $(element);
        console.log($gallery);
        $gallery.on("touchstart", function (e) {
          startX = e.originalEvent.changedTouches[0].pageX,
              startY = e.originalEvent.changedTouches[0].pageY;
        });

        $gallery.on("touchmove", function (e) {
          var X = e.originalEvent.changedTouches[0].pageX - startX;
          var Y = e.originalEvent.changedTouches[0].pageY - startY;

          if (Math.abs(X) > Math.abs(Y) && X > 0) {
            var cur_scroll = $(this).scrollLeft();
            $(this).scrollLeft(parseInt(cur_scroll) - X);
            e.preventDefault();
            e.stopPropagation();
          }
          else if (Math.abs(X) > Math.abs(Y) && X < 0) {
            var cur_scroll = $(this).scrollLeft();
            $(this).scrollLeft(parseInt(cur_scroll) - X);
            e.preventDefault();
            e.stopPropagation();
          }
          //else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
          //}
          //else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
          //}
          //else {
          //}
        })
      };
      return {
        restrict: 'A',
        link: link
      };
    })

;

