//
//  CDVIMPlugin.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/11.
//
//

#import <Cordova/CDV.h>

@interface CDVIMPlugin : CDVPlugin
/*!
 * 程序点击登陆的时候调用
 */
-(void)getChatList:(CDVInvokedUrlCommand *)command;
/*
 * 开启单人会话
 */
- (void)toChatAct:(CDVInvokedUrlCommand *)command;
/*
 * 返回会话列表 刷新列表
 */
-(void)returnConversationList:(CDVInvokedUrlCommand *)command;

@end
