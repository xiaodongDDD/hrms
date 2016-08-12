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
    '$ionicModal',
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
              $stateParams,
              $ionicModal) {

      $scope.housesPhoto = [];
      $scope.deleteImageList = [];
      angular.forEach($stateParams.housesImageList, function (data, index, array) {
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
          //console.log("imageUrl: " + $scope.photoUrl);
          $scope.housesPhoto.push($scope.photoUrl);
          //console.log("imageUrl+++++++++: " + angular.toJson($scope.housesPhoto));
          $scope.$apply();
        }
        function onFail(message) {
          //alert('Failed because: ' + message);
        }
      };

      $scope.goBack = function () {//返回按钮
        //console.log("被删除的图片数组+++", angular.toJson($scope.deleteImageList));
        $rootScope.$broadcast("housesReleasePhoto", $scope.housesPhoto);
        $ionicHistory.goBack();
      };

      $scope.operatePhoto = function (event, image) { //拨打电话按钮的响应事件
        event.stopPropagation(); //阻止事件冒泡
        try {
          $ionicActionSheet.show({
            buttons: [
              {text: '显示原图'},
              {text: '删除图片'}
            ],
            cancelText: '取消',
            buttonClicked: function (index) {
              if (index == 0) {
                showBigPicture(image.objectUrl);
                return true;
              } else if (index == 1) {
                deleteImage(image.objectUrl);
                return true;
              }
            }
          });
        } catch (e) {
          alert(e);
        }
      };
      $scope.zoomMin = 1;
      var showBigPicture = function (picUrl) {//显示大图
        $scope.photoHight = {
          "height": window.screen.height + "px"
        };
        $scope.photoZoomUrl = picUrl;
        $scope.showModal('build/pages/application/houses-sublease/houses-photo-zoom.html');
        //$scope.pictureAppearance = true;
        //$scope.extensionPicture = picUrl;
        //$timeout(function () {
        //  var bigPicture = document.getElementById('my-big-picture');
        //  var picHeight = bigPicture.offsetHeight;
        //  var picWidth = bigPicture.offsetWidth;
        //  var screenWidth = window.screen.width;
        //  if (picHeight > picWidth) {
        //    bigPicture.style.width = 100 + "%";
        //    bigPicture.style.height = 100 + "%";
        //    bigPicture.style.marginTop = 10 + "px";
        //  } else if (picHeight < picWidth) {
        //    bigPicture.style.width = 100 + "%";
        //    if (screenWidth > 310 && screenWidth <= 350) {
        //      bigPicture.style.height = 170 + "px";
        //      bigPicture.style.marginTop = 150 + "px";
        //    } else if (screenWidth > 350 && screenWidth <= 380) {
        //      bigPicture.style.height = 225 + "px";
        //      bigPicture.style.marginTop = 180 + "px";
        //    } else if (screenWidth > 380 && screenWidth <= 420) {
        //      bigPicture.style.height = 240 + "px";
        //      bigPicture.style.marginTop = 210 + "px";
        //    } else if (screenWidth > 420) {
        //      bigPicture.style.height = 255 + "px";
        //      bigPicture.style.marginTop = 240 + "px";
        //    }
        //  }
        //}, 100);
      };
      //$scope.hideBigPicture = function () {//隐藏大图
      //  $scope.pictureAppearance = false;
      //};
      $scope.showModal = function(templateUrl) {
        $ionicModal.fromTemplateUrl(templateUrl, {
          scope: $scope
        }).then(function(modal) {
          $scope.modal = modal;
          $scope.modal.show();
        });
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
        $scope.modal.remove()
      };

      var deleteImage = function(picUrl) {
        for(var i = 0; i < $scope.housesPhoto.length; i++){
          if(picUrl == $scope.housesPhoto[i].objectUrl){
            $scope.housesPhoto[i].flag = 'del';
          }
        }
      }
    }]);
