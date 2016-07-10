//
//  ViewController.h
//  LYJCanlender
//
//  Created by Liyanjun on 16/6/7.
//  Copyright © 2016年 liyanjun. All rights reserved.
//

#import "CalendarDayCell.h"
@implementation CalendarDayCell{
 
    float dia;
    float dutyX;
    float dutyY;
}

- (id)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        [self initView];
    }
    return self;
}

- (void)initView {
    
    float multiple = 0.f;
    dia = 0.f;
    dutyY=0.f;
    dutyX=0.f;
    if (IS_IPHONE4) {
        multiple = 0.33;
        dia = 35.f;
        dutyY=1.3f;
        dutyX=0.7;
    } else if (IS_IPHONE5) {
        multiple = 0.33;
        dia = 36.f;
        dutyY=1.3f;
        dutyX=0.7;
    } else if (IS_IPhone6) {
        multiple = 0.35;
        dia = 43.f;
        dutyY=0.9f;
        dutyX=0.65;
    } else {
        multiple = 0.35;
        dia = 46.f;
        dutyY=0.9f;
        dutyX=0.65;
    }
    
    //选中时显示的图片
    imgview = [[UIImageView alloc] initWithFrame:CGRectMake(ViewWidth(self)*0.26, ViewHeight(self)*multiple, ViewWidth(self)*0.5, ViewWidth(self)*1)];
    imgview.image = [UIImage imageNamed:@"chack"];
    
    [imgview.layer setCornerRadius:8.0]; //设置矩形四个圆角半径
    imgview.layer.masksToBounds = YES;
    [self.contentView addSubview:imgview];
    
    
    //休息
    imgRest = [[UIImageView alloc] initWithFrame:CGRectMake(ViewWidth(self)*0.75, ViewWidth(self)*0.35, self.bounds.size.width-dia, self.bounds.size.width-dia)];
    imgRest.image = [UIImage imageNamed:@"xiu"];
    [self.contentView addSubview:imgRest];
    
    
    //班
    imgDuty =  [[UIImageView alloc] initWithFrame:CGRectMake(ViewWidth(self)*0.75, ViewWidth(self)*0.35, self.bounds.size.width-dia, self.bounds.size.width-dia)];
    imgDuty.image = [UIImage imageNamed:@"ban"];
    [self.contentView addSubview:imgDuty];
    
    //日期
    day_lab = [[UILabel alloc] initWithFrame:CGRectMake(0, 15, self.bounds.size.width, self.bounds.size.width-10)];
    day_lab.textAlignment = NSTextAlignmentCenter;
    day_lab.font = [UIFont systemFontOfSize:14];
    [self.contentView addSubview:day_lab];
    
    //农历
    day_title = [[UILabel alloc] initWithFrame:CGRectMake(0, self.bounds.size.height-15, self.bounds.size.width, 13)];
    day_title.textColor = [UIColor lightGrayColor];
    day_title.font = [UIFont boldSystemFontOfSize:10];
    day_title.textAlignment = NSTextAlignmentCenter;
    
    [self.contentView addSubview:day_title];
    
    
}

- (void)setModel:(CalendarDayModel *)model {
    
    if(model.holiday){
        imgRest.frame = CGRectMake(ViewWidth(self)*0.75, ViewWidth(self)*0.35, self.bounds.size.width-dia, self.bounds.size.width-dia);
        
        imgDuty.frame = CGRectMake(ViewWidth(self)*0.75, ViewWidth(self)*0.35, self.bounds.size.width-dia, self.bounds.size.width-dia);
    }else{
    
        imgRest.frame = CGRectMake(ViewWidth(self)*0.75, ViewWidth(self)*0.35, self.bounds.size.width-dia, self.bounds.size.width-dia);
        
        imgDuty.frame = CGRectMake(ViewWidth(self)*0.75, ViewWidth(self)*0.35, self.bounds.size.width-dia, self.bounds.size.width-dia);
    }
    
    switch (model.WorkOrRest) {
        case CellDayWork:
            imgRest.hidden=YES;
            imgDuty.hidden=NO;

            break;
        case CellDayRest:
            imgRest.hidden=NO;
            imgDuty.hidden=YES;
           
            break;
        default:
            imgRest.hidden=YES;
            imgDuty.hidden=YES;
            break;
    }

    
    switch (model.style) {
        case CellDayTypeEmpty:    //不显示
            [self hidden_YES];
            break;
            
        case CellDayTypePast:    //过去的日期
            [self hidden_NO];
            
            if (model.holiday) {
                day_lab.text = model.holiday;
            } else {
                day_lab.text = [NSString stringWithFormat:@"%d", model.day];
            }
            
            day_lab.textColor = [UIColor lightGrayColor];
            day_title.text = model.Chinese_calendar;
            imgview.hidden = YES;
           
            break;
            
        case CellDayTypeFutur:    //将来的日期
            [self hidden_NO];
            
            if (model.holiday) {
                day_lab.text = model.holiday;
                day_lab.textColor = COLOR_HOLODAT;
            } else {
                day_lab.text = [NSString stringWithFormat:@"%d", model.day];
//                day_lab.textColor = COLOR_THEME;
                switch (model.WorkOrRest) {
                    case CellDayWork:
                        day_lab.textColor=COLOR_WORK;
                        break;
                    case CellDayRest:
                        day_lab.textColor = COLOR_HOLODAT;
                        break;
                    default:
                        day_lab.textColor = COLOR_THEME;
                        break;
                }
                

            }
            
                       day_title.text = model.Chinese_calendar;
            imgview.hidden = YES;
           
            break;
            
        case CellDayTypeWeek:    //周末
            [self hidden_NO];
            
            if (model.holiday) {
                day_lab.text = model.holiday;
                day_lab.textColor = COLOR_HOLODAT;
                
            } else {
                day_lab.text = [NSString stringWithFormat:@"%lu", model.day];
//                day_lab.textColor = COLOR_THEME1;
                switch (model.WorkOrRest) {
                    case CellDayWork:
                        day_lab.textColor=COLOR_WORK;
                        break;
                    case CellDayRest:
                        day_lab.textColor = COLOR_HOLODAT;
                        break;
                    default:
                        day_lab.textColor = COLOR_THEME;
                        break;
                }

            }
            
            

            day_title.text = model.Chinese_calendar;
            imgview.hidden = YES;
          
            break;
            
        case CellDayTypeClick:    //被点击的日期
            [self hidden_NO];
            day_lab.text = [NSString stringWithFormat:@"%d", model.day];
            day_lab.textColor = [UIColor whiteColor];
            day_title.text = model.Chinese_calendar;
            imgview.hidden = NO;
            imgRest.frame = CGRectMake(ViewWidth(self)*0.75, ViewWidth(self)*0.35, self.bounds.size.width-dia, self.bounds.size.width-dia);
            
            imgDuty.frame = CGRectMake(ViewWidth(self)*0.75, ViewWidth(self)*0.35, self.bounds.size.width-dia, self.bounds.size.width-dia);
            break;
            
        default:
            
            break;
    }
    
   

    
 
    
}

- (void)hidden_YES {
    
    day_lab.hidden = YES;
    day_title.hidden = YES;
    imgview.hidden = YES;
    imgRest.hidden = YES;
    imgDuty.hidden=YES;
    
}

- (void)hidden_NO {
    
    day_lab.hidden = NO;
    day_title.hidden = NO;
    
}

@end
