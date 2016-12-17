//
//  CropCircleVMaskiew.m
//  图像插件演示
//
//  Created by 吴笑诚 on 2016/12/5.
//
//

#import "CropCircleVMaskiew.h"

#define kMaskViewBorderWidth 2.0f


@implementation CropCircleVMaskiew

//
//- (void)initCropSize:(CGSize)size frame:(CGRect)frame {
//    CGFloat x = (CGRectGetWidth(frame) - size.width) / 2;
//    CGFloat y = (CGRectGetHeight(frame) - size.height) / 2;
//    _cropRect = CGRectMake(x, y-64, size.width, size.height);
//    _maskAlpha = DEFAULT_MASK_ALPHA;
//    [self setNeedsDisplay];
//}
//

- (void)drawRect:(CGRect)rect {
    CGContextRef ctx = UIGraphicsGetCurrentContext();
    
    CGContextSetRGBFillColor(ctx, 1, 1, 1, self.maskAlpha);
    CGContextFillRect(ctx, self.bounds);
    
    CGContextSetStrokeColorWithColor(ctx, [UIColor redColor].CGColor);
    //    CGContextStrokeRectWithWidth(ctx, _cropRect, kMaskViewBorderWidth);
    CGContextStrokeRectWithWidth(ctx, self.cropRect, 0);
    
    
    CGContextSetLineWidth(ctx, 3.0);//线的宽度
    
    CGFloat x = self.cropRect.origin.x+self.cropRect.size.width/2;
    CGFloat y = self.cropRect.origin.y+self.cropRect.size.height/2;
    
    CGContextAddArc(ctx, x, y, self.cropRect.size.width/2, 0, 2*M_PI, kMaskViewBorderWidth); //添加一个圆
    //kCGPathFill填充非零绕数规则,kCGPathEOFill表示用奇偶规则,kCGPathStroke路径,kCGPathFillStroke路径填充,kCGPathEOFillStroke表示描线，不是填充
    //    CGContextDrawPath(ctx, kCGPathFillStroke); //绘制路径加填充
    CGContextSetBlendMode(ctx, kCGBlendModeClear);
    
    CGContextDrawPath(ctx, kCGPathEOFillStroke); //绘制路径加填充
    
    
    
    //CGContextClearRect(ctx, _cropRect);
}

//- (void) restMaskAlpha {
//    _maskAlpha = DEFAULT_MASK_ALPHA;
//}
//

@end
