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
                              $timeout) {
    var vm = this;

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

    vm.faceEcognition = faceEcognition;

    var uploadImage1 = function (result) {
      if(baseConfig.debug){
        alert('uploadImage.start ');
      }

      var success = function (response) {
        if(baseConfig.debug) {
          alert(response);
          alert('uploadImage.success ' + angular.toJson(response));
        }
      };

      var error = function (response) {
        if(baseConfig.debug) {
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

      if(baseConfig.debug) {
        alert('uploadImage.start url ' + angular.toJson(url));
        alert('uploadImage.start options ' + angular.toJson(options));
      }

      fileTransfer.upload(
        result.imgPath,
        encodeURI(url),//上传服务器的接口地址
        success,
        error,
        options,
        trustAllHosts
      );
    }


    var faceEcognitionSuccess = function (result) {
      if(baseConfig.debug) {
        alert(result);
        alert('faceEcogniition.success ' + angular.toJson(result));
      }

    };

    var faceEcognitionError = function (result) {
      if(baseConfig.debug) {
        alert(result);
        alert('faceEcogniition.error ' + angular.toJson(result));
      }

      uploadImage1(result);
    }


    function faceEcognition() {
      if (baseConfig.debug) {
        console.log('faceEcognition.work...');
      }

      pluginface.faceDetect(faceEcognitionSuccess, faceEcognitionError, '');
    }


  }
})();
