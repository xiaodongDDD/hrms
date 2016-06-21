/**
 * Created by wuxiaocheng on 15/8/26.
 */
appModuleExpense
    .controller('currencyController', function($scope,$rootScope,keepAccount,expenseApply,$http,$q,$ionicHistory) {

    function queryCurrencyList(){
        var companyId=rootConfig.user.companyId;
        var deferred = $q.defer();


        /*
        $http.get(rootConfig.basePath+"EXP/currencyList.svc?companyId="+companyId,{cache:false}).
            success(function(response, status, headers, config) {

                //showMessage('test');
                deferred.resolve(response);
            }).
            error(function(error, status, headers, config) {
                deferred.reject(error);
            });

            */

        $scope.currencyList = [
            {
                "currencyName": "人民币",
                "currencyCode": "CNY",
                "exchangeRate": 1
            },
            {
                "currencyName": "欧元",
                "currencyCode": "EUR",
                "exchangeRate": 1
            },
            {
                "currencyName": "美元",
                "currencyCode": "USD",
                "exchangeRate": 1
            },
            {
                "currencyName": "港币",
                "currencyCode": "HKD",
                "exchangeRate": 1
            }
        ];
        deferred.resolve("ok");


        return deferred.promise;
    }

    var promise=queryCurrencyList();
    promise.then(
        function(response) {
            var code=getResponseCode(response);
            if(code=="ok"){
                $scope.currencyList=response.body.currencyList;
            }else if(code=="failure"){
                showMessage("查询失败:"+angular.toJson(response))
            }
            else if (code =="login_required"){
                console.log(angular.toJson(response));
                //showMessage("登录状态异常\n"+angular.toJson(response));

                $scope.currencyList = [
                    {
                        "currencyName": "人民币",
                        "currencyCode": "CNY",
                        "exchangeRate": 1
                    },
                    {
                        "currencyName": "欧元",
                        "currencyCode": "EUR",
                        "exchangeRate": 1
                    },
                    {
                        "currencyName": "美元",
                        "currencyCode": "USD",
                        "exchangeRate": 1
                    },
                    {
                        "currencyName": "港币",
                        "currencyCode": "HKD",
                        "exchangeRate": 1
                    }
                ];

                //reLogin();
            }else{
                showMessage("未知错误:"+angular.toJson(response));
            }
        },
        function(err) {  // 处理错误 .reject
            //showMessage("网络连接错误...."+angular.toJson(err));
            $scope.currencyList = [
                {
                    "currencyName": "人民币",
                    "currencyCode": "CNY",
                    "exchangeRate": 1
                },
                {
                    "currencyName": "欧元",
                    "currencyCode": "EUR",
                    "exchangeRate": 1
                },
                {
                    "currencyName": "美元",
                    "currencyCode": "USD",
                    "exchangeRate": 1
                },
                {
                    "currencyName": "港币",
                    "currencyCode": "HKD",
                    "exchangeRate": 1
                }
            ];

        });

    $scope.selectCurrency=function(e){
        var target= e.target;
        var currencyName=target.getAttribute('currencyName');
        var currencyCode=target.getAttribute('currencyCode');
        var exchangeRate=target.getAttribute('exchangeRate');
        if(keepAccount.sourceFrom=='acc')
        {
        keepAccount.data.currency_code=currencyCode;
        keepAccount.data.currency_code_desc=currencyCode+"-"+currencyName;
        keepAccount.data.exchange_rate=Number(exchangeRate);
        }
        if(expenseApply.sourceFrom=='EXP'){
        expenseApply.tempLine.originalCurrency=currencyCode;
        expenseApply.tempLine.exchangeRate=Number(exchangeRate);
        }
        //expenseApply.tempLine.expenseTypeName=expenseTypeName;

        //$ionicNavBarDelegate.back();
        //globalNavigator.popPage();
        $ionicHistory.goBack();
    };

   // $rootScope.hideTabs = true; // mod by ciwei
});
