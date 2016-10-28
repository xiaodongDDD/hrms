//
//  PlayerManager.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/3.
//
//

#import "PlayerManager.h"
#import <AVFoundation/AVFoundation.h>
@interface PlayerManager ()<AVAudioPlayerDelegate>
{
    AVAudioPlayer *player;
}
@end
static PlayerManager *playerManager;
@implementation PlayerManager

+ (instancetype)sharedManager
{
    @synchronized(self) {
        if (playerManager==nil) {
            playerManager = [[PlayerManager alloc] init];
        }
    }
    return playerManager;
}

-(void)startPlay:(NSString *)filePath
{
    NSError *error;
    player = [[AVAudioPlayer alloc] initWithContentsOfURL:[NSURL fileURLWithPath:filePath] error:&error];
    
    player.delegate = self;
    if ([player prepareToPlay]) {
        [player play];
    }
    player.volume = 1.0;
    NSLog(@"开始播放了%@",error);
}
- (void)stopPlay
{
    if ([player isPlaying]) {
        [player stop];
    }
}
- (void)cancelPlay
{
    
}

-(void)startPlayData:(NSData *)fileData
{
    NSError *error;
    //真机测试一定要加上这句话
    AVAudioSession *audioSession = [AVAudioSession sharedInstance];
    [audioSession setCategory:AVAudioSessionCategoryPlayAndRecord error:nil];
    [audioSession setActive:YES error:nil];
    if ([player isPlaying]) {
        [player stop];
    }
    player = [[AVAudioPlayer alloc] initWithData:fileData error:&error];
     player.volume = 1.0;
    player.numberOfLoops = 0;
    player.delegate = self;
    if ([player prepareToPlay]) {
        [player play];
    }
    NSLog(@"开始播放了%@",error);
}
- (void)audioPlayerDidFinishPlaying:(AVAudioPlayer *)player successfully:(BOOL)flag
{
    NSLog(@"播放完成");
    [self.delegate finishedPlayingVoice];
}
@end
