//
//  RCIMDiscussionGroupAddMemberFromProjectVC.h
//  汉得移动测试版
//
//  Created by wangsheng on 16/9/22.
//
//

#import <UIKit/UIKit.h>

@protocol RCIMDiscussionGroupAddMemberFromProjectVCDelagete <NSObject>

@optional
- (void)RCIMDiscussionGroupAddMemberFromProjectVCDidSelected:(NSArray *)persons TotalInvitedNum:(NSInteger)totalNum IsSelected:(BOOL)selected;
- (void)RCIMDiscussionGroupAddMemberFromProjectVCDidDeleteDeptSelected:(NSDictionary *)depart TotalInvitedNum:(NSInteger)totalNum IsSelected:(BOOL)selected;
@end

@interface RCIMDiscussionGroupAddMemberFromProjectVC : UIViewController
@property (nonatomic,copy)NSString *navTitle;
@property (nonatomic,copy)NSString *currentProjectId;
@property (nonatomic,copy)NSArray *totalSelectedDeparts;
@property (nonatomic,copy)NSArray *totalSelectedEmployees;
@property (nonatomic,assign)NSInteger totalNum;
@property (nonatomic,copy)NSString *discussionId;
@property (nonatomic,assign)BOOL isCreated;
@property (nonatomic,strong)id<RCIMDiscussionGroupAddMemberFromProjectVCDelagete>delegate;
@end
