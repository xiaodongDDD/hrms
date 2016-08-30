//
//  MessageFrame.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/21.
//
//

#import <Foundation/Foundation.h>
#import "CVDPlugin-Bridging-Header.h"

@interface MessageFrame : NSObject

@property (nonatomic,assign)CGRect timeLineSize;
@property (nonatomic,assign)CGRect userNameSize;
@property (nonatomic,assign)CGRect iconSize;
@property (nonatomic,assign)CGRect messageLabelSize;

@property (nonatomic,strong)RCMessage *message;
@property (nonatomic,assign)CGFloat heightForCell;
@end
