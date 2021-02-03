// import request from '../utils/request';
import { USER_LOGIN_URL } from '../constant/URL';
import Http from '../utils/Http';

import { GET_CURRENT_USER, USER_LOGOUT, UPDATE_USER } from '../constant/ActionTypes';

const cacheUserInfo = (user) => {
    user = user || {};
    window.sessionStorage.removeItem('userToken');
    window.sessionStorage.removeItem('userInfo');
    window.sessionStorage.setItem('userToken', user.token);
    // document.cookie = 'user=' + JSON.stringify(localUser);
    window.sessionStorage.setItem('userInfo', JSON.stringify(user));
    return {...user};
};
// on refresh page, get current user info from cookie to prevent privateRouter cannot show
export const getCurrentUser = (token) => {
    let user = {};
    if (!token) {
        // if user already login, check the validity
        let sessionToken = window.sessionStorage.getItem('userToken');
        if (sessionToken && sessionToken !== 'undefined') {
            token = sessionToken;
        }
    }

    if (token && token !== '') {
        const cachedUserInfoStr = window.sessionStorage.getItem('userInfo');
        user = JSON.parse(cachedUserInfoStr || '{}') || {};
        if (user.username) {
            user['token'] = token;
        }
        user = cacheUserInfo(user);
    }
    return {
        type: GET_CURRENT_USER,
        payload: user
    }
};

export const userLogin = async (username, password) => {
    const { body: {errorMsg = {}, user = {}}} = await Http.post(USER_LOGIN_URL, {
        username,
        password
    });
    let localUser = cacheUserInfo(user);
    return {
        user,
        errorMsg
    };
};

export const userLogout = () => {
    window.sessionStorage.clear();
    return {
        type: USER_LOGOUT
    };
};

export const updateUser = (user = {}) => {
    let localUser = cacheUserInfo(user);
    return {
        type: UPDATE_USER,
        payload: localUser
    };
};
