import React from 'react';
import AdminNavBar from './AdminNavBar';

export function adminWrap(WrappedComponent) {
    return function (props) {
        return (
            <div className="container pb-5 pt-2">
                <AdminNavBar />
                <WrappedComponent {...props} />
            </div>
        );
    };
}
