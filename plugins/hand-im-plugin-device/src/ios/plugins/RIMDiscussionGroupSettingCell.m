//
//  RIMDiscussionGroupSettingCell.m
//  汉得移动测试版
//
//  Created by wangsheng on 2016/9/29.
//
//

#import "RIMDiscussionGroupSettingCell.h"

@implementation RIMDiscussionGroupSettingCell

-(instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
       // self.containView = [[UIView alloc] initWithFrame:self.bounds];
       // self.containView.userInteractionEnabled = NO;
      //  [self addSubview:self.containView];
        [self setBackgroundColor:[UIColor whiteColor]];
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
