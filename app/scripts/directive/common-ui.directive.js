/**
 * Created by gusenlin on 2016/12/3.
 */
HmsModule
  .directive('hmsSelectItem', function () {
    return {
      restrict: 'E',
      scope: {
        inputLabelName: '=labelName',
        inputBox: '=inputBox',
        isImportant: '=important',
        showLine: '=showLine',
        isLastLine: '=lastLine',
        imgUrl: '=imgUrl',
        notEditable: '=notEditable',
        $hmsSelect: '&hmsSelect',
      },
      template: '<div class="hms-select-item-style" ng-click="selectValue()" ' +
      'ng-class="{true:\'last-line\'}[isLastLine && !showLine]">' +
      '<div class="hms-select-content" ng-class="{true:\'last-line\'}[!isLastLine && !showLine]">' +
      '<div class="hms-select-area">' +
      '<div class="hms-select-header ng-binding">{{inputLabelName}}<span ng-if="isImportant">&nbsp;*</span></div>' +
      '<div class="hms-select-detail">' +
      '<span class="hms-select-span" ng-bind="inputBox" ng-if="inputBox && inputBox != \'\' "></span>' +
      '<span ng-if="!inputBox || inputBox == \'\'" style="color:#b2b2b2">请选择</span>' +
      '</div></div>' +
      '<div class="hms-select-arrow col-center">' +
      '<i><img src="{{imgUrlValue}}" ng-if="!notEditable"></i>' +
      '</div>' +
      '<div class="hms-select-blank"></div>' +
      '</div>' +
      '</div>',
      link: function (scope, element, attrs) {
        if(!attrs.imgUrl || attrs.imgUrl == ''){
          scope.imgUrlValue = 'build/img/contact/right_arrow@3x.png';
        }
        else{
          scope.imgUrlValue = attrs.imgUrl;
        }
        if(scope.notEditable)
          scope.selectValue = function(){};
        else
          scope.selectValue = function () {
            //console.log('selectValue...');
            if (scope.$hmsSelect) {
              scope.$hmsSelect();
            }
          };
      }
    }
  })
  .directive('hmsSelectImageItem', function () {
    return {
      restrict: 'E',
      scope: {
        imageIcon: '=imageIcon',
        prompt: '=prompt',
        isImportant: '=important',
        selectValue: '=selectValue',
        isLastLine: '=lastLine',
        $hmsSelect: '&hmsSelect',
      },
      template: '<div class="hms-select-image-item" ng-click="hmsSelect1()">' +
      '<div class="row row-center info-item">' +
      '<div class="col col-10">' +
      '<img ng-src="{{imageIcon}}" class="info-img">' +
      '</div>' +
      '<div class="col col-33">' +
      '<div class="info-item-name">{{prompt}}<span ng-if="isImportant">&nbsp;*</span></div>' +
      '</div>' +
      '<div class="col col-50">' +
      '<div class="info-item-prompt" ng-if="!selectValue || selectValue == \'\'">请选择</div>' +
      '<div class="info-item-content" ng-if="selectValue && selectValue != \'\'" ng-bind="selectValue" ></div>' +
      '</div>' +
      '<div class="col col-7 col-center">' +
      '<img src="build/img/contact/right_arrow@3x.png" class="arrow-img">' +
      '</div>' +
      '</div>' +
      '</div>',
      link: function (scope, element, attrs) {
        scope.hmsSelect1 = function () {
          if (scope.$hmsSelect) {
            scope.$hmsSelect();
          }
        };
      }
    }
  })
  .directive('hmsInputItem', function () {
    return {
      restrict: 'E',
      scope: {
        inputLabelName: '=labelName',
        inputBox: '=inputBox',
        placeHolder: '=placeHolder',
        showLine: '=showBottomLine',
        isImportant: '=important',
        isLastLine: '=lastLine',
        $hmsInput: '&hmsInput',
        isChange: '=isChange',
        typeValue:'=typeValue'
      },
      template: '<div class="hms-input-item-style1" ' +
      'ng-class="{true:\'last-line\'}[isLastLine && !showLine]">' +
      '<div class="hms-input-header">' +
      '{{inputLabelName}}<span ng-if="isImportant">&nbsp;*</span>' +
      '</div>' +
      '<div class="hms-input-content" ng-class="{true:\'last-line\'}[!isLastLine && !showLine]"><input ' +
      'type="text" placeholder="{{placeHolderValue}}" ng-model="inputBox" ng-blur="inputBlur()" ng-readonly="isChange"></div>' +
      '</div>',
      link: function (scope, element, attrs) {
        if(scope.isChange==true){
          scope.placeHolderValue = '';
        }else{
          if(!scope.placeHolder || scope.placeHolder == ''){
            scope.placeHolderValue = '请输入';
          }
          else{
            scope.placeHolderValue = scope.placeHolder;
          }
        }

        scope.inputBlur = function () {
          console.log('blur...');
          if (scope.$hmsInput) {
            scope.$hmsInput();
          }
        };
      }

    }
  })
  .directive('hmsDialogBox',[function(){
    return {
      restrict: 'E',
      scope: {
        inputLabelName: '=labelName',
        inputBox: '=inputBox',
        placeHolder: '=placeHolder',
        showLine: '=showBottomLine',
        isImportant: '=important',
        isLastLine: '=lastLine',
        $hmsInput: '&hmsInput',
        isChange: '=isChange',
        typeValue:'=typeValue'
      },
      template: '<div class="bar directive-box" id="bar-footer2">' +
      '<div class="common-voice"  on-touch="touchAnnotate()" on-release="annotateRelease()">' +
      '<div style="">' +
      '<img src="build/img/application/plans/icon_voice@3x.png">' +
      '</div>' +
      '</div>' +
      '<div class="common-content">' +
      '<textarea  id="comment-text" oninput="this.style.height =\'40px\';this.style.height = this.scrollHeight + \'px\';this.parentNode.style.height = \'0px\';this.parentNode.style.height = this.scrollHeight + 0 + \'px\';" placeholder="" ng-model="planDetail.annotate"></textarea>' +
      ' </div> ' +
      '<div class="common-submit"  ng-click="annotateSubmit(planDetail)"> ' +
      '<div>发送 </div> ' +
      '</div>' +
      ' </div>',
      link: function (scope, element, attrs) {
        if(!scope.placeHolder || scope.placeHolder == ''){
          scope.placeHolderValue = '请输入';
        }
        else{
          scope.placeHolderValue = scope.placeHolder;
        }
        scope.inputBlur = function () {
          console.log('blur...');
          if (scope.$hmsInput) {
            scope.$hmsInput();
          }
        };
      }
    }
  }])
  .directive('crmLoading', ['$rootScope', function ($rootScope) {
    return {
      restrict: 'E',
      template: '<div class="crm crm-hide-small-content">' +
      '<div class="loading-crm"></div>' +
      '</div>',
      replace: true, //使用模板替换原始标记
      transclude: false,    // 不复制原始HTML内容
      controller: ["$scope", function ($scope) {
      }],
      link: function (scope, element, attrs, controller) {
      }
    };

  }])
  .directive('crmSmallLoading', ['$rootScope', function ($rootScope) {
    return {
      restrict: 'E',
      template: '<div class="crm-hide-small-loading">' +
      '<div class="loading-small-crm"></div>' +
      '</div>',
      replace: true, //使用模板替换原始标记
      transclude: false,    // 不复制原始HTML内容
      controller: ["$scope", function ($scope) {
      }],
      link: function (scope, element, attrs, controller) {
      }
    };

  }])
  .directive('scrollHeightImg', function ($window) {
    return {
      restrict: 'AE',
      link: function (scope, element, attr) {
        console.log(screen.height);
        element[0].style.height = (screen.height - 44) + 'px';
      }
    }
  })
  .directive('keyboardshow', function($rootScope, $ionicPlatform, $timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attributes) {
        if (ionic.Platform.isAndroid()) {
          window.addEventListener('native.keyboardhide',function (e){
            cordova.plugins.Keyboard.isVisible = true;
            $timeout(function() {
              cordova.plugins.Keyboard.isVisible = false;
            },100);
          });
        }else{
          window.addEventListener('native.keyboardshow',function (e){
            angular.element(element).css({
              'bottom':e.keyboardHeight + 'px'
            });

          });
          window.addEventListener('native.keyboardhide',function (e){
            angular.element(element).css({
              'bottom':0
            });
            cordova.plugins.Keyboard.isVisible = true;
            $timeout(function() {
              cordova.plugins.Keyboard.isVisible = false;
            },100);
          });
        }
      }
    };
  })
.directive('footerkeyboardshow', function($rootScope, $ionicPlatform, $timeout, $ionicHistory, $cordovaKeyboard) {
  return {
    restrict: 'A',
    link: function(scope, element, attributes) {
      if (ionic.Platform.isAndroid()) {
        window.addEventListener('native.keyboardhide',function (e){
          cordova.plugins.Keyboard.isVisible = true;
          $timeout(function() {
            cordova.plugins.Keyboard.isVisible = false;
          },100);
        });
      }else{
        window.addEventListener('native.keyboardshow',function (e){

          angular.element(element).css({
            'bottom':e.keyboardHeight  + 'px'
          });


        });

        window.addEventListener('native.keyboardhide',function (e){
          angular.element(element).css({
            'bottom':60
          });
          cordova.plugins.Keyboard.isVisible = true;
          $timeout(function() {
            cordova.plugins.Keyboard.isVisible = false;
          },100);
        });
      }
    }
  };
})

  .directive('onFinishRepeat', function ($timeout) {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function () {
            scope.$emit('ngRepeatFinished');
          });
        }
      }
    }
  })

  .directive('ngLoad', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.bind('load', function () {
          scope.$apply(attrs.ngLoad);
        });
      }
    };
  });
