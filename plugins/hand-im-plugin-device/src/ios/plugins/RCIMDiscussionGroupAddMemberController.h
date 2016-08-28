//
//  RCIMDiscussionGroupAddMemberController.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/19.
//
//

#import <UIKit/UIKit.h>

@protocol RCIMDiscussionGroupAddMemberControllerDelegate <NSObject>

@optional
- (void)returnALlDiscussionGroupMembers:(NSMutableArray *)members;
@end
@interface RCIMDiscussionGroupAddMemberController : UIViewController
@property (nonatomic,copy)NSString *discussionId;
@property (nonatomic,strong)id<RCIMDiscussionGroupAddMemberControllerDelegate>delegate;
@end
