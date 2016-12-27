//
//  Created by yanjun.li on 16/1/7
//
//
#import "ScanCardImageUtil.h"
#import "GPUImageSharpenFilter.h"
#import "GPUImagePicture.h"
#import "GPUImageContrastFilter.h"

@implementation ScanCardImageUtil

//锐化
+ (UIImage *)changeValueForSharpenilter:(float)value image:(UIImage *)image
{
    GPUImageSharpenFilter *filter = [[GPUImageSharpenFilter alloc] init];
    filter.sharpness = value;
    [filter forceProcessingAtSize:image.size];
    GPUImagePicture *pic = [[GPUImagePicture alloc] initWithImage:image];
    [pic addTarget:filter];
    
    [pic processImage];
    [filter useNextFrameForImageCapture];
    return [filter imageFromCurrentFramebuffer];
    
    
    
   
    
}

//对比度

+ (UIImage *)changeValueContrastFilter:(float)value image:(UIImage *)image
{
    GPUImageContrastFilter *filter = [[GPUImageContrastFilter alloc] init];
    filter.contrast = value;
    [filter forceProcessingAtSize:image.size];
    GPUImagePicture *pic = [[GPUImagePicture alloc] initWithImage:image];
    [pic addTarget:filter];
    
    [pic processImage];
    [filter useNextFrameForImageCapture];
    return  [filter imageFromCurrentFramebuffer];
}



@end
