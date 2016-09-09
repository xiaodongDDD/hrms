//
//  RCIMDiscussionGroupAddMemberCell.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/23.
//
//

#import "RCIMDiscussionGroupAddMemberCell.h"
#import "CVDPlugin-Bridging-Header.h"
@implementation RCIMDiscussionGroupAddMemberCell

-(instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.imageV = [[UIImageView alloc] initWithFrame:CGRectMake(15,20 ,40,40)];
        [self.imageV.layer setCornerRadius:20.0];
        [self.imageV.layer setMasksToBounds:YES];
        [self addSubview:self.imageV];
        
        self.name_label = [[UILabel alloc] initWithFrame:CGRectMake(CGRectGetMaxX(self.imageV.frame)+15, 15, 200, 20)];
        [self addSubview:self.name_label];
        
        self.email_label = [[UILabel alloc] initWithFrame:CGRectMake(CGRectGetMaxX(self.imageV.frame)+15, CGRectGetMaxY(self.name_label.frame)+10, screenWidth-70, 18)];
        [self.email_label setTextColor:[UIColor grayColor]];
        [self addSubview:self.email_label];
        
        [self setSelectionStyle:UITableViewCellSelectionStyleNone];
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
