import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import { FileDoneOutlined } from '@ant-design/icons';
import moment from 'moment';

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

        // const rowData = [];
        // Object.entries(testResult).forEach((item, index) => {
        //     rowData[index] = [];
        //     tableExportHeaderKeys.forEach(keyConfig => {
        //         rowData[index].push({
        //             text: item[keyConfig.key],
        //             style: keyConfig.style
        //         });
        //     });
        // });
        // const body = [
        //     tableExportHeader,
        //     ...rowData
        // ];
        let contentMarginLeft = 200;
        let scoreMargin = totalScore < 10 ? 58 : (totalScore < 100 ? 68 : 78);
        const docDefinition = {
            pageSize: 'A4',
            content: [
                {text: '在线考试成绩单', style: 'title'},
                {text: `${totalScore}分`, style: 'score'},
                {text: `/(${fullPoint}分)`, style: 'fullscore'},
                {text: `姓名：${user.username}`, style: 'name'},
                {text: `日期：${moment().format('YYYY/MM/DD')}`, style: 'date'},
                {text: `身份证号：${user.password}`, style: 'userIdentity'},
                // {
                //     style: 'tableBody',
                //     table: {
                //         headerRows: 1,
                //         heights: [50],
                //         body: body
                //     }
                // }
            ],
            styles: {
                title: {
                    fontSize: 18,
                    bold: true,
                    font: '方正黑体简体',
                    decoration: 'underline',
                    margin: [contentMarginLeft, 250, 0, 0] // left top-margin right bottom
                },
                score: {
                    fontSize: 18,
                    bold: true,
                    font: '方正黑体简体',
                    margin: [contentMarginLeft + 30, 20, 0, 0]
                },
                fullscore: {
                    fontSize: 10,
                    font: '方正黑体简体',
                    margin: [contentMarginLeft + scoreMargin, -14, 0, 0] 
                },
                name: {
                    fontSize: 10,
                    font: '方正黑体简体',
                    margin: [contentMarginLeft, 20, 0, 5]
                },
                date: {
                    fontSize: 10,
                    font: '方正黑体简体',
                    margin: [contentMarginLeft, 10, 0, 5]
                },
                userIdentity: {
                    fontSize: 10,
                    font: '方正黑体简体',
                    margin: [contentMarginLeft, 10, 0, 5]
                }
                // tableBody: {
                //     margin: [0, 5, 0, 15]
                // },
                // tableHeader: {
                //     font: 'Roboto',
                //     bold: true,
                //     fontSize: 13,
                //     color: 'black'
                // },
                // enStyle: {
                //     font: 'Roboto'
                // },
                // zhStyle: {
                //     font: '方正黑体简体'
                // }
            }
        };
        const win = window.open('', '_blank');
        window.pdfMake.createPdf(docDefinition).print({}, win);
    }
    return (
        <div className='test-result-container'>
            <div className='content'>
                <div className='result'>
                    <p>恭喜您完成本次答题</p>
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
        </div>
  );
}