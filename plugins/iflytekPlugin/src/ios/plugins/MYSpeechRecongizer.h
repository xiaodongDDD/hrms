//
//  MYSpeechRecongizer.h
//  芝士网
//
//  Created by wangsheng on 16/4/22.
//
//

#import <iflyMSC/iflyMSC.h>

@protocol MySpeechRecognizerDelegate <NSObject>
@optional
//评测完毕回调的方法
- (void)MySpeechRecognizerDidEnd:(NSString *)string IsSuccess:(BOOL)isSuccess;
@end


@interface MYSpeechRecongizer : NSObject
@property (nonatomic,strong)id<MySpeechRecognizerDelegate>delegate;
- (void)startRecorder;
- (void)stopRecorder;
@end
