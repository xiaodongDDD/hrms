//
//  RCIMChattingViewController.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/13.
//
//

#import "RCIMChattingViewController.h"
#import "ChatCell.h"
#import "ChatInputBarControl.h"
#import "ChattingTableView.h"
#import "EmotionViewController.h"
#import "ImagePickerViewController.h"
#import "PlayerManager.h"
#import "RecoderViewController.h"
#import "UIImage+UIColor.h"
#import "CVDPlugin-Bridging-Header.h"
#import "UIImageView+WebCache.h"
#import "WSShowBigImage.h"
#import "TimeTool.h"
#import "SDBallProgressView.h"
#import "BelongPlaceManager.h"

static CGFloat keyboardheight;
@interface RCIMChattingViewController ()<UITableViewDataSource,UITableViewDelegate,UITableViewTouchDelegate,ChatInputBarControlDelegate,EmotionViewControllerDelegate,ImagePickerViewControllerDelegate,RecoderViewControllerDelegate,UIImagePickerControllerDelegate,UINavigationControllerDelegate>
{
    EmotionViewController *emojiVC;
    ImagePickerViewController *imagePickerVC;
    RecoderViewController *recoderViewController;
    UIWindow *recorderWindow;
    NSString *copyStr;
    CGPoint originalPoint;
    NSMutableArray *phoneNumPlace;
}
/*!
 *  message消息数据源
 */
@property (nonatomic,strong)NSMutableArray *dataSource;
/*!
 *  默认最大消息加载数 10条
 */
@property (nonatomic,assign)NSInteger maxNumberOfMessages;
/*!
 *  当前添加的时间字符串
 */
@property(nonatomic,copy)NSString *currentTimeStr;
/*!
 *  当前界面的消息展示table
 */
@property (nonatomic,strong)UIRefreshControl *refreshControl;
@property (nonatomic,strong)ChattingTableView *ChatTableView;
/*!
 *  当前界面的输入框工具
 */
@property (nonatomic,strong)ChatInputBarControl *inputBarControl;
/*!
 * 输入框下端附带的视图
 */
@property (nonatomic,strong)UIView *attachView;

@end

static NSString *textMessageCellReusableId = @"textMessageCellReusableId";
static NSString *imageMessageCellReusableId = @"imageMessageCellReusableId";
static NSString *voiceMessageCellReusableId = @"voiceMessageCellReusableId";
@implementation RCIMChattingViewController

- (instancetype)initWithNibName:( NSString *)nibNameOrNil bundle:( NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        [self setUI];
    }
    return self;
}

//lazy init
-(NSMutableArray *)dataSource
{
    if (_dataSource==nil) {
        _dataSource = [NSMutableArray array];
    }
    return _dataSource;
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    self.navigationItem.title = self.navtitle;
    [self.navigationController.navigationBar setTitleTextAttributes:@{NSFontAttributeName:[UIFont systemFontOfSize:17.0],NSForegroundColorAttributeName:[UIColor colorWithRed:74/255.0 green:74/255.0 blue:74/255.0 alpha:1.0]}];
    
    self.attachView.frame = CGRectMake(0, screenHeight, screenWidth, 216);
    
    //设置导航下面渐变色
    [self.navigationController.navigationBar setBackgroundImage:[UIImage imageWithColor:[UIColor whiteColor] size:CGSizeMake(screenWidth, 44+22)]
                                                 forBarPosition:UIBarPositionAny
                                                     barMetrics:UIBarMetricsDefault];
    NSArray *colors = @[[UIColor colorWithRed:0/255.0 green:60/255.0 blue:167/255.0 alpha:1.0],[UIColor colorWithRed:47/255.0 green:192/255.0 blue:247/255.0 alpha:1.0]];
    [self.navigationController.navigationBar setShadowImage:[UIImage imageWithColor:colors withSize:CGSizeMake(screenWidth, 1.0)]];
    
    NSArray *array = [[RCIMClient sharedRCIMClient] getLatestMessages:ConversationType_PRIVATE targetId:self.target_id count:10];
    NSLog(@"getLatestMessages:%@ targetId:%@",array,self.target_id);
    //反向遍历
    [array enumerateObjectsWithOptions:NSEnumerationReverse usingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        RCMessage *messsage  = obj;
        MessageFrame *msgFrame = [[MessageFrame alloc] init];
        msgFrame.message = messsage;
        [[RCIMClient sharedRCIMClient] clearMessagesUnreadStatus:ConversationType_PRIVATE targetId:self.target_id];
        [self.dataSource addObject:msgFrame];
        [self.ChatTableView reloadData];
        [self.ChatTableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:self.dataSource.count-1 inSection:0] atScrollPosition:UITableViewScrollPositionBottom animated:YES];
    }];
    [self.inputBarControl.inputField becomeFirstResponder];
    //请求电话的归属地
    for (int idx=0; idx<self.phoneNums.count; idx++) {
        [[BelongPlaceManager sharedInsance] APIRequest:self.phoneNums[idx]];
        [BelongPlaceManager sharedInsance].successCall = ^(NSString *str){
            [phoneNumPlace addObject:str];
        };
    }
}
//重写控制状态栏方法
- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleDefault;
}
- (UIStatusBarAnimation)preferredStatusBarUpdateAnimation
{
    return UIStatusBarAnimationSlide;
}
- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:RCIMLibReceivedMessageNotification object:nil];
}
-(void)viewDidLoad
{
    [super viewDidLoad];
    
    [self.view setBackgroundColor:[UIColor whiteColor]];
    //监听键盘变动
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillShow:) name:UIKeyboardWillShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillDismiss:) name:UIKeyboardWillHideNotification object:nil];
    //设置左右导航按钮
    UIBarButtonItem *left = [[UIBarButtonItem alloc] initWithImage:[[UIImage imageNamed:@"back.png"] imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal] style:UIBarButtonItemStylePlain target:self action:@selector(dismiss)];
    self.navigationItem.leftBarButtonItem = left;//mobile@3x.png
    UIBarButtonItem *right = [[UIBarButtonItem alloc] initWithImage:[[UIImage imageWithCGImage:[UIImage imageNamed:@"mobile@3x.png"].CGImage scale:2.0 orientation:UIImageOrientationUp] imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal] style:UIBarButtonItemStylePlain target:self action:@selector(call)];
    self.navigationItem.rightBarButtonItem = right;
    //所有消息变为已读
    
    //设置通知监听
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didReceivedMessageNotification:) name:RCIMLibReceivedMessageNotification object:nil];
}
- (void)dismiss
{
    [self.inputBarControl.inputField resignFirstResponder];
    [self scrollToBottom];
    [[NSNotificationCenter defaultCenter] postNotificationName:RCIMChattingViewControllerNotification object:nil];
    [self.navigationController dismissViewControllerAnimated:NO completion:nil];
}
- (void)setUI
{   //聊天界面
    _ChatTableView = [[ChattingTableView alloc] initWithFrame:CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, self.view.bounds.size.height-80) style:UITableViewStylePlain];
    _ChatTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    _ChatTableView.delegate = self;
    _ChatTableView.dataSource = self;
    _ChatTableView.touchDelegate = self;
    
    [self.ChatTableView registerClass:[ChatCell class] forCellReuseIdentifier:textMessageCellReusableId];
    [self.ChatTableView registerClass:[ChatCell class] forCellReuseIdentifier:imageMessageCellReusableId];
    [self.ChatTableView registerClass:[ChatCell class] forCellReuseIdentifier:voiceMessageCellReusableId];
    
    [self.view addSubview:_ChatTableView];
    //聊天输入界面
    _inputBarControl = [[ChatInputBarControl alloc] initWithFrame:CGRectMake(0, self.view.bounds.size.height-80-64, screenWidth, 80)];
    _inputBarControl.delegate = self;
    [self.view addSubview:_inputBarControl];
    
    //下面附属视图
    _attachView = [[UIView alloc] initWithFrame:CGRectMake(0, screenHeight, screenWidth, 216)];
    _attachView.hidden = YES;
    //   [_attachView setBackgroundColor:[UIColor grayColor]];
    [self.view addSubview:_attachView];
    
    //每次加载历史消息
    _maxNumberOfMessages = 10;
    //给表头添加一个刷新刷新控件
    _refreshControl = [[UIRefreshControl alloc] initWithFrame:CGRectZero];
    NSAttributedString *title = [[NSAttributedString alloc] initWithString:@"下拉更新数据" attributes:@{NSForegroundColorAttributeName:[UIColor grayColor]}];
    [_refreshControl setAttributedTitle:title];
    [_refreshControl setTintColor:[UIColor grayColor]];
    [_refreshControl addTarget:self action:@selector(updateHistoryMessage:) forControlEvents:UIControlEventValueChanged];
    [self.ChatTableView addSubview:_refreshControl];
    
    phoneNumPlace = [NSMutableArray array];
    
}
//刷新历史消息
- (void)updateHistoryMessage:(UIRefreshControl *)control
{
    MessageFrame *messageFrame  = _dataSource[0];
    RCMessage * oldestMessage = messageFrame.message;
    NSLog(@"targetId:%lu,",oldestMessage.messageId);
    //在这里请求数据 加载里历时消息
    NSArray *historyArray = [[RCIMClient sharedRCIMClient] getHistoryMessages:ConversationType_PRIVATE targetId:oldestMessage.targetId oldestMessageId:oldestMessage.messageId count:10];
    
    [historyArray enumerateObjectsWithOptions:NSEnumerationConcurrent usingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        MessageFrame *msgFrame = [[MessageFrame alloc] init];
        msgFrame.message = obj;
        [self.dataSource insertObject:msgFrame atIndex:0];
    }];
    
    [control endRefreshing];
    [self.ChatTableView reloadData];
    if (historyArray.count) {
        [self.ChatTableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:historyArray.count-1 inSection:0] atScrollPosition:UITableViewScrollPositionTop animated:NO];
    }
    
    NSLog(@"updateHistoryMessage");
}

#pragma mark - UITableViewDataSource
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return _dataSource.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    ChatCell *cell;
    MessageFrame *messageFrame = _dataSource[indexPath.row];
    
    if ([messageFrame.message.content isKindOfClass:[RCTextMessage class]]) {
        //从缓冲池查找是否有可用的表行对象
        cell = [tableView dequeueReusableCellWithIdentifier:textMessageCellReusableId];
    }else if ([messageFrame.message.content isKindOfClass:[RCVoiceMessage class]]){
        cell = [tableView dequeueReusableCellWithIdentifier:voiceMessageCellReusableId];
    }else{
        cell = [tableView dequeueReusableCellWithIdentifier:imageMessageCellReusableId];
    }
    
    NSLog(@"cellForRowAtIndexPath:%li",indexPath.row);
    
    [cell setMsgFrame:messageFrame];
    
    NSString *userIcon = [[NSUserDefaults standardUserDefaults] objectForKey:@"userIcon"];
    NSLog(@"userIcon:%@",userIcon);
    if (messageFrame.message.messageDirection==MessageDirection_SEND) {
        [cell.iconImageView sd_setImageWithURL:[NSURL URLWithString:userIcon] placeholderImage:[UIImage imageNamed:@"default_portrait_msg@2x.png"] options:SDWebImageProgressiveDownload];
    }else{
        [cell.iconImageView sd_setImageWithURL:[NSURL URLWithString:self.friendIcon] placeholderImage:[UIImage imageNamed:@"default_portrait@2x.png"] options:SDWebImageProgressiveDownload];
    }
    
    //cell点击，长按手势相应
    __weak ChatCell *block_cell = cell;
    cell.messageLabel.textTapAction = ^(UIView *containerView, NSAttributedString *text, NSRange range, CGRect rect){
        [self didTapAction:block_cell];
    };
    cell.messageLabel.textLongPressAction = ^(UIView *containerView, NSAttributedString *text, NSRange range, CGRect rect){
        [self didLongPressAction:block_cell];
    };
    
    //  [cell setBackgroundColor:[UIColor lightGrayColor]];
    return cell;
}

#pragma mark - UITableViewDelegate
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
{
    return [_dataSource[indexPath.row] heightForCell];
}
- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    
}
//点击电话调用的方法
- (void)call
{
    //弹出actionSheet 选择电话
    UIAlertController *alertVC = [UIAlertController alertControllerWithTitle:@"联系人电话列表" message:nil preferredStyle:UIAlertControllerStyleActionSheet];
    for(int idx=0;idx<self.phoneNums.count;idx++){
        NSString *title = phoneNumPlace[idx];
        [alertVC addAction:[UIAlertAction actionWithTitle:title style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            NSString *telephone = [title componentsSeparatedByString:@"("][0];
            [self callToSomeOne:telephone];
            NSLog(@"打电话给:%@",telephone);
        }]];
        
    }
    [alertVC addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:nil]];
    [self presentViewController:alertVC animated:YES completion:nil];
}

- (void)callToSomeOne:(NSString *)phoneNumber
{
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:[NSString stringWithFormat:@"tel://%@",phoneNumber]]];
}
#pragma mark - ChatInputBarControlDelegate
/*!
 * 图库按钮点击回调
 */
- (void)touchPhotoLibrary:(UIButton *)sender
{
    [self removeAllOtherView:RCKeyboardShowImageCollectionType];
    [self.inputBarControl.inputField resignFirstResponder];
    if (sender.selected) {
        if (imagePickerVC==nil) {
            self.attachView.hidden = NO;
            imagePickerVC = [[ImagePickerViewController alloc] init];
            imagePickerVC.delegate = self;
            imagePickerVC.sender = self;
            imagePickerVC .view.frame = CGRectMake(0, 0, screenWidth, 216);
            [self.attachView addSubview:imagePickerVC.view];
            NSLog(@"f非空");
        }
        [UIView animateWithDuration:0.25 animations:^{
            [self scrollToTop:RCKeyboardShowImageCollectionType];
        }];
    } else{
        [UIView animateWithDuration:0.25 animations:^{
            [self scrollToBottom];
        } completion:^(BOOL finished) {
            self.attachView .hidden = YES;
            [imagePickerVC.view removeFromSuperview];
            imagePickerVC = nil;
            NSLog(@"隐藏消失");
        }];
    }
    NSLog(@"图库按钮点击回调");
}
/*!
 * 相机按钮点击回调
 */
- (void)touchCamera:(UIButton *)sender
{
    [self.inputBarControl.inputField resignFirstResponder];
    [UIView animateWithDuration:0.25 animations:^{
    } completion:^(BOOL finished) {
        [self scrollToBottom];
    }];
    UIImagePickerController *imagePicker = [[UIImagePickerController alloc] init];
    imagePicker.delegate = self;
    //相机是否可用
    if([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera])
    {
        [imagePicker setAllowsEditing:YES];
        [imagePicker setSourceType:UIImagePickerControllerSourceTypeCamera];
        [self presentViewController:imagePicker animated:YES completion:nil];
    }
    NSLog(@"相机按钮点击回调");
}

- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingImage:(UIImage *)image editingInfo:(nullable NSDictionary<NSString *,id> *)editingInfo
{
    
    [self dismissViewControllerAnimated:YES completion:^{
        RCImageMessage *imageMessage = [RCImageMessage messageWithImage:editingInfo[@"UIImagePickerControllerOriginalImage"]];
        dispatch_async(dispatch_get_main_queue(), ^{
            UIImageWriteToSavedPhotosAlbum(editingInfo[@"UIImagePickerControllerOriginalImage"], self, nil, NULL);
        });
        [self clickedSendImageMessage:@[imageMessage]];
    }];
    
}
- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker
{
    [self scrollToBottom];
    [self dismissViewControllerAnimated:YES completion:nil];
}
/*!
 * emoji表情按钮点击回调
 */
- (void)touchEmojiView:(UIButton *)sender
{
    [self removeAllOtherView:RCKeyboardShowEmotionType];
    [self.inputBarControl.inputField resignFirstResponder];
    if (sender.selected) {
        if (emojiVC==nil) {
            self.attachView.hidden = NO;
            emojiVC = [[EmotionViewController alloc] init];
            emojiVC.delegate = self;
            emojiVC.view.frame = CGRectMake(0, 0, screenWidth, 216);
            [self.attachView addSubview:emojiVC.view];
        }
        [UIView animateWithDuration:0.25 animations:^{
            [self scrollToTop:RCKeyboardShowEmotionType];
        }];
    } else{
        [UIView animateWithDuration:0.25 animations:^{
            [self scrollToBottom];
        } completion:^(BOOL finished) {
            self.attachView .hidden = YES;
            [emojiVC.view removeFromSuperview];
            emojiVC = nil;
        }];
    }
    
    NSLog(@"表情按钮点击回调");
}
/*!
 * 语音按钮点击回调
 */
- (void)touchRecoder:(UIButton *)sender
{
    [self.inputBarControl.inputField resignFirstResponder];
    [self removeAllOtherView:RCKeyboardShowRecorderType];
    if (sender.selected) {
        if (recoderViewController==nil) {
            self.attachView.hidden = NO;
            recoderViewController = [[RecoderViewController alloc] init];
            recoderViewController.delegate = self;
            recoderViewController.view.frame = CGRectMake(0, 0, screenWidth, 216);
            [self.attachView addSubview:recoderViewController.view];
        }
        [UIView animateWithDuration:0.25 animations:^{
            [self scrollToTop:RCKeyboardShowRecorderType];
        }];
    } else{
        [UIView animateWithDuration:0.25 animations:^{
            [self scrollToBottom];
        } completion:^(BOOL finished) {
            self.attachView .hidden = YES;
            [recoderViewController.view removeFromSuperview];
            recoderViewController = nil;
        }];
    }
    
    NSLog(@"语音按钮点击回调");
}


#pragma mark - 发送除text消息之外的接口（voice,text,location）
- (void)touchSendBtn:(id)object
{
    MessageFrame *messageFrame = [[MessageFrame alloc] init];
    long message_id = [[NSDate date] timeIntervalSince1970];//把时间戳记为消息id
    RCTextMessage *textMessage = [[RCTextMessage alloc] init];
    NSString *user_id = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
    NSString *user_name = [[NSUserDefaults standardUserDefaults] objectForKey:@"userName"];
    NSString *user_portrait = [[NSUserDefaults standardUserDefaults] objectForKey:@"userIcon"];
    RCUserInfo *userInfo = [[RCUserInfo alloc] initWithUserId:user_id name:user_name portrait:user_portrait];
    [textMessage setSenderUserInfo:userInfo];
    [textMessage setContent:object ];
    messageFrame.message = [[RCMessage alloc] initWithType:ConversationType_PRIVATE targetId:self.target_id direction:MessageDirection_SEND messageId:message_id content:textMessage];
    if (self.phoneNums.count) {
        NSString *telphoneStr = @"";
        for (int i=0;i<self.phoneNums.count;i++) {
            telphoneStr = [telphoneStr stringByAppendingString:[NSString stringWithFormat:@"%@|",self.phoneNums[i]]];
        }
        [textMessage setExtra:telphoneStr];
    }
    NSLog(@"setExtra:%@",messageFrame.message.extra);
    [self.dataSource addObject:messageFrame];
    //发送消息
    [[RCIMClient sharedRCIMClient] sendMessage:messageFrame.message.conversationType targetId:messageFrame.message.targetId content:messageFrame.message.content pushContent:nil pushData:nil success:^(long messageId) {
        messageFrame.message.messageId = messageId;
        NSLog(@"消息发送成功回调：%lu , targetId:%@ , messageFrameID:%lu",messageId,self.target_id,messageFrame.message.messageId);
    } error:^(RCErrorCode nErrorCode, long messageId) {
        NSLog(@"消息发送失败回调,错误码:%li 消息Id:%lu",nErrorCode,messageId);
    }];
    [self.ChatTableView reloadData];
    [self.ChatTableView reloadRowsAtIndexPaths:@[[NSIndexPath indexPathForRow:_dataSource.count-1 inSection:0]] withRowAnimation:UITableViewRowAnimationTop];
    [self.ChatTableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:_dataSource.count-1 inSection:0] atScrollPosition:UITableViewScrollPositionBottom animated:YES];
    self.inputBarControl.inputField.text =@"";
}

#pragma mark - 发送图片消息接口
-(void)clickedSendImageMessage:(NSArray *)array
{
    MessageFrame *messageFrame ;
    long message_id = [[NSDate date] timeIntervalSince1970];//把时间戳记为消息id
    for (int i=0; i<array.count; i++) {
        RCImageMessage *imageMessage = array[i];
        NSString *user_id = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
        NSString *user_name = [[NSUserDefaults standardUserDefaults] objectForKey:@"userName"];
        NSString *user_portrait = [[NSUserDefaults standardUserDefaults] objectForKey:@"userIcon"];
        RCUserInfo *userInfo = [[RCUserInfo alloc] initWithUserId:user_id name:user_name portrait:user_portrait];
        [imageMessage setSenderUserInfo:userInfo];
        messageFrame  = [[MessageFrame alloc] init];
        messageFrame.message = [[RCMessage alloc] initWithType:ConversationType_PRIVATE targetId:self.target_id direction:MessageDirection_SEND messageId:message_id content:imageMessage];
        if (self.phoneNums.count) {
            NSString *telphoneStr = @"";
            for (int i=0;i<self.phoneNums.count;i++) {
                telphoneStr = [telphoneStr stringByAppendingString:[NSString stringWithFormat:@"%@|",self.phoneNums[i]]];
            }
            [imageMessage setExtra:telphoneStr];
        }
        [self.dataSource addObject:messageFrame];
        dispatch_async(dispatch_get_main_queue(), ^{
            NSInteger index = self.dataSource.count;
            [self sendImage:ConversationType_PRIVATE Content:imageMessage targetId:messageFrame.message.targetId index:index-1 MessageFrame:messageFrame];
        });
    }
    [self.ChatTableView insertRowsAtIndexPaths:@[[NSIndexPath indexPathForRow:_dataSource.count-1 inSection:0]] withRowAnimation:UITableViewRowAnimationTop];
    [self.ChatTableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:_dataSource.count-1 inSection:0] atScrollPosition:UITableViewScrollPositionBottom animated:YES];
    NSLog(@"发送图片消息接口:%@",array);
}

- (void)sendImage:(RCConversationType)type Content:(RCImageMessage *)content targetId:(NSString *)targetId index:(NSInteger)index MessageFrame:(MessageFrame *)msgFrame
{
    ChatCell *cell = [self.ChatTableView cellForRowAtIndexPath:[NSIndexPath indexPathForRow:index inSection:0]];
    SDBallProgressView *ball = [self setProgress:cell.messageLabel];
    [[RCIMClient sharedRCIMClient] sendImageMessage:type targetId:targetId content:content pushContent:nil pushData:nil progress:^(int progress, long messageId) {
        ball.progress = progress*0.01;
        NSLog(@"更新进度：%i",progress);
    } success:^(long messageId) {
        //更新一下本地的messageId号
        msgFrame.message.messageId = messageId;
        NSLog(@"上传成功啦");
    } error:^(RCErrorCode errorCode, long messageId) {
        NSLog(@"上传失败:%li",errorCode);
    }];
}

- (SDBallProgressView *)setProgress:(UIView *)superView
{
    NSLog(@"superView：%@",superView);
    SDBallProgressView *ball;
    ball = [SDBallProgressView progressView];
    ball.frame = superView.bounds;
    [superView addSubview:ball];
    return ball;
}

-(void)longPressSendImageMessage:(RCImageMessage *)imageMessage WithView:(UIView *)aView Cell:(ImageCell *)cell
{
    __block ImageCell *imageCell = cell;
    __block UIView *snap = aView;
    MessageFrame *messageFrame = nil;
    long message_id = [[NSDate date] timeIntervalSince1970];//把时间戳记为消息id
    NSString *user_id = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
    NSString *user_name = [[NSUserDefaults standardUserDefaults] objectForKey:@"userName"];
    NSString *user_portrait = [[NSUserDefaults standardUserDefaults] objectForKey:@"userIcon"];
    RCUserInfo *userInfo = [[RCUserInfo alloc] initWithUserId:user_id name:user_name portrait:user_portrait];
    [imageMessage setSenderUserInfo:userInfo];
    messageFrame  = [[MessageFrame alloc] init];
    messageFrame.message = [[RCMessage alloc] initWithType:ConversationType_PRIVATE targetId:self.target_id direction:MessageDirection_SEND messageId:message_id content:imageMessage];
    [self.dataSource addObject:messageFrame];
    dispatch_async(dispatch_get_main_queue(), ^{
        NSInteger index = self.dataSource.count;
        [self sendImage:ConversationType_PRIVATE Content:imageMessage targetId:messageFrame.message.targetId index:index-1 MessageFrame:messageFrame];
    });
    [self.ChatTableView insertRowsAtIndexPaths:@[[NSIndexPath indexPathForRow:self.dataSource.count-1 inSection:0]] withRowAnimation:UITableViewRowAnimationTop];
    [self.ChatTableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:self.dataSource.count-1 inSection:0] atScrollPosition:UITableViewScrollPositionBottom animated:YES];
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2f * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [UIView animateWithDuration:0.2f animations:^{
            //获取aview的坐标到最后一个cell的位置
            ChatCell *chatCell = [self.ChatTableView cellForRowAtIndexPath:[NSIndexPath indexPathForRow:self.dataSource.count-1 inSection:0]];
            CGPoint convertCellCenter = [self.attachView convertPoint:chatCell.center toView:self.attachView];
            convertCellCenter = CGPointMake(convertCellCenter.x, convertCellCenter.y-self.ChatTableView.contentOffset.y);
            CGFloat YChange = convertCellCenter.y - self.attachView.frame.origin.y -snap.bounds.size.height/2.0;
            [snap setFrame:CGRectMake(convertCellCenter.x, YChange, chatCell.messageLabel.bounds.size.width, chatCell.messageLabel.bounds.size.height)];
        } completion:^(BOOL finished) {
            [snap removeFromSuperview];
            snap = nil;
            imageCell.imageView.hidden = NO;
            imageCell.imageView.alpha = 0.0;
            imageCell.imageView.transform = CGAffineTransformMakeScale(0, 0);
            [UIView animateWithDuration:0.25f animations:^{
                imageCell.imageView.transform = CGAffineTransformMakeScale(1.0, 1.0);
                imageCell.imageView.alpha = 1.0;
            }];
        }];
    });
    
}

- (void)openImagePickerViewController
{
    [self scrollToBottom];
}

- (void)finishedSelectImage:(UIImage *)image
{
    RCImageMessage *imageMessage = [RCImageMessage messageWithImage:image];
    
    [self clickedSendImageMessage:@[imageMessage]];
}
#pragma mark - 键盘监听
- (void)keyboardWillShow:(NSNotification *)notification
{
    keyboardheight = [notification.userInfo[@"UIKeyboardBoundsUserInfoKey"] CGRectValue].size.height;
    
    [UIView animateWithDuration:[notification.userInfo[@"UIKeyboardAnimationDurationUserInfoKey"] doubleValue] animations:^{
        //5s 252 6p271  6s258
        [self.inputBarControl setFrame:CGRectMake(0, self.view.bounds.size.height-keyboardheight-80, screenWidth, 80)];
        [self.ChatTableView setFrame:CGRectMake(0, 0, screenWidth, self.view.bounds.size.height-keyboardheight-80)];
        //   NSLog(@"notification:%@",notification.userInfo);
        if (_dataSource.count) {
            [self.ChatTableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:_dataSource.count-1 inSection:0] atScrollPosition:UITableViewScrollPositionBottom animated:NO];
        }
    }];
    
}
- (void)keyboardWillDismiss:(NSNotification *)notification
{
    CGFloat YChange = [notification.userInfo[@"UIKeyboardCenterEndUserInfoKey"] CGPointValue].y - [notification.userInfo[@"UIKeyboardCenterBeginUserInfoKey"] CGPointValue].y;
    CGFloat duration = [notification.userInfo[@"UIKeyboardAnimationDurationUserInfoKey"] doubleValue];
    if (RCKeyboardShowDefaultType) {
        [UIView animateWithDuration:duration animations:^{
            [self.inputBarControl setFrame:CGRectMake(0, self.view.bounds.size.height-80, screenWidth, 80)];
            [self.ChatTableView setFrame:CGRectMake(0, 0, screenWidth, self.view.bounds.size.height-80)];
        }];
    }
    // NSLog(@"YChange:%f ,%f",YChange,duration);//216
}

- (void)removeAllOtherView:(RCKeyboardShowType)type
{
    if (type==RCKeyboardShowDefaultType) {
        imagePickerVC = nil;
        [imagePickerVC.view removeFromSuperview];
        recoderViewController = nil;
        [recoderViewController.view removeFromSuperview];
        emojiVC = nil;
        [emojiVC.view removeFromSuperview];
        self.inputBarControl.emojiBtn.selected = NO;
        self.inputBarControl.recorderBtn.selected = NO;
        self.inputBarControl.imagePickerBtn.selected = NO;
        
    }else if (type==RCKeyboardShowEmotionType){
        imagePickerVC = nil;
        [imagePickerVC.view removeFromSuperview];
        recoderViewController = nil;
        [recoderViewController.view removeFromSuperview];
        self.inputBarControl.recorderBtn.selected = NO;
        self.inputBarControl.imagePickerBtn.selected = NO;
    }else if (type==RCKeyboardShowImageCollectionType){
        emojiVC = nil;
        [emojiVC.view removeFromSuperview];
        self.inputBarControl.emojiBtn.selected = NO;
        recoderViewController = nil;
        [recoderViewController.view removeFromSuperview];
        self.inputBarControl.recorderBtn.selected = NO;
    }else if (type==RCKeyboardShowRecorderType){
        imagePickerVC = nil;
        self.inputBarControl.imagePickerBtn.selected = NO;
        [imagePickerVC.view removeFromSuperview];
        emojiVC = nil;
        self.inputBarControl.emojiBtn.selected = NO;
        [emojiVC.view removeFromSuperview];
    }else if(type==RCKeyboardShowMoreType){
        imagePickerVC = nil;
        self.inputBarControl.imagePickerBtn.selected = NO;
        [imagePickerVC.view removeFromSuperview];
        emojiVC = nil;
        self.inputBarControl.emojiBtn.selected = NO;
        [emojiVC.view removeFromSuperview];
        recoderViewController = nil;
        [recoderViewController.view removeFromSuperview];
        self.inputBarControl.recorderBtn.selected = NO;
    }
}

- (void)scrollToBottom
{
    [self.ChatTableView setFrame:CGRectMake(0, 0, screenWidth, self.view.bounds.size.height-80)];
    [self.inputBarControl setFrame:CGRectMake(0, self.view.bounds.size.height-80, screenWidth, 80)];
    self.attachView.frame = CGRectMake(0, self.view.bounds.size.height-216, screenWidth, 216);
    self.inputBarControl.emojiBtn.selected = NO;
    self.inputBarControl.imagePickerBtn.selected = NO;
    self.inputBarControl.recorderBtn.selected = NO;
    self.inputBarControl.cameraBtn.selected  = NO;
    self.attachView.frame = CGRectMake(0, screenHeight, screenWidth, 216);
}
- (void)scrollToTop:(RCKeyboardShowType)type
{
    if (type==RCKeyboardShowDefaultType) {
        [self.ChatTableView setFrame:CGRectMake(0, 0, screenWidth, self.view.bounds.size.height-keyboardheight-80)];
        [self.inputBarControl setFrame:CGRectMake(0, self.view.bounds.size.height-80-keyboardheight, screenWidth, 80)];
    }else {
        [self.ChatTableView setFrame:CGRectMake(0, 0, screenWidth, self.view.bounds.size.height-216-80)];
        [self.inputBarControl setFrame:CGRectMake(0, self.view.bounds.size.height-80-216, screenWidth, 80)];
        self.attachView.frame = CGRectMake(0, self.view.bounds.size.height-216, screenWidth, 216);
    }
}
#pragma mark -自定义tableViewTouchDelegate
-(void)touchTableView
{
    [UIView animateWithDuration:0.25 animations:^{
        [self.inputBarControl.inputField resignFirstResponder];
        [self scrollToBottom];
    }];
    NSLog(@"tableView被点击");
}

#pragma mark - UIScrollDelegate
-(void)scrollViewWillBeginDragging:(UIScrollView *)scrollView
{
    [self.inputBarControl.inputField resignFirstResponder];
    [UIView animateWithDuration:0.25 animations:^{
        [self scrollToBottom];
    }];
}
#pragma mark- EmotionViewControllelrDelegate
-(void)emotionViewDidSelect:(UICollectionView *)collectionView Text:(NSString *)exchangeText
{
    self.inputBarControl.inputField.text = [self.inputBarControl.inputField.text stringByAppendingString:exchangeText];
}
- (void)emotionViewDidDelete:(UICollectionView *)collerctionView
{
    NSMutableString *mutableStr = (NSMutableString *)self.inputBarControl.inputField.text;
    if (self.inputBarControl.inputField.text.length>=2) {
        self.inputBarControl.inputField.text = [mutableStr stringByReplacingCharactersInRange:NSMakeRange(self.inputBarControl.inputField.text.length-2, 2) withString:@""];
    }
}

- (void)emotionViewDidTapSend:(UIButton *)sender
{
    if ([self.inputBarControl.inputField hasText]) {
        [self touchSendBtn:self.inputBarControl.inputField.text];
        NSLog(@"输入框内容:%@",self.inputBarControl.inputField.attributedText);
    }
}

-(void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self ];
}

#pragma mark -RecorderViewControllerDelegate录音代理
-(void)startRecordering
{
    recorderWindow = [[UIWindow alloc] initWithFrame:CGRectMake(0, 0, screenWidth, screenHeight-216)];
    recorderWindow.hidden = NO;
    recorderWindow.backgroundColor = [UIColor colorWithWhite:0.6 alpha:0.4];
}
-(void)stopRecordering
{
    recorderWindow.hidden = YES;
    recorderWindow = nil;
}
#pragma mark -发送语音
-(void)finishedRecordering:(NSString *)fileName timeInterval:(NSTimeInterval)timeInterVal
{
    //发送语音消息
    if ([[NSFileManager defaultManager] fileExistsAtPath:fileName]) {
        MessageFrame *messageFrame = [[MessageFrame alloc] init];
        long message_id = [[NSDate date] timeIntervalSince1970];//把时间戳记为消息id
        NSData *voiceData = [NSData dataWithContentsOfFile:fileName];
        
        RCVoiceMessage *voiceMessage = [RCVoiceMessage messageWithAudio:voiceData duration:timeInterVal];
        
        NSString *user_id = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
        NSString *user_name = [[NSUserDefaults standardUserDefaults] objectForKey:@"userName"];
        NSString *user_portrait = [[NSUserDefaults standardUserDefaults] objectForKey:@"userIcon"];
        RCUserInfo *userInfo = [[RCUserInfo alloc] initWithUserId:user_id name:user_name portrait:user_portrait];
        [voiceMessage setSenderUserInfo:userInfo];
        messageFrame.message = [[RCMessage alloc] initWithType:ConversationType_PRIVATE targetId:self.target_id direction:MessageDirection_SEND messageId:message_id content:voiceMessage];
        if (self.phoneNums.count) {
            NSString *telphoneStr = @"";
            for (int i=0;i<self.phoneNums.count;i++) {
                telphoneStr = [telphoneStr stringByAppendingString:[NSString stringWithFormat:@"%@|",self.phoneNums[i]]];
            }
            [voiceMessage setExtra:telphoneStr];
        }
        [self.dataSource addObject:messageFrame];
        NSLog(@"voiceMessage:%@  wav:%@  duration:%lu",voiceMessage,fileName,voiceMessage.duration);
        //发送语音
        [[RCIMClient sharedRCIMClient] sendMessage:messageFrame.message.conversationType targetId:messageFrame.message.targetId content:voiceMessage pushContent:nil pushData:nil success:^(long messageId) {
            messageFrame.message.messageId = messageId;
            NSLog(@"语音消息发送成功回调：%lu",messageId);
        } error:^(RCErrorCode nErrorCode, long messageId) {
            NSLog(@"语音消息发送失败回调,错误码:%li 消息Id:%li",nErrorCode,messageId);
        }];
        
        [self.ChatTableView reloadData];
        [self.ChatTableView reloadRowsAtIndexPaths:@[[NSIndexPath indexPathForRow:_dataSource.count-1 inSection:0]] withRowAnimation:UITableViewRowAnimationTop];
        [self.ChatTableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:_dataSource.count-1 inSection:0] atScrollPosition:UITableViewScrollPositionBottom animated:YES];
    }
}

//录音失败 时间太短
- (void)failedRecorderingWithString:(NSString *)failureString
{
    [self showErrorDescription:failureString];
}
- (void)showErrorDescription:(NSString *)failureString
{
    recorderWindow = [UIApplication sharedApplication].keyWindow;
    UIView *alerView = [[UIView alloc] initWithFrame:CGRectMake((screenWidth-100)/2.0, (screenHeight-100)/2.0, 100, 100)];
    [alerView.layer setCornerRadius:20.0];
    UIImageView *clockImageView = [[UIImageView alloc] init];
    clockImageView.frame = CGRectMake((alerView.bounds.size.width-60)/2.0, 10, 60, 60);
    clockImageView.image = [UIImage imageNamed:@"group_reward_transcode_fail.png"];
    [alerView addSubview:clockImageView];
    
    UILabel *text_lab = [[UILabel alloc] init];
    [text_lab setTextAlignment:NSTextAlignmentCenter];
    text_lab.frame = CGRectMake(0, CGRectGetMaxY(clockImageView.frame), 100, 20);
    text_lab.textColor = [UIColor whiteColor];
    [text_lab setFont:[UIFont systemFontOfSize:15.0]];
    text_lab.text = failureString;//
    [alerView addSubview:text_lab];
    
    alerView.backgroundColor = [UIColor colorWithWhite:0.2 alpha:0.8];
    [recorderWindow addSubview:alerView];
    [UIView animateWithDuration:1.2f animations:^{
        alerView.alpha = 0;
    } completion:^(BOOL finished) {
        [alerView removeFromSuperview];
        recorderWindow = nil;
    }];
}

#pragma mark -cell点击反馈事件
//单击轻点触发
- (void)didTapAction:(ChatCell *)cell
{
    if ([cell.msgFrame.message.content isKindOfClass:[RCTextMessage class]]) {
        RCTextMessage *textMessage= (RCTextMessage *)cell.msgFrame.message.content;
        NSLog(@"点了文字:%@",textMessage.content);
    }else if ([cell.msgFrame.message.content isKindOfClass:[RCVoiceMessage class]]){
        RCVoiceMessage *voiceMessage = (RCVoiceMessage *)cell.msgFrame.message.content;
        [[PlayerManager sharedManager] startPlayData:voiceMessage.wavAudioData];
        
        NSLog(@"开始播放语音");
    }else if ([cell.msgFrame.message.content isKindOfClass:[RCImageMessage class]]){
        [self.inputBarControl.inputField resignFirstResponder];
        [self scrollToBottom];
        RCImageMessage *imageMessage = (RCImageMessage *)cell.msgFrame.message.content;
        UIImageView *imageView;
        imageView = [[UIImageView alloc] initWithImage:imageMessage.thumbnailImage];
        CGRect rect = [cell.messageLabel convertRect:cell.messageLabel.frame toView:self.view];
        imageView.frame = rect;
        NSLog(@"imageMessage.imageUrl:%@",imageMessage.imageUrl);
        [[WSShowBigImage sharedInstance] showBigImage:imageView Url:imageMessage.imageUrl];
    }
    NSLog(@"didTapAction");
}

//长按触发
- (void)didLongPressAction:(ChatCell *)cell
{
    UIMenuItem *copyLink = [[UIMenuItem alloc] initWithTitle:@"复制" action:@selector(copyAction:)];
    UIMenuItem *pasteLink = [[UIMenuItem alloc] initWithTitle:@"粘贴" action:@selector(pasteAction:)];
    UIMenuItem *deleteLink = [[UIMenuItem alloc] initWithTitle:@"删除" action:@selector(deleteAction:)];
    [[UIMenuController sharedMenuController] setMenuItems:@[copyLink,pasteLink,deleteLink]];
    [[UIMenuController sharedMenuController] setTargetRect:cell.messageLabel.frame inView:cell.messageLabel.superview];
    [[UIMenuController sharedMenuController] setMenuVisible:YES animated:YES];
    [[UIMenuController sharedMenuController] update];
    if ([cell.msgFrame.message.content isKindOfClass:[RCTextMessage class]]) {
        RCTextMessage *textMessage = (RCTextMessage *)cell.msgFrame.message.content;
        copyStr = textMessage.content;
    }
    NSLog(@"didLongPressAction");
}
/**
 * 说明控制器可以成为第一响应者
 */
- (BOOL)canBecomeFirstResponder
{
    return YES;
}
/**
 * 通过这个方法告诉UIMenuController它内部应该显示什么内容
 * 返回YES，就代表支持action这个操作
 */
- (BOOL)canPerformAction:(SEL)action withSender:(id)sender
{
    if (action == @selector(copyAction:)
        || action == @selector(deleteAction:)
        || action == @selector(pasteAction:)) {
        return YES;
    }
    return NO; // 除了上面的操作，都不支持
}
//复制
- (void)copyAction:(UIMenuController *)menuController
{
    //需要提供一个唯一的名字，一般使用倒写的域名：com.mycompany.myapp.pboard
    //后面的参数表示，如果不存在，是否创建一个
    UIPasteboard *pasteboard = [UIPasteboard pasteboardWithName:@"com.hand.handMobile.pboard" create:YES];
    pasteboard.string = copyStr;
}
//粘贴
- (void)pasteAction:(UIMenuController *)menuController
{
    UIPasteboard *pasteboard = [UIPasteboard pasteboardWithName:@"com.hand.handMobile.pboard" create:YES];
    self.inputBarControl.inputField.text = [self.inputBarControl.inputField.text stringByAppendingString:pasteboard.string];
    NSLog(@"pasteAction");
}
//删除
- (void)deleteAction:(UIMenuController *)menuController
{
    NSLog(@"deleteAction");
}

#pragma mark - didReceivedMessageNotification
- (void)didReceivedMessageNotification:(NSNotification *)notification
{
    RCMessage *message = notification.object;
    //主要判断条件
    if (message.senderUserId.integerValue==self.target_id.integerValue) {
        MessageFrame *messageFrame = [[MessageFrame alloc] init];
         NSLog(@"messageId:%lu ++status:%lu",message.messageId,message.receivedStatus);
        [[RCIMClient sharedRCIMClient] setMessageReceivedStatus:message.messageId receivedStatus:ReceivedStatus_READ];
        NSLog(@"messageId:%lu --status:%lu",message.messageId,message.receivedStatus);
        [messageFrame setMessage:message];
        [self.dataSource addObject:messageFrame];
        [self.ChatTableView reloadData];

        [self.ChatTableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:self.dataSource.count-1 inSection:0] atScrollPosition:UITableViewScrollPositionBottom animated:YES];
    }
    NSLog(@"didReceivedMessageNotification:%@",message);
}

@end
