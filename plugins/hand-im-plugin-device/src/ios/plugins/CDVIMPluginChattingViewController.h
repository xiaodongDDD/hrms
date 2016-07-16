//
//  CDVIMPluginChattingViewController.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/11.
//
//

#import <RongIMKit/RongIMKit.h>

@interface CDVIMPluginChattingViewController : RCConversationViewController
@property (nonatomic,copy)NSString *navTitle;
@property (nonatomic,copy)NSString *targetId;
@end
