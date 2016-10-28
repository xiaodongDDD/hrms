//
//  RCIMDiscussionGroupAddMemberDetailVC.h
//  汉得移动测试版
//
//  Created by wangsheng on 16/9/18.
//
//

#import <UIKit/UIKit.h>

@protocol RCIMDiscussionGroupAddMemberDetailVCProtocol <NSObject>

@optional
- (void)RCIMDiscussionGroupAddMemberDetailVCDidSelectedDepart:(NSDictionary *)depart Employee:(NSString *)employee TotalNum:(NSInteger)totalNum isSelected:(BOOL)selected;
- (void)RCIMDiscussionGroupAddMemberDetailVCDidSelectedDepars:(NSArray *)departs Employees:(NSArray *)employees TotalNum:(NSInteger)totalNum isSelected:(BOOL)selected;
@end


@interface RCIMDiscussionGroupAddMemberDetailVC : UIViewController
@property (nonatomic,copy)NSString *navTitle;
@property (nonatomic,copy)NSString *currentDepartId;
@property (nonatomic,strong)NSArray *totalSelectedDeparts;
@property (nonatomic,strong)NSArray *totalSelectedEmployees;
@property (nonatomic,assign)NSInteger totalNum;
@property (nonatomic,copy)NSString *discussionId;
@property (nonatomic,assign)BOOL isCreated;
@property (nonatomic,strong)id<RCIMDiscussionGroupAddMemberDetailVCProtocol>delegate;
@end
