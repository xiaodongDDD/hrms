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

@interface RCIMDiscussionGroupNameDetailSetting ()
@property (nonatomic,copy)NSString *discussionName;
@end

@implementation RCIMDiscussionGroupNameDetailSetting

- (void)viewDidLoad {
    
    [super viewDidLoad];
    self.tableView.scrollEnabled = NO;
    
    self.navigationItem.title = @"编辑讨论组名";
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"完成" style:UIBarButtonItemStylePlain target:self action:@selector(finishEditDiscussionName)];
    UIView *headerView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, screenWidth, 20)];

    self.tableView.tableHeaderView = headerView;
    self.tableView.tableFooterView = [[UIView alloc]init];
    
    [self.navigationController.navigationBar setTintColor:[UIColor colorWithRed:74/255.0 green:74/255.0 blue:74/255.0 alpha:1.0]];

}
- (void)textFieldValueDidChange:(UITextField *)textField
{
   // NSLog(@"textField:%@",textField.text);
    self.discussionName = textField.text;
}

- (void)finishEditDiscussionName {

    NSLog(@"修改成功：%@",self.discussionName);
    ZLProgressHUD *progress = [[ZLProgressHUD alloc] init];
    [progress show];
    //修改讨论组名
    [[RCIMClient sharedRCIMClient] setDiscussionName:self.discussionId name:self.discussionName success:^{
        NSLog(@"修改讨论组名称成功");
        dispatch_async(dispatch_get_main_queue(), ^{
            [progress hide];
            [self.navigationController popViewControllerAnimated:YES];
        });
    } error:^(RCErrorCode status) {
        NSLog(@"修改讨论组名失败 错误码：%li",status);
        dispatch_async(dispatch_get_main_queue(), ^{
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

@end
