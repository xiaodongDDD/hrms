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
#import "MyCustomParser.h"

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
        [self.messageLabel setFont:[UIFont systemFontOfSize:textMesaageFont]];
        [self.messageLabel setTextContainerInset:UIEdgeInsetsMake( textMesaageFont/2.0, textLeftRightSpace, textMesaageFont/2.0, textLeftRightSpace)];
        self.messageLabel.lineBreakMode = NSLineBreakByCharWrapping;
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
    
    //时间线5分钟之内不显示
    if (msgFrame.isHiddenTime) {
        self.timeLabel.hidden = YES;
    }else{
        self.timeLabel.hidden = NO;
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
        MyCustomParser *customParser = [MyCustomParser new];
        formStr = [customParser textParser:formStr];
        [self.messageLabel setText:formStr];
        
    }else if ([msgFrame.message.content isKindOfClass:[RCImageMessage class]]){
        //图片消息
        RCImageMessage *imageMessage = (RCImageMessage *)msgFrame.message.content;
        NSMutableAttributedString *text = [[NSMutableAttributedString alloc] init];
        NSMutableAttributedString *attachment = nil;
        // 嵌入 UIImage
        attachment = [NSMutableAttributedString yy_attachmentStringWithContent:imageMessage.thumbnailImage contentMode:UIViewContentModeScaleToFill attachmentSize:msgFrame.messageLabelSize.size alignToFont:[UIFont systemFontOfSize:0] alignment:1];
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
           // NSMutableAttributedString *attachment = [NSMutableAttributedString yy_attachmentStringWithEmojiImage:[UIImage imageNamed:@"gxs.png"] fontSize:textMesaageFont];
            UIImageView *imageView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, textMesaageFont, textMesaageFont)];
            imageView.image = [UIImage imageNamed:@"gxs.png"] ;
            imageView.animationDuration = 1.5f;
            imageView.animationRepeatCount = 0;
            NSMutableArray *imageArray = [NSMutableArray array];
            for (int i=0; i<4; i++) {
                UIImage *image = [UIImage imageNamed:[NSString stringWithFormat:@"bubble_voice_send_icon_%i@2x",i]];
                [imageArray addObject:image];
            }
            imageView.animationImages = imageArray;
            
            NSMutableAttributedString *attachment = [NSMutableAttributedString yy_attachmentStringWithContent:imageView contentMode:UIViewContentModeCenter attachmentSize:CGSizeMake(20, textMesaageFont) alignToFont:[UIFont systemFontOfSize:textMesaageFont] alignment:YYTextVerticalAlignmentCenter];
            
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
           // NSMutableAttributedString *attachment = [NSMutableAttributedString yy_attachmentStringWithEmojiImage:[UIImage imageNamed:@"gxt.png"] fontSize:textMesaageFont];
            UIImageView *imageView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, textMesaageFont, textMesaageFont)];
            imageView.image = [UIImage imageNamed:@"gxt.png"] ;
            imageView.animationDuration = 1.5f;
            imageView.animationRepeatCount = 0;
            NSMutableArray *imageArray = [NSMutableArray array];
            for (int i=0; i<4; i++) {
                UIImage *image = [UIImage imageNamed:[NSString stringWithFormat:@"bubble_voice_receive_icon_%i@2x.png",i]];
                [imageArray addObject:image];
            }
            imageView.animationImages = imageArray;
            
            NSMutableAttributedString *attachment = [NSMutableAttributedString yy_attachmentStringWithContent:imageView contentMode:UIViewContentModeCenter attachmentSize:CGSizeMake(20, textMesaageFont) alignToFont:[UIFont systemFontOfSize:textMesaageFont] alignment:YYTextVerticalAlignmentCenter];
            
            [voiceStr appendAttributedString:attachment];
            [self.messageLabel setAttributedText:voiceStr];
        }
    }
}

@end
