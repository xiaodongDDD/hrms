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
                                             selector:@selector(applicationDidIMLaunch:)
                                                 name:@"UIApplicationDidFinishLaunchingNotification"
                                               object:nil];
    
    return [self initAddition];
    
}

- (void)applicationDidIMLaunch:(NSNotification *)notification
{
    _launchOptions = notification.userInfo;
    [[RCIM sharedRCIM] initWithAppKey:appKey];
    [[RCIM sharedRCIM] setReceiveMessageDelegate:self];
    [[RCIM sharedRCIM] setEnableMessageAttachUserInfo:YES];
    [[RCIM sharedRCIM] setEnablePersistentUserInfoCache:YES];
    
    
    if ([[UIApplication sharedApplication] respondsToSelector:@selector(registerUserNotificationSettings:)]) {
        UIUserNotificationType type =  UIUserNotificationTypeAlert | UIUserNotificationTypeBadge | UIUserNotificationTypeSound;
        UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:type
                                                                                 categories:nil];
        [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    }
    
    dispatch_async(dispatch_get_main_queue(), ^{
        //获取数据库 -------------***********----------------可能会有内存问题
        usersInfo = [DataBaseTool getAllUsersInfo];
        NSLog(@"applicationDidIMLaunch获取数据库,count:%li",usersInfo.count);
    });
    
    //融云即时通讯
    [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(didReceiveMessageNotification:)
                                                name:RCKitDispatchMessageNotification
                                              object:nil];
    
    [[RCIM sharedRCIM] setConnectionStatusDelegate:self];
    [[RCIM sharedRCIM] setDisableMessageNotificaiton:YES];
    [[RCIM sharedRCIM] setDisableMessageAlertSound:YES];
}

- (void)didReceiveMessageNotification:(NSNotification *)notification
{
    SystemSoundID soundID;
    NSString *path = [[NSBundle mainBundle] pathForResource:@"default_mic" ofType:@"caf"];
    CFURLRef urlRef = (__bridge CFURLRef )[NSURL fileURLWithPath:path];
    AudioServicesCreateSystemSoundID(urlRef, &soundID);
    AudioServicesPlaySystemSound(soundID);
    RCMessage *message = (RCMessage *)notification.object;
    NSLog(@"收到了新消息 %@  message:%@",[message content] ,[notification.object targetId]);
    NSLog(@"message:%@ notification.object :%@ [notification.object content]:%@",message,notification.object,[notification.object content]);
    NSString *body;
    //每次收到消息就把数据存在本地数据库
    if ([message.content isKindOfClass:[RCTextMessage class]]) {
        RCTextMessage *textMessage = (RCTextMessage *) message.content;
        if ([message.content senderUserInfo]) {
            body = [NSString stringWithFormat:@"%@:%@",[textMessage senderUserInfo].name,[textMessage content]];
            NSLog(@"body:%@",body);
        }else{
            body = [NSString stringWithFormat:@"%@:%@",message.senderUserId,textMessage.content];
        }
    }else if([message.content isKindOfClass:[RCImageMessage class]]){
        RCImageMessage *imageMessage = (RCImageMessage *)[message content];
        if ([message.content senderUserInfo]) {
            body = [NSString stringWithFormat:@"%@:%@",[imageMessage senderUserInfo].name,@"[图片]"];
        }else{
            body = [NSString stringWithFormat:@"%@:%@",message.senderUserId,@"[图片]"];
        }
    }else if ([message.content isKindOfClass:[RCVoiceMessage class]]){
        RCVoiceMessage *voiceMessage = (RCVoiceMessage *)message.content;
        if ([message.content senderUserInfo]) {
            body = [NSString stringWithFormat:@"%@:%@",[voiceMessage senderUserInfo].name,@"[语音]"];
        }else{
            body = [NSString stringWithFormat:@"%@:%@",message.senderUserId,@"[语音]"];
        }
    }else if ([message.content isKindOfClass:[RCLocationMessage class]]){
        RCLocationMessage *locationMessage = (RCLocationMessage *)[message content];
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
        [localNotification setFireDate:[NSDate date]];
        [localNotification setSoundName:UILocalNotificationDefaultSoundName];
    }
    
    RCUserInfo *senderUserInfo ;
    if ([[notification.object content] senderUserInfo]) {
        senderUserInfo = [[notification.object content] senderUserInfo];
    }
    // NSLog(@"senderUserInfo:%@",[[[notification.object content] senderUserInfo] name]);
    //做下缓存处理  //插入员工详细信息
    if (senderUserInfo!=nil) {
        if (senderUserInfo.portraitUri==nil) {
            senderUserInfo.portraitUri = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"image_placehold" ofType:@"png"]].absoluteString;
        }
        NSDictionary *sendInfo = @{@"work_id":senderUserInfo.userId, @"name":senderUserInfo.name, @"image_url":senderUserInfo.portraitUri};
        [self hasSameUserInfo:sendInfo];
        [[UIApplication sharedApplication] scheduleLocalNotification:localNotification];
        [[NSNotificationCenter defaultCenter] postNotificationName:CDVIMPluginPushNotification object:nil];
    }else{
        //
    }
    
    NSLog(@"收到了新消息 userID:%@,name:%@,头像:%@",senderUserInfo.userId,senderUserInfo.name,senderUserInfo.portraitUri);
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


#pragma mark - ReceiveMessageDelegate
- (void)onRCIMReceiveMessage:(RCMessage *)message
                        left:(int)left
{
    // NSLog(@"onRCIMReceiveMessage:%@,%d",message,left);
    
}


-(void)applicationDidReceiveMemoryWarning:(UIApplication *)application
{
    [[RCIM sharedRCIM] clearUserInfoCache];
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

@end
