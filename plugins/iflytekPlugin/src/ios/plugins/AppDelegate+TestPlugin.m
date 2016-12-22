//
//  AppDelegate+TestPlugin.m
//  芝士网
//
//  Created by wangsheng on 16/4/21.
//
//

#import "AppDelegate+TestPlugin.h"
#import "iflyMSC/IFlyMSC.h"
#import <objc/runtime.h>

@implementation AppDelegate (TestPlugin)

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
                                             selector:@selector(applicationDidLaunchVoiceRecognized:)
                                                 name:@"UIApplicationDidFinishLaunchingNotification"
                                               object:nil];//
    return [self initAddition];
   
}

-(void)applicationDidLaunchVoiceRecognized:(NSNotification *)notification
{
    
    NSLog(@"coem in");
    //设置sdk的log等级，log保存在下面设置的工作路径中
     //[IFlySetting setLogFile:LVL_ALL];
    
    //打开输出在console的log开关
    [IFlySetting showLogcat:NO];
    
    
    NSString *cachePath = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES)[0];
    [IFlySetting setLogFilePath:cachePath];
    
    //创建语音配置,appid必须要传入，仅执行一次则可
    NSString *initString = [[NSString alloc] initWithFormat:@"appid=%@", @"58043b21"];
    
    //所有服务启动前，需要确保执行createUtility
    [IFlySpeechUtility createUtility:initString];
    
}

@end
