//
//  WXTransationAnimation.h
//  正式内测版
//
//  Created by xiaowei on 16/10/19.
//
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class WXTransationAnimation;

typedef void(^WXTransitionPresented)(UIViewController *presented,
                                        UIViewController *presenting,
                                        UIViewController *source,
                                        WXTransationAnimation *transition);

typedef void(^WXTransitionDismiss)(UIViewController *dismissed, WXTransationAnimation *transition);

typedef void(^WXTransitionPush)(UIViewController *fromVC,
                                UIViewController *toVC,
                                WXTransationAnimation *transition);

typedef WXTransitionPush WXTransitionPop;

typedef NS_ENUM(NSUInteger,WXTransationType) {

    kWXTtransitionPresented,
    kWXTtransitionDismissed,
    kWXTtransitionPush,
    kWXTtransitionPop
};

@interface WXTransationAnimation : NSObject<UIViewControllerAnimatedTransitioning,UIViewControllerTransitioningDelegate,
UINavigationControllerDelegate>


@property (nonatomic,assign)NSTimeInterval duration;
@property (nonatomic,assign)WXTransationType transitionMode;
@property (nonatomic,copy)WXTransitionPresented animationPresentedCallBack;
@property (nonatomic,copy)WXTransitionDismiss animationDismissedCallBack;
@property (nonatomic,copy)WXTransitionPush animationPushCallBack;
@property (nonatomic,copy)WXTransitionPop animationPopCallBack;

- (instancetype)initWithPresented:(WXTransitionPresented)presentedCallBack dismissed:(WXTransitionDismiss)dismissCallBack;

- (instancetype)initWithPush:(WXTransitionPush)pushCallBack pop:(WXTransitionPop)popCallBack;

- (UIView *)toView:(id<UIViewControllerContextTransitioning>)transitionContext ;
- (UIView *)fromView:(id<UIViewControllerContextTransitioning>)transitionContext ;


@end


@interface WXTramsitionPresentMode : WXTransationAnimation




@end



