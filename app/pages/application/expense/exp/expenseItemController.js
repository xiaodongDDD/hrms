/**
 * Created by huchaoliagn on 15-5-22.
 * modified by wuxiaocheng on 15-8-27
 */
appModuleExpense.controller('expenseItemController', function ($scope, $rootScope, keepAccount, expenseApply, $http, $q, $ionicHistory, $ionicLoading) {

  $ionicLoading.show({
    template: "Loading...",
    duration: 1000
  });

  function queryExpenseItemList() {
    var expenseTypeId = keepAccount.data.expense_type_id;
    var deferred = $q.defer();
    deferred.resolve(keepAccount.expenseItemList);
    return deferred.promise;
  }

  var promise = queryExpenseItemList();
  promise.then(
    function (response) {
      $scope.expenseItemList = response;
      console.log(angular.toJson(keepAccount.expenseItemList));
      $ionicLoading.hide();
    },
    function (err) {  // 处理错误 .reject
      //showMessage("网络连接错误...."+angular.toJson(err));
    });

  $scope.selectExpenseItem = function (e) {
    var target = e.target;
    // var expenseItemId=target.getAttribute('expenseItemId');
    var expenseItemCode = target.getAttribute('expenseItemCode');
    var expenseItemName = target.getAttribute('expenseItemName');
    var expenseItemIndex = target.getAttribute('expenseItemIndex');

    //keepAccount.data.expense_item_id=expenseItemId;
    keepAccount.data.expense_item_code = expenseItemCode;
    keepAccount.data.expense_item_desc = expenseItemName;

    // 清空 费用申请
    keepAccount.data.costObject_id = "";
    keepAccount.data.costObject_desc = "";

    keepAccount.expenseCostList = [];

    var expenseHouseList_tmp = keepAccount.expenseItemList[expenseItemIndex].expense_item_house;

    $.each(expenseHouseList_tmp, function (i, value) {
      var item = {
        costObjectId: value.id,
        desc: value.name
      };
      keepAccount.expenseCostList.push(item);
    });

    console.log("coutList -- " + angular.toJson(keepAccount.expenseCostList));

    $ionicHistory.goBack();
  };

  //$rootScope.hideTabs = true;// mod by ciwei
});

