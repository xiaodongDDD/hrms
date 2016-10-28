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
#import "MyCustomParser.h"

@implementation RCIMDiscussionCell

-(instancetype)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier
{
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        
        //提示框
        self.notificationLabel = [[UILabel alloc] init];
        self.notificationLabel.textColor = [UIColor whiteColor];
        self.notificationLabel.layer.cornerRadius = 8.0;
        self.notificationLabel.layer.masksToBounds = YES;
        [self.notificationLabel setBackgroundColor:[UIColor colorWithRed:215/255.0 green:215/255.0 blue:215/255.0 alpha:1.0]];
        self.notificationLabel.numberOfLines = 0;
        self.notificationLabel.lineBreakMode = NSLineBreakByCharWrapping;
        [self.notificationLabel setFont:[UIFont systemFontOfSize:13.0]];
        [self.notificationLabel setTextAlignment:NSTextAlignmentCenter];
        [self.contentView addSubview:self.notificationLabel];
        
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
        self.messageLabel.lineBreakMode = NSLineBreakByCharWrapping;
        [self.contentView addSubview:self.messageLabel];
        
    }
    return self;
}

-(void)setMsgFrame:(RCIMDiscussionMessageFrame *)msgFrame
{
    _msgFrame = msgFrame;
    
    if (msgFrame.notificationLabelSize.size.width) {
        [self.notificationLabel setFrame:msgFrame.notificationLabelSize];
    }else{
        [self.iconImageView setFrame:msgFrame.iconSize];
        [self.messageLabel setFrame:msgFrame.messageLabelSize];
        [self.userNameLabel setFrame:msgFrame.userNameSize];
        [self.userNameLabel setText:msgFrame.message.content.senderUserInfo.name];
    }
    
    NSLog(@"提示框:%@",self.notificationLabel.text);
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
        attachment = [NSMutableAttributedString yy_attachmentStringWithContent:imageMessage.thumbnailImage contentMode:UIViewContentModeScaleAspectFill attachmentSize:msgFrame.messageLabelSize.size alignToFont:[UIFont systemFontOfSize:0] alignment:1];
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
    }else if ([msgFrame.message.content isKindOfClass:[RCDiscussionNotificationMessage class]]){
        RCDiscussionNotificationMessage *notiMessage = (RCDiscussionNotificationMessage *)msgFrame.message.content;
        //通知类消息 operatorId extension(里面存放的是工号以，分隔开)
        NSMutableArray *tempArr = [NSMutableArray array];
        [tempArr addObject:[NSDictionary dictionaryWithObject:notiMessage.operatorId forKey:@"key"]];
        
        if (notiMessage.extension) {
            if ([notiMessage.extension containsString:@","]) {
                NSArray *array = [notiMessage.extension componentsSeparatedByString:@","];
                for (NSString *obj in array) {
                    [tempArr addObject:[NSDictionary dictionaryWithObject:obj forKey:@"key"]];
                }
            }else{
                //只有一个
                if (notiMessage.type!=RCRenameDiscussionTitleNotification) {
                    [tempArr addObject:[NSDictionary dictionaryWithObject:notiMessage.extension forKey:@"key"]];
                }
            }
        }
        [self getContactsInfoByIdList:tempArr notificationMesg:notiMessage];
    }
}

#pragma mark -根据id拉取所有人的info
- (void)getContactsInfoByIdList:(NSArray *)employee_id notificationMesg:(RCDiscussionNotificationMessage *)notiMessage
{
    NSString *access_token = [[NSUserDefaults standardUserDefaults] objectForKey:@"access_token"];
    NSString *path = [NSString stringWithFormat:@"%@/hrmsv2/v2/api/staff/detailList?access_token=%@",rootService,access_token];
    NSURL *url = [NSURL URLWithString:path];
    NSLog(@"-------------path:%@,,,,",path);
    NSMutableURLRequest *urlRequest = [NSMutableURLRequest requestWithURL:url];
    [urlRequest setHTTPMethod:@"POST"];
    NSDictionary *requestBody = [NSJSONSerialization JSONObjectWithData:[NSJSONSerialization dataWithJSONObject:employee_id options:NSJSONWritingPrettyPrinted error:nil] options:NSJSONReadingAllowFragments error:nil];
    [urlRequest setHTTPBody:[NSJSONSerialization dataWithJSONObject:requestBody options:NSJSONWritingPrettyPrinted error:nil]];
    NSDictionary *headers = @{@"content-type": @"application/json"};
    [urlRequest setAllHTTPHeaderFields:headers];
    NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
    [configuration setTimeoutIntervalForRequest:30.0];
    NSURLSession *session = [NSURLSession sessionWithConfiguration:configuration];
    NSURLSessionDataTask *dataTask = [session dataTaskWithRequest:urlRequest completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        if (!error) {
            NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingAllowFragments error:nil];
            NSArray *infos = [json objectForKey:@"rows"];
            NSString *operatorName = [infos[0] objectForKey:@"emp_name"];
            
            NSString *extensionName = [[NSString alloc]init];
            if(infos.count>1){
                for (NSInteger i=1;i<infos.count;i++) {
                    NSDictionary *dic = infos[i];
                    if(![dic isEqual:[NSNull null]]){
                        NSString *name = dic[@"emp_name"];
                        if(i<infos.count-1){
                            extensionName = [extensionName stringByAppendingString:[NSString stringWithFormat:@"%@、",name]];
                        }else{
                            extensionName = [extensionName stringByAppendingString:name];
                        }
                    }
                    
                }
            }
            
            NSString *notiTxt ;
            switch (notiMessage.type) {
                case RCInviteDiscussionNotification:
                    notiTxt = [NSString stringWithFormat:@"%@邀请了%@加入了讨论组，右上角可设置名称和头像",operatorName,extensionName];
                    break;
                case RCQuitDiscussionNotification:
                    notiTxt = [NSString stringWithFormat:@"%@退出了讨论组，右上角可设置名称和头像",operatorName];
                    break;
                case RCRenameDiscussionTitleNotification:
                    notiTxt = [NSString stringWithFormat:@"%@修改了讨论组名称，右上角可设置名称和头像",operatorName];
                    break;
                case RCRemoveDiscussionMemberNotification:
                    notiTxt = [NSString stringWithFormat:@"%@把%@踢出了讨论组，右上角可设置名称和头像",operatorName,extensionName];
                    break;
                default:
                    break;
            }
            dispatch_async(dispatch_get_main_queue(), ^{
                self.notificationLabel.text = notiTxt;
            });
        }else{
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
            dispatch_async(dispatch_get_main_queue(), ^{
                self.notificationLabel.text = notiTxt;
            });
            NSLog(@"data:%@,error:%@",data,error);
        }
    }];
    [dataTask resume];
}

@end
