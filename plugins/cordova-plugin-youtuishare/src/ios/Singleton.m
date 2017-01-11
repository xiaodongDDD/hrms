//
//  Singleton.m
//  youtuiShareDemo
//
//  Created by FreeGeek on 15-1-13.
//  Copyright (c) 2015年 FreeGeek. All rights reserved.
//

#import "Singleton.h"

@implementation Singleton
static Singleton * singleton;
+(Singleton *)ObtainSingletonObject
{
    if (singleton == nil)
    {
        singleton = [[Singleton alloc]init];
    }
    return singleton;
}
@end
