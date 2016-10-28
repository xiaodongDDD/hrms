//
//  RCIMDiscussionMultiTypeCell.m
//  汉得移动测试版
//
//  Created by wangsheng on 2016/10/10.
//
//

#import "RCIMDiscussionMultiTypeCell.h"

@implementation RCIMDiscussionMultiTypeCell
-(instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        
        self.imageView = [[UIImageView alloc] init];
        
        self.imageView.frame = self.bounds;
        
        [self addSubview:self.imageView];
    
    }
    return self;
}
@end
