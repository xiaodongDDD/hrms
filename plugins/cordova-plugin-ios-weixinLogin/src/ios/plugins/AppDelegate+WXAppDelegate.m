//
//  AppDelegate+WXAppDelegate.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/9.
//
//

#import "AppDelegate+WXAppDelegate.h"
#import "MainViewController.h"
#import "WXOAuthEngine.h"
#import <objc/runtime.h>

@implementation AppDelegate (WXAppDelegate)

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
                                             selector:@selector(applicationDidLaunch:)
                                                 name:@"UIApplicationDidFinishLaunchingNotification"
                                               object:nil];//UIApplicationOpenURLOptionsSourceApplicationKey
    return [self initAddition];
    
}

-(void)applicationDidLaunch:(NSNotification *)notification
{
    //NSLog(@"registerApp");
    [WXApi registerApp:WXAppKey withDescription:@"weixin"];
}
//ios 9之前
- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url
{
    if ([url.scheme isEqualToString:[NSString stringWithFormat:@"%@",WXAppKey]]) {
        return  [WXApi handleOpenURL:url delegate:[WXOAuthEngine shared]];
    }
    return YES;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
    if ([url.scheme isEqualToString:[NSString stringWithFormat:@"%@",WXAppKey]]) {
        return  [WXApi handleOpenURL:url delegate:[WXOAuthEngine shared]];
    }
    return YES;
}

//UIApplicationOpenURLOptionsSourceApplicationKey // Keys for application:openURL:options:
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary*)options {
    
    if ([url.scheme isEqualToString:[NSString stringWithFormat:@"%@",WXAppKey]]) {
        return  [WXApi handleOpenURL:url delegate:[WXOAuthEngine shared]];
    }
    return YES;
}

@end
