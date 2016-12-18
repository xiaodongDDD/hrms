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

    //人脸识别
    function ecognition() {
      var error = function (result) {
        if (baseConfig.debug) {
          alert('ecognition.error ' + angular.toJson(result));
        }
        hmsPopup.showPopup('验证失败，请重新验证或重新设置！');
      };
      var success = function (result) {
        uploadServe(result.imgPath);
      }
      pluginface.faceDetect('', success, error);
    }

    //上传到服务器进行验证
    function uploadServe(imgUrl) {
      var success = function (res) {
        hmsPopup.hideLoading();
        if (baseConfig.debug) {
          alert('uploadImage.success ' + angular.toJson(JSON.parse(res.response)));
        }
        var result = JSON.parse(res.response);
        if(result.rows[0] && result.rows[0].con && result.rows[0].confidence > 90){
          hmsPopup.showPopup('验证成功！' + result.rows[0].confidence);
        }else{
          hmsPopup.showPopup('验证失败，请重新验证或重新设置！' + result.rows[0].confidence);
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
        faceEcognitionService.processProgress(progressEvent,$scope,'验证中');
      }

      faceEcognitionService.uploadImage('/faceVerify', imgUrl, onProgress, success, error);
    }

    function setting() {
      $state.go('tab.face-ecognition');
    }
  }
})();
