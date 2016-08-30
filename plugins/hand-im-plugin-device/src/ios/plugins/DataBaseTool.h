//
//  DataBaseTool.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/15.
//
//

#import <Foundation/Foundation.h>
#import "TimeTool.h"

@interface DataBaseTool : NSObject
/*!
 * 获取所有数据
 */
+(NSArray *)getAllMessagesData;
/*!
 * 根据工号获取员工Name
 */
+(NSString *)getNameByWorkerId:(NSString *)userId;
/*!
 * 根据工号获取员工图像
 */
+(NSString *)getImageUrlByWorkerId:(NSString *)userId;

/*!
 * 插入数据数据
 */
+(void)insetSendDataType:(NSString *)messageType SendId:(NSString *)sendId ReceivedId:(NSString *)receivedId Content:(NSString *)content SendTime:(NSString *)sendTime ReceiveTime:(NSString *)receiveTime Flag:(NSString *)flag;
+(void)insetReceivedDataType:(NSString *)messageType SendId:(NSString *)sendId ReceivedId:(NSString *)receivedId Content:(NSString *)content SendTime:(NSString *)sendTime ReceiveTime:(NSString *)receiveTime Flag:(NSString *)flag;
/*!
 * 修改数据数据 标记 是否已读
 */
+(void)updateDataType:(NSString *)messageType SendId:(NSString *)sendId;
/*!
 * 删除聊天列表by id
 */
+(void)deleteDataListBy:(NSString *)friendId;
/*!
 * 插入员工详细信息
 */
+ (void)insertPersonDetailInformationWithId:(NSString *)userId Name:(NSString *)userName ImageUrl:(NSString *)userIcon;
/*!
 * 更新员工详细信息
 */
+ (void)updatePersonDetailInformationWithId:(NSString *)userId Name:(NSString *)userName ImageUrl:(NSString *)userIcon;
/*!
 * 查询相同员工详细信息
 */
+(BOOL)selectSameUserInfoWithId:(NSString *)userId Name:(NSString *)userName ImageUrl:(NSString *)userIcon;
/*!
 * 获得所有员工详细信息
 */
+ (NSMutableArray *)getAllUsersInfo;
@end
