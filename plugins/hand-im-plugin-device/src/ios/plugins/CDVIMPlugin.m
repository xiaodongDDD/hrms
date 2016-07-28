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
    NSString *friendId ;
    NSString *friendName;
    NSString *friendIcon;
}

@end

@implementation CDVIMPlugin

//程序点击登陆的时候调用
-(void)getChatList:(CDVInvokedUrlCommand *)command
{
    NSString *userId = [command.arguments[0] objectForKey:@"userId"];
    NSString *access_token = [command.arguments[0] objectForKey:@"access_token"];
    NSString *Token = [command.arguments[0] objectForKey:@"RCToken"];

    [[NSUserDefaults standardUserDefaults] setObject:userId forKey:@"userId"];
    [[NSUserDefaults standardUserDefaults] setObject:Token forKey:@"RCToken"];
    [[NSUserDefaults standardUserDefaults] setObject:access_token forKey:@"access_token"];

    dispatch_async(dispatch_get_main_queue(), ^{
        [self requestUserNameAndUrlById:userId ByToken:access_token];
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
    [DataBaseTool selectSameUserInfoWithId:friendId Name:friendName ImageUrl:friendIcon];

    CDVIMPluginChattingViewController *cdvIMChattingVC = [[CDVIMPluginChattingViewController alloc] initWithConversationType:ConversationType_PRIVATE targetId:friendId];
    NSLog(@"toChatAct:%@",friendId);
    nav = [[UINavigationController alloc] initWithRootViewController:cdvIMChattingVC];

    cdvIMChattingVC.targetId = friendId;
    cdvIMChattingVC.navTitle = friendName;

    //自定义push动画
    CATransition *animation = [CATransition animation];
    animation.duration = 0.3;
    [animation setTimingFunction:[CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseInEaseOut]];
    animation.type = kCATransitionFade;
    animation.subtype = kCATransitionFromRight;

    //    [animation setFillMode:kCAFillModeBackwards];
    animation.removedOnCompletion = YES;
    [self.viewController.view.superview.layer addAnimation:animation forKey:@"animation"];
    [self.viewController.view addSubview:nav.view];
}


-(void)returnConversationList:(CDVInvokedUrlCommand *)command
{
    //  NSLog(@"----数据库---%@",[DataBaseTool getAllMessagesData]);
    CDVPluginResult *result;
    NSLog(@"----获取某个会话中指定数量的最新消息实体---------");//message
    NSArray * conversationList = [[RCIMClient sharedRCIMClient] getConversationList:@[@(ConversationType_PRIVATE)]];

    NSMutableArray *returnArray = [NSMutableArray array];
    NSString * content;
    for (RCConversation * conversation in conversationList) {
        NSLog(@"conversation:%@,conversationID:%@",conversation,conversation.targetId);
        if ([conversation.objectName isEqualToString:@"RC:TxtMsg"]) {
            RCTextMessage *message = (RCTextMessage *) conversation.lastestMessage ;
            // NSLog(@"lastMessage:%@",conversation.lastestMessage);
            content  = [message content];
            //     NSLog(@"content:%@",content);
        }else if ([conversation.objectName isEqualToString:@"RC:ImgMsg"]){
            content  = @"[图片]";
        }else if ([conversation.objectName isEqualToString:@"RC:VcMsg"]){
            content = @"[语音]";
        }else if ([conversation.objectName isEqualToString:@"RC:LBSMsg"]){
            content = @"[位置]";
        }else{
            //其他
        }
        //  RCUserInfo *targetUserInfo = [[RCIM sharedRCIM] getUserInfoCache:conversation.targetId];
        NSString *name = [DataBaseTool getNameByWorkerId:conversation.targetId];
        NSString *icon = [DataBaseTool getImageUrlByWorkerId:conversation.targetId];
        NSLog(@"targetUserInfo:name %@, id %@ ,icon %@",name,conversation.targetId,icon);
        if (icon!=nil) {
            NSDictionary *dictConversa = [NSDictionary dictionaryWithObjects:@[conversation.targetId,name,icon,[TimeTool timeStr:conversation.receivedTime],@(conversation.unreadMessageCount),content] forKeys:@[@"sendId",@"userName",@"userIcon",@"sendTime",@"messageNum",@"content"]];
            [returnArray addObject:@{@"message":dictConversa}];
        }
    }
    //   NSLog(@"returnArray:%@",returnArray);
    if (returnArray.count) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"message":returnArray}];
    }else{
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"message":@"null"}];
    }
    NSLog(@"return东西:%@",returnArray);
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

-(void)deleteConversationList:(CDVInvokedUrlCommand *)command
{
    NSLog(@"删除会话列表");
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
    NSArray * conversationList = [[RCIMClient sharedRCIMClient] getConversationList:@[@(ConversationType_PRIVATE)]];

    NSMutableArray *returnArray = [NSMutableArray array];
    NSString * content;
    for (RCConversation * conversation in conversationList) {
        NSLog(@"conversation:%@,conversationID:%@",conversation,conversation.targetId);
        if ([conversation.objectName isEqualToString:@"RC:TxtMsg"]) {
            RCTextMessage *message = (RCTextMessage *) conversation.lastestMessage ;
            // NSLog(@"lastMessage:%@",conversation.lastestMessage);
            content  = [message content];
            //     NSLog(@"content:%@",content);
        }else if ([conversation.objectName isEqualToString:@"RC:ImgMsg"]){
            content  = @"[图片]";
        }else if ([conversation.objectName isEqualToString:@"RC:VcMsg"]){
            content = @"[语音]";
        }else if ([conversation.objectName isEqualToString:@"RC:LBSMsg"]){
            content = @"[位置]";
        }else{
            //其他
        }
        //  RCUserInfo *targetUserInfo = [[RCIM sharedRCIM] getUserInfoCache:conversation.targetId];
        NSString *name = [DataBaseTool getNameByWorkerId:conversation.targetId];
        NSString *icon = [DataBaseTool getImageUrlByWorkerId:conversation.targetId];
        NSLog(@"targetUserInfo:name %@, id %@ ,icon %@",name,conversation.targetId,icon);
        if (icon!=nil) {
            NSDictionary *dictConversa = [NSDictionary dictionaryWithObjects:@[conversation.targetId,name,icon,[TimeTool timeStr:conversation.receivedTime],@(conversation.unreadMessageCount),content] forKeys:@[@"sendId",@"userName",@"userIcon",@"sendTime",@"messageNum",@"content"]];
            [returnArray addObject:@{@"message":dictConversa}];
        }
    }
    if (returnArray.count) {
        dispatch_async(dispatch_get_main_queue(), ^{
            NSDictionary *jsonDict = [NSDictionary dictionaryWithObject:returnArray forKey:@"message"];
            NSData *jsonStrData = [NSJSONSerialization dataWithJSONObject:jsonDict  options:0 error:nil];
            NSString *jsonStr = [[NSString alloc] initWithData:jsonStrData encoding:NSUTF8StringEncoding];
            [self.commandDelegate evalJs:[NSString stringWithFormat:@"cordova.fireDocumentEvent('IMPush.openNotification',%@)",jsonStr]];

        });
    }
}

#pragma mark - Post请求用户头像url和name
- (void)requestUserNameAndUrlById:(NSString *)userId ByToken:(NSString *)access_token
{
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"http://mobile-app.hand-china.com/hrmsv2/v2/api/staff/detail?access_token=%@",access_token]];
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
       if(!error){
        NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
               //NSLog(@"SUCESS %@",json);
               NSString *userId = json[@"rows"][0][@"emp_code"];//用户id
               NSString *userIcon = json[@"rows"][0][@"avatar"];//小头像
               NSString *userName = json[@"rows"][0][@"emp_name"];//用户名
               if (userIcon==nil || [userIcon isEqual:[NSNull null]]) {
                   NSString *path = [[NSBundle mainBundle] pathForResource:@"image_placehold" ofType:@"png"];
                   userIcon = [NSString stringWithFormat:@"%@",[NSURL fileURLWithPath:path]];
               }
               [[RCIM sharedRCIM] setCurrentUserInfo:[[RCUserInfo alloc] initWithUserId:userId name:userName portrait:userIcon]];
               [[NSUserDefaults standardUserDefaults] setObject:userIcon forKey:@"userIcon"];
               [[NSUserDefaults standardUserDefaults] setObject:userName forKey:@"userName"];
               if (json[@"error"]) {
                 //[self showAlertView];
                   NSLog(@"获取头像失败,access_token可能过期了");
               }else{
                   NSLog(@"下载头像成功:%@, 姓名：%@",userIcon,userName);
                   //存储联系人详细信息 userId userName userIcon
                   [DataBaseTool selectSameUserInfoWithId:userId Name:userName ImageUrl:userIcon];
               }
       }
    }];
    [Task resume];
}

- (void)loginRCWebService
{
    //@"opD4Ebul2EdzwRFdU4zRPhtMy4gibP9YNyGiOUps1grOsi9QUt9gND34l6635zgGBRChz/FV1mrQlLsiIJ5Lrg=="
    NSString *userToken = [[NSUserDefaults standardUserDefaults]objectForKey:@"RCToken"];
    [[RCIM sharedRCIM] connectWithToken:userToken success:^(NSString *userId) {
        //设置用户信息提供者,页面展现的用户头像及昵称都会从此代理取
        [[RCIM sharedRCIM] setUserInfoDataSource:self];

        NSLog(@"Login successfully with userId: %@", userId);
    } error:^(RCConnectErrorCode status) {
        NSLog(@"login error status: %ld.", (long)status);
    } tokenIncorrect:^{
        //可以重新请求一次
        NSLog(@"token 无效 ，请确保生成token 使用的appkey 和初始化时的appkey 一致");
    }];

}

- (void)showAlertView
{
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:nil message:@"连接本地服务器失败，请确保你的网络正常或联系管理员!" delegate:nil cancelButtonTitle:@"知道了" otherButtonTitles:nil, nil];
    [alert show];
}

#pragma mark - RCIMUserInfoDataSource
-(void)getUserInfoWithUserId:(NSString *)userId completion:(void (^)(RCUserInfo *))completion
{
    NSString *loginUserId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
    NSString *loginUserIcon = [[NSUserDefaults standardUserDefaults] objectForKey:@"userIcon"];
    NSString *loginUserName = [[NSUserDefaults standardUserDefaults] objectForKey:@"userName"];
    if ([userId isEqualToString:loginUserIcon]) {
        RCUserInfo *userInfo = [[RCUserInfo alloc] initWithUserId:loginUserId name:loginUserName portrait:loginUserIcon];
        completion(userInfo);
    }else if ([userId isEqualToString:friendId]){
        RCUserInfo *userInfo = [[RCUserInfo alloc] initWithUserId:friendId name:friendName portrait:friendIcon];
        completion(userInfo);
    }
    else{
        //其他人
        NSString *userIcon = [DataBaseTool getImageUrlByWorkerId:userId];
        NSString *userName = [DataBaseTool getNameByWorkerId:userId];
        RCUserInfo *userInfo = [[RCUserInfo alloc] initWithUserId:loginUserId name:userName portrait:userIcon];
        completion(userInfo);
    }
}

@end
