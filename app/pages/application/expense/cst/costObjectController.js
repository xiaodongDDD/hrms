
angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.cst_costObjectList', {
          url: '/expense/cst/costObjectList',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/cst/costObjectList.html',
              controller: 'costObjectController'
            }
          }
        });
    }]);


angular.module("applicationModule")
    .controller('costObjectController', function($scope,expenseObject,$ionicHistory,keepAccount, $q, $ionicLoading, baseConfig) {
        function queryCostObjectList(){
            $ionicLoading.show({
                template: 'Loading...',
                duration: 1000
            });
            var deferred = $q.defer();

            /**
            $http.get(baseConfig.basePath+"EXP/expenseItemList.svc?expenseTypeId="+expenseTypeId,{cache:false}).
                success(function(response, status, headers, config) {
                    deferred.resolve(response);
                }).
                error(function(error, status, headers, config) {
                    deferred.reject(error);
                });


             **/

                /*
                var response = {
                        costObjectList:[
                            {
                                "costObjectId": 41,
                                "costObjectNO": "CST001",
                                "desc": '描述 1'
                            },
                            {
                                "costObjectId": 42,
                                "costObjectNO": "CST0012",
                                "desc":"描述 2"
                            }
                            ]

                };
                */
            var response = keepAccount.expenseCostList;

            deferred.resolve(response);


            return deferred.promise;
        }

        var promise=queryCostObjectList();
        promise.then(
            function(response) {

                $scope.costObjectList=response;


                /***
                var code=getResponseCode(response);
                if(code=="ok"){
                    $scope.costObjectList=response.body.costObjectList;

                    $ionicLoading.hide();
                }
                else if (code =="login_required"){
                    //showMessage("登录状态异常\n"+angular.toJson(response));
                    //reLogin();


                }
                else if(code=="failure"){
                    showMessage("查询失败:"+angular.toJson(response));
                }else{
                    showMessage("未知错误:"+angular.toJson(response));
                }

                 */
            },
            function(err) {  // 处理错误 .reject
                showMessage("网络连接错误...."+angular.toJson(err));
            });

        $scope.selectCostObject=function(e){

            //showMessage("选择了费用申请");

            /*
            var target= e.target;
            var costObjectId=target.getAttribute('costObjectId');
            var costObjectDesc=target.getAttribute('costObjectDesc');
            //var expenseItemName=target.getAttribute('expenseItemName');

            */
            keepAccount.data.costObject_id=keepAccount.expenseCostList[e].costObjectId;
            keepAccount.data.costObject_desc=keepAccount.expenseCostList[e].desc;

            console.log('id - '+  keepAccount.data.costObject_id  );
            console.log('id - '+ keepAccount.data.costObject_desc);
            //expenseApply.tempLine.expenseItemId=expenseItemId;
            //expenseApply.tempLine.expenseItemName=expenseItemName;
            //globalNavigator.popPage();
            //$ionicNavBarDelegate.back();
            $ionicHistory.goBack();

        };

        //$rootScope.hideTabs = true;
    });