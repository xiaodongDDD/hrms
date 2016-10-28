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
#import <AVFoundation/AVFoundation.h>
#import "DataBaseTool.h"
#import "UINavigationController+RCIMChatNavigationController.h"
#import "RCIMGroupChatViewController.h"
#import "CustomRCCall.h"
#import "NSUserActivity+StartCallConvertible.h"
#import "NSURL+StartCallConvertible.h"

#import <RongCallLib/RongCallLib.h>
#import <RongCallKit/RongCallKit.h>
#import "NSUserActivity+StartCallConvertible.h"
#import "NSURL+StartCallConvertible.h"



#include <objc/runtime.h>

#import "CustomRCCall.h"


static NSMutableArray *usersInfo;

@interface AppDelegate ()

@end


@implementation AppDelegate (CDVIMPlugin)

+ (AppDelegate *)sharedDelegate{
    return (AppDelegate *)([UIApplication sharedApplication].delegate);
}

#pragma mark 属性
- (void)setPushRegistry:(PKPushRegistry *)pushRegistry{
    objc_setAssociatedObject(self, @selector(pushRegistry), pushRegistry, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}
- (PKPushRegistry *)pushRegistry{
    return objc_getAssociatedObject(self, @selector(pushRegistry));
}
- (void)setCallManager:(WTCallManager *)callManager{
    objc_setAssociatedObject(self, @selector(callManager), callManager, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}
- (WTCallManager *)callManager{
    return objc_getAssociatedObject(self, @selector(callManager));
}
- (void)setProviderDelegate:(ProviderDelegate *)providerDelegate{
    objc_setAssociatedObject(self, @selector(providerDelegate), providerDelegate, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (ProviderDelegate *)providerDelegate{
    return objc_getAssociatedObject(self, @selector(providerDelegate));
}


- (void)setNotificationCenterRequired:(NSMutableDictionary *)notificationCenterRequired{
    objc_setAssociatedObject(self, @selector(notificationCenterRequired), notificationCenterRequired, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
}

- (NSMutableDictionary *)notificationCenterRequired{
    
    return objc_getAssociatedObject(self, @selector(notificationCenterRequired));
}


- (void)showCallkit{
    {
        [self setPushRegistry:[[PKPushRegistry alloc] initWithQueue:dispatch_get_main_queue()]];
        self.pushRegistry.delegate = self;
        self.pushRegistry.desiredPushTypes = [NSSet setWithObject:PKPushTypeVoIP];
    }
    {
        [self setCallManager:[[WTCallManager alloc] init]];
        
        [self setProviderDelegate:[[ProviderDelegate alloc] initWithCallManager:self.callManager]];
    }
    
    
}

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
                                             selector:@selector(IMApplicationDidLaunch:)
                                                 name:@"UIApplicationDidFinishLaunchingNotification"
                                               object:nil];
    
    return [self initAddition];
}

- (void)IMApplicationDidLaunch:(NSNotification *)notification
{
    launchOptions = notification.userInfo;
    //捕获异常.闪退信息
    NSSetUncaughtExceptionHandler(&uncaughtExceptionHandle);
    //弹出通知注册
    if ([[UIApplication sharedApplication]
         
         respondsToSelector:@selector(registerUserNotificationSettings:)]) {
        
        //注册推送, iOS 9
        
        UIUserNotificationSettings *settings = [UIUserNotificationSettings
                                                
                                                settingsForTypes:(UIUserNotificationTypeBadge |
                                                                  
                                                                  UIUserNotificationTypeSound |
                                                                  
                                                                  UIUserNotificationTypeAlert)
                                                
                                                categories:nil];
        
        [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
        
    } else {
        //注册推送, iOS 8
        UIRemoteNotificationType myTypes = UIRemoteNotificationTypeBadge |
        
        UIRemoteNotificationTypeAlert |
        
        UIRemoteNotificationTypeSound;
        
        [[UIApplication sharedApplication] registerForRemoteNotificationTypes:myTypes];
        
    }
    [[RCIMClient sharedRCIMClient] initWithAppKey:appSecret];
    [[RCIMClient sharedRCIMClient] setReceiveMessageDelegate:self object:nil];
    [RCIM sharedRCIM].userInfoDataSource = self;
    [[RCIM sharedRCIM]setConnectionStatusDelegate:self];
    
    
    if([[UIDevice currentDevice]systemVersion].floatValue>=10.0f){
        NSString *tokenStr = [[NSUserDefaults standardUserDefaults] objectForKey:@"device_token"];
        if(tokenStr){
            [[RCIMClient sharedRCIMClient] setDeviceToken:tokenStr];
        }
        [CustomRCCall sharedRCCall];
        [self showCallkit];
    }
    
    [self updateCrashException];
}

- (void)updateCrashException{
    NSDictionary *infoDic = [[NSBundle mainBundle] infoDictionary];
    NSString *appName = infoDic[@"CFBundleDisplayName"];
    NSString *versionName = infoDic[@"CFBundleShortVersionString"];
    CustomRCCall *call = [CustomRCCall sharedRCCall];
    NSString *exceptionString = [[NSUserDefaults standardUserDefaults] objectForKey:@"ExceptionError"];
    if(exceptionString){
        [call postWithUrl:@"http://wechat.hand-china.com/hrmsv2/v2/api/public/bugCollect/create" Params:@{@"name":[NSString stringWithFormat:@"%@-%@",appName,versionName],@"info":exceptionString} success:^(id response) {
            NSLog(@"发送日志成功");
            [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"ExceptionError"];
        } failure:^(NSError *error) {
            NSLog(@"发送日志失败");
        }];
    }
}

#pragma mark CallKit

//通讯录中点击会到这里,在通话的时候,系统的通话界面中点击视频,音频会重复拨打电话呢,也会走这里
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void(^)(NSArray * __nullable restorableObjects))restorationHandler{
    
    NSString *handle = [userActivity startCallHandle];
    NSLog(@"handld == %@",handle);
    //handle为点击的联系人的电话号码
    BOOL hasVideo = NO;
    if ([userActivity.activityType isEqualToString:@"INStartVideoCallIntent"]) {
        hasVideo = YES;
    }
    //    BOOL isGroup = [handle containsString:@","];
    //    if(isGroup){
    //
    //    }else{
    //
    //    }
    if (handle != nil && handle.length > 0 ){
        //去拨打电话:电话号码 :视频
        [[CustomRCCall sharedRCCall] startSingleCall:handle mediaType:RCCallMediaAudio];
    }
    return NO;
}


#pragma mark - PKPushRegistryDelegate
- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(PKPushType)type{
    NSLog(@"pushRegistry: didUpdatePushCredentials:");
}

/*!
 @method        pushRegistry:didReceiveIncomingPushWithPayload:forType:
 @abstract      This method is invoked when a push notification has been received for the specified PKPushType.
 @param         registry
 The PKPushRegistry instance responsible for the delegate callback.
 @param         payload
 The push payload sent by a developer via APNS server API.
 @param         type
 This is a PKPushType constant which is present in [registry desiredPushTypes].
 */
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type{
    if (type == PKPushTypeVoIP) {
        NSDictionary *dictionaryPayload = payload.dictionaryPayload;
        
        NSString *uuidString    = [[NSUserDefaults standardUserDefaults] objectForKey:@"kuuid"];
        NSString *handle        = dictionaryPayload[@"handle"];
        NSNumber *hasVideo      = dictionaryPayload[@"hasVideo"];
        
        NSUUID *uuid = [[NSUUID alloc] initWithUUIDString:uuidString];
        
        [self displayIncomingCallUUID:uuid handle:handle hasVideo:[hasVideo boolValue] completion:^(NSError * _Nullable error) {
            
        }];
    }
}

/// Display the incoming call to the user
- (void)displayIncomingCallUUID:(NSUUID *)uuid handle:(NSString *)handle hasVideo:(BOOL)hasVideo completion:(void (^)(NSError * error))completion{
    
    [self.providerDelegate reportIncomingCallUUID:uuid handle:handle hasVideo:hasVideo completion:^(NSError * _Nullable error) {
        NSLog(@"xiaowei---error = %@",error);
    }];
}

- (void)displayMultableIncomingCallUUID:(NSUUID *)uuid handle:(NSString *)handle hasVideo:(BOOL)hasVideo completion:(void (^)(NSError *_Nullable error))completion{
    [self.providerDelegate reportMutableIncomingCallUUID:uuid handle:handle hasVideo:hasVideo completion:^(NSError * _Nullable error) {
        
    }];
}



#pragma mark - 保证3D touch的操作可以被触发
- (void)RemoveNotificationCenterRequired:(NSString *)key bySubInfo:(NSDictionary *)info{
    NSArray *arrayInfos = [self.notificationCenterRequired objectForKey:key];
    if (arrayInfos != nil && [arrayInfos count] > 0) {
        NSMutableArray *arrayMuInfos = [[NSMutableArray alloc] initWithArray:arrayInfos];
        [arrayMuInfos removeObject:info];
        if ([arrayMuInfos count] == 0) {
            [self.notificationCenterRequired removeObjectForKey:key];
        }else{
            [self.notificationCenterRequired setObject:arrayMuInfos forKey:key];
        }
    }
}

- (void)RemoveNotificationCenterRequired:(NSString *)key{
    [self.notificationCenterRequired removeObjectForKey:key];
}

/*!
 IMKit连接状态的的监听器
 
 @param status  SDK与融云服务器的连接状态
 
 @discussion 如果您设置了IMKit消息监听之后，当SDK与融云服务器的连接状态发生变化时，会回调此方法。
 */
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

- (void)onReceived:(RCMessage *)message left:(int)nLeft object:(id)object
{
    //!([message.objectName isEqualToString:@"RC:DizNtf"]|| RC:VCSummary 电话通知
    if (![message.objectName isEqualToString:@"RC:VCSummary"]) {
        [[NSNotificationCenter defaultCenter] postNotificationName:RCIMLibReceivedMessageNotification object:message];
    }
#pragma mark CallKit for ios 10 ================
    if([message.objectName isEqualToString:@"RC:VCSummary"]){
        if([[UIDevice currentDevice] systemVersion].floatValue>=10.0f){
            
            WTCall *call = [self.callManager.calls lastObject];
            if(call){
                [self.callManager endCall:call];
            }
        }
        [[[RCCall sharedRCCall] currentCallSession] hangup];
        [[CustomRCCall sharedRCCall] dismissCallViewController:[UIApplication sharedApplication].keyWindow.rootViewController];
        
    }
    
    if(message.conversationType==ConversationType_PRIVATE){
        
        //单聊
        NSString *telePhone;
        //收到新消息 发送通知
        if (![message.objectName isEqualToString:@"RC:VCSummary"]) {
            SystemSoundID soundID;
            NSString *path = [[NSBundle mainBundle] pathForResource:@"default_mic" ofType:@"caf"];
            CFURLRef urlRef = (__bridge CFURLRef )[NSURL fileURLWithPath:path];
            AudioServicesCreateSystemSoundID(urlRef, &soundID);
            AudioServicesPlaySystemSound(soundID);
            NSLog(@"收到了新消息啦----：%@",message.content);
            
            //弹出提示框
            UILocalNotification *localNotification ;
            if ([UIApplication sharedApplication].applicationState == UIApplicationStateBackground) {
                NSString *body;
                NSDictionary *userInfoAndExtra;
                //每次收到消息就把数据存在本地数据库
                if ([message.content isKindOfClass:[RCTextMessage class]]) {
                    RCTextMessage *textMessage = (RCTextMessage *) message.content;
                    NSLog(@"Appdelegate+CDVIMPlugin收到消息了来自%@,%@-%@-%@",message.senderUserId,textMessage.senderUserInfo.userId,textMessage.senderUserInfo.name,textMessage.senderUserInfo.portraitUri);
                    if (textMessage.extra!=nil) {
                        
                        userInfoAndExtra = @{@"senderUserInfo":@{@"userId":textMessage.senderUserInfo.userId,@"name":textMessage.senderUserInfo.name,@"portraitUri":textMessage.senderUserInfo.portraitUri},@"extra":textMessage.extra,@"conversationType":@(message.conversationType)};
                        
                    }else{
                        userInfoAndExtra = @{@"senderUserInfo":@{@"userId":textMessage.senderUserInfo.userId,@"name":textMessage.senderUserInfo.name,@"portraitUri":textMessage.senderUserInfo.portraitUri},@"extra":@"null",@"conversationType":@(message.conversationType)};
                    }
                    if ([message.content senderUserInfo]) {
                        body = [NSString stringWithFormat:@"%@:%@",[textMessage senderUserInfo].name,[textMessage content]];
                        NSLog(@"body:%@",body);
                        
                    }else{//发送者没有携带用户信息 显示userid
                        body = [NSString stringWithFormat:@"%@:%@",message.senderUserId,textMessage.content];
                    }
                }else if([message.content isKindOfClass:[RCImageMessage class]]){
                    RCImageMessage *imageMessage = (RCImageMessage *)[message content];
                    if (imageMessage.extra!=nil) {
                        userInfoAndExtra = @{@"senderUserInfo":@{@"userId":imageMessage.senderUserInfo.userId,@"name":imageMessage.senderUserInfo.name,@"portraitUri":imageMessage.senderUserInfo.portraitUri},@"extra":imageMessage.extra,@"conversationType":@(message.conversationType)};
                    }else{
                        userInfoAndExtra = @{@"senderUserInfo":@{@"userId":imageMessage.senderUserInfo.userId,@"name":imageMessage.senderUserInfo.name,@"portraitUri":imageMessage.senderUserInfo.portraitUri},@"extra":@"null",@"conversationType":@(message.conversationType)};
                    }
                    if ([message.content senderUserInfo]) {
                        body = [NSString stringWithFormat:@"%@:%@",[imageMessage senderUserInfo].name,@"[图片]"];
                    }else{
                        body = [NSString stringWithFormat:@"%@:%@",message.senderUserId,@"[图片]"];
                    }
                }else if ([message.content isKindOfClass:[RCVoiceMessage class]]){
                    RCVoiceMessage *voiceMessage = (RCVoiceMessage *)message.content;
                    if (voiceMessage.extra!=nil) {
                        userInfoAndExtra = @{@"senderUserInfo":@{@"userId":voiceMessage.senderUserInfo.userId,@"name":voiceMessage.senderUserInfo.name,@"portraitUri":voiceMessage.senderUserInfo.portraitUri},@"extra":voiceMessage.extra,@"conversationType":@(message.conversationType)};
                    }else{
                        userInfoAndExtra = @{@"senderUserInfo":@{@"userId":voiceMessage.senderUserInfo.userId,@"name":voiceMessage.senderUserInfo.name,@"portraitUri":voiceMessage.senderUserInfo.portraitUri},@"extra":@"null",@"conversationType":@(message.conversationType)};
                    }
                    if ([message.content senderUserInfo]) {
                        body = [NSString stringWithFormat:@"%@:%@",[voiceMessage senderUserInfo].name,@"[语音]"];
                    }else{
                        body = [NSString stringWithFormat:@"%@:%@",message.senderUserId,@"[语音]"];
                    }
                }else if ([message.content isKindOfClass:[RCLocationMessage class]]){
                    RCLocationMessage *locationMessage = (RCLocationMessage *)[message content];
                    if (locationMessage.extra!=nil) {
                        userInfoAndExtra = @{@"senderUserInfo":@{@"userId":locationMessage.senderUserInfo.userId,@"name":locationMessage.senderUserInfo.name,@"portraitUri":locationMessage.senderUserInfo.portraitUri},@"extra":locationMessage.extra,@"conversationType":@(message.conversationType)};
                    }else{
                        NSString *extra = nil;
                        userInfoAndExtra = @{@"senderUserInfo":@{@"userId":locationMessage.senderUserInfo.userId,@"name":locationMessage.senderUserInfo.name,@"portraitUri":locationMessage.senderUserInfo.portraitUri},@"extra":extra,@"conversationType":@(message.conversationType)};
                    }
                    if ([message.content senderUserInfo]) {
                        body = [NSString stringWithFormat:@"%@:%@",[locationMessage senderUserInfo].name,@"[位置]"];
                    }else{
                        body = [NSString stringWithFormat:@"%@:%@",message.senderUserId,@"[位置]"];
                    }
                }
                telePhone = [userInfoAndExtra objectForKey:@"extra"];//获取电话
                localNotification = [[UILocalNotification alloc] init];
                [localNotification setAlertTitle:[[NSBundle mainBundle] infoDictionary][@"CFBundleDisplayName"]];
                [localNotification setAlertBody:body];
                [localNotification setUserInfo:userInfoAndExtra];
                [localNotification setSoundName:UILocalNotificationDefaultSoundName];
            }
            
            RCUserInfo *senderUserInfo ;
            if (message.content.senderUserInfo) {
                senderUserInfo = message.content.senderUserInfo;
            }
            //做下缓存处理  //插入员工详细信息
            if (senderUserInfo!=nil) {
                if (senderUserInfo.portraitUri==nil) {
                    senderUserInfo.portraitUri = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"profile-2@3x.png" ofType:@"png"]].absoluteString;
                }
                if (telePhone==nil||[telePhone isEqual:[NSNull null]]) {
                    telePhone = @"000000";
                }
                NSDictionary *sendInfo = @{@"work_id":senderUserInfo.userId, @"name":senderUserInfo.name, @"image_url":senderUserInfo.portraitUri,@"tel":telePhone};
                [self hasSameUserInfo:sendInfo];
                //弹起通知栏
                if (localNotification) {
                //    [[UIApplication sharedApplication] presentLocalNotificationNow:localNotification];
                }
                //主动发给js端推送
                [[NSNotificationCenter defaultCenter] postNotificationName:CDVIMPluginPushNotification object:message];
            }
            
        }
        
    }else if (message.conversationType==ConversationType_DISCUSSION){
        //讨论组 群聊
        if (![message.objectName isEqualToString:@"RC:VCSummary"]) {
            
            if ([UIApplication sharedApplication].applicationState==UIApplicationStateBackground) {
                if ([message.content isKindOfClass:[RCTextMessage class]]){
                    
                    RCTextMessage *textMsg = (RCTextMessage *)message.content;
                    NSString *body = [NSString stringWithFormat:@"%@：%@",textMsg.senderUserInfo.name,textMsg.content];
                    NSDictionary *userInfo = @{@"conversationType":@(message.conversationType)};
                    NSLog(@"——--extra:%@",textMsg.extra);
                    //[self insertDiscussionImageByDiscussionId:message.targetId ImageStr:textMsg.extra];
                    [self comeUpLocalNotificationWith:body UserInfo:userInfo];//唤醒通知
                    
                }else if ([message.content isKindOfClass:[RCImageMessage class]]){
                    RCImageMessage *imageMsg = (RCImageMessage *)message.content;
                    NSString *body = [NSString stringWithFormat:@"%@：[图片]",imageMsg.senderUserInfo.name];
                    NSDictionary *userInfo = @{@"conversationType":@(message.conversationType)};
                    //  [self insertDiscussionImageByDiscussionId:message.targetId ImageStr:imageMsg.extra];
                    [self comeUpLocalNotificationWith:body UserInfo:userInfo];//唤醒通知
                    
                }else if ([message.content isKindOfClass:[RCVoiceMessage class]]){
                    RCVoiceMessage *voiceMsg = (RCVoiceMessage *)message.content;
                    NSString *body = [NSString stringWithFormat:@"%@：[语音]",voiceMsg.senderUserInfo.name];
                    NSDictionary *userInfo = @{@"conversationType":@(message.conversationType)};
                    // [self insertDiscussionImageByDiscussionId:message.targetId ImageStr:voiceMsg.extra];
                    [self comeUpLocalNotificationWith:body UserInfo:userInfo];//唤醒通知
                }else if ([message.content isKindOfClass:[RCDiscussionNotificationMessage class]]){//其他类型的message
                    RCDiscussionNotificationMessage *RCDiscussionNotiMsg = (RCDiscussionNotificationMessage*)message.content;
                    NSString *body;
                    switch (RCDiscussionNotiMsg.type) {
                        case RCInviteDiscussionNotification:
                            body = [NSString stringWithFormat:@"%@邀请了%@加入了讨论组",RCDiscussionNotiMsg.operatorId,RCDiscussionNotiMsg.extension];
                            break;
                        case RCQuitDiscussionNotification:
                            body = [NSString stringWithFormat:@"%@退出了讨论组",RCDiscussionNotiMsg.operatorId];
                            break;
                        case RCRenameDiscussionTitleNotification:
                            body = [NSString stringWithFormat:@"%@修改了讨论组名称",RCDiscussionNotiMsg.operatorId];
                            break;
                        default:
                            break;
                    }
                    NSDictionary *userInfo = @{@"conversationType":@(message.conversationType)};
                    [self comeUpLocalNotificationWith:body UserInfo:userInfo];//唤醒通知
                }
                
            }else{
                //活跃
            }
            
            //主动发给js端推送
            [[NSNotificationCenter defaultCenter] postNotificationName:CDVIMPluginPushNotification object:message];
        }
        
    }
    
    NSLog(@"还剩余的未接收的消息数：%d 本条消息类型:%lu", nLeft,message.conversationType);
}

- (void)comeUpLocalNotificationWith:(NSString *)body UserInfo:(NSDictionary *)userInfo
{
    UILocalNotification *localNoti = [[UILocalNotification alloc] init];
    [localNoti setAlertTitle:[[NSBundle mainBundle] infoDictionary][@"CFBundleDisplayName"]];
    [localNoti setAlertBody:body];
    [localNoti setUserInfo:userInfo];//为了方便点击通知栏直接进入讨论组
    [localNoti setSoundName:UILocalNotificationDefaultSoundName];
  //  [[UIApplication sharedApplication] presentLocalNotificationNow:localNoti];
}
#pragma mark- 检查是否有相同讨论组(meiyou就添加讨论组信息)
- (void)insertDiscussionImageByDiscussionId:(NSString *)discussinId ImageStr:(NSString *)imageStr
{
    NSString * imageString = [DataBaseTool getDiscussionPortraitUriById:discussinId];
    if (!imageString) {
        [DataBaseTool insertDiscussionGroupInformation:discussinId PortraitUri:imageStr];
    }
}

#pragma mark -检查是否有相同联系人
- (BOOL)hasSameUserInfo:(NSDictionary *)object
{
    return [DataBaseTool selectSameUserInfoWithId:object[@"work_id"] Name:object[@"name"] ImageUrl:object[@"image_url"] Tel:[object objectForKey:@"tel"]];
}
-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
    NSLog(@"点击了通知:%@",notification.userInfo);
    NSDictionary *userInfo = notification.userInfo;
    RCConversationType type = [[userInfo objectForKey:@"conversationType"] integerValue];
    if (type==ConversationType_PRIVATE) {
        //这里要跳转到相应的界面 单聊
        NSDictionary *userInfo = notification.userInfo[@"senderUserInfo"];
        NSString *extara = notification.userInfo[@"extra"];
        NSArray *telephones;
        if ([extara rangeOfString:@"|"].location != NSNotFound) {
            telephones = (NSMutableArray *)[extara componentsSeparatedByString:@"|"];
            
        }else{
            telephones = @[extara];
        }
        NSLog(@"--telephones:%@",telephones);
        
        UINavigationController *nav = [[UINavigationController alloc] initWithTargetId:userInfo[@"userId"] FriendName:userInfo[@"name"] Icon:userInfo[@"portraitUri"] PhoneNumbers:telephones];
        
        [self.viewController presentViewController:nav animated:NO completion:nil];
    }else if (type==ConversationType_DISCUSSION){
        //讨论组
        //判断是通知类消息还是普通会话消息 回到根视图就可以
        
    }
}

#pragma makr--提供userInfo
-(void)getUserInfoWithUserId:(NSString *)userId completion:(void (^)(RCUserInfo *))completion {
    NSString *loginUserId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
    if ([userId isEqualToString:loginUserId]) {
        NSString *loginUserName = [[NSUserDefaults standardUserDefaults] objectForKey:@"userName"];
        NSString *longinUserIcon = [[NSUserDefaults standardUserDefaults] objectForKey:@"userIcon"];
        RCUserInfo *userInfo = [[RCUserInfo alloc] initWithUserId:loginUserId name:loginUserName portrait:longinUserIcon];
        completion(userInfo);
    }else {
        NSDictionary *dic = @{@"key":userId, @"page":@1, @"pageSize":@10};
        NSString *accessToken = [[NSUserDefaults standardUserDefaults]objectForKey:@"access_token"];
        NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"%@access_token=%@",localServiceQuery,accessToken]];
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
        request.HTTPMethod = @"POST";
        [request setValue:@"application/json" forHTTPHeaderField:@"content-type"];
        NSError *parseError = nil;
        [request setHTTPBody:[NSJSONSerialization dataWithJSONObject:dic options:NSJSONWritingPrettyPrinted error:&parseError]];
        NSURLSession *session = [NSURLSession sharedSession];
        
        NSURLSessionDataTask * sessionDataTask = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
            
            if (!error) {
                
                NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:(NSJSONReadingMutableLeaves) error:nil];
                NSArray *rows = [dict objectForKey:@"rows"];
                NSDictionary *person = rows[0];//profile-2@3x.png
                NSString *avatar = [person objectForKey:@"avatar"];
                if (avatar==nil||[avatar isEqual:[NSNull null]]||[avatar isEqualToString:@""]) {
                    avatar = @"profile-2@3x.png";
                }
                NSLog(@"id:%@ -- name:%@ -- icon:%@",[person objectForKey:@"emp_code"],[person objectForKey:@"emp_name"],avatar);
                RCUserInfo *info =[[RCUserInfo alloc]initWithUserId:[person objectForKey:@"emp_code"]
                                                               name:[person objectForKey:@"emp_name"]
                                                           portrait:avatar];
                completion(info);
            }
        }];
        [sessionDataTask resume];
        
    }
    
}
@end
