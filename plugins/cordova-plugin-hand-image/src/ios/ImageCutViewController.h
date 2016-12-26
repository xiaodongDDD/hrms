//
//  ImageCutViewController.h
//  HelloCordova
//
//  Created by 吴笑诚 on 2016/10/19.
//
//

#import <UIKit/UIKit.h>
//#import "KICropImageView.h"
#import "CropMaskView.h"
#import "CropCircleVMaskiew.h"

#import "ViewControllerDelegate.h"
#import "UIImage+KIAdditions.h"


typedef NS_ENUM(NSInteger, enumMaskType)
{
    //以下是枚举成员
    kMASK_TYPE_DEFAULT = 0,
    kMASK_TYPE_CIRCLE = 1,
};

@interface ImageCutViewController : UIViewController {
    //KICropImageView *_cropImageView;
    

}
@property (weak, nonatomic) IBOutlet UIScrollView *scrollView;
@property (strong, nonatomic) UIImageView *imageView;
@property (strong, nonatomic) CropMaskView *cropMaskView;   // 裁剪遮罩层
@property (strong, nonatomic) NSString* pageTitle;          // 导航栏标题
@property (nonatomic) enumMaskType masktype;                // 裁剪框显示类型
@property (nonatomic) BOOL showToolBarView;          // 导航栏标题
@property (nonatomic) NSInteger imageExtCount;          // 导航栏标题

@property ( nonatomic) CGSize cropSize;
@property ( nonatomic) UIEdgeInsets imageInset;

@property ( nonatomic) BOOL boolZoomFlag;

@property (strong,nonatomic) id<ViewControllerDelegate> delegate;
@property (strong,nonatomic) NSString* imagePath;


@property (strong, nonatomic) IBOutlet UIView *previewView;

@property (strong, nonatomic) IBOutlet UIView *toolBarView;



@property (weak, nonatomic) IBOutlet UIScrollView *previewScrollView;
@property (strong, nonatomic) UIImageView *previewImageView;

@property (weak, nonatomic) IBOutlet UIButton *previewButton;
@property (weak, nonatomic) IBOutlet UIButton *redoButton;
//- (void)lock;
- (IBAction)lockPreviewButtonPressed:(UIButton *)sender;
- (IBAction)redoButtonPressed:(UIButton *)sender;
- (id) initWithImagePath:(NSString*)imagePath width:(NSInteger)width height: (NSInteger)height;

@end

