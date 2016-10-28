//
//  TimeTool.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/13.
//
//

#import <Foundation/Foundation.h>

@interface TimeTool : NSObject
/**
 *  返回格式化后的时间
 *
 *  @param timestamp 时间戳
 */
+ (NSString *)timeStr:(long long)timestamp;
+ (NSString *)sortTime:(long long)timestamp;
@end
