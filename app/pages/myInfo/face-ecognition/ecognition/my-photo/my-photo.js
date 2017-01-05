/**
 * Created by bobo on 2016/12/30.
 */
(function () {
  'use strict';
  angular
    .module('myInfoModule')
    .config(config);
  function config($stateProvider) {
    $stateProvider
      .state('tab.face-ecognition-my-photo', {
        url: '/myInfo/face-ecognition-my-photo',
        views: {
          'tab-myInfo': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/myInfo/face-ecognition/ecognition/my-photo/my-photo.html',
            controller: 'myPhotoCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }

  angular
    .module('myInfoModule')
    .controller('myPhotoCtrl', myPhotoCtrl);
  function myPhotoCtrl($scope,
                       $state,
                       $ionicHistory,
                       baseConfig,
                       $stateParams,
                       hmsPopup,
                       hmsReturnView,
                       hmsHttp,
                       $ionicScrollDelegate,
                       $ionicModal,
                       $ionicSlideBoxDelegate,
                       $ionicActionSheet) {


    var vm = this;
    vm.photoList = [];
    vm.count = 0;
    vm.totalNum=0;

    vm.loadingFlag = true;

    var width = document.body.clientWidth / 3.125;

    vm.imgHeight = {
      "height": width + 'px'
    }

    vm.goBack = goBack;
    vm.getPhotoList = getPhotoList;
    vm.faceEcognition = faceEcognition;
    vm.setCover = setCover;
    vm.closeModal = closeModal;
    vm.showPhotoList = showPhotoList;
    vm.deletePhoto = deletePhoto;
    vm.showActionSheet = showActionSheet;

    $scope.$on('$ionicView.enter', function (e) {
      vm.loadingFlag = true;
      //hmsPopup.showLoading();
      vm.getPhotoList();
    });
    $scope.showMenu=false;//显示自定义ActionSheet组件
    //路由
    function goBack() {
      $ionicHistory.goBack();
    }

    function faceEcognition() {
      $state.go('tab.face-ecognition');
    }

    function setCover() {

      var url = baseConfig.queryPath + '/photo/setCover';
      var photo = vm.photoList[vm.count];
      if (photo.isCover == 'Y') {
        hmsPopup.showPopup('Sorry，无法取消，可点击其他图片进行更换');
      } else {
        hmsPopup.confirm("是否更换这张照片，用于年会摇奖身份核对？", "提示", function (index) {
          if (index == 0) {
            console.log('取消')
          } else {
            hmsHttp.post(url, {id: photo.id}).success(function (result) {
              console.log(result);
              /*if(result.success){
               vm.photoList[vm.count].isCover="Y";
               }*/
              closeModal();
              $ionicScrollDelegate.resize();
            }).error(function (err, status) {
              console.log(err);
              console.log(status)
            })
          }
        })

      }
    }

    function getPhotoList() {
      var url = baseConfig.queryPath + '/photo/getMyPhotos';
      hmsHttp.post(url, {}).success(function (result) {
        vm.loadingFlag = false;
        console.log(result);
        vm.photoList = result.rows;
        vm.totalNum=result.total
        //hmsPopup.hideLoading();
        console.log(vm.totalNum);
        $ionicScrollDelegate.resize();
      }).error(function (err, status) {
        vm.loadingFlag = false;
        console.log(err);
        console.log(status)
      })
    }

    function deletePhoto() {
      var url = baseConfig.queryPath + '/photo/deletePhoto';
      var photo = vm.photoList[vm.count];
      hmsHttp.post(url, {id: photo.id}).success(function (result) {
        console.log(result);
        closeModal();
        $scope.showMenu=!$scope.showMenu;
        if (result.success) {
          getPhotoList();
        }
        $ionicScrollDelegate.resize();
      }).error(function (err, status) {
        console.log(err);
        console.log(status)
      })
    }

    function showPhotoList(index) {
      console.log(index)
      $scope.photoHight = {
        "height": window.screen.width + "px"
      };
      vm.count = index;
      $scope.showModal('build/pages/myInfo/face-ecognition/ecognition/my-photo/model/bigPhotoList.html');
    };
    $scope.showModal = function (templateUrl) {//显示原图
      $ionicModal.fromTemplateUrl(templateUrl, {
        scope: $scope
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
        $scope.showMenu=false;
      });
    };
    function closeModal() {
      getPhotoList();
      $scope.showMenu=!$scope.showMenu;
      $scope.modal.hide();
      $scope.modal.remove()
    };
    function showActionSheet() {
      $scope.showMenu=!$scope.showMenu;
      // var hideSheet = $ionicActionSheet.show({
      //   buttons: [
      //     {
      //       text: "<span>删除</span>",
      //     }
      //
      //   ],
      //   // destructiveText: 'Delete',
      //   titleText: '要删除这张照片么?',
      //   cancelText: '取消',
      //   cancel: function () {
      //     // add cancel code..
      //   },
      //   buttonClicked: function (index) {
      //     if (index == 0) {
      //       deletePhoto();
      //       closeModal();
      //       hideSheet();
      //     }
      //
      //   }
      // });
    }

  }
})();
