/**
 * Created by gusenlin on 2016/12/15.
 */
(function () {
  'use strict';
  angular
    .module('myInfoModule')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('tab.face-ecognition', {
        url: '/myInfo/face-ecognition',
        params: {},
        views: {
          'tab-myInfo': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/myInfo/face-ecognition/face-ecognition.html',
            controller: 'faceEcognitionCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }

  angular
    .module('myInfoModule')
    .controller('faceEcognitionCtrl', faceEcognitionCtrl);

  //plansDetailCtrl.$inject = [];

  function faceEcognitionCtrl($scope,
                              $stateParams,
                              baseConfig,
                              hmsPopup,
                              faceEcognitionService,$state) {
    var vm = this;

    vm.faceEcognitionResult = false;
    vm.list = [
      {
        "image": "build/img/myInfo/1-1@3x.png",
        "text": "光线充足 正对手机"
      },
      {
        "image": "build/img/myInfo/1-2@3x.png",
        "text": "不要在昏暗或逆光下扫描"
      },
      {
        "image": "build/img/myInfo/1-3@3x.png",
        "text": "不要斜视手机"
      }
    ];
    vm.faceResult = {};
    vm.progress = {};

    var width = document.body.clientWidth;

    var outerPadding = 10;
    if(width < 360){
      outerPadding = 10;
    }else{
      outerPadding = 15;
    }

    var areaWidth = width - 30;
    var outerWidth = width - 50;
    var InnerWidth = width - 50 -  2 * outerPadding;

    vm.faceStyle = {
      "area": {
        "width": areaWidth + 'px',
        "height": areaWidth + 'px'
      },
      "imageOuter": {
        "width": outerWidth + 'px',
        "height": outerWidth + 'px',
        "padding": outerPadding + 'px'
      },
      "imageInner": {
        "width": InnerWidth + 'px',
        "height": InnerWidth + 'px'
      }
    };

    vm.faceResult.imgUrl = 'build/img/application/carpooling/Bar@3x.png';

    vm.faceEcognition = faceEcognition;
    vm.reFaceEcognition = reFaceEcognition;
    vm.complete = complete;

    function reFaceEcognition() {
      vm.faceResult.imgUrl = '';
      vm.faceResult.age = '';
      vm.faceResult.beauty = '';
      vm.faceResult.gender = '';
      vm.faceResult.expression = '';
      vm.faceResult.img = '';
      faceEcognition();
    }

    function complete() {
/*      var upload = function (buttonIndex) {
        if (buttonIndex == 1) {
          faceEcognitionService.uploadImage('/photoUpload', vm.faceResult.imgUrl, onProgress, success, error);
        }
      };*/

      var success = function (res) {
        hmsPopup.hideLoading();
        var result = JSON.parse(res.response);
        if (baseConfig.debug) {
          alert('complete.success ' + angular.toJson());
        }
        if(result.success == true){
          hmsPopup.showPopup('采集成功');
          window.localStorage.faceEcognition=='true';
          faceEcognitionService.setFaceEcognitionFlag(true);
          $state.go("tab.face-ecognition-setting");
        }else{
          hmsPopup.showPopup('采集信息采集失败，请重新采集！');
        }
      };

      var error = function (response) {
        hmsPopup.hideLoading();
        if (baseConfig.debug) {
          alert('complete.error ' + angular.toJson(response));
        }
        hmsPopup.showPopup('采集信息采集出现异常，请重新采集！');
      };

      var onProgress = function (progressEvent) {
        vm.progress.lengthComputable = progressEvent.lengthComputable;
        if (progressEvent.lengthComputable) {
          vm.progress.loaded = progressEvent.loaded;
          vm.progress.total = progressEvent.total;
          vm.progress.progress = progressEvent.loaded / progressEvent.total * 100;

          hmsPopup.showLoading('上传图片进度为 ' + Math.round(vm.progress.progress) + '%');

        } else {
        }
        if (vm.progress.progress == 100) {
          hmsPopup.showLoading('正在采集信息..');
        }
        $scope.$apply();
      };
     /* hmsPopup.confirm('是否将采集的信息传到服务器?', "采集信息", upload);*/
      faceEcognitionService.uploadImage('/photoUpload', vm.faceResult.imgUrl, onProgress, success, error);
    }

    var faceEcognitionError = function (result) {
      if (baseConfig.debug) {
        alert('faceEcogniition.success ' + angular.toJson(result));
      }
    };

    var faceEcognitionSuccess = function (result) {
      if (baseConfig.debug) {
        alert('faceEcogniition.error ' + angular.toJson(result));
      }
      var sex = '';
      vm.faceResult.imgUrl = result.imgPath;
      vm.faceResult.age = result.age;
      vm.faceResult.beauty = result.beauty;
      if (result.gender && result.gender < 50) {
        vm.faceResult.gender = '女';
        sex = 'woman';
      } else if (result.gender && result.gender > 50) {
        vm.faceResult.gender = '男';
        sex = 'man';
      }
      vm.faceResult.expression = faceEcognitionService.getExpression(result.expression, sex);

      vm.faceResult.img = result.imgPath;
      vm.faceEcognitionResult = true;
      $scope.$apply();
    }

    function faceEcognition() {
      if (baseConfig.debug) {
        console.log('faceEcognition.work...');
      }
      pluginface.faceDetect('', faceEcognitionSuccess, faceEcognitionError);
    }

  }
})();
