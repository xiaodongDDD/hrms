//
//  ChatInputBarControl.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/13.
//
//

#import <UIKit/UIKit.h>
#import "YYTextView.h"
#import "CVDPlugin-Bridging-Header.h"

@protocol ChatInputBarControlDelegate <NSObject>
@optional
/*!
 * 语音按钮点击回调
 */
- (void)touchSendBtn:(id)object;
/*!
 * 图库按钮点击回调
 */
- (void)touchPhotoLibrary:(UIButton *)sender;
/*!
 * 相机按钮点击回调
 */
- (void)touchCamera:(UIButton *)sender;
/*!
 * emoji表情按钮点击回调
 */
- (void)touchEmojiView:(UIButton *)sender;
/*!
 * 语音按钮点击回调
 */
- (void)touchRecoder:(UIButton *)sender;

@end

@interface ChatInputBarControl : UIView<YYTextViewDelegate>
// 80.5px    #D2D2D2上阴影 2px
/*!
 * 文字+emoji输入框
 */
@property (nonatomic,strong)YYTextView *inputField;
/*!
 * emoji表情按钮
 */
@property (nonatomic,strong)UIButton *emojiBtn;
/*!
 * 录音按钮
 */
@property (nonatomic,strong)UIButton *recorderBtn;
/*!
 * 进入图片库选择图片按钮
 */
@property (nonatomic,strong)UIButton *imagePickerBtn;
/*!
 * 启动照相机按钮
 */
@property (nonatomic,strong)UIButton *cameraBtn;
/*!
 * 消息发送按钮
 */
@property (nonatomic,strong)UIButton *sendBtn;
/*!
 * 输入工具栏代理
 */
@property (nonatomic,strong)id<ChatInputBarControlDelegate>delegate;
 
@end
