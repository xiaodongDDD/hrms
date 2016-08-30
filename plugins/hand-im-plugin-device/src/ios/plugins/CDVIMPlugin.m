//
//  CDVIMPlugin.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/11.
//
//

#import "CDVIMPlugin.h"
#import "CVDPlugin-Bridging-Header.h"
#import "UINavigationController+RCIMChatNavigationController.h"
#import "DataBaseTool.h"
#import "ToastUtils.h"
@interface CDVIMPlugin ()
{
    NSString *friendId;
    NSString *friendName;
    NSString *friendIcon;
    NSArray *telephoneNumbers;
    BOOL isSuccessFulConnect;
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
        [self loginRCWebService];//登陆融云
        [self requestUserNameAndUrlById:userId ByToken:access_token];//请求登录用户信息
    });
}

//开启单人会话
- (void)toChatAct:(CDVInvokedUrlCommand *)command
{
    if (isSuccessFulConnect) {
        NSLog(@"openIMVC");
        friendId =   command.arguments[0][@"friendId"];
        friendName = command.arguments[0][@"friendName"];
        friendIcon = command.arguments[0][@"friendIcon"];
        telephoneNumbers = command.arguments[0][@"telephoneNumbers"];
        [DataBaseTool selectSameUserInfoWithId:friendId Name:friendName ImageUrl:friendIcon];
        UINavigationController *nav = [[UINavigationController alloc] initWithTargetId:friendId FriendName:friendName Icon:friendIcon PhoneNumbers:telephoneNumbers];
        [self.viewController presentViewController:nav animated:NO completion:nil];

        //消失回调
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(chatViewDismiss) name:RCIMChattingViewControllerNotification object:nil];
    }else{
        [ToastUtils showLong:@"登录聊天服务器失败,请确保您的网络可用或重新登录"];
    }
}

-(void)returnConversationList:(CDVInvokedUrlCommand *)command
{
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
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"message":@" "}];
    }
    NSLog(@"return回调:%@",returnArray);
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

//连接融云服务器
- (void)loginRCWebService
{
    NSString *userToken = [[NSUserDefaults standardUserDefaults]objectForKey:@"RCToken"];
    [[RCIMClient sharedRCIMClient] connectWithToken:userToken success:^(NSString *userId) {
        NSLog(@"Login successfully with userId: %@", userId);
        isSuccessFulConnect = YES;
    } error:^(RCConnectErrorCode status) {
        NSLog(@"login error status: %ld.", (long)status);
    } tokenIncorrect:^{
        //可以重新请求一次
        NSLog(@"token 无效 ，请确保生成token 使用的appkey 和初始化时的appkey 一致");
    }];

}

-(void)deleteConversationList:(CDVInvokedUrlCommand *)command
{
    NSLog(@"删除会话列表");
    NSString *deleteFriendId = [command arguments][0];
    CDVPluginResult *result;
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"result":@"success"}];
    [DataBaseTool deleteDataListBy:deleteFriendId];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
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
    NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"%@access_token=%@",localService,access_token]];
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

        if (!error) {
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            NSString *userId = json[@"rows"][0][@"emp_code"];//用户id
            NSString *userIcon = json[@"rows"][0][@"avatar"];//小头像
            NSString *userName = json[@"rows"][0][@"emp_name"];//用户名
            if (userIcon==nil || [userIcon isEqual:[NSNull null]]||[userIcon isEqualToString:@""]) {
                NSString *path = [[NSBundle mainBundle] pathForResource:@"default_portrait_msg@2x" ofType:@"png"];
                userIcon = [NSString stringWithFormat:@"%@",[NSURL fileURLWithPath:path]];
            }
            [[NSUserDefaults standardUserDefaults] setObject:userIcon forKey:@"userIcon"];
            [[NSUserDefaults standardUserDefaults] setObject:userName forKey:@"userName"];
            if (json[@"error"]) {
                //  [self showAlertView];
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

#pragma mark -RCIMChattingViewControllerNotification
- (void)chatViewDismiss
{
    [self IMPluginDidReceiveMessage:nil];
}
@end
