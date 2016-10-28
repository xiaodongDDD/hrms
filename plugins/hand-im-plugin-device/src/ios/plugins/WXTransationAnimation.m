//
//  WXTransationAnimation.m
//  正式内测版
//
//  Created by xiaowei on 16/10/19.
//
//

#import "WXTransationAnimation.h"


#define kScreenWidth [UIScreen mainScreen].bounds.size.width
#define kScreenHeight [UIScreen mainScreen].bounds.size.height

@implementation WXTransationAnimation

- (instancetype)init{
    self = [super init];
    if(self){
        
    }
    return self;
}

- (NSTimeInterval)transitionDuration:(nullable id <UIViewControllerContextTransitioning>)transitionContext{
    
    return self.duration;
}
// This method can only  be a nop if the transition is interactive and not a percentDriven interactive transition.
- (void)animateTransition:(id <UIViewControllerContextTransitioning>)transitionContext{
    
}


- (instancetype)initWithPresented:(WXTransitionPresented)presentedCallBack dismissed:(WXTransitionDismiss)dismissCallBack{
    
    if(self = [super init]){
        self.animationPresentedCallBack = presentedCallBack;
        self.animationDismissedCallBack = dismissCallBack;
    }
    return self;
}

- (instancetype)initWithPush:(WXTransitionPush)pushCallBack pop:(WXTransitionPop)popCallBack{
    
    if(self = [super init]){
        self.animationPushCallBack = pushCallBack;
        self.animationPopCallBack = popCallBack;
    }
    return self;
}

- (nullable id <UIViewControllerAnimatedTransitioning>)animationControllerForPresentedController:(UIViewController *)presented presentingController:(UIViewController *)presenting sourceController:(UIViewController *)source{
    self.transitionMode = kWXTtransitionPresented;
    if(self.animationPresentedCallBack){
        
        self.animationPresentedCallBack(presented,presenting,source,self);
    }
    return self;
}

- (nullable id <UIViewControllerAnimatedTransitioning>)animationControllerForDismissedController:(UIViewController *)dismissed{
    self.transitionMode = kWXTtransitionDismissed;
    if(self.animationDismissedCallBack){
        
        self.animationDismissedCallBack(dismissed,self);
    }
    return self;
}


#pragma mark UINavigationControllerDelegate
- (nullable id <UIViewControllerAnimatedTransitioning>)navigationController:(UINavigationController *)navigationController
                                            animationControllerForOperation:(UINavigationControllerOperation)operation
                                                         fromViewController:(UIViewController *)fromVC
                                                           toViewController:(UIViewController *)toVC{
    if(operation == UINavigationControllerOperationPush){
        self.transitionMode = kWXTtransitionPush;
        if(self.animationPushCallBack){
            self.animationPushCallBack(fromVC,toVC,self);
        }
    }else if (operation == UINavigationControllerOperationPop){
        self.transitionMode = kWXTtransitionPop;
        if(self.animationPopCallBack){
            self.animationPopCallBack(fromVC,toVC,self);
        }
    }
    return self;
}


- (UIView *)toView:(id<UIViewControllerContextTransitioning>)transitionContext {
    UIView *toView = nil;
    
    UIViewController *toVC = [transitionContext viewControllerForKey:UITransitionContextToViewControllerKey];
    
    if ([transitionContext respondsToSelector:@selector(viewForKey:)]) {
        toView = [transitionContext viewForKey:UITransitionContextToViewKey];
    } else {
        toView = toVC.view;
    }
    
    toView.frame = [transitionContext finalFrameForViewController:toVC];
    
    return toView;
}

- (UIView *)fromView:(id<UIViewControllerContextTransitioning>)transitionContext {
    
    UIView *fromView = nil;
    
    UIViewController *fromVC = [transitionContext viewControllerForKey:UITransitionContextFromViewControllerKey];
    
    if ([transitionContext respondsToSelector:@selector(viewForKey:)]) {
        fromView = [transitionContext viewForKey:UITransitionContextFromViewKey];
    } else {
        fromView = fromVC.view;
    }
    
    fromView.frame = [transitionContext initialFrameForViewController:fromVC];
    
    return fromView;
}

@end


@implementation WXTramsitionPresentMode

- (void)animateTransition:(id<UIViewControllerContextTransitioning>)transitionContext{
    
    UIView *containView = [transitionContext containerView];
    if(containView == nil){
        return;
    }
    
    if(self.transitionMode == kWXTtransitionPresented){
        UIView *toView = [self toView:transitionContext];
        toView.frame = CGRectMake(kScreenWidth, 0, containView.frame.size.width, containView.frame.size.height);
        [containView addSubview:toView];
        
        [UIView animateWithDuration:0.2 animations:^{
            toView.frame = CGRectMake(0, 0, containView.frame.size.width, containView.frame.size.height);
        }completion:^(BOOL finished) {
            [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
        }];
    }else if (self.transitionMode == kWXTtransitionDismissed){
        UIView *fromView = [self toView:transitionContext];
        fromView.frame = CGRectMake(-kScreenWidth, 0, kScreenWidth, kScreenHeight);
        [containView addSubview:fromView];
        [UIView animateWithDuration:.2 delay:0 usingSpringWithDamping:0.9 initialSpringVelocity:3 options:UIViewAnimationOptionTransitionFlipFromRight animations:^{
            fromView.frame = CGRectMake(0, 0, kScreenWidth, kScreenHeight);
        } completion:^(BOOL finished) {
            [transitionContext completeTransition:![transitionContext transitionWasCancelled]];
        }];
    }
}

@end







