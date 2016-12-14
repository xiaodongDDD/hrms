/* 借款服务 */
angular.module("applicationModule").factory('costApply', function ($http, $q, baseConfig,hmsHttp) {
    var service= {
        data:{},
        canEdit:'',
        canSubmit:'',
        tempFlight:{airportFlag:''},
        objectType:"",
        currentQueryType:"",
        canEditObjectType:true,
        currentQueryTypeDesc:'',

        currentListStatusType:'',

        queryDetail: function (costApplyId) {
            //请求服务器，查询操作
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行

            console.log("query detail: "+costApplyId);

            /*
            //$http.get(baseConfig.basePath+"EXP/EXP5020/exp_payment_requisition_query.svc?paymentRequisitionId="+paymentRequisitionId,{cache:false}).
            $http.get(baseConfig.basePath+"EXP/EXP5020/exp_payment_requisition_query.svc?paymentRequisitionId="+paymentRequisitionId,{cache:false}).

                success(function(response, status, headers, config) {
                    console.log(response);
                    //this.applyList = response.body;
                    deferred.resolve(response);  // 声明执行成功，即http请求数据成功，可以返回数据了
                }).
                error(function(response, status, headers, config) {
                    console.log(response);
                    deferred.reject(response);   // 声明执行失败，即服务器返回错误
                });

                */

            this.data = {
                costApplyId : '11',
                costApplyNO : "CST00X",
                status: 'submitted',
                statusNmae:'已提交',
                amount: 123
            };

            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
        },

        queryList:function (){
            var userId      =baseConfig.user.userId;
            var companyId   =baseConfig.user.companyId;
            var deferred = $q.defer();
          hmsHttp.get(baseConfig.basePath+'/EXP/EXP5020/exp_payment_requisition_list.svc?userId='+userId+'&companyId='+companyId,{cache:false}).
                success(function(response, status, headers, config) {
                    console.log(response);
                    deferred.resolve(response);
                }).
                error(function(response, status, headers, config) {
                    console.log(response);
                    deferred.reject(response);
                });
            return deferred.promise;
        },



        getData:function(){
            return this.data;
        },

        getDataList:function(){
            return this.applyList;
        },

        // 删除 add by wuxiaocheng
        remove:function(paymentRequisitionId) {
            var dataPara = {
                paymentRequisitionId: paymentRequisitionId
            };
            var deferred = $q.defer();
            $http({
                method :'POST',
                url:baseConfig.basePath+"EXP/EXP5020/app_payment_requisition_delete.svc",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest:function(data) {

                    return  'para='+JSON.stringify(data);
                },
                data:dataPara
            })
                .success(function (response) {
                    console.log("response:" +  "成功返回"+angular.toJson(response));
                    deferred.resolve(response);
                })
                .error(function (err) {
                    console.log( "失败返回:"+angular.toJson(err));
                    deferred.reject(err);
                });
            return deferred.promise;
        },

        save:function() {
            //请求数据库服务器，进行存储操作


            //showMessage("提交数据");
            console.log(angular.toJson(this.data));

            console.log("参数准备");
            var Url = baseConfig.businessPath + "create_expense_apply";

            this.data.cost_date=getFormatDate(new Date(this.data.cost_date));
            if (this.data.cost_amount == null) {
                showMessage("金额 null 转 空");
                this.data.cost_amount = "";
            }

            // 参数次序 固定 不可 更换位置 否则 会出错
            var PostData = '{"params":{"p_employee":"' + window.localStorage.empno
                + '","p_location":"' + this.data.cost_place
                + '","p_apply_type_code":"' + this.data.cost_type_code
                + '","p_project_code":"' + this.data.cost_project_code
                + '","p_apply_money":"' + this.data.cost_amount
                + '","p_reason":"' + this.data.description
                + '","p_apply_id":"' + this.data.cost_apply_id+ '"}}';


            console.log(PostData);

            var deferred = $q.defer();
          hmsHttp.post(Url,PostData)
                .success(function (data){

                    showMessage(angular.toJson(data));
                    console.log(angular.toJson(data));
                    deferred.resolve(data);

                })
                .error(function(data) {
                    showMessage("error:"+angular.toJson(data));
                    console.log(angular.toJson(data));

                    deferred.reject(data);

                    //$ionicLoading.hide();

                });
            return deferred.promise;
        },

        submit:function() {
            //请求数据库服务器，进行存储操作


            showMessage("提交数据");
            console.log(angular.toJson(this.data));

            console.log("参数准备");
            var Url = baseConfig.businessPath + "submit_expense_apply";



            this.data.cost_date=getFormatDate(new Date(this.data.cost_date));


            // 参数次序 固定 不可 更换位置 否则 会出错
            var PostData = '{"params":{"p_employee":"' + window.localStorage.empno
                + '","p_apply_id":"' + this.data.cost_apply_id+ '"}}';


            console.log(PostData);

            var deferred = $q.defer();
          hmsHttp.post(Url,PostData)
                .success(function (data){

                    showMessage(angular.toJson(data));
                    console.log(angular.toJson(data));

                    deferred.resolve(data);

                })
                .error(function(data) {
                    showMessage("error:"+angular.toJson(data));
                    console.log(angular.toJson(data));


                    deferred.reject(data);

                    //$ionicLoading.hide();

                });
            return deferred.promise;
        },

        initData:function(){

            this.data = {
                cost_apply_id           : '',
                cost_project_id         : '',
                cost_project_name       : '',
                cost_type_id            : '',
                cost_type_code          : '',
                cost_type_name          : '',
                cost_amount             : '',
                cost_date               : '',
                cost_place              : '',
                cost_subject_code       : '',
                cost_full_name          : '',
                description             :''

            }

        },
        addData:function(record){
            this.data.push(record);
        }


    };

    return service;
});
