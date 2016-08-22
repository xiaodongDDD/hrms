//
//  EmotionViewController.m
//  HelloCordova
//
//  Created by wangsheng on 16/7/26.
//
//

#import "EmotionViewController.h"
#import "EmojiCell.h"
#import "CVDPlugin-Bridging-Header.h"
@interface EmotionViewController ()<UICollectionViewDataSource,UICollectionViewDelegate,UICollectionViewDelegateFlowLayout>
@property (nonatomic,strong)NSMutableArray *dataSource;
@property (nonatomic,strong)UICollectionView *emojiCollectionView;
@property (nonatomic,strong)UIPageControl *pageControl;
@property (nonatomic,strong)UIImageView *emojiView;
@property (nonatomic,strong)UIButton *sendButton;
@end
static NSString *reusableCell = @"reusableCell";
static NSString *deleteCell = @"deleteCell";
@implementation EmotionViewController

-(instancetype)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        
    }
    return self;
}
- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    NSString *path = [[NSBundle mainBundle] pathForResource:@"Emoji" ofType:@"plist"];
    _dataSource = [NSMutableArray arrayWithContentsOfFile:path];
    NSLog(@"_dataSource:%@-___%@ ",[_dataSource[10] class],[path class]);
}
- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    UICollectionViewFlowLayout *flowLayout = [[UICollectionViewFlowLayout alloc] init];
    [flowLayout setMinimumLineSpacing:(screenWidth-40*7)/8.0];
    [flowLayout setMinimumInteritemSpacing:(160-3*40)/4.0];
    [flowLayout setItemSize:CGSizeMake(40, 40)];
    
    [flowLayout setScrollDirection:UICollectionViewScrollDirectionHorizontal];
    _emojiCollectionView.collectionViewLayout = flowLayout;
    _emojiCollectionView = [[UICollectionView alloc]initWithFrame:CGRectMake((screenWidth-40*7)/8.0/2, 0, screenWidth-(screenWidth-40*7)/8.0, 160) collectionViewLayout:flowLayout];
    _emojiCollectionView.dataSource = self;
    _emojiCollectionView.delegate = self;
    _emojiCollectionView.pagingEnabled = YES;
    _emojiCollectionView.showsVerticalScrollIndicator = NO;
    _emojiCollectionView.showsHorizontalScrollIndicator = NO;
    [_emojiCollectionView setBackgroundColor:[UIColor whiteColor]];
    [_emojiCollectionView registerClass:[EmojiCell class] forCellWithReuseIdentifier:reusableCell];
    [_emojiCollectionView registerClass:[EmojiCell class] forCellWithReuseIdentifier:deleteCell];
  //  [_emojiCollectionView setBackgroundColor:[UIColor greenColor]];
    [self.view addSubview:_emojiCollectionView];
    
    _pageControl = [[UIPageControl alloc] initWithFrame:CGRectMake(screenWidth/2-60, CGRectGetMaxY(_emojiCollectionView.frame), 120, 20)];
    [_pageControl setNumberOfPages:_dataSource.count/21];
  //  [_pageControl setBackgroundColor:[UIColor grayColor]];
    [_pageControl setPageIndicatorTintColor:[UIColor lightGrayColor]];
    [_pageControl setCurrentPageIndicatorTintColor:[UIColor grayColor]];
    [self.view addSubview:_pageControl];
    
    _emojiView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"emoji_btn_normal.png"]];
    //[_emojiView setBackgroundColor:[UIColor greenColor]];
    [_emojiView setFrame:CGRectMake(0, CGRectGetHeight(self.view.bounds)-30-5, 30, 30)];
    [self.view addSubview:_emojiView];
    
    _sendButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    _sendButton.frame = CGRectMake(screenWidth-70-10, CGRectGetHeight(self.view.bounds)-35-5, 70, 35);
    [_sendButton addTarget:self action:@selector(sendEmoji:) forControlEvents:UIControlEventTouchUpInside];
    [_sendButton setTintColor:[UIColor whiteColor]];
    [_sendButton setTitle:@"发送" forState:UIControlStateNormal];
    [_sendButton setBackgroundColor:[UIColor colorWithRed:120/255.0 green:140/255.0 blue:255/255.0 alpha:1.0]];
    [_sendButton.layer setCornerRadius:8.0];
    [self.view addSubview:_sendButton];
    
    //[self.view setBackgroundColor:[UIColor lightGrayColor]];
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
{
    NSLog(@"_dataSource%li",_dataSource.count);
    return _dataSource.count;
}

// The cell that is returned must be retrieved from a call to -dequeueReusableCellWithReuseIdentifier:forIndexPath:
- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath
{
   
    EmojiCell *emojiCell;
    
    if (indexPath.row==20||indexPath.row==41||indexPath.row==62||indexPath.row==83||indexPath.row==104||indexPath.row==125) {
         emojiCell = [collectionView dequeueReusableCellWithReuseIdentifier:deleteCell forIndexPath:indexPath];// item section
        
    }else{
         emojiCell = [collectionView dequeueReusableCellWithReuseIdentifier:reusableCell forIndexPath:indexPath];// item section
    }
    [emojiCell setCell:_dataSource[indexPath.row] IndexPath:indexPath];
    return emojiCell;
}
- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath
{
    if (indexPath.row==20||indexPath.row==41||indexPath.row==62||indexPath.row==83||indexPath.row==104||indexPath.row==125) {
       //点了删除
        [self.delegate emotionViewDidDelete:collectionView];
        
    }else{
        [self.delegate emotionViewDidSelect:collectionView Text:_dataSource[indexPath.row]];
    }
    NSLog(@"选择的emoji是:%li",[_dataSource[indexPath.row] length]);
}
- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView;
{
    int contentOffX  = _emojiCollectionView.contentOffset.x;
    int viewWidth = _emojiCollectionView.bounds.size.width;
    [_pageControl setCurrentPage:contentOffX/viewWidth];
}
- (void)sendEmoji:(UIButton *)sender
{
    [self.delegate emotionViewDidTapSend:sender];
}
@end
