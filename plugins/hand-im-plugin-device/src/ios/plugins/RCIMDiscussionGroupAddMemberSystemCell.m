//
//  RCIMDiscussionGroupAddMemberSystemCell.m
//  汉得移动测试版
//
//  Created by wangsheng on 16/9/19.
//
//

#import "RCIMDiscussionGroupAddMemberSystemCell.h"

@implementation RCIMDiscussionGroupAddMemberSystemCell
-(instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        self.imageV = [[UIImageView alloc] initWithFrame:CGRectMake(20, 20, 20, 20)];
        self.imageV.layer.cornerRadius = 10.0;
        self.imageV.layer.masksToBounds = YES;
        self.imageV.image = [UIImage imageNamed:@"btn_original_circle@3x.png"];
        [self addSubview:self.imageV];
        
        self.titleLabel = [[UILabel alloc] initWithFrame:CGRectMake(CGRectGetMaxX(self.imageV.frame)+10, 20, self.bounds.size.width-CGRectGetMaxX(self.imageV.frame)-20, 20)];
        [self addSubview:self.titleLabel];
        
    }
    return self;
}

-(void)setIsSelected:(BOOL)isSelected
{
    _isSelected = isSelected;
    if (isSelected) {
        self.imageV.image = [UIImage imageNamed:@"select_highlight"];
    }else{
        self.imageV.image = [UIImage imageNamed:@"btn_original_circle@3x.png"];
    }
}
- (void)awakeFromNib {
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
