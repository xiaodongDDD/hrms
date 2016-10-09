
######相关支持
·目前微信分享的安全码和APPID用的是汉得的，iOS 版 QQ 分享也已修改为 HRMS，其余请按需修改
·其它APP使用本插件，请修改WXEntryActivity.java中的包名为你APP的包名，并修改plugin.xml该文件的对应位置

######注意
iOS 上使用微信分享要注意图片大小，最终图片大小需要在 10K 以下，插件内已实现了压缩的算法。

一、Android
1.在安装插件之前将申请的各平台的appid等信息写入配置文件中

####sre/android/lib/youtui_sdk.xml
填写对应信息即可

2.修改plugin.xml
<source-file src="src/android/WXEntryActivity.java" target-dir="src/com/tworld/app/store/OnlineOffice4Phone/wxapi"/>
的target-dir为 android包名/wxapi

3.注意安卓签名

3.使用cordova build android命令会出现问题，可以使用cordova prepare android命令之后导入到eclipse里面进行打包和测试。

二、ios
1.在安装插件之前将申请的各平台appid等信息写入配置文件

###1.src/ios/PrefixHeader.pch

//友推AppKey

```
#define YOUTUIAPPKEY @"846491"        
#define YOUTUIAPPSECRET @"1f960c8e3c5ee1e"
#define AppUserID [YouTuiSDK GetImei]  //开发者需要自己定义识别用户的ID
```

//腾讯微博

```
#define TCWBAppKey @"801539039"
#define TCWBAppSecret @"113db01894f131b9710337bd051ebe7c"
#define TCWBURI @"http://youtui.mobi/"
```

//新浪

```
#define SinaWBAppKey @"2444270328"
#define SinaWBURI @"http://youtui.mobi/weiboResponse"
```

//微信

```
#define WXAppKey @"wx9b22d040f715ba8b"
#define WXAppSecret @"bf0ed46a704bb95e6ad2bde9f27397a4"
```
//QQ

```
#define QQAppID @"1105645417"
#define QQURI @"http://youtui.mobi"
```
//人人

```
#define RennAPPID @"244110"
#define RennAPIKEY @"b1a80ac1aa694090bfb9aa3a590f2161"
#define RennSecretKey @"506ccdbda36046d197801e79c4ebba23"
```

配置各申请的appid和SecretKey

###2.添加完毕平台后在工程Info标签下设置URL Types
直接将各平台的appid填入URL Schemes内


三、调用
```
function share(){
    var youtuiShare = window.plugins.youtuiShare;
    if (youtuiShare !== undefined) {
        youtuiShare.share(success, fail, 
            youtuiShare.share(success, fail, [
                '分享',   //标题
                'www.baidu.com', //链接
                '分享测试描述', //描述
                'http://g.hiphotos.baidu.com/image/pic/item/0b55b319ebc4b7451d871f77cdfc1e178a8215bb.jpg'  //图片
            ]);
        );
    }
    function success(success) {
        if(success.code=='0'){
            //分享成功
        }    
    }
    function fail(error) {
        if(error.code=='-1'){
            //分享失败
        }else if(error.code=='-2'){
            //用户取消
        }
    }
}
```





