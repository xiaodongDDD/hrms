//
//  UIImage+FaceDetect.m
//  讯飞-人脸识别-从组中识别
//
//  Created by wangsheng on 2016/12/9.
//  Copyright © 2016年 wangsheng. All rights reserved.
//

#import "UIImage+FaceDetect.h"
#import <CoreImage/CoreImage.h>

@implementation UIImage (FaceDetect)

/**识别脸部*/
-(BOOL )detectFaceWithImage
{
    NSDictionary *opts = [NSDictionary dictionaryWithObject:
                          CIDetectorAccuracyHigh forKey:CIDetectorAccuracy];
    
    CIDetector *detectoer=[CIDetector detectorOfType:CIDetectorTypeFace context:nil options:opts];
    
    CIImage *ciimage=[CIImage imageWithCGImage:self.CGImage];

    NSArray *featrues=[detectoer featuresInImage:ciimage];
    
    if(featrues.count>0)
    {
        CIFaceFeature *face=[featrues firstObject];

        if (face.hasLeftEyePosition || face.hasRightEyePosition || face.hasMouthPosition || face.hasFaceAngle) {
            return YES;
        }else{
            return NO;
        }
    }
    
    return NO;
}
@end
