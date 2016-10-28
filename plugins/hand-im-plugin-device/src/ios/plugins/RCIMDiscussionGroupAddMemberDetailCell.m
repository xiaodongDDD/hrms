//
//  RCIMDiscussionGroupAddMemberDetailCell.m
//  汉得移动测试版
//
//  Created by wangsheng on 16/9/18.
//
//

#import "RCIMDiscussionGroupAddMemberDetailCell.h"

@implementation RCIMDiscussionGroupAddMemberDetailCell

-(instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        self.imageV1 = [[UIImageView alloc] initWithFrame:CGRectMake(20, 20, 20, 20)];
        self.imageV1.layer.cornerRadius = 10.0;
        self.imageV1.layer.masksToBounds = YES;
        self.imageV1.image = [UIImage imageNamed:@"btn_original_circle@3x.png"];
        [self addSubview:self.imageV1];
        
        self.imageV2 = [[UIImageView alloc] initWithFrame:CGRectMake(CGRectGetMaxX(self.imageV1.frame)+10, 12.5, 35, 35)];
        self.imageV2.layer.cornerRadius = 35/2.0;
        self.imageV2.layer.masksToBounds = YES;
        [self addSubview:self.imageV2];
        
        self.titleLabel = [[UILabel alloc] initWithFrame:CGRectMake(CGRectGetMaxX(self.imageV2.frame)+10, 20, self.bounds.size.width-CGRectGetMaxX(self.imageV2.frame)-20, 20)];
        [self addSubview:self.titleLabel];
    }
    return self;
}

-(void)setIsSelected:(BOOL)isSelected
{
    _isSelected = isSelected;
    if (isSelected) {//btn_selected@3x
        self.imageV1.image = [UIImage imageNamed:@"select_highlight"];
    }else{
        self.imageV1.image = [UIImage imageNamed:@"btn_original_circle@3x.png"];
    }
}


- (void)awakeFromNib {
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];
    
}

@end
