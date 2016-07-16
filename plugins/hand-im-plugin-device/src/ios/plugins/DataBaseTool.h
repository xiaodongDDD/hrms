//
//  DataBaseTool.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/15.
//
//

#import <Foundation/Foundation.h>

@interface DataBaseTool : NSObject
/*!
 * 获取所有数据
 */
+(NSArray *)getAllData;
/*!
 * 插入数据数据
 */
+(void)insetDataType:(NSString *)messageType SendId:(NSString *)sendId Content:(NSString *)content SendTime:(NSString *)sendTime ReceiveTime:(NSString *)receiveTime Flag:(NSString *)flag;
/*!
 * 修改数据数据
 */
+(void)updateDataType:(NSString *)messageType SendId:(NSString *)sendId;

@end
