//
//  WSShowBigImage.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/10.
//
//

#import "WSShowBigImage.h"
#import "WSPhotosTool.h"
#import "ToastUtils.h"
#import "UIImageView+WebCache.h"
static CGRect oldframe;
static CGRect newFrame;

@interface WSShowBigImage ()<UIScrollViewDelegate>
@property (nonatomic,strong)UIScrollView *imageScrollView;
@property (nonatomic,strong)UIImageView *imageView;
@end

@implementation WSShowBigImage

+(instancetype)sharedInstance
{
    static WSShowBigImage *wsShowBigImage;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        if (wsShowBigImage==nil) {
            wsShowBigImage = [[WSShowBigImage alloc] init];
        }
    });
    return wsShowBigImage;
}

- (void)showBigImage:(UIImageView *)selectedImageView Url:(NSString *)url
{
    UIImage *image = selectedImageView.image;
    
    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    UIView *backgroundView = [[UIView alloc]initWithFrame:CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height)];
    UILongPressGestureRecognizer *longTap = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(longTap:)];
    [longTap setMinimumPressDuration:1.5f];
    [backgroundView addGestureRecognizer:longTap];
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapDismiss:)];
    [backgroundView addGestureRecognizer:tap];
    
    //存储旧的frame
    oldframe = [selectedImageView convertRect:selectedImageView.bounds toView:window];
    
    newFrame = oldframe;
    
    //创建黑色背景
    backgroundView.backgroundColor = [UIColor blackColor];
    
    backgroundView.alpha = 0;
    [window addSubview:backgroundView];
    
    _imageScrollView  = [[UIScrollView alloc] init];
    _imageScrollView.frame = backgroundView.frame;
    [_imageScrollView setMaximumZoomScale:1.5];
    [_imageScrollView setMinimumZoomScale:0.3];
    _imageScrollView.delegate = self;
    [backgroundView addSubview:_imageScrollView];
    
    _imageView = [[UIImageView alloc]initWithFrame:oldframe];
    
    //设置圆角
    _imageView.layer.masksToBounds = YES;
    _imageView.layer.cornerRadius = 3.0f;
    
    _imageView.image = image;
    
    [_imageScrollView addSubview:_imageView];
    
    
    [UIView animateWithDuration:0.3 animations:^{
        _imageView.frame = CGRectMake(0,([UIScreen mainScreen].bounds.size.height-image.size.height*[UIScreen mainScreen].bounds.size.width/image.size.width)/2, [UIScreen mainScreen].bounds.size.width, image.size.height*[UIScreen mainScreen].bounds.size.width/image.size.width);
        backgroundView.alpha = 1;
        newFrame = oldframe = _imageView.frame;
    } completion:^(BOOL finished) {
        if ([url containsString:@"http://"]) {
            [_imageView sd_setImageWithURL:[NSURL URLWithString:url] placeholderImage:image options:SDWebImageProgressiveDownload];
        }else{
            [_imageView sd_setImageWithURL:[NSURL URLWithString:url] placeholderImage:image options:SDWebImageProgressiveDownload];
        }
    }];
}

- (void)tapDismiss:(UITapGestureRecognizer *)tap
{
    UIView *backgroundView = tap.view;
    [UIView animateWithDuration:0.3 animations:^{
        _imageView.transform = CGAffineTransformMakeScale(2.0, 2.0);
        backgroundView.alpha = 0;
    } completion:^(BOOL finished) {
        [backgroundView   removeFromSuperview];
        UIView *superView = backgroundView.superview;
        superView = nil;
    }];
}
- (void)longTap:(UILongPressGestureRecognizer *)longTap
{
    if (longTap.state==UIGestureRecognizerStateBegan) {
        //保存到手机
        UIAlertController *alertController = [UIAlertController alertControllerWithTitle:@"提示" message:@"保存图片到相册？" preferredStyle:UIAlertControllerStyleAlert];
        [alertController addAction:[UIAlertAction actionWithTitle:@"确定" style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
            UIImageWriteToSavedPhotosAlbum(_imageView.image, self, @selector(image:didFinishSavingWithError:contextInfo:), NULL);
        }]];
        [alertController addAction:[UIAlertAction actionWithTitle:@"取消" style:UIAlertActionStyleCancel handler:^(UIAlertAction * _Nonnull action) {
            
        }]];
        [self.viewControlelr presentViewController:alertController animated:YES completion:nil];
        NSLog(@"longTap");
    }
}
- (void)image:(UIImage *)image didFinishSavingWithError:(NSError *)error contextInfo:(void *)contextInfo
{
    if (!error) {
        [ToastUtils show:@"图片已保存到本地相册"];
    }else{
        [ToastUtils show:@"图片保存失败"];
    }
}
#pragma mark -UIScrollViewDelegate
-(UIView *)viewForZoomingInScrollView:(UIScrollView *)scrollView
{
    return self.imageView;
}
//让图片居中
- (void)scrollViewDidZoom:(UIScrollView *)scrollView
{
    CGFloat offsetX = (scrollView.bounds.size.width > scrollView.contentSize.width)?
    (scrollView.bounds.size.width - scrollView.contentSize.width) * 0.5 : 0.0;
    CGFloat offsetY = (scrollView.bounds.size.height > scrollView.contentSize.height)?
    (scrollView.bounds.size.height - scrollView.contentSize.height) * 0.5 : 0.0;
    self.imageView.center = CGPointMake(scrollView.contentSize.width * 0.5 + offsetX,
                                        scrollView.contentSize.height * 0.5 + offsetY);
}
@end
