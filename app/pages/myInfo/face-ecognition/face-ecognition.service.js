/**
 * Created by gusenlin on 2016/12/15.
 */
(function () {
  'use strict';

  angular
    .module('myInfoModule')
    .factory('faceEcognitionService', faceEcognitionService);

  //plansDetailCtrl.$inject = [];

  function faceEcognitionService(baseConfig) {
    var service;

    service = {
      uploadImage: uploadImage
    };

    return service;

    function uploadImage(imgPath,onProgress) {
      if (baseConfig.debug) {
        alert('uploadImage.start ');
      }

      var success = function (response) {
        if (baseConfig.debug) {
          alert(response);
          alert('uploadImage.success ' + angular.toJson(response));
        }
      };

      var error = function (response) {
        if (baseConfig.debug) {
          alert(response);
          alert('uploadImage.error ' + angular.toJson(response));
        }
      };

      var url = baseConfig.imPath + '/api/photoUpload';
      var options = new FileUploadOptions();
      options.filekey = "file";
      options.fileName = "image.jpg";
      options.mimeType = "image/jpeg";
      options.chunkedMode = false;
      options.headers = {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + window.localStorage.token}
      var trustAllHosts = true;
      var fileTransfer = new FileTransfer();

      if (baseConfig.debug) {
        alert('uploadImage.start url ' + angular.toJson(url));
        alert('uploadImage.start options ' + angular.toJson(options));
      }

      fileTransfer.onprogress = function(progressEvent) {
        onProgress(progressEvent);
      };

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
