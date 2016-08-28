//
//  RCIMDiscussionMessageFrame.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/24.
//
//

#import "RCIMDiscussionMessageFrame.h"
#import "TimeTool.h"
#import "YYText.h"
@implementation RCIMDiscussionMessageFrame

-(void)setMessage:(RCMessage *)message
{
    _message = message;
    
    if (message.messageDirection==MessageDirection_RECEIVE) {
        //消息接受
        CGSize timeSize  = [[TimeTool timeStr:message.receivedTime] boundingRectWithSize:[UIScreen mainScreen].bounds.size options:NSStringDrawingUsesLineFragmentOrigin attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:13.0]} context:nil].size;
        self.timeLineSize = CGRectMake(([UIScreen mainScreen].bounds.size.width-timeSize.width)/2, iconLeftSpace, timeSize.width, 13);
        self.iconSize = CGRectMake(iconLeftSpace, timeLineBottomSpace+CGRectGetMaxY(self.timeLineSize), iconSize_iphone6.width, iconSize_iphone6.height);
        CGSize nameSize = [message.content.senderUserInfo.name sizeWithAttributes:@{NSFontAttributeName:[UIFont systemFontOfSize:13.0]}];
        
        self.userNameSize = CGRectMake(CGRectGetMaxX(self.iconSize)+iconRightSpace, self.iconSize.origin.y, nameSize.width, 13);
        if ([message.content  isKindOfClass:[RCTextMessage class]]) {
            //文字消息
            RCTextMessage *txtMessage = (RCTextMessage *)message.content;
            NSString *text = txtMessage.content;
            CGSize textSize = [text boundingRectWithSize:CGSizeMake([UIScreen mainScreen].bounds.size.width-2*(self.iconSize.size.width+iconLeftSpace+iconRightSpace+textLeftRightSpace), MAXFLOAT) options:NSStringDrawingUsesLineFragmentOrigin attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]} context:nil].size;
            self.messageLabelSize = CGRectMake(CGRectGetMaxX(self.iconSize)+iconRightSpace, self.iconSize.origin.y+15, textSize.width+textLeftRightSpace*2, textSize.height+textMesaageFont);
            
        }else if ([message.content isKindOfClass:[RCImageMessage class]]){
            //图片消息
            self.messageLabelSize = CGRectMake(CGRectGetMaxX(self.iconSize)+iconRightSpace, self.iconSize.origin.y+15, imageMessageSize.width, imageMessageSize.height);
            
        }else if ([message.content isKindOfClass:[RCLocationMessage class]]){
            //位置消息
            self.messageLabelSize = CGRectMake(CGRectGetMaxX(self.iconSize)+iconRightSpace, self.iconSize.origin.y+15, imageMessageSize.width+2*imageMessageBoder, imageMessageSize.height+2*imageMessageBoder);
        }else if ([message.content isKindOfClass:[RCVoiceMessage class]]){
            //语音消息
            self.messageLabelSize = CGRectMake(CGRectGetMaxX(self.iconSize)+iconRightSpace, self.iconSize.origin.y+15, 80, 34);
            //语音消息
            RCVoiceMessage *voiceMessage = (RCVoiceMessage *)message.content;
            NSMutableAttributedString *voiceStr;
            if (voiceMessage.duration<60) {
                voiceStr = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"%li''",voiceMessage.duration] attributes:@{NSForegroundColorAttributeName:[UIColor whiteColor],NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]}];
            }else if (voiceMessage.duration%60==0){
                voiceStr = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"%li'",voiceMessage.duration/60] attributes:@{NSForegroundColorAttributeName:[UIColor whiteColor],NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]}];
            }else{
                voiceStr = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"%li'%li''",voiceMessage.duration/60,voiceMessage.duration%60] attributes:@{NSForegroundColorAttributeName:[UIColor whiteColor],NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]}];
            }
            NSMutableAttributedString *attachment = [NSMutableAttributedString yy_attachmentStringWithEmojiImage:[UIImage imageNamed:@"gxs.png"] fontSize:textMesaageFont];
            [voiceStr appendAttributedString:attachment];
            CGSize voiceTextSize = [voiceStr size];
            self.messageLabelSize = CGRectMake(CGRectGetMaxX(self.iconSize)+iconRightSpace, self.iconSize.origin.y+15, voiceTextSize.width+2*textLeftRightSpace+30, voiceTextSize.height+textMesaageFont);
        }else{
            //其他自定义消息
        }
        
    }else{
        //消息发送
        CGSize timeSize  = [[TimeTool timeStr:message.sentTime] boundingRectWithSize:[UIScreen mainScreen].bounds.size options:NSStringDrawingUsesLineFragmentOrigin attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:13.0]} context:nil].size;
        self.timeLineSize = CGRectMake(([UIScreen mainScreen].bounds.size.width-timeSize.width)/2, iconLeftSpace, timeSize.width, 13);
        
        self.iconSize = CGRectMake([UIScreen mainScreen].bounds.size.width-iconSize_iphone6.width-iconLeftSpace, timeLineBottomSpace+CGRectGetMaxY(self.timeLineSize), iconSize_iphone6.width, iconSize_iphone6.height);
        
        CGSize nameSize = [message.content.senderUserInfo.name sizeWithAttributes:@{NSFontAttributeName:[UIFont systemFontOfSize:13.0]}];
        
        self.userNameSize = CGRectMake(CGRectGetMinX(self.iconSize)-iconLeftSpace-nameSize.width, self.iconSize.origin.y, nameSize.width, 13);
        if ([message.content  isKindOfClass:[RCTextMessage class]]) {
            //文字消息
            RCTextMessage *textMessage = (RCTextMessage *)message.content;
            NSString *text = textMessage.content ;
            //计算文字大小
            CGSize textSize = [text boundingRectWithSize:CGSizeMake([UIScreen mainScreen].bounds.size.width-2*(self.iconSize.size.width+iconLeftSpace+iconRightSpace+textLeftRightSpace), MAXFLOAT) options:NSStringDrawingUsesLineFragmentOrigin attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]} context:nil].size;
            self.messageLabelSize = CGRectMake(CGRectGetMinX(self.iconSize)-(iconRightSpace+textSize.width+2*textLeftRightSpace), self.iconSize.origin.y+15, textSize.width+2*textLeftRightSpace, textSize.height+textMesaageFont);
            
        }else if ([message.content isKindOfClass:[RCImageMessage class]]){
            //图片消息
            self.messageLabelSize = CGRectMake(CGRectGetMinX(self.iconSize)-iconRightSpace-imageMessageSize.width, self.iconSize.origin.y+15, imageMessageSize.width, imageMessageSize.height);//imageMessageBoder*2.0
            
        }else if ([message.content isKindOfClass:[RCLocationMessage class]]){
            //位置消息
            self.messageLabelSize = CGRectMake(CGRectGetMinX(self.iconSize)-iconRightSpace-imageMessageSize.width-2*imageMessageBoder, self.iconSize.origin.y+15, imageMessageSize.width+imageMessageBoder*2, imageMessageSize.height+imageMessageBoder*2);
        }else if ([message.content isKindOfClass:[RCVoiceMessage class]]){
            //语音消息
            RCVoiceMessage *voiceMessage = (RCVoiceMessage *)message.content;
            NSMutableAttributedString *voiceStr;
            if (voiceMessage.duration<60) {
                voiceStr = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"%li''",voiceMessage.duration] attributes:@{NSForegroundColorAttributeName:[UIColor whiteColor],NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]}];
            }else if (voiceMessage.duration%60==0){
                voiceStr = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"%li'",voiceMessage.duration/60] attributes:@{NSForegroundColorAttributeName:[UIColor whiteColor],NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]}];
            }else{
                voiceStr = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"%li'%li''",voiceMessage.duration/60,voiceMessage.duration%60] attributes:@{NSForegroundColorAttributeName:[UIColor whiteColor],NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]}];
            }
            NSMutableAttributedString *attachment = [NSMutableAttributedString yy_attachmentStringWithEmojiImage:[UIImage imageNamed:@"gxs.png"] fontSize:textMesaageFont];
            [voiceStr appendAttributedString:attachment];
            CGSize voiceTextSize = [voiceStr size];
            self.messageLabelSize = CGRectMake(CGRectGetMinX(self.iconSize)-iconRightSpace-(voiceTextSize.width+2*textLeftRightSpace+30), self.iconSize.origin.y+15, voiceTextSize.width+2*textLeftRightSpace+30, voiceTextSize.height+textMesaageFont);
        }else{
            //其他自定义消息
        }
    }
    // CGRectGetMaxY(self.iconSize)>CGRectGetMaxY(self.messageLabelSize)?CGRectGetMaxY(self.iconSize):CGRectGetMaxY(self.messageLabelSize)
    self.heightForCell = CGRectGetMaxY(self.messageLabelSize) + standardSpaceY ;
    
}

@end
