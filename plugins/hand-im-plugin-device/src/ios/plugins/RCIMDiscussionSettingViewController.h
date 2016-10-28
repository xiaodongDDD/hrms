//
//  RCIMDiscussionSettingViewController.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/18.
//
//

#import <UIKit/UIKit.h>

@protocol RCIMDiscussionSettingViewControllerDelegate <NSObject>
@optional
//退出讨论组
- (void)removeAllChattingRecorder;
@end
@interface RCIMDiscussionSettingViewController : UITableViewController
@property (nonatomic,copy)NSString *discussionId;
@property (nonatomic,strong)NSArray *discussionMembersInfo;
@property (nonatomic,strong)id<RCIMDiscussionSettingViewControllerDelegate>delegate;
@end
