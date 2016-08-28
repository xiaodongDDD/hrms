//
//  RCIMDiscussionGroupNameCell.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/19.
//
//

#import "RCIMDiscussionGroupNameCell.h"
#import "CVDPlugin-Bridging-Header.h"
@implementation RCIMDiscussionGroupNameCell

- (instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.backgroundColor = [UIColor colorWithWhite:0.95 alpha:0.9];
        self.selectionStyle = UITableViewCellSelectionStyleNone;
        self.discussionGroupName = [[UITextField alloc] initWithFrame:CGRectMake(0, 0, screenWidth, 45)];
        [self.discussionGroupName setBackgroundColor:[UIColor whiteColor]];
        self.discussionGroupName.clearButtonMode = UITextFieldViewModeWhileEditing;
        self.discussionGroupName.borderStyle = UITextBorderStyleRoundedRect;
        [self addSubview:self.discussionGroupName];
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
