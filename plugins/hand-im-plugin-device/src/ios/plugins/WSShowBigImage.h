//
//  WSShowBigImage.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/10.
//
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
@interface WSShowBigImage : NSObject
@property (nonatomic,strong)UIViewController *viewControlelr;
/**
 *	@brief	浏览头像
 *
 *	@param 	oldImageView 	头像所在的imageView
 */
- (void)showBigImage:(UIImageView *)selectedImageView Url:(NSString *)url;
+(instancetype)sharedInstance;
@end
