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
    // [[RCIM sharedRCIM] setDisableMessageNotificaiton:YES];
    [[RCIM sharedRCIM] setDisableMessageAlertSound:YES];
}

- (void)didReceiveMessageNotification:(NSNotification *)notification
{
    SystemSoundID soundID;//default_mic.caf
    NSString *path = [[NSBundle mainBundle] pathForResource:@"default_mic" ofType:@"caf"];
    CFURLRef urlRef = (__bridge CFURLRef )[NSURL fileURLWithPath:path];
    AudioServicesCreateSystemSoundID(urlRef, &soundID);
    AudioServicesPlaySystemSound(soundID);
    
    //弹出提示框
    UILocalNotification *localNotification ;
    if ([UIApplication sharedApplication].applicationState == UIApplicationStateBackground) {
        localNotification = [[UILocalNotification alloc] init];
        [localNotification setAlertTitle:[[NSBundle mainBundle] infoDictionary][@"CFBundleDisplayName"]];
        [localNotification setFireDate:[NSDate date]];
        [localNotification setSoundName:UILocalNotificationDefaultSoundName];
    }
    RCUserInfo *senderUserInfo = [[notification.object content] senderUserInfo];
    // NSLog(@"senderUserInfo:%@",[[[notification.object content] senderUserInfo] name]);
    RCMessage *message = (RCMessage *)[notification.object content];
    //每次收到消息就把数据存在本地数据库
    
    NSDictionary *msgDic;
    if ([message isKindOfClass:[RCTextMessage class]]) {
        //文本消息
        //    NSLog(@"[TimeTool  timeStr:[notification.object sentTime]]:%@",[TimeTool  timeStr:[notification.object sentTime]]);
        msgDic = [NSDictionary dictionaryWithObjects:@[@{@"messageType":@"text",@"sendId":[notification.object senderUserId],@"content":[message content],@"sendTime":[NSString  stringWithFormat:@"%lli",[notification.object sentTime]],@"receiveTime":[NSString  stringWithFormat:@"%lli",[notification.object receivedTime]]}] forKeys:@[@"message"]];
        
        [localNotification setAlertBody:[NSString stringWithFormat:@"%@:%@",[senderUserInfo name],msgDic[@"message"][@"content"]]];
        //UIApplication启动通知
        [[UIApplication sharedApplication]scheduleLocalNotification:localNotification];
        
    } else if ([ message isKindOfClass:[RCImageMessage class]]){
        //图片消息
        msgDic = [NSDictionary dictionaryWithObjects:@[@{@"messageType":@"img" ,@"sendId":[notification.object senderUserId],@"content":@"[图片]",@"sendTime":[NSString  stringWithFormat:@"%lli",[notification.object sentTime]],@"receiveTime":[NSString  stringWithFormat:@"%lli",[notification.object receivedTime]]}] forKeys:@[@"message"]];
        
        [localNotification setAlertBody:[NSString stringWithFormat:@"%@:%@",[senderUserInfo name],msgDic[@"message"][@"content"]]];
        //UIApplication启动通知
        [[UIApplication sharedApplication]scheduleLocalNotification:localNotification];
        
    } else if ([message isKindOfClass:[RCVoiceMessage class]]){
        //语音消息
        msgDic = [NSDictionary dictionaryWithObjects:@[@{@"messageType":@"voice",@"sendId":[notification.object senderUserId],@"content":@"[语音]",@"sendTime":[NSString  stringWithFormat:@"%lli",[notification.object sentTime]],@"receiveTime":[NSString  stringWithFormat:@"%lli",[notification.object receivedTime]]}] forKeys:@[@"message"]];
        [localNotification setAlertBody:[NSString stringWithFormat:@"%@:%@",[senderUserInfo name],msgDic[@"message"][@"content"]]];
        //UIApplication启动通知
        [[UIApplication sharedApplication]scheduleLocalNotification:localNotification];
        
    } else if ([message isKindOfClass:[RCLocationMessage class]]){
        //位置消息
        msgDic = [NSDictionary dictionaryWithObjects:@[@{@"messageType":@"location",@"sendId":[notification.object senderUserId],@"content":@"[位置]",@"sendTime":[NSString  stringWithFormat:@"%lli",[notification.object sentTime]],@"receiveTime":[NSString  stringWithFormat:@"%lli",[notification.object receivedTime]]}] forKeys:@[@"message"]];
        [localNotification setAlertBody:[NSString stringWithFormat:@"%@:%@",[senderUserInfo name],msgDic[@"message"][@"content"]]];
        //UIApplication启动通知
        [[UIApplication sharedApplication]scheduleLocalNotification:localNotification];
    }
    //写入数据库
    dispatch_async(dispatch_get_main_queue(), ^{
        [DataBaseTool insetReceivedDataType:msgDic[@"message"][@"messageType"] SendId:msgDic[@"message"][@"sendId"] ReceivedId:[[NSUserDefaults standardUserDefaults]objectForKey:@"userId"] Content:msgDic[@"message"][@"content"] SendTime:msgDic[@"message"][@"sendTime"] ReceiveTime:msgDic[@"message"][@"receiveTime"] Flag:@"N"];
        //做下缓存处理  //插入员工详细信息
        if (senderUserInfo.portraitUri==nil) {
            senderUserInfo.portraitUri = [[NSBundle mainBundle] pathForResource:@"image_placehold" ofType:@"png"];
        }
        NSDictionary *sendInfo = @{@"work_id":senderUserInfo.userId, @"name":senderUserInfo.name, @"image_url":senderUserInfo.portraitUri};
        [self hasSameUserInfo:sendInfo];
        
        [[NSNotificationCenter defaultCenter] postNotificationName:CDVIMPluginPushNotification object:nil];
    });
    NSLog(@"胡强收到了新消息 userID:%@,name:%@,头像:%@",senderUserInfo.userId,senderUserInfo.name,senderUserInfo.portraitUri);
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
    for (id obj in usersInfo) {
        if (obj[@"work_id"]==object[@"work_id"]) {
            if (obj[@"image_url"]==object[@"image_url"]) {
                return YES;
            }else{
                [DataBaseTool updatePersonDetailInformationWithId:obj[@"work_id"] Name:obj[@"name"] ImageUrl:obj[@"image_url"]];
                return YES;
            }
        }
    }
    [DataBaseTool insertPersonDetailInformationWithId:object[@"work_id"] Name:object[@"name"] ImageUrl:object[@"image_url"]];
    return NO;
}

@end
