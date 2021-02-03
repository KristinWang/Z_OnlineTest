import React, { useMemo } from 'react';
import { Radio, Checkbox, Avatar } from 'antd';
import { testSectionMap } from '../constant/enumTypes';
import '../styles/TestSection.less';

export default function TestSection ({qType, questions=[], onChange}) {
    const fullPoint = useMemo(() => {
        return questions.reduce((total, q) => total + (parseInt(q.point) ? parseInt(q.point) : 0), 0);
    },[questions]);

    const onSingleChoiceChange = (qNo, e) => {
        typeof onChange === 'function' && onChange(qNo, [e.target.value]);
    }
    const onMultiChoiceChange = (qNo, checkedValues) => {
        typeof onChange === 'function' && onChange(qNo, checkedValues);
    }    

    return (
        <div id={`${qType}-section`} className='test-section'>
            <div className='section-header'>
                <div>{testSectionMap[qType]}</div>
                <div className='section-statistic'>{`(共${questions.length}题, 合计${fullPoint}分)`}</div>
            </div>
                 {
                     questions.map((q,idx) => {
                        return (
                            <div key={q.qNo} className='question-card'>
                                <div className='question-header'>
                                    <Avatar size='small'>{`${idx + 1}`}</Avatar>
                                    <div className='question-title'> {`.(${parseInt(q.point) ? parseInt(q.point) : 0}分) ${q.title}`} </div>
                                </div>
                                <div className='question-options'>
                                    {
                                        qType === 'multiChoice' ?
                                            <Checkbox.Group onChange={(checkedValues) => onMultiChoiceChange(q.qNo, checkedValues)}>
                                                {
                                                    Object.entries(q.options).map(([oKey,oValue]) => {
                                                        return (
                                                            <div key={`option-${oKey}-check`} className='option-item'>
                                                                <Checkbox value={oKey}>{`${String(oKey).toUpperCase()}.`}</Checkbox>
                                                                <div className='option-value'>{oValue}</div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </Checkbox.Group>
                                            :
                                            <Radio.Group onChange={(e) => onSingleChoiceChange(q.qNo, e)}>
                                                {
                                                    Object.entries(q.options).map(([oKey,oValue]) => {
                                                        return (
                                                            <div key={`option-${oKey}-radio`} className='option-item'>
                                                                <Radio key={oKey} value={oKey}>{`${String(oKey).toUpperCase()}.`}</Radio>
                                                                <div className='option-value'>{oValue}</div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </Radio.Group>
                                    }
                                </div>
                            </div>
                        );
                     })
                 }
        </div>
    );
}