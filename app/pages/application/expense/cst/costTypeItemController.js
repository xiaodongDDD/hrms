angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.cst_costTypeItemList', {
          url: '/expense/cst/costTypeItemList',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/cst/costTypeItemList.html',
              controller: 'costTypeItemController'
            }
          }
        });
    }]);


angular.module("applicationModule").controller('costTypeItemController', function($scope,$http,$q, costApply,$ionicHistory,$ionicLoading, baseConfig,hmsHttp) {


    $ionicLoading.show({
        template: "Loading...",
        duration: 1000
    });


    function queryItemList(){


        var deferred = $q.defer();

        //deferred.resolve(keepAccount.expenseItemList);

        var Url = baseConfig.businessPath + "/expenses_apply/get_typeitme_list";
        var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '"}}';

        console.log(PostData);
        //showMessage(PostData );
        hmsHttp.post(Url,PostData).success(function (data){

            showMessage(angular.toJson(data));
            deferred.resolve(data);

        }).error(function(data) {
            showMessage("error:"+angular.toJson(data));

            deferred.reject(data);

        });


        return deferred.promise;
    }

    var promise=queryItemList();
    promise.then(
        function(response) {
            var detailData = [];
            var code = response.status;
            if (code == "S") {

                var list_tmp = response["type_list"];
                $.each(list_tmp, function (i, value) {
                    var item = {
                        type_id : value.type_id,
                        type_code:value.type_code,
                        type_name:value.type_name


                    };

                    detailData.push(item);

                });

                //showMessage(angular.toJson(detailData));

                //console.log( keepAccount.projectList);

                //$scope.projectList = keepAccount.projectList;
                $scope.itemList = detailData;
                //showMessage(angular.toJson($scope.itemList));

            }
            else {
                showMessage("error :"+angular.toJson(response));
            }

            //console.log(angular.toJson($scope.expenseItemList));

            //console.log(angular.toJson(keepAccount.expenseItemList));

            $ionicLoading.hide();

        },
        function(err) {  // 处理错误 .reject
            showMessage("网络连接错误...."+angular.toJson(err));

        });

    $scope.selectCostItem=function(e){
        var target= e.target;
        // var expenseItemId=target.getAttribute('expenseItemId');
        var itemId       =   target.getAttribute('itemId');
        var itemCode     =   target.getAttribute('itemCode');
        var itemName     =   target.getAttribute('itemName');


        //keepAccount.data.expense_item_id=expenseItemId;
        costApply.data.cost_type_id  = itemId;
        costApply.data.cost_type_code = itemCode;
        costApply.data.cost_type_name = itemName;

        //expenseApply.tempLine.expenseItemId=expenseItemId;
        //expenseApply.tempLine.expenseItemName=expenseItemName;



        //globalNavigator.popPage();
        //$ionicNavBarDelegate.back();
        $ionicHistory.goBack();

    };

});
