//
//  CDVIMPlugin.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/11.
//
//

#import "CDVIMPlugin.h"
#import "CDVIMPluginChattingViewController.h"
#import "DataBaseTool.h"
#import "CVDPlugin-Bridging-Header.h"

@interface CDVIMPlugin ()
{
    UINavigationController *nav;
}

@end

@implementation CDVIMPlugin

//js初始化就要调用
-(void)getChatList:(CDVInvokedUrlCommand *)command
{
    NSString *userId = [command.arguments[0] objectForKey:@"userId"];
    NSString *token = [command.arguments[0] objectForKey:@"token"];
    if (![userId isEqualToString:[[NSUserDefaults standardUserDefaults] objectForKey:@"userId"]]|| ![token isEqualToString:[[NSUserDefaults standardUserDefaults] objectForKey:@"token"]]) {
        [[NSUserDefaults standardUserDefaults] setObject:userId forKey:@"userId"];
        [[NSUserDefaults standardUserDefaults] setObject:token forKey:@"token"];
    }
}


//开启单人会话
- (void)toChatAct:(CDVInvokedUrlCommand *)command
{
   // NSLog(@"openIMVC");
      NSString *friendId = command.arguments[0][@"friendId"];
      NSString *friendName = command.arguments[0][@"friendName"];
    CDVIMPluginChattingViewController *cdvIMChattingVC = [[CDVIMPluginChattingViewController alloc] initWithConversationType:ConversationType_PRIVATE targetId:friendName];
    nav = [[UINavigationController alloc] initWithRootViewController:cdvIMChattingVC];
     cdvIMChattingVC.targetId = friendId;
     cdvIMChattingVC.navTitle = friendName;
    
    //自定义push动画
    CATransition *animation = [CATransition animation];
    animation.duration = 0.3;
    [animation setTimingFunction:[CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseInEaseOut]];
    animation.type = kCATransitionFade;
    animation.subtype = kCATransitionFromRight;
    
    [animation setFillMode:kCAFillModeBackwards];
    animation.removedOnCompletion = YES;
    [self.viewController.view.superview.layer addAnimation:animation forKey:@"animation"];
    
    [self.viewController.view addSubview:nav.view];
    
    //   [self.viewController presentViewController:nav animated:NO completion:nil];
    
}


-(void)returnConversationList:(CDVInvokedUrlCommand *)command
{
    NSLog(@"returnConversationList");
    NSLog(@"----数据库---%@",[DataBaseTool getAllMessagesData]);
    CDVPluginResult *result;
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"message":[DataBaseTool getAllMessagesData]}];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    
}

-(void)deleteConversationList:(CDVInvokedUrlCommand *)command
{
    NSLog(@"删除接口");
    NSString *friendId = [command arguments][0];
    CDVPluginResult *result;
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"success":@"success"}];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    [DataBaseTool deleteDataListBy:friendId];
}
#ifdef __CORDOVA_4_0_0

- (void)pluginInitialize {
    NSLog(@"### pluginInitialize ");
    [self initNotifications];
}

#else

- (CDVPlugin*)initWithWebView:(UIWebView*)theWebView{
    NSLog(@"### initWithWebView ");
    if (self=[super initWithWebView:theWebView]) {
        [self initNotifications];
    }
    return self;
}


#endif
-(void)initNotifications {
    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    [defaultCenter addObserver:self
                      selector:@selector(IMPluginDidReceiveMessage:)
                          name:CDVIMPluginPushNotification
                        object:nil];
    NSLog(@"come initNotifications");
    
}

- (void)IMPluginDidReceiveMessage:(NSNotification *)notification
{
    NSLog(@"come IMPluginDidReceiveMessage");
    
    NSData *jsonStrData = [NSJSONSerialization dataWithJSONObject:@{@"messages":[DataBaseTool getAllMessagesData]} options:NSJSONWritingPrettyPrinted error:nil];
    NSString *jsonStr = [[NSString alloc] initWithData:jsonStrData encoding:NSUTF8StringEncoding];
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.commandDelegate evalJs:[NSString stringWithFormat:@"cordova.fireDocumentEvent('IMPush.openNotification',%@)",jsonStr]];
        
    });
}

@end
