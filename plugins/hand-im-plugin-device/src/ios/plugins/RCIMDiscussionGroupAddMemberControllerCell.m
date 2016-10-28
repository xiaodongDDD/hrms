//
//  RCIMDiscussionGroupMemberCell.m
//  汉得移动测试版
//
//  Created by wangsheng on 16/9/22.
//
//

#import "RCIMDiscussionGroupAddMemberControllerCell.h"
#import "CVDPlugin-Bridging-Header.h"

@implementation RCIMDiscussionGroupAddMemberControllerCell
-(instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        self.departImageView = [[UIImageView alloc] initWithFrame:CGRectMake(20, 10, 40, 40)];
        [self addSubview:self.departImageView];
        self.departTitle = [[UILabel alloc] initWithFrame:CGRectMake(CGRectGetMaxX(self.departImageView.frame)+10, CGRectGetMinY(self.departImageView.frame)+5, screenWidth-CGRectGetMaxX(self.departImageView.frame)-60, 30)];
        [self addSubview:self.departTitle];
        UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"Back Arrow Copy 6 + Back Arrow Copy 6"]];
        imageView.frame = CGRectMake(0, 0, 30, 30);
        self.accessoryView = imageView;
    }
    return self;
}
- (void)awakeFromNib {
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
