//
//  CustomRCCall.h
//  RongCloudDemo
//
//  Created by xiaowei on 16/10/2.
//  Copyright © 2016年 dlz. All rights reserved.
//

#import <RongCallKit/RongCallKit.h>
#import <RongCallLib/RongCallLib.h>

#import <RongCallKit/RCCallBaseViewController.h>


@interface CustomRCCall : RCCall<RCCallReceiveDelegate>

+ (instancetype)sharedRCCall;
- (NSURLSessionTask *)postWithUrl:(NSString *)url Params:(id)params success:(void (^)(id response))success failure:(void (^)(NSError *error))failure;


- (void)startMultiCall:(RCConversationType)conversationType
              targetId:(NSString *)targetId
             mediaType:(RCCallMediaType)mediaType;

- (void)loadErrorAlertWithConfirm:(NSString *)title
                          message:(NSString *)message;


@end


@interface CatchCrash : NSObject

void uncaughtExceptionHandle(NSException *exception);


@end















