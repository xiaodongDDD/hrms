//
//  AppDelegate+CDVIMPlugin.h
//  IMTest
//
//  Created by wangsheng on 16/7/11.
//
//

#import "AppDelegate.h"
#import "CVDPlugin-Bridging-Header.h"

static NSDictionary *launchOptions;
@interface AppDelegate (CDVIMPlugin)<RCIMClientReceiveMessageDelegate>

@end
