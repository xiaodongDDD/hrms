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
                              faceEcognitionService,
                              $state,
                              $http,
                              $ionicHistory) {
    var vm = this;
    window.localStorage.faceEcognition = 'true';
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

    /*var im = {
      "face_id": "1848085924808818687",
      "x": 90, "y": 267, "height": 176, "width": 176,
      "pitch": 16, "roll": -4, "yaw": -5, "age": 23, "gender": 11,
      "glass": false, "expression": 32, "beauty": 100
    };
    console.log('test im analysisFaceInfo ' + angular.toJson(faceEcognitionService.analysisFaceInfo(im)));*/

    var width = document.body.clientWidth;

    var outerPadding = 10;
    if (width < 360) {
      outerPadding = 10;
    } else {
      outerPadding = 15;
    }

    var areaWidth = width - 30;
    var outerWidth = width - 50;
    var InnerWidth = width - 50 - 2 * outerPadding;

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

    //人脸采集
    vm.faceEcognition = faceEcognition;
    vm.reFaceEcognition = reFaceEcognition;
    //上传到服务器
    vm.complete = complete;

    function reFaceEcognition() {
      vm.faceResult.imgUrl = '';
      vm.faceResult.imgUrlSrc = '';
      vm.faceResult.age = '';
      vm.faceResult.beauty = '';
      vm.faceResult.gender = '';
      vm.faceResult.expression = '';
      vm.faceResult.img = '';
      faceEcognition();
    }

    //采集人脸到阿里云和腾讯服务器
    function complete() {
      var success = function (res) {
        hmsPopup.hideLoading();
        var result = JSON.parse(res.response);
        if (baseConfig.debug) {
          alert('complete.success ' + angular.toJson());
        }
        if (result.success == true) {
          hmsPopup.showPopup('采集成功');

          faceEcognitionService.setFaceEcognitionFlag(true);
          //$state.go("tab.face-ecognition-setting", {"from": "collection"});
          $ionicHistory.goBack();
        } else {
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
          if (vm.progress.progress == 100) {
            //hmsPopup.hidePopup();
          } else {
            hmsPopup.showLoading('上传图片进度为 ' + Math.round(vm.progress.progress) + '%');
          }


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
      vm.faceResult.imgUrlSrc = result.imgPath;
      if (result.age) {
        vm.faceResult.age = result.age;
      } else {
        vm.faceResult.age = 18;
      }
      if (result.beauty) {
        vm.faceResult.beauty = result.beauty;
      }
      else {
        vm.faceResult.beauty = 80;
      }

      try {
        var gender = parseInt(result.gender);
        if (gender < 50) {
          vm.faceResult.gender = '女';
          sex = 'woman';
        } else if (gender == 50) {
          vm.faceResult.gender = '中性';
          sex = 'woman';
        }
        else if (gender > 50) {
          vm.faceResult.gender = '男';
          sex = 'man';
        }
      } catch (e) {
        vm.faceResult.gender = '中性';
        sex = 'woman';
      }

      if (result.expression) {
        vm.faceResult.expression = faceEcognitionService.getExpression(result.expression, sex);
      }
      else {
        vm.faceResult.expression = '没有表情'
      }

      vm.faceResult.img = result.imgPath;
      vm.faceEcognitionResult = true;
      $scope.$apply();
    }

    //人脸识别
    function faceEcognition() {
      if (baseConfig.debug) {
        console.log('faceEcognition.work...');
      }

      if (faceEcognitionService.getNoPluginMode()) {
        //临时解决方案
        uploadToAliServe();
      } else {
        pluginface.faceDetect('', faceEcognitionSuccess, faceEcognitionError);
      }

    }

    //上传图片到阿里云
    function uploadToAliServe() {
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 80,
        targetWidth: 500,
        targetHeight: 500,
        destinationType: Camera.DestinationType.FILE_URI,
        //destinationType: Camera.DestinationType.DATA_URL,
        cameraDirection: Camera.Direction.FRONT
      });

      function onFail(imageURI) {
        //if (baseConfig.debug) {
        //alert(imageURI);
        //}
      }

      function onSuccess(imageURI) {
        if (baseConfig.debug) {
          alert(imageURI);
          console.log('imageData ' + angular.toJson(imageURI));
        }

        faceEcognitionService.uploadLocalImageToAaLi('/objectUpload', imageURI, win);

        function win(res) {

          if (baseConfig.debug == false) {
            //alert('complete.success ' + angular.toJson(JSON.parse(res.response)));
            console.log('complete.success ' + angular.toJson(JSON.parse(res.response)));
          }

          var imageResult = JSON.parse(res.response);
          if (imageResult.status == 'S' && imageResult.returnData.objectUrl) {

            faceEcognitionService.aliYunAuthor().then(
              function (result) {
                //alert('result ' + angular.toJson(result));
                //alert('result.success ' + result.success);
                //alert('result.rows[0] ' + angular.toJson(result.rows[0]));
                if (result.success == true && result.rows[0]) {
                  var mySign = result.rows[0].mySign;
                  getYouTuInfo(imageResult.returnData.objectUrl, imageURI, mySign, '识别信息中');
                }
                else {
                  hmsPopup.showPopup('识别失败，请重新识别_！');
                }
              }
            );
          }
          else {
            hmsPopup.hideLoading();
            hmsPopup.showPopup('识别失败，请重新识别__！');
          }
        }
      }
    }

    function getYouTuInfo(imageOuterURI, localUrl, mySign, prompt) {
      var params = {
        "app_id": "10009373",
        "url": imageOuterURI,
        "mode": 0
      };

      var headers =
      {
        "headers": {
          "Authorization": mySign,
          "Content-Type": "text/json"
        }
      };

      hmsPopup.showLoading(prompt);

      $http.post(baseConfig.tengxuntuyouServer, params, headers).success(
        function (result) {
          hmsPopup.hideLoading();

          if (result.errorcode == 0) {
            vm.faceResult = faceEcognitionService.analysisFaceInfo(result.face[0]);
            vm.faceResult.imgUrl = localUrl;
            faceEcognitionService.compressImage(localUrl, vm.faceResult.x,
              vm.faceResult.y, result.image_width).then(
              function (imgUrlSrc) {
                //alert('compressImage imgUrlSrc ' + imgUrlSrc);
                vm.faceResult.imgUrlSrc = imgUrlSrc;
              }
            );
            vm.faceEcognitionResult = true;
          } else {
            hmsPopup.showPopup('您的信息识别失败，请重新识别！');
          }
        }
      ).error(function (result) {
        hmsPopup.hideLoading();
      })
    }
  }
})();
