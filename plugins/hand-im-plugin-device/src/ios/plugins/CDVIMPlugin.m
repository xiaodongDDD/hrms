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
#import "RCIMDiscussionGroupAddMemberController.h"
#import "RCIMGroupChatViewController.h"
#import <RongCallKit/RongCallKit.h>

@interface CDVIMPlugin ()
{
    NSString *friendId;
    NSString *friendName;
    NSString *friendIcon;
    NSString *telephoneNumbers;
}

@end

@implementation CDVIMPlugin

//程序点击登陆的时候调用
-(void)getChatList:(CDVInvokedUrlCommand *)command
{
    NSString *baseUrl = [command.arguments[0] objectForKey:@"businessUrl"];
    NSLog(@"rootService----%@",rootService);
    NSString *userId = [command.arguments[0] objectForKey:@"userId"];
    NSString *access_token = [command.arguments[0] objectForKey:@"access_token"];
    NSString *Token = [command.arguments[0] objectForKey:@"RCToken"];
//    NSLog(@"%@,%@,token----%@",userId,access_token,Token);
    [[NSUserDefaults standardUserDefaults] setObject:baseUrl forKey:@"businessUrl"];
    
    NSLog(@"businessUrl:%@",[[NSUserDefaults standardUserDefaults] objectForKey:@"businessUrl"]);
    [[NSUserDefaults standardUserDefaults] setObject:userId forKey:@"userId"];
    [[NSUserDefaults standardUserDefaults] setObject:Token forKey:@"RCToken"];
    [[NSUserDefaults standardUserDefaults] setObject:access_token forKey:@"access_token"];
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self loginRCWebService];//登陆融云
        [self requestUserNameAndUrlById:userId ByToken:access_token];//请求登录用户信息
    });
    [self performSelector:@selector(IMPluginDidReceiveMessage:) withObject:nil afterDelay:2.0];
}

//开启单人会话
- (void)toChatAct:(CDVInvokedUrlCommand *)command
{
    RCConnectionStatus isSuccessFulConnect = [[RCIM sharedRCIM] getConnectionStatus];//状态监听
    if (isSuccessFulConnect==ConnectionStatus_Connected) {
        NSLog(@"openIMVC");
        friendId =   command.arguments[0][@"friendId"];
        friendName = command.arguments[0][@"friendName"];
        friendIcon = command.arguments[0][@"friendIcon"];
        telephoneNumbers = command.arguments[0][@"telephoneNumbers"];
        NSArray *telephones;
        if (telephoneNumbers) {
            if ([telephoneNumbers rangeOfString:@"|"].location != NSNotFound)
            {
                //包含
                telephones = [telephoneNumbers componentsSeparatedByString:@"|"];
                NSLog(@"tele-%@",telephoneNumbers);
            }else
            {
                //单个电话号码
                telephones = @[telephoneNumbers];
            }
        }else
        {
            //为空
            //查看数据库
            NSString *telStr = [DataBaseTool getTelPhoneByWorkerId:friendId];
            if (telStr) {
                telephoneNumbers = telStr;
            }else{
                telephoneNumbers = @"000000";
            }
            telephones = @[telephoneNumbers];
        }
        
        if (![DataBaseTool hasPerson:friendId]) {
            NSLog(@"没有查到此人");
            [DataBaseTool selectSameUserInfoWithId:friendId Name:friendName ImageUrl:friendIcon Tel:telephoneNumbers];
        }
        NSLog(@"电话:%@",telephones);
        UINavigationController *nav = [[UINavigationController alloc] initWithTargetId:friendId FriendName:friendName Icon:friendIcon PhoneNumbers:telephones];
        [self.viewController presentViewController:nav animated:NO completion:nil];
        
    }else{
        [ToastUtils showLong:@"登录聊天服务器失败,请确保您的网络可用或重新登录"];
    }
}

#pragma makr - 开启讨论组聊天
- (void)openDiscussion:(CDVInvokedUrlCommand *)commmand
{
    NSDictionary *argDict = commmand.arguments.firstObject;
    NSString *discussionId = [argDict objectForKey:@"discussionId"];
    RCIMGroupChatViewController *discussionGroupVC = [[RCIMGroupChatViewController alloc] init];
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:discussionGroupVC];
    [[RCIMClient sharedRCIMClient] getDiscussion:discussionId success:^(RCDiscussion *discussion) {
        NSLog(@"%@-获取讨论组成功",self.class);
        discussionGroupVC.discussionId = discussion.discussionId;
        discussionGroupVC.navTitle = discussion.discussionName;
        discussionGroupVC.membersList = discussion.memberIdList;
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.viewController presentViewController:nav animated:NO completion:nil];
        });
    } error:^(RCErrorCode status) {
        NSLog(@"%@-获取讨论组信息失败:%li",self.class,status);
    }];
}

#pragma mark -创建讨论组
- (void)createDiscussion:(CDVInvokedUrlCommand *)command
{
    RCIMDiscussionGroupAddMemberController *RCIMDiscussionGroupAddVC = [[RCIMDiscussionGroupAddMemberController alloc] init];
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:RCIMDiscussionGroupAddVC];
    [self.viewController presentViewController:nav animated:NO completion:nil];
}

-(void)returnConversationList:(CDVInvokedUrlCommand *)command
{
    CDVPluginResult *result;
    NSLog(@"----获取某个会话中指定数量的最新消息实体---------");//message
    NSArray * conversationList = [[RCIMClient sharedRCIMClient] getConversationList:@[@(ConversationType_PRIVATE),@(ConversationType_DISCUSSION)]];
    
    NSMutableArray *returnArray = [NSMutableArray array];
    NSString * content;
    
    for (RCConversation * conversation in conversationList) {
        NSLog(@"conversation:%@,conversationID:%@",conversation,conversation.targetId);
        if (conversation.conversationType==ConversationType_PRIVATE) {
            //单聊
            if ([conversation.objectName isEqualToString:@"RC:TxtMsg"]) {
                RCTextMessage *textMessage = (RCTextMessage *) conversation.lastestMessage ;
                content  = [textMessage content];
            }else if ([conversation.objectName isEqualToString:@"RC:ImgMsg"]){
                content = @"[图片]";
            }else if ([conversation.objectName isEqualToString:@"RC:VcMsg"]){
                content = @"[语音]";
            }else if ([conversation.objectName isEqualToString:@"RC:LBSMsg"]){
                content = @"[位置]";
            }else if ([conversation.objectName isEqualToString:@"RC:VCSummary"]){
                //网络电话
                content = @"[电话]";
            }else{
                content = [NSString stringWithFormat:@"%@",conversation.objectName];
            }
            
            NSString *name = [DataBaseTool getNameByWorkerId:conversation.targetId];
            NSString *icon = [DataBaseTool getImageUrlByWorkerId:conversation.targetId];
            NSLog(@"targetUserInfo:name %@, id %@ ,icon %@",name,conversation.targetId,icon);
            if (icon!=nil) {
                NSDictionary *dictConversa = [NSDictionary dictionaryWithObjects:@[conversation.targetId,name,icon,[TimeTool timeStr:conversation.receivedTime],@(conversation.unreadMessageCount),content,[TimeTool sortTime:conversation.receivedTime],@(conversation.conversationType)] forKeys:@[@"sendId",@"userName",@"userIcon",@"sendTime",@"messageNum",@"content",@"sortTime",@"conversationType"]];
                [returnArray addObject:@{@"message":dictConversa}];
            }
        }else if (conversation.conversationType==ConversationType_DISCUSSION){
            if (![conversation.objectName isEqualToString:@"RC:DizNtf"]) {
                //讨论组聊天
                NSLog(@"//讨论组聊天-conversation:%@,conversationID:%@,内容:%@",conversation,conversation.targetId,conversation.lastestMessage);
                __block  NSString *name = conversation.conversationTitle;//讨论组的名称
                NSString *icon ;
                if ([conversation.objectName isEqualToString:@"RC:TxtMsg"]) {
                    
                    RCTextMessage *textMessage = (RCTextMessage *) conversation.lastestMessage ;
                    content  = [NSString stringWithFormat:@"%@：%@",textMessage.senderUserInfo.name,textMessage.content];
                    
                    icon = textMessage.extra;
                    
                }else if ([conversation.objectName isEqualToString:@"RC:ImgMsg"]){
                    
                    RCImageMessage *imageMsg = (RCImageMessage *)conversation.lastestMessage;
                    content  = [NSString stringWithFormat:@"%@：[图片]",imageMsg.senderUserInfo.name];
                    
                    icon = imageMsg.extra;
                    
                }else if ([conversation.objectName isEqualToString:@"RC:VcMsg"]){
                    
                    RCVoiceMessage *voiceMsg = (RCVoiceMessage *)conversation.lastestMessage;
                    content = [NSString stringWithFormat:@"%@：[语音]",voiceMsg.senderUserInfo.name];
                    
                    icon = voiceMsg.extra;
                    
                }else if ([conversation.objectName isEqualToString:@"RC:LBSMsg"]){
                    
                    RCLocationMessage *locationMsg = (RCLocationMessage*)conversation.lastestMessage;
                    content = [NSString stringWithFormat:@"%@：[位置]",locationMsg.senderUserInfo.name];
                    
                    icon = locationMsg.extra;
                    
                }else if ([conversation.objectName isEqualToString:@"RC:VCSummary"]){
                    //网络电话
                    RCCallSummaryMessage *callSummaryMsg = (RCCallSummaryMessage*) conversation.lastestMessage;
                    content = [NSString stringWithFormat:@"%@：发起了语音通话",callSummaryMsg.caller];
                    NSLog(@"123%@",content);
                    icon = [DataBaseTool getDiscussionPortraitUriById:conversation.targetId];
                }else{
                    content = [NSString stringWithFormat:@"%@",conversation.objectName];
                    icon = [DataBaseTool getDiscussionPortraitUriById:conversation.targetId];
                    NSLog(@"1234%@",content);
                }
                //插入讨论组消息
                
                NSLog(@"targetUserInfo:name %@, id %@ ,icon %@",name,conversation.targetId,icon);
                if (icon!=nil) {
                    [[RCIMClient sharedRCIMClient] getDiscussion:conversation.targetId success:^(RCDiscussion *discussion) {
                        name = discussion.discussionName;
                    } error:nil];
                    NSDictionary *dictConversa = [NSDictionary dictionaryWithObjects:@[conversation.targetId,name,icon,[TimeTool timeStr:conversation.receivedTime],@(conversation.unreadMessageCount),content,[TimeTool sortTime:conversation.receivedTime],@(conversation.conversationType)] forKeys:@[@"sendId",@"userName",@"userIcon",@"sendTime",@"messageNum",@"content",@"sortTime",@"conversationType"]];
                    [returnArray addObject:@{@"message":dictConversa}];
                }
            }
        }
        
    }
    
    NSLog(@"returnArray.count");
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
    NSString *userToken = [[NSUserDefaults standardUserDefaults] objectForKey:@"RCToken"];
    [[RCIMClient sharedRCIMClient] connectWithToken:userToken success:^(NSString *userId) {
        NSLog(@"连接融云成功 with userId: %@", userId);
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
    NSString *deleteFriendId = [command.arguments[0] objectForKey:@"friendId"];
    NSString *conversationType = [command.arguments[0] objectForKey:@"conversationType"];
    CDVPluginResult *result;
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:@{@"result":@"success"}];
    [DataBaseTool deleteDataListBy:deleteFriendId Type:conversationType.intValue];
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
    
    //消失回调 单聊
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(chatViewDismiss) name:RCIMChattingViewControllerNotification object:nil];
    //消失回调 群聊
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(discussionGroupDismiss) name:@"RCIMGroupChatViewControllerDismiss" object:nil];
    NSLog(@"come initNotifications");
    
}
- (void)IMPluginDidReceiveMessage:(NSNotification *)notification
{
    NSLog(@"come IMPluginDidReceiveMessage");
    //返回所有的单人聊天 讨论组聊天
    NSArray * conversationList = [[RCIMClient sharedRCIMClient] getConversationList:@[@(ConversationType_PRIVATE),@(ConversationType_DISCUSSION)]];
    
    NSMutableArray *returnArray = [NSMutableArray array];
    NSString * content;
    
    for (RCConversation * conversation in conversationList) {
        NSLog(@"conversationTitle:%@,conversationID:%@,conversationType:%lu",conversation.conversationTitle,conversation.targetId,conversation.conversationType);
        if (conversation.conversationType==ConversationType_PRIVATE) {
            //单聊
            if ([conversation.objectName isEqualToString:@"RC:TxtMsg"]) {
                RCTextMessage *textMessage = (RCTextMessage *) conversation.lastestMessage ;
                content  = [textMessage content];
            }else if ([conversation.objectName isEqualToString:@"RC:ImgMsg"]){
                content = @"[图片]";
            }else if ([conversation.objectName isEqualToString:@"RC:VcMsg"]){
                content = @"[语音]";
            }else if ([conversation.objectName isEqualToString:@"RC:LBSMsg"]){
                content = @"[位置]";
            }else if ([conversation.objectName isEqualToString:@"RC:VCSummary"]){
                //网络电话
                content = @"[电话]";
            }else{
                content = [NSString stringWithFormat:@"%@",conversation.objectName];
            }
            
            NSString *name = [DataBaseTool getNameByWorkerId:conversation.targetId];
            NSString *icon = [DataBaseTool getImageUrlByWorkerId:conversation.targetId];
            NSLog(@"t-id:%@,name:%@,icon:%@,time:%@,unreadCount:%@,content:%@,sortTIme:%@,conversationType:%@",conversation.targetId,name,icon,[TimeTool timeStr:conversation.receivedTime],@(conversation.unreadMessageCount),content,[TimeTool sortTime:conversation.receivedTime],@(conversation.conversationType));
           
            if (name!=nil&&icon!=nil) {
                NSDictionary *dictConversa = [NSDictionary dictionaryWithObjects:@[conversation.targetId,name,icon,[TimeTool timeStr:conversation.receivedTime],@(conversation.unreadMessageCount),content,[TimeTool sortTime:conversation.receivedTime],@(conversation.conversationType)] forKeys:@[@"sendId",@"userName",@"userIcon",@"sendTime",@"messageNum",@"content",@"sortTime",@"conversationType"]];
                [returnArray addObject:@{@"message":dictConversa}];
            }
        }else if (conversation.conversationType==ConversationType_DISCUSSION){
            if (![conversation.objectName isEqualToString:@"RC:DizNtf"]) {
                //讨论组聊天
                
                __block   NSString *name = conversation.conversationTitle;//讨论组的名称
                NSString *icon ;
                if ([conversation.objectName isEqualToString:@"RC:TxtMsg"]) {
                    
                    RCTextMessage *textMessage = (RCTextMessage *) conversation.lastestMessage ;
                    content  = [NSString stringWithFormat:@"%@：%@",textMessage.senderUserInfo.name,textMessage.content];
                    
                    icon = textMessage.extra;
                    
                }else if ([conversation.objectName isEqualToString:@"RC:ImgMsg"]){
                    
                    RCImageMessage *imageMsg = (RCImageMessage *)conversation.lastestMessage;
                    content  = [NSString stringWithFormat:@"%@：[图片]",imageMsg.senderUserInfo.name];
                    
                    icon = imageMsg.extra;
                    
                }else if ([conversation.objectName isEqualToString:@"RC:VcMsg"]){
                    
                    RCVoiceMessage *voiceMsg = (RCVoiceMessage *)conversation.lastestMessage;
                    content = [NSString stringWithFormat:@"%@：[语音]",voiceMsg.senderUserInfo.name];
                    
                    icon = voiceMsg.extra;
                    
                }else if ([conversation.objectName isEqualToString:@"RC:LBSMsg"]){
                    
                    RCLocationMessage *locationMsg = (RCLocationMessage*)conversation.lastestMessage;
                    content = [NSString stringWithFormat:@"%@：[位置]",locationMsg.senderUserInfo.name];
                    
                    icon = locationMsg.extra;
                    
                }else if ([conversation.objectName isEqualToString:@"RC:VCSummary"]){
                    //网络电话
                    RCCallSummaryMessage *callSummaryMsg = (RCCallSummaryMessage*) conversation.lastestMessage;
                    content = [NSString stringWithFormat:@"%@：发起了语音通话",[DataBaseTool getNameByWorkerId:callSummaryMsg.caller]];
                    NSLog(@"123--%@",content);
                    icon = [DataBaseTool getDiscussionPortraitUriById:conversation.targetId];
                }else{
                    content = [NSString stringWithFormat:@"%@",conversation.objectName];
                    icon = [DataBaseTool getDiscussionPortraitUriById:conversation.targetId];
                    NSLog(@"1234--%@",content);
                }
                
                NSLog(@"name:%@, id:%@ ,icon:%@",name,conversation.targetId,icon);
                if (icon) {
                    [[RCIMClient sharedRCIMClient] getDiscussion:conversation.targetId success:^(RCDiscussion *discussion) {
                        name = discussion.discussionName;
                    } error:nil];
                    NSDictionary *dictConversa = [NSDictionary dictionaryWithObjects:@[conversation.targetId,name,icon,[TimeTool timeStr:conversation.receivedTime],@(conversation.unreadMessageCount),content,[TimeTool sortTime:conversation.receivedTime],@(conversation.conversationType)] forKeys:@[@"sendId",@"userName",@"userIcon",@"sendTime",@"messageNum",@"content",@"sortTime",@"conversationType"]];
                    [returnArray addObject:@{@"message":dictConversa}];
                    
                }
            }
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
            NSString *tel = json[@"rows"][0][@"mobil"];
           // NSLog(@"userId:%@,userIcon:%@,userName:%@,tel:%@,obj:%@",userId,userIcon,userName,tel,json[@"rows"][0]);
            if (userIcon==nil || [userIcon isEqual:[NSNull null]]||[userIcon isEqualToString:@""]) {
                NSString *path = @"profile-2@3x.png";
                userIcon = [NSString stringWithFormat:@"%@",[NSURL fileURLWithPath:path]];
            }
            if (tel==nil || [tel isEqual:[NSNull null]]||[tel isEqualToString:@""]) {
                tel = @"null";
            }
            [[NSUserDefaults standardUserDefaults] setObject:userIcon forKey:@"userIcon"];
            [[NSUserDefaults standardUserDefaults] setObject:userName forKey:@"userName"];
            [[NSUserDefaults standardUserDefaults] setObject:tel forKey:@"tel"];
            if (json[@"error"]) {
                //  [self showAlertView];
                NSLog(@"获取头像失败,access_token可能过期了");
            }else{
                NSLog(@"下载头像成功:%@, 姓名：%@",userIcon,userName);
                //存储联系人详细信息 userId userName userIcon tel
                [DataBaseTool selectSameUserInfoWithId:userId Name:userName ImageUrl:userIcon Tel:tel];
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
#pragma mark -RCIMDiscussionGroupVCDismissNotification
- (void)discussionGroupDismiss{
    [self IMPluginDidReceiveMessage:nil];
}
@end
