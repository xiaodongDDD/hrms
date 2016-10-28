//
//  RCIMGroupChatViewController.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/17.
//
//

#import "RCIMGroupChatViewController.h"
#import "RCIMDiscussionCell.h"
#import "DiscussionInputBar.h"
#import "ChattingTableView.h"
#import "EmotionViewController.h"
#import "PlayerManager.h"
#import "RecoderViewController.h"
#import "RCIMDiscussionMultiTypeViewController.h"
#import "UIImage+UIColor.h"
#import "CVDPlugin-Bridging-Header.h"
#import "UIImageView+WebCache.h"
#import "WSShowBigImage.h"
#import "TimeTool.h"
#import "SDBallProgressView.h"
#import "BelongPlaceManager.h"
#import "RCIMDiscussionSettingViewController.h"
#import "DataBaseTool.h"
#import <RongIMKit/RongIMKit.h>
#import <AudioToolBox/AudioToolbox.h>
#import <RongCallKit/RongCallKit.h>

#import "CustomRCCall.h"

#import "CustomSelectMemberController.h"
#import "ToastUtils.h"

static CGFloat keyboardheight;

typedef NS_ENUM(NSInteger, RCKeyboardShowType) {
    RCKeyboardShowDefaultType=0,
    RCKeyboardShowEmotionType,
    RCKeyboardShowImageCollectionType,
    RCKeyboardShowRecorderType,
    RCKeyboardShowMoreType
};

@interface RCIMGroupChatViewController ()<UITableViewDataSource,UITableViewDelegate,UITableViewTouchDelegate,ChatInputBarControlDelegate,EmotionViewControllerDelegate,RecoderViewControllerDelegate,RCIMDiscussionSettingViewControllerDelegate,UINavigationControllerDelegate,UIImagePickerControllerDelegate,RCIMDiscussionMultiTypeViewControllerProtocol,PlayerManagerProtocol>
{
    EmotionViewController *emojiVC;
    RecoderViewController *recoderViewController;
    RCIMDiscussionMultiTypeViewController *multiTypeBoardVC;
    UIWindow *recorderWindow;
    NSString *copyStr;
    NSMutableArray *userInfos;
    NSOperationQueue *mainQueue;
    UIImageView *voiceImageView;
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
 *  当前界面的消息展示刷新控件
 */
@property (nonatomic,strong)UIRefreshControl *refreshControl;
/*!
 *  当前界面的消息展示table
 */
@property (nonatomic,strong)ChattingTableView *ChatTableView;
/*!
 *  当前界面的输入框工具
 */
@property (nonatomic,strong)DiscussionInputBar *inputBarControl;
/*!
 * 输入框下端附带的视图
 */
@property (nonatomic,strong)UIView *attachView;

@property (nonatomic,strong)NSMutableArray *allUserInfos;

@end
@implementation RCIMGroupChatViewController
static NSString *textMessageCellReusableId = @"textMessageCellReusableId";
static NSString *imageMessageCellReusableId = @"imageMessageCellReusableId";
static NSString *voiceMessageCellReusableId = @"voiceMessageCellReusableId";
static NSString *notificationMsgCellReusableId = @"notificationMsgCellReusableId";

- (instancetype)initWithNibName:( NSString *)nibNameOrNil bundle:( NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        //  [self setUI];
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

- (NSMutableArray *)allUserInfos
{
    if (_allUserInfos==nil) {
        _allUserInfos = [NSMutableArray array];
    }
    return _allUserInfos;
}
- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    
    //监听键盘变动
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillShow:) name:UIKeyboardWillShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardWillDismiss:) name:UIKeyboardWillHideNotification object:nil];
    
    self.inputBarControl.frame = CGRectMake(0, self.view.bounds.size.height-44, screenWidth, 44);
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.2f * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self  scrollToBottom];
    });
    
    if (self.dataSource.count) {
        [self.ChatTableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:self.dataSource.count-1 inSection:0] atScrollPosition:UITableViewScrollPositionBottom animated:NO];
    }
}

//重写控制状态栏方法
- (UIStatusBarStyle)preferredStatusBarStyle
{
    return UIStatusBarStyleLightContent;
}

- (UIStatusBarAnimation)preferredStatusBarUpdateAnimation
{
    return UIStatusBarAnimationSlide;
}

-(void)viewDidLoad
{
    [super viewDidLoad];
    
    if (self.discussionUsersInfo==nil) {
        NSMutableArray *tempArr = [NSMutableArray array];
        for (NSString *idStr in self.membersList) {
            [tempArr addObject:[NSDictionary dictionaryWithObject:idStr forKey:@"key"]];
        }
        [self getContactsInfoByIdList:tempArr];
    }else{
        [self.allUserInfos addObjectsFromArray:self.discussionUsersInfo];
    }
    
    [self.view setBackgroundColor:[UIColor whiteColor]];
    [self initNavBar];
    //设置通知监听
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didReceivedMessageNotification:) name:RCIMLibReceivedMessageNotification object:nil];
    
    //拉取历史数据
    NSArray *array = [[RCIMClient sharedRCIMClient] getLatestMessages:ConversationType_DISCUSSION targetId:self.discussionId count:10];
    //清除所有未读消息
    [[RCIMClient sharedRCIMClient] clearMessagesUnreadStatus:ConversationType_DISCUSSION targetId:self.discussionId];
    NSLog(@"array：%li",array.count);
    //反向遍历
    
    for (int i = array.count-1; i>=0; i--) {
        RCIMDiscussionMessageFrame *msgFrame = [[RCIMDiscussionMessageFrame alloc] init];
        msgFrame.message = [array objectAtIndex:i];
        if (![msgFrame.message.content isKindOfClass:[RCCallSummaryMessage class]]) {
            //通知消息暂时不作显示处理
            [self.dataSource addObject:msgFrame];
            [self.ChatTableView reloadData];
            [self.ChatTableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:self.dataSource.count-1 inSection:0] atScrollPosition:UITableViewScrollPositionBottom animated:YES];
        }
    }
    
//    [array enumerateObjectsWithOptions:NSEnumerationReverse usingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
//        RCIMDiscussionMessageFrame *msgFrame = [[RCIMDiscussionMessageFrame alloc] init];
//        msgFrame.message = obj;
//        if (![msgFrame.message.content isKindOfClass:[RCCallSummaryMessage class]]) {
//            //通知消息暂时不作显示处理
//            [self.dataSource addObject:msgFrame];
//            [self.ChatTableView reloadData];
//            [self.ChatTableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:self.dataSource.count-1 inSection:0] atScrollPosition:UITableViewScrollPositionBottom animated:YES];
//        }
//    }];
    
    [self setUI];
}
- (void)initNavBar
{
    self.navigationItem.title = self.navTitle;
    [self.navigationController.navigationBar setTitleTextAttributes:@{NSFontAttributeName:[UIFont systemFontOfSize:17.0],NSForegroundColorAttributeName:[UIColor whiteColor]}];
    //设置左右导航按钮
    UIView *backBtn = [[UIView alloc] init];
    backBtn.frame = CGRectMake(0, 0, 120, 44);
    UIImageView *imageView = [[UIImageView alloc] initWithFrame:CGRectMake(-18, 5, 32, 32)];
    imageView.image = [UIImage imageNamed:@"back_nav_white"];
    [backBtn addSubview:imageView];
    UILabel *backLab = [[UILabel alloc] init];
    backLab.frame = CGRectMake(CGRectGetMaxX(imageView.frame)-5, 5, 80, 32);
    [backBtn addSubview:backLab];
    backLab.font = [UIFont systemFontOfSize:18];
    backLab.textColor = [UIColor whiteColor];
    backLab.text = @"消息";
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(dismiss)];
    [backBtn addGestureRecognizer:tap];
    
    UIBarButtonItem *left = [[UIBarButtonItem alloc] initWithCustomView:backBtn];
    self.navigationItem.leftBarButtonItem = left;
    
    UIImageView *right_Image1 = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"telephone.png"]];
    right_Image1.frame = CGRectMake(0, 0, 28, 28);
    right_Image1.userInteractionEnabled= YES;
    UITapGestureRecognizer *tap1 = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(call)];
    [right_Image1 addGestureRecognizer:tap1];
    
    UIBarButtonItem *right1 = [[UIBarButtonItem alloc] initWithCustomView:right_Image1];
    
    UIImageView *right_Image2 = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"discussionSetting.png"]];
    right_Image2.frame = CGRectMake(0, 0, 28, 28);
    right_Image2.userInteractionEnabled= YES;
    UITapGestureRecognizer *tap2 = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(discussionSetting)];
    [right_Image2 addGestureRecognizer:tap2];
    UIBarButtonItem *right2 = [[UIBarButtonItem alloc] initWithCustomView:right_Image2];
    UIBarButtonItem *right3 = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemFixedSpace target:self action:nil];
    self.navigationItem.rightBarButtonItems = @[right2,right1,right3];
    //设置导航栏标题颜色
    self.navigationController.navigationBar.titleTextAttributes = @{NSForegroundColorAttributeName:[UIColor whiteColor]};
    //设置导航栏按钮颜色
    [self.navigationController.navigationBar setTintColor:[UIColor whiteColor]];
    //设置导航栏背景图片
    [self.navigationController.navigationBar setBackgroundImage:[UIImage imageNamed:@"NavBar"] forBarMetrics:UIBarMetricsDefault];
}
-(void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
    [self touchTableView];
}
- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}
#pragma mark -打电话
- (void)call{
    
    [self touchTableView];
    NSLog(@"网络电话");
    RCConnectionStatus connectStatus = [[RCIM sharedRCIM] getConnectionStatus];
    switch (connectStatus) {
        case ConnectionStatus_Connected:{
            if([[UIDevice currentDevice] systemVersion].floatValue<10.0){
                
                [[RCCall sharedRCCall] startMultiCall:ConversationType_DISCUSSION targetId:self.discussionId mediaType:RCCallMediaAudio];
            }else{
                [[CustomRCCall sharedRCCall]startMultiCall:ConversationType_DISCUSSION targetId:self.discussionId mediaType:RCCallMediaAudio];
            }
            break;
        }
        case ConnectionStatus_UNKNOWN:{
            [ToastUtils showLong:@"连接失败,请检查网络"];
            break;
        }
        case ConnectionStatus_KICKED_OFFLINE_BY_OTHER_CLIENT:{
            [ToastUtils showLong:@"此帐号已在其他设备登录!"];
            break;
        }
        default:
            [ToastUtils showLong:@"请检查网络!"];
            break;
    }
    
}
#pragma mark -进入讨论组设置界面
- (void)discussionSetting
{
    RCIMDiscussionSettingViewController *RCIMDiscussionSettingVC = [[RCIMDiscussionSettingViewController alloc] initWithStyle:UITableViewStyleGrouped];
    RCIMDiscussionSettingVC.delegate = self;
    RCIMDiscussionSettingVC.discussionId = self.discussionId;
    RCIMDiscussionSettingVC.discussionMembersInfo = self.allUserInfos;
    
    NSLog(@"self.membersList:%@",self.membersList);
    
    [self.navigationController pushViewController:RCIMDiscussionSettingVC animated:YES];
}

- (void)dismiss
{
    [[NSNotificationCenter defaultCenter] postNotificationName:@"RCIMGroupChatViewControllerDismiss" object:nil];
    [self.inputBarControl.inputField resignFirstResponder];
    [self scrollToBottom];
    [self dismissViewControllerAnimated:YES completion:nil];
}

- (void)setUI
{   //聊天界面
    _ChatTableView = [[ChattingTableView alloc] initWithFrame:CGRectMake(0, 0, screenWidth, self.view.bounds.size.height-44) style:UITableViewStylePlain];
    _ChatTableView.separatorStyle = UITableViewCellSeparatorStyleNone;
    _ChatTableView.delegate = self;
    _ChatTableView.dataSource = self;
    _ChatTableView.touchDelegate = self;
    
    [self.view addSubview:_ChatTableView];
    
    [self.ChatTableView registerClass:[RCIMDiscussionCell class] forCellReuseIdentifier:textMessageCellReusableId];
    [self.ChatTableView registerClass:[RCIMDiscussionCell class] forCellReuseIdentifier:imageMessageCellReusableId];
    [self.ChatTableView registerClass:[RCIMDiscussionCell class] forCellReuseIdentifier:voiceMessageCellReusableId];
    [self.ChatTableView registerClass:[RCIMDiscussionCell class] forCellReuseIdentifier:notificationMsgCellReusableId];
    //聊天输入界面
    _inputBarControl = [[DiscussionInputBar alloc] initWithFrame:CGRectMake(0, self.view.bounds.size.height-44, screenWidth, 44)];
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
    
}
//刷新历史消息
- (void)updateHistoryMessage:(UIRefreshControl *)control
{
    RCIMDiscussionMessageFrame *messageFrame;
    if (self.dataSource.count) {
        messageFrame  = _dataSource[0];
    }
    RCMessage * oldestMessage = messageFrame.message;
    NSLog(@"targetId:%lu,",oldestMessage.messageId);
    //在这里请求数据 加载历史消息
    NSArray *historyArray = [[RCIMClient sharedRCIMClient] getHistoryMessages:ConversationType_DISCUSSION targetId:self.discussionId oldestMessageId:oldestMessage.messageId count:10];
    
    NSInteger index = 0;
    
    for (int i=0; i<historyArray.count; i++) {
        RCIMDiscussionMessageFrame *msgFrame = [[RCIMDiscussionMessageFrame alloc] init];
        msgFrame.message = [historyArray objectAtIndex:i];
        if (![msgFrame.message.objectName isEqualToString:@"RC:VCSummary"]) {
            //通知消息暂时不作显示处理
            [self.dataSource insertObject:msgFrame atIndex:0];
            index++;
        }
    }
    
//    __block NSInteger index = 0;
//    [historyArray enumerateObjectsWithOptions:NSEnumerationConcurrent usingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
//        RCIMDiscussionMessageFrame *msgFrame = [[RCIMDiscussionMessageFrame alloc] init];
//        msgFrame.message = obj;
//        if (![msgFrame.message.objectName isEqualToString:@"RC:VCSummary"]) {
//            //通知消息暂时不作显示处理
//            [self.dataSource insertObject:msgFrame atIndex:0];
//            index++;
//        }
//        
//    }];
    
    [control endRefreshing];
    [self.ChatTableView reloadData];
    //每次下拉刷新 先刷出来一个
    if (index) {
        [self.ChatTableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:index-1 inSection:0] atScrollPosition:UITableViewScrollPositionTop animated:NO];
    }
    
    NSLog(@"updateHistoryMessage：%li",self.dataSource.count);
}

#pragma mark - UITableViewDataSource
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return self.dataSource.count;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    RCIMDiscussionCell *cell;
    RCIMDiscussionMessageFrame *messageFrame = _dataSource[indexPath.row];
    
    if ([messageFrame.message.content isKindOfClass:[RCTextMessage class]]) {
        //从缓冲池查找是否有可用的表行对象
        cell = [tableView dequeueReusableCellWithIdentifier:textMessageCellReusableId];
    }else if ([messageFrame.message.content isKindOfClass:[RCVoiceMessage class]]){
        cell = [tableView dequeueReusableCellWithIdentifier:voiceMessageCellReusableId];
    }else if ([messageFrame.message.content isKindOfClass:[RCImageMessage class]]){
        cell = [tableView dequeueReusableCellWithIdentifier:imageMessageCellReusableId];
        [cell.messageLabel setTextContainerInset:UIEdgeInsetsMake( textMesaageFont/2.0, 0, textMesaageFont/2.0, textLeftRightSpace)];
    }else if ([messageFrame.message.content isKindOfClass:[RCDiscussionNotificationMessage class]]){
        //通知类消息
        cell = [tableView dequeueReusableCellWithIdentifier:notificationMsgCellReusableId];
    }
    
    [cell setMsgFrame:messageFrame];
    
    NSString *userIcon = [[NSUserDefaults standardUserDefaults] objectForKey:@"userIcon"];
    if (messageFrame.message.messageDirection==MessageDirection_SEND) {
        [cell.iconImageView sd_setImageWithURL:[NSURL URLWithString:userIcon] placeholderImage:[UIImage imageNamed:@"profile-2@3x.png"] options:SDWebImageProgressiveDownload];
    }else{
        [cell.iconImageView sd_setImageWithURL:[NSURL URLWithString:messageFrame.message.content.senderUserInfo.portraitUri] placeholderImage:[UIImage imageNamed:@"profile-2@3x.png"] options:SDWebImageProgressiveDownload];
    }
    
    //cell点击，长按手势相应
    __weak RCIMDiscussionCell *block_cell = cell;
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

#pragma mark - ChatInputBarControlDelegate
- (void)didSelectedPhotoLibrary
{
    //进入自定义相册
    [self.inputBarControl.inputField resignFirstResponder];
    [UIView animateWithDuration:0.25 animations:^{
    } completion:^(BOOL finished) {
        [self scrollToBottom];
    }];
    UIImagePickerController *imagePicker = [[UIImagePickerController alloc] init];
    imagePicker.delegate = self;
    //图库是否可用
    if([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypePhotoLibrary])
    {
        [imagePicker setAllowsEditing:NO];
        [imagePicker setSourceType:UIImagePickerControllerSourceTypePhotoLibrary];
        [self presentViewController:imagePicker animated:YES completion:nil];
    }
    NSLog(@"图库点击回调");
}
/*!
 * 相机按钮点击回调
 */
- (void)didSelectedCamera
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
        [imagePicker setAllowsEditing:NO];
        [imagePicker setSourceType:UIImagePickerControllerSourceTypeCamera];
        [self presentViewController:imagePicker animated:YES completion:nil];
    }
    NSLog(@"相机按钮点击回调");
}

- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingImage:(UIImage *)image editingInfo:(nullable NSDictionary<NSString *,id> *)editingInfo
{
    [self dismissViewControllerAnimated:YES completion:^{
        
        UIImageOrientation orientation = image.imageOrientation;
        UIImage  *formatImage;
        if(orientation != UIImageOrientationUp){
            UIGraphicsBeginImageContext(image.size);
            [image drawInRect:CGRectMake(0, 0, image.size.width, image.size
                                         .height)];
            formatImage = UIGraphicsGetImageFromCurrentImageContext();
            UIGraphicsEndImageContext();
        }else{
            formatImage = image;
        }
        
        RCImageMessage *imageMessage = [RCImageMessage messageWithImage:formatImage];
        imageMessage.thumbnailImage = formatImage;
        //imageMessage.originalImage = image;
        imageMessage.imageUrl = [NSString stringWithFormat:@"%f",[[NSDate date] timeIntervalSince1970]];
        if (picker.sourceType==UIImagePickerControllerSourceTypeCamera) {
            dispatch_async(dispatch_get_main_queue(), ^{
                _inputBarControl.frame = CGRectMake(0, self.view.bounds.size.height-44, screenWidth, 44);
                UIImageWriteToSavedPhotosAlbum(image, self, nil, NULL);
            });
        }
        [self clickedSendImageMessage:@[imageMessage]];
    }];
}
- (UIImage *)scaleImage:(UIImage*)image byScalingToSize:(CGSize)targetSize {
    
    UIImage *sourceImage = image;
    UIImage *newImage = nil;
    
    UIGraphicsBeginImageContext(targetSize);
    
    CGRect thumbnailRect = CGRectZero;
    thumbnailRect.origin = CGPointZero;
    thumbnailRect.size.width  = targetSize.width;
    thumbnailRect.size.height = targetSize.height;
    
    [sourceImage drawInRect:thumbnailRect];
    
    newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return newImage ;
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker
{
    [self dismissViewControllerAnimated:YES completion:^{
        [self scrollToBottom];
    }];
}
- (void)image:(UIImage *)image didFinishSavingWithError:(NSError *)error contextInfo:(void *)contextInfo
{
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
- (void)touchMultiBtn:(UIButton *)sender
{
    [self removeAllOtherView:RCKeyboardShowMoreType];
    [self.inputBarControl.inputField resignFirstResponder];
    if (sender.selected) {
        if (multiTypeBoardVC==nil) {
            self.attachView.hidden = NO;
            multiTypeBoardVC = [[RCIMDiscussionMultiTypeViewController alloc] init];
            multiTypeBoardVC.delegate = self;
            multiTypeBoardVC.view.frame = CGRectMake(0, 0, screenWidth, 216);
            [self.attachView addSubview:multiTypeBoardVC.view];
            NSLog(@"f非空");
        }
        [UIView animateWithDuration:0.25 animations:^{
            [self scrollToTop:RCKeyboardShowMoreType];
        }];
    } else{
        [UIView animateWithDuration:0.25 animations:^{
            [self scrollToBottom];
        } completion:^(BOOL finished) {
            self.attachView .hidden = YES;
            [multiTypeBoardVC.view removeFromSuperview];
            multiTypeBoardVC = nil;
            NSLog(@"隐藏消失");
        }];
    }
    NSLog(@"图库按钮点击回调");
}

#pragma mark - 发送除text消息之外的接口（voice,text,location）
- (void)touchSendBtn:(id)object
{
    RCIMDiscussionMessageFrame *messageFrame = [[RCIMDiscussionMessageFrame alloc] init];
    long message_id = [[NSDate date] timeIntervalSince1970];//把时间戳记为消息id
    RCTextMessage *textMessage = [[RCTextMessage alloc] init];
    NSString *user_id = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
    NSString *user_name = [[NSUserDefaults standardUserDefaults] objectForKey:@"userName"];
    NSString *user_portrait = [[NSUserDefaults standardUserDefaults] objectForKey:@"userIcon"];
    RCUserInfo *userInfo = [[RCUserInfo alloc] initWithUserId:user_id name:user_name portrait:user_portrait];
    [textMessage setSenderUserInfo:userInfo];
    [textMessage setContent:object ];
    //设置消息携带信息
    [textMessage setExtra:self.discussionImageName];//这里携带以下讨论组image str
    NSLog(@"--------%@---------",textMessage.extra);
    messageFrame.message = [[RCMessage alloc] initWithType:ConversationType_DISCUSSION targetId:self.discussionId direction:MessageDirection_SEND messageId:message_id content:textMessage];
    
    NSLog(@"setExtra:%@",messageFrame.message.extra);
    [self.dataSource addObject:messageFrame];
    //发送消息
    [[RCIMClient sharedRCIMClient] sendMessage:messageFrame.message.conversationType targetId:messageFrame.message.targetId content:messageFrame.message.content pushContent:nil pushData:nil success:^(long messageId) {
        messageFrame.message.messageId = messageId;
        NSLog(@"消息发送成功回调：%lu , targetId:%@ , messageFrameID:%lu",messageId,self.discussionId,messageFrame.message.messageId);
    } error:^(RCErrorCode nErrorCode, long messageId) {
        NSLog(@"消息发送失败回调,错误码:%li 消息Id:%lu",nErrorCode,messageId);
    }];
    [self.ChatTableView reloadData];
    [self.ChatTableView reloadRowsAtIndexPaths:@[[NSIndexPath indexPathForRow:_dataSource.count-1 inSection:0]] withRowAnimation:UITableViewRowAnimationTop];
    [self.ChatTableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:_dataSource.count-1 inSection:0] atScrollPosition:UITableViewScrollPositionBottom animated:YES];
    self.inputBarControl.inputField.text = @"";
}

#pragma mark - 发送图片消息接口
-(void)clickedSendImageMessage:(NSArray *)array
{
    RCIMDiscussionMessageFrame *messageFrame ;
    long message_id = [[NSDate date] timeIntervalSince1970];//把时间戳记为消息id
    for (int i=0; i<array.count; i++) {
        RCImageMessage *imageMessage = array[i];
        NSString *user_id = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
        NSString *user_name = [[NSUserDefaults standardUserDefaults] objectForKey:@"userName"];
        NSString *user_portrait = [[NSUserDefaults standardUserDefaults] objectForKey:@"userIcon"];
        RCUserInfo *userInfo = [[RCUserInfo alloc] initWithUserId:user_id name:user_name portrait:user_portrait];
        [imageMessage setSenderUserInfo:userInfo];
        //设置消息携带信息
        [imageMessage setExtra:self.discussionImageName];//这里携带以下讨论组image
        messageFrame  = [[RCIMDiscussionMessageFrame alloc] init];
        
        messageFrame.message = [[RCMessage alloc] initWithType:ConversationType_DISCUSSION targetId:self.discussionId direction:MessageDirection_SEND messageId:message_id content:imageMessage];
        [self.dataSource addObject:messageFrame];
        
        [self.ChatTableView insertRowsAtIndexPaths:@[[NSIndexPath indexPathForRow:_dataSource.count-1 inSection:0]] withRowAnimation:UITableViewRowAnimationBottom];
        [self.ChatTableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:_dataSource.count-1 inSection:0] atScrollPosition:UITableViewScrollPositionBottom animated:YES];
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.2f * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            NSInteger index = self.dataSource.count;
            [self sendImage:ConversationType_DISCUSSION Content:imageMessage targetId:messageFrame.message.targetId index:index-1 MessageFrame:messageFrame];
        });
    }
    NSLog(@"发送图片消息接口:%@",array);
}

- (void)sendImage:(RCConversationType)type Content:(RCImageMessage *)content targetId:(NSString *)targetId index:(NSInteger)index MessageFrame:(RCIMDiscussionMessageFrame *)msgFrame
{
    [[RCIMClient sharedRCIMClient] sendImageMessage:type targetId:targetId content:content pushContent:nil pushData:nil progress:^(int progress, long messageId) {
        NSLog(@"更新进度：%i",progress);
    } success:^(long messageId) {
        //更新一下本地的messageId号
        msgFrame.message.messageId = messageId;
        NSLog(@"上传成功啦:%lu",messageId);
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


- (void)openImagePickerViewController
{
    [self scrollToBottom];
}

- (void)finishedSelectImage:(UIImage *)image ImageUrl:(NSString *)path
{
    RCImageMessage *imageMessage = [RCImageMessage messageWithImage:image];
    imageMessage.imageUrl = path;
    [self clickedSendImageMessage:@[imageMessage]];
}

#pragma mark - 键盘监听
- (void)keyboardWillShow:(NSNotification *)notification
{
    keyboardheight = [notification.userInfo[@"UIKeyboardBoundsUserInfoKey"] CGRectValue].size.height;
    
    [UIView animateWithDuration:[notification.userInfo[@"UIKeyboardAnimationDurationUserInfoKey"] doubleValue] animations:^{
        //5s 252 6p271  6s258
        [self.inputBarControl setFrame:CGRectMake(0, self.view.bounds.size.height-keyboardheight-44, screenWidth, 44)];
        [self.ChatTableView setFrame:CGRectMake(0, 0, screenWidth, self.view.bounds.size.height-keyboardheight-44)];
        //   NSLog(@"notification:%@",notification.userInfo);
        [self removeAllOtherView:RCKeyboardShowDefaultType];
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
            [self.inputBarControl setFrame:CGRectMake(0, self.view.bounds.size.height-44, screenWidth, 44)];
            [self.ChatTableView setFrame:CGRectMake(0, 0, screenWidth, self.view.bounds.size.height-44)];
        }];
    }
    // NSLog(@"YChange:%f ,%f",YChange,duration);//216
}

- (void)removeAllOtherView:(RCKeyboardShowType)type
{
    if (type==RCKeyboardShowDefaultType) {
        multiTypeBoardVC = nil;
        [multiTypeBoardVC.view removeFromSuperview];
        recoderViewController = nil;
        [recoderViewController.view removeFromSuperview];
        emojiVC = nil;
        [emojiVC.view removeFromSuperview];
        self.inputBarControl.emojiBtn.selected = NO;
        self.inputBarControl.recorderBtn.selected = NO;
        self.inputBarControl.multiBtn.selected = NO;
        
    }else if (type==RCKeyboardShowEmotionType){
        multiTypeBoardVC = nil;
        [multiTypeBoardVC.view removeFromSuperview];
        recoderViewController = nil;
        [recoderViewController.view removeFromSuperview];
        self.inputBarControl.recorderBtn.selected = NO;
        self.inputBarControl.multiBtn.selected = NO;
    }else if (type==RCKeyboardShowImageCollectionType){
        emojiVC = nil;
        [emojiVC.view removeFromSuperview];
        self.inputBarControl.emojiBtn.selected = NO;
        recoderViewController = nil;
        [recoderViewController.view removeFromSuperview];
        self.inputBarControl.recorderBtn.selected = NO;
    }else if (type==RCKeyboardShowRecorderType){
        multiTypeBoardVC = nil;
        self.inputBarControl.multiBtn.selected = NO;
        [multiTypeBoardVC.view removeFromSuperview];
        emojiVC = nil;
        self.inputBarControl.emojiBtn.selected = NO;
        [emojiVC.view removeFromSuperview];
    }else if(type==RCKeyboardShowMoreType){
        emojiVC = nil;
        [emojiVC.view removeFromSuperview];
        self.inputBarControl.emojiBtn.selected = NO;
        recoderViewController = nil;
        [recoderViewController.view removeFromSuperview];
        self.inputBarControl.recorderBtn.selected = NO;
    }
}

- (void)scrollToBottom
{
    [self.ChatTableView setFrame:CGRectMake(0, 0, screenWidth, self.view.bounds.size.height-44)];
    [self.inputBarControl setFrame:CGRectMake(0, self.view.bounds.size.height-44, screenWidth, 44)];
    self.attachView.frame = CGRectMake(0, self.view.bounds.size.height-216, screenWidth, 216);
    self.inputBarControl.emojiBtn.selected = NO;
    self.inputBarControl.multiBtn.selected = NO;
    self.inputBarControl.recorderBtn.selected = NO;
    self.attachView.frame = CGRectMake(0, screenHeight, screenWidth, 216);
}
- (void)scrollToTop:(RCKeyboardShowType)type
{
    if (type==RCKeyboardShowDefaultType) {
        [self.ChatTableView setFrame:CGRectMake(0, 0, screenWidth, self.view.bounds.size.height-keyboardheight-44)];
        [self.inputBarControl setFrame:CGRectMake(0, self.view.bounds.size.height-44-keyboardheight, screenWidth, 44)];
    }else {
        [self.ChatTableView setFrame:CGRectMake(0, 0, screenWidth, self.view.bounds.size.height-216-44)];
        [self.inputBarControl setFrame:CGRectMake(0, self.view.bounds.size.height-44-216, screenWidth, 44)];
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
        RCIMDiscussionMessageFrame *messageFrame = [[RCIMDiscussionMessageFrame alloc] init];
        long message_id = [[NSDate date] timeIntervalSince1970];//把时间戳记为消息id
        NSData *voiceData = [NSData dataWithContentsOfFile:fileName];
        
        RCVoiceMessage *voiceMessage = [RCVoiceMessage messageWithAudio:voiceData duration:timeInterVal];
        
        NSString *user_id = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
        NSString *user_name = [[NSUserDefaults standardUserDefaults] objectForKey:@"userName"];
        NSString *user_portrait = [[NSUserDefaults standardUserDefaults] objectForKey:@"userIcon"];
        RCUserInfo *userInfo = [[RCUserInfo alloc] initWithUserId:user_id name:user_name portrait:user_portrait];
        [voiceMessage setSenderUserInfo:userInfo];
        //设置消息携带信息
        [voiceMessage setExtra:self.discussionImageName];//这里携带以下讨论组image
        messageFrame.message = [[RCMessage alloc] initWithType:ConversationType_DISCUSSION targetId:self.discussionId direction:MessageDirection_SEND messageId:message_id content:voiceMessage];
        
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
- (void)didTapAction:(RCIMDiscussionCell *)cell
{
    if ([cell.msgFrame.message.content isKindOfClass:[RCTextMessage class]]) {
        RCTextMessage *textMessage= (RCTextMessage *)cell.msgFrame.message.content;
        NSLog(@"点了文字:%@",textMessage.content);
    }else if ([cell.msgFrame.message.content isKindOfClass:[RCVoiceMessage class]]){
        RCVoiceMessage *voiceMessage = (RCVoiceMessage *)cell.msgFrame.message.content;
        [PlayerManager sharedManager].delegate = self;
        [[PlayerManager sharedManager] startPlayData:voiceMessage.wavAudioData];
        UIImageView *imageV;
        for (UIView *view in cell.messageLabel.subviews) {
            if ([view isKindOfClass:[UIImageView class]]) {
                imageV = (UIImageView *)view;
            }
        }
        if (voiceImageView) {
            [voiceImageView stopAnimating];
        }
        [imageV startAnimating];
        voiceImageView = imageV;
        
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
        [WSShowBigImage sharedInstance].viewControlelr = self;
        [[WSShowBigImage sharedInstance] showBigImage:imageView Url:imageMessage.imageUrl];
    }
    NSLog(@"didTapAction");
}
#pragma mark - 录音结束代理
-(void)finishedPlayingVoice
{
    [voiceImageView stopAnimating];
}

//长按触发
- (void)didLongPressAction:(RCIMDiscussionCell *)cell
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
    }else{
        copyStr = @" ";
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
    NSLog(@"deleteAction");
}
//删除
- (void)deleteAction:(UIMenuController *)menuController
{
    NSLog(@"deleteAction");
}

#pragma mark -RCIMDiscussionSettingViewControllerDelegate设置界面代理
-(void)removeAllChattingRecorder
{
    [[NSNotificationCenter defaultCenter] postNotificationName:@"RCIMGroupChatViewControllerDismiss" object:nil];
}

#pragma mark -通过memberID去获取name和头像
- (void)connectToService:(NSString *)memberId
{
    if (userInfos == nil) {
        userInfos = [NSMutableArray array];
    }
    //如果数据库有 就不从网络上获取了
    if ([DataBaseTool hasPerson:memberId]) {
        NSString *emp_name = [DataBaseTool getNameByWorkerId:memberId];
        NSString *avatar = [DataBaseTool getImageUrlByWorkerId:memberId];
        NSDictionary *userInfo = [NSDictionary dictionaryWithObjects:@[memberId,emp_name,avatar] forKeys:@[@"emp_code",@"emp_name",@"avatar"]];
        [userInfos addObject:userInfo];
        return;
    }
    
    NSString *access_token = [[NSUserDefaults standardUserDefaults] objectForKey:@"access_token"];
    NSString *path = [NSString stringWithFormat:@"%@access_token=%@",localServiceQuery,access_token];
    NSURL *url = [NSURL URLWithString:path];
    NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:url];
    [urlRequest setHTTPMethod:@"POST"];
    NSDictionary *requestBody = @{@"key":memberId,@"page":@1,@"pageSize":@10};
    [urlRequest setHTTPBody:[NSJSONSerialization dataWithJSONObject:requestBody options:NSJSONWritingPrettyPrinted error:nil]];
    NSDictionary *headers = @{@"content-type": @"application/json"};
    [urlRequest setAllHTTPHeaderFields:headers];
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            NSArray *returnArray = [json objectForKey:@"rows"];
            NSDictionary *userInfo = returnArray[0];
            [userInfos addObject:userInfo];
            
            NSString *avatar = [userInfo objectForKey:@"avatar"];
            if (avatar==nil||[avatar isEqualToString:@""]||[avatar isEqual:[NSNull null]]) {
                avatar = @"profile-2@3x.png";
            }
            NSString *mobile = [userInfo objectForKey:@"mobile"];
            if (mobile==nil||[mobile isEqualToString:@""]||[mobile isEqual:[NSNull null]]) {
                mobile = @"000000";
            }
            if (mainQueue==nil) {
                mainQueue = [NSOperationQueue mainQueue];
            }
            NSBlockOperation *operation = [NSBlockOperation blockOperationWithBlock:^{
                [DataBaseTool selectSameUserInfoWithId:[userInfo objectForKey:@"emp_code"] Name:[userInfo objectForKey:@"emp_name"] ImageUrl:avatar Tel:mobile];
            }];
            [mainQueue addOperations:@[operation] waitUntilFinished:YES];
        }else{
            NSLog(@"data:%@,error:%@",data,error);
        }
    }];
    [dataTask resume];
}

#pragma mark - didReceivedMessageNotification 这里收到的都是讨论组消息
- (void)didReceivedMessageNotification:(NSNotification *)notification
{
    RCMessage *message = notification.object;
    NSLog(@"message_targetID:%@,self.discussionId:%@",message.targetId,self.discussionId);
    //主要判断条件
    if ([message.targetId isEqualToString:self.discussionId]&&(message.conversationType==ConversationType_DISCUSSION)) {
        if (![message.content isKindOfClass:[RCDiscussionNotificationMessage class]]) {
            RCIMDiscussionMessageFrame *messageFrame = [[RCIMDiscussionMessageFrame alloc] init];
            [[RCIMClient sharedRCIMClient] setMessageReceivedStatus:message.messageId receivedStatus:ReceivedStatus_READ];
            [messageFrame setMessage:message];
            [self.dataSource addObject:messageFrame];
            
            [self.ChatTableView reloadData];
            [self.ChatTableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:self.dataSource.count-1 inSection:0] atScrollPosition:UITableViewScrollPositionBottom animated:YES];
        }else{
            //这里接收通知
            RCDiscussionNotificationMessage *discussionNotifiMsg = (RCDiscussionNotificationMessage*) message.content;
            RCIMDiscussionMessageFrame *messageFrame = [[RCIMDiscussionMessageFrame alloc] init];
            [messageFrame setMessage:message];
            [self.dataSource addObject:messageFrame];
            [self.ChatTableView reloadData];
            [self.ChatTableView scrollToRowAtIndexPath:[NSIndexPath indexPathForRow:self.dataSource.count-1 inSection:0] atScrollPosition:UITableViewScrollPositionBottom animated:YES];
            NSLog(@"-------讨论组来通知了-----%li,%@,%@",discussionNotifiMsg.type,discussionNotifiMsg.operatorId,discussionNotifiMsg.extension);
            
            if (discussionNotifiMsg.type==RCInviteDiscussionNotification) {
                NSMutableArray *tempUsersInfo = [NSMutableArray array];
                NSArray *addMemberIds;
                if (discussionNotifiMsg.extension) {
                    if ([discussionNotifiMsg.extension containsString:@","]) {
                        addMemberIds = [discussionNotifiMsg.extension componentsSeparatedByString:@","];
                    }else{
                        //只有一个
                        addMemberIds = @[discussionNotifiMsg.extension];
                    }
                }
                for (NSString *userId in addMemberIds) {
                    [tempUsersInfo addObject:[NSDictionary dictionaryWithObject:userId forKey:@"key"]];
                }
                [self getContactsInfoByIdList:tempUsersInfo];
                
            }else if(discussionNotifiMsg.type==RCQuitDiscussionNotification){
                //删除退出的那个人
                NSString *quitUserId = discussionNotifiMsg.operatorId;
                NSInteger index;
                for (NSDictionary *dict in self.allUserInfos) {
                    if ([dict[@"emp_code"] integerValue]==quitUserId.integerValue) {
                        index = [self.allUserInfos indexOfObject:dict];
                        break;
                    }
                }
                [self.allUserInfos removeObjectAtIndex:index];
            }
        }
    }
    
    if([message.content isKindOfClass:[RCTextMessage class]]){
        
        RCTextMessage *textMessage = (RCTextMessage *)message.content;
        NSLog(@"----讨论组头像:%@,%@,%@",textMessage.senderUserInfo.userId,textMessage.senderUserInfo.name,textMessage.senderUserInfo.portraitUri);
    }
    
}
#pragma mark -根据id拉取所有人的info
- (void)getContactsInfoByIdList:(NSArray *)employee_id
{
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
    [configuration setTimeoutIntervalForRequest:30.0];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            self.discussionUsersInfo = json[@"rows"];// avatar,emp_name,emp_code
            [self.allUserInfos addObjectsFromArray:self.discussionUsersInfo];
        }else{
            NSLog(@"%@",error.localizedDescription);
        }
    }];
    [dataTask resume];
}

@end
