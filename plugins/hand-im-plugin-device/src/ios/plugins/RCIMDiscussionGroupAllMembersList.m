//
//  RCIMDiscussionGroupAllMembersList.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/22.
//
//

#import "RCIMDiscussionGroupAllMembersList.h"
#import "UIImageView+WebCache.h"
#import "RCIMDiscussionGroupAllMembersListCell.h"
#import "MJRefresh.h"
#import "CVDPlugin-Bridging-Header.h"
#import "RCIMDiscussionGroupScanMemberDetailVC.h"
#import "ZLProgressHUD.h"
#import "RCIMGroupChatViewController.h"
#import "ToastUtils.h"

@interface RCIMDiscussionGroupAllMembersList ()<MJRefreshBaseViewDelegate,UITableViewDataSource,UITableViewDelegate,RCIMDiscussionGroupScanMemberDetailVCProtocol,RCIMDiscussionGroupAllMembersListDeleagte>
{
    NSInteger invitedTotalNum;
    ZLProgressHUD *progress;
}
@property (nonatomic,strong)MJRefreshFooterView *footerView;
@property (nonatomic,strong)UITableView *tableView;
@property (nonatomic,strong)NSString *lastUpdateTime;
@property (nonatomic,strong)NSMutableArray *selectedMembers;
@property (nonatomic,strong)NSMutableArray *selectedDepts;
@property (nonatomic,strong)NSMutableArray *selectedAllMembers;
@property (nonatomic,strong)UIView *bottomToolBar;
@end
static NSInteger page ;
@implementation RCIMDiscussionGroupAllMembersList
static NSString *reusableCellId = @"reusableCell";

- (UITableView *)tableView
{
    if (_tableView==nil) {
        _tableView = [[UITableView alloc] initWithFrame:CGRectMake(0,0, screenWidth, screenHeight) style:UITableViewStyleGrouped];
        _tableView.delegate = self;
        _tableView.dataSource = self;
        [self.view addSubview:_tableView];
    }
    return _tableView;
}
- (NSMutableArray *)selectedMembers
{
    if (_selectedMembers==nil) {
        _selectedMembers = [NSMutableArray array];
    }
    return _selectedMembers;
}
- (NSMutableArray *)selectedDepts
{
    if (_selectedDepts==nil) {
        _selectedDepts = [NSMutableArray array];
    }
    return _selectedDepts;
}
- (NSMutableArray *)selectedAllMembers
{
    if (_selectedAllMembers==nil) {
        _selectedAllMembers = [NSMutableArray array];
    }
    return _selectedAllMembers;
}
- (void)viewDidLoad {
    [super viewDidLoad];
    progress = [[ZLProgressHUD alloc] init];
    
    self.tableView.rowHeight = 80;
    self.footerView = [MJRefreshFooterView footer];
    self.footerView.scrollView = self.tableView;
    self.footerView.delegate = self;
    self.tableView.tableFooterView = self.footerView;
    [self setNeedsStatusBarAppearanceUpdate];
    
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
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

- (void)initBottomToolBar
{
    UILabel *selectedMember_lab;
    UIButton *sureBtn;
    _bottomToolBar = [[UIView alloc] initWithFrame:CGRectMake(0, self.view.bounds.size.height-44, self.view.bounds.size.width, 44)];
    _bottomToolBar.hidden = YES;
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

#pragma mark -开始创建讨论组
- (void)finishSelect
{
    NSLog(@"开始finishSelect");
    if (_isCreated) {
        if (invitedTotalNum) {
            [progress show];
            //遍历所有的部门列表 + 单个成员
            for (NSString *idStr in self.selectedMembers) {
                if (![self.selectedAllMembers containsObject:idStr]) {
                    [self.selectedAllMembers addObject:idStr];
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
                for (NSString *emp_id in self.selectedAllMembers) {//顺便把自己加进去
                    [tempArr addObject:[NSDictionary dictionaryWithObject:emp_id forKey:@"key"]];
                }
                [self getContactsInfoByIdList:tempArr isCreate:YES];
                
            });
        }
    }else{
        if (invitedTotalNum) {
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
                for (NSString *emp_id in self.selectedAllMembers) {
                    [tempArr addObject:[NSDictionary dictionaryWithObject:emp_id forKey:@"key"]];
                }
                [self getContactsInfoByIdList:tempArr isCreate:NO];
            });

        }
    }
}

#pragma mark -预览
- (void)scanSelectedMembers:(UITapGestureRecognizer *)tap
{
    //点击底部栏确定按钮后 加入选中的部门和选中的员工 员工和部门分开
    //部门在上 员工在下 只是预览效果不能进入下一级
    RCIMDiscussionGroupScanMemberDetailVC *scanVC = [[RCIMDiscussionGroupScanMemberDetailVC alloc] init];
    scanVC.totalSelectedUsers = self.selectedMembers;
    scanVC.totalSelectedDepts = self.selectedDepts;
    scanVC.totalNumber = invitedTotalNum;
    scanVC.delegate = self;
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:scanVC];
    [self presentViewController:nav animated:YES completion:nil];
    NSLog(@"预览拉取的联系人列表");
}

#pragma mark - 刷新控件的代理方法
#pragma mark 开始进入刷新状态
- (void)refreshViewBeginRefreshing:(MJRefreshBaseView *)refreshView
{
    page++;
    // 2.2秒后刷新表格UI
    [self performSelector:@selector(doneWithView:) withObject:refreshView afterDelay:0.0];
    NSLog(@"%@----开始进入刷新状态 page:%li", refreshView.class,page);
}



#pragma mark 刷新表格并且结束正在刷新状态
- (void)doneWithView:(MJRefreshBaseView *)refreshView
{
    [self connectToService:self.text];
}
- (void)connectToService:(NSString *)text
{
    NSString *access_token = [[NSUserDefaults standardUserDefaults] objectForKey:@"access_token"];
    NSString *path = [NSString stringWithFormat:@"%@access_token=%@",localServiceQuery,access_token];
    NSURL *url = [NSURL URLWithString:path];
    NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:url];
    [urlRequest setHTTPMethod:@"POST"];
    NSDictionary *requestBody = @{@"key":text,@"page":@(page),@"pageSize":@10};
    [urlRequest setHTTPBody:[NSJSONSerialization dataWithJSONObject:requestBody options:NSJSONWritingPrettyPrinted error:nil]];
    NSDictionary *headers = @{@"content-type": @"application/json"};
    [urlRequest setAllHTTPHeaderFields:headers];
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            NSArray *returnArray = [json objectForKey:@"rows"];
            [self.dataList addObjectsFromArray:returnArray];
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.tableView reloadData];
                [self.footerView endRefreshing];
            });
        }else{
            NSLog(@"data:%@,error:%@",data,error);
        }
    }];
    
    [dataTask resume];
}
#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    if (self.dataList.count==0) {
        NSLog(@"为空");
        return 0;
    }
    return self.dataList.count;
}
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return 1;
}


- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    RCIMDiscussionGroupAllMembersListCell *cell;
    if (cell==nil) {
        cell = [[RCIMDiscussionGroupAllMembersListCell alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, 80)];
    }else{
        cell = [tableView dequeueReusableCellWithIdentifier:reusableCellId forIndexPath:indexPath];

    }
    
    NSString *emp_name = [self.dataList[indexPath.section] objectForKey:@"emp_name"];//name
    NSString *emp_code = [self.dataList[indexPath.section] objectForKey:@"emp_code"];//id
    NSString *email = [self.dataList[indexPath.section] objectForKey:@"email"];//email
    NSString *avatar = [self.dataList[indexPath.section] objectForKey:@"avatar"];//img
    NSDictionary *person = self.dataList[indexPath.section];
    
    
    NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
    //accountNumber emp_code


    if ([self.selectedMembers containsObject:person[@"emp_code"]]) {
        cell.isSelected = YES;
    }else{
        cell.isSelected = NO;
    }
    
    if(userId.integerValue==[person[@"emp_code"] integerValue]){
        cell.selectedImageV.image = [UIImage imageNamed:@"btn_unselected@3x"];
    }
    
    [cell setCell:avatar Name:emp_name Emp_code:emp_code Email:email];
    NSLog(@"cell:%@,name:%@,%@,%@,%@",cell,emp_name,emp_code,email,avatar);
    return cell;
}

- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView
{
    [self.delegate ViewControllerWillDrag];
    self.bottomToolBar.hidden = NO;
}

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    self.bottomToolBar.hidden = NO;
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    
    NSLog(@"--indexpath:%li,%@",indexPath.row,self.dataList);
    NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
    RCIMDiscussionGroupAllMembersListCell *cell = [tableView cellForRowAtIndexPath:indexPath];
    NSDictionary *person = self.dataList[indexPath.section];
    if (![[person objectForKey:@"emp_code"] isEqualToString:userId]) {
        cell.isSelected = !cell.isSelected;
        if (cell.isSelected) {
            if (![self.selectedMembers containsObject:person[@"emp_code"]]) {
                [self.selectedMembers addObject:person[@"emp_code"]];
                invitedTotalNum++;
                [self.delegate didSelectCell:person[@"emp_code"] isSelected:YES];
            }
        }else{
            if ([self.selectedMembers containsObject:person[@"emp_code"]]) {
                [self.selectedMembers removeObject:person[@"emp_code"]];
                [self.delegate didSelectCell:person[@"emp_code"] isSelected:NO];
                invitedTotalNum--;
            }
        }
        
        [self.delegate ViewControllerWillDrag];
        [self reloadBottomBar:self.selectedDepts.count TotalNum:invitedTotalNum];
    }
}

- (CGFloat)tableView:(UITableView *)tableView heightForFooterInSection:(NSInteger)section{
    return 2.5;
}
- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section{
    return 2.5;
}
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 80;
}

- (void)reloadTableView
{
    if (self.dataList.count<10) {
        self.footerView.hidden = YES;
    }else{
        self.footerView.hidden = NO;
    }

    page = 1;
    [self.tableView reloadData];
    
    [self.selectedMembers removeAllObjects];
    [self.selectedDepts removeAllObjects];
    [self.selectedMembers addObjectsFromArray:self.totalSelectedMembers];
    [self.selectedDepts addObjectsFromArray:self.totalSelectedDepts];
    
    invitedTotalNum = self.totalNum;
    NSLog(@"self.dataList:%@",self.dataList);
    [self initBottomToolBar];
    [self reloadBottomBar:self.selectedDepts.count TotalNum:invitedTotalNum];
    
}
- (void)deleteContactsOrDepartment:(NSArray *)selectedDepart SelectedUsers:(NSArray *)selectedUsers TotalNumber:(NSInteger)totalNumber Depart:(NSDictionary *)department Employee:(NSDictionary *)employee
{
    self.selectedMembers = nil;
    [self.selectedMembers addObjectsFromArray:selectedUsers];
    self.selectedDepts = nil;
    [self.selectedDepts addObjectsFromArray:selectedDepart];
    [self.tableView reloadData];
    [self reloadBottomBar:self.selectedDepts.count TotalNum:totalNumber];
    invitedTotalNum = totalNumber;
    NSLog(@"come here 部门数量:%li,总数:%li",self.selectedDepts.count,totalNumber);
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
                
                [[RCIMClient sharedRCIMClient] createDiscussion:originalName userIdList:self.selectedAllMembers success:^(RCDiscussion *discussion) {
                    NSLog(@"创建讨论组成功回调:%@",discussion.memberIdList);
                    [progress hide];
                    RCIMGroupChatViewController *RCIMGroupChatVC = [[RCIMGroupChatViewController alloc] init];
                    RCIMGroupChatVC.discussionId = discussion.discussionId;
                    RCIMGroupChatVC.navTitle = discussion.discussionName;
                    RCIMGroupChatVC.discussionUsersInfo = tempArr;
                    dispatch_async(dispatch_get_main_queue(), ^{
                       // [self dismissViewControllerAnimated:NO completion:nil];
                        [self.viewController.navigationController pushViewController:RCIMGroupChatVC animated:YES];
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
                        for (UIViewController *vc in self.viewController.navigationController.viewControllers) {
                            if ([vc isMemberOfClass:[RCIMGroupChatViewController class]]) {
                                RCIMGroupChatVC =(RCIMGroupChatViewController*)vc;
                            }
                        }
                        RCIMGroupChatVC.discussionId = discussion.discussionId;
                        RCIMGroupChatVC.navTitle = discussion.discussionName;
                        [self.viewController.navigationController popToViewController:RCIMGroupChatVC animated:YES];
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

@end
