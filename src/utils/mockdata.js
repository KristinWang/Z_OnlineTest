/* eslint-disable */

import fetchMock from 'fetch-mock';
import URL from '../constant/URL';
import { Base64 } from 'js-base64';

// 用户登录 url 劫持
export const userLogin = (_, opts) => {
    // const { username, password } = JSON.parse(opts.body);
    const authori = opts.headers.Authorization.split(' ')[1];
    const userNamePsdstr = Base64.decode(authori);
    const username = userNamePsdstr.split(':')[0];
    const password = userNamePsdstr.split(':')[1];
    let user = {};
    let errorMsg = {};
    if (username === 'undefined' || !username || username.trim() === '') {
        errorMsg['username'] = 'missing';
    }
    if (password === 'undefined' || !password || password.trim() === '') {
        errorMsg['password'] = 'missing';
    } else {
        const identityReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
        const identityValid = identityReg.test(password);
        errorMsg['password'] = !identityValid ? 'incorrect' : '';
    }

    if (!errorMsg.username && !errorMsg.password) {
        user = {
            username: username.trim(),
            password: password.trim(),
            token: authori
        };
    }
    return {
        status: 200,
        msg: '',
        body: {
            user,
            errorMsg
        }
    };
};
// const currentUser = (_, opts) => {
//     var user = {};
//     var body = opts.body;
//     if (body && Object.keys(JSON.parse(body)).length > 0) { // update user
//         user = {
//             token: '444444admin001',
//             username: 'admin4444'
//         };
//     } else {
//         const authori = opts.headers.Authorization.split(' ')[1];
//         const userTokenStr = Base64.decode(authori);
//         const userToken = userTokenStr.split(':')[0];
//         if (userToken === '1viewer001') {
//             user = {
//                 username: 'viewer'
//             };
//         } else if (userToken === '3admin001') {
//             user = {
//                 username: 'admin'
//             };
//         }
//     }
//     // fallback
//     return {status: 200, msg: '', body: user};
// };
fetchMock.post(URL.USER_LOGIN_URL, userLogin);

// //查询用户 劫持
// const RE_USER_CUR_URL = new RegExp(URL.USER_CUR_URL + '.*');
// fetchMock.post(RE_USER_CUR_URL, currentUser);

// // 更新用户 劫持
// const RE_USER_UPDATE_URL = new RegExp(URL.USER_UPDATE_URL + '.*');
// fetchMock.post(RE_USER_UPDATE_URL, URL => {
//     return {status: 200, body: {
//             token: '444444admin001',
//             username: 'admin'
//     }};
// });

// // 用户注销 url 劫持
// fetchMock.get(URL.USER_LOGOUT_URL, url => {
//     return {status: 200, msg: '', body: {}};
// });
