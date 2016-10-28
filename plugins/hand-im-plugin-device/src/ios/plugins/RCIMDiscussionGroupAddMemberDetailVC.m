//
//  RCIMDiscussionGroupAddMemberDetailVC.m
//  自己所在组织
//
//  Created by wangsheng on 16/9/18.
//
//

#import "RCIMDiscussionGroupAddMemberDetailVC.h"
#import "CVDPlugin-Bridging-Header.h"
#import "RCIMDiscussionGroupAllMembersList.h"
#import "RCIMDiscussionGroupAddMemberDetailCell.h"
#import "UIImageView+WebCache.h"
#import "RCIMDiscussionGroupAddMemberSystemCell.h"
#import "RCIMDiscussionGroupAddMemberDetailDefaultCell.h"
#import "ZLProgressHUD.h"
#import "RCIMDiscussionGroupEditViewController.h"
#import "RCIMDiscussionGroupScanMemberDetailVC.h"
#import "RCIMDiscussionSearchController.h"
#import "RCIMGroupChatViewController.h"
#import "ToastUtils.h"

@interface RCIMDiscussionGroupAddMemberDetailVC ()<UITableViewDataSource,UITableViewDelegate,UIScrollViewDelegate,UISearchBarDelegate,UISearchResultsUpdating,UISearchControllerDelegate,RCIMDiscussionGroupAllMembersListDeleagte,RCIMDiscussionGroupScanMemberDetailVCProtocol>
{
    CGFloat  contentX;
    ZLProgressHUD *progress;
    BOOL isAllSelected;
    NSInteger invitedUserNumber;
}
@property (nonatomic,strong)UITableView *tableView;
@property (nonatomic,strong)RCIMDiscussionSearchController *searchController;
@property (nonatomic,strong)UIScrollView *headerView;
@property (nonatomic,strong)UIView *bottomToolBar;
/*
 * childrenDeptArray,deptStaffArray,deptInfoArray这三个都是数据源
 */
@property (nonatomic,strong)NSArray *childrenDeptArray;
@property (nonatomic,strong)NSArray *deptStaffArray;
@property (nonatomic,strong)NSArray *deptInfoArray;
/*
 * selectedAllUsers 所有被选中的员工（包括所选部门里面的所有员工）
 * selectedDepts 所有被选中的部门
 * selectedUsers 所有被选中的员工（不包含部门里面）
 */
@property (nonatomic,strong)NSMutableArray *selectedAllUsers;
@property (nonatomic,strong)NSMutableArray *selectedDepts;
@property (nonatomic,strong)NSMutableArray *selectedUsers;


@end

static NSString *detailCellId = @"RCIMDiscussionGroupAddMemberDetailCell";
static NSString *systemCellID = @"RCIMDiscussionGroupAddMemberSystemCell";
static NSString *defaultCellId   = @"RCIMDiscussionGroupAddMemberDetailDefaultCell";

@implementation RCIMDiscussionGroupAddMemberDetailVC

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    
}

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    invitedUserNumber = 0;
    
    //获取分组情况
    progress = [[ZLProgressHUD alloc] init];
    
    [self getDetailInfoWithDepartID:self.currentDepartId];
    
    //设置导航栏标题颜色
    self.navigationController.navigationBar.titleTextAttributes = @{NSForegroundColorAttributeName:[UIColor whiteColor]};
    self.navigationItem.title = self.navTitle;
    
    [self.view addSubview:self.tableView];
    
    [self initBottomToolBar];
    
    [self.selectedDepts addObjectsFromArray:self.totalSelectedDeparts];
    
    [self.selectedUsers addObjectsFromArray:self.totalSelectedEmployees];
    NSLog(@"选中的人:%@",_selectedUsers);
    [self reloadBottomBar:self.selectedDepts.count InvitedNum:self.totalNum];
    
    invitedUserNumber = self.totalNum;
}
-(UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}
- (void)initBottomToolBar
{
    UILabel *selectedMember_lab;
    UIButton *sureBtn;
    _bottomToolBar = [[UIView alloc] initWithFrame:CGRectMake(0, self.view.bounds.size.height-44, self.view.bounds.size.width, 44)];
    [self.view addSubview:_bottomToolBar];
    selectedMember_lab = [[UILabel alloc] initWithFrame:CGRectMake(10, 0, self.view.bounds.size.width-110, 44)];
    [selectedMember_lab setUserInteractionEnabled:YES];
    [selectedMember_lab setTag:1];
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(scanSelectedMembers:)];
    [selectedMember_lab addGestureRecognizer:tap];
    selectedMember_lab.text = @"已选择:";
    selectedMember_lab.textColor = [UIColor colorWithRed:35/255.0 green:69/255.0 blue:156/255.0 alpha:1.0];
    selectedMember_lab.font = [UIFont systemFontOfSize:14.0];
    
    [_bottomToolBar addSubview:selectedMember_lab];
    sureBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_bottomToolBar addSubview:sureBtn];
    
    
    sureBtn.layer.cornerRadius = 6.0;
    sureBtn.titleLabel.font = [UIFont systemFontOfSize:12.0];
    [sureBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    if (_isCreated) {
        [sureBtn setTitle:[NSString stringWithFormat:@"创建"] forState:UIControlStateNormal];
    }else{
        [sureBtn setTitle:[NSString stringWithFormat:@"添加"] forState:UIControlStateNormal];
    }
    [sureBtn setTag:2];
    [sureBtn addTarget:self action:@selector(finishSelect) forControlEvents:UIControlEventTouchUpInside];
    sureBtn.frame = CGRectMake(self.view.bounds.size.width-60-10, 7, 60, 30);
    sureBtn.backgroundColor = [UIColor colorWithRed:35/255.0 green:69/255.0 blue:156/255.0 alpha:1.0];
    
    [_bottomToolBar setBackgroundColor:[UIColor whiteColor]];
    _bottomToolBar.layer.borderColor = [UIColor lightGrayColor].CGColor;
    _bottomToolBar.layer.borderWidth = 0.5;
    NSLog(@"initBottomToolBar");
}

#pragma mark -预览拉取的联系人列表
- (void)scanSelectedMembers:(UITapGestureRecognizer *)tap
{
    //点击底部栏确定按钮后 加入选中的部门和选中的员工 员工和部门分开
    //部门在上 员工在下 只是预览效果不能进入下一级
    RCIMDiscussionGroupScanMemberDetailVC *scanVC = [[RCIMDiscussionGroupScanMemberDetailVC alloc] init];
    scanVC.totalSelectedUsers = self.selectedUsers;
    scanVC.totalSelectedDepts = self.selectedDepts;
    scanVC.totalNumber = invitedUserNumber;
    scanVC.delegate = self;
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:scanVC];
    [self presentViewController:nav animated:YES completion:nil];
    NSLog(@"预览拉取的联系人列表");
}

#pragma mark -开始创建讨论组
- (void)finishSelect
{
    NSLog(@"开始finishSelect");
    if (_isCreated) {
        if (invitedUserNumber) {
            [progress show];
            //遍历所有的部门列表 + 单个成员
            for (NSString *idStr in self.selectedUsers) {
                if (![self.selectedAllUsers containsObject:idStr]) {
                    [self.selectedAllUsers addObject:idStr];
                }
            }
            dispatch_group_t group = dispatch_group_create();
            dispatch_queue_t queue = dispatch_queue_create("cn.gcd-group.www", DISPATCH_QUEUE_CONCURRENT);
            
            if (self.selectedDepts.count) {
                for (NSDictionary *dept in self.selectedDepts) {
                    dispatch_group_async(group, queue, ^(){
                        dispatch_group_enter(group);
                        [self getAllInfoFromDepart:dept[@"departmentId"] Group:group];
                        
                    });
                }
            }
            dispatch_group_notify(group, queue, ^{
                NSMutableArray *tempArr = [NSMutableArray array];
                NSString *longinUser = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
                [tempArr addObject:[NSDictionary dictionaryWithObject:longinUser forKey:@"key"]];
                for (NSString *emp_id in self.selectedAllUsers) {//顺便把自己加进去
                    [tempArr addObject:[NSDictionary dictionaryWithObject:emp_id forKey:@"key"]];
                }
                [self getContactsInfoByIdList:tempArr isCreate:YES];
                
            });
        }
    }else{
        [progress show];
        if (invitedUserNumber) {
            
        //添加
        //遍历所有的部门列表 + 单个成员
        for (NSString *idStr in self.selectedUsers) {
            if (![self.selectedAllUsers containsObject:idStr]) {
                [self.selectedAllUsers addObject:idStr];
            }
        }
        dispatch_group_t group = dispatch_group_create();
        dispatch_queue_t queue = dispatch_queue_create("cn.gcd-group.www", DISPATCH_QUEUE_CONCURRENT);
        
        if (self.selectedDepts.count) {
            for (NSDictionary *dept in self.selectedDepts) {
                dispatch_group_async(group, queue, ^(){
                    dispatch_group_enter(group);
                    [self getAllInfoFromDepart:dept[@"departmentId"] Group:group];
                    
                });
            }
        }
        dispatch_group_notify(group, queue, ^{
            NSMutableArray *tempArr = [NSMutableArray array];
            for (NSString *emp_id in self.selectedAllUsers) {
                [tempArr addObject:[NSDictionary dictionaryWithObject:emp_id forKey:@"key"]];
            }
            [self getContactsInfoByIdList:tempArr isCreate:NO];
            
        });
     }
    }
}


#pragma makr -刷新底部工具栏
- (void)reloadBottomBar:(NSInteger)departCount InvitedNum:(NSInteger)count
{
    UILabel *selectedMember_lab = [_bottomToolBar viewWithTag:1];
    
    if (departCount) {
        selectedMember_lab.text = [NSString stringWithFormat:@"已选择：%li人，其中包含%li个子部门",count,departCount];
    }else{
        if (count) {
            selectedMember_lab.text = [NSString stringWithFormat: @"已选择：%li人",count];
        }else{
            selectedMember_lab.text = @"已选择：";
        }
    }
}


- (NSMutableArray *)selectedAllUsers
{
    if (_selectedAllUsers==nil) {
        _selectedAllUsers = [NSMutableArray array];
    }
    return _selectedAllUsers;
}

- (NSMutableArray *)selectedDepts
{
    if (_selectedDepts==nil) {
        _selectedDepts = [NSMutableArray array];
    }
    return _selectedDepts;
}

- (NSMutableArray *)selectedUsers
{
    if (_selectedUsers==nil) {
        _selectedUsers = [NSMutableArray array];
    }
    return _selectedUsers;
}


-(UITableView *)tableView{
    if (_tableView == nil) {
        _tableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 0, screenWidth, screenHeight) style:UITableViewStyleGrouped];
        _tableView.delegate = self;
        _tableView.dataSource = self;
        _tableView.rowHeight = 60;
        self.tableView.tableHeaderView = self.searchController.searchBar;
        self.tableView.tableFooterView = [[UIView alloc] init];
        [_tableView registerClass:[RCIMDiscussionGroupAddMemberDetailCell class] forCellReuseIdentifier:detailCellId];
        [_tableView registerClass:[RCIMDiscussionGroupAddMemberSystemCell class] forCellReuseIdentifier:systemCellID];
        [_tableView registerClass:[RCIMDiscussionGroupAddMemberDetailDefaultCell class] forCellReuseIdentifier:defaultCellId];
    }
    return _tableView;
}

-(UISearchController *)searchController{
    if (_searchController == nil) {
        RCIMDiscussionGroupAllMembersList  *RCIMAllMembersList =[[RCIMDiscussionGroupAllMembersList alloc] init];
        RCIMAllMembersList.delegate = self;
        _searchController = [[RCIMDiscussionSearchController alloc] initWithSearchResultsController:RCIMAllMembersList];
        //设置代理
        _searchController.searchResultsUpdater = self;
        //搜索时，背景变模糊
        if ([UIDevice currentDevice].systemVersion.floatValue>=9.0) {
            _searchController.obscuresBackgroundDuringPresentation = YES;
        }
        //隐藏导航栏
        _searchController.hidesNavigationBarDuringPresentation = YES;
        
        _searchController.searchBar.frame = CGRectMake(0, 0, screenWidth, 44);
        
        [_searchController.searchBar setBarTintColor:[UIColor whiteColor]];
        //  [_searchController.searchBar setBackgroundImage:[UIImage imageNamed:@"NavBar"]];
        [_searchController.searchBar setSearchBarStyle:UISearchBarStyleProminent];
        
        [_searchController.searchBar sizeToFit];
        _searchController.searchBar.delegate = self;
        _searchController.delegate = self;
        self.definesPresentationContext = YES;
    }
    return _searchController;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    if (self.childrenDeptArray.count==0 &&self.deptStaffArray.count==0) {
        return 0;
    }
    return (self.childrenDeptArray.count + self.deptStaffArray.count + 1);
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell;
    if (indexPath.row == 0) {
        RCIMDiscussionGroupAddMemberSystemCell *systemCell = [tableView dequeueReusableCellWithIdentifier:systemCellID];
        systemCell.imageV.image = [UIImage imageNamed:@"btn_original_circle@3x.png"];
        systemCell.titleLabel.text = @"全选";
        if (isAllSelected) {
            systemCell.isSelected = YES;
        }else{
            systemCell.isSelected = NO;
        }
        cell = systemCell;
    }else{
        RCIMDiscussionGroupAddMemberDetailDefaultCell *defaultCell = [tableView dequeueReusableCellWithIdentifier:defaultCellId];
        [defaultCell.nextDept setTag:indexPath.row-1];
        [defaultCell.nextDept addTarget:self action:@selector(toNextDept:) forControlEvents:UIControlEventTouchUpInside];
        //前面是部门
        if (self.childrenDeptArray.count) {
            if (indexPath.row > self.childrenDeptArray.count) {
                //插入员工cell
                RCIMDiscussionGroupAddMemberDetailCell *detailCell = [tableView dequeueReusableCellWithIdentifier:detailCellId];
                NSDictionary *person = self.deptStaffArray[indexPath.row-1-self.childrenDeptArray.count];//accountNumber ,userName avatar
                NSString *icon = [person objectForKey:@"avatar"];
                NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
                if ([self.selectedUsers containsObject:person[@"accountNumber"]]) {
                    detailCell.isSelected = YES;
                    
                }else{
                    detailCell.isSelected = NO;
                    
                }
                //如果是登陆用户默认选中
                if ([[person objectForKey:@"accountNumber"] integerValue]==userId.integerValue) {
                    detailCell.imageV1.image = [UIImage imageNamed:@"btn_unselected@3x.png"];
                }
                if ([person objectForKey:@"avatar"]==nil||[icon isEqual:[NSNull null]]) {
                    icon = @"profile-2@3x.png";
                }
                [detailCell.imageV2 sd_setImageWithURL:[NSURL URLWithString:icon] placeholderImage:[UIImage imageNamed:@"profile-2@3x.png"] options:SDWebImageProgressiveDownload];
                detailCell.titleLabel.text = [person objectForKey:@"userName"];
                cell = detailCell;
            }else{
                defaultCell.titleLabel.text = [NSString stringWithFormat:@"%@(%@)",self.childrenDeptArray[indexPath.row-1][@"departmentName"],self.childrenDeptArray[indexPath.row-1][@"totalStaffNumber"]];
                NSDictionary *depart = self.childrenDeptArray[indexPath.row-1];
                if ([self.selectedDepts containsObject:depart]) {
                    defaultCell.isSelected = YES;
                    defaultCell.nextDept.enabled = NO;
                }else{
                    defaultCell.isSelected = NO;
                    defaultCell.nextDept.enabled = YES;
                }
                cell = defaultCell;
            }
            
        }else{
            //最底层 只有员工cell
            
            RCIMDiscussionGroupAddMemberDetailCell *detailCell = [tableView dequeueReusableCellWithIdentifier:detailCellId];
            NSDictionary *person = self.deptStaffArray[indexPath.row-1];
            if ([self.selectedUsers containsObject:person[@"accountNumber"]]) {
                
                detailCell.isSelected = YES;
                
            }else{
                detailCell.isSelected = NO;
            }
            NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
            //如果是登陆用户默认选中
            if ([[person objectForKey:@"accountNumber"] integerValue]==userId.integerValue) {
                detailCell.imageV1.image = [UIImage imageNamed:@"btn_unselected@3x.png"];
            }            NSString *icon = [person objectForKey:@"avatar"];
            if ([person objectForKey:@"avatar"]==nil||[icon isEqual:[NSNull null]]) {
                icon = @"profile-2@3x.png";
            }
            [detailCell.imageV2 sd_setImageWithURL:[NSURL URLWithString:icon] placeholderImage:[UIImage imageNamed:@"profile-2@3x.png"] options:SDWebImageProgressiveDownload];
            detailCell.titleLabel.text = [person objectForKey:@"userName"];
            cell  =detailCell;
        }
        
    }
    return cell;
}

#pragma mark -返回自定义表头高度
- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    return 40;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 60;
}

#pragma mark -返回自定义表头
-(UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section
{
    _headerView = [[UIScrollView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, 40)];
    _headerView.showsHorizontalScrollIndicator = NO;
    CGFloat XContentOff = 0 ;
    for (int i=0; i<self.deptInfoArray.count; i++) {
        
        NSString *text = [NSString stringWithFormat:@"%@-",[self.deptInfoArray[i] objectForKey:@"name"]];
        CGSize textSize = [text sizeWithAttributes:@{NSFontAttributeName:[UIFont systemFontOfSize:16.0]}];
        UILabel *label = [[UILabel alloc] init];
        [label setUserInteractionEnabled:YES];//21 133 255
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapLabel:)];
        [label addGestureRecognizer:tap];
        [label setTag:i];
        //[label setBackgroundColor:[UIColor redColor]];
        label.font = [UIFont systemFontOfSize:16.0];
        label.textColor = [UIColor colorWithRed:35/255.0 green:69/255.0 blue:156/255.0 alpha:1.0];
        label.frame = CGRectMake(XContentOff, 10, textSize.width, 20);
        XContentOff = CGRectGetMaxX(label.frame);
        
        label.text = [NSString stringWithFormat:@"%@-",[self.deptInfoArray[i] objectForKey:@"name"]];
        [_headerView addSubview:label];
        
        if (i==self.deptInfoArray.count-1) {
            _headerView.contentSize = CGSizeMake(XContentOff, 40);
            label.textColor = [UIColor blackColor];
            label.text = [self.deptInfoArray[i] objectForKey:@"name"];
        }
        
        [self.headerView setContentOffset:CGPointMake(XContentOff, 0) animated:YES];
    }
    return _headerView;
}

#pragma mark -点击滚动条头部
- (void)tapLabel:(UITapGestureRecognizer *)tap
{
    NSString *departId = self.deptInfoArray[tap.view.tag][@"id"];
    [self getAnyDetailInfoWithDepartID:departId];
    
    isAllSelected = NO;
    NSLog(@"点击滚动条头部");
}

#pragma mark -点击下级相应
- (void)toNextDept:(UIButton *)sender
{
   
    NSLog(@"toNextDept");
    [self getAnyDetailInfoWithDepartID:[self.childrenDeptArray[sender.tag] objectForKey:@"departmentId"]];
    
    isAllSelected = NO;
}


-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    if (indexPath.row == 0) {
        RCIMDiscussionGroupAddMemberSystemCell *systemCell = [tableView cellForRowAtIndexPath:indexPath];
        systemCell.isSelected = !systemCell.isSelected;
        //全选
        isAllSelected = !isAllSelected;
        if (isAllSelected) {
            
            NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
            //遍历所有的人员
            [self.deptStaffArray enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                NSDictionary *person = obj;
                if ([[person objectForKey:@"accountNumber"] integerValue]!=userId.integerValue) {
                    if (![self.selectedUsers containsObject:person[@"accountNumber"]]) {
                        [self.selectedUsers addObject:person[@"accountNumber"]];
                        invitedUserNumber++;
                    }
                }
            }];
            
            //遍历所有的部门
            [self.childrenDeptArray enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                NSDictionary *department = obj;
                
                if (![self.selectedDepts containsObject:department]) {
                    [self.selectedDepts addObject:department];
                    invitedUserNumber+=[department[@"totalStaffNumber"] integerValue];
                }
            }];
            [self.delegate RCIMDiscussionGroupAddMemberDetailVCDidSelectedDepars:self.selectedDepts Employees:self.selectedUsers TotalNum:invitedUserNumber isSelected:YES];
        }else{
            //反选
            NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
            NSMutableArray *tempArray = [NSMutableArray array];
            for (NSDictionary *obj in self.deptStaffArray) {
                if ([[obj objectForKey:@"accountNumber"] integerValue]!=userId.integerValue) {
                    [tempArray addObject:(NSString *)[obj objectForKey:@"accountNumber"]];
                }
            }
            [self.selectedUsers removeObjectsInArray:tempArray];
            invitedUserNumber-=tempArray.count;
            [self.selectedDepts removeObjectsInArray:self.childrenDeptArray];
            [self.childrenDeptArray enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                NSDictionary *department = obj;
                invitedUserNumber-=[department[@"totalStaffNumber"] integerValue];
            }];
            
            [self.delegate RCIMDiscussionGroupAddMemberDetailVCDidSelectedDepars:self.selectedDepts Employees:self.selectedUsers TotalNum:invitedUserNumber isSelected:NO];
        }
        [tableView reloadData];
        
    }else{
        isAllSelected = NO;
        //刷新第一行
        [tableView reloadRowsAtIndexPaths:@[[NSIndexPath indexPathForRow:0 inSection:0]] withRowAnimation:UITableViewRowAnimationNone];
        RCIMDiscussionGroupAddMemberDetailDefaultCell *defaultCell = [tableView cellForRowAtIndexPath:indexPath];
        //前面是部门
        if (self.childrenDeptArray.count) {
            if (indexPath.row > self.childrenDeptArray.count) {
                //员工部分
                RCIMDiscussionGroupAddMemberDetailCell *detailCell = [tableView cellForRowAtIndexPath:indexPath];
                //如果是登陆用户默认选中
                NSDictionary *person = self.deptStaffArray[indexPath.row-1-self.childrenDeptArray.count];
                NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
                if ([[person objectForKey:@"accountNumber"] integerValue]!=userId.integerValue) {
                    detailCell.isSelected = !detailCell.isSelected;
                    if (detailCell.isSelected) {
                        //把联系人加入
                        if (![self.selectedUsers containsObject:[person objectForKey:@"accountNumber"]]) {
                            [self.selectedUsers addObject:[person objectForKey:@"accountNumber"]];
                             invitedUserNumber++;
                           [self.delegate RCIMDiscussionGroupAddMemberDetailVCDidSelectedDepart:nil Employee:[person objectForKey:@"accountNumber"] TotalNum:invitedUserNumber isSelected:YES];
                        }
                       
                    }else{
                        
                        [self.selectedUsers removeObject:person];
                        invitedUserNumber--;
                        [self.delegate RCIMDiscussionGroupAddMemberDetailVCDidSelectedDepart:nil Employee:[person objectForKey:@"accountNumber"] TotalNum:invitedUserNumber isSelected:NO];
                    }
                }
                
            }else{
                //部门部分
                defaultCell.isSelected = !defaultCell.isSelected;
                NSDictionary *department = self.childrenDeptArray[indexPath.row-1];
                //更具部门获取所有部门下的所有员工信息
                if (defaultCell.isSelected) {
                    defaultCell.nextDept.enabled = NO;
                    if (![self.selectedDepts containsObject:department]) {
                         [self.selectedDepts addObject:department];
                        invitedUserNumber+=[self.childrenDeptArray[indexPath.row-1][@"totalStaffNumber"] integerValue];
                    }
                    [self.delegate RCIMDiscussionGroupAddMemberDetailVCDidSelectedDepart:department Employee:nil TotalNum:invitedUserNumber isSelected:YES];
                }else{
                    defaultCell.nextDept.enabled = YES;
                    [self.selectedDepts removeObject:department];
                    invitedUserNumber-=[self.childrenDeptArray[indexPath.row-1][@"totalStaffNumber"] integerValue];
                    [self.delegate RCIMDiscussionGroupAddMemberDetailVCDidSelectedDepart:department Employee:nil TotalNum:invitedUserNumber isSelected:NO];
                }
            }
        }else{
            //最底层 只有员工cell
            RCIMDiscussionGroupAddMemberDetailCell *detailCell = [tableView cellForRowAtIndexPath:indexPath];
            NSDictionary *person = self.deptStaffArray[indexPath.row-1];
            NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
            NSLog(@"%@-%@",[person objectForKey:@"accountNumber"],userId);
            //如果是登陆用户默认选中
            if ([[person objectForKey:@"accountNumber"] integerValue]!=userId.integerValue) {
                detailCell.isSelected = !detailCell.isSelected;
                if (detailCell.isSelected) {
                    if (![self.selectedUsers containsObject:[person objectForKey:@"accountNumber"]]) {
                        [self.selectedUsers addObject:[person objectForKey:@"accountNumber"]];
                        invitedUserNumber++;
                    }
                    [self.delegate RCIMDiscussionGroupAddMemberDetailVCDidSelectedDepart:nil Employee:[person objectForKey:@"accountNumber"] TotalNum:invitedUserNumber isSelected:YES];
                }else{
                    [self.selectedUsers removeObject:[person objectForKey:@"accountNumber"]];
                    invitedUserNumber--;
                    [self.delegate RCIMDiscussionGroupAddMemberDetailVCDidSelectedDepart:nil Employee:[person objectForKey:@"accountNumber"] TotalNum:invitedUserNumber isSelected:NO];
                }
            }

        }
        
    }
    
    [self reloadBottomBar:self.selectedDepts.count InvitedNum:invitedUserNumber];
    NSLog(@"didSelectRowAtIndexPath");
}

#pragma mark - searchControllerUpdate
- (void)updateSearchResultsForSearchController:(UISearchController *)searchController
{
    NSLog(@"updateSearchResultsForSearchController");
    [self connectToService:searchController.searchBar.text];
}
- (void)willDismissSearchController:(UISearchController *)searchController
{
    [searchController.searchBar setBackgroundImage:nil forBarPosition:UIBarPositionAny barMetrics:UIBarMetricsDefault];
}

#pragma mark 搜索框的代理方法，搜索输入框获得焦点（聚焦）
-(void)searchBarTextDidBeginEditing:(UISearchBar *)searchBar
{
    [searchBar setShowsCancelButton:YES animated:YES];
    
    [searchBar setBackgroundImage:[UIImage imageNamed:@"NavBar@3x"] forBarPosition:UIBarPositionAny barMetrics:UIBarMetricsDefault];
    // 修改UISearchBar右侧的取消按钮文字颜色及背景图片
    for (UIView *searchbuttons in [searchBar subviews][0].subviews){
        NSLog(@"searchbuttons:%@",searchbuttons);
        if ([searchbuttons isKindOfClass:[UIButton class]]) {
            UIButton *cancelButton = (UIButton*)searchbuttons;
            // 修改文字颜色
            [cancelButton setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
            [cancelButton setTitleColor:[UIColor whiteColor] forState:UIControlStateHighlighted];
            
        }
    }
}

- (void)deleteContactsOrDepartment:(NSArray *)selectedDepart SelectedUsers:(NSArray *)selectedUsers TotalNumber:(NSInteger)totalNumber Depart:(NSDictionary *)department Employee:(NSString *)employeeId
{
    [self.delegate RCIMDiscussionGroupAddMemberDetailVCDidSelectedDepart:department Employee:employeeId TotalNum:totalNumber isSelected:NO];
    
    [self.selectedUsers removeAllObjects];
    [self.selectedUsers addObjectsFromArray:selectedUsers];
    
    [self.selectedDepts removeAllObjects];
    [self.selectedDepts addObjectsFromArray:selectedDepart];
    
    [self.tableView reloadData];
    
    [self reloadBottomBar:self.selectedDepts.count InvitedNum:totalNumber];
    invitedUserNumber = totalNumber;
    NSLog(@"come here 部门数量:%li,总数:%li",self.selectedDepts.count,totalNumber);
}


#pragma mark - 网络接口访问-----------------------------------------------------
#pragma mark -搜索联系人
- (void)connectToService:(NSString *)text
{
    NSString *access_token = [[NSUserDefaults standardUserDefaults] objectForKey:@"access_token"];
    NSString *path = [NSString stringWithFormat:@"%@access_token=%@",localServiceQuery,access_token];
    NSURL *url = [NSURL URLWithString:path];
    NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:url];
    [urlRequest setHTTPMethod:@"POST"];
    NSDictionary *requestBody = @{@"key":text,@"page":@1,@"pageSize":@10};
    [urlRequest setHTTPBody:[NSJSONSerialization dataWithJSONObject:requestBody options:NSJSONWritingPrettyPrinted error:nil]];
    NSDictionary *headers = @{@"content-type": @"application/json"};
    [urlRequest setAllHTTPHeaderFields:headers];
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            NSArray *returnArray = [json objectForKey:@"rows"];
            RCIMDiscussionGroupAllMembersList *RCIMDiscussionGroupList = (RCIMDiscussionGroupAllMembersList *)self.searchController.searchResultsController;
            RCIMDiscussionGroupList.text =  self.searchController.searchBar.text;
            RCIMDiscussionGroupList.viewController = self;
            RCIMDiscussionGroupList.dataList  = [NSMutableArray arrayWithArray:returnArray];
            RCIMDiscussionGroupList.totalNum = invitedUserNumber;
            RCIMDiscussionGroupList.totalSelectedDepts = self.selectedDepts;
            RCIMDiscussionGroupList.totalSelectedMembers = self.selectedUsers;
            RCIMDiscussionGroupList.discussionId = self.discussionId;
            RCIMDiscussionGroupList.isCreated = self.isCreated;
            dispatch_async(dispatch_get_main_queue(), ^{
                [RCIMDiscussionGroupList reloadTableView];
                NSLog(@"开始刷新了");
            });
            //  NSLog(@"返回数据：%@ ,count:%li,%@",returnArray,returnArray.count, RCIMDiscussionGroupList.dataList);
        }else{
            NSLog(@"data:%@,error:%@",data,error);
        }
    }];
    
    [dataTask resume];
}
#pragma mark -获取自己所在组组织架构
- (void)getDetailInfoWithDepartID:(NSString *)departId
{
    [progress show];
    NSLog(@"departId:%@",departId);
    NSString *access_token = [[NSUserDefaults standardUserDefaults] objectForKey:@"access_token"];
    NSString *path = [NSString stringWithFormat:@"%@/hrmsv2/v2/api/dept/getDetail?access_token=%@",rootService,access_token];
    NSLog(@"path:%@",path);
    NSURL *url = [NSURL URLWithString:path];
    NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:url];
    [urlRequest setHTTPMethod:@"POST"];
    NSDictionary *requestBody = @{@"id":departId};
    [urlRequest setHTTPBody:[NSJSONSerialization dataWithJSONObject:requestBody options:NSJSONWritingPrettyPrinted error:nil]];
    NSDictionary *headers = @{@"content-type": @"application/json"};
    [urlRequest setAllHTTPHeaderFields:headers];
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    [configuration setTimeoutIntervalForRequest:30.0];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            _deptStaffArray = json[@"returnData"][@"deptStaff"];
            _deptInfoArray = json[@"returnData"][@"deptInfo"];
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.tableView reloadData];
                [progress hide];
            });
            NSLog(@"子--%@-----%@",json[@"returnData"][@"deptStaff"],json[@"returnData"]);
        }else{
            NSLog(@"data:%@,error:%@",data,error);
            dispatch_async(dispatch_get_main_queue(), ^{
                [progress hide];
            });
        }
    }];
    [dataTask resume];
}

#pragma mark -获取任何组织架构
- (void)getAnyDetailInfoWithDepartID:(NSString *)departId
{
    [progress show];
    NSLog(@"departId:%@",departId);
    NSString *access_token = [[NSUserDefaults standardUserDefaults] objectForKey:@"access_token"];
    NSString *path = [NSString stringWithFormat:@"%@/hrmsv2/v2/api/dept/getDetail?access_token=%@",rootService,access_token];
    NSLog(@"path:%@",path);
    NSURL *url = [NSURL URLWithString:path];
    NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:url];
    [urlRequest setHTTPMethod:@"POST"];
    NSDictionary *requestBody = @{@"id":departId};
    [urlRequest setHTTPBody:[NSJSONSerialization dataWithJSONObject:requestBody options:NSJSONWritingPrettyPrinted error:nil]];
    NSDictionary *headers = @{@"content-type": @"application/json"};
    [urlRequest setAllHTTPHeaderFields:headers];
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            _childrenDeptArray = json[@"returnData"][@"childrenDept"];//获取子部门
            _deptStaffArray = json[@"returnData"][@"deptStaff"];//获取该级别所有员工
            _deptInfoArray = json[@"returnData"][@"deptInfo"];//获取所在部门级别层
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.tableView reloadData];
                [progress hide];
            });
            NSLog(@"%@---%li,%li",json[@"returnData"],_childrenDeptArray.count,_deptStaffArray.count);
        }else{
            NSLog(@"data:%@,error:%@",data,error);
        }
    }];
    [dataTask resume];
}

#pragma mark -根据id拉取所有人的info
- (void)getContactsInfoByIdList:(NSArray *)employee_id isCreate:(BOOL)isCreated
{
    [progress show];
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
    [configuration setTimeoutIntervalForRequest:30.0];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            NSArray *tempArr =json[@"rows"];// avatar,emp_name,emp_code
            dispatch_async(dispatch_get_main_queue(), ^{
                [progress hide];
            });
            if (isCreated) {
                //讨论组名称 这里为所有联系人姓名拼接
                __block NSString *originalName = @"";
                [tempArr enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                    NSDictionary *userInfo = obj;
                    originalName = [originalName stringByAppendingString:[NSString stringWithFormat:@"%@、",userInfo[@"emp_name"]]];
                }];
                
                [[RCIMClient sharedRCIMClient] createDiscussion:originalName userIdList:self.selectedAllUsers success:^(RCDiscussion *discussion) {
                    NSLog(@"创建讨论组成功回调:%@",discussion.memberIdList);
                    [progress hide];
                    RCIMGroupChatViewController *RCIMGroupChatVC = [[RCIMGroupChatViewController alloc] init];
                    RCIMGroupChatVC.discussionId = discussion.discussionId;
                    RCIMGroupChatVC.navTitle = discussion.discussionName;
                    RCIMGroupChatVC.discussionUsersInfo = tempArr;
                    dispatch_async(dispatch_get_main_queue(), ^{
                        [self.navigationController pushViewController:RCIMGroupChatVC animated:YES];
                    });
                    
                } error:^(RCErrorCode status) {
                    [progress hide];
                    NSLog(@"创建讨论组失败回调:%li",status);
                }];
            }else{
                //
                [[RCIMClient sharedRCIMClient] addMemberToDiscussion:self.discussionId userIdList:self.selectedAllUsers success:^(RCDiscussion *discussion) {
                    NSLog(@"添加讨论组成员");
                    dispatch_async(dispatch_get_main_queue(), ^{
                        RCIMGroupChatViewController *RCIMGroupChatVC;
                        for (UIViewController *vc in self.navigationController.viewControllers) {
                            if ([vc isMemberOfClass:[RCIMGroupChatViewController class]]) {
                                RCIMGroupChatVC =(RCIMGroupChatViewController*)vc;
                            }
                        }
                        RCIMGroupChatVC.discussionId = discussion.discussionId;
                        RCIMGroupChatVC.navTitle = discussion.discussionName;
                        [self.navigationController popToViewController:RCIMGroupChatVC animated:YES];
                    });
                } error:^(RCErrorCode status) {
                    NSLog(@"添加讨论组成员失败:%li",status);
                    if (status==1) {
                        //讨论组中已有此人
                        dispatch_async(dispatch_get_main_queue(), ^{
                            [ToastUtils showLong:@"新添加的联系人已在讨论组中"];
                        });
                    }
                }];
            }
            NSLog(@"项目列表联系人%@,,,,,,,%@",json,tempArr);
        }else{
            [progress hide];
            NSLog(@"%@",error.localizedDescription);
        }
    }];
    [dataTask resume];
}

#pragma mark -根据部门获取该部门下所有的员工信息
- (void)getAllInfoFromDepart:(NSString *)departId Group:(dispatch_group_t)group
{
    NSString *access_token = [[NSUserDefaults standardUserDefaults] objectForKey:@"access_token"];
    NSString *path = [NSString stringWithFormat:@"%@/hrmsv2/v2/api/dept/getTotalStaffInfo?access_token=%@",rootService,access_token];
    NSLog(@"path:%@",path);
    NSURL *url = [NSURL URLWithString:path];
    NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:url];
    [urlRequest setHTTPMethod:@"POST"];
    NSDictionary *requestBody = @{@"id":departId};
    [urlRequest setHTTPBody:[NSJSONSerialization dataWithJSONObject:requestBody options:NSJSONWritingPrettyPrinted error:nil]];
    NSDictionary *headers = @{@"content-type": @"application/json"};
    [urlRequest setAllHTTPHeaderFields:headers];
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    [configuration setTimeoutIntervalForRequest:30];//设置最大请求时间10秒
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            NSArray *returnArray = json[@"returnData"];//accountNumber,userName,avatar
            //查询选中所有人中是否包含当前登录人
            NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
            for (NSDictionary *person in returnArray) {
                if (![self.selectedAllUsers containsObject:person[@"accountNumber"]] && [person[@"accountNumber"] integerValue]!=userId.integerValue) {
                    [self.selectedAllUsers addObject:person[@"accountNumber"]];
                }
            }
            NSLog(@"所有员工数目%li,详情:%@",returnArray.count,returnArray);
        }else{
            NSLog(@"data:%@,error:%li",data,error.code);
            if (error.code==-1001) {//网络请求超时
                dispatch_async(dispatch_get_main_queue(), ^{
                    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"请求超时" message:@"拉取人数过多，请分层级拉取！" delegate:self cancelButtonTitle:@"好的" otherButtonTitles:nil];
                    [alert show];
                });
            }
        }
        dispatch_group_leave(group);
    }];
    [dataTask resume];
}

- (void)ViewControllerWillDrag
{
    [self.searchController.searchBar resignFirstResponder];
}

- (void)didSelectCell:(NSString *)userId isSelected:(BOOL)selected
{
    if (selected) {
        if (![self.selectedUsers containsObject:userId]) {
            [self.selectedUsers addObject:userId];
            invitedUserNumber++;
            [self.delegate RCIMDiscussionGroupAddMemberDetailVCDidSelectedDepart:nil Employee:userId TotalNum:invitedUserNumber isSelected:YES];
        }
    }else{
        if ([self.selectedUsers containsObject:userId]) {
            [self.selectedUsers removeObject:userId];
            invitedUserNumber--;
            [self.delegate RCIMDiscussionGroupAddMemberDetailVCDidSelectedDepart:nil Employee:userId TotalNum:invitedUserNumber isSelected:NO];
        }
    }
    [self.tableView reloadData];
    [self reloadBottomBar:self.selectedDepts.count InvitedNum:invitedUserNumber];
}

@end
