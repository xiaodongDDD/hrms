/**
 * Created by Administrator on 15-5-15.
 */

appModuleExpense.controller('checkAttachmentController', function($scope,expenseApply) {

    $scope.tempAttachment=expenseApply.tempAttachment;

    $scope.back=function(){
        globalNavigator.popPage();
    };

    $scope.testFunction=function(){

        alert("11111");
    };

    // 删除照片
    $scope.deleteAttachment=function() {
        showMessage("删除照片操作");
    };

});
