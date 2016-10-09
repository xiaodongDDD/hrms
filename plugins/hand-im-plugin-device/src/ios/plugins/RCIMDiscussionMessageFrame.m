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
static NSArray *emojiList =nil;
@implementation RCIMDiscussionMessageFrame
-(void)setMessage:(RCMessage *)message
{
    _message = message;
    if (emojiList==nil) {
        emojiList = [NSArray arrayWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"Emoji" ofType:@"plist"]];
    }
    if (message.messageDirection==MessageDirection_RECEIVE) {
        //消息接受
        self.timeLineSize = CGRectMake(0, iconLeftSpace, screenWidth, 13);
        self.iconSize = CGRectMake(iconLeftSpace, timeLineBottomSpace+CGRectGetMaxY(self.timeLineSize), iconSize_iphone6.width, iconSize_iphone6.height);
        CGSize nameSize = [message.content.senderUserInfo.name sizeWithAttributes:@{NSFontAttributeName:[UIFont systemFontOfSize:13.0]}];
        
        self.userNameSize = CGRectMake(CGRectGetMaxX(self.iconSize)+iconRightSpace, self.iconSize.origin.y, nameSize.width, 13);
        if ([message.content  isKindOfClass:[RCTextMessage class]]) {
            //文字消息
            RCTextMessage *txtMessage = (RCTextMessage *)message.content;
            //            NSString *text = txtMessage.content;
            //表情转换
            NSString *formStr = txtMessage.content;
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[可爱]" withString:emojiList[0]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[笑脸]" withString:emojiList[13]];
            
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[囧]" withString:emojiList[17]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[生气]" withString:emojiList[16]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[鬼脸]" withString:emojiList[12]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[花心]" withString:emojiList[2]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[害怕]" withString:emojiList[34]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[我汗]" withString:emojiList[27]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[尴尬]" withString:emojiList[9]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[哼哼]" withString:emojiList[32]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[忧郁]" withString:emojiList[6]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[呲牙]" withString:emojiList[47]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[媚眼]" withString:emojiList[21]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[累]" withString:emojiList[18]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[苦逼]" withString:emojiList[35]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[瞌睡]" withString:emojiList[40]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[哎呀]" withString:emojiList[26]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[刺瞎]" withString:emojiList[7]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[哭]" withString:emojiList[5]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[激动]" withString:emojiList[29]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[难过]" withString:emojiList[9]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[高兴]" withString:emojiList[13]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[愤怒]" withString:emojiList[11]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[亲]" withString:emojiList[39]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[飞吻]" withString:emojiList[30]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[得意]" withString:emojiList[6]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[惊恐]" withString:emojiList[1]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[口罩]" withString:emojiList[48]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[惊讶]" withString:emojiList[3]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[委屈]" withString:emojiList[31]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[生病]" withString:emojiList[24]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[心碎]" withString:emojiList[113]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[玫瑰]" withString:emojiList[104]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[外星人]" withString:emojiList[115]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[嘴唇]" withString:emojiList[109]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[电话]" withString:emojiList[97]];
            formStr = [formStr stringByReplacingOccurrencesOfString:@"[向日葵]" withString:emojiList[92]];
            CGSize textSize = [formStr boundingRectWithSize:CGSizeMake([UIScreen mainScreen].bounds.size.width-2*(self.iconSize.size.width+iconLeftSpace+iconRightSpace+textLeftRightSpace), MAXFLOAT) options:NSStringDrawingUsesLineFragmentOrigin attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]} context:nil].size;
            self.messageLabelSize = CGRectMake(CGRectGetMaxX(self.iconSize)+iconRightSpace, self.iconSize.origin.y+15, textSize.width+textLeftRightSpace*2, textSize.height+textMesaageFont+10);
            
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
        self.timeLineSize = CGRectMake(0, iconLeftSpace, screenWidth, 13);
        
        self.iconSize = CGRectMake([UIScreen mainScreen].bounds.size.width-iconSize_iphone6.width-iconLeftSpace, timeLineBottomSpace+CGRectGetMaxY(self.timeLineSize), iconSize_iphone6.width, iconSize_iphone6.height);
        
        CGSize nameSize = [message.content.senderUserInfo.name sizeWithAttributes:@{NSFontAttributeName:[UIFont systemFontOfSize:13.0]}];
        
        self.userNameSize = CGRectMake(CGRectGetMinX(self.iconSize)-iconLeftSpace-nameSize.width, self.iconSize.origin.y, nameSize.width, 13);
        if ([message.content  isKindOfClass:[RCTextMessage class]]) {
            //文字消息
            RCTextMessage *textMessage = (RCTextMessage *)message.content;
            NSString *text = textMessage.content ;
            //计算文字大小
            CGSize textSize = [text boundingRectWithSize:CGSizeMake([UIScreen mainScreen].bounds.size.width-2*(self.iconSize.size.width+iconLeftSpace+iconRightSpace+textLeftRightSpace), MAXFLOAT) options:NSStringDrawingUsesLineFragmentOrigin attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]} context:nil].size;
            self.messageLabelSize = CGRectMake(CGRectGetMinX(self.iconSize)-(iconRightSpace+textSize.width+2*textLeftRightSpace), self.iconSize.origin.y+15, textSize.width+2*textLeftRightSpace, textSize.height+textMesaageFont+10);
            
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
    
    self.heightForCell = self.isHiddenTime?(CGRectGetMaxY(self.messageLabelSize) - CGRectGetMaxY(self.timeLineSize)):(CGRectGetMaxY(self.messageLabelSize) + standardSpaceY);
    
}
@end
