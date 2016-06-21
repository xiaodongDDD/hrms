
/**
 * Created by huchaoliang on 15-5-15.
 */
angular.module("applicationModule").controller('attachmentController', function($scope,$q,$http,expenseApply) {

    var page = globalNavigator.getCurrentPage();
    var expLineId= page.options.expLineId;
    $scope.addAttachments = expenseApply.photoData.photos;

    $scope.serverURL =  rootConfig.serverPath;

    $scope.currentProgress = '执行补传，时间与照片大小有关';


    //$scope.attachmentList=expenseApply.data.attachmentList;

    /*
    function addAttachmentList(){
        var deferred = $q.defer();
        $http.get(rootConfig.basePath+"EXP/EXP5010/exp_upload_line_photos.svc?expLineId="+expLineId,{cache:false}).
            success(function(response, status, headers, config) {
                deferred.resolve(response);
            }).
            error(function(error, status, headers, config) {
                deferred.reject(error);
            });
        return deferred.promise;
    }
    var promise=addAttachmentList();
    promise.then(function(response){
        var code=getResponseCode(response);
        if(code=="ok"){
            console.log("获取附件列表");
             console.log(response);
            $scope.attachmentList=response.body;
        }else if(code=="failure"){
            showMessage("查询失败:"+angular.toJson(response))
        }else{
            showMessage("未知错误:"+angular.toJson(response));
        }

    },function(error){
        showMessage("网络连接错误...."+angular.toJson(error));
    });

    */

    function attachmentList(){
        var deferred = $q.defer();
        //$http.get(rootConfig.basePath+"EXP/EXP5010/mobile_exp_report_list.svc",{cache:false}).
       $http.get(rootConfig.basePath+"PUBLIC/expense_lines_attachment.svc?tableName=EXP_REIMBURSEMENT_LN&tablePkValue="+expLineId,{cache:false}).
            success(function(response, status, headers, config) {
              deferred.resolve(response);

            }).
            error(function(error, status, headers, config) {
                deferred.reject(error);
            });
        return deferred.promise;
    }
    var promise=attachmentList();
    promise.then(function(response){
        var code=getResponseCode(response);
        if(code=="ok"){
            // console.log(response);
            $scope.attachmentData=response.body;
          //  console.log(response.body);
            console.log(response.body);
            console.log(angular.toJson($scope.attachmentData));

        }else if(code=="failure"){
            showMessage("查询失败:"+angular.toJson(response));
        }
        else if (code =="login_required"){
            showMessage("登录状态异常\n"+angular.toJson(response));
            reLogin();
        }
        else{
            showMessage("未知错误:"+angular.toJson(response));
        }

    },function(error){
        showMessage("网络连接错误...."+angular.toJson(error));
    });

    /*打开dialog*/
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
    /*选择相机*/
    $scope.selectPhotoSource=function(sourceType){
        if (sourceType == "Cemera") {
            getPhotoFromCamera();
        }else if (sourceType == "PhotoLibary") {
            getPhotoFromLibary();
        }
        $scope.attachmentSourceDialog.hide();
    };

    /*拍摄照片 相机*/
    getPhotoFromCamera=function(){

        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URL ,
            sourceType : Camera.PictureSourceType.CAMERA
            // saveToPhotoAlbum : true
            //sourceType : Camera.PictureSourceType.PHOTOLIBRARY
        });
    };

    /*拍摄照片 相册*/
    getPhotoFromLibary=function(){

        navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
            destinationType: Camera.DestinationType.FILE_URL ,
            //sourceType : Camera.PictureSourceType.CAMERA
            sourceType : Camera.PictureSourceType.PHOTOLIBRARY
        });
    };

    /*打开确认照片页面*/
    $scope.showConfirmAttachment=function(index){
        expenseApply.tempAttachment=expenseApply.data.tempAttachment[index];
        globalNavigator.pushPage(moduleHtmlPath.ACC+'checkPhoto.html', { animation : 'slide' });
    };

    function onSuccess(imageURI) {

        //var image = document.getElementById('myImage');
        //image.src = imageURI;
        // alert("asd");
        showMessage("补拍照片 ："+imageURI);

        getPic(imageURI);
        //$scope.$apply();
    }
    function onFail(message) {
        alert('Failed because: ' + message);
    }

    function getPic(file){
        window.resolveLocalFileSystemURI(file, resolveGetOnSuccess, resOnError);
    }

    function resolveGetOnSuccess(entry){
        var date= getFormatDate(new Date());
        var photo={
            photo_name:entry.name,
            photo_src:entry.toNativeURL(),
            creation_date:date,
            created_by:rootConfig.user.userId
        };

       // showMessage("src:"+photo.photo_src);
        //showMessage('name:'+photo.photo_name);
       // showMessage( angular.toJson(expenseApply.photoData.photos));


        expenseApply.photoData.photos.push(photo);

        showMessage( angular.toJson(expenseApply.photoData.photos));

        //showMessage( angular.toJson($scope.attachmentData.attachments));
        //keepAccount.data.photos.push(photo);
        /*清除缓存*/
        //cleanupCache();

        uploadData();

        $scope.$apply();
        showMessage("补拍完成");


    }

    function showUploadProgress(msg) {
        //console.log($scope.currentProgress);
        //showMessage($scope.currentProgress);
        $scope.currentProgress = msg;
        //console.log($scope.currentProgress);
        //showMessage(msg);
        //showMessage($scope.currentProgress);


    }

    /*上传数据*/
    uploadData=function(){
        /**/

        showMessage("进入上传");
        var form=new FormData();
        form.append("expense_line_id",expLineId);

        //showMessage("准备上传:"+angular.toJson(form));
        var length = expenseApply.photoData.photos.length;
        var Photos=[];
        Photos.push(expenseApply.photoData.photos[length-1]);

        //showUploadProgress("执行补传，时间与照片大小有关");
        uploadProgressModal.show();
        var promise= expenseApply.uploadData(form,Photos);
        promise.then(
            function(response) {
                var code=getResponseCode(response);
                if(code=="ok"){
                    //接受返回参数
                   showMessage("上传结束");


                }else if(code=="failure"){
                    showMessage("查询失败:"+angular.toJson(response))
                }
                else if (code =="login_required"){
                    showMessage("登录状态异常\n"+angular.toJson(response));
                    reLogin();
                }else{
                    showMessage("未知错误:"+angular.toJson(response));
                }

                uploadProgressModal.hide();

            },
            function(err) {  // 处理错误 .reject
                showMessage("网络连接错误...."+angular.toJson(err));
                uploadProgressModal.hide();     //网络错误退出

            });
    };


    function resOnError(error) {
        alert(error.code);
    }
});