//
//  ImageRotateViewController.m
//  HelloCordova
//
//  Created by 吴笑诚 on 2016/10/21.
//
//

#import "ImageRotateViewController.h"

#define SCREEN_HEIGHT [UIScreen mainScreen].bounds.size.height
#define SCREEN_WIDTH [UIScreen mainScreen].bounds.size.width



// 版本适配
#define DEV_iOS_5_Or_Later    ([[[UIDevice currentDevice] systemVersion] floatValue] >= 5.0)
#define DEV_iOS_6_Or_Later    ([[[UIDevice currentDevice] systemVersion] floatValue] >= 6.0)
#define DEV_iOS_7_Or_Later    ([[[UIDevice currentDevice] systemVersion] floatValue] >= 7.0)
#define DEV_iOS_8_Or_Later    ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0)
#define DEV_iOS_9_Or_Later    ([[[UIDevice currentDevice] systemVersion] floatValue] >= 9.0)

@interface ImageRotateViewController ()

@end

@implementation ImageRotateViewController



- (id) initWithImagePath:(NSString*)imagePath {
    self = [super init];
    if (self) {
        _imagePath = imagePath;
        
       
    }
    return self;
}


- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    
    
    self.title = @"照片旋转";
    
    // 创建 barButtonItem
    UIBarButtonItem *backItem = [[UIBarButtonItem alloc] initWithTitle:@"返回" style:UIBarButtonItemStyleBordered target:self action:@selector(backAction)];
    UIBarButtonItem *refreshItem = [[UIBarButtonItem alloc] initWithTitle:@"完成" style:UIBarButtonItemStyleBordered target:self action:@selector(delegateAction)];
    self.navigationItem.leftBarButtonItem = backItem;
    self.navigationItem.rightBarButtonItem = refreshItem;
    
    if (DEV_iOS_7_Or_Later) {
        self.edgesForExtendedLayout = UIRectEdgeNone;
        self.automaticallyAdjustsScrollViewInsets = NO;
    }
    
    
    
//    [self buttonToUnuse:_clockwise90Button];
    
    [_scrollView setDelegate:self];
    [_scrollView setBounces:NO];
    [_scrollView setShowsHorizontalScrollIndicator:NO];
    [_scrollView setShowsVerticalScrollIndicator:NO];
    
    //_scrollView.bouncesZoom=NO;
    //
    [self.scrollView setDelegate:self];

    
    self.imageView = [[UIImageView alloc] init];
//    [self.imageView setImage:[UIImage imageNamed:@"image.png"]];
    
    NSData * data = [[NSData alloc]initWithContentsOfURL:[NSURL URLWithString:_imagePath]];
    UIImage *image = [[UIImage alloc]initWithData:data];
    [self.imageView setImage:image];
    
    self.scrollView.contentSize=self.imageView.image.size;
    
    //self.scrollView.contentSize=CGSizeMake(320,1000);
    
    self.imageView.frame=CGRectMake(0, 0, self.imageView.image.size.width, self.imageView.image.size.height);
    
    //    UIImageOrientation t1 =   [UIImage imageNamed:@"image.jpg"].imageOrientation;
    //    UIImageOrientation t2 =   [UIImage imageNamed:@"image2.jpg"].imageOrientation;
    //    UIImageOrientation t3 =   [UIImage imageNamed:@"test2.jpg"].imageOrientation;
    //
    
    [self.scrollView addSubview:_imageView];
    
    [self updateZoomScaleInit];
    
    
    
    
    
    [self.view addSubview:_toolBarView];
    
    
    CGRect toolbarViewFrame = _toolBarView.frame;
    toolbarViewFrame.size.width = [UIScreen mainScreen].bounds.size.width;
    toolbarViewFrame.origin.y = (SCREEN_HEIGHT-toolbarViewFrame.size.height-60)/2;

    _toolBarView.frame = toolbarViewFrame;

    
    
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}




// 设置缩放参数 范围
- (void)updateZoomScale {
    CGFloat width = self.imageView.image.size.width;
    CGFloat height = self.imageView.image.size.height;
    

    [[self imageView] setFrame:CGRectMake(0, 0, width, height)];
    
    CGFloat xScale = SCREEN_WIDTH / width;
    CGFloat yScale = (SCREEN_HEIGHT) / height;
    
    CGFloat min = MAX(xScale, yScale);
    CGFloat max = 1.0;
    if ([[UIScreen mainScreen] respondsToSelector:@selector(scale)]) {
        max = 1.0 / [[UIScreen mainScreen] scale];
    }
    
    if (min > max) {
        min = max;
    }
    
//    max = min;
    
    
    
    [[self scrollView] setMinimumZoomScale:min ];
    [[self scrollView] setMaximumZoomScale:max + 2.0f];
    
    
    
    CGFloat y_offset = (SCREEN_HEIGHT-height*min)/2-64;
    CGFloat x_offset = (SCREEN_WIDTH-width*min)/2;
    
    [[self imageView] setFrame:CGRectMake(x_offset, y_offset, width*min, height*min)];


    self.scrollView.contentSize=self.imageView.image.size;

    

    [[self scrollView] setZoomScale:min animated:NO];
    
//    
//    CGFloat y = (SCREEN_HEIGHT-60-height)/2;
//    CGFloat x = (SCREEN_WIDTH-width)/2;
//
//    
//    CGFloat right =SCREEN_WIDTH- width - x;
//    CGFloat bottom = SCREEN_HEIGHT-60- height - y;
//
//    _imageInset = UIEdgeInsetsMake(y, x, bottom, right);
//    [[self scrollView] setContentInset:_imageInset];
//
//    [[self scrollView] setContentOffset:CGPointMake(0, y)];

}


- (void)updateZoomScaleInit {
    CGFloat width = self.imageView.image.size.width;
    CGFloat height = self.imageView.image.size.height;
    
    
    CGFloat xScale = SCREEN_WIDTH / width;
    CGFloat yScale = (SCREEN_HEIGHT) / height;
    
    CGFloat min = MAX(xScale, yScale);
    CGFloat max = 1.0;
    if ([[UIScreen mainScreen] respondsToSelector:@selector(scale)]) {
        max = 1.0 / [[UIScreen mainScreen] scale];
    }
    
    if (min > max) {
        min = max;
    }
    
    //    max = min;
    CGFloat y_offset = (SCREEN_HEIGHT-height*min)/2-64;
    CGFloat x_offset = (SCREEN_WIDTH-width*min)/2;
    
    [[self imageView] setFrame:CGRectMake(x_offset, y_offset, width, height)];

    
    [[self scrollView] setMinimumZoomScale:min ];
    [[self scrollView] setMaximumZoomScale:max + 2.0f];
    
    
    
    //self.scrollView.contentSize=CGSizeMake(320,1000);
    //    [self.scrollView setContentSize:_imageView.image.size];
    
    
//    self.imageView.frame=CGRectMake(0, 100, self.imageView.image.size.width, self.imageView.image.size.height);
    
    self.scrollView.contentSize=self.imageView.image.size;
    
    
    
    [[self scrollView] setZoomScale:min animated:NO];
    
}


//
//- (void)setCropSize:(CGSize)size {
//    _cropSize = size;
//    [self updateZoomScale];
//    
//    CGFloat width = _cropSize.width;
//    CGFloat height = _cropSize.height;
//    //[[UIScreen mainScreen] bounds].size.width
//    //[[UIScreen mainScreen] bounds].size.height
//    
//    CGRect screenFrame = [[UIScreen mainScreen] bounds];
//    
//    CGFloat x = (CGRectGetWidth(screenFrame) - width) / 2;
//    CGFloat y = (CGRectGetHeight(screenFrame) - height) / 2-60;
//    
//    [ self.cropMaskView initCropSize:_cropSize frame:screenFrame];
//    
//    
//    CGFloat top = y;
//    CGFloat left = x;
//    CGFloat right = CGRectGetWidth(screenFrame)- width - x;
//    CGFloat bottom = CGRectGetHeight(screenFrame)-60- height - y;
//    _imageInset = UIEdgeInsetsMake(top, left, bottom-5, right);
//    [[self scrollView] setContentInset:_imageInset];
//    
//    [[self scrollView] setContentOffset:CGPointMake(0, 0)];
//}



#pragma mark - 返回
-(void)backAction
{
    //    [self.navigationController popViewControllerAnimated:YES];
    
    [self.navigationController dismissViewControllerAnimated:YES completion:nil];
    
    if (_delegate) {
        [_delegate nativeViewDismissFaild:@"取消了操作"];
    }
}

#pragma mark - 完成
- (void)delegateAction {
    
//    NSData *data = UIImagePNGRepresentation([self cropImage]);
//    
//    NSString* imageUrl = [NSString stringWithFormat:@"%@/Documents/test.png", NSHomeDirectory()];
//    
//    [data writeToFile: imageUrl atomically:YES];
    

    NSData *data = UIImagePNGRepresentation(_imageView.image);

    NSString* imageUrl = [NSString stringWithFormat:@"%@/Documents/test2.png", NSHomeDirectory()];

    [data writeToFile: imageUrl atomically:YES];

//    _imageView.image = testimage;

    
    
    //    [self.navigationController popViewControllerAnimated:YES];
    [self.navigationController dismissViewControllerAnimated:YES completion:nil];
    
    
    if (_delegate) {
        [_delegate nativeViewDismissSuccess:imageUrl];
    }
    
}



- (void) buttonToUnuse:(UIButton*) button {
    [button setUserInteractionEnabled:NO];
    [button setAlpha:0.5];
}

- (void) buttonToUse:(UIButton*) button {
    [button setUserInteractionEnabled:YES];
    [button setAlpha:1];
}



#pragma mark --UIScrollViewDelegate

- (UIView *)viewForZoomingInScrollView:(UIScrollView *)scrollView
//返回需要zoom的view
{
    //如果想要scrollview 实现缩放 则需要给scrollview.delegate 对一个UIScrollViewDelegate 对象
    //且 此对象需要覆写viewForZoomingInScrollView 方法。
    //总结:只有 scrollview的delegate复写了viewForZoomingInScrollView scrollview才会缩放。
    return _imageView;
    return self.imageView;
    
    
}



/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

#pragma mark  - IBAction
- (IBAction)anticlockwise90ButtonPressed:(UIButton *)sender {
    //逆时针
//    _image = [UIImage imageWithCGImage:_imageView.image.CGImage scale:1 orientation:UIImageOrientationLeft];
//    _imageView.image = _image;
//    
//    NSData *data = UIImagePNGRepresentation(_image);
//    
//    NSString* imageUrl = [NSString stringWithFormat:@"%@/Documents/test.png", NSHomeDirectory()];
//    
//    [data writeToFile: imageUrl atomically:YES];
//    
//    UIImage* testimage = [[UIImage alloc] init];
//    testimage = [self image:_image rotation:UIImageOrientationRight];
//
//
//    _imageView.image = testimage;
//    [self updateZoomScale];
    
    
    
    _image = _imageView.image;
    UIImage* testimage = [[UIImage alloc] init];
    testimage = [self image:_image rotation:UIImageOrientationLeft];
    
//    
//    NSData *data = UIImagePNGRepresentation(testimage);
//    
//    NSString* imageUrl = [NSString stringWithFormat:@"%@/Documents/test2.png", NSHomeDirectory()];
//    
//    [data writeToFile: imageUrl atomically:YES];
//    
    _imageView.image = testimage;
    
    
    [self updateZoomScale];


}

- (IBAction)clockwise90ButtonPressed:(UIButton *)sender {
    
//    _image = [UIImage imageWithCGImage:_imageView.image.CGImage scale:1 orientation:UIImageOrientationRight];
//    _imageView.image = _image;
    
//    NSData *data = UIImagePNGRepresentation(_image);
//    
//    NSString* imageUrl = [NSString stringWithFormat:@"%@/Documents/test1.png", NSHomeDirectory()];
    
    //[data writeToFile: imageUrl atomically:YES];
    
    
    _image = _imageView.image;
    UIImage* testimage = [[UIImage alloc] init];
    testimage = [self image:_image rotation:UIImageOrientationRight];
    

    NSData *data = UIImagePNGRepresentation(testimage);
    
    NSString* imageUrl = [NSString stringWithFormat:@"%@/Documents/test2.png", NSHomeDirectory()];
    
    //[data writeToFile: imageUrl atomically:YES];
    
    _imageView.image = testimage;
    
    
    [self updateZoomScale];



    
//    _imageView = [[UIImageView alloc]init];
//    _imageView.frame = CGRectMake(50, 50, 200, 200);
//    _imageView.image = [UIImage imageNamed:@"image.jpg"];
//    [self.view addSubview:_imageView];
//    
//    
//    CGAffineTransform transform= CGAffineTransformMakeRotation(M_PI*0.1);
//    /*关于M_PI
//     #define M_PI     3.14159265358979323846264338327950288
//     这里只是使用他的圆形视图，还有很多种类型 可以自行搜索CGAffineTransform
//     其实它就是圆周率的值，在这里代表弧度，相当于角度制 0-360 度，M_PI=180度
//     旋转方向为：顺时针旋转
//     
//     */
//    _imageView.transform = transform;//旋转
//    
//    [NSTimer scheduledTimerWithTimeInterval: 0.01 target: self selector:@selector(transformAction) userInfo: nil repeats: YES];
    


}

-(void)transformAction {
    _angle = _angle + 0.01;//angle角度 double angle;
    if (_angle > 6.28) {//大于 M_PI*2(360度) 角度再次从0开始
        _angle = 0;
    }
    CGAffineTransform transform=CGAffineTransformMakeRotation(_angle);
    _imageView.transform = transform;
}


//提前设置得到图片方向
-(UIImage *)image:(UIImage *)image rotation:(UIImageOrientation)orientation
{
    double rotate =0.0;
    CGRect rect;
    float translateX =0;
    float translateY =0;
    float scaleX =1.0;
    float scaleY =1.0;
    
    switch (orientation) {
        case UIImageOrientationLeft:
            rotate = M_PI_2;
            rect = CGRectMake(0,0, image.size.height, image.size.width);
            translateX = 0;
            translateY = -rect.size.width;
            scaleY = rect.size.width/rect.size.height;
            scaleX = rect.size.height/rect.size.width;
            break;
        case UIImageOrientationRight:
            rotate = 3 *M_PI_2;
            rect = CGRectMake(0,0, image.size.height, image.size.width);
            translateX = -rect.size.height;
            translateY = 0;
            scaleY = rect.size.width/rect.size.height;
            scaleX = rect.size.height/rect.size.width;
            break;
        case UIImageOrientationDown:
            rotate = M_PI;
            rect = CGRectMake(0,0, image.size.width, image.size.height);
            translateX = -rect.size.width;
            translateY = -rect.size.height;
            break;
        default:
            rotate = 0.0;
            rect = CGRectMake(0,0, image.size.width, image.size.height);
            translateX = 0;
            translateY = 0;
            break;
    }
    
    UIGraphicsBeginImageContext(rect.size);
    CGContextRef context =UIGraphicsGetCurrentContext();
    //做CTM变换
    CGContextTranslateCTM(context,0.0, rect.size.height);
    CGContextScaleCTM(context,1.0, -1.0);
    CGContextRotateCTM(context, rotate);
    CGContextTranslateCTM(context, translateX, translateY);
    
    CGContextScaleCTM(context, scaleX, scaleY);
    //绘制图片
    CGContextDrawImage(context,CGRectMake(0,0, rect.size.width, rect.size.height), image.CGImage);
    
    UIImage *newPic =UIGraphicsGetImageFromCurrentImageContext();
    
    return newPic;
}
@end
