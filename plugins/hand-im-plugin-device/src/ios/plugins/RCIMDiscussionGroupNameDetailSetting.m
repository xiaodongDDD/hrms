//
//  RCIMDiscussionGroupNameDetailSetting.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/19.
//
//

#import "RCIMDiscussionGroupNameDetailSetting.h"
#import "RCIMDiscussionGroupNameCell.h"
#import "CVDPlugin-Bridging-Header.h"
#import "ZLProgressHUD.h"
#import "ToastUtils.h"
#import "RCIMGroupChatViewController.h"

@interface RCIMDiscussionGroupNameDetailSetting ()
{
    ZLProgressHUD *progress;
}
@property (nonatomic,copy)NSString *discussionName;
@end

@implementation RCIMDiscussionGroupNameDetailSetting

- (void)viewDidLoad {
    
    [super viewDidLoad];
    
    progress = [[ZLProgressHUD alloc] init];
    
    self.tableView.scrollEnabled = NO;
    
    UIView *headerView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, screenWidth, 15)];//242,242,242
  
    self.tableView.tableHeaderView = headerView;
    self.tableView.backgroundColor = [UIColor colorWithRed:242/255.0 green:242/255.0 blue:242/255.0 alpha:1.0];;
    self.tableView.tableFooterView = [[UIView alloc] init];;
    
    [self initNavBar];

}
- (void)initNavBar
{
    self.navigationItem.title = @"多人聊天名称";
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"完成" style:UIBarButtonItemStylePlain target:self action:@selector(finishEditDiscussionName)];
    self.navigationItem.rightBarButtonItem.enabled = NO;
    //设置导航栏标题颜色
    self.navigationController.navigationBar.titleTextAttributes = @{NSForegroundColorAttributeName:[UIColor whiteColor]};
    //设置导航栏按钮颜色
    [self.navigationController.navigationBar setTintColor:[UIColor whiteColor]];
    //设置导航栏背景图片
    [self.navigationController.navigationBar setBackgroundImage:[UIImage imageNamed:@"NavBar"] forBarMetrics:UIBarMetricsDefault];
}
- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}
- (void)textFieldValueDidChange:(UITextField *)textField
{
   // NSLog(@"textField:%@",textField.text);
    self.discussionName = textField.text;
    self.navigationItem.rightBarButtonItem.enabled = YES;
}

- (void)finishEditDiscussionName
{
    NSLog(@"修改成功：%@",self.discussionName);
    
    [progress show];
    //修改讨论组名
    [[RCIMClient sharedRCIMClient] setDiscussionName:self.discussionId name:self.discussionName success:^{
        NSLog(@"修改讨论组名称成功");
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.2f * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                [progress hide];
                RCIMGroupChatViewController *RCIMGroupChatVC;
                for (UIViewController *vc in self.navigationController.viewControllers) {
                    if ([vc isMemberOfClass:[RCIMGroupChatViewController class]]) {
                        RCIMGroupChatVC =(RCIMGroupChatViewController*)vc;
                    }
                }
                RCIMGroupChatVC.discussionId = self.discussionId;
                RCIMGroupChatVC.navTitle = self.discussionName;
                [self.navigationController popToViewController:RCIMGroupChatVC animated:YES];
            });
    } error:^(RCErrorCode status) {
        NSLog(@"修改讨论组名失败 错误码：%li",status);
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.2f * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [progress hide];
        
        [ToastUtils showLong:@"修改讨论组名失败"];
        });
    }];
}


#pragma mark - Table view data source

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {

    return 1;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    RCIMDiscussionGroupNameCell *cell = [[RCIMDiscussionGroupNameCell alloc] initWithFrame:CGRectMake(0, 0, screenWidth , 45)];
    [cell.discussionGroupName addTarget:self action:@selector(textFieldValueDidChange:) forControlEvents:UIControlEventAllEditingEvents];
    cell.discussionGroupName.text = self.discussionPreName;
    
    return cell;
}

- (UIView *)tableView:(UITableView *)tableView viewForFooterInSection:(NSInteger)section
{
    UIView *footView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, screenWidth, 40)];
    UILabel *sizeLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, 10, screenWidth-10, 20)];
    sizeLabel.textAlignment = NSTextAlignmentRight;
    sizeLabel.textColor = [UIColor grayColor];
    sizeLabel.font = [UIFont systemFontOfSize:12.0];
    RCIMDiscussionGroupNameCell *cell = [tableView cellForRowAtIndexPath:[NSIndexPath indexPathForRow:0 inSection:0]];
    sizeLabel.text = [NSString stringWithFormat:@"%li/40",cell.discussionGroupName.text.length];
    [footView addSubview:sizeLabel];
    return footView;
}

- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section
{
    return 40.0;
}

@end
