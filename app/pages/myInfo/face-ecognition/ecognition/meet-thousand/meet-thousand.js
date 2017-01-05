/**
 * Created by bobo on 2016/12/27.
 */
(function () {
  'use strict';
  angular
    .module('myInfoModule')
    .config(config);
  function config($stateProvider) {
    $stateProvider
      .state('tab.face-ecognition-meetThousand', {
        url: '/myInfo/face-ecognition-meetThousand',
        views: {
          'tab-myInfo': {
            prefetchTemplate: false,
            templateUrl: 'build/pages/myInfo/face-ecognition/ecognition/meet-thousand/meet-thousand.html',
            controller: 'faceEcognitionMeetThousandCtrl',
            controllerAs: 'vm'
          }
        }
      })
  }

  angular
    .module('myInfoModule')
    .controller('faceEcognitionMeetThousandCtrl', faceEcognitionMeetThousandCtrl);

  function faceEcognitionMeetThousandCtrl($scope,
                                          $state,
                                          $ionicHistory,
                                          baseConfig,
                                          $stateParams,
                                          hmsPopup,
                                          hmsReturnView,
                                          hmsHttp,
                                          $ionicScrollDelegate,
                                          faceEcognitionService,
                                          $timeout,
                                          meetThousandServe) {
    var vm = this;

    console.log(typeof window.localStorage.getItem('first'))
    vm.isStart = false;//年会是否开始---默认false
    vm.headPortrait = '';//头像
    vm.isTopScorll = false;//排行榜是否上滑 默认false
    vm.isRank = true; //点击 排行榜true 我的互粉false
    vm.fansStatus = 0;//区分粉 状态 0：互粉  1：粉我的
    vm.isSpinner = true;
    //界面元素属性设置
    vm.colorFansTabArr = ['active-color', 'un-active-color', 'un-active-color', 0];
    vm.colorTabsArr = ['active-color', 'un-active-color', 0];
    vm.colorAddressArr = [
      'active-color',
      'un-active-color',
      'un-active-color',
      'un-active-color',
      'un-active-color',
      'un-active-color',
      'un-active-color', 0];
    vm.cssTop = null;
    vm.titleTop = null;
    if (ionic.Platform.isIOS()) {
      /* vm.cssTop={
       button:{
       'top':'31px'
       },
       title:{
       'top':'33px'
       },
       subTitle:{
       'top':'47px'
       },
       top:{
       'top':'259px'
       },
       fansTop:{
       'top':'206px'
       }
       };*/
      vm.cssTop = {
        button: {
          'top': '31px'
        },
        title: {
          'top': '33px'
        },
        rankUpTitle: {
          'top': '25px'
        },
        subTitle: {
          'top': '47px'
        },
        top: {
          'top': '259px'
        },
        fansTop: {
          'top': '206px'
        },
        defaultHeight: {
          'height': '167px'
        },
        fansHeight: {
          'height': '136px'
        },
        rankUpHeight: {
          'height': '75px'
        }
      };
    } else {
      vm.cssTop = {
        button: {
          'top': '11px'
        },
        title: {
          'top': '13px'
        },
        rankUpTitle: {
          'top': '5px'
        },
        subTitle: {
          'top': '27px'
        },
        top: {
          'top': '239px'
        },
        fansTop: {
          'top': '186px'
        },
        defaultHeight: {
          'height': '147px'
        },
        fansHeight: {
          'height': '116px'
        },
        rankUpHeight: {
          'height': '55px'
        }
      };
    }

    vm.rankImg = [
      'build/img/myInfo/meetThousand/1@3x.png',
      'build/img/myInfo/meetThousand/2@3x.png',
      'build/img/myInfo/meetThousand/3@3x.png'
    ];

    //
    var isHeaderBar = true;

    vm.titleClass = 'default-title';
    vm.addressClass = 'default-address';


    var intersectionArr = [];//互粉
    var followerArr = [];//粉我的
    var followingArr = [];//我的关注
    var relationType = '';
    /*---界面展示信息--*/

    vm.summaryInfo = null;

    vm.headPortrait = window.localStorage.myInfoImg;//头像

    vm.fansList = [];
    vm.topInfo = null;
    vm.topOtherInfo = [];//非前三
    vm.noData = 'true';
    /*  vm.fansInfo={
     intersection:0,
     follower:0,
     following:0
     };*/

    /*--请求初始参数信息--*/
    //follower我的粉丝    following我的关注    intersection我的互粉
    var queryRelationParams = {
      page: 1,
      pageSize: 10,
      type: ''
    };

    var topInfoParams = {
      pageSize: 20,
      area: 'all'
    };

    /*--请求--*/
    vm.getSummaryInfo = getSummaryInfo;//获取概要信息
    vm.getTopInfo = getTopInfo;//获取总排行榜
    vm.queryRelation = queryRelation;//根据关注关系获取信息
    vm.doRefresh = doRefresh;
    vm.loadMore = loadMore;
    vm.createNewFocus = createNewFocus;

    vm.goBack = goBack;
    vm.rankUp = rankUp;
    vm.rankDown = rankDown;
    vm.rankingMutualFans = rankingMutualFans;
    vm.fansTab = fansTab;
    vm.addressTab = addressTab;
    vm.faceScanner = faceScanner;
    vm.openHelpURl = openHelpURl;
    getSummaryInfo();//拉取概要信息
    rankingMutualFans(0);//


    /*$timeout(function () {
     addressTab(0);

     },1000);*/
    //获取概要信息
    function getSummaryInfo() {
      var param = '';
      var url = baseConfig.queryPath + '/annualMeeting/summary';
      console.log(url);
      hmsHttp.post(url, param).success(function (result) {
        console.log(result);
        vm.summaryInfo = result.rows[0];
        console.log(vm.summaryInfo.empGender == 2)
      }).error(function (err, status) {
        console.log(err);
        console.log(status)
      })
    }


    vm.rankImg = [
      'build/img/myInfo/meetThousand/1@3x.png',
      'build/img/myInfo/meetThousand/2@3x.png',
      'build/img/myInfo/meetThousand/3@3x.png'
    ];

    //
    var isHeaderBar = true;

    vm.titleClass = 'default-title';
    vm.addressClass = 'default-address';


    var intersectionArr = [];//互粉
    var followerArr = [];//粉我的
    var followingArr = [];//我的关注
    var relationType = '';
    /*---界面展示信息--*/

    vm.summaryInfo = null;

    vm.headPortrait = window.localStorage.myInfoImg;//头像

    vm.fansList = [];
    vm.topInfo = null;
    vm.topOtherInfo = [];//非前三
    vm.noData = 'true';
    /*  vm.fansInfo={
     intersection:0,
     follower:0,
     following:0
     };*/

    /*--请求初始参数信息--*/
    //follower我的粉丝    following我的关注    intersection我的互粉
    var queryRelationParams = {
      page: 1,
      pageSize: 10,
      type: ''
    };

    var topInfoParams = {
      pageSize: 20,
      area: 'all'
    };

    /*--请求--*/
    vm.getSummaryInfo = getSummaryInfo;//获取概要信息
    vm.getTopInfo = getTopInfo;//获取总排行榜
    vm.queryRelation = queryRelation;//根据关注关系获取信息
    vm.doRefresh = doRefresh;
    vm.loadMore = loadMore;
    vm.createNewFocus = createNewFocus;

    vm.goBack = goBack;
    vm.rankUp = rankUp;
    vm.rankDown = rankDown;
    vm.rankingMutualFans = rankingMutualFans;
    vm.fansTab = fansTab;
    vm.addressTab = addressTab;
    vm.faceScanner = faceScanner;

    getSummaryInfo();//拉取概要信息
    rankingMutualFans(0);//


    $scope.$on('$ionicView.enter', function (e) {
      getSummaryInfo();
      queryRelation(relationType)
    });

    /*$timeout(function () {
     addressTab(0);

     },1000);*/
    //获取概要信息
    function getSummaryInfo() {
      var param = '';
      var url = baseConfig.queryPath + '/annualMeeting/summary';
      console.log(url);
      hmsHttp.post(url, param).success(function (result) {
        console.log(result);
        vm.summaryInfo = result.rows[0];
        console.log(vm.summaryInfo.empGender == 2)
      }).error(function (err, status) {
        console.log(err);
        console.log(status)
      })
    }

    //获取总排行榜
    function getTopInfo(area) {
      topInfoParams.area = area;
      var url = baseConfig.queryPath + '/annualMeeting/top';
      hmsHttp.post(url, topInfoParams).success(function (result) {
        // console.log('总排行前20:'+angular.toJson(result));
        vm.topInfo = result.rows[0];
        vm.isStart = result.rows[0].flag == 'Y' ? true : false;
        vm.topOtherInfo = result.rows[0].topList.slice(3);
        vm.isSpinner = false;
        console.log(vm.topInfo)
      }).error(function (err, status) {
        console.log(err);
        console.log(status)
      })
    }

    //根据不同的关注关系获取详细列表
    function queryRelation(type) {
      console.log(type);
      queryRelationParams.type = type;
      console.log(queryRelationParams);
      var url = baseConfig.queryPath + '/annualMeeting/queryRelation';
      hmsHttp.post(url, queryRelationParams).success(function (result) {
        if (result.rows[0] && result.rows[0].list.length == 10) {
          vm.noData = true;
        } else {
          vm.noData = false;
        }

        /* vm.fansInfo[type]=result.rows[0].num;*/
        console.log(result.rows[0].num);
        vm.fansList = result.rows[0].list;
        vm.isSpinner = false;
        $ionicScrollDelegate.resize();
      }).error(function (err, status) {
        console.log(err);
        console.log(status)
      })
    }

    //新增关注
    function createNewFocus(empNo) {
      if (vm.fansStatus == 0) {
        return;
      }

      faceScanner();

      return;

      var params = {
        idolNo: empNo
      };
      var url = baseConfig.queryPath + '/annualMeeting/create';
      hmsHttp.post(url, params).success(function (result) {
        console.log(result)
        queryRelation(relationType);
        $ionicScrollDelegate.resize();
      }).error(function (err, status) {
        console.log(err);
        console.log(status)
      })
    }

    //下拉刷新
    function doRefresh() {
      console.log('下拉刷新');
      vm.isSpinner = false;
      if (vm.isRank) {
        getTopInfo(topInfoParams.area)
      } else {
        getSummaryInfo();
        queryRelationParams.page = 1;
        queryRelation(relationType);
        console.log('重新获取不同关注关系列表！')
      }
      $scope.$broadcast('scroll.refreshComplete');
    }

    //上拉加载
    function loadMore() {
      vm.isSpinner = false;
      console.log('触发上拉');
      if (!vm.isRank) {
        queryRelationParams.type = relationType;
        queryRelationParams.page = queryRelationParams.page + 1;

        var url = baseConfig.queryPath + '/annualMeeting/queryRelation';
        hmsHttp.post(url, queryRelationParams).success(function (result) {
          if (result.rows[0] && result.rows[0].list.length == 10) {
            vm.noData = true;
          } else {
            vm.noData = false;
          }
          vm.fansList = vm.fansList.concat(result.rows[0].list);
          $scope.$broadcast('scroll.infiniteScrollComplete');

        }).error(function (err, status) {
          console.log(err);
          console.log(status)
        })
      }

    }

    //返回上级菜单
    function goBack() {
      hmsReturnView.returnToState('tab.face-ecognition-setting');
    }

    //点击我的互粉 排行榜
    function rankingMutualFans(num) {
      isHeaderBar = true;
      vm.isSpinner = true;
      var index = vm.colorTabsArr[2];
      if (num != vm.colorTabsArr[2]) {
        vm.colorTabsArr[num] = 'active-color';
        vm.colorTabsArr[index] = 'un-active-color';
        vm.colorTabsArr[2] = num;
      }
      if (num == 0) {
        vm.styleHeight = vm.cssTop.defaultHeight;
        vm.headHeight = 'default-height';
        vm.top = vm.cssTop.top;
        vm.addressClass = 'default-address';
        vm.titleTop = vm.cssTop.title;
        vm.topInfo = [];
        vm.topOtherInfo = [];
        vm.isRank = true;
        vm.isTopScorll = false;
        getTopInfo(topInfoParams.area);
        $ionicScrollDelegate.resize();
      } else {
        fansTab(0);//默认互粉
        vm.titleTop = vm.cssTop.title;
        vm.styleHeight = vm.cssTop.fansHeight;
        vm.headHeight = 'fans-height';
        vm.titleClass = 'default-title';
        vm.top = vm.cssTop.fansTop;
        vm.isRank = false;
        vm.isTopScorll = false;
        $ionicScrollDelegate.resize();
      }
    }

    function fansTab(num) {
      vm.fansList = [];
      vm.isSpinner = true;
      var index = vm.colorFansTabArr[3];
      if (num != vm.colorFansTabArr[3]) {
        vm.colorFansTabArr[num] = 'active-color';
        vm.colorFansTabArr[index] = 'un-active-color';
        vm.colorFansTabArr[3] = num;
      }
      vm.fansStatus = num;
      queryRelationParams.page = 1;
      if (num == 0) {
        queryRelation('intersection');
        relationType = 'intersection';
      } else if (num == 1) {
        queryRelation('follower');
        relationType = 'follower'
      } else {
        queryRelation('following');
        relationType = 'following'
      }
      $ionicScrollDelegate.resize();
    }

    function addressTab(num) {
      vm.topInfo = [];
      vm.topOtherInfo = [];
      vm.isSpinner = true;
      console.log(num);
      var address = ['ALL', 'SH', 'BJ', 'GZ', 'CD', 'WH', 'XA'];
      var index = vm.colorAddressArr[7];
      if (num != vm.colorAddressArr[7]) {
        vm.colorAddressArr[num] = 'active-color';
        vm.colorAddressArr[index] = 'un-active-color';
        vm.colorAddressArr[7] = num;
      }
      getTopInfo(address[num]);

    }

    function rankUp() {

      if (isHeaderBar == false) {
        isHeaderBar = true;
        if (vm.isRank && vm.isStart) {
          console.log('rankUp...');
          vm.isTopScorll = true;
          vm.top = 'up-scroll-top';
          vm.styleHeight = vm.cssTop.rankUpHeight;
          vm.headHeight = 'rank-up-height';
          vm.top = {
            'top': '0px'
          };
          vm.titleTop = vm.cssTop.rankUpTitle;
          vm.titleClass = 'active-title';
          vm.addressClass = 'active-address';
        }
        $ionicScrollDelegate.resize();

      }
    }

    function rankDown() {

      if (isHeaderBar == true) {
        isHeaderBar = false;
        if (vm.isRank) {
          console.log('rankDown...');
          vm.titleTop = vm.cssTop.title;
          vm.isTopScorll = false;
          vm.top = 'default-top';
          vm.styleHeight = vm.cssTop.defaultHeight;
          vm.headHeight = 'default-height';
          vm.top = vm.cssTop.top;
          vm.titleClass = 'default-title';
          vm.addressClass = 'default-address';
        }
        $ionicScrollDelegate.resize();

      }
    }


    function faceScanner(value) {
      if (value || relationType == 'follower') {
      } else {
        return
      }

      var error = function (result) {
        if (baseConfig.debug) {
          alert('ecognition.error ' + angular.toJson(result));
        }
        hmsPopup.showPopup('验证失败，请重新验证或补充照片！');
      };

      var success = function (result) {
        //alert('ecognition.success ' + angular.toJson(result));
        //uploadServe(result.imageUrl);
        // hmsPopup.showLoading('匹配中');
        $timeout(function () {
          identifyByImageUrl(result.aliyunPath);
        }, 0);
      };
      if (meetThousandServe.getLocalStorage('first') == null) {

        meetThousandServe.alertPopup('快开始扫周围的同事吧~',function () {
          if (faceEcognitionService.getNoPluginMode()) {
            //临时解决方案
            catchImage();
          } else {
            pluginface.faceDetect({"direction": "back"}, success, error);
          }
          meetThousandServe.setLocalStorage('first', 1)
        });
      } else {
        if (faceEcognitionService.getNoPluginMode()) {
          //临时解决方案
          catchImage();
        } else {
          pluginface.faceDetect({"direction": "back"}, success, error);
        }
      }

    }

    //
    function catchImage() {
      navigator.camera.getPicture(onSuccess, onFail, {
        quality: 90,
        targetWidth: 450,
        targetHeight: 450,
        destinationType: Camera.DestinationType.FILE_URI,
        cameraDirection: Camera.Direction.BACK
      });

      function onFail(result) {
        if (baseConfig.debug) {
          alert('ecognition.error ' + angular.toJson(result));
        }
        //hmsPopup.showPopup('验证失败，请重新验证或补充照片！');
      }

      function onSuccess(imageURI) {
        uploadServe(imageURI);
      }
    }

    function identifyByImageUrl(aliyunPath) {
      if (aliyunPath && aliyunPath != '') {
        hmsPopup.showLoading('匹配中');
        faceEcognitionService.faceIdentifyByImageUrl('/faceidentifyByUrl', aliyunPath, function (result) {

          //alert('faceEcognitionService.faceIdentifyByImageUrl res '+ angular.toJson(result));

          hmsPopup.hideLoading();
          if (baseConfig.debug) {
            alert('uploadImage.success ' + angular.toJson(result));
          }
          //var result = JSON.parse(res.response);
          if (result.success == true && result.rows[0] && result.rows[0].confidence) {
            $state.go('tab.face-ecognition-face-affirm', result.rows[0]);
          } else {
            hmsPopup.showPopup('匹配失败，请重新扫描匹配！');
          }
        });
      } else {
        hmsPopup.showPopup('匹配失败，请重新匹配！');
      }
    }

    //上传到服务器进行验证
    function uploadServe(imgUrl) {
      var success = function (res) {
        /*hmsPopup.showPopup(angular.toJson(JSON.parse(res.response)));*/
        hmsPopup.hideLoading();
        if (baseConfig.debug) {
          alert('uploadImage.success ' + angular.toJson(JSON.parse(res.response)));
        }
        var result = JSON.parse(res.response);

        // && result.rows[0].confidence > 80
        if (result.rows[0] && result.rows[0].confidence) {
          $state.go('tab.face-ecognition-face-affirm', result.rows[0]);
        } else {
          hmsPopup.showPopup('匹配失败，请重新扫描匹配！');
        }
        //hmsPopup.showPopup('uploadImage.success ' + angular.toJson(JSON.parse(res.response)));
      };

      var error = function (response) {
        hmsPopup.hideLoading();
        if (baseConfig.debug) {
          alert('uploadImage.error ' + angular.toJson(response));
        }
        hmsPopup.showPopup('匹配出现异常，请重新匹配！');
      };

      var onProgress = function (progressEvent) {
        faceEcognitionService.scanProcessProgress(progressEvent, $scope, '匹配中');
      };


      faceEcognitionService.uploadImage('/faceidentify', imgUrl, onProgress, success, error);
    }

    function openHelpURl() {
      var url = window.localStorage.getItem('activityHelpUrl');
      cordova.InAppBrowser.open(url, '_system', 'location=no,toolbar=yes,enableViewportScale=yes,toolbarposition=top,closebuttoncaption=关闭');
    }


  }
})();

