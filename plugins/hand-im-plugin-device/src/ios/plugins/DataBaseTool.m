//
//  DataBaseTool.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/15.
//
//

#import "DataBaseTool.h"
#import "FMDB.h"

static FMDatabase *db;
@implementation DataBaseTool

+(void)initialize
{
    NSString *dbPath = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES)[0];
    dbPath = [dbPath stringByAppendingPathComponent:@"messages4.0.0.sqlite"];
    NSLog(@"创建数据库,数据库路径:%@",dbPath);
    db = [FMDatabase databaseWithPath:dbPath];
    //创建表 人员表
    if ([db open]) {
        NSString *sqlCreateTable =  @"CREATE TABLE IF NOT EXISTS Workers_Table(id INTEGER PRIMARY KEY AUTOINCREMENT, worker_id TEXT, name TEXT,image_url TEXT,tel TEXT)";
        BOOL res = [db executeUpdate:sqlCreateTable];
        if (!res) {
            NSLog(@"error when creating db table");
        } else {
            NSLog(@"success to creating db table");
        }
        [db close];
    }
    //创建表 讨论组头像表
    if ([db open]) {
        NSString *sqlCreateTable =  @"CREATE TABLE IF NOT EXISTS Discussion_Table(id INTEGER PRIMARY KEY AUTOINCREMENT, discussionId TEXT,image_url TEXT)";
        BOOL res = [db executeUpdate:sqlCreateTable];
        if (!res) {
            NSLog(@"error when creating db table");
        } else {
            NSLog(@"success to creating db table");
        }
        [db close];
    }
}

+ (void)insertDiscussionGroupInformation:(NSString *)discussionId PortraitUri:(NSString *)portraitUri
{
    NSLog(@"插入讨论组信息");
    //添加数据
    //添加数据
    if ([db open]) {
        NSString *insertSql= [NSString stringWithFormat:
                              @"INSERT INTO  Discussion_Table(discussionId, image_url) VALUES ('%@', '%@')", discussionId,portraitUri];
        BOOL res = [db executeUpdate:insertSql];
        if (!res) {
            NSLog(@"error when insert db table");
        } else {
            NSLog(@"成功插入讨论组信息id:%@,imageUrl:%@",discussionId,portraitUri);
        }
        [db close];
    }
}

+ (NSString *)getDiscussionPortraitUriById:(NSString *)discussionId
{
    NSLog(@"获取讨论组头像url");
    
    NSString *portraitUri ;
    if ([db open]) {
        NSString * sql = [NSString stringWithFormat:
                          @"SELECT image_url FROM Discussion_Table WHERE discussionId = '%@' ",discussionId];
        FMResultSet * rs = [db executeQuery:sql];
        while ([rs next]) {
            NSString * imageURL = [rs stringForColumn:@"image_url"];
            portraitUri = imageURL;
        }
        [db close];
    }
    return portraitUri;
}

+(void)insertPersonDetailInformationWithId:(NSString *)userId Name:(NSString *)userName ImageUrl:(NSString *)userIcon Tel:(NSString *)telphone
{
    NSLog(@"插入员工信息");//worker_id TEXT, name TEXT,image_url TEXT,tel
    //添加数据
    if ([db open]) {
        NSString *insertSql= [NSString stringWithFormat:
                              @"INSERT INTO  Workers_Table(worker_id, name, image_url, tel) VALUES ('%@', '%@', '%@', '%@')", userId,userName,userIcon,telphone];
        BOOL res = [db executeUpdate:insertSql];
        if (!res) {
            NSLog(@"error when insert db table");
        } else {
            NSLog(@"success to insert db table");
        }
        [db close];
    }
}

+(NSString *)getNameByWorkerId:(NSString *)userId
{
    NSLog(@"获取员工姓名");
    NSString *NameByWorkerId ;
    if ([db open]) {
        NSString * sql = [NSString stringWithFormat:
                          @"SELECT name FROM Workers_Table WHERE worker_id = '%@' ",userId];
        FMResultSet * rs = [db executeQuery:sql];
        while ([rs next]) {
            NSString * name = [rs stringForColumn:@"name"];
            NameByWorkerId = name;
            //   NSLog(@"根据id获取姓名 worker_id = %@, name = %@ ", worker_id, name);
        }
        [db close];
    }
    return NameByWorkerId;
}

+(NSString *)getImageUrlByWorkerId:(NSString *)userId
{
    NSLog(@"获取员工头像");
    NSString *imageUrlByWorkerId;
    if ([db open]) {
        NSString * sql = [NSString stringWithFormat:
                          @"SELECT image_url FROM Workers_Table WHERE worker_id = '%@' ",userId];
        FMResultSet * rs = [db executeQuery:sql];
        while ([rs next]) {
            NSString * image_url = [rs stringForColumn:@"image_url"];
            imageUrlByWorkerId = image_url;
            //     NSLog(@"根据id获取头像 workId = %@, imageUrl = %@ ", worker_id, image_url);
        }
        [db close];
    }
    return imageUrlByWorkerId;
}

+(NSString *)getTelPhoneByWorkerId:(NSString *)userId
{
    NSLog(@"获取员工电话");
    NSString *telPhone;
    if ([db open]) {
        NSString * sql = [NSString stringWithFormat:
                          @"SELECT tel FROM Workers_Table WHERE worker_id = '%@' ",userId];
        FMResultSet * rs = [db executeQuery:sql];
        while ([rs next]) {
            NSString *tel = [rs stringForColumn:@"tel"];
            telPhone = tel;
        }
        [db close];
    }
    return telPhone;
}

+(NSMutableArray *)getAllMessagesData
{
    NSLog(@"获取数据");
    NSMutableArray *array = [NSMutableArray array];
    if ([db open]) {
        NSString * sql = [NSString stringWithFormat:
                          @"SELECT inner_id id,friend_id_inner send_id,send_time,message_num, "
                          "(SELECT t.content FROM messages_table t WHERE t.friend_id = friend_id_inner AND t.id = inner_id) content "
                          "FROM (SELECT MAX(id) inner_id,friend_id friend_id_inner,MAX(send_time) send_time, "
                          "SUM(CASE flag WHEN 'Y' THEN 0 WHEN 'N' THEN 1 END) message_num "
                          "  FROM messages_table GROUP BY friend_id) ORDER BY send_time DESC "];
        FMResultSet * rs = [db executeQuery:sql];
        while ([rs next]) {
            NSString * sendId = [rs stringForColumn:@"send_id"];
            NSString * sendTime =  [TimeTool timeStr:[rs stringForColumn:@"send_time"].longLongValue];
            NSString *content = [rs stringForColumn:@"content"];
            NSString *messageNum = [rs stringForColumn:@"message_num"];
            NSDictionary *dictMessage = [NSDictionary dictionaryWithObjects:@[@{@"sendId":sendId,@"userName":[DataBaseTool getNameByWorkerId:sendId],@"userIcon":[DataBaseTool getImageUrlByWorkerId:sendId],@"content":content,@"sendTime":sendTime,@"messageNum":messageNum}] forKeys:@[@"message"]];
            NSLog(@"sendID = %@ , content = %@, sendTime = %@, messageNum = %@, userName = %@, userIcon = %@",sendId,content,sendTime,messageNum,[DataBaseTool getNameByWorkerId:sendId],[DataBaseTool getImageUrlByWorkerId:sendId] );
            [array addObject:dictMessage];
        }
        [db close];
    }
    return array;
}

+(void)insetSendDataType:(NSString *)messageType SendId:(NSString *)sendId ReceivedId:(NSString *)receivedId Content:(NSString *)content SendTime:(NSString *)sendTime ReceiveTime:(NSString *)receiveTime Flag:(NSString *)flag
{
    NSLog(@"添加数据SendData");
    //添加数据
    if ([db open]) {
        NSString *insertSql= [NSString stringWithFormat:
                              @"INSERT INTO  Messages_Table(type, send_id, content, received_id,send_time, received_time, flag ,current_user_id , friend_id) VALUES ('%@', '%@', '%@', '%@', '%@', '%@', '%@', '%@', '%@')", messageType,sendId,content,receivedId,sendTime,receiveTime,flag,sendId,receivedId];
        BOOL res = [db executeUpdate:insertSql];
        
        if (!res) {
            NSLog(@"error when insert db table");
        } else {
            NSLog(@"success to insert db table");
        }
        [db close];
    }
}

+(void)insetReceivedDataType:(NSString *)messageType SendId:(NSString *)sendId ReceivedId:(NSString *)receivedId Content:(NSString *)content SendTime:(NSString *)sendTime ReceiveTime:(NSString *)receiveTime Flag:(NSString *)flag
{
    NSLog(@"添加数据ReceivedData");
    //添加数据
    if ([db open]) {
        NSString *insertSql= [NSString stringWithFormat:
                              @"INSERT INTO  Messages_Table(type, send_id, content, received_id,send_time, received_time, flag ,current_user_id , friend_id) VALUES ('%@', '%@', '%@', '%@', '%@', '%@', '%@', '%@', '%@')", messageType,sendId,content,receivedId,sendTime,receiveTime,flag,receivedId,sendId];
        BOOL res = [db executeUpdate:insertSql];
        
        if (!res) {
            NSLog(@"error when insert db table");
        } else {
            NSLog(@"success to insert db table");
        }
        [db close];
    }
}


+(void)updateDataType:(NSString *)messageType SendId:(NSString *)sendId
{
    NSLog(@"修改数据库");
    //修改数据
    if ([db open]) {
        NSString *updateSql = [NSString stringWithFormat:
                               @"UPDATE Messages_Table SET flag = 'Y' WHERE flag = 'N' AND send_id = '%@' ",sendId];
        BOOL res = [db executeUpdate:updateSql];
        if (!res) {
            NSLog(@"error when update db table");
        } else {
            NSLog(@"success to update db table");
        }
        [db close];
    }
}

//删除聊天列表里的某条记录
+ (void)deleteDataListBy:(NSString *)friendId Type:(RCConversationType)type
{
    //    NSLog(@"删除数据库");
    //    if ([db open]) {
    //        NSString *deleteSql = [NSString stringWithFormat:
    //                               @"delete from Messages_Table where friend_id = '%@'",friendId];
    //        BOOL res = [db executeUpdate:deleteSql];
    //
    //        if (!res) {
    //            NSLog(@"error when delete db table");
    //        } else {
    //            NSLog(@"success to delete db table");
    //        }
    //        [db close];
    //    }
    [[RCIMClient sharedRCIMClient] removeConversation:type targetId:friendId];
}


+ (void)updatePersonDetailInformationWithId:(NSString *)userId Name:(NSString *)userName ImageUrl:(NSString *)userIcon Tel:(NSString *)tel
{
    NSLog(@"更新联系人信息");
    //修改数据
    if ([db open]) {
        NSString *updateSql = [NSString stringWithFormat:
                               @"UPDATE Workers_Table SET image_url = '%@', tel = '%@' WHERE worker_id = '%@' ",userIcon,tel,userId];
        BOOL res = [db executeUpdate:updateSql];
        if (!res) {
            NSLog(@"error when update db table");
        } else {
            NSLog(@"success to update db table");
        }
        [db close];
    }
}

+(BOOL)hasPerson:(NSString*)userId
{
    BOOL flag = NO;
    if ([db open]) {
        NSString * sql = [NSString stringWithFormat:
                          @"SELECT * FROM Workers_Table WHERE worker_id = '%@' ",userId];
        FMResultSet * rs = [db executeQuery:sql];
        while ([rs next]) {
            flag = YES;
            NSLog(@"查到了相同的员工");
        }
        [db close];
        if (!rs) {
            NSLog(@"error when executeQuery db table");
        } else {
            NSLog(@"success to executeQuery db table");
        }
    }
    return flag;
}

+(BOOL)selectSameUserInfoWithId:(NSString *)userId Name:(NSString *)userName ImageUrl:(NSString *)userIcon Tel:(NSString *)tel
{
    NSLog(@"查询相同信息");
    BOOL flag = [DataBaseTool hasPerson:userId];
    if (!flag) {
        //没有一个相同
        //一个没找到 可以插入新联系人
        [self insertPersonDetailInformationWithId:userId Name:userName ImageUrl:userIcon Tel:tel];
        NSLog(@"插入新联系人");
    }else{
        //可以更新
        [self updatePersonDetailInformationWithId:userId Name:userName ImageUrl:userIcon Tel:tel];
        NSLog(@"更新联系人");
    }
    
    return flag;
}

+(NSMutableArray *)getAllUsersInfo
{
    NSLog(@"查询所有联系人信息");
    NSMutableArray *array = [NSMutableArray array];
    //修改数据
    if ([db open]) {
        NSString *updateSql = [NSString stringWithFormat:
                               @"SELECT worker_id, name, image_url  FROM Workers_Table  "];
        FMResultSet *rs = [db executeQuery:updateSql];
        
        while ([rs next]) {
            NSString * work_id = [rs stringForColumn:@"worker_id"];
            NSString * name = [rs stringForColumn:@"name"];
            NSString * image_url = [rs stringForColumn:@"image_url"];
            NSDictionary *userInfo = @{@"work_id":work_id, @"name":name, @"image_url":image_url};
            [array addObject:userInfo];
        }
        
        [db close];
    }
    return array;
}

@end
