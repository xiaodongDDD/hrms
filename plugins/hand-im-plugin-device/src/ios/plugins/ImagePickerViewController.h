//
//  ImagePickerViewController.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/28.
//
//

#import <UIKit/UIKit.h>
#import <Photos/Photos.h>
#import "CVDPlugin-Bridging-Header.h"
#import "ImageCell.h"
@protocol ImagePickerViewControllerDelegate <NSObject>

@optional
- (void)openImagePickerViewController;
- (void)clickedSendImageMessage:(NSArray *)array;
- (void)finishedSelectImage:(UIImage *)selectImage;
- (void)longPressSendImageMessage:(RCImageMessage *)imageMessage WithView:(UIView *)aView Cell:(ImageCell *)cell;
@end

@interface ImagePickerViewController : UIViewController
@property (nonatomic,strong)id<ImagePickerViewControllerDelegate>delegate;
@property (nonatomic,assign)NSUInteger maxSelectItems;
@property (nonatomic,strong)UIViewController *sender;
@end
