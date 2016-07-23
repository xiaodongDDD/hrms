//
//  CDVIMPlugin.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/11.
//
//

#import "CDVIMPlugin.h"
#import "CDVIMPluginChattingViewController.h"
#import "DataBaseTool.h"
#import "CVDPlugin-Bridging-Header.h"

@interface CDVIMPlugin ()<RCIMUserInfoDataSource>
{
    UINavigationController *nav;
    NSString * RCToken;
    NSString *friendId ;
    NSString *friendName;
    NSString *friendIcon;
    
}

@end

@implementation CDVIMPlugin

//程序登陆的时候调用
-(void)getChatList:(CDVInvokedUrlCommand *)command
{
    NSString *userId = [command.arguments[0] objectForKey:@"userId"];
    NSString *access_token = [command.arguments[0] objectForKey:@"access_token"];
    RCToken = command.arguments[0][@"RCToken"];
    
    [[NSUserDefaults standardUserDefaults] setObject:userId forKey:@"userId"];
    [[NSUserDefaults standardUserDefaults] setObject:access_token forKey:@"access_token"];
    
    [self requestUserNameAndUrlById:userId ByToken:access_token];
    dispatch_async(dispatch_get_main_queue(), ^{
        [self loginRCWebService];//登陆融云
    });
}

//开启单人会话
- (void)toChatAct:(CDVInvokedUrlCommand *)command
{
    NSLog(@"openIMVC");
    friendId =   command.arguments[0][@"friendId"];
    friendName = command.arguments[0][@"friendName"];
    friendIcon = command.arguments[0][@"friendIcon"];
    
    CDVIMPluginChattingViewController *cdvIMChattingVC = [[CDVIMPluginChattingViewController alloc] initWithConversationType:ConversationType_PRIVATE targetId:friendId];
    nav = [[UINavigationController alloc] initWithRootViewController:cdvIMChattingVC];
    cdvIMChattingVC.targetId = friendId;
    cdvIMChattingVC.navTitle = friendName;
    
    //自定义push动画
    CATransition *animation = [CATransition animation];
    animation.duration = 0.3;
    [animation setTimingFunction:[CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseInEaseOut]];
    animation.type = kCATransitionFade;
    animation.subtype = kCATransitionFromRight;
    
    [animation setFillMode:kCAFillModeBackwards];
    animation.removedOnCompletion = YES;
    [self.viewController.view.superview.layer addAnimation:animation forKey:@"animation"];
    [self.viewController.view addSubview:nav.view];
}


-(void)returnConversationList:(CDVInvokedUrlCommand *)command
{
    NSLog(@"----数据库---%@",[DataBaseTool getAllMessagesData]);
    CDVPluginResult *result;
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"message":[DataBaseTool getAllMessagesData]}];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    
}

-(void)deleteConversationList:(CDVInvokedUrlCommand *)command
{
    NSLog(@"开始删除");
    NSString *deleteFriendId = [command arguments][0];
    CDVPluginResult *result;
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"success":@"success"}];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    [DataBaseTool deleteDataListBy:deleteFriendId];
}
#ifdef __CORDOVA_4_0_0

- (void)pluginInitialize {
    NSLog(@"### pluginInitialize ");
    [self initNotifications];
}

#else

- (CDVPlugin*)initWithWebView:(UIWebView*)theWebView{
    NSLog(@"### initWithWebView ");
    if (self=[super initWithWebView:theWebView]) {
        [self initNotifications];
    }
    return self;
}


#endif
-(void)initNotifications {
    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    [defaultCenter addObserver:self
                      selector:@selector(IMPluginDidReceiveMessage:)
                          name:CDVIMPluginPushNotification
                        object:nil];
    NSLog(@"come initNotifications");
    
}

- (void)IMPluginDidReceiveMessage:(NSNotification *)notification
{
    NSLog(@"come IMPluginDidReceiveMessage");
    
    NSData *jsonStrData = [NSJSONSerialization dataWithJSONObject:@{@"message":[DataBaseTool getAllMessagesData]} options:NSJSONWritingPrettyPrinted error:nil];
    NSString *jsonStr = [[NSString alloc] initWithData:jsonStrData encoding:NSUTF8StringEncoding];
    dispatch_async(dispatch_get_main_queue(), ^{
        [self.commandDelegate evalJs:[NSString stringWithFormat:@"cordova.fireDocumentEvent('IMPush.openNotification',%@)",jsonStr]];
        
    });
}

#pragma mark - Post请求用户头像url和name
- (void)requestUserNameAndUrlById:(NSString *)userId ByToken:(NSString *)access_token
{
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"http://wechat.hand-china.com/hrmsv2/v2/api/staff/detail?access_token=%@",access_token]];
    NSMutableURLRequest *mutableRequest = [NSMutableURLRequest requestWithURL:url];
    [mutableRequest setHTTPMethod:@"POST"];
    NSDictionary *headers = @{
                              @"content-type": @"application/json"
                              };
    [mutableRequest setAllHTTPHeaderFields:headers];
    NSDictionary *bodyDict = [NSDictionary dictionaryWithObjects:@[userId] forKeys:@[@"key"]];
    NSData *httpBody = [NSJSONSerialization dataWithJSONObject:bodyDict options:NSJSONWritingPrettyPrinted error:nil];
    [mutableRequest setHTTPBody:httpBody];
    NSURLSessionDataTask *Task = [session dataTaskWithRequest:mutableRequest completionHandler:^(NSData * data, NSURLResponse *  response, NSError * error) {
        NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
        //NSLog(@"SUCESS %@",json);
        NSString *userIcon = json[@"rows"][0][@"avatar"];//小头像
        NSString *userName = json[@"rows"][0][@"emp_name"];//用户名
        if (userIcon==nil) {
            NSString *path = [[NSBundle mainBundle] pathForResource:@"image_placehold" ofType:@"png"];
            userIcon = [NSString stringWithFormat:@"%@",[NSURL fileURLWithPath:path]];
        }
        [[NSUserDefaults standardUserDefaults] setObject:userIcon forKey:@"userIcon"];
        [[NSUserDefaults standardUserDefaults] setObject:userName forKey:@"userName"];
        if (json[@"error"]) {
            NSLog(@"获取头像失败,access_token可能过期了");
        }else{
            NSLog(@"下载头像成功:%@, 姓名：%@",userIcon,userName);
        }
    }];
    [Task resume];
}

- (void)loginRCWebService
{
    //@"opD4Ebul2EdzwRFdU4zRPhtMy4gibP9YNyGiOUps1grOsi9QUt9gND34l6635zgGBRChz/FV1mrQlLsiIJ5Lrg=="
    [[RCIM sharedRCIM] connectWithToken:RCToken success:^(NSString *userId) {
        //设置用户信息提供者,页面展现的用户头像及昵称都会从此代理取
        [[RCIM sharedRCIM] setUserInfoDataSource:self];
        dispatch_async(dispatch_get_main_queue(), ^{
            //存储联系人详细信息 userId userName userIcon
            [DataBaseTool selectSameUserInfoWithId:friendId Name:friendName ImageUrl:friendIcon];
        });
        NSLog(@"Login successfully with userId: %@", userId);
    } error:^(RCConnectErrorCode status) {
        NSLog(@"login error status: %ld.", (long)status);
    } tokenIncorrect:^{
        //可以重新请求一次
        NSLog(@"token 无效 ，请确保生成token 使用的appkey 和初始化时的appkey 一致");
    }];
    
    
}


#pragma mark - RCIMUserInfoDataSource
-(void)getUserInfoWithUserId:(NSString *)userId completion:(void (^)(RCUserInfo *))completion
{
    NSLog(@"SDK获取userinfo id:%@ userid:%@ ",[[NSUserDefaults standardUserDefaults] objectForKey:@"userId"],userId);
    //此处为了演示写了一个用户信息 messageSender messageReceiver
    if ([friendId isEqual:userId]) {
        RCUserInfo *user = [[RCUserInfo alloc]init];
        user.userId = friendId;
        user.name = friendName;
        user.portraitUri = friendIcon;
        //  NSLog(@"11此处为了演示写了一个用户信息 userId:%@  name:%@ user.portraitUri:%@",user.userId,user.name,user.portraitUri );
        return completion(user);
    }else if([[[NSUserDefaults standardUserDefaults] objectForKey:@"userId"] isEqual:userId]) {
        RCUserInfo *user = [[RCUserInfo alloc]init];
        user.userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
        user.name = [[NSUserDefaults standardUserDefaults] objectForKey:@"userName"];
        user.portraitUri = [[NSUserDefaults standardUserDefaults] objectForKey:@"userIcon"];
        // NSLog(@"22此处为了演示写了一个用户信息 userId:%@  name :%@ url:%@",userId,user.name,user.portraitUri);
        return completion(user);
    }
}
@end
