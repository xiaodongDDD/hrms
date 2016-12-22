###语音识别插件

##插件方法说明：

>   插件提供两个方法，startRecorerRecognize和stopRecorderRecognize，这两个方法的作用分别是开始语音识别和结束语音识别，  
>   startRecorerRecognize方法必须调用，如果没有调用stopRecorderRecognize方法，sdk会检测没说话后1秒结束语音识别，调用  
>   stopRecorderRecognize方法提结束语音识别（非必须调用方法）
>   下面分别介绍这两个方法


### startRecorerRecognize方法

	  startRecorerRecognize(successCallback,errorCallback)
	
* successCallback  成功时的回调
* errorCallback 失败时的回调  返回失败的原因（没有说话，授权失败）

###调用示例：
	    <Button onclick="cordova.plugins.pluginIflytek.startRecorerRecognize(
            function(msg){
             alert(msg);
            },function(msg){
             alert(msg);
         })">开始识别</button>



### stopRecorderRecognize方法

	stopRecorderRecognize(successCallback,errorCallback)
	
* successCallback  成功时的回调
* errorCallback 失败时的回调  返回失败的原因

###调用示例：
	        <Button onclick="cordova.plugins.pluginIflytek.stopRecorderRecognize(
            function(msg){
             alert(msg);
            },function(msg){
             alert(msg);
         })">停止识别</button>

