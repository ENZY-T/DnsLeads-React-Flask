import React from 'react';
import { ThemeColors } from '../Styling/Colors';

function NotFound() {
    return (
        <div className="container" style={{ height: '46.5vh', display: 'flex', alignItems: 'center' }}>
            <h1 style={{ textAlign: 'center', width: '100%', color: ThemeColors.red, fontWeight: '1000', fontSize: '60px' }}>
                {' '}
                404 Page Not found
            </h1>
        </div>
    );
}

export default NotFound;
