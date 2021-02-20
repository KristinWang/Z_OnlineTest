import React from 'react';
import { Button, Modal } from 'antd';

export default function TestTrackModal({testTrack, timeout, visible, onOk, onCancel}) {

    return (
        <Modal
            title={timeout ? '答题时间已用尽,您本次作答情况如下' : '您当前作答情况如下'}
            centered
            maskClosable={false}
            closable={!timeout}
            visible={visible}
            onOk={onOk}
            onCancel={onCancel}
            footer={timeout ? [
                <Button key='save' type='primary' onClick={onOk}>
                    确认提交
                </Button> 
                ]:[
                    <Button key='back' onClick={(onCancel)}>
                        继续答题
                    </Button>,
                    <Button key='save' type='primary' onClick={onOk}>
                        确认提交
                    </Button>
                ]
            }
            >
            <p>已作答：{testTrack.finished} 道</p>
            <p className={'remain-questions ' + (testTrack.remain > 0 && 'warning')}>未作答：{testTrack.remain} 道</p>
        </Modal>
    );
}