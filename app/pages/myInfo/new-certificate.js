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
    '$rootScope',
    function ($scope,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $ionicModal,
              $cordovaCamera,
              $timeout,
              $rootScope) {
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
      var objectUrl=[];//收集每次调用图片上传接口时返回的ObjectUrl，最终在传文字接口时以数组形式发送过去
      var imageTotalLength=0;//选择了的图片总长度
      $scope.matrix=[[true,false,false],[false,false,false],[false,false,false],[false]];//四行三列，共10个
      var currentPictureNumber=0;//图片上传到第几张，0-9
      var currentRow=0;//matrix的下标一维
      var currentCol=0;//matrix的下标二维
      var maxNumber=0;//图片最大上传数量
      var pictureNumber=0;//控制在图片上传完成时判断是否调用文字传入接口
      for(maxNumber;maxNumber<10;maxNumber++){
       var param={
         selected:false,
         uri:"",
         num:maxNumber+1,
         deleteMode:false
       };
       $scope.imageList.push(param);
      }
      $scope.certificate={//证书信息
        info:""
      };
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
        //$scope.imageList[currentPictureNumber].uri="build/img/navigate3@3x.png";
        if(selectedMethod == "拍照"){
          var cameraoptions = {
              quality: 50,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: Camera.PictureSourceType.CAMERA
          };
          $cordovaCamera.getPicture(cameraoptions).then(function(imageURI) {
            $scope.imageList[currentPictureNumber].uri=imageURI;//获取相机图片Uri
            $scope.imageList[currentPictureNumber].selected=true;
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
            $scope.$apply();
          }, function(err) {
             // error
          });
        }else if(selectedMethod == "相册"){
          window.imagePicker.getPictures(function(results){
            if(results[0]!==undefined && results[0]!=""){
              $scope.imageList[currentPictureNumber].uri=results[0];//获取相册图片Uri
              $scope.imageList[currentPictureNumber].selected=true;
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
              $scope.$apply();
            }
          },function(error){

          },{
          maximumImagesCount: 1,
          width: 480,
          height: 480,
          quality: 60
          });
          }
        $scope.choosePictureMethodPopup.hide();
      };
      var uploadImage=function(){//上传图片
        hmsPopup.showLoadingWithoutBackdrop('上传信息中，请稍候');
        for(var i=0;i<$scope.imageList.length;i++){
          if($scope.imageList[i].uri!=""){
            var nowDates = Date.parse(new Date()) / 1000;
            var fileName = window.localStorage.empno + nowDates +'.jpg';
            var urlname="";
            var myParam={
              filename:fileName,
              url:urlname//图片在服务器的路径
            };
            var options = new FileUploadOptions();
            options.filekey = "file";
            options.fileName = "image.jpg";
            options.mimeType = "image/jpeg";
            options.chunkedMode=false;
            var trustAllHosts=true;
            //myParam.filename="";
            options.params=myParam;
            var fileTransfer = new FileTransfer();
            fileTransfer.upload(
              $scope.imageList[i].uri,
              //encodeURI(baseConfig.queryPath+"/objectUpload?access_token="+window.localStorage.token),//上传服务器的接口地址
              encodeURI(baseConfig.queryPath+"/objectUpload?access_token="+window.localStorage.token),
              win,
              fail,
              options,
              trustAllHosts
            );
          }
        }
      };
      var win=function(response){//图片上传成功
        //如果有Loading的话记得隐藏loading
        var data=JSON.parse(response.response);
        var objectParam={
          "objectName":data.returnData.objectUrl
        };
        objectUrl.push(objectParam);
        pictureNumber++;
        if(pictureNumber == imageTotalLength){
          var url=baseConfig.queryPath+"/staffCertificateCreate";
          var param={
            "certificateType":$scope.defaultType,
            "certificateName":$scope.certificate.info,
            "objects":objectUrl
          };
          hmsHttp.post(url,param).success(function(result){
            hmsPopup.hideLoading();
              if(result.status == "S"){
              hmsPopup.showPopup("证书生成成功");//图片上传成功后发送广播并返回上一界面
              $rootScope.$broadcast("CERTIFICATE_REFRESH");
              $ionicHistory.goBack();
            }else if(result.status != "S"){
              hmsPopup.showPopup("证书生成失败");
            }
          }).error(function(error,status){
            console.log("失败："+angular.toJson(error));
            hmsPopup.hideLoading();
            hmsPopup.showPopup("证书生成失败");
          });
        }
      };
      var fail=function(error){//图片上传失败
        //如果有Loading的话记得隐藏loading
        hmsPopup.hideLoading();
        hmsPopup.showPopup("证书生成失败");
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

      //$scope.enterDeleteMode=function(num){//长点击进入删除模式，或者长点击退出删除模式
      //  $scope.imageList[num].deleteMode=!$scope.imageList[num].deleteMode;
      //};

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
       //if($scope.imageList[num].deleteMode == true){
       //  $scope.imageList[num].deleteMode=false;
       //}else if($scope.imageList[num].deleteMode == false){
         $scope.pictureAppearance=true;
         $scope.extensionPicture=$scope.imageList[num].uri;
         $timeout(function(){
           var bigPicture=document.getElementById('my-big-picture');
           var picHeight=bigPicture.offsetHeight;
           var picWidth=bigPicture.offsetWidth;
           var screenWidth = window.screen.width;
           var screenHeight = window.screen.height;
           if(picHeight>picWidth){
             bigPicture.style.width=screenWidth+"px";
             bigPicture.style.height=screenHeight+"px";
           }else if(picHeight<picWidth){
             bigPicture.style.width=100+"%";
             if(screenWidth>310 && screenWidth<=350){
               bigPicture.style.height=170+"px";
               bigPicture.style.marginTop=150+"px";
             }else if(screenWidth >350 && screenWidth<=380){
               bigPicture.style.height=225+"px";
               bigPicture.style.marginTop=180+"px";
             }else if(screenWidth >380 && screenWidth<=420){
               bigPicture.style.height=240+"px";
               bigPicture.style.marginTop=210+"px";
             }else if(screenWidth>420){
               bigPicture.style.height=255+"px";
               bigPicture.style.marginTop=240+"px";
             }
           }
         },100);
       //}
      };

      $scope.commitInfo=function(){//提交图片
        if($scope.imageList[0].selected != true){
          hmsPopup.showPopup("请选择证书的图片");
        }else if($scope.imageList[0].selected == true){
          if($scope.defaultType=="请选择"){
            hmsPopup.showPopup("请选择证书类型");
          }else if($scope.defaultType!="请选择"){
            if($scope.certificate.info==""){
              hmsPopup.showPopup("请填写证书名称");
            }else if($scope.certificate.info!=""){
              for(var i=0;i<$scope.imageList.length;i++){
                if($scope.imageList[i].uri!=""){
                  imageTotalLength++;
                }
              }
              uploadImage();
            }
          }
        }
      };

      $scope.hideBigPicture=function(){//隐藏大图
        $scope.pictureAppearance=false;
      };

      $scope.goBack=function(){//返回按钮
          $ionicHistory.goBack();
      };
    }]);
