# HRMSv2研发项目

一个基于 ionic v1 + angular v2 的 Hybrid app环境

>建议: 推荐 Cordova 5.4.1以及以上 + gulp + bower

# 环境搭建

```
# 下载源代码
$ git clone http://hpm.hand-china.com/diffusion/HRMSTWO/hrms.git

# 切换到根目录
$ cd hrms

# 切换到develop 分支下载最新代码
$ git checkout develop

# 安装gulp构建环境
$ npm install

# 安装js依赖库
$ bower install

# 构建测试环境开发目录
$ gulp run-dev

# 浏览器运行app程序
$ ionic serve
```

# Git 操作规范
```
st=>start: 开始
e=>end: 结束
clone=>operation: git clone url
pullA=>operation: git pull origin develop:develop
checkoutA=>operation: git checkout -b feature/A
code=>operation: 编写代码/修改代码
add=>operation: git add
commit=>operation: git commit
checkoutB=>operation: git checkout develop
pullB=>operation: git pull origin develop:develop
merge=>operation: git merge feature/A
conflict=>operation: 如果有冲突，解决冲突
push=>operation: git push origin develop:develop

st->clone->pullA->checkoutA->code->add->commit->checkoutB->pullB->merge->conflict->push->e
```

# IDE
WebStorm
Android Studio
Xcode


# 开发规范
```
<<<<<<< .merge_file_a09992
*所有文件名，文件夹都以中划线分隔 ,全部小写 比如 contact-us
*html 尽量不要有style=“”
*javascript代码变量第二个单词首字母大写  比如 timeOffManagment
*javascript代码字符串定义用单引号  比如 var target=''
*angular的对象里面不要使用闭包
*angular的controller和service 用注入的时候，都要进行申明，目的是为了压缩混淆，如 angular.modal.controller('TabCtrl’,[‘$scope’,function($scope){}]);
*尽量谨慎使用$rootScope.$broadcast  因为$rootScope 不会在controller销毁的时候被回收
*scss的规范写法
=======
1.所有文件名，文件夹都以中划线分隔 ,全部小写 比如 contact-us
2.html 尽量不要有style=“”
3.javascript代码变量第二个单词首字母大写  比如 timeOffManagment
4.javascript代码字符串定义用单引号  比如 var target=''
5.angular的对象里面不要使用闭包
6.angular的controller和service 用注入的时候，都要进行申明，目的是为了压缩混淆，如 angular.modal.controller('TabCtrl’,[‘$scope’,function($scope){}]);
6.尽量谨慎使用$rootScope.$broadcast  因为$rootScope 不会在controller销毁的时候被回收
7.scss的规范写法
>>>>>>> .merge_file_a07708
   approve-list {
     ##
     .approve-item{
     ##
     }
   }
<<<<<<< .merge_file_a09992
*代码里面一定要有注释
*angularJS项目 逻辑功能不要全部写在controller里面，因该写在service里面
*在一个controller 里面，变量都在最上面，函数在下面，因为js执行的时候，他也会自动先去执行变量的定义
```


# 打包步骤
打包环境
检查是否有gulp npm node ionic bower
Android测试环境
确认cordova版本最好是6.3.1,jdk一定要1.7以上,Android SDK一定要API23以上
```
1.修改app/config/devConfig.json  里面
1.真机打包,修改app/config/devConfig.json  里面  isMobilePlatform  nativeScreenFlag 设置为true
2.gulp run-dev
3.测试环境打包 
  iOS版本 Android 打包 通用插件下载
  
  cordova plugin rm phonegap-plugin-barcodescanner
  cordova plugin add http://hpm.hand-china.com/diffusion/PHONEGAPPLUGINBARCODESCANNER/phonegap-plugin-barcodescanner.git
  
  cordova plugin rm com.hand.scancard
  cordova plugin add http://hpm.hand-china.com/diffusion/SCANCARD/cordova-plugin-scancard.git
  
  cordova plugin rm cordova-plugin-hrms-faceidentify
  cordova plugin add http://hpm.hand-china.com/diffusion/FACEIDENTIFY/cordova-plugin-hrms-faceidentify.git
  
  cordova plugin rm com.handmobile.cordovaplugin.hotpatch
  cordova plugin add http://hpm.hand-china.com/diffusion/CORDOVAPLUGINHOTPATCH/
  
  cordova plugin rm hand-im-plugin-device
  cordova plugin add http://hpm.hand-china.com/diffusion/HANDIM/hand-im-plugin-device.git  --variable RONG_KEY=0vnjpoadnd4cz
  
  cordova plugin rm cn.jpush.phonegap.JPushPlugin
  cordova plugin add jpush-phonegap-plugin@2.2.0 --variable API_KEY=6e0b08078306f45ac8331d54
  
  cordova plugin rm cordova-plugin-youtuishare
  cordova plugin add http://hpm.hand-china.com/diffusion/YOUTUISHARE/cordova-plugin-youtuishare.git
  
  cordova plugin rm cordova-plugin-baidu-geolocation
  cordova plugin rm cordova-plugin-geolocation-baidu
  
  cordova plugin add https://github.com/ETENG-OSP/cordova-plugin-baidu-geolocation.git --variable API_KEY=5WXxKpATT2RsEaYyVs6jxVOAbP6047m2 --save
  cordova plugin add https://github.com/zhouzhongyuan/cordova-plugin-geolocation-baidu --variable BAIDUMAPKEY=5WXxKpATT2RsEaYyVs6jxVOAbP6047m2
  
  一 iOS 打包
  
  (1) CDVPlugin-Bridging-Header.h 修改融云app key   0vnjpoadnd4cz 
  (2) C Language Dialect 改成 GNU99[-std=gnu99]
  (3) Apple LLVM8.0 - Preprocessing 去掉DEBUG=1
  (4) 删掉cell_image.png
    
  (5) 
    AppDelegate+JPush.m didRegisterForRemoteNotificationsWithDeviceToken加入下面的判断
    
    NSString *token =
        [[[[deviceToken description] stringByReplacingOccurrencesOfString:@"<"
                                                               withString:@""]
          stringByReplacingOccurrencesOfString:@">"
          withString:@""]
         stringByReplacingOccurrencesOfString:@" "
         withString:@""];
        NSLog(@"token = %@",token);
        [[NSUserDefaults standardUserDefaults]setObject:token forKey:@"device_token"];
        
        [[RCIMClient sharedRCIMClient] setDeviceToken:token];
        
    #import <RongIMLib/RongIMLib.h>
    
    
  二 Android 打包
  
4.正式环境PROD appID com.hand-china.hrms

  iOS版本 Android 打包 通用插件下载
  
  cordova plugin rm cordova-plugin-baidu-geolocation
  cordova plugin rm cordova-plugin-geolocation-baidu
  cordova plugin add https://github.com/zhouzhongyuan/cordova-plugin-geolocation-baidu --variable BAIDUMAPKEY=5WXxKpATT2RsEaYyVs6jxVOAbP6047m2
  
  cordova plugin rm com.hand.scancard
  cordova plugin add http://hpm.hand-china.com/diffusion/SCANCARD/cordova-plugin-scancard.git

  cordova plugin rm cordova-plugin-hrms-faceidentify
  cordova plugin add http://hpm.hand-china.com/diffusion/FACEIDENTIFY/cordova-plugin-hrms-faceidentify.git
  
  cordova plugin rm com.handmobile.cordovaplugin.hotpatch
  cordova plugin add http://hpm.hand-china.com/diffusion/CORDOVAPLUGINHOTPATCH/
  
  cordova plugin rm hand-im-plugin-device
  cordova plugin add http://hpm.hand-china.com/diffusion/HANDIM/hand-im-plugin-device.git --variable RONG_KEY=e5t4ouvptpsaa
  
  cordova plugin rm cn.jpush.phonegap.JPushPlugin
  cordova plugin add jpush-phonegap-plugin@2.2.0 --variable API_KEY=22b25063349b6beef7bde524
  
  一 iOS 打包
  (1) CDVPlugin-Bridging-Header.h 修改融云app key   e5t4ouvptpsaa 
  (2) C Language Dialect 改成 GNU99[-std=gnu99]
  (3) Apple LLVM8.0 - Preprocessing 去掉DEBUG=1
  (4) 删掉cell_image.png
  (5) YYText 
  (6) 钩上推送的选项
  
  (5) 
  AppDelegate+JPush.m didRegisterForRemoteNotificationsWithDeviceToken加入下面的判断
  
  NSString *token =
      [[[[deviceToken description] stringByReplacingOccurrencesOfString:@"<"
                                                             withString:@""]
        stringByReplacingOccurrencesOfString:@">"
        withString:@""]
       stringByReplacingOccurrencesOfString:@" "
       withString:@""];
      NSLog(@"token = %@",token);
      [[NSUserDefaults standardUserDefaults]setObject:token forKey:@"device_token"];
      
      [[RCIMClient sharedRCIMClient] setDeviceToken:token];
      
  #import <RongIMLib/RongIMLib.h>
  
  二 Android 打包
  
5.ionic platform add android
6.ionic build android
```
    
=======
8.代码里面一定要有注释
9.angularJS项目 逻辑功能不要全部写在controller里面，因该写在service里面
10. 在一个controller 里面，变量都在最上面，函数在下面，因为js执行的时候，他也会自动先去执行变量的定义
```
>>>>>>> .merge_file_a07708
