//
//  ImageCell.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/28.
//
//

#import "ImageCell.h"
#import "CVDPlugin-Bridging-Header.h"
#define kViewWidth      [[UIScreen mainScreen] bounds].size.width
#define kMaxImageWidth 500

@implementation ImageCell

-(instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.imageView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, screenWidth/3.0, 160)];
        [_imageView setUserInteractionEnabled:YES];
        [self addSubview:self.imageView];
        
        self.selectLabel = [[UILabel alloc] init];
       // [self.selectLabel setFrame:CGRectMake(CGRectGetWidth(self.imageView.frame)-20-5, 5, 20, 20)];
        [self.selectLabel setFont:[UIFont systemFontOfSize:15]];
        UITapGestureRecognizer *tapRecognizer = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapSelect:)];
        [self.selectLabel addGestureRecognizer:tapRecognizer];
        [self.selectLabel setTextAlignment:NSTextAlignmentCenter];

        [self.selectLabel setTextColor:[UIColor whiteColor]];
//        [self.selectLabel.layer setCornerRadius:CGRectGetWidth(self.selectLabel.frame)/2.0];
//        [self.selectLabel.layer setMasksToBounds:YES];
        self.selectLabel.layer.borderColor = [UIColor whiteColor].CGColor;
        self.selectLabel.layer.borderWidth = 1.0;
        [self.selectLabel setUserInteractionEnabled:YES];
        [self.imageView addSubview:self.selectLabel];
        [self setBackgroundColor:[UIColor lightGrayColor]];
    }
    return self;
}
- (void)tapSelect:(UITapGestureRecognizer *)recognizer
{
    self.isSelected = !self.isSelected;
    if (self.isSelected) {
        [self.selectLabel setBackgroundColor:[UIColor colorWithRed:86/255.0 green:209/255.0 blue:252/255.0 alpha:1.0]];
    }else{
        [self.selectLabel setBackgroundColor:[UIColor colorWithWhite:0.5 alpha:0.5]];
    
    }
    [self animationDid];
    //点击回调
    self.imageCellBlock(recognizer.view.tag);
    NSLog(@"recognizer.view.tag:%li",recognizer.view.tag);
}

//selected animaiton
- (void)animationDid
{
    [self.selectLabel setTransform:CGAffineTransformMakeScale(1.4, 1.4)];
    [UIView animateWithDuration:0.5 delay:0 usingSpringWithDamping:0.6 initialSpringVelocity:0.6 options:UIViewAnimationOptionCurveLinear animations:^{
        [self.selectLabel setTransform:CGAffineTransformMakeScale(1.0, 1.0)];
    }completion:nil];
}
-(void)setCell:(PHAsset *)asset Index:(NSInteger)index
{
    [self.selectLabel setTag:index];
    
    if (asset!=nil) {
        [self getImageWithAsset:asset completion:^(UIImage *image, NSDictionary *info) {
//            self.imageView.image = image;
            self.imageView.image = image;
            self.imageView.frame = CGRectMake(0, 0, [self getSizeWithAsset:asset].width, [self getSizeWithAsset:asset].height);
            self.selectLabel.frame = CGRectMake(CGRectGetWidth(self.imageView.frame)-20-5, 5, 20, 20);
            [self.selectLabel.layer setCornerRadius:CGRectGetWidth(self.selectLabel.frame)/2.0];
            [self.selectLabel.layer setMasksToBounds:YES];
        }];
    }else{
        [self.imageView setImage:[UIImage imageNamed:@"aio_image_default@2x.png"]];
    }
    if (self.isSelected) {
        [self.selectLabel setBackgroundColor:[UIColor colorWithRed:86/255.0 green:209/255.0 blue:252/255.0 alpha:1.0]];
    }else{
        [self.selectLabel setBackgroundColor:[UIColor colorWithWhite:0.5 alpha:0.5]];
        
    }
    
    
}
#pragma mark - 获取asset对应的图片
- (void)requestImageForAsset:(PHAsset *)asset size:(CGSize)size resizeMode:(PHImageRequestOptionsResizeMode)resizeMode completion:(void (^)(UIImage *, NSDictionary *))completion
{
    //请求大图界面，当切换图片时，取消上一张图片的请求，对于iCloud端的图片，可以节省流量
    static PHImageRequestID requestID = -1;
    CGFloat scale = [UIScreen mainScreen].scale;
    CGFloat width = MIN(kViewWidth, kMaxImageWidth);
    if (requestID >= 1 && size.width/width==scale) {
        [[PHCachingImageManager defaultManager] cancelImageRequest:requestID];
    }
    
    PHImageRequestOptions *option = [[PHImageRequestOptions alloc] init];
    /**
     resizeMode：对请求的图像怎样缩放。有三种选择：None，默认加载方式；Fast，尽快地提供接近或稍微大于要求的尺寸；Exact，精准提供要求的尺寸。
     deliveryMode：图像质量。有三种值：Opportunistic，在速度与质量中均衡；HighQualityFormat，不管花费多长时间，提供高质量图像；FastFormat，以最快速度提供好的质量。
     这个属性只有在 synchronous 为 true 时有效。
     */
    
    option.resizeMode = resizeMode;//控制照片尺寸
    //option.deliveryMode = PHImageRequestOptionsDeliveryModeOpportunistic;//控制照片质量
    option.networkAccessAllowed = YES;
    
    /*
     info字典提供请求状态信息:
     PHImageResultIsInCloudKey：图像是否必须从iCloud请求
     PHImageResultIsDegradedKey：当前UIImage是否是低质量的，这个可以实现给用户先显示一个预览图
     PHImageResultRequestIDKey和PHImageCancelledKey：请求ID以及请求是否已经被取消
     PHImageErrorKey：如果没有图像，字典内的错误信息
     */
    
    requestID = [[PHCachingImageManager defaultManager] requestImageForAsset:asset targetSize:size contentMode:PHImageContentModeAspectFit options:option resultHandler:^(UIImage * _Nullable image, NSDictionary * _Nullable info) {
        BOOL downloadFinined = ![[info objectForKey:PHImageCancelledKey] boolValue] && ![info objectForKey:PHImageErrorKey];
        //不要该判断，即如果该图片在iCloud上时候，会先显示一张模糊的预览图，待加载完毕后会显示高清图
        // && ![[info objectForKey:PHImageResultIsDegradedKey] boolValue]
        if (downloadFinined && completion) {
            completion(image, info);
        }
    }];
}
#pragma mark - 获取图片及图片尺寸的相关方法
- (CGSize)getSizeWithAsset:(PHAsset *)asset
{
    CGFloat width  = (CGFloat)asset.pixelWidth;
    CGFloat height = (CGFloat)asset.pixelHeight;
    CGFloat scale = width/height;
    
    return CGSizeMake(160*scale, 160);
}

- (void)getImageWithAsset:(PHAsset *)asset completion:(void (^)(UIImage *image, NSDictionary *info))completion
{
    CGSize size = [self getSizeWithAsset:asset];
//    size.width  *= 1.5;
//    size.height *= 1.5;
    [self requestImageForAsset:asset size:size resizeMode:PHImageRequestOptionsResizeModeFast completion:completion];
}
@end
