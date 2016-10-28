//
//  ProviderDelegate.m
//  OneCallKitDemo
//
//  Created by xiaowei on 16/10/02.
//  Copyright © 2016年 xiaowei. All rights reserved.
//

#import "ProviderDelegate.h"
#import "CallAudio.h"
#import <Intents/Intents.h>
#import <RongCallKit/RongCallKit.h>
#import <RongCallLib/RongCallLib.h>
#import "CustomRCCall.h"

@interface ProviderDelegate()
@property (nonatomic, strong) CXProvider *provider;
@property (nonatomic,strong)WTCall *callProvider;
@property (nonatomic,strong) RCCallSingleCallViewController *singleCallViewController;//单人语音

@property (nonatomic,strong) RCCallAudioMultiCallViewController *multAudioCtrl;//多人语音
@property (nonatomic,strong) RCCallVideoMultiCallViewController *multVideoCtrl;//多人视频

@end

@implementation ProviderDelegate

@synthesize provider;
@synthesize callProvider;

- (instancetype)init{
    self = [super init];
    if (self) {
        self.callManager =  [WTCallManager shareInstance];
        provider = [[CXProvider alloc] initWithConfiguration:[self providerConfiguration]];
        [provider setDelegate:self queue:nil];
    }
    return self;
}

- (instancetype)initWithCallManager:(WTCallManager *)callManager{
    self = [super init];
    if (self) {
        self.callManager = callManager;
        provider = [[CXProvider alloc] initWithConfiguration:[self providerConfiguration]];
        [provider setDelegate:self queue:nil];
    }
    return self;
}

- (CXProviderConfiguration *)providerConfiguration{
    NSString *localizedName = @"汉得移动";
    CXProviderConfiguration *providerConfiguration = [[CXProviderConfiguration alloc] initWithLocalizedName:localizedName];
    providerConfiguration.supportsVideo = YES;
    providerConfiguration.maximumCallsPerCallGroup = 1;
    providerConfiguration.supportedHandleTypes = [NSSet setWithObjects:[NSNumber numberWithInteger:CXHandleTypePhoneNumber],[NSNumber numberWithInteger:CXHandleTypeGeneric] ,nil];
    providerConfiguration.iconTemplateImageData = UIImagePNGRepresentation([UIImage imageNamed:@"icon_128x128"]);
    providerConfiguration.ringtoneSound = @"Ringtone.caf";
    return providerConfiguration;
}

//提交给系统一个多人通话来电
- (void)reportMutableIncomingCallUUID:(NSUUID *)uuid handle:(NSString *)handle hasVideo:(BOOL)hasVideo completion:(void (^ __nullable)(NSError *_Nullable error))completion{
    CXCallUpdate *update = [[CXCallUpdate alloc] init];
    update.remoteHandle = [[CXHandle alloc] initWithType:CXHandleTypeGeneric value:handle];
    update.hasVideo = hasVideo;
    __weak typeof(self) weakSelf = self;
    
    [provider reportNewIncomingCallWithUUID:uuid update:update completion:^(NSError * _Nullable error) {
        if (error == nil) {
            callProvider = [[WTCall alloc] initWithUUID:uuid];
            callProvider.handle = handle;
            callProvider.hasConnectedDidChange = ^(BOOL success){
                dispatch_async(dispatch_get_main_queue(), ^{
                    
                    RCCallSession *session = [[CustomRCCall sharedRCCall] currentCallSession];
                    if(hasVideo){
                        [session accept:RCCallMediaVideo];
                        weakSelf.multVideoCtrl =
                        [[RCCallVideoMultiCallViewController alloc]
                         initWithActiveCall:session];
                        [[CustomRCCall sharedRCCall] presentCallViewController:weakSelf.multVideoCtrl];
                    }else{
                        [session accept:RCCallMediaAudio];
                        weakSelf.multAudioCtrl =
                        [[RCCallAudioMultiCallViewController alloc]
                         initWithActiveCall:session];
                        [[CustomRCCall sharedRCCall] presentCallViewController:weakSelf.multAudioCtrl];
                    }
                });
                
            };
            callProvider.hasEndedDidChange = ^(BOOL success){
                dispatch_async(dispatch_get_main_queue(), ^{
                    
                    RCCallSession *session = [[CustomRCCall sharedRCCall] currentCallSession];
                    [session hangup];
                    if(hasVideo){
                        [[CustomRCCall sharedRCCall]dismissCallViewController:weakSelf.multVideoCtrl];
                    }else{
                        
                        [[CustomRCCall sharedRCCall]dismissCallViewController:weakSelf.multAudioCtrl];
                    }
                });
            };
            [weakSelf.callManager addCall:self.callProvider];
        }
        completion(error);
    }];
}

//提交给系统一个新的来电,
- (void)reportIncomingCallUUID:(NSUUID *)uuid handle:(NSString *)handle hasVideo:(BOOL)hasVideo completion:(void (^)(NSError *_Nullable error))completion{
    CXCallUpdate *update = [[CXCallUpdate alloc] init];
    update.remoteHandle = [[CXHandle alloc] initWithType:CXHandleTypeGeneric value:handle];
    update.hasVideo = hasVideo;
    __weak typeof(self) weakSelf = self;
    
    [provider reportNewIncomingCallWithUUID:uuid update:update completion:^(NSError * _Nullable error) {
        if (error == nil) {
            callProvider = [[WTCall alloc] initWithUUID:uuid];
            callProvider.handle = handle;
            callProvider.hasConnectedDidChange = ^(BOOL success){
                dispatch_async(dispatch_get_main_queue(), ^{
                    
                    RCCallSession *session = [[CustomRCCall sharedRCCall] currentCallSession];
                    weakSelf.singleCallViewController =
                    [[RCCallSingleCallViewController alloc]
                     initWithActiveCall:session];
                    [[CustomRCCall sharedRCCall] presentCallViewController:weakSelf.singleCallViewController];
                    [session accept:RCCallMediaAudio];
                });
            };
            callProvider.hasEndedDidChange = ^(BOOL success){
                dispatch_async(dispatch_get_main_queue(), ^{
                    
                    RCCallSession *session = [[CustomRCCall sharedRCCall] currentCallSession];
                    [session hangup];
                    [[CustomRCCall sharedRCCall]dismissCallViewController:weakSelf.singleCallViewController];
                });
            };
            [weakSelf.callManager addCall:self.callProvider];
        }
        completion(error);
    }];
}

#pragma mark - CXProviderDelegate
- (void)providerDidReset:(CXProvider *)provider{
    NSLog(@"provider Did Reset");
    stopAudio();
    for (WTCall *call in _callManager.calls) {
        [call endWTCallCall];
    }
    [_callManager removeAllCalls];
}

- (void)provider:(CXProvider *)provider performStartCallAction:(CXStartCallAction *)action{
    WTCall *call = [[WTCall alloc] initWithUUID:action.callUUID isOutgoing:YES];
    call.handle = action.handle.value;
    
    configureAudioSession();
    
    __weak typeof(self) weakSelf = self;
    __weak typeof(WTCall *) weakCall = call;
    call.hasStartedConnectingDidChange = ^(BOOL success){
        [weakSelf.provider reportOutgoingCallWithUUID:weakCall.uuid startedConnectingAtDate:weakCall.connectingDate];
    };
    
    call.hasConnectedDidChange = ^(BOOL success){
        [weakSelf.provider reportOutgoingCallWithUUID:weakCall.uuid connectedAtDate:weakCall.connectDate];
    };
    [call startWTCallCallCompletion:^(BOOL success) {
        if (success) {
            [action fulfill];
            [weakSelf.callManager addCall:weakCall];
        }else{
            [action fail];
        }
    }];
}

//接听电话
- (void)provider:(CXProvider *)provider performAnswerCallAction:(CXAnswerCallAction *)action{
    WTCall *call = [_callManager callWithUUID:action.callUUID];
    if (call == nil) {
        [action fail];
    }else{
        configureAudioSession();
        [call answerWTCallCall];
        [action fulfill];
    }
}
//挂断电话
- (void)provider:(CXProvider *)provider performEndCallAction:(CXEndCallAction *)action{
    WTCall *call = [_callManager callWithUUID:action.callUUID];
    if (call == nil) {
        [action fail];
    }else{
        stopAudio();
        [call endWTCallCall];
        [action fulfill];
        [_callManager removeCall:call];
    }
}

- (void)provider:(CXProvider *)provider performSetHeldCallAction:(CXSetHeldCallAction *)action{
    WTCall *call = [_callManager callWithUUID:action.callUUID];
    if (call == nil) {
        [action fail];
    }else{
        call.isOnHold = action.isOnHold;
        if (call.isOnHold) {
            stopAudio();
        }else{
            startAudio();
        }
        [action fulfill];
    }
}

- (void)provider:(CXProvider *)provider timedOutPerformingAction:(CXAction *)action{
    
}

- (void)provider:(CXProvider *)provider didActivateAudioSession:(AVAudioSession *)audioSession{
    stopAudio();
}
- (void)provider:(CXProvider *)provider didDeactivateAudioSession:(AVAudioSession *)audioSession{
    
}

#pragma mark - CallAudio
void stopAudio(){
    CallAudio *audio = [CallAudio sharedCallAudio];
    [audio stopAudio];
}

void startAudio(){
    CallAudio *audio = [CallAudio sharedCallAudio];
    [audio startAudio];
}

void configureAudioSession(){
    CallAudio *audio = [CallAudio sharedCallAudio];
    [audio configureAudioSession];
}


@end
