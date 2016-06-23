/**
 * Created by wuxiaocheng on 15/8/26.
 */


angular.module("applicationModule")
    .factory('keepAccount', function ($http,$q,$window, baseConfig) {


    // 上传附件
    function doPostHttp(form,deferred) {
        //showMessage("doPostHttp");
        //http://172.20.0.175:8090/handhr_aurora/hand_app_fileupload.svc
        showMessage( window.localStorage.expUploadUrl);

        $http.post( window.localStorage.expUploadUrl,form,{
            transformRequest: angular.identity,
            headers: { 'Content-Type':undefined}
        })
            .success(function(response) {
                showMessage("上传成功 图片");

                deferred.resolve(response);
            })
            .error(function(err) {
                showMessage("上传失败 图片");

                deferred.reject("上传失败 图片");
            });
    }

    function doPostHttpOnlyData(json, deferred) {


        var Url = baseConfig.businessPath + "/expense_account/create_expense_details";
        var PostData = '{"params":{"p_employee":"' + window.localStorage.empno +
            '","p_details":' + json +'}}';

        console.log(PostData);
        showMessage(PostData );
        $http.post(Url,PostData).success(function (data){

            showMessage(angular.toJson(data));
            deferred.resolve(data);

        }).error(function(data) {
            showMessage("error:"+angular.toJson(data));

            deferred.reject(data);

            //$ionicLoading.hide();

        });


        return deferred.promise;
    }
    
    function deleteAccountItem(timestamp, deferred) {
        console.log("get the timestamp = "+timestamp);
        var Url = baseConfig.businessPath + "/expense_account/delete_expense_details";
//        var PostData = '{"params":{"p_employee":"' + window.localStorage.empno +
//            '","p_time_stamp":' + timestamp+'}}';
        var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_time_stamp":"' + timestamp +  '"}}';

        console.log(PostData);
        showMessage(PostData );
        $http.post(Url,PostData).success(function (data){

            showMessage(angular.toJson(data));
            deferred.resolve(data);

        }).error(function(data) {
            showMessage("error:"+angular.toJson(data));

            deferred.reject(data);

            //$ionicLoading.hide();

        });


        return deferred.promise;
    }


    function createBlob(data, type) {
        var r;
        try {
            r = new $window.Blob([data], {type: type});
        }
        catch (e) {
            // TypeError old chrome and FF
            $window.BlobBuilder = $window.BlobBuilder ||
                $window.WebKitBlobBuilder ||
                $window.MozBlobBuilder ||
                $window.MSBlobBuilder;
            // consider to use crosswalk for android

            if (e.name === 'TypeError' && window.BlobBuilder) {
                var bb = new BlobBuilder();
                bb.append([data.buffer]);
                r = bb.getBlob(type);
            }
            else if (e.name == "InvalidStateError") {
                // InvalidStateError (tested on FF13 WinXP)
                r = new $window.Blob([data.buffer], {type: type});
            }
            else {
                throw e;
            }
        }
        return r;
    }


    /******************************************
     *
     */


    var service= {
        data:{},
        sourceFrom:"",
        canEdit:'',
        canUpload:'',
        operation:'',
        tempPhoto:{},
        tempPhotoIndex:'',
        projectList:[],
        expenseItemList:[],
        expenseCostList:[],
        boolLoadExpenseObject:'',
        //curreentPhotoIndex:0,


        queryDetail: function (lineId) {
            //请求数据库，查询操作
            var detailData={};
            var deferred=$q.defer();
            var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1, location: baseConfig.dbLocation});
            db.transaction(function(tx) {
                var querySql="select * from MOBILE_EXP_REPORT_LINE t where t.line_id=?";
                var para=[lineId];
                //showMessage("query sql "+querySql);

                //showMessage("query para "+para);
                tx.executeSql(querySql, para, function(tx, res) {

                    //showMessage("查询成功");

                    //返回结果
                    detailData={
                        line_id:res.rows.item(0).line_id,
                        expense_type_id:res.rows.item(0).expense_type_id,
                        expense_type_desc:res.rows.item(0).expense_type_desc,
                        expense_item_id:res.rows.item(0).expense_item_id,
                        expense_item_code:res.rows.item(0).expense_item_code,
                        expense_item_desc:res.rows.item(0).expense_item_desc,
                        costObject_id:res.rows.item(0).costObject_id,
                        costObject_desc:res.rows.item(0).costObject_desc,
                        expense_price:res.rows.item(0).expense_price,
                        expense_quantity:res.rows.item(0).expense_quantity,
                        currency_code:res.rows.item(0).currency_code,
                        currency_code_desc:res.rows.item(0).currency_code_desc,
                        exchange_rate:res.rows.item(0).exchange_rate,
                        total_amount:res.rows.item(0).total_amount,
                        expense_date_from:new Date(res.rows.item(0).expense_date_from),
                        expense_date_to:new Date(res.rows.item(0).expense_date_to),
                        expense_place:res.rows.item(0).expense_place,
                        description:res.rows.item(0).description,
                        local_status:res.rows.item(0).local_status,
                        creation_date:res.rows.item(0).creation_date,
                        created_by:res.rows.item(0).created_by,
                        invoice_quantity:res.rows.item(0).invoice_quantity,
                        expenseObject_id:res.rows.item(0).expenseObject_id,
                        expenseObject_desc:res.rows.item(0).expenseObject_desc,
                        expenseObject_type:res.rows.item(0).expenseObject_type,
                        time_stamp:res.rows.item(0).timestamp

                    };

                    //showMessage(detailData.expense_date_from +' -- '+res.rows.item(0).expense_date_from);
                    db.transaction(function(tx) {
                        var photos=[];
                        var sql="select * from MOBILE_EXP_LINE_PHOTOS t where t.line_id=?";
                        tx.executeSql(sql, [lineId], function(tx, res) {
                            for(var i=0;i<res.rows.length;i++){
                                photos.push({
                                    "line_id":res.rows.item(i).line_id,
                                    "photo_id":res.rows.item(i).photo_id,
                                    "photo_name":res.rows.item(i).photo_name,
                                    "photo_src":res.rows.item(i).photo_src,
                                    "creation_date":new Date(res.rows.item(i).creation_date),
                                    "created_by":res.rows.item(i).created_by
                                });
                            }
                            detailData.photos=photos;
                            deferred.resolve(detailData);
                        },function(err) {
                            deferred.reject(err);
                        });
                    });
                }, function(e) {
                    showMessage('ERROR: '+ e.message);
                    deferred.reject(e);
                });
            });
            return deferred.promise;
        },


        /******
         * 功能： 查询 行 关联的照片列表
         * @param lineId
         * @returns {*}
         */
        queryDetailPhoto: function(lineId) {
            var detailData={};
            var deferred=$q.defer();
            var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1, location: baseConfig.dbLocation});

            db.transaction(function(tx) {
                var photos=[];
                var sql="select * from MOBILE_EXP_LINE_PHOTOS t where t.line_id=?";
                tx.executeSql(sql, [lineId], function(tx, res) {
                    for(var i=0;i<res.rows.length;i++){
                        photos.push({
                            "line_id":res.rows.item(i).line_id,
                            "photo_id":res.rows.item(i).photo_id,
                            "photo_name":res.rows.item(i).photo_name,
                            "photo_src":res.rows.item(i).photo_src,
                            "creation_date":new Date(res.rows.item(i).creation_date),
                            "created_by":res.rows.item(i).created_by
                        });
                    }
                    detailData.photos=photos;
                    deferred.resolve(detailData);
                },function(err) {
                    showMessage('ERROR: '+ err.message);

                    deferred.reject(err);
                });



            });
            return deferred.promise;
        },





        remove:function() {
            //
            var deferred=$q.defer();
            var data=this.data;
            showMessage('open db');
            var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1, location: baseConfig.dbLocation});
            var lineID;
            db.transaction(function(tx) {
                // 删除记一笔数据
                var deleteSql="DELETE FROM MOBILE_EXP_REPORT_LINE WHERE line_id =" +
                    "?";
                var para=[
                    data.line_id
                ];
                showMessage('deleteSql '+deleteSql);

                tx.executeSql(deleteSql, para, function(tx, res) {
                    //返回line_id
                    lineID=res.insertId;
                    db.transaction(function(tx) {
                        // 删除图片
                        var deletePhotoSql="DELETE FROM MOBILE_EXP_LINE_PHOTOS WHERE line_id = "+
                            "? ";

                        var para=[
                            data.line_id
                        ];

                        tx.executeSql(deletePhotoSql,  para, function(tx, res) {
                            deferred.resolve(lineID);
                        },function(err) {
                            deferred.reject(err);
                        });
                    });
                }, function(e) {
                    deferred.reject(e);
                });
            });
            return deferred.promise;
        },

        /************
         * 删除图片 的 数据库表
         */
        removePhoto:function(line_id) {

            var deferred=$q.defer();
            var data=this.data;
            var resID;
            showMessage('open db to del lineid'+ line_id);
            var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1, location: baseConfig.dbLocation});
           // var lineID;
            db.transaction(function(tx) {
                // 删除记一笔数据
                var deletePhotoSql="DELETE FROM MOBILE_EXP_LINE_PHOTOS WHERE line_id = "+
                    "? ";

                var para=[
                    line_id
                ];
                showMessage('deleteSql '+deletePhotoSql + ' --- line_id -'+line_id);

                tx.executeSql(deletePhotoSql, para, function(tx, res) {

                    resID=res.insertId;

                    deferred.resolve(resID);

                    //返回line_id

                }, function(e) {
                    deferred.reject(e);
                });
            });
            return deferred.promise;

        },


        /********
         * 记一笔 插入
         * *******/
        insert:function(){
            //转换日期格式


            //showMessage("insert");
            var timestamp = Date.parse(new Date()) / 1000;
            var deferred=$q.defer();
            this.data.time_stamp = ""+timestamp;
            var data=this.data;

            var expense_date_from=getFormatDate(new Date(data.expense_date_from));
            var expense_date_to=getFormatDate(new Date(data.expense_date_to));
            //data.creation_date,


            /*
            var myDate = new Date();

            var month = fillNumberBySize(myDate.getMonth()+1,2);
            var date = fillNumberBySize(myDate.getDate(),2);
            var hours = fillNumberBySize(myDate.getHours(),2);
            var minutes = fillNumberBySize(myDate.getMinutes(),2);
            var seconds = fillNumberBySize(myDate.getSeconds(),2);
            //var milliseconds = fillNumberBySize(myDate.getMilliseconds(),3);


            var creation_date = myDate.getFullYear()+"-"+month+"-"+date+""+hours+":"+minutes
                        +':'+seconds;
               ***/
            var creation_date= getFormatDate(new Date());


            showMessage("creation_date"+creation_date);
            var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1, location: baseConfig.dbLocation});
            var lineID;


            db.transaction(function(tx) {
                var insertSql="INSERT INTO MOBILE_EXP_REPORT_LINE (" +
                    "expense_type_id,"+
                    "expense_type_desc,"+
                    "expense_item_id,"+
                    "expense_item_code,"+
                    "expense_item_desc,"+
                    "expense_price ,"+

                    "expense_quantity,"+
                    "currency_code,"+
                    "currency_code_desc,"+
                    "exchange_rate,"+
                    "total_amount,"+

                    "expense_date_from,"+
                    "expense_date_to,"+
                    "expense_place,"+
                    "description,"+
                    "local_status,"+


                    'invoice_quantity,'+
                    'expenseObject_id,'+
                    'expenseObject_code,'+
                    'expenseObject_desc,'+
                    'expenseObject_type,'+
                    'costObject_id,'+
                    'costObject_desc,'+

                    "creation_date,"+
                    "created_by,"+
                    "timestamp"+

                    ") VALUES (" +
                    "?,?,?,?,?,?,"+
                    "?,?,?,?,?,"+
                    "?,?,?,?,?,"+
                    "?,?,?,?,?,?,?,"+

                    "?,?,?)";
                var para=[
                    data.expense_type_id,
                    data.expense_type_desc,
                    data.expense_item_id,
                    data.expense_item_code,
                    data.expense_item_desc,
                    data.expense_price ,

                    data.expense_quantity,
                    data.currency_code,
                    data.currency_code_desc,
                    data.exchange_rate,
                    data.total_amount,

                    expense_date_from,
                    expense_date_to,
                    data.expense_place,
                    data.description,
                    data.local_status,

                    data.invoice_quantity,
                    data.expenseObject_id,
                    data.expenseObject_code,
                    data.expenseObject_desc,
                    data.expenseObject_type,
                    data.costObject_id,
                    data.costObject_desc,


                    creation_date,
                    data.created_by,
                    timestamp
                ];

                //showMessage('sql '+insertSql);
                showMessage('para '+angular.toJson(para));
                //showMessage(data.creation_date           );

                console.log(para);
               console.log(data.expense_type_id         );
               console.log(data.expense_type_desc           );
               console.log(data.expense_item_id         );
               console.log(data.expense_item_code           );
               console.log(data.expense_item_desc           );
               console.log(data.expense_price           );
               console.log(data.expense_quantity            );
               console.log(data.currency_code           );
               console.log(data.currency_code_desc          );
               console.log(data.exchange_rate           );
               console.log(data.total_amount            );
               console.log(data.expense_date_from           );
               console.log(data.expense_date_to         );
               console.log(data.expense_place           );
               console.log(data.description         );
               console.log(data.local_status            );
               console.log(data.invoice_quantity            );
               console.log(data.expenseObject_id            );
               console.log(data.expenseObject_code          );
               console.log(data.expenseObject_desc          );
               console.log(data.costObject_id           );
               console.log(data.costObject_desc         );
               console.log(creation_date           );
               console.log(data.created_by          );

                tx.executeSql(insertSql, para, function(tx, res) {

                    //showMessage("res"+angular.toJson(res));


                    //showMessage("插入图片");
                    //返回line_id
                    lineID=res.insertId;
                    db.transaction(function(tx) {
                        var sql="INSERT INTO MOBILE_EXP_LINE_PHOTOS ("+
                            "line_id , " +
                            "photo_name ,"+
                            "photo_src ,"+
                            "creation_date ,"+
                            "created_by )"+
                            "values("+
                            "? ,"+
                            "? ,"+
                            "? ,"+
                            "? ,"+
                            "? )";
                        var length=data.photos.length;
                        var count=0;
                        this.curreentPhotoIndex++

                        if(length>0){
                            for(var i=0;i<length;i++){


                                //showMessage("--" +i);
                                var index = i;
                                /*插数据库*/
                                tx.executeSql(sql, [
                                    lineID,
                                    data.photos[i].photo_name,
                                    data.photos[i].photo_src,
                                    data.photos[i].creation_date,
                                    data.photos[i].created_by
                                ], function(tx, res) {


                                    showMessage(count + " -- res insert photo  -"+res.insertId);

                                    showMessage(angular.toJson(data.photos));

                                    data.photos[count].photo_id = res.insertId;
                                    //showMessage(angular.toJson(data.photos[index]));



                                    count++;
                                    if(count==length){
                                        deferred.resolve(lineID);
                                    }
                                },function(err) {
                                    count++;
                                    if(count==length){
                                        //dialog.showAlert("E", " insert ERROR: " + angular.toJson(err) );

                                        deferred.reject(err);
                                    }
                                })
                            }
                        }else{
                            deferred.resolve(lineID);
                        }
                    });
                }, function(e) {


                    showMessage(" insert ERROR: " + e.message);

                    dialog.showAlert("E", " insert ERROR: " + e.message)

                    deferred.reject(e);
                });
            });
            return deferred.promise;
        },  // end of insert





        getData:function(){
            return this.data;
        },

        /***
         * 数据初始化
         */
        initData:function(){

            //prj_project_cost_type_v 项目报销类型归属，其中'SH'为营销，'RH' 管理费用，'PD'为项目实施，‘DN’为笔记本报销

            this.data={
                //userId:baseConfig.user.userId,
                //companyId:baseConfig.user.companyId,
                companyId:"",

                created_by:window.localStorage.empno,
                photos:[],
                expense_type_id :'',
                expense_type_desc : '',
                expense_item_id: '',
                expense_item_code  : '',
                expense_item_desc  : '',
                expense_price  : '',
    
                expense_quantity  : '',
                currency_code  : '',
                currency_code_desc  : '',
                exchange_rate  : '',
                total_amount  : '',
    
                expense_date_from  : '',
                expense_date_to  : '',
                expense_place  : '',
                description  : '',
                local_status  : '',

                invoice_quantity:'',
                expenseObject_id:'',
                expenseObject_code:'',

                expenseObject_desc:'',
                expenseObject_type:'',
                costObject_id:'',
                costObject_desc:'',


                creation_date  : ''



                
            };
            this.boolLoadExpenseObject = false;
            this.projectList = [];
            this.expenseItemList=[];
            this.expenseCostList=[];
            console.log("数据 清空");

            this.data.expense_date_from = new Date();
            this.data.expense_date_to = new Date();
            this.data.expense_quantity = 1;
            //showMessage("数据清空");
            console.log("初始化 默认人民币");
            this.data.currency_code="CNY";
            this.data.currency_code_desc="CNY-人民币";
            this.data.exchange_rate=Number(1);
        },


        /******
         *   记一笔更新本地数据库
         *
         * @param lineId 行id
         * @returns {*}
         */
        update:function(){
            //转换日期格式
            //this.data.expense_date_from=getFormatDate(new Date(this.data.expense_date_from));
            //this.data.expense_date_to=getFormatDate(new Date(this.data.expense_date_to));

            var deferred=$q.defer();
            var data=this.data;
            var expense_date_from=getFormatDate(new Date(data.expense_date_from));
            var expense_date_to=getFormatDate(new Date(data.expense_date_to));


            var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1, location: baseConfig.dbLocation});
            // var lineID;
            var rowsAffacted = 0;
            //showMessage("打开数据库成功");
            //console.log('update'+angular.toJson(date));
            showMessage(angular.toJson(this.date));
            //showMessage('aaa');

            db.transaction(function(tx) {
                // 拼接字符串 行字段
                var updateSql="UPDATE MOBILE_EXP_REPORT_LINE SET " +
                    //"expense_type_id = ?,"+
                    //"expense_type_desc = ?,"+
                    "expense_item_id = ?,"+
                    "expense_item_code = ?,"+
                    "expense_item_desc = ? ,"+
                    "expense_price = ?,"+

                    "expense_quantity = ?,"+
                    "currency_code = ?,"+
                    "currency_code_desc = ?,"+
                    "exchange_rate = ?,"+
                    "total_amount = ?,"+

                    "expense_date_from = ?,"+
                    "expense_date_to = ?,"+
                    "expense_place = ?,"+
                    "description = ?,"+
                    "local_status = ?,"+

                    'invoice_quantity = ?,'+
                    'expenseObject_id = ?,'+
                    'expenseObject_code = ?,'+
                    'expenseObject_desc = ?,'+
                    'expenseObject_type = ?,'+

                    'costObject_id = ?,'+
                    'costObject_desc = ?,'+

                    //"creation_date = ?,"+
                    "created_by = ?"+
                    "WHERE line_id = ?";
                var para=[
                   // data.expense_type_id,
                    //data.expense_type_desc,
                    data.expense_item_id,
                    data.expense_item_code,
                    data.expense_item_desc,
                    data.expense_price,

                    data.expense_quantity,
                    data.currency_code,
                    data.currency_code_desc,
                    data.exchange_rate,
                    data.total_amount,

                    expense_date_from,
                    expense_date_to,
                    data.expense_place,
                    data.description,
                    data.local_status,

                    data.invoice_quantity,
                    data.expenseObject_id,
                    data.expenseObject_code,
                    data.expenseObject_desc,
                    data.expenseObject_type,
                    data.costObject_id,
                    data.costObject_desc,

                    //data.creation_date,
                    data.created_by,
                    data.line_id
                ];

                // 更新字段
                tx.executeSql(updateSql, para, function(tx, res) {

                    //showMessage(rowsAffacted);
                    showMessage("res"+angular.toJson(res));

                    rowsAffacted = res.rowsAffected;


                    db.transaction(function(tx) {

                        //showMessage("插入图片");


                        var insertPhotoSql="INSERT INTO MOBILE_EXP_LINE_PHOTOS ("+
                            "line_id , " +
                            "photo_name ,"+
                            "photo_src ,"+
                            "creation_date ,"+
                            "created_by )"+
                            "values("+
                            "? ,"+
                            "? ,"+
                            "? ,"+
                            "? ,"+
                            "? )";

                        var length=data.photos.length;
                        //showMessage("photo length"+length);

                        ///*
                        var count=0;
                        if(length>0){

                            for(var i=0;i<length;i++){

                                showMessage("photo detail "+angular.toJson(data.photos[i]));
                                //var index =i;

                                //    补齐 新添加的照片记录
                                //    原有照片记录 已在本地数据库 无需更新
                                //   有另外一个页面入口删除本地照片

                                if (typeof(data.photos[i].photo_id) == "undefined" || data.photos[i].photo_id == "") {
                                    showMessage("undefined photo insert");
                                    tx.executeSql(insertPhotoSql, [
                                            data.line_id,
                                            data.photos[i].photo_name,
                                            data.photos[i].photo_src,
                                            data.photos[i].creation_date,
                                            data.photos[i].created_by
                                        ], function(tx, res) {

                                            //this.data.photos[i].photo_id = res.insertId;
                                            //showMessage("insert "+angular.toJson(res));

                                            showMessage(angular.toJson(data.photos));
                                            showMessage(count +"--update --"+ res.insertId );
                                            data.photos[count].photo_id = res.insertId;
                                            showMessage(angular.toJson(data.photos));


                                            //setPhotoID(i,res.insertId);

                                            count++;
                                            showMessage(count);
                                            if(count==length){
                                                //showMessage("插入成功");
                                                deferred.resolve(rowsAffacted);
                                            }
                                        },function(err) {
                                            count++;
                                            if(count==length){
                                                //showMessage("deferred");
                                                //dialog.showAlert("E", " insert ERROR: " + angular.toJson(err) );

                                                deferred.reject(err);
                                            }
                                        }
                                    ); // end of executeSql
                                }
                                else {
                                    count++;
                                    showMessage(count);
                                    if(count==length){
                                        //showMessage("插入成功");
                                        deferred.resolve(rowsAffacted);
                                    }
                                }

                            }
                        }else{
                            deferred.resolve(rowsAffacted);
                        }
                    });
                }, function(e) {
                    showMessage("deferred");
                    deferred.reject(e);
                });
            });
            return deferred.promise;

        },



        uploadDataV2:function(form,photos) {
            console.log("进入");
            //showMessage("上传开始");

            showMessage("photos.length" +photos.length);


            var deferred=$q.defer();
            //showMessage("photos.length" +photos.length);
            //deferred.reject("error");
            if(photos.length>0){
                showMessage("上传有照片");
                //setProgress("上传有照片");
                var  count  = 0;
                for(var i=0;i<photos.length;i++){
                    //这里是异步调用cordova 的文件操作，给form 增加
                    window.resolveLocalFileSystemURL(baseConfig.appRootPath+photos[i].photo_name, function (fileEntry) {
                        fileEntry.file(function (file) {
                            var reader = new FileReader();
                            reader.onloadend = function (fileReadResult) {
                                var data = new Uint8Array(fileReadResult.target.result);
                                var blob = createBlob(data, "image/jpeg");

                                //alert("size: "+file.size);
;                               //dialog.showAlert("I", "size: "+file.size);
                                form.append(file.name, blob, file.name);
                                count ++;
                                if(count == photos.length){
                                    doPostHttp(form,deferred);
                                }
                            };
                            reader.onerror = function (fileReadResult) {
                                //如果失败也算完成的话，这里也加上就行
                                //count ++
                                //if(count == photos.length()){
                                //doPostHttp(form);
                                //}
                            };
                            reader.readAsArrayBuffer(file);
                        });
                    },
                    function (error) {
                        showMessage(error.code);
                    });
                }
            }else{

                //showMessage("上传无照片");

                doPostHttp(form,deferred);
            }

            return deferred.promise;
        },

        uploadDataByJosn: function(dataList, option) {


            var lines = {
                expense_lines:[]
            };
            //showMessage("josn");
            //showMessage(angular.toJson(dataList));
            //showMessage(datalist.expenseObject_id );
            //showMessage(datalist.expense_date_from );


            /*

            console.log(dataList.expenseObject_id );
               console.log(dataList.expense_place );
               console.log(dataList.expense_item_code );
               console.log(dataList.expense_date_from );
               console.log(dataList.expense_date_to );
               console.log(dataList.expense_price );
               console.log(dataList.expense_quantity );
               console.log(dataList.expense_quantity );
               console.log(dataList.exchange_rate );
               console.log(dataList.description );
               console.log("RMB");
               console.log(dataList.costObject_id);
               console.log(dataList.line_id);

                */


            // 日期转化
            var expense_date_from=getFormatDate(new Date(dataList.expense_date_from));
            var expense_date_to=getFormatDate(new Date(dataList.expense_date_to));
            var invoice_quantity =  dataList.invoice_quantity;
           // showMessage("total_amount"+dataList.total_amount);

            var total_amount   = Number(dataList.total_amount).toFixed(2);
           // showMessage("total_amount"+total_amount);



            if (invoice_quantity == '' || invoice_quantity == undefined
                || invoice_quantity == null) {
                invoice_quantity = "";

            }

            showMessage("invoice_quantity - "+ invoice_quantity);
            showMessage("rentals_infor_id - "+ dataList.costObject_id);
            //rentals_infor_id:   ""+dataList.costObject_id,

            //alert("invoice_quantity - "+ invoice_quantity);


            //showMessage("构建数据" +dataList.expense_quantity);
            var item = {
                project_id :        ""+dataList.expenseObject_id,
                place       :       dataList.expense_place,
                fee_item_code:      dataList.expense_item_code,
                date_from :         expense_date_from,
                date_to:            expense_date_to,

                unit_price:         ""+dataList.expense_price,
                quantity:           ""+dataList.expense_quantity,
                amount:             ""+total_amount,
                exchange_rate:      ""+dataList.exchange_rate,
                description:        dataList.description,

                original_currency:  "CNY",
                rentals_infor_id:   ""+dataList.costObject_id,
                attach_number:      ""+invoice_quantity,
                source_code:        option.source_code,
                source_line_id:     option.source_line_id,
                time_stamp:         dataList.time_stamp

            };
            
            console.log("构建上传数据结束 "+ angular.toJson(item));
            showMessage("构建上传数据结束 "+ angular.toJson(item));


            lines.expense_lines.push(item);
/*
            data.expense_type_id,
                data.expense_type_desc,
                data.expense_item_id,
                data.expense_item_code,
                data.expense_item_desc,
                data.expense_price ,

                data.expense_quantity,
                data.currency_code,
                data.currency_code_desc,
                data.exchange_rate,
                data.total_amount,

                data.expense_date_from,
                data.expense_date_to,
                data.expense_place,
                data.description,
                data.local_status,

                data.invoice_quantity,
                data.expenseObject_id,
                data.expenseObject_code,
                data.expenseObject_desc,
                data.costObject_id,
                data.costObject_desc,


                data.creation_date,
                data.created_by

                */
            var data = JSON.stringify(  lines);
            console.log(data);
            showMessage(data);

            console.log("进入");
            showMessage("上传开始");

            //showMessage("photos.length" +photos.length);


            var deferred=$q.defer();
            //showMessage("photos.length" +photos.length);
            //deferred.reject("error");


                //showMessage("上传无照片");

            doPostHttpOnlyData(data,deferred);


            return deferred.promise;

        },



        uploadData:function(form,photos) {    // 以formdatade 形式上传文件
            console.log("进入");
            showMessage("上传开始");

            showMessage("photos.length" +photos.length);


            var deferred=$q.defer();
            //showMessage("photos.length" +photos.length);
            //deferred.reject("error");
            if(photos.length>0){
                showMessage("上传有照片");
                //setProgress("上传有照片");
                var  count  = 0;
                for(var i=0;i<photos.length;i++){
                    //这里是异步调用cordova 的文件操作，给form 增加
                    window.resolveLocalFileSystemURL(photos[i].photo_src, function (fileEntry) {
                        fileEntry.file(function (file) {
                            var reader = new FileReader();
                            reader.onloadend = function (fileReadResult) {
                                var data = new Uint8Array(fileReadResult.target.result);
                                var blob = createBlob(data, "image/jpeg");
                                form.append(file.name, blob, file.name);
                                count ++;
                                if(count == photos.length){
                                    doPostHttp(form,deferred);
                                }
                            };
                            reader.onerror = function (fileReadResult) {
                                //如果失败也算完成的话，这里也加上就行
                                //count ++
                                 //if(count == photos.length()){
                                 //doPostHttp(form);
                                 //}
                            };
                            reader.readAsArrayBuffer(file);
                        });
                    });
                }
            }else{

                //showMessage("上传无照片");

                doPostHttp(form,deferred);
            }

            return deferred.promise;
        },
        uploadFile:function (interfaceId,fileName,fileURL) {    //以FileTransfer 的upload方法上传单个文件
            /*以FileTransfer的方式上传文�?*//*
             var deferred  = $q.defer();
             alert("uploadFile.....");
             var deferred  = $q.defer();
             // 显示上传进度
             var showUploadingProgress=function(progressEvt ){
             if( progressEvt.lengthComputable ){
             navigator.notification.progressValue( Math.round( ( progressEvt.loaded / progressEvt.total ) * 100) );
             }
             }
             var win = function (r) {
             deferred.resolve( r );
             };
             var fail = function (error) {
             deferred.reject(error);
             alert("提示图片上传失败，错误信息：" + angular.toJson(error));
             };
             var options = new FileUploadOptions();
             options.fileKey = interfaceId;
             options.fileName = fileName;
             options.mimeType = "image/jpeg";
             var ft = new FileTransfer();
             ft.onprogress = showUploadingProgress;
             ft.upload(fileURL, encodeURI(baseConfig.basePath+"uploadAttachment.svc?interfaceId="+interfaceId), win, fail, options);

             return deferred.promise;*/
        },
        updateLocalStatus:function(lineId,status){  //根据lineId 更新本地记一笔的local_status
            var deferred=$q.defer();
            var db = window.sqlitePlugin.openDatabase({name: baseConfig.dbName, createFromLocation: 1, location: baseConfig.dbLocation});
            db.transaction(function(tx) {
                var insertSql="UPDATE MOBILE_EXP_REPORT_LINE  "+
                    " SET  local_status = ? " +
                    " WHERE line_id= ? ";
                var para=[
                    status,
                    lineId
                ];
                tx.executeSql(insertSql, para, function(tx, res) {
                        deferred.resolve(res);
                    },
                    function(e){
                        deferred.reject(e);
                    });
            });
             return deferred.promise;
        },


        // 上传 预报销申请 控制

        // @return  true: 合法   false: 非法

        checkCostObject:function (expenseObject_type,expense_item_code,total_amount) {
            var checkDataValid = true;
            //showMessage("checkCostObject");
            //showMessage(expenseObject_type+" -" +expense_item_code +" - "+total_amount);
            if (expenseObject_type == "SH") {
                // 营销类
                showMessage("expense_item_code - "+expense_item_code);
                if (expense_item_code == EXPENSE_ITEM_CODE.OfficeExpenses ) {
                    // 办公费
                    checkDataValid = false;

                }
                else {

                    //showMessage("是否在租房类别之内");
                    var code =  isNeedHouseApply(expense_item_code);
                    if ( false == code ) {

                        // 非 租房 和 办公费
                        if (total_amount >=2000 ) {

                            checkDataValid = false;

                        }
                    }

                }


            }

            //showMessage("checkDataValid -"+checkDataValid );

            console.log("checkDataValid -"+checkDataValid );
            return checkDataValid;

        },







        explogin:function () {


            var deferred = $q.defer();

            showMessage("login");
            var postData = {username: "admin", password: "admin"};

            var url =baseConfig.basePath+"LOGIN/login.svc";
            console.log('登录请求的地址是:'+url);

            $http({
                method: 'POST',
                url: url,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function (data) {
//                return  'para=' + JSON.stringify(data);
                    return  'para=' + JSON.stringify(data);
                },
                data: postData,
                timeout:15000
            }).
                success(function(response) {
                    deferred.resolve(response);
                }).
                error(function(err) {

                    deferred.reject(err);
                });
            return deferred.promise;



        },
        

        removeItem:function(timestamp){
            //删除服务器记一笔数据
            console.log("进入删除服务器记一笔数据");
            showMessage("上传删除");
            var deferred=$q.defer();
            deleteAccountItem(timestamp, deferred);
            return deferred.promise;
        }


    };
    return service;
});