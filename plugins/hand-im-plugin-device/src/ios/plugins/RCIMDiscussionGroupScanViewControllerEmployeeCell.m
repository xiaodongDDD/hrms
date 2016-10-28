//
//  RCIMDiscussionGroupScanViewControllerEmployeeCell.m
//  汉得移动测试版
//
//  Created by wangsheng on 16/9/23.
//
//

#import "RCIMDiscussionGroupScanViewControllerEmployeeCell.h"

@implementation RCIMDiscussionGroupScanViewControllerEmployeeCell

- (void)awakeFromNib {
    // Initialization code
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}
-(instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        
        self.employeeImageView = [[UIImageView alloc] initWithFrame:CGRectMake(30, 12.5, 35, 35)];
        self.employeeImageView.layer.cornerRadius = 35/2.0;
        self.employeeImageView.layer.masksToBounds = YES;
        [self addSubview:self.employeeImageView];
        
        self.titleLabel = [[UILabel alloc] initWithFrame:CGRectMake(CGRectGetMaxX(self.employeeImageView.frame)+15, 20, self.bounds.size.width-CGRectGetMaxX(self.employeeImageView.frame)-20, 20)];
        [self addSubview:self.titleLabel];
        
        self.deleteBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        self.deleteBtn.frame = CGRectMake(0, 0, 20, 20);
        self.deleteBtn.layer.cornerRadius = 20/2.0;
        self.deleteBtn.layer.masksToBounds = YES;
        [self.deleteBtn setImage:[UIImage imageNamed:@"delete3"] forState:UIControlStateNormal];
        self.accessoryView = self.deleteBtn;
    }
    return self;
}

@end
