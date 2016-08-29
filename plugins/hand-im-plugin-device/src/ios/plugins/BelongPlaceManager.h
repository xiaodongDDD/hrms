//
//  BelongPlaceManager.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/16.
//
//

#import <Foundation/Foundation.h>

typedef void(^BelongPlaceManagerBlock)(NSString *str);
@interface BelongPlaceManager : NSObject
@property (nonatomic,strong)BelongPlaceManagerBlock successCall;
+ (instancetype)sharedInsance;
- (void)APIRequest:(NSString *)phoneNumber;
@end
