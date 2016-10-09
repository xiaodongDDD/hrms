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

@interface RCIMDiscussionGroupAllMembersList ()<MJRefreshBaseViewDelegate>
@property (nonatomic,strong)MJRefreshFooterView *footerView;
@property (nonatomic,strong)NSString *lastUpdateTime;
@property (nonatomic,strong)NSMutableArray *filtArray;
@end
static NSInteger page ;
@implementation RCIMDiscussionGroupAllMembersList
static NSString *reusableCellId = @"reusableCell";

- (NSMutableArray *)filtArray
{
    if (_filtArray==nil) {
        _filtArray = [NSMutableArray array];
    }
    return _filtArray;
}
- (void)viewDidLoad {
    [super viewDidLoad];
    self.tableView.rowHeight = 80;
    self.footerView = [MJRefreshFooterView footer];
    self.footerView.scrollView = self.tableView;
    self.footerView.delegate = self;
    self.tableView.tableFooterView = self.footerView;
    NSLog(@"self.dataList:%@",self.dataList);
    
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
    NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
    
    NSDictionary *person = self.dataList[indexPath.section];
    if ([self.filtArray containsObject:person]) {
        cell.isSelected = YES;
    }else{
        cell.isSelected = NO;
    }
    if(userId.integerValue==[person[@"emp_code"] integerValue]){
        cell.selctedImageV.image = [UIImage imageNamed:@"btn_unselected@3x"];
    }
    
    NSString *emp_name = [self.dataList[indexPath.section] objectForKey:@"emp_name"];//name
    NSString *emp_code = [self.dataList[indexPath.section] objectForKey:@"emp_code"];//id
    NSString *email = [self.dataList[indexPath.section] objectForKey:@"email"];//email
    NSString *avatar = [self.dataList[indexPath.section] objectForKey:@"avatar"];//img
    
    [cell setCell:avatar Name:emp_name Emp_code:emp_code Email:email];
    NSLog(@"cell:%@,name:%@,%@,%@,%@",cell,emp_name,emp_code,email,avatar);
    return cell;
}

- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView
{
    [self.delegate ViewControllerWillDrag];
}
-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    NSLog(@"--indexpath:%li,%@",indexPath.row,self.dataList);
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    RCIMDiscussionGroupAllMembersListCell *cell = [tableView cellForRowAtIndexPath:indexPath];
    NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
    NSDictionary *person = self.dataList[indexPath.section];
    if ([[person objectForKey:@"emp_code"] integerValue]!=userId.integerValue) {
        cell.isSelected = !cell.isSelected;
        if (cell.isSelected) {
            [self.delegate didSelectCell:self.dataList[indexPath.section] isSelected:YES];
            if (![self.filtArray containsObject:person]) {
                [self.filtArray addObject:person];
            }
        }else{
            [self.filtArray removeObject:person];
            [self.delegate didSelectCell:self.dataList[indexPath.section] isSelected:NO];
        }
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
    page = 1;
    [self.tableView reloadData];
}

@end
