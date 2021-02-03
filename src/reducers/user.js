import { GET_CURRENT_USER, USER_LOGIN, USER_LOGOUT, UPDATE_USER } from '../constant/ActionTypes';
const initUser = {
    username: undefined,
    password: undefined,
    finishTest: false,
    testResult: {
        fullPoint: 0,
        finished: 0,
        remain: 0,
        scoresMap: {}
    }
}
export default (state = initUser, action) => {
    switch (action.type) {
        case GET_CURRENT_USER:
        case USER_LOGIN:
        case UPDATE_USER:
            return {
                ...state,
                ...action.payload
            }
        case USER_LOGOUT:
            return {
                ...initUser
            };
        default:
            return state;
    }
};
