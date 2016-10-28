//
//  PushPKRegistryDelegate.h
//  OneCallKitDemo
//
//  Created by wintel on 16/10/02.
//  Copyright © 2016年 wintel. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <PushKit/PushKit.h>

@interface PushPKRegistryDelegate : NSObject <PKPushRegistryDelegate>

@property (strong, nonatomic) PKPushRegistry *pushRegistry;

@end
