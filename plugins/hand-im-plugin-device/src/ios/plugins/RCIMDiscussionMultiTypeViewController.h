//
//  RCIMDiscussionMultiTypeViewController.h
//  汉得移动测试版
//
//  Created by wangsheng on 2016/10/10.
//
//

#import <UIKit/UIKit.h>

@protocol RCIMDiscussionMultiTypeViewControllerProtocol <NSObject>

@optional
- (void)didSelectedPhotoLibrary;
- (void)didSelectedCamera;

@end
@interface RCIMDiscussionMultiTypeViewController : UIViewController
@property (nonatomic,strong)id<RCIMDiscussionMultiTypeViewControllerProtocol>delegate;
@end
