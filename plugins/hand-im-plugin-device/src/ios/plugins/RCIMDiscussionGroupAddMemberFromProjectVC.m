//
//  RCIMDiscussionGroupAddMemberFromProjectVC.m
//  汉得移动测试版
//
//  Created by wangsheng on 16/9/22.
//
//

#import "RCIMDiscussionGroupAddMemberFromProjectVC.h"
#import "CVDPlugin-Bridging-Header.h"
#import "RCIMDiscussionGroupAllMembersList.h"
#import "RCIMDiscussionGroupAddMemberDetailCell.h"
#import "RCIMDiscussionGroupAddMemberDetailDefaultCell.h"
#import "UIImageView+WebCache.h"
#import "RCIMDiscussionGroupAddMemberSystemCell.h"
#import "ZLProgressHUD.h"
#import "RCIMGroupChatViewController.h"
#import "RCIMDiscussionGroupScanMemberDetailVC.h"
#import "RCIMDiscussionGroupAllMembersList.h"
#import "RCIMDiscussionSearchController.h"
#import "ToastUtils.h"

@interface RCIMDiscussionGroupAddMemberFromProjectVC ()<UITableViewDataSource,UITableViewDelegate,UIScrollViewDelegate,UISearchBarDelegate,UISearchResultsUpdating,UISearchControllerDelegate,RCIMDiscussionGroupAllMembersListDeleagte,RCIMDiscussionGroupScanMemberDetailVCProtocol>
{
    CGFloat contentX;
    ZLProgressHUD *progress;
    BOOL isAllSelected;
    NSInteger invitedUserNumber;
}
@property (nonatomic,strong)UITableView *tableView;
@property (nonatomic,strong)UISearchController *searchController;
@property (nonatomic,strong)UIScrollView *headerView;
@property (nonatomic,strong)UIView *bottomToolBar;
@property (nonatomic,strong)NSArray *deptStaffArray;

@property (nonatomic,strong)NSMutableArray *selectedDepart;
@property (nonatomic,strong)NSMutableArray *selectedMembers;
@property (nonatomic,strong)NSMutableArray *selectedAllMembers;
@end

static NSString *systemCellID = @"RCIMDiscussionGroupAddMemberSystemCell";
static NSString *detailCellID   = @"RCIMDiscussionGroupAddMemberDetailCell";
@implementation RCIMDiscussionGroupAddMemberFromProjectVC

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    isAllSelected = NO;
}

- (NSMutableArray *)selectedMembers
{
    if (_selectedMembers==nil) {
        _selectedMembers = [NSMutableArray array];
    }
    return _selectedMembers;
}

- (NSMutableArray *)selectedAllMembers
{
    if (_selectedAllMembers==nil) {
        _selectedAllMembers = [NSMutableArray array];
    }
    return _selectedAllMembers;
}
- (NSMutableArray *)selectedDepart
{
    if (_selectedDepart==nil) {
        _selectedDepart = [NSMutableArray array];
    }
    return _selectedDepart;
}

- (void)viewDidLoad {
    
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    //获取分组情况
    progress = [[ZLProgressHUD alloc] init];
    UILabel *titleView = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, 160, 30)];
    [titleView setTextColor:[UIColor whiteColor]];
    titleView.text = self.navTitle;
    self.navigationItem.titleView  = titleView;
    
    //设置导航栏按钮颜色
    [self.navigationController.navigationBar setTintColor:[UIColor whiteColor]];
    
    [self.view addSubview:self.tableView];
    
    [self initBottomToolBar];
    
    [self getContactsFromProjectList:self.currentProjectId];
    
  
    invitedUserNumber = self.totalNum;
    
    [self.selectedDepart addObjectsFromArray:self.totalSelectedDeparts];
    [self.selectedMembers addObjectsFromArray:self.totalSelectedEmployees];
    
    [self reloadBottomBar:self.selectedDepart.count TotalNum:invitedUserNumber];
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
        [sureBtn setTitle:@"创建" forState:UIControlStateNormal];
    }else{
        [sureBtn setTitle:@"添加" forState:UIControlStateNormal];
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

#pragma makr -预览拉取的联系人列表
- (void)scanSelectedMembers:(UITapGestureRecognizer *)tap
{
    RCIMDiscussionGroupScanMemberDetailVC *scanVC = [[RCIMDiscussionGroupScanMemberDetailVC alloc] init];
    
    scanVC.totalSelectedUsers = self.selectedMembers;
    scanVC.totalSelectedDepts = self.selectedDepart;
    scanVC.totalNumber = invitedUserNumber;
    scanVC.delegate = self;
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:scanVC];
    [self presentViewController:nav animated:YES completion:nil];
    NSLog(@"预览拉取的联系人列表:%li,%li", scanVC.totalSelectedDepts.count,scanVC.totalSelectedUsers.count);
}

#pragma mark -finishSelect
- (void)finishSelect
{
    NSLog(@"开始finishSelect");
    if (_isCreated) {
        if (invitedUserNumber) {
            [progress show];
            //遍历所有的部门列表 + 单个成员
            for (NSString *idStr in self.selectedMembers) {
                if (![self.selectedAllMembers containsObject:idStr]) {
                    [self.selectedAllMembers addObject:idStr];
                }
            }
            dispatch_group_t group = dispatch_group_create();
            dispatch_queue_t queue = dispatch_queue_create("cn.gcd-group.www", DISPATCH_QUEUE_CONCURRENT);
            
            if (self.selectedDepart.count) {
                for (NSDictionary *dept in self.selectedDepart) {
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
                for (NSString *emp_id in self.selectedAllMembers) {//顺便把自己加进去
                    [tempArr addObject:[NSDictionary dictionaryWithObject:emp_id forKey:@"key"]];
                }
                [self getContactsInfoByIdList1:tempArr isCreate:YES];
                
            });
        }
    }else{
        if (invitedUserNumber) {
            [progress show];
            //添加
            //遍历所有的部门列表 + 单个成员
            for (NSString *idStr in self.selectedMembers) {
                if (![self.selectedAllMembers containsObject:idStr]) {
                    [self.selectedAllMembers addObject:idStr];
                }
            }
            dispatch_group_t group = dispatch_group_create();
            dispatch_queue_t queue = dispatch_queue_create("cn.gcd-group.www", DISPATCH_QUEUE_CONCURRENT);
            
            if (self.selectedDepart.count) {
                for (NSDictionary *dept in self.selectedDepart) {
                    dispatch_group_async(group, queue, ^(){
                        dispatch_group_enter(group);
                        [self getAllInfoFromDepart:dept[@"departmentId"] Group:group];
                        
                    });
                }
            }
            dispatch_group_notify(group, queue, ^{
                NSMutableArray *tempArr = [NSMutableArray array];
                for (NSString *emp_id in self.selectedAllMembers) {
                    [tempArr addObject:[NSDictionary dictionaryWithObject:emp_id forKey:@"key"]];
                }
                [self getContactsInfoByIdList1:tempArr isCreate:NO];
            });
        }
    }
}

#pragma makr -刷新底部工具栏
- (void)reloadBottomBar:(NSInteger)departNum TotalNum:(NSInteger)invitedNum
{
    UILabel *selectedMember_lab = [_bottomToolBar viewWithTag:1];
    if (invitedNum) {
        if (departNum) {
            selectedMember_lab.text = [NSString stringWithFormat:@"已选择：%li人,其中有一个部门",invitedNum];
        }else{
            selectedMember_lab.text = [NSString stringWithFormat:@"已选择：%li人",invitedNum];
        }
    }else{
        selectedMember_lab.text = @"已选择：";
    }
}



-(UITableView *)tableView{
    if (_tableView == nil) {
        _tableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 0, screenWidth, screenHeight) style:UITableViewStyleGrouped];
        _tableView.delegate = self;
        _tableView.dataSource = self;
        _tableView.rowHeight = 60;
        
        _tableView.tableHeaderView = self.searchController.searchBar;
        _tableView.tableFooterView = [[UIView alloc] init];

        [_tableView registerClass:[RCIMDiscussionGroupAddMemberSystemCell class] forCellReuseIdentifier:systemCellID];
        [_tableView registerClass:[RCIMDiscussionGroupAddMemberDetailCell class] forCellReuseIdentifier:detailCellID];
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
        
        [self.searchController.searchBar sizeToFit];
        self.searchController.searchBar.delegate = self;
        self.searchController.delegate = self;
        self.definesPresentationContext = YES;
    }
    return _searchController;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    if (self.deptStaffArray.count) {
        return (self.deptStaffArray.count + 1);
    }
    return 0;
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
            //最底层 只有员工cell
            RCIMDiscussionGroupAddMemberDetailCell *detailCell = [tableView dequeueReusableCellWithIdentifier:detailCellID];
            NSDictionary *person = self.deptStaffArray[indexPath.row-1];
            if ([self.selectedMembers containsObject:person[@"emp_code"]]) {
                detailCell.isSelected = YES;
            }else{
                detailCell.isSelected = NO;
            }
            NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
            //如果是登陆用户默认选中
            if ([[person objectForKey:@"emp_code"] integerValue]==userId.integerValue) {
                detailCell.imageV1.image = [UIImage imageNamed:@"btn_unselected@3x.png"];
            }
            NSString *icon = [person objectForKey:@"avatar"];
            if (icon==nil||[icon isEqual:[NSNull null]]) {
                icon = @"profile-2@3x.png";
            }
            [detailCell.imageV2 sd_setImageWithURL:[NSURL URLWithString:icon] placeholderImage:[UIImage imageNamed:@"profile-2@3x.png"] options:SDWebImageProgressiveDownload];
            detailCell.titleLabel.text = [person objectForKey:@"emp_name"];
            cell  =detailCell;
        }

    return cell;
}
#pragma mark -返回自定义表头高度
- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    return 30;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 60;
}

#pragma mark -返回自定义表头
-(UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section
{
    _headerView = [[UIScrollView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, 30)];
    _headerView.showsHorizontalScrollIndicator = NO;
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(back)];
    [_headerView addGestureRecognizer:tap];
    CGSize textSize = [self.navTitle sizeWithAttributes:@{NSFontAttributeName:[UIFont systemFontOfSize:16.0]}];
    UILabel *label = [[UILabel alloc] init];
    label.frame = CGRectMake(10, 5, textSize.width, 20);
    label.textColor = [UIColor blackColor];
    label.text = self.navTitle;
    //[label setBackgroundColor:[UIColor redColor]];
    label.font = [UIFont systemFontOfSize:16.0];
    label.textColor = [UIColor colorWithRed:35/255.0 green:69/255.0 blue:156/255.0 alpha:1.0];
    [_headerView addSubview:label];
    
    return _headerView;
}

- (void)back
{
    [self.navigationController popViewControllerAnimated:YES];
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    if (indexPath.row==0) {
        //全选
        RCIMDiscussionGroupAddMemberSystemCell *systemCell = [tableView cellForRowAtIndexPath:indexPath];
        systemCell.isSelected = !systemCell.isSelected;
        //全选
        isAllSelected = !isAllSelected;
        if (isAllSelected) {
            //把所有选中行加入数组
            //遍历员工
            NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
            NSMutableArray *tempArr = [NSMutableArray array];
            [self.deptStaffArray enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                NSDictionary *person = obj;
                if (![self.selectedMembers containsObject:person[@"emp_code"]] && [person[@"emp_code"] integerValue]!=userId.integerValue) {
                    [self.selectedMembers addObject:person[@"emp_code"]];
                    invitedUserNumber++;
                }
                [tempArr addObject:person[@"emp_code"]];
            }];
            //代理方法
            [self.delegate RCIMDiscussionGroupAddMemberFromProjectVCDidSelected:tempArr TotalInvitedNum:invitedUserNumber IsSelected:YES];
        }else{
            //反选
            NSMutableArray *tempArr = [NSMutableArray array];
            for (NSDictionary *person in self.deptStaffArray) {
                [tempArr addObject:person[@"emp_code"]];
            }
            [self.delegate RCIMDiscussionGroupAddMemberFromProjectVCDidSelected:self.selectedMembers TotalInvitedNum:invitedUserNumber IsSelected:NO];
            [self.selectedMembers removeObjectsInArray:tempArr];
            invitedUserNumber-=(self.deptStaffArray.count-1);//包含了自己 -1
        }
        [tableView reloadData];
    }else{
        isAllSelected = NO;
        [tableView reloadRowsAtIndexPaths:@[[NSIndexPath indexPathForRow:0 inSection:0]] withRowAnimation:UITableViewRowAnimationNone];
        //最底层 只有员工cell
        RCIMDiscussionGroupAddMemberDetailCell *detailCell = [tableView cellForRowAtIndexPath:indexPath];
        NSDictionary *person = self.deptStaffArray[indexPath.row-1];//emp_code emp_name avatar
        NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
        //如果是登陆用户默认选中
        if ([[person objectForKey:@"emp_code"] integerValue]!=userId.integerValue) {
            detailCell.isSelected = !detailCell.isSelected;
            if (detailCell.isSelected) {
                if (![self.selectedMembers containsObject:person[@"emp_code"]]) {
                    [self.selectedMembers addObject:person[@"emp_code"]];
                     invitedUserNumber++;
                }
                [self.delegate RCIMDiscussionGroupAddMemberFromProjectVCDidSelected:@[person[@"emp_code"]] TotalInvitedNum:invitedUserNumber IsSelected:YES];
            }else{
                [self.selectedMembers removeObject:person[@"emp_code"]];
                invitedUserNumber--;
                [self.delegate RCIMDiscussionGroupAddMemberFromProjectVCDidSelected:@[person[@"emp_code"]] TotalInvitedNum:invitedUserNumber IsSelected:NO];
            }
        }
    }
    
    [self reloadBottomBar:self.totalSelectedDeparts.count TotalNum:invitedUserNumber];
    
    NSLog(@"didSelectRowAtIndexPath");
}

#pragma mark - searchControllerUpdate
- (void)updateSearchResultsForSearchController:(UISearchController *)searchController
{
    NSLog(@"updateSearchResultsForSearchController");
    [self connectToService:searchController.searchBar.text];
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

- (void)searchBarCancelButtonClicked:(UISearchBar *)searchBar
{
    [searchBar setBackgroundImage:nil forBarPosition:UIBarPositionAny barMetrics:UIBarMetricsDefault];
}

#pragma mark - 搜索代理
- (void)ViewControllerWillDrag
{
    [self.searchController.searchBar resignFirstResponder];
}

#pragma mark -RCIMDiscussionGroupAllMembersListDelegate
- (void)didSelectCell:(NSString *)userId isSelected:(BOOL)selected
{
    if (selected) {
        if (![self.selectedMembers containsObject:userId]) {
            [self.selectedMembers addObject:userId];
            invitedUserNumber++;
            [self.delegate RCIMDiscussionGroupAddMemberFromProjectVCDidSelected:@[userId] TotalInvitedNum:invitedUserNumber IsSelected:YES];
        }
    }else{
        if ([self.selectedMembers containsObject:userId]) {
            [self.selectedMembers removeObject:userId];
            [self.delegate RCIMDiscussionGroupAddMemberFromProjectVCDidSelected:@[userId] TotalInvitedNum:invitedUserNumber IsSelected:NO];
            invitedUserNumber--;
        }
    }
    [self.tableView reloadData];
    [self reloadBottomBar:self.selectedDepart.count TotalNum:invitedUserNumber];
}


#pragma mark - 预览控制器的删除后部门或联系人代理方法
- (void)deleteContactsOrDepartment:(NSArray *)selectedDepart SelectedUsers:(NSArray *)selectedUsers TotalNumber:(NSInteger)totalNumber Depart:(NSDictionary *)department Employee:(NSString *)employeeId
{
    if (employeeId) {
        [self.delegate RCIMDiscussionGroupAddMemberFromProjectVCDidSelected:@[employeeId]
                                                                TotalInvitedNum:totalNumber  IsSelected:NO];
    }else{
        [self.delegate RCIMDiscussionGroupAddMemberFromProjectVCDidDeleteDeptSelected:department TotalInvitedNum:totalNumber IsSelected:NO];
    }
    
    self.selectedDepart = nil;
    [self.selectedDepart addObjectsFromArray:selectedDepart];
    self.selectedMembers = nil;
    [self.selectedMembers addObjectsFromArray:selectedUsers];
    [self.tableView reloadData];
    
     invitedUserNumber = totalNumber;
    
    [self reloadBottomBar:selectedDepart.count TotalNum:totalNumber];
    
    NSLog(@"项目组:%@--%@--%li",selectedDepart,selectedUsers,totalNumber);
}
#pragma mark -判断字符串是否是纯数字
- (BOOL)isPureNumandCharacters:(NSString *)string
{
    string = [string stringByTrimmingCharactersInSet:[NSCharacterSet decimalDigitCharacterSet]];
    if(string.length > 0)
    {
        return NO;
    }
    return YES;
}
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
            RCIMDiscussionGroupList.totalSelectedDepts = self.selectedDepart;
            RCIMDiscussionGroupList.totalSelectedMembers = self.selectedMembers;
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

#pragma mark -根据项目拉取联系人
- (void)getContactsFromProjectList:(NSString *)project_id
{
    [progress show];
    NSString *access_token = [[NSUserDefaults standardUserDefaults] objectForKey:@"access_token"];
    NSString *path = [NSString stringWithFormat:@"%@/hrmsv2/v2/api/l/api_resources_query/get_project_member?access_token=%@",rootService,access_token];
    NSURL *url = [NSURL URLWithString:path];
    NSLog(@"-------------path:%@,,,,,%@",path,project_id);
    NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:url];
    [urlRequest setHTTPMethod:@"POST"];
    NSDictionary *requestBody = @{@"params":@{
                                          @"p_project_id":project_id
                                          }
                                  };
    [urlRequest setHTTPBody:[NSJSONSerialization dataWithJSONObject:requestBody options:NSJSONWritingPrettyPrinted error:nil]];
    NSDictionary *headers = @{@"content-type": @"application/json"};
    [urlRequest setAllHTTPHeaderFields:headers];
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    [configuration setTimeoutIntervalForRequest:30.0];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            NSMutableArray *tempArray = [NSMutableArray array];
            tempArray  = json[@"employee_list"];
            NSMutableArray *array = [NSMutableArray array];
            [tempArray enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                NSDictionary *person = obj;
                NSLog(@"employee_number:%@-employee_name:%@",person[@"employee_number"],person[@"employee_name"]);
                NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
                if ([self isPureNumandCharacters:person[@"employee_number"]]&& [person[@"employee_number"] integerValue]!=userId.integerValue) {
                    NSDictionary *staffId  = [NSDictionary dictionaryWithObject:person[@"employee_number"] forKey:@"key"];
                    [array addObject:staffId];
                }
            }];
            
            [self getContactsInfoByIdList:array];
            NSLog(@"项目列表联系人%@,,,,,,,%@",json,json[@"returnMsg"]);
        }else{
            [progress hide];
            NSLog(@"%@",error.description);
        }
    }];
    [dataTask resume];
}
#pragma mark -根据memberId拉取头像
- (void)getContactsInfoByIdList:(NSArray *)employee_id
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
    [configuration setTimeoutIntervalForRequest:15.0];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            self.deptStaffArray = json[@"rows"];// avatar,emp_name,emp_code
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.tableView reloadData];
                [progress hide];
            });
            
            NSLog(@"项目列表联系人%@,,,,,,,%@",json,self.deptStaffArray);
        }else{
            [progress hide];
            NSLog(@"%@",error.description);
        }
    }];
    [dataTask resume];
}
#pragma mark -根据memberId拉取头像
- (void)getContactsInfoByIdList1:(NSArray *)employee_id isCreate:(BOOL)isCreated
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
    [configuration setTimeoutIntervalForRequest:15.0];
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
                
                [[RCIMClient sharedRCIMClient] createDiscussion:originalName userIdList:self.selectedAllMembers success:^(RCDiscussion *discussion) {
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
                [[RCIMClient sharedRCIMClient] addMemberToDiscussion:self.discussionId userIdList:self.selectedAllMembers success:^(RCDiscussion *discussion) {
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
                if (![self.selectedAllMembers containsObject:person[@"accountNumber"]] && [person[@"accountNumber"] integerValue]!=userId.integerValue) {
                    [self.selectedAllMembers addObject:person[@"accountNumber"]];
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
@end
