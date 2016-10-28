//
//  RCIMDiscussionGroupAddMemberController.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/19.
//
//

#import "RCIMDiscussionGroupAddMemberController.h"
#import "CVDPlugin-Bridging-Header.h"
#import "RCIMDiscussionGroupAllMembersList.h"
#import "UIImage+UIColor.h"
#import "UIImageView+WebCache.h"
#import "RCIMDiscussionGroupEditViewController.h"
#import "ZLProgressHUD.h"
#import "ToastUtils.h"
#import "DataBaseTool.h"
#import "RCIMDiscussionGroupAddMemberDetailVC.h"
#import "RCIMDiscussionGroupAddMemberDetailDepartVC.h"
#import "RCIMDiscussionGroupAddMemberControllerCell.h"
#import "RCIMDiscussionGroupAddMemberFromProjectVC.h"
#import "RCIMDiscussionGroupScanMemberDetailVC.h"
#import "RCIMDiscussionSearchController.h"
#import "RCIMGroupChatViewController.h"

@interface RCIMDiscussionGroupAddMemberController ()<UISearchResultsUpdating,UISearchControllerDelegate,UITableViewDelegate,UITableViewDataSource,RCIMDiscussionGroupAllMembersListDeleagte,UISearchBarDelegate,RCIMDiscussionGroupAddMemberFromProjectVCDelagete,RCIMDiscussionGroupScanMemberDetailVCProtocol,RCIMDiscussionGroupAddMemberDetailDepartVCProtocol,RCIMDiscussionGroupAddMemberDetailVCProtocol>
{
    ZLProgressHUD *progress;
    NSInteger invitedUserNumber;
    dispatch_group_t group;
    dispatch_queue_t queue;
}
@property (nonatomic,strong)UITableView *tableView;
@property (nonatomic,strong)RCIMDiscussionSearchController *searchController;
@property (nonatomic,strong)NSMutableArray *dataSource;
@property (nonatomic,strong)UIView *bottomToolBar;
@property (nonatomic,strong)UIView *headerView;
@property (nonatomic,strong)NSMutableArray *flags;

/*!
 * 项目列表
 */
@property (nonatomic,strong)NSMutableArray *projectList;
/*!
 * 常用联系人
 */
@property (nonatomic,strong)NSMutableArray * favoriteContacts;
/*!
 * selectedMembers 所有被选中的员工（包括所选部门里面的所有员工）
 * selectedDepts 所有被选中的部门
 * selectedUsers 所有被选中的员工（不包含部门里面）
 */
@property (nonatomic,strong)NSMutableArray *selectedMembers;
@property (nonatomic,strong)NSMutableArray *selectedDepts;
@property (nonatomic,strong)NSMutableArray *selectedUsers;
@property (nonatomic,strong)NSArray *discussionUserInfo;

@end
static NSString *reusableCellID = @"RCIMDiscussionGroupAddMemberControllerCell";

@implementation RCIMDiscussionGroupAddMemberController


- (NSMutableArray *)selectedMembers
{
    if (_selectedMembers==nil) {
        _selectedMembers = [NSMutableArray array];
    }
    return _selectedMembers;
}
- (NSMutableArray *)selectedUsers
{
    if (_selectedUsers==nil) {
        _selectedUsers = [NSMutableArray array];
    }
    return _selectedUsers;
}
- (NSMutableArray *)selectedDepts
{
    if (_selectedDepts==nil) {
        _selectedDepts = [NSMutableArray array];
    }
    return _selectedDepts;
}
- (NSMutableArray *)dataSource
{
    if (_dataSource==nil) {
       _dataSource = [NSMutableArray array];
    }
    return _dataSource;
}

- (NSMutableArray *)projectList
{
    if (_projectList==nil) {
        _projectList = [NSMutableArray array];
    }
    return _projectList;
}

- (NSMutableArray *)flags
{
    if (_flags==nil) {
        _flags = [NSMutableArray arrayWithCapacity:3];
        for (int i=0; i<3; i++) {
            [_flags addObject:@(1)];
        }
    }
    return _flags;
}

-(UITableView *)tableView{
    if (_tableView == nil) {
        _tableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 0, screenWidth, screenHeight - 44) style:UITableViewStyleGrouped];
        _tableView.delegate = self;
        _tableView.dataSource = self;
        _tableView.tableHeaderView = self.searchController.searchBar;
        _tableView.tableFooterView = [[UIView alloc] init];
        _tableView.rowHeight = 60.0;
        [_tableView registerClass:[RCIMDiscussionGroupAddMemberControllerCell class] forCellReuseIdentifier:reusableCellID];
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
        if([[UIDevice currentDevice]systemVersion].floatValue>=9.0f){
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

- (void)viewDidLoad {
    [super viewDidLoad];
    invitedUserNumber = 0;
    [self initNavBar];
    [self.view setBackgroundColor:[UIColor whiteColor]];
    
    [self.view addSubview:self.tableView];
    
    [self initBottomToolBar];
    progress = [[ZLProgressHUD alloc] init];
    
     group = dispatch_group_create();
     queue = dispatch_queue_create("cn.gcd-group.www", DISPATCH_QUEUE_CONCURRENT);
    [progress show];
    dispatch_group_async(group, queue, ^{
        dispatch_group_enter(group);
        [self getDetailInfoWithUserId];
    });
    dispatch_group_async(group, queue, ^{
        dispatch_group_enter(group);
        [self getProjectList];
    });
}

- (void)initNavBar
{
    self.navigationItem.title = @"请选择联系人";
    if (self.navigationController.childViewControllers.count==1) {
        self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"取消" style:UIBarButtonItemStylePlain target:self action:@selector(cancelSelect)];
    }else{
        UIView *backBtn = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 120, 44)];
        UIImageView *imageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"back_nav_white"]];
        imageView.frame = CGRectMake(-18, 7, 30, 30);
        [backBtn addSubview:imageView];
        
        UILabel *backTitle = [[UILabel alloc] initWithFrame:CGRectMake(CGRectGetMaxX(imageView.frame), 7, 80, 30)];
        backTitle.textColor = [UIColor whiteColor];
        backTitle.text = @"聊天设置";
        [backBtn addSubview:backTitle];
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(popViewController)];
        [backBtn addGestureRecognizer:tap];
        
        self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithCustomView:backBtn];
    }
    //设置导航栏标题颜色
    self.navigationController.navigationBar.titleTextAttributes = @{NSForegroundColorAttributeName:[UIColor whiteColor]};
    //设置导航栏按钮颜色
    [self.navigationController.navigationBar setTintColor:[UIColor whiteColor]];
    //设置导航栏背景图片
    [self.navigationController.navigationBar setBackgroundImage:[UIImage imageNamed:@"NavBar"] forBarMetrics:UIBarMetricsDefault];
}

-(UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

- (void)popViewController
{
    [self.navigationController popViewControllerAnimated:YES];
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
    [_bottomToolBar addSubview:selectedMember_lab];
    sureBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_bottomToolBar addSubview:sureBtn];
    selectedMember_lab.text = @"已选择：";
    selectedMember_lab.textColor = [UIColor colorWithRed:35/255.0 green:69/255.0 blue:156/255.0 alpha:1.0];
    selectedMember_lab.font = [UIFont systemFontOfSize:14.0];
    
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

#pragma mark -预览
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

-(void)viewDidLayoutSubviews {
    
    if ([self.tableView respondsToSelector:@selector(setSeparatorInset:)]) {
        [self.tableView setSeparatorInset:UIEdgeInsetsZero];
        
    }
    if ([self.tableView respondsToSelector:@selector(setLayoutMargins:)])  {
        [self.tableView setLayoutMargins:UIEdgeInsetsZero];
    }
    
}

#pragma mark -UITabelViewDataSource
- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return 3;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section;
{
    if (section==0) {
        //组织架构
        if ([self.flags[section] intValue]) {
            return self.dataSource.count;
        }
    }else if (section==1){
        //我的项目
        if ([self.flags[section] intValue]) {
            return self.projectList.count;
        }
    }else{
        //常用联系人
        if ([self.flags[section] intValue]) {
            return self.favoriteContacts.count;
        }

    }
        return 0;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    RCIMDiscussionGroupAddMemberControllerCell *cell = [tableView dequeueReusableCellWithIdentifier:reusableCellID];
    
    if (indexPath.section==0) {
        //组织架构
        if (indexPath.row==0) {
            cell.departImageView.image = [UIImage imageNamed:@"icon-60@3x"];
        }else{
            cell.departImageView.image = [UIImage imageNamed:@"cell_image.png"];
        }
         cell.departTitle.text = [self.dataSource[indexPath.row] objectForKey:@"name"];
    }else if (indexPath.section==1){
        //我的项目 内部项目和外部项目
        NSDictionary *project = self.projectList[indexPath.row];
        NSString *project_name = project[@"project_name"];
        if ([project_name containsString:@"汉得内部项目"]) {
            
            cell.departImageView.image = [UIImage imageNamed:@"project2_icon"];//
        }else{
            cell.departImageView.image = [UIImage imageNamed:@"project_icon"];
        }
        cell.departTitle.text = project[@"project_name"];
    }else{
        //常用联系人
    }
        return cell;
}

#pragma mark -返回自定义表头高度
- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    return 30;
}
- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section
{
    return CGFLOAT_MIN;
}

#pragma mark -返回自定义表头
-(UIView *)tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section
{
    _headerView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, 30)];
    //_headerView.backgroundColor = [UIColor redColor];
    UITapGestureRecognizer *tapHeader = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapHeaderView:)];
    _headerView.tag = section;
    [_headerView addGestureRecognizer:tapHeader];
    UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(10, 0, self.view.bounds.size.width-10, 30)];
    [label setFont:[UIFont systemFontOfSize:14.0]];
    [label setTextColor:[UIColor colorWithRed:35/255.0 green:69/255.0 blue:156/255.0 alpha:1.0]];//35,69,156
    if (section==0) {
        //组织架构
        [label setText:@"组织架构"];
    }else if (section==1){
        [label setText:@"我的项目"];
    }else{
        [label setText:@"常用联系人"];
    }
    [_headerView addSubview:label];
    return _headerView;
}

#pragma mark -点击sectionHeader头部收缩 展开
- (void)tapHeaderView:(UITapGestureRecognizer *)tap
{
    NSLog(@"tapHeaderView:%li",tap.view.tag);
    NSInteger section = tap.view.tag;
    int value = [self.flags[section] intValue];
    self.flags[section] = @(!value);
    NSLog(@"self.flags:%@",self.flags);
    [self.tableView reloadSections:[NSIndexSet indexSetWithIndex:section] withRowAnimation:UITableViewRowAnimationNone];
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    UIViewController *vc ;
    if (indexPath.section==0) {
        //组织架构
        if (indexPath.row==0) {
            RCIMDiscussionGroupAddMemberDetailDepartVC *departVC = [[RCIMDiscussionGroupAddMemberDetailDepartVC alloc] init];
            departVC.delegate = self;
            departVC.discussionId = self.discussionId;
            departVC.isCreated = self.isCreated;
            departVC.totalNum = invitedUserNumber;
            departVC.totalSelectedDeparts = self.selectedDepts;
            departVC.totalSelectedEmployees = self.selectedUsers;
            departVC.navTitle = [self.dataSource[indexPath.row] objectForKey:@"name"];
            departVC.currentDepartId = [self.dataSource[indexPath.row] objectForKey:@"id"];;
            vc = departVC;
        }else{
            //自己所在部门
            RCIMDiscussionGroupAddMemberDetailVC *detailVC = [[RCIMDiscussionGroupAddMemberDetailVC alloc] init];
            detailVC.totalNum = invitedUserNumber;
            detailVC.delegate = self;
            detailVC.discussionId = self.discussionId;
            detailVC.isCreated = self.isCreated;
            detailVC.totalSelectedDeparts  = self.selectedDepts;
            detailVC.totalSelectedEmployees  =self.selectedUsers;
            detailVC.navTitle = [self.dataSource[indexPath.row] objectForKey:@"name"];
            detailVC.currentDepartId = [self.dataSource[indexPath.row] objectForKey:@"id"];;
            vc = detailVC;
        }
    }else if (indexPath.section==1){
        //我的项目
        NSDictionary *project = self.projectList[indexPath.row];
        RCIMDiscussionGroupAddMemberFromProjectVC *projectVC = [[RCIMDiscussionGroupAddMemberFromProjectVC alloc] init];
        projectVC.totalSelectedDeparts = self.selectedDepts;
        projectVC.totalSelectedEmployees = self.selectedUsers;
        projectVC.totalNum = invitedUserNumber;
        projectVC.discussionId = self.discussionId;
        projectVC.isCreated = self.isCreated;
        projectVC.delegate = self;
        projectVC.navTitle = [project objectForKey:@"project_name"];
        projectVC.currentProjectId = [project objectForKey:@"project_id"];
        vc = projectVC;
    }else{
        //常用联系人
    }
    
    [self.navigationController pushViewController:vc animated:YES];
    
    NSLog(@"didSelectRowAtIndexPath");
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
    return 60.0;
}

#pragma mark - searchController delegate
- (void)updateSearchResultsForSearchController:(UISearchController *)searchController
{
    [self connectToService:searchController.searchBar.text];
    NSLog(@"changed");
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

#pragma mark -RCIMDiscussionGroupAddMemberDetailDepartVCProtocol
- (void)didSelectedDepart:(NSDictionary *)depart Employee:(NSString *)employeeId TotalNum:(NSInteger)totalNum isSelected:(BOOL)selected
{
    NSLog(@"单选操作");
    if (selected) {
        if (depart) {
            if (![self.selectedDepts containsObject:depart]) {
                [self.selectedDepts addObject:depart];
            }
        }else{
            if (![self.selectedUsers containsObject:employeeId]) {
                [self.selectedUsers addObject:employeeId];
            }
        }
        
    }else{
        if (depart) {
            if ([self.selectedDepts containsObject:depart]) {
                [self.selectedDepts removeObject:depart];
            }
        }else{
            if ([self.selectedUsers containsObject:employeeId]) {
                [self.selectedUsers removeObject:employeeId];
            }
        }
    }
    invitedUserNumber = totalNum;
    [self reloadBottomBar:self.selectedDepts.count TotalNum:totalNum];
}
- (void)didSelectedDeparts:(NSArray *)departs Employees:(NSArray *)employees TotalNum:(NSInteger)totalNum isSelected:(BOOL)selected
{
    NSLog(@"多选操作");
    [self.selectedDepts removeAllObjects];
    [self.selectedDepts addObjectsFromArray:departs];
    
    [self.selectedUsers removeAllObjects];
    [self.selectedUsers addObjectsFromArray:employees];
    
    invitedUserNumber = totalNum;
    [self reloadBottomBar:self.selectedDepts.count TotalNum:totalNum];
}

#pragma mark - RCIMDiscussionGroupAddMemberDetailVCProtocol
- (void)RCIMDiscussionGroupAddMemberDetailVCDidSelectedDepart:(NSDictionary *)depart Employee:(NSString *)employee TotalNum:(NSInteger)totalNum isSelected:(BOOL)selected
{
    NSLog(@"单选操作");
    if (selected) {
        if (depart) {
            if (![self.selectedDepts containsObject:depart]) {
                [self.selectedDepts addObject:depart];
            }
        }else{
            if (![self.selectedUsers containsObject:employee]) {
                [self.selectedUsers addObject:employee];
            }
        }
        
    }else{
        if (depart) {
            if ([self.selectedDepts containsObject:depart]) {
                [self.selectedDepts removeObject:depart];
            }
        }else{
            if ([self.selectedUsers containsObject:employee]) {
                [self.selectedUsers removeObject:employee];
            }
        }
    }
    invitedUserNumber = totalNum;
    [self reloadBottomBar:self.selectedDepts.count TotalNum:totalNum];
}
- (void)RCIMDiscussionGroupAddMemberDetailVCDidSelectedDepars:(NSArray *)departs Employees:(NSArray *)employees TotalNum:(NSInteger)totalNum isSelected:(BOOL)selected
{
    NSLog(@"多选操作");
    [self.selectedDepts removeAllObjects];
    [self.selectedDepts addObjectsFromArray:departs];
    
    [self.selectedUsers removeAllObjects];
    [self.selectedUsers addObjectsFromArray:employees];
    
    invitedUserNumber = totalNum;
    [self reloadBottomBar:self.selectedDepts.count TotalNum:totalNum];
}
#pragma mark - 网络访问----------------------------------
#pragma mark -根据部门获取该部门下所有的员工信息
- (void)getAllInfoFromDepart:(NSString *)departId Group:(dispatch_group_t)dispatchGroup
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
    [configuration setTimeoutIntervalForRequest:30];//设置最大请求时间30秒
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            NSArray *returnArray = json[@"returnData"];//accountNumber,userName,avatar
            //查询选中所有人中是否包含当前登录人
            NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
            for (NSDictionary *person in returnArray) {
                if (![self.selectedMembers containsObject:person[@"accountNumber"]] && [person[@"accountNumber"] integerValue]!=userId.integerValue) {
                    [self.selectedMembers addObject:person[@"accountNumber"]];
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
         dispatch_group_leave(dispatchGroup);
    }];
    [dataTask resume];
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
            RCIMDiscussionGroupList.totalSelectedDepts = self.selectedDepts;
            RCIMDiscussionGroupList.totalSelectedMembers = self.selectedUsers;
            RCIMDiscussionGroupList.isCreated = self.isCreated;
            RCIMDiscussionGroupList.discussionId = self.discussionId;
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

#pragma mark -获取组织架构
- (void)getDetailInfoWithUserId
{
    NSString *access_token = [[NSUserDefaults standardUserDefaults] objectForKey:@"access_token"];
    NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
    NSString *path = [NSString stringWithFormat:@"%@/hrmsv2/v2/api/dept/getStaffDeptInfo?access_token=%@",rootService,access_token];
    NSURL *url = [NSURL URLWithString:path];
    NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:url];
    [urlRequest setHTTPMethod:@"POST"];
    NSDictionary *requestBody = @{@"key":userId};
    [urlRequest setHTTPBody:[NSJSONSerialization dataWithJSONObject:requestBody options:NSJSONWritingPrettyPrinted error:nil]];
    NSDictionary *headers = @{@"content-type": @"application/json"};
    [urlRequest setAllHTTPHeaderFields:headers];
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    [configuration setTimeoutIntervalForRequest:30];//设置超时限制
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            NSString *string = @"";
            for (int i=0; i<[json[@"returnData"][@"deptInfo"] count]; i++) {
                if (i!=0) {
                    NSInteger count = [json[@"returnData"][@"deptInfo"] count];
                    NSString *name = json[@"returnData"][@"deptInfo"][i][@"name"];
                    if (i==count-1) {
                         string = [string stringByAppendingString:[NSString stringWithFormat:@"%@",name]];
                        NSDictionary *jsonDict = json[@"returnData"][@"deptInfo"][i];
                        NSString *idStr = [jsonDict objectForKey:@"id"];
                        [self.dataSource addObject:[NSDictionary dictionaryWithObjects:@[idStr,string] forKeys:@[@"id",@"name"]]];
                        continue;
                    }
                     string = [string stringByAppendingString:[NSString stringWithFormat:@"%@-",name]];
                }else{
                    NSDictionary *jsonDict = json[@"returnData"][@"deptInfo"][i];
                    NSString *idStr = [jsonDict objectForKey:@"id"];
                    NSString *name = json[@"returnData"][@"deptInfo"][i][@"name"];
                    [self.dataSource addObject:[NSDictionary dictionaryWithObjects:@[idStr,name] forKeys:@[@"id",@"name"]]];
                }
            }
            //刷新数组
        
            NSLog(@"获取组织架构%@+++++%@[[[[[%@",json[@"returnData"][@"deptInfo"],self.dataSource,json);
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.tableView reloadData];
            });
        }else{
            NSLog(@"data:%@,error:%@",data,error);
        }
        dispatch_group_leave(group);
    }];
    [dataTask resume];
}

#pragma mark - 获取项目列表
- (void)getProjectList
{
    NSString *access_token = [[NSUserDefaults standardUserDefaults] objectForKey:@"access_token"];
    NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
    NSString *path = [NSString stringWithFormat:@"%@/hrmsv2/v2/api/l/api_resources_query/personal_project_list?access_token=%@",rootService,access_token];
    NSURL *url = [NSURL URLWithString:path];
    NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:url];
    [urlRequest setHTTPMethod:@"POST"];
    NSDictionary *requestBody = @{@"params":@{
                                            @"p_employee_number":userId
                                            }
                                  };
    [urlRequest setHTTPBody:[NSJSONSerialization dataWithJSONObject:requestBody options:NSJSONWritingPrettyPrinted error:nil]];
    NSDictionary *headers = @{@"content-type": @"application/json"};
    [urlRequest setAllHTTPHeaderFields:headers];
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    [configuration setTimeoutIntervalForRequest:30];//设置超时限制
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            self.projectList = json[@"returnData"][@"my_project_list"];
            [self.projectList enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                NSDictionary *project = obj;
                NSLog(@"项目列表 id：%@-项目名:%@",project[@"project_id"],project[@"project_name"]);
            }];
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.tableView reloadData];
                [progress hide];
            });
           // NSLog(@"项目列表%@------------%@",self.projectList,json[@"returnMsg"]);
        }else{
            dispatch_async(dispatch_get_main_queue(), ^{
                [progress hide];
            });
        }
        dispatch_group_leave(group);
    }];
    [dataTask resume];
}

#pragma mark -回退
- (void)cancelSelect
{
    if (self.navigationController.viewControllers.count==1) {
        [self.navigationController dismissViewControllerAnimated:YES completion:nil];
    }else{
        [self.navigationController popViewControllerAnimated:YES];
    }
}
#pragma mark-添加好友
- (void)finishSelect
{
    NSLog(@"开始finishSelect");
    if (_isCreated) {
        if (invitedUserNumber) {
            [progress show];
            //遍历所有的部门列表 + 单个成员
            for (NSString *idStr in self.selectedUsers) {
                if (![self.selectedMembers containsObject:idStr]) {
                    [self.selectedMembers addObject:idStr];
                }
            }
            
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
                for (NSString *emp_id in self.selectedMembers) {//顺便把自己加进去
                    [tempArr addObject:[NSDictionary dictionaryWithObject:emp_id forKey:@"key"]];
                }
                [self getContactsInfoByIdList:tempArr isCreate:YES];
                
            });
        }
    }else{
    if (invitedUserNumber) {
        [progress show];
        //添加
        //遍历所有的部门列表 + 单个成员
        for (NSString *idStr in self.selectedUsers) {
            if (![self.selectedMembers containsObject:idStr]) {
                [self.selectedMembers addObject:idStr];
            }
        }
        
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
            for (NSString *emp_id in self.selectedMembers) {
                [tempArr addObject:[NSDictionary dictionaryWithObject:emp_id forKey:@"key"]];
            }
            [self getContactsInfoByIdList:tempArr isCreate:NO];
            
        });
     }
    }
}


#pragma mark - 把添加的好友存入数据库中
- (void)insertNewContact:(NSArray *)userInfo_array
{
    for (NSDictionary *userInfo in userInfo_array) {
        NSString *avatar = [userInfo objectForKey:@"avatar"];
        if (avatar==nil||[avatar isEqualToString:@""]||[avatar isEqual:[NSNull null]]) {
            avatar = @"profile-2@3x.png";
        }
        NSString *mobile = [userInfo objectForKey:@"mobil"];
        if (mobile==nil||[mobile isEqualToString:@""]||[mobile isEqual:[NSNull null]]) {
            mobile = @"null";
        }
        [DataBaseTool selectSameUserInfoWithId:[userInfo objectForKey:@"emp_code"] Name:[userInfo objectForKey:@"emp_name"] ImageUrl:[userInfo objectForKey:@"avatar"] Tel:[userInfo objectForKey:@"mobile"]];
    }
}

-(void)ViewControllerWillDrag
{
    [self.searchController.searchBar resignFirstResponder];
}

#pragma mark -RCIMDiscussionGroupAllMembersListDelegate
- (void)didSelectCell:(NSString *)userId isSelected:(BOOL)selected
{
    if (selected) {
        if (![self.selectedUsers containsObject:userId]) {
            [self.selectedUsers addObject:userId];
            invitedUserNumber++;
        }
    }else{
        if ([self.selectedUsers containsObject:userId]) {
            [self.selectedUsers removeObject:userId];
            invitedUserNumber--;
        }
    }
    [self.tableView reloadData];
    [self reloadBottomBar:self.selectedDepts.count TotalNum:invitedUserNumber];
}

#pragma mark -添加项目组代理
- (void)RCIMDiscussionGroupAddMemberFromProjectVCDidSelected:(NSArray *)persons TotalInvitedNum:(NSInteger)totalNum IsSelected:(BOOL)selected
{
    if (selected) {
        [persons enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
            NSString *userId = obj;
            if (![self.selectedUsers containsObject:userId]) {
                [self.selectedUsers addObject:userId];
            }
        }];
        NSLog(@"self.selectedUsers:%@",self.selectedUsers);
    }else{
        [self.selectedUsers removeObjectsInArray:persons];
    }
    invitedUserNumber = totalNum;
    [self reloadBottomBar:self.selectedDepts.count TotalNum:invitedUserNumber];
    NSLog(@"添加项目组代理--%li--%li",persons.count,invitedUserNumber);
}

- (void)RCIMDiscussionGroupAddMemberFromProjectVCDidDeleteDeptSelected:(NSDictionary *)depart TotalInvitedNum:(NSInteger)totalNum IsSelected:(BOOL)selected
{
    if (!selected) {
        [self.selectedDepts removeObject:depart];
    }
    invitedUserNumber = totalNum;
    [self reloadBottomBar:self.selectedDepts.count TotalNum:invitedUserNumber];
}


#pragma mark -预览页代理
- (void)deleteContactsOrDepartment:(NSArray *)selectedDepart SelectedUsers:(NSArray *)selectedUsers TotalNumber:(NSInteger)totalNumber Depart:(NSDictionary *)department Employee:(NSDictionary *)employee
{
    self.selectedUsers = nil;
    [self.selectedUsers addObjectsFromArray:selectedUsers];
    self.selectedDepts = nil;
    [self.selectedDepts addObjectsFromArray:selectedDepart];
    [self.tableView reloadData];
    [self reloadBottomBar:self.selectedDepts.count TotalNum:totalNumber];
    invitedUserNumber = totalNumber;
    NSLog(@"come here 部门数量:%li,总数:%li",self.selectedDepts.count,totalNumber);
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
            self.discussionUserInfo = json[@"rows"];// avatar,emp_name,emp_code
            dispatch_async(dispatch_get_main_queue(), ^{
                [progress hide];
            });
            if (isCreated) {
                //讨论组名称 这里为所有联系人姓名拼接
                __block NSString *originalName = @"";
                [self.discussionUserInfo enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                    NSDictionary *userInfo = obj;
                    originalName = [originalName stringByAppendingString:[NSString stringWithFormat:@"%@、",userInfo[@"emp_name"]]];
                }];
                NSLog(@"%@--------准备------：%@,%@",self.discussionUserInfo,originalName,self.selectedMembers);
                [[RCIMClient sharedRCIMClient] createDiscussion:originalName userIdList:self.selectedMembers success:^(RCDiscussion *discussion) {
                    NSLog(@"创建讨论组成功回调:%@",discussion.memberIdList);
                    
                    dispatch_async(dispatch_get_main_queue(), ^{
                        RCIMGroupChatViewController *RCIMGroupChatVC = [[RCIMGroupChatViewController alloc] init];
                        RCIMGroupChatVC.discussionId = discussion.discussionId;
                        RCIMGroupChatVC.navTitle = discussion.discussionName;
                        RCIMGroupChatVC.discussionUsersInfo = self.discussionUserInfo;
                    [self.navigationController pushViewController:RCIMGroupChatVC animated:YES];
                    });
                } error:^(RCErrorCode status) {
                    [progress hide];
                    NSLog(@"创建讨论组失败回调:%li",status);
                }];
            }else{
                [[RCIMClient sharedRCIMClient] addMemberToDiscussion:self.discussionId userIdList:self.selectedMembers success:^(RCDiscussion *discussion) {
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
                }];
            }
                
        }else{
            dispatch_async(dispatch_get_main_queue(), ^{
                [progress hide];
            });
            NSLog(@"%@",error.localizedDescription);
        }
    }];
    [dataTask resume];
}


@end
