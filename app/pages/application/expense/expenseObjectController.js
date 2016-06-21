/**
 * Created by wuxiaocheng on 15/8/27.
 */
angular.module("applicationModule")
    .controller('expenseObjectController', function($scope,expenseObject,expenseApply,$ionicHistory,keepAccount, $ionicLoading ) {
        $scope.businessType=expenseObject.businessType;
        $scope.objectType=expenseObject.objectType;
        $ionicLoading.show({
            template: "下载项目信息..."
            //duration: 3000
        });

        $scope.objectType = "PRJ";
        //businessType = 'ACC';
        if($scope.objectType=="UNIT"){
            $scope.title="选择部门";
            console.log(expenseObject);
            var promise=expenseObject.queryUnitList();
            promise.then(function(response) {
                var code=getResponseCode(response);
                if(code=="ok"){

                }else if(code=="failure"){
                }
                else if (code =="login_required"){
                    showMessage("登录状态异常\n"+angular.toJson(response));
                    reLogin();
                }else{
                    showMessage("未知错误:"+angular.toJson(response));
                }
                $scope.unitList=response.body.unitList;
            }, function(response) {
                alert("网络连接错误,初始化数据 unitList");
            });
        }else if($scope.objectType=="PRJ") {
            $scope.title = "选择项目";
            console.log(expenseObject);
            var promise = expenseObject.queryProjectList();
            promise.then(function (response) {

                console.log(angular.toJson(response));

                if(response["status"] == "S") {



                    keepAccount.projectList = [];
                    var proj_tmp = response["proj"];
                    $.each(proj_tmp, function (i, value) {
                        var item = {
                            expenseObject_id : value.pj_id,
                            expenseObject_code:value.pj_code,
                            expenseObject_desc : value.pj_name,
                            expenseObject_type : value.cost_type,
//                            expenseItemList: value.expense,
                            expenseItemList_index:i
                        };

                        //expenseObject.projectList.push(item);

                        keepAccount.projectList.push(item);
                        //expenseApply.projectList.push(item);

                    });

                    //console.log( keepAccount.projectList);

                    $scope.projectList = keepAccount.projectList;
                    //console.log( angular.toJson($scope.projectList));

                    $ionicLoading.hide();

                } else {
                    var errmsg = angular.toJson(response);
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        template: errmsg,
                        duration: 1000
                    });
                }

                $ionicLoading.hide();


                /*
                 $scope.projectList=[
                 {
                 "projectId": 12,
                 "projectCode": "PRJ0001",
                 "projectName": "XXX公司人力资源管理系统实施项目",
                 "enabledFlag": "Y",
                 "companyId": 2
                 },
                 {
                 "projectId": 23,
                 "projectCode": "PRJ0004",
                 "projectName": "外包",
                 "enabledFlag": "Y",
                 "companyId": 2
                 },
                 {
                 "projectId": 13,
                 "projectCode": "PRJ0002",
                 "projectName": "XXX公司财务管理系统实施项目",
                 "enabledFlag": "Y",
                 "companyId": 2
                 },
                 {
                 "projectId": 14,
                 "projectCode": "PRJ0003",
                 "projectName": "XXX公司财务共享实施项目",
                 "enabledFlag": "Y",
                 "companyId": 2
                 }
                 ];
                 */


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




        $scope.selectExpenseObject=function (e){
            var target= e.target;
            var expenseObject_id=target.getAttribute('expenseObject_id');
            var expenseObject_code=target.getAttribute('expenseObject_code');
            var expenseObject_desc=target.getAttribute('expenseObject_desc');
            var expenseObject_type=target.getAttribute('expenseObject_type');

            var expenseItemList_index=target.getAttribute('expenseItemList_index');
            /*
             if(businessType=="TRP"){
             travelApply.data.objectType=$scope.objectType;
             travelApply.data.expenseObject=expenseObject;
             travelApply.data.expenseObjectName=expenseObjectName;
             }
             else if(businessType == 'CSH') {
             console.log("CSH ...");

             loanApply.data.objectType=$scope.objectType;
             loanApply.data.expenseObject=expenseObject;
             loanApply.data.expenseObjectName=expenseObjectName;
             }
             else if(businessType == 'EXP') {
             console.log("EXP ...");
             console.log( expenseApply.data);
             expenseApply.data.objectType=$scope.objectType;
             expenseApply.data.expenseObject=expenseObject;
             expenseApply.data.expenseObjectName=expenseObjectName;
             // console.log(            expenseApply.data.expenseObjectName );
             }
             else
             */

            //showMessage($scope.businessType);
            if ($scope.businessType == 'ACC') {
                console.log("ACC ...");
                //console.log( keepAccount.data);

                if(expenseObject_id == '0' || expenseObject_id =='-1') {

                }
                else {
                    keepAccount.data.objectType=$scope.objectType;
                    keepAccount.data.expenseObject_id=expenseObject_id;
                    keepAccount.data.expenseObject_code=expenseObject_code;
                    keepAccount.data.expenseObject_desc=expenseObject_desc;
                    keepAccount.data.expenseObject_type=expenseObject_type;




                    keepAccount.data.expense_item_code="";
                    keepAccount.data.expense_item_desc="";

                    keepAccount.data.costObject_id  = "";
                    keepAccount.data.costObject_desc= "";
                    keepAccount.expenseItemList = [];
                    keepAccount.expenseCostList = [];

//                    console.log(expenseObject_id);
                    console.log("get the objectId = "+expenseObject_id+" get the objectCode = "+expenseObject_code);
                    var promise=expenseObject.queryExpenseList(expenseObject_id, expenseObject_code);
                    
                    promise.then(function (response) {

                        console.log(response);
                        if(response["status"] == "S") {
                            var expenseItemList_tmp = response["expense"];
                            $.each(expenseItemList_tmp, function (i, value) {
                                var item = {
                                   expense_item_code : value.exp_code,
                                   expense_item_desc:value.exp_name,
                                   expense_item_house:value.exp_house,
                                   expense_item_index:i
                                };
                                keepAccount.expenseItemList.push(item);
                            });
                        }
                    }, function (response) {
                        //alert("网络连接错误,初始化数据 projectList");
                        showMessage(response);
                        $ionicLoading.hide();
                        $ionicLoading.show({
                            template: '网络连接错误,初始化数据 ',
                            duration: 500
                        });
                    });
                    

                    //keepAccount.expenseItemList = keepAccount.projectList[expenseItemList_index].expenseItemList;

                    //console.log(angular.toJson(keepAccount.expenseItemList));

                }


            }
            else if ($scope.businessType == 'EXP') {

                expenseApply.data.expenseObject_desc=expenseObject_desc;
                expenseApply.data.expenseObject_id=expenseObject_id;

            }
            else{
                console.log('程序错误 expenseObjectController line23');
            }

            $ionicHistory.goBack();

            //globalNavigator.popPage();

        }

    });