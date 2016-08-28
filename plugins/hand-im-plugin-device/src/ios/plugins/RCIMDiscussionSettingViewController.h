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
- (void)removeAllChattingRecorder;
@end
@interface RCIMDiscussionSettingViewController : UITableViewController
@property (nonatomic,copy)NSString *discussionName;
@property (nonatomic,strong)NSMutableArray *members;
@property (nonatomic,copy)NSString *discussionId;
@property (nonatomic,strong)id<RCIMDiscussionSettingViewControllerDelegate>delegate;
@end
