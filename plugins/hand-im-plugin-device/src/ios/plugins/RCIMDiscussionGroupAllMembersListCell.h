//
//  RCIMDiscussionGroupAllMembersListCell.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/22.
//
//

#import <UIKit/UIKit.h>

typedef void(^RCIMDiscussionGroupAllMembersListCellBlock)(UIImage *Image,NSString *imageUrl);

@interface RCIMDiscussionGroupAllMembersListCell : UITableViewCell
@property (nonatomic,strong)UIImageView *imageV;
@property (nonatomic,strong)UILabel *name_label;
@property (nonatomic,strong)UILabel *email_label;
@property (nonatomic,strong)UIImageView *selctedImageV;
@property (nonatomic,assign)BOOL isSelected;
- (void)setCell:(NSString *)imageUrlStr Name:(NSString *)nameStr Emp_code:(NSString *)code Email:(NSString *)email ;
@end
