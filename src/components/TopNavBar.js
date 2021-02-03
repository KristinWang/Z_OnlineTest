import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button } from 'antd';
import { GroupOutlined } from '@ant-design/icons';
import { userLogout } from '../actions/user';
import '../styles/TopNavBar.less';

export default function TopNavBar() {
    const user = useSelector(state => state.user);
    const history = useHistory();
    const onLogout = () => {
        userLogout();
        history.replace('/login');
    }
    return (
        <div className='nav-bar'>
            <div className='logo'>
                {/* <GroupOutlined style={{ fontSize: '20px', color: '#1eb1be' }}/> */}
                <img className='logo-icon' src={require('../resources/logo.png')}/>
                <label className='logo-text'>全国药品监督管理局在线答题系统</label>
            </div>
            <div className='right-btns'>
                <span>您好: {user.username}</span>
                <Button className='text-button' type='default' onClick={onLogout}>
                    退出
                </Button>
            </div>
        </div>
    );
}
