/*对话框service*/
angular.module("applicationModule")
    .factory('dialog', function ( $ionicPopup) {
        var service= {

            // 一个提示对话框
            showAlert : function(type,msg) {
                var title = "";
                switch (type) {
                    case 'E':
                        title = "错误";
                        break;
                    case 'I':
                        title = "提示";
                        break;
                    default :
                        title = "提示";
                        break;

                }

                /***
                 *
                 * {
                      title: '', // String. The title of the popup.
                      subTitle: '', // String (optional). The sub-title of the popup.
                      template: '', // String (optional). The html template to place in the popup body.
                      templateUrl: '', // String (optional). The URL of an html template to place in the popup   body.
                      okText: '', // String (default: 'OK'). The text of the OK button.
                      okType: '', // String (default: 'button-positive'). The type of the OK button.
                    }
                 * ***/
                var alertPopup = $ionicPopup.alert({
                    title: title,
                    template: msg,
                    okText:"好的",
                    okType: 'button-light'
                });
                alertPopup.then(function(res) {
                    console.log("dialog: "+title+" - "+msg);
                });
            }

        };
        return service;
    });


/*结算对象service*/ 
angular.module("applicationModule")
    .factory('expenseObject', function ($http,$q, $ionicLoading) {
    var service= {
        businessType:'',
        objectType:'',
        queryUnitList: function (){
            var deferred = $q.defer();
            $http.get(rootConfig.basePath+"TRP/TRP1130/app_unit_list.svc?companyId=2",{cache:false}).
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

            var Url = window.localStorage.wsurl + "/expense_account/fetch_expense_proj";
            var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '"}}';

            $http.post(Url,PostData).success(function (data){

                deferred.resolve(data);

            }).error(function(data) {
                deferred.reject(data);

                //$ionicLoading.hide();

            });

            /*
            $http.get(rootConfig.basePath+"TRP/TRP1130/app_project_list.svc?companyId=2",{cache:false}).
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

            var Url = window.localStorage.wsurl + "/expense_account/fetch_expense_types";
//            var PostData = '{"params":{"p_employee":"' + window.localStorage.empno +
//            '","p_project_code":' + projectCode +
//            '","p_project_id":' + projectId +'}}';
            var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_project_code":"' + projectCode +  '","p_project_id":"' + projectId +  '"}}';


            $http.post(Url,PostData).success(function (data){
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(data);

                //$ionicLoading.hide();

            });

            /*
            $http.get(rootConfig.basePath+"TRP/TRP1130/app_project_list.svc?companyId=2",{cache:false}).
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