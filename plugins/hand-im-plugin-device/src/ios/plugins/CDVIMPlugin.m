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
@interface CDVIMPlugin ()

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
    //    NSLog(@"openIMVC");
    NSString *friendId = command.arguments[0][@"friendId"];
    NSString *friendName = command.arguments[0][@"friendName"];
    CDVIMPluginChattingViewController *cdvIMChattingVC = [[CDVIMPluginChattingViewController alloc] initWithConversationType:ConversationType_PRIVATE targetId:friendId];
    cdvIMChattingVC.targetId = friendId;
    cdvIMChattingVC.navTitle = friendName;
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:cdvIMChattingVC];

    //自定义push动画
    CATransition *animation = [CATransition animation];
    animation.duration = 0.3;
    [animation setTimingFunction:[CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionDefault]];
    animation.type = kCATransitionPush;
    animation.subtype = kCATransitionFromRight;
    [self.webView.layer addAnimation:animation forKey:nil];

    [self.viewController presentViewController:nav animated:NO completion:nil];

}

- (void)returnConversationList:(CDVInvokedUrlCommand *)command
{
    NSLog(@"returnConversationList");
    //  NSLog(@"----数据库---%@",[DataBaseTool getAllData]);
    CDVPluginResult *result;
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"message":[DataBaseTool getAllData]}];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

@end
