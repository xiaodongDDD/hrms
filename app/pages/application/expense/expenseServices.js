function showMessage(msg) {
  //navigator.notification.alert('未知错误 saveData', function(){}, '提示', '确定');
  //alert(msg);
}
function getFormatDate(date) {
  var seperator1 = "-";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  return date.getFullYear() + seperator1 + month + seperator1 + strDate;
}
/*对话框service*/
angular.module("applicationModule")
    .factory('dialog', function ( $ionicPopup, baseConfig) {
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
    .factory('expenseObject', function ($http,$q, $ionicLoading, baseConfig,hmsHttp) {
    var service= {
        businessType:'',
        objectType:'',
        queryUnitList: function (){
            var deferred = $q.defer();
          hmsHttp.get(baseConfig.basePath+"TRP/TRP1130/app_unit_list.svc?companyId=2",{cache:false}).
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
            var Url = baseConfig.businessPath + "fetch_expense_proj";
            var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '"}}';

          hmsHttp.post(Url,PostData).success(function (data){
                deferred.resolve(data);
            }).error(function(data) {
                deferred.reject(data);
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

            var Url = baseConfig.businessPath + "fetch_expense_types";
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
