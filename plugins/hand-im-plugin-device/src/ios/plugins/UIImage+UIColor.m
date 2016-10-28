//
//  UIImage+UIColor.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/4.
//
//

#import "UIImage+UIColor.h"
#import "CVDPlugin-Bridging-Header.h"
@implementation UIImage (UIColor)

+ (CGSize)imageWithImg:(UIImage *)originImg width:(CGFloat)width{
    
    CGSize size = originImg.size;
    CGFloat operation = 0.0;
    CGFloat height = 0.0;
    if(size.width>width){
        
        operation = size.width/(CGFloat)width;
        height = size.height/operation;
        
    }else{
        
        width = size.width;
        if(size.height>400*screenWidth/375.0){
            height = 400*screenWidth/375.0;
        }else{
            height = size.height;
        }
    }
    
    return CGSizeMake(width, height);
}

+ (UIImage *)imageWithColor:(UIColor *)color size:(CGSize)size
{
    CGRect rect = CGRectMake(0, 0, size.width, size.height);
    UIGraphicsBeginImageContext(rect.size);
    CGContextRef context = UIGraphicsGetCurrentContext();
    CGContextSetFillColorWithColor(context,color.CGColor);
    CGContextFillRect(context, rect);
    UIImage *img = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return img;
}
+ (UIImage*)imageWithColor:(NSArray*)colors withSize: (CGSize)size

{
    
    NSMutableArray *ar = [NSMutableArray array];
    
    for(UIColor *c in colors) {
        
        [ar addObject:(id)c.CGColor];
        
    }
    
    UIGraphicsBeginImageContextWithOptions(size, YES, 1);
    
    CGContextRef context = UIGraphicsGetCurrentContext();
    
    CGContextSaveGState(context);
    
    CGColorSpaceRef colorSpace = CGColorGetColorSpace([[colors lastObject] CGColor]);
    
    CGGradientRef gradient = CGGradientCreateWithColors(colorSpace, (CFArrayRef)ar, NULL);
    
    CGPoint start;
    
    CGPoint end;
    
    start = CGPointMake(0.0, size.height);
    
    end = CGPointMake(size.width, 0.0);
    
    CGContextDrawLinearGradient(context, gradient, start, end,kCGGradientDrawsBeforeStartLocation | kCGGradientDrawsAfterEndLocation);
    
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    
    CGGradientRelease(gradient);
    
    CGContextRestoreGState(context);
    
    CGColorSpaceRelease(colorSpace);
    
    UIGraphicsEndImageContext();
    
    return image;
    
}
@end
