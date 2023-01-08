import React from 'react';
// import AdminNavBar from './AdminNavBar';

export function adminWrap(WrappedComponent) {
    return function (props) {
        return (
            <div className="container py-5">
                {/* <AdminNavBar /> */}
                <WrappedComponent {...props} />
            </div>
        );
    };
}
