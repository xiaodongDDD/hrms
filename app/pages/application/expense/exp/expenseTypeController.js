// 报销
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.exp_expenseTypeList', {
          url: '/acc/expenseTypeList',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/exp/expenseTypeList.html',
              controller: 'expenseTypeController'
            }
          }
        });
    }]);
angular.module("applicationModule").controller('expenseTypeController', function($scope,$rootScope,keepAccount,expenseApply,$http,$q,$ionicHistory, baseConfig) {

    function queryExpenseTypeList(){
        var companyId=baseConfig.user.companyId;
        var deferred = $q.defer();

        /*
        $http.get(baseConfig.basePath+"EXP/expenseTypeList.svc?companyId="+companyId,{cache:false}).
            success(function(response, status, headers, config) {
                deferred.resolve(response);
            }).
            error(function(error, status, headers, config) {
                deferred.reject(error);
            });

        */
        $scope.expenseTypeList =
            [
                {
                    "expenseTypeId": 21,
                    "expenseTypeCode": "DAILY_MANAGEMENT",
                    "expenseTypeName": "日常管理",
                    "reimbursementTypeId": 21
                },
                {
                    "expenseTypeId": 22,
                    "expenseTypeCode": "PROJECT_IMPLEMENTATION",
                    "expenseTypeName": "项目实施",
                    "reimbursementTypeId": 21
                }
            ];
        return deferred.promise;
    }

    var promise=queryExpenseTypeList();
    promise.then(
        function(response) {
            var code=getResponseCode(response);
            if(code=="ok"){
                $scope.expenseTypeList=response.body.expenseTypeList;
            }
            else if (code =="login_required") {
                //showMessage("登录状态异常\n"+angular.toJson(response));
                //reLogin();}
                $scope.expenseTypeList =
                    [
                        {
                            "expenseTypeId": 21,
                            "expenseTypeCode": "DAILY_MANAGEMENT",
                            "expenseTypeName": "日常管理",
                            "reimbursementTypeId": 21
                        },
                        {
                            "expenseTypeId": 22,
                            "expenseTypeCode": "PROJECT_IMPLEMENTATION",
                            "expenseTypeName": "项目实施",
                            "reimbursementTypeId": 21
                        }
                    ];
            }
            else if(code=="failure"){
                showMessage("查询失败:"+angular.toJson(response))
            }else{
                showMessage("未知错误:"+angular.toJson(response));
            }
        },
        function(err) {  // 处理错误 .reject
            showMessage("网络连接错误...."+angular.toJson(err));
        });

    $scope.selectExpenseType=function(e){
        var target= e.target;
        var expenseTypeName=target.getAttribute('expenseTypeName');
        var expenseTypeId=target.getAttribute('expenseTypeId');
        var expenseTypeCode=target.getAttribute('expenseTypeCode');
        if(keepAccount.data.expense_type_id!=expenseTypeId){
            keepAccount.data.expense_item_id=null;
            keepAccount.data.expense_item_desc='';
            keepAccount.data.expense_type_id=expenseTypeId;
            keepAccount.data.expense_type_desc=expenseTypeName
        }
        expenseApply.tempLine.expenseTypeId=expenseTypeId;
        expenseApply.tempLine.expenseTypeName=expenseTypeName;

        //globalNavigator.popPage();
        //$ionicNavBarDelegate.back();
        $ionicHistory.goBack();
    };

   // $rootScope.hideTabs = true; // mod by ciwei
});
