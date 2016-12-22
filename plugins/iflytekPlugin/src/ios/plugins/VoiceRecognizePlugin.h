//
//  VoiceRecognizePlugin.h
//  HelloCordova
//
//  Created by wangsheng on 2016/10/18.
//
//

#import <Cordova/CDV.h>

@interface VoiceRecognizePlugin : CDVPlugin

- (void)startRecorerRecognize:(CDVInvokedUrlCommand *)command;

- (void)stopRecorderRecognize:(CDVInvokedUrlCommand *)command;
@end
