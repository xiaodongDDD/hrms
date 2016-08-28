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
    if(message.conversationType==ConversationType_PRIVATE){
        //单聊
        //收到新消息 发送通知
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
            NSDictionary *sendInfo = @{@"work_id":senderUserInfo.userId, @"name":senderUserInfo.name, @"image_url":senderUserInfo.portraitUri};
            [self hasSameUserInfo:sendInfo];
            //弹起通知栏
            [[UIApplication sharedApplication] presentLocalNotificationNow:localNotification];
            //主动发给js端推送
            [[NSNotificationCenter defaultCenter] postNotificationName:CDVIMPluginPushNotification object:message];
        }
        
    }else if (message.conversationType==ConversationType_DISCUSSION){
        //讨论组 群聊
        
        if ([UIApplication sharedApplication].applicationState==UIApplicationStateBackground) {
            //程序进入后台 弹起通知栏
            if ([message.content isKindOfClass:[RCDiscussionNotificationMessage class]]) {
                //讨论组通知类消息
                RCDiscussionNotificationMessage *discussionNotificationMSg = (RCDiscussionNotificationMessage *)message.content;
                __block NSString *body;
                switch (discussionNotificationMSg.type) {
                    case RCInviteDiscussionNotification:
                    {
                        //有成员加入讨论组的通知
                        NSString *currentUserId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
                        if ([discussionNotificationMSg.extension rangeOfString:currentUserId].location!=NSNotFound) {
                            [[RCIMClient sharedRCIMClient] getDiscussion:message.targetId success:^(RCDiscussion *discussion) {
                                body = [NSString stringWithFormat:@"讨论组通知：%@ 邀请你加入 %@",discussionNotificationMSg.operatorId,discussion.discussionName];
                                NSDictionary *userInfo = @{@"conversationType":@(message.conversationType)};
                                [self comeUpLocalNotificationWith:body UserInfo:userInfo];//唤醒通知
                            } error:nil];
                            
                        }
                    }
                        break;
                    case RCQuitDiscussionNotification:
                    {
                        [[RCIMClient sharedRCIMClient] getDiscussion:message.targetId success:^(RCDiscussion *discussion) {
                            //有成员退出讨论组的通知
                            body = [NSString stringWithFormat:@"讨论组通知：%@ 退出了 %@",discussionNotificationMSg.operatorId,discussion.discussionName];
                            NSDictionary *userInfo = @{@"conversationType":@(message.conversationType)};
                            [self comeUpLocalNotificationWith:body UserInfo:userInfo];//唤醒通知
                        } error:nil];
                        
                    }
                        break;
                    case RCRenameDiscussionTitleNotification:
                    {
                        [[RCIMClient sharedRCIMClient] getDiscussion:message.targetId success:^(RCDiscussion *discussion) {
                            //讨论组名称发生变更的通知
                            body = [NSString stringWithFormat:@"讨论组通知：%@ 修改了讨论组名为 %@",discussionNotificationMSg.operatorId,discussion.discussionName];
                            NSDictionary *userInfo = @{@"conversationType":@(message.conversationType)};
                            [self comeUpLocalNotificationWith:body UserInfo:userInfo];//唤醒通知

                        } error:nil];
                    }
                        break;
                    case RCRemoveDiscussionMemberNotification:
                    {
                        [[RCIMClient sharedRCIMClient] getDiscussion:message.targetId success:^(RCDiscussion *discussion) {
                            //有成员被踢出讨论组的通知
                            body = [NSString stringWithFormat:@"讨论组通知：%@ 将 %@从 %@ 中移除",discussionNotificationMSg.operatorId,discussionNotificationMSg.extension,discussion.discussionName];
                            NSDictionary *userInfo = @{@"conversationType":@(message.conversationType)};
                            [self comeUpLocalNotificationWith:body UserInfo:userInfo];//唤醒通知
                        } error:nil];
                        
                    }
                        break;
                    case RCSwichInvitationAccessNotification:
                    {
                        [[RCIMClient sharedRCIMClient] getDiscussion:message.targetId success:^(RCDiscussion *discussion) {
                            //讨论组加入权限的变更 创建者始终有权限 成员关闭后所有人将没有权限邀请
                            body = [NSString stringWithFormat:@"讨论组通知：%@ 关闭了 %@的好友邀请权限",discussionNotificationMSg.operatorId,discussion.discussionName];
                            NSDictionary *userInfo = @{@"conversationType":@(message.conversationType)};
                            [self comeUpLocalNotificationWith:body UserInfo:userInfo];//唤醒通知
                        } error:nil];
                        
                    }
                        break;
                        
                    default:
                        break;
                 }

            }else if ([message.content isKindOfClass:[RCTextMessage class]]){
                
                RCTextMessage *textMsg = (RCTextMessage *)message.content;
                NSString *body = [NSString stringWithFormat:@"%@：%@",textMsg.senderUserInfo.name,textMsg.content];
                NSDictionary *userInfo = @{@"conversationType":@(message.conversationType)};
                [self comeUpLocalNotificationWith:body UserInfo:userInfo];//唤醒通知
                
            }else if ([message.content isKindOfClass:[RCImageMessage class]]){
                RCImageMessage *imageMsg = (RCImageMessage *)message.content;
                NSString *body = [NSString stringWithFormat:@"%@：[图片]",imageMsg.senderUserInfo.name];
                NSDictionary *userInfo = @{@"conversationType":@(message.conversationType)};
                
                [self comeUpLocalNotificationWith:body UserInfo:userInfo];//唤醒通知
                
            }else if ([message.content isKindOfClass:[RCVoiceMessage class]]){
                RCVoiceMessage *voiceMsg = (RCVoiceMessage *)message.content;
                NSString *body = [NSString stringWithFormat:@"%@：[语音]",voiceMsg.senderUserInfo.name];
                NSDictionary *userInfo = @{@"conversationType":@(message.conversationType)};
                
                [self comeUpLocalNotificationWith:body UserInfo:userInfo];//唤醒通知
            }
            
            
        }else{
            //活跃
            
        }
        
        
        //主动发给js端推送
        [[NSNotificationCenter defaultCenter] postNotificationName:CDVIMPluginPushNotification object:message];
    }
  
    
    
    NSLog(@"还剩余的未接收的消息数：%d 本条消息类型:%li", nLeft,message.conversationType);
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
    NSDictionary *userInfo = notification.userInfo;
    RCConversationType type = [[userInfo objectForKey:@"conversationType"] integerValue];
    if (type==ConversationType_PRIVATE) {
        //这里要跳转到相应的界面 单聊
        NSDictionary *userInfo = notification.userInfo[@"senderUserInfo"];
        NSString *extara = notification.userInfo[@"extra"];
        NSMutableArray *telephones = (NSMutableArray *)[extara componentsSeparatedByString:@"|"];
        NSLog(@"--telephones:%@",telephones);
        for (id obj in telephones) {
            if ([telephones containsObject:@""]||[telephones containsObject:[NSNull null]]) {
                [telephones removeObject:obj];
            }
        }
        UINavigationController *nav = [[UINavigationController alloc] initWithTargetId:userInfo[@"userId"] FriendName:userInfo[@"name"] Icon:userInfo[@"portraitUri"] PhoneNumbers:telephones];
        
        [self.viewController presentViewController:nav animated:NO completion:nil];
    }else if (type==ConversationType_DISCUSSION){
        //讨论组
        //判断是通知类消息还是普通会话消息 回到根视图就可以
       
    }
}

@end
