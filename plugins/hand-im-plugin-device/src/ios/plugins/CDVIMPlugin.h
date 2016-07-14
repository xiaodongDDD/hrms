//
//  CDVIMPlugin.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/11.
//
//

#import <Cordova/CDV.h>

@interface CDVIMPlugin : CDVPlugin
- (void)getChatList:(CDVInvokedUrlCommand *)command;
- (void)toChatAct:(CDVInvokedUrlCommand *)command;
@end
