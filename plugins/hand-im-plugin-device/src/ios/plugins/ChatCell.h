//
//  ChatCell.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/13.
//
//

#import <UIKit/UIKit.h>
#import "YYText.h"
#import "MessageFrame.h"

@interface ChatCell : UITableViewCell
/*!
 *
 * 时间线 高度20 字体大小13 颜色 155 155 155 1.0
 */
@property (nonatomic,strong)UILabel *timeLabel;
/*!
 * 用户名
 */
@property (nonatomic,strong)UILabel *userNameLabel;
/*!
 * user头像 小头像 40*40 左间距15
 */
@property (nonatomic,strong)UIImageView *iconImageView;
/*!
 * 聊天字体大小17
 *
 * 聊天消息视图  自发的白色 收到的黑色 自己的浅蓝色底 收到的浅灰色底 圆角20
 */
@property (nonatomic,strong) YYLabel *messageLabel;

/*!
 * 消息model的frame
 */
@property (nonatomic,strong)MessageFrame *msgFrame;

@end
