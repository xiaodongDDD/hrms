//
//  EmojiCell.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/26.
//
//

#import <UIKit/UIKit.h>
#import "YYLabel.h"

@interface EmojiCell : UICollectionViewCell
@property (nonatomic,strong)YYLabel *emojiView;
- (void)setCell:(NSString *)string IndexPath:(NSIndexPath *)indexPath;
@end
