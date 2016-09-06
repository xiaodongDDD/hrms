#import "AppDelegate.h"
#import "CVDPlugin-Bridging-Header.h"
#import <RongIMKit/RongIMKit.h>
#import <RongIMLib/RongIMLib.h>

static NSDictionary *launchOptions;
@interface AppDelegate (CDVIMPlugin)<RCIMClientReceiveMessageDelegate,RCIMUserInfoDataSource>

@end