//
//  Created by yanjun.li on 16/1/7
//
//
#import <Foundation/Foundation.h>


@interface ScanCardImageUtil : NSObject 


+ (UIImage *)changeValueForSharpenilter:(float)value image:(UIImage *)image;



+ (UIImage *)changeValueContrastFilter:(float)value image:(UIImage *)image;
@end
