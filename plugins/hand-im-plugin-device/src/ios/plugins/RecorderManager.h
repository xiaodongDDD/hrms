//
//  RecorderManager.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/3.
//
//

#import <UIKit/UIKit.h>

@protocol RecorderManagerDelegate <NSObject>
@optional
/*!
 *录音结束，返回文件路径 录音时间戳
 */
- (void)recordingFinishedWithFileName:(NSString *)filePath time:(NSTimeInterval)interval;
/*!
 *录音超时
 */
- (void)recordingTimeout;
/*!
 *录音停止
 */
- (void)recordingStopped;
/*!
 *录音取消
 */
- (void)recordingCancel;
/*!
 *录音失败
 */
- (void)recordingFailed:(NSString *)failureInfoString;
@end

@interface RecorderManager : UIViewController
@property (nonatomic,strong)NSDate *dateStartRecordering;
@property (nonatomic,strong)NSDate *dateStopRecordering;
@property (nonatomic,strong)id<RecorderManagerDelegate>delegate;

+ (instancetype)sharedInstance;
- (void)startRecording;

- (void)stopRecording;

- (void)cancelRecording;

- (NSTimeInterval)recordedTimeInterval;
@end
