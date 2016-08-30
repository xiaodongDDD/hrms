//
//  ChatCell.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/13.
//
//

#import "ChatCell.h"
#import "TimeTool.h"
#import "CVDPlugin-Bridging-Header.h"
#import "SDBallProgressView.h"
static NSString * lastTime = nil;
@implementation ChatCell

-(instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        
        //时间线
        self.timeLabel = [[UILabel alloc] init];
        self.timeLabel.textColor = [UIColor colorWithRed:155/255.0 green:155/255.0 blue:155/255.0 alpha:1.0];
       //[self.timeLabel setBackgroundColor:[UIColor clearColor]];
        [self.timeLabel setTextAlignment:NSTextAlignmentCenter];
        [self.timeLabel setFont:[UIFont systemFontOfSize:13.0]];
        [self.contentView addSubview:self.timeLabel];
        
        //聊天小头像
        self.iconImageView = [[UIImageView alloc] init];
        CALayer *layer = self.iconImageView.layer;
        [layer setCornerRadius:20];
        [layer setMasksToBounds:YES];
        [self.contentView addSubview:self.iconImageView];
        
        
        //消息label
        self.messageLabel = [[YYLabel alloc] init];
        self.messageLabel.numberOfLines = 0;
        //设置emoji解析器
        YYTextSimpleEmoticonParser *emojiParser = [YYTextSimpleEmoticonParser new];
//        NSMutableDictionary *mapper = [NSMutableDictionary new];
//        mapper 
        [self.messageLabel setFont:[UIFont systemFontOfSize:textMesaageFont]];
        [self.messageLabel setTextContainerInset:UIEdgeInsetsMake( textMesaageFont/2.0, textLeftRightSpace, textMesaageFont/2.0, textLeftRightSpace)];
        [self.messageLabel.layer setCornerRadius:18];//聊天消息圆角度数
        [self.messageLabel.layer setMasksToBounds:YES];
        [self.messageLabel setTextAlignment:NSTextAlignmentLeft];
        [self.contentView addSubview:self.messageLabel];
        
    }
    return self;
}

-(void)setMsgFrame:(MessageFrame *)msgFrame
{
    _msgFrame = msgFrame;
    
    [self.timeLabel setFrame:msgFrame.timeLineSize];
    [self.iconImageView setFrame:msgFrame.iconSize];
    [self.messageLabel setFrame:msgFrame.messageLabelSize];
    
    
    if (lastTime!=[TimeTool timeStr:msgFrame.message.sentTime]) {
        lastTime = [TimeTool timeStr:msgFrame.message.sentTime];
        self.timeLabel.hidden = NO;
    }else{
        self.timeLabel.hidden = YES;
    }
    
    
    [self.timeLabel setText:[TimeTool timeStr:msgFrame.message.sentTime]];
    NSLog(@"时间:%@",self.timeLabel.text);
    if (msgFrame.message.messageDirection==MessageDirection_SEND) {
        [self.messageLabel setTextColor:[UIColor whiteColor]];
        [self.messageLabel setBackgroundColor:[UIColor colorWithRed:107/255.0 green:185/255.0 blue:240/255.0 alpha:1.0]];
    }else{
        [self.messageLabel setTextColor:[UIColor colorWithRed:74/255.0 green:74/255.0 blue:74/255.0 alpha:1.0]];
        
        [self.messageLabel setBackgroundColor:[UIColor colorWithRed:241/255.0 green:240/255.0 blue:240/255.0 alpha:1.0]];
    }
    
    if ([msgFrame.message.content isKindOfClass:[RCTextMessage class]]) {
        //文字消息
        RCTextMessage *txtMessage = (RCTextMessage *)msgFrame.message.content;
        [self.messageLabel setText:txtMessage.content];
    }else if ([msgFrame.message.content isKindOfClass:[RCImageMessage class]]){
        //图片消息
        RCImageMessage *imageMessage = (RCImageMessage *)msgFrame.message.content;
        NSMutableAttributedString *text = [[NSMutableAttributedString alloc] init];
        NSMutableAttributedString *attachment = nil;
        // 嵌入 UIImage
        attachment = [NSMutableAttributedString yy_attachmentStringWithContent:imageMessage.thumbnailImage contentMode:UIViewContentModeCenter attachmentSize:msgFrame.messageLabelSize.size alignToFont:[UIFont systemFontOfSize:0] alignment:1];
        [text appendAttributedString: attachment];
        [self.messageLabel setAttributedText:attachment];
        
    }else if ([msgFrame.message.content isKindOfClass:[RCVoiceMessage class]]){
        RCVoiceMessage *voiceMessage = (RCVoiceMessage *)msgFrame.message.content;
        NSMutableAttributedString *voiceStr;
        if (msgFrame.message.messageDirection==MessageDirection_SEND) {
            if (voiceMessage.duration<60) {
                voiceStr = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"%li''",voiceMessage.duration] attributes:@{NSForegroundColorAttributeName:[UIColor whiteColor],NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]}];
            }else if (voiceMessage.duration%60==0){
                voiceStr = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"%li'",voiceMessage.duration/60] attributes:@{NSForegroundColorAttributeName:[UIColor whiteColor],NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]}];
            }else{
                voiceStr = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"%li'%li''",voiceMessage.duration/60,voiceMessage.duration%60] attributes:@{NSForegroundColorAttributeName:[UIColor whiteColor],NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]}];
            }
            NSMutableAttributedString *attachment = [NSMutableAttributedString yy_attachmentStringWithEmojiImage:[UIImage imageNamed:@"gxs.png"] fontSize:textMesaageFont];
            [voiceStr appendAttributedString:attachment];
            [self.messageLabel setAttributedText:voiceStr];
        }else{//gxt.png
            if (voiceMessage.duration<60) {
                voiceStr = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"%li''",voiceMessage.duration] attributes:@{NSForegroundColorAttributeName:[UIColor colorWithRed:74/255.0 green:74/255.0 blue:74/255.0 alpha:1.0],NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]}];
            }else if (voiceMessage.duration%60==0){
                voiceStr = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"%li'",voiceMessage.duration/60] attributes:@{NSForegroundColorAttributeName:[UIColor colorWithRed:74/255.0 green:74/255.0 blue:74/255.0 alpha:1.0],NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]}];
            }else{
                voiceStr = [[NSMutableAttributedString alloc] initWithString:[NSString stringWithFormat:@"%li'%li''",voiceMessage.duration/60,voiceMessage.duration%60] attributes:@{NSForegroundColorAttributeName:[UIColor colorWithRed:74/255.0 green:74/255.0 blue:74/255.0 alpha:1.0],NSFontAttributeName:[UIFont systemFontOfSize:textMesaageFont]}];
            }
            NSMutableAttributedString *attachment = [NSMutableAttributedString yy_attachmentStringWithEmojiImage:[UIImage imageNamed:@"gxt.png"] fontSize:textMesaageFont];
            [voiceStr appendAttributedString:attachment];
            [self.messageLabel setAttributedText:voiceStr];
        }
    }
}

@end
