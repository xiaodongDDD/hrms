//
//  VoiceRecognizePlugin.m
//  HelloCordova
//
//  Created by wangsheng on 2016/10/18.
//
//

#import "VoiceRecognizePlugin.h"
#import "MYSpeechRecongizer.h"

@interface VoiceRecognizePlugin ()<MySpeechRecognizerDelegate>
{
    MYSpeechRecongizer *speechRecognizer;
    CDVInvokedUrlCommand *cmd_start;
    CDVInvokedUrlCommand *cmd_stop;
}

@end
@implementation VoiceRecognizePlugin

-(void)startRecorerRecognize:(CDVInvokedUrlCommand *)command
{
    cmd_start = command;
    speechRecognizer = [[MYSpeechRecongizer alloc] init];
    speechRecognizer.delegate = self;
    [speechRecognizer startRecorder];
    
}

- (void)stopRecorderRecognize:(CDVInvokedUrlCommand *)command
{
    cmd_stop = command;
    [speechRecognizer stopRecorder];
    
}
#pragma mark - 回调方法
- (void)MySpeechRecognizerDidEnd:(NSString *)stringDict IsSuccess:(BOOL)isSuccess
{
    CDVPluginResult *result;
    result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:stringDict];
    
    if (cmd_stop) {
        [self.commandDelegate sendPluginResult:result callbackId:cmd_stop.callbackId];
    }else{
        [self.commandDelegate sendPluginResult:result callbackId:cmd_start.callbackId];
    }
}

@end
