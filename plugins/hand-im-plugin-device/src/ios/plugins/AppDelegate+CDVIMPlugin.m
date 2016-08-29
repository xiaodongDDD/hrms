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
static NSMutableArray *usersInfo;
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
                                             selector:@selector(IMApplicationDidLaunch:)
                                                 name:@"UIApplicationDidFinishLaunchingNotification"
                                               object:nil];
    
    return [self initAddition];
}

- (void)IMApplicationDidLaunch:(NSNotification *)notification
{
    launchOptions = notification.userInfo;
    //弹出通知注册
    UIUserNotificationSettings *seting = [UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeAlert | UIUserNotificationTypeBadge categories:nil];
    
    //启动
    [[UIApplication sharedApplication] registerUserNotificationSettings:seting];
    [[RCIMClient sharedRCIMClient] initWithAppKey:appKey];
    [[RCIMClient sharedRCIMClient] setReceiveMessageDelegate:self object:nil];
    NSLog(@"IMApplicationDidLaunch");
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
    [[NSNotificationCenter defaultCenter] postNotificationName:RCIMLibReceivedMessageNotification object:message];
    
    //收到新消息 发送通知
    SystemSoundID soundID;
    NSString *path = [[NSBundle mainBundle] pathForResource:@"default_mic" ofType:@"caf"];
    CFURLRef urlRef = (__bridge CFURLRef )[NSURL fileURLWithPath:path];
    AudioServicesCreateSystemSoundID(urlRef, &soundID);
    AudioServicesPlaySystemSound(soundID);
    NSLog(@"收到了新消息啦----：%@",message.content.senderUserInfo);
    NSString *body;
    NSDictionary *userInfoAndExtra;
    //每次收到消息就把数据存在本地数据库
    if ([message.content isKindOfClass:[RCTextMessage class]]) {
        RCTextMessage *textMessage = (RCTextMessage *) message.content;
        if (textMessage.extra!=nil) {
            userInfoAndExtra = @{@"senderUserId":textMessage.senderUserInfo,@"extra":textMessage.extra};
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
            userInfoAndExtra = @{@"senderUserId":imageMessage.senderUserInfo,@"extra":imageMessage.extra};
        }
        if ([message.content senderUserInfo]) {
            body = [NSString stringWithFormat:@"%@:%@",[imageMessage senderUserInfo].name,@"[图片]"];
        }else{
            body = [NSString stringWithFormat:@"%@:%@",message.senderUserId,@"[图片]"];
        }
    }else if ([message.content isKindOfClass:[RCVoiceMessage class]]){
        RCVoiceMessage *voiceMessage = (RCVoiceMessage *)message.content;
        if (voiceMessage.extra!=nil) {
            userInfoAndExtra = @{@"senderUserId":voiceMessage.senderUserInfo,@"extra":voiceMessage.extra};
        }
        if ([message.content senderUserInfo]) {
            body = [NSString stringWithFormat:@"%@:%@",[voiceMessage senderUserInfo].name,@"[语音]"];
        }else{
            body = [NSString stringWithFormat:@"%@:%@",message.senderUserId,@"[语音]"];
        }
    }else if ([message.content isKindOfClass:[RCLocationMessage class]]){
        RCLocationMessage *locationMessage = (RCLocationMessage *)[message content];
        if (locationMessage.extra!=nil) {
            userInfoAndExtra = @{@"senderUserId":locationMessage.senderUserInfo,@"extra":locationMessage.extra};
        }
        if ([message.content senderUserInfo]) {
            body = [NSString stringWithFormat:@"%@:%@",[locationMessage senderUserInfo].name,@"[位置]"];
        }else{
            body = [NSString stringWithFormat:@"%@:%@",message.senderUserId,@"[位置]"];
        }
    }
    
    //弹出提示框
    UILocalNotification *localNotification ;
    if ([UIApplication sharedApplication].applicationState == UIApplicationStateBackground) {
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
    // NSLog(@"senderUserInfo:%@",[[[notification.object content] senderUserInfo] name]);
    //做下缓存处理  //插入员工详细信息
    if (senderUserInfo!=nil) {
        if (senderUserInfo.portraitUri==nil) {
            senderUserInfo.portraitUri = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"default_portrait@2x" ofType:@"png"]].absoluteString;
        }
        NSDictionary *sendInfo = @{@"work_id":senderUserInfo.userId, @"name":senderUserInfo.name, @"image_url":senderUserInfo.portraitUri};
        [self hasSameUserInfo:sendInfo];
        [[UIApplication sharedApplication] presentLocalNotificationNow:localNotification];
        //主动发给js端推送
        [[NSNotificationCenter defaultCenter] postNotificationName:CDVIMPluginPushNotification object:nil];
    }else{
        //
    }
    
    NSLog(@"还剩余的未接收的消息数：%d", nLeft);
}
- (BOOL)hasSameUserInfo:(NSDictionary *)object
{
    for (NSDictionary * userInfo in usersInfo) {
        if (userInfo[@"work_id"]==object[@"work_id"]) {
            if (userInfo[@"image_url"]==object[@"image_url"]) {
                return YES;
            }else{
                [DataBaseTool updatePersonDetailInformationWithId:userInfo[@"work_id"] Name:userInfo[@"name"] ImageUrl:userInfo[@"image_url"]];
                return YES;
            }
        }
    }
    [DataBaseTool insertPersonDetailInformationWithId:object[@"work_id"] Name:object[@"name"] ImageUrl:object[@"image_url"]];
    
    return NO;
}
-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
    NSLog(@"点击了通知:%@",notification.userInfo);
    //这里要跳转到相应的界面
    NSString *targetId = notification.userInfo[@"senderUserId"];
    NSString *extara = notification.userInfo[@"extra"];
    NSMutableArray *telephones = (NSMutableArray *)[extara componentsSeparatedByString:@"|"];
    NSLog(@"--telephones:%@",telephones);
    for (id obj in telephones) {
        if ([telephones containsObject:@""]||[telephones containsObject:[NSNull null]]) {
            [telephones removeObject:obj];
        }
    }
    UINavigationController *nav = [[UINavigationController alloc] initWithTargetId:targetId FriendName:[DataBaseTool getNameByWorkerId:targetId] Icon:[DataBaseTool getImageUrlByWorkerId:targetId] PhoneNumbers:telephones];
    
    [self.viewController presentViewController:nav animated:NO completion:nil];
}

@end
