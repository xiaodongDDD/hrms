#插件功能，扫描名片

###使用说明


##打开相机拍名片

	scanCard.takePicturefun(success,error)

* 参数说明

	>success 成功回调 成功返回名片识别结果
	
	>error 失败回调

* 调用示例

	    <Button onclick="scanCard.takePicturefun(
            function(msg){
             alert(msg);
            },function(msg){
             alert(msg);
         })">takePicturefun</button>



###通过相册选择相片识别
	
	scanCard.choosePicturefun(success,error)

* 参数说明

	>success 成功回调 成功返回名片识别结果
	
	>error 失败回调

* 调用示例

	    <Button onclick="scanCard.choosePicturefun(
            function(msg){
             alert(msg);
            },function(msg){
             alert(msg);
         })">choosePicturefun</button>