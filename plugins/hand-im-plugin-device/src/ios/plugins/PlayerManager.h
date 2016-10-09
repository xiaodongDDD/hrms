//
//  PlayerManager.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/3.
//
//

#import <Foundation/Foundation.h>


@interface PlayerManager : NSObject
+ (instancetype)sharedManager;
- (void)startPlay:(NSString *)filePath;
- (void)stopPlay;
- (void)cancelPlay;
- (void)startPlayData:(NSData *)fileData;
@end
