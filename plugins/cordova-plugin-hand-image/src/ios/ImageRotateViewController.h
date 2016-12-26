//
//  ImageRotateViewController.h
//  HelloCordova
//
//  Created by 吴笑诚 on 2016/10/21.
//
//

#import <UIKit/UIKit.h>
#import "ViewControllerDelegate.h"

@interface ImageRotateViewController : UIViewController
@property (weak, nonatomic) IBOutlet UIScrollView *scrollView;
@property (strong, nonatomic) IBOutlet UIView *toolBarView;
@property (weak, nonatomic) IBOutlet UIButton *clockwise90Button;
@property (weak, nonatomic) IBOutlet UIButton *anticlockwise90Button;

@property (strong, nonatomic) UIImageView *imageView;
@property ( nonatomic) UIEdgeInsets imageInset;
@property ( strong,nonatomic) UIImage* image;
@property (strong,nonatomic) NSString* imagePath;

@property (strong,nonatomic) id<ViewControllerDelegate> delegate;



@property ( nonatomic) CGFloat angle;



- (IBAction)anticlockwise90ButtonPressed:(UIButton *)sender;
- (IBAction)clockwise90ButtonPressed:(UIButton *)sender;
- (id) initWithImagePath:(NSString*)imagePath;

@end
