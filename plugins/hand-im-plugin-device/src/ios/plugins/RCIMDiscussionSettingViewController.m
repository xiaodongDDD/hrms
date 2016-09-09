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

#define CellHeight 40
@interface RCIMDiscussionSettingViewController ()<UICollectionViewDataSource,UICollectionViewDelegateFlowLayout,UICollectionViewDelegate,RCIMDiscussionGroupAddMemberControllerDelegate>
@property (nonatomic,strong)UIView *headerView;
@property (nonatomic,strong)NSArray *dataSource;
@property (nonatomic,strong)UICollectionView *membersCollectionView;
@property (nonatomic,assign)BOOL isInvited;
@property (nonatomic,assign)BOOL isNewMsgClock;
@end

@implementation RCIMDiscussionSettingViewController

- (NSArray *)dataSource
{
    if (_dataSource == nil) {
        _dataSource = [NSArray array];
    }
    return _dataSource;
}

- (void)viewDidLoad
{
    self.navigationItem.title = @"设置";
    self.dataSource = [NSArray arrayWithObjects:@"讨论组名称",@"开放成员邀请",@"新消息通知",@"清除聊天记录", nil];
    CGFloat cellHorizontalSpace = (screenWidth-20*2 - 60*4)/4.0;//80
    CGFloat cellVertualSapce = 10.0;
    CGFloat heightForHeaderView = CellHeight + 80*((self.members.count)/4+1)+10*((self.members.count)/4+1);
    self.headerView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, screenWidth, heightForHeaderView)];
   // [self.headerView setBackgroundColor:[UIColor blueColor]];
    UIView *titleCell = [[UIView alloc] initWithFrame:CGRectMake(0, 0, screenWidth, CellHeight)];
    [titleCell setTag:100];
    [titleCell.layer setBorderColor:[UIColor lightGrayColor].CGColor];
    [titleCell.layer setBorderWidth:0.5];
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapMembersCell:)];
    [titleCell setBackgroundColor:[UIColor colorWithWhite:0.95 alpha:0.9]];
    [titleCell addGestureRecognizer:tap];
    [self.headerView addSubview:titleCell];
    
    UILabel *headLeftTitle = [[UILabel alloc] initWithFrame:CGRectMake(20, 10, 100, 20)];
    [headLeftTitle setText:@"讨论组成员"];
    [titleCell addSubview:headLeftTitle];
    
    UILabel *headRightTitle = [[UILabel alloc] initWithFrame:CGRectMake(screenWidth-100-20, 10, 100, 20)];
    [headRightTitle setTag:102];
    [headRightTitle setTextAlignment:NSTextAlignmentRight];
    [headRightTitle setText:[NSString stringWithFormat:@"%li 人",self.members.count]];
    [headRightTitle setTextColor:[UIColor grayColor]];
    [titleCell addSubview:headRightTitle];
    
    //成员头像cell
    UICollectionViewFlowLayout *flowLayout = [[UICollectionViewFlowLayout alloc] init];
    [flowLayout setItemSize:CGSizeMake(60, 80)];
    //计算一下cell间距 保证每行显示4个
    [flowLayout setMinimumInteritemSpacing:cellHorizontalSpace];//横相间距
    [flowLayout setMinimumLineSpacing:cellVertualSapce];
    self.membersCollectionView = [[UICollectionView alloc] initWithFrame:CGRectMake(20, CellHeight, screenWidth-20*2, CGRectGetHeight(self.headerView.frame)-CGRectGetMaxY(titleCell.frame)) collectionViewLayout:flowLayout];
    [self.membersCollectionView setBackgroundColor:[UIColor whiteColor]];
    self.membersCollectionView.delegate = self;
    self.membersCollectionView.dataSource = self;
    [self.membersCollectionView registerClass:[RCIMDiscussionGroupMemberCell class] forCellWithReuseIdentifier:@"RCIMDiscussionGroupMemberCell"];
    [self.headerView addSubview:self.membersCollectionView];
    self.tableView.tableHeaderView = self.headerView;
    [self.tableView.tableHeaderView setFrame:self.headerView.frame];
    
    
    //添加footView
    UIView *footView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, screenWidth, 70)];
    UIButton *escapeBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    escapeBtn.frame = CGRectMake(21, footView.bounds.size.height-45, screenWidth-42, 45);
    [escapeBtn setTitle:@"删除并退出" forState:UIControlStateNormal];
    [escapeBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    [escapeBtn setBackgroundImage:[UIImage imageNamed:@"red_background@2x.png"] forState:UIControlStateNormal];
    [escapeBtn addTarget:self action:@selector(deleteAndEscapeFromDiscussion:) forControlEvents:UIControlEventTouchUpInside];
    [footView addSubview:escapeBtn];
    self.tableView.tableFooterView = footView;//0 195 255
    
    //设置导航栏所有字体颜色
    [self.navigationController.navigationBar setTintColor:[UIColor colorWithRed:74/255.0 green:74/255.0 blue:74/255.0 alpha:1.0]];
}

-(void)viewDidLayoutSubviews {
    
    if ([self.tableView respondsToSelector:@selector(setSeparatorInset:)]) {
        [self.tableView setSeparatorInset:UIEdgeInsetsZero];
        
    }
    if ([self.tableView respondsToSelector:@selector(setLayoutMargins:)])  {
        [self.tableView setLayoutMargins:UIEdgeInsetsZero];
    }
    
}

- (void)viewWillAppear:(BOOL)animated
{
    //获取讨论组姓名 邀请状态
    [[RCIMClient sharedRCIMClient] getDiscussion:self.discussionId success:^(RCDiscussion *discussion) {
        NSLog(@"viewWillAppear 请求成功");
        self.discussionName = discussion.discussionName;
        self.isInvited = !discussion.inviteStatus;
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.tableView reloadRowsAtIndexPaths:@[[NSIndexPath indexPathForRow:0 inSection:0],[NSIndexPath indexPathForRow:1 inSection:0]] withRowAnimation:UITableViewRowAnimationNone];
        });
    } error:^(RCErrorCode status) {
        NSLog(@"请求讨论组失败:%li",status);
    }];
    
    //获取讨论组 新消息提醒状态
    [[RCIMClient sharedRCIMClient] getConversationNotificationStatus:ConversationType_DISCUSSION targetId:self.discussionId success:^(RCConversationNotificationStatus nStatus) {
        NSLog(@"获取新消息提醒状态成功:%lu",nStatus);
        self.isNewMsgClock = nStatus;
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.tableView reloadRowsAtIndexPaths:@[[NSIndexPath indexPathForRow:2 inSection:0]] withRowAnimation:UITableViewRowAnimationNone];
        });
    } error:^(RCErrorCode status) {
        NSLog(@"获取新消息提醒状态失败:%li",status);
    }];
}

#pragma mark -UITablewViewDataSource
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.dataSource.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell;
    switch (indexPath.row) {
        case 0:{
            RCIMDiscussionDefaultCell *defaultCell = [[RCIMDiscussionDefaultCell alloc] initWithFrame:CGRectMake(0, 0, screenWidth, CellHeight)];
            defaultCell.label.text = self.dataSource[indexPath.row];
            defaultCell.discussionName.text = self.discussionName;
            defaultCell.accessoryType = UITableViewCellAccessoryDisclosureIndicator;
            cell = defaultCell;
            NSLog(@"cell0:%@",self.dataSource[indexPath.row]);
        }
            break;
        case 1:{
            RCIMDiscussionSwitchCell *switchCell = [[RCIMDiscussionSwitchCell alloc] initWithFrame:CGRectMake(0, 0, screenWidth, CellHeight)];
            switchCell.label.text = self.dataSource[indexPath.row];
            [switchCell.switchBtn setOn:self.isInvited];
            [switchCell.switchBtn addTarget:self action:@selector(isOpenMemberInvite:) forControlEvents:UIControlEventValueChanged];
            cell = switchCell;
        }
            break;
        case 2:{
            RCIMDiscussionSwitchCell *switchCell = [[RCIMDiscussionSwitchCell alloc] initWithFrame:CGRectMake(0, 0, screenWidth, CellHeight)];
            switchCell.label.text = self.dataSource[indexPath.row];
            [switchCell.switchBtn setOn:self.isNewMsgClock];
            [switchCell.switchBtn addTarget:self action:@selector(isOpenNewMessageNotification:) forControlEvents:UIControlEventValueChanged];
            cell = switchCell;
        }
            break;
        case 3:{
             RCIMDiscussionDefaultCell *defaultCell = [[RCIMDiscussionDefaultCell alloc] initWithFrame:CGRectMake(0, 0, screenWidth, CellHeight)];
            defaultCell.label.text = self.dataSource[indexPath.row];
            cell = defaultCell;
            }
            break;
        
        default:
            break;
    }
    return cell;
}
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    switch (indexPath.row) {
        case 0:{
            RCIMDiscussionGroupNameDetailSetting *RCIMDiscussionNameSettingVC = [[RCIMDiscussionGroupNameDetailSetting alloc] init];
            [tableView deselectRowAtIndexPath:indexPath animated:NO];
            RCIMDiscussionNameSettingVC.discussionPreName = self.discussionName;
            RCIMDiscussionNameSettingVC.discussionId = self.discussionId;
            [self.navigationController pushViewController:RCIMDiscussionNameSettingVC animated:YES];
        }
            break;
        case 3:{
            UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"确定清除聊天记录？" message:nil preferredStyle:UIAlertControllerStyleActionSheet];
            [tableView deselectRowAtIndexPath:indexPath animated:YES];
            [alertController addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDestructive handler:^(UIAlertAction * _Nonnull action) {
                //确定并删除聊天记录
                ZLProgressHUD *progress = [[ZLProgressHUD alloc] init];
                [progress show];
              BOOL status = [[RCIMClient sharedRCIMClient] clearMessages:ConversationType_DISCUSSION targetId:self.discussionId];
                NSLog(@"清除聊天记录成功:%i",status);
                dispatch_async(dispatch_get_main_queue(), ^{
                    [progress hide];
                    [self.delegate removeAllChattingRecorder];
                });
            }]];
            [alertController addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
                //取消
            }]];
            [self presentViewController:alertController animated:YES completion:nil];
        }
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

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 40;
}

#pragma mark - UICollectionViewDataSource
- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
{
    return (self.members.count+1);
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    UICollectionViewCell *cell;
    
    if (indexPath.row<self.members.count) {
        RCIMDiscussionGroupMemberCell *RCIMDiscussionMemberCell = [collectionView dequeueReusableCellWithReuseIdentifier:@"RCIMDiscussionGroupMemberCell" forIndexPath:indexPath];
        NSDictionary *info = self.members[indexPath.item];
        NSString *emp_name = [info objectForKey:@"emp_name"];//name
        NSLog(@"infp:%@",info);
        NSString *avatar = [info objectForKey:@"avatar"];//img
        [RCIMDiscussionMemberCell.memberImageV sd_setImageWithURL:[NSURL URLWithString:avatar] placeholderImage:[UIImage imageNamed:@"profile-2@3x.png"]];
        [RCIMDiscussionMemberCell.memberName setText:emp_name];
        [RCIMDiscussionMemberCell.memberName setTextColor:[UIColor blackColor]];
        cell = RCIMDiscussionMemberCell;
    }else
    //设置最后一个为添加好友按钮
    {
        RCIMDiscussionGroupMemberCell *RCIMDiscussionMemberCell = [collectionView dequeueReusableCellWithReuseIdentifier:@"RCIMDiscussionGroupMemberCell" forIndexPath:indexPath];
        [RCIMDiscussionMemberCell.memberImageV setImage:[UIImage imageNamed:@"add_icon_friend@2x.png"]];
        [RCIMDiscussionMemberCell.memberName setText:@"邀请"];
        [RCIMDiscussionMemberCell.memberName setTextColor:[UIColor colorWithRed:0 green:195/255.0 blue:255/255.0 alpha:1.0]];
        cell = RCIMDiscussionMemberCell;
    }
    return cell;
}
-(void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
    NSLog(@"indexpath:(%li,%li)",indexPath.section,indexPath.row);
    if (indexPath.row==self.members.count) {
        RCIMDiscussionGroupAddMemberController *RCIMDiscussionGroupAddMemberVC = [[RCIMDiscussionGroupAddMemberController alloc] init];
        RCIMDiscussionGroupAddMemberVC.discussionId = self.discussionId;
        RCIMDiscussionGroupAddMemberVC.delegate = self;
        [self.navigationController pushViewController:RCIMDiscussionGroupAddMemberVC animated:YES];
    }
}

#pragma mark - 显示所有成员
- (void)tapMembersCell:(UITapGestureRecognizer *)tap
{
    //显示成员列表
    NSLog(@"显示成员列表");
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
                //如果一样 退出并解散讨论组 由于SDK没有解散功能需要自己做处理-》创建人移除所有成员
                for (NSString *memberId in discussion.memberIdList) {
                    if (![memberId isEqualToString:discussion.creatorId]) {
                        //先移除其他的所有人
                        [[RCIMClient sharedRCIMClient] removeMemberFromDiscussion:discussion.discussionId userId:memberId success:^(RCDiscussion *discussion) {
                            NSLog(@"讨论组成功移除成员:%@",memberId);
                        } error:^(RCErrorCode status) {
                            NSLog(@"讨论组移除成员失败,%li",status);
                        }];
                    }else{
                        //最后自己退出讨论组
                        [[RCIMClient sharedRCIMClient] quitDiscussion:discussion.discussionId success:^(RCDiscussion *discussion) {
                            NSLog(@"讨论组被解散!!!,%@",discussion.discussionName);
                            //清除本地该讨论组的缓存
                            [[RCIMClient sharedRCIMClient] removeConversation:ConversationType_DISCUSSION targetId:discussion.discussionId];
                            //返回根界面
                            [self.navigationController dismissViewControllerAnimated:YES completion:nil];
                        } error:^(RCErrorCode status) {
                            NSLog(@"讨论组被解散失败!!!,%li",status);
                        }];
                    }
                }
            }else{
                //不一样 退出讨论组
                [[RCIMClient sharedRCIMClient] quitDiscussion:self.discussionId success:^(RCDiscussion *discussion) {
                    NSLog(@"退出讨论组成功:%@",discussion.discussionName);
                    //清除本地该讨论组的缓存
                    [[RCIMClient sharedRCIMClient] removeConversation:ConversationType_DISCUSSION targetId:self.discussionId];
                    //返回根界面
                    [self.navigationController dismissViewControllerAnimated:YES completion:nil];
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
    [[RCIMClient sharedRCIMClient] setConversationNotificationStatus:ConversationType_DISCUSSION targetId:self.discussionId isBlocked:!(sender.isOn) success:^(RCConversationNotificationStatus nStatus) {
        NSLog(@"设置新消息提醒成功:%lu",nStatus);//0 免打扰 1 提醒
    } error:^(RCErrorCode status) {
        NSLog(@"设置新消息提醒失败:%li",status);
    }];
}


#pragma mark - RCIMDiscusiionGroupAddMemberController
- (void)returnALlDiscussionGroupMembers:(NSMutableArray *)members
{
    NSLog(@"returnALlDiscussionGroupMembers:%li",members.count);
    [self.members addObjectsFromArray:members];
    CGFloat heightForHeaderView = CellHeight + 80*((self.members.count)/4+1)+10*((self.members.count)/4+1);
    [self.membersCollectionView setFrame:CGRectMake(20, CellHeight, screenWidth-20*2, 80*((self.members.count)/4+1)+10*((self.members.count)/4+1))];
    self.headerView.bounds = CGRectMake(0, 0, screenWidth, heightForHeaderView);
    [self.tableView.tableHeaderView setFrame:self.headerView.frame];
    self.tableView.tableHeaderView = self.headerView;
    UIView *titleCell = [self.headerView viewWithTag:100];
    UILabel *headerRight = [titleCell viewWithTag:102];
    [headerRight setText:[NSString stringWithFormat:@"%li 人",self.members.count]];
    [self.membersCollectionView reloadData];
}
@end
