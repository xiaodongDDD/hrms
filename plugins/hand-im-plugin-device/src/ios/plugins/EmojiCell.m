//
//  EmojiCell.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/26.
//
//

#import "EmojiCell.h"
#import "YYText.h"
@implementation EmojiCell
-(instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        _emojiView = [[YYLabel alloc] initWithFrame:CGRectMake(0, 0, 40, 40)];
        [_emojiView setFont:[UIFont systemFontOfSize:30]];
        [_emojiView setTextAlignment:NSTextAlignmentCenter];
      //  _emojiView.backgroundColor = [UIColor whiteColor];
       // [_emojiView setUserInteractionEnabled:YES];
        [self.contentView addSubview:_emojiView];
    }
    return self;
}

-(void)setCell:(NSString *)string IndexPath:(NSIndexPath *)indexPath
{
    if (indexPath.row==20||indexPath.row==41||indexPath.row==62||indexPath.row==83||indexPath.row==104||indexPath.row==125) {
        NSMutableAttributedString *mutableAttributeStr = [NSMutableAttributedString yy_attachmentStringWithEmojiImage:[UIImage imageNamed:@"delete.png"] fontSize:30.0];
        [self.emojiView setAttributedText:mutableAttributeStr];
    }else{
        self.emojiView.text = string;
    }
}
@end
