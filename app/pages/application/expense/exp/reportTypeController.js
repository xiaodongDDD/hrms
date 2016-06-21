/**
 * Created by huchaoliang on 15-5-22.
 */

angular.module("applicationModule").controller('reportTypeController', function($scope,keepAccount,$http,$q,expenseApply,travelApply, baseConfig) {

    function queryReportTypeList(){
        var companyId=baseConfig.user.companyId;
        var deferred = $q.defer();
        $http.get(baseConfig.basePath+"EXP/reimbursementList.svc?companyId="+companyId,{cache:false}).
            success(function(response, status, headers, config) {
                deferred.resolve(response);
            }).
            error(function(error, status, headers, config) {
                deferred.reject(error);
            });
        return deferred.promise;
    }

    var promise=queryReportTypeList();
    promise.then(function(response){

        $scope.reportTypeList=[];

        var code=getResponseCode(response);
        if(code=="ok"){
            console.log(response);
            $scope.reportTypeList=response.body.reimbursementList;
        }else if(code=="failure"){
        }
        else if (code =="login_required"){
            showMessage("登录状态异常\n"+angular.toJson(response));
            reLogin();
        }else{
            showMessage("未知错误:"+angular.toJson(response));
        }
    },function(error){
        $scope.reportTypeList=[];

        alert("网络连接错误,初始化数据"+error.message);
    });

    $scope.selectReportType=function(e){
        var target= e.target;
        var reportTypeName=target.getAttribute('reportTypeName');
        var reportTypeId=target.getAttribute('reportTypeId');
        var reportTypeCode=target.getAttribute('reportTypeCode');
         console.log(reportTypeName);
      //  travelApply.data.expType="123";

        expenseApply.data.reportType=reportTypeId;
        expenseApply.data.reportTypeName=reportTypeName;

        console.log( expenseApply.data);

        globalNavigator.popPage();
    }
});
