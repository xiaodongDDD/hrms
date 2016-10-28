//
//  RecoderViewController.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/2.
//
//

#import <UIKit/UIKit.h>


@protocol RecoderViewControllerDelegate <NSObject>

@optional
- (void)startRecordering;
- (void)stopRecordering;
- (void)finishedRecordering:(NSString *)fileName timeInterval:(NSTimeInterval)timeInterVal;
- (void)cancelRecordering;
- (void)failedRecorderingWithString:(NSString *)failureString;
@end

@interface RecoderViewController : UIViewController
@property (nonatomic,strong)id<RecoderViewControllerDelegate>delegate;
@end
