//
//  ImageCell.h
//  HelloCordova
//
//  Created by wangsheng on 16/7/28.
//
//

#import <UIKit/UIKit.h>
#import <Photos/Photos.h>
typedef void(^ImageCellBlock)(NSInteger index);
@interface ImageCell : UICollectionViewCell
@property (nonatomic,strong)UIImageView *imageView;
@property (nonatomic,strong)UILabel *selectLabel;
@property (nonatomic,assign)BOOL isSelected;
@property (nonatomic,strong)ImageCellBlock imageCellBlock;
- (void)setCell:(PHAsset *)asset Index:(NSInteger)index;
@end
