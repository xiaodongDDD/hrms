/**
 * Created by huchaoliang on 15-6-8.
 */

appModuleExpense.controller('interfaceReportListController', function($scope,keepAccount,$http,$q,expenseApply,dialog,$state,$ionicHistory,$ionicLoading) {
    var Item = [];
    $scope.detailData=expenseApply.data;
    //console.log( $scope.detailData.expenseObject_id);
    console.log(expenseApply.data.expenseObject_id);
    $scope.selectedLineId=expenseApply.selectedLineId;
    console.log(111);
    console.log( $scope.selectedLineId);
    //console.log("$scope.selectedLinedId+++++: " + angular.toJson($scope.selectedLineId));
    console.log(222);
   // console.log(expenseApply.projectList);
    $ionicLoading.show({
        template: "Loading..."
    });
    function interfaceReportList(){
        var deferred = $q.defer();
        var expenseObject_id= expenseApply.data.expenseObject_id;
        var Url = window.localStorage.wsurl + "/expense_account/fetch_exp_details";
        var PostData = '{"params":{"p_employee":"' + window.localStorage.empno + '","p_project_id":"' + expenseObject_id + '"}}';
        $http.post(Url,PostData).success(function (response){
            console.log(response);
            //console.log("接口返回数据： " + angular.toJson(response));
            deferred.resolve(response);

        }).error(function(err) {

                deferred.reject(err);
            });
        return deferred.promise;
    }
    var promise=interfaceReportList();
    promise.then(function(response){
        if(response["status"] == "S")
      {
          var interfaceReportList = response["detail"];
          $.each(interfaceReportList, function (n, value) {
              var item = {
                  dateFrom : value.date_from,
                  dateTo   : value.date_to,
                  place    : value.place,
                  memo    : value.desc,
                  amount :value.amt,
                  expObject_desc:value.exp_item,
                  lineId:value.expense_detail_id,
                  original_currency:value.original_currency,
                  exchange_rate:value.exchange_rate,
                  attach_number:value.attach_number,
                  rentals_infor:value.rentals_infor,
                  quantity:value.qty,
                  price:value.price
          };
             /* for(var i=0;i<$scope.selectedLineId.length;i++)
              {
                  if($scope.selectedLineId[i]!==item.lineId)


              }*/
             // Item.push(item);
              console.log(Item);
              //console.log("Item++++: " + angular.toJson(Item));
              if(contains( $scope.selectedLineId,item.lineId))
              {
                console.log(456);
              }
              else{
                  Item.push(item);
                  console.log(789);
              }
          });
          $scope.interfaceReportList=Item;
          $ionicLoading.hide();
      }
        else{
           // showMessage("未知错误:"+angular.toJson(response));
            dialog.showAlert("E","获取信息错误");
            $ionicLoading.hide();
        }

    },function(error){
       // showMessage("网络连接错误...."+angular.toJson(error));
        dialog.showAlert("E","网络连接错误");
        $ionicLoading.hide();
    });

    function contains(a, obj) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] === obj) {
                return true;
            }
        }

        return false;
    }


    $scope.confirmAccounts=function(){
        var selectedAccounts=getSelected();
        console.log(selectedAccounts);


          for(var i=0;i<selectedAccounts.length;i++){

              selectedAccounts[i].dateFrom= selectedAccounts[i].dateFrom.toString();
              selectedAccounts[i].dateTo= selectedAccounts[i].dateTo.toString();
              expenseApply.data.lines.push(selectedAccounts[i]);

              expenseApply.selectedLineId.push(selectedAccounts[i].lineId);

            //  expenseApply.dateFmtForUI();
          }
        console.log(4444);
        console.log( expenseApply.selectedLineId);
        console.log(5555);
        expenseApply.data.sum=0;
        for(var i=0;i<expenseApply.data.lines.length;i++){
            expenseApply.data.sum+=expenseApply.data.lines[i].amount;
        }
       // console.log(expenseApply.data.sum);
        $ionicHistory.goBack();
        //$state.go('tab.expenseLines_expenseDetail');


    };

        function getSelected(){
            var accountList=$scope.interfaceReportList;
            var selectedList=[];

            console.log(accountList);

            for(var i=0;i<accountList.length;i++){
                //alert(accountList[i].Selected==undefined || accountList[i].Selected=="NO");

                if(!(accountList[i].Selected==undefined || accountList[i].Selected=="NO")){
                   // showMessage(accountList[i].Selected);
                    selectedList.push(accountList[i]);
                    //从记一笔列表中删除已选行项目
                   // $scope.interfaceReportList.splice(i,1);
                }
            }
            return selectedList;
        }


    });
