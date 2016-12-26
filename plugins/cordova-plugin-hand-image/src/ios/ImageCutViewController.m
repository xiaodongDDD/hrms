//
//  ImageCutViewController.m
//  HelloCordova
//
//  Created by 吴笑诚 on 2016/10/19.
//
//

#import "ImageCutViewController.h"

#define SCREEN_HEIGHT [UIScreen mainScreen].bounds.size.height
#define SCREEN_WIDTH [UIScreen mainScreen].bounds.size.width



// 版本适配
#define DEV_iOS_5_Or_Later    ([[[UIDevice currentDevice] systemVersion] floatValue] >= 5.0)
#define DEV_iOS_6_Or_Later    ([[[UIDevice currentDevice] systemVersion] floatValue] >= 6.0)
#define DEV_iOS_7_Or_Later    ([[[UIDevice currentDevice] systemVersion] floatValue] >= 7.0)
#define DEV_iOS_8_Or_Later    ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0)
#define DEV_iOS_9_Or_Later    ([[[UIDevice currentDevice] systemVersion] floatValue] >= 9.0)

@interface ImageCutViewController ()<UIScrollViewDelegate>

@end

@implementation ImageCutViewController



- (id) initWithImagePath:(NSString*)imagePath width:(NSInteger)width height: (NSInteger)height {
    self = [super init];
    if (self) {
        _imagePath = imagePath;
        
        if (!width || !height) {
            _cropSize = CGSizeMake(100, 200);

        }
        else {
            _cropSize = CGSizeMake(width, height);

        }
        _pageTitle = @"";
        _showToolBarView = YES;
    }
    return self;
}


- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    
    if (!_pageTitle  || [_pageTitle isEqualToString:@""]) {
        self.title = @"照片裁剪";
    }
    else {
        self.title = _pageTitle;
    }
    
    // 创建 barButtonItem
    UIBarButtonItem *backItem = [[UIBarButtonItem alloc] initWithTitle:@"返回" style:UIBarButtonItemStyleBordered target:self action:@selector(backAction)];
    UIBarButtonItem *refreshItem = [[UIBarButtonItem alloc] initWithTitle:@"完成" style:UIBarButtonItemStyleBordered target:self action:@selector(delegateAction)];
    self.navigationItem.leftBarButtonItem = backItem;
    self.navigationItem.rightBarButtonItem = refreshItem;
    
    if (DEV_iOS_7_Or_Later) {
        self.edgesForExtendedLayout = UIRectEdgeNone;
        self.automaticallyAdjustsScrollViewInsets = NO;
    }

    
    _previewView.frame = CGRectMake(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT-64);
    _previewScrollView.delegate = self;
    
    [self buttonToUnuse:_redoButton];

    
    CGRect frameScrollView = _scrollView.frame;
    frameScrollView.size.width = 1000;
    frameScrollView.size.height = 1000;
    //_scrollView.frame = frameScrollView;
    
    
    [_scrollView setBounces:NO];
    [_scrollView setShowsHorizontalScrollIndicator:NO];
    [_scrollView setShowsVerticalScrollIndicator:NO];
    
//
    [self setZoomEnable:YES];
    
    self.imageView = [[UIImageView alloc] init];
    
    NSData * data = [[NSData alloc]initWithContentsOfURL:[NSURL URLWithString:_imagePath]];
    UIImage *image = [[UIImage alloc]initWithData:data];
    [self.imageView setImage:image];

    
    self.scrollView.contentSize=self.imageView.image.size;
    
    //self.scrollView.contentSize=CGSizeMake(320,1000);

    self.imageView.frame=CGRectMake(0, 0, self.imageView.image.size.width, self.imageView.image.size.height);
    //如果不加这句的话
    
    //那么正常拖动是可以的，但是如果zoom了 就会有问题
    
    //zoom发生后会把frame变成当前显示大小[imageview默认大小 屏幕显示大小 如是全屏则就是全屏大小] zoom变化导致frame同步改变了image的size 大小为frame大小
    
    //image 的size改变后导致self.scrollView.contentSize 变成了frame的大小  从而contentSize变小了 无法实现正常拖动。
    
    //然后根据zoom缩放比例变化。而不是根据实际图片大小。这么导致zoom后就无法拖动了[因为frame大小]
    
    
    
    [self.scrollView addSubview:_imageView];

    
//    //设置最大伸缩比例
//    self.scrollView.maximumZoomScale=2.0;
//    //设置最小伸缩比例
//    self.scrollView.minimumZoomScale=0.5;
    [self.scrollView setDelegate:self];


    
    if ( _masktype == kMASK_TYPE_CIRCLE) {
        _cropMaskView = [[CropCircleVMaskiew alloc] initWithFrame:self.scrollView.bounds];
    }
    else {
        _cropMaskView = [[CropMaskView alloc] initWithFrame:self.scrollView.bounds];
    }
    
    [self.cropMaskView initCropSize:_cropSize frame:self.view.bounds];
    [self.view addSubview:self.cropMaskView];
    
    [_cropMaskView setBackgroundColor:[UIColor clearColor]];
    [_cropMaskView setUserInteractionEnabled:NO];
    [self.view bringSubviewToFront:_cropMaskView];

    
    
    //[self updateZoomScale];
    
    [self setCropSize:_cropSize];
    
    
    
    UIButton *btn = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    [btn setFrame:CGRectMake(80, 31, 150, 31)];
    [btn setTitle:@"crop and save" forState:UIControlStateNormal];
    
    //[self.view addSubview:btn];
    
    if (_showToolBarView) {
        [self.view addSubview:_toolBarView];
    }
    
    [btn addTarget:self action:@selector(lock) forControlEvents:UIControlEventTouchUpInside];

    CGRect toolbarViewFrame = _toolBarView.frame;
    toolbarViewFrame.size.width = [UIScreen mainScreen].bounds.size.width;
    _toolBarView.frame = toolbarViewFrame;
    
    
    NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
    
    _imageExtCount = [userDefault integerForKey:@"imageExtCount"];
    


}


#pragma mark - IBAction

- (IBAction)lockPreviewButtonPressed:(UIButton *)sender {
    
    _cropMaskView.maskAlpha = 1;
    [_scrollView setScrollEnabled:NO];
    [self setZoomEnable:NO];

    [_scrollView setBouncesZoom:NO];
    [self buttonToUnuse:_previewButton];
    [self buttonToUse:_redoButton];
    [_cropMaskView setNeedsDisplay];
//    if (!_previewImageView) {
//        self.previewImageView = [[UIImageView alloc] init];
//
//    }
//    
//    UIImage* image = [self cropImage];
//    
//    //UIImageView* pImageView =[[UIImageView alloc] initWithImage:[self cropImage]];
//    
//    [self.previewImageView setImage:image];
//    
//    //_previewImageView.image = [self cropImage];
//    _previewScrollView.contentSize=self.previewImageView.image.size;
//    
//    //self.scrollView.contentSize=CGSizeMake(320,1000);
//    CGFloat x= (_previewView.bounds.size.width-image.size.width)/2;
//    CGFloat y= (_previewView.bounds.size.height-image.size.height)/2;
//    
//    
//    self.previewImageView.frame=CGRectMake(x, y, image.size.width, image.size.height);
//    
//    
//    [self.view addSubview:_previewView];
//    [_previewScrollView addSubview:self.previewImageView];

    

    
//    [[self scrollView] setZoomScale:1 animated:YES];

//        NSData *data = UIImagePNGRepresentation([_cropImageView cropImage]);
//    
//        [data writeToFile:[NSString stringWithFormat:@"%@/Documents/test.png", NSHomeDirectory()] atomically:YES];

}


- (IBAction)redoButtonPressed:(UIButton *)sender {
    [_scrollView setScrollEnabled:YES];
    [self setZoomEnable:NO];

    [_cropMaskView restMaskAlpha];
    
    [self buttonToUnuse:_redoButton];
    [self buttonToUse:_previewButton];
    [_cropMaskView setNeedsDisplay];

    
//    [_previewImageView removeFromSuperview];
//    [_previewView removeFromSuperview];

}


- (void) buttonToUnuse:(UIButton*) button {
    [button setUserInteractionEnabled:NO];
    [button setAlpha:0.5];
}

- (void) buttonToUse:(UIButton*) button {
    [button setUserInteractionEnabled:YES];
    [button setAlpha:1];
}



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
    
    NSData *data = UIImagePNGRepresentation([self cropImage]);
    
    _imageExtCount = _imageExtCount%10+1;
    NSString* imageUrl = [NSString stringWithFormat:@"%@/tmp/crop%ld.png", NSHomeDirectory(), (long)_imageExtCount];
    
    [data writeToFile: imageUrl atomically:YES];
    
    NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
    
    [userDefault setInteger:_imageExtCount forKey:@"imageExtCount"];

    
#ifdef DEBUG
    NSLog(@"url %@", imageUrl);
#endif


    
//    [self.navigationController popViewControllerAnimated:YES];
    [self.navigationController dismissViewControllerAnimated:YES completion:nil];
    
    
    if (_delegate) {
        [_delegate nativeViewDismissSuccess:imageUrl];
    }

}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark --UIScrollViewDelegate

- (UIView *)viewForZoomingInScrollView:(UIScrollView *)scrollView
//返回需要zoom的view
{
    //如果想要scrollview 实现缩放 则需要给scrollview.delegate 对一个UIScrollViewDelegate 对象
    //且 此对象需要覆写viewForZoomingInScrollView 方法。
    //总结:只有 scrollview的delegate复写了viewForZoomingInScrollView scrollview才会缩放。
    if (_boolZoomFlag) {
        return _imageView;

    }
    else {
        return nil;
    }
    //return self.imageView;
    
    
}

- (void) setZoomEnable:(BOOL) flag {
    _boolZoomFlag = flag;
}


// 设置缩放参数 范围
- (void)updateZoomScale {
    CGFloat width = self.imageView.image.size.width;
    CGFloat height = self.imageView.image.size.height;
    
    [[self imageView] setFrame:CGRectMake(0, 0, width, height)];
    
    CGFloat xScale = _cropSize.width / width;
    CGFloat yScale = _cropSize.height / height;
    
    CGFloat min = MAX(xScale, yScale);
    CGFloat max = 1.0;
    if ([[UIScreen mainScreen] respondsToSelector:@selector(scale)]) {
        //max = 1.0 / [[UIScreen mainScreen] scale];
    }
    
    if (min > max) {
        min = max;
    }
    
    [[self scrollView] setMinimumZoomScale:min];
    [[self scrollView] setMaximumZoomScale:max + 5.0f];
    
    
    CGRect screen = [ UIScreen mainScreen ].applicationFrame;
    CGFloat xInitScale =  screen.size.width / width;
    CGFloat yInitScale =  (screen.size.height-44) / height ;
    CGFloat minInit = MAX(xInitScale, yInitScale);

    if (min>minInit) {
        minInit = min;
    }
    
    [[self scrollView] setZoomScale:minInit animated:NO];
}


- (void)setCropSize:(CGSize)size {
    _cropSize = size;
    [self updateZoomScale];
    
    CGFloat width = _cropSize.width;
    CGFloat height = _cropSize.height;
    //[[UIScreen mainScreen] bounds].size.width
    //[[UIScreen mainScreen] bounds].size.height

    CGRect screenFrame = [[UIScreen mainScreen] bounds];
    
    CGFloat x = (CGRectGetWidth(screenFrame) - width) / 2;
    CGFloat y = (CGRectGetHeight(screenFrame) - height) / 2-64;
    
    [ self.cropMaskView initCropSize:_cropSize frame:screenFrame];

    
    CGFloat top = y;
    CGFloat left = x;
    CGFloat right = CGRectGetWidth(screenFrame)- width - x;
    CGFloat bottom = CGRectGetHeight(screenFrame)-64- height - y;
    _imageInset = UIEdgeInsetsMake(top, left, bottom, right);
    [[self scrollView] setContentInset:_imageInset];
    
    [[self scrollView] setContentOffset:CGPointMake(0, 0)];
}


- (UIImage *)cropImage {
    CGFloat zoomScale = [self scrollView].zoomScale;
    
    CGFloat offsetX = [self scrollView].contentOffset.x;
    CGFloat offsetY = [self scrollView].contentOffset.y;
    CGFloat aX = offsetX>=0 ? offsetX+_imageInset.left : (_imageInset.left - ABS(offsetX));
    CGFloat aY = offsetY>=0 ? offsetY+_imageInset.top : (_imageInset.top - ABS(offsetY));
    
    aX = aX / zoomScale;
    aY = aY / zoomScale;
    
    CGFloat aWidth =  MAX(_cropSize.width / zoomScale, _cropSize.width);
    CGFloat aHeight = MAX(_cropSize.height / zoomScale, _cropSize.height);
    
#ifdef DEBUG
    NSLog(@"%f--%f--%f--%f", aX, aY, aWidth, aHeight);
#endif
    
    UIImage *image = [_imageView.image cropImageWithX:aX y:aY width:aWidth height:aHeight];
    
    image = [image resizeToWidth:_cropSize.width height:_cropSize.height];
    
    return image;
}



/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
