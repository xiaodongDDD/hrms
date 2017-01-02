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
      .state('tab.face-ecognition-setting', {
        url: '/myInfo/face-ecognition-setting',
        params: {"from": ""},
        views: {
          'tab-myInfo': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/myInfo/face-ecognition/ecognition/ecognition.html',
            controller: 'faceEcognitionSettingCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }

  angular
    .module('myInfoModule')
    .controller('faceEcognitionSettingCtrl', faceEcognitionSettingCtrl);

  //plansDetailCtrl.$inject = [];

  function faceEcognitionSettingCtrl($scope,
                                     $state,
                                     $ionicHistory,
                                     baseConfig,
                                     $stateParams,
                                     hmsPopup,
                                     faceEcognitionService,
                                     hmsReturnView,
                                     TabsService) {
    var vm = this;

    vm.loginFace = loginFace;
    vm.ecognition = ecognition;
    vm.setting = setting;
    vm.goBack = goBack;
    vm.meetThousand=meetThousand;

    function loginFace() {
      hmsPopup.showPopup('此功能下一版本上线');
    }

    function goBack() {
      TabsService.setManualReturnFlag(true);
      //hmsReturnView.returnToState('tab.myInfo');
      $ionicHistory.goBack();
    }

    //人脸识别
    function ecognition() {
      var error = function (result) {
        if (baseConfig.debug) {
          alert('ecognition.error ' + angular.toJson(result));
        }
        hmsPopup.showPopup('验证失败，请重新验证或补充照片！');
      };

      var success = function (result) {
        uploadServe(result.imgPath);
      };

      if(faceEcognitionService.getNoPluginMode()){
        //临时解决方案
        catchImage();
      }else{
        pluginface.faceDetect('', success, error);
      }
    }

    //
    function catchImage() {
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 90,
        targetWidth: 450,
        targetHeight: 450,
        destinationType: Camera.DestinationType.FILE_URI,
        cameraDirection: Camera.Direction.FRONT
      });

      function onFail(result) {
        if (baseConfig.debug) {
          alert('ecognition.error ' + angular.toJson(result));
        }
        //hmsPopup.showPopup('验证失败，请重新验证或补充照片！');
      }

      function onSuccess(imageURI) {
        uploadServe(imageURI);
      }
    }

    //上传到服务器进行验证
    function uploadServe(imgUrl) {
      var success = function (res) {
        hmsPopup.hideLoading();
        if (baseConfig.debug) {
          alert('uploadImage.success ' + angular.toJson(JSON.parse(res.response)));
        }
        var result = JSON.parse(res.response);
        if (result.rows[0] && result.rows[0].confidence && result.rows[0].confidence > 80) {
          hmsPopup.showPopup('验证成功！匹配度' + result.rows[0].confidence);
        } else {
          hmsPopup.showPopup('验证失败，请重新验证或重新设置！匹配度' + result.rows[0].confidence);
        }
        //hmsPopup.showPopup('uploadImage.success ' + angular.toJson(JSON.parse(res.response)));
      };

      var error = function (response) {
        hmsPopup.hideLoading();
        if (baseConfig.debug) {
          alert('uploadImage.error ' + angular.toJson(response));
        }
        hmsPopup.showPopup('验证出现异常，请重新验证！');
      };

      var onProgress = function (progressEvent) {
        faceEcognitionService.processProgress(progressEvent, $scope, '验证中');
      }

      faceEcognitionService.uploadImage('/faceVerify', imgUrl, onProgress, success, error);
    }

    function setting() {
      $state.go('tab.face-ecognition-my-photo');
    }

    function meetThousand() {
      $state.go('tab.face-ecognition-meetThousand');
    }
  }
})();
