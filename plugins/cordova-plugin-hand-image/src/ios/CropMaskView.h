//
//  CropMaskView.h
//  HelloCordova
//
//  Created by 吴笑诚 on 2016/10/20.
//
//

#import <UIKit/UIKit.h>

#define DEFAULT_MASK_ALPHA 0.6

@interface CropMaskView : UIView

@property (nonatomic) CGRect cropRect;
@property (nonatomic) CGFloat maskAlpha;

- (void)initCropSize:(CGSize)size frame:(CGRect)frame;

- (void)restMaskAlpha;


@end
