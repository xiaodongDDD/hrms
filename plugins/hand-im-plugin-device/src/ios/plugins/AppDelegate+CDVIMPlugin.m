//
//  AppDelegate+CDVIMPlugin.m
//  IMTest
//
//  Created by wangsheng on 16/7/11.
//
//

#import "AppDelegate+CDVIMPlugin.h"
#import "CVDPlugin-Bridging-Header.h"
#import <objc/runtime.h>
#import "CDVIMPluginChattingViewController.h"
#import "DataBaseTool.h"
#import <AudioToolbox/AudioToolbox.h>

@implementation AppDelegate (CDVIMPlugin)
+(void)load
{
    Method origin;
    Method swizzle;
    
    origin=class_getInstanceMethod([self class],@selector(init));
    swizzle=class_getInstanceMethod([self class], @selector(initAddition));
    method_exchangeImplementations(origin, swizzle);
}

-(id)initAddition
{

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(applicationDidIMLaunch:)
                                                name:@"UIApplicationDidFinishLaunchingNotification"
                                               object:nil];
//    [[NSNotificationCenter defaultCenter] addObserver:self
//                                             selector:@selector(applicationDidIMDidEnterBackground:)
//                                                 name:@"UIApplicationDidEnterBackgroundNotification"
//                                               object:nil];
    //UIApplicationDidEnterBackgroundNotification

    
    return [self initAddition];
    
}

- (void)applicationDidIMLaunch:(NSNotification *)notification
{
    _launchOptions = notification.userInfo;
    
    [[RCIM sharedRCIM] initWithAppKey:appKey];
    [[RCIM sharedRCIM] setReceiveMessageDelegate:self];
    [self loginRongCloud];
    
    if ([[UIApplication sharedApplication]
         respondsToSelector:@selector(registerUserNotificationSettings:)]) {
        //注册推送, 用于iOS8以及iOS8之后的系统
        UIUserNotificationSettings *settings = [UIUserNotificationSettings
                                                settingsForTypes:(UIUserNotificationTypeBadge |
                                                                  UIUserNotificationTypeSound |
                                                                  UIUserNotificationTypeAlert)
                                                categories:nil];
        [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    } else {
        //注册推送，用于iOS8之前的系统
        UIRemoteNotificationType myTypes = UIRemoteNotificationTypeBadge |
        UIRemoteNotificationTypeAlert |
        UIRemoteNotificationTypeSound;
        [[UIApplication sharedApplication] registerForRemoteNotificationTypes:myTypes];
    }
    //融云即时通讯
    [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(didReceiveMessageNotification:)
                                                name:RCKitDispatchMessageNotification
                                              object:nil];
    
    [[RCIM sharedRCIM] setConnectionStatusDelegate:self];
    
    [[RCIM sharedRCIM] setDisableMessageAlertSound:YES];

    
//     NSDictionary *remoteNotificationUserInfo =
//    _launchOptions[@"UIApplicationLaunchOptionsRemoteNotificationKey"];
//    
//    if (remoteNotificationUserInfo) {
//      //  [[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
//    }
  //  NSLog(@"来了这里remoteNotificationUserInfo:%@",remoteNotificationUserInfo);

}

//程序一启动就连接融云服务器
-(void)loginRongCloud
{
    NSString *token = [[NSUserDefaults standardUserDefaults] objectForKey:@"token"];
    [[RCIM sharedRCIM] connectWithToken:token success:^(NSString *userId) {
        //设置用户信息提供者,页面展现的用户头像及昵称都会从此代理取
        //   [[RCIM sharedRCIM] setUserInfoDataSource:self];
        NSLog(@"Login successfully with userId: %@", userId);
    } error:^(RCConnectErrorCode status) {
        NSLog(@"login error status: %ld.", (long)status);
    } tokenIncorrect:^{
        NSLog(@"token 无效 ，请确保生成token 使用的appkey 和初始化时的appkey 一致");
    }];
    [[RCIM sharedRCIM] setDisableMessageNotificaiton:YES];
    [[RCIM sharedRCIM] setDisableMessageAlertSound:YES];
    
}

- (void)didReceiveMessageNotification:(NSNotification *)notification
{
    dispatch_async(dispatch_get_main_queue(), ^{
        AudioServicesPlaySystemSound(1003);
    });
    RCMessage *message = (RCMessage *)[notification.object content];
    
    //每次收到消息就把数据存在本地数据库

    NSDictionary *msgDic;
    if ([message isKindOfClass:[RCTextMessage class]]) {
        //文本消息
        NSLog(@"[TimeTool  timeStr:[notification.object sentTime]]:%@",[TimeTool  timeStr:[notification.object sentTime]]);
        msgDic = [NSDictionary dictionaryWithObjects:@[@{@"messageType":@"text",@"sendId":[notification.object senderUserId],@"content":[message content],@"sendTime":[NSString  stringWithFormat:@"%lli",[notification.object sentTime]],@"receiveTime":[NSString  stringWithFormat:@"%lli",[notification.object receivedTime]]}] forKeys:@[@"message"]];
        
    } else if ([ message isKindOfClass:[RCImageMessage class]]){
        //图片消息
         msgDic = [NSDictionary dictionaryWithObjects:@[@{@"messageType":@"img" ,@"sendId":[notification.object senderUserId],@"content":@"[图片]",@"sendTime":[NSString  stringWithFormat:@"%lli",[notification.object sentTime]],@"receiveTime":[NSString  stringWithFormat:@"%lli",[notification.object receivedTime]]}] forKeys:@[@"message"]];
        
    } else if ([message isKindOfClass:[RCVoiceMessage class]]){
        //语音消息
        msgDic = [NSDictionary dictionaryWithObjects:@[@{@"messageType":@"voice",@"sendId":[notification.object senderUserId],@"content":@"[语音]",@"sendTime":[NSString  stringWithFormat:@"%lli",[notification.object sentTime]],@"receiveTime":[NSString  stringWithFormat:@"%lli",[notification.object receivedTime]]}] forKeys:@[@"message"]];
        
    } else if ([message isKindOfClass:[RCLocationMessage class]]){
        //位置消息
        msgDic = [NSDictionary dictionaryWithObjects:@[@{@"messageType":@"location",@"sendId":[notification.object senderUserId],@"content":@"[语音]",@"sendTime":[NSString  stringWithFormat:@"%lli",[notification.object sentTime]],@"receiveTime":[NSString  stringWithFormat:@"%lli",[notification.object receivedTime]]}] forKeys:@[@"message"]];
    }
        //写入数据库
        dispatch_async(dispatch_get_main_queue(), ^{
            [DataBaseTool insetReceivedDataType:msgDic[@"message"][@"messageType"] SendId:msgDic[@"message"][@"sendId"] ReceivedId:[[NSUserDefaults standardUserDefaults]objectForKey:@"userId"] Content:msgDic[@"message"][@"content"] SendTime:msgDic[@"message"][@"sendTime"] ReceiveTime:msgDic[@"message"][@"receiveTime"] Flag:@"N"];
            
        });

    //弹出提示框
    if ([UIApplication sharedApplication].applicationState == UIApplicationStateBackground) {
       UILocalNotification *localNotification = [[UILocalNotification alloc]init];
        [localNotification setAlertBody:[NSString stringWithFormat:@"%@给你发来了一条新消息",[notification.object senderUserId]]];
        localNotification.userInfo = @{@"id":[notification.object senderUserId]};
        [localNotification setAlertTitle:[[NSBundle mainBundle] infoDictionary][@"CFBundleDisplayName"]];
        [localNotification setFireDate:[NSDate date]];
        [localNotification setSoundName:UILocalNotificationDefaultSoundName];
        //UIApplication启动通知
        [[UIApplication sharedApplication]scheduleLocalNotification:localNotification];
    }
  //  [UIApplication sharedApplication].applicationIconBadgeNumber =
   // [UIApplication sharedApplication].applicationIconBadgeNumber + 1;
    

}

/*!
 IMKit连接状态的的监听器
 
 @param status  SDK与融云服务器的连接状态
 
 @discussion 如果您设置了IMKit消息监听之后，当SDK与融云服务器的连接状态发生变化时，会回调此方法。
 */
#pragma mark -connectStatusDelegate
- (void)onRCIMConnectionStatusChanged:(RCConnectionStatus)status
{
    NSLog(@"RCIMConnectionStatusChanged:%@",@(status));
    if (ConnectionStatus_KICKED_OFFLINE_BY_OTHER_CLIENT) {
        if (status == ConnectionStatus_KICKED_OFFLINE_BY_OTHER_CLIENT) {
            
            UIAlertView *alert = [[UIAlertView alloc]
                                  
                                  initWithTitle:@"提示"
                                  
                                  message:@"您"
                                  
                                  @"的帐号在别的设备上登录，您被迫下线！"
                                  
                                  delegate:nil
                                  
                                  cancelButtonTitle:@"知道了"
                                  
                                  otherButtonTitles:nil, nil];
            [alert show];
    }
 }
}

//注册用户通知设置
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
    // register to receive notifications
    [application registerForRemoteNotifications];
}


//程序进入后台2分钟之前 和 处于活跃
- (void)application:(UIApplication *)application
didReceiveLocalNotification:(UILocalNotification *)notification {
    // notification为本地通知的内容
    NSLog(@"notification为本地通知的内容:%@",notification.userInfo[@"id"]);
        CDVIMPluginChattingViewController *cdvIMChattingVC = [[CDVIMPluginChattingViewController alloc] initWithConversationType:ConversationType_PRIVATE targetId:notification.userInfo[@"id"]];
    cdvIMChattingVC.targetId = notification.userInfo[@"id"];
        cdvIMChattingVC.navTitle = notification.userInfo[@"id"];
        UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:cdvIMChattingVC];
        [self.viewController presentViewController:nav animated:YES completion:nil];
  //  [UIApplication sharedApplication].applicationIconBadgeNumber = 0;
}


#pragma mark - ReceiveMessageDelegate
- (void)onRCIMReceiveMessage:(RCMessage *)message
                        left:(int)left
{
    NSLog(@"onRCIMReceiveMessage:%@,%d",message,left);
    
}


-(void)applicationDidReceiveMemoryWarning:(UIApplication *)application
{
    UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"系统提示" message:@"您的手机应用内存不足" delegate:self cancelButtonTitle:@"知道了" otherButtonTitles:nil, nil];
    [alertView show];
}

@end
