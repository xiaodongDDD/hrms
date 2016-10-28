//
//  RCIMDiscussionMultiTypeViewController.m
//  汉得移动测试版
//
//  Created by wangsheng on 2016/10/10.
//
//

#import "RCIMDiscussionMultiTypeViewController.h"
#import "CVDPlugin-Bridging-Header.h"
#import "RCIMDiscussionMultiTypeCell.h"

@interface RCIMDiscussionMultiTypeViewController ()<UICollectionViewDataSource,UICollectionViewDelegate,UICollectionViewDelegateFlowLayout>
@property (nonatomic,strong)UICollectionView *multiDoneBoardView;
@property (nonatomic,strong)NSArray *dataSource;
@end

static NSString *cellID = @"RCIMDiscussionMultiTypeCell";

@implementation RCIMDiscussionMultiTypeViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    [self initMultiDone];
    [self initCollectionView];
}

- (void)initMultiDone
{
    UIImage *image1 = [UIImage imageNamed:@"Photo_multiType.png"];
    UIImage *image2 = [UIImage imageNamed:@"Camera_multiType.png"];
    
    self.dataSource = [NSArray arrayWithObjects:image1,image2, nil];
}

- (void)initCollectionView
{
    UICollectionViewFlowLayout *flowLayout = [[UICollectionViewFlowLayout alloc] init];
    
    self.multiDoneBoardView = [[UICollectionView alloc] initWithFrame:CGRectMake(0, 0, screenWidth, 216) collectionViewLayout:flowLayout];
    
    self.multiDoneBoardView.delegate = self;
    self.multiDoneBoardView.dataSource = self;
    
    [flowLayout setScrollDirection:UICollectionViewScrollDirectionVertical];
    
    
    //
    
    //
    [flowLayout setMinimumInteritemSpacing:0];//纵向间距
    [flowLayout setMinimumLineSpacing:20];//横向间距
    [flowLayout setSectionInset:UIEdgeInsetsMake(5, 5, 5, 5)];
    
    [self.multiDoneBoardView registerClass:[RCIMDiscussionMultiTypeCell class] forCellWithReuseIdentifier:cellID];
    
    self.multiDoneBoardView.backgroundColor = [UIColor whiteColor];
    
    [self.view addSubview:self.multiDoneBoardView];
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
{
    return 2;
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
    RCIMDiscussionMultiTypeCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:cellID forIndexPath:indexPath];
    if (indexPath.item<=self.dataSource.count-1) {
        cell.imageView.image = self.dataSource[indexPath.item];
    }
    
    return cell;
}

-(void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
    NSLog(@"item:%li",indexPath.item);
    if (indexPath.item==0) {
        [self.delegate didSelectedPhotoLibrary];
    }else if (indexPath.item==1){
        [self.delegate didSelectedCamera];
    }
}

-(CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath
{
    return CGSizeMake(80/375.0*screenWidth, 80/375.0*screenWidth);
}

@end
