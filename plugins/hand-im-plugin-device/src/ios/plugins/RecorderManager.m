//
//  RecorderManager.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/3.
//
//

#import "RecorderManager.h"
#import <AVFoundation/AVFoundation.h>
@interface RecorderManager ()<AVAudioRecorderDelegate>
{
    NSString *fileName;
    BOOL isCancel;
}
@property (nonatomic,strong)AVAudioRecorder *recorder;
@end

static RecorderManager *recorderManager;
@implementation RecorderManager
@synthesize dateStartRecordering,dateStopRecordering;

+ (instancetype)sharedInstance
{
    @synchronized(self) {
        if (recorderManager==nil) {
            recorderManager = [[RecorderManager alloc] init];
        }
    }
    return recorderManager;
}


- (void)startRecording
{
    isCancel = NO;
    NSError *error;

    //文件类型 AVFormatIDKey
    //采集样   AVSampleRateKey
    //文件质量  AVEncoderAudioQualityKey
   // AVAudioSession（AVAudioSession是用来控制audio会话的），因此真机测试的时候有些问题（iOS7.1.1）
    NSError *error1;
    AVAudioSession *session = [AVAudioSession sharedInstance];
    [session setCategory:AVAudioSessionCategoryPlayAndRecord error:&error1];
    [session setActive:YES error:&error1];
    
    NSDictionary *settings = @{AVFormatIDKey: @(kAudioFormatLinearPCM),
                               AVSampleRateKey: @8000.00f,
                               AVNumberOfChannelsKey: @1,
                               AVLinearPCMBitDepthKey: @16,
                               AVLinearPCMIsNonInterleaved: @NO,
                               AVLinearPCMIsFloatKey: @NO,
                               AVLinearPCMIsBigEndianKey: @NO};
    fileName = [self defaultFileName];
    NSURL *urlPath = [NSURL fileURLWithPath:fileName];
    _recorder = [[AVAudioRecorder alloc] initWithURL:urlPath settings:settings error:&error];
    _recorder.delegate = self;
    _recorder.meteringEnabled = YES;
    dateStartRecordering = [NSDate date];
    if ([_recorder prepareToRecord]) {
        [_recorder record];
    }
    [_recorder updateMeters];
    [_recorder peakPowerForChannel:1];
    NSLog(@"manager startRecording");
}

- (void)stopRecording
{
    //松开按钮停止语音 并发送消息
    if ([_recorder isRecording]) {
        [_recorder stop];
        [self.delegate recordingStopped];
    }
    NSLog(@"%@ stopRecording",[self class]);
}

- (void)cancelRecording
{
    if ([_recorder isRecording]) {
        [_recorder stop];
        [self.delegate recordingCancel];
        isCancel = YES;
    }
    NSLog(@"%@ cancelRecording",[self class]);
}

- (NSTimeInterval)recordedTimeInterval
{
    return [dateStopRecordering timeIntervalSinceDate:dateStartRecordering];
}

#pragma mark -返回指定的语音路径
- (NSString *)defaultFileName {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    NSString *voiceDirectory = [documentsDirectory stringByAppendingPathComponent:@"voice"];
    if ( ! [[NSFileManager defaultManager] fileExistsAtPath:voiceDirectory]) {
        [[NSFileManager defaultManager] createDirectoryAtPath:voiceDirectory withIntermediateDirectories:YES attributes:nil error:NULL];
    }
    return [voiceDirectory stringByAppendingPathComponent:[NSString stringWithFormat:@"%lf.wav", [[NSDate date] timeIntervalSince1970]]];
    
}
#pragma mark - AVAudioRecorderDelegate
/* audioRecorderDidFinishRecording:successfully: is called when a recording has been finished or stopped. This method is NOT called if the recorder is stopped due to an interruption. */
- (void)audioRecorderDidFinishRecording:(AVAudioRecorder *)recorder successfully:(BOOL)flag
{
    if (flag) {
        dateStopRecordering = [NSDate date];
        if ([self recordedTimeInterval]<1.0f) {
            [self.delegate recordingFailed:@"按键时间太短!"];
          BOOL isDeleting =  [_recorder deleteRecording];
            NSLog(@"self recordedTimeInterval ,%i",isDeleting);
        }else if (!isCancel){
            [self.delegate recordingFinishedWithFileName:fileName time:[self recordedTimeInterval]];
            NSLog(@"!isCancel");
        }
        
        NSLog(@"录音成功 path:%@ 时间:%f",fileName,[self recordedTimeInterval]);
    }else{
        NSLog(@"录音失败 path:%@ 时间:%f",fileName,[self recordedTimeInterval]);
    }
}

/* if an error occurs while encoding it will be reported to the delegate. */
- (void)audioRecorderEncodeErrorDidOccur:(AVAudioRecorder *)recorder error:(NSError * )error
{
    NSLog(@"error：录音失败%@",error);
}

@end
