//
//  RCIMDiscussionCell.h
//  HelloCordova
//
//  Created by wangsheng on 16/8/24.
//
//

#import <UIKit/UIKit.h>
#import "YYText.h"
#import "RCIMDiscussionMessageFrame.h"

@interface RCIMDiscussionCell : UITableViewCell
/*!
 *
 * 提示框（比如 xx加入了讨论组，右上角可设置讨论组名称和头像）bgcolor 215
 */
@property (nonatomic,strong)UILabel *notificationLabel;
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
@property (nonatomic,strong)RCIMDiscussionMessageFrame *msgFrame;
@end
