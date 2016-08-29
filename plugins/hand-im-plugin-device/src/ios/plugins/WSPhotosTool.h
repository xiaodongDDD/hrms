//
//  WSPhotosTool.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/8.
//
//

#import <Foundation/Foundation.h>
#import <Photos/Photos.h>
@interface WSPhotosTool : NSObject
+(instancetype)sharedPhotosTool;
- (void)saveImageToAblum:(UIImage *)image completion:(void (^)(BOOL, PHAsset *))completion;
- (NSArray<PHAsset *> *)getAllAssetInPhotoAblumWithAscending:(BOOL)ascending;
@end
