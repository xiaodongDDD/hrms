//
//  MYSpeechRecongizer.m
//  芝士网
//
//  Created by wangsheng on 16/4/22.
//
//

#import "MYSpeechRecongizer.h"
#import "IFlyMSC/IFlyMSC.h"
#import "IATConfig.h"
#import "ISRDataHelper.h"

@interface MYSpeechRecongizer ()<IFlySpeechRecognizerDelegate>
{
    NSString *lastResult;
}

@property (nonatomic,strong)IFlySpeechRecognizer *iFlySpeechRecognizer;
@end
@implementation MYSpeechRecongizer

-(id)init
{    self = [super init];
    if (self) {
        self.iFlySpeechRecognizer = [IFlySpeechRecognizer sharedInstance];
        [self initRecognizer];
        lastResult = [[NSString alloc] init];
    }
    return self;
}
- (void)initRecognizer
{
    if (_iFlySpeechRecognizer != nil) {
        //设置代理
        _iFlySpeechRecognizer.delegate = self;
        //清空参数
        [_iFlySpeechRecognizer setParameter:@"" forKey:[IFlySpeechConstant PARAMS]];
        
        //设置听写模式
        [_iFlySpeechRecognizer setParameter:@"iat" forKey:[IFlySpeechConstant IFLY_DOMAIN]];
        
        //设置音频来源为麦克风
        [_iFlySpeechRecognizer setParameter:IFLY_AUDIO_SOURCE_MIC forKey:@"audio_source"];
        
        //设置听写返回结果格式为json
        [_iFlySpeechRecognizer setParameter:@"json" forKey:[IFlySpeechConstant RESULT_TYPE]];
        
        //保存录音文件，保存在sdk工作路径中，如未设置工作路径，则默认保存在library/cache下
        [_iFlySpeechRecognizer setParameter:[NSString stringWithFormat:@"%lf.wav",[[NSDate date] timeIntervalSince1970]] forKey:[IFlySpeechConstant ASR_AUDIO_PATH]];

        
        IATConfig *instance = [IATConfig sharedInstance];
        
        //设置最长录音时间
        [_iFlySpeechRecognizer setParameter:instance.speechTimeout forKey:[IFlySpeechConstant SPEECH_TIMEOUT]];//单位：ms，默认30000
        //设置后端点
        [_iFlySpeechRecognizer setParameter:instance.vadEos forKey:[IFlySpeechConstant VAD_EOS]];
        //设置前端点
        [_iFlySpeechRecognizer setParameter:instance.vadBos forKey:[IFlySpeechConstant VAD_BOS]];
        //网络等待时间
        [_iFlySpeechRecognizer setParameter:@"20000" forKey:[IFlySpeechConstant NET_TIMEOUT]];
        
        //设置采样率，推荐使用16K
        [_iFlySpeechRecognizer setParameter:instance.sampleRate forKey:[IFlySpeechConstant SAMPLE_RATE]];
        
        if ([instance.language isEqualToString:[IATConfig chinese]]) {
            //设置语言
            [_iFlySpeechRecognizer setParameter:instance.language forKey:[IFlySpeechConstant LANGUAGE_CHINESE]];
            //设置方言
            [_iFlySpeechRecognizer setParameter:instance.accent forKey:[IFlySpeechConstant ACCENT]];
        }else if ([instance.language isEqualToString:[IATConfig english]]) {
            [_iFlySpeechRecognizer setParameter:instance.language forKey:[IFlySpeechConstant LANGUAGE_ENGLISH]];
        }
        //设置是否返回标点符号
        [_iFlySpeechRecognizer setParameter:instance.dot forKey:[IFlySpeechConstant ASR_PTT]];
    }
}

-(void)startRecorder
{
    [_iFlySpeechRecognizer cancel];
    [self.iFlySpeechRecognizer startListening];
    NSLog(@"startRecorder");
}
/*!
 *  停止录音
 *    调用此函数会停止录音，并开始进行语音识别
 */
- (void)stopRecorder
{
    [self.iFlySpeechRecognizer stopListening];
    NSLog(@"stopRecorder");
}

#pragma mark-IFlySpeechRecognizerDelegate
/*!
 *  识别结果回调
 *    在进行语音识别过程中的任何时刻都有可能回调此函数，你可以根据errorCode进行相应的处理，
 *  当errorCode没有错误时，表示此次会话正常结束；否则，表示此次会话有错误发生。特别的当调用
 *  `cancel`函数时，引擎不会自动结束，需要等到回调此函数，才表示此次会话结束。在没有回调此函数
 *  之前如果重新调用了`startListenging`函数则会报错误。
 *
 *  @param errorCode 错误描述
 */
- (void) onError:(IFlySpeechError *) errorCode
{
   NSString * text = [NSString stringWithFormat:@"发生错误：%d %@", errorCode.errorCode,errorCode.errorDesc];
    NSLog(@"error:%@",text);
  //  NSDictionary *dict = [NSDictionary dictionaryWithObjectsAndKeys:[NSString stringWithFormat:@"%d",[errorCode errorCode]],@"errorCode",[errorCode errorDesc],@"errorDesc", nil];

   // [self.delegate MySpeechRecognizerDidEnd:[NSString stringWithFormat:@"%@",dict] IsSuccess:NO];
}

/*!
 *  识别结果回调
 *    在识别过程中可能会多次回调此函数，你最好不要在此回调函数中进行界面的更改等操作，只需要将回调的结果保存起来。
 *  使用results的示例如下：
 *  <pre><code>
 *  - (void) onResults:(NSArray *) results{
 *     NSMutableString *result = [[NSMutableString alloc] init];
 *     NSDictionary *dic = [results objectAtIndex:0];
 *     for (NSString *key in dic){
 *        [result appendFormat:@"%@",key];//合并结果
 *     }
 *   }
 *  </code></pre>
 *
 *  @param results  -[out] 识别结果，NSArray的第一个元素为NSDictionary，NSDictionary的key为识别结果，sc为识别结果的置信度。
 *  @param isLast   -[out] 是否最后一个结果
 */
- (void) onResults:(NSArray *) results isLast:(BOOL)isLast
{
    NSMutableString *resultString = [[NSMutableString alloc] init];
    NSDictionary *dic = results[0];
    for (NSString *key in dic) {
        [resultString appendFormat:@"%@",key];
    }
    NSString * resultFromJson =  [ISRDataHelper stringFromJson:resultString];
    lastResult = [lastResult stringByAppendingString:resultFromJson];
    if (isLast){
        //获取语音存储路径
        NSString *path = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES)[0];
        path = [path stringByAppendingPathComponent:[self.iFlySpeechRecognizer parameterForKey:[IFlySpeechConstant ASR_AUDIO_PATH]]];
      //  NSDictionary *resultDic = [NSDictionary dictionaryWithObjects:@[@"success",lastResult] forKeys:@[@"status",@"result"]];
        NSLog(@"result:%@",lastResult);
        //代理方法
        [self.delegate MySpeechRecognizerDidEnd:lastResult IsSuccess:YES];
    }
}


@end
