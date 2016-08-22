//
//  ChattingTableView.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/25.
//
//

#import <UIKit/UIKit.h>

@protocol UITableViewTouchDelegate <NSObject>
@optional
- (void)touchTableView;

@end
@interface ChattingTableView : UITableView
@property (nonatomic,strong)id<UITableViewTouchDelegate>touchDelegate;

@end
