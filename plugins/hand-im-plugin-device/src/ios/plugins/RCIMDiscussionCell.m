//
//  RCIMDiscussionCell.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/24.
//
//

#import "RCIMDiscussionCell.h"
#import "TimeTool.h"
#import "CVDPlugin-Bridging-Header.h"

static NSArray *emojiList = nil;
@implementation RCIMDiscussionCell

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
        
        //name
        self.userNameLabel = [[UILabel alloc] init];
        [self.userNameLabel setTextColor:[UIColor colorWithRed:155/255.0 green:155/255.0 blue:155/255.0 alpha:1.0]];
        [self.userNameLabel setFont:[UIFont systemFontOfSize:13.0]];
        [self addSubview:self.userNameLabel];
        
        
        //消息label
        self.messageLabel = [[YYLabel alloc] init];
        self.messageLabel.numberOfLines = 0;
        [self.messageLabel setFont:[UIFont systemFontOfSize:textMesaageFont]];
        [self.messageLabel setTextContainerInset:UIEdgeInsetsMake( textMesaageFont/2.0, textLeftRightSpace, textMesaageFont/2.0, textLeftRightSpace)];
        [self.messageLabel.layer setCornerRadius:18];//聊天消息圆角度数
        [self.messageLabel.layer setMasksToBounds:YES];
        [self.messageLabel setTextAlignment:NSTextAlignmentLeft];
        [self.contentView addSubview:self.messageLabel];
        
    }
    return self;
}

-(void)setMsgFrame:(RCIMDiscussionMessageFrame *)msgFrame
{
    _msgFrame = msgFrame;

    [self.timeLabel setFrame:msgFrame.timeLineSize];
    [self.iconImageView setFrame:msgFrame.iconSize];
    [self.messageLabel setFrame:msgFrame.messageLabelSize];
    [self.userNameLabel setFrame:msgFrame.userNameSize];
    [self.userNameLabel setText:msgFrame.message.content.senderUserInfo.name];
    
    //时间线5分钟之内不显示
    if (msgFrame.isHiddenTime) {
        self.timeLabel.hidden = YES;
    }else{
        self.timeLabel.hidden = NO;
    }
    if (emojiList==nil) {
        emojiList = [NSArray arrayWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"Emoji" ofType:@"plist"]];
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
        
        [self.messageLabel setText:formStr];
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
