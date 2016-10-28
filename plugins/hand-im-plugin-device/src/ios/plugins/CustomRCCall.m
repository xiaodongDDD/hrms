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

#import "CVDPlugin-Bridging-Header.h"

#define AlertWithoutConfirm 1000
#define AlertWithConfirm 1001

#import "CustomSelectMemberController.h"


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

#pragma mark 发起多人通话
- (void)startMultiCall:(RCConversationType)conversationType
              targetId:(NSString *)targetId
             mediaType:(RCCallMediaType)mediaType {
    if ([self preCheckForStartCall:mediaType]) {
        [self checkSystemPermission:mediaType
                            success:^{
                                [self startSelectMemberViewContoller:conversationType
                                                            targetId:targetId
                                                           mediaType:mediaType];
                            }];
    }
}
- (void)startSelectMemberViewContoller:(RCConversationType)conversationType
                              targetId:(NSString *)targetId
                             mediaType:(RCCallMediaType)mediaType {
    if (conversationType == ConversationType_DISCUSSION ||
        conversationType == ConversationType_GROUP) {
        typeof(self) weakSelf = self;
        CustomSelectMemberController *voipCallSelectViewController =
        [[CustomSelectMemberController alloc]
         initWithConversationType:conversationType
         targetId:targetId
         mediaType:mediaType
         exist:@[
                 [RCIMClient sharedRCIMClient]
                 .currentUserInfo.userId
                 ]
         success:^(NSArray *addUserIdList) {
             [weakSelf
              startMultiCallViewController:conversationType
              targetId:targetId
              mediaType:mediaType
              userIdList:addUserIdList];
         }];
        
        [self presentCallViewController:voipCallSelectViewController];
    }
}

- (void)startMultiCallViewController:(RCConversationType)conversationType
                            targetId:(NSString *)targetId
                           mediaType:(RCCallMediaType)mediaType
                          userIdList:(NSArray *)userIdList {
    if (mediaType == RCCallMediaAudio) {
        UIViewController *audioCallViewController =
        [[RCCallAudioMultiCallViewController alloc]
         initWithOutgoingCall:conversationType
         targetId:targetId
         userIdList:userIdList];
        
        [self presentCallViewController:audioCallViewController];
    } else {
        RCCallVideoMultiCallViewController *videoCallViewController =
        [[RCCallVideoMultiCallViewController alloc]
         initWithOutgoingCall:conversationType
         targetId:targetId
         mediaType:mediaType
         userIdList:userIdList];
        
        [self presentCallViewController:videoCallViewController];
    }
}

- (void)checkSystemPermission:(RCCallMediaType)mediaType
                      success:(void (^)())successBlock {
    if (mediaType == RCCallMediaVideo) {
        [self checkCapturePermission:^(BOOL granted) {
            if (granted) {
                [self checkRecordPermission:^() {
                    successBlock();
                }];
            }
        }];
        
    } else if (mediaType == RCCallMediaAudio) {
        [self checkRecordPermission:^() {
            successBlock();
        }];
    }
}

- (void)checkRecordPermission:(void (^)())successBlock {
    if ([[AVAudioSession sharedInstance]
         respondsToSelector:@selector(requestRecordPermission:)]) {
        [[AVAudioSession sharedInstance] requestRecordPermission:^(BOOL granted) {
            dispatch_async(dispatch_get_main_queue(), ^{
                if (granted) {
                    successBlock();
                } else {
                    [self loadErrorAlertWithConfirm:NSLocalizedStringFromTable(
                                                                               @"AccessRightTitle",
                                                                               @"RongCloudKit", nil)
                                            message:NSLocalizedStringFromTable(
                                                                               @"speakerAccessRight",
                                                                               @"RongCloudKit", nil)];
                }
            });
        }];
    }
}

- (void)checkCapturePermission:(void (^)(BOOL granted))complete {
    AVAuthorizationStatus authStatus =
    [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    
    if (authStatus == AVAuthorizationStatusDenied ||
        authStatus == AVAuthorizationStatusRestricted) {
        [self
         loadErrorAlertWithConfirm:NSLocalizedStringFromTable(
                                                              @"AccessRightTitle", @"RongCloudKit", nil)
         message:NSLocalizedStringFromTable(
                                            @"cameraAccessRight", @"RongCloudKit",
                                            nil)];
        complete(NO);
    } else if (authStatus == AVAuthorizationStatusNotDetermined) {
        [AVCaptureDevice
         requestAccessForMediaType:AVMediaTypeVideo
         completionHandler:^(BOOL granted) {
             if (!granted) {
                 [self loadErrorAlertWithConfirm:NSLocalizedStringFromTable(
                                                                            @"AccessRightTitle",
                                                                            @"RongCloudKit", nil)
                                         message:NSLocalizedStringFromTable(
                                                                            @"cameraAccessRight",
                                                                            @"RongCloudKit", nil)];
             }
             complete(granted);
         }];
    } else {
        complete(YES);
    }
}

- (BOOL)preCheckForStartCall:(RCCallMediaType)mediaType {
    RCCallSession *currentCallSession = [RCCall sharedRCCall].currentCallSession;
    if (currentCallSession && currentCallSession.mediaType == RCCallMediaAudio) {
        [self loadErrorAlertWithoutConfirm:NSLocalizedStringFromTable(
                                                                      @"VoIPAudioCallExistedWarning",
                                                                      @"RongCloudKit", nil)];
        return NO;
    } else if (currentCallSession &&
               currentCallSession.mediaType == RCCallMediaVideo) {
        
        [self loadErrorAlertWithoutConfirm:NSLocalizedStringFromTable(
                                                                      @"VoIPVideoCallExistedWarning",
                                                                      @"RongCloudKit", nil)];
        return NO;
    } else {
        return YES;
    }
}

- (void)loadErrorAlertWithConfirm:(NSString *)title
                          message:(NSString *)message {
    UIAlertView *alert = [[UIAlertView alloc]
                          initWithTitle:title
                          message:message
                          delegate:nil
                          cancelButtonTitle:NSLocalizedStringFromTable(@"OK", @"RongCloudKit", nil)
                          otherButtonTitles:nil];
    alert.tag = AlertWithConfirm;
    [alert show];
}
- (void)loadErrorAlertWithoutConfirm:(NSString *)title {
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:title
                                                    message:nil
                                                   delegate:nil
                                          cancelButtonTitle:nil
                                          otherButtonTitles:nil];
    alert.tag = AlertWithoutConfirm;
    [NSTimer scheduledTimerWithTimeInterval:1.0f
                                     target:self
                                   selector:@selector(cancelAlert:)
                                   userInfo:alert
                                    repeats:NO];
    [alert show];
}

- (void)cancelAlert:(NSTimer *)scheduledTimer {
    UIAlertView *alert = (UIAlertView *)(scheduledTimer.userInfo);
    if (alert.tag == AlertWithoutConfirm) {
        [alert dismissWithClickedButtonIndex:0 animated:NO];
    }
}

#pragma mark  接收通话
/*!
 接收到通话呼入的回调
 
 @param callSession 呼入的通话实体
 */
- (void)didReceiveCall:(RCCallSession *)callSession{
    
    if (callSession.conversationType == ConversationType_PRIVATE) {
        if([[UIDevice currentDevice]systemVersion].floatValue<10.0f){
            RCCallSingleCallViewController *singleCallViewController =
            [[RCCallSingleCallViewController alloc]
             initWithIncomingCall:callSession];
            [self presentCallViewController:singleCallViewController];
        }else{
#pragma mark  CallKit
            BOOL isVideo = (callSession.mediaType == RCCallMediaAudio)?NO:YES;
            NSUUID *uuid = [[NSUUID alloc] init];
            [[NSUserDefaults standardUserDefaults] setObject:[uuid UUIDString] forKey:@"kuuid"];
            UIBackgroundTaskIdentifier backgroundTaskIdentifier = [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:nil];
            //获取用户名
            [self postWithUrl:[NSString stringWithFormat:@"%@access_token=%@",localService,[[NSUserDefaults standardUserDefaults]objectForKey:@"access_token"]] Params:@{@"key":callSession.targetId} success:^(id response) {
                
                NSArray *rows = response[@"rows"];
                NSDictionary *dic = [rows lastObject];
                NSString *userName = dic[@"emp_name"];
                if(userName){
                    dispatch_async(dispatch_get_main_queue(), ^{
                        [[AppDelegate sharedDelegate] displayIncomingCallUUID:uuid handle:userName hasVideo:isVideo completion:^(NSError * _Nullable error) {
                            [[UIApplication sharedApplication] endBackgroundTask:backgroundTaskIdentifier];
                        }];
                    });
                }
            } failure:^(NSError *error) {
                NSLog(@"this is a failure error");
                [[AppDelegate sharedDelegate] displayIncomingCallUUID:uuid handle:[NSString stringWithFormat:@"汉得内部(%@)",callSession.targetId] hasVideo:NO completion:^(NSError * _Nullable error) {
                    [[UIApplication sharedApplication] endBackgroundTask:backgroundTaskIdentifier];
                }];
                
            }];
        }
        
    } else {
#pragma mark 群组聊天
        //NSString *path = [NSString stringWithFormat:@"%@/hrmsv2/v2/api/staff/detailList?access_token=%@",rootService,access_token];
        NSMutableArray *userList = [NSMutableArray array];
        
        for (RCCallUserProfile *profile in callSession.userProfileList) {
            NSString *userId = profile.userId;
            NSDictionary *userDic = @{@"key":userId};
            
            [userList addObject:userDic];
        }
        
        [self postWithUrl:[NSString stringWithFormat:@"%@/hrmsv2/v2/api/staff/detailList?access_token=%@",rootService,[[NSUserDefaults standardUserDefaults]objectForKey:@"access_token"]] Params:userList success:^(id response) {
            NSArray *list = response[@"rows"];
            NSMutableString *mutableString = [NSMutableString string];
            for (NSInteger i=0; i<list.count; i++) {
                NSDictionary *dic = list[i];
                if(i<list.count-1){
                    [mutableString appendString:[NSString stringWithFormat:@"%@,",dic[@"emp_name"]]];
                }else{
                    [mutableString appendString:dic[@"emp_name"]];
                }
            }
            
            [self displayMultCallWithSession:callSession title:mutableString];
            
        } failure:^(NSError *error) {
            [self displayMultCallWithSession:callSession title:@"汉得内部讨论组"];
        }];
        
        
    }
}


- (void)displayMultCallWithSession:(RCCallSession *)callSession title:(NSString *)title{
    
    if (callSession.mediaType == RCCallMediaAudio) {
        if([[UIDevice currentDevice]systemVersion].floatValue<10.0f){
            
            RCCallAudioMultiCallViewController *multiCallViewController =
            [[RCCallAudioMultiCallViewController alloc]
             initWithIncomingCall:callSession];
            [self presentCallViewController:multiCallViewController];
        }else{
            NSUUID *uuid = [[NSUUID alloc] init];
            [[NSUserDefaults standardUserDefaults] setObject:[uuid UUIDString] forKey:@"kuuid"];
            UIBackgroundTaskIdentifier backgroundTaskIdentifier = [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:nil];
            
            [[AppDelegate sharedDelegate] displayMultableIncomingCallUUID:uuid handle:title hasVideo:NO completion:^(NSError * _Nullable error) {
                [[UIApplication sharedApplication] endBackgroundTask:backgroundTaskIdentifier];
            }];
        }
    } else {
        
        if([[UIDevice currentDevice] systemVersion].floatValue<10.0f){
            
            RCCallVideoMultiCallViewController *multiCallViewController =
            [[RCCallVideoMultiCallViewController alloc]
             initWithIncomingCall:callSession];
            
            [self presentCallViewController:multiCallViewController];
        }else{
            NSUUID *uuid = [[NSUUID alloc] init];
            [[NSUserDefaults standardUserDefaults] setObject:[uuid UUIDString] forKey:@"kuuid"];
            UIBackgroundTaskIdentifier backgroundTaskIdentifier = [[UIApplication sharedApplication] beginBackgroundTaskWithExpirationHandler:nil];
            
            [[AppDelegate sharedDelegate] displayMultableIncomingCallUUID:uuid handle:title hasVideo:YES completion:^(NSError * _Nullable error) {
                [[UIApplication sharedApplication] endBackgroundTask:backgroundTaskIdentifier];
            }];
        }
        
    }
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
    
    
    if([[UIDevice currentDevice]systemVersion].floatValue<10.0){
        UILocalNotification *callNotification = [[UILocalNotification alloc] init];
        callNotification.alertAction = NSLocalizedStringFromTable(
                                                                  @"LocalNotificationShow", @"RongCloudKit", nil);
        [self postWithUrl:[NSString stringWithFormat:@"%@access_token=%@",localService,[[NSUserDefaults standardUserDefaults]objectForKey:@"access_token"]] Params:@{@"key":inviterUserId} success:^(id response) {
            NSArray *personList = response[@"rows"];
            NSDictionary *dic = [personList firstObject];
            NSString *inviterUserName = dic[@"emp_name"];
            if (mediaType == RCCallMediaAudio) {
                if (inviterUserName) {
                    callNotification.alertBody = [NSString
                                                  stringWithFormat:@"%@%@", inviterUserName,
                                                  NSLocalizedStringFromTable(@"VoIPAudioCallIncoming",
                                                                             @"RongCloudKit", nil)];
                } else {
                    callNotification.alertBody = [NSString
                                                  stringWithFormat:@"[%@]", NSLocalizedStringFromTable(
                                                                                                       @"VoIPAudioCallIncomingWithoutUserName",
                                                                                                       @"RongCloudKit", nil)];
                    ;
                }
            } else {
                if (inviterUserName) {
                    callNotification.alertBody = [NSString
                                                  stringWithFormat:@"%@%@", inviterUserName,
                                                  NSLocalizedStringFromTable(@"VoIPVideoCallIncoming",
                                                                             @"RongCloudKit", nil)];
                } else {
                    callNotification.alertBody = [NSString
                                                  stringWithFormat:@"[%@]", NSLocalizedStringFromTable(
                                                                                                       @"VoIPVideoCallIncomingWithoutUserName",
                                                                                                       @"RongCloudKit", nil)];
                }
            }
            
            callNotification.userInfo = userDict;
            callNotification.soundName = @"RongCloud.bundle/voip/voip_call.caf";
            
            // VoIP Push和接收消息的通话排重
            for (UILocalNotification *notification in self.locationNotificationList) {
                if ([notification.userInfo[@"appData"][@"callId"] isEqualToString:callId]) {
                    return;
                }
            }
            
            [self.locationNotificationList addObject:callNotification];
            [[UIApplication sharedApplication]
             presentLocalNotificationNow:callNotification];
            
        } failure:^(NSError *error) {
            NSLog(@"查询用户名失败!");
        }];
        
    }
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
    if([[UIDevice currentDevice] systemVersion].floatValue>=10.0f){
        WTCallManager *manager = [WTCallManager shareInstance];
        WTCall *call = [manager callWithUUID:[[NSUUID alloc]initWithUUIDString:[[NSUserDefaults standardUserDefaults]objectForKey:@"kuuid"]]];
        [manager removeAllCalls];
        [call endWTCallCall];
        [self dismissCallViewController:[UIApplication sharedApplication].keyWindow.rootViewController];
    }
}

//网络请求
- (NSURLSessionTask *)postWithUrl:(NSString *)url Params:(id)params success:(void (^)(id response))success failure:(void (^)(NSError *error))failure{
    
    //    NSString *access_tokenString = [[NSUserDefaults standardUserDefaults]objectForKey:@"?access_token="];
    //    NSString *baseUrl = [NSString stringWithFormat:@"%@%@",url,access_tokenString];
    NSURL *urlstring = [NSURL URLWithString:url];
    NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:urlstring];
    [urlRequest setHTTPMethod:@"POST"];
    //    NSDictionary *requestBody = params;
    [urlRequest setHTTPBody:[NSJSONSerialization dataWithJSONObject:params options:NSJSONWritingPrettyPrinted error:nil]];
    NSDictionary *headers = @{@"content-type": @"application/json"};
    [urlRequest setAllHTTPHeaderFields:headers];
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            
            success(json);
        }else{
            failure(error);
        }
    }];
    [dataTask resume];
    return dataTask;
}



@end

#pragma mark 闪退日志监听

@implementation CatchCrash

//捕获程序闪退日志并发送至服务器
void uncaughtExceptionHandle(NSException *exception){
    
    NSArray *stackArray = [exception callStackSymbols];
    
    NSString *name = [exception name];
    
    NSString *reason = [exception reason];
    
    NSString *exceptionString = [NSString stringWithFormat:@"Exception reason:%@,\n Exception name:%@,\n stack:%@",reason,name,stackArray];
    [[NSUserDefaults standardUserDefaults] setObject:exceptionString forKey:@"ExceptionError"];
    NSLog(@"%@",exceptionString);
    
    NSDate *date = [NSDate date];
    NSDateFormatter *formater = [[NSDateFormatter alloc]init];
    [formater setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    NSString *dateString = [formater stringFromDate:date];
    //将crash写入到本地
    [exceptionString writeToFile:[NSString stringWithFormat:@"%@/Document/crash/%@.txt",NSHomeDirectory(),dateString] atomically:YES encoding:NSUTF8StringEncoding error:nil];
    NSLog(@"path = %@",[NSString stringWithFormat:@"%@/Document/%@.txt",NSHomeDirectory(),dateString]);
}

@end













