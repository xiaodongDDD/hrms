//
//  CDVIMPlugin.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/11.
//
//

#import "CDVIMPlugin.h"
#import "CDVIMPluginChattingViewController.h"
@interface CDVIMPlugin ()

@end

@implementation CDVIMPlugin
//js初始化就要调用
-(void)getChatList:(CDVInvokedUrlCommand *)command
{
    NSString *userId = [command.arguments[0] objectForKey:@"userId"];
    NSString *token = [command.arguments[0] objectForKey:@"token"];
    if (![userId isEqualToString:[[NSUserDefaults standardUserDefaults] objectForKey:@"userId"]] && ![token isEqualToString:[[NSUserDefaults standardUserDefaults] objectForKey:@"token"]]) {
        [[NSUserDefaults standardUserDefaults] setObject:userId forKey:@"userId"];
        [[NSUserDefaults standardUserDefaults] setObject:token forKey:@"token"];
    }
}
//开启单人会话
- (void)toChatAct:(CDVInvokedUrlCommand *)command
{
    NSLog(@"openIMVC");
    NSString *friendId = command.arguments[0][@"friendId"];
    
    CDVIMPluginChattingViewController *cdvIMChattingVC = [[CDVIMPluginChattingViewController alloc] initWithConversationType:ConversationType_PRIVATE targetId:friendId];
    
    cdvIMChattingVC.navTitle = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:cdvIMChattingVC];
    [self.viewController presentViewController:nav animated:YES completion:nil];
}
@end
