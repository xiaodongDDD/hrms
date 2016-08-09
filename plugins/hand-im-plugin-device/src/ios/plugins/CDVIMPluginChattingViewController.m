//
//  CDVIMPluginChattingViewController.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/11.
//
//

#import "CDVIMPluginChattingViewController.h"
#import "CVDPlugin-Bridging-Header.h"
#import "DataBaseTool.h"

@interface CDVIMPluginChattingViewController ()<RCChatSessionInputBarControlDelegate>
{
    UIPanGestureRecognizer *panRecognizer;
}

@end

@implementation CDVIMPluginChattingViewController

- (void)viewDidLoad
{
    [super viewDidLoad];

    //视图边缘阴影
    [self.navigationController.view.layer setShadowColor:[UIColor colorWithRed:210/255.0 green:210/255.0 blue:210/255.0 alpha:0.6].CGColor];
    [self.navigationController.view.layer setShadowOffset:CGSizeMake(-2, 0)];
    [self.navigationController.view.layer setShadowOpacity:1.0];
    [self.navigationController.view.layer setShadowRadius:5.0];

    // [DataBaseTool updateDataType:nil SendId:self.targetId];
    [self setDisplayUserNameInCell:NO];//隐藏发送者name

    [self.chatSessionInputBarControl.recordButton addTarget:self action:@selector(TouchDown:) forControlEvents:UIControlEventTouchDown];
    [self.chatSessionInputBarControl.recordButton addTarget:self action:@selector(UpInside:) forControlEvents:UIControlEventTouchDragExit];

    panRecognizer = [[UIPanGestureRecognizer alloc] initWithTarget:self action:@selector(panMethord:)];
    [self.navigationController.view addGestureRecognizer:panRecognizer];


    [self setMessageAvatarStyle:RC_USER_AVATAR_CYCLE];//显示头像形状
    //  [self setMessagePortraitSize:CGSizeMake(64, 64)];

    self.navigationItem.title = [NSString stringWithFormat:@"%@",_navTitle];
    [self.navigationController.navigationBar setTintColor:[UIColor  colorWithRed:74/255.0 green:74/255.0 blue:74/255.0 alpha:1.0]];

    [self.navigationController.navigationBar setTitleTextAttributes:@{NSForegroundColorAttributeName:[UIColor  colorWithRed:74/255.0 green:74/255.0 blue:74/255.0 alpha:1.0],NSFontAttributeName:[UIFont systemFontOfSize:17]}];

    [self.navigationController.navigationBar setTintColor:[UIColor  colorWithRed:74/255.0 green:74/255.0 blue:74/255.0 alpha:1.0]];

    UIBarButtonItem *backBtn = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"back@2x"] style:UIBarButtonItemStylePlain target:self action:@selector(dismiss)];
    self.navigationItem.leftBarButtonItems = @[backBtn];
    //    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithImage:[UIImage imageWithCGImage:[UIImage imageNamed:@"dial_2x.png"].CGImage scale:1.6 orientation:UIImageOrientationUp] style:UIBarButtonItemStyleDone target:self action:@selector(call:)];

}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    //导航statusBar
    [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleDefault animated:NO];
}
//按钮按下会触发
- (void)TouchDown:(UIButton *)sender
{
    panRecognizer.enabled = NO;
}

//点击拖出按钮范围触发
- (void)UpInside:(UIButton *)sender
{
    panRecognizer.enabled = YES;
}

- (void)panMethord:(UIPanGestureRecognizer *)recognizer
{
    // CGPoint touchingPoint = [recognizer locationInView:self.navigationController.view];
    CGPoint movePoint = [recognizer translationInView:self.view];
    // NSLog(@"movePoint:%lf",movePoint.x);
    if (movePoint.x>=0) {
        [self.navigationController.view setTransform:CGAffineTransformMakeTranslation(movePoint.x, 0)];
    }

    if (recognizer.state == UIGestureRecognizerStateEnded ) {
        if (self.navigationController.view.transform.tx<[UIScreen mainScreen].bounds.size.width/2.0) {
            [UIView animateWithDuration:0.35 animations:^{
                self.navigationController.view.transform = CGAffineTransformMakeTranslation(0, 0);
            }];
        }else{
            [self dismiss];
        }
    }
}


//点击返回调用的方法
- (void)dismiss
{
    //自定义pop动画
    [UIView animateWithDuration:0.3 animations:^{
        [self.navigationController.view setCenter:CGPointMake([UIScreen mainScreen].bounds.size.width*3/2, [UIScreen mainScreen].bounds.size.height/2)];
    }completion:^(BOOL finished) {
        [self.navigationController.view removeFromSuperview];
        [[UIApplication sharedApplication] setStatusBarStyle:UIStatusBarStyleLightContent animated:NO];
        [self.delegate viewControllerDismiss];
        // [self.navigationController dismissViewControllerAnimated:NO completion:nil];
    }];
}
//点击电话调用的方法
- (void)call:(NSString *)phoneNumber
{
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:[NSString stringWithFormat:@"tel://%@",phoneNumber]]];
}
/*!
 IMKit连接状态的的监听器

 @param status  SDK与融云服务器的连接状态

 @discussion 如果您设置了IMKit消息监听之后，当SDK与融云服务器的连接状态发生变化时，会回调此方法。
 */
- (void)onRCIMConnectionStatusChanged:(RCConnectionStatus)status
{
    NSLog(@"RCIMConnectionStatusChanged:%@",@(status));
}
- (void)onRCIMReceiveMessage:(RCMessage *)message
                        left:(int)left
{
    NSLog(@"RCIMReceiveMessage:%@",message);
}


#pragma mark - 消息操作

#pragma mark 发送消息
/*!
 发送消息(除图片消息外的所有消息)

 @param messageContent 消息的内容
 @param pushContent    接收方离线时需要显示的远程推送内容

 @discussion 当接收方离线并允许远程推送时，会收到远程推送。
 远程推送中包含两部分内容，一是pushContent，用于显示；二是pushData，用于携带不显示的数据。

 SDK内置的消息类型，如果您将pushContent置为nil，会使用默认的推送格式进行远程推送。
 自定义类型的消息，需要您自己设置pushContent来定义推送内容，否则将不会进行远程推送。

 如果您需要设置发送的pushData，可以使用RCIM的发送消息接口。
 */
- (void)sendMessage:(RCMessageContent *)messageContent
        pushContent:(NSString *)pushContent
{

    NSString *userId   = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
    NSString *userName = [[NSUserDefaults standardUserDefaults] objectForKey:@"userName"];
    NSString *userIcon = [[NSUserDefaults standardUserDefaults] objectForKey:@"userIcon"];

    RCUserInfo *userInfo = [[RCUserInfo alloc] initWithUserId:userId name:userName portrait:userIcon];
    [messageContent setSenderUserInfo:userInfo];
    NSLog(@"sendMessage:%@ ,targetID:%@",userInfo,self.targetId);

    [[RCIM sharedRCIM] sendMessage:ConversationType_PRIVATE targetId:self.targetId content:messageContent pushContent:pushContent pushData:nil success:^(long messageId) {
        NSLog(@"成功发送消息回调：%li   %@  时间:%@",messageId,messageContent,[TimeTool timeStr:[[NSDate date] timeIntervalSince1970]*1000]);
        NSString *content;
        NSString *type;
        if ([messageContent isKindOfClass:[RCTextMessage class]]) {
            RCTextMessage *textMessage = (RCTextMessage *)messageContent;
            NSLog(@"content:%@ 时间:%lf",[textMessage content],[[NSDate date] timeIntervalSinceReferenceDate]*1000);
            content = [textMessage content];
            type = @"text";
        } else if ([messageContent isKindOfClass:[RCVoiceMessage class]]){
            RCVoiceMessage *voiceMessage = (RCVoiceMessage *)messageContent;
            NSLog(@"content:%li 时间:%lf",[voiceMessage duration],[[NSDate date] timeIntervalSinceReferenceDate]*1000);
            content = @"[语音]";
            type = @"voice";
        } else if ([messageContent isKindOfClass:[RCLocationMessage class]]){
            // RCLocationMessage *locationMessage = (RCLocationMessage *)messageContent;
            content = @"[位置]";
            type = @"location";
        }
        //        NSLog(@"RCLocationMessage:%@",content);
        //        dispatch_async(dispatch_get_main_queue(), ^{
        //            [self insertDataBaseMesaageType:type Content:content];
        //        });
    } error:^(RCErrorCode nErrorCode, long messageId) {
        NSLog(@"失败发送回调：%li,messageId:%li",nErrorCode,messageId);
    }];
}

//操控数据库的方法
- (void)insertDataBaseMesaageType:(NSString *)type Content:(NSString *)content
{
    [DataBaseTool insetSendDataType:type SendId:[[NSUserDefaults standardUserDefaults] objectForKey:@"userId"] ReceivedId:self.targetId Content:content SendTime:[NSString stringWithFormat:@"%lf",[[NSDate date] timeIntervalSince1970]*1000] ReceiveTime:nil Flag:@"Y"];
}
/*!
 发送图片消息

 @param imageMessage 消息的内容
 @param pushContent  接收方离线时需要显示的远程推送内容

 @discussion 当接收方离线并允许远程推送时，会收到远程推送。
 远程推送中包含两部分内容，一是pushContent，用于显示；二是pushData，用于携带不显示的数据。

 SDK内置的消息类型，如果您将pushContent置为nil，会使用默认的推送格式进行远程推送。
 自定义类型的消息，需要您自己设置pushContent来定义推送内容，否则将不会进行远程推送。

 如果您需要设置发送的pushData，可以使用RCIM的发送图片消息接口。
 */
- (void)sendImageMessage:(RCImageMessage *)imageMessage
             pushContent:(NSString *)pushContent
{
    NSString *userId   = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
    NSString *userName = [[NSUserDefaults standardUserDefaults] objectForKey:@"userName"];
    NSString *userIcon = [[NSUserDefaults standardUserDefaults] objectForKey:@"userIcon"];

    RCUserInfo *userInfo = [[RCUserInfo alloc] initWithUserId:userId name:userName portrait:userIcon];
    [imageMessage setSenderUserInfo:userInfo];

    [[RCIM sharedRCIM] sendImageMessage:ConversationType_PRIVATE targetId:self.targetId content:imageMessage pushContent:pushContent pushData:nil progress:^(int progress, long messageId) {
        NSLog(@"progress:%i,%li ",progress,messageId);
    } success:^(long messageId) {
        [DataBaseTool insetSendDataType:@"img" SendId:[[NSUserDefaults standardUserDefaults] objectForKey:@"userId"] ReceivedId:self.targetId Content:@"[图片]" SendTime:[NSString stringWithFormat:@"%lf",[[NSDate date] timeIntervalSince1970]*1000] ReceiveTime:nil Flag:@"Y"];
        NSLog(@"success:%li",messageId);
    } error:^(RCErrorCode errorCode, long messageId) {
        NSLog(@"error:%li,%li",errorCode,messageId);
    }];

}

/*!
 重新发送消息

 @param messageContent 消息的内容

 @discussion 发送消息失败，点击小红点时，会将本地存储的原消息实体删除，会回调此接口将消息内容重新发送。
 如果您需要重写此接口，请注意调用super。
 */
- (void)resendMessage:(RCMessageContent *)messageContent
{
    NSLog(@"重新发送消息");
    [super resendMessage:messageContent];
}
#pragma mark - 点击事件回调

/*!
 点击Cell中的消息内容的回调

 @param model 消息Cell的数据模型

 @discussion SDK在此点击事件中，针对SDK中自带的图片、语音、位置等消息有默认的处理，如查看、播放等。
 您在重写此回调时，如果想保留SDK原有的功能，需要注意调用super。
 */

- (void)didTapMessageCell:(RCMessageModel *)model
{
    // NSLog(@"%@",model.content.rawJSONData);
    //  NSString *str = [[NSString alloc] initWithData:model.content.rawJSONData encoding:NSUTF8StringEncoding];
    //     NSLog(@"---%@",model.objectName);
    //    if ([model.objectName isEqualToString:@"RC:ImgMsg"]) {
    //        imageScanView = [[CustomView alloc] initWithFrame:[UIScreen mainScreen].bounds];
    //        [imageScanView setBackgroundColor:[UIColor blackColor]];
    //        [imageScanView setHidden:NO];
    //        NSLog(@"window:%@",imageScanView);

    //  }
    [super didTapMessageCell:model];
}

/*!
 长按Cell中的消息内容的回调

 @param model 消息Cell的数据模型
 @param view  长按区域的View

 @discussion SDK在此长按事件中，会默认展示菜单。
 您在重写此回调时，如果想保留SDK原有的功能，需要注意调用super。
 */

- (void)didLongTouchMessageCell:(RCMessageModel *)model
                         inView:(UIView *)view
{
    [super didLongTouchMessageCell:model inView:view];
}

/*!
 点击Cell中URL的回调

 @param url   点击的URL
 @param model 消息Cell的数据模型
 */
- (void)didTapUrlInMessageCell:(NSString *)url
                         model:(RCMessageModel *)model
{
    [super didTapUrlInMessageCell:url model:model];
}

/*!
 点击Cell中电话号码的回调

 @param phoneNumber 点击的电话号码
 @param model       消息Cell的数据模型
 */
- (void)didTapPhoneNumberInMessageCell:(NSString *)phoneNumber
                                 model:(RCMessageModel *)model
{

    [super didTapPhoneNumberInMessageCell:phoneNumber model:model];
}

/*!
 点击Cell中头像的回调

 @param userId  点击头像对应的用户ID
 */
- (void)didTapCellPortrait:(NSString *)userId
{

}
/*!
 长按Cell中头像的回调

 @param userId  头像对应的用户ID
 */
- (void)didLongPressCellPortrait:(NSString *)userId
{
    //RCChatSessionInputBarControl
    //super.RCChatSessionInputBarControl
}

@end
