angular.module('myApp')
  .config(['$stateProvider',
    function ($stateProvider) { 
      $stateProvider
        .state('tab.exp_expenseLines', {
          url: '/expenseLines',
          params: {},
          views: {
            'tab-application': {
              templateUrl: 'build/pages/application/expense/exp/expenseLines.html',
              controller: 'expenseLinesController'
            }
          }
        });
    }]);

angular.module("applicationModule")
    .controller('expenseLinesController', ['$scope','expenseApply','keepAccount','$ionicHistory',function($scope,expenseApply,keepAccount,$ionicHistory) {


    $scope.detailData=expenseApply.tempLine;

    $scope.canEdit=expenseApply.canEdit;
    $scope.local_status=expenseApply.local_status;
    //  $scope.sourceFrom="exp";
    console.log( $scope.detailData);
  // var canEdit=expenseApply.canEdit;
  /*  $scope.detailData.dateFrom=new Date( $scope.detailData.dateFrom);
    $scope.detailData.dateTo=new Date($scope.detailData.dateTo);*/
    $scope.openCurrencyList=function(e){
        /*var target= e.target;
        var currencyName=target.getAttribute('currencyName');
        var currencyCode=target.getAttribute('currencyCode');
        var exchangeRate=target.getAttribute('exchangeRate');*/
      /*expenseApply.tempLine.currencyName=currencyName;
        expenseApply.tempLine.currencyCode=currencyCode+"-"+currencyName;
        expenseApply.tempLine.exchangeRate=Number(exchangeRate);*/
       // expenseApply.tempLine.currency_code=currencyCode;
        //expenseApply.tempLine.currency_code_desc=currencyCode+"-"+currencyName;
       // expenseApply.tempLine.originalCurrency=currencyCode
         expenseApply.sourceFrom="EXP";
        if (expenseApply.canEditObjectType==true){

       globalNavigator.pushPage('html/acc/currencyList.html', { animation : 'slide' });
        }
    };
     $scope.valueChange=function(){
            expenseApply.canUpload=false;
            $scope.canUpload=false;
        };


    $scope.openExpenseTypeList=function(){
        if (expenseApply.canEditObjectType==true){
            globalNavigator.pushPage('html/exp/expenseTypeList.html', { animation : 'slide' });
        }

    };
    $scope.openExpenseItemList=function(){
        if (expenseApply.canEditObjectType==true){
            globalNavigator.pushPage('html/exp/expenseItemList.html', { animation : 'slide' });
        }
    };

    //
    $scope.canShow = function() {

        if($scope.detailData.price.toFixed(2)==null)
        {
            $scope.sum=0.00;
        }
        else{
          //  $scope.sum=($scope.detailData.price*$scope.detailData.quantity*$scope.detailData.exchangeRate).toFixed(2);
            $scope.sum=5;
        }

    };
    $scope.removeLine=function(){
        var index=$scope.detailData.index;
      //  console.log(index);
        expenseApply.data.lines.splice(index,1);
      //  expenseApply.removeLine(expenseApply.tempLine.expLineId);
        showMessage("删除成功");
        $ionicHistory.goBack();
    };
    $scope.confirmLine=function(){
        var index=$scope.detailData.index;
        if(index==-1){
            expenseApply.data.lines.push($scope.tempLine);
        }
        else{
            expenseApply.data.lines[index]=$scope.tempLine;
        }
        var date_from= getFormatDate(new Date($scope.detailData.dateFrom));
        var date_to= getFormatDate(new Date($scope.detailData.dateTo));
        if(date_from>date_to)
        {showMessage("开始日期大于结束日期");}
        else{
            globalNavigator.popPage();
        }
    };


  /*  $scope.removeLine=function(){
        var index=$scope.detailData.index;
        expenseApply.data.lines.splice(index,1);
        expenseApply.removeLine(expenseApply.tempLine.expLineId);
        showMessage("删除成功");
        globalNavigator.popPage();
    };*/


    $scope.openAttachment=function(){
        var LineId=$scope.detailData.expLineId;
        console.log(LineId);
        //globalNavigator.pushPage("html/exp/attachmentList.html");

        globalNavigator.pushPage("html/exp/attachmentList.html", { expLineId: LineId, param2: "value2" });
    }

}]);