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
#import "RCIMDiscussionGroupAddMemberCell.h"
#import "RCIMDiscussionGroupEditViewController.h"
#import "ZLProgressHUD.h"
#import "ToastUtils.h"
#import "DataBaseTool.h"

@interface RCIMDiscussionGroupAddMemberController ()<UISearchResultsUpdating,UISearchControllerDelegate,UITableViewDelegate,UITableViewDataSource,RCIMDiscussionGroupAllMembersListDeleagte>
@property (nonatomic,strong)UITableView *tableView;
@property (nonatomic,strong)UISearchController *searchController;
@property (nonatomic,strong)NSMutableArray *dataSource;
@property (nonatomic,strong)NSMutableArray *filterArray;
@property (nonatomic,strong)NSMutableArray *selectedMembers;
@end
static NSString *reusableCellID = @"RCIMDiscussionGroupAddMemberCell";

@implementation RCIMDiscussionGroupAddMemberController


- (NSMutableArray *)selectedMembers
{
    if (_selectedMembers==nil) {
        _selectedMembers = [NSMutableArray array];
    }
    return _selectedMembers;
}
- (NSMutableArray *)dataSource
{
    if (_dataSource==nil) {
       _dataSource = [NSMutableArray array];
    }
    return _dataSource;
}
- (NSMutableArray *)filterArray
{
    if (_filterArray==nil) {
        _filterArray = [NSMutableArray array];
    }
    return _filterArray;
}

-(UITableView *)tableView{
    if (_tableView == nil) {
        _tableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 0, screenWidth, screenHeight - 44)];
        _tableView.delegate = self;
        _tableView.dataSource = self;
    }
    return _tableView;
}

-(UISearchController *)searchController{
    if (_searchController == nil) {
    RCIMDiscussionGroupAllMembersList  *RCIMAllMembersList =[[RCIMDiscussionGroupAllMembersList alloc] initWithStyle:UITableViewStyleGrouped];
        RCIMAllMembersList.delegate = self;
        _searchController = [[UISearchController alloc] initWithSearchResultsController:RCIMAllMembersList];
        //设置代理
        _searchController.searchResultsUpdater = self;
        //搜索时，背景变模糊
        _searchController.obscuresBackgroundDuringPresentation = YES;
        //隐藏导航栏
        _searchController.hidesNavigationBarDuringPresentation = YES;
        
        _searchController.searchBar.frame = CGRectMake(0, 0, screenWidth, 44);
        
        [self.searchController.searchBar sizeToFit];
        
        self.searchController.delegate = self;
        self.definesPresentationContext = YES;
    }
    return _searchController;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    [self.view setBackgroundColor:[UIColor whiteColor]];
    UILabel *titleView = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, 80, 20)];
    titleView.attributedText = [[NSAttributedString alloc] initWithString:@"选择联系人" attributes:@{NSForegroundColorAttributeName:[UIColor colorWithRed:74/255.0 green:74/255.0 blue:74/255.0 alpha:1.0],NSFontAttributeName:[UIFont systemFontOfSize:17]}];
    self.navigationItem.titleView = titleView;
   // self.navigationItem.title = @"好友邀请列表";
    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"取消" style:UIBarButtonItemStylePlain target:self action:@selector(cancelSelect)];
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"完成" style:UIBarButtonItemStylePlain target:self action:@selector(finishSelect)];
    self.navigationItem.rightBarButtonItem.enabled = NO;
    [self.view addSubview:self.tableView];
    [self.searchController.searchBar setBarTintColor:[UIColor whiteColor]];
    [self.searchController.searchBar setSearchBarStyle:UISearchBarStyleMinimal];
    self.tableView.tableHeaderView = self.searchController.searchBar;
    self.tableView.tableFooterView = [[UIView alloc] init];
    [self.tableView registerClass:[RCIMDiscussionGroupAddMemberCell class] forCellReuseIdentifier:reusableCellID];
    self.tableView.rowHeight = 80.0;
    //设置导航颜色
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

#pragma mark -UITabelViewDataSource
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section;
{
    return self.selectedMembers.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    RCIMDiscussionGroupAddMemberCell *cell ;
    if (cell==nil) {
        cell = [[RCIMDiscussionGroupAddMemberCell alloc] initWithFrame:CGRectMake(0, 0, screenWidth, 80.0)];
    }else{
        cell = [tableView dequeueReusableCellWithIdentifier:reusableCellID forIndexPath:indexPath];
    }
    NSDictionary *info = self.selectedMembers[indexPath.row];
    NSString *emp_name = [info objectForKey:@"emp_name"];//name
    NSString *emp_code = [info objectForKey:@"emp_code"];//id
    NSString *email = [info objectForKey:@"email"];//email
    NSString *avatar = [info objectForKey:@"avatar"];//img
    [cell.imageV sd_setImageWithURL:[NSURL URLWithString:avatar] placeholderImage:[UIImage imageNamed:@"profile-2@3x.png"]];
    cell.name_label.text = [NSString stringWithFormat:@"%@(%@)",emp_name,emp_code];
    cell.email_label.text = email;
    return cell;
}

- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath
{
    return YES;
}

- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (editingStyle==UITableViewCellEditingStyleDelete) {
        [self.selectedMembers removeObjectAtIndex:indexPath.row];
        [self.tableView deleteRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationTop];
    }
    //检查右边按钮状态
    if (!self.selectedMembers.count) {
        self.navigationItem.rightBarButtonItem.enabled = NO;
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
    return 80.0;
}


#pragma mark - searchController delegate
- (void)updateSearchResultsForSearchController:(UISearchController *)searchController
{
    [self connectToService:searchController.searchBar.text];
    NSLog(@"changed");
}

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
            RCIMDiscussionGroupList.dataList  = [NSMutableArray arrayWithArray:returnArray];
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
    NSMutableArray *membersList = [NSMutableArray arrayWithCapacity:self.selectedMembers.count];
    for (int i=0; i<self.selectedMembers.count; i++) {
        NSDictionary *info = self.selectedMembers[i];
        NSString *emp_code = [info objectForKey:@"emp_code"];
        [membersList addObject:emp_code];
    }
    if (self.navigationController.viewControllers.count==1) {
        //创建讨论组
        RCIMDiscussionGroupEditViewController *RCIMDiscussionGroupEditVC = [[RCIMDiscussionGroupEditViewController alloc] init];
        RCIMDiscussionGroupEditVC.memberList = self.selectedMembers;//info
        RCIMDiscussionGroupEditVC.discussionId  =self.discussionId;
        [self.navigationController pushViewController:RCIMDiscussionGroupEditVC animated:YES];
    }else{
        //添加新联系人 这里要判断下 已经加入的人不再让加入讨论组(过滤掉)
        ZLProgressHUD *progress = [[ZLProgressHUD alloc] init];
        [progress show];
        NSLog(@"self.discussionId:%@",self.discussionId);
        [[RCIMClient sharedRCIMClient] getDiscussion:self.discussionId success:^(RCDiscussion *discussion) {
            NSMutableArray *array = [NSMutableArray array];
            [self.selectedMembers enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
                NSDictionary *info = obj;
                if ([discussion.memberIdList containsObject:[info objectForKey:@"emp_code"]]) {
                    [array addObject:obj];//记录已有的好友
                }
            }];
            NSMutableArray *selectedMembers_copy = [NSMutableArray arrayWithArray:self.selectedMembers];
            [selectedMembers_copy removeObjectsInArray:array];//删除掉相同的好友
            //插入新的联系人
            [self insertNewContact:selectedMembers_copy];
            NSMutableArray *addList = [NSMutableArray arrayWithCapacity:selectedMembers_copy.count];
            for (NSDictionary *info in selectedMembers_copy) {
                [addList addObject:[info objectForKey:@"emp_code"]];
            }
            NSLog(@"addList:%@",addList);
            //如果再次添加了相同的联系人 就不让进去
            if (addList.count) {
                [[RCIMClient sharedRCIMClient] addMemberToDiscussion:self.discussionId userIdList:addList success:^(RCDiscussion *discussion){
                    NSLog(@"添加讨论组成功");
                    dispatch_async(dispatch_get_main_queue(), ^{
                        [progress hide];
                        [self.delegate returnALlDiscussionGroupMembers:selectedMembers_copy];
                        [self.navigationController popViewControllerAnimated:YES];
                    });
                } error:^(RCErrorCode status) {
                    NSLog(@"添加讨论组失败:%li",status);
                    dispatch_async(dispatch_get_main_queue(), ^{
                        [progress hide];
                        [ToastUtils showLong:@"当前网络连接不可用!"];
                    });
                }];
            }else{
                dispatch_async(dispatch_get_main_queue(), ^{
                    [progress hide];
                    [ToastUtils showLong:@"新添加的联系人已经在讨论组中了!"];
                });
            }
            
        } error:^(RCErrorCode status) {
            NSLog(@"%@-错误码:%li",self.class,status);
        }];
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
        [DataBaseTool selectSameUserInfoWithId:[userInfo objectForKey:@"emp_code"] Name:[userInfo objectForKey:@"emp_name"] ImageUrl:[userInfo objectForKey:@"avatar"]];
    }
}

-(void)ViewControllerWillDrag
{
    [self.searchController.searchBar resignFirstResponder];
}

#pragma mark -RCIMDiscussionGroupAllMembersListDelegate
- (void)didSelectCell:(NSDictionary *)info
{
    self.navigationItem.rightBarButtonItem.enabled = YES;
    [self.selectedMembers addObject:info];
    [self.tableView reloadData];
}

- (void)viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];
    self.selectedMembers = nil;
}


@end
