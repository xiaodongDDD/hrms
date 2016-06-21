/**
 * Created by wuxiaocheng on 15/8/26.
 */

appModuleExpense
    .controller('checkPhotoController', function($scope,keepAccount, dialog,$ionicHistory) {

    $scope.tempPhoto=keepAccount.tempPhoto;
    $scope.photoPathURL = rootConfig.appRootPath;
    $scope.canEdit  =   keepAccount.canEdit;

    $scope.back=function(){
        //globalNavigator.popPage();

        showMessage($scope.tempPhoto.photo_src);



        /*

        showMessage("下砸图片");

        var sourceUrl = rootConfig.appRootPath + keepAccount.tempPhoto.photo_name;
        showMessage(sourceUrl);
        var targetUrl = rootConfig.appRootPath +"temp.jpg";
        showMessage(targetUrl);


        var fileTransfer = new FileTransfer();
        var uri = encodeURI(sourceUrl);

        fileTransfer.download(
            uri,targetUrl,function(entry){
                showMessage("下载完成");

                //var smallImage = document.getElementById('smallImage');
                //smallImage.style.display = 'block';
                //smallImage.src = entry.fullPath;

            },function(error){
                console.log("下载网络图片出现错误");
            });

        */

        $ionicHistory.goBack();
    };

    $scope.testFunction=function(){

        alert("11111");
    };

    // 删除照片
    $scope.removePhoto=function() {
        console.log("删除照片操作");

        //  删除 数据库
        var promise = keepAccount.removePhoto(keepAccount.tempPhoto.line_id);
        promise.then(
            function(response) {  // 调用承诺API获取数据 .resolve

                showMessage("数据删除成功");

                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, onError);

                //removePhotoFiles();

               // var pages = globalNavigator.getPages();
                //console.log(pages);
                //pages[pages.length - 1].destroy();
                //pages[pages.length - 1].destroy();
                //globalNavigator.pushPage(moduleHtmlPath.ACC+'accountList.html', { animation : 'slide' } );

                //loanApply.applyList = response.body.tempRecord;
                //$scope.expenseList=response.body.list;

            },
            function(err) {  // 处理错误 .reject
                dialog.showAlert("E","删除失败...."+angular.toJson(err));

                showMessage("删除失败...."+angular.toJson(err));
            }
        );

    };

    function onSuccess(fileSystem,test) {
        console.log(fileSystem.name);
        showMessage(fileSystem.name);
        showMessage(keepAccount.tempPhoto.photo_src);
        var myFolderApp = rootConfig.appRootFile;

        showMessage(myFolderApp+'/'+keepAccount.tempPhoto.photo_name);
        fileSystem.root.getFile(myFolderApp+'/'+keepAccount.tempPhoto.photo_name, null, onGetFileSuccess, onGetFileError);
    }

    function onError(error) {
        showMessage(error.code);
    }

    function onGetFileSuccess(fileEntry) {
        console.log("File Name: " + fileEntry.name);
        showMessage("File Name: " + fileEntry.name);



        //  删除 文件
        // remove the file
        fileEntry.remove(onRemoveSuccess, onRemoveFail);

        // 删除 数组

    }

    function onGetFileError(error) {
        showMessage("Failed to retrieve file: " + error.code);
    }

    function onRemoveSuccess(entry) {
        console.log("Removal succeeded");
        showMessage("Removal succeeded");
        showMessage(keepAccount.tempPhotoIndex);
        showMessage( angular.toJson(keepAccount.data.photos));

        // 删除 照片纪录表
        keepAccount.removePhoto();

        // 删除 内存中照片列表
        keepAccount.data.photos.splice(keepAccount.tempPhotoIndex,1);
        showMessage( 'photos list:'+angular.toJson(keepAccount.data.photos));


        $ionicHistory.goBack();

        //var pages = globalNavigator.getPages();
        //console.log(pages);
        //pages[pages.length - 1].destroy();
        //pages[pages.length - 1].destroy();
        //globalNavigator.pushPage('html/acc/photos.html', { animation : 'slide' });

    }

    function onRemoveFail(error) {
        showMessage('Error removing file: ' + error.code);
    }

});
