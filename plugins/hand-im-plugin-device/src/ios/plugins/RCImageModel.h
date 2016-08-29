//
//  RCImageModel.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/10.
//
//

#import <UIKit/UIKit.h>
#import <Photos/Photos.h>
@interface RCImageModel : NSObject
/*!
 *thumbnailImage 缩略图
 */
@property (nonatomic,strong)UIImage *thumbnailImage;
/*!
 *originalImage 原始图
 */
@property (nonatomic,strong)UIImage *originalImage;
/*!
 *phAsset 本地图片的获取obj
 */
@property (nonatomic,strong)PHAsset *phAsset;
/*!
 *localIdentifier 本地图片的id
 */
@property (nonatomic,copy)NSString *localIdentifier;
@end
