//
//  RCIMDiscussionGroupAllMembersListCell.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/22.
//
//

#import "RCIMDiscussionGroupAllMembersListCell.h"
#import "CVDPlugin-Bridging-Header.h"
#import "UIImageView+WebCache.h"

@implementation RCIMDiscussionGroupAllMembersListCell

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
        
        [self.layer setCornerRadius:10.0];
        [self.layer setShadowColor:[UIColor clearColor].CGColor];
        [self.layer setShadowOffset:CGSizeMake(0, 1.0)];
        [self.layer setShadowRadius:10.0];
        [self.layer setShadowOpacity:0.6];
    }
    return self;
}

-(void)setCell:(NSString *)imageUrlStr Name:(NSString *)nameStr Emp_code:(NSString *)code Email:(NSString *)email 
{
    [self.imageV sd_setImageWithURL:[NSURL URLWithString:imageUrlStr] placeholderImage:[UIImage imageNamed:@"profile-2@3x.png"] completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL) {
        //NSLog(@"下载图片：%@",imageURL);
    }];
    [self.name_label setText:[NSString stringWithFormat:@"%@(%@)",nameStr,code]];
    [self.email_label setText:email];
}

@end
