/**
 * Created by xuchengcheng on 2016/7/11.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.houses-release', {
          url: '/houses-release',
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/houses-sublease/houses-release.html',
              controller: 'HousesReleaseCtrl'
            }
          },
          params: {
            housesReleaseInfo: '',
            flag: ""
          }
        })
    }]);

angular.module('applicationModule')
  .controller('HousesReleaseCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$ionicScrollDelegate',
    '$timeout',
    '$stateParams',
    '$cordovaDatePicker',
    function ($scope,
              $rootScope,
              $state,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $ionicScrollDelegate,
              $timeout,
              $stateParams,
              $cordovaDatePicker) {
      $scope.housesReleaseInfo = {//初始化房屋信息
        "empNo": "",
        "houseId": "",
        "houseTitle": "",
        "houseSubject": "",
        "houseTypeRoom": "",
        "houseTypeHall": "",
        "houseTypeBathRoom": "",
        "square": "",
        "trafficInfo": "",
        "rent": "",
        "expireDate": "",
        //"publishDate": "",
        //"publishEmp": "",
        "city": "",
        "area": "",
        "effectiveDays": "",
        "imgs": []
      };

      $rootScope.$on("housesReleasePhoto", function (event, data) {
        $scope.imageList = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].flag == 'add') {
            $scope.imageList.push(data[i]);
          }
        }
        //console.log("2222222222222222: " + angular.toJson($scope.imageList));
      });


      $scope.flag = $stateParams.flag;
      console.log("页面功能" + $scope.flag);
      if ($scope.flag == 'EDIT') {
        $scope.housesReleaseInfo = $stateParams.housesReleaseInfo;
      } else {
        $scope.housesReleaseInfo.empNo = window.localStorage.empno;
        $scope.housesReleaseInfo.expireDate = new Date().format('yyyy-MM-dd');
      }

      $scope.selectTime = function () { //时间选择
        if (ionic.Platform.isAndroid()) {
          selectTimeAndroid();
        } else {
          selectTimeIOS();
        }
      };
      function selectTimeIOS() {
        var date = new Date($scope.housesReleaseInfo.expireDate).format('yyyy/MM/dd hh:mm:ss');
        selectTimeBasic(date);
      }

      function selectTimeAndroid() {
        var date = new Date($scope.housesReleaseInfo.expireDate).format('MM/dd/yyyy/hh/mm/ss');
        selectTimeBasic(date);
      }

      function selectTimeBasic(date) {
        $cordovaDatePicker.show({
          date: date,
          allowOldDates: true,
          allowFutureDates: true,
          mode: 'date',
          titleText: '',
          okText: '确定',               //android
          cancelText: '取消',           //android
          doneButtonLabel: '确认',      // ios
          cancelButtonLabel: '取消',    //ios
          todayText: '今天',            //android
          //nowText: '现在',              //android
          //is24Hour: true,              //android
          androidTheme: datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT, // android： 3
          popoverArrowDirection: 'UP',
          locale: 'zh_cn'
          //locale: 'en_us'
        }).then(function (returnDate) {
          var time = returnDate.format("yyyy-MM-dd"); //__getFormatTime(returnDate);
          $scope.housesReleaseInfo.expireDate = time;
          if (!$scope.$$phrese) {
            $scope.$apply();
          }
        });
      };

      $scope.goBack = function () {//返回按钮
        $ionicHistory.goBack();
      };
      $scope.goHousesPhotoList = function () {
        $scope.pictureList = [];
        if ($scope.housesReleaseInfo.imgs != 0) {
          angular.forEach($scope.housesReleaseInfo.imgs, function(data, index, array){
            $scope.pictureList.push(array[index]);
          });
          for (var i = 0; i < $scope.pictureList.length; i++) {
            $scope.pictureList[i].flag = "edit"
          }
          console.log("标记后的图片数组：" + angular.toJson($scope.pictureList));
        }
        $state.go("tab.houses-photo-list", {'housesImageList': $scope.pictureList});
      };

      $scope.housesRelease = function () {//发布按钮
        uploadImage();
      };
      var pictureNumber = 0;
      var uploadImage = function () {//上传图片
        $scope.showLoading = true;
        //console.log("333333333333333" + angular.toJson($scope.imageList));
        if (!$scope.imageList) {
          //console.log("照片为空");
          releaseHousesInfo();
        } else {
          for (var i = 0; i < $scope.imageList.length; i++) {
            //console.log("44444444444444444" + $scope.imageList[i].objectUrl);
            if ($scope.imageList[i].objectUrl != "") {
              var nowDates = Date.parse(new Date()) / 1000;
              var fileName = window.localStorage.empno + nowDates + '.jpg';
              var urlname = "";
              var myParam = {
                filename: fileName,
                url: urlname//图片在服务器的路径
              };
              var options = new FileUploadOptions();
              options.filekey = "file";
              options.fileName = "image.jpg";
              options.mimeType = "image/jpeg";
              options.chunkedMode = false;
              var trustAllHosts = true;
              //myParam.filename="";
              options.params = myParam;
              var fileTransfer = new FileTransfer();
              fileTransfer.upload(
                $scope.imageList[i].objectUrl,
                encodeURI(baseConfig.queryPath + "/objectUpload?access_token=" + window.localStorage.token),//上传服务器的接口地址
                win,
                fail,
                options,
                trustAllHosts
              );
            }
          }
        }
      };

      var win = function (res) {//图片上传成功
        //如果有Loading的话记得隐藏loading
        $scope.showLoading = false;

        var result = JSON.parse(res.response);

        console.log("result " + angular.toJson(result));
        //hmsPopup.showPopup("图片上传成功");
        $scope.housesImage = {
          "objectUrl": result.returnData.objectUrl
        };
        $scope.housesReleaseInfo.imgs.push($scope.housesImage);
        pictureNumber++;
        //console.log("111111111111 " + angular.toJson($scope.imageList.length));
        //console.log("22222222222 " + angular.toJson(pictureNumber));
        if (pictureNumber == $scope.imageList.length) {
          releaseHousesInfo();
          //hmsPopup.showPopup("图片上传成功");
        }
      };
      var fail = function (error) {//图片上传失败
        //如果有Loading的话记得隐藏loading
        $scope.showLoading = false;
        hmsPopup.showPopup("图片上传失败");
      };

      function releaseHousesInfo() {//调用发布接口
        console.log("房屋发布信息：" + angular.toJson($scope.housesReleaseInfo));
        var url = baseConfig.queryPath + "/house/publish";
        //var url = 'http://10.211.103.145:9090/hrmsv2/v2/api/house/publish';
        hmsPopup.showLoading('请稍候');
        hmsHttp.post(url, $scope.housesReleaseInfo).success(function (result) {
          hmsPopup.hideLoading();
          if (baseConfig.debug) {
            console.log("result success " + angular.toJson(result));
          }
          if (result.status == "S") {
            if ($scope.flag == 'EDIT') {
              $rootScope.$broadcast("RELEASEEDIT_SUCCESS");
            } else {
              $rootScope.$broadcast("RELEASE_SUCCESS");//触发上一界面重新刷新数据
            }
            hmsPopup.showShortCenterToast("发布成功");
            $ionicHistory.goBack();//删除申请成功后返回上一界面
          } else if (result.status == "E") {
            hmsPopup.showShortCenterToast("发布失败");
          }

        }).error(function (error, status) {
          hmsPopup.hideLoading();
          hmsPopup.showShortCenterToast("网络连接出错");
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(error));
          }
        });
      }
    }]);
