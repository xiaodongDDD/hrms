//
//  RCIMDiscussionGroupAddMemberDetailDepartVC.h
//  汉得移动测试版
//
//  Created by wangsheng on 16/9/18.
//
//

#import <UIKit/UIKit.h>

@protocol RCIMDiscussionGroupAddMemberDetailDepartVCProtocol <NSObject>

@optional
- (void)didSelectedDepart:(NSDictionary *)depart Employee:(NSString *)employeeId TotalNum:(NSInteger)totalNum isSelected:(BOOL)selected;
- (void)didSelectedDeparts:(NSArray *)departs Employees:(NSArray *)employeesId TotalNum:(NSInteger)totalNum isSelected:(BOOL)selected;
@end
@interface RCIMDiscussionGroupAddMemberDetailDepartVC : UIViewController
@property (nonatomic,copy)NSString *navTitle;
@property (nonatomic,copy)NSString *currentDepartId;
@property (nonatomic,strong)NSArray *totalSelectedDeparts;
@property (nonatomic,strong)NSArray *totalSelectedEmployees;
@property (nonatomic,assign)NSInteger totalNum;
@property (nonatomic,copy)NSString *discussionId;
@property (nonatomic,assign)BOOL isCreated;
@property (nonatomic,strong)id<RCIMDiscussionGroupAddMemberDetailDepartVCProtocol> delegate;
@end
