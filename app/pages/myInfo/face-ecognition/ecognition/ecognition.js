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
        params: {},
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
                                     baseConfig,
                                     hmsPopup,
                                     faceEcognitionService) {
    var vm = this;

    vm.loginFace = loginFace;
    vm.ecognition = ecognition;
    vm.setting = setting;

    function loginFace() {
      hmsPopup.showPopup('此功能下一版本上线');
    }

    function ecognition() {
      var error = function (result) {
        if (baseConfig.debug) {
          alert('ecognition.error ' + angular.toJson(result));
        }
        hmsPopup.showPopup('人脸识别出错，请重新验证！');
      };
      var success = function (result) {
        uploadServe(result.imgPath);
      }
      pluginface.faceDetect('', success, error);
    }

    function uploadServe(imgUrl) {
      var success = function (res) {
        hmsPopup.hideLoading();
        if (baseConfig.debug) {
          alert('uploadImage.success ' + angular.toJson(JSON.parse(res.response)));
        }
      };

      var error = function (response) {
        hmsPopup.hideLoading();
        if (baseConfig.debug) {
          alert('uploadImage.error ' + angular.toJson(response));
        }
      };

      var onProgress = function (progressEvent) {
        var progress;
        if (progressEvent.lengthComputable) {
          progress = progressEvent.loaded / progressEvent.total * 100;
          hmsPopup.showLoading('上传图片进度为 ' + Math.round(progress) + '%');
        } else {
        }
        if (progress == 100) {
          hmsPopup.showLoading('信息识别中');
        }
        $scope.$apply();
      }

      faceEcognitionService.uploadImage('/faceidentify', imgUrl, onProgress, success, error);
    }

    function setting() {
      $state.go('tab.face-ecognition');
    }
  }
})();
