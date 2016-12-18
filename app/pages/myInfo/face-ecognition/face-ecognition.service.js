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
    var faceEcognitionFlag = false;

    var expressionList = [
      {
        from: -1,
        to: 10,
        man: "苦瓜脸么",
        woman: "苦瓜脸么"
      },
      {
        from: 11,
        to: 20,
        man: "不苟言笑",
        woman: "不苟言笑"
      },
      {
        from: 21,
        to: 50,
        man: "迷之微笑",
        woman: "迷之微笑"
      },
      {
        from: 51,
        to: 75,
        man: "拈花一笑",
        woman: "嫣然一笑"
      },
      {
        from: 76,
        to: 101,
        man: "眉飞眼笑",
        woman: "一笑倾城"
      }
    ];

    service = {
      uploadImage: uploadImage,
      getFaceEcognitionFlag: getFaceEcognitionFlag,
      setFaceEcognitionFlag: setFaceEcognitionFlag,
      getExpression: getExpression,
      processProgress: processProgress
    };

    return service;

    function getExpression(value, sex) {
      var result = '没有表情';
      angular.forEach(expressionList, function (data) {
        if (parseInt(value) >= parseInt(data.from) && parseInt(value) < parseInt(data.to)) {
          result = data[sex];
        }
      });
      return result;
    }

    function getFaceEcognitionFlag() {
      return faceEcognitionFlag;
    }

    function setFaceEcognitionFlag(flag) {
      faceEcognitionFlag = flag;
    }

    //上传附件的进度管控
    function processProgress(progressEvent, scope, prompt) {
      var progress;
      if (progressEvent.lengthComputable) {
        progress = progressEvent.loaded / progressEvent.total * 100;
        if (progress == 100) {
          //hmsPopup.hidePopup();
        } else {
          hmsPopup.showLoading('上传图片进度为 ' + Math.round(progress) + '%');
        }
      } else {
      }
      if (progress == 100) {
        hmsPopup.showLoading(prompt);
      }
      scope.$apply();
    }

    //将附件上传到腾讯服务器中进行采集或者识别
    function uploadImage(url, imgPath, onProgress, success, error) {
      if (baseConfig.debug) {
        //alert('uploadImage.start ');
      }

      var url = baseConfig.queryPath + url;

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

      hmsPopup.showLoading('提交处理中');

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
