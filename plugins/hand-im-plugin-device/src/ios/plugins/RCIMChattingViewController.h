//
//  RCIMChattingViewController.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/13.
//
//

#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, RCKeyboardShowType) {
    RCKeyboardShowDefaultType=0,
    RCKeyboardShowEmotionType,
    RCKeyboardShowImageCollectionType,
    RCKeyboardShowRecorderType,
    RCKeyboardShowMoreType
};

@protocol RCIMChattingViewControllerDelegate <NSObject>

@optional
- (void)dismissViewController;

@end

@interface RCIMChattingViewController : UIViewController
/*
 *会话目标的id
 */
@property (nonatomic,strong)NSString *target_id;
/*
 *会话目标的头像
 */
@property (nonatomic,strong)NSString *friendIcon;
/*
 *会话目标的Name
 */
@property (nonatomic,strong)NSString *navtitle;
/*
 *会话目标的电话 可能有多个 弹出表选择
 */
@property (nonatomic,strong)NSArray *phoneNums;
@property (nonatomic,strong)id<RCIMChattingViewControllerDelegate>delegate;
@end
