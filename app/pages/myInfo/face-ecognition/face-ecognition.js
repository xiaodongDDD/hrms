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
                              faceEcognitionService) {
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
    vm.progress = {}

    vm.faceEcognition = faceEcognition;
    vm.reFaceEcognition = reFaceEcognition;
    vm.complete = complete;

    function reFaceEcognition() {
      faceEcognition();
    }

    function complete() {
      var upload = function (buttonIndex) {
        if (buttonIndex == 1) {
          faceEcognitionService.uploadImage(vm.faceResult.imgUrl,onProgress);
        }
      };
      var onProgress = function (progressEvent) {
        vm.progress.lengthComputable = progressEvent.lengthComputable;
        if (progressEvent.lengthComputable) {
          vm.progress.loaded = progressEvent.loaded;
          vm.progress.total = progressEvent.total;
          vm.progress.progress = progressEvent.loaded / progressEvent.total * 100;

          hmsPopup.showLoading('上传图片进度为 ' + Math.round(vm.progress.progress) + '%');

        } else {

          hmsPopup.showLoading('采集信息到服务器中');
        }
        $scope.$apply();
      }
      hmsPopup.confirm('是否将采集的信息传到服务器?', "采集信息", upload);
    }

    var faceEcognitionError = function (result) {
      if (baseConfig.debug) {
        alert(result);
        alert('faceEcogniition.success ' + angular.toJson(result));
      }
    };

    var faceEcognitionSuccess = function (result) {
      if (baseConfig.debug) {
        alert(result);
        alert('faceEcogniition.error ' + angular.toJson(result));
      }
      vm.faceResult.imgUrl = result.imgPath;
      vm.faceResult.age = result.age;
      vm.faceResult.beauty = result.beauty;
      vm.faceResult.expression = result.expression;
      if(result.gender && result.gender < 50){
        vm.faceResult.gender = '女';
      }else if(result.gender && result.gender > 50){
        vm.faceResult.gender = '男';
      }

      vm.faceResult.img = result.imgPath;
      vm.faceEcognitionResult = true;
      $scope.$apply();

      /*if (baseConfig.debug) {
        alert('vm.faceResult '+ angular.toJson(vm.faceResult));
      }
      pluginface.getLocalImage(result.imgPath, function (base64) {
        if (baseConfig.debug) {
          alert(base64);
          console.log(base64);
          console.log(angular.toJson(base64));
        }
        vm.faceResult.img = 'data:image/jpg;base64,' + base64;

      }, function (e) {
        if (baseConfig.debug) {
          alert(e);
          console.log(e);
          console.log('e' + angular.toJson(e));
        }
      });*/
    }

    function faceEcognition() {
      if (baseConfig.debug) {
        console.log('faceEcognition.work...');
      }
      pluginface.faceDetect('', faceEcognitionSuccess, faceEcognitionError);
    }


  }
})();
