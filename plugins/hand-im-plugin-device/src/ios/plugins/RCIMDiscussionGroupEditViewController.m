//
//  RCIMDiscussionGroupEditViewController.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/24.
//
//

#import "RCIMDiscussionGroupEditViewController.h"
#import "CVDPlugin-Bridging-Header.h"
#import "ZLProgressHUD.h"
#import "ToastUtils.h"
#import "RCIMGroupChatViewController.h"
#import "UIImage+UIColor.h"
#import "DataBaseTool.h"
#define LPFileBoundary @"jikeyi"
#define LPNewLien @"\r\n"
#define LPEncode(str) [str dataUsingEncoding:NSUTF8StringEncoding]

@interface RCIMDiscussionGroupEditViewController ()<UINavigationControllerDelegate,UIImagePickerControllerDelegate>
{
    RCIMGroupChatViewController *RCIMGroupChattingVC;
    ZLProgressHUD *progress;
}
@property (nonatomic,strong)UIImageView *imageView;
@property (nonatomic,strong)UITextField *textField;
@property (nonatomic,strong)UILabel *downLine;
@end

@implementation RCIMDiscussionGroupEditViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self.view setBackgroundColor:[UIColor whiteColor]];
    
    self.imageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"add_members@2x.png"]];
    [self.imageView setUserInteractionEnabled:YES];
    [self.imageView setFrame:CGRectMake((screenWidth-120.0/375.0*screenWidth)/2.0, 130/667.0*screenHeight, 120.0/375.0*screenWidth, 120.0/375.0*screenWidth)];
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapGesture:)];
    [self.imageView addGestureRecognizer:tap];
    [self.imageView.layer setCornerRadius:8.0];
    [self.imageView.layer setMasksToBounds:YES];//(320,568) (375,667) (414,736)
    [self.view addSubview:self.imageView];
    
    self.textField = [[UITextField alloc] initWithFrame:CGRectMake((screenWidth-280/375.0*screenWidth)/2.0, CGRectGetMaxY(self.imageView.frame)+80/667.0*screenHeight, 280/375.0*screenWidth, 30/375.0*screenWidth)];
    
    [self.textField setFont:[UIFont systemFontOfSize:16.0]];
    self.textField.placeholder = @"填写讨论组名称（10个字以内）";
    self.textField.textAlignment = NSTextAlignmentCenter;
    self.textField.borderStyle = UITextBorderStyleNone;
    [self.view addSubview:self.textField];
    
    self.downLine = [[UILabel alloc] initWithFrame:CGRectMake((screenWidth-300/375.0*screenWidth)/2.0, CGRectGetMaxY(self.textField.frame), 300/375.0*screenWidth, 1.0)];
    [self.downLine setBackgroundColor:[UIColor colorWithRed:1/255.0 green:149/255.0 blue:255/255.0 alpha:1.0]];
    [self.view addSubview:self.downLine];
    
    UILabel *titleView = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, 80, 20)];
    titleView.attributedText = [[NSAttributedString alloc] initWithString:@"创建讨论组" attributes:@{NSForegroundColorAttributeName:[UIColor colorWithRed:74/255.0 green:74/255.0 blue:74/255.0 alpha:1.0],NSFontAttributeName:[UIFont systemFontOfSize:17]}];
    self.navigationItem.titleView = titleView;
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"完成" style:UIBarButtonItemStylePlain target:self action:@selector(finishedCreate)];
    //设置导航颜色
    [self.navigationController.navigationBar setTintColor:[UIColor colorWithRed:74/255.0 green:74/255.0 blue:74/255.0 alpha:1.0]];
}

#pragma mark -成功创建讨论组
- (void)finishedCreate
{
    [self.textField resignFirstResponder];
    if (self.textField.text.length==0) {
        [ToastUtils showLong:@"讨论组名称不能为空"];
    }else{
        progress = [[ZLProgressHUD alloc] init];
        [progress show];
        
        NSLog(@"self.memberList:%@",self.memberList);
        NSMutableArray *emp_codeList = [NSMutableArray arrayWithCapacity:self.memberList.count];
        //插入新的联系人
        [self insertNewContact:self.memberList];
        for (NSDictionary *info in self.memberList) {
            [emp_codeList addObject:[info objectForKey:@"emp_code"]];
        }
        //创建讨论组
        [[RCIMClient sharedRCIMClient] createDiscussion:self.textField.text userIdList:emp_codeList success:^(RCDiscussion *discussion) {
            NSLog(@"创建讨论组成功id:%@-成员:%@-创始人:%@",discussion.discussionId,discussion.memberIdList,discussion.creatorId);
            self.discussionId = discussion.discussionId;
            dispatch_async(dispatch_get_main_queue(), ^{
                RCIMGroupChattingVC = [[RCIMGroupChatViewController alloc] init];
                RCIMGroupChattingVC.discussionId = discussion.discussionId;

                //把创建者也加入进去
                //RCIMGroupChattingVC.membersList 数组中存放的是工号
                RCIMGroupChattingVC.membersList = discussion.memberIdList;//userId
                
                RCIMGroupChattingVC.navTitle = discussion.discussionName;
                
                if ([self.imageView.image isEqual:[UIImage imageNamed:@"add_members@2x.png"]]) {
                    [self upload:@"discussionGroupImage.png" mimeType:@"image/jpeg" fileData:UIImageJPEGRepresentation([self imageWithTitle:[self.textField.text substringToIndex:1] Size:CGSizeMake(80, 80)], 1.0) params:nil];
                }else{
                
                    [self upload:@"discussionGroupImage.png" mimeType:@"image/png" fileData:UIImageJPEGRepresentation(self.imageView.image, 0.3) params:nil];
                }
            });
        } error:^(RCErrorCode status) {
            NSLog(@"创建讨论组失败：%li",status);
            if (status==30001||status==30002) {
                [ToastUtils showLong:@"当前网络不稳定,请尝试重新创建讨论组"];
            }else if (status==1||status==-1){
                [ToastUtils showLong:@"创建讨论组必须两个人以上"];
            }
            [progress hide];
        }];
        if ([progress isShowing]) {
            [self performSelector:@selector(delayPerform:) withObject:progress afterDelay:10.0];
        }
    }
}

#pragma mark - 把添加的好友存入数据库中
- (void)insertNewContact:(NSArray *)userInfo_array
{
    //如果头像为nil 用默认头像替换
    for (NSDictionary *userInfo in userInfo_array) {
        //向数据库人员表中插入新联系人
        NSString *avatar = [userInfo objectForKey:@"avatar"];
        if (avatar==nil||[avatar isEqualToString:@""]||[avatar isEqual:[NSNull null]]) {
            avatar = @"profile-2@3x.png";
        }
        NSString *mobile = [userInfo objectForKey:@"mobil"];
        if (mobile==nil||[mobile isEqualToString:@""]||[mobile isEqual:[NSNull null]]) {
            mobile = @"null";
        }
        [DataBaseTool selectSameUserInfoWithId:[userInfo objectForKey:@"emp_code"] Name:[userInfo objectForKey:@"emp_name"] ImageUrl:[userInfo objectForKey:@"avatar"] Tel:mobile];
    }
}

-(UIColor *) randomColor
{
    CGFloat hue = ( arc4random() % 256 / 256.0 );  //0.0 to 1.0
    CGFloat saturation = ( arc4random() % 128 / 256.0 ) + 0.5;  // 0.5 to 1.0,away from white
    CGFloat brightness = ( arc4random() % 128 / 256.0 ) + 0.5;  //0.5 to 1.0,away from black
    return [UIColor colorWithHue:hue saturation:saturation brightness:brightness alpha:1];
}

- (UIImage *)imageWithTitle:(NSString *)sting Size:(CGSize)size
{
    UIGraphicsBeginImageContext(size);
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetFillColorWithColor(context,[self randomColor].CGColor);
    CGContextFillRect(context, CGRectMake(0, 0, size.width, size.height));
    //写文字
    CGContextSetLineWidth(context, 1.0);
    CGContextSetRGBFillColor (context, 1.0, 1.0, 1.0, 1.0);
    UIFont  *font = [UIFont systemFontOfSize:25.0];
    [sting drawInRect:CGRectMake(size.width/2.0-14, size.height/2.0-14, 30, 30) withAttributes:@{NSFontAttributeName:font}];
    UIImage *img = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return img;
}

- (void)delayPerform:(ZLProgressHUD *)_progress
{
    [_progress hide];
    //[ToastUtils showLong:@"请检查手机的当前网络是否正常"];
}
- (void)tapGesture:(UITapGestureRecognizer *)tap
{
    //选择讨论组图片
    UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"选择讨论组图标" message:nil preferredStyle:UIAlertControllerStyleActionSheet];
    [alertController addAction:[UIAlertAction actionWithTitle:@"相机" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        UIImagePickerController *imagePicker = [[UIImagePickerController alloc] init];
        imagePicker.delegate = self;
        //相机是否可用
        if([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypeCamera])
        {
            [imagePicker setAllowsEditing:NO];
            [imagePicker setSourceType:UIImagePickerControllerSourceTypeCamera];
            [self presentViewController:imagePicker animated:YES completion:nil];
        }
    }]];
    [alertController addAction:[UIAlertAction actionWithTitle:@"相册" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
        //使用相册
        UIImagePickerController *imagePicker = [[UIImagePickerController alloc] init];
        imagePicker.delegate = self;
        //相册是否可用
        if([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypePhotoLibrary])
        {
            [imagePicker setAllowsEditing:YES];
            [imagePicker setSourceType:UIImagePickerControllerSourceTypePhotoLibrary];
            [self presentViewController:imagePicker animated:YES completion:nil];
        }
    }]];
    [alertController addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction *  action) {
        //使用默认的随机图标
    }]];
    [self presentViewController:alertController animated:YES completion:nil];
}

- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingImage:(UIImage *)image editingInfo:(nullable NSDictionary<NSString *,id> *)editingInfo
{
    UIImage *originalImage = editingInfo[@"UIImagePickerControllerOriginalImage"];
    [self dismissViewControllerAnimated:YES completion:^{
         [self.imageView setImage:originalImage];
    }];
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker
{
    [picker dismissViewControllerAnimated:YES completion:nil];
}

//#pragma mark -上传讨论组图片到融云服务器
//- (void)uploadDiscussionGroupImage:(UIImage *)image scale:(CGFloat)scale
//{
//    NSLog(@"image:%@",image);
//    NSString *access_token = @"6b6584d6-243f-4dd5-95e1-31dbefc173a4";
//    NSString *path = [NSString stringWithFormat:@"%@access_token=%@",localServiceUpload,access_token];
//    NSURL *url = [NSURL URLWithString:path];
//    NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:url];
//    [urlRequest setHTTPMethod:@"POST"];
//    NSDictionary *headers = @{@"content-type": @"multipart/form-data",@"boundary":[NSString stringWithFormat:@"----999293"]};//默认
//    [urlRequest setAllHTTPHeaderFields:headers];
//    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
//    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
//    NSURLSessionUploadTask *dataTask = [session uploadTaskWithRequest:urlRequest fromData:UIImageJPEGRepresentation(image, scale) completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
//        NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
//       
//        NSLog(@"上传返回参数:%@,%@",json,response);
//    }];
//    [dataTask resume];
//}

- (void)upload:(NSString *)filename mimeType:(NSString *)mimeType fileData:(NSData *)fileData params:(NSDictionary *)params
{
    NSString *access_token = [[NSUserDefaults standardUserDefaults] objectForKey:@"access_token"];
    //NSString *access_token = @"589bb441-e760-495a-846c-3ed22460a2eb";
    // 1.请求路径
    NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"%@access_token=%@",localServiceUpload,access_token]];
    
    // 2.创建一个POST请求
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
    request.HTTPMethod = @"POST";
    
    // 3.设置请求体  @“”
    NSMutableData *body = [NSMutableData data];
    //转码
    //[@"123" dataUsingEncoding:NSUTF8StringEncoding];
    
    // 3.1.文件参数
    //-----------------------------5707058651191505553348820996
    [body appendData:LPEncode(@"--")];
    [body appendData:LPEncode(LPFileBoundary)];
    [body appendData:LPEncode(LPNewLien)];
    
    //Content-Disposition: form-data; name="file"; filename="minion_01.mp4"
    NSString *disposition = [NSString stringWithFormat:@"Content-Disposition: form-data; name=\"file\"; filename=\"%@\"", filename];
    [body appendData:LPEncode(disposition)];
    [body appendData:LPEncode(LPNewLien)];
    
    // Content-Type: video/mp4
    NSString *type = [NSString stringWithFormat:@"Content-Type: %@", mimeType];
    [body appendData:LPEncode(type)];
    [body appendData:LPEncode(LPNewLien)];
    
    //文件数据 图片 视频 txt
    [body appendData:LPEncode(LPNewLien)];
    [body appendData:fileData];
    [body appendData:LPEncode(LPNewLien)];
    
    // -----------------------------5707058651191505553348820996
    // Content-Disposition: form-data; name="username"
    
    
    // -----------------------------5707058651191505553348820996--
    // 3.2.非文件参数
    [params enumerateKeysAndObjectsUsingBlock:^(id key, id obj, BOOL *stop) {
        [body appendData:LPEncode(@"--")];
        [body appendData:LPEncode(LPFileBoundary)];
        [body appendData:LPEncode(LPNewLien)];
        
        NSString *disposition = [NSString stringWithFormat:@"Content-Disposition: form-data; name=\"%@\"", key];
        [body appendData:LPEncode(disposition)];
        [body appendData:LPEncode(LPNewLien)];
        
        [body appendData:LPEncode(LPNewLien)];
        [body appendData:LPEncode([obj description])];
        [body appendData:LPEncode(LPNewLien)];
    }];
    
    // 3.3.结束标记
    [body appendData:LPEncode(@"--")];
    [body appendData:LPEncode(LPFileBoundary)];
    [body appendData:LPEncode(@"--")];
    [body appendData:LPEncode(LPNewLien)];
    
    request.HTTPBody = body;
    
    //4.设置请求头(告诉服务器这次传给你的是文件数据，告诉服务器现在发送的是一个文件上传请求)
    NSString *contentType = [NSString stringWithFormat:@"multipart/form-data; boundary=%@", LPFileBoundary];
    [request setValue:contentType forHTTPHeaderField:@"Content-Type"];
    
    //5.发送请求
    [NSURLConnection sendAsynchronousRequest:request queue:[NSOperationQueue mainQueue] completionHandler:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
        NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableLeaves error:nil];
        if (!connectionError) {
            NSString *discussionImageUrl = [discussionGroup stringByAppendingString:[dict objectForKey:@"returnData"][@"objectUrl"]];
            [DataBaseTool insertDiscussionGroupInformation:self.discussionId PortraitUri:discussionImageUrl];
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.navigationController pushViewController:RCIMGroupChattingVC animated:YES];
                NSString *userName = [[NSUserDefaults standardUserDefaults] objectForKey:@"userName"];
                NSString *userIcon = [[NSUserDefaults standardUserDefaults] objectForKey:@"userIcon"];
                NSString *userId = [[NSUserDefaults standardUserDefaults] objectForKey:@"userId"];
                RCUserInfo *userInfo = [[RCUserInfo alloc] initWithUserId:userId name:userName portrait:userIcon];
                RCTextMessage *textMessage = [RCTextMessage messageWithContent:[NSString stringWithFormat:@"%@创建了讨论组",userName]];
                textMessage.senderUserInfo = userInfo;
                textMessage.extra = discussionImageUrl;
                [[RCIMClient sharedRCIMClient] sendMessage:ConversationType_DISCUSSION targetId:RCIMGroupChattingVC.discussionId content:textMessage pushContent:nil pushData:nil success:^(long messageId) {
                    NSLog(@"%@",textMessage.content);
                } error:^(RCErrorCode nErrorCode, long messageId) {
                    NSLog(@"创建讨论组失败");
                }];
                [progress hide];
            });
        }
        NSLog(@"请求回调%@", dict);//@"objectUrl"  returnData
            }];
}


@end
