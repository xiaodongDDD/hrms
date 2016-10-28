//
//  ImagePickerViewController.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/28.
//
//

#import "ImagePickerViewController.h"
#import "RCImageModel.h"
#import "ToastUtils.h"
#define kViewWidth      [[UIScreen mainScreen] bounds].size.width
#define kMaxImageWidth 500

@interface ImagePickerViewController ()<UICollectionViewDataSource,UICollectionViewDelegate,UICollectionViewDelegateFlowLayout,UIImagePickerControllerDelegate,UINavigationControllerDelegate>
{
    NSArray *dataSource;
    NSMutableArray *selectedItems;
}
@property (nonatomic,strong)UICollectionView *imageCollectionView;
@property (nonatomic,strong)UIButton *libraryBtn;
@property (nonatomic,strong)UIButton *sendBtn;
@property (nonatomic,strong)NSMutableArray *touchPoints;

@end

@implementation ImagePickerViewController

static NSString * const reuseIdentifier = @"Cell";

- (void)viewDidLoad {
    [super viewDidLoad];
    
    //滚动相册
    UICollectionViewFlowLayout *flowLayout = [[UICollectionViewFlowLayout alloc] init];
    [flowLayout setScrollDirection:UICollectionViewScrollDirectionHorizontal];
   // [flowLayout setItemSize:CGSizeMake(screenWidth/3.0, 160)];
    [flowLayout setMinimumInteritemSpacing:2.0];
    [flowLayout setMinimumLineSpacing:2.0];
    _imageCollectionView = [[UICollectionView alloc] initWithFrame:CGRectMake(2, 0, screenWidth, 160) collectionViewLayout:flowLayout];
    [_imageCollectionView registerClass:[ImageCell class] forCellWithReuseIdentifier:reuseIdentifier];
    _imageCollectionView.dataSource = self;
    _imageCollectionView.delegate = self;
    
//    //设置长按拖动手势
//    UILongPressGestureRecognizer *longPress = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(longPressCell:)];
//    [longPress setMinimumPressDuration:0.20f];
//    [_imageCollectionView addGestureRecognizer:longPress];
    [_imageCollectionView setShowsHorizontalScrollIndicator:NO];
    [_imageCollectionView setShowsVerticalScrollIndicator:NO];
    [self.view addSubview:_imageCollectionView];
     //进入系统相册
    _libraryBtn = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    [_libraryBtn setTitle:@"相册" forState:UIControlStateNormal];
    [_libraryBtn addTarget:self action:@selector(enterLibrary) forControlEvents:UIControlEventTouchUpInside];
    [_libraryBtn setFrame:CGRectMake(5, CGRectGetMaxY(_imageCollectionView.frame)+5, 60, 35)];
    [self.view addSubview:_libraryBtn];
    //进入发送
    _sendBtn = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    _sendBtn.enabled = NO;
    [_sendBtn setFrame:CGRectMake(screenWidth-60-5, CGRectGetMaxY(_imageCollectionView.frame)+5, 60, 35)];
    [_sendBtn setTintColor:[UIColor whiteColor]];
    [_sendBtn.layer setCornerRadius:8.0];
    [_sendBtn setTitle:@"发送" forState:UIControlStateNormal];
    [_sendBtn setBackgroundColor:[UIColor colorWithRed:120/255.0 green:140/255.0 blue:255/255.0 alpha:1.0]];
    [_sendBtn addTarget:self action:@selector(senImageMessage) forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:_sendBtn];
    [_imageCollectionView setBackgroundColor:[UIColor whiteColor]];
    [self.view setBackgroundColor:[UIColor whiteColor]];
    selectedItems = [NSMutableArray array];
    //图库是否可用
    if([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypePhotoLibrary]){
        dataSource = [self getAllAssetInPhotoAblumWithAscending:NO];
    }
    // iOS9以后
    if ([UIDevice currentDevice].systemVersion.floatValue>=8.0) {
        
        if ([PHPhotoLibrary authorizationStatus] == PHAuthorizationStatusNotDetermined) {
            
            [PHPhotoLibrary requestAuthorization:^(PHAuthorizationStatus status) {
                
                if (status == PHAuthorizationStatusAuthorized) {
                    dispatch_async(dispatch_get_main_queue(), ^{
                        dataSource = [self getAllAssetInPhotoAblumWithAscending:NO];
                        [self.imageCollectionView reloadData];
                    });
                }
            }];
            
        }else if ([PHPhotoLibrary authorizationStatus] == PHAuthorizationStatusAuthorized){
            dataSource = [self getAllAssetInPhotoAblumWithAscending:NO];
            [self.imageCollectionView reloadData];
        }
    }
}
- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
}
#pragma mark -发送图片消息
- (void)senImageMessage
{
    NSMutableArray *array = [NSMutableArray arrayWithCapacity:selectedItems.count];
    for (int i=0; i<selectedItems.count; i++) {

        PHAsset *asset = dataSource[[selectedItems[i] integerValue]];
        CGFloat scale = 1.0;//[UIScreen mainScreen].scale
        //异步获取
        [self requestImageForAsset:asset scale:scale resizeMode:PHImageRequestOptionsResizeModeFast completion:^(UIImage *image) {
                //获取原始图   缩略图
            
            UIImageOrientation orientation = image.imageOrientation;
            UIImage  *formatImage;
            if(orientation != UIImageOrientationUp){
                UIGraphicsBeginImageContext(image.size);
                [image drawInRect:CGRectMake(0, 0, image.size.width, image.size
                                             .height)];
                formatImage = UIGraphicsGetImageFromCurrentImageContext();
                UIGraphicsEndImageContext();
            }else{
                formatImage = image;
            }
            
            RCImageMessage *imageMessage = [RCImageMessage messageWithImage:formatImage];
            imageMessage.thumbnailImage = formatImage;
            //imageMessage.originalImage = image;
            imageMessage.imageUrl = asset.localIdentifier;
            [array addObject:imageMessage];
            if (i==selectedItems.count-1) {
                NSLog(@"imagePickerViewController:%@",array);
                dispatch_async(dispatch_get_main_queue(), ^{
                    [selectedItems removeAllObjects];
                    [self.imageCollectionView reloadData];
                    [self.sendBtn setTitle:@"发送" forState:UIControlStateNormal];
                    self.sendBtn.enabled = NO;
                });
                [self.delegate clickedSendImageMessage:array];
            }
        }];
    }

}

#pragma mark <UICollectionViewDataSource>

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
{
    return dataSource.count;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    ImageCell *imageCell = [collectionView dequeueReusableCellWithReuseIdentifier:reuseIdentifier forIndexPath:indexPath];
    
    if ([selectedItems containsObject:@(indexPath.row)]) {
        imageCell.isSelected = YES;
    }else{
        imageCell.isSelected = NO;
    }
    [imageCell setCell:dataSource[indexPath.row] Index:indexPath.row];
    //添加手势
    UILongPressGestureRecognizer *longPress = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(longPressCell:)];
    [longPress setMinimumPressDuration:0.20f];
    [imageCell.imageView addGestureRecognizer:longPress];
    
    imageCell.imageCellBlock = ^(NSInteger itemIndex){
    
        if ([selectedItems containsObject:@(itemIndex)]) {
            [selectedItems removeObject:@(itemIndex)];
        }else{
            [selectedItems addObject:@(itemIndex)];
        }
        if (selectedItems.count==0) {
                [self.sendBtn setTitle:[NSString stringWithFormat:@"发送"] forState:UIControlStateNormal];
                self.sendBtn.enabled = NO;
        }else{
                [self.sendBtn setTitle:[NSString stringWithFormat:@"发送(%li)",selectedItems.count] forState:UIControlStateNormal];
                self.sendBtn.enabled = YES;
            if (selectedItems.count==5) {
                [ToastUtils showLongAtTop:@"选择个数最大不能超过5个"];
            }
        }
        NSLog(@"cellForItemAtIndexPath：%@",selectedItems);
    };
    return imageCell;
}


#pragma mark 创建cell的快照
- (UIView *)customSnapshoFromView:(UIView *)inputView {
    // 用cell的图层生成UIImage，方便一会显示
    UIGraphicsBeginImageContextWithOptions(inputView.bounds.size, NO, 0);
    [inputView.layer renderInContext:UIGraphicsGetCurrentContext()];
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    // 自定义这个快照的样子（下面的一些参数可以自己随意设置）
    UIView *snapshot = [[UIImageView alloc] initWithImage:image];
    snapshot.layer.masksToBounds = NO;
    snapshot.layer.cornerRadius = 0.0;
    snapshot.layer.shadowOffset = CGSizeMake(-5.0, 0.0);
    snapshot.layer.shadowRadius = 5.0;
    snapshot.layer.shadowOpacity = 0.4;
    return snapshot;
}

#pragma mark 长按手势方法
- (void)longPressCell:(UILongPressGestureRecognizer *)longPress {
    UIGestureRecognizerState state = longPress.state;
    CGPoint location = [longPress locationInView:self.imageCollectionView];
    NSLog(@"坐标:%@",NSStringFromCGPoint(location));
    NSIndexPath *indexPath = [self.imageCollectionView indexPathForItemAtPoint:location];
    static UIView       *snapshot = nil;
    static NSIndexPath  *sourceIndexPath = nil;
    
    switch (state) {
            // 已经开始按下
        case UIGestureRecognizerStateBegan: {
            // 判断是不是按在了cell上面
            if (indexPath) {
                sourceIndexPath = indexPath;
                ImageCell *cell = (ImageCell *)[self.imageCollectionView cellForItemAtIndexPath:indexPath];
                self.touchPoints = [NSMutableArray array];
                // 为拖动的cell添加一个快照
                snapshot = [self customSnapshoFromView:cell];
                // 添加快照至collectionView中
                __block CGPoint center = CGPointMake(cell.center.x-self.imageCollectionView.contentOffset.x, cell.center.y);
                snapshot.center = center;
                snapshot.alpha = 0.0;
                //将快照放在最上层
                [self.view addSubview:snapshot];
                // 按下的瞬间执行
                center.y = location.y;
                snapshot.center = center;
                snapshot.transform = CGAffineTransformMakeScale(1.05, 1.05);
                snapshot.alpha = 0.98;
                cell.imageView.alpha = 0.0;
                cell.imageView.hidden = YES;
            }
            break;
        }
            // 移动过程中
        case UIGestureRecognizerStateChanged: {
            // 这里保持数组里面只有最新的两次触摸点的坐标
            [self.touchPoints addObject:[NSValue valueWithCGPoint:location]];
            if (self.touchPoints.count > 2) {
                [self.touchPoints removeObjectAtIndex:0];
            }
            CGPoint center = snapshot.center;
            // 快照随触摸点y值移动（当然也可以根据触摸点的y轴移动量来移动）
            center.y = location.y;
//            // 快照随触摸点x值改变量移动
//            CGPoint Ppoint = [[self.touchPoints firstObject] CGPointValue];
//            CGPoint Npoint = [[self.touchPoints lastObject] CGPointValue];
//            CGFloat moveX = Npoint.x - Ppoint.x;
//            center.x += moveX;
            snapshot.center = center;
//            NSLog(@"%@---%f----%@", self.touchPoints, moveX, NSStringFromCGPoint(center));
            NSLog(@"移动中%@", NSStringFromCGRect(snapshot.frame));
            
            break;
        }


        // 长按手势取消状态
        default: {
            NSLog(@"长按手势取消状态");
            if (CGRectIntersectsRect(self.imageCollectionView.frame, snapshot.frame)) {
                // 清除操作
                // 清空数组，非常重要，不然会发生坐标突变！
                [self.touchPoints removeAllObjects];
                ImageCell *cell = (ImageCell *)[self.imageCollectionView cellForItemAtIndexPath:sourceIndexPath];
                cell.imageView.hidden = NO;
                cell.imageView.alpha = 0;
                
                // 将快照恢复到初始状态
                [UIView animateWithDuration:0.25 animations:^{
                    snapshot.center = CGPointMake(cell.center.x-self.imageCollectionView.contentOffset.x, cell.center.y);
                    snapshot.transform = CGAffineTransformIdentity;
                    snapshot.alpha = 0.0;
                    cell.imageView.alpha = 1.0;
                    
                } completion:^(BOOL finished) {
                    sourceIndexPath = nil;
                    [snapshot removeFromSuperview];
                    snapshot = nil;
                    
                }];
            }else{
                // 清除操作
                // 清空数组，非常重要，不然会发生坐标突变！
                [self.touchPoints removeAllObjects];
                ImageCell *cell = (ImageCell *)[self.imageCollectionView cellForItemAtIndexPath:sourceIndexPath];
                NSLog(@"快照的坐标：%@",NSStringFromCGPoint(snapshot.center));
                [self panGestureSendImageMessage:sourceIndexPath.row WithView:snapshot Cell:cell];
                sourceIndexPath = nil;
            }
            break;
        }
    }
    
}
//上滑发图
- (void)panGestureSendImageMessage:(NSInteger)index WithView:(UIView *)snapshot Cell:(ImageCell*)cell
{
    PHAsset *asset = dataSource[index];
    CGFloat scale = 1.0;//[UIScreen mainScreen].scale
    //异步获取
    [self requestImageForAsset:asset scale:scale resizeMode:PHImageRequestOptionsResizeModeExact completion:^(UIImage *image) {
        UIImageOrientation orientation = image.imageOrientation;
        UIImage  *formatImage;
        if(orientation != UIImageOrientationUp){
            UIGraphicsBeginImageContext(image.size);
            [image drawInRect:CGRectMake(0, 0, image.size.width, image.size
                                         .height)];
            formatImage = UIGraphicsGetImageFromCurrentImageContext();
            UIGraphicsEndImageContext();
        }else{
            formatImage = image;
        }
        //获取原始图   缩略图
        RCImageMessage *imageMessage = [RCImageMessage messageWithImage:formatImage];
        imageMessage.thumbnailImage = formatImage;
        imageMessage.imageUrl = asset.localIdentifier;
        [self.delegate longPressSendImageMessage:imageMessage WithView:snapshot Cell:cell];
    }];
}

#pragma mark <UICollectionViewDelegate>
-(void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
    ImageCell *cell = (ImageCell *)[collectionView cellForItemAtIndexPath:indexPath];
    cell.imageCellBlock(indexPath.item);
    [collectionView reloadItemsAtIndexPaths:@[indexPath]];
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath
{
    PHAsset *asset = dataSource[indexPath.row];
    return [self getSizeWithAsset:asset];
}

#pragma mark - 获取图片及图片尺寸的相关方法
- (CGSize)getSizeWithAsset:(PHAsset *)asset
{
    CGFloat width  = (CGFloat)asset.pixelWidth;
    CGFloat height = (CGFloat)asset.pixelHeight;
    CGFloat scale = width/height;
    
    return CGSizeMake(160*scale, 160);
}

- (void)enterLibrary
{
    [self openImagePickerViewController];
}

#pragma mark - 获取相册内所有照片资源
- (NSArray<PHAsset *> *)getAllAssetInPhotoAblumWithAscending:(BOOL)ascending
{
    NSMutableArray<PHAsset *> *assets = [NSMutableArray array];
    
    PHFetchOptions *option = [[PHFetchOptions alloc] init];
    //ascending 为YES时，按照照片的创建时间升序排列;为NO时，则降序排列
    option.sortDescriptors = @[[NSSortDescriptor sortDescriptorWithKey:@"creationDate" ascending:ascending]];
    
    PHFetchResult *result = [PHAsset fetchAssetsWithMediaType:PHAssetMediaTypeImage options:option];
    
    [result enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        PHAsset *asset = (PHAsset *)obj;
        [assets addObject:asset];
    }];
    
    return assets;
}

- (UIImage *)scaleImage:(UIImage*)image byScalingToSize:(CGSize)targetSize {
    
    UIImage *sourceImage = image;
    UIImage *newImage = nil;
    
    UIGraphicsBeginImageContext(targetSize);
    
    CGRect thumbnailRect = CGRectZero;
    thumbnailRect.origin = CGPointZero;
    thumbnailRect.size.width  = targetSize.width;
    thumbnailRect.size.height = targetSize.height;
    
    [sourceImage drawInRect:thumbnailRect];
    
    newImage = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    return newImage ;
}

- (void)requestImageForAsset:(PHAsset *)asset scale:(CGFloat)scale resizeMode:(PHImageRequestOptionsResizeMode)resizeMode completion:(void (^)(UIImage *image))completion
{
    PHImageRequestOptions *option = [[PHImageRequestOptions alloc] init];
    option.resizeMode = resizeMode;//控制照片尺寸
    option.networkAccessAllowed = YES;
    
    [[PHCachingImageManager defaultManager] requestImageDataForAsset:asset options:option resultHandler:^(NSData * _Nullable imageData, NSString * _Nullable dataUTI, UIImageOrientation orientation, NSDictionary * _Nullable info) {
        BOOL downloadFinined = ![[info objectForKey:PHImageCancelledKey] boolValue] && ![info objectForKey:PHImageErrorKey] && ![[info objectForKey:PHImageResultIsDegradedKey] boolValue];
        if (downloadFinined && completion) {
            CGFloat sca = imageData.length/(CGFloat)UIImageJPEGRepresentation([UIImage imageWithData:imageData], 1).length;
            NSData *data = UIImageJPEGRepresentation([UIImage imageWithData:imageData], scale==1?sca:sca/2);
            completion([UIImage imageWithData:data]);
        }
    }];
}
#pragma mark - ImagePickerViewControllerDelegate
- (void)openImagePickerViewController
{
    UIImagePickerController *imagePicker = [[UIImagePickerController alloc] init];
    imagePicker.delegate = self;
    //图库是否可用
    if([UIImagePickerController isSourceTypeAvailable:UIImagePickerControllerSourceTypePhotoLibrary])
    {
        [imagePicker setAllowsEditing:YES];
        [imagePicker setSourceType:UIImagePickerControllerSourceTypePhotoLibrary];
        [self.sender presentViewController:imagePicker animated:YES completion:^{
            [self.delegate openImagePickerViewController];
        }];
    }
}
#pragma mark- UIImagePickerViewControllerDelegate
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingImage:(UIImage *)image editingInfo:(nullable NSDictionary<NSString *,id> *)editingInfo
{
    [self.sender dismissViewControllerAnimated:YES completion:^{
        NSLog(@"来了相册,image:%@,editingInfo:%@",image,editingInfo);
        [self.delegate finishedSelectImage:editingInfo[@"UIImagePickerControllerOriginalImage"]];
    }];
}

@end
