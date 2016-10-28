//
//  RCIMDiscussionGroupAllMembersList.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/22.
//
//

#import <UIKit/UIKit.h>

@protocol RCIMDiscussionGroupAllMembersListDeleagte <NSObject>

@optional
- (void)ViewControllerWillDrag;
- (void)didSelectCell:(NSString *)userId isSelected:(BOOL)selected;
@end

@interface RCIMDiscussionGroupAllMembersList : UIViewController
@property (nonatomic,strong)NSMutableArray *dataList;
@property (nonatomic,strong)NSString *text;
@property (nonatomic,strong)NSArray *totalSelectedMembers;
@property (nonatomic,strong)NSArray *totalSelectedDepts;
@property (nonatomic,assign)NSInteger totalNum;
@property (nonatomic,strong)UIViewController *viewController;
@property (nonatomic,copy)NSString *discussionId;
@property (nonatomic,assign)BOOL isCreated;
@property (nonatomic,strong)id<RCIMDiscussionGroupAllMembersListDeleagte>delegate;
- (void)reloadTableView;
@end
