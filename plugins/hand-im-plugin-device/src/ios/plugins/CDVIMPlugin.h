//
//  CDVIMPlugin.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/11.
//
//

#import <Cordova/CDV.h>

@interface CDVIMPlugin : CDVPlugin
- (void)exitApp:(CDVInvokedUrlCommand *)command;
/*!
 * 程序点击登陆的时候调用
 */
-(void)getChatList:(CDVInvokedUrlCommand *)command;
/*
 * 开启单人会话
 */
- (void)toChatAct:(CDVInvokedUrlCommand *)command;
/*
 * 删除某个会话
 */
-(void)deleteConversationList:(CDVInvokedUrlCommand *)command;
/*
 * 返回会话列表 刷新列表
 */
-(void)returnConversationList:(CDVInvokedUrlCommand *)command;
/*
 *   创建讨论组
 */
- (void)createDiscussion:(CDVInvokedUrlCommand *)command;
/*
 *   开启多人聊天
 */
- (void)openDiscussion:(CDVInvokedUrlCommand *)commmand;
@end
