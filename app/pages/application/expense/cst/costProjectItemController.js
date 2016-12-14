angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) {
      $stateProvider
        .state('tab.cst_costProjectItemList', {
          url: '/expense/cst/costProjectItemList',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/cst/costProjectItemList.html',
              controller: 'costProjectItemController'
            }
          }
        });
    }]);


angular.module("applicationModule")
    .controller('costProjectItemController', function($scope,$http,$q, costApply,$ionicHistory,$ionicLoading, baseConfig,hmsHttp) {


    $ionicLoading.show({
        template: "Loading...",
        duration: 1000
    });


    function queryProjectItemList(){

        var deferred = $q.defer();

        //deferred.resolve(keepAccount.expenseItemList);

        var Url = baseConfig.businessPath + "get_project_list";
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

    var promise=queryProjectItemList();
    promise.then(
        function(response) {
            var detailData = [];
            var code = response.status;
            if (code == "S") {

                var proj_tmp = response["project_list"];
                $.each(proj_tmp, function (i, value) {
                    var item = {
                        project_id : value.project_id,
                        project_code:value.project_code,
                        project_name:value.project_name

                    };

                    detailData.push(item);

                });

                //console.log( keepAccount.projectList);

                //$scope.projectList = keepAccount.projectList;
                $scope.costProjectItenList = detailData;
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

    $scope.selectCostProjectItem=function(e){
        var target= e.target;
        // var expenseItemId=target.getAttribute('expenseItemId');
        var costProjectId       =   target.getAttribute('costProjectId');
        var costProjectName     =   target.getAttribute('costProjectName');
        var costProjectCode     =   target.getAttribute('costProjectCode');


        //keepAccount.data.expense_item_id=expenseItemId;
        costApply.data.cost_project_id  = costProjectId;
        costApply.data.cost_project_code  = costProjectCode;

        costApply.data.cost_project_name = costProjectName;

        //expenseApply.tempLine.expenseItemId=expenseItemId;
        //expenseApply.tempLine.expenseItemName=expenseItemName;



        //globalNavigator.popPage();
        //$ionicNavBarDelegate.back();
        $ionicHistory.goBack();

    };

});


