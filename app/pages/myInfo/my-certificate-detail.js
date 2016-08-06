/**
 * Created by LeonChan on 2016/7/8.
 */
'use strict';
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.my-certificate-detail', {
          url: '/my-certificate-detail',
          views: {
            'tab-myInfo': {
              templateUrl: 'build/pages/myInfo/my-certificate-detail.html',
              controller: 'MyCertificateDetailCtrl'
            }
          },
          params:{
            'CertificateDetail':""
          }
        })
    }]);
angular.module('myInfoModule')
  .controller('MyCertificateDetailCtrl', [
    '$scope',
    'baseConfig',
    '$ionicHistory',
    'hmsHttp',
    'hmsPopup',
    '$ionicModal',
    '$stateParams',
    '$timeout',
    '$cordovaCamera',
    '$rootScope',
    '$ionicGesture',
    function ($scope,
              baseConfig,
              $ionicHistory,
              hmsHttp,
              hmsPopup,
              $ionicModal,
              $stateParams,
              $timeout,
              $cordovaCamera,
              $rootScope,
              $ionicGesture) {
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
      $scope.certificate={
        type:"",
        description:""
      };
      var certificateId = $stateParams.CertificateDetail.id;
      $scope.certificateType=['会计证书','SAP系统证书','Oracle系统证书','技术类证书','其他'];//证书类型值列表
      $scope.pictureType=['拍照','相册'];//图片选择方式值列表
      $scope.inputReadonly=true;
      $scope.buttonText="编辑";
      $scope.showLoading=true;
      $scope.imageList=[];
      var imageTotalLength=0;
      var pictureNumber=0;//控制在图片上传完成时判断是否调用文字传入接口
      var currentPictureNumber=0;//当前点击为相机图标的是第几项
      var images=[];//保存服务器上的有哪些图片，避免用户增加图片又删除时，把服务器不存在的图片放入删除接口
      var deletedImage=[];//要发送到服务器上删除的图片，经过校验后压入这个数组
      var objectUrl=[];//用来记录调用上传图片的接口时，返回给我的新图片名称
      var addImage=[];//要增加的图片，服务器上没有，本地却添加了的图片就是新增图片
      $scope.matrix=[[true,false,false],[false,false,false],[false,false,false],[false]];//四行三列，共10个
      var currentRow=0;//matrix的下标一维
      var currentCol=0;//matrix的下标二维
      $scope.pictureAppearance = "";//显示大图
      $scope.extensionPicture="";//放大图片Url
      for(var i=0;i<10;i++){
        var param={
          selected:false,
          uri:"",
          num:i+1,
          deleteMode:false
        };
        $scope.imageList.push(param);
      }
      $scope.$on("$ionicView.loaded",function(){
        var url = baseConfig.queryPath+"/staffCertificate/"+certificateId;
        var param={
          employee_number:""
        };
        hmsHttp.post(url,param).success(function(result){
          var certificateInfo=result.returnData;//拿到返回值
          images=certificateInfo.objects;
          if(result.status=="S"){
            $scope.certificate.type = certificateInfo.certificateType;
            $scope.certificate.description = certificateInfo.certificateName;
            for(var i=0;i<images.length;i++){//根据接口拿到的数据初始化imageList
              $scope.imageList[i].uri=images[i].objectUrl;
              $scope.imageList[i].selected=true;
            }
            currentCol=(images.length)%3;
            currentRow=((images.length)-currentCol)/3;
            for(var i=0;i<currentRow;i++){
              for(var j=0;j<3;j++){
                $scope.matrix[i][j]=true;
              }
            }
            for(var i=0;i<currentCol;i++){
              $scope.matrix[currentRow][i]=true;
            }
            $scope.showLoading=false;
          }else if(result.status!="S"){
            hmsPopup.showPopup("数据异常");
          }
        }).error(function(error,status){
          if (baseConfig.debug) {
            console.log("response error " + angular.toJson(error));
          }
          $scope.showLoading=false;
        });
      });
      $scope.enterEditMode=function(){
       if($scope.buttonText=="编辑"){
         $scope.buttonText="";
         $scope.inputReadonly=false;
         currentCol=(images.length+1)%3;
         currentRow=((images.length+1)-currentCol)/3;
         for(var i=0;i<currentRow;i++){
           for(var j=0;j<3;j++){
             $scope.matrix[i][j]=true;
           }
         }
         for(var i=0;i<currentCol;i++){
           $scope.matrix[currentRow][i]=true;
         }
         if(currentCol>0){
           currentCol=currentCol-1;
         }else if(currentCol==0){
           currentCol=2;
         }
       }
      };
      $scope.showCertificateTypeModal=function(){
        if($scope.buttonText!="编辑"){
          $scope.chooseTypePopup.show();
        }
      };

      $scope.chooseCertificateType=function(param){//选择证书类型
        $scope.certificate.type=param;
        $scope.chooseTypePopup.hide();
      };

      $scope.showPictureModal=function(num){//显示图片选择的Modal
        currentPictureNumber=num;
        $scope.choosePictureMethodPopup.show();
      };

      $scope.choosePictureType=function(param){//选择相册或拍照
        var selectedMethod=param;
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
            if(results[0]!==undefined && results[0]!="") {
              $scope.imageList[currentPictureNumber].uri = results[0];//获取相册图片Uri
              $scope.imageList[currentPictureNumber].selected = true;
              if (($scope.imageList[currentPictureNumber].num % 3) != 0) {
                if (currentRow < 3) {
                  currentCol = currentCol + 1;
                  $scope.matrix[currentRow][currentCol] = true;
                  $scope.imageList[currentPictureNumber].selected = true;
                } else if (currentRow == 3) {
                  $scope.imageList[currentPictureNumber].selected = true;
                }
              } else if (($scope.imageList[currentPictureNumber].num % 3) == 0) {
                currentCol = 0;
                currentRow = currentRow + 1;
                $scope.matrix[currentRow][currentCol] = true;
                $scope.imageList[currentPictureNumber].selected = true;
              }
              $scope.$apply();
            }
          },function(error){

          },{
            maximumImagesCount: 1,
            width: 480,
            height: 480,
            quality: 60
          })
        }
        $scope.choosePictureMethodPopup.hide();
      };

      $scope.showBigPicture=function(num){//显示大图
        if($scope.imageList[num].deleteMode == true){
          $scope.imageList[num].deleteMode=false;
        }else if($scope.imageList[num].deleteMode == false){
          $scope.pictureAppearance=true;
          $scope.extensionPicture=$scope.imageList[num].uri;
          $timeout(function(){
            var bigPicture=document.getElementById('check-my-big-picture');
            var scaleShelter = document.getElementById('scaleShelter');
            var shelter = angular.element(document.querySelector('#scaleShelter'));
            var screenWidth = window.screen.width;
            var screenHeight = window.screen.height;
            var picHeight = bigPicture.offsetHeight;
            var picWidth = bigPicture.offsetWidth;
            //console.debug(screenHeight+","+picHeight);
            if(picHeight<screenHeight){
              bigPicture.style.marginTop=(screenHeight-picHeight)/2+"px";
            }
            if(picWidth<screenWidth){
              bigPicture.style.marginLeft=(screenWidth-picWidth)/2+"px";
            }
            if( (parseInt(picHeight/screenHeight)>3) || parseInt((picWidth/screenWidth)>3)){
              bigPicture.style.height=picHeight*0.1+"px";
              bigPicture.style.width=picWidth*0.1+"px";
              if(bigPicture.offsetHeight<screenHeight){
                bigPicture.style.marginTop=(screenHeight-bigPicture.offsetHeight)/2+"px";
              }
              if(bigPicture.offsetWidth<screenWidth){
                bigPicture.style.marginLeft=(screenWidth-bigPicture.offsetWidth)/2+"px";
              }
            }
            $ionicGesture.on("pinchin",function(e){
                var scaleValue = e.gesture.scale;
                if(parseInt(bigPicture.offsetWidth/screenWidth)>0.3){
                  //bigPicture.style.webkitTransform="scale("+scaleValue+","+scaleValue+")";
                  bigPicture.style.height=bigPicture.offsetHeight*scaleValue+"px";
                  bigPicture.style.width=bigPicture.offsetWidth*scaleValue+"px";
                  //console.debug(bigPicture.offsetHeight+","+bigPicture.offsetWidth);
                  if(bigPicture.offsetHeight<screenHeight){
                    bigPicture.style.marginTop=(screenHeight-bigPicture.offsetHeight)/2+"px";
                    //console.debug(bigPicture.style.marginTop);
                  }else if(bigPicture.offsetHeight>=screenHeight){
                    bigPicture.style.marginTop=0+"px";
                  }
                  if(bigPicture.offsetWidth<screenWidth){
                    bigPicture.style.marginLeft=(screenWidth-bigPicture.offsetWidth)/2+"px";
                    //console.debug(bigPicture.style.marginLeft);
                  }else if(bigPicture.offsetWidth>=screenWidth){
                    bigPicture.style.marginLeft=0+"px";
                  }
                }
            },shelter);
            $ionicGesture.on("pinchout",function(e){
              var scaleValue = e.gesture.scale;
              if(parseInt(bigPicture.offsetWidth/screenWidth)<1.5){
                //bigPicture.style.webkitTransform="scale("+scaleValue+","+scaleValue+")";
                bigPicture.style.height=bigPicture.offsetHeight*scaleValue+"px";
                bigPicture.style.width=bigPicture.offsetWidth*scaleValue+"px";
                //console.debug(bigPicture.offsetHeight+","+bigPicture.offsetWidth);
                if(bigPicture.offsetHeight<screenHeight){
                  bigPicture.style.marginTop=(screenHeight-bigPicture.offsetHeight)/2+"px";
                  //console.debug(bigPicture.style.marginTop);
                }else if(bigPicture.offsetHeight>=screenHeight){
                  bigPicture.style.marginTop=0+"px";
                }
                if(bigPicture.offsetWidth<screenWidth){
                  bigPicture.style.marginLeft=(screenWidth-bigPicture.offsetWidth)/2+"px";
                  //console.debug(bigPicture.style.marginLeft);
                }else if(bigPicture.offsetWidth>=screenWidth){
                  bigPicture.style.marginLeft=0+"px";
                }
              }
            },shelter);
          },100);
        }
      };

      $scope.hideBigPicture=function(){//隐藏大图
        $scope.pictureAppearance=false;
      };

      function uploadImage(){
        //$scope.showLoading=true;
        hmsPopup.showLoadingWithoutBackdrop('上传信息中，请稍候');
        if(addImage.length==0){//不新增图片时，只考虑知否删除图片的情况
          var deleteIdArray=[];
          for(var i=0;i<deletedImage.length;i++){
            var deleteParam={
              id:deletedImage[i].id
            };
            deleteIdArray.push(deleteParam);
          }
          var url=baseConfig.queryPath+"/staffCertificateEdit";
          var param={
            certificateType:$scope.certificate.type,
            certificateName:$scope.certificate.description,
            dataId:certificateId,
            deleteObjects:deleteIdArray,
            addObjects:[]
          };
          console.log(angular.toJson("没有增加图片的参数是："+angular.toJson(param)));
          hmsHttp.post(url,param).success(function(result){
            //$scope.showLoading=false;
            hmsPopup.hideLoading();
            if(result.status == "S"){
              hmsPopup.showPopup("信息更改成功");//图片上传成功后发送广播并返回上一界面
              $rootScope.$broadcast("CERTIFICATE_REFRESH");
              $ionicHistory.goBack();
            }else if(result.status != "S"){
              hmsPopup.showPopup("信息更改失败");
            }
          }).error(function(error,status){
            console.log("失败："+angular.toJson(error));
            //$scope.showLoading=false;
            hmsPopup.hideLoading();
            hmsPopup.showPopup("信息更改失败");
          });
        }else if(addImage.length>0){//新增图片大于0时才会调用FileTransfer插件
          for(var i=0;i<addImage.length;i++){
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
              options.params=myParam;
              var fileTransfer = new FileTransfer();
              fileTransfer.upload(
                addImage[i],
                encodeURI(baseConfig.queryPath+"/objectUpload?access_token="+window.localStorage.token),//上传服务器的接口地址
                win,
                fail,
                options,
                trustAllHosts
              );
          }
        }
      }
      var win=function(response) {//图片上传成功
        var data=JSON.parse(response.response);
        var objectParam={
          "objectName":data.returnData.objectUrl
        };
        objectUrl.push(objectParam);
        pictureNumber++;
        if(pictureNumber == imageTotalLength){
          var deleteIdArray=[];
          for(var i=0;i<deletedImage.length;i++){
            var deleteParam={
              id:deletedImage[i].id
            };
            deleteIdArray.push(deleteParam);
          }
          var url=baseConfig.queryPath+"/staffCertificateEdit";
          var param={
            certificateType:$scope.certificate.type,
            certificateName:$scope.certificate.description,
            dataId:certificateId,
            deleteObjects:deleteIdArray,
            addObjects:objectUrl
          };
          console.log(angular.toJson("增加图片的参数是："+angular.toJson(param)));
          hmsHttp.post(url,param).success(function(result){
            //$scope.showLoading=false;
            hmsPopup.hideLoading();
            if(result.status == "S"){
              hmsPopup.showPopup("信息更改成功");//图片上传成功后发送广播并返回上一界面
              $rootScope.$broadcast("CERTIFICATE_REFRESH");
              $ionicHistory.goBack();
            }else if(result.status != "S"){
              hmsPopup.showPopup("信息更改失败");
            }
          }).error(function(error,status){
            console.log("失败："+angular.toJson(error));
            //$scope.showLoading=false;
            hmsPopup.hideLoading();
            hmsPopup.showPopup("信息更改失败");
          });
        }
      };
      var fail=function(error){//图片上传失败
        //如果有Loading的话记得隐藏loading
        //$scope.showLoading=false;
        hmsPopup.hideLoading();
        hmsPopup.showPopup("信息更改失败");
      };

      $scope.commitInfo=function(){//提交图片
        if($scope.imageList[0].selected != true){
          hmsPopup.showPopup("请选择证书的图片");
        }else if($scope.imageList[0].selected == true){
            if($scope.certificate.info==""){
              hmsPopup.showPopup("请填写证书名称");
            }else if($scope.certificate.info!=""){
              for(var i=0;i<$scope.imageList.length;i++) {
                if( ($scope.imageList[i].uri!="") && ($scope.imageList[i].uri.substring(0,4)!="http")){
                  console.log($scope.imageList[i].uri);
                  addImage.push($scope.imageList[i].uri);
                  imageTotalLength++;
                }
              }
              uploadImage();
            }
        }
      };

      $scope.goBack=function(){//返回按钮
        if($scope.showLoading==false){
          $ionicHistory.goBack();
        }
      };
      $scope.showCommitButton=function(){
        if($scope.buttonText=="编辑"){
         return false;
        }else if($scope.buttonText!="编辑"){
          return true;
        }
      };
      $scope.judgeRow=function(num){//判断行是否显示
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
      //  if($scope.buttonText!="编辑"){
      //    $scope.imageList[num].deleteMode=!$scope.imageList[num].deleteMode;
      //  }else if($scope.buttonText=="编辑"){
      //    hmsPopup.showPopup("点击右上角编辑按钮进入编辑模式");
      //  }
      //};
      $scope.deleteImage=function(num){//删除图片时，会校验删除的是否为服务器上获取的图片
        for(var i=0;i<images.length;i++){
          if($scope.imageList[num].uri == images[i].objectUrl){
            deletedImage.push(images[i]);
          }
        }
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

    }]);
