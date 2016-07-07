/**
 * Created by wuxiaocheng on 15/8/26.
 */
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.acc_detail', {
          url: '/acc/detail',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/acc/accountDetail.html',
              controller: 'accountDetailController',
              cache: false
            }
          }
        });
    }]);
angular.module("applicationModule")
  .controller('accountDetailController', function ($scope, keepAccount, expenseApply, expenseObject, dialog, $http, $rootScope, $state, $ionicHistory, $ionicLoading, baseConfig) {

    $scope.canEdit = keepAccount.canEdit;
    $scope.canUpload = keepAccount.canUpload;
    $scope.accountDetail = keepAccount.data;

    expenseObject.businessType = 'ACC';

    /*
     $ionicLoading.show({
     template: 'Loading ... ',
     duration: 1000
     });
     */
    //showMessage(angular.toJson($scope.accountDetail));
    //showMessage(angular.toJson(keepAccount.data));

    $scope.currentProgress = '';
    $scope.photoPathURL = baseConfig.appRootPath;


    /*是否隐藏 从记一笔创建 按钮的标识位 ,当来源为ACCOUNT 时表示从记一笔端进入，此时隐藏改按钮*/
    var sourceFrom = keepAccount.sourceFrom;
    if (sourceFrom == "ACCOUNT") {    //ACCOUNT  表示从记一笔进入
      if (keepAccount.canEdit == true) {
        $scope.title = '记一笔';
      }
      else {
        $scope.title = "记一笔"
      }
      //$scope.title="记一笔";
    } else {                        //EXPENSE 或其他  表示从报销单进入
      $scope.title = "报销明细";
    }

    if (sourceFrom == 1) {

    }
    /******
     *  照片响应
     */
    $scope.showPhoto = function () {
      $scope.valueChange();
      //globalNavigator.pushPage('html/acc/photos.html', { animation : 'slide' });

      $state.go('tab.acc_photos');
      //showMessage("t");
      //$state.go("tab.acc_photoDetail");

    };


    if (keepAccount.canEdit == true && keepAccount.boolLoadExpenseObject == true) {
      $ionicLoading.show({
        template: '下载基础后台数据 ... '
        //duration: 3000
      });

      /****************
       *  查看
       *
       */
      var promise = expenseObject.queryProjectList();
      promise.then(function (response) {

        //console.log(angular.toJson(response));
        //showMessage("status -" +response["status"]);


        if (response["status"] == "S") {

          keepAccount.boolLoadExpenseObject = false;
          // 清空 数据

          keepAccount.projectList = [];
          keepAccount.expenseItemList = [];
          keepAccount.expenseCostList = [];


          // 项目列表
          var proj_tmp = response["proj"];
          $.each(proj_tmp, function (i, value) {
            var item = {
              expenseObject_id: value.pj_id,
              expenseObject_code: value.pj_code,
              expenseObject_desc: value.pj_name,
              expenseObject_type: value.cost_type,
              //expenseItemList: value.expense,
              expenseItemList_index: i
            };


            // 如果 当前 费用对象 匹配  加载费用类型 列表
            if ($scope.accountDetail.expenseObject_id == item.expenseObject_id) {
              var promise = expenseObject.queryExpenseList(item.expenseObject_id, item.expenseObject_code);

              promise.then(function (response) {
                //console.log("接口返回数据+++：" + angular.toJson(response));
                // 费用类型
                var expenseItemList_tmp = response.expense;
                //console.log("=========: " + angular.toJson(expenseItemList_tmp));
                $.each(expenseItemList_tmp, function (i, value) {
                  var item = {
                    expense_item_code: value.exp_code,
                    expense_item_desc: value.exp_name,
                    expense_item_house: value.exp_house,
                    expense_item_index: i

                  };

                  // 租房
                  if ($scope.accountDetail.expense_item_code == item.expense_item_code) {

                    var expenseHouseList_tmp = item.expense_item_house;

                    $.each(expenseHouseList_tmp, function (i, value) {
                      var item = {
                        costObjectId: value.id,
                        desc: value.name

                      };

                      keepAccount.expenseCostList.push(item);

                    });


                    console.log("coutList -- " + angular.toJson(keepAccount.expenseCostList));
                  }

                  keepAccount.expenseItemList.push(item);

                });
              }, function (response) {
                //alert("网络连接错误,初始化数据 projectList");
                showMessage(response);
                $ionicLoading.hide();
                $ionicLoading.show({
                  template: '网络连接错误,初始化数据 ',
                  duration: 500
                });
              });
            }

            keepAccount.projectList.push(item);

          });

          //console.log( keepAccount.projectList);

          //$scope.projectList = keepAccount.projectList;
          //console.log( angular.toJson($scope.projectList));

          $ionicLoading.hide();

        } else {
          var errmsg = data["message"];
          $ionicLoading.hide();
          $ionicLoading.show({
            template: errmsg,
            duration: 1000
          });
        }


      }, function (response) {
        //alert("网络连接错误,初始化数据 projectList");

        dialog.showAlert("E", response);
        $ionicLoading.hide();
        $ionicLoading.show({
          template: '网络连接错误,初始化数据 ',
          duration: 1000
        });


      });
    }


    // */
    var EXPENSE_ITEM_CODE = {
      OfficeExpenses: '02',               // 办公费 02
      ElectricityGasWater: '04',               // 水电燃气费 04
      HouseRent: '14',               // 租房租金费用 14
      Telephone: '20',               //固定通讯费  20
      MiscellaneousAccommodation: '21',         //住宿杂项费 21
      LandlordDeposit: '45'         // 赔偿房东押金  45

    };
    // 是否 需要租房信息
// @return  true 需要租房申请  false： 不需要租房申请
    function isNeedHouseApply(expense_item_code) {
      var checkDataValid = false;
      ///*
      switch (expense_item_code) {
        case EXPENSE_ITEM_CODE.HouseRent:
          checkDataValid = true;
          break;
        case EXPENSE_ITEM_CODE.MiscellaneousAccommodation:
          checkDataValid = true;
          break;
        case EXPENSE_ITEM_CODE.ElectricityGasWater:
          checkDataValid = true;
          break;
        case EXPENSE_ITEM_CODE.Telephone:
          checkDataValid = true;
          break;
        case EXPENSE_ITEM_CODE.LandlordDeposit:
          checkDataValid = true;
          break;
        default :
          break;

      }

      // showMessage("是否需要 租房信息 －" + checkDataValid);

      console.log("是否需要 租房信息 －" + checkDataValid);
      //*/
      return checkDataValid;

    }

    /**
     * 保存数据至本地数据库
     * */
    $scope.saveData = function () {
      //showMessage($scope.accountDetail.photos[0].photo_src);

      var date_from = getFormatDate(new Date($scope.accountDetail.expense_date_from));
      var date_to = getFormatDate(new Date($scope.accountDetail.expense_date_to));


      //-------------------------------
      //          合法性 检验
      //-------------------------------
      var checkDataValid = true;
      var msg = "";
      if (date_from > date_to) {

        //showMessage("开始日期大于结束日期");
        //dialog.showAlert("I","开始日期大于结束日期");

        msg = msg + "开始日期大于结束日期";
        checkDataValid = false;
      }

      //"费用类型为水电燃气费是，没有判断租房信息必须输入
      //（此5项费用类型都需要判断租房信息必须输入：租房租金费用、住宿杂项费、固定通讯费、水电燃气费、赔偿房东押金）"


      if ($scope.accountDetail.costObject_id == '' || $scope.accountDetail.costObject_id == undefined ||
        $scope.accountDetail.costObject_id == null) {

        var code = isNeedHouseApply($scope.accountDetail.expense_item_code);

        //showMessage("租房 必输检查"+ code);
        //dialog.showAlert("I","租房 必输检查"+ code);


        // 判断 是否 需要 租房申请的5类费用 之中
        if (code == true) {
          checkDataValid = false;

          //dialog.showAlert("I","租房信息 不能为空");

          msg = msg + " 租房信息 不能为空";


        }

      }


      if (checkDataValid == false) {

        dialog.showAlert("I", msg);

        /*
         $ionicLoading.show({
         template: '数据不合法，请修改后重试 ',
         duration: 1000
         });
         */

        //showMessage("租房信息 不能为空");
        //checkDataValid = false;
      }
      else {


        $ionicLoading.show({
          template: '数据保存中 ... '
        });


        var sum = 0;

        console.log(keepAccount.operation);
        if (keepAccount.operation == "INSERT") {

          //showMessage("准备插入2");

          sum = ($scope.accountDetail.expense_price * $scope.accountDetail.expense_quantity * $scope.accountDetail.exchange_rate).toFixed(2);


          $scope.accountDetail.total_amount = sum == NaN ? 0 : sum;
          $scope.accountDetail.local_status = "NEW";

          keepAccount.data = $scope.accountDetail;

          var promise = keepAccount.insert();
          promise.then(
            function (lineID) {
              console.log("保存成功--line_id:" + lineID);
              dialog.showAlert("I", "新建成功");

              keepAccount.data.line_id = lineID;
              keepAccount.operation = "UPDATE";
              keepAccount.canUpload = true;
              $scope.canUpload = true;
              $ionicLoading.hide();
            },
            function (err) {
              $ionicLoading.hide();

              showMessage(err);
            }
          )
        } else if (keepAccount.operation == "UPDATE") {
          console.log("update");

          sum = ($scope.accountDetail.expense_price * $scope.accountDetail.expense_quantity * $scope.accountDetail.exchange_rate).toFixed(2);
          $scope.accountDetail.total_amount = sum == NaN ? 0 : sum;
          $scope.accountDetail.local_status = "NEW";
          keepAccount.data = $scope.accountDetail;
          var promise = keepAccount.update();
          promise.then(
            function (lineID) {
              showMessage("更新成功--line_id:" + keepAccount.data.line_id + ' return ' + lineID);
              dialog.showAlert("I", "更新成功");
              //keepAccount.data.line_id=lineID;
              keepAccount.operation = "UPDATE";
              keepAccount.canUpload = true;
              $scope.canUpload = true;
              $ionicLoading.hide();
              $ionicHistory.goBack();
            },
            function (err) {
              $ionicLoading.hide();

              showMessage(err);

              dialog.showAlert("E", "更新失败" + err);

            }
          )
        }
      }
    };

    // 判断是否可删除
    $scope.canToRemove = function () {
      /*
       if (loanApply.data.status ==  'NEW' ||  loanApply.data.status == 'REJECTED') {
       return true;
       }else {
       return false;
       }
       */
      //return (loanApply.data.status ==  'NEW' ||  loanApply.data.status == 'REJECTED');
      return (keepAccount.data.local_status == 'NEW' );

    };

    // 删除记一笔
    $scope.removeData = function () {
      var promise = keepAccount.remove(keepAccount.data.line_id);
      promise.then(
        function (response) {  // 调用承诺API获取数据 .resolve

          //  showMessage("数据删除成功");
          dialog.showAlert("I", "数据删除成功");


          removePhotoFiles();

          //var pages = globalNavigator.getPages();
          //console.log(pages);
          //pages[pages.length - 1].destroy();
          //pages[pages.length - 1].destroy();
          //globalNavigator.pushPage(moduleHtmlPath.ACC+'accountList.html', { animation : 'slide' } );

          //loanApply.applyList = response.body.tempRecord;
          //$scope.expenseList=response.body.list;

        },
        function (err) {  // 处理错误 .reject
          //showMessage("删除失败...."+angular.toJson(err));
          dialog.showAlert("E", "删除失败...." + angular.toJson(err));

        }
      )
    };


    /**********

     上传数据
     *************/
    $scope.uploadDataTest = function () {

      //showMessage("上传成功");
      // /*

      $ionicLoading.show({
        template: '数据检验...'
        //duration: 1000
      });

      //-------------------------------
      //          合法性 检验
      //-------------------------------
      var checkDataValid = true;


      if (keepAccount.data.costObject_id == '' || keepAccount.data.costObject_id == undefined ||
        keepAccount.data.costObject_id == null) {


        //showMessage("合法性检验");
        checkDataValid = keepAccount.checkCostObject(
          keepAccount.data.expenseObject_type,
          keepAccount.data.expense_item_code,
          keepAccount.data.total_amount
        );

      }
      if (checkDataValid == false) {

        $ionicLoading.hide();
        $ionicLoading.show({
          template: '预报销申请不能为空...',
          duration: 1000
        });

      }
      else {
        $ionicLoading.show({
          template: '上传数据中...'
          //duration: 1000
        });
        uploadDataUnit();

      }

      //showUploadProgress("准备上传:");


      //*/
    };
    function fillNumberBySize(num, size) {

      if (size != undefined || size > 0) {
        if (Math.pow(10, size - 1) > num) {
          var res = "000000000" + num;
          return res.substr(res.length - size);
        }
      }

      return "" + num;

    }

    function uploadDataUnit() {

      var form = new FormData();

      var myDate = new Date();

      var month = fillNumberBySize(myDate.getMonth() + 1, 2);
      var date = fillNumberBySize(myDate.getDate(), 2);
      var hours = fillNumberBySize(myDate.getHours(), 2);
      var minutes = fillNumberBySize(myDate.getMinutes(), 2);
      var seconds = fillNumberBySize(myDate.getSeconds(), 2);
      var milliseconds = fillNumberBySize(myDate.getMilliseconds(), 3);


      var expense_detail_id = window.localStorage.empno + myDate.getFullYear()
        + month + date + hours + minutes + seconds + milliseconds;

      //var expense_detail_id_copy = myDate.toLocaleString();        //获取日期与时间


      console.log('expense_detail_id' + expense_detail_id);

      //console.log(expense_detail_id+" - "+expense_detail_id_copy);

      form.append("expense_detail_id", expense_detail_id);
      //form.expense_detail_id = expense_detail_id;
      /*
       form.append("line_id",keepAccount.data.line_id);
       form.append("expense_type_id",keepAccount.data.expense_type_id);
       form.append("expense_type_desc",keepAccount.data.expense_type_desc);
       form.append("expense_item_id",keepAccount.data.expense_item_id);
       form.append("expense_item_desc",keepAccount.data.expense_item_desc);
       form.append("expense_price",keepAccount.data.expense_price);
       form.append("expense_quantity",keepAccount.data.expense_quantity);
       form.append("currency_code",keepAccount.data.currency_code);
       form.append("currency_code_desc",keepAccount.data.currency_code_desc);
       form.append("exchange_rate",keepAccount.data.exchange_rate);
       form.append("total_amount",keepAccount.data.total_amount);
       //        form.append("expense_date_from", keepAccount.data.expense_date_from);
       //        form.append("expense_date_to",keepAccount.data.expense_date_to);
       form.append("expense_date_from", getFormatDate(new Date(keepAccount.data.expense_date_from))); //getFormatDate(new Date(this.data.expense_date_from)) getFormatDate(new Date())
       form.append("expense_date_to",getFormatDate(new Date(keepAccount.data.expense_date_to)));    //getFormatDate(new Date(this.data.expense_date_from))
       form.append("expense_place",keepAccount.data.expense_place);
       form.append("description",keepAccount.data.description);
       form.append("created_by",keepAccount.data.created_by);

       */


      //showMessage("将执行上传:"+angular.toJson(form));
      //showUploadProgress("执行上传中，上传时长与附件数量有关");
      //uploadProgressModal.show();
      var Photos = keepAccount.data.photos;
      //var promise= keepAccount.uploadData(form,Photos);
      //var promise= keepAccount.uploadDataByJosn(keepAccount.data);
      var promise = keepAccount.uploadDataV2(form, Photos);

      promise.then(
        function (response) {
          //var code=getResponseCode(response);
          console.log(angular.toJson(response));
          var code = response.head.code;
          if (code == "success") {
            //接受返回参数
            //keepAccount.data.expenseDetailId=response.body.expenseDetailId;

            // 开始 上传数据

            var upload_option = {
              source_code: "HIH_PIC_UPLOAD",
              source_line_id: expense_detail_id

            };

            var p2 = keepAccount.uploadDataByJosn(keepAccount.data, upload_option);
            p2.then(
              function (res) {

                var code = res.status;
                if (code == "S") {

                  // $ionicLoading.hide();
                  console.log("上传成功 数据" + angular.toJson(res));


                  keepAccount.data.local_status = "UPLOADED";
                  $scope.accountDetail = keepAccount.data;
                  keepAccount.canEdit = false;
                  $scope.canEdit = false;
                  //更新本地数据库，修改local_status
                  var p = keepAccount.updateLocalStatus(keepAccount.data.line_id, "UPLOADED");
                  p.then(
                    function (res) {

                      $ionicLoading.hide();
                      showMessage("上传成功" + angular.toJson(res));

                      dialog.showAlert("I", "上传成功");


                      //若此时的sourceFrom 为报销单，将keepAccount.data 的数据赋值给 expenseApply.data.lines ,完成值传递
                      if (sourceFrom == "EXPENSE") {
                        var line = {
                          appSourceId: keepAccount.data.expenseDetailId,
                          price: keepAccount.data.expense_price,
                          quantity: keepAccount.data.expense_quantity,
                          expenseTypeId: keepAccount.data.expense_type_id,
                          expenseTypeName: keepAccount.data.expense_type_desc,
                          expenseItemId: keepAccount.data.expense_item_id,
                          expenseItemName: keepAccount.data.expense_item_desc,
                          place: keepAccount.data.expense_place,
                          dateFrom: keepAccount.data.expense_date_from,
                          dateTo: keepAccount.data.expense_date_to,
                          originalCurrency: keepAccount.data.currency_code,
                          exchangeRate: keepAccount.data.exchange_rate,
                          description: keepAccount.data.description
                        };
                        expenseApply.data.lines.push(line);
                        //globalNavigator.popPage();

                        $ionicHistory.goBack();
                      }
                    },
                    function (e) {
                      $ionicLoading.hide();

                      dialog.showAlert("E", "上传失败" + angular.toJson(e));

                      showMessage(angular.toJson(e));
                    }
                  );

                }
                else {
                  showMessage("上传失败 数据" + angular.toJson(res));
                  dialog.showAlert("E", "上传失败 数据" + angular.toJson(e));


                }


                /**

                 //若此时的sourceFrom 为报销单，将keepAccount.data 的数据赋值给 expenseApply.data.lines ,完成值传递
                 if(sourceFrom=="EXPENSE"){
                                    var line={
                                        appSourceId:keepAccount.data.expenseDetailId,
                                        price:keepAccount.data.expense_price,
                                        quantity:keepAccount.data.expense_quantity,
                                        expenseTypeId:keepAccount.data.expense_type_id,
                                        expenseTypeName:keepAccount.data.expense_type_desc,
                                        expenseItemId:keepAccount.data.expense_item_id,
                                        expenseItemName:keepAccount.data.expense_item_desc,
                                        place:keepAccount.data.expense_place,
                                        dateFrom:keepAccount.data.expense_date_from,
                                        dateTo:keepAccount.data.expense_date_to,
                                        originalCurrency:keepAccount.data.currency_code,
                                        exchangeRate:keepAccount.data.exchange_rate,
                                        description:keepAccount.data.description
                                    };
                                    expenseApply.data.lines.push(line);
                                    //globalNavigator.popPage();

                                    $ionicHistory.goBack();
                                }

                 */
              },
              function (e) {
                $ionicLoading.hide();

                dialog.showAlert("E", "上传失败" + angular.toJson(e));

                showMessage(angular.toJson(e));
              }
            );


          } else if (code == "E") {
            $ionicLoading.hide();
            dialog.showAlert("E", "上传失败" + angular.toJson(response));

            showMessage("查询失败:" + angular.toJson(response))
          }
          else {
            $ionicLoading.hide();
            dialog.showAlert("E", "获取信息错误" + angular.toJson(response));

            showMessage("未知错误:" + angular.toJson(response));
          }


        },
        function (err) {  // 处理错误 .reject

          $ionicLoading.hide();
          dialog.showAlert("E", "网络连接错误...." + angular.toJson(err));

          showMessage("网络连接错误...." + angular.toJson(err));
          //uploadProgressModal.hide();

        });  // end of 上传

    }


    /***********
     *  通过 合法性检验后  上传 数据
     *
     */

    /*******
     function uploadDataUnit (){


            var form=new FormData();
            form.append("line_id",keepAccount.data.line_id);
            form.append("expense_type_id",keepAccount.data.expense_type_id);
            form.append("expense_type_desc",keepAccount.data.expense_type_desc);
            form.append("expense_item_id",keepAccount.data.expense_item_id);
            form.append("expense_item_desc",keepAccount.data.expense_item_desc);
            form.append("expense_price",keepAccount.data.expense_price);
            form.append("expense_quantity",keepAccount.data.expense_quantity);
            form.append("currency_code",keepAccount.data.currency_code);
            form.append("currency_code_desc",keepAccount.data.currency_code_desc);
            form.append("exchange_rate",keepAccount.data.exchange_rate);
            form.append("total_amount",keepAccount.data.total_amount);
            //        form.append("expense_date_from", keepAccount.data.expense_date_from);
            //        form.append("expense_date_to",keepAccount.data.expense_date_to);
            form.append("expense_date_from", getFormatDate(new Date(keepAccount.data.expense_date_from))); //getFormatDate(new Date(this.data.expense_date_from)) getFormatDate(new Date())
            form.append("expense_date_to",getFormatDate(new Date(keepAccount.data.expense_date_to)));    //getFormatDate(new Date(this.data.expense_date_from))
            form.append("expense_place",keepAccount.data.expense_place);
            form.append("description",keepAccount.data.description);
            form.append("created_by",keepAccount.data.created_by);




            //showMessage("将执行上传:"+angular.toJson(form));
            //showUploadProgress("执行上传中，上传时长与附件数量有关");
            //uploadProgressModal.show();
            var Photos=keepAccount.data.photos;
            //var promise= keepAccount.uploadData(form,Photos);
            var promise= keepAccount.uploadDataByJosn(keepAccount.data);
            promise.then(
                function(response) {
                    //var code=getResponseCode(response);
                    var code = response.status;
                    if(code=="S"){
                        //接受返回参数
                        //keepAccount.data.expenseDetailId=response.body.expenseDetailId;
                        keepAccount.data.local_status="UPLOADED";
                        $scope.accountDetail=keepAccount.data;
                        keepAccount.canEdit=false;
                        $scope.canEdit=false;
                        //更新本地数据库，修改local_status
                        var p=keepAccount.updateLocalStatus(keepAccount.data.line_id,"UPLOADED");
                        p .then(
                            function(res){

                                $ionicLoading.hide();
                                showMessage("上传成功"+angular.toJson(res));

                                //若此时的sourceFrom 为报销单，将keepAccount.data 的数据赋值给 expenseApply.data.lines ,完成值传递
                                if(sourceFrom=="EXPENSE"){
                                    var line={
                                        appSourceId:keepAccount.data.expenseDetailId,
                                        price:keepAccount.data.expense_price,
                                        quantity:keepAccount.data.expense_quantity,
                                        expenseTypeId:keepAccount.data.expense_type_id,
                                        expenseTypeName:keepAccount.data.expense_type_desc,
                                        expenseItemId:keepAccount.data.expense_item_id,
                                        expenseItemName:keepAccount.data.expense_item_desc,
                                        place:keepAccount.data.expense_place,
                                        dateFrom:keepAccount.data.expense_date_from,
                                        dateTo:keepAccount.data.expense_date_to,
                                        originalCurrency:keepAccount.data.currency_code,
                                        exchangeRate:keepAccount.data.exchange_rate,
                                        description:keepAccount.data.description
                                    };
                                    expenseApply.data.lines.push(line);
                                    //globalNavigator.popPage();

                                    $ionicHistory.goBack();
                                }
                            },
                            function(e){
                                $ionicLoading.hide();


                                showMessage(angular.toJson(e));
                            }
                        );

                    }else if(code=="E"){
                        $ionicLoading.hide();

                        showMessage("查询失败:"+angular.toJson(response))
                    }
                    else{
                        $ionicLoading.hide();

                        showMessage("未知错误:"+angular.toJson(response));
                    }


                },
                function(err) {  // 处理错误 .reject

                    $ionicLoading.hide();

                    showMessage("网络连接错误...."+angular.toJson(err));
                    uploadProgressModal.hide();

                });
        }
     */

    /*上传数据*/
    $scope.uploadData = function () {

      showMessage("上传成功");
      /*
       showUploadProgress("准备上传:");

       var form=new FormData();
       form.append("line_id",keepAccount.data.line_id);
       form.append("expense_type_id",keepAccount.data.expense_type_id);
       form.append("expense_type_desc",keepAccount.data.expense_type_desc);
       form.append("expense_item_id",keepAccount.data.expense_item_id);
       form.append("expense_item_desc",keepAccount.data.expense_item_desc);
       form.append("expense_price",keepAccount.data.expense_price);
       form.append("expense_quantity",keepAccount.data.expense_quantity);
       form.append("currency_code",keepAccount.data.currency_code);
       form.append("currency_code_desc",keepAccount.data.currency_code_desc);
       form.append("exchange_rate",keepAccount.data.exchange_rate);
       form.append("total_amount",keepAccount.data.total_amount);
       //        form.append("expense_date_from", keepAccount.data.expense_date_from);
       //        form.append("expense_date_to",keepAccount.data.expense_date_to);
       form.append("expense_date_from", getFormatDate(new Date(keepAccount.data.expense_date_from))); //getFormatDate(new Date(this.data.expense_date_from)) getFormatDate(new Date())
       form.append("expense_date_to",getFormatDate(new Date(keepAccount.data.expense_date_to)));    //getFormatDate(new Date(this.data.expense_date_from))
       form.append("expense_place",keepAccount.data.expense_place);
       form.append("description",keepAccount.data.description);
       form.append("created_by",keepAccount.data.created_by);




       //showMessage("将执行上传:"+angular.toJson(form));
       showUploadProgress("执行上传中，上传时长与附件数量有关");
       uploadProgressModal.show();
       var Photos=keepAccount.data.photos;
       var promise= keepAccount.uploadData(form,Photos);
       promise.then(
       function(response) {
       var code=getResponseCode(response);
       if(code=="ok"){
       //接受返回参数
       keepAccount.data.expenseDetailId=response.body.expenseDetailId;
       keepAccount.data.local_status="UPLOADED";
       $scope.accountDetail=keepAccount.data;
       keepAccount.canEdit=false;
       $scope.canEdit=false;
       //更新本地数据库，修改local_status
       var p=keepAccount.updateLocalStatus(keepAccount.data.line_id,"UPLOADED");
       p .then(
       function(res){
       showMessage("上传成功"+angular.toJson(res));

       //若此时的sourceFrom 为报销单，将keepAccount.data 的数据赋值给 expenseApply.data.lines ,完成值传递
       if(sourceFrom=="EXPENSE"){
       var line={
       appSourceId:keepAccount.data.expenseDetailId,
       price:keepAccount.data.expense_price,
       quantity:keepAccount.data.expense_quantity,
       expenseTypeId:keepAccount.data.expense_type_id,
       expenseTypeName:keepAccount.data.expense_type_desc,
       expenseItemId:keepAccount.data.expense_item_id,
       expenseItemName:keepAccount.data.expense_item_desc,
       place:keepAccount.data.expense_place,
       dateFrom:keepAccount.data.expense_date_from,
       dateTo:keepAccount.data.expense_date_to,
       originalCurrency:keepAccount.data.currency_code,
       exchangeRate:keepAccount.data.exchange_rate,
       description:keepAccount.data.description
       };
       expenseApply.data.lines.push(line);
       globalNavigator.popPage();
       }
       },
       function(e){


       showMessage(angular.toJson(e));
       }
       );

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
       uploadProgressModal.hide();

       });

       */
    };


    $scope.openCurrencyList = function () {

      /*
       keepAccount.sourceFrom='acc';
       if($scope.canEdit){
       $scope.valueChange();
       //globalNavigator.pushPage('html/acc/currencyList.html', { animation : 'slide' });
       $state.go("tab.acc_currencyList");
       }
       */
    };

    $scope.openExpenseTypeList = function () {
      if ($scope.canEdit) {
        $scope.valueChange();
        //globalNavigator.pushPage('html/exp/expenseTypeList.html', { animation : 'slide' });
        $state.go("tab.exp_expenseTypeList");

      }
    };

    $scope.openExpenseItemList = function () {
      if ($scope.canEdit) {
        $scope.valueChange();
        //globalNavigator.pushPage('html/exp/expenseItemList.html', { animation : 'slide' });
        $state.go("tab.exp_expenseItemList");

      }
    };

    $scope.openExpenseObjectList = function () {
      if ($scope.canEdit) {
        $scope.valueChange();
        //globalNavigator.pushPage('html/exp/expenseItemList.html', { animation : 'slide' });
        $state.go("tab.acc_expenseObjectList");

      }
    };

    $scope.openCostObjectList = function () {
      if ($scope.canEdit) {
        $scope.valueChange();
        //globalNavigator.pushPage('html/exp/expenseItemList.html', { animation : 'slide' });
        $state.go("tab.cst_costObjectList");

      }
    };


    $scope.valueChange = function () {
      keepAccount.canUpload = false;
      $scope.canUpload = false;
    };


    //以插件的形式来 充当时间控件，   添加crosswalk  的webview后被弃用
    $scope.selectDate = function (field) {
      var options = {
        date: new Date(),
        mode: 'date'
      };
      datePicker.show(options, function (date) {
        showMessage(date);
        if (date != undefined) {
          if (field == "date_from") {
            $scope.accountDetail.expense_date_from = getFormatDate(date);
          } else if (field == "date_to") {
            $scope.accountDetail.expense_date_to = getFormatDate(date);
          }
        } else {
          if (field == "date_from") {
            $scope.accountDetail.expense_date_from = '';
          } else if (field == "date_to") {
            $scope.accountDetail.expense_date_to = '';
          }
        }
        $scope.$apply();
      });
    };

    function showUploadProgress(msg) {
      //console.log($scope.currentProgress);
      $scope.currentProgress = msg;
      //console.log($scope.currentProgress);

    }

    // 删除照片
    function removePhotoFiles() {
      //showMessage("删除照片操作 begin");

      window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, onError);
    }

    function onSuccess(fileSystem) {
      console.log(fileSystem.name);
      showMessage(fileSystem.name);

      //showMessage(keepAccount.tempPhoto.photo_src);
      var myFolderApp = baseConfig.appRootFile;


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
        dialog.showAlert("I", "图片删除成功");

        deferred.resolve(lineID);
      }
      //showMessage(myFolderApp+'/'+keepAccount.tempPhoto.photo_name);
      //fileSystem.root.getFile(myFolderApp+'/'+data.photo[this.tempDeleteIndex].photo_name, null, onGetFileSuccess, onGetFileError);
    }

    function onError(error) {
      dialog.showAlert("E", "图片删除出错");

      showMessage(error.code);
    }

    function onGetFileSuccess(fileEntry) {
      console.log("File Name: " + fileEntry.name);
      //showMessage("File Name: " + fileEntry.name);

      // remove the file
      fileEntry.remove(onRemoveSuccess, onRemoveFail);

    }

    function onGetFileError(error) {
      dialog.showAlert("E", "图片删除出错");

      showMessage("Failed to retrieve file: " + error.code);
    }

    function onRemoveSuccess(entry) {
      console.log("Removal succeeded");
      showMessage("Removal succeeded");
      //showMessage(keepAccount.tempPhotoIndex);
      showMessage(angular.toJson(keepAccount.data.photos));

      keepAccount.data.photos.splice(keepAccount.tempPhotoIndex, 1);
      //showMessage( 'photos list:'+angular.toJson(keepAccount.data.photos));


      /*
       var pages = globalNavigator.getPages();
       //console.log(pages);
       pages[pages.length - 1].destroy();
       pages[pages.length - 1].destroy();
       globalNavigator.pushPage('html/acc/photos.html', { animation : 'slide' });
       */

    }

    function onRemoveFail(error) {
      showMessage('Error removing file: ' + error.code);
      dialog.showAlert("E", "图片删除出错");

    }
  });
