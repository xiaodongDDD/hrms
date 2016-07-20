/**
 * Created by xuchengcheng on 2016/7/12.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.houses-photo-list', {
          url: '/houses-photo-list',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/houses-sublease/houses-photo-list.html',
              controller: 'HousesPhotoListCtrl'
            }
          },
          params: {
            housesImageList: ''
          }
        })
    }]);

angular.module('applicationModule')
  .controller('HousesPhotoListCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$ionicScrollDelegate',
    '$timeout',
    '$ionicActionSheet',
    '$stateParams',
    function ($scope,
              $rootScope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $ionicScrollDelegate,
              $timeout,
              $ionicActionSheet,
              $stateParams) {

      $scope.housesPhoto = [
        //{"objectUrl": ""}
        //{"objectUrl": 'build/img/application/houses-sublease/IMG_2201 Copy@3x.png'},
        //{"objectUrl": 'build/img/application/houses-sublease/IMG_2202@3x.png'},
        //{"objectUrl": 'build/img/application/houses-sublease/default@3x.png'}
      ];
      angular.forEach($stateParams.housesImageList, function(data, index, array){
        $scope.housesPhoto.push(array[index]);
      });

      $scope.takePicture = function () {
        var hideSheet = $ionicActionSheet.show({
          buttons: [
            {text: '拍照'},
            {text: '相册'}
          ],
          //destructiveText: 'Delete',
          titleText: '选择相片',
          cancelText: '取消',
          cssClass: 'image-take-actionsheet',
          cancel: function () {
            //$scope.config.actionSheet();
          },
          buttonClicked: function (index) {
            if (index == 0) { //拍照
              $scope.selectImage(0);
              return true;
            } else if (index == 1) { //相册
              $scope.selectImage(1);
              return true;
            }
            //return false;
          }
        });
      };

      $scope.selectImage = function (sourceTypeInt) {
        if (angular.isUndefined(Camera) || angular.isUndefined(navigator.camera)) {
          alert("Camera 插件未安装!");
          return;
        }
        if (angular.isUndefined(window.plugins) || angular.isUndefined(angular.isUndefined(window.plugins.Base64))) {
          alert("Camera 插件未安装!");
          return;
        }
        var sourceType;
        if (sourceTypeInt == 0) {
          sourceType = Camera.PictureSourceType.CAMERA;
        } else if (sourceTypeInt == 1) {
          sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
        } else if (sourceTypeInt == 2) {
          sourceType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
        }
        var options = {
          quality: 50,
          sourceType: sourceType,
          destinationType: Camera.DestinationType.FILE_URL, //1, //'FILE_URL',
          encodingType: Camera.EncodingType.JPEG, //0, //'JPEG',
          mediaType: Camera.MediaType.PICTURE, //0, //'PICTURE',
          saveToPhotoAlbum: false,
          cameraDirection: Camera.Direction.BACK, // 0, //'BACK'
          targetWidth: 1366, targetHeight: 768
        };
        if (navigator.camera) {
          navigator.camera.getPicture(onSuccess, onFail, options);
        } else {
          alert("Camera 插件未安装!");
        }
        function onSuccess(imageUrl) {
          $scope.photoUrl = {
            "objectUrl": imageUrl,
            "flag": "add"
          };
          console.log("imageUrl: " + $scope.photoUrl);
          $scope.housesPhoto.push($scope.photoUrl);
          //console.log("imageUrl+++++++++: " + angular.toJson($scope.housesPhoto));
          $scope.$apply();
          //imgUpLoad(imageUrl);
          //image.src = "data:image/jpeg;base64," + imageData;
        }

        function onFail(message) {
          alert('Failed because: ' + message);
        }

        //function imgUpLoad(imageUrl) {//图片上传
        //  var url = baseConfig.queryPath + "/image/upload";
        //  var options = new FileUploadOptions();
        //  options.fileKey = "ffile";
        //  options.fileName = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
        //  options.mimeType = "image/jpeg";
        //  //用params保存其他参数，例如昵称，年龄之类
        //  var params = {};
        //  //params['name'] = $scope.me.name;
        //  options.params = params;
        //  var ft = new FileTransfer();
        //  ft.upload(imageUrl, encodeURI(url), uploadSuccess, uploadError, options);
        //  function uploadSuccess(r) {
        //
        //  }
        //
        //  function uploadError(error) {
        //  }
        //}
      };
      $scope.goBack = function () {//返回按钮
        $rootScope.$broadcast("housesReleasePhoto", $scope.housesPhoto);
        //console.log("111111111111111111");
        $ionicHistory.goBack();
      };
    }]);
