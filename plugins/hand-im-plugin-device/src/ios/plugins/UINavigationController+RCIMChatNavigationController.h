//
//  UINavigationController+RCIMChatNavigationController.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/1.
//
//

#import <UIKit/UIKit.h>
@interface UINavigationController (RCIMChatNavigationController)
-(instancetype)initWithTargetId:(NSString *)targetId FriendName:(NSString *)name Icon:(NSString *)portrait PhoneNumbers:(NSArray *)numbers;
@end
