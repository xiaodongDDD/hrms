//
//  RCIMDiscussionGroupMemberCell.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/19.
//
//

#import "RCIMDiscussionGroupMemberCell.h"

@implementation RCIMDiscussionGroupMemberCell
-(instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.memberImageV = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, 60, 60)];
        [self.memberImageV.layer setCornerRadius:60/2.0];
        [self.memberImageV.layer setMasksToBounds:YES];
        [self addSubview:self.memberImageV];
        
        self.memberName = [[UILabel alloc] initWithFrame:CGRectMake(0, CGRectGetMaxY(self.memberImageV.frame)+5, self.bounds.size.width, 15)];
        [self.memberName setTextAlignment:NSTextAlignmentCenter];
        [self.memberName setFont:[UIFont systemFontOfSize:14.0]];
        [self addSubview:self.memberName];
        
    }
    return self;
}
@end
