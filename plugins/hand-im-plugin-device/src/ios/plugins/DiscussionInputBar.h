//
//  DiscussionInputBar.h
//  汉得移动测试版
//
//  Created by wangsheng on 2016/10/10.
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

- (void)touchMultiBtn:(UIButton *)sender;
@end

@interface DiscussionInputBar : UIView<YYTextViewDelegate>
@property (nonatomic,strong)UIButton *recorderBtn;
@property (nonatomic,strong)YYTextView *inputField;
@property (nonatomic,strong)UIButton *emojiBtn;
@property (nonatomic,strong)UIButton *multiBtn;
@property (nonatomic,strong)UIView *attachView;
@property (nonatomic,strong)id<ChatInputBarControlDelegate>delegate;
@end
