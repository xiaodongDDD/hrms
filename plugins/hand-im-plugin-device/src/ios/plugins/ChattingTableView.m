//
//  ChattingTableView.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/25.
//
//

#import "ChattingTableView.h"

@implementation ChattingTableView
-(instancetype)initWithFrame:(CGRect)frame style:(UITableViewStyle)style
{
    self = [super initWithFrame:frame style:style];
    if (self) {
        
    }
    return self;
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
    [self.touchDelegate touchTableView];
}
@end
