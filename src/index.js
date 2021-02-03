import React from 'react';
import ReactDOM from 'react-dom';

// styles
/* eslint-disable import/no-webpack-loader-syntax */
// import '!style-loader!css-loader!antd/dist/antd.css';
import 'antd/dist/antd.less';

// store
import { Provider } from 'react-redux';
import appReducer from './reducers';
import { createStore } from 'redux';

// router
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// app
import App from './App';

// i18n
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
// store
window.store = createStore(
    appReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
window.browserHistory = createBrowserHistory();

// Home UI
ReactDOM.render((
    <Provider store={window.store}>
        <Router history={window.browserHistory}>
            <Route path="/" component={App} />
        </Router>
    </Provider>
), document.getElementById('root'));
