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
#import "CDVIMPluginChattingViewController.h"

static UILocalNotification *localNotification;
static NSString *token;
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
                                             selector:@selector(applicationIMDidLaunch:)
                                                name:@"UIApplicationDidFinishLaunchingNotification"
                                               object:nil];

    return [self initAddition];

}

- (void)applicationIMDidLaunch:(NSNotification *)notification
{
    [[RCIM sharedRCIM] initWithAppKey:appKey];
    [[RCIM sharedRCIM] setReceiveMessageDelegate:self];
    [self loginRongCloud];

    if ([UIDevice currentDevice].systemVersion.floatValue >= 8.0) {
        //注册推送, iOS8 以后
        UIUserNotificationSettings *settings = [UIUserNotificationSettings

                                                settingsForTypes:(UIUserNotificationTypeBadge |

                                                                  UIUserNotificationTypeSound |

                                                                  UIUserNotificationTypeAlert)

                                                categories:nil];

        [[UIApplication sharedApplication] registerUserNotificationSettings:settings];

    }else{

        UIRemoteNotificationType myTypes = UIRemoteNotificationTypeBadge |

        UIRemoteNotificationTypeAlert |

        UIRemoteNotificationTypeSound;

        [[UIApplication sharedApplication] registerForRemoteNotificationTypes:myTypes];
    }

        //融云即时通讯
        [[NSNotificationCenter defaultCenter]addObserver:self selector:@selector(didReceiveMessageNotification:)
     name:RCKitDispatchMessageNotification
     object:nil];

    [[RCIM sharedRCIM] setConnectionStatusDelegate:self];

}
//程序一启动就连接融云服务器
-(void)loginRongCloud
{
    NSString *token = [[NSUserDefaults standardUserDefaults] objectForKey:@"token"];
    [[RCIM sharedRCIM] connectWithToken:token success:^(NSString *userId) {
        //设置用户信息提供者,页面展现的用户头像及昵称都会从此代理取
        //   [[RCIM sharedRCIM] setUserInfoDataSource:self];
        NSLog(@"Login successfully with userId: %@", userId);
    } error:^(RCConnectErrorCode status) {
        NSLog(@"login error status: %ld.", (long)status);
    } tokenIncorrect:^{
        NSLog(@"token 无效 ，请确保生成token 使用的appkey 和初始化时的appkey 一致");
    }];

}

- (void)didReceiveMessageNotification:(NSNotification *)notification
{
//    NSLog(@"10101收到新消息了:%@",[notification.object senderUserId]);jsonDict

 //   if ([UIApplication sharedApplication].applicationState == UIApplicationStateBackground) {
        localNotification = [[UILocalNotification alloc]init];
        [localNotification setAlertBody:[NSString stringWithFormat:@"您收到了一条来自%@新消息",[notification.object senderUserId]]];
        [localNotification setAlertTitle:[[NSBundle mainBundle] infoDictionary][@"CFBundleDisplayName"]];
        [localNotification setFireDate:[NSDate date]];
        [localNotification setSoundName:UILocalNotificationDefaultSoundName];
        //UIApplication启动通知
        [[UIApplication sharedApplication]scheduleLocalNotification:localNotification];

 //   }
}

//这个方法是当用户点击了通知栏里的通知才会调用
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
{
    NSLog(@"didReceiveLocalNotification");
    CDVIMPluginChattingViewController *cdvIMChattingVC = [[CDVIMPluginChattingViewController alloc] initWithConversationType:ConversationType_PRIVATE targetId:token];
    cdvIMChattingVC.navTitle = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:cdvIMChattingVC];
    [self.viewController presentViewController:nav animated:YES completion:nil];
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

- (void)onRCIMReceiveMessage:(RCMessage *)message
                        left:(int)left
{
    NSLog(@"RCIMReceiveMessage:%@,%d",message,left);
    if (left==0) {
        NSLog(@"left==0");
    }
}

@end
