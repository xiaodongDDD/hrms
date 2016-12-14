/*结算对象service*/
angular.module("applicationModule")
    .factory('expenseObject', function ($http,$q, $ionicLoading, baseConfig,hmsHttp) {
    var service= {
        businessType:'',
        objectType:'',
        queryUnitList: function (){
            var deferred = $q.defer();
          $http.get(baseConfig.basePath+"TRP/TRP1130/app_unit_list.svc?companyId=2",{cache:false}).
                success(function(response) {
                    deferred.resolve(response);
                }).
                error(function(response ) {
                    deferred.reject(response);
                });
            return deferred.promise;
        },
        queryProjectList:function (){
            //showMessage("查询项目列表");
            var deferred = $q.defer();

            var Url = baseConfig.businessPath + "/expense_account/fetch_expense_proj";
            var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '"}}';

          hmsHttp.post(Url,PostData).success(function (data){

                deferred.resolve(data);

            }).error(function(data) {
                deferred.reject(data);

                //$ionicLoading.hide();

            });

            /*
            $http.get(baseConfig.basePath+"TRP/TRP1130/app_project_list.svc?companyId=2",{cache:false}).
                success(function(response) {
                    deferred.resolve(response);
                }).
                error(function(response) {
                    deferred.reject(response);
                });

                */

            //deferred.resolve("ok");

            return deferred.promise;
        },
        queryExpenseList:function (projectId, projectCode){
            //showMessage("查询项目列表");
            var deferred = $q.defer();

            var Url = baseConfig.businessPath + "/expense_account/fetch_expense_types";
//            var PostData = '{"params":{"p_employee":"' + window.localStorage.empno +
//            '","p_project_code":' + projectCode +
//            '","p_project_id":' + projectId +'}}';
            var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_project_code":"' + projectCode +  '","p_project_id":"' + projectId +  '"}}';


          hmsHttp.post(Url,PostData).success(function (data){
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(data);

                //$ionicLoading.hide();

            });

            /*
            $http.get(baseConfig.basePath+"TRP/TRP1130/app_project_list.svc?companyId=2",{cache:false}).
                success(function(response) {
                    deferred.resolve(response);
                }).
                error(function(response) {
                    deferred.reject(response);
                });

                */

            //deferred.resolve("ok");

            return deferred.promise;
        }
    };
    return service;
});
