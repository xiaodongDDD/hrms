//
//  AppDelegate+CDVIMPlugin.h
//  IMTest
//
//  Created by wangsheng on 16/7/11.
//
//

#import "AppDelegate.h"
#import "CVDPlugin-Bridging-Header.h"

static NSDictionary *_launchOptions;
@interface AppDelegate (CDVIMPlugin)<RCIMReceiveMessageDelegate,RCIMConnectionStatusDelegate>

@end
