#import "AppDelegate.h"
#import "CVDPlugin-Bridging-Header.h"
#import <RongIMKit/RongIMKit.h>
#import <RongIMLib/RongIMLib.h>
#import <PushKit/PushKit.h>

#import <PushKit/PushKit.h>
#import "ProviderDelegate.h"
#import "WTCallManager.h"

static NSDictionary *launchOptions;
@interface AppDelegate (CDVIMPlugin)<RCIMClientReceiveMessageDelegate,RCIMUserInfoDataSource,RCIMConnectionStatusDelegate,UIApplicationDelegate,PKPushRegistryDelegate>
@property (strong, nonatomic) PKPushRegistry *pushRegistry;

@property (strong, nonatomic) WTCallManager *callManager;

@property (strong, nonatomic) NSMutableDictionary *notificationCenterRequired;
@property (strong, nonatomic) ProviderDelegate *providerDelegate;


+ (AppDelegate *)sharedDelegate;

- (void)displayIncomingCallUUID:(NSUUID *)uuid handle:(NSString *)handle hasVideo:(BOOL)hasVideo completion:(void (^)(NSError *_Nullable error))completion;

- (void)displayMultableIncomingCallUUID:(NSUUID *)uuid handle:(NSString *)handle hasVideo:(BOOL)hasVideo completion:(void (^)(NSError *_Nullable error))completion;


@end
