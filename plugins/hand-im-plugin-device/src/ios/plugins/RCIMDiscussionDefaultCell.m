//
//  RCIMDiscussionDefaultCell.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/18.
//
//

#import "RCIMDiscussionDefaultCell.h"
#import "CVDPlugin-Bridging-Header.h"
#define cellLeftSpace 20

@implementation RCIMDiscussionDefaultCell
-(instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        self.label = [[UILabel alloc] initWithFrame:CGRectMake(cellLeftSpace, 10, 120, 20)];
        [self addSubview:self.label];
        
        self.discussionName = [[UILabel alloc] initWithFrame:CGRectMake(screenWidth-210/375.0*screenWidth, 10, 160/375.0*screenWidth, 20)];
        [self.discussionName setTextColor:[UIColor grayColor]];
        [self.discussionName setFont:[UIFont systemFontOfSize:15.0]];
        [self.discussionName setTextAlignment:NSTextAlignmentRight];
        [self addSubview:self.discussionName];
        
        [self setBackgroundColor:[UIColor whiteColor]];
        
        self.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
    }
    return self;
}


- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
