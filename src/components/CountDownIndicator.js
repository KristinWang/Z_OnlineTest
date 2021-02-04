import React, { useState, useEffect, useCallback } from 'react';

import { Anchor  } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import '../styles/CountDownIndicator.less';

// countDownTime 单位是分钟
export default function CountDownIndicator({ countDownTime, onTimeout }) {
    const [countDown, setCountDown] = useState({minutes: 0, seconds: 0});
    const [fold, setFold] = useState(false);
    const [autoExpandFlag, setAutoExpandFlag] = useState(false);

    useEffect(() => {
        let maxTime = countDownTime * 60; // 以秒为计算颗粒
        let timeCountDownInterval = setInterval(() => {
            --maxTime;
            if (maxTime >= 0) {
                let minutes = Math.floor(maxTime / 60);
                let seconds = Math.floor(maxTime % 60);
                setCountDown({
                    minutes,
                    seconds
                });
            } else {
                clearInterval(timeCountDownInterval);
                onTimeout && onTimeout();
            }
        },1000);
        return (() => {
            clearInterval(timeCountDownInterval);
        });
    }, [countDownTime, onTimeout]);
    useEffect(() => {
        if (!autoExpandFlag && countDown.minutes <= 3) {
            setAutoExpandFlag(true);
            if (fold) {
                setFold(false);
            }
        }
    }, [countDown, autoExpandFlag, fold]);

    const handleClick = useCallback(() => {
        setFold(!fold);
    },[countDown, autoExpandFlag, fold]);

    return (
        <div className={'count-down-indicator ' + (fold ? 'fold' : '')} 
            title={fold ? '点击查看答题剩余时间' : '点击收起面板,注意关注剩余时间'} 
            onClick={handleClick}>
            <Anchor>   
                <p className='count-down-title'><ClockCircleOutlined />{!fold && <span>剩余答题时间</span>}</p>
                {
                    !fold && <p className='count-down-time'>{`${countDown.minutes}分${countDown.seconds}秒`}</p>
                }
            </Anchor >
        </div>
    );
}