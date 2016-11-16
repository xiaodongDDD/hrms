#日历插件

>方法 openCalendar(successCallBack, errorCallBack, type)

##参数说明

* 参数successCallBack  成功时的回调
* 参数errorCallBack  失败时的回调
* 参数type 传2选择单个日期，传1返回一个日期期间

##返回值
###当type传入值为2的时候直接返回一个字符串 如：2016-07-20
###当type传入值为1的时候返回一个日期期间，但是时一个json串 如：{"result":["2016-07-20","2016-07-26"]}

#插件调用方式
  <button onclick="HmsCalendar.openCalendar(
    				function(msg){
    					alert(msg);
    					},
    					function(msg){
    					alert(msg);
    					},2)">chooseSingle</button>
    	<button onclick="HmsCalendar.openCalendar(
    				function(msg){
    					alert(msg);
    					},
    					function(msg){
    					alert(msg);
    					},1)">chooseRange</button>
