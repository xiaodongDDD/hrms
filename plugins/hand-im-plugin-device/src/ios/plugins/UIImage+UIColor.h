//
//  UIImage+UIColor.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/4.
//
//

#import <UIKit/UIKit.h>

@interface UIImage (UIColor)
+ (UIImage *)imageWithColor:(UIColor *)color size:(CGSize)size;
+ (UIImage*)imageWithColor:(NSArray*)colors withSize: (CGSize)size;
@end
