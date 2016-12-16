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


@interface FaceVideoDectorViewController ()<WBCaptureServiceDelegate>
{
    BOOL isDefaultDirection;
    BOOL isRunning;
    BOOL isDetecting;
    NSTimer *timer;
    BOOL isPassed;
    BOOL isWorking;
}
@property (nonatomic,strong)WBCaptureService *captureService;
@property (nonatomic,strong) AVCaptureVideoPreviewLayer *previewLayer;
@property (nonatomic,strong)UIImage *recognizerImg;
@property (nonatomic,strong)UIView* previewView;
@property (nonatomic,strong)UILabel *timeLabel;
@property (nonatomic,strong)UIButton *backBtn;
@property (nonatomic,strong)UIButton *switchBtn;
@property (nonatomic,strong)ZLProgressHUD *progress;
@end

@implementation FaceVideoDectorViewController
- (ZLProgressHUD *)progress
{
    if (!_progress) {
        _progress = [[ZLProgressHUD alloc]init];
    }
    return _progress;
}
- (WBCaptureService*)captureService
{
    if (!_captureService) {
        _captureService = [[WBCaptureService alloc] init];
        [_captureService setDelegate:self callbackQueue:dispatch_get_main_queue()];
        _captureService.captureType = WBCaptureType_Video;
        
        _captureService.renderingEnabled = YES;
        _captureService.shouldSaveToAlbum = NO;
        _captureService.shouldRecordAudio = YES;
        _captureService.preferedDevicePosition = isDefaultDirection?AVCaptureDevicePositionFront:AVCaptureDevicePositionBack;
    }
    return _captureService;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    
    isDefaultDirection = YES;
    [self.captureService startRunning];
    isRunning = YES;
    
    //初始化一个计时器每两秒钟检测一次人脸
    timer = [NSTimer scheduledTimerWithTimeInterval:0.6f repeats:YES block:^(NSTimer * _Nonnull timer) {
        isDetecting = YES;
    }];
    
    AFNetworkReachabilityStatus status = [[AFNetworkReachabilityManager sharedManager] networkReachabilityStatus];
    if (status==AFNetworkReachabilityStatusNotReachable) {
        [ToastUtils showAtTop:@"当前网络环境不好，请检查网络！"];
    }
    
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
    
}

#pragma mark - 隐藏状态栏
-(BOOL)prefersStatusBarHidden
{
    return YES;
}

- (void)dismissViewController
{
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
    CATransform3D rotationTransform = CATransform3DMakeRotation(M_PI_2, 0, 0, 1);
    CABasicAnimation* rotationAnimation =
    [CABasicAnimation animationWithKeyPath:@"transform.rotation.y"];//"z"还可以是“x”“y”，表示沿z轴旋转
    rotationAnimation.toValue = [NSValue valueWithCATransform3D:rotationTransform];
    
    rotationAnimation.duration = 1.5f;
    rotationAnimation.timingFunction = [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionLinear]; //缓入缓出
    rotationAnimation.cumulative = YES;
    
    [self.previewLayer addAnimation:rotationAnimation forKey:@"rotate"];
    
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
    if (self.captureService) {
        [self.captureService stopRunning];
        isRunning = NO;
    }
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
    [self.progress show];
    NSString *auth = [Auth appSign:1000000 userId:nil];
    TXQcloudFrSDK *sdk = [[TXQcloudFrSDK alloc] initWithName:[Conf instance].appId authorization:auth endPoint:[Conf instance].API_END_POINT];
    
    [sdk detectFace:[image compressedImage] successBlock:^(id responseObject) {
        isWorking = NO;
        NSDictionary *dict = responseObject;
        
        NSLog(@"人脸检测成功:%@",dict);
        NSInteger errorcode = [dict[@"errorcode"] integerValue];
        NSArray *face = dict[@"face"];
        if (face.count && errorcode ==0 ) {
            dispatch_async(dispatch_get_main_queue(), ^{
                [self.captureService stopRunning];
                isRunning = NO;
                if (self.successBlock) {
                    if (!isPassed) {
                        if ([self.progress isShowing]) {
                            [self.progress hide];
                        }
                        [ToastUtils showLong:@"识别成功！"];
                        isPassed = YES;
                        self.successBlock([UIImage imageWithData:[image compressedData]],face[0]);
                        [self dismissViewControllerAnimated:YES completion:nil];
                    }
                }
                
            });
        }
        
    } failureBlock:^(NSError *error) {
        isWorking = NO;
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.captureService stopRunning];
            isRunning = NO;
            if (self.successBlock) {
                if (!isPassed) {
                    if ([self.progress isShowing]) {
                        [self.progress hide];
                    }
                    [ToastUtils showLong:@"识别失败！"];
                    isPassed = YES;
                    self.successBlock([UIImage imageWithData:[image compressedData]],nil);
                    [self dismissViewControllerAnimated:YES completion:nil];
                }
            }
            
        });
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
