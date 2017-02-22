'use strict';
angular.module('myInfoModule')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.send-card', {
          url: '/myInfo/send-card',
          views: {
            'tab-myInfo': {
              prefetchTemplate: false,
              templateUrl: 'build/pages/myInfo/sendCard/sendCard.html',
              controller: 'sendCardCtrl'
            }
          }
        })
    }]);
  angular.module('myInfoModule')
    .controller('sendCardCtrl', [
      '$scope',
      'baseConfig',
      '$ionicHistory',
      '$state',
      '$rootScope',
      '$timeout',
      '$cordovaActionSheet',
      '$ionicActionSheet',
      '$ionicModal',
      '$cordovaCamera',
      '$ionicPopover',
      'customerService',
      'hmsPopup',
      'sendCardService',
      '$ionicSlideBoxDelegate',
      function ($scope,
                baseConfig,
                $ionicHistory,
                $state,
                $rootScope,
                $timeout,
                $cordovaActionSheet,
                $ionicActionSheet,
                $ionicModal,
                $cordovaCamera,
                $ionicPopover,
                customerService,
                hmsPopup,
                sendCardService,
                $ionicSlideBoxDelegate) {
        $scope.operating=[
          {text:"创建名片"},
          {text:"我的地址"}
        ];
    $scope.ORCode=function(item){
     console.log(item);
      if($scope.cardList.status=="已认证"){
        $state.go("tab.my-card");
      }else{
        hmsPopup.showPopup("名片需审批通过后，方可分享");
      }
    };
        $ionicModal.fromTemplateUrl('build/pages/myInfo/sendCard/addCard/addCard.html',{
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal){
          $scope.cardAddModel = modal;
        });
        //$scope.popoverCard = $ionicPopover.fromTemplateUrl('build/pages/modals/popover-card.html', {
        //  scope: $scope
        //});

        // .fromTemplateUrl() 方法
        $ionicPopover.fromTemplateUrl('build/pages/modals/popover-card.html', {
          scope: $scope
        }).then(function(popover) {
          $scope.popoverCard = popover;
        });
        var getCardListSuccess=function(result){
          console.log($ionicSlideBoxDelegate.currentIndex());
          if(result.status=="S"){
            $scope.cardList=result.res_list;
            $ionicSlideBoxDelegate.update();
            for(var i=0;i< $scope.cardList.length;i++ ){
              if($scope.cardList[i].status=="PENDING"){
                $scope.cardList[i].status="审核中";
              }else if($scope.cardList[i].status=="NEW"){
                $scope.cardList[i].status="未提交";
              }else if($scope.cardList[i].status=="APPROVED"){
                $scope.cardList[i].status="已认证";
              }else if($scope.cardList[i].status=="REFUSED"){
                $scope.cardList.status="已拒绝";
              }else if($scope.cardList[i].status=="CANCELED"){
                $scope.cardList[i].status="取消";
              }
            }
            //if(result.res_list.status=="PENDING"){
            //  $scope.cardList.status="审核中";
            //}else if(result.res_list.status=="NEW"){
            //  $scope.cardList.status="未提交";
            //}else if(result.res_list.status=="APPROVED"){
            //  $scope.cardList.status="已认证";
            //}else if(result.res_list.status=="REFUSED"){
            //  $scope.cardList.status="已拒绝";
            //}else if(result.res_list.status=="CANCELED"){
            //  $scope.cardList.status="取消";
            //}
            if($scope.cardList.length!=0){
              $scope.cardIndex=0;
              console.log($scope.cardList[$scope.cardIndex]);
            }
            //$ionicSlideBoxDelegate.update();
          }
        };
        $scope.slideHasChanged=function(index){
          $scope.cardIndex=index;
          console.log(index);
        };

        sendCardService.getCardList(getCardListSuccess);
        var getHeadPictureSuccess=function(result){
          console.log(result);
          if(result.status=="E"){
            var saveHeadPictureSuccess=function(result){
              console.log(result);
            };
            var p_url="http://shp.qpic.cn/bizmp/A3gUw79X8ZuImeE77PlFVaTub2dJK5lCw7Hneq9ufMgRTxm6Qx0LAw/";
            sendCardService.saveHeadPicture(saveHeadPictureSuccess,p_url);
          }else{
            $scope.headerurl=result.url;
          }
        };
        sendCardService.getHeadPicture(getHeadPictureSuccess);
        //var getEmployeeInfoSuccess=function(result){
        //  if(result.con_status=="S"){
        //    $scope.cardList=result.res_list;
        //  }
        //}
        //sendCardService.getEmployeeInfo(getEmployeeInfoSuccess);
        $scope.openPopover = function($event) {
          $scope.popoverCard.show($event);
        };
        $scope.closePopover = function(index) {
          $scope.popoverCard.hide();
          if(index==0){
            $scope.$broadcast('ADD_CARD');
            $scope.cardAddModel.show();
          }else{
            $state.go("tab.myAddress");
          }
        };
        $scope.addCard=function(){
          //$state.go("tab.addCard");
          $scope.$broadcast('ADD_CARD');
          $scope.cardAddModel.show();
        };
        $rootScope.$on('UPDATE_CARD_INFO',function(){
          sendCardService.getCardList(getCardListSuccess);
        });
        $rootScope.$on('CLOSE_CARD_ADD',function(){
          $scope.cardAddModel.hide();
        });
        $scope.shareMyCard = function (item){
          if($scope.cardList.status=="已认证"){
            console.log(item);
            //分享显示的图片，默认
            var imgurl = 'http://mobile-app.hand-china.com/hrmsstatic/hrms-img/icon.png';
            //分享显示的图片，取转租信息中的第一张照片
            //if ($scope.housesSubDetail.imgs.length > 0) {
            //  imgurl = $scope.housesSubDetail.imgs[$scope.slideIndex].objectUrl;
            //}
            var youtuiShare = window.plugins.youtuiShare;
            youtuiShare.share(success, fail, [
              '分享名片',   //标题
              "http://www.baidu.com", //链接
              "分享我的名片", //描述
              imgurl  //图片
            ]);

          }else{
            hmsPopup.showPopup("名片需审批通过后，方可分享");
          }
          function success(success) {
            if(success.code=='0'){
              //分享成功
            }
          }
          function fail(error) {
            if(error.code=='-1'){
              //分享失败
            }else if(error.code=='-2'){
              //用户取消
            }
          }
        };
        var deleteCardInfoSuccess=function(result){
          hmsPopup.showShortCenterToast(result.message);
          sendCardService.getCardList(getCardListSuccess);
        };
        function editCard(){
          console.log($scope.cardDetail);
          $scope.cardAddModel.show();
          sendCardService.setCardDetail($scope.cardDetail);
          $scope.$broadcast('EDIT_CARD');
        }
        function printCard(){
          console.log($scope.cardDetail);
          $state.go("tab.printCard",{params:$scope.cardDetail});
        }
        function deleteCard(){
          $ionicSlideBoxDelegate.slide(0);
          sendCardService.deleteCardInfo(deleteCardInfoSuccess,$scope.cardDetail.card_id);
        }
        //相册功能
        $scope.readalbum  = function() {
          var sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
          var options = {
            quality: 20,
            sourceType: sourceType,
            destinationType: Camera.DestinationType.FILE_URI, //1, //'FILE_URL',
            encodingType: Camera.EncodingType.JPEG, //0, //'JPEG',
            mediaType: Camera.MediaType.PICTURE, //0, //'PICTURE',
            saveToPhotoAlbum: false,
            cameraDirection: Camera.Direction.BACK, // 0, //'BACK'
            //targetWidth: 1366, targetHeight: 768,
            correctOrientation: true
          };
          if (navigator.camera) {
            navigator.camera.getPicture(onSuccess, onFail, options);
          } else {
            alert("Camera 插件未安装!");
          }
          function onSuccess(imageUrl) {
            $scope.imagevalue = imageUrl;
            $scope.va_phote_succflag = true;

            try {
              if ($scope.va_phote_succflag == true) {

                var imageParam = {
                  imagePath: $scope.imagevalue
                };

                cordova.plugins.ImageExt.cropimage(
                  function success(newPath) {
                    $scope.$apply(function () {
                      $scope.imagevalue = newPath;
                      customerService.uploadImage($scope.imagevalue, upLoadSuccess, upLoadError);
                    });
                  },
                  function fail(err) {
                    $scope.va_phote_succflag = false;
                  }, imageParam.imagePath);

              }
              ;
            } catch (e) {
              alert(e.message)
            }
          }
          function onFail(message) {
            $scope.va_phote_succflag = false;
            alert('Failed because: ' + message);
          }

        };
        //图片上传
        var upLoadSuccess = function (res) {
          hmsPopup.hideLoading();
          var result = JSON.parse(res.response);
          if (baseConfig.debug) {
            alert('complete.success ' + angular.toJson());
          }
          if(result.success == true){
            //hmsPopup.showPopup('上传成功');
            console.log('上传成功。。。'+angular.toJson(result))
            //$scope.customer.logoUrl = result.rows[0].objectUrl;
            //customerDetailService.updateImage(updateSuccess,$scope.customerId,$scope.customer.logoUrl);

          }else{
            console.log('上传失败了。。。'+angular.toJson(result))
            hmsPopup.showShortCenterToast('上传失败');
            //hmsPopup.showPopup('上传失败！');
          }
          $scope.save();
        };

        var upLoadError = function (response) {
          hmsPopup.hideLoading();
          if (baseConfig.debug) {
            alert('complete.error ' + angular.toJson(response));
          }
          console.log('上传错误了。。。'+angular.toJson(response))
          //hmsPopup.showPopup('上传失败！');
          hmsPopup.showShortCenterToast('上传错误')
          $scope.save();
        };
        //相机功能
        $scope.taskPicture  = function(type) {
          var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            quality: 20,
            correctOrientation: true
          };
          $cordovaCamera.getPicture(options).then(function(imageURI) {

            $scope.imagevalue = imageURI;
            $scope.isShow_image = true;

            var imageParam = {
              imagePath: $scope.imagevalue
            };

            cordova.plugins.ImageExt.cropimage(
              function success(newPath) {
                $scope.$apply(function () {
                  $scope.imagevalue = newPath;
                  customerService.uploadImage($scope.imagevalue, upLoadSuccess, upLoadError);
                });
              },
              function fail(err) {
                $scope.va_phote_succflag = false;
              }, imageParam.imagePath);

          }, function(err) {
            //$scope.person_imgsrcvalue = '';
            //$scope.Toast.show('取消使用相机功能');
          });
        };
        $scope.closeBigPic = function(){
          $scope.showBig = false;
        };

        $scope.showBigPic = function(){
          $scope.showBig = true;
        };
        $scope.ImageUpload = function () {
          var hideSheet = $ionicActionSheet.show({
            buttons: [
              {text: '拍照上传'},
              {text: '从相册中选择'},
              {text: '查看大图'}
            ],
            cancelText: '取消',
            cancel: function () {
              // add cancel code..
            },
            buttonClicked: function (index) {
              if (index == 0) {
                //拍照
                $scope.taskPicture();
              } else if (index == 1) {
                // 相册文件选择上传
                $scope.readalbum();
              } else if (index == 2) {
                $scope.showBigPic();
              }
              return true;
            }
          });
        };
        $scope.moreOp=function(item){
          console.log(item);
          $scope.cardDetail=item;
          if (ionic.Platform.isWebView()) {
            console.log("webView");
            var options = {
              buttonLabels: ['打印名片', '编辑', '删除'],
              addCancelButtonWithLabel: '取消',
              androidEnableCancelButton: true,
              androidTheme: window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT,
              title: '请选择操作'
            };
            document.addEventListener("deviceready", function () {
              $cordovaActionSheet.show(options)
                .then(function (btnIndex) {
                  if (btnIndex == 1) {
                    //打印名片
                    printCard();
                    return true;
                  } else if (btnIndex == 2) {
                    //编辑
                    editCard();
                    return true;
                  } else if (btnIndex == 3) {
                   //删除名片
                    deleteCard();
                  }
                });
            }, false);
          } else {
            var hideSheet = $ionicActionSheet.show({
              buttons: [
                {text: '打印名片'},
                {text: '编辑'},
                {text: '删除'}
              ],
              cancelText: '取消',
              cancel: function () {
                // add cancel code..
              },
              titleText: '请选择操作',
              buttonClicked: function (index) {
                console.log(index);
                if (index == 0) {
                  printCard();
                  return true;
                } else if (index == 1) {
                  editCard();
                  return true;
                } else if (index == 2) {
                  deleteCard();
                  return true;
                }
              }
            });
          }
        };
        $scope.goCardDetail=function(item){
          console.log(item);
          $state.go("tab.cardDetail",{params:item});
        }
}]);

