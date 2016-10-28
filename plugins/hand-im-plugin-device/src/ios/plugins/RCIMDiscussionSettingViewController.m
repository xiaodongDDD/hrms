//
//  RCIMDiscussionSettingViewController.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/18.
//
//

#import "RCIMDiscussionSettingViewController.h"
#import "CVDPlugin-Bridging-Header.h"
#import "RCIMDiscussionDefaultCell.h"
#import "RCIMDiscussionSwitchCell.h"
#import "RCIMDiscussionGroupNameDetailSetting.h"
#import "RCIMDiscussionGroupMemberCell.h"
#import "RCIMDiscussionGroupAddMemberController.h"
#import "UIImageView+WebCache.h"
#import "ZLProgressHUD.h"
#import "RIMDiscussionGroupSettingCell.h"

#define CellHeight 40
@interface RCIMDiscussionSettingViewController ()<UICollectionViewDataSource,UICollectionViewDelegateFlowLayout,UICollectionViewDelegate>

@property (nonatomic,strong)UIView *headerView;
@property (nonatomic,strong)UICollectionView *membersCollectionView;
@property (nonatomic,assign)BOOL isFirst;
@property (nonatomic,assign)BOOL isNewMsgClock;
@property (nonatomic,strong)NSArray *members;
@property (nonatomic,copy)NSString *discussionName;
@property (nonatomic,strong)NSArray *deptStaffArray;
@end

@implementation RCIMDiscussionSettingViewController

- (NSArray *)deptStaffArray
{
    if (_deptStaffArray==nil) {
        _deptStaffArray = [NSArray array];
    }
    return _deptStaffArray;
}

- (void)viewDidLoad
{
    NSLog(@"设置:%li",self.discussionMembersInfo.count);
    [self initNavBar];
    [self reloadMemberListView];
    //添加footView
    [self initFootView];
    
    [[RCIMClient sharedRCIMClient] getDiscussion:self.discussionId success:^(RCDiscussion *discussion) {
        self.discussionName = discussion.discussionName;
    } error:^(RCErrorCode status) {
        NSLog(@"设置---获取讨论组信息失败");
    }];
    
    //获取讨论组回话状态
    [[RCIMClient sharedRCIMClient] getConversationNotificationStatus:ConversationType_DISCUSSION targetId:self.discussionId success:^(RCConversationNotificationStatus nStatus) {
        NSLog(@"获取讨论组新消息提醒状态OK:%lu",nStatus);
        _isNewMsgClock = nStatus;
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.tableView reloadData];
        });
    } error:^(RCErrorCode status) {
        NSLog(@"获取讨论组新消息提醒状态失败:%li",status);
    }];
    
    //是否消息置顶
    self.isFirst = NO;
    
    [self.tableView registerClass:[RCIMDiscussionDefaultCell class] forCellReuseIdentifier:@"RCIMDiscussionDefaultCell"];
    [self.tableView registerClass:[RCIMDiscussionSwitchCell class] forCellReuseIdentifier:@"RCIMDiscussionSwitchCell"];
    [self.tableView registerClass:[RIMDiscussionGroupSettingCell class] forCellReuseIdentifier:@"RIMDiscussionGroupSettingCell"];
    
}
- (void)initNavBar
{
    self.navigationItem.title = @"聊天设置";
    
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

- (void)initFootView
{
    UIView *headView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, screenWidth, 15)];
    headView.backgroundColor = [UIColor colorWithRed:242/255.0 green:242/255.0 blue:242/255.0 alpha:1.0];
    self.tableView.tableHeaderView = headView;
    
    UIView *footView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, screenWidth, 100)];
    UIButton *escapeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    escapeBtn.frame = CGRectMake(21, (footView.bounds.size.height-45)/2.0-10, screenWidth-42, 45);
    escapeBtn.layer.cornerRadius = 8;
    [escapeBtn setTitle:@"删除并退出" forState:UIControlStateNormal];
    [escapeBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [escapeBtn setBackgroundColor:[UIColor redColor]];
    [escapeBtn addTarget:self action:@selector(deleteAndEscapeFromDiscussion:) forControlEvents:UIControlEventTouchUpInside];
    [footView addSubview:escapeBtn];
    self.tableView.tableFooterView = footView;//0 195 255
    self.tableView.backgroundColor = [UIColor colorWithRed:242/255.0 green:242/255.0 blue:242/255.0 alpha:1.0];
}


#pragma mark - 刷新成员列表视图
- (void)reloadMemberListView
{
    UIView *titleCell  = [self.headerView viewWithTag:1];
    UILabel *headTitle = [titleCell viewWithTag:3];
    [headTitle setText:[NSString stringWithFormat:@"讨论组成员（%li）人",self.discussionMembersInfo.count]];
    
    CGFloat heightForHeaderView = CellHeight + 80*((self.discussionMembersInfo.count)/4+1)+10*((self.discussionMembersInfo.count)/4+1);
    
    self.headerView.bounds = CGRectMake(0, 0, screenWidth, heightForHeaderView);
    self.membersCollectionView.bounds = CGRectMake(20, CellHeight, screenWidth-20*2, CGRectGetHeight(self.headerView.frame)-CGRectGetMaxY(titleCell.frame));
    
    [self.tableView.tableHeaderView setFrame:self.headerView.frame];
}

-(void)viewDidLayoutSubviews {
    
    if ([self.tableView respondsToSelector:@selector(setSeparatorInset:)]) {
        [self.tableView setSeparatorInset:UIEdgeInsetsZero];
        
    }
    if ([self.tableView respondsToSelector:@selector(setLayoutMargins:)])  {
        [self.tableView setLayoutMargins:UIEdgeInsetsZero];
    }
    
}

#pragma mark -UITablewViewDataSource
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 3;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    if (section==0 || section==1) {
        return 1;
    }
    return 2;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell;
    if (indexPath.section==0) {
        UICollectionViewFlowLayout *flowLayout = [[UICollectionViewFlowLayout alloc] init];
        CGFloat cellHorizontalSpace = (screenWidth-20*2 - 60*4)/4.0;//80
        CGFloat cellVertualSapce = 10.0;
        //计算一下cell间距 保证每行显示4个
        [flowLayout setMinimumInteritemSpacing:cellHorizontalSpace];//横相间距
        [flowLayout setMinimumLineSpacing:cellVertualSapce];
        [flowLayout setItemSize:CGSizeMake(60, 80)];
        
        self.membersCollectionView = [[UICollectionView alloc] initWithFrame: CGRectMake(20, 10, screenWidth-20*2, 80*((self.discussionMembersInfo.count)/4+1)+10*((self.discussionMembersInfo.count)/4+1)) collectionViewLayout:flowLayout];
        [self.membersCollectionView setBackgroundColor:[UIColor whiteColor]];
        [self.membersCollectionView registerClass:[RCIMDiscussionGroupMemberCell class] forCellWithReuseIdentifier:@"RCIMDiscussionGroupMemberCell"];
        self.membersCollectionView.dataSource = self;
        self.membersCollectionView.delegate = self;
        RIMDiscussionGroupSettingCell *collectionViewCell = [tableView dequeueReusableCellWithIdentifier:@"RIMDiscussionGroupSettingCell"];
        [collectionViewCell.contentView addSubview:self.membersCollectionView];

        cell  = collectionViewCell;
        
    }else if (indexPath.section==1){
        RCIMDiscussionDefaultCell *defaultCell = [tableView dequeueReusableCellWithIdentifier:@"RCIMDiscussionDefaultCell"];
        defaultCell.label.text = @"多人聊天名称";
        defaultCell.discussionName.text = self.discussionName;
        cell = defaultCell;
    }else{
        if (indexPath.row==0) {
            RCIMDiscussionSwitchCell *switchCell = [tableView dequeueReusableCellWithIdentifier:@"RCIMDiscussionSwitchCell"];
            switchCell.label.text = @"消息免打扰";
            switchCell.switchBtn.on =!self.isNewMsgClock;
            [switchCell.switchBtn addTarget:self action:@selector(isOpenNewMessageNotification:) forControlEvents:UIControlEventValueChanged];
            cell = switchCell;
        }else{
            RCIMDiscussionSwitchCell *switchCell = [tableView dequeueReusableCellWithIdentifier:@"RCIMDiscussionSwitchCell"];
            switchCell.label.text = @"消息置顶";
            [switchCell.switchBtn setOn:self.isFirst];
            [switchCell.switchBtn addTarget:self action:@selector(isSortFirst:) forControlEvents:UIControlEventValueChanged];
            cell = switchCell;
        }
    }
        return cell;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    CGFloat firstCellHeight = 80*((self.discussionMembersInfo.count)/4+1)+10*((self.discussionMembersInfo.count)/4+1) + 10;
    if (indexPath.section==0 && indexPath.row==0) {
        return firstCellHeight?firstCellHeight:40;
    }else{
        return CellHeight;
    }
}

- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    if (section==0) {
        return CellHeight;
    }
    return CGFLOAT_MIN;
}
-(UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section
{
    if (section==0) {
        UIView *header = [[UIView alloc] initWithFrame:CGRectMake(0, 0, screenWidth, CellHeight)];
        [header setBackgroundColor:[UIColor whiteColor]];
        UILabel *titleLabel = [[UILabel alloc] initWithFrame:CGRectMake(10, 10, screenWidth-20, 20)];
        titleLabel.text = [NSString stringWithFormat:@"多人聊天成员（%li人）",self.discussionMembersInfo.count];
        [header addSubview:titleLabel];
        return header;
    }
    return nil;
}

- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section
{
    return 15;
}
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    switch (indexPath.section) {
        case 1:{
            RCIMDiscussionGroupNameDetailSetting *RCIMDiscussionNameSettingVC = [[RCIMDiscussionGroupNameDetailSetting alloc] init];
            [tableView deselectRowAtIndexPath:indexPath animated:NO];
            RCIMDiscussionNameSettingVC.discussionPreName = self.discussionName;
            RCIMDiscussionNameSettingVC.discussionId = self.discussionId;
            [self.navigationController pushViewController:RCIMDiscussionNameSettingVC animated:YES];
        }
            break;
        default:
            break;
    }
}

-(void)tableView:(UITableView *)tableView willDisplayCell:(UITableViewCell *)cell forRowAtIndexPath:(NSIndexPath *)indexPath
{
    if ([tableView respondsToSelector:@selector(setSeparatorInset:)]) {
        [tableView setSeparatorInset:UIEdgeInsetsZero];
    }
    if ([tableView respondsToSelector:@selector(setLayoutMargins:)]) {
        [tableView setSeparatorInset:UIEdgeInsetsZero];
    }
}


#pragma mark - UICollectionViewDataSource
- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
{
    return (self.discussionMembersInfo.count+1);
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath//43 59 162
{
    UICollectionViewCell *cell;

    if (indexPath.item<self.discussionMembersInfo.count) {
        RCIMDiscussionGroupMemberCell *RCIMDiscussionMemberCell = [collectionView dequeueReusableCellWithReuseIdentifier:@"RCIMDiscussionGroupMemberCell" forIndexPath:indexPath];
        NSDictionary *info = self.discussionMembersInfo[indexPath.item];
        NSString *emp_name = [info objectForKey:@"emp_name"];//name
        NSLog(@"infp:%@",info);
        NSString *avatar = [info objectForKey:@"avatar"];//img
        if ([avatar isEqual:@""]||[avatar isEqual:[NSNull null]]) {
            avatar = @"profile-2@3x.png";
        }
        [RCIMDiscussionMemberCell.memberImageV sd_setImageWithURL:[NSURL URLWithString:avatar] placeholderImage:[UIImage imageNamed:@"profile-2@3x.png"]];
        [RCIMDiscussionMemberCell.memberName setText:emp_name];
        [RCIMDiscussionMemberCell.memberName setTextColor:[UIColor blackColor]];
        cell = RCIMDiscussionMemberCell;
    }else
    //设置最后一个为添加好友按钮
    {
        RCIMDiscussionGroupMemberCell *RCIMDiscussionMemberCell = [collectionView dequeueReusableCellWithReuseIdentifier:@"RCIMDiscussionGroupMemberCell" forIndexPath:indexPath];
        [RCIMDiscussionMemberCell.memberImageV setImage:[UIImage imageNamed:@"addCell.png"]];
        [RCIMDiscussionMemberCell.memberName setText:@"邀请"];
        [RCIMDiscussionMemberCell.memberName setTextColor:[UIColor colorWithRed:42/255.0 green:57/255.0 blue:158/255.0 alpha:1.0]];
        cell = RCIMDiscussionMemberCell;
    }
    return cell;
}

-(void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
    NSLog(@"indexpath:(%li,%li)",indexPath.section,indexPath.item);
    if (indexPath.row==self.discussionMembersInfo.count) {
        RCIMDiscussionGroupAddMemberController *RCIMAddMemberVC;
        RCIMAddMemberVC = [[RCIMDiscussionGroupAddMemberController alloc] init];
        RCIMAddMemberVC.discussionId = self.discussionId;
        RCIMAddMemberVC.isCreated = NO;
        [self.navigationController pushViewController:RCIMAddMemberVC animated:YES];
    }
}

#pragma mark - 显示所有成员
- (void)tapMembersCell:(UITapGestureRecognizer *)tap
{
    //显示成员列表
    NSLog(@"显示成员列表");
}

- (void)isSortFirst:(UISwitch *)swith
{
    self.isFirst = swith.on;
}

//删除并退出讨论组
- (void)deleteAndEscapeFromDiscussion:(UIButton *)sender
{
    NSLog(@"deleteAndEscapeFromDiscussion");
    //弹出提示
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"删除并且退出讨论组？" message:nil preferredStyle:UIAlertControllerStyleActionSheet];
    [alertController addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDestructive handler:^(UIAlertAction * _Nonnull action) {
        //删除并退出讨论组 这里要判断当前用户是否是讨论组的创始人 是——>才能解散讨论组 否则 将只是退出讨论组
        [[RCIMClient sharedRCIMClient] getDiscussion:self.discussionId success:^(RCDiscussion *discussion) {
            NSLog(@"访问讨论组成功：%@",discussion.discussionId);
            NSString *currentUserID = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
            if ([currentUserID isEqualToString:discussion.creatorId]) {
//                //如果一样 退出并解散讨论组 由于SDK没有解散功能需要自己做处理-》创建人移除所有成员
//                for (NSString *memberId in discussion.memberIdList) {
//                    if (![memberId isEqualToString:discussion.creatorId]) {
//                        //先移除其他的所有人
//                        [[RCIMClient sharedRCIMClient] removeMemberFromDiscussion:discussion.discussionId userId:memberId success:^(RCDiscussion *discussion) {
//                            NSLog(@"讨论组成功移除成员:%@",memberId);
//                        } error:^(RCErrorCode status) {
//                            NSLog(@"讨论组移除成员失败,%li",status);
//                        }];
//                    }else{
//                        //最后自己退出讨论组
//                        [[RCIMClient sharedRCIMClient] quitDiscussion:discussion.discussionId success:^(RCDiscussion *discussion) {
//                            NSLog(@"讨论组被解散!!!,%@",discussion.discussionName);
//                            //清除本地该讨论组的缓存
//                            [[RCIMClient sharedRCIMClient] removeConversation:ConversationType_DISCUSSION targetId:discussion.discussionId];
//                            //返回根界面
//                            dispatch_async(dispatch_get_main_queue(), ^{
//                                [self.navigationController dismissViewControllerAnimated:YES completion:nil];
//                                [self.delegate removeAllChattingRecorder];
//                            });
//                        } error:^(RCErrorCode status) {
//                            NSLog(@"讨论组被解散失败!!!,%li",status);
//                        }];
//                    }
//                }
                //最后自己退出讨论组
                                        [[RCIMClient sharedRCIMClient] quitDiscussion:discussion.discussionId success:^(RCDiscussion *discussion) {
                                            NSLog(@"讨论组被解散!!!,%@",discussion.discussionName);
                                            //清除本地该讨论组的缓存
                                            [[RCIMClient sharedRCIMClient] removeConversation:ConversationType_DISCUSSION targetId:discussion.discussionId];
                                            //返回根界面
                                            dispatch_async(dispatch_get_main_queue(), ^{
                                                [self.navigationController dismissViewControllerAnimated:YES completion:nil];
                                                [self.delegate removeAllChattingRecorder];
                                            });
                                        } error:^(RCErrorCode status) {
                                            NSLog(@"讨论组被解散失败!!!,%li",status);
                                        }];
            }else{
                //不一样 退出讨论组
                [[RCIMClient sharedRCIMClient] quitDiscussion:self.discussionId success:^(RCDiscussion *discussion) {
                    NSLog(@"退出讨论组成功:%@",discussion.discussionName);
                    //清除本地该讨论组的缓存
                    [[RCIMClient sharedRCIMClient] removeConversation:ConversationType_DISCUSSION targetId:self.discussionId];
                    //返回根界面
                    dispatch_async(dispatch_get_main_queue(), ^{
                        [self.navigationController dismissViewControllerAnimated:YES completion:nil];
                        [self.delegate removeAllChattingRecorder];
                    });
                    
                } error:^(RCErrorCode status) {
                    NSLog(@"退出讨论组失败:%li",status);
                }];
            }
        } error:^(RCErrorCode status) {//407 表示讨论组不存在 被解散了
            NSLog(@"访问讨论组成功：%li",status);
        }];
        
    }]];
    [alertController addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
        //取消
    }]];
    
    [self presentViewController:alertController animated:YES completion:nil];
}

#pragma mark - 是否打开成员邀请
- (void)isOpenMemberInvite:(UISwitch *)sender
{
    NSLog(@"isOpenMemberInvite:%i",sender.isOn);
    [[RCIMClient sharedRCIMClient] setDiscussionInviteStatus:self.discussionId isOpen:sender.isOn success:^(){
        NSLog(@"修改成员邀请权限成功 ：%i",sender.isOn);
    } error:^(RCErrorCode status) {
        NSLog(@"修改成员邀请权限失败：%li",status);
    }];
}
#pragma mark -是否打开新消息提醒
- (void)isOpenNewMessageNotification:(UISwitch *)sender
{
    NSLog(@"isOpenNewMessageNotification:%i",sender.isOn);
    [[RCIMClient sharedRCIMClient] setConversationNotificationStatus:ConversationType_DISCUSSION targetId:self.discussionId isBlocked:(sender.isOn) success:^(RCConversationNotificationStatus nStatus) {
        NSLog(@"设置新消息提醒成功:%lu",nStatus);//0 免打扰 1 提醒
    } error:^(RCErrorCode status) {
        NSLog(@"设置新消息提醒失败:%li",status);
    }];
}

#pragma mark -根据memberId拉取头像
- (void)getContactsInfoByIdList:(NSArray *)employee_id
{
  
    NSString *access_token = [[NSUserDefaults standardUserDefaults] objectForKey:@"access_token"];
    NSString *path = [NSString stringWithFormat:@"%@/hrmsv2/v2/api/staff/detailList?access_token=%@",rootService,access_token];
    NSURL *url = [NSURL URLWithString:path];
    NSLog(@"-------------path:%@,,,,",path);
    NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:url];
    [urlRequest setHTTPMethod:@"POST"];
    NSDictionary *requestBody = [NSJSONSerialization JSONObjectWithData:[NSJSONSerialization dataWithJSONObject:employee_id options:NSJSONWritingPrettyPrinted error:nil] options:NSJSONReadingAllowFragments error:nil];
    [urlRequest setHTTPBody:[NSJSONSerialization dataWithJSONObject:requestBody options:NSJSONWritingPrettyPrinted error:nil]];
    NSDictionary *headers = @{@"content-type": @"application/json"};
    [urlRequest setAllHTTPHeaderFields:headers];
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    [configuration setTimeoutIntervalForRequest:15.0];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            self.deptStaffArray = json[@"rows"];// avatar,emp_name,emp_code
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.tableView reloadData];
                [self reloadMemberListView];
                [self performSelector:@selector(hide) withObject:nil afterDelay:0.6f];
            });
            NSLog(@"项目列表联系人%@,,,,,,,%@",json,self.deptStaffArray);
        }else{
                    NSLog(@"%@",error.description);
        }
    }];
    [dataTask resume];
}

@end
