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
#import "UIImage+UIColor.h"
#import "MyCustomParser.h"

@implementation RCIMDiscussionMessageFrame
-(void)setMessage:(RCMessage *)message
{
    _message = message;
    
    if (message.messageDirection==MessageDirection_RECEIVE) {
        //消息接受
        
        self.iconSize = CGRectMake(iconLeftSpace, timeLineBottomSpace, iconSize_iphone6.width, iconSize_iphone6.height);
        CGSize nameSize = [message.content.senderUserInfo.name sizeWithAttributes:@{NSFontAttributeName:[UIFont systemFontOfSize:13.0]}];
        
        self.userNameSize = CGRectMake(CGRectGetMaxX(self.iconSize)+iconRightSpace, self.iconSize.origin.y, nameSize.width, 13);
        if ([message.content  isKindOfClass:[RCTextMessage class]]) {
            //文字消息
            RCTextMessage *txtMessage = (RCTextMessage *)message.content;
            //表情转换
            NSString *formStr = txtMessage.content;
            MyCustomParser *customParser = [MyCustomParser new];
            formStr = [customParser textParser:formStr];
            
            CGSize textSize = [formStr boundingRectWithSize:CGSizeMake([UIScreen mainScreen].bounds.size.width-2*(self.iconSize.size.width+iconLeftSpace+iconRightSpace+textLeftRightSpace), MAXFLOAT) options:NSStringDrawingUsesLineFragmentOrigin attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]} context:nil].size;
            self.messageLabelSize = CGRectMake(CGRectGetMaxX(self.iconSize)+iconRightSpace, self.iconSize.origin.y+15, textSize.width+textLeftRightSpace*2, textSize.height+textMesaageFont+10);
            
        }else if ([message.content isKindOfClass:[RCImageMessage class]]){
            //图片消息
            RCImageMessage *msgImg = (RCImageMessage *)message.content;
            
            CGSize imgsize = [UIImage imageWithImg:msgImg.thumbnailImage width:[UIScreen mainScreen].bounds.size.width*0.3];
            //            NSLog(@"image.size = %@",NSStringFromCGSize(photo.size));
            self.messageLabelSize = CGRectMake(CGRectGetMaxX(self.iconSize)+iconRightSpace, self.iconSize.origin.y+15, imgsize.width , imgsize.height);
            
        }else if ([message.content isKindOfClass:[RCLocationMessage class]]){
            //位置消息
            self.messageLabelSize = CGRectMake(CGRectGetMaxX(self.iconSize)+iconRightSpace, self.iconSize.origin.y+15, imageMessageSize.width+2*imageMessageBoder, imageMessageSize.height+2*imageMessageBoder);
        }else if ([message.content isKindOfClass:[RCVoiceMessage class]]){
            //语音消息
            self.messageLabelSize = CGRectMake(CGRectGetMaxX(self.iconSize)+iconRightSpace, self.iconSize.origin.y+2, 80, 34);
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
        }else if ([message.content isKindOfClass:[RCDiscussionNotificationMessage class]]){
            RCDiscussionNotificationMessage *notiMessage = (RCDiscussionNotificationMessage *)message.content;
            //通知类消息 operatorId extension(里面存放的是工号以，分隔开)
            
            NSString *notiTxt ;
            switch (notiMessage.type) {
                case RCInviteDiscussionNotification:
                    notiTxt = [NSString stringWithFormat:@"%@邀请了%@加入了讨论组，右上角可设置名称和头像",notiMessage.operatorId,notiMessage.extension];
                    break;
                case RCQuitDiscussionNotification:
                    notiTxt = [NSString stringWithFormat:@"%@退出了讨论组，右上角可设置名称和头像",notiMessage.operatorId];
                    break;
                case RCRenameDiscussionTitleNotification:
                    notiTxt = [NSString stringWithFormat:@"%@修改了讨论组名称，右上角可设置名称和头像",notiMessage.operatorId];
                    break;
                case RCRemoveDiscussionMemberNotification:
                    notiTxt = [NSString stringWithFormat:@"%@把%@踢出了讨论组，右上角可设置名称和头像",notiMessage.operatorId,notiMessage.extension];
                    break;
                default:
                    break;
            }
            CGSize notificationSize = [notiTxt boundingRectWithSize:CGSizeMake(screenWidth-20, MAXFLOAT) options:NSStringDrawingUsesLineFragmentOrigin attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:13.0]} context:nil].size;
            self.notificationLabelSize = CGRectMake((screenWidth-notificationSize.width-20)/2.0, 5, notificationSize.width+20, notificationSize.height>31.02?notificationSize.height:notificationSize.height+20);
        }else{
        
        }
        
    }else{
        //消息发送
        
        self.iconSize = CGRectMake([UIScreen mainScreen].bounds.size.width-iconSize_iphone6.width-iconLeftSpace, timeLineBottomSpace, iconSize_iphone6.width, iconSize_iphone6.height);
        CGSize nameSize = [message.content.senderUserInfo.name sizeWithAttributes:@{NSFontAttributeName:[UIFont systemFontOfSize:13.0]}];
        
        self.userNameSize = CGRectMake(CGRectGetMinX(self.iconSize)-iconLeftSpace-nameSize.width, self.iconSize.origin.y, nameSize.width, 13);
        if ([message.content  isKindOfClass:[RCTextMessage class]]) {
            //文字消息
            RCTextMessage *textMessage = (RCTextMessage *)message.content;
            NSString *text = textMessage.content ;
            MyCustomParser *customParser = [MyCustomParser new];
            text = [customParser textParser:text];
            
            //计算文字大小
            CGSize textSize = [text boundingRectWithSize:CGSizeMake([UIScreen mainScreen].bounds.size.width-2*(self.iconSize.size.width+iconLeftSpace+iconRightSpace+textLeftRightSpace), MAXFLOAT) options:NSStringDrawingUsesLineFragmentOrigin attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]} context:nil].size;
            self.messageLabelSize = CGRectMake(CGRectGetMinX(self.iconSize)-(iconRightSpace+textSize.width+2*textLeftRightSpace), self.iconSize.origin.y+15, textSize.width+2*textLeftRightSpace, textSize.height+textMesaageFont+10);
            
        }else if ([message.content isKindOfClass:[RCImageMessage class]]){
            //图片消息
            RCImageMessage *msgImg = (RCImageMessage *)message.content;
            
            CGSize imgsize = [UIImage imageWithImg:msgImg.thumbnailImage width:[UIScreen mainScreen].bounds.size.width*0.3];
            
            self.messageLabelSize = CGRectMake(CGRectGetMinX(self.iconSize)-iconRightSpace-imgsize.width, self.iconSize.origin.y+15, imgsize.width, imgsize.height);//imageMessageBoder*2.0
            
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
        }else if ([message.content isKindOfClass:[RCDiscussionNotificationMessage class]]){
            RCDiscussionNotificationMessage *notiMessage = (RCDiscussionNotificationMessage *)message.content;
            //通知类消息 operatorId extension(里面存放的是工号以，分隔开)
            NSString *notiTxt ;
            switch (notiMessage.type) {
                case RCInviteDiscussionNotification:
                    notiTxt = [NSString stringWithFormat:@"%@邀请了%@加入了讨论组，右上角可设置名称和头像",notiMessage.operatorId,notiMessage.extension];
                    break;
                case RCQuitDiscussionNotification:
                    notiTxt = [NSString stringWithFormat:@"%@退出了讨论组，右上角可设置名称和头像",notiMessage.operatorId];
                    break;
                case RCRenameDiscussionTitleNotification:
                    notiTxt = [NSString stringWithFormat:@"%@修改了讨论组名称，右上角可设置名称和头像",notiMessage.operatorId];
                    break;
                case RCRemoveDiscussionMemberNotification:
                    notiTxt = [NSString stringWithFormat:@"%@把%@踢出了讨论组，右上角可设置名称和头像",notiMessage.operatorId,notiMessage.extension];
                    break;
                default:
                    break;
            }
            CGSize notificationSize = [notiTxt boundingRectWithSize:CGSizeMake(screenWidth-20, MAXFLOAT) options:NSStringDrawingUsesLineFragmentOrigin attributes:@{NSFontAttributeName:[UIFont systemFontOfSize:13.0]} context:nil].size;
            self.notificationLabelSize = CGRectMake((screenWidth-notificationSize.width-20)/2.0, 5, notificationSize.width+20, notificationSize.height>31.02?notificationSize.height:notificationSize.height+20);
        }else{
        
        }
    }
    

    self.heightForCell = self.notificationLabelSize.size.width?(CGRectGetMaxY(self.notificationLabelSize)+standardSpaceY):(CGRectGetMaxY(self.messageLabelSize) + standardSpaceY);
}
@end
