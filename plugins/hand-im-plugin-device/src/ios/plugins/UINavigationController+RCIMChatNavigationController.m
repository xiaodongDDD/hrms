//
//  UINavigationController+RCIMChatNavigationController.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/1.
//
//

#import "UINavigationController+RCIMChatNavigationController.h"
#import "RCIMChattingViewController.h"

@implementation UINavigationController (RCIMChatNavigationController)

-(instancetype)initWithTargetId:(NSString *)targetId FriendName:(NSString *)name Icon:(NSString *)portrait PhoneNumbers:(NSArray *)numbers
{
    RCIMChattingViewController *chatVC = [[RCIMChattingViewController alloc] init];
    chatVC.target_id = targetId;
    chatVC.friendIcon = portrait;
    chatVC.navtitle = name;
    chatVC.phoneNums = numbers;
    UINavigationController *nav = self;
    NSLog(@"initWithTargetId:%@,chatVC.target_id:%@",targetId,chatVC.target_id);
    nav = [self initWithRootViewController:chatVC];
    return nav;
}

- (UIViewController *)childViewControllerForStatusBarStyle
{
    return self.topViewController;
}
@end
