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
- (void)didSelectCell:(NSDictionary *)info isSelected:(BOOL)selected;
@end

@interface RCIMDiscussionGroupAllMembersList : UITableViewController
@property (nonatomic,strong)NSMutableArray *dataList;
@property (nonatomic,strong)NSString *text;
@property (nonatomic,strong)id<RCIMDiscussionGroupAllMembersListDeleagte>delegate;
- (void)reloadTableView;
@end
