import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import Login from './views/Login/Login';
import TopNavBar from './components/TopNavBar';
import TestGround from './views/TestGround';
import TestResult from './views/TestResult';
import { getCurrentUser, userLogout } from './actions/user';
import './styles/App.less';
export default function App() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [loading, setLoading] = useState(true);
    const { pathname } = useLocation();
    useEffect(() => {
        setLoading(true);
        function loadUser () {
            dispatch(getCurrentUser());
            setLoading(false);
        }
        function logoutUser () {
            dispatch(userLogout());
            setLoading(false);
        }
        if (pathname === '/' || pathname === '/login') {
            logoutUser();
        } else {
            loadUser();
        }
    },[pathname, userLogout, getCurrentUser]);

    const showNavBar = useMemo(() => {
        return pathname !== '/' && pathname !== '/login';
    }, [pathname]);

    const checkAuthorization = useCallback(() => {
        if (!loading && !user.username && pathname !== '/' && pathname !== '/login') {
            return <Redirect to={{ pathname: '/login' }}/>;
        }
        if (!loading && !!user.username && !!user.finishTest && pathname === '/test') {
            return <Redirect to={{ pathname: '/testResult' }}/>;
        }
    },[pathname, user, loading]);
    
    
    return (
        <div className='app'>
            {
                showNavBar
                    ? <TopNavBar/>
                    : null
            }
            <Switch>
                {
                    checkAuthorization()
                }
                <Route exact path='/' component={Login} />
                <Route path='/login' component={Login} />
                <Route path='/test' component={TestGround} />
                <Route path='/testResult' component={TestResult} />
            </Switch>
        </div>
    );
}
