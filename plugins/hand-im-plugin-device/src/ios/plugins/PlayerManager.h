//
//  PlayerManager.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/3.
//
//

#import <Foundation/Foundation.h>

@protocol PlayerManagerProtocol <NSObject>

@optional
- (void)finishedPlayingVoice;

@end
@interface PlayerManager : NSObject
@property (nonatomic,strong)id<PlayerManagerProtocol>delegate;
+ (instancetype)sharedManager;
- (void)startPlay:(NSString *)filePath;
- (void)stopPlay;
- (void)cancelPlay;
- (void)startPlayData:(NSData *)fileData;
@end
