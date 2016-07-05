angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.acc_photos', {
          url: '/acc/photos',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/acc/photos.html',
              controller: 'photosController'
            }
          }
        });
    }]);

angular.module("applicationModule")
  .controller('photosController', function ($scope, keepAccount, $state, $ionicPopup, $ionicLoading, $ionicActionSheet, dialog, baseConfig, hmsPopup) {

    $scope.photos = keepAccount.data.photos;


    //showMessage(angular.toJson(keepAccount.data.photos));
    $scope.serverURL = baseConfig.serverPath;

    $scope.photoPathURL = baseConfig.appRootPath;

    $scope.showAlertPhoto = function (photoSrc) {//点击图片 放大图片
      $scope.photoSrcUrl = photoSrc;
      // 自定义弹窗
      var myPopup = $ionicPopup.show({
        scope: $scope,
        template: '<div style="text-align: center;"><img ng-src="{{photoSrcUrl}}"  style="width: 95%; height: 350px"></div>',
        buttons: [
          {text: '取消'}
        ]
      });
      myPopup.then(function (res) {
        console.log('Tapped!', res);
      });
    };
    /*
     destinationType:Camera.DestinationType.FILE_URI,
     sourceType:Camera.PictureSourceType.CAMERA,
     quality :35,
     allowEdit:true,
     encodingType:Camera.EncodingType.JPEG,
     saveToPhotoAlbum:false};
     */
    //var optionCameraOld = {
    //    quality: 25,
    //    destinationType: Camera.DestinationType.FILE_URI ,
    //    sourceType : Camera.PictureSourceType.CAMERA,
    //    saveToPhotoAlbum : false,
    //    allowEdit:true
    //
    //
    //    //sourceType : Camera.PictureSourceType.PHOTOLIBRARY
    //
    //};
    /*拍摄照片 相机*/
    // $scope.getPhotoFromCamera=function(){
    var tPhotoFromCamera = function () {
      //if (detectOS() == "iPhone") {
      if(ionic.Platform.isIOS() && !ionic.Platform.isIPad()){
        var optionsCamera = {
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          quality: 50,
          allowEdit: false,
          targetWidth: 1366,
          targetHeight: 768,
          encodingType: Camera.EncodingType.JPEG,
          saveToPhotoAlbum: false
        };
        //alert("iphone");
      }
      else {
        var optionsCamera = {
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.CAMERA,
          quality: 50,
          allowEdit: false,
          //targetWidth : 100,
          //targetHeight : 100,
          encodingType: Camera.EncodingType.JPEG,
          saveToPhotoAlbum: false
        };
        //alert("not iphone");

      }
      // alert(angular.toJson(optionsCamera));
      // alert(navigator.camera.getPicture);
      navigator.camera.getPicture(onSuccess, onFail, optionsCamera);

    };

    /*拍摄照片 相册*/
    var getPhotoFromLibary = function () {
      var optionsPhotoLibrary = {
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        quality: 50,
        allowEdit: false,
        targetWidth: 1366,
        targetHeight: 768,
        encodingType: Camera.EncodingType.JPEG,
        saveToPhotoAlbum: false
      };
      navigator.camera.getPicture(onSuccess, onFail, optionsPhotoLibrary);

    };


    /*打开dialog*/

    /*
     $scope.dialogs = {};
     $scope.openDialog=function(dlg) {
     if (!$scope.dialogs[dlg]) {
     ons.createDialog(dlg).then(function(dialog) {
     $scope.dialogs[dlg] = dialog;
     dialog.show();
     });
     }
     else {
     $scope.dialogs[dlg].show();
     }
     };

     ****/

    /**/
    $scope.openPopup = function () {
      //$state.go('tab.acc_photos');


      if (keepAccount.canEdit == true) {
        $scope.popupView = $ionicPopup.show({

          templateUrl: 'templates/expense/popCamera.html',
          scope: $scope,
          title: "拍照"

        });
        $scope.popupView.then(function () {

          console.log("popup close");

        });
      }


    };

    //照相相册选择弹出框   add by xuchengcheng
    $scope.addPicture = function () {
      var hideSheet = $ionicActionSheet.show({
        buttons: [{
          text: '相册 '
        }, {
          text: '照相'
        }],
        titleText: '请选择获取方式',
        cancelText: '取 消',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          // 相册文件选择上传
          if (index == 0) {
            console.log("相册");
            $scope.selectPhotoSource("PhotoLibary");
          } else if (index == 1) {
            console.log("相机");
            // 拍照上传
            $scope.selectPhotoSource("Cemera");
          } else if (index == 2) {
            $scope.viewPhotos();
          }
          return true;
        }
      });
    }

    /*选择相机*/
    $scope.selectPhotoSource = function (sourceType) {
      if (sourceType == "Cemera") {
        getPhotoFromCamera();
      } else if (sourceType == "PhotoLibary") {
        getPhotoFromLibary();
      }
      console.log("sourceType " + sourceType);
      //$ionicPopup.close();
      // $scope.popupView.close();
      $ionicActionSheet.hide;
    };


    function onSuccess(imageURI) {

      //var image = document.getElementById('myImage');
      //image.src = imageURI;
      // alert("asd");

      console.log("----------" + angular.toJson(imageURI));
      movePic(imageURI);
      //$scope.$apply();
    }

    function onFail(message) {
      // alert('Failed because: ' + message);
    }


    function movePic(file) {
      window.resolveLocalFileSystemURL(file, resolveOnSuccess, resOnError);

    }

    //Callback function when the file system uri has been resolved
    function resolveOnSuccess(entry) {
      var d = new Date();
      var n = d.getTime();
      //new file name
      var newFileName = n + ".jpg";
      var myFolderApp = baseConfig.appRootFile;

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSys) {
          //The folder is created if doesn't exist
          fileSys.root.getDirectory(myFolderApp,
            {create: true, exclusive: false},
            function (directory) {
              console.log(directory);
              entry.moveTo(directory, newFileName, successMove, resOnError);
            },
            resOnError);
        },
        resOnError);
    }


    //Callback function when the file has been moved successfully - inserting the complete path
    function successMove(entry) {

      // 加载loading
      $ionicLoading.show({
        template: 'Loading...',
        duration: 1000
      });

      //Store imagepath in session for future use
      // like to store it in database
      var date = getFormatDate(new Date());
      var photo = {

        photo_id: '',
        photo_name: entry.name,
        // photo_src:entry.toNativeURL(),
        photo_src: entry.toURL(),
        creation_date: date,
        created_by: window.localStorage.empno
      };

      showMessage(photo.photo_src);
      showMessage(photo.photo_name);

      //showMessage(entry.toNativeURL()+' - '+entry.toURL());

      keepAccount.data.photos.push(photo);
      /*清除缓存*/
      //cleanupCache();
      $scope.photos = keepAccount.data.photos;
      //$scope.$apply();

      $ionicLoading.hide();
    }

    function resOnError(error) {
      alert(error.code);
    }

    /*打开确认照片页面*/
    $scope.showConfirmPhoto = function (index) {//图片长按删除
      //showMessage('showConfirmPhoto aa');
      //alert(index);
      keepAccount.tempPhoto = keepAccount.data.photos[index];
      keepAccount.tempPhotoIndex = index;
      showMessage("temp - - " + angular.toJson(keepAccount.tempPhoto));

      $scope.tempPhoto = keepAccount.tempPhoto;
      $scope.photoPathURL = baseConfig.appRootPath;
      $scope.canEdit = keepAccount.canEdit;

    if($scope.canEdit){
      //  confirm 对话框
      var confirmPopup = $ionicPopup.confirm({
        title: '<strong>提示</strong>',
        template: '<div style="text-align: center">是否确定删除本张图片?</div>'
      });
      confirmPopup.then(function (res) {
        if (res) {
          console.log('You are sure');
          $scope.removePhoto();
        } else {
          console.log('You are not sure');
        }
      });
    }

      // 删除照片
      $scope.removePhoto = function () {
        console.log("删除照片操作");
        //  删除 数据库
        var promise = keepAccount.removePhoto(keepAccount.tempPhoto.line_id);
        promise.then(
          function (response) {  // 调用承诺API获取数据 .resolve
            showMessage("数据删除成功");
            $scope.photos.splice(index, 1);
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, onError);
          },
          function (err) {  // 处理错误 .reject
            dialog.showAlert("E", "删除失败...." + angular.toJson(err));
            showMessage("删除失败...." + angular.toJson(err));
          });
      };

      function onSuccess(fileSystem, test) {
        console.log(fileSystem.name);
        showMessage(fileSystem.name);
        showMessage(keepAccount.tempPhoto.photo_src);
        var myFolderApp = baseConfig.appRootFile;

        showMessage(myFolderApp + '/' + keepAccount.tempPhoto.photo_name);
        fileSystem.root.getFile(myFolderApp + '/' + keepAccount.tempPhoto.photo_name, null, onGetFileSuccess, onGetFileError);
      }

      function onError(error) {
        showMessage(error.code);
      }

      function onGetFileSuccess(fileEntry) {
        console.log("File Name: " + fileEntry.name);
        showMessage("File Name: " + fileEntry.name);
        // remove the file
        fileEntry.remove(onRemoveSuccess, onRemoveFail);
      }

      function onGetFileError(error) {
        showMessage("Failed to retrieve file: " + error.code);
      }

      function onRemoveSuccess(entry) {
        console.log("Removal succeeded");
        showMessage("Removal succeeded");
        showMessage(keepAccount.tempPhotoIndex);
        showMessage(angular.toJson(keepAccount.data.photos));

        // 删除 照片纪录表
        keepAccount.removePhoto();

        // 删除 内存中照片列表
        //keepAccount.data.photos.splice(keepAccount.tempPhotoIndex, 1);
        keepAccount.data.photos = $scope.photos;


        showMessage('photos list:' + angular.toJson(keepAccount.data.photos));
      }

      function onRemoveFail(error) {
        showMessage('Error removing file: ' + error.code);
      }
    };


    /*清除相机缓存*/
    function cleanupCache() {
      navigator.camera.cleanup(cameraSuccess, cameraError);
    }

    function cameraSuccess() {
    }

    function cameraError(e) {
      alert(angular.toJson(e));
    }
  });
