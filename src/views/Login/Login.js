import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { USER_LOGIN } from '../../constant/ActionTypes';
import { SYSTITLE } from '../../constant/EnumTypes';
import LoginForm from './LoginForm';
import '../../styles/Login.less';

export default function Login() {
    const dispacth = useDispatch();
    const history = useHistory();
    const handleLogin = useCallback((user) => {
        dispacth({
            type: USER_LOGIN,
            payload: user
        });
        history.replace('/test');
    },[history, dispacth]);
  
    return (
        <div className='login'>
            <div className='top-bg'/>
            <div className='login-container'>
                <div className='login-header'>
                    <div>{`${SYSTITLE}在线考试系统`}</div>
                    <div>(试行版)</div>
                </div>
                    <LoginForm handleLogin={handleLogin}/>
            </div>
        </div>
    );
}
