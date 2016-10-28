//
//  DiscussionInputBar.m
//  汉得移动测试版
//
//  Created by wangsheng on 2016/10/10.
//
//

#import "DiscussionInputBar.h"

@implementation DiscussionInputBar

-(instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        self.recorderBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [self.recorderBtn setImage:[UIImage imageNamed:@"recorder_select_default.png"] forState:UIControlStateNormal];
        [self.recorderBtn setImage:[UIImage imageNamed:@"recorder_select_highlight"] forState:UIControlStateSelected];
        self.recorderBtn.frame = CGRectMake(5, 5, 26, 28);
        [self.recorderBtn addTarget:self action:@selector(didTapRecorder:) forControlEvents:UIControlEventTouchUpInside];
        [self addSubview:self.recorderBtn];
        
        self.inputField = [[YYTextView alloc] initWithFrame:CGRectMake(CGRectGetMaxX(self.recorderBtn.frame)+5, 2, screenWidth-(26+5+25+60), 35)];
        [self.inputField setBackgroundColor:[UIColor whiteColor]];
        self.inputField.layer.cornerRadius = 8.0;
        self.inputField.delegate = self;

        [self.inputField setFont:[UIFont systemFontOfSize:16.0]];
        [self.inputField setTextVerticalAlignment:YYTextVerticalAlignmentCenter];
        NSAttributedString *attributeStr = [[NSAttributedString alloc] initWithString:@"输入文字..." attributes:@{NSForegroundColorAttributeName:[UIColor grayColor],NSFontAttributeName:[UIFont systemFontOfSize:16.0]}];
        [self.inputField setPlaceholderAttributedText:attributeStr];
        [self.inputField setReturnKeyType:UIReturnKeySend];
        [self addSubview:self.inputField];
        
        self.emojiBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [self.emojiBtn setImage:[[UIImage imageNamed:@"emoji_select_default"] imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal] forState:UIControlStateNormal];
        [self.emojiBtn setImage:[UIImage imageNamed:@"emoji_select_highlight"] forState:UIControlStateSelected];
        self.emojiBtn.frame = CGRectMake(CGRectGetMaxX(self.inputField.frame)+5, 5, 30, 30);
        [self.emojiBtn addTarget:self action:@selector(didTapEmoji:) forControlEvents:UIControlEventTouchUpInside];
        [self addSubview:self.emojiBtn];
        
        self.multiBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [self.multiBtn setImage:[[UIImage imageNamed:@"addCell_default.png"] imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal] forState:UIControlStateNormal];
        [self.multiBtn setImage:[[UIImage imageNamed:@"addCell_highlight.png"] imageWithRenderingMode:UIImageRenderingModeAlwaysOriginal] forState:UIControlStateSelected];
        
        self.multiBtn.frame = CGRectMake(CGRectGetMaxX(self.emojiBtn.frame)+10, 5, 30, 30);
        [self.multiBtn addTarget:self action:@selector(didMultiBtn:) forControlEvents:UIControlEventTouchUpInside];
        [self addSubview:self.multiBtn];
        
        self.layer.borderColor = [UIColor lightTextColor].CGColor;
        self.layer.borderWidth = 1.0;
        [self setBackgroundColor:[UIColor colorWithRed:242/255.0 green:242/255.0 blue:242/255.0 alpha:1.0]];
    }
    return self;
}
#pragma mark - YYTextView代理
- (BOOL)textViewShouldBeginEditing:(YYTextView *)textView
{
    NSLog(@"开始编辑");
    return YES;
}
- (BOOL)textView:(YYTextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text
{
    if ([text isEqualToString:@"\n"]) {
        //点击了发送
        if ([self.inputField.text length]&&![self.inputField.text isEqualToString:@""]) {
            [self.delegate touchSendBtn:self.inputField.text];
            self.inputField.text = @"";
        }
        return NO;
    }
    NSLog(@"text:%@",text);
    return YES;
}
#pragma mark - emoji
- (void)didTapEmoji:(UIButton *)sender
{
    NSLog(@"进入了emoji");
    sender.selected = !sender.selected;
    [self.delegate touchEmojiView:sender];
}
#pragma mark - 多功能
- (void)didMultiBtn:(UIButton *)sender
{
    NSLog(@"进入了多功能");
    sender.selected = !sender.selected;
    [self.delegate touchMultiBtn:sender];
}
#pragma mark - 图库
- (void)didTapImagePicker:(UIButton *)sender
{
    NSLog(@"进入了图库");
    sender.selected = !sender.selected;
    [self.delegate touchPhotoLibrary:sender];
}

#pragma mark - 相机
- (void)didTapCamera:(UIButton *)sender
{
    NSLog(@"进入了相机");
    [self.delegate touchCamera:sender];
}

#pragma mark - 录音
- (void)didTapRecorder:(UIButton *)sender
{
    sender.selected = !sender.selected;
    NSLog(@"进入了录音");
    [self.delegate touchRecoder:sender];
}

@end
