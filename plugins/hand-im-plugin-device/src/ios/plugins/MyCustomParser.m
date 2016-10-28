//
//  MyCustomParser.m
//  汉得移动测试版
//
//  Created by wangsheng on 2016/10/20.
//
//

#import "MyCustomParser.h"
static NSArray *emojiList;

@implementation MyCustomParser

+(void)initialize
{
    emojiList = [NSArray arrayWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"Emoji" ofType:@"plist"]];
}

-(NSString *)textParser:(NSString *)formStr
{
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[可爱]" withString:emojiList[0]];
    
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[脸红]" withString:emojiList[3]];
    
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[满意]" withString:emojiList[6]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[尴尬]" withString:emojiList[9]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[眨眼]" withString:emojiList[12]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[吓到了]" withString:emojiList[15]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[委屈]" withString:emojiList[1]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[吓]" withString:emojiList[27]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[酷]" withString:emojiList[4]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[很囧]" withString:emojiList[7]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[笑出汗]" withString:emojiList[27]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[哈哈]" withString:emojiList[125]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[气炸了]" withString:emojiList[16]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[窘迫]" withString:emojiList[19]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[色]" withString:emojiList[2]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[哭了]" withString:emojiList[5]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[困]" withString:emojiList[8]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[发怒]" withString:emojiList[11]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[囧]" withString:emojiList[15]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[衰]" withString:emojiList[17]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[媚眼]" withString:emojiList[21]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[吓出汗]" withString:emojiList[24]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[无奈]" withString:emojiList[27]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[飞吻]" withString:emojiList[30]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[呆]" withString:emojiList[33]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[很难过]" withString:emojiList[36]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[亲]" withString:emojiList[39]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[开心]" withString:emojiList[25]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[惊讶]" withString:emojiList[22]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[惊呆了]" withString:emojiList[34]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[笑]" withString:emojiList[28]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[生气]" withString:emojiList[31]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[难过]" withString:emojiList[37]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[叹气]" withString:emojiList[40]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[傲娇]" withString:emojiList[23]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[淘气]" withString:emojiList[26]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[笑哭了]" withString:emojiList[29]];
    
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[傲慢]" withString:emojiList[32]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[太囧]" withString:emojiList[35]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[额]" withString:emojiList[38]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[捂嘴]" withString:emojiList[42]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[不行]" withString:emojiList[51]];
    
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[病了]" withString:emojiList[48]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[鼓掌]" withString:emojiList[51]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[笑眯眼]" withString:emojiList[13]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[强]" withString:emojiList[57]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[拳头]" withString:emojiList[43]];
    
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[耶]" withString:emojiList[46]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[捂眼]" withString:emojiList[49]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[拳]" withString:emojiList[52]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[开心笑]" withString:emojiList[55]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[祈祷]" withString:emojiList[58]];
    
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[弱]" withString:emojiList[44]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[龇牙]" withString:emojiList[47]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[OK]" withString:emojiList[50]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[肌肉]" withString:emojiList[53]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[举手]" withString:emojiList[56]];
    //--
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[书]" withString:emojiList[63]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[冰淇淋]" withString:emojiList[66]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[闪电]" withString:emojiList[69]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[学位帽]" withString:emojiList[72]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[晴转多云]" withString:emojiList[75]];
    
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[圣诞树]" withString:emojiList[78]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[礼物]" withString:emojiList[64]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[云]" withString:emojiList[67]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[钱]" withString:emojiList[70]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[鸡腿]" withString:emojiList[73]];
    //--
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[铅笔]" withString:emojiList[76]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[红酒]" withString:emojiList[79]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[麻将]" withString:emojiList[82]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[庆祝]" withString:emojiList[65]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[雪花]" withString:emojiList[68]];
    
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[蛋糕]" withString:emojiList[71]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[雨伞]" withString:emojiList[74]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[便便]" withString:emojiList[77]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[唱歌]" withString:emojiList[80]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[广播]" withString:emojiList[84]];
    //--
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[骰子]" withString:emojiList[87]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[睡觉]" withString:emojiList[90]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[啤酒]" withString:emojiList[93]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[哼]" withString:emojiList[96]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[米饭]" withString:emojiList[99]];
    
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[药]" withString:emojiList[102]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[地球]" withString:emojiList[85]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[滑雪]" withString:emojiList[88]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[禁止]" withString:emojiList[91]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[音乐]" withString:emojiList[94]];
    //--
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[电话]" withString:emojiList[97]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[一家人]" withString:emojiList[100]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[枪]" withString:emojiList[103]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[巧克力]" withString:emojiList[86]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[灯泡]" withString:emojiList[89]];
    
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[向日葵]" withString:emojiList[92]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[房子]" withString:emojiList[95]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[花洒]" withString:emojiList[98]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[天使]" withString:emojiList[101]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[狗]" withString:emojiList[105]];
    //--
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[外星人]" withString:emojiList[108]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[西瓜]" withString:emojiList[111]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[鬼]" withString:emojiList[114]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[树]" withString:emojiList[117]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[火焰]" withString:emojiList[120]];
    
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[钟表]" withString:emojiList[123]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[口红]" withString:emojiList[106]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[吻]" withString:emojiList[109]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[猪]" withString:emojiList[112]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[恶魔]" withString:emojiList[115]];
    //--
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[马]" withString:emojiList[118]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[星星]" withString:emojiList[121]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[闹钟]" withString:emojiList[124]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[牵手]" withString:emojiList[107]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[月亮]" withString:emojiList[110]];
    
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[心碎]" withString:emojiList[113]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[钻戒]" withString:emojiList[116]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[皇冠]" withString:emojiList[119]];
    formStr = [formStr stringByReplacingOccurrencesOfString:@"[足球]" withString:emojiList[122]];
    
    return formStr;
}
@end
