/**
 * Created by wuxiaocheng on 15/8/26.
 */
appModuleExpense
  .controller('accountListController', function ($scope, $http, $q, keepAccount, $state, $ionicLoading) {

    $scope.shouldShowDelete = true;

    function queryAccountList() {

      //showMessage("查询列表");
      var list = [];

      var db = window.sqlitePlugin.openDatabase({name: rootConfig.dbName, createFromLocation: 1});
      var deferred = $q.defer();
      db.transaction(function (tx) {
        var querySql = "select * from MOBILE_EXP_REPORT_LINE where created_by = ? order by creation_date desc, line_id desc";
        var para = [
          window.localStorage.empno
        ];
        tx.executeSql(querySql, para, function (tx, res) {
          if (res.rows.length == 0) {
            showMessage("表里的数据为空!! -");
            deferred.resolve(list);

          } else {
            //                  alert(angular.toJson(res.rows.item(0)));
            for (var i = 0; i < res.rows.length; i++) {
              list.push(res.rows.item(i));
            }
            deferred.resolve(list);
          }
        });
      });
      return deferred.promise;
    }

    $ionicLoading.show({
      template: 'Loading...',
      duration: 1000
    });

    ///*
    var promise = queryAccountList();
    promise.then(function (list) {  // 调用承诺API获取数据 .resolve
      $scope.accountList = groupJSON(list);

      //showMessage("查询 结束");
      //$ionicLoading.hide();

    }, function (response) {  // 处理错误 .reject
      showMessage("查询数据库错误");
    });


    $scope.doRefresh = function () {
      $ionicLoading.show({
        template: '刷新列表...',
        duration: 1000
      });
      var promise = queryAccountList();
      promise.then(function (list) {  // 调用承诺API获取数据 .resolve
        $scope.accountList = groupJSON(list);
        $scope.$broadcast('scroll.refreshComplete');
        $ionicLoading.hide();


      }, function (response) {  // 处理错误 .reject
        showMessage("查询数据库错误");
        $scope.$broadcast('scroll.refreshComplete');
        $ionicLoading.hide();


      });
    };

    function doReLoadList() {

      var promise = queryAccountList();
      promise.then(function (list) {  // 调用承诺API获取数据 .resolve


        $scope.accountList = groupJSON(list);
        //showMessage(angular.toJson($scope,accountList));
        $ionicLoading.hide();


      }, function (response) {  // 处理错误 .reject
        showMessage("查询数据库错误");

        $ionicLoading.hide();

      });
    }


    // 删除记一笔
    $scope.removeData = function (e) {

      var target = e.target;
      var lineId = target.getAttribute('lineId');
      var timestamp = target.getAttribute('timestamp');

      showMessage("delete clicked lineid " + lineId);


      $ionicLoading.show({
        template: '正在删除...'
        //duration: 1000
      });

      var promiseGetPhotos = keepAccount.queryDetailPhoto(lineId);
      promiseGetPhotos.then(
        function (response) {
          var promiseRemove = keepAccount.removeItem(timestamp);
          promiseRemove.then(function (removeResponse) {
              var statusCode = removeResponse.status;
              console.log("get the statusCode = " + statusCode);
              if (statusCode === "S") {
                keepAccount.initData();
                keepAccount.data.photos = response.photos;
                keepAccount.data.line_id = lineId;

                var promise = keepAccount.remove(lineId);
                promise.then(
                  function (response) {  // 调用承诺API获取数据 .resolve

                    showMessage("数据删除成功");
                    showMessage(angular.toJson(keepAccount.data.photos));
                    showMessage("length - " + (keepAccount.data.photos.length));


                    if (keepAccount.data.photos.length != undefined && keepAccount.data.photos.length != 0) {

                      //showMessage("length - "+(keepAccount.data.photos.length));

                      removePhotoFiles();
                    }
                    else {
                      showMessage("无照片");
                      doReLoadList();
                    }


                  },
                  function (err) {  // 处理错误 .reject
                    $ionicLoading.hide();
                    showMessage("删除失败...." + angular.toJson(err));
                  }
                );
              } else {
                $ionicLoading.hide();
                $ionicLoading.show({
                  template: '删除失败...',
                  duration: 1000
                });
              }
            },
            function (err) {  // 处理错误 .reject
              $ionicLoading.hide();
              showMessage("删除失败...." + angular.toJson(err));
            });
        },
        function (error) {
          $ionicLoading.hide();
          showMessage("删除失败...." + angular.toJson(err));

        }
      );

    };


    function groupJSON(jsons) {

      var newJson = [];
      loop1:for (var i = 0; i < jsons.length; i++) {
        var t1 = jsons[i].creation_date;
        var arr = {time: t1, list: []};
        arr.list.push(jsons[i]);
        for (var j = i + 1; j < jsons.length; j++) {
          var t2 = jsons[j].creation_date;
          if (t2 == t1) {
            arr.list.push(jsons[j]);
          } else {
            i = j - 1;
            break;
          }
          if (j == jsons.length - 1) {
            newJson.push(arr);
            break loop1;
          }
        }
        newJson.push(arr);
      }
      return newJson;
    }


    $scope.openDetail = function (e) {
      var target = e.target;
      var lineId = target.getAttribute('lineId');
      var status = target.getAttribute('status');
      showMessage(lineId + "----" + status);
      if (status == "UPLOADED") {
        keepAccount.canEdit = false;
        keepAccount.canUpload = false;
        keepAccount.boolLoadExpenseObject = false;
      } else {
        keepAccount.canEdit = true;
        keepAccount.canUpload = true;
        keepAccount.sourceFrom = "ACCOUNT";
        keepAccount.operation = "UPDATE";
        keepAccount.boolLoadExpenseObject = true;
      }

      keepAccount.queryDetail(lineId).then(
        function (detailData) {
          showMessage(angular.toJson(detailData.photos));
          keepAccount.data = detailData;
          //globalNavigator.pushPage('html/acc/accountDetail.html', { animation : 'slide' });
          //showMessage("acc_detail");
          $state.go("tab.acc_detail");
        },
        function (err) {
          showMessage(err);
        }
      );
    };


    // 删除照片
    function removePhotoFiles() {
      showMessage("删除照片操作 begin");

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, onError);
    }

    function onSuccess(fileSystem) {
      console.log(fileSystem.name);
      //showMessage(fileSystem.name);

      //showMessage(keepAccount.tempPhoto.photo_src);
      var myFolderApp = rootConfig.appRootFile;


      // 数据删除完成 开始删除图片
      var length = keepAccount.data.photos.length;
      showMessage("总长度 " + keepAccount.data.photos.length);

      var count = 0;
      //keepAccount.tempDeleteIndex =0;
      if (length > 0) {
        for (var i = 0; i < length; i++) {
          /*插数据库*/
          count = i;
          showMessage("删除 " + i + " name " + keepAccount.data.photos[i].photo_name);
          fileSystem.root.getFile(myFolderApp + '/' + keepAccount.data.photos[i].photo_name, null, onGetFileSuccess, onGetFileError);

        }
      } else {
        deferred.resolve(lineID);
      }
      //showMessage(myFolderApp+'/'+keepAccount.tempPhoto.photo_name);
      //fileSystem.root.getFile(myFolderApp+'/'+data.photo[this.tempDeleteIndex].photo_name, null, onGetFileSuccess, onGetFileError);
    }

    function onError(error) {
      showMessage(error.code);
    }

    function onGetFileSuccess(fileEntry) {
      console.log("File Name: " + fileEntry.name);
      //showMessage("File Name: " + fileEntry.name);

      // remove the file
      fileEntry.remove(onRemoveSuccess, onRemoveFail);

    }

    function onGetFileError(error) {
      showMessage("Failed to retrieve file: " + error.code);
    }

    function onRemoveSuccess(entry) {
      console.log("Removal succeeded");
      showMessage("Removal succeeded");
      //showMessage(keepAccount.tempPhotoIndex);
      showMessage(angular.toJson(keepAccount.data.photos));

      keepAccount.data.photos.splice(keepAccount.tempPhotoIndex, 1);
      //showMessage( 'photos list:'+angular.toJson(keepAccount.data.photos));

      doReLoadList();

    }

    function onRemoveFail(error) {
      showMessage('Error removing file: ' + error.code);
    }

  });
