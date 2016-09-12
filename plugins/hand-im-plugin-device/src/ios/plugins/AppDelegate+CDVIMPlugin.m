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
    [[RCIMClient sharedRCIMClient] initWithAppKey:AppKey];
    [[RCIMClient sharedRCIMClient] setReceiveMessageDelegate:self object:nil];
    [RCIM sharedRCIM].userInfoDataSource = self;

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
    if (!([message.objectName isEqualToString:@"RC:DizNtf"]||[message.objectName isEqualToString:@"RC:VCSummary"])) {
        [[NSNotificationCenter defaultCenter] postNotificationName:RCIMLibReceivedMessageNotification object:message];
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
            NSLog(@"收到了新消息啦-from:%@--：%@",message.content,message.senderUserId);
            
            //弹出提示框
            UILocalNotification *localNotification ;
            
            
            RCUserInfo *senderUserInfo ;
            if (message.content.senderUserInfo) {
                senderUserInfo = message.content.senderUserInfo;
            }
            //做下缓存处理  //插入员工详细信息
            if (senderUserInfo!=nil) {
                if (senderUserInfo.portraitUri==nil) {
                    senderUserInfo.portraitUri = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"profile-2@3x.png" ofType:@"png"]].absoluteString;
                }
                NSDictionary *sendInfo = @{@"work_id":senderUserInfo.userId, @"name":senderUserInfo.name, @"image_url":senderUserInfo.portraitUri,@"tel":telePhone};
                [self hasSameUserInfo:sendInfo];
                //弹起通知栏
                [[UIApplication sharedApplication] presentLocalNotificationNow:localNotification];
                //主动发给js端推送
                [[NSNotificationCenter defaultCenter] postNotificationName:CDVIMPluginPushNotification object:message];
            }
            
        }
        
    }else if (message.conversationType==ConversationType_DISCUSSION){
        //讨论组 群聊
        NSLog(@"ConversationType_DISCUSSION");
        if (![message.content isKindOfClass:[RCDiscussionNotificationMessage class]]) {
            
            if ([UIApplication sharedApplication].applicationState==UIApplicationStateBackground) {
                if ([message.content isKindOfClass:[RCTextMessage class]]){
                    
                    RCTextMessage *textMsg = (RCTextMessage *)message.content;
                    NSString *body = [NSString stringWithFormat:@"%@：%@",textMsg.senderUserInfo.name,textMsg.content];
                    NSDictionary *userInfo = @{@"conversationType":@(message.conversationType)};
                    NSLog(@"——--extra:%@",textMsg.extra);
                    [self insertDiscussionImageByDiscussionId:message.targetId ImageStr:textMsg.extra];
                    [self comeUpLocalNotificationWith:body UserInfo:userInfo];//唤醒通知
                    
                }else if ([message.content isKindOfClass:[RCImageMessage class]]){
                    RCImageMessage *imageMsg = (RCImageMessage *)message.content;
                    NSString *body = [NSString stringWithFormat:@"%@：[图片]",imageMsg.senderUserInfo.name];
                    NSDictionary *userInfo = @{@"conversationType":@(message.conversationType)};
                    [self insertDiscussionImageByDiscussionId:message.targetId ImageStr:imageMsg.extra];
                    [self comeUpLocalNotificationWith:body UserInfo:userInfo];//唤醒通知
                    
                }else if ([message.content isKindOfClass:[RCVoiceMessage class]]){
                    RCVoiceMessage *voiceMsg = (RCVoiceMessage *)message.content;
                    NSString *body = [NSString stringWithFormat:@"%@：[语音]",voiceMsg.senderUserInfo.name];
                    NSDictionary *userInfo = @{@"conversationType":@(message.conversationType)};
                    [self insertDiscussionImageByDiscussionId:message.targetId ImageStr:voiceMsg.extra];
                    [self comeUpLocalNotificationWith:body UserInfo:userInfo];//唤醒通知
                }else{//其他类型的message
                    NSLog(@"其他类型的message:%@",message.content);
                }
                
            }else{
                
                //活跃
                NSLog(@"活跃");
            }
            NSLog(@"");
            //主动发给js端推送
            [[NSNotificationCenter defaultCenter] postNotificationName:CDVIMPluginPushNotification object:message];
        }
        
    }
    NSLog(@"onReceived");
    NSLog(@"还剩余的未接收的消息数：%d 本条消息类型:%lu", nLeft,message.conversationType);
}

- (void)comeUpLocalNotificationWith:(NSString *)body UserInfo:(NSDictionary *)userInfo
{
    UILocalNotification *localNoti = [[UILocalNotification alloc] init];
    [localNoti setAlertTitle:[[NSBundle mainBundle] infoDictionary][@"CFBundleDisplayName"]];
    [localNoti setAlertBody:body];
    [localNoti setUserInfo:userInfo];//为了方便点击通知栏直接进入讨论组
    [localNoti setSoundName:UILocalNotificationDefaultSoundName];
    [[UIApplication sharedApplication] presentLocalNotificationNow:localNoti];
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
                NSLog(@"id:%@ f:%@ -- icon:%@",[person objectForKey:@"emp_code"],[person objectForKey:@"emp_name"],avatar);
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
