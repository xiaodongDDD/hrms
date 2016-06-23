angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.acc_uploadAccount', {
          url: '/acc/uploadAccount',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/acc/uploadAccount.html',
              controller: 'uploadController'
            }
          }
        });
    }]);


angular.module("applicationModule")
    .controller('uploadController', function ($scope, keepAccount, dialog, $http, $q,$ionicLoading, baseConfig) {

    $scope.currentProgress = '批量上传'; 
    var recordToUpload = 0;
    var recordUploaded = 0;
    var recordToUploadLength = 0; 

        //showMessage(window.localStorage.empno);
    function queryAccountList() {
        // alert("queryAccountList");
        var list = [];
        // alert(baseConfig.dbName);
        var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1, location: baseConfig.dbLocation});
        // alert("queryAccountList0000");
        var deferred = $q.defer();
        db.transaction(function (tx) {
            // alert("++++++++-------");
            var querySql = "select * from MOBILE_EXP_REPORT_LINE t WHERE local_status = 'NEW' AND created_by =? order by creation_date desc, line_id desc ;"
            var para=[
                window.localStorage.empno
            ];
            tx.executeSql(querySql, para, function (tx, res) {
                //alert(angular.toJson(res.rows.item(0)));
                for (var i = 0; i < res.rows.length; i++) {
                    list.push(res.rows.item(i));
                }
                deferred.resolve(list);
            });
        }, function (e) {
            // alert("++++++++");
            alert(angular.toJson(e));
            console.log("ERROR: " + e.message);
            deferred.reject(e);
        });
        return deferred.promise;
    }

    function queryAccountPhotos(lineId) {
        var list = [];
        //alert("打开数据库...");
        var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1, location: baseConfig.dbLocation});

        var deferred = $q.defer();
        db.transaction(function (tx) {
            var querySql = "select * from MOBILE_EXP_LINE_PHOTOS t where t.line_id=? ;";
            tx.executeSql(querySql, [lineId], function (tx, res) {
                //alert(angular.toJson(res.rows.item(0)));
                for (var i = 0; i < res.rows.length; i++) {
                    list.push(res.rows.item(i));
                }
                //showMessage("List:--" +angular.toJson(list));
                deferred.resolve(list);
            });
        }, function (e) {
            console.log("ERROR: " + e.message);
            deferred.reject(e);
        });
        return deferred.promise;
    }

       // /*
    var promise = queryAccountList();
    promise.then(function (list) {  // 调用承诺API获取数据 .resolve
        // alert("...");
        $scope.accountList = list;

        console.log("list - "+angular.toJson($scope.accountList));
        $scope.accountList2 = groupJSON($scope.accountList);
        //alert(angular.toJson($scope.accountList2));
    }, function (response) {  // 处理错误 .reject
        // alert(".........");
        //alert("查询数据库错误,初始化数据");
        dialog.showAlert("E","查询数据库错误,初始化数据");
    });
   // */


        function doReloadData () {
            var promise = queryAccountList();
            promise.then(function (list) {  // 调用承诺API获取数据 .resolve
                $scope.accountList = list;

                console.log("list - "+angular.toJson($scope.accountList));
                $scope.accountList2 = groupJSON($scope.accountList);


                $ionicLoading.hide();
                //alert(angular.toJson($scope.accountList2));
            }, function (response) {  // 处理错误 .reject

                $ionicLoading.hide();
                dialog.showAlert("E","查询数据库错误,初始化数据");

                //alert("查询数据库错误,初始化数据");
            });
        }


        /**
        $scope.accountList2 = [
            {
                time:"20120202",
                list: [
                    {
                        "line_id": "123",
                        "local_status":"UPLOADED",
                        "expenseObject_desc":"项目1",
                        expense_item_desc:"办公费",
                        total_amount:22,
                        expense_date_from:"20120202",
                        expense_date_to:"20120202",
                        expense_place:'上海'



                    },
                    {
                        "line_id": "123",
                        "local_status":"NEW",
                        "expenseObject_desc":"项目2",
                        expense_item_desc:"办公费",
                        total_amount:22,
                        expense_date_from:"20120202",
                        expense_date_to:"20120202",
                        expense_place:'上海'

                    }
                ]

            },
            {
                time:"20120202",
                list: [
                    {
                        "line_id": "123",
                        local_status:"NEW",
                        "expenseObject_desc":"项目2",
                        expense_item_desc:"办公费",
                        total_amount:27,
                        expense_date_from:"20120202",
                        expense_date_to:"20120202",
                        expense_place:'上海'

                    },
                    {
                        "line_id": "123",
                        "local_status":"UPLOADED",
                        "expenseObject_desc":"项目2",
                        expense_item_desc:"办公费",
                        total_amount:24,
                        expense_date_from:"20120202",
                        expense_date_to:"20120202",
                        expense_place:'上海'
                    }
                ]

            }

        ];


         //*/

    //    author:郑旭 用于对json进行分组并在界面上显示
    function groupJSON(jsons) {

            /*
                var newJson = [];
                loop1:for (var i = 0; i < jsons.length; i++) {
                    var t1 = jsons[i].expense_date_from;
                    var arr = {time: t1, list: []};
                    arr.list.push(jsons[i]);
                    for (var j = i + 1; j < jsons.length; j++) {
                        var t2 = jsons[j].expense_date_from;
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

                */
            var newJson=[];
            loop1:for(var i=0;i<jsons.length;i++){
                var t1=jsons[i].creation_date;
                var arr={time:t1,list:[]};
                arr.list.push(jsons[i]);
                for(var j=i+1;j<jsons.length;j++){
                    var t2=jsons[j].creation_date;
                    if(t2==t1){
                        arr.list.push(jsons[j]);
                    }else{
                        i=j-1;
                        break;
                    }
                    if(j==jsons.length-1){
                        newJson.push(arr);
                        break loop1;
                    }
                }
                newJson.push(arr);
            }
            return newJson;
    }

    /*$scope.accountList=[
     {
     line_id:1,
     expense_type_id:1,
     expense_type_desc:'日常报销',
     expense_item_id:1,
     expense_item_desc:'交通费',
     expense_price:2.5,
     expense_quantity:4,
     currency_code:'CNY',
     currency_code_desc:'人民币',
     exchangeRate:1.5,
     total_amount:10,
     expense_date_from:'2015-05-01',
     expense_date_to:'2015-05-30',
     expense_place:'上海',
     description:'往返交通费',
     local_status:'NEW',
     creation_date:'2015-05-15',
     created_by:1
     }
     ];*/

    $scope.showSelected = function () {
        console.log($scope.accountList);
    };

    function queryPhotosList() {
        var promise = keepAccount.queryPhotosList();
    }



    function uploadDataUnitV2(keepAccountUnit){

        showMessage("uploadDataUmit ："+angular.toJson(keepAccountUnit));

        var form=new FormData();


        var myDate = new Date();

       // var expense_detail_id = window.localStorage.empno+myDate.getFullYear()+myDate.getMonth()+myDate.getDate()
           // + myDate.getHours()+ myDate.getMinutes()+ myDate.getSeconds()+ myDate.getMilliseconds();
        var month = fillNumberBySize(myDate.getMonth()+1,2);
        var date = fillNumberBySize(myDate.getDate(),2);
        var hours = fillNumberBySize(myDate.getHours(),2);
        var minutes = fillNumberBySize(myDate.getMinutes(),2);
        var seconds = fillNumberBySize(myDate.getSeconds(),2);
        var milliseconds = fillNumberBySize(myDate.getMilliseconds(),3);


        var expense_detail_id = window.localStorage.empno+myDate.getFullYear()
            +month+date+hours+minutes+seconds+milliseconds;


        showMessage(expense_detail_id);
        console.log(expense_detail_id+" - "+expense_detail_id);

        form.append("expense_detail_id",expense_detail_id);



        var Photos = [];
        var promisePhoto = queryAccountPhotos(keepAccountUnit.line_id);
        promisePhoto.then(
            function(response) {
                //showMessage("照片列表获取成功"+angular.toJson(response));
                Photos=response;
                //showMessage("照片列表获取成功"+Photos);

                showMessage("准备上传:"+angular.toJson(form));

                //var promise= keepAccount.uploadData(form,Photos);

                var promise= keepAccount.uploadDataV2(form,Photos);

                promise.then(
                    function(response) {
                        //var code=getResponseCode(response);
                        showMessage(angular.toJson(response));
                        var code = response.head.code;
                        if(code=="success"){
                            //接受返回参数
                            //keepAccount.data.expenseDetailId=response.body.expenseDetailId;

                            // 开始 上传数据

                            var upload_option = {
                                source_code: "HIH_PIC_UPLOAD",
                                source_line_id: expense_detail_id

                            };

                            var p2= keepAccount.uploadDataByJosn(keepAccountUnit,upload_option);
                            p2.then(

                                function(res){

                                    var code = res.status;

                                    if (code == 'S') {
                                        // $ionicLoading.hide();
                                        showMessage("上传成功 数据"+angular.toJson(res));


                                        keepAccountUnit.local_status="UPLOADED";
                                        //$scope.accountDetail=keepAccount.data;
                                        //keepAccount.canEdit=false;
                                        //$scope.canEdit=false;
                                        //更新本地数据库，修改local_status
                                        var p=keepAccount.updateLocalStatus(keepAccountUnit.line_id,"UPLOADED");
                                        p .then(
                                            function(res){

                                                recordToUpload--;

                                                $ionicLoading.hide();
                                                checkUploadFinish();

                                                showMessage("上传成功 本地状态修改成功"+angular.toJson(res));

                                            },
                                            function(e){
                                                $ionicLoading.hide();
                                                checkUploadFinish();



                                                showMessage(angular.toJson(e));
                                            }
                                        );

                                    }
                                    else {
                                        checkUploadFinish();
                                        showMessage("上传失败 数据"+angular.toJson(res));


                                    }




                                },
                                function(e){
                                    $ionicLoading.hide();
                                    checkUploadFinish();



                                    showMessage(angular.toJson(e));
                                }

                            );




                        }else if(code=="E"){
                            $ionicLoading.hide();
                            checkUploadFinish();


                            showMessage("查询失败:"+angular.toJson(response))
                        }
                        else{
                            checkUploadFinish();

                            $ionicLoading.hide();

                            showMessage("未知错误:"+angular.toJson(response));
                        }


                    },
                    function(err) {  // 处理错误 .reject

                        $ionicLoading.hide();

                        checkUploadFinish();


                        showMessage("网络连接错误...."+angular.toJson(err));
                        //uploadProgressModal.hide();

                    });  // end of 上传

            },
            function(err) {
                $ionicLoading.hide();

                checkUploadFinish();
                showMessage("照片列表获取失败"+err);

            }
        );


    }



    function uploadDataUnit(keepAccountUnit){

        showMessage("uploadDataUmit ："+angular.toJson(keepAccountUnit));

        var form=new FormData();

        showMessage("line_id ："+keepAccountUnit.line_id);

        form.append("line_id",keepAccountUnit.line_id);
        //showMessage("form:"+angular.toJson(form));

        form.append("expense_type_id",keepAccountUnit.expense_type_id);
        form.append("expense_type_desc",keepAccountUnit.expense_type_desc);
        form.append("expense_item_id",keepAccountUnit.expense_item_id);
        form.append("expense_item_desc",keepAccountUnit.expense_item_desc);
        form.append("expense_price",keepAccountUnit.expense_price);
        form.append("expense_quantity",keepAccountUnit.expense_quantity);
        form.append("currency_code",keepAccountUnit.currency_code);
        form.append("currency_code_desc",keepAccountUnit.currency_code_desc);
        form.append("exchange_rate",keepAccountUnit.exchange_rate);
        form.append("total_amount",keepAccountUnit.total_amount);
        form.append("expense_date_from",keepAccountUnit.expense_date_from);
        form.append("expense_date_to",keepAccountUnit.expense_date_to);
        form.append("expense_place",keepAccountUnit.expense_place);
        form.append("description",keepAccountUnit.description);
        form.append("created_by",keepAccountUnit.created_by);

        var Photos = [];
        var promisePhoto = queryAccountPhotos(keepAccountUnit.line_id);
        promisePhoto.then(
            function(response) {
                //showMessage("照片列表获取成功"+angular.toJson(response));
                Photos=response;
                //showMessage("照片列表获取成功"+Photos);

                showMessage("准备上传:"+angular.toJson(form));

                //var promise= keepAccount.uploadData(form,Photos);

                var promise= keepAccount.uploadDataByJosn(keepAccountUnit);

                promise.then(
                    function(response) {

                        showMessage("上传返回:"+"--"+angular.toJson(response));

                        //showMessage("上传返回:"+keepAccountUnit.line_id+"--"+angular.toJson(response));

                        //var code=getResponseCode(response);
                        var code=response.status;
                        showMessage("status -"+code);

                        if(code=="S"){

                            showMessage("上传成功:"+keepAccountUnit.line_id+"--"+angular.toJson(response));

                            //接受返回参数
                            //keepAccountUnit.expenseDetailId=response.body.expenseDetailId;
                            keepAccountUnit.local_status="UPLOADED";
                            //$scope.accountDetail=keepAccountUnit;
                            // keepAccount.canEdit=false;
                            //$scope.canEdit=false;
                            //更新本地数据库，修改local_status
                            var p=keepAccount.updateLocalStatus(keepAccountUnit.line_id,"UPLOADED");
                            p .then(
                                function(res){
                                    showMessage("更新成功"+angular.toJson(res));
                                    recordToUpload--;
                                    //showUploadProgress('剩余上传记录：'+ recordToUpload);

                                    checkUploadFinish();

                                    //若此时的sourceFrom 为报销单，将keepAccountUnit 的数据赋值给 expenseApply.data.lines ,完成值传递
                                    /*   报销单 入口
                                     if(sourceFrom=="EXPENSE"){
                                     var line={
                                     appSourceId:keepAccountUnit.expenseDetailId,
                                     price:keepAccountUnit.expense_price,
                                     quantity:keepAccountUnit.expense_quantity,
                                     expenseTypeId:keepAccountUnit.expense_type_id,
                                     expenseTypeName:keepAccountUnit.expense_type_desc,
                                     expenseItemId:keepAccountUnit.expense_item_id,
                                     expenseItemName:keepAccountUnit.expense_item_desc,
                                     place:keepAccountUnit.expense_place,
                                     dateFrom:keepAccountUnit.expense_date_from,
                                     dateTo:keepAccountUnit.expense_date_to,
                                     originalCurrency:keepAccountUnit.currency_code,
                                     exchangeRate:keepAccountUnit.exchange_rate,
                                     description:keepAccountUnit.description
                                     };
                                     expenseApply.data.lines.push(line);
                                     globalNavigator.popPage();
                                     }
                                     */
                                },
                                function(e){
                                    checkUploadFinish();
                                    showMessage("更新失败"+angular.toJson(e));
                                }
                            );

                        }else if(code=="E"){
                            checkUploadFinish();
                            showMessage("查询失败:"+angular.toJson(response))
                        }
                        else if (code =="login_required"){
                            showMessage("登录状态异常\n"+angular.toJson(response));
                            reLogin();
                        }else{
                            checkUploadFinish();
                            showMessage("未知错误:"+angular.toJson(response));
                        }
                    },
                    function(err) {  // 处理错误 .reject
                        checkUploadFinish();
                        showMessage("网络连接错误...."+angular.toJson(err));
                    });


            },
            function(err) {
                checkUploadFinish();
                showMessage("照片列表获取失败"+err);

            }
        )
;


    }


    // 结束检查
    function checkUploadFinish () {
        recordUploaded++;

        //showMessage(recordUploaded +" - "+recordToUploadLength);
        if (recordUploaded == recordToUploadLength) {
            //uploadProgressBatchModal.hide();

            if (recordToUpload == 0) {
                showMessage("批量上传成功");
                dialog.showAlert("I","批量上传成功");

            }
            else if (recordToUpload < 0){
                dialog.showAlert("I","批量上传长度统计异常");

                showMessage("批量上传长度统计异常");

            }else {
                showMessage("批量上传没有全部成功");
                dialog.showAlert("I","批量上传 部分 失败");


            }


            doReloadData();


            /*
             var pages = globalNavigator.getPages();
             pages[pages.length - 1].destroy();
             globalNavigator.pushPage(moduleHtmlPath.ACC+'uploadAccount.html', { animation : 'slide' });
             */


        }
    }

    /*上传数据*/
    $scope.uploadDataBatch=function(){
        /**/
        //showMessage("批量上传 prepare");

        $ionicLoading.show({
            template: '批量上传 ... '
            //duration: 3000
        });

        //console.log("批量上传操作");




       // showMessage("批量上传操作");
        ///*

        //uploadProgressBatchModal.show();
        var selectedAccounts = getSelected();
        //showMessage("select "+angular.toJson(selectedAccounts));

        ///*
        recordToUpload = selectedAccounts.length;
        recordUploaded = 0;
        recordToUploadLength = selectedAccounts.length;
        //showUploadProgress('剩余上传记录：'+ recordToUpload);
        //showMessage('剩余上传记录：'+ recordToUpload);
        ///*

        if (recordToUploadLength == 0 || recordToUploadLength == undefined) {
            $ionicLoading.hide();
        }
        else {
            for (var i = 0; i < selectedAccounts.length; i++) {
                showMessage("批量上传 序列："+i);

                //-----------------------
                //       合法性  检验
                //-----------------------
                var checkDataValid = true;
                var data_temp = selectedAccounts[i];
                if (data_temp.costObject_id == '' || data_temp.costObject_id == undefined ||
                    data_temp.costObject_id == null ) {


                    checkDataValid = keepAccount.checkCostObject(
                        data_temp.expenseObject_type,
                        data_temp.expense_item_code,
                        data_temp.total_amount
                    );


                }

                if (checkDataValid == false ) {

                    /*
                     $ionicLoading.show({
                     template: '预报销申请不能为空...跳过',
                     duration: 1000
                     });
                     //*/

                    showMessage('预报销申请不能为空...跳过- '+i);

                    //dialog.showAlert("E",'预报销申请不能为空...跳过第 '+i+" 条");


                    checkUploadFinish();

                }
                else {

                    uploadDataUnitV2 (selectedAccounts[i]);

                }


                //showMessage("批量上传 end 序列："+i);

            }
        }


        //*/
      
    };


    function showUploadProgress(msg) {
        //console.log($scope.currentProgress);
        $scope.currentProgress = msg;
        //console.log($scope.currentProgress);

    }
    
    $scope.uploadAccounts = function () {
        var selectedAccounts = getSelected();


        for (var i = 0; i < selectedAccounts.length; i++) {
            /*将本地数据提交到后台接口表*/
            alert("开始上传数据" + i);
            var line_id = selectedAccounts[i].line_id;
            $http({
                method: 'POST',
                url: baseConfig.basePath + "EXP/EXP5030/mobile_exp_report_detail_insert.svc",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (data) {
                    return  'para=' + JSON.stringify(data);
                },
                data: selectedAccounts[i]
            })
                .success(function (response) {
                    console.log("response:" + "成功返回");
                    alert("response:" + angular.toJson(response));
                    /*获取返回的interfaceId*/
                    var interfaceId = response.body.expenseDetailId;

                    /*查询照片列表，上传照片到服务器*/
                    var promise = queryAccountPhotos(line_id);
                    promise.then(function (list) {
                        var Photos = list;
                        alert("获取photos数据成功" + Photos.length);
                        alert("开始上传文件");
                        for (var j = 0; j < Photos.length; j++) {
                            keepAccount.uploadFile(interfaceId, Photos[j].photo_name, Photos[j].photo_src);
                        }
                        /*更新本地记一笔数据状态，local_status 更改为 UPLOADED*/
                        keepAccount.updateLocalStatus(line_id);
                    }, function (response) {
                        alert("查询照片数据库错误");
                    });
                }).error(function (response, status) {
                    console.log("response:" + "失败返回");
                    console.log("response:" + response + ",status:" + status);
                });
        }
    };

    function getSelected() {
        var accountList = $scope.accountList;
        var selectedList = [];
        for (var i = 0; i < accountList.length; i++) {

            showMessage("行："+accountList[i].upLoadSelected );
            if (!(accountList[i].upLoadSelected==undefined || accountList[i].upLoadSelected==false)) {
                selectedList.push(accountList[i]);
            }

            //showMessage("selectedList "+ angular.toJson(selectedList));
        }
        return selectedList;
    }


});
