//
//  ChatInputBarControl.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/13.
//
//

#import "ChatInputBarControl.h"
#import "CVDPlugin-Bridging-Header.h"

@implementation ChatInputBarControl
-(instancetype)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    //iphone 6 的布局
        //文本框
        self.inputField = [[YYTextView alloc] initWithFrame:CGRectMake(iconLeftSpace, 5, screenWidth-2*iconLeftSpace, 35)];
        [self.inputField setBackgroundColor:[UIColor whiteColor]];
        self.inputField.layer.cornerRadius = 10.0;
        self.inputField.delegate = self;
        [self.inputField setFont:[UIFont systemFontOfSize:16.0]];
        [self.inputField setTextVerticalAlignment:YYTextVerticalAlignmentCenter];
        NSAttributedString *attributeStr = [[NSAttributedString alloc] initWithString:@"输入消息.." attributes:@{NSForegroundColorAttributeName:[UIColor grayColor],NSFontAttributeName:[UIFont systemFontOfSize:16.0]}];
        [self.inputField setPlaceholderAttributedText:attributeStr];
        [self.inputField setReturnKeyType:UIReturnKeySend];
        [self addSubview:self.inputField];
        //发送按钮
//        self.sendBtn = [UIButton buttonWithType:UIButtonTypeRoundedRect];
//        self.sendBtn.layer.cornerRadius = 8.0;
//        self.sendBtn.enabled = NO;
//        [self.sendBtn addTarget:self action:@selector(didTapSendBtn:) forControlEvents: UIControlEventTouchUpInside];
//        [self.sendBtn setBackgroundColor:[UIColor colorWithRed:120/255.0 green:140/255.0 blue:255/255.0 alpha:1.0]];//（R：193 G：210 B：240）
//        [self.sendBtn setTitle:@"发送" forState:UIControlStateNormal];
//        [self.sendBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
//        [self.sendBtn setFrame:CGRectMake(CGRectGetMaxX(self.inputField.frame)+iconLeftSpace, 5,[UIScreen mainScreen].bounds.size.width-CGRectGetWidth(self.inputField.frame)-3*iconLeftSpace, CGRectGetHeight(self.inputField.frame))];
//        [self addSubview:self.sendBtn];


        //启动相机
        self.cameraBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [self.cameraBtn setBackgroundImage:[UIImage imageNamed:@"camera.png"] forState:UIControlStateNormal];
        [self.cameraBtn setBackgroundImage:[UIImage imageNamed:@"camera-B.png"] forState:UIControlStateSelected];
        [self.cameraBtn addTarget:self action:@selector(didTapCamera:) forControlEvents:UIControlEventTouchUpInside];
        [self.cameraBtn setFrame:CGRectMake(screenWidth-standardSpaceX-24, CGRectGetHeight(self.frame)-standardSpaceY-18, 24, 18)];
        [self addSubview:self.cameraBtn];

        //启动图库
        self.imagePickerBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [self.imagePickerBtn setBackgroundImage:[UIImage imageNamed:@"album.png"] forState:UIControlStateNormal];
        [self.imagePickerBtn setBackgroundImage:[UIImage imageNamed:@"album-B.png"] forState:UIControlStateSelected];
        [self.imagePickerBtn addTarget:self action:@selector(didTapImagePicker:) forControlEvents:UIControlEventTouchUpInside];
        [self.imagePickerBtn setFrame:CGRectMake(CGRectGetMinX(self.cameraBtn.frame)-standardSpaceX-24, CGRectGetHeight(self.frame)-standardSpaceY-20, 24, 20)];
        [self addSubview:self.imagePickerBtn];

        //启动录音
        self.recorderBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [self.recorderBtn setBackgroundImage:[UIImage imageNamed:@"record.png"] forState:UIControlStateNormal];
        [self.recorderBtn setBackgroundImage:[UIImage imageNamed:@"record-B.png"] forState:UIControlStateSelected];
        [self.recorderBtn addTarget:self action:@selector(didTapRecorder:) forControlEvents:UIControlEventTouchUpInside];
        [self.recorderBtn setFrame:CGRectMake(CGRectGetMinX(self.imagePickerBtn.frame)-standardSpaceX-21, CGRectGetHeight(self.frame)-standardSpaceY-21, 21, 21)];
        [self addSubview:self.recorderBtn];

        //打开emoj
        self.emojiBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [self.emojiBtn setBackgroundImage:[UIImage imageNamed:@"chatting_biaoqing_btn_normal.png"] forState:UIControlStateNormal];
        [self.emojiBtn setBackgroundImage:[UIImage imageNamed:@"Microexpression-B.png"] forState:UIControlStateSelected];
        [self.emojiBtn setFrame:CGRectMake(CGRectGetMinX(self.recorderBtn.frame)-standardSpaceX-standardSpaceX, CGRectGetHeight(self.frame)-standardSpaceY-standardSpaceX, standardSpaceX, standardSpaceX)];
        [self.emojiBtn addTarget:self action:@selector(didTapEmoji:) forControlEvents:UIControlEventTouchUpInside];
        [self addSubview:self.emojiBtn];

        ////视图边缘阴影
//        [self.layer setShadowColor:[UIColor colorWithRed:210/255.0 green:210/255.0 blue:210/255.0 alpha:1.0].CGColor];
//        [self.layer setShadowOffset:CGSizeMake(0, -1)];
//        [self.layer setShadowOpacity:1.0];
//        [self.layer setShadowRadius:5.0];


        [self setBackgroundColor:[UIColor colorWithWhite:0.95 alpha:0.9]];
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
- (BOOL)textView:(YYTextView *)textView shouldLongPressHighlight:(YYTextHighlight *)highlight inRange:(NSRange)characterRange
{
    NSLog(@"shouldLongPressHighlight");
    return YES;
}
- (void)textView:(YYTextView *)textView didLongPressHighlight:(YYTextHighlight *)highlight inRange:(NSRange)characterRange rect:(CGRect)rect
{
    NSLog(@"didLongPressHighlight");
}

@end
