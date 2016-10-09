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

@end
