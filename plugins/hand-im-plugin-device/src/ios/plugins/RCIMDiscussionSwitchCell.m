//
//  RCIMDiscussionSwitchCell.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/18.
//
//

#import "RCIMDiscussionSwitchCell.h"
#import "CVDPlugin-Bridging-Header.h"
#define cellLeftSpace 20

@implementation RCIMDiscussionSwitchCell

-(instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        [self setSelectionStyle:UITableViewCellSelectionStyleNone];
        
        self.label = [[UILabel alloc] initWithFrame:CGRectMake(cellLeftSpace, 10, 120, 20)];
        [self addSubview:self.label];
        
        self.switchBtn = [[UISwitch alloc] initWithFrame:CGRectMake(screenWidth-60, 5, 60, 20)];
        [self addSubview:self.switchBtn];
        
        [self setBackgroundColor:[UIColor colorWithWhite:0.95 alpha:0.9]];
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
