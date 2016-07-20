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
    dbPath = [dbPath stringByAppendingPathComponent:@"messages2.0.10.sqlite"];
    NSLog(@"创建数据库,数据库路径:%@",dbPath);
    db = [FMDatabase databaseWithPath:dbPath];
    //创建表 消息表
    if ([db open]) {
        NSString *sqlCreateTable =  @"CREATE TABLE IF NOT EXISTS Messages_Table(id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, send_id TEXT,received_id TEXT, content TEXT, send_time TEXT, received_time TEXT, flag TEXT, current_user_id TEXT ,friend_id TEXT)";
        BOOL res = [db executeUpdate:sqlCreateTable];
        if (!res) {
            NSLog(@"error when creating db table");
        } else {
            NSLog(@"success to creating db table");
        }
        [db close];
    }
    //创建表 人员表
    if ([db open]) {
        NSString *sqlCreateTable =  @"CREATE TABLE IF NOT EXISTS Workers_Table(id INTEGER PRIMARY KEY AUTOINCREMENT, worker_id TEXT, name TEXT,image_url TEXT)";
        BOOL res = [db executeUpdate:sqlCreateTable];
        if (!res) {
            NSLog(@"error when creating db table");
        } else {
            NSLog(@"success to creating db table");
        }
        [db close];
    }
}

+(NSString *)getNameByWorkerId
{
    NSString *NameByWorkerId;
    if ([db open]) {
        NSString * sql = [NSString stringWithFormat:
                          @"SELECT * FROM Workers_Table"];
        FMResultSet * rs = [db executeQuery:sql];
        while ([rs next]) {
            NSString *workId = [rs stringForColumn:@"worker_id"];
            NSString * name = [rs stringForColumn:@"name"];
            NameByWorkerId = name;
            NSLog(@"根据id获取姓名 workId = %@, name = %@ ", workId, name);
        }
        [db close];
    }
    return NameByWorkerId;
}

+(NSString *)getImageUrlByWorkerId
{
    NSString *imageUrlByWorkerId;
    if ([db open]) {
        NSString * sql = [NSString stringWithFormat:
                          @"SELECT * FROM Workers_Table"];
        FMResultSet * rs = [db executeQuery:sql];
        while ([rs next]) {
            NSString *workId = [rs stringForColumn:@"worker_id"];
            NSString * imageUrl = [rs stringForColumn:@"image_url"];
            imageUrlByWorkerId = imageUrl;
            NSLog(@"根据id获取头像 workId = %@, imageUrl = %@ ", workId, imageUrl);
        }
        [db close];
    }
    return imageUrlByWorkerId;
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
            NSLog(@"sendID = %@ , content = %@, sendTime = %@, messageNum = %@",sendId,content,sendTime,messageNum );
            NSDictionary *dictMessage = [NSDictionary dictionaryWithObjects:@[@{@"sendId":sendId,@"content":content,@"sendTime":sendTime,@"messageNum":messageNum}] forKeys:@[@"message"]];
            [array addObject:dictMessage];
        }
        [db close];
    }
    return array;
}

+(void)insetSendDataType:(NSString *)messageType SendId:(NSString *)sendId ReceivedId:(NSString *)receivedId Content:(NSString *)content SendTime:(NSString *)sendTime ReceiveTime:(NSString *)receiveTime Flag:(NSString *)flag
{
    NSLog(@"添加数据");
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
    NSLog(@"添加数据");
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

+(void)deleteDataListBy:(NSString *)friendId
{
    NSLog(@"删除数据库");
    if ([db open]) {
        NSString *deleteSql = [NSString stringWithFormat:
                               @"delete from Messages_Table where friend_id = '%@'",friendId];
        BOOL res = [db executeUpdate:deleteSql];
        
        if (!res) {
            NSLog(@"error when delete db table");
        } else {
            NSLog(@"success to delete db table");
        }
        [db close];
    }
    
}
@end
