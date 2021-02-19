import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { FileDoneOutlined } from '@ant-design/icons';
import moment from 'moment';
import { SYSTITLE } from '../constant/EnumTypes';
// import bg from '../resources/login-bg.png';

import '../styles/TestResult.less';
window.pdfMake.fonts = {
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
    },
    方正黑体简体: { // 对中文的支持，public文件夹下的vfs_fonts是综合了英文字体和中文字体的
        normal: '方正黑体简体.TTF',
        bold: '方正黑体简体.TTF',
        italics: '方正黑体简体.TTF',
        bolditalics: '方正黑体简体.TTF'
    }
};

export default function TestResult() {
    const user = useSelector(state => state.user || {});
    const { testResult = {} } = user;
    const { scoresMap, fullPoint, finished, remain } = testResult;
    const totalScore = useMemo(() => {
        return scoresMap && Object.values(scoresMap).reduce((acc, score) => acc + (parseInt(score) ? parseInt(score) : 0), 0);
    },[scoresMap]);

    const correctAns = useMemo(() => {
        return scoresMap && Object.values(scoresMap).reduce((acc, score) => acc + (parseInt(score) ? 1 : 0), 0);
    },[scoresMap]);
    const onPrint = () => {
        let contentMarginLeft = 200;
        let scoreMargin = totalScore < 10 ? 28 : (totalScore < 100 ? 38 : 48);
        const docDefinition = {
            pageSize: 'A4',
            // pageMargins: [100, 250, 0, 0],
            content: [
                // {
			    //     image: bg,
		        // },
                {
                    text: [
                        `${SYSTITLE}在线考试\n`,
                        '成绩报告单'
                    ],
                    style: 'title'
                },
                {
                    stack:[
                        `${totalScore}分`,
                        {text: `/(${fullPoint}分)`, style: 'fullscore'}
                    ],
                    style: 'score'
                },
                {
                    text: [
                        `姓名：${user.username}\n\n`,
                        `日期：${moment().format('YYYY/MM/DD')}\n\n`,
                        `身份证号：${user.password}\n\n`
                    ],
                    style: 'name'
                },
                // {
                //     text: 
                //     style: 'date'
                // },
                // {
                //     text: 
                //     style: 'userIdentity'
                // }
            ],
            styles: {
                title: {
                    fontSize: 18,
                    bold: true,
                    font: '方正黑体简体',
                    // decoration: 'underline',
                    alignment: 'center',
                    margin: [0, 250, 0, 0] // left top-margin right bottom
                },
                score: {
                    fontSize: 18,
                    bold: true,
                    font: '方正黑体简体',
                    // decoration: 'underline',
                    margin: [contentMarginLeft + 30, 30, 0, 0]
                },
                fullscore: {
                    fontSize: 10,
                    font: '方正黑体简体',
                    margin: [scoreMargin, -14, 0, 0] 
                },
                name: {
                    fontSize: 10,
                    font: '方正黑体简体',
                    // alignment: 'center',
                    margin: [contentMarginLeft - 18, 30, 0, 5]
                },
                date: {
                    fontSize: 10,
                    font: '方正黑体简体',
                    // alignment: 'center',
                    margin: [contentMarginLeft - 18, 10, 0, 5]
                },
                userIdentity: {
                    fontSize: 10,
                    font: '方正黑体简体',
                    alignment: 'center',
                    margin: [0, 10, 0, 5]
                }
            }
        };
        const win = window.open('', '_blank');
        window.pdfMake.createPdf(docDefinition).print({}, win);
    }
    return (
        <div className='test-result-container'>
            <p>恭喜您完成本次答题</p>
            <div className='content'>
                <p>{`完成作答：${finished}道`}</p>
                <p>{`正确作答：${correctAns}道`}</p>
                <p>{`最终得分：${totalScore}分`}</p>
            </div>
            <div className='footer'>
                <Button className='print-btn' type='primary' onClick={onPrint}>
                    <FileDoneOutlined />打印成绩单
                </Button>
            </div>
        </div>
  );
}