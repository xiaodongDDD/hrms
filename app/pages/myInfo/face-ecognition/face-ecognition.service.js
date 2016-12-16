/**
 * Created by gusenlin on 2016/12/15.
 */
(function () {
  'use strict';

  angular
    .module('myInfoModule')
    .factory('faceEcognitionService', faceEcognitionService);

  //plansDetailCtrl.$inject = [];

  function faceEcognitionService(baseConfig, hmsPopup) {
    var service;

    service = {
      uploadImage: uploadImage
    };

    return service;

    function uploadImage(imgPath, onProgress) {
      if (baseConfig.debug) {
        alert('uploadImage.start ');
      }

      var success = function (response) {
        hmsPopup.hideLoading();
        if (baseConfig.debug) {
          alert(response);
          alert('uploadImage.success ' + angular.toJson(response));
        }
      };

      var error = function (response) {
        hmsPopup.hideLoading();
        if (baseConfig.debug) {
          alert(response);
          alert('uploadImage.error ' + angular.toJson(response));
        }
      };

      var url = baseConfig.queryPath + '/photoUpload';

      var options = new FileUploadOptions(
        'file', 'image.jpg', 'image/jpeg', null,
        {"Authorization": "Bearer " + window.localStorage.token}, 'POST');

      var trustAllHosts = true;
      var fileTransfer = new FileTransfer();

      if (baseConfig.debug) {
        alert('uploadImage.start url ' + angular.toJson(url));
        alert('uploadImage.start options ' + angular.toJson(options));
        alert('uploadImage.start imgPath ' + angular.toJson(imgPath));
      }

      fileTransfer.onprogress = function (progressEvent) {
        onProgress(progressEvent);
      };

      hmsPopup.showLoading('上传人脸识别中..');

      fileTransfer.upload(
        imgPath,
        encodeURI(url),//上传服务器的接口地址
        success,
        error,
        options,
        trustAllHosts
      );
    }

  }
})();
