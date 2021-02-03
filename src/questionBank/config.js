/**
举例：
case 1: 
questionPickConfig = {
    'singlePickAmount': 0, //表示从该类型题库中选择0个题目
    'multiPickAmount': 5, //表示从该类型题库中选择5个题目, 如果 5 > 该类型题目总数，则选择全部
    'tfPickAmount': 5
};

case 2: 等同于 case 1 (某种类型的题目选择数量没有指定，则等同于选择0个)
questionPickConfig = { 
    'multiPickAmount': 5, 
    'tfPickAmount': 5
};

case 3: countDownTime 表示考试时间，以分钟为单位
countDownTime: 60 // 一个小时
countDownTime: 30// 半个小时
countDownTime: 90// 一个半小时
 */
const questionPickConfig = {
    'singlePickAmount': 100,
    'multiPickAmount': 5,
    'tfPickAmount': 5,
    'countDownTime': 5
};

export default questionPickConfig;
