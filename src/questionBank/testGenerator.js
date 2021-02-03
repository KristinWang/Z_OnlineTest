import questionPickConfig from './config';
import Questions from './questions';

let referenceAnswers = {};
let fullPoint = 0;
const generateRandomPick = (total, pickAmount) => {
    if(!pickAmount || !total) return [];
    pickAmount = parseInt(pickAmount) ? parseInt(pickAmount) : 0;
    pickAmount = pickAmount > total ? total : pickAmount;
    const pickedIndex = [];
    const uniqueRandom = () => {
        let random = Math.floor(Math.random() * total);
        if (pickedIndex.indexOf(random) < 0) {
            pickedIndex.push(random);
        } else {
            uniqueRandom();
        }
    }
    
    for(let i = 0; i < pickAmount; i++) {
        uniqueRandom();
    }
    return pickedIndex.sort((a,b) => a - b);
}
const pickQuestions = (questionBank, pickAmount, type) => {
    const questionsPicked = [];
    const pickedIndex = generateRandomPick(questionBank.length, pickAmount);
    pickedIndex.length > 0 && pickedIndex.forEach((pickIdx,idx) => {
        let question = questionBank[pickIdx];
        let qNo = `${type}-${idx + 1}`;
        questionsPicked.push({
            ...question,
            qNo
        });
        referenceAnswers[qNo] = {
            answers: question.answers,
            userAnswers: [],
            point: question.point
        };
        fullPoint += parseInt(question.point) ? parseInt(question.point) : 0;
    });
    return questionsPicked;
}
const prepareTest = () => {
    const { 
        singleChoice = [],
        multiChoice = [],
        tf = []
    } = Questions;
    const {
        singlePickAmount,
        multiPickAmount,
        tfPickAmount,
        countDownTime = 60 * 60,
    } = questionPickConfig;
    referenceAnswers = {};
    fullPoint = 0;
    const singleChoiceQ = pickQuestions(singleChoice, singlePickAmount, 'singleChoice');
    const multiChoiceQ = pickQuestions(multiChoice, multiPickAmount, 'multiChoice');
    const tfQ = pickQuestions(tf, tfPickAmount, 'tf');
    return {
        singleChoiceQ,
        multiChoiceQ,
        tfQ,
        referenceAnswers,
        countDownTime,
        fullPoint
    }
}

export {
    prepareTest
};