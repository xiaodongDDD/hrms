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
    NSLog(@"创建数据库");
    NSString *dbPath = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES)[0];
    dbPath = [dbPath stringByAppendingPathComponent:@"messages.sqlite"];
    NSLog(@"数据库路径:%@",dbPath);
    db = [FMDatabase databaseWithPath:dbPath];
    //创建表
    if ([db open]) {
        NSString *sqlCreateTable =  @"CREATE TABLE IF NOT EXISTS Messages_Table(ID INTEGER PRIMARY KEY AUTOINCREMENT, Type TEXT, SendId TEXT, Content TEXT, SendTime TEXT, ReceivedTime TEXT, Flag TEXT)";
        BOOL res = [db executeUpdate:sqlCreateTable];
        if (!res) {
            NSLog(@"error when creating db table");
        } else {
            NSLog(@"success to creating db table");
        }
        [db close];
    }
}

+(NSMutableArray *)getAllData
{
    NSLog(@"获取数据");
    NSMutableArray *array = [NSMutableArray array];
    if ([db open]) {
        NSString * sql = [NSString stringWithFormat:
                          @"SELECT SendId,MAX(SendTime) sendTime,"
                          "MAX(Content) content,SUM(CASE Flag WHEN 'Y' THEN 0 WHEN 'N' THEN 1 "
                          "END) messageNum FROM Messages_Table "
                          "GROUP BY SendId ORDER BY MAX(SendTime) DESC "];
        FMResultSet * rs = [db executeQuery:sql];
        while ([rs next]) {
            //int ID = [rs intForColumn:@"ID"];
            NSString * SendId = [rs stringForColumn:@"SendId"];
            NSString * sendTime = [rs stringForColumn:@"sendTime"];
            NSString *content = [rs stringForColumn:@"content"];
            NSString *messageNum = [rs stringForColumn:@"messageNum"];
            //NSString *receivedTime = [rs stringForColumn:@"ReceivedTime"];
            //NSString *flag = [rs stringForColumn:@"Flag"];
            
            NSLog(@"sendID = %@ ,sendTime = %@ , content = %@ , messageNum = %@",SendId,sendTime,content,messageNum );
            NSDictionary *dictMessage = [NSDictionary dictionaryWithObjects:@[@{@"SendId":SendId,@"Content":content,@"SendTime":sendTime,@"messageNum":messageNum}] forKeys:@[@"message"]];
            [array addObject:dictMessage];
        }
        [db close];
    }
    
    return array;
}

+(void)insetDataType:(NSString *)messageType SendId:(NSString *)sendId Content:(NSString *)content SendTime:(NSString *)sendTime ReceiveTime:(NSString *)receiveTime Flag:(NSString *)flag
{
    NSLog(@"添加数据");
    //添加数据
    if ([db open]) {
        NSString *insertSql= [NSString stringWithFormat:
                              @"INSERT INTO  Messages_Table(Type, SendId, Content, SendTime, ReceivedTime, Flag) VALUES ('%@', '%@', '%@', '%@', '%@', '%@')", messageType,sendId , content,sendTime,receiveTime,flag];
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
                               @"UPDATE Messages_Table SET Flag = 'Y' WHERE Flag = 'N' AND SendId = '%@' ",sendId];
        NSLog(@"SendId:%@",sendId);
        BOOL res = [db executeUpdate:updateSql];
        if (!res) {
            NSLog(@"error when update db table");
        } else {
            NSLog(@"success to update db table");
        }
        [db close];
    }
}

@end
