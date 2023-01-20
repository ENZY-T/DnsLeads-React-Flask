import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../Context/AppContext';

export function adminOnlyWrap(WrappedComponent) {
    return function (props) {
        const { authState } = useContext(AppContext);
        const history = useHistory();
        if (authState.loggedUser.role) {
            if (authState.loggedUser.role !== 'admin') {
                history.push('/dashboard');
            }
        }
        return <WrappedComponent {...props} />;
    };
}

export function userOnlyWrap(WrappedComponent) {
    return function (props) {
        const { authState } = useContext(AppContext);
        const history = useHistory();
        if (authState.loggedUser.role) {
            if (authState.loggedUser.role !== 'user') {
                history.push('/admin');
            }
        }
        return <WrappedComponent {...props} />;
    };
}
