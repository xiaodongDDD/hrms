//
//  RCIMDiscussionGroupScanMemberDetailVC.m
//  汉得移动测试版
//
//  Created by wangsheng on 16/9/20.
//
//

#import "RCIMDiscussionGroupScanMemberDetailVC.h"
#import "RCIMDiscussionGroupScanViewControllerDeptCell.h"
#import "RCIMDiscussionGroupScanViewControllerEmployeeCell.h"
#import "UIImageView+WebCache.h"
#import "ZLProgressHUD.h"
#import "CVDPlugin-Bridging-Header.h"

@interface RCIMDiscussionGroupScanMemberDetailVC ()<UITableViewDataSource,UITableViewDelegate>
{
    NSInteger invitedNumber;
    ZLProgressHUD *progress;
}
@property (nonatomic,strong)UIView *backBtn;
@property (nonatomic,strong)UITableView *tableView;
@property (nonatomic,strong)NSMutableArray *selectedDepts;
/*!
 *   存放工号等 emp_code emp_name.....
 */
@property (nonatomic,strong)NSMutableArray *selectedEmployees;
@end

static NSString *deptCellID = @"RCIMDiscussionGroupScanViewControllerDeptCell";
static NSString *employeeCellID = @"RCIMDiscussionGroupScanViewControllerEmployeeCell";
@implementation RCIMDiscussionGroupScanMemberDetailVC

- (NSMutableArray *)selectedDepts
{
    if (_selectedDepts==nil) {
        _selectedDepts = [NSMutableArray array];
    }
    return _selectedDepts;
}
- (NSMutableArray *)selectedEmployees
{
    if (_selectedEmployees==nil) {
        _selectedEmployees = [NSMutableArray array];
    }
    return _selectedEmployees;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    progress = [[ZLProgressHUD alloc] init];
    
    self.view.backgroundColor = [UIColor lightGrayColor];
    [self.view addSubview:self.tableView];
    [self initNavgationItem];
    invitedNumber = self.totalNumber;
    
    [self.selectedDepts removeAllObjects];
    [self.selectedDepts addObjectsFromArray:self.totalSelectedDepts];

    NSLog(@"部门数%li-%@",self.totalSelectedDepts.count,self.selectedEmployees);
}

-(void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    NSMutableArray *tempArr = [NSMutableArray array ];
    for (NSString *userId in self.totalSelectedUsers) {
        [tempArr addObject:[NSDictionary dictionaryWithObject:userId forKey:@"key"]];
    }
    [self getContactsInfoByIdList:tempArr];
}

- (UITableView *)tableView
{
    if (_tableView==nil) {
        _tableView = [[UITableView alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height) style:UITableViewStyleGrouped];
        _tableView.dataSource = self;
        _tableView.delegate = self;
        _tableView.rowHeight = 60;
        CGRect frame = CGRectMake(0, 0, 0, CGFLOAT_MIN);
        _tableView.tableHeaderView = [[UIView alloc] initWithFrame:frame];
        _tableView.tableFooterView = [[UIView alloc] init];
       // [_tableView setBackgroundColor:[UIColor lightTextColor]];
        [_tableView registerClass:[RCIMDiscussionGroupScanViewControllerDeptCell class] forCellReuseIdentifier:deptCellID];
        [_tableView registerClass:[RCIMDiscussionGroupScanViewControllerEmployeeCell class] forCellReuseIdentifier:employeeCellID];
    }
    return _tableView;
}

-(UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

- (void)initNavgationItem
{
    _backBtn = [[UIView alloc] init];
    UIImageView *imageView = [[UIImageView alloc] initWithFrame:CGRectMake(-18, 7, 30, 30)];
    imageView.image = [UIImage imageNamed:@"back_nav_white"];
    [_backBtn addSubview:imageView];
    UILabel *backLab = [[UILabel alloc] init];
    backLab.tag = 2;
    [_backBtn addSubview:backLab];
    backLab.font = [UIFont systemFontOfSize:18];
    backLab.textColor = [UIColor whiteColor];
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(back)];
    [_backBtn addGestureRecognizer:tap];
    
    NSString *text = [NSString stringWithFormat:@"已选择%li人",self.totalNumber];
    CGSize btnSize = [text sizeWithAttributes:@{NSFontAttributeName:[UIFont systemFontOfSize:18]}];
    backLab.frame = CGRectMake(CGRectGetMaxX(imageView.frame), 12, btnSize.width, 20);
    _backBtn.frame = CGRectMake(0, 0, CGRectGetMaxX(backLab.frame), 44);
    backLab.text = [NSString stringWithFormat:@"已选择%li人",self.totalNumber];
    
    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithCustomView:_backBtn];
    
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"确定" style:UIBarButtonItemStylePlain target:self action:@selector(back)];
    //设置导航栏标题颜色
    self.navigationController.navigationBar.titleTextAttributes = @{NSForegroundColorAttributeName:[UIColor whiteColor]};
    //设置导航栏按钮颜色
    [self.navigationController.navigationBar setTintColor:[UIColor whiteColor]];
    //设置导航栏背景图片
    [self.navigationController.navigationBar setBackgroundImage:[UIImage imageNamed:@"NavBar"] forBarMetrics:UIBarMetricsDefault];
}

- (void)reloadNavLeftItem:(NSInteger)totalNumber
{
    NSString *text = [NSString stringWithFormat:@"已选择%li人",totalNumber];
    CGSize btnSize = [text sizeWithAttributes:@{NSFontAttributeName:[UIFont systemFontOfSize:18]}];
    UILabel *backLab = [_backBtn viewWithTag:2];
    backLab.bounds = CGRectMake(0, 0, btnSize.width, 20);
    _backBtn.frame = CGRectMake(0, 0, CGRectGetMaxX(backLab.frame), 44);
    backLab.text = [NSString stringWithFormat:@"已选择%li人",totalNumber];

}

#pragma mark -返回
- (void)back
{
    [self dismissViewControllerAnimated:YES completion:nil];
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    if (self.selectedDepts.count && self.selectedEmployees.count) {
        return 2;
    }else if (self.selectedDepts.count==0 || self.selectedEmployees.count==0){
        return 1;
    }
    return 0;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    if (section==0) {
        if (self.selectedDepts.count) {
            return self.selectedDepts.count;
        }
        return self.selectedEmployees.count;
    }else{
        return self.selectedEmployees.count;
    }
}


- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell;

        //前面是部门
        if (self.selectedDepts.count) {
            
            if (indexPath.section==0) {
                RCIMDiscussionGroupScanViewControllerDeptCell *deptCell = [tableView dequeueReusableCellWithIdentifier:deptCellID];
                    deptCell.tag = indexPath.row;
                    [deptCell.deleteBtn addTarget:self action:@selector(deleteDept:) forControlEvents:UIControlEventTouchUpInside];
                    deptCell.titleLabel.text = [NSString stringWithFormat:@"%@(%@)",self.selectedDepts[indexPath.row][@"departmentName"],self.selectedDepts[indexPath.row][@"totalStaffNumber"]];
                    cell = deptCell;

            }else{
                //插入员工cell
                RCIMDiscussionGroupScanViewControllerEmployeeCell *employeeCell = [tableView dequeueReusableCellWithIdentifier:employeeCellID];
                employeeCell.tag = indexPath.row;
                [employeeCell.deleteBtn addTarget:self action:@selector(deleteEmployee:) forControlEvents:UIControlEventTouchUpInside];
                NSDictionary *person = self.selectedEmployees[indexPath.row];
                NSString *icon = [person objectForKey:@"avatar"];

                //头像空值判断
                if ([person objectForKey:@"avatar"]==nil||[icon isEqual:[NSNull null]]) {
                    icon = @"profile-2@3x.png";//默认头像
                }

                [employeeCell.employeeImageView sd_setImageWithURL:[NSURL URLWithString:icon] placeholderImage:[UIImage imageNamed:@"profile-2@3x.png"] options:SDWebImageProgressiveDownload];
                employeeCell.titleLabel.text = [person objectForKey:@"emp_name"];
                cell = employeeCell;
            }
            
        }else{
            //最底层 只有员工cell
            
            RCIMDiscussionGroupScanViewControllerEmployeeCell *employeeCell = [tableView dequeueReusableCellWithIdentifier:employeeCellID];
            employeeCell.tag = indexPath.row;
            [employeeCell.deleteBtn addTarget:self action:@selector(deleteEmployee:) forControlEvents:UIControlEventTouchUpInside];
            NSDictionary *person = self.selectedEmployees[indexPath.row];
            //默认选中
            
            NSString *icon = [person objectForKey:@"avatar"];
            if ([person objectForKey:@"avatar"]==nil||[icon isEqual:[NSNull null]]) {
                icon = @"profile-2@3x.png";
            }
            [employeeCell.employeeImageView sd_setImageWithURL:[NSURL URLWithString:icon] placeholderImage:[UIImage imageNamed:@"profile-2@3x.png"] options:SDWebImageProgressiveDownload];
            employeeCell.titleLabel.text = [person objectForKey:@"emp_name"];
            cell  =employeeCell;
        }
    [cell setSelectionStyle:UITableViewCellSelectionStyleNone];
    return cell;

}

-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return 60;
}
- (CGFloat)tableView:(UITableView *)tableView heightForHeaderInSection:(NSInteger)section
{
    if (section) {
        return 5.0;
    }
    return 1.0;
}
#pragma mark -删除员工
- (void)deleteEmployee:(UIButton *)sender
{
    NSIndexPath *indexPath = [self.tableView indexPathForCell:(UITableViewCell *)sender.superview];
    //删除员工
    NSLog(@"删除员工(%li,%li),%@",indexPath.section,indexPath.row,self.selectedEmployees);
    NSDictionary *deletingPerson = self.selectedEmployees[indexPath.row];
    [self.selectedEmployees removeObject:deletingPerson];
        invitedNumber--;
    NSMutableArray *tempArray = [NSMutableArray array];
    for (NSDictionary *obj in self.selectedEmployees) {
        [tempArray addObject:obj[@"emp_code"]];
    }
    [self.delegate deleteContactsOrDepartment:self.selectedDepts SelectedUsers:tempArray TotalNumber:invitedNumber Depart:nil Employee:deletingPerson[@"emp_code"]];
    if (self.selectedEmployees.count==0) {
        if (self.selectedDepts.count==0) {
            //最后一个
            [self.tableView reloadData];
        }else{
            [self.tableView deleteSections:[NSIndexSet indexSetWithIndex:1] withRowAnimation:UITableViewRowAnimationLeft];
        }
    }else{
        [self.tableView deleteRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationLeft];
    }
    
    NSLog(@"删除后人数:%li",invitedNumber);
    [self reloadNavLeftItem:invitedNumber];
}

#pragma mark -删除部门
- (void)deleteDept:(UIButton *)sender
{
    //删除部门
     NSLog(@"删除部门");
    NSIndexPath *indexPath = [self.tableView indexPathForCell:(UITableViewCell *)sender.superview];
    invitedNumber-=[self.selectedDepts[indexPath.row][@"totalStaffNumber"] integerValue];
    NSDictionary *deletingDepart = self.selectedDepts[indexPath.row];
    
    [self.selectedDepts removeObjectAtIndex:indexPath.row];
    
    NSMutableArray *tempArray = [NSMutableArray array];
    for (NSDictionary *obj in self.selectedEmployees) {
        [tempArray addObject:obj[@"emp_code"]];
    }
    
    [self.delegate deleteContactsOrDepartment:self.selectedDepts SelectedUsers:tempArray TotalNumber:invitedNumber Depart:deletingDepart Employee:nil];
    
    if (self.selectedDepts.count==0) {
        if (self.selectedEmployees==0) {
            [self.tableView reloadData];
        }else{
        [self.tableView deleteSections:[NSIndexSet indexSetWithIndex:0] withRowAnimation:UITableViewRowAnimationLeft];
        }
    }else{
        [self.tableView deleteRowsAtIndexPaths:@[indexPath] withRowAnimation:UITableViewRowAnimationLeft];
    }
    
    [self reloadNavLeftItem:invitedNumber];
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
            [self.selectedEmployees addObjectsFromArray:json[@"rows"]];// avatar,emp_name,emp_code
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.tableView reloadData];
                [progress hide];
            });
            
            NSLog(@"项目列表联系人%@,,,,,,,%@",json,self.selectedEmployees);
        }else{
            [progress hide];
            NSLog(@"%@",error.description);
        }
    }];
    [dataTask resume];
}

@end
