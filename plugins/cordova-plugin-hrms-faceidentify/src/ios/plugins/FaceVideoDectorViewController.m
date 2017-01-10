//
//  FaceVideoDectorViewController.m
//  讯飞-人脸识别-从组中识别
//
//  Created by wangsheng on 2016/12/8.
//  Copyright © 2016年 wangsheng. All rights reserved.
//

#import "FaceVideoDectorViewController.h"
#import "WBCaptureService.h"
#import "UIImage+FaceDetect.h"
#import "FaceHeader.h"
#import <AliyunOSSiOS/AliyunOSSiOS.h>

@interface FaceVideoDectorViewController ()<WBCaptureServiceDelegate>
    {
        BOOL isDefaultDirection;
        BOOL isRunning;
        BOOL isDetecting;
        NSTimer *timer;
        BOOL isPassed;
        BOOL isWorking;
        OSSClient *client;
    }
    @property (nonatomic,strong)WBCaptureService *captureService;
    @property (nonatomic,strong) AVCaptureVideoPreviewLayer *previewLayer;
    @property (nonatomic,strong)UIImage *recognizerImg;
    @property (nonatomic,strong)UIView* previewView;
    @property (nonatomic,strong)UILabel *timeLabel;
    @property (nonatomic,strong)UIButton *backBtn;
    @property (nonatomic,strong)UIButton *switchBtn;
    @property (nonatomic,strong)UILabel *titleLabel;
    @property (nonatomic,strong)UIActivityIndicatorView *activityView;
    @end

@implementation FaceVideoDectorViewController
    
- (WBCaptureService*)captureService
    {
        if (!_captureService) {
            _captureService = [[WBCaptureService alloc] init];
            [_captureService setDelegate:self callbackQueue:dispatch_get_main_queue()];
            _captureService.captureType = WBCaptureType_Video;
            
            _captureService.renderingEnabled = YES;
            _captureService.shouldSaveToAlbum = NO;
            _captureService.shouldRecordAudio = NO;
            _captureService.preferedDevicePosition = isDefaultDirection?AVCaptureDevicePositionFront:AVCaptureDevicePositionBack;
        }
        return _captureService;
    }
    
- (void)initSDK{
    
    NSString *endpoint = @"https://oss-cn-shanghai.aliyuncs.com";
    
    // 明文设置secret的方式建议只在测试时使用，更多鉴权模式参考后面链接给出的官网完整文档的`访问控制`章节
    id<OSSCredentialProvider> credential = [[OSSPlainTextAKSKPairCredentialProvider alloc] initWithPlainTextAccessKey:@"LTAIf20TU2Tdb8jz" secretKey:@"7f2vPdAYXeImOg80I6y43huIvu171i"];
    
    client = [[OSSClient alloc] initWithEndpoint:endpoint credentialProvider:credential];
}
    
- (void)viewDidLoad {
    [super viewDidLoad];
    [self initSDK];
    
    if (self.dict && [self.dict isEqualToDictionary:@{@"direction":@"back"}]) {
        isDefaultDirection = NO;
    }else{
        isDefaultDirection = YES;
    }
    
    [self.captureService startRunning];
    isRunning = YES;
    
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0f * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        //初始化一个计时器每两秒钟检测一次人脸
        
        timer = [NSTimer scheduledTimerWithTimeInterval:1.2f target:self selector:@selector(faceDetectFunction) userInfo:nil repeats:YES];
    });
    
    AFNetworkReachabilityStatus status = [[AFNetworkReachabilityManager sharedManager] networkReachabilityStatus];
    if (status==AFNetworkReachabilityStatusNotReachable) {
        [ToastUtils showAtTop:@"当前网络环境不好，请检查网络！"];
    }
    
}
    
- (void)faceDetectFunction
    {
        isDetecting = YES;
    }
    
- (void)initUI
    {
        self.previewView = [[UIView alloc] initWithFrame:self.view.bounds];
        UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(switchCamera)];
        [tap setNumberOfTapsRequired:2];
        [self.previewView addGestureRecognizer:tap];
        
        [self.previewView setBackgroundColor:[UIColor lightGrayColor]];
        [self.view addSubview:self.previewView];
        
        UIImageView *imageView = [[UIImageView alloc] initWithFrame:self.view.bounds];
        imageView.alpha = 0.6;
        UIImage *image = [UIImage imageNamed:@"style_default_bg_mask_normal"];
        imageView.image = image;
        [self.view addSubview:imageView];
        
        
        self.backBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [self.backBtn setTitle:@"取消" forState:UIControlStateNormal];
        [self.backBtn setFrame:CGRectMake(0, 0, 60, 40)];
        [self.backBtn addTarget:self action:@selector(dismissViewController) forControlEvents:UIControlEventTouchUpInside];
        [self.backBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        
        [self.view addSubview:self.backBtn];
        
        self.switchBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [self.switchBtn setTitle:@"切换" forState:UIControlStateNormal];
        [self.switchBtn setFrame:CGRectMake(self.view.bounds.size.width-60, 0, 60, 40)];
        [self.switchBtn addTarget:self action:@selector(switchCamera) forControlEvents:UIControlEventTouchUpInside];
        [self.switchBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        [self.view addSubview:self.switchBtn];
        
        
        //进度圈
        self.activityView = [[UIActivityIndicatorView alloc] initWithFrame:CGRectMake((CGRectGetWidth(self.view.frame)-30)/2.0-40, 60, 20, 20)];
        self.activityView.activityIndicatorViewStyle = UIActivityIndicatorViewStyleWhite;
        [self.view addSubview:self.activityView];
        
        
        //提示标题
        self.titleLabel = [[UILabel alloc] initWithFrame:CGRectMake(CGRectGetMaxX(self.activityView.frame), 60, 120, 20)];
        self.titleLabel.hidden = YES;
        self.titleLabel.text = @"正在识别中...";
        self.titleLabel.textColor = [UIColor whiteColor];
        [self.view addSubview:self.titleLabel];
        
    }
    
- (void)changeActivity
    {
        [self.activityView stopAnimating];
        self.titleLabel.text = @"识别成功！";
        [MBProgressHUD showHUDAddedTo:self.view animated:YES];
    }
    
#pragma mark - 隐藏状态栏
-(BOOL)prefersStatusBarHidden
    {
        return YES;
    }
    
- (void)dismissViewController
    {
        [self.captureService stopRunning];
        self.captureService = nil;
        [timer invalidate];
        timer = nil;
        
        [self dismissViewControllerAnimated:YES completion:nil];
    }
    
#pragma mark - 切换摄像头的方向
- (void)switchCamera
    {
        isDefaultDirection = !isDefaultDirection;
        
        self.captureService = nil;
        
        [self.captureService startRunning];
        
        isRunning = YES;
        
        
        [self setupPreviewView];
        
        //旋转动画
        
        if (isDefaultDirection) {
            [UIView transitionWithView:self.previewView duration: 0.5 options: UIViewAnimationOptionTransitionFlipFromLeft animations: nil completion:^(BOOL finished) {
                [self flipCard];
            }];
        }else{
            [UIView transitionWithView:self.previewView duration: 0.5 options: UIViewAnimationOptionTransitionFlipFromRight animations: nil completion:^(BOOL finished) {
                [self flipCard];
            }];
            
        }
        
    }
    
- (void)flipCard
    {
        //重新开始计时
        [timer invalidate];
        timer = nil;
        //初始化一个计时器每两秒钟检测一次人脸
        timer = [NSTimer scheduledTimerWithTimeInterval:1.2f target:self selector:@selector(faceDetectFunction) userInfo:nil repeats:YES];
    }
    
-(void)dealloc
    {
        [self.captureService stopRunning];
        self.captureService = nil;
        [timer invalidate];
        timer = nil;
    }
    
    
- (void)viewWillAppear:(BOOL)animated
    {
        [super viewWillAppear:animated];
        
        //[self.navigationController.navigationBar setHidden:YES];
        
        self.view.backgroundColor = [UIColor grayColor];
        
        [self initUI];
        
        [self setupPreviewView];
        
    }
    
- (void)viewWillDisappear:(BOOL)animated
    {
        [super viewWillDisappear:animated];
        [self.captureService stopRunning];
        isRunning = NO;
        
        [timer invalidate];
        timer = nil;
        // [self.navigationController.navigationBar setHidden:NO];
    }
    
- (void)setupPreviewView
    {
        self.previewLayer = self.captureService.previewLayer;
        
        [self.previewLayer setFrame:[self.previewView bounds]];
        
        [self.previewView.layer addSublayer:self.previewLayer];
        
    }
    
#pragma mark - WBCaptureServiceDelegate
- (void)captureService:(WBCaptureService *)captureService didStopRunningWithError:(NSError *)error
    {
        NSLog(@"didStopRunningWithError");
    }
    
    // Preview
- (void)captureService:(WBCaptureService *)captureService previewPixelBufferReadyForDisplay:(CVPixelBufferRef)previewPixelBuffer
    {
        NSLog(@"previewPixelBufferReadyForDisplay");
        
        CVPixelBufferRef  imageBuffer = previewPixelBuffer;
        
        CVPixelBufferLockBaseAddress(previewPixelBuffer,0);
        uint8_t *baseAddress = (uint8_t *)CVPixelBufferGetBaseAddress(imageBuffer);
        size_t bytesPerRow = CVPixelBufferGetBytesPerRow(imageBuffer);
        size_t width = CVPixelBufferGetWidth(imageBuffer);
        size_t height = CVPixelBufferGetHeight(imageBuffer);
        
        CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
        CGContextRef newContext = CGBitmapContextCreate(baseAddress,
                                                        width, height, 8, bytesPerRow, colorSpace,
                                                        kCGBitmapByteOrder32Little | kCGImageAlphaPremultipliedFirst);
        CGImageRef newImage = CGBitmapContextCreateImage(newContext);
        
        CGContextRelease(newContext);
        CGColorSpaceRelease(colorSpace);
        
        //由于这段代码中，设备是home在下进行录制，所以此处在生成image时，指定了方向
        UIImage *image = [UIImage imageWithCGImage:newImage scale:1.0 orientation:UIImageOrientationRight];
        
        if (isDetecting&&!isWorking) {
            
            self.titleLabel.hidden = NO;
            if (![self.activityView isAnimating]) {
                [self.activityView startAnimating];
            }
            
            [self faceRecognizer:image];
            
            
            isDetecting = NO;
        }
        
        // image = nil;
        CGImageRelease(newImage);
        
        CVPixelBufferUnlockBaseAddress(imageBuffer,0);
    }
    
- (void)captureServiceDidRunOutOfPreviewBuffers:(WBCaptureService *)captureService
    {
        NSLog(@"captureServiceDidRunOutOfPreviewBuffers");
    }
    
    // Recording
- (void)captureServiceRecordingDidStart:(WBCaptureService *)captureService
    {
        NSLog(@"captureServiceRecordingDidStart");
    }
    
- (void)captureService:(WBCaptureService *)captureService recordingDidFailWithError:(NSError *)error
    {
        NSLog(@"recordingDidFailWithError");
    }
    
- (void)captureServiceRecordingWillStop:(WBCaptureService *)captureService
    {
        NSLog(@"captureServiceRecordingWillStop");
    }
    
- (void)captureServiceRecordingDidStop:(WBCaptureService *)captureService
    {
        NSLog(@"captureServiceRecordingDidStop");
    }
    
    
#pragma mark - 人脸检测
- (void)faceRecognizer:(UIImage *)image
    {
        isWorking = YES;
        
        //NSLog(@"原始Size:%@,大小:%lu",NSStringFromCGSize(image.size),UIImagePNGRepresentation(image).length/1024);
        NSString *auth = [Auth appSign:1000000 userId:nil];
        TXQcloudFrSDK *sdk = [[TXQcloudFrSDK alloc] initWithName:[Conf instance].appId authorization:auth endPoint:[Conf instance].API_END_POINT];
        
        // ******
        //[image imageByScalingProportionallyToSize:CGSizeMake(180, 180)];
        UIImage *compassImage = [UIImage scaleAndRotateImage:image maxPixelResolution:360];
        
        //NSLog(@"大小:%lu",UIImagePNGRepresentation(compassImage).length/1024);
        [sdk detectFace:compassImage successBlock:^(id responseObject) {
            isWorking = NO;
            NSDictionary *dict = responseObject;
            
            NSLog(@"人脸检测成功:%@",dict);
            NSInteger errorcode = [dict[@"errorcode"] integerValue];
            NSArray *face = dict[@"face"];
            
            if (face.count && errorcode ==0 ) {
                dispatch_async(dispatch_get_main_queue(), ^{
                    [self.captureService stopRunning];
                    [timer invalidate];
                    
                    isRunning = NO;
                    if (self.successBlock) {
                        if (!isPassed) {
                            
                            //  [ToastUtils showLong:@"识别成功！"];
                            isPassed = YES;
                            NSDictionary *faceDetail = face[0];
                            
                            [self performSelectorOnMainThread:@selector(changeActivity) withObject:nil waitUntilDone:NO];
                            [self uploadFile:UIImageJPEGRepresentation(compassImage,0.76f) Image:[compassImage imageAtRect:CGRectMake([faceDetail[@"x"] integerValue]-35, [faceDetail[@"y"] integerValue]-60, [faceDetail[@"width"] integerValue]+70, [faceDetail[@"height"] integerValue]+70)] Dict:faceDetail];
                            
                        }
                    }
                    
                });
            }
            
        } failureBlock:^(NSError *error) {
            isWorking = NO;
            NSLog(@"---error：%@",error);
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.captureService stopRunning];
                isRunning = NO;
                if (self.successBlock) {
                    if (!isPassed) {
                        
                        [ToastUtils showLong:@"识别失败！"];
                        isPassed = YES;
                        self.successBlock(nil,nil);
                        [self dismissViewControllerAnimated:YES completion:nil];
                    }
                }
                
            });
        }];
    }
    
#pragma mark - 上传图片
- (void)uploadFile:(NSData *)imageData Image:(UIImage *)formatImg Dict:(NSDictionary *)dict
    {
        
        //上传任务 https://oss-cn-shanghai.aliyuncs.com
        OSSPutObjectRequest * put = [OSSPutObjectRequest new];
        
        put.bucketName = @"handbk";
        put.objectKey = [NSString stringWithFormat:@"%lf.jpg",[[NSDate date] timeIntervalSince1970]];
        
        put.uploadingData = imageData; // 直接上传NSData
        
        put.uploadProgress = ^(int64_t bytesSent, int64_t totalByteSent, int64_t totalBytesExpectedToSend) {
            NSLog(@"上传阿里%lld, %lld, %lld", bytesSent, totalByteSent, totalBytesExpectedToSend);
        };
        
        OSSTask * putTask = [client putObject:put];//aliyunPath
        
        NSMutableDictionary *mutiDict = [NSMutableDictionary dictionaryWithDictionary:dict];
        [mutiDict setObject:[NSString stringWithFormat:@"https://handbk.oss-cn-shanghai.aliyuncs.com/%@",put.objectKey] forKey:@"aliyunPath"];
        
        [putTask continueWithBlock:^id(OSSTask *task) {
            dispatch_async(dispatch_get_main_queue(), ^{
                [MBProgressHUD hideHUDForView:self.view animated:YES];
                [self dismissViewControllerAnimated:YES completion:nil];
            });
            if (!task.error) {
                NSLog(@"upload object success!");
            } else {
                NSLog(@"upload object failed, error: %@" , task.error);
                [mutiDict setObject:@"" forKey:@"aliyunPath"];
            }
            if (self.successBlock) {
                self.successBlock(formatImg,mutiDict);
            }
            return nil;
        }];
        
    }
    
- (void)showMessage:(NSString *)message
    {
        UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"提示" message:message preferredStyle:UIAlertControllerStyleAlert];
        [alertController addAction:[UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            
        }]];
        [self presentViewController:alertController animated:YES completion:nil];
    }
    @end
