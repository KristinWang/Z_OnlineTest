import { Base64 } from 'js-base64';
import { USER_LOGIN_URL } from '../constant/URL';
/* use 'dev-mock' command for local development, otherwise, use 'start' command to use
    data from backend while developing, use 'build' command for production */
if (__MOCK__) {
    require('./mockdata.js');
} else {
    require('whatwg-fetch');
}

function getBase64Authorization(loginParam) {
    if (loginParam !== undefined) {
        loginParam = JSON.parse(loginParam);
        let authorization = loginParam.username + ':' + loginParam.password;
        return Base64.encode(authorization);
    }
    let userToken = window.sessionStorage.getItem('userToken');
    if (!userToken || userToken === 'undefined') { // in IE, 'undefined' is returned!
        userToken = '000';
    }
    let authorizationToken = userToken + ':x';
    return Base64.encode(authorizationToken);
}

function get(url, params = {}) {
    const qs = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');
    if (qs) {
        url += '?' + qs;
    }
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + getBase64Authorization()
            },
            credentials: 'include'
        }).then((response) => {
            return response.json();
        }).then((jsonData) => {
            if (!jsonData.status) {
                resolve({status: 200, body: jsonData});
            } else {
                resolve(jsonData);
            }
        }).catch((error) => {
            reject(error);
        });
    });
};

function post(url, args) {
    const params = typeof args === 'string' ? JSON.stringify(JSON.parse(args)) : JSON.stringify(args);
    const loginParam = url.indexOf(USER_LOGIN_URL) > -1 ? params : undefined;
    const body = loginParam === undefined ? params : JSON.stringify({});
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + getBase64Authorization(loginParam)
            },
            body: body,
            credentials: 'include'
        }).then((response) => {
            return response.json();
        }).then((jsonData) => {
            if (!jsonData.status) {
                resolve({status: 200, body: jsonData});
            } else {
                resolve(jsonData);
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

function remove(url, params) {
    const qs = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');
    if (qs) {
        url += '?' + qs;
    }
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + getBase64Authorization()
            },
            credentials: 'include'
        }).then((response) => {
            return response.json();
        }).then((jsonData) => {
            if (!jsonData.status) {
                resolve({status: 200, body: jsonData});
            } else {
                resolve(jsonData);
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

export default {
    get: get,
    post: post,
    remove: remove
};
