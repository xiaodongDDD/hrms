//
//  CustomRCCall.m
//  RongCloudDemo
//
//  Created by xiaowei on 16/10/2.
//  Copyright © 2016年 dlz. All rights reserved.
//

#import "CustomRCCall.h"
#import <AVFoundation/AVFoundation.h>
#import "WTCallManager.h"
#import "AppDelegate+CDVIMPlugin.h"
@interface CustomRCCall ()

@property(nonatomic, strong) NSMutableDictionary *alertInfoDic;
@property(nonatomic, strong) AVAudioPlayer *audioPlayer;
@property(nonatomic, strong) NSMutableArray *callWindows;
@property(nonatomic, strong) NSMutableArray *locationNotificationList;

@end


@implementation CustomRCCall

+ (instancetype)sharedRCCall {
    static CustomRCCall *pRongVoIP;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        if (pRongVoIP == nil) {
            pRongVoIP = [[CustomRCCall alloc] init];
            [[RCCallClient sharedRCCallClient] setDelegate:pRongVoIP];
            pRongVoIP.maxMultiAudioCallUserNumber = 20;
            pRongVoIP.maxMultiVideoCallUserNumber = 9;
            pRongVoIP.callWindows = [[NSMutableArray alloc] init];
            pRongVoIP.locationNotificationList = [[NSMutableArray alloc] init];
        }
    });
    return pRongVoIP;
}



/*!
 接收到通话呼入的回调
 
 @param callSession 呼入的通话实体
 */
- (void)didReceiveCall:(RCCallSession *)callSession{
    
    NSUUID *uuid = [[NSUUID alloc] init];
    [[NSUserDefaults standardUserDefaults] setObject:[uuid UUIDString] forKey:@"kuuid"];
//    [[NSUserDefaults standardUserDefaults] setObject:@[callSession] forKey:@"kCallSession"];
    UIBackgroundTaskIdentifier backgroundTaskIdentifier = [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:nil];
    
    [[AppDelegate sharedDelegate] displayIncomingCallUUID:uuid handle:callSession.targetId hasVideo:NO completion:^(NSError * _Nullable error) {
        [[UIApplication sharedApplication] endBackgroundTask:backgroundTaskIdentifier];
    }];
    
}

/*!
 接收到通话呼入的远程通知的回调
 
 @param callId        呼入通话的唯一值
 @param inviterUserId 通话邀请者的UserId
 @param mediaType     通话的媒体类型
 @param userIdList    被邀请者的UserId列表
 @param userDict      远程推送包含的其他扩展信息
 */
- (void)didReceiveCallRemoteNotification:(NSString *)callId
                           inviterUserId:(NSString *)inviterUserId
                               mediaType:(RCCallMediaType)mediaType
                              userIdList:(NSArray *)userIdList
                                userDict:(NSDictionary *)userDict{
    
    
    //    NSUUID *uuid = [[NSUUID alloc] init];
//    [[NSUserDefaults standardUserDefaults] setObject:[uuid UUIDString] forKey:@"kuuid"];
//    UIBackgroundTaskIdentifier backgroundTaskIdentifier = [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:nil];
    /*
    [[AppDelegate sharedDelegate] displayRemoteCallUUID:uuid handle:@"xiaowei" hasVideo:NO completion:^(NSError * _Nullable error) {
        [[UIApplication sharedApplication] endBackgroundTask:backgroundTaskIdentifier];
    }];
     */
//    [[AppDelegate sharedDelegate] displayIncomingCallUUID:uuid handle:@"xiaowei" hasVideo:NO completion:^(NSError * _Nullable error) {
//        [[UIApplication sharedApplication] endBackgroundTask:backgroundTaskIdentifier];
//    }];
    
}

/*!
 接收到取消通话的远程通知的回调
 
 @param callId        呼入通话的唯一值
 @param inviterUserId 通话邀请者的UserId
 @param mediaType     通话的媒体类型
 @param userIdList    被邀请者的UserId列表
 */
- (void)didCancelCallRemoteNotification:(NSString *)callId
                          inviterUserId:(NSString *)inviterUserId
                              mediaType:(RCCallMediaType)mediaType
                             userIdList:(NSArray *)userIdList{
    
    for (UILocalNotification *notification in self.locationNotificationList) {
        if ([notification.userInfo[@"appData"][@"callId"] isEqualToString:callId]) {
            [[UIApplication sharedApplication] cancelLocalNotification:notification];
            [self.locationNotificationList removeObject:notification];
            break;
        }
    }
    
    WTCallManager *manager = [WTCallManager shareInstance];
    WTCall *call = [manager callWithUUID:[[NSUUID alloc]initWithUUIDString:[[NSUserDefaults standardUserDefaults]objectForKey:@"kuuid"]]];
    [manager removeAllCalls];
    [call endWTCallCall];
    
}



@end
