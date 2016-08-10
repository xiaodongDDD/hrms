//
//  CDVIMPluginChattingViewController.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/11.
//
//

#import <RongIMKit/RongIMKit.h>
@protocol CDVIMPluginChattingViewControllerDelegate <NSObject>
@optional
- (void)viewControllerDismiss;
@end
@interface CDVIMPluginChattingViewController : RCConversationViewController
@property (nonatomic,copy)NSString *navTitle;
@property (nonatomic,strong)id<CDVIMPluginChattingViewControllerDelegate>delegate;
//@property (nonatomic,copy)NSString *friendIcon;
//@property (nonatomic,copy)NSString *friendName;
@end
