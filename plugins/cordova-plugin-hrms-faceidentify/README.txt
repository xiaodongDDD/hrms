###人脸识别插件

##插件方法说明：

>   插件目前提供两个方法，faceDetect 和 getLocalImage，这两个方法的作用分别是 “人脸识别” 和 “获取本地图片”，  



### faceDetect方法

	faceDetect(successCallback,errorCallback)
	
* successCallback  成功时的回调,返回检测信息json

#pragma mark - 人脸检测返回数据示例
返回的数据是个JSon对象
    {
        age = 32;                   //识别年龄
        beauty = 72;                //魅力值
        expression = 14;            //表情值
        "face_id" = 1831653390825881599; //faceid
        gender = 99;                //性别 0(女)~100(男)，越靠近100越有可能为男性
        glass = 1;                  //是否戴眼镜
        height = 232;               //人脸框 高度
        imgPath = "/private/var/mobile/Containers/Data/Application/89F513B4-B1DD-497E-8DEE-09162B469C6F/tmp/1481783049.894455";     //人脸本地存储路径
        pitch = "-3";               //上下偏移[-30,30]
        roll = "-2";                //平面旋转[-180,180]
        width = 232;                //人脸框 高度
        x = 104;                    //人脸框左上角x
        y = 218;                    //人脸框左上角y
        yaw = 2;                    //左右偏移[-30,30]
    }

* errorCallback 失败时的回调  （没有检测到）

### getLocalImage 方法
    getLocalImage（successCallback,errorCallback,arg）
successCallback 成功回调方法，会返回一个base64图片字符串
arg 为调用faceDetect方法返回的本地图片路径。
