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
    NSLog(@"%@,%@,%@",userId,access_token,Token);
    [[NSUserDefaults standardUserDefaults] setObject:userId forKey:@"userId"];
    [[NSUserDefaults standardUserDefaults] setObject:Token forKey:@"RCToken"];
    [[NSUserDefaults standardUserDefaults] setObject:access_token forKey:@"access_token"];
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self loginRCWebService];//登陆融云
        [self requestUserNameAndUrlById:userId ByToken:access_token];//请求登录用户信息
    });
    [self IMPluginDidReceiveMessage:nil];
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

#pragma makr - 开启讨论组聊天
- (void)toDiscussionGroup:(CDVInvokedUrlCommand *)commmand
{
    NSDictionary *argDict = commmand.arguments.firstObject;
    NSString *discussionId = [argDict objectForKey:@"discussionId"];
    RCIMGroupChatViewController *discussionGroupVC = [[RCIMGroupChatViewController alloc] init];
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:discussionGroupVC];
    [[RCIMClient sharedRCIMClient] getDiscussion:discussionId success:^(RCDiscussion *discussion) {
        NSLog(@"%@-获取讨论组成功",self.class);
        discussionGroupVC.discussionId = discussion.discussionId;
        discussionGroupVC.navTitle = discussion.discussionName;
        NSMutableArray *array_list = [NSMutableArray arrayWithCapacity:discussion.memberIdList.count];
        for (NSString *memberId in discussion.memberIdList) {
            //从数据库中查找联系人姓名
            NSString *emp_name = [DataBaseTool getNameByWorkerId:memberId];
            NSString *avatar = [DataBaseTool getImageUrlByWorkerId:memberId];
            NSDictionary *userInfo = [NSDictionary dictionaryWithObjects:@[memberId,emp_name,avatar] forKeys:@[@"emp_code",@"emp_name",@"avatar"]];
            [array_list addObject:userInfo];
        }
        discussionGroupVC.membersList = array_list;
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.viewController presentViewController:nav animated:NO completion:nil];
        });
    } error:^(RCErrorCode status) {
        NSLog(@"%@-获取讨论组信息失败:%li",self.class,status);
    }];
}

#pragma mark -创建讨论组
- (void)toCreateGroupChat:(CDVInvokedUrlCommand *)command
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
            }else{
                //其他
            }
            
            NSString *name = [DataBaseTool getNameByWorkerId:conversation.targetId];
            NSString *icon = [DataBaseTool getImageUrlByWorkerId:conversation.targetId];
            NSLog(@"targetUserInfo:name %@, id %@ ,icon %@",name,conversation.targetId,icon);
            if (icon!=nil) {
                NSDictionary *dictConversa = [NSDictionary dictionaryWithObjects:@[conversation.targetId,name,icon,[TimeTool timeStr:conversation.receivedTime],@(conversation.unreadMessageCount),content,@(conversation.conversationType)] forKeys:@[@"sendId",@"userName",@"userIcon",@"sendTime",@"messageNum",@"content",@"conversationType"]];
                [returnArray addObject:@{@"message":dictConversa}];
            }
        }else if (conversation.conversationType==ConversationType_DISCUSSION){
            //讨论组聊天
            NSLog(@"//讨论组聊天-conversation:%@,conversationID:%@,内容:%@",conversation,conversation.targetId,conversation.lastestMessage);
            NSString *name = conversation.conversationTitle;//讨论组的名称
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
                
            }else if ([conversation.objectName isEqualToString:@"RC:DizNtf"]){
                //讨论组通知类消息
                RCDiscussionNotificationMessage *discussionNotiMessage = (RCDiscussionNotificationMessage *)conversation.lastestMessage;
                if (discussionNotiMessage.senderUserInfo.portraitUri==nil) {
                    icon = @"default.png";
                }else{
                    icon = discussionNotiMessage.senderUserInfo.portraitUri;
                }
                switch (discussionNotiMessage.type) {
                    case RCInviteDiscussionNotification:{
                        
                        NSString *currentUserId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
                        if ([discussionNotiMessage.extension rangeOfString:currentUserId].location==NSNotFound) {
                            content = [NSString stringWithFormat:@"讨论组通知：%@邀请了 %@加入讨论组",discussionNotiMessage.operatorId,discussionNotiMessage.extension];
                        }else{
                            content = [NSString stringWithFormat:@"讨论组通知：%@ 邀请了你加入讨论组",discussionNotiMessage.operatorId];
                        }
                        
                    }
                        break;
                    case RCQuitDiscussionNotification:{
                        content = [NSString stringWithFormat:@"讨论组通知：%@退出了讨论组",discussionNotiMessage.operatorId];
                    }
                        break;
                    case RCRenameDiscussionTitleNotification:{
                        content = [NSString stringWithFormat:@"讨论组通知：%@修改了讨论组名称",discussionNotiMessage.operatorId];
                    }
                        break;
                    case RCRemoveDiscussionMemberNotification:{
                        content = [NSString stringWithFormat:@"讨论组通知：%@被 %@移出了讨论组",discussionNotiMessage.extension,discussionNotiMessage.operatorId];
                    }
                        break;
                    case RCSwichInvitationAccessNotification:{
                        content = [NSString stringWithFormat:@"讨论组通知：%@修改了讨论组加入权限",discussionNotiMessage.operatorId];
                    }
                        break;
                        
                    default:
                        break;
                }
                
            }else{//其他消息
            }
            //插入讨论组消息
            
            NSLog(@"targetUserInfo:name %@, id %@ ,icon %@",name,conversation.targetId,icon);
            if (icon!=nil) {
                NSDictionary *dictConversa = [NSDictionary dictionaryWithObjects:@[conversation.targetId,name,icon,[TimeTool timeStr:conversation.receivedTime],@(conversation.unreadMessageCount),content,@(conversation.conversationType)] forKeys:@[@"sendId",@"userName",@"userIcon",@"sendTime",@"messageNum",@"content",@"conversationType"]];
                [returnArray addObject:@{@"message":dictConversa}];
            }
        }
        
        
    }
    
    
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
    NSString *deleteFriendId = [command.arguments[0] objectForKey:@"conversationId"];
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
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                            selector:@selector(discussionGroupDismiss) name:@"RCIMGroupChatViewControllerDismiss" object:nil];
    NSLog(@"come initNotifications");
    
}
- (void)IMPluginDidReceiveMessage:(NSNotification *)notification
{
    //RCMessage *message = notification.object;
    NSLog(@"come IMPluginDidReceiveMessage");
    //返回所有的单人聊天 讨论组聊天
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
            }else{
                //其他
            }
            
            NSString *name = [DataBaseTool getNameByWorkerId:conversation.targetId];
            NSString *icon = [DataBaseTool getImageUrlByWorkerId:conversation.targetId];
            NSLog(@"targetUserInfo:name %@, id %@ ,icon %@",name,conversation.targetId,icon);
            if (icon!=nil) {
                NSDictionary *dictConversa = [NSDictionary dictionaryWithObjects:@[conversation.targetId,name,icon,[TimeTool timeStr:conversation.receivedTime],@(conversation.unreadMessageCount),content,@(conversation.conversationType)] forKeys:@[@"sendId",@"userName",@"userIcon",@"sendTime",@"messageNum",@"content",@"conversationType"]];
                [returnArray addObject:@{@"message":dictConversa}];
            }
        }else if (conversation.conversationType==ConversationType_DISCUSSION){
            //讨论组聊天
            NSLog(@"//讨论组聊天-conversation:%@,conversationID:%@,内容:%@",conversation,conversation.targetId,conversation.lastestMessage);
            NSString *name = conversation.conversationTitle;//讨论组的名称
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
                
            }else if ([conversation.objectName isEqualToString:@"RC:DizNtf"]){
                //讨论组通知类消息
                RCDiscussionNotificationMessage *discussionNotiMessage = (RCDiscussionNotificationMessage *)conversation.lastestMessage;
                if (discussionNotiMessage.senderUserInfo.portraitUri==nil) {
                    icon = @"default.png";
                }else{
                    icon = discussionNotiMessage.senderUserInfo.portraitUri;
                }
                switch (discussionNotiMessage.type) {
                    case RCInviteDiscussionNotification:{
                        
                        NSString *currentUserId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
                        if ([discussionNotiMessage.extension rangeOfString:currentUserId].location==NSNotFound) {
                            content = [NSString stringWithFormat:@"讨论组通知：%@邀请了 %@加入讨论组",discussionNotiMessage.operatorId,discussionNotiMessage.extension];
                        }else{
                            content = [NSString stringWithFormat:@"讨论组通知：%@ 邀请了你加入讨论组",discussionNotiMessage.operatorId];
                        }
                        
                    }
                        break;
                    case RCQuitDiscussionNotification:{
                        content = [NSString stringWithFormat:@"讨论组通知：%@退出了讨论组",discussionNotiMessage.operatorId];
                    }
                        break;
                    case RCRenameDiscussionTitleNotification:{
                        content = [NSString stringWithFormat:@"讨论组通知：%@修改了讨论组名称",discussionNotiMessage.operatorId];
                    }
                        break;
                    case RCRemoveDiscussionMemberNotification:{
                        content = [NSString stringWithFormat:@"讨论组通知：%@被 %@移出了讨论组",discussionNotiMessage.extension,discussionNotiMessage.operatorId];
                    }
                        break;
                    case RCSwichInvitationAccessNotification:{
                        content = [NSString stringWithFormat:@"讨论组通知：%@修改了讨论组加入权限",discussionNotiMessage.operatorId];
                    }
                        break;
                        
                    default:
                        break;
                }
                
            }else{//其他消息
            }
            //插入讨论组消息
            
            NSLog(@"targetUserInfo:name %@, id %@ ,icon %@",name,conversation.targetId,icon);
            if (icon!=nil) {
                NSDictionary *dictConversa = [NSDictionary dictionaryWithObjects:@[conversation.targetId,name,icon,[TimeTool timeStr:conversation.receivedTime],@(conversation.unreadMessageCount),content,@(conversation.conversationType)] forKeys:@[@"sendId",@"userName",@"userIcon",@"sendTime",@"messageNum",@"content",@"conversationType"]];
                [returnArray addObject:@{@"message":dictConversa}];
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
            NSLog(@"userId:%@,userIcon:%@,userName:%@,JSON:%@",userId,userIcon,userName,json);
            if (userIcon==nil || [userIcon isEqual:[NSNull null]]||[userIcon isEqualToString:@""]) {
                NSString *path = @"profile-2@3x.png";
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
#pragma mark -RCIMDiscussionGroupVCDismissNotification
- (void)discussionGroupDismiss{
    [self IMPluginDidReceiveMessage:nil];
}
@end
