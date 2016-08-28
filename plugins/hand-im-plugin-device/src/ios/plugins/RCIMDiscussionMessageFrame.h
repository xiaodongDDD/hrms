//
//  RCIMDiscussionMessageFrame.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/24.
//
//

#import <Foundation/Foundation.h>
#import "CVDPlugin-Bridging-Header.h"

@interface RCIMDiscussionMessageFrame : NSObject
@property (nonatomic,assign)CGRect timeLineSize;
@property (nonatomic,assign)CGRect userNameSize;
@property (nonatomic,assign)CGRect iconSize;
@property (nonatomic,assign)CGRect messageLabelSize;
@property (nonatomic,strong)RCMessage *message;
@property (nonatomic,assign)CGFloat heightForCell;
@end
