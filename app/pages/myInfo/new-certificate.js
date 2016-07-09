/**
 * Created by LeonChan on 2016/7/8.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.new-certificate', {
          url: '/new-certificate',
          views: {
            'tab-myInfo': {
              templateUrl: 'build/pages/myInfo/new-certificate.html',
              controller: 'NewCertificateCtrl'
            }
          }
        })
    }]);
angular.module('myInfoModule')
  .controller('NewCertificateCtrl', [
    '$scope',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$ionicModal',
    '$cordovaCamera',
    '$timeout',
    function ($scope,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $ionicModal,
              $cordovaCamera,
              $timeout) {

      $ionicModal.fromTemplateUrl('build/pages/myInfo/modal/new-certificate-choose-type.html', {//定义证书类型modal
        scope: $scope
      }).then(function (modal1) {
        $scope.chooseTypePopup = modal1;
      });//初始化选择证书类型的modal
      $ionicModal.fromTemplateUrl('build/pages/myInfo/modal/choose-picture.html', {//定义图片选择方法modal
        scope: $scope
      }).then(function (modal2) {
        $scope.choosePictureMethodPopup = modal2;
      });//初始化选择图片上传方式类型的modal
      $scope.pictureAppearance = "";//显示大图
      $scope.imageList=[];//图片列表
      $scope.matrix=[[true,false,false],[false,false,false],[false,false,false],[false]];//四行三列，共10个
      var currentPictureNumber=0;//图片上传到第几张，0-9
      var currentRow=0;//matrix的下标一维
      var currentCol=0;//matrix的下标二维
      var maxNumber=0;//图片最大上传数量
      for(maxNumber;maxNumber<10;maxNumber++){
       var param={
         selected:false,
         uri:"",
         num:maxNumber+1,
         deleteMode:false
       };
       $scope.imageList.push(param);
      }
      $scope.defaultType="请选择";//默认证书类型
      $scope.certificateType=['会计证书','SAP系统证书','Oracle系统证书','技术类证书','其他'];//证书类型值列表
      $scope.pictureType=['拍照','相册'];//图片选择方式值列表
      $scope.extensionPicture="";//放大图片Url
      $scope.showCertificateTypeModal=function(){//显示证书类型选择的Modal
        $scope.chooseTypePopup.show();
      };

      $scope.showPictureModal=function(num){//显示图片选择的Modal
        currentPictureNumber=num;
        $scope.choosePictureMethodPopup.show();
      };

      $scope.chooseCertificateType=function(param){//选择证书类型
        $scope.defaultType=param;
        $scope.chooseTypePopup.hide();
      };

      $scope.choosePictureType=function(param){
        var selectedMethod=param;
        $scope.imageList[currentPictureNumber].url="build/img/navigate3@3x.png";
        if(selectedMethod == "拍照"){
          //var cameraoptions = {
          //    destinationType: Camera.DestinationType.FILE_URI,
          //    sourceType: Camera.PictureSourceType.CAMERA
          //};
          //$cordovaCamera.getPicture(cameraoptions).then(function(imageURI) {
          //  $scope.imageList[currentPictureNumber].uri=imageURI;//获取相机图片Uri
          //  $scope.imageList[currentPictureNumber].selected=true;
            if(($scope.imageList[currentPictureNumber].num%3)!=0){
             if(currentRow < 3){
               currentCol=currentCol+1;
               $scope.matrix[currentRow][currentCol]=true;
               $scope.imageList[currentPictureNumber].selected=true;
             }else if(currentRow == 3){
               $scope.imageList[currentPictureNumber].selected=true;
             }
            }else if(($scope.imageList[currentPictureNumber].num%3)==0){
             currentCol=0;
             currentRow=currentRow+1;
             $scope.matrix[currentRow][currentCol]=true;
             $scope.imageList[currentPictureNumber].selected=true;
            }
          //  $scope.$apply();
          //}, function(err) {
          //   // error
          //});
        }else if(selectedMethod == "相册"){
          //window.imagePicker.getPictures(function(results){
          //  $scope.imageList[currentPictureNumber].uri=results[0];//获取相册图片Uri
          //  $scope.imageList[currentPictureNumber].selected=true;
            if(($scope.imageList[currentPictureNumber].num%3)!=0){
              if(currentRow < 3){
                currentCol=currentCol+1;
                $scope.matrix[currentRow][currentCol]=true;
                $scope.imageList[currentPictureNumber].selected=true;
              }else if(currentRow == 3){
                $scope.imageList[currentPictureNumber].selected=true;
              }
            }else if(($scope.imageList[currentPictureNumber].num%3)==0){
              currentCol=0;
              currentRow=currentRow+1;
              $scope.matrix[currentRow][currentCol]=true;
              $scope.imageList[currentPictureNumber].selected=true;
            }
            //$scope.$apply();
          //},function(error){
          //
          //},{
          //maximumImagesCount: 1,
          //width: 90,
          //height: 160,
          //quality: 50
          //})
          }
        $scope.choosePictureMethodPopup.hide();
      };

      $scope.judgeRow=function(num){
        if(num==0){
         if($scope.matrix[0][0]==true){
          return true;
         }else{
           return false;
         }
        }else if(num==1){
          if($scope.matrix[1][0]==true){
            return true;
          }else{
            return false;
          }
        }else if(num==2){
          if($scope.matrix[2][0]==true){
            return true;
          }else{
            return false;
          }
        }else if(num==3){
          if($scope.matrix[3][0]==true){
            return true;
          }else{
            return false;
          }
        }
      };

      $scope.enterDeleteMode=function(num){//长点击进入删除模式，或者长点击退出删除模式
        $scope.imageList[num].deleteMode=!$scope.imageList[num].deleteMode;
      };

      $scope.leaveDeleteModel=function(num){//单击删除按钮其他位置，退出删除模式
        $scope.imageList[num].deleteMode=false;
      };

      $scope.deleteImage=function(num){
        $scope.imageList.splice(num,1);
        angular.forEach($scope.imageList,function(data,index,array){//先重置imageList列表
          array[index].num=index+1;
        });
        $scope.imageList.push({
          selected:false,
          uri:"",
          num:$scope.imageList.length+1,
          deleteMode:false
        });
        //再重置matrix
        for(var row=0;row<4;row++){
          for(var col=0;col<3;col++){
           if(row<3){
             if($scope.imageList[parseInt(row)*3+parseInt(col)].selected==true){
               $scope.matrix[row][col]=true;
               //console.log("row:"+row+" col:"+col+" 数字："+(parseInt(row)*3+parseInt(col)));
             }else if($scope.imageList[parseInt(row)*3+parseInt(col)].selected==false){
               $scope.matrix[row][col]=false;
               //console.log("row:"+row+" col:"+col+" 数字："+(parseInt(row)*3+parseInt(col)));
             }
           }else if(row==3){
             if($scope.imageList[9].selected==true){
              $scope.matrix[3][0]=true;
             }else if($scope.imageList[9].selected==false){
               $scope.matrix[3][0]=false;
             }
           }
          }
        }
        //拿到最后一个显示的图片，将其后一个变为增加按钮
        var k=0;
        var l=0;
        for(k;k<$scope.imageList.length;k++){
          if($scope.imageList[k].selected==true){
           l++;
          }
        }
        l=l+1;
        var j = l%3;
        var i = ( l - j ) / 3;
        if(j>0){
          j=j-1;
        }else if(j==0){
          j=2;
          i=i-1;
        }
        currentRow = i;
        currentCol = j;
        $scope.matrix[i][j]=true;
      };

      $scope.showBigPicture=function(num){//显示大图
       $scope.pictureAppearance=true;
       $scope.extensionPicture=$scope.imageList[num].url;
       $timeout(function(){
           var bigPicture=document.getElementById('my-big-picture');
           var picHeight=bigPicture.offsetHeight;
           var picWidth=bigPicture.offsetWidth;
           if(picHeight>picWidth){
             bigPicture.style.height=480+"px";
             bigPicture.style.width=270+"px";
             bigPicture.style.marginTop=30+"px";
           }else if(picHeight<picWidth){
             bigPicture.style.marginTop=30+"px";
             bigPicture.style.height=171+"px";
             bigPicture.style.width=304+"px";
             bigPicture.style.marginTop=120+"px";
           }
         },100);
      };

      $scope.hideBigPicture=function(){//隐藏大图
        $scope.pictureAppearance=false;
      };

      $scope.goBack=function(){//返回按钮
        $ionicHistory.goBack();
      };

    }]);
