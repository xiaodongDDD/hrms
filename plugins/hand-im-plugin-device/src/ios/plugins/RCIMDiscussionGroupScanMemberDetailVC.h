//
//  RCIMDiscussionGroupScanMemberDetailVC.h
//  汉得移动测试版
//
//  Created by wangsheng on 16/9/20.
//
//

#import <UIKit/UIKit.h>

@protocol RCIMDiscussionGroupScanMemberDetailVCProtocol <NSObject>

@optional
- (void)deleteContactsOrDepartment:(NSArray *)selectedDepart SelectedUsers:(NSArray *)selectedUsers TotalNumber:(NSInteger)totalNumber Depart:(NSDictionary *)department Employee:(NSString *)employeeId;
@end

@interface RCIMDiscussionGroupScanMemberDetailVC : UIViewController
@property (nonatomic,strong)NSArray *totalSelectedDepts;
@property (nonatomic,strong)NSArray *totalSelectedUsers;
@property (nonatomic,assign)NSInteger totalNumber;
@property (nonatomic,strong)id<RCIMDiscussionGroupScanMemberDetailVCProtocol>delegate;
@end
