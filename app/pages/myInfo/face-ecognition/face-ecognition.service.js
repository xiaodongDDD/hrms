/**
 * Created by gusenlin on 2016/12/15.
 */
(function () {
  'use strict';

  angular
    .module('myInfoModule')
    .factory('faceEcognitionService', faceEcognitionService);

  //plansDetailCtrl.$inject = [];

  function faceEcognitionService(baseConfig, hmsPopup, $q, hmsHttp, $timeout) {
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

    var noPluginMode = false;

    service = {
      uploadImage: uploadImage,
      getFaceEcognitionFlag: getFaceEcognitionFlag,
      setFaceEcognitionFlag: setFaceEcognitionFlag,
      getExpression: getExpression,
      processProgress: processProgress,
      analysisFaceInfo: analysisFaceInfo,
      uploadLocalImageToAaLi: uploadLocalImageToAaLi,
      compressImage: compressImage,
      getNoPluginMode: getNoPluginMode,
      aliYunAuthorMoni: aliYunAuthorMoni,
      aliYunAuthor: aliYunAuthorMoni,
      scanProcessProgress:scanProcessProgress

    };

    return service;

    function getNoPluginMode() {
      return noPluginMode;
    }

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
    //上传附件的进度管控
    function scanProcessProgress(progressEvent, scope, prompt) {
      var progress;
      if (progressEvent.lengthComputable) {
        progress = progressEvent.loaded / progressEvent.total * 100;
        if (progress == 100) {
          //hmsPopup.hidePopup();
        } else {
          hmsPopup.showLoading('扫描中...');
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

    //解析人脸识别检测出来的信息
    function analysisFaceInfo(result) {
      var faceInfo = {};
      var sex = '';

      faceInfo.x = result.x;
      faceInfo.y = result.y;

      if (result.age) {
        faceInfo.age = result.age;
      } else {
        faceInfo.age = 18;
      }
      if (result.beauty) {
        faceInfo.beauty = result.beauty;
      }
      else {
        faceInfo.beauty = 80;
      }

      try {
        var gender = parseInt(result.gender);
        if (gender < 50) {
          faceInfo.gender = '女';
          sex = 'woman';
        } else if (gender == 50) {
          faceInfo.gender = '中性';
          sex = 'woman';
        }
        else if (gender > 50) {
          faceInfo.gender = '男';
          sex = 'man';
        }
      } catch (e) {
        faceInfo.gender = '中性';
        sex = 'woman';
      }

      if (result.expression) {
        faceInfo.expression = getExpression(result.expression, sex);
      }
      else {
        faceInfo.expression = '没有表情'
      }

      //console.log('result.faceInfo ' + angular.toJson(faceInfo));

      return faceInfo;
    }

    //将手机本地图片上传到阿里云服务器
    function uploadLocalImageToAaLi(path, imageUrl, success) {
      var url = baseConfig.queryPath + path;

      var options = new FileUploadOptions(
        'file', 'image.jpg', 'image/jpeg', null,
        {"Authorization": "Bearer " + window.localStorage.token}, 'POST');

      var trustAllHosts = true;
      var fileTransfer = new FileTransfer();

      if (baseConfig.debug) {
        alert('uploadImage.start url ' + angular.toJson(url));
        alert('uploadImage.start options ' + angular.toJson(options));
        alert('uploadImage.start imageURI ' + angular.toJson(imageUrl));
      }

      hmsPopup.showLoading('识别信息中');

      fileTransfer.upload(
        imageUrl,
        encodeURI(url),//上传服务器的接口地址
        success,
        err,
        options,
        trustAllHosts
      );

      function err(response) {
        hmsPopup.hideLoading();
        if (baseConfig.debug) {
          alert('complete.error ' + angular.toJson(response));
        }
        //hmsPopup.showPopup('上传图片到服务器器，请重新上传！');
      }
    }


    function compressImage(fileUrl, x, y, imgWidth) {
      var deferred = $q.defer();
      var canvas = document.createElement('CANVAS');
      canvas.width = imgWidth;
      canvas.height = imgWidth;
      var ctx = canvas.getContext('2d');
      var img = new Image;
      img.crossOrigin = 'Anonymous';
      img.onerror = function () {
        deferred.reject("compressImage error!");
      };
      img.onload = function () {
        var width = img.width;
        var height = img.height;

        var offset;
        var offsetWH = height - width;
        if (height / y > 2.25) {
          offset = offsetWH / 2;
        } else {
          offset = offsetWH;
        }

        if (baseConfig.debug) {
          console.log('compressImage x ' + x);
          console.log('compressImage y ' + y);
          console.log('compressImage width ' + width);
          console.log('compressImage height ' + height);
          console.log('compressImage offset ' + offset);
          console.log('compressImage offsetWH ' + offsetWH);
        }

        ctx.drawImage(img, 0, offset, width, width, 0, 0, width, width);
        var dataURL = canvas.toDataURL('image/jpeg', 1);
        deferred.resolve(dataURL);
        canvas = null;
      };
      img.src = fileUrl;
      return deferred.promise;
    }

    function aliYunAuthorMoni() {
      var deferred = $q.defer();
      $timeout(function () {
        var result = {
          "rows": [
            {
              "mySign": "4s6dhkNHEWdaQ0mU8/msuEuCAnxhPTEwMDA5MzczJms9QUtJRHVnR2VwSk51WDdWZWlleXZIVFNFZzE5Q" +
              "TBla29QVzZVJmU9MTQ4NTA2NTMwOSZ0PTE0ODI0NzMzMjImcj03MzU3NTA2NjEmdT0xNDU1NDU5MjI0"}
          ],
          "success": true,
          "total": 1
        };
        deferred.resolve(result);
      }, 500);
      return deferred.promise;
    }

    function aliYunAuthor() {
      var deferred = $q.defer();
      var url = baseConfig.pluginBusinessPath + '/hcrm_web/i/api/getSign';
      var params = {
        "timestamp": new Date().getTime()
      }
      hmsHttp.post(url, params).success(function (response) {
        deferred.resolve(response);
      }).error(function (response) {
        deferred.reject(response);
      });
      return deferred.promise;
    }
  }
})();
