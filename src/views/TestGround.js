import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { BackTop, Button, Modal } from 'antd';
import { prepareTest } from '../questionBank/testGenerator';
import TestSection from '../components/TestSection';
import CountDownAnchor from '../components/CountDownAnchor';
import { UPDATE_TEST_RESULT, UPDATE_USER_STATUS } from '../constant/ActionTypes';
import { updateUser } from '../actions/user';

import '../styles/TestGround.less';

const GET_TEST_CONTENT = 'GET_TEST_CONTENT';
const UPDATE_TEST_CONTENT = 'UPDATE_TEST_CONTENT';
const INITIAL_TEST_CONTENT = {
    singleChoiceQ:[],
    multiChoiceQ:[],
    tfQ:[],
    referenceAnswers:{},
    countDownTime:0
};
function testContentReducer(state, action) {
  switch (action.type) {
    case GET_TEST_CONTENT: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case UPDATE_TEST_CONTENT: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};

export default function TestGround() {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(state => state.user);
    const [testContent, dispatchTestContent] = useReducer(testContentReducer, INITIAL_TEST_CONTENT);
    const {singleChoiceQ, multiChoiceQ, tfQ, referenceAnswers, countDownTime, fullPoint} = testContent;
    const [trackModalVisible, setTrackModalVisible] = useState(false);
    const [countDownTimeout, setCountDownTimeout] = useState(false);
    const updateTestTrack = useCallback(() => {
        const total = Object.keys(referenceAnswers).length;
        const finished = Object.values(referenceAnswers).filter(an => an.userAnswers && an.userAnswers.length > 0).length;
        const remain = total - finished;
        return {
            finished,
            remain
        };
    },[referenceAnswers]);
    const [testTrack, setTestTrack] = useState(updateTestTrack());
   
    useEffect(() => {
        dispatchTestContent({
            type: GET_TEST_CONTENT,
            payload: prepareTest()
        });
    }, []);

    useEffect(() => {
        if (trackModalVisible) {
            setTestTrack(updateTestTrack());
        }
    },[trackModalVisible, updateTestTrack]);

    const handleChoiceChange = useCallback((qNo, value) => {
        const updateAnswers = {
            referenceAnswers: {
                ...referenceAnswers,
                [qNo]: {
                    ...referenceAnswers[qNo],
                    userAnswers: value || []
                }
            }
        };
        dispatchTestContent({
            type: UPDATE_TEST_CONTENT,
            payload: updateAnswers
        });
    },[dispatchTestContent, referenceAnswers]);

    const handleTimeout = useCallback(() => {
        setCountDownTimeout(true);
        setTrackModalVisible(true);
    },[setCountDownTimeout, setTrackModalVisible]);

    const handlePreSubmit = useCallback(() => {
        setTrackModalVisible(true);
    },[setTrackModalVisible]);

    const handleCancel = useCallback(() => {
        setTrackModalVisible(false);
    },[setTrackModalVisible]);

    const handleFinishTest = useCallback(() => {
        const scoresMap = {};
        const calc = ({answers, userAnswers, point}) => {
            let match = false;
            if(answers && userAnswers && answers.length === userAnswers.length) {
                let correctAnsStr = answers.join('').toUpperCase();
                match = !userAnswers.some(ans => correctAnsStr.indexOf(ans.toUpperCase()) < 0)
            }
            point = parseInt(point) ? parseInt(point) : 0;
            return match ? point : 0;
        }
        Object.keys(referenceAnswers).forEach(qNo => {
            scoresMap[qNo] = calc(referenceAnswers[qNo]);
        });
        dispatch(updateUser({
            ...user,
            testResult:{
                fullPoint,
                scoresMap,
                ...testTrack
            },
            finishTest: true
        }));
        history.replace('/testResult');
    },[referenceAnswers, user, updateUser, history, dispatch, testTrack]);
    
    return (
        <div className='test-ground-wrapper'>
            <CountDownAnchor countDownTime={countDownTime} onTimeout={handleTimeout} />
            <div className='test-container'>
                <div className='test-statistic'>
                    <label>{`总分: ${fullPoint}分`}</label>
                    <label>{`时间: ${countDownTime}分钟`}</label>
                </div>
                {
                    singleChoiceQ.length > 0 && <TestSection qType='singleChoice' questions={singleChoiceQ} onChange={handleChoiceChange} />
                }
                {
                    multiChoiceQ.length > 0 && <TestSection qType='multiChoice' questions={multiChoiceQ} onChange={handleChoiceChange} />
                }
                {
                    tfQ.length > 0 && <TestSection qType='tf' questions={tfQ} onChange={handleChoiceChange} />
                }
                <div className='footer'>
                    <Button className='submit-btn' type='primary' onClick={handlePreSubmit}>
                        结束答题
                    </Button>
                </div>
                <Modal
                    title={countDownTimeout ? '答题时间已用尽,您本次作答情况如下' : '您当前作答情况如下'}
                    centered
                    maskClosable={false}
                    closable={!countDownTimeout}
                    visible={trackModalVisible}
                    onOk={handleFinishTest}
                    onCancel={handleCancel}
                    footer={countDownTimeout ? [
                       <Button key='save' type='primary' onClick={handleFinishTest}>
                            确认提交
                        </Button> 
                        ]:[
                            <Button key='back' onClick={(handleCancel)}>
                                继续答题
                            </Button>,
                            <Button key='save' type='primary' onClick={handleFinishTest}>
                                确认提交
                            </Button>
                        ]
                    }
                    >
                    <p>已作答：{testTrack.finished} 道</p>
                    <p className={'remain-questions ' + (testTrack.remain > 0 && 'warning')}>未作答：{testTrack.remain} 道</p>
                </Modal>
                <BackTop></BackTop>
            </div>
        </div>
  );
}