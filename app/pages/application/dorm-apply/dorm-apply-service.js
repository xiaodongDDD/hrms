/**
 * Created by LeonChan on 2016/6/3.
 */
angular.module('applicationModule')
.factory('dormApplyTypeService',function(){//查看历史宿舍申请的时候，从住宿申请向住宿详情发送申请类型的数据
  var info='';
  return{
    getInfo:function(){
      return info;
    },
    putInfo:function(param){
      info=param;
    }
  }
})
