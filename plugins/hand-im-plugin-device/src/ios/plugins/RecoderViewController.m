//
//  RecoderViewController.m
//  HelloCordova
//
//  Created by wangsheng on 16/8/2.
//
//

#import "RecoderViewController.h"
#import "RecorderManager.h"
#import "CVDPlugin-Bridging-Header.h"
@interface RecoderViewController ()<RecorderManagerDelegate>
{
    NSTimeInterval startDate;
}
@property (nonatomic,strong)NSTimer *timer;
@property (nonatomic,strong)UIButton *recorderBtn;
@property (nonatomic,strong)UILabel *recorderTitle;
@property (nonatomic,strong)UIImageView *leftImageView;
@property (nonatomic,strong)UIImageView *rightImageView;
@property (nonatomic,strong)UIButton *playerBtn;
@property (nonatomic,strong)UIButton *trashBtn;
@end
@implementation RecoderViewController
-(void)viewDidLoad
{
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    [self setUp];
}
- (void)setUp
{
    _recorderTitle = [[UILabel alloc] initWithFrame:CGRectMake(screenWidth/2.0-60, 20, 120, 20)];
    [_recorderTitle setTextAlignment:NSTextAlignmentCenter];
    [_recorderTitle setFont:[UIFont systemFontOfSize:17.0]];
    [_recorderTitle setText:@"按住说话"];
    [_recorderTitle setTextColor:[UIColor grayColor]];
    [self.view addSubview:_recorderTitle];
    
    _leftImageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"chat_record_len_right.png"]];
    _leftImageView.hidden = YES;
    [_leftImageView setFrame:CGRectMake(CGRectGetMinX(_recorderTitle.frame)-80, 20, 80, 18)];
    [self.view addSubview:_leftImageView];
    _rightImageView = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"chat_record_len_left.png"]];
    _rightImageView.hidden = YES;
    [_rightImageView setFrame:CGRectMake(CGRectGetMaxX(_recorderTitle.frame), 20, 80, 18)];
    [self.view addSubview:_rightImageView];
    
    _recorderBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    [_recorderBtn addTarget:self action:@selector(touchinside:) forControlEvents:UIControlEventTouchDown];
    [_recorderBtn addTarget:self action:@selector(touchupinside:) forControlEvents:UIControlEventTouchUpInside];
    [_recorderBtn addTarget:self action:@selector(TouchDragInside:withEvent:) forControlEvents:UIControlEventTouchDragInside];
    [_recorderBtn addTarget:self action:@selector(dragoutside:) forControlEvents:UIControlEventTouchDragOutside];
    [_recorderBtn setFrame:CGRectMake((screenWidth-120)/2.0,70, 120, 120)];
    [_recorderBtn.layer setCornerRadius:_recorderBtn.bounds.size.width/2];
    [_recorderBtn setBackgroundImage:[UIImage imageNamed:@"recordView.png"] forState:UIControlStateNormal];
    [_recorderBtn setBackgroundImage:[UIImage imageNamed:@"recordView_pressed.png"] forState:UIControlStateHighlighted];
    [self.view addSubview:_recorderBtn];
    
//    _playerBtn = [UIButton buttonWithType:UIButtonTypeCustom];
//    _playerBtn.hidden = YES;
//    [_playerBtn setFrame:CGRectMake(CGRectGetMinX(_recorderBtn.frame)-30-40, CGRectGetMinY(_recorderBtn.frame)+20, 40, 40)];
//    [_playerBtn.layer setCornerRadius:_playerBtn.bounds.size.width/2.0];
//    [self playBtnStateNormal];
//    [_playerBtn.titleLabel setFont:[UIFont systemFontOfSize:15]];
//    [self.view addSubview:_playerBtn];
    
    _trashBtn = [UIButton buttonWithType:UIButtonTypeCustom];
    _trashBtn.hidden = YES;
    [_trashBtn.layer setMasksToBounds:YES];
    [_trashBtn setFrame:CGRectMake(CGRectGetMaxX(_recorderBtn.frame)+30, CGRectGetMinY(_recorderBtn.frame)+20, 40, 40)];
    [_trashBtn.titleLabel setFont:[UIFont systemFontOfSize:15]];
    [_trashBtn.layer setCornerRadius:_trashBtn.bounds.size.width/2.0];
    [self trashBtnStateNormal];
    [self.view addSubview:_trashBtn];
}
#pragma mark- 试听录音按下状态
- (void)playBtnPressedDown
{
        [_playerBtn setImage:[UIImage imageNamed:@"aio_voice_operate_listen_press.png"] forState:UIControlStateNormal];
        [_playerBtn setBackgroundImage:[UIImage imageNamed:@"aio_voice_operate_press.png"] forState:UIControlStateNormal];
}
#pragma mark -试听录音正常状态
- (void)playBtnStateNormal
{
    [_playerBtn setImage:[UIImage imageNamed:@"aio_voice_operate_listen_nor.png"] forState:UIControlStateNormal];
    [_playerBtn setBackgroundImage:[UIImage imageNamed:@"aio_voice_operate_nor.png"] forState:UIControlStateNormal];
}
#pragma mark -取消录音按下状态
- (void)trashBtnPressedDown
{
    [_trashBtn setImage:[UIImage imageNamed:@"aio_voice_operate_delete_press.png"] forState:UIControlStateNormal];
    [_trashBtn setBackgroundImage:[UIImage imageNamed:@"aio_voice_operate_press.png"] forState:UIControlStateNormal];
}
#pragma mark -取消录音正常状态
- (void)trashBtnStateNormal
{
    [_trashBtn setImage:[UIImage imageNamed:@"aio_voice_operate_delete_nor.png"] forState:UIControlStateNormal];
    [_trashBtn setBackgroundImage:[UIImage imageNamed:@"aio_voice_operate_nor@3x.png"] forState:UIControlStateNormal];
}

//按下去
- (void)touchinside:(UIButton *)sender
{
    _leftImageView.hidden = NO;
    _rightImageView.hidden = NO;
    _playerBtn.hidden = NO;
    _trashBtn.hidden = NO;
    startDate = 0;
    [_recorderTitle setText:@"准备中"];
    [sender setTransform:CGAffineTransformMakeScale(0.8, 0.8)];
    [UIView animateWithDuration:1.0 delay:0 usingSpringWithDamping:0.5 initialSpringVelocity:0.6 options:UIViewAnimationOptionCurveEaseOut animations:^{
        [sender setTransform:CGAffineTransformMakeScale(1.0, 1.0)];
    } completion:nil];
    [self.delegate startRecordering];
   [RecorderManager sharedInstance].delegate = self;
   [[RecorderManager sharedInstance] startRecording];
    _timer = [NSTimer scheduledTimerWithTimeInterval:1.0 target:self selector:@selector(updateRecorderTime:) userInfo:nil repeats:YES];
}
//抬起来
- (void)touchupinside:(UIButton *)sender
{
    _leftImageView.hidden = YES;
    _rightImageView.hidden = YES;
    _playerBtn.hidden = YES;
    _trashBtn.hidden = YES;
    [self playBtnStateNormal];
    [self trashBtnStateNormal];
    _trashBtn.transform = CGAffineTransformMakeScale(1.0, 1.0);
    if ([_timer isValid]) {
        [_timer invalidate];
    }
    //在这里发送
    [_recorderTitle setText:@"按住说话"];
    [[RecorderManager sharedInstance] stopRecording];
    [self.delegate stopRecordering];
    NSLog(@"touchupinside");
}
//拖到外环
- (void)dragoutside:(UIButton *)sender
{
    _leftImageView.hidden = YES;
    _rightImageView.hidden = YES;
    [self playBtnStateNormal];
    [self trashBtnStateNormal];
    _playerBtn.transform = CGAffineTransformMakeScale(1.0, 1.0);
    _trashBtn.transform = CGAffineTransformMakeScale(1.0, 1.0);
     _recorderTitle.text = @"按住说话";
//    [self.delegate cancelRecordering];
    if ([_timer isValid]) {
        [_timer invalidate];
    }
    //取消录音
   // [[RecorderManager sharedInstance] cancelRecording];
    NSLog(@"用力过猛 dragoutside");
}
//在内环拖拽
- (void)TouchDragInside:(UIButton *)sender withEvent:(UIEvent *)event
{
    UITouch *touch = [[event allTouches] anyObject];
    CGPoint point = [touch locationInView:self.view];
    if (CGRectContainsPoint(_trashBtn.frame, point)) {
        _recorderTitle.text = @"松手取消发送";
        _trashBtn.transform = CGAffineTransformMakeScale(1.4, 1.4);
        [self trashBtnPressedDown];
        if ([_timer isValid]) {
            [_timer setFireDate:[NSDate distantFuture]];
            [[RecorderManager sharedInstance] cancelRecording];
        }
    }else{
        _trashBtn.transform = CGAffineTransformMakeScale(1.0, 1.0);
    }
//    if (CGRectContainsPoint(_playerBtn.frame, point)) {
//        _recorderTitle.text = @"松手试听";
//        _playerBtn.selected = YES;
//        _playerBtn.transform = CGAffineTransformMakeScale(1.4, 1.4);
//        [self playBtnPressedDown];
//        if ([_timer isValid]) {
//            [_timer setFireDate:[NSDate distantFuture]];
//            [self.delegate stopRecordering];
//        }
//    }else{
//        _playerBtn.transform = CGAffineTransformMakeScale(1.0, 1.0);
//    }
}
- (void)updateRecorderTime:(NSTimer *)timer
{
    startDate = startDate +1;
   [_recorderTitle setText:[NSString stringWithFormat:@"%0.0f:%02.0f",startDate/60,startDate]];
}
#pragma mark- RecorderManagerDelegate
/*!
 *录音结束，返回文件路径 录音时间戳
 */
- (void)recordingFinishedWithFileName:(NSString *)filePath time:(NSTimeInterval)interval
{
    [self.delegate finishedRecordering:filePath timeInterval:interval];
}
/*!
 *录音超时
 */
- (void)recordingTimeout
{
    
}
/*!
 *录音停止
 */
- (void)recordingStopped
{
    
}
/*!
 *录音失败 时间太短
 */
- (void)recordingFailed:(NSString *)failureInfoString
{
    [self.delegate failedRecorderingWithString:failureInfoString];
}
/*!
 *录音取消
 */
- (void)recordingCancel
{
   // [self.delegate finishedRecordering:nil timeInterval:0];
    NSLog(@"%@ 录音取消",[self class]);
}

@end
