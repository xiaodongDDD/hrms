//
//  CropMaskView.m
//  HelloCordova
//
//  Created by 吴笑诚 on 2016/10/20.
//
//

#import "CropMaskView.h"


#define kMaskViewBorderWidth 2.0f

@implementation CropMaskView

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/


- (void)initCropSize:(CGSize)size frame:(CGRect)frame {
    CGFloat x = (CGRectGetWidth(frame) - size.width) / 2;
    CGFloat y = (CGRectGetHeight(frame) - size.height) / 2;
    _cropRect = CGRectMake(x, y-64, size.width, size.height);
    _maskAlpha = DEFAULT_MASK_ALPHA;
    [self setNeedsDisplay];
}


- (void)drawRect:(CGRect)rect {
    [super drawRect:rect];
    CGContextRef ctx = UIGraphicsGetCurrentContext();
    CGContextSetRGBFillColor(ctx, 1, 1, 1, _maskAlpha);
    CGContextFillRect(ctx, self.bounds);
    
    CGContextSetStrokeColorWithColor(ctx, [UIColor redColor].CGColor);
    CGContextStrokeRectWithWidth(ctx, _cropRect, kMaskViewBorderWidth);
    
    CGContextClearRect(ctx, _cropRect);
}

- (void) restMaskAlpha {
    _maskAlpha = DEFAULT_MASK_ALPHA;
}

@end
