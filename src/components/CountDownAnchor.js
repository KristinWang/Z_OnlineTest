import React, { useState, useEffect } from 'react';

import { Anchor } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import '../styles/CountDownAnchor.less';

// countDownTime 单位是分钟
export default function CountDownAnchor({ countDownTime, onTimeout }) {
    const [countDown, setCountDown] = useState({minutes: 0, seconds: 0});
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

    return (
        <Anchor className='count-down-indicator'>   
            <p><ClockCircleOutlined />剩余答题时间</p>
            <p className='count-down-time'>{`${countDown.minutes}分${countDown.seconds}秒`}</p>
        </Anchor>
    );
}